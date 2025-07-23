/**
 * Simple transaction hooks
 */
'use client';

import { useFetch, useAction } from './use-api';
import type {
  TransactionWithCategory,
  TransactionQuerySchema,
} from '@/src/types/database';

export function useTransactions(
  userId: string | undefined,
  query: typeof TransactionQuerySchema._type,
) {
  const url = userId
    ? `/api/transactions?${new URLSearchParams({
        page: query.page.toString(),
        limit: query.limit.toString(),
        ...(query.search && { search: query.search }),
        ...(query.type && { type: query.type }),
        ...(query.status && { status: query.status }),
        ...(query.categoryId && { categoryId: query.categoryId }),
        ...(query.startDate && { startDate: query.startDate }),
        ...(query.endDate && { endDate: query.endDate }),
        ...(query.sortBy && { sortBy: query.sortBy }),
        ...(query.sortOrder && { sortOrder: query.sortOrder }),
      })}`
    : '';

  return useFetch<{ transactions: TransactionWithCategory[]; total: number }>(
    url,
  );
}

export function useTransaction(
  userId: string | undefined,
  transactionId: string | undefined,
) {
  const url =
    userId && transactionId ? `/api/transactions/${transactionId}` : '';
  return useFetch<TransactionWithCategory>(url);
}

export function useTransactionActions() {
  const { execute, loading, error } = useAction();

  const createTransaction = async (data: {
    title: string;
    amount: string;
    type: 'income' | 'expense';
    categoryId: string;
    date: string;
    description?: string;
    location?: string;
    paymentMethod?: string;
  }) => {
    return execute(async () => {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create transaction');
      }

      return response.json();
    });
  };

  const updateTransaction = async (
    transactionId: string,
    data: Partial<{
      title: string;
      amount: string;
      type: 'income' | 'expense';
      categoryId: string;
      date: string;
      description?: string;
      location?: string;
      paymentMethod?: string;
      status?: 'pending' | 'completed' | 'cancelled';
    }>,
  ) => {
    return execute(async () => {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update transaction');
      }

      return response.json();
    });
  };

  const deleteTransaction = async (transactionId: string) => {
    return execute(async () => {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete transaction');
      }

      return response.json();
    });
  };

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loading,
    error,
  };
}
