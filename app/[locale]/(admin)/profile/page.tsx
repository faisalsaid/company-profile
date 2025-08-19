import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="w-full h-44 bg-muted-foreground rounded-smb rounded-2xl"></div>
        <div className="-mt-15 space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-muted w-28 aspect-square rounded-full shadow"></div>
          </div>
          <div className="text-center space-y-1 text-muted-foreground">
            <p className="text-2xl font-semibold text-primary">Dave C. Brown</p>
            <p className="">dave@email.com</p>
            <p className=" text-sm">Admin</p>
            <Button>Edit Profile</Button>
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
