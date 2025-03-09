import { Home, Info, ListOrdered, PieChart, Settings } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from './ui/sidebar';

export default function AppSidebar() {
  const pathname = usePathname();

  const navigations = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Categories', href: '/categories', icon: PieChart },
    { name: 'Transactions', href: '/transaction', icon: ListOrdered },
    { name: 'Settings', href: '/settings', icon: Settings, collapsible: true }, // TODO: Add sub navigation
    { name: 'About', href: '/about', icon: Info },
  ];

  return (
    <Sidebar className="border-r bg-background">
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold">
            BudgetBuddy
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-4 space-y-3">
            {navigations.map(nav => {
              const isActive = pathname === nav.href;
              return (
                <Link
                  key={nav.href}
                  href={nav.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  <nav.icon className="h-4 w-4" />
                  {nav.name}
                </Link>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Card className="bg-muted/50 border border-border">
          <CardContent className="p-4">
            <p className="text-sm font-medium">Premium Plan</p>
            <p className="text-xs text-muted-foreground mb-4">
              Upgrade to access advanced features
            </p>
            <Button size="sm" className="w-full">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}
