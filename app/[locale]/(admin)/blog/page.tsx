import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { Plus } from 'lucide-react';

const BlogPage = async () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-primary-foreground p-2 rounded-xl">
        <h2>All Post</h2>
        <div>
          <Link href={'/blog/create'}>
            <Button size={'sm'}>
              <Plus /> Add post
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-primary-foreground p-4 rounded-xl space-y-4"></div>
    </div>
  );
};

export default BlogPage;
