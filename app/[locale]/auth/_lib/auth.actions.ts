'use server';

import prisma from '@/lib/prisma';
import { hashSync } from 'bcrypt-ts';
import { generatePasswordResetToken } from './tokens';
import { sendPasswordResetEmail } from './mailer';
import crypto from 'crypto';
import { createTransport } from 'nodemailer';

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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

// handle forgot password

export async function forgotPasswordAction(email: string) {
  try {
    // Cari user (silent, jangan kasih tahu ke UI kalau tidak ketemu)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Hapus token lama user
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      });

      // Generate token baru
      const { rawToken, tokenHash, expiresAt } = generatePasswordResetToken();

      // Simpan ke DB
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      // Kirim email reset password
      await sendPasswordResetEmail(user.email, rawToken, user.id);
    }

    // Return sukses generik (baik email ada atau tidak)
    return { success: true };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { success: true }; // tetap return generik
  }
}

// 🔹 Validasi token reset password
export async function validateResetToken(
  token: string,
  userId: string,
): Promise<boolean> {
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const record = await prisma.passwordResetToken.findFirst({
      where: {
        userId,
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    return !!record;
  } catch (err) {
    console.error('validateResetToken error:', err);
    return false;
  }
}

// 🔹 Reset password action
export async function resetPasswordAction(
  userId: string,
  token: string,
  newPassword: string,
) {
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // 🔹 Validasi token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId,
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true }, // supaya dapat email user
    });

    if (!resetToken || !resetToken.user) {
      throw new Error('The token is invalid or has expired.');
    }

    // 🔹 Hash password baru
    const hashedPassword = hashSync(newPassword, 10);

    // 🔹 Update password user
    await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword },
    });

    // 🔹 Tandai token sudah dipakai
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    });

    // 🔹 Hapus semua session user
    await prisma.session.deleteMany({
      where: { userId },
    });

    // 🔹 Kirim email notifikasi
    await transporter.sendMail({
      from: `"Support App" <${process.env.SMTP_USER}>`,
      to: resetToken.user.email,
      subject: 'Your account password has been changed',
      text: `Hello ${
        resetToken.user.name || ''
      },\n\nYour account password has been successfully updated. If this wasn’t you, please reset your password immediately.`,
      html: `
        <p>Hello ${resetToken.user.name || 'User'},</p>
        <p>Your account password has been <b>successfully updated</b>.</p>
        <p>If this wasn’t you, please <a href="${
          process.env.NEXT_PUBLIC_APP_URL
        }/auth/forgot-password">reset your password</a> immediately.</p>
        <br/>
        <p>Thank you,</p>
        <p><b>Support App</b></p>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error('resetPasswordAction error:', err);
    throw err;
  }
}
