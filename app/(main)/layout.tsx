import SidebarComponent from '@/components/SidebarComponent';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <SidebarComponent />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
