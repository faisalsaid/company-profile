import React from 'react';
import AllAssetFilterBar from './_components/AllAssetFilterBar';
import AllAssetGalery from './_components/AllAssetGalery';
import UploadImage from './_components/UploadImage';
import { getAllAssets } from '@/actions/assetActions';

const AssetsPage = async () => {
  const data = await getAllAssets({});
  const { assets, ...rest } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-primary-foreground p-2 rounded-xl">
        <h2>All Assets</h2>
        <div>
          <UploadImage />
        </div>
      </div>
      <div className="bg-primary-foreground p-4 rounded-xl space-y-4">
        <AllAssetFilterBar />
        <AllAssetGalery allAsset={assets} pagination={rest} />
      </div>
    </div>
  );
};

export default AssetsPage;
