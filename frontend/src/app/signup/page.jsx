'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';

import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { BLOOD_TYPES, CITIES } from '@/lib/constants';

export default function SignupPage() {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '',
    blood_type: '', city: '', phone: '',
  });
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
      const data = await api.post('/api/signup', form);
      login(data.token, data.user);
      router.push('/');
    } catch (err) {
      setError(err.message || t.signup.serverErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <BrandLogo className="auth-logo" />
        <h1 className="auth-title">{t.signup.title}</h1>
        <p className="auth-sub">{t.signup.sub}</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form auth-form--grid">
          <div className="form-group">
            <label htmlFor="full_name">{t.signup.fullName}</label>
            <input
              id="full_name" type="text" name="full_name"
              placeholder="Adınız Soyadınız"
              value={form.full_name} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{t.signup.email}</label>
            <input
              id="email" type="email" name="email"
              placeholder="ad@example.com"
              value={form.email} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t.signup.password}</label>
            <input
              id="password" type="password" name="password"
              placeholder={t.signup.passwordHint}
              value={form.password} onChange={handleChange} required minLength={4}
            />
            <small>{t.signup.passwordHint}</small>
          </div>
          <div className="form-group">
            <label htmlFor="phone">{t.signup.phone}</label>
            <input
              id="phone" type="tel" name="phone"
              placeholder="+994 XX XXX XX XX"
              value={form.phone} onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="blood_type">{t.signup.bloodType}</label>
            <select id="blood_type" name="blood_type" value={form.blood_type} onChange={handleChange} required>
              <option value="">{t.signup.select}</option>
              {BLOOD_TYPES.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="city">{t.signup.city}</label>
            <select id="city" name="city" value={form.city} onChange={handleChange} required>
              <option value="">{t.signup.select}</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary auth-submit auth-submit--full" disabled={loading}>
            <UserPlus aria-hidden="true" /> {loading ? t.signup.loading : t.signup.btn}
          </button>
        </form>

        <p className="auth-switch">
          {t.signup.switch} <Link href="/login">{t.signup.switchLink}</Link>
        </p>
      </div>
    </div>
  );
}
