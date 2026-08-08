'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Navbar from '@/components/Navbar';
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
    <div className="requests-page">
      <Navbar />
      <main className="requests-shell container">
        <header className="requests-hero">
          <span className="requests-hero__eyebrow">{t.requests.filters}</span>
          <h1 className="requests-hero__title">{t.requests.title}</h1>
          <p className="requests-hero__sub">{t.requests.sub}</p>
        </header>

        <section className="requests-filters" aria-label={t.requests.filters}>
          <select value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
            <option value="">{t.requests.bloodType}: {t.requests.all}</option>
            {BLOOD_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>

          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">{t.requests.city}: {t.requests.all}</option>
            {CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>

          <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            <option value="">{t.requests.urgency}: {t.requests.all}</option>
            <option value="Urgent">{t.requests.urgent}</option>
            <option value="Normal">{t.requests.normal}</option>
          </select>

          <button type="button" className="btn-outline requests-filters__reset" onClick={resetFilters}>
            {t.requests.reset}
          </button>
        </section>

        {notice && <div className="requests-alert requests-alert--success">{notice}</div>}
        {error && <div className="requests-alert requests-alert--error">{error}</div>}

        {loading && <div className="requests-state">{t.requests.loading}</div>}

        {!loading && !error && requests.length === 0 && (
          <div className="requests-state">{t.requests.empty}</div>
        )}

        {!loading && requests.length > 0 && (
          <section className="requests-grid">
            {requests.map((request) => {
              const phone = request.contact_phone || '';
              const digits = phone.replace(/\D/g, '');

              return (
                <article key={request.id} className="request-card">
                  <div className="request-card__top">
                    <span className="request-blood">{request.blood_type || '?'}</span>
                    <span className={request.urgency === 'Urgent' ? 'request-tag request-tag--urgent' : 'request-tag request-tag--normal'}>
                      {request.urgency || t.requests.normal}
                    </span>
                  </div>

                  <h2 className="request-title">{request.patient_name}</h2>
                  <div className="request-meta">
                    <span>{t.requests.hospital}: {request.hospital}</span>
                    <span>{t.requests.city}: {request.city}</span>
                    <span>{request.units_needed} {t.requests.units}</span>
                    {request.note && <span className="request-note">{request.note}</span>}
                  </div>

                  <p className="request-contact">{t.requests.phone}: {phone || '--'}</p>

                  <div className="request-actions">
                    {phone
                      ? <a href={`tel:${phone}`} className="btn-outline request-actions__link">{t.requests.call}</a>
                      : <span className="request-actions__link request-actions__link--muted">{t.requests.call}</span>}
                    {digits ? (
                      <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" className="btn-primary request-actions__link request-actions__link--whatsapp">
                        WhatsApp
                      </a>
                    ) : (
                      <span className="request-actions__link request-actions__link--muted">WhatsApp</span>
                    )}
                    <button
                      type="button"
                      className="btn-primary request-actions__button"
                      onClick={() => handleRespond(request.id)}
                      disabled={sendingId === request.id}
                    >
                      {isAuthenticated
                        ? (sendingId === request.id ? t.requests.loading : t.requests.donorButton)
                        : t.requests.loginToRespond}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
