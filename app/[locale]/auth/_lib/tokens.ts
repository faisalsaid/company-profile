import crypto from 'crypto';

// Generate token reset password
export function generatePasswordResetToken() {
  // Token mentah (untuk dikirim ke user)
  const rawToken = crypto.randomBytes(32).toString('hex');

  // Hash token (untuk disimpan di DB, biar aman kalau DB bocor)
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  // Token berlaku 1 jam
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  return { rawToken, tokenHash, expiresAt };
}
