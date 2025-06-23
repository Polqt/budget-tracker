'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const Colors = ['#10B981', '#EF4444', '#3B82F6', '#8B5CF6', '#F59E0B'];

interface ChartProps {
  pieData: {
    name: string;
    value: number;
  }[];
  barData: {
    name: string;
    income: number;
    expenses: number;
  }[];
}

export default function Chart({ pieData, barData }: ChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="font-semibold mb-4">Spending by Category</h2>
        <ResponsiveContainer width={'100%'} height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={Colors[index % Colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="font-semibold mb-4">Monthly Trends</h2>
        <ResponsiveContainer width={'100%'} height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray={'3 3'} />
            <XAxis dataKey={'name'} />
            <YAxis tickFormatter={value => `₱${value}`} />
            <Legend />
            <Bar dataKey={'income'} fill={'#10B981'} />
            <Bar dataKey={'expenses'} fill={'#EF4444'} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
