'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Droplet, Globe, LayoutDashboard, ListChecks, LogOut, Menu, Plus, Users, X,
} from 'lucide-react';

import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const QUICK_LINKS = [
  { href: '/create-request', key: 'createRequest', icon: Plus },
  { href: '/donors', key: 'donors', icon: Users },
  { href: '/requests', key: 'requests', icon: ListChecks },
];

function SidebarContent({ t, user, onLogout, onNavigate }) {
  const initial = (user?.full_name || user?.email || 'D').charAt(0).toUpperCase();

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="px-5 pb-4 pt-6">
        <BrandLogo className="text-[1.1rem]" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <div className="mb-5">
          <p className="mb-1.5 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t.dashboard.panel}</p>
          <span className="flex items-center gap-2.5 rounded-lg bg-accent px-2.5 py-2 text-[13px] font-semibold text-primary">
            <LayoutDashboard className="size-4" aria-hidden="true" />
            {t.dashboard.navOverview}
          </span>
        </div>

        <div>
          <p className="mb-1.5 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t.dashboard.quickLinks}</p>
          <div className="flex flex-col gap-0.5">
            {QUICK_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
        <div className="mb-1 flex items-center gap-2.5 rounded-lg px-2 py-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-foreground">{user?.full_name || t.donors.donor}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="size-4" aria-hidden="true" /> {t.nav.logout}
        </button>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t, lang, toggle } = useLanguage();

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <div className="flex min-h-screen bg-secondary">
      <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
        <SidebarContent t={t} user={user} onLogout={handleLogout} />
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
              <SidebarContent t={t} user={user} onLogout={handleLogout} onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Droplet className="size-3.5 text-primary" aria-hidden="true" />
              {t.dashboard.panel} / <span className="font-medium text-foreground">{t.dashboard.navOverview}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className="hidden text-xs font-medium text-muted-foreground hover:text-primary sm:inline">
              {t.dashboard.backToSite}
            </Link>
            <button
              type="button"
              onClick={toggle}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-secondary px-3.5 text-xs font-bold tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Globe className="size-3.5" aria-hidden="true" /> {lang === 'az' ? 'EN' : 'AZ'}
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
