'use client';

import RenderRichText from '@/components/RenderRIchText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';
import { ArticleDetailType } from '@/types/article.type';
import { Pen } from 'lucide-react';
import { CldImage } from 'next-cloudinary';

const PostDetails = ({ article }: { article: ArticleDetailType }) => {
  return (
    <div className="bg-primary-foreground rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p>Article detail</p>
        <Link href={`/blog/${article.slug}/update`}>
          <Button size={'sm'}>
            <Pen />
            Edit
          </Button>
        </Link>
      </div>
      <Separator />
      <h1 className="text-2xl">{article.title}</h1>
      <div className="flex gap-2 items-center">
        <Badge variant={'secondary'}>Author: {article.author.name}</Badge>
        <Badge variant={'secondary'}>
          Created: {article.createdAt.toDateString()}
        </Badge>
        <Badge variant={'secondary'}>Status: {article.status}</Badge>
        {article.publishedAt ? (
          <Badge variant={'secondary'}>
            Publish : {article.publishedAt.toDateString()}
          </Badge>
        ) : null}
      </div>

      <div className="bg-muted p-4 rounded-lg text-sm italic text-muted-foreground">
        Summary: {article.summary}
      </div>
      <div>
        <RenderRichText content={article.content as string} />
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold">Asset :</p>
          <div className="grid grid-cols-2  gap-2 ">
            {article.media.map((asset) => (
              <div
                key={asset.mediaAsset.id}
                className="w-full aspect-square rounded-md overflow-hidden relative"
              >
                <p className="absolute capitalize py-1 px-2 text-sm bg-accent-foreground rounded-md text-muted right-2 bottom-2">
                  {asset.role}
                </p>
                <CldImage
                  className="w-full h-full object-cover"
                  width={asset.mediaAsset.width as number}
                  height={asset.mediaAsset.height as number}
                  src={
                    (asset.mediaAsset.thumbnail_url as string) ||
                    (asset.mediaAsset.public_id as string)
                  }
                  alt="Description of my image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
