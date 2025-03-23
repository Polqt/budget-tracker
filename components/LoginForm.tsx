'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import Link from 'next/link';
import { login } from '@/lib/auth-actions';
import { Button } from './ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
});

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);

      const result = await login(formData);

      if (result.success) {
        if (result.redirectTo) router.push(result.redirectTo);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Failed to login', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border py-8 px-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
      {error && (
        <div role='alert' className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          <span className='text-sm'>{error}</span>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="poyhidalgo@example.com"
                    className="w-full"
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input id="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            className="w-full mt-4"
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
      </Form>
      <div className="text-center text-slate-900/50 text-sm mt-6">
        Don&apos;t have an account?{' '}
        <Link href={'/register'} className="hover:text-primary font-medium">
          Register now
        </Link>
      </div>
    </div>
  );
}
