# Budget Tracker Backend API Documentation

## Overview

This budget tracker application provides a robust, secure, and scalable backend with complete CRUD operations for categories and transactions. Each user has isolated data with multi-user support through Supabase authentication.

## Features

### ✅ **Reliability**
- Type-safe operations with TypeScript and Zod validation
- Comprehensive error handling with detailed error messages
- Database transactions for data consistency
- Input sanitization and validation at multiple levels

### ✅ **Security**
- JWT-based authentication via Supabase
- User data isolation (each user can only access their own data)
- Input validation and sanitization
- Protected API routes with authentication middleware
- Rate limiting protection
- CORS configuration

### ✅ **Maintainability**
- Modular service layer architecture
- Consistent API response format
- Comprehensive TypeScript types
- Clean separation of concerns
- Detailed documentation and comments

### ✅ **Uniqueness**
- Advanced category analytics and budget tracking
- Flexible transaction metadata system
- Multi-currency support
- Tag-based transaction organization
- Goal tracking and progress monitoring

## Database Schema

### Tables

#### `profiles`
User profile information linked to Supabase auth.
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `displayName` (Text)
- `avatar` (Text, URL)
- `preferences` (JSONB)
- `createdAt`, `updatedAt` (Timestamps)

#### `categories`
User-specific expense/income categories.
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key to profiles)
- `name` (Text)
- `description` (Text)
- `color` (Text)
- `icon` (Text)
- `type` (Enum: income/expense)
- `budget` (Text, decimal as string)
- `isActive` (Boolean)
- `parentId` (UUID, Self-referencing for subcategories)
- `sortOrder` (Integer)
- `metadata` (JSONB)
- `createdAt`, `updatedAt` (Timestamps)

#### `transactions`
User financial transactions.
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key to profiles)
- `categoryId` (UUID, Foreign Key to categories)
- `amount` (Text, decimal as string)
- `title` (Text)
- `description` (Text)
- `date` (Date)
- `type` (Enum: income/expense)
- `status` (Enum: completed/pending/failed)
- `tags` (Text Array)
- `location` (Text)
- `reference` (Text)
- `metadata` (JSONB)
- `createdAt`, `updatedAt` (Timestamps)

#### `budgets`
Monthly/periodic budget tracking.
- Budget allocations and tracking per category
- Period-based budgeting (monthly, yearly)

#### `goals`
Financial goals and progress tracking.
- Savings goals with target amounts
- Progress tracking and deadlines

## API Endpoints

### Base URL
```
/api
```

### Authentication
All endpoints require authentication via Supabase JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Categories

#### `GET /api/categories`
Fetch all categories for the authenticated user.

**Query Parameters:**
- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 10) - Number of items per page
- `search` (string) - Search categories by name
- `type` (income|expense) - Filter by category type
- `isActive` (boolean) - Filter by active status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Groceries",
      "description": "Food and household items",
      "color": "#FF6B6B",
      "icon": "shopping-cart",
      "type": "expense",
      "budget": "500.00",
      "isActive": true,
      "parentId": null,
      "sortOrder": 1,
      "metadata": {},
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### `POST /api/categories`
Create a new category.

**Request Body:**
```json
{
  "name": "Groceries",
  "description": "Food and household items",
  "color": "#FF6B6B",
  "icon": "shopping-cart",
  "type": "expense",
  "budget": 500.00,
  "isActive": true,
  "parentId": null,
  "sortOrder": 1,
  "metadata": {}
}
```

#### `GET /api/categories/[id]`
Fetch a specific category by ID.

#### `PUT /api/categories/[id]`
Update a specific category.

#### `DELETE /api/categories/[id]`
Delete a specific category.

