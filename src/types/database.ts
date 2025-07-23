import { z } from 'zod';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  profiles,
  categories,
  transactions,
  budgets,
  goals,
} from '../db/schema';

// ===== BASE TYPES & GENERICS =====
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

// ===== ADVANCED GENERIC PATTERNS =====
export type EntityType =
  | 'profile'
  | 'category'
  | 'transaction'
  | 'budget'
  | 'goal';

export type EntityMap = {
  profile: Profile;
  category: Category;
  transaction: Transaction;
  budget: Budget;
  goal: Goal;
};

export type NewEntityMap = {
  profile: NewProfile;
  category: NewCategory;
  transaction: NewTransaction;
  budget: NewBudget;
  goal: NewGoal;
};

// Generic CRUD operation types
export type CreateInput<T extends EntityType> = Omit<
  NewEntityMap[T],
  'id' | 'createdAt' | 'updatedAt' | 'userId'
>;
export type UpdateInput<T extends EntityType> = Partial<CreateInput<T>>;
export type EntityWithId<T extends EntityType> = EntityMap[T] & { id: string };

// ===== SHARED VALIDATION PRIMITIVES =====
const BaseValidation = {
  id: () => z.string().uuid('Invalid ID format'),
  name: (min = 1, max = 100) =>
    z.string().min(min, 'Name too short').max(max, 'Name too long'),
  description: (max = 1000) =>
    z.string().max(max, 'Description too long').optional(),
  amount: (min = 0.01) => z.number().min(min, 'Amount must be positive'),
  date: () =>
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  url: () => z.string().url('Invalid URL format'),
  color: () => z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color format'),
  currency: () => z.string().length(3, 'Invalid currency code'),
  percentage: () => z.number().min(0).max(100),
  tags: (maxItems = 10, maxLength = 30) =>
    z
      .array(z.string().max(maxLength))
      .max(maxItems, `Maximum ${maxItems} tags allowed`),
  metadata: <T extends z.ZodSchema>(schema: T) =>
    schema.default({} as z.infer<T>),
};

const CommonEnums = {
  type: z.enum(['income', 'expense']),
  status: z.enum(['completed', 'pending', 'failed']),
  priority: z.enum(['low', 'medium', 'high']),
  categoryStatus: z.enum(['active', 'inactive', 'archived']),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  theme: z.enum(['light', 'dark', 'system']),
  sortOrder: z.enum(['asc', 'desc']),
};

// ===== ENTITY SCHEMAS WITH COMPOSITION =====
export const ProfileSchema = z.object({
  fullName: BaseValidation.name(1, 100).optional(),
  avatarUrl: BaseValidation.url().optional(),
  currency: BaseValidation.currency().optional(),
  timezone: z.string().max(50).optional(),
  preferences: BaseValidation.metadata(
    z.object({
      theme: CommonEnums.theme.optional(),
      notifications: z.boolean().optional(),
      language: z.string().max(10).optional(),
      dateFormat: z.string().max(20).optional(),
    }),
  ),
});

export const CategorySchema = z.object({
  name: BaseValidation.name(),
  description: BaseValidation.description(500),
  type: CommonEnums.type,
  icon: z.string().min(1).max(10).default('📁'),
  color: BaseValidation.color().default('#3B82F6'),
  budget: z
    .string()
    .optional()
    .transform(val => (val ? parseFloat(val) : undefined)),
  status: CommonEnums.categoryStatus.default('active'),
  priority: CommonEnums.priority.default('medium'),
  tags: BaseValidation.tags().default([]),
  metadata: BaseValidation.metadata(
    z.object({
      subcategories: z.array(z.string()).optional(),
      budgetPeriod: CommonEnums.period.optional(),
      alertThreshold: BaseValidation.percentage().optional(),
      notes: BaseValidation.description().optional(),
    }),
  ),
});

export const TransactionSchema = z.object({
  title: BaseValidation.name(1, 200),
  description: BaseValidation.description(),
  amount: BaseValidation.amount(),
  type: CommonEnums.type,
  status: CommonEnums.status.default('completed'),
  date: BaseValidation.date(),
  location: z.string().max(200).optional(),
  paymentMethod: z.string().max(50).optional(),
  reference: z.string().max(100).optional(),
  tags: BaseValidation.tags().default([]),
  categoryId: BaseValidation.id(),
  metadata: BaseValidation.metadata(
    z.object({
      subcategory: z.string().max(50).optional(),
      vendor: z.string().max(100).optional(),
      recurring: z.boolean().optional(),
      recurringInterval: CommonEnums.period.optional(),
      attachments: z.array(BaseValidation.url()).optional(),
      notes: BaseValidation.description().optional(),
      exchangeRate: z.number().positive().optional(),
      originalAmount: BaseValidation.amount().optional(),
      originalCurrency: BaseValidation.currency().optional(),
    }),
  ),
});

export const BudgetSchema = z.object({
  name: BaseValidation.name(),
  amount: BaseValidation.amount(),
  period: CommonEnums.period,
  startDate: BaseValidation.date(),
  endDate: BaseValidation.date().optional(),
  alertThreshold: BaseValidation.percentage().default(80),
  isActive: z.boolean().default(true),
  categoryId: BaseValidation.id().optional(),
});

export const GoalSchema = z.object({
  title: BaseValidation.name(1, 200),
  description: BaseValidation.description(),
  targetAmount: BaseValidation.amount(),
  currentAmount: z.number().min(0).default(0),
  targetDate: BaseValidation.date().optional(),
  priority: CommonEnums.priority.default('medium'),
  categoryId: BaseValidation.id().optional(),
});

// ===== GENERIC QUERY SCHEMAS =====
const BasePaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  sortOrder: CommonEnums.sortOrder.default('desc'),
});

export const TransactionQuerySchema = BasePaginationSchema.extend({
  type: CommonEnums.type.optional(),
  status: CommonEnums.status.optional(),
  categoryId: BaseValidation.id().optional(),
  startDate: BaseValidation.date().optional(),
  endDate: BaseValidation.date().optional(),
  sortBy: z.enum(['date', 'amount', 'title', 'createdAt']).default('date'),
});

export const CategoryQuerySchema = BasePaginationSchema.extend({
  type: CommonEnums.type.optional(),
  status: CommonEnums.categoryStatus.optional(),
  sortBy: z.enum(['name', 'createdAt', 'type']).default('name'),
});

// ===== ADVANCED RESPONSE TYPES =====
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationMeta;
  metadata?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type EntityWithRelations<T, R = Record<string, unknown>> = T & {
  relations?: R;
};

export interface TransactionWithCategory extends Transaction {
  category: Category;
}

export interface CategoryWithStats extends Category {
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  lastTransactionDate: string | null;
  budgetUtilization?: number;
}

export interface BudgetWithProgress extends Budget {
  spent: number;
  remaining: number;
  utilizationPercent: number;
  isOverBudget: boolean;
}

export interface GoalWithProgress extends Goal {
  progressPercent: number;
  remainingAmount: number;
  daysRemaining?: number;
  isAchieved: boolean;
}

// ===== UTILITY TYPES =====
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OmitAuditFields<T> = Omit<T, 'createdAt' | 'updatedAt' | 'id'>;

export type SanitizedInput<T> = {
  [K in keyof T]: T[K] extends string ? string : T[K];
};

// ===== BUSINESS LOGIC TYPES =====
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  savingsRate: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends: MonthlyTrend[];
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  amount: number;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  net: number;
  budgetCompliance: number;
}
