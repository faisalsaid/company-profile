import AllAssetGalery from './_components/AllAssetGalery';
import UploadImage from './_components/UploadImage';
import AssetFIlterBar from './_components/AssetFIlterBar';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

interface ParamsProps {
  search?: string;
  uploadedBy?: string;
  sortBy?: string | string[];
  sortOrder?: string | string[];
  page?: string;
  pageSize?: string;
}

interface AllAssetProps {
  searchParams: Promise<ParamsProps>;
}

const AssetsPage = async ({ searchParams }: AllAssetProps) => {
  const allUploader = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const params = await searchParams;
  const { search, uploadedBy, page = '1', pageSize = '10' } = params;

  const where = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { caption: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(uploadedBy && { uploadedBy }),
  };

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const pageSizeNumber = Math.max(parseInt(pageSize, 10) || 10, 1);

  const [AllAsset, totalAllAsset] = await Promise.all([
    prisma.mediaAsset.findMany({
      where,
      take: pageSizeNumber,
      skip: (pageNumber - 1) * pageSizeNumber,
      include: {
        uploader: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    }),
    prisma.mediaAsset.count({ where }),
  ]);

  const totalPageAllAsset = Math.ceil(totalAllAsset / pageSizeNumber);

  if (pageNumber > totalPageAllAsset && totalPageAllAsset > 0) {
    redirect(`/assets?page=1&pageSize=${pageSizeNumber}`);
  }

  // const data = await getAllAssets({ search, uploadedBy });
  // const { assets, ...rest } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-primary-foreground p-2 rounded-xl">
        <h2>All Assets</h2>
        <div>
          <UploadImage />
        </div>
      </div>
      <div className="bg-primary-foreground p-4 rounded-xl space-y-4">
        <AssetFIlterBar uploadBy={allUploader} />
        <AllAssetGalery
          allAsset={AllAsset}
          pagination={{
            page: pageNumber,
            limit: pageSizeNumber,
            totalPages: totalPageAllAsset,
            total: totalAllAsset,
          }}
        />
      </div>
    </div>
  );
};

export default AssetsPage;
