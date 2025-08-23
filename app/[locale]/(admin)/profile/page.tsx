import { auth } from '@/auth';
import { Separator } from '@/components/ui/separator';
import UserPofile from './_components/UserPofile';

const ProfilePage = async () => {
  const session = await auth();

  if (!session) {
    return <div>Not User</div>;
  }

  return (
    <div className="space-y-6">
      <UserPofile />
      <div className="bg-muted p-4 rounded-2xl space-y-4">
        <div className="space-y-3">
          <p>My Posts</p>
          <div className="space-y-2">
            <div className="h-8 bg-muted-foreground rounded-lg w-full"></div>
            <div className="h-8 bg-muted-foreground rounded-lg w-full"></div>
          </div>
        </div>
        <Separator />
        <div className="space-y-3">
          <p>Popular Post</p>
          <div className="space-y-2">
            <div className="h-8 bg-muted-foreground rounded-lg w-full"></div>
            <div className="h-8 bg-muted-foreground rounded-lg w-full"></div>
          </div>
        </div>
        <Separator />
        <div className="space-y-3">
          <p>Event</p>
          <div className="space-y-2">
            <div className="h-8 bg-muted-foreground rounded-lg w-full"></div>
            <div className="h-8 bg-muted-foreground rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
