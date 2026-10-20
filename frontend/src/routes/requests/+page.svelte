<script>
	import Building2 from '@lucide/svelte/icons/building-2';
	import Droplet from '@lucide/svelte/icons/droplet';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import SearchX from '@lucide/svelte/icons/search-x';
	import X from '@lucide/svelte/icons/x';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import BloodTypePills from '$lib/components/BloodTypePills.svelte';
	import ContactActions from '$lib/components/ContactActions.svelte';
	import DropBadge from '$lib/components/DropBadge.svelte';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import MatchBadge from '$lib/components/MatchBadge.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Card } from '$lib/components/ui/card';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import { CITIES } from '$lib/constants';
	import { cn } from '$lib/utils';

	let { data } = $props();

	let isAuthenticated = $derived(Boolean(page.data.user));
	const isEn = getLocale() === 'en';
	const allLabel = isEn ? 'All' : 'Hamısı';
	const helpLabel = isEn ? 'Help via WhatsApp' : 'WhatsApp ilə kömək et';
	const respond = (bloodType) =>
		isEn
			? `Hi, I saw your request for ${bloodType} blood on Donor.az. I can help.`
			: `Salam, Donor.az-da ${bloodType} qan qrupu üçün elanı gördüm. Mən kömək edə bilərəm.`;

	const URGENCY_OPTIONS = [
		{ value: '', label: m.requests_allUrgency() },
		{ value: 'Urgent', label: m.requests_urgent() },
		{ value: 'Normal', label: m.requests_normal() }
	];

	let chips = $derived(
		[
			data.filters.bloodType && { key: 'blood_type', label: data.filters.bloodType },
			data.filters.city && { key: 'city', label: data.filters.city },
			data.filters.urgency && {
				key: 'urgency',
				label: data.filters.urgency === 'Urgent' ? m.requests_urgent() : m.requests_normal()
			}
		].filter(Boolean)
	);

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
	<main class="mx-auto max-w-6xl px-6 pb-16">
		<div class="py-10">
			<h1 class="text-3xl font-extrabold text-foreground md:text-4xl">{m.requests_title()}</h1>
			<p class="mt-2 text-muted-foreground">{m.requests_sub()}</p>
		</div>

		<div class="mb-6 rounded-2xl border border-border bg-card p-5 shadow-card">
			<BloodTypePills
				value={data.filters.bloodType}
				{allLabel}
				onChange={(val) => updateFilters({ blood_type: val })}
			/>

			<div class="mt-4 flex flex-wrap items-center gap-5">
				<div class="w-52">
					<FilterSelect
						variant="field"
						value={data.filters.city}
						onChange={(val) => updateFilters({ city: val })}
						options={[{ value: '', label: m.donors_allCities() }, ...CITIES.map((c) => ({ value: c, label: c }))]}
					/>
				</div>
				<div class="w-52">
					<FilterSelect
						variant="field"
						value={data.filters.urgency}
						onChange={(val) => updateFilters({ urgency: val })}
						options={URGENCY_OPTIONS}
					/>
				</div>
				<button
					type="button"
					onclick={resetFilters}
					class="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
				>
					<RotateCcw class="size-3.5" aria-hidden="true" />
					{m.requests_reset()}
				</button>
			</div>
		</div>

		{#if chips.length > 0}
			<div class="mb-6 flex flex-wrap gap-2">
				{#each chips as chip (chip.key)}
					<button
						type="button"
						onclick={() => updateFilters({ [chip.key]: null })}
						class="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
					>
						{chip.label}
						<X class="size-3" aria-hidden="true" />
					</button>
				{/each}
			</div>
		{/if}

		{#if navigating.to}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each [1, 2, 3, 4, 5, 6] as n (n)}
					<Card class="p-5">
						<div class="mb-5 flex items-center justify-between">
							<Skeleton class="h-[65px] w-[52px]" />
							<Skeleton class="h-6 w-20 rounded-full" />
						</div>
						<Skeleton class="mb-2.5 h-5 w-2/3" />
						<Skeleton class="mb-5 h-4 w-1/2" />
						<Skeleton class="h-9 w-full rounded-full" />
					</Card>
				{/each}
			</div>
		{:else if data.error}
			<Card class="flex flex-col items-center gap-4 px-6 py-14 text-center">
				<p class="text-destructive">{data.error}</p>
				<Button variant="outline" size="sm" onclick={() => invalidateAll()}>
					<RotateCcw aria-hidden="true" />
					{m.requests_reset()}
				</Button>
			</Card>
		{:else if data.requests.length === 0}
			<Card class="flex flex-col items-center gap-4 px-6 py-14 text-center">
				<div class="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
					<SearchX class="size-6" aria-hidden="true" />
				</div>
				<p class="font-semibold text-muted-foreground">{m.requests_empty()}</p>
				<div class="flex flex-wrap justify-center gap-2">
					<Button variant="outline" size="sm" onclick={resetFilters}>
						<RotateCcw aria-hidden="true" />
						{m.requests_reset()}
					</Button>
					<Button href={isAuthenticated ? '/dashboard' : '/signup'} size="sm">{m.nav_createRequest()}</Button>
				</div>
			</Card>
		{:else}
			<div class="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.requests as req (req.id)}
					<Card
						class={cn(
							'flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-md',
							req.urgency === 'Urgent' && 'border-l-4 border-l-primary'
						)}
					>
						<div class="mb-4 flex items-start justify-between">
							<DropBadge type={req.blood_type} />
							{#if req.urgency === 'Urgent'}
								<span class="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-primary-foreground">
									<span class="relative flex size-1.5">
										<span class="ping-ring absolute inline-flex size-full rounded-full bg-white opacity-70"></span>
										<span class="relative inline-flex size-1.5 rounded-full bg-white"></span>
									</span>
									{m.requests_urgent()}
								</span>
							{:else}
								<Badge>{m.requests_normal()}</Badge>
							{/if}
						</div>
						<h3 class="mb-2.5 text-lg font-extrabold text-foreground">{req.patient_name}</h3>
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
						<MatchBadge count={req.match_count} city={req.city} />
						{#if req.note}
							<p class="mb-3.5 border-l-2 border-border pl-2.5 text-sm text-muted-foreground">{req.note}</p>
						{/if}
						<ContactActions
							phone={req.contact_phone}
							callLabel={m.requests_call()}
							whatsappLabel={helpLabel}
							message={respond(req.blood_type)}
							locked={!isAuthenticated}
							class="mt-auto"
						/>
					</Card>
				{/each}
			</div>
		{/if}
	</main>
</div>
