'use server';

import prisma from '@/lib/prisma';
import { postFormSchema } from '@/lib/zod';
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
