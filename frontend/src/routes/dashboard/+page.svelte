<script>
	import Activity from '@lucide/svelte/icons/activity';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import ClipboardList from '@lucide/svelte/icons/clipboard-list';
	import Droplet from '@lucide/svelte/icons/droplet';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import XCircle from '@lucide/svelte/icons/x-circle';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
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
			<h1 class="text-2xl font-semibold text-foreground md:text-3xl">{m.createRequest_badge()}</h1>
		</div>
		<Card class="max-w-3xl p-6 sm:p-8">
			<CreateRequestForm onSuccess={handleCreateSuccess} />
		</Card>
	</DashboardShell>
{:else if showProfilePanel}
	<DashboardShell>
		<div class="mb-5">
			<h1 class="text-2xl font-semibold text-foreground md:text-3xl">{m.dashboard_profile()}</h1>
			<p class="mt-1 text-sm text-muted-foreground">{page.data.user?.email || ''}</p>
		</div>
		<Card class="max-w-2xl p-6 sm:p-8">
			<ProfileForm user={page.data.user} onSuccess={handleProfileSuccess} />
		</Card>
	</DashboardShell>
{:else}
	<DashboardShell>
		<div class="mb-8">
			<h1 class="text-2xl font-semibold text-foreground md:text-3xl">{m.dashboard_overviewTitle()}</h1>
		</div>

		{#if data.requestsError}
			<div class="mb-5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{data.requestsError}</div>
		{/if}
		{#if requestError}
			<div class="mb-5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{requestError}</div>
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
							<div class="flex items-center gap-3 border-b border-border py-3 last:border-0">
								<span class="shrink-0 rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-primary">{item.blood_type}</span>

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
