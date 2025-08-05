'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  //   BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link } from '@/i18n/navigation';

const BreadcrumbsNavbar = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <Link href={'/dashboard'}>Dashboard</Link>
          {/* <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink> */}
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbsNavbar;
