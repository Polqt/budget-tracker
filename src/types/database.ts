import { z } from 'zod';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  profiles,
  categories,
  transactions,
  budgets,
  goals,
} from '../db/schema';

// Database model types
export type Profile = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type Transaction = InferSelectModel<typeof transactions>;
export type NewTransaction = InferInsertModel<typeof transactions>;

export type Budget = InferSelectModel<typeof budgets>;
export type NewBudget = InferInsertModel<typeof budgets>;

export type Goal = InferSelectModel<typeof goals>;
export type NewGoal = InferInsertModel<typeof goals>;

// Validation schemas for API endpoints
export const ProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  currency: z.string().length(3).optional(),
  timezone: z.string().max(50).optional(),
  preferences: z
    .object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      notifications: z.boolean().optional(),
      language: z.string().max(10).optional(),
      dateFormat: z.string().max(20).optional(),
    })
    .optional(),
});

export const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500).optional(),
  type: z.enum(['income', 'expense']),
  icon: z.string().min(1).max(10).default('📁'),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
    .default('#3B82F6'),
  budget: z
    .string()
    .optional()
    .transform(val => (val ? parseFloat(val) : undefined)),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  tags: z.array(z.string().max(30)).max(10).default([]),
  metadata: z
    .object({
      subcategories: z.array(z.string()).optional(),
      budgetPeriod: z.enum(['monthly', 'weekly', 'yearly']).optional(),
      alertThreshold: z.number().min(0).max(100).optional(),
      notes: z.string().max(1000).optional(),
    })
    .default({}),
});

export const TransactionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000).optional(),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  type: z.enum(['income', 'expense']),
  status: z.enum(['completed', 'pending', 'failed']).default('completed'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  location: z.string().max(200).optional(),
  paymentMethod: z.string().max(50).optional(),
  reference: z.string().max(100).optional(),
  tags: z.array(z.string().max(30)).max(10).default([]),
  categoryId: z.string().uuid('Invalid category ID'),
  metadata: z
    .object({
      subcategory: z.string().max(50).optional(),
      vendor: z.string().max(100).optional(),
      recurring: z.boolean().optional(),
      recurringInterval: z
        .enum(['daily', 'weekly', 'monthly', 'yearly'])
        .optional(),
      attachments: z.array(z.string().url()).optional(),
      notes: z.string().max(1000).optional(),
      exchangeRate: z.number().positive().optional(),
      originalAmount: z.number().positive().optional(),
      originalCurrency: z.string().length(3).optional(),
    })
    .default({}),
});

export const BudgetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  period: z.enum(['weekly', 'monthly', 'yearly']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional(),
  alertThreshold: z.number().min(0).max(100).default(80),
  isActive: z.boolean().default(true),
  categoryId: z.string().uuid().optional(),
});

export const GoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  targetAmount: z.number().min(0.01, 'Target amount must be greater than 0'),
  currentAmount: z.number().min(0).default(0),
  targetDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  categoryId: z.string().uuid().optional(),
});

// Query parameter schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const TransactionQuerySchema = PaginationSchema.extend({
  type: z.enum(['income', 'expense']).optional(),
  status: z.enum(['completed', 'pending', 'failed']).optional(),
  categoryId: z.string().uuid().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['date', 'amount', 'title', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const CategoryQuerySchema = PaginationSchema.extend({
  type: z.enum(['income', 'expense']).optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['name', 'createdAt', 'type']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TransactionWithCategory extends Transaction {
  category: Category;
}

export interface CategoryWithStats extends Category {
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  lastTransactionDate: string | null;
}

// Input sanitization utility type
export type SanitizedInput<T> = {
  [K in keyof T]: T[K] extends string ? string : T[K];
};
