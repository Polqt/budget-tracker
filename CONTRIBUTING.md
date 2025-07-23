# 🤝 Contributing to Budget Tracker

Thank you for your interest in contributing to this personal budget tracker! This guide will help you understand our development process and how to contribute effectively.

## 🌟 Project Philosophy

This project prioritizes:

- **Simplicity over complexity**
- **Security by default**
- **Maintainable, readable code**
- **Type safety throughout**
- **Personal finance reliability**

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Git
- Supabase account (for database)

### Development Setup

1. **Fork & Clone**

   ```bash
   git clone https://github.com/your-username/budget-tracker.git
   cd budget-tracker
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env.local
   # Configure your Supabase credentials
   ```

4. **Database Setup**

   ```bash
   npm run db:push
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

## 📁 Project Structure Understanding

```
budget-tracker/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application
│   └── api/               # API endpoints
├── components/            # React components
├── hooks/                 # Custom React hooks
├── src/                   # Core business logic
│   ├── db/               # Database schema
│   ├── services/         # Business logic services
│   └── types/            # TypeScript definitions
└── docs/                 # Documentation
```

## 🛠️ Development Guidelines

### Code Style

**TypeScript First**

```typescript
// ✅ Always use proper types
interface TransactionData {
  title: string;
  amount: number;
  type: 'income' | 'expense';
}

// ❌ Avoid any types
const data: any = {}; // Don't do this
```

**Simple, Readable Functions**

```typescript
// ✅ Clear, single-purpose functions
async function createTransaction(userId: string, data: TransactionData) {
  // Validate input
  if (!ServiceUtils.isValidUUID(userId)) {
    throw new Error('Invalid user ID');
  }

  // Business logic
  return await db.insert(transactions).values({ userId, ...data });
}

