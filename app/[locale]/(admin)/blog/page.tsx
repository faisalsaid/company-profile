import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const BlogPage = async () => {
  const session = await auth();
  if (!session) {
    redirect('/');
  }
  return <div>BlogPage</div>;
};

export default BlogPage;
