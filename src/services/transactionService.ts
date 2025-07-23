import { eq, and, desc, asc, sql, gte, lte, count } from 'drizzle-orm';
import { db } from '../db';
import { transactions, categories } from '../db/schema';
import type {
  Transaction,
  NewTransaction,
  TransactionWithCategory,
  TransactionQuerySchema,
} from '../types/database';
import { z } from 'zod';

export class TransactionService {
  /**
   * Get all transactions for a user with optional filtering and pagination
   */
  static async getTransactions(
    userId: string,
    query: z.infer<typeof TransactionQuerySchema>,
  ): Promise<{ transactions: TransactionWithCategory[]; total: number }> {
    try {
      const {
        page,
        limit,
        type,
        status,
        categoryId,
        startDate,
        endDate,
        search,
        sortBy,
        sortOrder,
      } = query;
      const offset = (page - 1) * limit;

      // Build where conditions
      const whereConditions = [eq(transactions.userId, userId)];

      if (type) {
        whereConditions.push(eq(transactions.type, type));
      }

      if (status) {
        whereConditions.push(eq(transactions.status, status));
      }

      if (categoryId) {
        whereConditions.push(eq(transactions.categoryId, categoryId));
      }

      if (startDate) {
        whereConditions.push(gte(transactions.date, startDate));
      }

      if (endDate) {
        whereConditions.push(lte(transactions.date, endDate));
      }

      if (search) {
        whereConditions.push(
          sql`(${transactions.title} ILIKE ${`%${search}%`} OR ${
            transactions.description
          } ILIKE ${`%${search}%`})`,
        );
      }

      // Build sort conditions
      const sortColumn =
        sortBy === 'date'
          ? transactions.date
          : sortBy === 'amount'
          ? transactions.amount
          : sortBy === 'title'
          ? transactions.title
          : transactions.createdAt;
      const sortDirection = sortOrder === 'asc' ? asc : desc;

      // Get transactions with category information
      const transactionsQuery = db
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
        .where(and(...whereConditions))
        .orderBy(sortDirection(sortColumn))
        .limit(limit)
        .offset(offset);

      // Get total count
      const totalQuery = db
        .select({ count: count() })
        .from(transactions)
        .where(and(...whereConditions));

      const [transactionsResult, totalResult] = await Promise.all([
        transactionsQuery,
        totalQuery,
      ]);

      return {
        transactions: transactionsResult as TransactionWithCategory[],
        total: totalResult[0]?.count || 0,
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  }

  /**
   * Get a single transaction by ID
   */
  static async getTransactionById(
    userId: string,
    transactionId: string,
  ): Promise<TransactionWithCategory | null> {
    try {
      const result = await db
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

      return (result[0] as TransactionWithCategory) || null;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw new Error('Failed to fetch transaction');
    }
  }

  /**
   * Create a new transaction
   */
  static async createTransaction(
    userId: string,
    transactionData: Omit<
      NewTransaction,
      'id' | 'userId' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<Transaction> {
    try {
      // Verify that the category belongs to the user
      const category = await db
        .select()
        .from(categories)
        .where(
          and(
            eq(categories.id, transactionData.categoryId),
            eq(categories.userId, userId),
          ),
        )
        .limit(1);

      if (category.length === 0) {
        throw new Error('Category not found or access denied');
      }

      // Validate that transaction type matches category type
      if (category[0].type !== transactionData.type) {
        throw new Error('Transaction type must match category type');
      }

      const [newTransaction] = await db
        .insert(transactions)
        .values({
          ...transactionData,
          userId,
          updatedAt: new Date(),
        })
        .returning();

      return newTransaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create transaction');
    }
  }

  /**
   * Update a transaction
   */
  static async updateTransaction(
    userId: string,
    transactionId: string,
    updates: Partial<Omit<NewTransaction, 'id' | 'userId' | 'createdAt'>>,
  ): Promise<Transaction | null> {
    try {
      // Check if transaction exists and belongs to user
      const existingTransaction = await db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.id, transactionId),
            eq(transactions.userId, userId),
          ),
        )
        .limit(1);

      if (existingTransaction.length === 0) {
        throw new Error('Transaction not found or access denied');
      }

      // If updating category, verify it belongs to user and type matches
      if (updates.categoryId) {
        const category = await db
          .select()
          .from(categories)
          .where(
            and(
              eq(categories.id, updates.categoryId),
              eq(categories.userId, userId),
            ),
          )
          .limit(1);

        if (category.length === 0) {
          throw new Error('Category not found or access denied');
        }

        const transactionType = updates.type || existingTransaction[0].type;
        if (category[0].type !== transactionType) {
          throw new Error('Transaction type must match category type');
        }
      }

      const [updatedTransaction] = await db
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

      return updatedTransaction || null;
    } catch (error) {
      console.error('Error updating transaction:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update transaction');
    }
  }

  /**
   * Delete a transaction
   */
  static async deleteTransaction(
    userId: string,
    transactionId: string,
  ): Promise<boolean> {
    try {
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
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw new Error('Failed to delete transaction');
    }
  }

