<script>
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import Building2 from '@lucide/svelte/icons/building-2';
	import Droplet from '@lucide/svelte/icons/droplet';
	import Info from '@lucide/svelte/icons/info';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import StickyNote from '@lucide/svelte/icons/sticky-note';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import * as m from '$lib/paraglide/messages.js';
	import ContactActions from '$lib/components/ContactActions.svelte';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { Card } from '$lib/components/ui/card';
	import { BLOOD_TYPES, CITIES } from '$lib/constants';

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
		goto('/requests');
	}
</script>

<div class="min-h-screen bg-background">
	<Navbar />
	<main class="mx-auto max-w-6xl px-6">
		<div class="py-10">
			<h1 class="text-2xl font-semibold text-foreground md:text-3xl">{m.requests_title()}</h1>
		</div>

		<div class="mb-8 flex flex-wrap items-center gap-6 rounded-lg border border-border p-4" aria-label={m.requests_filters()}>
			<FilterSelect
				value={data.filters.bloodType}
				onChange={(val) => updateFilters({ blood_type: val })}
				options={[{ value: '', label: m.donors_allBloodTypes() }, ...BLOOD_TYPES.map((type) => ({ value: type, label: type }))]}
			/>

			<FilterSelect
				value={data.filters.city}
				onChange={(val) => updateFilters({ city: val })}
				options={[{ value: '', label: m.donors_allCities() }, ...CITIES.map((item) => ({ value: item, label: item }))]}
			/>

			<FilterSelect
				value={data.filters.urgency}
				onChange={(val) => updateFilters({ urgency: val })}
				options={[
					{ value: '', label: m.requests_allUrgency() },
					{ value: 'Urgent', label: m.requests_urgent() },
					{ value: 'Normal', label: m.requests_normal() }
				]}
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
		{:else if data.requests.length > 0}
			<section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{#each data.requests as request (request.id)}
					<Card class="flex flex-col p-5 transition-shadow hover:shadow-sm">
						<div class="mb-4 flex items-center justify-between">
							<div class="flex size-11 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
								{request.blood_type || '?'}
							</div>
							<Badge
								variant={request.urgency === 'Urgent' ? 'destructive' : 'default'}
								icon={request.urgency === 'Urgent' ? AlertTriangle : Info}
							>
								{request.urgency || m.requests_normal()}
							</Badge>
						</div>

						<h3 class="mb-1 text-base font-semibold text-foreground">{request.patient_name}</h3>
						{#if request.author_name}
							<p class="mb-2.5 text-xs text-muted-foreground">{m.requests_postedBy()}: {request.author_name}</p>
						{/if}

						<div class="mb-4 mt-1.5 flex flex-col gap-1.5 text-sm text-muted-foreground">
							<span class="flex items-center gap-1.5">
								<Building2 class="size-3.5 shrink-0 text-primary" aria-hidden="true" />
								{request.hospital}
							</span>
							<span class="flex items-center gap-1.5">
								<MapPin class="size-3.5 shrink-0 text-primary" aria-hidden="true" />
								{request.city}
							</span>
							<span class="flex items-center gap-1.5">
								<Droplet class="size-3.5 shrink-0 text-primary" aria-hidden="true" />
								{request.units_needed} {m.requests_units()}
							</span>
						</div>

						{#if request.note}
							<p class="mb-3.5 flex items-start gap-1.5 border-l-2 border-border pl-2.5 text-sm text-muted-foreground">
								<StickyNote class="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
								{request.note}
							</p>
						{/if}

						<ContactActions phone={request.contact_phone} callLabel={m.requests_call()} locked={!isAuthenticated} class="mt-auto" />
					</Card>
				{/each}
			</section>
		{/if}
	</main>
</div>
