import TransactionsContent from './TransactionsContent';
import TransactionsHeader from './TransactionsHeader';
import TransactionsSummary from './TransactionsSummary';
import TransactionsTable from './TransactionsTable';

export default function Transactions() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <TransactionsHeader />
        <TransactionsContent />
        <TransactionsSummary />
        <TransactionsTable />
      </div>
    </div>
  );
}
