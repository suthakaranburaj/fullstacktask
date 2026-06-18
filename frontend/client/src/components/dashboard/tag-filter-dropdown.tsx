'use client';

import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagFilterDropdownProps {
  tags: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TagFilterDropdown({ tags, value, onChange, className }: TagFilterDropdownProps) {
  return (
    <div className={cn('relative min-w-[160px]', className)} data-tour="tag-filter">
      <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-md border border-input bg-background py-2 pl-9 pr-8 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Filter notes by tag"
      >
        <option value="">All badges</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
        ▾
      </span>
    </div>
  );
}
