'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, LogOut, Menu, User, X } from 'lucide-react';

import BrandLogo from '@/components/BrandLogo';
import Link from 'next/link';
import Button from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', key: 'home' },
  { href: '/#how-it-works', key: 'how' },
  { href: '/#blood-types', key: 'types' },
  { href: '/donors', key: 'donors' },
  { href: '/requests', key: 'requests' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { lang, t, toggle } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-6">
        <BrandLogo className="text-[1.2rem]" />

        <ul className="hidden items-center gap-9 lg:flex">
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
          {isAuthenticated && (
            <li>
              <Link
                href="/create-request"
                className={cn('text-sm font-medium text-muted-foreground transition-colors hover:text-primary', isActive('/create-request') && 'text-primary')}
              >
                {t.nav.createRequest}
              </Link>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <Link
                href="/dashboard"
                className={cn('text-sm font-medium text-muted-foreground transition-colors hover:text-primary', isActive('/dashboard') && 'text-primary')}
              >
                {t.nav.dashboard}
              </Link>
            </li>
          )}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-secondary px-3.5 text-xs font-bold tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {lang === 'az' ? 'EN' : 'AZ'}
          </button>
          {isAuthenticated ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-[13px] font-semibold text-foreground">
                <User className="size-3.5 text-primary" aria-hidden="true" />
                {user?.full_name || user?.email || 'Donor'}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut aria-hidden="true" /> {t.nav.logout}
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} href="/login" variant="outline" size="sm">{t.nav.login}</Button>
              <Button as={Link} href="/signup" size="sm">{t.nav.register}</Button>
            </>
          )}
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
        <div className="flex flex-col gap-4 border-t border-border bg-background px-6 py-5 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link key={link.key} href={link.href} onClick={() => setMenuOpen(false)} className="text-base font-medium text-foreground">
              {t.nav[link.key]}
            </Link>
          ))}
          {isAuthenticated && (
            <Link href="/create-request" onClick={() => setMenuOpen(false)} className="text-base font-medium text-foreground">
              {t.nav.createRequest}
            </Link>
          )}
          {isAuthenticated && (
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-base font-medium text-foreground">
              {t.nav.dashboard}
            </Link>
          )}
          <button
            type="button"
            onClick={() => { toggle(); setMenuOpen(false); }}
            className="flex w-fit items-center gap-2 rounded-full border border-border bg-secondary px-3.5 py-2 text-sm font-semibold text-foreground"
          >
            <Globe className="size-4" aria-hidden="true" /> {lang === 'az' ? 'English' : 'Azərbaycanca'}
          </button>
          {isAuthenticated ? (
            <>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-[13px] font-semibold text-foreground">
                <User className="size-3.5 text-primary" aria-hidden="true" />
                {user?.full_name || user?.email || 'Donor'}
              </span>
              <Button variant="outline" size="sm" className="w-fit" onClick={handleLogout}>
                <LogOut aria-hidden="true" /> {t.nav.logout}
              </Button>
            </>
          ) : (
            <div className="flex gap-3">
              <Button as={Link} href="/login" variant="outline" size="sm" onClick={() => setMenuOpen(false)}>{t.nav.login}</Button>
              <Button as={Link} href="/signup" size="sm" onClick={() => setMenuOpen(false)}>{t.nav.register}</Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
