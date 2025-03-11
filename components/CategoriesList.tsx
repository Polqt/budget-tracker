import { Check, Edit, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export default function CategoriesList() {
  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Color</TableHead>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[150px]">Type</TableHead>
                <TableHead className="w-[150px]">Transaction Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* TODO: Map the categories here */}
              <TableRow>
                <TableCell>
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                </TableCell>
                <TableCell>
                  <Input className="py-1 h-8" />
                </TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="py-1 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>0</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button size={'sm'} variant={'ghost'}>
                      <Check className="text-green-500 w-4 h-4" />
                    </Button>
                    <Button size={'sm'} variant={'ghost'}>
                      <X className="text-red-500 w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      size={'sm'}
                      variant={'ghost'}
                      className="w-8 h-8 p-0"
                    >
                      <Edit className="text-blue-500 w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
