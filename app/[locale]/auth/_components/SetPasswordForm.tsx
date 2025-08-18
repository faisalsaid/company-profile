'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { setPassword } from '../_lib/auth.actions';
import { toast } from 'sonner';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 chars'),
});

export default function SetPasswordForm({ token }: { token: string }) {
  const form = useForm<{ password: string }>({
    resolver: zodResolver(schema),
    defaultValues: { password: '' },
  });

  async function onSubmit(values: { password: string }) {
    const res = await setPassword({ token, password: values.password });
    if (res.ok) {
      toast.success('Password updated! You can now log in.');
    } else {
      toast.error(res.error ?? 'Failed to update password.');
    }
  }

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <input
          type="password"
          {...form.register('password')}
          placeholder="New password"
        />
        <button type="submit">Set Password</button>
      </form>
    </div>
  );
}
