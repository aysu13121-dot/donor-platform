'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Home, LayoutDashboard, ListChecks, LogOut, Menu, Plus, Users, X,
} from 'lucide-react';

import BrandLogo from '@/components/BrandLogo';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const QUICK_LINKS = [
  { href: '/', key: 'home', icon: Home },
  { href: '/donors', key: 'donors', icon: Users },
  { href: '/requests', key: 'requests', icon: ListChecks },
];

const NAV_ITEM_BASE = 'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors';
const NAV_ITEM_ACTIVE = 'bg-accent font-semibold text-primary';
const NAV_ITEM_INACTIVE = 'font-medium text-muted-foreground hover:bg-secondary hover:text-foreground';
const NAV_SECTION_LABEL = 'px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70';

function SidebarContent({ t, user, onLogout, onNavigate, activePanel }) {
  const initial = (user?.full_name || user?.email || 'D').charAt(0).toUpperCase();

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center justify-between px-5 pb-4 pt-6">
        <BrandLogo />
        <LanguageSwitch />
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <div className="mb-4">
          <p className={NAV_SECTION_LABEL}>{t.nav.dashboard}</p>
          <div className="flex flex-col gap-0.5">
            <Link
              href="/dashboard"
              onClick={onNavigate}
              className={cn(NAV_ITEM_BASE, activePanel ? NAV_ITEM_INACTIVE : NAV_ITEM_ACTIVE)}
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              {t.dashboard.navOverview}
            </Link>
            <Link
              href="/dashboard?panel=create"
              onClick={onNavigate}
              className={cn(NAV_ITEM_BASE, activePanel === 'create' ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE)}
            >
              <Plus className="size-4" aria-hidden="true" />
              {t.nav.createRequest}
            </Link>
          </div>
        </div>

        <div>
          <p className={NAV_SECTION_LABEL}>{t.dashboard.quickLinks}</p>
          <div className="flex flex-col gap-0.5">
            {QUICK_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(NAV_ITEM_BASE, NAV_ITEM_INACTIVE)}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {t.nav[item.key]}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-1.5">
          <Link
            href="/dashboard?panel=profile"
            onClick={onNavigate}
            className={cn(
              'flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-2 transition-colors',
              activePanel === 'profile' ? 'bg-accent' : 'hover:bg-secondary',
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {initial}
            </span>
            <p className="min-w-0 truncate text-[13px] font-semibold text-foreground">{user?.full_name || t.donors.donor}</p>
          </Link>
          <button
            type="button"
            onClick={onLogout}
            aria-label={t.nav.logout}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const activePanel = searchParams.get('panel');

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border lg:sticky lg:top-0 lg:block lg:h-screen">
        <SidebarContent t={t} user={user} onLogout={handleLogout} activePanel={activePanel} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 shadow-xl">
            <div className="flex justify-end p-3">
              <button type="button" onClick={() => setOpen(false)} className="flex size-8 items-center justify-center rounded-lg bg-card text-foreground shadow-sm">
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="-mt-14">
              <SidebarContent t={t} user={user} onLogout={handleLogout} onNavigate={() => setOpen(false)} activePanel={activePanel} />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center border-b border-border bg-card px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </header>

        <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
