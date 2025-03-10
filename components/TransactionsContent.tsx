'use client';

import { CalendarIcon, Filter, Search } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { useState } from 'react';

export default function TransactionsContent() {
  const [date, setDate] = useState(new Date());

  return (
    <>
      <Card className="mb-8 shadow-md">
        <CardContent className="pt-6">
          <Tabs defaultValue="filters" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="date-range">Date</TabsTrigger>
            </TabsList>
            <TabsContent value="filters" className="space-y-4 pt-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions"
                    className="pl-10"
                    // value={[]}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <Select>
                    <SelectTrigger className="w-full">
                      <Filter className="mr-2 w-4 h-4" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: Add a categories */}
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-full">
                      <Filter className="mr-2 w-4 h-4" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>{/* TODO: Add a type */}</SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="date-range" className="pt-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="grid gap-2 flex-1">
                  <div className="flex justify-between">
                    <Label>Date Range</Label>
                    <Button variant={'ghost'} className="h-8 px-2 text-sm">
                      Current Month
                    </Button>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto pt-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={date => date && setDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  Apply Filter
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
