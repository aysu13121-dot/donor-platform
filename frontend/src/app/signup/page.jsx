'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import BrandLogo from '@/components/BrandLogo';
import FilterSelect from '@/components/FilterSelect';
import Button from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { BLOOD_TYPES, CITIES } from '@/lib/constants';
import { isValidPhone } from '@/lib/utils';

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
    if (!form.blood_type || !form.city || !form.phone) {
      setError(t.signup.requiredError);
      return;
    }
    if (!isValidPhone(form.phone)) {
      setError(t.signup.invalidPhone);
      return;
    }
    if (form.password.length < 4) {
      setError(t.signup.passwordHint);
      return;
    }
    setLoading(true);
    try {
      const data = await api.post('/api/signup', form);
      login(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || t.signup.serverErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[600px] rounded-lg border border-border bg-card p-10 sm:p-12">
        <BrandLogo className="mb-8" />
        <h1 className="mb-8 text-2xl font-semibold text-foreground">{t.signup.title}</h1>

        {error && (
          <div className="mb-5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="full_name">{t.signup.fullName}</Label>
            <Input id="full_name" type="text" name="full_name" placeholder={t.signup.fullNamePlaceholder} value={form.full_name} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t.signup.email}</Label>
            <Input id="email" type="email" name="email" placeholder="ad@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{t.signup.password}</Label>
            <Input id="password" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">{t.signup.phone}</Label>
            <Input id="phone" type="tel" name="phone" placeholder="+994 XX XXX XX XX" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="blood_type">{t.signup.bloodType}</Label>
            <FilterSelect
              id="blood_type"
              variant="field"
              value={form.blood_type}
              onChange={(val) => setForm((prev) => ({ ...prev, blood_type: val }))}
              options={[{ value: '', label: t.signup.select }, ...BLOOD_TYPES.map((bt) => ({ value: bt, label: bt }))]}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="city">{t.signup.city}</Label>
            <FilterSelect
              id="city"
              variant="field"
              value={form.city}
              onChange={(val) => setForm((prev) => ({ ...prev, city: val }))}
              options={[{ value: '', label: t.signup.select }, ...CITIES.map((c) => ({ value: c, label: c }))]}
            />
          </div>
          <Button type="submit" size="lg" className="col-span-full w-full justify-center" disabled={loading}>
            {loading ? t.signup.loading : t.signup.btn}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t.signup.switch} <Link href="/login" className="font-semibold text-primary hover:underline">{t.signup.switchLink}</Link>
        </p>
      </div>
    </div>
  );
}
