import { auth } from '@/auth';
import { Link } from '@/i18n/navigation';

const NotFoundPage = async () => {
  const session = await auth();
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="text-center space-y-4">
        <p className="text-8xl">Ups! - 404</p>
        <p className="text-muted-foreground text-lg">
          Sorry, the page you are looking for is not available or has been
          moved.
        </p>

        <Link
          className="text-sky-600 underline"
          href={`/${session ? 'dashboard' : '/'}`}
        >
          Bring me back
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
