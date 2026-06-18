'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { routes } from '@/constants/routes';
import { useAuth } from '@/providers/auth-provider';

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = searchParams.get('redirect');
      router.replace(redirect ? decodeURIComponent(redirect) : routes.dashboard);
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center hero-gradient">
        <p className="text-sm text-muted-foreground">Checking your session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
