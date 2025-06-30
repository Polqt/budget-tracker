import {
  pgTable,
  uuid,
  text,
  timestamp,
  numeric,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const typeEnum = pgEnum('type', ['income', 'expense']);

export const profile = pgTable('profile', {
  id: uuid('id').primaryKey(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: typeEnum('type').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profile.id, { onDelete: 'cascade' }), // 👈 FK!
  createdAt: timestamp('created_at').defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  amount: numeric('amount').notNull(),
  type: typeEnum('type').notNull(),
  date: date('date').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profile.id, { onDelete: 'cascade' }), 
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }), 
  createdAt: timestamp('created_at').defaultNow(),
});
