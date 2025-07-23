import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { TransactionService } from '@/src/services/transactionService';

/**
 * GET /api/transactions/analytics
 * Get transaction analytics for the authenticated user
 */
export async function GET(): Promise<NextResponse> {
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

    // Parse query parameters
    // const url = new URL(req.url);
    // const period = url.searchParams.get('period') || 'month';
    // const startDate = url.searchParams.get('startDate');
    // const endDate = url.searchParams.get('endDate');

    // Get transaction analytics
    const analytics = await TransactionService.getTransactionStats(user.id);

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('GET /api/transactions/analytics error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch transaction analytics',
      },
      { status: 500 },
    );
  }
}
