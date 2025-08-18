// app/[locale]/auth/set-password/page.tsx
import prisma from '@/lib/prisma';
import SetPasswordForm from '../_components/SetPasswordForm';

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  console.log('TOKEN =>', token);

  if (!token) {
    return <div>Invalid or missing token</div>;
  }

  // const record = await prisma.verificationToken.findFirst({
  //   where: { token },
  // });

  // console.log('RECORD', record);

  // if (!record || record.expires < new Date()) {
  //   return <div>Token invalid or expired</div>;
  // }

  return (
    <div>
      <SetPasswordForm token={token} />
    </div>
  );
}
