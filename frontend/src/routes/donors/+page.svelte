<script>
	import Calendar from '@lucide/svelte/icons/calendar';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import XCircle from '@lucide/svelte/icons/x-circle';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import * as m from '$lib/paraglide/messages.js';
	import ContactActions from '$lib/components/ContactActions.svelte';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Card } from '$lib/components/ui/card';
	import { BLOOD_TYPES, CITIES } from '$lib/constants';
	import { cn } from '$lib/utils';

	let { data } = $props();

	let isAuthenticated = $derived(Boolean(page.data.user));

	function updateFilters(patch) {
		const params = new SvelteURLSearchParams(page.url.searchParams);
		for (const [key, value] of Object.entries(patch)) {
			if (value === '' || value === null || value === undefined) {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		}
		goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
	}

	function resetFilters() {
		goto('/donors');
	}
</script>

<div class="min-h-screen bg-background">
	<Navbar />
	<main class="mx-auto max-w-6xl px-6">
		<div class="py-10">
			<h1 class="text-2xl font-semibold text-foreground md:text-3xl">{m.donors_title()}</h1>
		</div>

		<div class="mb-8 flex flex-wrap items-center gap-6 rounded-lg border border-border p-4">
			<FilterSelect
				value={data.filters.bloodType}
				onChange={(val) => updateFilters({ blood_type: val, page: null })}
				options={[{ value: '', label: m.donors_allBloodTypes() }, ...BLOOD_TYPES.map((b) => ({ value: b, label: b }))]}
			/>

			<FilterSelect
				value={data.filters.city}
				onChange={(val) => updateFilters({ city: val, page: null })}
				options={[{ value: '', label: m.donors_allCities() }, ...CITIES.map((c) => ({ value: c, label: c }))]}
			/>

			<button
				type="button"
				onclick={() => updateFilters({ is_available: data.filters.onlyAvailable ? '0' : null, page: null })}
				aria-pressed={data.filters.onlyAvailable}
				class="inline-flex items-center gap-2.5 text-sm font-medium text-foreground"
			>
				{m.donors_onlyAvailable()}
				<span
					class={cn(
						'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
						data.filters.onlyAvailable ? 'bg-primary' : 'bg-border'
					)}
				>
					<span
						class={cn(
							'inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform',
							data.filters.onlyAvailable ? 'translate-x-[18px]' : 'translate-x-1'
						)}
					></span>
				</span>
			</button>

			<button
				type="button"
				onclick={resetFilters}
				class="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
			>
				<RotateCcw class="size-3.5" aria-hidden="true" />
				{m.donors_reset()}
			</button>
		</div>

		{#if data.error}
			<div class="py-16 text-center text-destructive">{data.error}</div>
		{:else if data.donors.length === 0}
			<div class="py-16 text-center text-muted-foreground">{m.donors_empty()}</div>
		{:else}
			<div>
				<div class="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each data.donors as d (d.id)}
						<Card class="flex flex-col p-5 transition-shadow hover:shadow-sm">
							<div class="mb-4 flex items-center justify-between">
								<div class="flex size-11 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
									{d.blood_type || '?'}
								</div>
								<Badge variant={d.is_available ? 'accent' : 'default'} icon={d.is_available ? CheckCircle2 : XCircle}>
									{d.is_available ? m.donors_active() : m.donors_inactive()}
								</Badge>
							</div>
							<h3 class="mb-2.5 text-base font-semibold text-foreground">{d.full_name || m.donors_donor()}</h3>
							<div class="mb-4 flex flex-col gap-1.5 text-sm text-muted-foreground">
								<span class="flex items-center gap-1.5">
									<MapPin class="size-3.5 shrink-0 text-primary" aria-hidden="true" />
									{d.city || '--'}
								</span>
								{#if d.last_donation_date}
									<span class="flex items-center gap-1.5">
										<Calendar class="size-3.5 shrink-0 text-primary" aria-hidden="true" />
										{m.donors_lastDonation()}: {d.last_donation_date}
									</span>
								{/if}
							</div>
							{#if d.bio}
								<p class="mb-3.5 border-l-2 border-border pl-2.5 text-sm text-muted-foreground">{d.bio}</p>
							{/if}
							<ContactActions phone={d.phone} callLabel={m.donors_call()} locked={!isAuthenticated} class="mt-auto" />
						</Card>
					{/each}
				</div>

				{#if data.pagination.total_pages > 1}
					<div class="flex items-center justify-center gap-4 pb-12">
						<Button
							variant="outline"
							size="sm"
							disabled={data.filters.page === 1}
							onclick={() => updateFilters({ page: String(data.filters.page - 1) })}
						>
							<ChevronLeft aria-hidden="true" />
							{m.donors_prev()}
						</Button>
						<span class="text-sm font-semibold text-foreground">{data.filters.page} / {data.pagination.total_pages}</span>
						<Button
							variant="outline"
							size="sm"
							disabled={data.filters.page === data.pagination.total_pages}
							onclick={() => updateFilters({ page: String(data.filters.page + 1) })}
						>
							{m.donors_next()}
							<ChevronRight aria-hidden="true" />
						</Button>
					</div>
				{/if}
			</div>
		{/if}
	</main>
</div>
