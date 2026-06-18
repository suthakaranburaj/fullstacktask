import { apiClient } from '@/lib/api-client';
import type { AuthSession, AuthUser, GoogleSignInPayload } from './auth.types';

export async function signInWithGoogle(payload: GoogleSignInPayload): Promise<AuthSession> {
  const response = await apiClient<AuthSession>('/auth/google', {
    method: 'POST',
    body: payload,
    auth: false,
  });

  return response.data;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await apiClient<AuthUser>('/auth/me');
  return response.data;
}

export async function logoutUser(refreshToken: string): Promise<void> {
  await apiClient<null>('/auth/logout', {
    method: 'POST',
    body: { refreshToken },
  });
}
