'use client';

export default function About() {
  return (
    <div className="min-h-screen w-full px-4 py-10 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">About BudgetBuddy</h1>
        <p className="text-lg text-gray-600">
          BudgetBuddy is a personal finance tracker designed to help you manage your income,
          expenses, and savings efficiently. With a simple and intuitive interface, it's built
          to help you make better financial decisions.
        </p>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">✨ Features</h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>Dashboard with monthly overview</li>
            <li>Track income and expenses</li>
            <li>Categorize your spending</li>
            <li>Visual reports via pie and bar charts</li>
            <li>Secure and scalable with Supabase</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">🛠️ Built With</h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>Next.js 15 (App Router)</li>
            <li>Tailwind CSS</li>
            <li>Supabase (Auth + Database)</li>
            <li>Recharts for data visualization</li>
            <li>Lucide Icons</li>
          </ul>
        </div>

        <div className="border-t pt-6">
          <p className="text-sm text-gray-500">
            Built with 💚 by Jepoy. This is an open-source project for learning and personal budgeting.
          </p>
        </div>
      </div>
    </div>
  );
}
