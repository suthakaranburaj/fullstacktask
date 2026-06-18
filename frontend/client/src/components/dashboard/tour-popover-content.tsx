'use client';

import type { PopoverContentProps } from '@reactour/tour';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TourPopoverContent({
  steps,
  currentStep,
  setCurrentStep,
  setIsOpen,
}: PopoverContentProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const step = steps[currentStep];
  const renderedContent =
    typeof step.content === 'function'
      ? (step.content({
          steps,
          currentStep,
          setCurrentStep,
          setIsOpen,
          transition: false,
          isHighlightingObserved: false,
        }) ?? null)
      : step.content;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Step {currentStep + 1} of {steps.length}
          </p>
          <div className="text-sm leading-relaxed text-foreground">{renderedContent}</div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close tour"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isFirst}
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          Back
        </Button>
        <Button
          size="sm"
          onClick={() => {
            if (isLast) {
              setIsOpen(false);
              return;
            }
            setCurrentStep((prev) => prev + 1);
          }}
        >
          {isLast ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
