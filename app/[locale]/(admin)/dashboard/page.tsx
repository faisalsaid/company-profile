import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
  const session = await auth();
  if (!session) {
    redirect('/');
  }
  return (
    <div>
      <h1>Hallo, {session ? session.user.name : 'Guest'}</h1>;
    </div>
  );
};

export default DashboardPage;
