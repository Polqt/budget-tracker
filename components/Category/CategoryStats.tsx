import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tag, TrendingDown, TrendingUp } from 'lucide-react';
import { Category } from '@/types/category';

interface CategoryStatsProps {
  categories: Category[];
}

export default function CategoryStats({ categories }: CategoryStatsProps) {
  const income = categories.filter(cat => cat.type === 'income');
  const expense = categories.filter(cat => cat.type === 'expense');
  const totalIncome = income.reduce((acc, cat) => acc + cat.totalAmount, 0);
  const totalExpense = expense.reduce((acc, cat) => acc + cat.totalAmount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Income Categories
          </CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <TrendingUp className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{income.length}</div>
          <p className="text-xs opacity-90 mt-2">
            ₱{totalIncome.toLocaleString()} total
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Expense Categories
          </CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <TrendingDown className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{expense.length}</div>
          <p className="text-xs opacity-90 mt-2">
            ₱{totalExpense.toLocaleString()} total
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Total Categories
          </CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Tag className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{categories.length}</div>
          <p className="text-xs opacity-90 mt-2">Active categories</p>
        </CardContent>
      </Card>
    </div>
  );
}
