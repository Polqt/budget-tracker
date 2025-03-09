'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
