import { Bell, Plus, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import DashboardContent from './DashboardContent';
import { Avatar, AvatarFallback } from './ui/avatar';

export default function DashboardHeader() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search transactions..."
              className="pl-8 bg-slate-50 border-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant={'outline'} size={'sm'} className="hidden md:flex">
              <Plus className="mr-2 w-4 h-4" />
              Add Transaction
            </Button>
            <Button variant={'ghost'} size={'icon'} className="relative">
              <Bell className="w-5 h-5" />
            </Button>
            <Avatar>
              <AvatarFallback>{}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <DashboardContent />
    </div>
  );
}
