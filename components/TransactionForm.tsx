'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUser } from '@/hooks/use-user';
import { useCategories } from '@/hooks/use-categories';
import { useTransactionActions } from '@/hooks/use-transactions';
import { toast } from 'sonner';

interface TransactionFormProps {
  onSuccess?: () => void;
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const { user } = useUser();
  const { data: categoriesData } = useCategories(user?.id, {
    page: 1,
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const categories = categoriesData?.categories || [];
  const { createTransaction, loading } = useTransactionActions();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    location: '',
    paymentMethod: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.amount || !formData.categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await createTransaction(formData);
      toast.success('Transaction created successfully');

      // Reset form
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        location: '',
        paymentMethod: '',
      });

      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create transaction',
      );
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return <div>Please log in to add transactions</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <Input
            value={formData.title}
            onChange={e => handleChange('title', e.target.value)}
            placeholder="Transaction title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount *</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={e => handleChange('amount', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type *</label>
          <Select
            value={formData.type}
            onValueChange={value => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <Select
            value={formData.categoryId}
            onValueChange={value => handleChange('categoryId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories
                ?.filter(cat => cat.type === formData.type)
                .map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input
            type="date"
            value={formData.date}
            onChange={e => handleChange('date', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Method
          </label>
          <Input
            value={formData.paymentMethod}
            onChange={e => handleChange('paymentMethod', e.target.value)}
            placeholder="Cash, Card, Bank Transfer..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <Input
          value={formData.location}
          onChange={e => handleChange('location', e.target.value)}
          placeholder="Where did this transaction occur?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleChange('description', e.target.value)
          }
          placeholder="Additional details..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Transaction'}
      </Button>
    </form>
  );
}
