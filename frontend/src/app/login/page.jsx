'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const { login } = useAuth();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/api/login', form);
      login(data.token, data.user);
      router.push('/');
    } catch (err) {
      setError(err.message || t.login.serverErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <BrandLogo className="auth-logo" />
        <h1 className="auth-title">{t.login.title}</h1>
        <p className="auth-sub">{t.login.sub}</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">{t.login.email}</label>
            <input
              id="email" type="email" name="email"
              placeholder="ad@example.com"
              value={form.email} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t.login.password}</label>
            <input
              id="password" type="password" name="password"
              placeholder="••••••••"
              value={form.password} onChange={handleChange} required
            />
          </div>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            <LogIn aria-hidden="true" /> {loading ? t.login.loading : t.login.btn}
          </button>
        </form>

        <p className="auth-switch">
          {t.login.switch} <Link href="/signup">{t.login.switchLink}</Link>
        </p>
      </div>
    </div>
  );
}
