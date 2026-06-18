'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogOut, NotebookPen } from 'lucide-react';
import { UserAvatar } from '@/components/common/user-avatar';
import { siteConfig } from '@/constants/site';
import { routes } from '@/constants/routes';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { fadeIn } from '@/lib/motion';
import { useAuth } from '@/providers/auth-provider';

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <motion.header
      {...fadeIn}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href={routes.home}
          className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-80"
          data-tour="dashboard-welcome"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
            <NotebookPen className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold leading-none">{siteConfig.name}</p>
            <p className="text-xs text-muted-foreground">Your notes workspace</p>
          </div>
        </Link>

        <div className="flex items-center gap-2" data-tour="user-menu">
          {user ? (
            <UserAvatar name={user.name} email={user.email} picture={user.picture} />
          ) : null}
          <ThemeToggle />
          <Button variant="outline" size="icon" onClick={() => void logout()} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
