'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import BreadcrumbsNavbar from './BreadcrumbsNavbar';
import UserMenu from './UserMenu';
import { useCurrentUser } from '../../_lib/UserProvider';

const Navbar = () => {
  const currentUser = useCurrentUser();
  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 z-10 bg-primary-foreground">
      <div className="flex gap-4 items-center">
        <SidebarTrigger />
        <BreadcrumbsNavbar />
      </div>
      <div className="flex gap-4 items-center justify-center">
        <LocaleSwitcher />
        <ThemeSwitcher />
        <div className="hidden md:block text-sm">
          <p>{currentUser?.name}</p>
          <p className="text-xs capitalize text-muted-foreground">
            {currentUser?.role.toLocaleLowerCase()}
          </p>
        </div>
        <UserMenu curentUser={currentUser} />
      </div>
    </nav>
  );
};

export default Navbar;
