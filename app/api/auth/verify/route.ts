// app/api/auth/verify/route.ts
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) return new Response('Invalid link', { status: 400 });

  const record = await prisma.verificationToken.findFirst({
    where: { token },
  });

  if (!record || record.expires < new Date()) {
    return new Response('Invalid or expired token', { status: 400 });
  }

  // verify email
  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  // // delete token biar sekali pakai
  // await prisma.verificationToken.deleteMany({
  //   where: { token },
  // });

  // redirect ke halaman set password
  return redirect(`/auth/set-password?token=${encodeURIComponent(token)}`);
}
