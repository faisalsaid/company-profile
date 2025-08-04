'use server';

import { signIn } from '@/auth';
import prisma from '@/lib/prisma';
import { loginSchema, registerSchema } from '@/lib/zod';
import { hashSync } from 'bcrypt-ts';
import { AuthError } from 'next-auth';
import { Prisma } from '@prisma/client';
import { RegisterSchema, SigninSchema } from '@/types/auth.type';

type ActionResult =
  | { ok: true } // sukses
  | { ok: false; error: string } // gagal umum
  | { ok: false; fieldErrors: Record<string, string[]> }; // gagal validasi

export async function signupCredentials({
  data,
}: {
  data: RegisterSchema;
}): Promise<ActionResult> {
  // validated form field
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { name, email, password } = parsed.data;

  // hash password
  const hashedPassword = hashSync(password, 10);

  // Block mutated db create user
  try {
    await prisma.user.create({
      data: { name, email, hashedPassword },
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

type SigninProps = {
  data: SigninSchema;
};

export const signinCredentials = async ({ data }: SigninProps) => {
  // validated form field
  const validatedField = loginSchema.safeParse(data);
  if (!validatedField.success) {
    return {
      error: validatedField.error.flatten().fieldErrors,
    };
  }

  // Destructuring field
  const { email, password } = validatedField.data;

  // signin use authjs
  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials' };
        default:
          return { message: 'Something went wrong' };
      }
    }
    throw error;
  }
};
