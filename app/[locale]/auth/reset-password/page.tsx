'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// 👉 Import server action (nanti kita buat)
import { resetPasswordAction, validateResetToken } from '../_lib/auth.actions';

const schema = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  const [isValid, setIsValid] = useState<boolean | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  // 🔹 Cek validasi token di server
  useEffect(() => {
    async function checkToken() {
      if (token && uid) {
        const valid = await validateResetToken(token, uid);
        setIsValid(valid);
      } else {
        setIsValid(false);
      }
    }
    checkToken();
  }, [token, uid]);

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!token || !uid) return;
    try {
      await resetPasswordAction(uid, token, values.password);
      router.push('/login?reset=success');
    } catch (err) {
      console.error('Reset password error:', err);
    }
  }

  if (isValid === null) {
    return <p className="text-center p-6">Memeriksa token...</p>;
  }

  if (isValid === false) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-6 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-xl text-red-600">
              Link tidak valid / kadaluarsa
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p>Silakan minta ulang link reset password.</p>
            <Button onClick={() => router.push('/forgot-password')}>
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Atur Password Baru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Baru</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Simpan Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
