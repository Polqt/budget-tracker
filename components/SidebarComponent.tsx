'use client';

import { ChevronUp, CreditCard, Folder, Home, Info, User2 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { logout } from '@/lib/auth-actions';
import { useUser } from '@/hooks/use-user';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Transaction',
    url: '/transaction',
    icon: CreditCard,
  },
  {
    title: 'Categories',
    url: '/categories',
    icon: Folder,
  },
  {
    title: 'About',
    url: '/about',
    icon: Info,
  },
];

function SidebarComponent() {
  const user = useUser();
  const displayName = user?.user_metadata?.full_name;

  return (
    <div>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarHeader className="font-bold text-2xl">
              BudgetBuddy
            </SidebarHeader>
            <SidebarGroupContent>
              <SidebarMenu>
                <>
                  {items.map(item => (
                    <SidebarMenuItem
                      key={item.title}
                      className="space-y-4 mt-2"
                    >
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon size={24} />
                          <span className="text-sm">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {displayName}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem asChild>
                    <form action={logout}>
                      <button type="submit">Sign out</button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
export default SidebarComponent;
