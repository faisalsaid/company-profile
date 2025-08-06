import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
  const session = await auth();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>Hallo, {session ? session.user.name : 'Guest'}</h1>
    </div>
  );
};

export default DashboardPage;
