'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity, ArrowRight, CheckCircle2, Droplet, Search, Users,
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import StatCard from '@/components/dashboard/StatCard';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { bloodCompatibility, useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { t, lang } = useLanguage();
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState(false);
  const [selectedType, setSelectedType] = useState('A+');

  useEffect(() => {
    let cancelled = false;
    api
      .get('/api/stats')
      .then((data) => {
        if (!cancelled) setStats(data.stats);
      })
      .catch(() => {
        if (!cancelled) setStatsError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // İkon/etiket data-dan asılı deyil - skeleton göstərilərkən də sıra
  // eyni qalsın deyə statsData-dan ayrı, sabit siyahı kimi tərif olunub.
  const statsDisplay = [
    { key: 'total_donors', icon: Users, label: lang === 'az' ? 'Qeydiyyatlı donor' : 'Registered donors' },
    { key: 'active_donors', icon: CheckCircle2, label: lang === 'az' ? 'Hazır donor' : 'Available donors' },
    { key: 'active_requests', icon: Activity, label: lang === 'az' ? 'Aktiv sorğu' : 'Active requests' },
    { key: 'fulfilled_requests', icon: Droplet, label: lang === 'az' ? 'Tamamlanan sorğu' : 'Fulfilled requests' },
  ];

  const bloodTypes = bloodCompatibility();
  const selected = bloodTypes.find((bt) => bt.type === selectedType) || bloodTypes[0];

  return (
    <div>
      <Navbar />

      {/* HERO - masaüstü/tablet-də naxbar-dan aşağı bütün ekranı tutur; telefonda
          bu tam-ekran hündürlük məzmunu çox aşağı itələyib pis görünürdü, ona görə
          mobil-də sadə padding-lə auto-hündürlük saxlanılır. */}
      <section className="flex items-center border-b border-border bg-background py-16 md:min-h-[calc(100svh-68px)] md:py-0">
        <div className="mx-auto w-full max-w-2xl px-6 text-center">
          <h1 className="mb-5 text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
            {t.hero.h1} <span className="text-primary">{t.hero.h1em}</span>
          </h1>
          <p className="mx-auto mb-9 max-w-xl text-base leading-relaxed text-muted-foreground">{t.hero.sub}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button as={Link} href="/signup" size="lg">{t.hero.cta1}</Button>
            <Button as={Link} href="/#blood-types" variant="outline" size="lg">
              <Search aria-hidden="true" /> {t.hero.cta2}
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      {!statsError && (
        <section className="border-b border-border bg-background py-14">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {statsDisplay.map((s) => (
                <StatCard
                  key={s.key}
                  icon={s.icon}
                  label={s.label}
                  value={stats ? String(stats[s.key]) : undefined}
                  loading={!stats}
                />
              ))}
            </div>
            {stats && typeof stats.total_cities === 'number' && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {lang === 'az' ? `${stats.total_cities} şəhər üzrə` : `Across ${stats.total_cities} cities`}
              </p>
            )}
          </div>
        </section>
      )}

      {/* BLOOD TYPE SELECTOR */}
      <section className="bg-background py-20" id="blood-types">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="mb-9 text-2xl font-semibold text-foreground md:text-3xl">{t.blood.title}</h2>

          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.blood.selectPrompt}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {bloodTypes.map((bt) => (
              <button
                key={bt.type}
                type="button"
                onClick={() => setSelectedType(bt.type)}
                className={cn(
                  'flex size-10 items-center justify-center rounded-md text-sm font-semibold transition-colors',
                  selectedType === bt.type
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-card text-foreground hover:border-primary hover:text-primary',
                )}
              >
                {bt.type}
              </button>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-border p-8">
            <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.blood.gives}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {selected.gives.map((g) => (
                    <span key={g} className="rounded-md border border-border bg-card px-3 py-1.5 text-base font-semibold text-foreground">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.blood.receives}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {selected.receives.map((r) => (
                    <span key={r} className="rounded-md border border-border bg-card px-3 py-1.5 text-base font-semibold text-foreground">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="border-t border-border bg-background py-16">
        <div className="mx-auto max-w-6xl px-6">
          <Card className="flex flex-col items-center gap-5 p-10 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h2 className="mb-1.5 text-xl font-semibold text-foreground">{t.cta.title}</h2>
              <p className="text-sm text-muted-foreground">{t.cta.sub}</p>
            </div>
            <Button as={Link} href="/signup" size="lg" className="shrink-0">
              {t.cta.btn} <ArrowRight aria-hidden="true" />
            </Button>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-[13px] text-muted-foreground">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}