#### `GET /api/categories/stats`
Get category statistics and budget utilization.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCategories": 10,
    "activeCategories": 8,
    "totalBudget": "2500.00",
    "budgetUtilization": [
      {
        "categoryId": "uuid",
        "categoryName": "Groceries",
        "budgetAmount": "500.00",
        "spentAmount": "320.50",
        "utilizationPercent": 64.1
      }
    ]
  }
}
```

### Transactions

#### `GET /api/transactions`
Fetch all transactions for the authenticated user.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `search` (string) - Search by title/description
- `categoryId` (uuid) - Filter by category
- `type` (income|expense) - Filter by type
- `status` (completed|pending|failed) - Filter by status
- `startDate` (date) - Filter from date
- `endDate` (date) - Filter to date
- `tags` (string array) - Filter by tags

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "categoryId": "uuid",
      "amount": "50.00",
      "title": "Grocery Shopping",
      "description": "Weekly groceries",
      "date": "2024-01-15",
      "type": "expense",
      "status": "completed",
      "tags": ["groceries", "weekly"],
      "location": "Walmart",
      "reference": "TXN123",
      "metadata": {
        "paymentMethod": "credit_card",
        "merchant": "Walmart Inc."
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

#### `POST /api/transactions`
Create a new transaction.

**Request Body:**
```json
{
  "categoryId": "uuid",
  "amount": 50.00,
  "title": "Grocery Shopping",
  "description": "Weekly groceries",
  "date": "2024-01-15",
  "type": "expense",
  "status": "completed",
  "tags": ["groceries", "weekly"],
  "location": "Walmart",
  "reference": "TXN123",
  "metadata": {
    "paymentMethod": "credit_card",
    "merchant": "Walmart Inc."
  }
}
```

#### `GET /api/transactions/[id]`
Fetch a specific transaction by ID.

#### `PUT /api/transactions/[id]`
Update a specific transaction.

#### `DELETE /api/transactions/[id]`
Delete a specific transaction.

#### `GET /api/transactions/analytics`
Get transaction analytics and statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTransactions": 150,
    "totalIncome": "5000.00",
    "totalExpenses": "3200.00",
    "netAmount": "1800.00",
    "averageTransaction": "53.33",
    "categoryBreakdown": [
      {
        "categoryId": "uuid",
        "categoryName": "Groceries",
        "amount": "800.00",
        "count": 12,
        "percentage": 25.0
      }
    ],
    "monthlyTrends": [
      {
        "month": "2024-01",
        "income": "2500.00",
        "expenses": "1600.00",
        "net": "900.00"
      }
    ]
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Data Validation

All input data is validated using Zod schemas:

### Category Validation
```typescript
{
  name: string (1-100 chars),
  description: string (optional, max 500 chars),
  color: string (hex color),
  icon: string (icon name),
  type: "income" | "expense",
  budget: number (optional, positive),
  isActive: boolean (default: true),
  parentId: uuid (optional),
  sortOrder: number (optional),
  metadata: object (optional)
}
```

### Transaction Validation
```typescript
{
  categoryId: uuid (required),
  amount: number (positive, required),
  title: string (1-200 chars),
  description: string (optional, max 1000 chars),
  date: date string (ISO format),
  type: "income" | "expense",
  status: "completed" | "pending" | "failed" (default: "completed"),
  tags: string[] (optional),
  location: string (optional, max 200 chars),
  reference: string (optional, max 100 chars),
  metadata: object (optional)
}
```

## Technology Stack

- **Backend Framework**: Next.js 15 API Routes
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth (JWT)
- **Validation**: Zod
- **Language**: TypeScript
- **Runtime**: Node.js

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=your_postgres_connection_string
   ```

3. **Database Setup**
   ```bash
   # Generate migrations
   npx drizzle-kit generate
   
   # Push to database
   npx drizzle-kit push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Security Considerations

1. **Authentication**: All endpoints verify JWT tokens
2. **Authorization**: Users can only access their own data
3. **Input Validation**: All inputs are validated and sanitized
4. **Rate Limiting**: API endpoints are rate-limited
5. **CORS**: Proper CORS configuration
6. **SQL Injection**: Protected via Drizzle ORM parameterized queries
7. **XSS**: Input sanitization prevents script injection

## Performance Features

1. **Pagination**: All list endpoints support pagination
2. **Filtering**: Advanced filtering options
3. **Indexing**: Database indexes for optimal query performance
4. **Connection Pooling**: Efficient database connections
5. **Caching**: Response caching where appropriate

## Monitoring & Logging

- Comprehensive error logging
- Request/response logging
- Performance monitoring
- Database query optimization

---

This backend provides a solid foundation for a modern, secure, and scalable budget tracking application with all the requested CRUD operations and advanced features.
