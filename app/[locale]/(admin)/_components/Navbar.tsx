'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import BreadcrumbsNavbar from './BreadcrumbsNavbar';

const Navbar = () => {
  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 z-10 bg-primary-foreground">
      <div className="flex gap-4 items-center">
        <SidebarTrigger />
        <BreadcrumbsNavbar />
      </div>
      <div className="flex gap-4 items-center justify-center">
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
