'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/constants/routes';
import {
  clearAuthSession,
  getRefreshToken,
  getStoredUser,
  saveAuthSession,
} from '@/lib/auth-storage';
import { fetchCurrentUser, logoutUser, signInWithGoogle } from '@/modules/auth/auth.service';
import type { AuthUser } from '@/modules/auth/auth.types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      const storedUser = getStoredUser();
      if (!storedUser) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch {
        clearAuthSession();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void hydrate();
  }, []);

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      const session = await signInWithGoogle({ idToken });
      saveAuthSession(session.user, session.tokens.accessToken, session.tokens.refreshToken);
      setUser(session.user);
      router.replace(routes.dashboard);
    },
    [router]
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await logoutUser(refreshToken);
      } catch {
        // Clear local session even if API logout fails.
      }
    }

    clearAuthSession();
    setUser(null);
    router.replace(routes.login);
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      loginWithGoogle,
      logout,
    }),
    [user, isLoading, loginWithGoogle, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
