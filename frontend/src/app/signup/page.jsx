'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';

import BrandLogo from '@/components/BrandLogo';
import Button from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/input';
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
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-10">
      <div className="w-full max-w-[600px] rounded-2xl border border-border bg-card p-10 shadow-md sm:p-12">
        <BrandLogo className="mb-8 text-[1.1rem]" />
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">{t.signup.title}</h1>
        <p className="mb-8 text-sm text-muted-foreground">{t.signup.sub}</p>

        {error && (
          <div className="mb-5 rounded-lg border border-primary bg-accent px-4 py-3 text-sm text-primary">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="full_name">{t.signup.fullName}</Label>
            <Input id="full_name" type="text" name="full_name" placeholder="Adınız Soyadınız" value={form.full_name} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t.signup.email}</Label>
            <Input id="email" type="email" name="email" placeholder="ad@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{t.signup.password}</Label>
            <Input id="password" type="password" name="password" placeholder={t.signup.passwordHint} value={form.password} onChange={handleChange} required minLength={4} />
            <small className="text-xs text-muted-foreground">{t.signup.passwordHint}</small>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">{t.signup.phone}</Label>
            <Input id="phone" type="tel" name="phone" placeholder="+994 XX XXX XX XX" value={form.phone} onChange={handleChange} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="blood_type">{t.signup.bloodType}</Label>
            <Select id="blood_type" name="blood_type" value={form.blood_type} onChange={handleChange} required>
              <option value="">{t.signup.select}</option>
              {BLOOD_TYPES.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="city">{t.signup.city}</Label>
            <Select id="city" name="city" value={form.city} onChange={handleChange} required>
              <option value="">{t.signup.select}</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <Button type="submit" size="lg" className="col-span-full w-full justify-center" disabled={loading}>
            <UserPlus aria-hidden="true" /> {loading ? t.signup.loading : t.signup.btn}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t.signup.switch} <Link href="/login" className="font-semibold text-primary hover:underline">{t.signup.switchLink}</Link>
        </p>
      </div>
    </div>
  );
}
