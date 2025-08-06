'use client';

import { MediaAsset } from '@prisma/client';
import AssetCard from './AssetCard';

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
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {allAsset.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
};

export default AllAssetGalery;
