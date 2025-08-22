import { z } from 'zod';

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character')
    .max(32, 'Password cannot be longer than 32 characters.'),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const editProfileSchema = z.object({
  name: z.string().min(2, 'Nama harus lebih dari 2 karakter'),
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;
