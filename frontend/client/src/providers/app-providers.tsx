'use client';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { GoogleAuthProvider } from '@/providers/google-auth-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <GoogleAuthProvider>
        <AuthProvider>{children}</AuthProvider>
      </GoogleAuthProvider>
    </ThemeProvider>
  );
}
