import { auth } from '@/auth';
import RegisterForm from '@/app/[locale]/auth/_components/register-form';
import { redirect } from 'next/navigation';

const RegisterPage = async () => {
  const session = await auth();
  if (session) {
    redirect('/');
  }
  return <RegisterForm />;
};

export default RegisterPage;
