'use client';

import { useEffect, useMemo, type CSSProperties } from 'react';
import { useTheme } from 'next-themes';
import { TourProvider, useTour } from '@reactour/tour';
import { hasCompletedTour, markTourCompleted } from '@/lib/auth-storage';
import { TourPopoverContent } from './tour-popover-content';
import { dashboardTourSteps } from './dashboard-tour-steps';

function TourStarter() {
  const { setIsOpen } = useTour();

  useEffect(() => {
    if (!hasCompletedTour()) {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [setIsOpen]);

  return null;
}

function getTourStyles(isDark: boolean) {
  return {
    popover: (base: CSSProperties) => ({
      ...base,
      backgroundColor: isDark ? 'hsl(222 24% 11%)' : 'hsl(0 0% 100%)',
      color: isDark ? 'hsl(40 20% 96%)' : 'hsl(222 25% 14%)',
      borderRadius: 16,
      padding: 20,
      maxWidth: 360,
      border: isDark ? '1px solid hsl(222 16% 22%)' : '1px solid hsl(40 16% 88%)',
      boxShadow: isDark
        ? '0 24px 48px rgba(0, 0, 0, 0.45)'
        : '0 24px 48px rgba(15, 23, 42, 0.12)',
    }),
    maskArea: (base: CSSProperties) => ({
      ...base,
      rx: 12,
    }),
    badge: (base: CSSProperties) => ({
      ...base,
      backgroundColor: isDark ? 'hsl(158 55% 52%)' : 'hsl(158 64% 40%)',
      color: isDark ? 'hsl(222 28% 8%)' : 'hsl(0 0% 100%)',
    }),
    controls: (base: CSSProperties) => ({
      ...base,
      color: isDark ? 'hsl(40 20% 96%)' : 'hsl(222 25% 14%)',
    }),
    close: (base: CSSProperties) => ({
      ...base,
      color: isDark ? 'hsl(220 12% 68%)' : 'hsl(220 10% 42%)',
      width: 14,
      height: 14,
      top: 12,
      right: 12,
    }),
  };
}

export function DashboardTourProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const styles = useMemo(() => getTourStyles(isDark), [isDark]);

  return (
    <TourProvider
      key={isDark ? 'dark' : 'light'}
      steps={dashboardTourSteps}
      ContentComponent={TourPopoverContent}
      showBadge
      showNavigation={false}
      showDots
      showCloseButton={false}
      scrollSmooth
      beforeClose={() => markTourCompleted()}
      onClickClose={({ setIsOpen }) => {
        markTourCompleted();
        setIsOpen(false);
      }}
      onClickMask={({ setIsOpen }) => {
        markTourCompleted();
        setIsOpen(false);
      }}
      styles={styles}
      padding={{ mask: 10, popover: [12, 12] }}
      className="reactour-theme-aware"
    >
      <TourStarter />
      {children}
    </TourProvider>
  );
}
