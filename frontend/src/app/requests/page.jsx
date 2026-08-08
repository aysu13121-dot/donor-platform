'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle, Building2, Droplet, Info, MapPin, RotateCcw, StickyNote,
} from 'lucide-react';

import ContactActions from '@/components/ContactActions';
import FilterSelect from '@/components/FilterSelect';
import Navbar from '@/components/Navbar';
import Badge from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Skeleton from '@/components/ui/skeleton';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { BLOOD_TYPES, CITIES } from '@/lib/constants';

export default function RequestsPage() {
  const { t } = useLanguage();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [city, setCity] = useState('');
  const [urgency, setUrgency] = useState('');

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-18 pt-10">
        <header className="mb-7 max-w-2xl">
          <h1 className="mb-2 text-2xl font-semibold text-foreground md:text-3xl">{t.requests.title}</h1>
          <p className="text-sm text-muted-foreground">{t.requests.sub}</p>
        </header>

        <div className="mb-8 flex flex-wrap items-center gap-6 rounded-lg border border-border p-4" aria-label={t.requests.filters}>
          <FilterSelect
            value={bloodType}
            onChange={setBloodType}
            options={[{ value: '', label: t.donors.allBloodTypes }, ...BLOOD_TYPES.map((type) => ({ value: type, label: type }))]}
          />

          <FilterSelect
            value={city}
            onChange={setCity}
            options={[{ value: '', label: t.donors.allCities }, ...CITIES.map((item) => ({ value: item, label: item }))]}
          />

          <FilterSelect
            value={urgency}
            onChange={setUrgency}
            options={[
              { value: '', label: t.requests.allUrgency },
              { value: 'Urgent', label: t.requests.urgent },
              { value: 'Normal', label: t.requests.normal },
            ]}
          />

          <button
            type="button"
            onClick={resetFilters}
            className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" /> {t.requests.reset}
          </button>
        </div>

        {error && <div className="mb-4.5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{error}</div>}

        {loading && (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Card key={i} className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <Skeleton className="size-11" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="mb-2.5 h-4 w-32" />
                <div className="mb-4 flex flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3.5 w-36" />
                </div>
                <div className="grid grid-cols-2 gap-2">
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
              <Card key={request.id} className="flex flex-col p-5 transition-shadow hover:shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                    {request.blood_type || '?'}
                  </div>
                  <Badge
                    variant={request.urgency === 'Urgent' ? 'destructive' : 'default'}
                    icon={request.urgency === 'Urgent' ? AlertTriangle : Info}
                  >
                    {request.urgency || t.requests.normal}
                  </Badge>
                </div>

                <h3 className="mb-1 text-base font-semibold text-foreground">{request.patient_name}</h3>
                {request.author_name && (
                  <p className="mb-2.5 text-xs text-muted-foreground">{t.requests.postedBy}: {request.author_name}</p>
                )}

                <div className="mb-4 mt-1.5 flex flex-col gap-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Building2 className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {request.hospital}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {request.city}</span>
                  <span className="flex items-center gap-1.5"><Droplet className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {request.units_needed} {t.requests.units}</span>
                </div>

                {request.note && (
                  <p className="mb-3.5 flex items-start gap-1.5 border-l-2 border-border pl-2.5 text-sm text-muted-foreground">
                    <StickyNote className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" /> {request.note}
                  </p>
                )}

                <ContactActions phone={request.contact_phone} callLabel={t.requests.call} className="mt-auto" />
              </Card>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
