'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { BLOOD_TYPES, CITIES } from '@/lib/constants';

function CreateRequestForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const { token } = useAuth();

  const [form, setForm] = useState({
    patient_name: '',
    blood_type: '',
    hospital: '',
    city: '',
    units_needed: 1,
    urgency: 'Urgent',
    contact_phone: '',
    note: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/requests', {
        ...form,
        units_needed: Number(form.units_needed) || 1,
        note: form.note.trim() || null,
      }, { token });
      router.push('/requests');
    } catch (err) {
      setError(err.message || t.createRequest.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-request-page">
      <Navbar />
      <main className="create-request-shell">
        <div className="container create-request-container">
          <section className="auth-card auth-card--wide create-request-card">
            <span className="create-request-badge">{t.createRequest.badge}</span>
            <h1 className="auth-title">{t.createRequest.title}</h1>
            <p className="auth-sub">{t.createRequest.sub}</p>

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form auth-form--grid" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="patient_name">{t.createRequest.patientName}</label>
                <input id="patient_name" name="patient_name" value={form.patient_name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="blood_type">{t.createRequest.bloodType}</label>
                <select id="blood_type" name="blood_type" value={form.blood_type} onChange={handleChange} required>
                  <option value="">{t.createRequest.select}</option>
                  {BLOOD_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="hospital">{t.createRequest.hospital}</label>
                <input id="hospital" name="hospital" value={form.hospital} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="city">{t.createRequest.city}</label>
                <select id="city" name="city" value={form.city} onChange={handleChange} required>
                  <option value="">{t.createRequest.select}</option>
                  {CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="units_needed">{t.createRequest.unitsNeeded}</label>
                <input
                  id="units_needed" name="units_needed" type="number" min="1"
                  value={form.units_needed} onChange={handleChange} required
                />
              </div>

              <div className="form-group">
                <label htmlFor="urgency">{t.createRequest.urgency}</label>
                <select id="urgency" name="urgency" value={form.urgency} onChange={handleChange} required>
                  <option value="Urgent">{t.createRequest.urgent}</option>
                  <option value="Normal">{t.createRequest.normal}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="contact_phone">{t.createRequest.contactPhone}</label>
                <input id="contact_phone" name="contact_phone" value={form.contact_phone} onChange={handleChange} required />
              </div>

              <div className="form-group create-request-note">
                <label htmlFor="note">{t.createRequest.note}</label>
                <textarea id="note" name="note" rows="4" value={form.note} onChange={handleChange} />
              </div>

              <button type="submit" className="btn-primary auth-submit auth-submit--full" disabled={loading}>
                {loading ? t.createRequest.loading : t.createRequest.submit}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function CreateRequestPage() {
  return (
    <ProtectedRoute>
      <CreateRequestForm />
    </ProtectedRoute>
  );
}
