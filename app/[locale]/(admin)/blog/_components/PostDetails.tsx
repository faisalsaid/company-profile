'use client';

import RenderRichText from '@/components/RenderRIchText';
import { Badge } from '@/components/ui/badge';
import { ArticleDetailType } from '@/types/article.type';

const PostDetails = ({ article }: { article: ArticleDetailType }) => {
  return (
    <div className="bg-primary-foreground rounded-xl p-4 space-y-4">
      <h1 className="text-xl">{article.title}</h1>
      <div className="flex gap-2 items-center">
        <Badge>Author: {article.author.name}</Badge>
        <Badge>Created: {article.createdAt.toLocaleDateString()}</Badge>
        <Badge>Status: {article.status}</Badge>
      </div>

      <div className="bg-muted p-4 rounded-lg text-sm italic text-muted-foreground">
        Summary: {article.summary}
      </div>
      <div>
        <RenderRichText content={article.content as string} />
      </div>
    </div>
  );
};

export default PostDetails;
