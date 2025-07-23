# 🎨 Simple Frontend Architecture

## Overview
The frontend architecture prioritizes clean, reusable hooks and straightforward components that integrate seamlessly with our simple backend. Built with React, Next.js, and TypeScript for a modern, type-safe development experience.

## 📁 Frontend Structure

```
components/
├── ui/                    # Reusable UI components (Shadcn/ui)
├── Category/             # Category-specific components
├── Dashboard.tsx         # Main dashboard component
├── TransactionForm.tsx   # Transaction creation form
└── Chart.tsx            # Data visualization component

hooks/
├── use-api.ts           # Base data fetching hooks
├── use-user.ts          # User session management
├── use-categories.ts    # Category operations
└── use-transactions.ts  # Transaction operations

app/
├── (auth)/              # Authentication pages
├── (main)/              # Protected application pages
└── api/                 # API route handlers
```

## 🔧 Core Hooks Architecture

### 1. Base Data Hooks (`hooks/use-api.ts`)

**Simple Data Fetching:**
```typescript
export function useFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result.data || result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
```

**Action Hook for Mutations:**
```typescript
export function useAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T>(action: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await action();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}
```

### 2. User Management (`hooks/use-user.ts`)

**Simple User Session Hook:**
```typescript
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (mounted) {
          if (error) {
            console.error('Error fetching user:', error);
            setUser(null);
          } else {
            setUser(user);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in useUser:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    getUser();

    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading };
}
```

### 3. Category Operations (`hooks/use-categories.ts`)

**Category Listing with Filtering:**
```typescript
export function useCategories(
  userId: string | undefined, 
  query: CategoryQuery
) {
  const url = userId ? `/api/categories?${new URLSearchParams({
    page: query.page.toString(),
    limit: query.limit.toString(),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    ...(query.type && { type: query.type }),
    ...(query.status && { status: query.status }),
    ...(query.search && { search: query.search }),
  })}` : '';

  return useFetch<{ categories: CategoryWithStats[]; total: number }>(url);
}
```

**Category CRUD Actions:**
```typescript
export function useCategoryActions() {
  const { execute, loading, error } = useAction();

  const createCategory = async (data: {
    name: string;
    type: 'income' | 'expense';
    description?: string;
    icon?: string;
    color?: string;
    budget?: number;
  }) => {
    return execute(async () => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
      }
      
      return response.json();
    });
  };

  const updateCategory = async (categoryId: string, data: Partial<CategoryData>) => {
    return execute(async () => {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update category');
      }
      
      return response.json();
    });
  };

  return { createCategory, updateCategory, loading, error };
}
```

### 4. Transaction Operations (`hooks/use-transactions.ts`)

**Advanced Transaction Queries:**
```typescript
export function useTransactions(
  userId: string | undefined, 
  query: TransactionQuery
) {
  const url = userId ? `/api/transactions?${new URLSearchParams({
    page: query.page.toString(),
    limit: query.limit.toString(),
    ...(query.search && { search: query.search }),
    ...(query.type && { type: query.type }),
    ...(query.status && { status: query.status }),
    ...(query.categoryId && { categoryId: query.categoryId }),
    ...(query.startDate && { startDate: query.startDate }),
    ...(query.endDate && { endDate: query.endDate }),
    ...(query.sortBy && { sortBy: query.sortBy }),
    ...(query.sortOrder && { sortOrder: query.sortOrder }),
  })}` : '';

  return useFetch<{ transactions: TransactionWithCategory[]; total: number }>(url);
}
```

## 🧩 Component Architecture

### 1. Transaction Form (`components/TransactionForm.tsx`)

**Key Features:**
- Real-time validation with Zod schemas
- Category filtering based on transaction type
- Automatic form reset on success
- Comprehensive error handling

**Form State Management:**
```typescript
const [formData, setFormData] = useState({
  title: '',
  amount: '',
  type: 'expense' as 'income' | 'expense',
  categoryId: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
  location: '',
  paymentMethod: '',
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Client-side validation
  if (!formData.title || !formData.amount || !formData.categoryId) {
    toast.error('Please fill in all required fields');
    return;
  }

  const amount = parseFloat(formData.amount);
  if (isNaN(amount) || amount <= 0) {
    toast.error('Please enter a valid amount');
    return;
  }

  try {
    await createTransaction(formData);
    toast.success('Transaction created successfully');
    
    // Reset form on success
    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      categoryId: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      location: '',
      paymentMethod: '',
    });
    
    onSuccess?.();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to create transaction');
  }
};
```

