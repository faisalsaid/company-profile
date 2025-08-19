'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@/i18n/navigation';
import { House, LogOutIcon, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

const UserMenu = ({ data }: { data: Session | null }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="hover:cursor-pointer">
          <AvatarImage src={data?.user.image as string} alt={'profile'} />
          <AvatarFallback>!</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={10}>
        <DropdownMenuLabel>
          <div className=" sm:hidden">
            <p className="capitalize line-clamp-1 ">{data?.user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {data?.user.role.toLocaleLowerCase()}
            </p>
          </div>
          <p className="hidden sm:block">My Account</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <Link href={'/profile'}>
          <DropdownMenuItem>
            <User className="h-[1.2rem] w-[1.2rem] mr-2" />
            Profile
          </DropdownMenuItem>
        </Link>
        {/* <Link href={'/room'}>
          <DropdownMenuItem>
            <House className="h-[1.2rem] w-[1.2rem] mr-2" />
            My Room
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
          Settings
        </DropdownMenuItem> */}
        <DropdownMenuItem variant="destructive">
          <Button
            onClick={() => signOut({ redirectTo: '/' })}
            variant={'outline'}
          >
            <LogOutIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
