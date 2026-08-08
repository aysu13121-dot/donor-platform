'use client';

import { useEffect, useState } from 'react';
import {
  Calendar, CheckCircle2, ChevronLeft, ChevronRight, MapPin, MessageCircle, Phone, RotateCcw,
  SlidersHorizontal, XCircle,
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { BLOOD_TYPES, CITIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function DonorsPage() {
  const { t } = useLanguage();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [city, setCity] = useState('');
  const [onlyAvail, setOnlyAvail] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDonors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bloodType, city, onlyAvail, page]);

  async function fetchDonors() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (bloodType) params.append('blood_type', bloodType);
      if (city) params.append('city', city);
      if (onlyAvail) params.append('is_available', 1);

      const data = await api.get(`/api/donors?${params.toString()}`);
      setDonors(data.donors || []);
      setTotalPages(Math.max(data.pagination ? data.pagination.total_pages : 1, 1));
    } catch (err) {
      setError(err.message || t.donors.error);
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setBloodType('');
    setCity('');
    setOnlyAvail(true);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6">
        <div className="py-12 text-center">
          <h1 className="mb-2.5 font-display text-4xl font-black text-foreground md:text-5xl">{t.donors.title}</h1>
          <p className="text-muted-foreground">{t.donors.sub}</p>
        </div>

        <Card className="mb-8 flex flex-wrap items-center gap-3 p-5">
          <SlidersHorizontal className="size-[18px] shrink-0 text-muted-foreground" aria-hidden="true" />
          <Select className="w-auto" value={bloodType} onChange={(e) => { setBloodType(e.target.value); setPage(1); }}>
            <option value="">{t.donors.allBloodTypes}</option>
            {BLOOD_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
          </Select>

          <Select className="w-auto" value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }}>
            <option value="">{t.donors.allCities}</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              className="size-4 accent-primary"
              checked={onlyAvail}
              onChange={(e) => { setOnlyAvail(e.target.checked); setPage(1); }}
            />
            {t.donors.onlyAvailable}
          </label>

          <Button variant="outline" size="sm" className="ml-auto" onClick={resetFilters}>
            <RotateCcw aria-hidden="true" /> {t.donors.reset}
          </Button>
        </Card>

        {loading && <div className="py-16 text-center text-muted-foreground">{t.donors.loading}</div>}
        {error && <div className="py-16 text-center text-primary">{error}</div>}

        {!loading && !error && donors.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">{t.donors.empty}</div>
        )}

        {!loading && donors.length > 0 && (
          <div>
            <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {donors.map((d) => (
                <Card key={d.id} className="p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-base font-extrabold text-primary-foreground">
                      {d.blood_type || '?'}
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold',
                        d.is_available ? 'bg-accent text-primary' : 'bg-secondary text-muted-foreground',
                      )}
                    >
                      {d.is_available ? <CheckCircle2 className="size-3" aria-hidden="true" /> : <XCircle className="size-3" aria-hidden="true" />}
                      {d.is_available ? t.donors.active : t.donors.inactive}
                    </span>
                  </div>
                  <h3 className="mb-2.5 text-lg font-bold text-foreground">{d.full_name || t.donors.donor}</h3>
                  <div className="mb-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {d.city || '--'}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {t.donors.lastDonation}: {d.last_donation_date || t.donors.noInfo}</span>
                  </div>
                  {d.bio && (
                    <p className="mb-3.5 border-l-2 border-primary pl-2.5 text-sm italic text-muted-foreground">{d.bio}</p>
                  )}
                  {d.phone && (
                    <div className="flex gap-2.5">
                      <a
                        href={`tel:${d.phone}`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary bg-accent px-3 py-2.5 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                      >
                        <Phone className="size-[15px]" aria-hidden="true" /> {t.donors.call}
                      </a>
                      <a
                        href={`https://wa.me/${d.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
                      >
                        <MessageCircle className="size-[15px]" aria-hidden="true" /> WhatsApp
                      </a>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pb-12">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft aria-hidden="true" /> {t.donors.prev}
                </Button>
                <span className="text-sm font-semibold text-foreground">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  {t.donors.next} <ChevronRight aria-hidden="true" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
