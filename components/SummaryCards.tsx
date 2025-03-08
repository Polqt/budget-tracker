import { ArrowDownIcon, ArrowUpIcon, DollarSign } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Total Balance</p>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">${}</h3>
          <p className="text-xs text-slate-500 mt-1">{}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Income</p>
            <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">${}</h3>
          <div className="flex items-center mt-1">
            <span className="text-xs text-green-500 flex items-center">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              {}%
            </span>
            <span className="text-xs text-slate-500 ml-2">{}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Expenses</p>
            <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">${}</h3>
          <div className="flex items-center mt-1">
            <span className="text-xs text-red-500 flex items-center">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              {}%
            </span>
            <span className="text-xs text-slate-500 ml-2">{}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
