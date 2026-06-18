'use client';

import { Loader2 } from 'lucide-react';
import { RenderColdStartNotice } from '@/components/common/render-cold-start-notice';
import { useSlowLoadingNotice } from '@/hooks/use-slow-loading-notice';

interface AuthLoadingScreenProps {
  message: string;
}

export function AuthLoadingScreen({ message }: AuthLoadingScreenProps) {
  const showSlowNotice = useSlowLoadingNotice(true);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 hero-gradient">
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
      <p className="text-sm text-muted-foreground">{message}</p>
      <RenderColdStartNotice show={showSlowNotice} className="max-w-md text-center" />
    </div>
  );
}
