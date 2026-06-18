import type { Metadata } from 'next';
import { StatusPage } from '@/components/common/status-page';
import { routes } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Server Error',
};

export default function ServerErrorPage() {
  return (
    <StatusPage
      code="500"
      title="Internal server error"
      description="Something went wrong on our side. Our team has been notified — please try again shortly."
      icon="server-crash"
      actions={[
        { label: 'Back to home', href: routes.home },
        { label: 'Refresh page', href: routes.serverError, variant: 'outline' },
      ]}
    />
  );
}
