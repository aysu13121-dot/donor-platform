<script>
	import Activity from '@lucide/svelte/icons/activity';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import ClipboardList from '@lucide/svelte/icons/clipboard-list';
	import Droplet from '@lucide/svelte/icons/droplet';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import XCircle from '@lucide/svelte/icons/x-circle';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import DropBadge from '$lib/components/DropBadge.svelte';
	import CreateRequestForm from '$lib/components/CreateRequestForm.svelte';
	import DashboardShell from '$lib/components/dashboard/DashboardShell.svelte';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import ProfileForm from '$lib/components/ProfileForm.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { ApiError, api } from '$lib/api';

	const STATUS_VARIANT = { fulfilled: 'success', cancelled: 'default', active: 'accent' };
	const STATUS_ICON = { fulfilled: CheckCircle2, cancelled: XCircle, active: TriangleAlert };

	let { data } = $props();

	let activePanel = $derived(page.url.searchParams.get('panel'));
	let showCreatePanel = $derived(activePanel === 'create');
	let showProfilePanel = $derived(activePanel === 'profile');

	let requestError = $state('');
	let deleteLoadingId = $state(null);
	let updatingId = $state(null);

	let activeCount = $derived(data.requests.filter((r) => r.status === 'active').length);
	let fulfilledCount = $derived(data.requests.filter((r) => r.status === 'fulfilled').length);

	// Növbəti donorluq tarixi: son donorluqdan 56 gün (8 həftə) sonra. Bu, FAQ-dakı
	// ümumi qaydadır, tibbi qərar deyil - ekranda da belə yazılır.
	const DONATION_GAP_DAYS = 56;
	const locale = getLocale();
	const T = {
		az: {
			hello: (n) => `Salam, ${n}`,
			ready: 'Qan verməyə hazırsan',
			next: (d) => `Növbəti donorluq: ${d}`,
			noDate: 'Son donorluq tarixini profildə qeyd et.',
			guide: 'Təxmini tarix, son qərarı həkim verir.',
			profile: 'Profil'
		},
		en: {
			hello: (n) => `Hi, ${n}`,
			ready: 'You can donate now',
			next: (d) => `Next donation: ${d}`,
			noDate: 'Add your last donation date in your profile.',
			guide: 'Estimated date. A doctor makes the final decision.',
			profile: 'Profile'
		}
	};
	const t = T[locale] ?? T.az;

	let user = $derived(page.data.user);
	let firstName = $derived((user?.full_name || m.donors_donor()).split(' ')[0]);
	let nextDate = $derived.by(() => {
		if (!user?.last_donation_date) return null;
		const last = Date.parse(user.last_donation_date + 'T00:00:00');
		return Number.isNaN(last) ? null : new Date(last + DONATION_GAP_DAYS * 86400000);
	});
	let canDonate = $derived(!nextDate || nextDate <= new Date());
	// Brauzerlərin bəzisində az-AZ ay adları yoxdur ("M11" çıxır), ona görə ayları özümüz yazırıq.
	const MONTHS = {
		az: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'],
		en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	};
	let nextLabel = $derived(
		nextDate ? `${nextDate.getDate()} ${(MONTHS[locale] ?? MONTHS.az)[nextDate.getMonth()]} ${nextDate.getFullYear()}` : ''
	);

	async function handleCreateSuccess() {
		await goto('/dashboard', { invalidateAll: true });
	}

	function handleProfileSuccess() {
		goto('/dashboard?panel=profile', { invalidateAll: true, noScroll: true });
	}

	async function handleMarkFulfilled(requestId) {
		updatingId = requestId;
		requestError = '';
		try {
			await api.put(`/api/requests/${requestId}`, { status: 'fulfilled' });
			await invalidateAll();
		} catch (err) {
			requestError = err instanceof ApiError ? err.message : m.dashboard_updateError();
		} finally {
			updatingId = null;
		}
	}

	async function handleDelete(requestId) {
		deleteLoadingId = requestId;
		requestError = '';
		try {
			await api.delete(`/api/requests/${requestId}`);
			await invalidateAll();
		} catch (err) {
			requestError = err instanceof ApiError ? err.message : m.dashboard_deleteError();
		} finally {
			deleteLoadingId = null;
		}
	}
</script>

