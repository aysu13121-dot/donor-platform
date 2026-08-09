'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

import Button from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { BLOOD_TYPES, CITIES } from '@/lib/constants';
import { isValidPhone } from '@/lib/utils';

// Sorğu yaratma formu - həm müstəqil /create-request səhifəsi, həm də
// dashboard-un daxilində açılan panel eyni komponentdən istifadə edir ki,
// iki yerdə eyni sahələr/validasiya təkrarlanmasın.
export default function CreateRequestForm({ onSuccess, onCancel, submitLabel }) {
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
    if (!isValidPhone(form.contact_phone)) {
      setError(t.signup.invalidPhone);
      return;
    }
    setLoading(true);
    try {
      const data = await api.post('/api/requests', {
        ...form,
        units_needed: Number(form.units_needed) || 1,
        note: form.note.trim() || null,
      }, { token });
      onSuccess?.(data.request);
    } catch (err) {
      setError(err.message || t.createRequest.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="patient_name">{t.createRequest.patientName}</Label>
          <Input id="patient_name" name="patient_name" value={form.patient_name} onChange={handleChange} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="blood_type">{t.createRequest.bloodType}</Label>
          <Select id="blood_type" name="blood_type" value={form.blood_type} onChange={handleChange} required>
            <option value="">{t.createRequest.select}</option>
            {BLOOD_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hospital">{t.createRequest.hospital}</Label>
          <Input id="hospital" name="hospital" value={form.hospital} onChange={handleChange} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">{t.createRequest.city}</Label>
          <Select id="city" name="city" value={form.city} onChange={handleChange} required>
            <option value="">{t.createRequest.select}</option>
            {CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="units_needed">{t.createRequest.unitsNeeded}</Label>
          <Input
            id="units_needed" name="units_needed" type="number" min="1"
            value={form.units_needed} onChange={handleChange} required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="urgency">{t.createRequest.urgency}</Label>
          <Select id="urgency" name="urgency" value={form.urgency} onChange={handleChange} required>
            <option value="Urgent">{t.createRequest.urgent}</option>
            <option value="Normal">{t.createRequest.normal}</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact_phone">{t.createRequest.contactPhone}</Label>
          <Input id="contact_phone" name="contact_phone" value={form.contact_phone} onChange={handleChange} required />
        </div>

        <div className="col-span-full flex flex-col gap-1.5">
          <Label htmlFor="note">{t.createRequest.note}</Label>
          <Textarea id="note" name="note" rows="3" value={form.note} onChange={handleChange} />
        </div>

        <div className="col-span-full flex gap-3">
          {onCancel && (
            <Button type="button" variant="outline" size="lg" className="flex-1 justify-center" onClick={onCancel}>
              {t.createRequest.cancel}
            </Button>
          )}
          <Button type="submit" size="lg" className={onCancel ? 'flex-1 justify-center' : 'w-full justify-center'} disabled={loading}>
            <Send aria-hidden="true" /> {loading ? t.createRequest.loading : (submitLabel || t.createRequest.submit)}
          </Button>
        </div>
      </form>
    </div>
  );
}
