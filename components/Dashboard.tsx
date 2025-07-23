'use client';

import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useUser } from '@/hooks/use-user';
import { useTransactions } from '@/hooks/use-transactions';
import { useCategories } from '@/hooks/use-categories';

interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  categoryCount: number;
}

export default function Dashboard() {
  const { user } = useUser();

  // Fetch recent transactions
  const { data: transactionsData, loading } = useTransactions(user?.id, {
    page: 1,
    limit: 5,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Fetch categories count
  const { data: categoriesData } = useCategories(user?.id, {
    page: 1,
    limit: 1,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // Calculate statistics
  const stats: DashboardStats = useMemo(() => {
    if (!transactionsData?.transactions) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        transactionCount: 0,
        categoryCount: 0,
      };
    }

    // For current month stats, we'd need to fetch with date filters
    // This is simplified for demo - in real app, pass date filters to hook
    const income = transactionsData.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expenses = transactionsData.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      transactionCount: transactionsData.total,
      categoryCount: categoriesData?.total || 0,
    };
  }, [transactionsData, categoriesData]);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  };

  if (!user) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Please log in to view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&apos;s your financial overview.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Income
            </CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(stats.totalIncome)}
            </div>
            <p className="text-xs opacity-90 flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3 h-3" />
              Recent transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Expenses
            </CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingDown className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(stats.totalExpenses)}
            </div>
            <p className="text-xs opacity-90 flex items-center gap-1 mt-2">
              <ArrowDownRight className="w-3 h-3" />
              Recent transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Balance
            </CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <Wallet className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(stats.balance)}
            </div>
            <p className="text-xs opacity-90 mt-2">Available funds</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-green-500">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">Net Income</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {formatCurrency(stats.balance)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Income - Expenses</p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-red-500">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">Avg Transaction</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {formatCurrency(
                stats.transactionCount > 0
                  ? stats.totalExpenses / stats.transactionCount
                  : 0,
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">Average expense</p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">Transactions</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats.transactionCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total recorded</p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">Categories</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {stats.categoryCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">Active categories</p>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Recent Transactions
            </span>
            <a
              href="/transaction"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              View all →
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Loading transactions...</div>
            </div>
          ) : !transactionsData?.transactions?.length ? (
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">No transactions yet</p>
                <p className="text-sm text-gray-500">
                  Start by adding your first transaction
                </p>
                <Button variant="ghost" size="sm" className="mt-3">
                  Add Transaction
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {transactionsData.transactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === 'income'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.category?.name || 'No category'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(parseFloat(transaction.amount))}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
