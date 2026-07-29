import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AuthPage.css'

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
        setError(data.error || 'Giriş zamanı xəta baş verdi.')
      } else {
        localStorage.setItem('token', data.token)
        navigate('/')
      }
    } catch {
      setError('Server ilə əlaqə qurmaq mümkün olmadı.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">🩸 Qan<strong>Donoru</strong></Link>
        <h1 className="auth-title">Xoş gəldiniz</h1>
        <p className="auth-sub">Hesabınıza daxil olun</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">E-poçt</label>
            <input
              id="email" type="email" name="email"
              placeholder="ad@example.com"
              value={form.email} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifrə</label>
            <input
              id="password" type="password" name="password"
              placeholder="••••••••"
              value={form.password} onChange={handleChange} required
            />
          </div>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Gözləyin...' : 'Daxil ol'}
          </button>
        </form>

        <p className="auth-switch">
          Hesabınız yoxdur? <Link to="/signup">Qeydiyyatdan keçin</Link>
        </p>
      </div>
    </div>
  )
}
