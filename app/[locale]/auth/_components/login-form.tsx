'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { loginSchema } from '@/lib/zod';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { SigninSchema } from '@/types/auth.type';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginForm = () => {
  const t = useTranslations('AuthPage');

  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  const form = useForm<SigninSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      setShowResetSuccess(true);

      // opsional: hapus query param biar URL bersih
      router.replace('/auth/login');
    }
  }, [searchParams, router]);

  const onSubmit = async (data: SigninSchema) => {
    const toastId = toast.loading('Logging in...');

    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    toast.dismiss(toastId);

    if (res?.error) {
      toast.error('Error Credentials');
    } else if (res?.ok) {
      toast.success('Login success!');
      router.push('/dashboard');
    }
  };

  return (
    <Card className="w-full max-w-md rounded-2xl shadow-md">
      <CardContent className="p-6 space-y-2">
        {/* <GoogleAuth disabled={form.formState.isSubmitting} /> */}
        {/* <div className="flex items-center space-x-2 mt-6">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div> */}
        <h2 className="text-lg text-center">{t('LOGIN')}</h2>

        {showResetSuccess && (
          <Alert
            variant="default"
            className="mb-4 bg-green-500/10 border-green-500 "
          >
            <AlertDescription className="text-green-800 flex items-center justify-center">
              <Check />
              <span>{t('PASSWORD_RESET_SUCCESS')}</span>
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <fieldset
              disabled={form.formState.isSubmitting}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email :</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sm"
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('PASSWORD')} :</FormLabel>
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

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-sky-500 hover:underline"
                >
                  {t('FORGOT_PASSWORD')}
                </Link>
              </div>

              <Button type="submit" className="w-full">
                {form.formState.isSubmitting ? t('PROCCESSING') : t('SIGN-IN')}
              </Button>
              {/* <p className="text-xs text-center text-muted-foreground">
                <span>{`${t('DONT-HAVE-ACCOUNT?')} `}</span>
                <Link href="/auth/register" className="text-sky-400 underline">
                  {t('REGISTER-HERE')}
                </Link>
              </p> */}
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
