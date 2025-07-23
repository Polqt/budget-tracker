import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';
import type { User } from '@supabase/supabase-js';

export interface AuthenticatedRequest extends NextRequest {
  user: User;
}

/**
 * Authentication middleware for API routes
 * Verifies the user's JWT token and adds user info to the request
 */
export async function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Create Supabase client
      const supabase = await createClient();

      // Get the user from the session
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unauthorized',
            message: 'Please log in to access this resource',
          },
          { status: 401 },
        );
      }

      // Add user to request object
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = user;

      // Call the handler with authenticated request
      return await handler(authenticatedReq);
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication failed',
          message: 'An error occurred during authentication',
        },
        { status: 500 },
      );
    }
  };
}

import { z } from 'zod';

/**
 * Input validation middleware
 * Sanitizes and validates request data using Zod schemas
 */
export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (
    req: AuthenticatedRequest,
    validatedData: T,
  ) => Promise<NextResponse>,
) {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    try {
      let data: unknown;

      // Parse request body based on method
      if (req.method === 'GET' || req.method === 'DELETE') {
        // For GET/DELETE requests, validate query parameters
        const url = new URL(req.url);
        data = Object.fromEntries(url.searchParams.entries());
      } else {
        // For POST/PUT/PATCH requests, validate request body
        const body = await req.json();
        data = body;
      }

      // Validate and sanitize data
      const validatedData = schema.parse(data);

      // Call the handler with validated data
      return await handler(req, validatedData);
    } catch (error: unknown) {
      console.error('Validation error:', error);

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            message: 'Invalid input data',
            details: error.errors,
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Bad request',
          message: 'Invalid request format',
        },
        { status: 400 },
      );
    }
  };
}

/**
 * Error handling middleware
 * Provides consistent error responses and logging
 */
export function withErrorHandling(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error: unknown) {
      console.error('API Error:', {
        method: req.method,
        url: req.url,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        userId: req.user?.id,
      });

      // Don't expose internal errors in production
      const isDevelopment = process.env.NODE_ENV === 'development';

      return NextResponse.json(
        {
          success: false,
          error: 'Internal server error',
          message:
            isDevelopment && error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
          ...(isDevelopment &&
            error instanceof Error && { stack: error.stack }),
        },
        { status: 500 },
      );
    }
  };
}

/**
 * Rate limiting middleware (basic implementation)
 * Prevents abuse by limiting requests per user
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return async (req: AuthenticatedRequest): Promise<NextResponse> => {
      const userId = req.user.id;
      const now = Date.now();

      // Get or create request count for user
      const userRequests = requestCounts.get(userId) || {
        count: 0,
        resetTime: now + windowMs,
      };

      // Reset counter if window has expired
      if (now > userRequests.resetTime) {
        userRequests.count = 0;
        userRequests.resetTime = now + windowMs;
      }

      // Check if limit exceeded
      if (userRequests.count >= maxRequests) {
        return NextResponse.json(
          {
            success: false,
            error: 'Rate limit exceeded',
            message: `Too many requests. Try again in ${Math.ceil(
              (userRequests.resetTime - now) / 1000,
            )} seconds.`,
          },
          { status: 429 },
        );
      }

      // Increment counter
      userRequests.count++;
      requestCounts.set(userId, userRequests);

      return await handler(req);
    };
  };
}

/**
 * CORS middleware for API routes
 */
export function withCORS(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    const response = await handler(req);

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );

    return response;
  };
}

/**
 * Compose multiple middleware functions
 */
export function compose<T>(...middlewares: Array<(handler: T) => T>) {
  return (handler: T): T => {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      handler,
    );
  };
}

/**
 * Input sanitization utilities
 */
export const sanitizeInput = {
  /**
   * Remove potentially dangerous characters from strings
   */
  string: (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/[<>]/g, '') // Remove < and > characters
      .trim();
  },

  /**
   * Validate and sanitize email addresses
   */
  email: (input: string): string => {
    const sanitized = input.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitized)) {
      throw new Error('Invalid email format');
    }

    return sanitized;
  },

  /**
   * Sanitize numeric inputs
   */
  number: (input: unknown): number => {
    const num = parseFloat(String(input));

    if (isNaN(num) || !isFinite(num)) {
      throw new Error('Invalid number format');
    }

    return num;
  },
};
