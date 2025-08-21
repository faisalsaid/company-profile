import { auth } from '@/auth';
import LoginForm from '@/app/[locale]/auth/_components/login-form';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { webTitle } from '@/lib/staticData';

const LoginPage = async () => {
  const session = await auth();
  // if (session) {
  //   redirect('/');
  // }
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div>
        <Link href={'/'}>
          <h1 className="text-2xl text-center">{webTitle}</h1>
        </Link>
      </div>
      <LoginForm />;
    </div>
  );
};

export default LoginPage;
