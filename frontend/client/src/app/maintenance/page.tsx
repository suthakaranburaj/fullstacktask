import type { Metadata } from 'next';
import { StatusPage } from '@/components/common/status-page';
import { routes } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Maintenance',
};

export default function MaintenancePage() {
  return (
    <StatusPage
      code="Maintenance"
      title="We will be right back"
      description="NoteNest is undergoing scheduled maintenance to serve you better. Please check back soon."
      icon="construction"
      actions={[
        { label: 'Back to home', href: routes.home },
        { label: 'Try again', href: routes.home, variant: 'outline' },
      ]}
    />
  );
}
