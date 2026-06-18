'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name?: string;
  email: string;
  picture?: string;
  className?: string;
}

function getInitial(name?: string, email?: string): string {
  const source = name?.trim() || email?.trim() || '?';
  return source.charAt(0).toUpperCase();
}

export function UserAvatar({ name, email, picture, className }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = Boolean(picture) && !imageError;

  return (
    <div className={cn('group relative', className)}>
      {showImage ? (
        <Image
          src={picture!}
          alt={name || email}
          width={36}
          height={36}
          className="h-9 w-9 rounded-full border-2 border-primary/20 object-cover transition-transform group-hover:scale-105"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/15 text-sm font-semibold text-primary transition-transform group-hover:scale-105"
          aria-hidden
        >
          {getInitial(name, email)}
        </div>
      )}

      <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 hidden whitespace-nowrap rounded-lg border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-lg group-hover:block">
        {email}
      </div>
    </div>
  );
}
