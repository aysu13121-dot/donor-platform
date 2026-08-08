'use client';

import { useEffect, useState } from 'react';
import {
  Building2, CheckCircle2, Droplet, MapPin, Save, Trash2, TriangleAlert, XCircle,
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ApiError, api } from '@/lib/api';
import { BLOOD_TYPES, CITIES } from '@/lib/constants';

function DashboardContent() {
  const { t, lang } = useLanguage();
  const { token, updateUser, logout } = useAuth();

  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [requestError, setRequestError] = useState('');
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    blood_type: '',
    city: '',
    phone: '',
    last_donation_date: '',
    bio: '',
    is_available: true,
  });

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Əvvəlki versiyada 401 aşkarlanması `err.message.toLowerCase().includes('token')`
  // ilə edilirdi - backend mesaj mətnini dəyişsəydi səssizcə pozulacaqdı.
  // İndi ApiError.status birbaşa HTTP status kodunu daşıyır.
  function handleAuthError(err) {
    if (err instanceof ApiError && err.status === 401) {
      logout();
      return true;
    }
    return false;
  }

  async function loadDashboard() {
    if (!token) return;

    setLoading(true);
    setRequestsLoading(true);
    setError('');
    setRequestError('');

    try {
      const profileData = await api.get('/api/me', { token });
      const loadedUser = profileData.user;
      setUser(loadedUser);
      setForm({
        full_name: loadedUser.full_name || '',
        blood_type: loadedUser.blood_type || '',
        city: loadedUser.city || '',
        phone: loadedUser.phone || '',
        last_donation_date: loadedUser.last_donation_date || '',
        bio: loadedUser.bio || '',
        is_available: Boolean(loadedUser.is_available),
      });

      const requestsData = await api.get(`/api/requests?status=all&user_id=${loadedUser.id}`, { token });
      setRequests(requestsData.requests || []);
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err.message || t.dashboard.error);
      }
    } finally {
      setLoading(false);
      setRequestsLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = await api.put('/api/me', {
        full_name: form.full_name,
        blood_type: form.blood_type,
        city: form.city,
        phone: form.phone,
        last_donation_date: form.last_donation_date || null,
        bio: form.bio || null,
        is_available: form.is_available ? 1 : 0,
      }, { token });

      const updatedUser = data.user || {};
      setUser(updatedUser);
      updateUser(updatedUser);
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err.message || t.dashboard.saveError);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(requestId) {
    setDeleteLoadingId(requestId);
    setRequestError('');
    try {
      await api.delete(`/api/requests/${requestId}`, { token });
      setRequests((prev) => prev.filter((item) => item.id !== requestId));
    } catch (err) {
      if (!handleAuthError(err)) {
        setRequestError(err.message || t.dashboard.deleteError);
      }
    } finally {
      setDeleteLoadingId(null);
    }
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-shell container">
        <header className="dashboard-hero">
          <div>
            <span className="dashboard-hero__eyebrow">{t.dashboard.profile}</span>
            <h1 className="dashboard-hero__title">{t.dashboard.title}</h1>
            <p className="dashboard-hero__sub">{t.dashboard.sub}</p>
          </div>
        </header>

        {error && <div className="dashboard-alert dashboard-alert--error">{error}</div>}
        {requestError && <div className="dashboard-alert dashboard-alert--error">{requestError}</div>}

        <section className="dashboard-grid">
          <article className="auth-card auth-card--wide dashboard-card">
            <h2 className="auth-title">{t.dashboard.profile}</h2>
            <p className="auth-sub">{user?.email || ''}</p>

            {loading ? (
              <div className="dashboard-state">{t.dashboard.loading}</div>
            ) : (
              <form className="auth-form auth-form--grid dashboard-form" onSubmit={handleSave}>
                <div className="form-group">
                  <label htmlFor="full_name">{t.dashboard.fullName}</label>
                  <input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="blood_type">{t.dashboard.bloodType}</label>
                  <select id="blood_type" name="blood_type" value={form.blood_type} onChange={handleChange}>
                    <option value="">{t.dashboard.bloodType}</option>
                    {BLOOD_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="city">{t.dashboard.city}</label>
                  <select id="city" name="city" value={form.city} onChange={handleChange}>
                    <option value="">{t.dashboard.city}</option>
                    {CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{t.dashboard.phone}</label>
                  <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="last_donation_date">{t.dashboard.lastDonation}</label>
                  <input
                    id="last_donation_date" name="last_donation_date" type="date"
                    value={form.last_donation_date || ''} onChange={handleChange}
                  />
                </div>

                <div className="form-group dashboard-toggle">
                  <label htmlFor="is_available">{t.dashboard.available}</label>
                  <label className="dashboard-switch">
                    <input id="is_available" name="is_available" type="checkbox" checked={form.is_available} onChange={handleChange} />
                    <span>{form.is_available ? t.dashboard.active : t.dashboard.cancelled}</span>
                  </label>
                </div>

                <div className="form-group dashboard-bio">
                  <label htmlFor="bio">{t.dashboard.bio}</label>
                  <textarea id="bio" name="bio" rows="4" value={form.bio || ''} onChange={handleChange} />
                </div>

                <button type="submit" className="btn-primary auth-submit auth-submit--full" disabled={saving || loading}>
                  <Save aria-hidden="true" /> {saving ? t.dashboard.saving : t.dashboard.save}
                </button>
              </form>
            )}
          </article>

          <article className="auth-card auth-card--wide dashboard-card dashboard-card--requests">
            <h2 className="auth-title">{t.dashboard.requests}</h2>
            <p className="auth-sub">
              {requestsLoading ? t.dashboard.loadingRequests : t.dashboard.requestsCount(requests.length)}
            </p>

            {requestsLoading ? (
              <div className="dashboard-state">{t.dashboard.loadingRequests}</div>
            ) : requests.length === 0 ? (
              <div className="dashboard-state">{t.dashboard.noRequests}</div>
            ) : (
              <div className="dashboard-requests">
                {requests.map((item) => (
                  <article key={item.id} className="dashboard-request">
                    <div className="dashboard-request__top">
                      <span className="dashboard-request__blood">{item.blood_type}</span>
                      <span className={
                        item.status === 'fulfilled' ? 'dashboard-status dashboard-status--fulfilled'
                          : item.status === 'cancelled' ? 'dashboard-status dashboard-status--cancelled'
                            : 'dashboard-status dashboard-status--active'
                      }>
                        {item.status === 'fulfilled' ? <CheckCircle2 aria-hidden="true" />
                          : item.status === 'cancelled' ? <XCircle aria-hidden="true" />
                            : <TriangleAlert aria-hidden="true" />}
                        {item.status === 'fulfilled' ? t.dashboard.fulfilled
                          : item.status === 'cancelled' ? t.dashboard.cancelled
                            : t.dashboard.active}
                      </span>
                    </div>

                    <h3 className="dashboard-request__title">{item.patient_name}</h3>
                    <div className="dashboard-request__meta">
                      <span><Building2 aria-hidden="true" /> {t.dashboard.hospital}: {item.hospital}</span>
                      <span><MapPin aria-hidden="true" /> {t.dashboard.city}: {item.city}</span>
                      <span><Droplet aria-hidden="true" /> {item.units_needed} {t.dashboard.units}</span>
                      <span><TriangleAlert aria-hidden="true" /> {t.dashboard.urgency}: {item.urgency}</span>
                    </div>

                    <button
                      type="button"
                      className="btn-outline dashboard-request__delete"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteLoadingId === item.id}
                    >
                      <Trash2 aria-hidden="true" /> {t.dashboard.delete}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
