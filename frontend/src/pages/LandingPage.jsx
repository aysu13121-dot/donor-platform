import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import './LandingPage.css'

const BLOOD_TYPES = [
  { type: 'A+',  gives: ['A+', 'AB+'],              receives: ['A+', 'A-', 'O+', 'O-'] },
  { type: 'A-',  gives: ['A+', 'A-', 'AB+', 'AB-'], receives: ['A-', 'O-'] },
  { type: 'B+',  gives: ['B+', 'AB+'],              receives: ['B+', 'B-', 'O+', 'O-'] },
  { type: 'B-',  gives: ['B+', 'B-', 'AB+', 'AB-'], receives: ['B-', 'O-'] },
  { type: 'O+',  gives: ['O+', 'A+', 'B+', 'AB+'], receives: ['O+', 'O-'] },
  { type: 'O-',  gives: ['Hamısına'],               receives: ['O-'],        tag: 'Universal donor' },
  { type: 'AB+', gives: ['AB+'],                    receives: ['Hamısından'], tag: 'Universal alıcı' },
  { type: 'AB-', gives: ['AB+', 'AB-'],             receives: ['AB-', 'A-', 'B-', 'O-'] },
]

const STEPS = [
  { num: '01', title: 'Qeydiyyatdan keç',  desc: 'Adınızı, qan qrupunuzu və əlaqə məlumatlarınızı daxil edin.' },
  { num: '02', title: 'Profil yarat',       desc: 'Şəhərinizi və donor olmağa hazır olduğunuzu bildirin.' },
  { num: '03', title: 'Həyat xilas et',     desc: 'Ehtiyacı olan xəstələr sizi tapa bilər. Siz də donor tapa bilərsiniz.' },
]

export default function LandingPage() {
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
          <span className="hero__eyebrow">Azərbaycanın donor şəbəkəsi</span>
          <h1 className="hero__title">
            Bir damcı qan,<br />
            <em>bir həyat.</em>
          </h1>
          <p className="hero__sub">
            Regional Qan Donoru Sistemi vasitəsilə ən yaxın donoru tapın
            və ya özünüz donor olaraq həyat xilas edin.
          </p>
          <div className="hero__actions">
            <Link to="/signup" className="btn-primary hero__cta-main">🩸 Donor ol</Link>
            <a href="#blood-types" className="btn-outline">Qan qrupu tap</a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="container stats__grid">
          {[
            { num: '2,400+', label: 'Qeydiyyatlı donor' },
            { num: '8',      label: 'Qan qrupu' },
            { num: '15+',    label: 'Şəhər' },
          ].map(s => (
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
          <h2 className="section__title">Necə işləyir?</h2>
          <p className="section__sub">Üç addımda donorluq prosesini başlat</p>
          <div className="steps__grid">
            {STEPS.map(step => (
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
          <h2 className="section__title">Qan qrupları</h2>
          <p className="section__sub">Hər qan qrupu kimin üçün donor ola bilər?</p>
          <div className="blood-types__grid">
            {BLOOD_TYPES.map(bt => (
              <div key={bt.type} className={`bt-card ${bt.tag ? 'bt-card--highlight' : ''}`}>
                {bt.tag && <span className="bt-card__tag">{bt.tag}</span>}
                <div className="bt-card__badge">{bt.type}</div>
                <div className="bt-card__info">
                  <div>
                    <span className="bt-card__label">Verir</span>
                    <span className="bt-card__value">{bt.gives.join(', ')}</span>
                  </div>
                  <div>
                    <span className="bt-card__label">Alır</span>
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
          <h2 className="cta-banner__title">Bugün donor olun</h2>
          <p className="cta-banner__sub">Hər 3 aydan bir — bir saatınız, bir həyat deməkdir.</p>
          <Link to="/signup" className="btn-primary cta-banner__btn">İndi başla →</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer__inner">
          <span className="footer__logo">🩸 Qan<strong>Donoru</strong></span>
          <p className="footer__copy">© 2026 Regional Qan Donoru Sistemi. Bütün hüquqlar qorunur.</p>
        </div>
      </footer>
    </div>
  )
}
