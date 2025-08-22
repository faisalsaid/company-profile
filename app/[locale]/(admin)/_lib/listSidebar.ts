import {
  GalleryThumbnails,
  LayoutDashboard,
  Newspaper,
  Settings,
  Users,
} from 'lucide-react';

export const adminMenuList = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Blog',
    url: '/blog',
    icon: Newspaper,
  },
  {
    title: 'Assets',
    url: '/assets',
    icon: GalleryThumbnails,
  },
  {
    title: 'Users',
    url: '/users',
    icon: Users,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];
