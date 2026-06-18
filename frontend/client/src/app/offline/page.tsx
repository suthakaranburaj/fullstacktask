import type { Metadata } from 'next';
import { StatusPage } from '@/components/common/status-page';
import { routes } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Offline',
};

export default function OfflinePage() {
  return (
    <StatusPage
      code="Offline"
      title="You appear to be offline"
      description="Please check your internet connection and try again."
      icon="wifi-off"
      actions={[
        { label: 'Back to home', href: routes.home },
        { label: 'Retry', href: routes.home, variant: 'outline' },
      ]}
    />
  );
}
