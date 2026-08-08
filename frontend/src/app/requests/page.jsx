'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle, Building2, Droplet, Info, MapPin, RotateCcw, SlidersHorizontal, StickyNote,
} from 'lucide-react';

import ContactActions from '@/components/ContactActions';
import Navbar from '@/components/Navbar';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/input';
import Skeleton from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { BLOOD_TYPES, CITIES } from '@/lib/constants';

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-18 pt-10">
        <header className="mb-7 max-w-2xl">
          <h1 className="mb-2 text-2xl font-semibold text-foreground md:text-3xl">{t.requests.title}</h1>
          <p className="text-sm text-muted-foreground">{t.requests.sub}</p>
        </header>

        <Card className="mb-4.5 grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_auto]" aria-label={t.requests.filters}>
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

        {notice && <div className="mb-4.5 rounded-md border border-border bg-accent px-4 py-3 text-sm text-accent-foreground">{notice}</div>}
        {error && <div className="mb-4.5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{error}</div>}

        {loading && (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Card key={i} className="flex flex-col gap-3.5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-12 w-12" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-28" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3.5 w-20" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-9" />
                  <Skeleton className="h-9" />
                  <Skeleton className="h-9" />
                </div>
              </Card>
            ))}
          </section>
        )}

        {!loading && !error && requests.length === 0 && (
          <div className="rounded-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground">{t.requests.empty}</div>
        )}

        {!loading && requests.length > 0 && (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {requests.map((request) => (
              <Card key={request.id} className="flex flex-col gap-3.5 p-5 transition-shadow hover:shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex min-h-12 min-w-12 items-center justify-center rounded-md bg-primary px-3 text-base font-bold text-primary-foreground">
                    {request.blood_type || '?'}
                  </span>
                  <Badge
                    variant={request.urgency === 'Urgent' ? 'destructive' : 'default'}
                    icon={request.urgency === 'Urgent' ? AlertTriangle : Info}
                  >
                    {request.urgency || t.requests.normal}
                  </Badge>
                </div>

                <div>
                  <h2 className="text-base font-semibold text-foreground">{request.patient_name}</h2>
                  {request.author_name && (
                    <p className="text-xs text-muted-foreground">{t.requests.postedBy}: {request.author_name}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Building2 className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {t.requests.hospital}: {request.hospital}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {t.requests.city}: {request.city}</span>
                  <span className="flex items-center gap-1.5"><Droplet className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {request.units_needed} {t.requests.units}</span>
                  {request.note && (
                    <span className="flex items-start gap-1.5 border-l-2 border-border pl-3 text-foreground">
                      <StickyNote className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" /> {request.note}
                    </span>
                  )}
                </div>

                <ContactActions
                  phone={request.contact_phone}
                  callLabel={t.requests.call}
                  onRespond={() => handleRespond(request.id)}
                  respondLabel={isAuthenticated
                    ? (sendingId === request.id ? t.requests.loading : t.requests.donorButton)
                    : t.requests.loginToRespond}
                  respondLoading={sendingId === request.id}
                />
              </Card>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
