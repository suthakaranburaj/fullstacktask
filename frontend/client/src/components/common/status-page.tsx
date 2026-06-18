'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  Construction,
  FileQuestion,
  LogIn,
  LucideIcon,
  ServerCrash,
  ShieldAlert,
  WifiOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const statusIcons = {
  'file-question': FileQuestion,
  'alert-triangle': AlertTriangle,
  'log-in': LogIn,
  'shield-alert': ShieldAlert,
  'server-crash': ServerCrash,
  construction: Construction,
  'wifi-off': WifiOff,
} as const;

export type StatusIconName = keyof typeof statusIcons;

export interface StatusPageAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'secondary';
}

export interface StatusPageProps {
  code: string;
  title: string;
  description: string;
  icon: StatusIconName;
  actions?: StatusPageAction[];
  className?: string;
}

export function StatusPage({
  code,
  title,
  description,
  icon,
  actions = [],
  className,
}: StatusPageProps) {
  const Icon: LucideIcon = statusIcons[icon];

  return (
    <main
      className={cn(
        'flex min-h-screen items-center justify-center px-4 py-16 hero-gradient',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-8 w-8" aria-hidden />
        </div>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">{code}</p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-balance text-muted-foreground">{description}</p>

        {actions.length > 0 ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {actions.map((action) => {
              if (action.onClick) {
                return (
                  <Button
                    key={action.label}
                    variant={action.variant ?? 'default'}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                );
              }

              return (
                <Button key={action.label} variant={action.variant ?? 'default'} asChild>
                  <Link href={action.href ?? '/'}>{action.label}</Link>
                </Button>
              );
            })}
          </div>
        ) : null}
      </div>
    </main>
  );
}
