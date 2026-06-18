import type { Metadata } from 'next';
import { StatusPage } from '@/components/common/status-page';
import { routes } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Unauthorized',
};

export default function UnauthorizedPage() {
  return (
    <StatusPage
      code="401"
      title="Unauthorized"
      description="You need to sign in before accessing this page."
      icon="log-in"
      actions={[
        { label: 'Go to home', href: routes.home },
        { label: 'Try again later', href: routes.home, variant: 'outline' },
      ]}
    />
  );
}
