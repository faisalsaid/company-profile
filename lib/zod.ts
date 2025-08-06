import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character')
    .max(32, 'Password cannot be longer than 32 characters.'),
});

// ASSET SCHEMA
export const addAssetSchema = z.object({
  title: z.string().optional(),
  caption: z.string().optional(),
  url: z.string().url(),
  public_id: z.string().optional(),
  secure_url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  resource_type: z.string(),
  format: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  uploadedBy: z.string(),
});
