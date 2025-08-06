'use client';

import { MediaAsset } from '@prisma/client';
import { CldImage } from 'next-cloudinary';

const AssetCard = ({
  asset,
}: {
  asset: MediaAsset & { uploader: { name: string | null; id: string } };
}) => {
  return (
    <div className="aspect-square bg-accent-foreground rounded-lg overflow-hidden">
      <CldImage
        className="object-cover h-full w-full"
        alt="media asset"
        src={(asset.thumbnail_url as string) || (asset.public_id as string)}
        height={asset.height!}
        width={asset.width!}
      />
    </div>
  );
};

export default AssetCard;
