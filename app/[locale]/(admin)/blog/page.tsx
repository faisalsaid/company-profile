import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import PostFilterBar from './_components/table/PostFilterBar';
import AllPostTable from './_components/table/AllPostsTable';
import { AllPostsColumns } from './_components/table/AllPostColumns';
import AddPostButton from './_components/AddPostButton';

interface ParamsProps {
  search?: string;
  authorId?: string;
  status?: string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: string | string[];
  sortOrder?: string | string[];
  page?: string;
  pageSize?: string;
}

interface PostPageProps {
  searchParams: Promise<ParamsProps>;
}

const BlogPage = async ({ searchParams }: PostPageProps) => {
  const params = await searchParams;
  const allAuthor = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const {
    search,
    authorId,
    createdFrom,
    createdTo,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = '1',
    pageSize = '10',
  } = params;

  const status = params.status as 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

  const where = {
    ...(search && {
      title: {
        contains: search,
        // mode: 'insensitive',
        mode: 'insensitive' as const,
      },
    }),
    ...(authorId && { authorId }),
    ...(status && { status }),
    ...(createdFrom &&
      createdTo && {
        createdAt: {
          gte: new Date(createdFrom),
          lte: new Date(createdTo),
        },
      }),
    deletedAt: null,
  };

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const pageSizeNumber = Math.max(parseInt(pageSize, 10) || 10, 1);

  // Normalize sortBy and sortOrder to arrays for multi-sort support
  const sortByFields = Array.isArray(sortBy) ? sortBy : sortBy.split(',');
  const sortOrders = Array.isArray(sortOrder)
    ? sortOrder
    : sortOrder.split(',');

  const orderBy: Prisma.ArticleOrderByWithRelationInput[] = [];

  sortByFields.forEach((field: string, idx: number) => {
    const order = (sortOrders[idx] || 'asc').toLowerCase();
    if (field === 'author') {
      orderBy.push({ author: { name: order as 'asc' | 'desc' } });
    } else if (
      ['title', 'createdAt', 'status', 'publishedAt'].includes(field)
    ) {
      orderBy.push({ [field]: order as 'asc' | 'desc' });
    }
  });

  orderBy.push({ createdAt: 'desc' });

  const [data, total] = await Promise.all([
    prisma.article.findMany({
      where,
      take: pageSizeNumber,
      skip: (pageNumber - 1) * pageSizeNumber,
      orderBy,
      select: {
        id: true,
        title: true,
        createdAt: true,
        status: true,
        slug: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            articles: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSizeNumber);

  if (pageNumber > totalPages && totalPages > 0) {
    redirect(`/blog?page=1&pageSize=${pageSizeNumber}`);
  }

  // console.log(data);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-primary-foreground p-2 rounded-xl">
        <h2>All Post</h2>
        <AddPostButton />
      </div>
      <div className="bg-primary-foreground p-4 rounded-xl space-y-4">
        <div>
          <PostFilterBar author={allAuthor} />
        </div>
        <AllPostTable
          columns={AllPostsColumns}
          data={data}
          pagination={{
            page: pageNumber,
            limit: pageSizeNumber,
            totalPages,
            total,
          }}
        />
      </div>
    </div>
  );
};

export default BlogPage;
