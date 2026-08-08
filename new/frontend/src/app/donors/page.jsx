'use client';

import { useEffect, useState } from 'react';

import Navbar from '@/components/Navbar';
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
    <div className="donors-page">
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">{t.donors.title}</h1>
          <p className="page-sub">{t.donors.sub}</p>
        </div>

        <div className="filter-bar">
          <select value={bloodType} onChange={(e) => { setBloodType(e.target.value); setPage(1); }}>
            <option value="">{t.donors.allBloodTypes}</option>
            {BLOOD_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          <select value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }}>
            <option value="">{t.donors.allCities}</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <label className="avail-toggle">
            <input
              type="checkbox"
              checked={onlyAvail}
              onChange={(e) => { setOnlyAvail(e.target.checked); setPage(1); }}
            />
            {t.donors.onlyAvailable}
          </label>

          <button type="button" className="btn-outline reset-btn" onClick={resetFilters}>
            {t.donors.reset}
          </button>
        </div>

        {loading && <div className="state-msg">{t.donors.loading}</div>}
        {error && <div className="state-msg error">{error}</div>}

        {!loading && !error && donors.length === 0 && (
          <div className="state-msg">{t.donors.empty}</div>
        )}

        {!loading && donors.length > 0 && (
          <div>
            <div className="donors-grid">
              {donors.map((d) => (
                <div key={d.id} className="donor-card">
                  <div className="card-top">
                    <div className="blood-badge">{d.blood_type || '?'}</div>
                    <span className={d.is_available ? 'status-tag active' : 'status-tag inactive'}>
                      {d.is_available ? t.donors.active : t.donors.inactive}
                    </span>
                  </div>
                  <h3 className="donor-name">{d.full_name || t.donors.donor}</h3>
                  <div className="donor-info">
                    <span>{d.city || '--'}</span>
                    <span>{t.donors.lastDonation}: {d.last_donation_date || t.donors.noInfo}</span>
                  </div>
                  {d.bio && <p className="donor-bio">{d.bio}</p>}
                  {d.phone && (
                    <div className="card-actions">
                      <a href={`tel:${d.phone}`} className="btn-call">{t.donors.call}</a>
                      <a
                        href={`https://wa.me/${d.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-whatsapp"
                      >
                        WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  {t.donors.prev}
                </button>
                <span>{page} / {totalPages}</span>
                <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  {t.donors.next}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
