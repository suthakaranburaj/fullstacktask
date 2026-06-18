import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { NotebookPen } from 'lucide-react';
import { GuestGuard } from '@/components/auth/guest-guard';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { LoginLoadingFallback } from '@/components/auth/login-loading-fallback';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { siteConfig } from '@/constants/site';
import { routes } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Sign in',
};

function LoginContent() {
  return (
    <GuestGuard>
      <div className="relative min-h-screen hero-gradient">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
          <div className="rounded-2xl border bg-card p-8 shadow-lg">
            <div className="mb-8 flex flex-col items-center text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <NotebookPen className="h-7 w-7" aria-hidden />
              </span>
              <h1 className="text-2xl font-bold tracking-tight">Welcome to {siteConfig.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in with Google to access your notes or view a shared note.
              </p>
            </div>

            <GoogleSignInButton />

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Only Google sign-in is supported right now.
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href={routes.home} className="font-medium text-primary hover:underline">
              Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </GuestGuard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}
