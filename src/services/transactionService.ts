import { eq, and, desc, asc, sql, gte, lte, count } from 'drizzle-orm';
import { db } from '../db';
import { transactions, categories } from '../db/schema';
import { ServiceUtils } from './baseService';
import type {
  Transaction,
  NewTransaction,
  TransactionWithCategory,
  TransactionQuerySchema,
} from '../types/database';

export class TransactionService {
  /**
   * Get transactions with filtering and pagination
   */
  async getTransactions(
    userId: string,
    query: typeof TransactionQuerySchema._type,
  ): Promise<{ transactions: TransactionWithCategory[]; total: number }> {
    if (!ServiceUtils.isValidUUID(userId)) {
      throw new Error('Invalid user ID');
    }

    ServiceUtils.validatePagination(query.page, query.limit);
    const offset = (query.page - 1) * query.limit;

    // Build filters
    const filters = [eq(transactions.userId, userId)];

    if (query.type) filters.push(eq(transactions.type, query.type));
    if (query.status) filters.push(eq(transactions.status, query.status));
    if (query.categoryId)
      filters.push(eq(transactions.categoryId, query.categoryId));
    if (query.startDate) filters.push(gte(transactions.date, query.startDate));
    if (query.endDate) filters.push(lte(transactions.date, query.endDate));
    if (query.search) {
      const searchTerm = ServiceUtils.sanitizeSearch(query.search);
      if (searchTerm) {
        filters.push(
          sql`(${transactions.title} ILIKE ${`%${searchTerm}%`} OR ${
            transactions.description
          } ILIKE ${`%${searchTerm}%`})`,
        );
      }
    }

    // Sort options
    const sortColumn =
      query.sortBy === 'date'
        ? transactions.date
        : query.sortBy === 'amount'
        ? transactions.amount
        : query.sortBy === 'title'
        ? transactions.title
        : transactions.createdAt;
    const sortDir = query.sortOrder === 'asc' ? asc : desc;

    // Execute queries
    const [results, [{ total }]] = await Promise.all([
      db
        .select({
          // Transaction fields
          id: transactions.id,
          title: transactions.title,
          description: transactions.description,
          amount: transactions.amount,
          type: transactions.type,
          status: transactions.status,
          date: transactions.date,
          location: transactions.location,
          paymentMethod: transactions.paymentMethod,
          reference: transactions.reference,
          tags: transactions.tags,
          metadata: transactions.metadata,
          userId: transactions.userId,
          categoryId: transactions.categoryId,
          createdAt: transactions.createdAt,
          updatedAt: transactions.updatedAt,
          // Category fields
          category: {
            id: categories.id,
            name: categories.name,
            type: categories.type,
            icon: categories.icon,
            color: categories.color,
            description: categories.description,
            budget: categories.budget,
            status: categories.status,
            priority: categories.priority,
            tags: categories.tags,
            metadata: categories.metadata,
            userId: categories.userId,
            createdAt: categories.createdAt,
            updatedAt: categories.updatedAt,
          },
        })
        .from(transactions)
        .innerJoin(categories, eq(transactions.categoryId, categories.id))
        .where(and(...filters))
        .orderBy(sortDir(sortColumn))
        .limit(query.limit)
        .offset(offset),

      db
        .select({ total: count() })
        .from(transactions)
        .where(and(...filters)),
    ]);

    return { transactions: results as TransactionWithCategory[], total };
  }

  /**
   * Get single transaction by ID
   */
  async getTransactionById(
    userId: string,
    transactionId: string,
  ): Promise<TransactionWithCategory | null> {
    if (
      !ServiceUtils.isValidUUID(userId) ||
      !ServiceUtils.isValidUUID(transactionId)
    ) {
      throw new Error('Invalid ID format');
    }

    const [result] = await db
      .select({
        id: transactions.id,
        title: transactions.title,
        description: transactions.description,
        amount: transactions.amount,
        type: transactions.type,
        status: transactions.status,
        date: transactions.date,
        location: transactions.location,
        paymentMethod: transactions.paymentMethod,
        reference: transactions.reference,
        tags: transactions.tags,
        metadata: transactions.metadata,
        userId: transactions.userId,
        categoryId: transactions.categoryId,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          type: categories.type,
          icon: categories.icon,
          color: categories.color,
          description: categories.description,
          budget: categories.budget,
          status: categories.status,
          priority: categories.priority,
          tags: categories.tags,
          metadata: categories.metadata,
          userId: categories.userId,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt,
        },
      })
      .from(transactions)
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, userId),
        ),
      )
      .limit(1);

    return (result as TransactionWithCategory) || null;
  }

  /**
   * Create new transaction
   */
  async createTransaction(
    userId: string,
    data: Omit<NewTransaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  ): Promise<Transaction> {
    if (!ServiceUtils.isValidUUID(userId)) {
      throw new Error('Invalid user ID');
    }

    // Verify category belongs to user and type matches
    const [category] = await db
      .select()
      .from(categories)
      .where(
        and(eq(categories.id, data.categoryId), eq(categories.userId, userId)),
      )
      .limit(1);

    if (!category) {
      throw new Error('Category not found');
    }

    if (category.type !== data.type) {
      throw new Error('Transaction type must match category type');
    }

    const [newTransaction] = await db
      .insert(transactions)
      .values({
        ...data,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return newTransaction;
  }

  /**
   * Update transaction
   */
  async updateTransaction(
    userId: string,
    transactionId: string,
    updates: Partial<Omit<NewTransaction, 'id' | 'userId' | 'createdAt'>>,
  ): Promise<Transaction | null> {
    if (
      !ServiceUtils.isValidUUID(userId) ||
      !ServiceUtils.isValidUUID(transactionId)
    ) {
      throw new Error('Invalid ID format');
    }

    // Check if transaction exists
    const [existing] = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, userId),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new Error('Transaction not found');
    }

    // If updating category, verify it
    if (updates.categoryId) {
      const [category] = await db
        .select()
        .from(categories)
        .where(
          and(
            eq(categories.id, updates.categoryId),
            eq(categories.userId, userId),
          ),
        )
        .limit(1);

      if (!category) {
        throw new Error('Category not found');
      }

      const transactionType = updates.type || existing.type;
      if (category.type !== transactionType) {
        throw new Error('Transaction type must match category type');
      }
    }

    const [updated] = await db
      .update(transactions)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, userId),
        ),
      )
      .returning();

    return updated || null;
  }

  /**
   * Delete transaction
   */
  async deleteTransaction(
    userId: string,
    transactionId: string,
  ): Promise<boolean> {
    if (
      !ServiceUtils.isValidUUID(userId) ||
      !ServiceUtils.isValidUUID(transactionId)
    ) {
      throw new Error('Invalid ID format');
    }

    const result = await db
      .delete(transactions)
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, userId),
        ),
      )
      .returning();

    return result.length > 0;
  }

  /**
   * Get basic transaction stats
   */
  async getStats(userId: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
    transactionCount: number;
  }> {
    if (!ServiceUtils.isValidUUID(userId)) {
      throw new Error('Invalid user ID');
    }

    const [stats] = await db
      .select({
        totalIncome: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount}::numeric ELSE 0 END), 0)`,
        totalExpenses: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount}::numeric ELSE 0 END), 0)`,
        transactionCount: count(),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.status, 'completed'),
        ),
      );

    return {
      ...stats,
      netAmount: stats.totalIncome - stats.totalExpenses,
    };
  }
}
