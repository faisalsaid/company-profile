import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/app/[locale]/(admin)/_components/app-sidebar';

import { cookies } from 'next/headers';
import Navbar from './_components/Navbar';
import { auth } from '@/auth';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const cookieStore = await cookies();

  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar session={session} />
      <SidebarInset>
        <Navbar />
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
