import { auth } from '@/auth';

const DashboardPage = async () => {
  const session = await auth();
  return <div>Hallo, {session ? session.user.name : 'Guest'}</div>;
};

export default DashboardPage;
