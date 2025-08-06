import { auth } from '@/auth';
import ArticelForm from '../_components/ArticelForm';

const CreatePostPage = async () => {
  const session = await auth();

  if (!session) {
    return <div>No User Exist</div>;
  }
  // console.log(session?.user);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-primary-foreground p-2 rounded-xl">
        <h2>Create a post</h2>
      </div>
      <div className="bg-primary-foreground p-4 rounded-xl space-y-4">
        <ArticelForm session={session} />
      </div>
    </div>
  );
};

export default CreatePostPage;
