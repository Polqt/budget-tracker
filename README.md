# 💰 Personal Budget Tracker

> A simple, secure, and elegant personal finance management application built with modern web technologies.

## 🌟 Overview

This budget tracker is designed with simplicity and reliability in mind. It provides essential financial tracking features without unnecessary complexity, making it perfect for personal use. The application follows clean architecture principles with a focus on maintainability and security.

## ✨ Key Features

- **📊 Real-time Dashboard** - Visual overview of income, expenses, and balance
- **🏷️ Smart Categories** - Organize transactions with customizable categories
- **💸 Transaction Management** - Add, edit, and track all your financial activities
- **📈 Financial Analytics** - Insights into spending patterns and trends
- **🔐 Multi-user Support** - Secure user authentication with Supabase
- **📱 Responsive Design** - Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful, accessible components
- **Recharts** - Data visualization

### Backend

- **Drizzle ORM** - Type-safe database operations
- **Supabase** - Authentication & PostgreSQL database
- **Zod** - Runtime type validation
- **Custom Services** - Clean, simple business logic

### Developer Experience

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Polqt/budget-tracker.git
   cd budget-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Configure your `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=your_database_url
   ```

4. **Database Setup**

   ```bash
   npm run db:push    # Push schema to database
   npm run db:seed    # (Optional) Seed with sample data
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

6. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
budget-tracker/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── Category/         # Category-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── src/                  # Core application logic
│   ├── db/              # Database schema & configuration
│   ├── services/        # Business logic services
│   └── types/           # TypeScript type definitions
├── utils/               # Supabase utilities
└── docs/                # Documentation files
```

## 🏗️ Architecture Highlights

### Clean Service Layer

```typescript
// Simple, focused services
export class CategoryService {
  async getCategories(userId: string, query: CategoryQuery) {
    // Clean, readable business logic
  }
}

// Instance-based exports for consistency
export const categoryService = new CategoryService();
```

### Type-Safe Validation

```typescript
// Zod schemas for runtime validation
export const TransactionSchema = z.object({
  title: z.string().min(1).max(200),
  amount: z.number().positive(),
  type: z.enum(['income', 'expense']),
  // ... other fields
});
```

### Custom Hooks for Data Management

```typescript
// Simple, reusable data hooks
export function useTransactions(userId: string, query: TransactionQuery) {
  return useFetch<TransactionResponse>(`/api/transactions?${params}`);
}
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## 📊 Key Components

### Dashboard Component

- Real-time financial statistics
- Recent transactions display
- Visual charts and metrics
- Responsive grid layout

### Transaction Form

- Input validation with Zod
- Category selection
- Date and amount handling
- Success/error feedback

### Category Management

- CRUD operations
- Budget tracking
- Icon and color customization
- Usage statistics

## 🛡️ Security Features

- **Authentication** - Supabase Auth with row-level security
- **Input Validation** - Zod schemas for all user inputs
- **UUID Validation** - Prevents injection attacks
- **Sanitization** - Clean user data before processing
- **User Isolation** - Each user only sees their own data

## 📈 Performance Optimizations

- **Server Components** - Leverage Next.js 14 features
- **Optimistic Updates** - Instant UI feedback
- **Error Boundaries** - Graceful error handling
- **Loading States** - Smooth user experience
- **Pagination** - Efficient data loading

## 🎯 Design Philosophy

This project prioritizes:

1. **Simplicity** - Clean, readable code over complex patterns
2. **Security** - Proper validation and user data protection
3. **Maintainability** - Easy to understand and modify
4. **Reliability** - Robust error handling and validation
5. **Uniqueness** - Custom architecture tailored for personal finance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for personal finance management**
