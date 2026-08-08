import Link from 'next/link';

import { cn } from '@/lib/utils';

// Marka loqosu tək yerdə - Navbar, Login/Signup kartları, dashboard sidebar-ı
// və footer eyni komponentdən istifadə edir.
export default function BrandLogo({ className = '', textClassName = '', as = 'link' }) {
  const content = (
    <span className={textClassName}>
      <strong className="text-primary">Donor</strong>.az
    </span>
  );

  if (as === 'span') {
    return <span className={cn('inline-flex items-center text-[1.25rem] font-semibold text-foreground', className)}>{content}</span>;
  }

  return (
    <Link href="/" className={cn('inline-flex items-center text-[1.25rem] font-semibold text-foreground', className)}>
      {content}
    </Link>
  );
}
