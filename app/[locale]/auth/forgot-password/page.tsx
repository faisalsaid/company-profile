'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { webTitle } from '@/lib/staticData';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { forgotPasswordAction } from '../_lib/auth.actions';

export default function ForgotPasswordPage() {
  const t = useTranslations('AuthPage');

  const [submitted, setSubmitted] = useState(false);

  // ✅ Validasi schema pakai Zod
  const formSchema = z.object({
    email: z.string().email(t('INVALID_EMAIL')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await forgotPasswordAction(values.email);
      setSubmitted(true);
    } catch (err) {
      console.error('Forgot password error:', err);
    }
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
            {t('FORGOT_PASSWORD')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                {t('SEND_IF_EMAIL_EXIST')}
              </p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                {t('RESEND')}
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {t('SEND_RESET_LINK')}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
