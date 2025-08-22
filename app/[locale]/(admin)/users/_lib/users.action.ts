'use server';

import prisma from '@/lib/prisma';
import { Prisma, UserRole } from '@prisma/client';
import { CreaterUserSchema, createUserSchema } from './users.zod';
import crypto from 'crypto';
import { createTransport } from 'nodemailer';

type ActionResult =
  | { ok: true } // sukses
  | { ok: false; error: string } // gagal umum
  | { ok: false; fieldErrors: Record<string, string[]> }; // gagal validasi

export async function registerNewUser({
  data,
}: {
  data: CreaterUserSchema;
}): Promise<ActionResult> {
  // validated form field

  const parsed = createUserSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { name, email, role } = parsed.data;

  try {
    // create new user
    await prisma.user.create({
      data: { name, email, role },
    });

    // create verification token

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    // send email

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Compay Profile App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify your acount',
      html: `<p> Hello ${name ?? 'User'}, </p>
      <p> Your account has been created. Please verify your email:</p>
      <a href="${verifyUrl}">Verify Account</a>
      `,
    });

    return { ok: true };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      // unique constraint
      return { ok: false, error: 'The email has already been used.' };
    }
    console.error('User creation failed:', err);
    return { ok: false, error: 'Account creation failed. Please try again.' };
  }
}

export interface UpdateUserRoleInput {
  userId: string;
  role: UserRole;
}
export const updateUserRole = async ({ userId, role }: UpdateUserRoleInput) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return updatedUser;
  } catch (error) {
    console.error('❌ Failed to update user role:', error);
    throw new Error('Failed to update user role.');
  }
};
