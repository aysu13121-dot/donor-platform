'use client';

import { useEffect, useState } from 'react';
import {
  Calendar, CheckCircle2, ChevronLeft, ChevronRight, MapPin, RotateCcw, SlidersHorizontal, XCircle,
} from 'lucide-react';

import ContactActions from '@/components/ContactActions';
import Navbar from '@/components/Navbar';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/input';
import Skeleton from '@/components/ui/skeleton';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { BLOOD_TYPES, CITIES } from '@/lib/constants';

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
        <div className="py-10">
          <h1 className="mb-1.5 text-2xl font-semibold text-foreground md:text-3xl">{t.donors.title}</h1>
          <p className="text-sm text-muted-foreground">{t.donors.sub}</p>
        </div>

        <Card className="mb-8 flex flex-wrap items-center gap-3 p-4">
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

        {loading && (
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>
        )}
        {!loading && error && <div className="py-16 text-center text-destructive">{error}</div>}

        {!loading && !error && donors.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">{t.donors.empty}</div>
        )}

        {!loading && donors.length > 0 && (
          <div>
            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {donors.map((d) => (
                <Card key={d.id} className="p-5 transition-shadow hover:shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                      {d.blood_type || '?'}
                    </div>
                    <Badge variant={d.is_available ? 'accent' : 'default'} icon={d.is_available ? CheckCircle2 : XCircle}>
                      {d.is_available ? t.donors.active : t.donors.inactive}
                    </Badge>
                  </div>
                  <h3 className="mb-2.5 text-base font-semibold text-foreground">{d.full_name || t.donors.donor}</h3>
                  <div className="mb-4 flex flex-col gap-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {d.city || '--'}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {t.donors.lastDonation}: {d.last_donation_date || t.donors.noInfo}</span>
                  </div>
                  {d.bio && (
                    <p className="mb-3.5 border-l-2 border-border pl-2.5 text-sm text-muted-foreground">{d.bio}</p>
                  )}
                  {d.phone && <ContactActions phone={d.phone} callLabel={t.donors.call} />}
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
