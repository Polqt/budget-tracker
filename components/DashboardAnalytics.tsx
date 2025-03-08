'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from 'recharts';
import { Skeleton } from './ui/skeleton';

export default function DashboardAnalytics() {

  return (
    <Tabs defaultValue="overview" className="mb-6">
      <TabsList>
        <TabsTrigger value="overview"></TabsTrigger>
        <TabsTrigger value="income"></TabsTrigger>
        <TabsTrigger value="expenses"></TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
              <CardDescription>
                Your income and expenses for the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#4ade80" name="Income" />
                  <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>This month&apos;s breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[230px] w-full flex justify-center">
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={[]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full mr-2"></div>
                    <span className="text-sm flex-1">{}</span>
                    <span className="text-sm font-medium">${}</span>
                  </div>
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="income">
        <Card>
          <CardHeader>
            <CardTitle>Income Analysis</CardTitle>
            <CardDescription>
              Detailed breakdown of your income sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="expenses">
        <Card>
          <CardHeader>
            <CardTitle>Expense Analysis</CardTitle>
            <CardDescription>
              Detailed breakdown of your spending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
