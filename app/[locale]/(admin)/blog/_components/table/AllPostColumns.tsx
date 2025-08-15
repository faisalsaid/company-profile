'use client';

import { Prisma } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { PostActionsCell } from './PostActionsCell';

export type Article = Prisma.ArticleGetPayload<{
  select: {
    id: true;
    title: true;
    createdAt: true;
    status: true;
    slug: true;
    author: {
      select: {
        id: true;
        name: true;
        email: true;
        role: true;
        image: true;
        articles: {
          select: {
            id: true;
          };
        };
      };
    };
  };
}>;
export const AllPostsColumns: ColumnDef<Article>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'author',
    header: 'Author',
    cell: ({ row }) => {
      const author = row.original.author;
      return (
        <div>
          <span>{author.name}</span>
          <span className="text-xs text-muted-foreground">
            {' '}
            | {author.role}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <PostActionsCell post={row.original} />,
  },
];
