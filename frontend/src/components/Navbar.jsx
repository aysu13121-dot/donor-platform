'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Menu, X } from 'lucide-react';

import BrandLogo from '@/components/BrandLogo';
import LanguageSwitch from '@/components/LanguageSwitch';
import Link from 'next/link';
import Button from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', key: 'home' },
  { href: '/donors', key: 'donors' },
  { href: '/requests', key: 'requests' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const { ready, isAuthenticated } = useAuth();

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-6 lg:grid lg:grid-cols-3">
        <BrandLogo className="lg:justify-self-start" />

        <ul className="hidden items-center gap-9 lg:flex lg:justify-self-center">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                className={cn(
                  'text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
                  isActive(link.href) && 'text-primary',
                )}
              >
                {t.nav[link.key]}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 lg:flex lg:justify-self-end">
          <LanguageSwitch />
          {ready && (isAuthenticated ? (
            <Button as={Link} href="/dashboard" size="sm">
              <LayoutDashboard aria-hidden="true" /> {t.nav.dashboard}
            </Button>
          ) : (
            <>
              <Link href="/signin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {t.nav.login}
              </Link>
              <Button as={Link} href="/signup" size="sm">{t.nav.register}</Button>
            </>
          ))}
        </div>

        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-40 flex max-h-[calc(100vh-68px)] flex-col gap-4 overflow-y-auto border-t border-border bg-background px-6 py-5 shadow-lg lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link key={link.key} href={link.href} onClick={() => setMenuOpen(false)} className="text-base font-medium text-foreground">
              {t.nav[link.key]}
            </Link>
          ))}
          {ready && (
            <div className="flex items-center justify-between">
              {isAuthenticated ? (
                <Button as={Link} href="/dashboard" size="sm" className="w-fit" onClick={() => setMenuOpen(false)}>
                  <LayoutDashboard aria-hidden="true" /> {t.nav.dashboard}
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/signin" onClick={() => setMenuOpen(false)} className="text-base font-medium text-foreground">
                    {t.nav.login}
                  </Link>
                  <Button as={Link} href="/signup" size="sm" onClick={() => setMenuOpen(false)}>{t.nav.register}</Button>
                </div>
              )}
              <LanguageSwitch className="w-fit text-base" />
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
