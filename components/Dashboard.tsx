'use client';

import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Chart from './Chart';

export default function Dashboard() {
  // Placeholder data for now
  const pieData = [
    { name: 'Food', value: 2000 },
    { name: 'Transport', value: 1500 },
    { name: 'Entertainment', value: 1000 },
  ];

  const barData = [
    { name: 'Jan', income: 15000, expenses: 8000 },
    { name: 'Feb', income: 18000, expenses: 10000 },
    { name: 'Mar', income: 20000, expenses: 12000 },
  ];

  // TODO: Fetch real data from Supabase
  /*
  useEffect(() => {
    const fetchData = async () => {
      const { data: incomeData } = await supabase.from('income').select('*');
      ...
    };
    fetchData();
  }, []);
  */

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here&apos;s your financial overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Income
            </CardTitle>
            <TrendingUp className="w-4 h-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{}</div>
            <p className="text-xs opacity-90">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Expenses
            </CardTitle>
            <TrendingDown className="w-4 h-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{}</div>
            <p className="text-xs opacity-90">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Balance
            </CardTitle>
            <Wallet className="w-4 h-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{}</div>
            <p className="text-xs opacity-90">Available funds</p>
          </CardContent>
        </Card>
      </div>

      <Chart pieData={pieData} barData={barData} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="text-center">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-green-600">₱{}</p>
            <p className="text-xs text-gray-500 mt-1">Net income</p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg. Daily Spending</p>
            <p className="text-2xl font-bold text-red-600">₱{}</p>
            <p className="text-xs text-gray-500 mt-1">Per day</p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="text-center">
            <p className="text-sm text-gray-600">Transactions</p>
            <p className="text-2xl font-bold text-blue-600">{}</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="text-center">
            <p className="text-sm text-gray-600">Categories Used</p>
            <p className="text-2xl font-bold text-purple-600">{}</p>
            <p className="text-xs text-gray-500 mt-1">Active categories</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Recent Transactions
            </span>
            <a
              href="/transactions"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400">
                Start by adding your first transaction
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
