import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
  const session = await auth();
  if (!session) {
    redirect('/');
  }
  return <div>Hallo, {session ? session.user.name : 'Guest'}</div>;
};

export default DashboardPage;
