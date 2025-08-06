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
