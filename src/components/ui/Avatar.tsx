'use client';

import Image from 'next/image';
import { getInitials, cn } from '@/lib/utils';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const sizePx: Record<AvatarSize, number> = { sm: 28, md: 36, lg: 48, xl: 64 };

interface AvatarProps {
  src?: string | null;
  firstName: string;
  lastName: string;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ src, firstName, lastName, size = 'md', className }: AvatarProps) {
  const initials = getInitials(firstName, lastName);

  return (
    <div
      data-testid="avatar"
      className={cn(
        'relative rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-primary-light text-primary font-semibold select-none',
        sizeStyles[size],
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={`${firstName} ${lastName}`}
          width={sizePx[size]}
          height={sizePx[size]}
          className="object-cover w-full h-full"
          unoptimized
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
