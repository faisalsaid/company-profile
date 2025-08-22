'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { editProfileSchema, EditProfileSchema } from '../_lib/profile.zod';
import { updateProfileAction } from '../_lib/profile.action';
import { useRouter } from 'next/navigation';

const EditProfile = ({ currentName }: { currentName: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: currentName,
    },
  });

  const onSubmit = async (values: EditProfileSchema) => {
    const toastId = toast.loading('Updating profile...');
    try {
      const res = await updateProfileAction(values);

      if (!res.success) {
        toast.error(res.message || 'Gagal update profil');

        return;
      }

      toast.success('Profil berhasil diperbarui');
      router.refresh();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name">Nama</Label>
                  <FormControl>
                    <Input id="name" placeholder="Nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
