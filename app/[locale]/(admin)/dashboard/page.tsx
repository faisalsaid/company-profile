import { auth } from '@/auth';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
  const session = await auth();
  // if (!session) {
  //   redirect('/');
  // }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>Hallo, {session ? session.user.name : 'Guest'}</h1>
    </div>
  );
};

export default DashboardPage;
