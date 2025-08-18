'use server';

import prisma from '@/lib/prisma';
import { hashSync } from 'bcrypt-ts';

export async function setPassword({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
  const record = await prisma.verificationToken.findFirst({
    where: { token },
  });

  if (!record || record.expires < new Date()) {
    return { ok: false, error: 'Invalid or expired token' };
  }

  const hashed = hashSync(password, 10);

  await prisma.user.update({
    where: { email: record.identifier },
    data: { hashedPassword: hashed },
  });

  // sekali pakai: hapus token
  await prisma.verificationToken.deleteMany({ where: { token } });

  return { ok: true };
}
