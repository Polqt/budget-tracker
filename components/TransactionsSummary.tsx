import { ArrowDown, ArrowUp, DollarSign } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export default function TransactionsSummary() {
  return (
    <>
      <Card className="mb-8 shadow-md border-none bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 md:border-r border-gray-200">
              <div className="flex items-center text-lg text-gray-600 mb-1">
                <ArrowDown className="text-green-500 mr-2 w-5 h-5" /> Income
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {/* TODO: Replace with actual calculation */}
                $0.00
              </div>
            </div>
            <div className="flex flex-col items-center p-4 md:border-r border-gray-200">
              <div className="flex items-center text-lg text-gray-600 mb-1">
                <ArrowUp className="text-red-500 mr-2 w-5 h-5" /> Expenses
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {/* TODO: Replace with actual calculation */}
                $0.00
              </div>
            </div>
            <div className="flex flex-col items-center p-4 md:border-r border-gray-200">
              <div className="flex items-center text-lg text-gray-600 mb-1">
                <DollarSign className="text-green-500 mr-2 w-5 h-5" /> Balance
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {/* TODO: Replace with actual calculation */}
                $0.00
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
