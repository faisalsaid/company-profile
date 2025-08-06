'use client';

import AssetCard from './AssetCard';

const AllAssetGalery = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {Array.from({ length: 10 }, (_, i) => (
        <AssetCard key={i} />
      ))}
    </div>
  );
};

export default AllAssetGalery;
