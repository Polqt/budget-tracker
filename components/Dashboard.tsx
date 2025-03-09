'use client'

import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <DashboardHeader />
    </div>
  );
}
