import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { categoryService } from '@/src/services';

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

    // Parse query parameters for time range
    // const url = new URL(req.url);
    // const startDate = url.searchParams.get('startDate');
    // const endDate = url.searchParams.get('endDate');

    // Get category statistics
    const stats = await categoryService.getStats(user.id);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('GET /api/categories/stats error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch category statistics',
      },
      { status: 500 },
    );
  }
}
