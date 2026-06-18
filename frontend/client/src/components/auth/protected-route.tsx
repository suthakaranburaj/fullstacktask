'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AuthLoadingScreen } from '@/components/common/auth-loading-screen';
import { routes } from '@/constants/routes';
import { useAuth } from '@/providers/auth-provider';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirect = encodeURIComponent(pathname + (searchParams.toString() ? `?${searchParams}` : ''));
      router.replace(`${routes.login}?redirect=${redirect}`);
    }
  }, [isAuthenticated, isLoading, pathname, router, searchParams]);

  if (isLoading) {
    return <AuthLoadingScreen message="Loading your workspace..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
