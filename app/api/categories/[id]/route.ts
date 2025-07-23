import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { CategoryService } from '@/src/services/categoryService';
import { CategorySchema } from '@/src/types/database';

/**
 * GET /api/categories/[id]
 * Fetch a specific category by ID for the authenticated user
 */
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

    // Fetch category
    const category = await CategoryService.getCategoryById(user.id, id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Not found', message: 'Category not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('GET /api/categories/[id] error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch category',
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/categories/[id]
 * Update a specific category by ID for the authenticated user
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
    const validatedData = CategorySchema.partial().parse(body);

    // Update category
    const category = await CategoryService.updateCategory(user.id, id, {
      ...validatedData,
      budget: validatedData.budget?.toString() || undefined,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Not found', message: 'Category not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('PUT /api/categories/[id] error:', error);

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
        message: 'Failed to update category',
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Delete a specific category by ID for the authenticated user
 */
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

    // Delete category
    const success = await CategoryService.deleteCategory(user.id, id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Not found', message: 'Category not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/categories/[id] error:', error);

    if (
      error instanceof Error &&
      error.message.includes('has associated transactions')
    ) {
      return NextResponse.json(
        { success: false, error: 'Conflict', message: error.message },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete category',
      },
      { status: 500 },
    );
  }
}
