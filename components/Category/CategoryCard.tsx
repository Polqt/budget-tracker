import React from 'react';
import {
  Edit3,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import categoryIcons from './categoryIcons';
import { Category } from '@/types/category';

interface CategoryCardProps {
  category: Category;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const IconComponent =
    categoryIcons[category.icon as keyof typeof categoryIcons] || MoreHorizontal;

  return (
    <Card className="hover:shadow-lg border-l-4 group transition-all duration-200" style={{ borderLeftColor: category.color }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
              <IconComponent className="w-5 h-5" style={{ color: category.color }} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    category.type === 'income'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {category.type === 'income' ? 'Income' : 'Expense'}
                </span>
                <span className="text-xs text-gray-500">
                  {category.transactionCount} transactions
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit?.(category.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onDelete?.(category.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        <div className="text-right">
          <p
            className={`text-lg font-bold ${
              category.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            ₱{category.totalAmount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Total amount</p>
        </div>
      </CardContent>
    </Card>
  );
}
