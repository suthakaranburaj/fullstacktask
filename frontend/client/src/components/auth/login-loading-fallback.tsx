'use client';

import { AuthLoadingScreen } from '@/components/common/auth-loading-screen';

export function LoginLoadingFallback() {
  return <AuthLoadingScreen message="Loading sign in..." />;
}