### 2. Dashboard Component (`components/Dashboard.tsx`)

**Real-time Statistics Calculation:**
```typescript
const stats: DashboardStats = useMemo(() => {
  if (!transactionsData?.transactions) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      transactionCount: 0,
      categoryCount: 0,
    };
  }

  const income = transactionsData.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const expenses = transactionsData.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return {
    totalIncome: income,
    totalExpenses: expenses,
    balance: income - expenses,
    transactionCount: transactionsData.total,
    categoryCount: categoriesData?.total || 0,
  };
}, [transactionsData, categoriesData]);
```

**Dynamic Transaction Display:**
```typescript
{!transactionsData?.transactions?.length ? (
  <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
    <div className="text-center">
      <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-600 font-medium">No transactions yet</p>
      <p className="text-sm text-gray-500">Start by adding your first transaction</p>
      <Button variant="ghost" size="sm" className="mt-3">Add Transaction</Button>
    </div>
  </div>
) : (
  <div className="space-y-3">
    {transactionsData.transactions.map((transaction) => (
      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
            {transaction.type === 'income' ? 
              <ArrowUpRight className="w-4 h-4 text-green-600" /> : 
              <ArrowDownRight className="w-4 h-4 text-red-600" />
            }
          </div>
          <div>
            <p className="font-medium text-gray-900">{transaction.title}</p>
            <p className="text-sm text-gray-500">{transaction.category?.name || 'No category'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(transaction.amount))}
          </p>
          <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
        </div>
      </div>
    ))}
  </div>
)}
```

## 🎯 Design Patterns

### 1. **Hook Composition Pattern**
```typescript
// Compose multiple hooks for complex components
function TransactionManagement() {
  const { user } = useUser();
  const { data: transactions, refetch } = useTransactions(user?.id, query);
  const { createTransaction, loading } = useTransactionActions();
  
  // Component logic using composed hooks
}
```

### 2. **Error Boundary Pattern**
```typescript
// Consistent error handling across hooks
const { execute, loading, error } = useAction();

// Usage with proper error propagation
try {
  await execute(async () => {
    const response = await fetch('/api/endpoint');
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  });
} catch (error) {
  // Error is automatically set in hook state
  toast.error(error.message);
}
```

### 3. **Loading State Pattern**
```typescript
// Unified loading states across the app
function DataComponent() {
  const { data, loading, error } = useFetch('/api/data');
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;
  
  return <DataDisplay data={data} />;
}
```

## 🔄 Data Flow

```
User Action → Hook (useAction) → API Call → Backend Service → Database
                ↓
Toast Notification ← UI Update ← Hook State Update ← API Response
```

## 🎨 Styling Architecture

### Tailwind CSS Classes
- **Consistent spacing**: `p-4`, `m-6`, `space-y-4`
- **Color scheme**: `bg-gray-50`, `text-gray-900`, `border-gray-300`
- **Responsive design**: `grid-cols-1 md:grid-cols-3`
- **Interactive states**: `hover:shadow-md`, `transition-colors`

### Component Styling Pattern
```typescript
// Consistent card styling
<Card className="shadow-sm hover:shadow-md transition-shadow">
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium opacity-90">Title</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">{value}</div>
  </CardContent>
</Card>
```

## 🏆 Benefits of This Architecture

### ✅ **Developer Experience**
- **Type Safety**: Full TypeScript coverage with proper interfaces
- **Code Reuse**: Hooks can be used across multiple components
- **Debugging**: Clear separation between data logic and UI logic
- **Testing**: Each hook can be tested independently

### ✅ **Performance**
- **Optimized Renders**: useMemo and useCallback for expensive operations
- **Efficient Updates**: Only re-render when relevant data changes
- **Smart Caching**: Data fetching hooks prevent unnecessary API calls

### ✅ **Maintainability**
- **Single Responsibility**: Each hook has one clear purpose
- **Consistent Patterns**: Same approach for all CRUD operations
- **Easy Extension**: Adding new features follows established patterns

### ✅ **User Experience**
- **Loading States**: Immediate feedback for all async operations
- **Error Handling**: Graceful error messages and recovery
- **Optimistic Updates**: Instant UI feedback where appropriate

This frontend architecture provides a solid foundation for building maintainable, performant, and user-friendly React applications with TypeScript and modern React patterns.
