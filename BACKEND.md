# 🏗️ Simple Backend Architecture

## Overview
This backend architecture prioritizes simplicity, security, and maintainability over complex patterns. It's designed for a personal budget tracker that needs to be reliable, secure, and easy to understand.

## 📁 Architecture Structure

```
src/
├── db/
│   └── schema.ts              # Database schema definitions
├── services/
│   ├── baseService.ts         # Utility functions
│   ├── categoryService.ts     # Category business logic
│   ├── transactionService.ts  # Transaction business logic
│   └── index.ts              # Service exports
└── types/
    └── database.ts           # Type definitions & validation
```

## 🛠️ Key Components

### 1. Database Schema (`src/db/schema.ts`)

**Categories Table Structure:**
```typescript
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  type: categoryTypeEnum('type').notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 10 }).default('📁'),
  color: varchar('color', { length: 7 }).default('#3B82F6'),
  budget: decimal('budget', { precision: 12, scale: 2 }),
  status: categoryStatusEnum('status').default('active'),
  priority: priorityEnum('priority').default('medium'),
  tags: jsonb('tags').$type<string[]>().default([]),
  metadata: jsonb('metadata').$type<CategoryMetadata>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

**Transactions Table Structure:**
```typescript
export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  type: transactionTypeEnum('type').notNull(),
  status: statusEnum('status').default('completed'),
  date: date('date').notNull(),
  location: varchar('location', { length: 200 }),
  paymentMethod: varchar('payment_method', { length: 50 }),
  reference: varchar('reference', { length: 100 }),
  tags: jsonb('tags').$type<string[]>().default([]),
  metadata: jsonb('metadata').$type<TransactionMetadata>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### 2. Service Utilities (`src/services/baseService.ts`)

**Input Validation & Sanitization:**
```typescript
export class ServiceUtils {
  // UUID validation for security
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return typeof uuid === 'string' && uuidRegex.test(uuid);
  }

  // Search input sanitization
  static sanitizeSearch(search: string): string | null {
    if (!search || typeof search !== 'string') return null;
    const sanitized = search.trim().replace(/[<>]/g, '');
    return sanitized.length > 0 && sanitized.length <= 100 ? sanitized : null;
  }

  // Pagination validation
  static validatePagination(page: number, limit: number): void {
    if (page < 1 || page > 1000) throw new Error('Invalid page number');
    if (limit < 1 || limit > 100) throw new Error('Invalid limit');
  }
}
```

### 3. Category Service (`src/services/categoryService.ts`)

**Key Methods:**
```typescript
export class CategoryService {
  // Get categories with filtering and pagination
  async getCategories(
    userId: string,
    query: CategoryQuery
  ): Promise<{ categories: CategoryWithStats[]; total: number }> {
    // Input validation
    if (!ServiceUtils.isValidUUID(userId)) {
      throw new Error('Invalid user ID');
    }
    
    // Build dynamic filters
    const filters = [eq(categories.userId, userId)];
    if (query.type) filters.push(eq(categories.type, query.type));
    if (query.status) filters.push(eq(categories.status, query.status));
    
    // Execute query with statistics
    const results = await db
      .select({
        ...getTableColumns(categories),
        transactionCount: count(transactions.id),
        totalAmount: sql<string>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(categories)
      .leftJoin(transactions, eq(categories.id, transactions.categoryId))
      .where(and(...filters))
      .groupBy(categories.id)
      .orderBy(sortColumn)
      .limit(query.limit)
      .offset(offset);
    
    return { categories: results as CategoryWithStats[], total };
  }

  // Create new category with validation
  async createCategory(userId: string, data: NewCategoryData): Promise<Category> {
    if (!ServiceUtils.isValidUUID(userId)) {
      throw new Error('Invalid user ID');
    }

    // Check for duplicate names
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(
        and(
          eq(categories.userId, userId),
          eq(categories.name, data.name),
          eq(categories.type, data.type)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      throw new Error(`Category '${data.name}' already exists for ${data.type}`);
    }

    // Insert with proper data transformation
    const [category] = await db
      .insert(categories)
      .values({
        userId,
        ...data,
        budget: data.budget ? data.budget.toString() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return category;
  }
}
```

### 4. Transaction Service (`src/services/transactionService.ts`)

