import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { Plus } from 'lucide-react';
import CreateUserForm from './_components/CreateUserForm';

const UsersPage = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-primary-foreground p-2 rounded-xl">
        <h2>All User</h2>
        <div>
          <CreateUserForm />
        </div>
      </div>
      <div className="bg-primary-foreground p-4 rounded-xl space-y-4">
        <div>{/* <PostFilterBar author={allAuthor} /> */}</div>
        {/* <AllPostTable
          columns={AllPostsColumns}
          data={data}
          pagination={{
            page: pageNumber,
            limit: pageSizeNumber,
            totalPages,
            total,
          }}
        /> */}
      </div>
    </div>
  );
};

export default UsersPage;
