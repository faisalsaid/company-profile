'use client';

import { GalleryVerticalEnd } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Link } from '@/i18n/navigation';
import NavMain from './nav-main';
import { adminMenuList } from '../_lib/listSidebar';
import { Session } from 'next-auth';

export function AppSidebar({ session }: { session: Session | null }) {
  const protectRoute = ['/users', '/settings'];

  const isAdmin = session?.user.role === 'ADMIN';

  const menuList = adminMenuList.filter((item) =>
    isAdmin ? true : !protectRoute.includes(item.url),
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div>
                <GalleryVerticalEnd />
                <Link href={'/dashboard'}>MyTechno</Link>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarSeparator />
        <NavMain items={menuList} />
      </SidebarContent>
    </Sidebar>
  );
}
