'use client';

import { MediaAsset } from '@prisma/client';
import AssetCard from './AssetCard';
import AssetPagination from './AssetPagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type AllAssetProps = {
  allAsset: (MediaAsset & { uploader: { name: string | null; id: string } })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const AllAssetGalery = ({ allAsset, pagination }: AllAssetProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      params.set('limit', pagination.limit.toString());
      router.push(`?${params.toString()}`);
    },
    [router, searchParams, pagination.limit],
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('pageSize', newLimit.toString());
      params.set('page', '1'); // reset ke page pertama
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {allAsset.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
      <AssetPagination
        page={pagination.page}
        limit={pagination.limit}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
};

export default AllAssetGalery;
