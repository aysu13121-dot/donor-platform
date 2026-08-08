'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, LogOut, Menu, User, X } from 'lucide-react';

import BrandLogo from '@/components/BrandLogo';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

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
    <nav className="navbar">
      <div className="container navbar__inner">
        <BrandLogo className="navbar__logo" />

        <ul className="navbar__links">
          <li><Link href="/" className={isActive('/') ? 'active' : ''}>{t.nav.home}</Link></li>
          <li><Link href="/#how-it-works">{t.nav.how}</Link></li>
          <li><Link href="/#blood-types">{t.nav.types}</Link></li>
          <li><Link href="/donors" className={isActive('/donors') ? 'active' : ''}>{t.nav.donors}</Link></li>
          <li><Link href="/requests" className={isActive('/requests') ? 'active' : ''}>{t.nav.requests}</Link></li>
          {isAuthenticated && (
            <li><Link href="/create-request" className={isActive('/create-request') ? 'active' : ''}>{t.nav.createRequest}</Link></li>
          )}
          {isAuthenticated && (
            <li><Link href="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>{t.nav.dashboard}</Link></li>
          )}
        </ul>

        <div className="navbar__actions">
          <button type="button" className="lang-toggle" onClick={toggle}>
            {lang === 'az' ? 'EN' : 'AZ'}
          </button>
          {isAuthenticated ? (
            <>
              <span className="navbar__user"><User className="navbar__user-icon" aria-hidden="true" />{user?.full_name || user?.email || 'Donor'}</span>
              <button type="button" className="btn-outline navbar__login" onClick={handleLogout}>
                <LogOut aria-hidden="true" /> {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-outline navbar__login">{t.nav.login}</Link>
              <Link href="/signup" className="btn-primary">{t.nav.register}</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="navbar__burger"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <div className="navbar__mobile-menu">
          <Link href="/" onClick={() => setMenuOpen(false)}>{t.nav.home}</Link>
          <Link href="/#how-it-works" onClick={() => setMenuOpen(false)}>{t.nav.how}</Link>
          <Link href="/#blood-types" onClick={() => setMenuOpen(false)}>{t.nav.types}</Link>
          <Link href="/donors" onClick={() => setMenuOpen(false)}>{t.nav.donors}</Link>
          <Link href="/requests" onClick={() => setMenuOpen(false)}>{t.nav.requests}</Link>
          {isAuthenticated && <Link href="/create-request" onClick={() => setMenuOpen(false)}>{t.nav.createRequest}</Link>}
          {isAuthenticated && <Link href="/dashboard" onClick={() => setMenuOpen(false)}>{t.nav.dashboard}</Link>}
          <button
            type="button"
            className="lang-toggle lang-toggle--mobile"
            onClick={() => { toggle(); setMenuOpen(false); }}
          >
            <Globe aria-hidden="true" /> {lang === 'az' ? 'English' : 'Azərbaycanca'}
          </button>
          {isAuthenticated ? (
            <>
              <span className="navbar__user"><User className="navbar__user-icon" aria-hidden="true" />{user?.full_name || user?.email || 'Donor'}</span>
              <button type="button" className="btn-outline" onClick={handleLogout}><LogOut aria-hidden="true" /> {t.nav.logout}</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>{t.nav.login}</Link>
              <Link href="/signup" className="btn-primary" onClick={() => setMenuOpen(false)}>{t.nav.register}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
