'use client';

import { useCurrentUser } from '@/app/[locale]/_lib/UserProvider';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { Plus } from 'lucide-react';

const AddPostButton = () => {
  const curentUser = useCurrentUser();

  if (curentUser?.role !== 'ADMIN' && curentUser?.role !== 'EDITOR') {
    return null;
  }
  return (
    <div>
      <Link href={'/blog/create'}>
        <Button size={'sm'}>
          <Plus /> Add post
        </Button>
      </Link>
    </div>
  );
};

export default AddPostButton;
