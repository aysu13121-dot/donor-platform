'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import BrandLogo from '@/components/BrandLogo';
import GuestRoute from '@/components/GuestRoute';
import Button from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

function LoginForm() {
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
      const data = await api.post('/api/signin', form);
      login(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || t.login.serverErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[440px] rounded-lg border border-border bg-card p-10 sm:p-12">
        <BrandLogo className="mb-8" />
        <h1 className="mb-8 text-2xl font-semibold text-foreground">{t.login.title}</h1>

        {error && (
          <div className="mb-5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t.login.email}</Label>
            <Input id="email" type="email" name="email" placeholder="ad@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{t.login.password}</Label>
            <Input id="password" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          <Button type="submit" size="lg" className="w-full justify-center" disabled={loading}>
            {loading ? t.login.loading : t.login.btn}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {t.login.switch} <Link href="/signup" className="font-semibold text-primary hover:underline">{t.login.switchLink}</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <GuestRoute>
      <LoginForm />
    </GuestRoute>
  );
}
