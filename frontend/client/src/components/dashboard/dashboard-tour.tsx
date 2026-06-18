'use client';

import { useEffect } from 'react';
import { TourProvider, useTour } from '@reactour/tour';
import { hasCompletedTour, markTourCompleted } from '@/lib/auth-storage';
import { dashboardTourSteps } from './dashboard-tour-steps';

function TourStarter() {
  const { setIsOpen } = useTour();

  useEffect(() => {
    if (!hasCompletedTour()) {
      const timer = setTimeout(() => setIsOpen(true), 700);
      return () => clearTimeout(timer);
    }
  }, [setIsOpen]);

  return null;
}

export function DashboardTourProvider({ children }: { children: React.ReactNode }) {
  return (
    <TourProvider
      steps={dashboardTourSteps}
  beforeClose={() => {
        markTourCompleted();
      }}
      onClickClose={({ setIsOpen }) => {
        markTourCompleted();
        setIsOpen(false);
      }}
      onClickMask={({ setIsOpen }) => {
        markTourCompleted();
        setIsOpen(false);
      }}
      styles={{
        popover: (base) => ({
          ...base,
          borderRadius: 12,
          padding: 16,
          maxWidth: 320,
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: 'hsl(158 64% 40%)',
        }),
      }}
      padding={{ mask: 8 }}
    >
      <TourStarter />
      {children}
    </TourProvider>
  );
}
