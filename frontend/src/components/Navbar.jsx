import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { lang, t, toggle } = useLanguage()

  const token    = localStorage.getItem('token')
  const userName = localStorage.getItem('userName')
  const isActive = path => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    setMenuOpen(false)
    navigate('/')
    window.location.reload()
  }

  return (
    <nav className="navbar">
      <div className="container navbar__inner">

        <Link to="/" className="navbar__logo">
          <span>🩸</span>
          <span>Qan<strong>Donoru</strong></span>
        </Link>

        <ul className="navbar__links">
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>{t.nav.home}</Link></li>
          <li><a href="#how-it-works">{t.nav.how}</a></li>
          <li><a href="#blood-types">{t.nav.types}</a></li>
          <li><Link to="/donors" className={isActive('/donors') ? 'active' : ''}>{t.nav.donors}</Link></li>
          <li><Link to="/requests" className={isActive('/requests') ? 'active' : ''}>{t.nav.requests}</Link></li>
          {token && <li><Link to="/create-request" className={isActive('/create-request') ? 'active' : ''}>{t.nav.createRequest}</Link></li>}
          {token && <li><Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>{t.nav.dashboard}</Link></li>}
        </ul>

        <div className="navbar__actions">
          <button className="lang-toggle" onClick={toggle}>
            {lang === 'az' ? 'EN' : 'AZ'}
          </button>
          {token ? (
            <>
              <span className="navbar__user">👤 {userName || 'Donor'}</span>
              <button className="btn-outline navbar__login" onClick={handleLogout}>
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn-outline navbar__login">{t.nav.login}</Link>
              <Link to="/signup" className="btn-primary">{t.nav.register}</Link>
            </>
          )}
        </div>

        <button
          className="navbar__burger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div className="navbar__mobile-menu">
          <Link to="/"            onClick={() => setMenuOpen(false)}>{t.nav.home}</Link>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>{t.nav.how}</a>
          <a href="#blood-types"  onClick={() => setMenuOpen(false)}>{t.nav.types}</a>
          <Link to="/donors" onClick={() => setMenuOpen(false)}>{t.nav.donors}</Link>
          <Link to="/requests" onClick={() => setMenuOpen(false)}>{t.nav.requests}</Link>
          {token && <Link to="/create-request" onClick={() => setMenuOpen(false)}>{t.nav.createRequest}</Link>}
          {token && <Link to="/dashboard" onClick={() => setMenuOpen(false)}>{t.nav.dashboard}</Link>}
          <button className="lang-toggle lang-toggle--mobile" onClick={() => { toggle(); setMenuOpen(false) }}>
            {lang === 'az' ? '🇬🇧 English' : '🇦🇿 Azərbaycanca'}
          </button>
          {token ? (
            <>
              <span className="navbar__user">👤 {userName || 'Donor'}</span>
              <button className="btn-outline" onClick={handleLogout}>{t.nav.logout}</button>
            </>
          ) : (
            <>
              <Link to="/login"  onClick={() => setMenuOpen(false)}>{t.nav.login}</Link>
              <Link to="/signup" className="btn-primary" onClick={() => setMenuOpen(false)}>{t.nav.register}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
