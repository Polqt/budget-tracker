'use client';

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function Dashboard() {
  // TODO: Replace with real data from Supabase
  // const [totalIncome, setTotalIncome] = useState(0);
  // const [totalExpenses, setTotalExpenses] = useState(0);
  // const [balance, setBalance] = useState(0);
  // const [recentTransactions, setRecentTransactions] = useState([]);

  // TODO: Fetch real data from Supabase
  /*
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch income data
        const { data: incomeData, error: incomeError } = await supabase
          .from('income')
          .select('amount')
          .gte('created_at', startOfMonth);
        
        // Fetch expenses data
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('amount, category')
          .gte('created_at', startOfMonth);
        
        // Fetch recent transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        // Process and set data
        if (incomeData) setTotalIncome(incomeData.reduce((sum, item) => sum + item.amount, 0));
        if (expensesData) setTotalExpenses(expensesData.reduce((sum, item) => sum + item.amount, 0));
        if (transactionsData) setRecentTransactions(transactionsData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchDashboardData();
  }, []);
  */

  // TODO: Insert with real chart data

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&apos;s your financial overview.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Income
            </CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₱</div>
            <p className="text-xs opacity-90 flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3 h-3" />
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Expenses
            </CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingDown className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₱</div>
            <p className="text-xs opacity-90 flex items-center gap-1 mt-2">
              <ArrowDownRight className="w-3 h-3" />
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Balance
            </CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <Wallet className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₱</div>
            <p className="text-xs opacity-90 mt-2">Available funds</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* TODO: Uncomment when data is available */}
        {/* <Chart pieData={pieData} barData={barData} /> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-600 font-medium">
                    No spending data yet
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add some transactions to see your spending breakdown
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-600 font-medium">No trend data yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Track your income and expenses over time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-green-500">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">Net Income</p>
            <p className="text-2xl font-bold text-green-600 mt-1">₱</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-red-500">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">Daily Average</p>
            <p className="text-2xl font-bold text-red-600 mt-1">₱</p>
            <p className="text-xs text-gray-500 mt-1">Per day spending</p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">Transactions</p>
            <p className="text-2xl font-bold text-blue-600 mt-1"></p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">Categories</p>
            <p className="text-2xl font-bold text-purple-600 mt-1"></p>
            <p className="text-xs text-gray-500 mt-1">Active categories</p>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Recent Transactions
            </span>
            <a
              href="/transactions"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              View all →
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Replace with real transaction data */}
          <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">No transactions yet</p>
              <p className="text-sm text-gray-500">
                Start by adding your first transaction
              </p>
              <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                Add Transaction
              </button>
            </div>
          </div>

          {/* TODO: Uncomment when transaction data is available */}
          {/*
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {transaction.type === 'income' ? 
                      <ArrowUpRight className="w-4 h-4 text-green-600" /> : 
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          */}
        </CardContent>
      </Card>
    </div>
  );
}
