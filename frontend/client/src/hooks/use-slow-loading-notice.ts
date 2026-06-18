import { useEffect, useState } from 'react';
import { renderColdStartConfig } from '@/constants/app';

export function useSlowLoadingNotice(
  isLoading: boolean,
  delayMs = renderColdStartConfig.noticeDelayMs
) {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowNotice(false);
      return;
    }

    const timer = setTimeout(() => setShowNotice(true), delayMs);
    return () => clearTimeout(timer);
  }, [isLoading, delayMs]);

  return showNotice;
}
