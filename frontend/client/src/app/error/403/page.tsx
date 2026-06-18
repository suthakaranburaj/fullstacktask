import type { Metadata } from 'next';
import { StatusPage } from '@/components/common/status-page';
import { routes } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Forbidden',
};

export default function ForbiddenPage() {
  return (
    <StatusPage
      code="403"
      title="Access forbidden"
      description="You do not have permission to view this resource."
      icon="shield-alert"
      actions={[
        { label: 'Back to home', href: routes.home },
        { label: 'Contact support', href: routes.home, variant: 'outline' },
      ]}
    />
  );
}
