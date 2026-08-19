<script>
	import Building2 from '@lucide/svelte/icons/building-2';
	import Droplet from '@lucide/svelte/icons/droplet';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
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

	let { data } = $props();

	let isAuthenticated = $derived(Boolean(page.data.user));

	const URGENCY_OPTIONS = [
		{ value: '', label: m.requests_allUrgency() },
		{ value: 'urgent', label: m.requests_urgent() },
		{ value: 'normal', label: m.requests_normal() },
	];

	function updateFilters(patch) {
		const params = new SvelteURLSearchParams(page.url.searchParams);
		for (const [key, value] of Object.entries(patch)) {
			if (value === '' || value == null) params.delete(key);
			else params.set(key, value);
		}
		goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
	}

	function resetFilters() {
		goto('/requests');
	}
</script>

<div class="min-h-screen bg-background">
	<Navbar />
	<main class="mx-auto max-w-6xl px-6">
		<div class="py-10">
			<h1 class="text-2xl font-semibold text-foreground md:text-3xl">{m.requests_title()}</h1>
		</div>

		<div class="mb-8 flex flex-wrap items-center gap-4 rounded-lg border border-border p-4">
			<FilterSelect
				value={data.filters.bloodType}
				onChange={(val) => updateFilters({ blood_type: val })}
				options={[{ value: '', label: m.donors_allBloodTypes() }, ...BLOOD_TYPES.map((b) => ({ value: b, label: b }))]}
			/>
			<FilterSelect
				value={data.filters.city}
				onChange={(val) => updateFilters({ city: val })}
				options={[{ value: '', label: m.donors_allCities() }, ...CITIES.map((c) => ({ value: c, label: c }))]}
			/>
			<FilterSelect
				value={data.filters.urgency}
				onChange={(val) => updateFilters({ urgency: val })}
				options={URGENCY_OPTIONS}
			/>
			<button
				type="button"
				onclick={resetFilters}
				class="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
			>
				<RotateCcw class="size-3.5" aria-hidden="true" />
				{m.requests_reset()}
			</button>
		</div>

		{#if data.error}
			<div class="py-16 text-center text-destructive">{data.error}</div>
		{:else if data.requests.length === 0}
			<div class="py-16 text-center text-muted-foreground">{m.requests_empty()}</div>
		{:else}
			<div class="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.requests as req (req.id)}
					<Card class="flex flex-col p-5 transition-shadow hover:shadow-sm">
						<div class="mb-4 flex items-center justify-between">
							<div class="flex size-11 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
								{req.blood_type}
							</div>
							<Badge variant={req.urgency === 'urgent' ? 'destructive' : 'default'}>
								{req.urgency === 'urgent' ? m.requests_urgent() : m.requests_normal()}
							</Badge>
						</div>
						<h3 class="mb-2.5 text-base font-semibold text-foreground">{req.patient_name}</h3>
						<div class="mb-4 flex flex-col gap-1.5 text-sm text-muted-foreground">
							<span class="flex items-center gap-1.5">
								<MapPin class="size-3.5 shrink-0 text-primary" aria-hidden="true" />
								{req.city || '--'}
							</span>
							<span class="flex items-center gap-1.5">
								<Building2 class="size-3.5 shrink-0 text-primary" aria-hidden="true" />
								{req.hospital}
							</span>
							{#if req.units_needed}
								<span class="flex items-center gap-1.5">
									<Droplet class="size-3.5 shrink-0 text-primary" aria-hidden="true" />
									{req.units_needed} {m.requests_units()}
								</span>
							{/if}
						</div>
						{#if req.note}
							<p class="mb-3.5 border-l-2 border-border pl-2.5 text-sm text-muted-foreground">{req.note}</p>
						{/if}
						<ContactActions phone={req.contact_phone} callLabel={m.requests_call()} locked={!isAuthenticated} class="mt-auto" />
					</Card>
				{/each}
			</div>
		{/if}
	</main>
</div>
