import { Circle, PlusCircle } from 'lucide-react';
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
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function Categories() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Badge
              variant={'outline'}
              className="bg-green-50 text-green-700 border-green-200 px-4 py-1 rounded-full text-sm mb-2"
            >
              Budget Orientation
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900">
              Expense <span className="text-green-600">Categories</span>
            </h1>
            <p className="text-gray-500/75 mt-1 text-sm">
              Organize your finances by creating and managing categories for
              your expenses.
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all">
                <PlusCircle className="mr-2 h-5 w-5" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new category to organize your expenses.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Groceries, Rent, Utilities"
                    value={[]}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-8">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-green-700">
                <div className="flex items-center gap-2">
                  <Circle className="h-5 w-5 fill-green-100 text-green-600" />
                  Quick Tip
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700/75">
                Organizing your expenses into categories helps you identify
                spending patterns and stick to your budget more effectively. Try
                to limit your categories to 10-15 to keep things manageable.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
