import { getPostBySlug } from '@/actions/articleAction';
import PostDetails from '../_components/PostDetails';

interface Params {
  slug: string;
}

interface PostDetailsProps {
  params: Promise<Params>;
}

const ArticlePage = async ({ params }: PostDetailsProps) => {
  const { slug } = await params;

  const article = await getPostBySlug(slug);

  if (!article || 'error' in article) {
    return <div>Article not found</div>;
  }

  return <PostDetails article={article} />;
};

export default ArticlePage;
