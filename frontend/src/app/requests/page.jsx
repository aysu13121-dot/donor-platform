'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle, Building2, Droplet, HeartHandshake, Info, MapPin, MessageCircle, Phone,
  RotateCcw, SlidersHorizontal, StickyNote,
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { BLOOD_TYPES, CITIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function RequestsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { token, isAuthenticated } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [city, setCity] = useState('');
  const [urgency, setUrgency] = useState('');
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bloodType, city, urgency]);

  async function fetchRequests() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ status: 'active' });
      if (bloodType) params.append('blood_type', bloodType);
      if (city) params.append('city', city);
      if (urgency) params.append('urgency', urgency);

      const data = await api.get(`/api/requests?${params.toString()}`);
      setRequests(data.requests || []);
    } catch (err) {
      setError(err.message || t.requests.error);
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setBloodType('');
    setCity('');
    setUrgency('');
  }

  async function handleRespond(requestId) {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setSendingId(requestId);
    setError('');
    setNotice('');
    try {
      const data = await api.post(
        `/api/requests/${requestId}/respond`,
        { message: 'Mən bu sorğu üçün kömək etməyə hazıram.' },
        { token },
      );
      setNotice(data.message || t.requests.responseSuccess);
    } catch (err) {
      setError(err.message || t.requests.responseError);
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-18 pt-10">
        <header className="mb-7 max-w-2xl">
          <span className="mb-4 inline-flex rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            {t.requests.filters}
          </span>
          <h1 className="mb-3.5 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">{t.requests.title}</h1>
          <p className="max-w-xl text-muted-foreground">{t.requests.sub}</p>
        </header>

        <Card className="mb-4.5 grid grid-cols-1 gap-3 p-4.5 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_auto]" aria-label={t.requests.filters}>
          <SlidersHorizontal className="hidden size-[18px] self-center text-muted-foreground lg:block" aria-hidden="true" />
          <Select value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
            <option value="">{t.requests.bloodType}: {t.requests.all}</option>
            {BLOOD_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </Select>

          <Select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">{t.requests.city}: {t.requests.all}</option>
            {CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>

          <Select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            <option value="">{t.requests.urgency}: {t.requests.all}</option>
            <option value="Urgent">{t.requests.urgent}</option>
            <option value="Normal">{t.requests.normal}</option>
          </Select>

          <Button type="button" variant="outline" onClick={resetFilters}>
            <RotateCcw aria-hidden="true" /> {t.requests.reset}
          </Button>
        </Card>

        {notice && <div className="mb-4.5 rounded-xl border border-border bg-accent px-4.5 py-4 text-sm text-primary">{notice}</div>}
        {error && <div className="mb-4.5 rounded-xl border border-border bg-secondary px-4.5 py-4 text-sm text-foreground">{error}</div>}

        {loading && <div className="rounded-xl border border-border bg-card px-4.5 py-4 text-sm text-muted-foreground shadow-sm">{t.requests.loading}</div>}

        {!loading && !error && requests.length === 0 && (
          <div className="rounded-xl border border-border bg-card px-4.5 py-4 text-sm text-muted-foreground shadow-sm">{t.requests.empty}</div>
        )}

        {!loading && requests.length > 0 && (
          <section className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 xl:grid-cols-3">
            {requests.map((request) => {
              const phone = request.contact_phone || '';
              const digits = phone.replace(/\D/g, '');

              return (
                <Card key={request.id} className="flex flex-col gap-4 p-5.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex min-h-14 min-w-14 items-center justify-center rounded-xl bg-primary px-3.5 font-display text-lg font-black text-primary-foreground">
                      {request.blood_type || '?'}
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide',
                        request.urgency === 'Urgent' ? 'bg-accent text-primary' : 'bg-secondary text-muted-foreground',
                      )}
                    >
                      {request.urgency === 'Urgent' ? <AlertTriangle className="size-3" aria-hidden="true" /> : <Info className="size-3" aria-hidden="true" />}
                      {request.urgency || t.requests.normal}
                    </span>
                  </div>

                  <h2 className="text-lg font-extrabold text-foreground">{request.patient_name}</h2>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Building2 className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {t.requests.hospital}: {request.hospital}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {t.requests.city}: {request.city}</span>
                    <span className="flex items-center gap-1.5"><Droplet className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {request.units_needed} {t.requests.units}</span>
                    {request.note && (
                      <span className="flex items-start gap-1.5 border-l-2 border-primary pl-3 text-foreground">
                        <StickyNote className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" /> {request.note}
                      </span>
                    )}
                  </div>

                  <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Phone className="size-3.5 text-primary" aria-hidden="true" /> {t.requests.phone}: {phone || '--'}
                  </p>

                  <div className="grid grid-cols-3 gap-2.5">
                    {phone ? (
                      <a href={`tel:${phone}`} className="flex min-h-11 items-center justify-center gap-1.5 rounded-full border-2 border-border text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">
                        <Phone className="size-[18px]" aria-hidden="true" /> {t.requests.call}
                      </a>
                    ) : (
                      <span className="flex min-h-11 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-muted-foreground">{t.requests.call}</span>
                    )}
                    {digits ? (
                      <a
                        href={`https://wa.me/${digits}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-foreground text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        <MessageCircle className="size-[18px]" aria-hidden="true" /> WhatsApp
                      </a>
                    ) : (
                      <span className="flex min-h-11 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-muted-foreground">WhatsApp</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRespond(request.id)}
                      disabled={sendingId === request.id}
                      className="flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <HeartHandshake className="size-[18px]" aria-hidden="true" />
                      {isAuthenticated
                        ? (sendingId === request.id ? t.requests.loading : t.requests.donorButton)
                        : t.requests.loginToRespond}
                    </button>
                  </div>
                </Card>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