  /**
   * Get transaction statistics for dashboard
   */
  static async getTransactionStats(
    userId: string,
    period?: 'week' | 'month' | 'year',
  ): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
    transactionCount: number;
    averageIncome: number;
    averageExpense: number;
    topCategory: string | null;
    recentTransactions: number;
  }> {
    try {
      let dateFilter = sql`1=1`;

      if (period === 'week') {
        dateFilter = sql`${transactions.date} >= DATE_TRUNC('week', CURRENT_DATE)`;
      } else if (period === 'month') {
        dateFilter = sql`${transactions.date} >= DATE_TRUNC('month', CURRENT_DATE)`;
      } else if (period === 'year') {
        dateFilter = sql`${transactions.date} >= DATE_TRUNC('year', CURRENT_DATE)`;
      }

      const stats = await db
        .select({
          totalIncome: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount}::numeric ELSE 0 END), 0)`,
          totalExpenses: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount}::numeric ELSE 0 END), 0)`,
          transactionCount: count(),
          averageIncome: sql<number>`COALESCE(AVG(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount}::numeric END), 0)`,
          averageExpense: sql<number>`COALESCE(AVG(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount}::numeric END), 0)`,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            eq(transactions.status, 'completed'),
            dateFilter,
          ),
        );

      // Get top category
      const topCategoryResult = await db
        .select({
          categoryName: categories.name,
          totalAmount: sql<number>`SUM(${transactions.amount}::numeric)`,
        })
        .from(transactions)
        .innerJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            eq(transactions.userId, userId),
            eq(transactions.status, 'completed'),
            eq(transactions.type, 'expense'),
            dateFilter,
          ),
        )
        .groupBy(categories.name)
        .orderBy(desc(sql`SUM(${transactions.amount}::numeric)`))
        .limit(1);

      // Get recent transactions count (last 7 days)
      const recentTransactionsResult = await db
        .select({ count: count() })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            gte(transactions.date, sql`CURRENT_DATE - INTERVAL '7 days'`),
          ),
        );

      const baseStats = stats[0] || {
        totalIncome: 0,
        totalExpenses: 0,
        transactionCount: 0,
        averageIncome: 0,
        averageExpense: 0,
      };

      return {
        ...baseStats,
        netAmount: baseStats.totalIncome - baseStats.totalExpenses,
        topCategory: topCategoryResult[0]?.categoryName || null,
        recentTransactions: recentTransactionsResult[0]?.count || 0,
      };
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      throw new Error('Failed to fetch transaction statistics');
    }
  }

  /**
   * Get monthly transaction summary
   */
  static async getMonthlyTransactionSummary(
    userId: string,
    year?: number,
  ): Promise<
    Array<{
      month: number;
      year: number;
      income: number;
      expenses: number;
      net: number;
      transactionCount: number;
    }>
  > {
    try {
      const targetYear = year || new Date().getFullYear();

      const result = await db
        .select({
          month: sql<number>`EXTRACT(MONTH FROM ${transactions.date})`,
          year: sql<number>`EXTRACT(YEAR FROM ${transactions.date})`,
          income: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount}::numeric ELSE 0 END), 0)`,
          expenses: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount}::numeric ELSE 0 END), 0)`,
          transactionCount: count(),
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            eq(transactions.status, 'completed'),
            sql`EXTRACT(YEAR FROM ${transactions.date}) = ${targetYear}`,
          ),
        )
        .groupBy(
          sql`EXTRACT(MONTH FROM ${transactions.date})`,
          sql`EXTRACT(YEAR FROM ${transactions.date})`,
        )
        .orderBy(sql`EXTRACT(MONTH FROM ${transactions.date})`);

      return result.map(row => ({
        ...row,
        net: row.income - row.expenses,
      }));
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
      throw new Error('Failed to fetch monthly transaction summary');
    }
  }

  /**
   * Get category spending analysis
   */
  static async getCategorySpendingAnalysis(
    userId: string,
    period?: 'month' | 'year',
  ): Promise<
    Array<{
      categoryId: string;
      categoryName: string;
      categoryIcon: string | null;
      totalAmount: number;
      transactionCount: number;
      averageAmount: number;
      percentage: number;
    }>
  > {
    try {
      let dateFilter = sql`1=1`;

      if (period === 'month') {
        dateFilter = sql`${transactions.date} >= DATE_TRUNC('month', CURRENT_DATE)`;
      } else if (period === 'year') {
        dateFilter = sql`${transactions.date} >= DATE_TRUNC('year', CURRENT_DATE)`;
      }

      const result = await db
        .select({
          categoryId: categories.id,
          categoryName: categories.name,
          categoryIcon: categories.icon,
          totalAmount: sql<number>`SUM(${transactions.amount}::numeric)`,
          transactionCount: count(),
          averageAmount: sql<number>`AVG(${transactions.amount}::numeric)`,
        })
        .from(transactions)
        .innerJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            eq(transactions.userId, userId),
            eq(transactions.status, 'completed'),
            eq(transactions.type, 'expense'),
            dateFilter,
          ),
        )
        .groupBy(categories.id, categories.name, categories.icon)
        .orderBy(desc(sql`SUM(${transactions.amount}::numeric)`));

      // Calculate total for percentage calculation
      const total = result.reduce((sum, item) => sum + item.totalAmount, 0);

      return result.map(item => ({
        ...item,
        percentage: total > 0 ? (item.totalAmount / total) * 100 : 0,
      }));
    } catch (error) {
      console.error('Error fetching category analysis:', error);
      throw new Error('Failed to fetch category spending analysis');
    }
  }
}
