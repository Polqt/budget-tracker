import { BackgroundBeams } from '@/components/ui/background-beams';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4 text-center">
        <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-sans font-bold mb-4">
          Welcome to BudgetBuddy
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm relative z-10 mb-8">
          Take control of your finances with my easy-to-use budget tracker.{' '}
          <br />
          Track your income, expenses, and savings all in one place.
        </p>
        <Button
          variant={'outline'}
          size={'lg'}
          asChild
          className="relative z-10"
        >
          <Link href="/login">Get Started</Link>
        </Button>
        <BackgroundBeams />
      </div>
    </div>
  );
}
