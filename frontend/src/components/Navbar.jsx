import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="container navbar__inner">

        <Link to="/" className="navbar__logo">
          <span>🩸</span>
          <span>Qan<strong>Donoru</strong></span>
        </Link>

        <ul className="navbar__links">
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Ana Səhifə</Link></li>
          <li><a href="#how-it-works">Necə İşləyir</a></li>
          <li><a href="#blood-types">Qan Qrupları</a></li>
        </ul>

        <div className="navbar__actions">
          <Link to="/login" className="btn-outline navbar__login">Daxil ol</Link>
          <Link to="/signup" className="btn-primary">Qeydiyyat</Link>
        </div>

        <button
          className={`navbar__burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menyunu aç"
        >
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div className="navbar__mobile-menu">
          <Link to="/"           onClick={() => setMenuOpen(false)}>Ana Səhifə</Link>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>Necə İşləyir</a>
          <a href="#blood-types"  onClick={() => setMenuOpen(false)}>Qan Qrupları</a>
          <Link to="/login"      onClick={() => setMenuOpen(false)}>Daxil ol</Link>
          <Link to="/signup" className="btn-primary" onClick={() => setMenuOpen(false)}>Qeydiyyat</Link>
        </div>
      )}
    </nav>
  )
}
