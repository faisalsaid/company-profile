import { createTransport } from 'nodemailer';

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(
  to: string,
  token: string,
  uid: string,
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}&uid=${uid}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Reset Password',
    html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to set a new password (valid for 1 hour):</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request a reset, please ignore this email.</p>
`,
  });
}
