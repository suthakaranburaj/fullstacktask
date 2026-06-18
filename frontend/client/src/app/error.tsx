'use client';

import { useEffect } from 'react';
import { StatusPage } from '@/components/common/status-page';
import { routes } from '@/constants/routes';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code="Error"
      title="Something went wrong"
      description="An unexpected error occurred while loading this page. Please try again."
      icon="alert-triangle"
      actions={[
        { label: 'Try again', onClick: reset },
        { label: 'Go home', href: routes.home, variant: 'outline' },
      ]}
    />
  );
}
