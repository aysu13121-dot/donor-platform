import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './LandingPage.css'

export default function LandingPage() {
  const { t } = useLanguage()

  const BLOOD_TYPES = [
    { type: 'A+',  gives: ['A+', 'AB+'],               receives: ['A+', 'A-', 'O+', 'O-'] },
    { type: 'A-',  gives: ['A+', 'A-', 'AB+', 'AB-'],  receives: ['A-', 'O-'] },
    { type: 'B+',  gives: ['B+', 'AB+'],               receives: ['B+', 'B-', 'O+', 'O-'] },
    { type: 'B-',  gives: ['B+', 'B-', 'AB+', 'AB-'],  receives: ['B-', 'O-'] },
    { type: 'O+',  gives: ['O+', 'A+', 'B+', 'AB+'],  receives: ['O+', 'O-'] },
    { type: 'O-',  gives: [t.blood.all],               receives: ['O-'],        tag: t.blood.uDonor },
    { type: 'AB+', gives: ['AB+'],                     receives: [t.blood.allFrom], tag: t.blood.uReceiver },
    { type: 'AB-', gives: ['AB+', 'AB-'],              receives: ['AB-', 'A-', 'B-', 'O-'] },
  ]

  return (
    <div className="landing">
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero__bg-types" aria-hidden="true">
          {['A+', 'B+', 'O−', 'AB+'].map(t => (
            <span key={t} className="hero__bg-type">{t}</span>
          ))}
        </div>
        <div className="container hero__content">
          <span className="hero__eyebrow">{t.hero.eyebrow}</span>
          <h1 className="hero__title">
            {t.hero.h1}<br /><em>{t.hero.h1em}</em>
          </h1>
          <p className="hero__sub">{t.hero.sub}</p>
          <div className="hero__actions">
            <Link to="/signup" className="btn-primary hero__cta-main">{t.hero.cta1}</Link>
            <a href="#blood-types" className="btn-outline">{t.hero.cta2}</a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="container stats__grid">
          {t.stats.map(s => (
            <div key={s.label} className="stats__item">
              <span className="stats__num">{s.num}</span>
              <span className="stats__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2 className="section__title">{t.how.title}</h2>
          <p className="section__sub">{t.how.sub}</p>
          <div className="steps__grid">
            {t.how.steps.map(step => (
              <div key={step.num} className="step__card">
                <span className="step__num">{step.num}</span>
                <h3 className="step__title">{step.title}</h3>
                <p className="step__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOOD TYPES */}
      <section className="blood-types" id="blood-types">
        <div className="container">
          <h2 className="section__title">{t.blood.title}</h2>
          <p className="section__sub">{t.blood.sub}</p>
          <div className="blood-types__grid">
            {BLOOD_TYPES.map(bt => (
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

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <h2 className="cta-banner__title">{t.cta.title}</h2>
          <p className="cta-banner__sub">{t.cta.sub}</p>
          <Link to="/signup" className="btn-primary cta-banner__btn">{t.cta.btn}</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer__inner">
          <span className="footer__logo">🩸 Qan<strong>Donoru</strong></span>
          <p className="footer__copy">{t.footer}</p>
        </div>
      </footer>
    </div>
  )
}
