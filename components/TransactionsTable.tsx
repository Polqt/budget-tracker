import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table';

export default function TransactionsTable() {
  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Transaction History</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">
                  <div className="flex items-center cursor-pointer">Date</div>
                </TableHead>
                <TableHead className="w-[180px]">
                  <div className="flex items-center cursor-pointer">
                    Description
                  </div>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end cursor-pointer">
                    Amount
                  </div>
                </TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
