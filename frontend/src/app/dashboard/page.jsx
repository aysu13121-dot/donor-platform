'use client';

import { useEffect, useState } from 'react';
import {
  Activity, Building2, CheckCircle2, ClipboardList, Droplet, MapPin, Save, Trash2,
  TriangleAlert, XCircle,
} from 'lucide-react';

import DashboardShell from '@/components/dashboard/DashboardShell';
import StatCard from '@/components/dashboard/StatCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ApiError, api } from '@/lib/api';
import { BLOOD_TYPES, CITIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

function DashboardContent() {
  const { t } = useLanguage();
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

  const activeCount = requests.filter((r) => r.status === 'active').length;
  const fulfilledCount = requests.filter((r) => r.status === 'fulfilled').length;

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="mb-1.5 font-display text-2xl font-bold text-foreground md:text-3xl">
          {t.dashboard.overviewTitle}
        </h1>
        <p className="text-sm text-muted-foreground">{t.dashboard.sub}</p>
      </div>

      {error && <div className="mb-5 rounded-lg border border-primary bg-accent px-4 py-3 text-sm text-primary">{error}</div>}
      {requestError && <div className="mb-5 rounded-lg border border-primary bg-accent px-4 py-3 text-sm text-primary">{requestError}</div>}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardList} value={requestsLoading ? '–' : requests.length} label={t.dashboard.statTotal} />
        <StatCard icon={Activity} value={requestsLoading ? '–' : activeCount} label={t.dashboard.statActive} tone="primary" />
        <StatCard icon={CheckCircle2} value={requestsLoading ? '–' : fulfilledCount} label={t.dashboard.statFulfilled} />
        <StatCard
          icon={Droplet}
          value={loading ? '–' : (form.is_available ? t.dashboard.active : t.dashboard.cancelled)}
          label={t.dashboard.statDonorStatus}
          tone={form.is_available ? 'primary' : 'default'}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>{t.dashboard.profile}</CardTitle>
            <p className="text-sm text-muted-foreground">{user?.email || ''}</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="rounded-lg bg-secondary p-4 text-sm text-muted-foreground">{t.dashboard.loading}</div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSave}>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="full_name">{t.dashboard.fullName}</Label>
                  <Input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="blood_type">{t.dashboard.bloodType}</Label>
                    <Select id="blood_type" name="blood_type" value={form.blood_type} onChange={handleChange}>
                      <option value="">{t.dashboard.bloodType}</option>
                      {BLOOD_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="city">{t.dashboard.city}</Label>
                    <Select id="city" name="city" value={form.city} onChange={handleChange}>
                      <option value="">{t.dashboard.city}</option>
                      {CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
                    </Select>
                  </div>
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

                <div className="flex items-center justify-between rounded-lg border border-input px-3.5 py-2.5">
                  <Label htmlFor="is_available" className="cursor-pointer">{t.dashboard.available}</Label>
                  <input
                    id="is_available" name="is_available" type="checkbox"
                    className="size-4 accent-primary"
                    checked={form.is_available} onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="bio">{t.dashboard.bio}</Label>
                  <Textarea id="bio" name="bio" rows="4" value={form.bio || ''} onChange={handleChange} />
                </div>

                <Button type="submit" className="w-full justify-center" disabled={saving || loading}>
                  <Save aria-hidden="true" /> {saving ? t.dashboard.saving : t.dashboard.save}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>{t.dashboard.requests}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {requestsLoading ? t.dashboard.loadingRequests : t.dashboard.requestsCount(requests.length)}
            </p>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <div className="rounded-lg bg-secondary p-4 text-sm text-muted-foreground">{t.dashboard.loadingRequests}</div>
            ) : requests.length === 0 ? (
              <div className="rounded-lg bg-secondary p-4 text-sm text-muted-foreground">{t.dashboard.noRequests}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <th className="pb-3 pr-3 font-semibold">{t.dashboard.tablePatient}</th>
                      <th className="pb-3 pr-3 font-semibold">{t.dashboard.tableLocation}</th>
                      <th className="pb-3 pr-3 font-semibold">{t.dashboard.tableStatus}</th>
                      <th className="pb-3 pl-3 text-right font-semibold">{t.dashboard.tableActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {requests.map((item) => (
                      <tr key={item.id} className="align-top">
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-foreground">{item.patient_name}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Droplet className="size-3 text-primary" aria-hidden="true" /> {item.blood_type}
                            <span className="mx-1">·</span>
                            {item.units_needed} {t.dashboard.units}
                            <span className="mx-1">·</span>
                            <TriangleAlert className="size-3" aria-hidden="true" /> {item.urgency}
                          </p>
                        </td>
                        <td className="py-3 pr-3 text-muted-foreground">
                          <p className="flex items-center gap-1"><Building2 className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {item.hospital}</p>
                          <p className="flex items-center gap-1"><MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> {item.city}</p>
                        </td>
                        <td className="py-3 pr-3">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase',
                              item.status === 'fulfilled' && 'bg-secondary text-muted-foreground',
                              item.status === 'cancelled' && 'bg-secondary text-foreground',
                              item.status === 'active' && 'bg-accent text-primary',
                            )}
                          >
                            {item.status === 'fulfilled' && <CheckCircle2 aria-hidden="true" />}
                            {item.status === 'cancelled' && <XCircle aria-hidden="true" />}
                            {item.status === 'active' && <TriangleAlert aria-hidden="true" />}
                            {item.status === 'fulfilled' ? t.dashboard.fulfilled
                              : item.status === 'cancelled' ? t.dashboard.cancelled
                                : t.dashboard.active}
                          </span>
                        </td>
                        <td className="py-3 pl-3 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            disabled={deleteLoadingId === item.id}
                            aria-label={t.dashboard.delete}
                          >
                            <Trash2 className="text-muted-foreground hover:text-destructive" aria-hidden="true" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
