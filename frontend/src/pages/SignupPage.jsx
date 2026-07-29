import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AuthPage.css'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const CITIES = ['Bakı', 'Gəncə', 'Sumqayıt', 'Mingəçevir', 'Naxçıvan', 'Şirvan', 'Lənkəran', 'Şəki']

export default function SignupPage() {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '',
    blood_type: '', city: '', phone: ''
  })
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
      const res  = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Qeydiyyat zamanı xəta baş verdi.')
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
      <div className="auth-card auth-card--wide">
        <Link to="/" className="auth-logo">🩸 Qan<strong>Donoru</strong></Link>
        <h1 className="auth-title">Donor ol</h1>
        <p className="auth-sub">Pulsuz qeydiyyatdan keçin</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form auth-form--grid">
          <div className="form-group">
            <label htmlFor="full_name">Ad Soyad</label>
            <input
              id="full_name" type="text" name="full_name"
              placeholder="Adınız Soyadınız"
              value={form.full_name} onChange={handleChange} required
            />
          </div>
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
              placeholder="Minimum 6 simvol"
              value={form.password} onChange={handleChange}
              required minLength={6}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefon</label>
            <input
              id="phone" type="tel" name="phone"
              placeholder="+994 XX XXX XX XX"
              value={form.phone} onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="blood_type">Qan qrupu</label>
            <select
              id="blood_type" name="blood_type"
              value={form.blood_type} onChange={handleChange} required
            >
              <option value="">Seçin...</option>
              {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="city">Şəhər</label>
            <select
              id="city" name="city"
              value={form.city} onChange={handleChange} required
            >
              <option value="">Seçin...</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button
            type="submit"
            className="btn-primary auth-submit auth-submit--full"
            disabled={loading}
          >
            {loading ? 'Gözləyin...' : '🩸 Qeydiyyatdan keç'}
          </button>
        </form>

        <p className="auth-switch">
          Artıq hesabınız var? <Link to="/login">Daxil olun</Link>
        </p>
      </div>
    </div>
  )
}
