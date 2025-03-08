import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function RecentTransactions() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription className='pt-2'>Your latest financial activites</CardDescription>
        </div>
        <Button variant={'outline'} size={'sm'}>View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {}
            <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className='flex items-start gap-3'>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
