'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Activity, CheckCircle2, ClipboardList, Droplet, Trash2, TriangleAlert, XCircle,
} from 'lucide-react';

import CreateRequestForm from '@/components/CreateRequestForm';
import DashboardShell from '@/components/dashboard/DashboardShell';
import StatCard from '@/components/dashboard/StatCard';
import ProfileForm from '@/components/ProfileForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Skeleton from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ApiError, api } from '@/lib/api';

const STATUS_VARIANT = { fulfilled: 'success', cancelled: 'default', active: 'accent' };
const STATUS_ICON = { fulfilled: CheckCircle2, cancelled: XCircle, active: TriangleAlert };

function DashboardContent() {
  const { t } = useLanguage();
  const { token, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePanel = searchParams.get('panel');
  const showCreatePanel = activePanel === 'create';
  const showProfilePanel = activePanel === 'profile';

  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestError, setRequestError] = useState('');
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

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

  function closePanel() {
    router.push('/dashboard');
  }

  async function handleCreateSuccess() {
    closePanel();
    await loadDashboard();
  }

  function handleProfileSuccess(updatedUser) {
    setUser(updatedUser);
  }

  async function handleMarkFulfilled(requestId) {
    setUpdatingId(requestId);
    setRequestError('');
    try {
      const data = await api.put(`/api/requests/${requestId}`, { status: 'fulfilled' }, { token });
      const updated = data.request;
      setRequests((prev) => prev.map((item) => (item.id === requestId ? updated : item)));
    } catch (err) {
      if (!handleAuthError(err)) {
        setRequestError(err.message || t.dashboard.updateError);
      }
    } finally {
      setUpdatingId(null);
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

  if (showCreatePanel) {
    return (
      <DashboardShell>
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{t.createRequest.badge}</h1>
        </div>
        <Card className="max-w-3xl p-6 sm:p-8">
          <CreateRequestForm onSuccess={handleCreateSuccess} />
        </Card>
      </DashboardShell>
    );
  }

  if (showProfilePanel) {
    return (
      <DashboardShell>
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{t.dashboard.profile}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user?.email || ''}</p>
        </div>
        <Card className="max-w-2xl p-6 sm:p-8">
          {loading ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <Skeleton className="h-11 w-full" />
            </div>
          ) : (
            <ProfileForm user={user} onSuccess={handleProfileSuccess} />
          )}
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
          {t.dashboard.overviewTitle}
        </h1>
      </div>

      {error && <div className="mb-5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{error}</div>}
      {requestError && <div className="mb-5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{requestError}</div>}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardList} value={requests.length} label={t.dashboard.statTotal} loading={requestsLoading} />
        <StatCard icon={Activity} value={activeCount} label={t.dashboard.statActive} loading={requestsLoading} />
        <StatCard icon={CheckCircle2} value={fulfilledCount} label={t.dashboard.statFulfilled} loading={requestsLoading} />
        <StatCard
          icon={Droplet}
          value={user?.is_available ? t.donors.active : t.donors.inactive}
          label={t.dashboard.statDonorStatus}
          tone={user?.is_available ? 'primary' : 'default'}
          loading={loading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.requests}</CardTitle>
        </CardHeader>
        <CardContent>
          {requestsLoading ? (
            <div className="flex flex-col">
              {Array.from({ length: 4 }).map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i} className="flex items-center gap-3 border-b border-border py-3 last:border-0">
                  <Skeleton className="size-8 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="mb-1.5 h-3.5 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-5 w-16 shrink-0" />
                  <Skeleton className="size-8 shrink-0" />
                </div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="py-4 text-sm text-muted-foreground">{t.dashboard.noRequests}</div>
          ) : (
            <div className="flex flex-col">
              {requests.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-b border-border py-3 last:border-0">
                  <span className="shrink-0 rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-primary">{item.blood_type}</span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{item.patient_name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.hospital} | {item.city} | {item.units_needed} {t.requests.units} | {item.urgency === 'Urgent' ? t.requests.urgent : t.requests.normal}
                    </p>
                  </div>

                  <Badge variant={STATUS_VARIANT[item.status] || 'default'} icon={STATUS_ICON[item.status]} className="shrink-0">
                    {item.status === 'fulfilled' ? t.dashboard.fulfilled
                      : item.status === 'cancelled' ? t.dashboard.cancelled
                        : t.dashboard.active}
                  </Badge>

                  <div className="flex shrink-0 items-center gap-1">
                    {item.status === 'active' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleMarkFulfilled(item.id)}
                        disabled={updatingId === item.id}
                        aria-label={t.dashboard.fulfilled}
                      >
                        <CheckCircle2 className="hover:text-primary" aria-hidden="true" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="hover:border-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteLoadingId === item.id}
                      aria-label={t.dashboard.delete}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
