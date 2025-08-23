'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { changePasswordAction } from '../_lib/profile.action';
import { changePasswordSchema } from '../_lib/profile.zod';

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const [open, setOpen] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordSchema) => {
    const toastId = toast.loading('Updating password...');
    try {
      const res = await changePasswordAction(data);

      if (res.success) {
        toast.success('Password berhasil diubah');
        form.reset();
        setOpen(false);
      }
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error(error.message || 'Gagal update password');
    } finally {
      toast.dismiss(toastId);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="secondary">Change Password</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <Separator />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-2"
            >
              <fieldset
                disabled={form.formState.isSubmitting}
                className="space-y-4"
              >
                {/* Old Password */}
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showOld ? 'text' : 'password'}
                            placeholder={showOld ? 'Type Password' : '••••••••'}
                            className="pr-10 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOld(!showOld)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                            tabIndex={-1}
                          >
                            {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showNew ? 'text' : 'password'}
                            placeholder={showNew ? 'Type Password' : '••••••••'}
                            className="pr-10 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                            tabIndex={-1}
                          >
                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? 'Processing...'
                      : 'Update Password'}
                  </Button>
                </DialogFooter>
              </fieldset>
              <p className="text-xs p-2 border rounded-lg bg-green-500/10 border-green-200 text-green-700">
                <span className="font-semibold">Tips :</span> If you forgot your
                old password, please log out and use the forgot password feature
                on the login page.
              </p>
            </form>
          </Form>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default ChangePassword;
