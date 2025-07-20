'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Calendar,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Chart from '@/components/Chart';

// Type definitions for better maintainability
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  tags?: string[];
}

interface DashboardMetrics {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyGrowth: number;
  categoriesCount: number;
  transactionCount: number;
  budgetUtilization: number;
  savingsRate: number;
}

interface CategoryBreakdown {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

// Validation schemas for security
const MetricsSchema = z.object({
  totalIncome: z.number().min(0),
  totalExpenses: z.number().min(0),
  balance: z.number(),
  monthlyGrowth: z.number(),
  categoriesCount: z.number().min(0),
  transactionCount: z.number().min(0),
  budgetUtilization: z.number().min(0).max(200),
  savingsRate: z.number().min(0).max(100),
});

const TransactionSchema = z.object({
  id: z.string(),
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  category: z.string().min(1),
  description: z.string().min(1),
  date: z.string(),
  status: z.enum(['completed', 'pending', 'failed']),
  tags: z.array(z.string()).optional(),
});

// Mock data - replace with real API calls
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    amount: 45.99,
    category: 'Food & Dining',
    description: 'Lunch at Mediterranean Bistro',
    date: '2024-01-20T12:30:00Z',
    status: 'completed',
    tags: ['restaurant', 'lunch'],
  },
  {
    id: '2',
    type: 'income',
    amount: 3500.0,
    category: 'Salary',
    description: 'Monthly salary deposit',
    date: '2024-01-15T09:00:00Z',
    status: 'completed',
    tags: ['salary', 'primary'],
  },
  {
    id: '3',
    type: 'expense',
    amount: 89.5,
    category: 'Transportation',
    description: 'Gas station fill-up',
    date: '2024-01-19T18:45:00Z',
    status: 'completed',
    tags: ['gas', 'vehicle'],
  },
  {
    id: '4',
    type: 'expense',
    amount: 15.99,
    category: 'Entertainment',
    description: 'Netflix subscription',
    date: '2024-01-18T00:00:00Z',
    status: 'pending',
    tags: ['subscription', 'streaming'],
  },
  {
    id: '5',
    type: 'income',
    amount: 800.0,
    category: 'Freelance',
    description: 'Web development project',
    date: '2024-01-17T14:20:00Z',
    status: 'completed',
    tags: ['freelance', 'web-dev'],
  },
];

const mockMetrics: DashboardMetrics = {
  totalIncome: 7400.0,
  totalExpenses: 2890.45,
  balance: 4509.55,
  monthlyGrowth: 12.5,
  categoriesCount: 8,
  transactionCount: 47,
  budgetUtilization: 72.3,
  savingsRate: 39.1,
};

const mockCategoryBreakdown: CategoryBreakdown[] = [
  {
    name: 'Food & Dining',
    amount: 1250.99,
    percentage: 43.3,
    color: '#FF6B6B',
    trend: 'up',
  },
  {
    name: 'Transportation',
    amount: 680.5,
    percentage: 23.5,
    color: '#4ECDC4',
    trend: 'stable',
  },
  {
    name: 'Entertainment',
    amount: 420.75,
    percentage: 14.6,
    color: '#96CEB4',
    trend: 'down',
  },
  {
    name: 'Shopping',
    amount: 538.21,
    percentage: 18.6,
    color: '#FFEAA7',
    trend: 'up',
  },
];

