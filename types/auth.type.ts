import { z } from 'zod';
import { loginSchema, registerSchema } from '@/lib/zod';

export type SigninSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
