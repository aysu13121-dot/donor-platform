'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import Navbar from '@/components/Navbar';
import { bloodCompatibility, useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

export default function LandingPage() {
  const { t, lang } = useLanguage();
  const [stats, setStats] = useState(null);

  // Əvvəlki versiyada bu rəqəmlər tərcümə faylında statik yazılmışdı
  // ("2,400+ donor" və s.), halbuki backend-də /api/stats artıq canlı
  // məlumat qaytarır - indi ordan çəkilir.
  useEffect(() => {
    let cancelled = false;
    api
      .get('/api/stats')
      .then((data) => {
        if (!cancelled) setStats(data.stats);
      })
      .catch(() => {
        /* stats bloku səssizcə gizli qalır, səhifənin qalanı işləməyə davam edir */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const statsDisplay = stats
    ? [
        { num: `${stats.total_donors}+`, label: lang === 'az' ? 'Qeydiyyatlı donor' : 'Registered donors' },
        { num: String(stats.active_requests), label: lang === 'az' ? 'Aktiv sorğu' : 'Active requests' },
        { num: `${stats.total_cities}+`, label: lang === 'az' ? 'Şəhər' : 'Cities' },
      ]
    : [];

  const bloodTypes = bloodCompatibility(t);

  return (
    <div className="landing">
      <Navbar />

      <section className="hero">
        <div className="hero__bg-types" aria-hidden="true">
          {['A+', 'B+', 'O−', 'AB+'].map((bt) => (
            <span key={bt} className="hero__bg-type">{bt}</span>
          ))}
        </div>
        <div className="container hero__content">
          <span className="hero__eyebrow">{t.hero.eyebrow}</span>
          <h1 className="hero__title">
            {t.hero.h1}<br /><em>{t.hero.h1em}</em>
          </h1>
          <p className="hero__sub">{t.hero.sub}</p>
          <div className="hero__actions">
            <Link href="/signup" className="btn-primary hero__cta-main">{t.hero.cta1}</Link>
            <Link href="/#blood-types" className="btn-outline">{t.hero.cta2}</Link>
          </div>
        </div>
      </section>

      {stats && (
        <section className="stats">
          <div className="container stats__grid">
            {statsDisplay.map((s) => (
              <div key={s.label} className="stats__item">
                <span className="stats__num">{s.num}</span>
                <span className="stats__label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2 className="section__title">{t.how.title}</h2>
          <p className="section__sub">{t.how.sub}</p>
          <div className="steps__grid">
            {t.how.steps.map((step) => (
              <div key={step.num} className="step__card">
                <span className="step__num">{step.num}</span>
                <h3 className="step__title">{step.title}</h3>
                <p className="step__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blood-types" id="blood-types">
        <div className="container">
          <h2 className="section__title">{t.blood.title}</h2>
          <p className="section__sub">{t.blood.sub}</p>
          <div className="blood-types__grid">
            {bloodTypes.map((bt) => (
              <div key={bt.type} className={`bt-card ${bt.tag ? 'bt-card--highlight' : ''}`}>
                {bt.tag && <span className="bt-card__tag">{bt.tag}</span>}
                <div className="bt-card__badge">{bt.type}</div>
                <div className="bt-card__info">
                  <div>
                    <span className="bt-card__label">{t.blood.gives}</span>
                    <span className="bt-card__value">{bt.gives.join(', ')}</span>
                  </div>
                  <div>
                    <span className="bt-card__label">{t.blood.receives}</span>
                    <span className="bt-card__value">{bt.receives.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <h2 className="cta-banner__title">{t.cta.title}</h2>
          <p className="cta-banner__sub">{t.cta.sub}</p>
          <Link href="/signup" className="btn-primary cta-banner__btn">{t.cta.btn}</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <span className="footer__logo">🩸 Qan<strong>Donoru</strong></span>
          <p className="footer__copy">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}
