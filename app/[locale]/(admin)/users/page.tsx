import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { Plus } from 'lucide-react';
import CreateUserForm from './_components/CreateUserForm';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import UserFIlterBar from './_components/UserFIlterBar';
import { Suspense } from 'react';
import { UserDataTable } from './_components/userDataTable';
import { columns, UsersTable } from './_components/userColumns';
import { auth } from '@/auth';

interface ParamsProps {
  search?: string;
  userId?: string;
  role?: string;
  sortBy?: string | string[];
  sortOrder?: string | string[];
  page?: string;
  pageSize?: string;
}

interface PostPageProps {
  searchParams: Promise<ParamsProps>;
}

const UsersPage = async ({ searchParams }: PostPageProps) => {
  const session = await auth(); // hasil next‑auth

  const currentUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }
    : null;
  const params = await searchParams;

  const {
    search,
    userId,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = '1',
    pageSize = '10',
  } = params;

  const role = params.role as 'ADMIN' | 'EDITOR' | 'USER';

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(userId && { id: userId }),
    ...(role && { role }),
  };

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const pageSizeNumber = Math.max(parseInt(pageSize, 10) || 10, 1);

  // Normalize sortBy and sortOrder to arrays for multi-sort support
  const sortByFields = Array.isArray(sortBy) ? sortBy : sortBy.split(',');
  const sortOrders = Array.isArray(sortOrder)
    ? sortOrder
    : sortOrder.split(',');

  const orderBy: Prisma.UserOrderByWithRelationInput[] = [];

  sortByFields.forEach((field: string, idx: number) => {
    const order = (sortOrders[idx] || 'asc').toLowerCase();
    if (field === 'name') {
      orderBy.push({ name: order as 'asc' | 'desc' });
    } else if (field === 'email') {
      orderBy.push({ email: order as 'asc' | 'desc' });
    } else if (['role'].includes(field)) {
      orderBy.push({ [field]: order as 'asc' | 'desc' });
    }
  });

  // Always add fallback sorting by createdAt desc
  orderBy.push({ createdAt: 'desc' });

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      take: pageSizeNumber,
      skip: (pageNumber - 1) * pageSizeNumber,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    }),

    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSizeNumber);

  if (pageNumber > totalPages && totalPages > 0) {
    redirect(`/users?page=1&pageSize=${pageSizeNumber}`);
  }

  console.log(users);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-primary-foreground p-2 rounded-xl">
        <h2>All User</h2>
        <div>
          <CreateUserForm />
        </div>
      </div>
      <div className="bg-primary-foreground p-4 rounded-xl space-y-4">
        <div>
          <UserFIlterBar />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <UserDataTable<UsersTable, unknown>
            columns={columns}
            data={users}
            currentUser={currentUser}
            pagination={{
              page: pageNumber,
              limit: pageSizeNumber,
              totalPages,
              total,
            }}
          />
        </Suspense>
      </div>
      <p className="italic text-xs text-muted-foreground">
        Changing user roles is restricted to admins only.
      </p>
    </div>
  );
};

export default UsersPage;
