'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
    return (
      <div className="flex min-h-screen items-center justify-center hero-gradient">
        <p className="text-sm text-muted-foreground">Loading your workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
