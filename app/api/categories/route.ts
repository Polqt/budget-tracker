import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { CategoryService } from '@/src/services/categoryService';
import { CategorySchema, CategoryQuerySchema } from '@/src/types/database';

/**
 * GET /api/categories
 * Fetch all categories for the authenticated user with filtering and pagination
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate user
    const supabase = await createClient();
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

    // Parse and validate query parameters
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const query = CategoryQuerySchema.parse(queryParams);

    // Fetch categories
    const { categories, total } = await CategoryService.getCategories(
      user.id,
      query,
    );

    const totalPages = Math.ceil(total / query.limit);

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('GET /api/categories error:', error);

    if (error instanceof Error && error.message.includes('Validation')) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', message: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch categories',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/categories
 * Create a new category for the authenticated user
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate user
    const supabase = await createClient();
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

    // Parse and validate request body
    const body = await req.json();
    const validatedData = CategorySchema.parse(body);

    // Create category
    const category = await CategoryService.createCategory(user.id, {
      ...validatedData,
      budget: validatedData.budget?.toString() || null,
    });

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: 'Category created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/categories error:', error);

    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { success: false, error: 'Conflict', message: error.message },
          { status: 409 },
        );
      }

      if (error.message.includes('Validation') || error.name === 'ZodError') {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            message: error.message,
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to create category',
      },
      { status: 500 },
    );
  }
}
