import DashboardAnalytics from './DashboardAnalytics';
import RecentTransactions from './RecentTransactions';
import SummaryCards from './SummaryCards';

export default function DashboardContent() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-slate-500">
          Welcome back, Here&apos;s your financial overview.
        </p>
      </div>
      <SummaryCards />
      <RecentTransactions />
      <DashboardAnalytics />
    </main>
  );
}
