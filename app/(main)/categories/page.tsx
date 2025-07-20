'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Wallet,
  Target,
  Activity,
  Calendar,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CategoryCard from '@/components/Category/CategoryCard';
import EmptyState from '@/components/Category/EmptyState';
import AddCategoryModal from '@/components/Category/AddCategoryModal';
import { Category, CategoryType } from '@/types/category';

// Enhanced Category interface with additional fields
interface EnhancedCategory extends Category {
  budget?: number;
  spent?: number;
  budgetUtilization?: number;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  lastTransactionDate?: string;
  monthlyAverage?: number;
  trend?: 'up' | 'down' | 'stable';
  tags?: string[];
}

// Validation schema for security
const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long').trim(),
  type: z.enum(['income', 'expense']),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  budget: z.number().min(0, 'Budget must be positive').optional(),
  description: z.string().max(200, 'Description too long').optional(),
  tags: z.array(z.string().max(20)).max(5, 'Too many tags').optional(),
});

// Mock data with enhanced features
const mockCategories: EnhancedCategory[] = [
  {
    id: 1,
    name: 'Food & Dining',
    type: 'expense' as CategoryType,
    icon: '🍽️',
    color: '#FF6B6B',
    totalAmount: 1250,
    transactionCount: 24,
    budget: 1500,
    spent: 1250,
    budgetUtilization: 83.3,
    description: 'Restaurants, groceries, and dining out expenses',
    isActive: true,
    createdAt: '2024-01-01',
    lastTransactionDate: '2024-01-18',
    monthlyAverage: 1200,
    trend: 'up',
    tags: ['essentials', 'monthly'],
  },
  {
    id: 2,
    name: 'Transportation',
    type: 'expense' as CategoryType,
    icon: '🚗',
    color: '#4ECDC4',
    totalAmount: 480,
    transactionCount: 12,
    budget: 600,
    spent: 480,
    budgetUtilization: 80,
    description: 'Gas, public transport, car maintenance',
    isActive: true,
    createdAt: '2024-01-01',
    lastTransactionDate: '2024-01-19',
    monthlyAverage: 450,
    trend: 'stable',
    tags: ['transport', 'variable'],
  },
  {
    id: 3,
    name: 'Salary',
    type: 'income' as CategoryType,
    icon: '💰',
    color: '#45B7D1',
    totalAmount: 5000,
    transactionCount: 2,
    description: 'Monthly salary and bonuses',
    isActive: true,
    createdAt: '2024-01-01',
    lastTransactionDate: '2024-01-15',
    monthlyAverage: 5000,
    trend: 'stable',
    tags: ['primary', 'fixed'],
  },
  {
    id: 4,
    name: 'Entertainment',
    type: 'expense' as CategoryType,
    icon: '🎬',
    color: '#96CEB4',
    totalAmount: 320,
    transactionCount: 8,
    budget: 400,
    spent: 320,
    budgetUtilization: 80,
    description: 'Movies, games, streaming services',
    isActive: true,
    createdAt: '2024-01-01',
    lastTransactionDate: '2024-01-17',
    monthlyAverage: 300,
    trend: 'up',
    tags: ['leisure', 'optional'],
  },
  {
    id: 5,
    name: 'Shopping',
    type: 'expense' as CategoryType,
    icon: '🛍️',
    color: '#FFEAA7',
    totalAmount: 850,
    transactionCount: 15,
    budget: 700,
    spent: 850,
    budgetUtilization: 121.4,
    description: 'Clothes, electronics, miscellaneous purchases',
    isActive: true,
    createdAt: '2024-01-01',
    lastTransactionDate: '2024-01-20',
    monthlyAverage: 750,
    trend: 'up',
    tags: ['variable', 'discretionary'],
  },
  {
    id: 6,
    name: 'Freelance Work',
    type: 'income' as CategoryType,
    icon: '💻',
    color: '#DDA0DD',
    totalAmount: 2400,
    transactionCount: 5,
    description: 'Freelance projects and consulting work',
    isActive: true,
    createdAt: '2024-01-01',
    lastTransactionDate: '2024-01-19',
    monthlyAverage: 2000,
    trend: 'up',
    tags: ['secondary', 'variable'],
  },
];