// ❌ Avoid complex, multi-purpose functions
```

**Consistent Error Handling**

```typescript
// ✅ Standard error pattern
try {
  const result = await service.method(data);
  return { success: true, data: result };
} catch (error) {
  console.error('Operation failed:', error);
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error',
  };
}
```

### Component Guidelines

**Hook-First Components**

```typescript
// ✅ Use custom hooks for data logic
function TransactionList() {
  const { user } = useUser();
  const { data: transactions, loading } = useTransactions(user?.id, query);
  const { createTransaction } = useTransactionActions();

  if (loading) return <LoadingSpinner />;
  if (!transactions) return <EmptyState />;

  return <TransactionDisplay transactions={transactions} />;
}
```

**Simple, Focused Components**

```typescript
// ✅ Single responsibility components
interface TransactionCardProps {
  transaction: TransactionWithCategory;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function TransactionCard({
  transaction,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  return <Card>{/* Component implementation */}</Card>;
}
```

### Service Layer Patterns

**Instance-Based Services**

```typescript
// ✅ Use instance methods
export class TransactionService {
  async getTransactions(userId: string, query: TransactionQuery) {
    // Validation
    if (!ServiceUtils.isValidUUID(userId)) {
      throw new Error('Invalid user ID');
    }

    // Business logic
    // ...
  }
}

// Export instance for use
export const transactionService = new TransactionService();
```

**Security-First Validation**

```typescript
// ✅ Always validate user ownership
async updateTransaction(userId: string, transactionId: string, data: UpdateData) {
  // Verify ownership
  const existing = await this.getTransactionById(userId, transactionId);
  if (!existing) {
    throw new Error('Transaction not found');
  }

  // Proceed with update
  // ...
}
```

## 🔄 Development Workflow

### Branch Strategy

```bash
# Feature branch from main
git checkout -b feature/transaction-filters
git checkout -b fix/category-validation
git checkout -b docs/api-documentation
```

### Commit Convention

```bash
# Use conventional commits
git commit -m "feat: add transaction filtering by date range"
git commit -m "fix: resolve category dropdown loading issue"
git commit -m "docs: update API route documentation"
git commit -m "refactor: simplify transaction service methods"
```

### Pull Request Process

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**

   - Follow code style guidelines
   - Add/update tests if applicable
   - Update documentation

3. **Test Locally**

   ```bash
   npm run build        # Check build
   npm run type-check   # Verify types
   npm run lint         # Check linting
   ```

4. **Submit PR**
   - Clear title and description
   - Reference any related issues
   - Include screenshots for UI changes

## 🧪 Testing Guidelines

### Component Testing

```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import { TransactionForm } from './TransactionForm';

describe('TransactionForm', () => {
  it('should validate required fields', () => {
    render(<TransactionForm />);

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    expect(
      screen.getByText('Please fill in all required fields'),
    ).toBeInTheDocument();
  });
});
```

### Service Testing

```typescript
// Example service test
describe('TransactionService', () => {
  it('should create transaction with valid data', async () => {
    const userId = 'valid-uuid';
    const transactionData = {
      title: 'Test Transaction',
      amount: '100.00',
      type: 'expense' as const,
      categoryId: 'category-uuid',
      date: '2024-01-01',
    };

    const result = await transactionService.createTransaction(
      userId,
      transactionData,
    );

    expect(result.id).toBeDefined();
    expect(result.title).toBe('Test Transaction');
  });
});
```

## 📝 Documentation Standards

### Code Documentation

```typescript
/**
 * Creates a new transaction for the specified user
 *
 * @param userId - UUID of the user creating the transaction
 * @param data - Transaction data to create
 * @returns Promise resolving to the created transaction
 * @throws Error if user ID is invalid or transaction creation fails
 */
async createTransaction(userId: string, data: NewTransaction): Promise<Transaction> {
  // Implementation
}
```

### API Documentation

```typescript
/**
 * POST /api/transactions
 *
 * Creates a new transaction for the authenticated user
 *
 * @body {TransactionSchema} - Transaction data
 * @returns {Transaction} - Created transaction
 * @throws 400 - Invalid request data
 * @throws 401 - Unauthorized
 * @throws 409 - Duplicate transaction
 */
```

## 🐛 Issue Reporting

### Bug Reports

```markdown
**Bug Description**
Clear description of the issue

**Steps to Reproduce**

1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**

- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Node.js: [e.g. 18.17.0]
```

### Feature Requests

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why this feature would be valuable

**Implementation Ideas**
Any thoughts on how it could be implemented

**Alternatives Considered**
Other solutions you've considered
```

## 🔒 Security Guidelines

### Input Validation

```typescript
// ✅ Always validate and sanitize inputs
const validatedData = TransactionSchema.parse(requestBody);

// ✅ Check UUIDs
if (!ServiceUtils.isValidUUID(userId)) {
  throw new Error('Invalid user ID');
}

// ✅ Sanitize search inputs
const searchTerm = ServiceUtils.sanitizeSearch(query.search);
```

### User Data Protection

```typescript
// ✅ Always filter by user ID
const userTransactions = await db
  .select()
  .from(transactions)
  .where(eq(transactions.userId, userId)); // User isolation

// ❌ Never expose other users' data
```

## 📚 Learning Resources

### Project-Specific

- [Simple Backend Architecture](./SIMPLE_BACKEND.md)
- [Simple Frontend Architecture](./SIMPLE_FRONTEND_DETAILED.md)
- [API Routes Fix Guide](./API_ROUTES_FIX.md)

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Guide](https://orm.drizzle.team)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🎯 What We're Looking For

### High Priority

- 🐛 Bug fixes and security improvements
- 📝 Documentation improvements
- 🧪 Test coverage expansion
- ♿ Accessibility enhancements

### Medium Priority

- ✨ New features that align with simplicity goals
- 🎨 UI/UX improvements
- ⚡ Performance optimizations
- 🔧 Developer experience improvements

### Please Avoid

- 🚫 Complex architectural changes
- 🚫 Unnecessary dependencies
- 🚫 Breaking changes without discussion
- 🚫 Features that compromise security

## 💬 Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Create an Issue with the bug template
- **Features**: Create an Issue with the feature template
- **Security**: Email security concerns privately

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

---

**Thank you for contributing to making personal finance management simple, secure, and reliable! 🙏**
