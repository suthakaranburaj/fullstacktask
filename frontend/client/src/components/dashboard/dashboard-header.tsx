'use client';

import Image from 'next/image';
import { LogOut, NotebookPen } from 'lucide-react';
import { siteConfig } from '@/constants/site';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2" data-tour="dashboard-welcome">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <NotebookPen className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold leading-none">{siteConfig.name}</p>
            <p className="text-xs text-muted-foreground">Your notes workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-2" data-tour="user-menu">
          {user?.picture ? (
            <Image
              src={user.picture}
              alt={user.name || user.email}
              width={32}
              height={32}
              className="hidden rounded-full sm:block"
            />
          ) : null}
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
