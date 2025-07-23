import { eq, and, desc, asc, sql, count } from 'drizzle-orm';
import { db } from '../db';
import { categories, transactions } from '../db/schema';
import { ServiceUtils } from './baseService';
import type {
  Category,
  NewCategory,
  CategoryWithStats,
  CategoryQuerySchema,
} from '../types/database';

export class CategoryService {
  /**
   * Get categories with filtering and pagination
   */
  async getCategories(
    userId: string,
    query: typeof CategoryQuerySchema._type,
  ): Promise<{ categories: CategoryWithStats[]; total: number }> {
    if (!ServiceUtils.isValidUUID(userId)) {
      throw new Error('Invalid user ID');
    }

    ServiceUtils.validatePagination(query.page, query.limit);
    const offset = (query.page - 1) * query.limit;

    // Build filters
    const filters = [eq(categories.userId, userId)];

    if (query.type) filters.push(eq(categories.type, query.type));
    if (query.status) filters.push(eq(categories.status, query.status));
    if (query.search) {
      const searchTerm = ServiceUtils.sanitizeSearch(query.search);
      if (searchTerm) {
        filters.push(
          sql`(${categories.name} ILIKE ${`%${searchTerm}%`} OR ${
            categories.description
          } ILIKE ${`%${searchTerm}%`})`,
        );
      }
    }

    // Sort options
    const sortColumn =
      query.sortBy === 'name'
        ? categories.name
        : query.sortBy === 'type'
        ? categories.type
        : categories.createdAt;
    const sortDir = query.sortOrder === 'asc' ? asc : desc;

    // Execute queries
    const [results, [{ total }]] = await Promise.all([
      db
        .select({
          id: categories.id,
          name: categories.name,
          description: categories.description,
          type: categories.type,
          icon: categories.icon,
          color: categories.color,
          budget: categories.budget,
          status: categories.status,
          priority: categories.priority,
          tags: categories.tags,
          metadata: categories.metadata,
          userId: categories.userId,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt,
          totalAmount: sql<number>`COALESCE(SUM(${transactions.amount}::numeric), 0)`,
          transactionCount: sql<number>`COUNT(${transactions.id})`,
          averageAmount: sql<number>`COALESCE(AVG(${transactions.amount}::numeric), 0)`,
          lastTransactionDate: sql<string | null>`MAX(${transactions.date})`,
        })
        .from(categories)
        .leftJoin(transactions, eq(categories.id, transactions.categoryId))
        .where(and(...filters))
        .groupBy(categories.id)
        .orderBy(sortDir(sortColumn))
        .limit(query.limit)
        .offset(offset),

      db
        .select({ total: count() })
        .from(categories)
        .where(and(...filters)),
    ]);

    return { categories: results as CategoryWithStats[], total };
  }

  /**
   * Get single category by ID
   */
  async getCategoryById(
    userId: string,
    categoryId: string,
  ): Promise<CategoryWithStats | null> {
    if (
      !ServiceUtils.isValidUUID(userId) ||
      !ServiceUtils.isValidUUID(categoryId)
    ) {
      throw new Error('Invalid ID format');
    }

    const [result] = await db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        type: categories.type,
        icon: categories.icon,
        color: categories.color,
        budget: categories.budget,
        status: categories.status,
        priority: categories.priority,
        tags: categories.tags,
        metadata: categories.metadata,
        userId: categories.userId,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        totalAmount: sql<number>`COALESCE(SUM(${transactions.amount}::numeric), 0)`,
        transactionCount: sql<number>`COUNT(${transactions.id})`,
        averageAmount: sql<number>`COALESCE(AVG(${transactions.amount}::numeric), 0)`,
        lastTransactionDate: sql<string | null>`MAX(${transactions.date})`,
      })
      .from(categories)
      .leftJoin(transactions, eq(categories.id, transactions.categoryId))
      .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
      .groupBy(categories.id)
      .limit(1);

    return (result as CategoryWithStats) || null;
  }

  /**
   * Create new category
   */
  async createCategory(
    userId: string,
    data: Omit<NewCategory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  ): Promise<Category> {
    if (!ServiceUtils.isValidUUID(userId)) {
      throw new Error('Invalid user ID');
    }

    // Check for duplicate name
    const [existing] = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.userId, userId),
          eq(categories.name, data.name),
          eq(categories.type, data.type),
        ),
      )
      .limit(1);

    if (existing) {
      throw new Error('Category with this name already exists for this type');
    }

    const [newCategory] = await db
      .insert(categories)
      .values({
        ...data,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return newCategory;
  }

  /**
   * Update category
   */
  async updateCategory(
    userId: string,
    categoryId: string,
    updates: Partial<Omit<NewCategory, 'id' | 'userId' | 'createdAt'>>,
  ): Promise<Category | null> {
    if (
      !ServiceUtils.isValidUUID(userId) ||
      !ServiceUtils.isValidUUID(categoryId)
    ) {
      throw new Error('Invalid ID format');
    }

    // Check if category exists
    const [existing] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
      .limit(1);

    if (!existing) {
      throw new Error('Category not found');
    }

    // Check for duplicate name if updating name
    if (updates.name && updates.name !== existing.name) {
      const [duplicate] = await db
        .select()
        .from(categories)
        .where(
          and(
            eq(categories.userId, userId),
            eq(categories.name, updates.name),
            eq(categories.type, updates.type || existing.type),
            sql`${categories.id} != ${categoryId}`,
          ),
        )
        .limit(1);

      if (duplicate) {
        throw new Error('Category with this name already exists for this type');
      }
    }

    const [updated] = await db
      .update(categories)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
      .returning();

    return updated || null;
  }

  /**
   * Delete category (archive if has transactions)
   */
  async deleteCategory(userId: string, categoryId: string): Promise<boolean> {
    if (
      !ServiceUtils.isValidUUID(userId) ||
      !ServiceUtils.isValidUUID(categoryId)
    ) {
      throw new Error('Invalid ID format');
    }

    // Check if category has transactions
    const [{ transactionCount }] = await db
      .select({ transactionCount: count() })
      .from(transactions)
      .where(eq(transactions.categoryId, categoryId));

    if (transactionCount > 0) {
      // Archive instead of delete
      const result = await db
        .update(categories)
        .set({
          status: 'archived',
          updatedAt: new Date(),
        })
        .where(
          and(eq(categories.id, categoryId), eq(categories.userId, userId)),
        )
        .returning();

      return result.length > 0;
    } else {
      // Hard delete if no transactions
      const result = await db
        .delete(categories)
        .where(
          and(eq(categories.id, categoryId), eq(categories.userId, userId)),
        )
        .returning();

      return result.length > 0;
    }
  }

  /**
   * Get basic category stats
   */
  async getStats(userId: string): Promise<{
    totalCategories: number;
    incomeCategories: number;
    expenseCategories: number;
  }> {
    if (!ServiceUtils.isValidUUID(userId)) {
      throw new Error('Invalid user ID');
    }

    const [stats] = await db
      .select({
        totalCategories: count(),
        incomeCategories: sql<number>`SUM(CASE WHEN ${categories.type} = 'income' THEN 1 ELSE 0 END)`,
        expenseCategories: sql<number>`SUM(CASE WHEN ${categories.type} = 'expense' THEN 1 ELSE 0 END)`,
      })
      .from(categories)
      .where(
        and(eq(categories.userId, userId), eq(categories.status, 'active')),
      );

    return (
      stats || { totalCategories: 0, incomeCategories: 0, expenseCategories: 0 }
    );
  }
}
