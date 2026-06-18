import { StatusPage } from '@/components/common/status-page';
import { routes } from '@/constants/routes';

export default function NotFoundPage() {
  return (
    <StatusPage
      code="404"
      title="Page not found"
      description="The page you are looking for does not exist or may have been moved."
      icon="file-question"
      actions={[
        { label: 'Back to home', href: routes.home },
        { label: 'Contact support', href: routes.home, variant: 'outline' },
      ]}
    />
  );
}
