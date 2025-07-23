import { eq, and, desc, asc, sql, gte, count } from 'drizzle-orm';
import { db } from '../db';
import { categories, transactions } from '../db/schema';
import type {
  Category,
  NewCategory,
  CategoryWithStats,
  CategoryQuerySchema,
} from '../types/database';
import { z } from 'zod';

export class CategoryService {
  /**
   * Get all categories for a user with optional filtering and pagination
   */
  static async getCategories(
    userId: string,
    query: z.infer<typeof CategoryQuerySchema>,
  ): Promise<{ categories: CategoryWithStats[]; total: number }> {
    try {
      const { page, limit, type, status, search, sortBy, sortOrder } = query;
      const offset = (page - 1) * limit;

      // Build where conditions
      const whereConditions = [eq(categories.userId, userId)];

      if (type) {
        whereConditions.push(eq(categories.type, type));
      }

      if (status) {
        whereConditions.push(eq(categories.status, status));
      }

      if (search) {
        whereConditions.push(
          sql`(${categories.name} ILIKE ${`%${search}%`} OR ${
            categories.description
          } ILIKE ${`%${search}%`})`,
        );
      }

      // Build sort conditions
      const sortColumn =
        sortBy === 'name'
          ? categories.name
          : sortBy === 'type'
          ? categories.type
          : categories.createdAt;
      const sortDirection = sortOrder === 'asc' ? asc : desc;

      // Get categories with transaction stats
      const categoriesQuery = db
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
        .where(and(...whereConditions))
        .groupBy(categories.id)
        .orderBy(sortDirection(sortColumn))
        .limit(limit)
        .offset(offset);

      // Get total count
      const totalQuery = db
        .select({ count: count() })
        .from(categories)
        .where(and(...whereConditions));

      const [categoriesResult, totalResult] = await Promise.all([
        categoriesQuery,
        totalQuery,
      ]);

      return {
        categories: categoriesResult as CategoryWithStats[],
        total: totalResult[0]?.count || 0,
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  /**
   * Get a single category by ID
   */
  static async getCategoryById(
    userId: string,
    categoryId: string,
  ): Promise<CategoryWithStats | null> {
    try {
      const result = await db
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
        .where(
          and(eq(categories.id, categoryId), eq(categories.userId, userId)),
        )
        .groupBy(categories.id)
        .limit(1);

      return (result[0] as CategoryWithStats) || null;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new Error('Failed to fetch category');
    }
  }

  /**
   * Create a new category
   */
  static async createCategory(
    userId: string,
    categoryData: Omit<
      NewCategory,
      'id' | 'userId' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<Category> {
    try {
      // Check if category name already exists for this user
      const existingCategory = await db
        .select()
        .from(categories)
        .where(
          and(
            eq(categories.userId, userId),
            eq(categories.name, categoryData.name),
            eq(categories.type, categoryData.type),
          ),
        )
        .limit(1);

      if (existingCategory.length > 0) {
        throw new Error('Category with this name already exists for this type');
      }

      const [newCategory] = await db
        .insert(categories)
        .values({
          ...categoryData,
          userId,
          updatedAt: new Date(),
        })
        .returning();

      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create category');
    }
  }

  /**
   * Update a category
   */
  static async updateCategory(
    userId: string,
    categoryId: string,
    updates: Partial<Omit<NewCategory, 'id' | 'userId' | 'createdAt'>>,
  ): Promise<Category | null> {
    try {
      // Check if category exists and belongs to user
      const existingCategory = await db
        .select()
        .from(categories)
        .where(
          and(eq(categories.id, categoryId), eq(categories.userId, userId)),
        )
        .limit(1);

      if (existingCategory.length === 0) {
        throw new Error('Category not found or access denied');
      }

      // If updating name, check for duplicates
      if (updates.name && updates.name !== existingCategory[0].name) {
        const duplicateCategory = await db
          .select()
          .from(categories)
          .where(
            and(
              eq(categories.userId, userId),
              eq(categories.name, updates.name),
              eq(categories.type, updates.type || existingCategory[0].type),
            ),
          )
          .limit(1);

        if (duplicateCategory.length > 0) {
          throw new Error(
            'Category with this name already exists for this type',
          );
        }
      }

      const [updatedCategory] = await db
        .update(categories)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(
          and(eq(categories.id, categoryId), eq(categories.userId, userId)),
        )
        .returning();

      return updatedCategory || null;
    } catch (error) {
      console.error('Error updating category:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update category');
    }
  }

  /**
   * Delete a category (soft delete by setting status to archived)
   */
  static async deleteCategory(
    userId: string,
    categoryId: string,
  ): Promise<boolean> {
    try {
      // Check if category has transactions
      const transactionCount = await db
        .select({ count: count() })
        .from(transactions)
        .where(eq(transactions.categoryId, categoryId));

      if (transactionCount[0]?.count > 0) {
        // Soft delete - archive the category instead of hard delete
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
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }

  /**
   * Get category statistics for dashboard
   */
  static async getCategoryStats(userId: string): Promise<{
    totalCategories: number;
    incomeCategories: number;
    expenseCategories: number;
    totalBudget: number;
    activeBudgets: number;
  }> {
    try {
      const stats = await db
        .select({
          totalCategories: count(),
          incomeCategories: sql<number>`SUM(CASE WHEN ${categories.type} = 'income' THEN 1 ELSE 0 END)`,
          expenseCategories: sql<number>`SUM(CASE WHEN ${categories.type} = 'expense' THEN 1 ELSE 0 END)`,
          totalBudget: sql<number>`COALESCE(SUM(${categories.budget}::numeric), 0)`,
          activeBudgets: sql<number>`SUM(CASE WHEN ${categories.budget} IS NOT NULL AND ${categories.status} = 'active' THEN 1 ELSE 0 END)`,
        })
        .from(categories)
        .where(
          and(eq(categories.userId, userId), eq(categories.status, 'active')),
        );

      return (
        stats[0] || {
          totalCategories: 0,
          incomeCategories: 0,
          expenseCategories: 0,
          totalBudget: 0,
          activeBudgets: 0,
        }
      );
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw new Error('Failed to fetch category statistics');
    }
  }

  /**
   * Get categories with budget utilization
   */
  static async getCategoriesWithBudgetUtilization(
    userId: string,
  ): Promise<CategoryWithStats[]> {
    try {
      const result = await db
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
        .leftJoin(
          transactions,
          and(
            eq(categories.id, transactions.categoryId),
            gte(transactions.date, sql`DATE_TRUNC('month', CURRENT_DATE)`),
          ),
        )
        .where(
          and(
            eq(categories.userId, userId),
            eq(categories.status, 'active'),
            sql`${categories.budget} IS NOT NULL`,
          ),
        )
        .groupBy(categories.id)
        .orderBy(
          desc(
            sql`(COALESCE(SUM(${transactions.amount}::numeric), 0) / ${categories.budget}::numeric)`,
          ),
        );

      return result as CategoryWithStats[];
    } catch (error) {
      console.error('Error fetching budget utilization:', error);
      throw new Error('Failed to fetch budget utilization');
    }
  }
}
