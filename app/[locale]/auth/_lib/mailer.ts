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
      <p>Anda meminta reset password.</p>
      <p>Klik link berikut untuk mengatur password baru (berlaku 1 jam):</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Abaikan email ini jika Anda tidak meminta reset.</p>
    `,
  });
}
