import Link from 'next/link';
import { Droplet } from 'lucide-react';

import { cn } from '@/lib/utils';

// Marka loqosu tək yerdə - Navbar, Login/Signup kartları, dashboard sidebar-ı
// və footer eyni komponentdən istifadə edir.
export default function BrandLogo({ className = '', iconClassName = '', textClassName = '', as = 'link' }) {
  const content = (
    <>
      <Droplet className={cn('size-[1.05em] shrink-0 text-primary', iconClassName)} aria-hidden="true" />
      <span className={textClassName}>
        Qan<strong className="text-primary">Donoru</strong>
      </span>
    </>
  );

  if (as === 'span') {
    return <span className={cn('inline-flex items-center gap-2 font-semibold text-foreground', className)}>{content}</span>;
  }

  return (
    <Link href="/" className={cn('inline-flex items-center gap-2 font-semibold text-foreground', className)}>
      {content}
    </Link>
  );
}
