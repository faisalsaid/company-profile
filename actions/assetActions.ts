'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import cloudinary from '@/lib/cloudinary';
import { MediaAsset } from '@prisma/client';
import { addAssetSchema } from '@/lib/zod';

type MediaAssetInput = Partial<
  Omit<MediaAsset, 'id' | 'uploadedAt' | 'uploader' | 'usages'>
> &
  z.infer<typeof addAssetSchema>;

export const saveMediaAssetInfo = async (dataAsset: MediaAssetInput) => {
  // console.log('saveMediaAssetInfo => 14', dataAsset);

  if (!dataAsset) {
    throw new Error('No data to save');
  }

  // chek if uploader exist
  const uploader = await prisma.user.findUnique({
    where: { id: dataAsset.uploadedBy },
  });

  if (!uploader) {
    throw new Error('Uploader not exist');
  }

  try {
    const saved = await prisma.mediaAsset.create({
      data: {
        url: dataAsset.url,
        public_id: dataAsset.public_id,
        secure_url: dataAsset.secure_url,
        resource_type: dataAsset.resource_type,
        format: dataAsset.format,
        caption: dataAsset.caption,
        width: dataAsset.width,
        height: dataAsset.height,
        uploadedBy: dataAsset.uploadedBy,
        thumbnail_url: dataAsset.thumbnail_url,
      },
    });
    return saved;
  } catch (error) {
    console.error('Failed to save media asset:', error);
    throw error;
  }
};

// GET ALL ASSET
interface GetAllAssetsProps {
  search?: string;
  uploadedBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export async function getAllAssets({
  search,
  uploadedBy,
  sortBy = 'uploadedAt', // Ganti default sortBy ke field yang valid
  sortOrder = 'desc',
  page = 1,
  pageSize = 10,
}: GetAllAssetsProps) {
  const allowedSortFields = ['uploadedAt', 'title', 'caption']; // Tambah sesuai field model
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'uploadedAt';

  const where = {
    ...(search && {
      OR: [{ title: { contains: search } }, { caption: { contains: search } }],
    }),
    ...(uploadedBy && { uploadedBy }),
  };

  const [assets, total] = await Promise.all([
    prisma.mediaAsset.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        uploader: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        [sortField]: sortOrder,
      },
    }),
    prisma.mediaAsset.count({ where }),
  ]);

  return {
    assets,
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
    limit: pageSize,
  };
}
