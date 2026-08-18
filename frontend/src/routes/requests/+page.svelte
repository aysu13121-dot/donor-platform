<script>
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Share2 from '@lucide/svelte/icons/share-2';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import * as m from '$lib/paraglide/messages.js';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Card } from '$lib/components/ui/card';
	import { BLOOD_TYPES, CITIES } from '$lib/constants';

	let { data } = $props();

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

	function shareOnWhatsApp(req) {
		const text = `🩸 Təcili qan lazımdır!\nQan qrupu: ${req.blood_type}\nXəstəxana: ${req.hospital}\nŞəhər: ${req.city}\nƏlaqə: ${req.contact_phone}\nDonor.az vasitəsilə kömək et: https://webdonoraz.onrender.com/requests`;
		const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
		window.open(url, '_blank');
	}
</script>

<div class="min-h-screen bg-background">
	<Navbar />
	<main class="mx-auto max-w-6xl px-6">
		<div class="py-10">
			<h1 class="text-2xl font-semibold text-foreground md:text-3xl">{m.requests_title()}</h1>
			<p class="mt-1 text-sm text-muted-foreground">{m.requests_sub()}</p>
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
					<Card class="flex flex-col gap-3 p-6">
						<div class="flex items-start justify-between gap-2">
							<div class="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
								{req.blood_type}
							</div>
							<Badge variant={req.urgency === 'urgent' ? 'destructive' : 'default'}>
								{req.urgency === 'urgent' ? m.requests_urgent() : m.requests_normal()}
							</Badge>
						</div>

						<div>
							<p class="text-base font-semibold text-foreground">{req.patient_name}</p>
							<p class="text-sm text-muted-foreground">{req.hospital} — {req.city}</p>
						</div>

						{#if req.units_needed}
							<p class="text-xs text-muted-foreground">{req.units_needed} {m.requests_units()}</p>
						{/if}

						{#if req.note}
							<p class="border-l-2 border-border pl-3 text-sm text-muted-foreground">{req.note}</p>
						{/if}

						<div class="mt-auto grid grid-cols-2 gap-2 pt-2">
							<Button href="tel:{req.contact_phone}" variant="outline" size="sm" class="w-full">
								{m.requests_call()}
							</Button>
							<button
								type="button"
								onclick={() => shareOnWhatsApp(req)}
								class="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
							>
								<Share2 class="size-3.5" aria-hidden="true" />
								{m.requests_whatsapp()}
							</button>
						</div>
					</Card>
				{/each}
			</div>
		{/if}
	</main>
</div>
