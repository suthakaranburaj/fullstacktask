'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLoadingScreen } from '@/components/common/auth-loading-screen';
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
    return <AuthLoadingScreen message="Checking your session..." />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
