'use client';

import { useCurrentUser } from '@/app/[locale]/_lib/UserProvider';
import ChangePassword from './ChangePassword';
import EditProfile from './EditProfile';

const UserPofile = () => {
  const curentUser = useCurrentUser();
  return (
    <div>
      <div className="w-full h-44 bg-muted-foreground rounded-smb rounded-2xl"></div>
      <div className="-mt-15 space-y-4">
        <div className="flex items-center justify-center">
          <div className="bg-muted w-28 aspect-square rounded-full shadow"></div>
        </div>
        <div className="text-center space-y-1 text-muted-foreground">
          <p className="text-2xl font-semibold text-primary">
            {curentUser?.name}
          </p>
          <p className="">{curentUser?.email}</p>
          <p className=" text-sm capitalize">
            {curentUser?.role.toLocaleLowerCase()}
          </p>

          <div className="flex gap-4 mx-auto items-center justify-center">
            <ChangePassword />
            <EditProfile currentName={curentUser?.name as string} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPofile;
