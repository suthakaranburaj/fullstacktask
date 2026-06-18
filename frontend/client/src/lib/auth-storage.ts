import { storageKeys } from '@/constants/app';
import type { AuthUser } from '@/modules/auth/auth.types';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(storageKeys.accessToken);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(storageKeys.refreshToken);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(storageKeys.user);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function saveAuthSession(
  user: AuthUser,
  accessToken: string,
  refreshToken: string
): void {
  localStorage.setItem(storageKeys.user, JSON.stringify(user));
  localStorage.setItem(storageKeys.accessToken, accessToken);
  localStorage.setItem(storageKeys.refreshToken, refreshToken);
}

export function updateTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(storageKeys.accessToken, accessToken);
  localStorage.setItem(storageKeys.refreshToken, refreshToken);
}

export function clearAuthSession(): void {
  localStorage.removeItem(storageKeys.user);
  localStorage.removeItem(storageKeys.accessToken);
  localStorage.removeItem(storageKeys.refreshToken);
}

export function hasCompletedTour(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(storageKeys.tourCompleted) === 'true';
}

export function markTourCompleted(): void {
  localStorage.setItem(storageKeys.tourCompleted, 'true');
}
