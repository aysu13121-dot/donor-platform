import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './AuthPage.css'

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate  = useNavigate()
  const { t } = useLanguage()

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t.login.serverErr)
      } else {
        localStorage.setItem('token',    data.token)
        localStorage.setItem('userName', data.user?.full_name || data.user?.email || 'Donor')
        navigate('/')
      }
    } catch {
      setError(t.login.serverErr)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">🩸 Qan<strong>Donoru</strong></Link>
        <h1 className="auth-title">{t.login.title}</h1>
        <p className="auth-sub">{t.login.sub}</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">{t.login.email}</label>
            <input id="email" type="email" name="email"
              placeholder="ad@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t.login.password}</label>
            <input id="password" type="password" name="password"
              placeholder="••••••••"
              value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? t.login.loading : t.login.btn}
          </button>
        </form>

        <p className="auth-switch">
          {t.login.switch} <Link to="/signup">{t.login.switchLink}</Link>
        </p>
      </div>
    </div>
  )
}
