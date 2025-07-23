import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { transactionService } from '@/src/services';
import {
  TransactionSchema,
  TransactionQuerySchema,
} from '@/src/types/database';

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
    const query = TransactionQuerySchema.parse(queryParams);

    // Fetch transactions
    const { transactions, total } = await transactionService.getTransactions(
      user.id,
      query,
    );

    const totalPages = Math.ceil(total / query.limit);

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('GET /api/transactions error:', error);

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
        message: 'Failed to fetch transactions',
      },
      { status: 500 },
    );
  }
}

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
    const validatedData = TransactionSchema.parse(body);

    // Create transaction with proper type conversion
    const transaction = await transactionService.createTransaction(user.id, {
      ...validatedData,
      amount: validatedData.amount.toString(),
    });

    return NextResponse.json(
      {
        success: true,
        data: transaction,
        message: 'Transaction created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/transactions error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Category not found')) {
        return NextResponse.json(
          { success: false, error: 'Not found', message: error.message },
          { status: 404 },
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
        message: 'Failed to create transaction',
      },
      { status: 500 },
    );
  }
}
