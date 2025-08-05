import { auth } from '@/auth';
import LoginForm from '@/app/[locale]/auth/_components/login-form';
import { redirect } from 'next/navigation';

const LoginPage = async () => {
  const session = await auth();
  if (session) {
    redirect('/');
  }
  return <LoginForm />;
};

export default LoginPage;
