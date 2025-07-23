import {
  pgTable,
  uuid,
  text,
  timestamp,
  numeric,
  date,
  pgEnum,
  boolean,
  json,
  index,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums for better type safety
export const typeEnum = pgEnum('type', ['income', 'expense']);
export const statusEnum = pgEnum('status', ['completed', 'pending', 'failed']);
export const categoryStatusEnum = pgEnum('category_status', [
  'active',
  'inactive',
  'archived',
]);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);

// Users profile table (extends Supabase auth.users)
export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey(), // This should match auth.users.id
    email: varchar('email', { length: 255 }).notNull().unique(),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    currency: varchar('currency', { length: 3 }).default('USD'), // ISO currency code
    timezone: varchar('timezone', { length: 50 }).default('UTC'),
    preferences: json('preferences')
      .$type<{
        theme: 'light' | 'dark' | 'system';
        notifications: boolean;
        language: string;
        dateFormat: string;
      }>()
      .default({
        theme: 'system',
        notifications: true,
        language: 'en',
        dateFormat: 'MM/dd/yyyy',
      }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    emailIdx: index('profiles_email_idx').on(table.email),
    createdAtIdx: index('profiles_created_at_idx').on(table.createdAt),
  }),
);

// Enhanced categories table
export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    type: typeEnum('type').notNull(),
    icon: varchar('icon', { length: 10 }).default('📁'),
    color: varchar('color', { length: 7 }).default('#3B82F6'), // Hex color
    budget: numeric('budget', { precision: 10, scale: 2 }),
    status: categoryStatusEnum('status').default('active').notNull(),
    priority: priorityEnum('priority').default('medium'),
    tags: json('tags').$type<string[]>().default([]),
    metadata: json('metadata')
      .$type<{
        subcategories?: string[];
        budgetPeriod?: 'monthly' | 'weekly' | 'yearly';
        alertThreshold?: number;
        notes?: string;
      }>()
      .default({}),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index('categories_user_id_idx').on(table.userId),
    typeIdx: index('categories_type_idx').on(table.type),
    statusIdx: index('categories_status_idx').on(table.status),
    createdAtIdx: index('categories_created_at_idx').on(table.createdAt),
    userTypeIdx: index('categories_user_type_idx').on(table.userId, table.type),
  }),
);

// Enhanced transactions table
export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description'),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    type: typeEnum('type').notNull(),
    status: statusEnum('status').default('completed').notNull(),
    date: date('date').notNull(),
    location: varchar('location', { length: 200 }),
    paymentMethod: varchar('payment_method', { length: 50 }),
    reference: varchar('reference', { length: 100 }), // Receipt number, check number, etc.
    tags: json('tags').$type<string[]>().default([]),
    metadata: json('metadata')
      .$type<{
        subcategory?: string;
        vendor?: string;
        recurring?: boolean;
        recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
        attachments?: string[]; // URLs to stored files
        notes?: string;
        exchangeRate?: number; // For multi-currency support
        originalAmount?: number;
        originalCurrency?: string;
      }>()
      .default({}),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index('transactions_user_id_idx').on(table.userId),
    categoryIdIdx: index('transactions_category_id_idx').on(table.categoryId),
    typeIdx: index('transactions_type_idx').on(table.type),
    statusIdx: index('transactions_status_idx').on(table.status),
    dateIdx: index('transactions_date_idx').on(table.date),
    createdAtIdx: index('transactions_created_at_idx').on(table.createdAt),
    userDateIdx: index('transactions_user_date_idx').on(
      table.userId,
      table.date,
    ),
    userCategoryIdx: index('transactions_user_category_idx').on(
      table.userId,
      table.categoryId,
    ),
  }),
);

// Budgets table for advanced budget management
export const budgets = pgTable(
  'budgets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    period: varchar('period', { length: 20 }).notNull(), // 'monthly', 'weekly', 'yearly'
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    alertThreshold: numeric('alert_threshold', {
      precision: 5,
      scale: 2,
    }).default('80'), // Percentage
    isActive: boolean('is_active').default(true).notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id').references(() => categories.id, {
      onDelete: 'cascade',
    }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index('budgets_user_id_idx').on(table.userId),
    categoryIdIdx: index('budgets_category_id_idx').on(table.categoryId),
    periodIdx: index('budgets_period_idx').on(table.period),
    activeIdx: index('budgets_active_idx').on(table.isActive),
  }),
);

// Financial goals table
export const goals = pgTable(
  'goals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description'),
    targetAmount: numeric('target_amount', {
      precision: 12,
      scale: 2,
    }).notNull(),
    currentAmount: numeric('current_amount', {
      precision: 12,
      scale: 2,
    }).default('0'),
    targetDate: date('target_date'),
    priority: priorityEnum('priority').default('medium'),
    isCompleted: boolean('is_completed').default(false).notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id').references(() => categories.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index('goals_user_id_idx').on(table.userId),
    completedIdx: index('goals_completed_idx').on(table.isCompleted),
    targetDateIdx: index('goals_target_date_idx').on(table.targetDate),
  }),
);

// Relations for better ORM experience
export const profilesRelations = relations(profiles, ({ many }) => ({
  categories: many(categories),
  transactions: many(transactions),
  budgets: many(budgets),
  goals: many(goals),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(profiles, {
    fields: [categories.userId],
    references: [profiles.id],
  }),
  transactions: many(transactions),
  budgets: many(budgets),
  goals: many(goals),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(profiles, {
    fields: [transactions.userId],
    references: [profiles.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const budgetsRelations = relations(budgets, ({ one }) => ({
  user: one(profiles, {
    fields: [budgets.userId],
    references: [profiles.id],
  }),
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(profiles, {
    fields: [goals.userId],
    references: [profiles.id],
  }),
  category: one(categories, {
    fields: [goals.categoryId],
    references: [categories.id],
  }),
}));

// Export the schema
export const schema = {
  profiles,
  categories,
  transactions,
  budgets,
  goals,
  typeEnum,
  statusEnum,
  categoryStatusEnum,
  priorityEnum,
  profilesRelations,
  categoriesRelations,
  transactionsRelations,
  budgetsRelations,
  goalsRelations,
};
