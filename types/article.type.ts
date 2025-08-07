import { Prisma } from '@prisma/client';

export const GetArticleQuery = Prisma.validator<Prisma.ArticleFindManyArgs>()({
  include: {
    author: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    },
    media: {
      select: {
        mediaAsset: true,
        role: true,
      },
    },
  },
});

export type ArticleDetailType = Prisma.ArticleGetPayload<
  typeof GetArticleQuery
>;
