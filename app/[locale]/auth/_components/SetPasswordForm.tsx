'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { setPassword } from '../_lib/auth.actions';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  // FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default function SetPasswordForm({ token }: { token: string }) {
  const t = useTranslations('AuthPage');

  const [showPassword, setShowPassword] = useState(false);

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
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl text-center">Company Profile</h1>
        <p>{t('PLEASE_CREATE_PASSWORD')}</p>
      </div>
      <div className="flex items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center justify-center gap-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>{t('PASSWORD')} :</FormLabel> */}
                  <FormControl className="bg-accent rounded-sm">
                    <div className="relative ">
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

            <Button type="submit" className="w-fit">
              {form.formState.isSubmitting
                ? t('PROCCESSING')
                : t('SET_PASSWORD')}
            </Button>
            {/* <input
              type="password"
              {...form.register('password')}
              placeholder="New password"
            />
            <button type="submit">Set Password</button> */}
          </form>
        </Form>
      </div>
    </div>
  );
}
