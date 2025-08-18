import z from 'zod';

export const theRoles = ['EDITOR', 'USER'] as const;

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(theRoles, { message: 'Invalid role' }),
});

export type CreaterUserSchema = z.infer<typeof createUserSchema>;
