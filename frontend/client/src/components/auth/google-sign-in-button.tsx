'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { apiConfig } from '@/constants/app';
import { useAuth } from '@/providers/auth-provider';
import { ApiError } from '@/lib/api-error';

export function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setError('Google did not return a valid credential.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const redirect = searchParams.get('redirect');
      await loginWithGoogle(
        response.credential,
        redirect ? decodeURIComponent(redirect) : undefined
      );
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unable to sign in with Google.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!apiConfig.googleClientId) {
    return (
      <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID in environment variables.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className={isSubmitting ? 'pointer-events-none opacity-60' : ''}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError('Google sign-in was cancelled or failed.')}
          theme="outline"
          size="large"
          shape="pill"
          text="continue_with"
          width="320"
        />
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
