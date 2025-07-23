/**
 * Simple category hooks
 */
'use client';

import { useFetch, useAction } from './use-api';
import type {
  CategoryWithStats,
  CategoryQuerySchema,
} from '@/src/types/database';

export function useCategories(
  userId: string | undefined,
  query: typeof CategoryQuerySchema._type,
) {
  const url = userId
    ? `/api/categories?${new URLSearchParams({
        page: query.page.toString(),
        limit: query.limit.toString(),
        ...(query.search && { search: query.search }),
        ...(query.type && { type: query.type }),
        ...(query.status && { status: query.status }),
        ...(query.sortBy && { sortBy: query.sortBy }),
        ...(query.sortOrder && { sortOrder: query.sortOrder }),
      })}`
    : '';

  return useFetch<{ categories: CategoryWithStats[]; total: number }>(url);
}

export function useCategory(
  userId: string | undefined,
  categoryId: string | undefined,
) {
  const url = userId && categoryId ? `/api/categories/${categoryId}` : '';
  return useFetch<CategoryWithStats>(url);
}

export function useCategoryActions() {
  const { execute, loading, error } = useAction();

  const createCategory = async (data: {
    name: string;
    type: 'income' | 'expense';
    icon?: string;
    color?: string;
    description?: string;
  }) => {
    return execute(async () => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
      }

      return response.json();
    });
  };

  const updateCategory = async (
    categoryId: string,
    data: Partial<{
      name: string;
      type: 'income' | 'expense';
      icon?: string;
      color?: string;
      description?: string;
      status?: 'active' | 'inactive' | 'archived';
    }>,
  ) => {
    return execute(async () => {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update category');
      }

      return response.json();
    });
  };

  const deleteCategory = async (categoryId: string) => {
    return execute(async () => {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete category');
      }

      return response.json();
    });
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
    error,
  };
}
