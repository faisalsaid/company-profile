'use server';

import prisma from '@/lib/prisma';
import { postFormSchema } from '@/lib/zod';
import { GetArticleQuery } from '@/types/article.type';
import z from 'zod';

// HANDLE CREATE ARTICLE
export async function createArticle(data: z.infer<typeof postFormSchema>) {
  // console.log('ACTION POST', data);

  const validated = postFormSchema.parse(data);

  //   const [author] = await Promise.all([
  //     prisma.user.findUnique({ where: { id: validated.authorId } }),
  //   ]);

  const author = await prisma.user.findUnique({
    where: { id: validated.authorId },
  });
  if (!author) {
    return { message: 'Invalid authorId – user not found' };
  }

  try {
    await prisma.article.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        summary: validated.summary,
        content: validated.content,
        status: validated.status,
        authorId: validated.authorId,
        publishedAt: validated.status === 'PUBLISHED' ? new Date() : undefined,
        media:
          validated.media.length > 0
            ? {
                create: validated.media.map((media) => ({
                  mediaAsset: {
                    connect: { id: media.id },
                  },
                  role: media.role,
                })),
              }
            : undefined,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('CREATE POST ERROR:', error);
    return {
      message: 'Failed to create post',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// GET POST by slug
export async function getPostBySlug(slug: string) {
  console.log(slug);

  try {
    const post = await prisma.article.findUnique({
      where: { slug },
      ...GetArticleQuery,
    });

    return post;
  } catch (error) {
    console.error('GET POST ERROR:', error);
    return {
      message: 'Failed to get post',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// handle UPDATE POST
type UpdateArticlePayload = z.infer<typeof postFormSchema> & { slug: string };

export async function updateArticle(data: UpdateArticlePayload) {
  // console.log('updateArticle ==>>', data);

  const { slug, title, content, summary, status, authorId } = data;

  try {
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existingArticle) {
      throw new Error('Article not found.');
    }

    const articleId = existingArticle.id;

    const uniqueMedia = new Set();
    for (const m of data.media) {
      const key = `${m.id}:${m.role}`;
      if (uniqueMedia.has(key)) {
        throw new Error(`Duplicate media-role pair: ${key}`);
      }
      uniqueMedia.add(key);
    }

    const mediaOps = [
      prisma.articleMedia.deleteMany({
        where: { articleId },
      }),

      ...data.media.map((m) =>
        prisma.articleMedia.create({
          data: {
            articleId,
            mediaAssetId: m.id,
            role: m.role,
          },
        }),
      ),
    ];

    // Run the transaction
    await prisma.$transaction([
      // Update the article itself
      prisma.article.update({
        where: { id: articleId },
        data: {
          title,
          content,
          summary,
          status,
          authorId,
          updatedAt: new Date(),
          publishedAt: status === 'PUBLISHED' ? new Date() : null,
        },
      }),

      ...mediaOps,
    ]);

    return { success: true };
  } catch (error) {
    console.error('Update article fail:', error);
    return { success: false, message: 'Update article fail' };
  }
}
