import DashboardAnalytics from './DashboardAnalytics';
import DashboardHeader from './DashboardHeader';
import RecentTransactions from './RecentTransactions';
import SummaryCards from './SummaryCards';

export default function Dashboard() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <DashboardHeader />
        <SummaryCards />
        <RecentTransactions />
        <DashboardAnalytics />
      </div>
    </div>
  );
}
