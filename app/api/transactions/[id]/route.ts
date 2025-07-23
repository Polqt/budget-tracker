import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { transactionService } from '@/src/services';
import { TransactionSchema } from '@/src/types/database';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
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

    const { id } = params;

    // Fetch transaction
    const transaction = await transactionService.getTransactionById(
      user.id,
      id,
    );

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: 'Transaction not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('GET /api/transactions/[id] error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch transaction',
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/transactions/[id]
 * Update a specific transaction by ID for the authenticated user
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
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

    const { id } = params;

    // Parse and validate request body
    const body = await req.json();
    const validatedData = TransactionSchema.partial().parse(body);

    // Update transaction
    const transaction = await transactionService.updateTransaction(
      user.id,
      id,
      {
        ...validatedData,
        amount: validatedData.amount?.toString() || undefined,
      },
    );

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: 'Transaction not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: transaction,
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    console.error('PUT /api/transactions/[id] error:', error);

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
        message: 'Failed to update transaction',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
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

    const { id } = params;

    // Delete transaction
    const success = await transactionService.deleteTransaction(user.id, id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: 'Transaction not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/transactions/[id] error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete transaction',
      },
      { status: 500 },
    );
  }
}