**Advanced Query Building:**
```typescript
export class TransactionService {
  async getTransactions(
    userId: string,
    query: TransactionQuery
  ): Promise<{ transactions: TransactionWithCategory[]; total: number }> {
    // Security validation
    if (!ServiceUtils.isValidUUID(userId)) {
      throw new Error('Invalid user ID');
    }

    // Dynamic filter building
    const filters = [eq(transactions.userId, userId)];
    
    if (query.type) filters.push(eq(transactions.type, query.type));
    if (query.status) filters.push(eq(transactions.status, query.status));
    if (query.categoryId) filters.push(eq(transactions.categoryId, query.categoryId));
    if (query.startDate) filters.push(gte(transactions.date, query.startDate));
    if (query.endDate) filters.push(lte(transactions.date, query.endDate));
    
    // Advanced search functionality
    if (query.search) {
      const searchTerm = ServiceUtils.sanitizeSearch(query.search);
      if (searchTerm) {
        filters.push(
          sql`(${transactions.title} ILIKE ${`%${searchTerm}%`} OR ${
            transactions.description
          } ILIKE ${`%${searchTerm}%`})`
        );
      }
    }

    // Join with categories for complete data
    const results = await db
      .select({
        ...getTableColumns(transactions),
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(...filters))
      .orderBy(sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn))
      .limit(query.limit)
      .offset(offset);

    return { 
      transactions: results as TransactionWithCategory[], 
      total: await this.getTotalCount(userId, filters) 
    };
  }

  // Statistics calculation
  async getStats(userId: string): Promise<TransactionStats> {
    if (!ServiceUtils.isValidUUID(userId)) {
      throw new Error('Invalid user ID');
    }

    const [stats] = await db
      .select({
        totalTransactions: count(transactions.id),
        totalIncome: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END), 0)`,
        totalExpenses: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END), 0)`,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId));

    return {
      ...stats,
      netAmount: stats.totalIncome - stats.totalExpenses,
    };
  }
}
```

### 5. Type Definitions (`src/types/database.ts`)

**Zod Validation Schemas:**
```typescript
// Base validation utilities
const BaseValidation = {
  uuid: () => z.string().uuid('Invalid UUID format'),
  name: (min = 1, max = 100) => z.string().min(min).max(max).trim(),
  amount: () => z.number().positive('Amount must be positive'),
  date: () => z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  color: () => z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  description: () => z.string().max(500).optional(),
  tags: () => z.array(z.string().max(50)).max(10),
  percentage: () => z.number().min(0).max(100),
  metadata: <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => 
    schema.optional().default({}),
};

// Common enums for consistency
const CommonEnums = {
  type: z.enum(['income', 'expense']),
  status: z.enum(['completed', 'pending', 'failed']),
  priority: z.enum(['low', 'medium', 'high']),
  categoryStatus: z.enum(['active', 'inactive', 'archived']),
  period: z.enum(['weekly', 'monthly', 'yearly']),
  sortOrder: z.enum(['asc', 'desc']),
};

// Transaction schema with full validation
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
  categoryId: BaseValidation.uuid(),
  metadata: BaseValidation.metadata(
    z.object({
      notes: BaseValidation.description(),
      attachments: z.array(z.string().url()).optional(),
      isRecurring: z.boolean().optional(),
      recurringConfig: z.object({
        frequency: CommonEnums.period,
        endDate: BaseValidation.date().optional(),
      }).optional(),
    })
  ),
});
```

## 🔒 Security Features

### Input Validation
- **UUID Validation**: Prevents injection attacks through ID parameters
- **Search Sanitization**: Removes dangerous characters from search inputs
- **Type Safety**: Zod schemas ensure runtime type validation
- **Length Limits**: All string inputs have maximum length constraints

### User Data Isolation
```typescript
// Every query includes user ID filtering
const filters = [eq(transactions.userId, userId)];

// Ownership verification for updates/deletes
const existing = await db
  .select({ userId: transactions.userId })
  .from(transactions)
  .where(eq(transactions.id, transactionId))
  .limit(1);

if (!existing.length || existing[0].userId !== userId) {
  throw new Error('Transaction not found');
}
```

### Error Handling
```typescript
// Standardized error responses
try {
  const result = await service.method(data);
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error('Service error:', error);
  
  if (error instanceof Error) {
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { success: false, error: 'Conflict', message: error.message },
        { status: 409 }
      );
    }
  }
  
  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
```

## 🎯 Design Principles

1. **Simplicity First**: No unnecessary abstractions or complex patterns
2. **Security by Default**: Input validation and user isolation on every operation
3. **Type Safety**: TypeScript and Zod for compile-time and runtime safety
4. **Maintainability**: Clear, readable code with consistent patterns
5. **Performance**: Efficient queries with proper indexing and pagination

## 📊 Benefits of This Architecture

- ✅ **Easy to Understand**: Clear service methods with single responsibilities
- ✅ **Secure by Design**: Built-in validation and user data protection
- ✅ **Type Safe**: Full TypeScript coverage with runtime validation
- ✅ **Maintainable**: Simple patterns that are easy to extend
- ✅ **Testable**: Services can be easily unit tested
- ✅ **Performant**: Optimized queries with proper pagination

This architecture provides a solid foundation for a personal budget tracker that prioritizes security, maintainability, and simplicity over complex enterprise patterns.