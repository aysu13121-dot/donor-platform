'use client';

import { useEffect, useState } from 'react';
import { Droplet, MapPin, X } from 'lucide-react';

import ContactActions from '@/components/ContactActions';
import Button from '@/components/ui/button';
import Skeleton from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

// Sorğu sahibinin aldığı donor təkliflərini göstərir - backend-də
// GET /api/requests/:id/responses artıq mövcud idi, amma heç bir səhifə
// onu çağırmırdı, donor "Kömək et"ə bassa da sorğu sahibi bunu heç görmürdü.
export default function OffersModal({ requestId, patientName, open, onClose }) {
  const { t } = useLanguage();
  const { token } = useAuth();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !requestId) return;

    let cancelled = false;
    setLoading(true);
    setError('');

    api
      .get(`/api/requests/${requestId}/responses`, { token })
      .then((data) => {
        if (!cancelled) setOffers(data.responses || data.offers || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || t.dashboard.offersError);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, requestId, token, t.dashboard.offersError]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className="relative flex max-h-[80vh] w-full max-w-lg flex-col rounded-lg border border-border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">{t.dashboard.offers}</p>
            <p className="text-xs text-muted-foreground">
              {patientName}
              {!loading && !error && offers.length > 0 && ` · ${t.dashboard.offersCount(offers.length)}`}
            </p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label={t.dashboard.close}>
            <X aria-hidden="true" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i} className="rounded-md border border-border p-3.5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <Skeleton className="mb-2 h-3 w-20" />
                  <Skeleton className="mb-3 h-3 w-full" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-9" />
                    <Skeleton className="h-9" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && error && <p className="text-sm text-destructive">{error}</p>}
          {!loading && !error && offers.length === 0 && (
            <p className="text-sm text-muted-foreground">{t.dashboard.noOffers}</p>
          )}
          {!loading && !error && offers.length > 0 && (
            <div className="flex flex-col gap-3">
              {offers.map((offer) => (
                <div key={offer.id} className="rounded-md border border-border p-3.5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{offer.donor_name}</p>
                    {offer.blood_type && (
                      <span className="flex items-center gap-1 text-xs font-medium text-primary">
                        <Droplet className="size-3" aria-hidden="true" /> {offer.blood_type}
                      </span>
                    )}
                  </div>
                  {offer.city && (
                    <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3 shrink-0" aria-hidden="true" /> {offer.city}
                    </p>
                  )}
                  {offer.message && (
                    <p className="mb-3 border-l-2 border-border pl-2.5 text-sm text-foreground">{offer.message}</p>
                  )}
                  <ContactActions phone={offer.phone} callLabel={t.donors.call} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