// Error boundary component for reliability
const ErrorFallback = ({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) => (
  <Card className="border-red-200 bg-red-50">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="font-semibold text-red-800">Something went wrong</h3>
      </div>
      <p className="text-red-700 mb-4">{error.message}</p>
      <Button onClick={resetError} variant="outline" size="sm">
        Try again
      </Button>
    </CardContent>
  </Card>
);

// Loading skeleton component
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  </div>
);

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [categoryBreakdown, setCategoryBreakdown] = useState<
    CategoryBreakdown[]
  >(mockCategoryBreakdown);
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '90d' | '1y'>(
    '30d',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Security: Input sanitization
  const sanitizeData = useCallback(<T,>(data: T, schema: z.ZodSchema<T>): T => {
    try {
      return schema.parse(data);
    } catch (error) {
      console.error('Data validation failed:', error);
      throw new Error('Invalid data received');
    }
  }, []);

  // Fetch dashboard data with error handling
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call with validation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate data before setting state
      const validatedMetrics = sanitizeData(mockMetrics, MetricsSchema);
      const validatedTransactions = mockTransactions.map(t =>
        sanitizeData(t, TransactionSchema),
      );

      setMetrics(validatedMetrics);
      setTransactions(validatedTransactions);
      setCategoryBreakdown(mockCategoryBreakdown);
      setLastUpdated(new Date());

      toast.success('Dashboard updated successfully');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
      toast.error('Failed to load dashboard', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [sanitizeData]);

  // Auto-refresh data
  useEffect(() => {
    fetchDashboardData();

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Memoized calculations for performance
  const chartData = useMemo(() => {
    return transactions
      .filter(t => t.status === 'completed')
      .reduce((acc, transaction) => {
        const name = new Date(transaction.date).toLocaleDateString();
        const existing = acc.find(item => item.name === name);

        if (existing) {
          if (transaction.type === 'income') {
            existing.income += transaction.amount;
          } else {
            existing.expenses += transaction.amount;
          }
        } else {
          acc.push({
            name,
            income: transaction.type === 'income' ? transaction.amount : 0,
            expenses: transaction.type === 'expense' ? transaction.amount : 0,
          });
        }

        return acc;
      }, [] as Array<{ name: string; income: number; expenses: number }>)
      .slice(-7); // Last 7 days
  }, [transactions]);

  const recentTransactions = useMemo(
    () =>
      transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [transactions],
  );

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <ErrorFallback
          error={new Error(error)}
          resetError={() => {
            setError(null);
            fetchDashboardData();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Financial Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your financial health and spending patterns
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={timeFilter}
              onValueChange={value =>
                setTimeFilter(value as '7d' | '30d' | '90d' | '1y')
              }
            >
              <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="bg-white/90 backdrop-blur-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </Button>

            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </motion.div>

        <Suspense fallback={<DashboardSkeleton />}>
          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="dashboard-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100 text-sm font-medium">
                              Total Income
                            </p>
                            <p className="text-2xl font-bold">
                              {formatCurrency(metrics.totalIncome)}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <TrendingUp className="w-3 h-3" />
                              <span className="text-xs">
                                +{metrics.monthlyGrowth}% this month
                              </span>
                            </div>
                          </div>
                          <Wallet className="w-8 h-8 text-green-200" />
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-500 to-pink-600 text-white">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-red-100 text-sm font-medium">
                              Total Expenses
                            </p>
                            <p className="text-2xl font-bold">
                              {formatCurrency(metrics.totalExpenses)}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <TrendingDown className="w-3 h-3" />
                              <span className="text-xs">
                                {metrics.budgetUtilization}% of budget
                              </span>
                            </div>
                          </div>
                          <ArrowDownRight className="w-8 h-8 text-red-200" />
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-100 text-sm font-medium">
                              Current Balance
                            </p>
                            <p className="text-2xl font-bold">
                              {formatCurrency(metrics.balance)}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Target className="w-3 h-3" />
                              <span className="text-xs">
                                {metrics.savingsRate}% savings rate
                              </span>
                            </div>
                          </div>
                          <DollarSign className="w-8 h-8 text-blue-200" />
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-100 text-sm font-medium">
                              Transactions
                            </p>
                            <p className="text-2xl font-bold">
                              {metrics.transactionCount}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Activity className="w-3 h-3" />
                              <span className="text-xs">
                                {metrics.categoriesCount} categories
                              </span>
                            </div>
                          </div>
                          <Zap className="w-8 h-8 text-purple-200" />
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          Income vs Expenses
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Chart barData={chartData} pieData={[]} />
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="w-5 h-5 text-purple-600" />
                          Category Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {categoryBreakdown.map((category, index) => (
                            <motion.div
                              key={category.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 + index * 0.1 }}
                              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                />
                                <div>
                                  <p className="font-medium">{category.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {category.percentage}% of expenses
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {formatCurrency(category.amount)}
                                </p>
                                <div className="flex items-center gap-1">
                                  {category.trend === 'up' && (
                                    <TrendingUp className="w-3 h-3 text-green-500" />
                                  )}
                                  {category.trend === 'down' && (
                                    <TrendingDown className="w-3 h-3 text-red-500" />
                                  )}
                                  {category.trend === 'stable' && (
                                    <Activity className="w-3 h-3 text-gray-500" />
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Recent Transactions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-indigo-600" />
                          Recent Transactions
                        </CardTitle>
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4 mr-2" />
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentTransactions.map((transaction, index) => (
                          <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-2 rounded-full ${
                                  transaction.type === 'income'
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-red-100 text-red-600'
                                }`}
                              >
                                {transaction.type === 'income' ? (
                                  <ArrowUpRight className="w-4 h-4" />
                                ) : (
                                  <ArrowDownRight className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {transaction.description}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {transaction.category}
                                  </Badge>
                                  {getStatusIcon(transaction.status)}
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(transaction.date)}
                                  </span>
                                </div>
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
                                {formatCurrency(transaction.amount)}
                              </p>
                              {transaction.tags && (
                                <div className="flex gap-1 mt-1">
                                  {transaction.tags.slice(0, 2).map(tag => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-orange-600" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button
                          variant="outline"
                          className="justify-start bg-white/50 hover:bg-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Transaction
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start bg-white/50 hover:bg-white"
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Set Budget
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start bg-white/50 hover:bg-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Data
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start bg-white/50 hover:bg-white"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          View Reports
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </Suspense>
      </div>
    </div>
  );
}
