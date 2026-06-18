import { Server } from 'lucide-react';
import { renderColdStartConfig } from '@/constants/app';
import { cn } from '@/lib/utils';

interface RenderColdStartNoticeProps {
  show: boolean;
  className?: string;
}

export function RenderColdStartNotice({ show, className }: RenderColdStartNoticeProps) {
  if (!show) return null;

  return (
    <div
      role="status"
      className={cn(
        'rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Server className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <p>{renderColdStartConfig.message}</p>
      </div>
    </div>
  );
}
