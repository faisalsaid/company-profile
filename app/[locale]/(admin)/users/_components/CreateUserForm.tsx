'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  CreaterUserSchema,
  createUserSchema,
  theRoles,
} from '../_lib/users.zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { registerNewUser } from '../_lib/users.action';
import { useState } from 'react';

const CreateUserForm = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreaterUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'USER',
    },
  });

  const onSubmit = async (data: CreaterUserSchema) => {
    const id = toast.loading('Register new user...');
    const res = await registerNewUser({ data });

    toast.dismiss(id);

    if (!res.ok) {
      // Error validasi field level
      if ('fieldErrors' in res) {
        Object.values(res.fieldErrors)
          .flat()
          .forEach((msg) => toast.error(msg));
        return;
      }
      toast.error(res.error);
      return;
    }

    toast.success('Account created successfully!');

    // ✅ Reset form
    form.reset();

    // ✅ Tutup dialog
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) {
            // ✅ Reset form setiap kali dialog ditutup
            form.reset();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button>
            <Plus /> New User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Input new user info</DialogTitle>
          </DialogHeader>
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset
                disabled={form.formState.isSubmitting}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          className="text-sm"
                          placeholder="e.g. Jhon Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className="text-sm"
                          placeholder="e.g. jhon-doe@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {theRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 items-center justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  <Button type="submit" className="w-fit">
                    {form.formState.isSubmitting
                      ? 'Processing...'
                      : 'Register New User'}
                  </Button>
                </div>
              </fieldset>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateUserForm;
