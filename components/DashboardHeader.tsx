
import { Badge } from './ui/badge';

export default function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <Badge
          variant={'outline'}
          className="bg-green-50 text-green-700 border-green-200 px-4 py-1 rounded-full text-sm mb-2"
        >
          Dashboard Overview
        </Badge>
        <h1 className="text-3xl font-bold text-gray-900">
          Financial <span className="text-green-600">Summary</span>
        </h1>
        <p className="text-gray-500/75 mt-1 text-sm">
          An overview of your financial health and transactions.
        </p>
      </div>
    </div>
  );
}
