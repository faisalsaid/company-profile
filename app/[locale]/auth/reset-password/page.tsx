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
import { useTranslations } from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { webTitle } from '@/lib/staticData';

const schema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character')
    .max(32, 'Password cannot be longer than 32 characters.'),
});

export default function ResetPasswordPage() {
  const t = useTranslations('AuthPage');
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  const [isValid, setIsValid] = useState<boolean | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: '' },
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
      router.push('/auth/login?reset=success');
    } catch (err) {
      console.error('Reset password error:', err);
    }
  }

  if (isValid === null) {
    return <p className="text-center p-6">{t('VERIFY_TOKEN')}</p>;
  }

  if (isValid === false) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-6 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-xl text-red-600">
              {t('LINK_INVALID_EXPIRED')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p>{t('REORDER_RESET_PASS_LINK')}</p>
            <Button onClick={() => router.push('/auth/forgot-password')}>
              {t('BACK')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=" min-w-72 space-y-6 ">
      <div>
        <Link href={'/'}>
          <h1 className="text-4xl text-center">{webTitle}</h1>
        </Link>
      </div>
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {t('CREATE_NEW_PASS')}
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
                    <FormLabel>{t('PASSWORD')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder={
                            showPassword ? t('TYPE-PASSWORD') : '••••••••'
                          }
                          className="pr-10 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:cursor-pointer"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {t('SAVE_PASS')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
