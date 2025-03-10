import { Download, PlusCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from './ui/dropdown-menu';

export default function TransactionsHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <Badge
          variant={'outline'}
          className="bg-green-50 text-green-700 border-green-200 px-4 py-1 rounded-full text-sm mb-2"
        >
          Final Activity
        </Badge>
        <h1 className="text-3xl font-bold text-gray-900">
          Your <span className="text-green-600">Transactions</span>
        </h1>
        <p className="text-gray-500/75 mt-1 text-sm">
          Track and manage your transactions to keep your budget in check.
        </p>
      </div>

      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all">
              <PlusCircle size={24} className="mr-2 w-5 h-5" /> Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>
                Record a new financial transaction
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="transaction-type">Type</Label>
                  <Select
                    value="" // TODO: Add state
                  >
                    <SelectTrigger id="transaction-type">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transaction-amount">Amount ($)</Label>
                  <Input
                    id="transaction-amount"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={0} // TODO: Add state
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'outline'}>
              <Download size={24} className="mr-2 w-5 h-5" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="mr-2 w-5 h-5" /> Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 w-5 h-5" /> Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
