'use client';

import { StatusPage } from '@/components/common/status-page';
import { routes } from '@/constants/routes';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[hsl(40,33%,98%)] font-sans text-[hsl(222,25%,14%)] antialiased dark:bg-[hsl(222,28%,8%)] dark:text-[hsl(40,20%,96%)]">
        <StatusPage
          code="Critical"
          title="Application error"
          description={
            error.message ||
            'A critical error occurred. Please refresh the page or return home.'
          }
          icon="alert-triangle"
          actions={[
            { label: 'Try again', onClick: reset },
            { label: 'Go home', href: routes.home, variant: 'outline' },
          ]}
        />
      </body>
    </html>
  );
}
