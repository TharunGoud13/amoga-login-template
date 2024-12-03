import { cookies } from 'next/headers';

// import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebar } from '@/components/chatbot/app-sidebar';
// import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

// import { auth } from '../(auth)/auth';
import { auth } from '@/auth';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <AppSidebar user={session?.user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
