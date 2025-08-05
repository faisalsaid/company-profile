'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  // BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';

const BreadcrumbsNavbar = () => {
  const pathname = usePathname(); // example: '/dashboard/settings
  const segments = pathname.split('/').filter(Boolean); // ['dashboard', 'settings']

  console.log(segments);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="">
          <BreadcrumbPage>
            <Link href={`/${segments[1]}`}>
              <span className="capitalize">{segments[1]}</span>
            </Link>
          </BreadcrumbPage>
          {/* <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink> */}
        </BreadcrumbItem>
        {/* <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
        </BreadcrumbItem> */}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbsNavbar;
