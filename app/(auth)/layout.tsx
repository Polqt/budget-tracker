import { Toaster } from 'sonner';

export default function AuthenticationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
