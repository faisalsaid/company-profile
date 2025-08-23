import { auth } from '@/auth';
import { getPostBySlug } from '@/actions/articleAction';
import ArticelForm from '../../_components/ArticelForm';

interface ParamsProps {
  slug: string;
}

interface PageProps {
  params: Promise<ParamsProps>;
}

const EditPostPage = async ({ params }: PageProps) => {
  // get session
  const session = await auth();

  // fetch arcicle and categories
  const { slug } = await params;

  const article = await getPostBySlug(slug);

  // Ensure the user has the appropriate role or owns the article.
  //   const permision =
  //     ['ADMIN', 'PEMRED', 'REDAKTUR'].includes(session?.user.role as string) ||
  //     post?.authorId === session?.user.id;

  //   if (!permision) {
  //     redirect('/posts');
  //   }

  if (!article || !session?.user)
    return <div>Post not found or unauthorized</div>;

  if (!article || 'error' in article) {
    return <div>Article not found</div>;
  }

  const transformedPost = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.content,
    summary: article.summary ?? '',
    status: article.status,
    authorId: article.authorId,
    media: article.media.map((m) => ({
      id: m.mediaAsset.id,
      role: m.role,
    })),
  };
  return <ArticelForm initialData={transformedPost} session={session} />;
};

export default EditPostPage;
