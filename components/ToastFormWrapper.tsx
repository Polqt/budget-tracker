'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type ActionResult = {
  success: boolean;
  message: string;
  redirectTo?: string;
};

export default function ToastFormWrapper({
  children,
  action,
  className,
}: {
  children: React.ReactNode | ((props: { isSubmitting: boolean }) => React.ReactNode);
  action: (formData: FormData) => Promise<ActionResult>;
  className?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await action(formData);

      if (result.success) {
        toast.success(result.message);

        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className={className}>
      {typeof children === 'function' ? children({ isSubmitting }) : children}
    </form>
  );
}
