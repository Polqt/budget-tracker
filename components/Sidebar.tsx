import {
  Home,
  Info,
  ListOrdered,
  PieChartIcon,
  Settings,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

export default function Sidebar() {
  const navigations = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Categories', href: '/categories', icon: PieChartIcon },
    { name: 'Transactions', href: '/transaction', icon: ListOrdered },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'About', href: '/about', icon: Info},
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r p-4">
      <div className="flex items-center gap-2 py-4 mb-6">
        <Wallet className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Budget Buddy</h1>
      </div>

      <nav className="space-y-4 flex-1">
        {navigations.map((nav, i) => (
          <Link
            key={i}
            href={nav.href}
            className="flex items-center p-3 rounded-md bg-slate-100 font-medium"
          >
            <nav.icon className="mr-3 h-6 w-6" />
            {nav.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto text-center">
        <Card className="bg-slate-500/20 border-none">
          <CardContent className="p-4">
            <p className='text-sm font-medium mb-2'>Premium Plan</p>
            <p className='text-xs text-slate-500 mb-4'>Upgrade to access advanced feautres</p>
            <Button size={'sm'} className='w-full'>Upgrade Now</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
