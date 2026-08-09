'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

import FilterSelect from '@/components/FilterSelect';
import Button from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { BLOOD_TYPES, CITIES } from '@/lib/constants';
import { isValidPhone } from '@/lib/utils';

// Profil redaktə formu - dashboard-un sol sidebar-ındakı profil bloku
// bura yönləndirir (/dashboard?panel=profile). AuthContext-dəki istifadəçini
// (üst çubuq/sidebar adı üçün) və çağıranın öz lokal state-ini (statistika
// kartı üçün) `onSuccess` vasitəsilə eyni anda yeniləyir.
export default function ProfileForm({ user, onSuccess }) {
  const { t } = useLanguage();
  const { token, updateUser } = useAuth();

  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    blood_type: user?.blood_type || '',
    city: user?.city || '',
    phone: user?.phone || '',
    last_donation_date: user?.last_donation_date || '',
    bio: user?.bio || '',
    is_available: Boolean(user?.is_available),
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!form.blood_type) {
      setError(t.dashboard.bloodTypeRequired);
      return;
    }
    if (!form.city) {
      setError(t.dashboard.cityRequired);
      return;
    }
    if (form.phone && !isValidPhone(form.phone)) {
      setError(t.signup.invalidPhone);
      return;
    }
    setSaving(true);
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
      updateUser(updatedUser);
      onSuccess?.(updatedUser);
    } catch (err) {
      setError(err.message || t.dashboard.updateError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      <form className="grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
        <div className="col-span-full flex flex-col gap-1.5">
          <Label htmlFor="full_name">{t.dashboard.fullName}</Label>
          <Input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="blood_type">{t.dashboard.bloodType}</Label>
          <FilterSelect
            id="blood_type"
            variant="field"
            value={form.blood_type}
            onChange={(val) => setForm((prev) => ({ ...prev, blood_type: val }))}
            options={BLOOD_TYPES.map((b) => ({ value: b, label: b }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">{t.dashboard.city}</Label>
          <FilterSelect
            id="city"
            variant="field"
            value={form.city}
            onChange={(val) => setForm((prev) => ({ ...prev, city: val }))}
            options={CITIES.map((c) => ({ value: c, label: c }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">{t.dashboard.phone}</Label>
          <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="last_donation_date">{t.dashboard.lastDonation}</Label>
          <Input
            id="last_donation_date" name="last_donation_date" type="date"
            value={form.last_donation_date || ''} onChange={handleChange}
          />
        </div>

        <div className="col-span-full flex items-center justify-between rounded-md border border-input px-3.5 py-2.5">
          <Label htmlFor="is_available" className="cursor-pointer">{t.dashboard.available}</Label>
          <input
            id="is_available" name="is_available" type="checkbox"
            className="size-4 accent-primary"
            checked={form.is_available} onChange={handleChange}
          />
        </div>

        <div className="col-span-full flex flex-col gap-1.5">
          <Label htmlFor="bio">{t.dashboard.bio}</Label>
          <Textarea id="bio" name="bio" rows="3" value={form.bio || ''} onChange={handleChange} />
        </div>

        <Button type="submit" size="lg" className="col-span-full w-full justify-center" disabled={saving}>
          <Save aria-hidden="true" /> {saving ? t.dashboard.saving : t.dashboard.save}
        </Button>
      </form>
    </div>
  );
}
