import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ChangePassword from './_components/ChangePassword';

const ProfilePage = async () => {
  const session = await auth();

  if (!session) {
    return <div>Not User</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="w-full h-44 bg-muted-foreground rounded-smb rounded-2xl"></div>
        <div className="-mt-15 space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-muted w-28 aspect-square rounded-full shadow"></div>
          </div>
          <div className="text-center space-y-1 text-muted-foreground">
            <p className="text-2xl font-semibold text-primary">
              {session.user.name}
            </p>
            <p className="">{session.user.email}</p>
            <p className=" text-sm capitalize">
              {session.user.role.toLocaleLowerCase()}
            </p>

            <div className="flex gap-4 mx-auto items-center justify-center">
              <ChangePassword />
              <Button>Edit Profile</Button>
            </div>
          </div>
        </div>
      </div>

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
