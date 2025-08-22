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
  const role = session?.user.role;

  // daftar url yang tidak boleh diakses editor
  const editorRestricted = ['/users', '/settings'];

  // daftar url yang boleh diakses user
  const userAllowed = ['/dashboard', '/inbox'];

  const menuList = adminMenuList.filter((item) => {
    if (role === 'ADMIN') {
      return true; // semua menu
    }

    if (role === 'EDITOR') {
      return !editorRestricted.includes(item.url);
    }

    if (role === 'USER') {
      return userAllowed.includes(item.url);
    }

    return false; // default: tidak ada akses
  });

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
