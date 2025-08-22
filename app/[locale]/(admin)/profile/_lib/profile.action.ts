'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { compare, hash } from 'bcrypt-ts';
import { z } from 'zod';
import { changePasswordSchema, editProfileSchema } from './profile.zod';

export async function changePasswordAction(
  values: z.infer<typeof changePasswordSchema>,
) {
  // ✅ Ambil user dari session
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // ✅ Validasi input
  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error('Invalid input');
  }
  const { oldPassword, newPassword } = parsed.data;

  // ✅ Cari user di database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.hashedPassword) {
    throw new Error('User tidak ditemukan');
  }

  // ✅ Bandingkan oldPassword
  const isMatch = await compare(oldPassword, user.hashedPassword);
  if (!isMatch) {
    throw new Error('Password lama salah');
  }

  // ✅ Update dengan password baru
  const hashed = await hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { hashedPassword: hashed },
  });

  return { success: true };
}

export async function updateProfileAction(
  values: z.infer<typeof editProfileSchema>,
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  const parsed = editProfileSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: 'Invalid input' };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  });

  return { success: true };
}
