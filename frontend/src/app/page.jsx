'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity, ArrowRight, Droplet, HeartHandshake, IdCard, MapPin, Search, UserPlus, Users,
} from 'lucide-react';

import BrandLogo from '@/components/BrandLogo';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { bloodCompatibility, useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const STEP_ICONS = [UserPlus, IdCard, HeartHandshake];

export default function LandingPage() {
  const { t, lang } = useLanguage();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/api/stats')
      .then((data) => {
        if (!cancelled) setStats(data.stats);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const statsDisplay = stats
    ? [
        { icon: Users, num: String(stats.total_donors), label: lang === 'az' ? 'Qeydiyyatlı donor' : 'Registered donors' },
        { icon: Activity, num: String(stats.active_requests), label: lang === 'az' ? 'Aktiv sorğu' : 'Active requests' },
        { icon: MapPin, num: String(stats.total_cities), label: lang === 'az' ? 'Şəhər' : 'Cities' },
      ]
    : [];

  const bloodTypes = bloodCompatibility(t);

  return (
    <div>
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 items-center justify-end overflow-hidden pr-[4%] md:flex" aria-hidden="true">
          {['A+', 'B+', 'O−', 'AB+'].map((bt) => (
            <span
              key={bt}
              className="font-display text-[clamp(80px,13vw,190px)] font-black leading-[0.88] tracking-[-4px] text-primary/[0.045]"
            >
              {bt}
            </span>
          ))}
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="mb-6 inline-block rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              {t.hero.eyebrow}
            </span>
            <h1 className="mb-6 font-display text-5xl font-black leading-[1.08] tracking-tight text-foreground md:text-7xl">
              {t.hero.h1}
              <br />
              <em className="text-primary not-italic">{t.hero.h1em}</em>
            </h1>
            <p className="mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground">{t.hero.sub}</p>
            <div className="flex flex-wrap gap-4">
              <Button as={Link} href="/signup" size="lg">
                <Droplet aria-hidden="true" /> {t.hero.cta1}
              </Button>
              <Button as={Link} href="/#blood-types" variant="outline" size="lg">
                <Search aria-hidden="true" /> {t.hero.cta2}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      {stats && (
        <section className="bg-foreground py-13">
          <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 px-6 text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {statsDisplay.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2 px-6 py-7 sm:py-2">
                <s.icon className="mb-0.5 size-6 text-primary-hover" aria-hidden="true" />
                <span className="font-display text-4xl font-bold text-white md:text-5xl">{s.num}</span>
                <span className="text-sm text-white/50">{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="bg-background py-24" id="how-it-works">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-3 text-center font-display text-3xl font-bold text-foreground md:text-4xl">{t.how.title}</h2>
          <p className="mb-14 text-center text-muted-foreground">{t.how.sub}</p>
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {t.how.steps.map((step, i) => {
              const StepIcon = STEP_ICONS[i];
              return (
                <Card key={step.num} className="relative p-9 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <span className="mb-5 block font-display text-6xl font-black leading-none text-primary/10">{step.num}</span>
                  <StepIcon className="absolute right-7 top-9 size-6 text-primary" aria-hidden="true" />
                  <h3 className="mb-3 text-base font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* BLOOD TYPES */}
      <section className="bg-secondary py-24" id="blood-types">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-3 text-center font-display text-3xl font-bold text-foreground md:text-4xl">{t.blood.title}</h2>
          <p className="mb-14 text-center text-muted-foreground">{t.blood.sub}</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {bloodTypes.map((bt) => (
              <Card
                key={bt.type}
                className={cn(
                  'relative p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md',
                  bt.tag && 'border-primary ring-1 ring-primary',
                )}
              >
                {bt.tag && (
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                    {bt.tag}
                  </span>
                )}
                <div className="mb-4 font-display text-4xl font-black text-primary">{bt.type}</div>
                <div className="flex flex-col gap-2.5">
                  <div>
                    <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.blood.gives}</span>
                    <span className="text-[13px] font-medium text-foreground">{bt.gives.join(', ')}</span>
                  </div>
                  <div>
                    <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.blood.receives}</span>
                    <span className="text-[13px] font-medium text-foreground">{bt.receives.join(', ')}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-primary py-24 text-center">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 font-display text-4xl font-black text-white md:text-5xl">{t.cta.title}</h2>
          <p className="mb-10 text-lg text-white/70">{t.cta.sub}</p>
          <Button as={Link} href="/signup" variant="dark" size="lg" className="bg-white text-primary hover:bg-background">
            {t.cta.btn} <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6">
          <BrandLogo as="span" textClassName="text-white" className="text-white" />
          <p className="text-[13px] text-white/35">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}