// Sort options
type SortOption = 'name' | 'amount' | 'transactions' | 'budget' | 'recent';
type SortOrder = 'asc' | 'desc';

export default function Categories() {
  const [categories, setCategories] =
    useState<EnhancedCategory[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | CategoryType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Security: Input sanitization function
  const sanitizeInput = useCallback((input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }, []);

  // Memoized filtered and sorted categories for performance
  const processedCategories = useMemo(() => {
    const filtered = categories.filter(category => {
      const searchMatch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        category.tags?.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const typeMatch =
        activeFilter === 'all' || category.type === activeFilter;

      const tagMatch =
        selectedTags.length === 0 ||
        selectedTags.every(tag => category.tags?.includes(tag));

      return searchMatch && typeMatch && tagMatch && category.isActive;
    });

    // Sorting logic
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'amount':
          aValue = a.totalAmount || 0;
          bValue = b.totalAmount || 0;
          break;
        case 'transactions':
          aValue = a.transactionCount || 0;
          bValue = b.transactionCount || 0;
          break;
        case 'budget':
          aValue = a.budgetUtilization || 0;
          bValue = b.budgetUtilization || 0;
          break;
        case 'recent':
          aValue = new Date(a.lastTransactionDate || '1970-01-01').getTime();
          bValue = new Date(b.lastTransactionDate || '1970-01-01').getTime();
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return filtered;
  }, [categories, searchTerm, activeFilter, selectedTags, sortBy, sortOrder]);

  // Get all unique tags for filtering
  const availableTags = useMemo(() => {
    const allTags = categories.flatMap(cat => cat.tags || []);
    return [...new Set(allTags)].sort();
  }, [categories]);

  // Enhanced handlers with validation and error handling
  const handleAddCategory = useCallback(
    async (categoryData: Partial<EnhancedCategory>) => {
      setIsLoading(true);
      try {
        // Validate input data
        const validatedData = CategorySchema.parse({
          name: sanitizeInput(categoryData.name || ''),
          type: categoryData.type || 'expense',
          icon: categoryData.icon || '📁',
          color: categoryData.color || '#3B82F6',
        });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newCategory: EnhancedCategory = {
          ...validatedData,
          id: Date.now(),
          totalAmount: 0,
          transactionCount: 0,
          spent: 0,
          budgetUtilization: 0,
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0],
          monthlyAverage: 0,
          trend: 'stable',
        };

        setCategories(prev => [...prev, newCategory]);
        setShowAddForm(false);

        toast.success('Category created successfully!', {
          description: `${newCategory.name} has been added to your categories.`,
        });
      } catch (error) {
        console.error('Failed to add category:', error);
        toast.error('Failed to create category', {
          description:
            error instanceof z.ZodError
              ? error.errors[0].message
              : 'Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [sanitizeInput],
  );

  const handleEditCategory = useCallback(
    async (id: number, updates: Partial<EnhancedCategory>) => {
      setIsLoading(true);
      try {
        // Validate updates
        if (updates.name) updates.name = sanitizeInput(updates.name);
        if (updates.description)
          updates.description = sanitizeInput(updates.description);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        setCategories(prev =>
          prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat)),
        );

        toast.success('Category updated successfully!');
      } catch (error) {
        console.error('Failed to update category:', error);
        toast.error('Failed to update category');
      } finally {
        setIsLoading(false);
      }
    },
    [sanitizeInput],
  );

  const handleDeleteCategory = useCallback(async (id: number) => {
    if (
      !confirm(
        'Are you sure you want to delete this category? This action cannot be undone.',
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setCategories(prev => prev.filter(cat => cat.id !== id));

      toast.success('Category deleted successfully!');
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleSortOrder = useCallback(() => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(sanitizeInput(value));
    },
    [sanitizeInput],
  );

  // Calculate summary statistics
  const categoryStats = useMemo(() => {
    const totalIncome = categories
      .filter(cat => cat.type === 'income')
      .reduce((sum, cat) => sum + (cat.totalAmount || 0), 0);

    const totalExpenses = categories
      .filter(cat => cat.type === 'expense')
      .reduce((sum, cat) => sum + (cat.totalAmount || 0), 0);

    const totalBudget = categories
      .filter(cat => cat.type === 'expense' && cat.budget)
      .reduce((sum, cat) => sum + (cat.budget || 0), 0);

    const overBudgetCategories = categories.filter(
      cat => cat.budgetUtilization && cat.budgetUtilization > 100,
    ).length;

    return {
      totalCategories: categories.filter(cat => cat.isActive).length,
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      totalBudget,
      budgetUtilization:
        totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0,
      overBudgetCategories,
    };
  }, [categories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Wallet className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Financial Categories
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Organize and track your income and expenses with intelligent
            categorization and budget management
          </p>
        </motion.div>

        {/* Enhanced Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Total Income
                  </p>
                  <p className="text-2xl font-bold">
                    ${categoryStats.totalIncome.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold">
                    ${categoryStats.totalExpenses.toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-200" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Net Amount
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      categoryStats.netAmount >= 0
                        ? 'text-white'
                        : 'text-red-200'
                    }`}
                  >
                    ${Math.abs(categoryStats.netAmount).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-200" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-violet-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Budget Usage
                  </p>
                  <p className="text-2xl font-bold">
                    {categoryStats.budgetUtilization.toFixed(1)}%
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-200" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search categories, tags, or descriptions..."
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
                className="pl-10 bg-white/90 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <Select
                value={activeFilter}
                onValueChange={value =>
                  setActiveFilter(value as 'all' | CategoryType)
                }
              >
                <SelectTrigger className="w-[140px] bg-white/90 backdrop-blur-sm">
                  <SelectValue placeholder="Filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={value => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-[140px] bg-white/90 backdrop-blur-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="transactions">Transactions</SelectItem>
                  <SelectItem value="budget">Budget Usage</SelectItem>
                  <SelectItem value="recent">Recent Activity</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleSortOrder}
                className="bg-white/90 backdrop-blur-sm hover:bg-white"
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Add Category Button */}
          <Button
            onClick={() => setShowAddForm(true)}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </motion.div>

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            <span className="text-sm font-medium text-muted-foreground self-center">
              Tags:
            </span>
            {availableTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'hover:bg-blue-50 hover:border-blue-300'
                }`}
                onClick={() => {
                  setSelectedTags(prev =>
                    prev.includes(tag)
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag],
                  );
                }}
              >
                {tag}
              </Badge>
            ))}
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            )}
          </motion.div>
        )}

        {/* Categories Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {processedCategories.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              <AnimatePresence mode="popLayout">
                {processedCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{
                      delay: index * 0.05,
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                    whileHover={{ y: -5 }}
                    layout
                  >
                    <CategoryCard
                      category={category}
                      onEdit={id => handleEditCategory(id, {})}
                      onDelete={() => handleDeleteCategory(category.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <EmptyState
                hasSearch={!!searchTerm || selectedTags.length > 0}
                onAdd={() => setShowAddForm(true)}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="justify-start bg-white/50 hover:bg-white"
                >
                  <PieChart className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button
                  variant="outline"
                  className="justify-start bg-white/50 hover:bg-white"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Set Budgets
                </Button>
                <Button
                  variant="outline"
                  className="justify-start bg-white/50 hover:bg-white"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Monthly Report
                </Button>
                <Button
                  variant="outline"
                  className="justify-start bg-white/50 hover:bg-white"
                  onClick={() =>
                    setViewMode(viewMode === 'grid' ? 'list' : 'grid')
                  }
                >
                  {viewMode === 'grid' ? (
                    <>
                      <Filter className="w-4 h-4 mr-2" />
                      List View
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4 mr-2" />
                      Grid View
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Add Category Modal */}
        <AddCategoryModal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onAdd={category =>
            handleAddCategory({
              ...category,
              type: category.type as CategoryType,
            })
          }
        />
      </div>
    </div>
  );
}
