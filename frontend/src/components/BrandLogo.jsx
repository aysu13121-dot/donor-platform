import Link from 'next/link';
import { Droplet } from 'lucide-react';

// Marka loqosu tək yerdə - Navbar, Login/Signup kartları və footer eyni
// komponentdən istifadə edir (əvvəllər hər yerdə "🩸" emoji-si təkrarlanırdı).
export default function BrandLogo({ className = '', as = 'link' }) {
  const content = (
    <>
      <Droplet className="brand-logo__icon" aria-hidden="true" />
      <span>Qan<strong>Donoru</strong></span>
    </>
  );

  if (as === 'span') {
    return <span className={`brand-logo ${className}`}>{content}</span>;
  }

  return (
    <Link href="/" className={`brand-logo ${className}`}>
      {content}
    </Link>
  );
}