{#if showCreatePanel}
	<DashboardShell>
		<div class="mb-5">
			<h1 class="text-3xl font-extrabold text-foreground">{m.createRequest_badge()}</h1>
		</div>
		<Card class="max-w-3xl p-6 sm:p-8">
			<CreateRequestForm onSuccess={handleCreateSuccess} />
		</Card>
	</DashboardShell>
{:else if showProfilePanel}
	<DashboardShell>
		<div class="mb-5">
			<h1 class="text-3xl font-extrabold text-foreground">{m.dashboard_profile()}</h1>
			<p class="mt-1 text-sm text-muted-foreground">{page.data.user?.email || ''}</p>
		</div>
		<Card class="max-w-2xl p-6 sm:p-8">
			<ProfileForm user={page.data.user} onSuccess={handleProfileSuccess} />
		</Card>
	</DashboardShell>
{:else}
	<DashboardShell>
		<h1 class="sr-only">{m.dashboard_overviewTitle()}</h1>

		<section class="hero-red relative mb-6 overflow-hidden rounded-3xl p-6 text-white shadow-pop sm:p-8">
			<div class="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-5">
					<div class="relative h-20 w-16 shrink-0">
						<svg viewBox="0 0 64 80" class="h-20 w-16 text-white" aria-hidden="true">
							<path d="M32 4C32 4 6 34 6 52a26 26 0 0 0 52 0C58 34 32 4 32 4Z" fill="currentColor" />
						</svg>
						<span class="absolute inset-x-0 top-[62%] -translate-y-1/2 text-center text-xl font-extrabold" style="color: var(--primary)">{user?.blood_type || '?'}</span>
					</div>
					<div>
						<p class="text-2xl font-extrabold sm:text-3xl">{t.hello(firstName)}</p>
						<p class="mt-1 text-sm text-white/85">{user?.city || ''}</p>
						<p class="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
							<Droplet class="size-4" aria-hidden="true" />
							{canDonate ? t.ready : t.next(nextLabel)}
						</p>
						<p class="mt-1.5 text-xs text-white/75">{user?.last_donation_date ? t.guide : t.noDate}</p>
					</div>
				</div>
				<div class="flex flex-wrap gap-2">
					<Button href="/dashboard?panel=create" variant="light">
						<Plus aria-hidden="true" />
						{m.nav_createRequest()}
					</Button>
					<Button href="/dashboard?panel=profile" variant="outlineLight">{t.profile}</Button>
				</div>
			</div>
		</section>

		{#if data.requestsError}
			<div class="mb-5 rounded-xl border border-primary/30 bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground" role="alert">{data.requestsError}</div>
		{/if}
		{#if requestError}
			<div class="mb-5 rounded-xl border border-primary/30 bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground" role="alert">{requestError}</div>
		{/if}

		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<StatCard icon={ClipboardList} value={data.requests.length} label={m.dashboard_statTotal()} />
			<StatCard icon={Activity} value={activeCount} label={m.dashboard_statActive()} />
			<StatCard icon={CheckCircle2} value={fulfilledCount} label={m.dashboard_statFulfilled()} />
			<StatCard
				icon={Droplet}
				value={page.data.user?.is_available ? m.donors_active() : m.donors_inactive()}
				label={m.dashboard_statDonorStatus()}
				tone={page.data.user?.is_available ? 'primary' : 'default'}
			/>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>{m.dashboard_requests()}</CardTitle>
			</CardHeader>
			<CardContent>
				{#if data.requests.length === 0}
					<div class="py-4 text-sm text-muted-foreground">{m.dashboard_noRequests()}</div>
				{:else}
					<div class="flex flex-col">
						{#each data.requests as item (item.id)}
							<div class="flex items-center gap-3 border-b border-border py-4 last:border-0">
								<DropBadge type={item.blood_type} size="sm" />

								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-semibold text-foreground">{item.patient_name}</p>
									<p class="truncate text-xs text-muted-foreground">
										{item.hospital} | {item.city} | {item.units_needed} {m.requests_units()} | {item.urgency === 'Urgent'
											? m.requests_urgent()
											: m.requests_normal()}
									</p>
								</div>

								<Badge variant={STATUS_VARIANT[item.status] || 'default'} icon={STATUS_ICON[item.status]} class="shrink-0">
									{item.status === 'fulfilled' ? m.dashboard_fulfilled() : item.status === 'cancelled' ? m.dashboard_cancelled() : m.dashboard_active()}
								</Badge>

								<div class="flex shrink-0 items-center gap-1">
									{#if item.status === 'active'}
										<Button
											type="button"
											variant="outline"
											size="icon"
											onclick={() => handleMarkFulfilled(item.id)}
											disabled={updatingId === item.id}
											aria-label={m.dashboard_fulfilled()}
										>
											<CheckCircle2 class="hover:text-primary" aria-hidden="true" />
										</Button>
									{/if}
									<Button
										type="button"
										variant="outline"
										size="icon"
										class="hover:border-destructive hover:text-destructive"
										onclick={() => handleDelete(item.id)}
										disabled={deleteLoadingId === item.id}
										aria-label={m.dashboard_delete()}
									>
										<Trash2 aria-hidden="true" />
									</Button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</CardContent>
		</Card>
	</DashboardShell>
{/if}
