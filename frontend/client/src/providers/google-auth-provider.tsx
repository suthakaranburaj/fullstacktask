'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { apiConfig } from '@/constants/app';

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  if (!apiConfig.googleClientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={apiConfig.googleClientId}>{children}</GoogleOAuthProvider>
  );
}
