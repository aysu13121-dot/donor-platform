<script>
	import Calendar from '@lucide/svelte/icons/calendar';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
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
	import Navbar from '$lib/components/Navbar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Card } from '$lib/components/ui/card';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import { CITIES } from '$lib/constants';
	import { cn } from '$lib/utils';

	let { data } = $props();

	let isAuthenticated = $derived(Boolean(page.data.user));
	const allLabel = getLocale() === 'en' ? 'All' : 'Hamısı';

	let chips = $derived(
		[
			data.filters.bloodType && { key: 'blood_type', label: data.filters.bloodType },
			data.filters.city && { key: 'city', label: data.filters.city }
		].filter(Boolean)
	);

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
	<main class="mx-auto max-w-6xl px-6 pb-16">
		<div class="py-10">
			<h1 class="text-3xl font-extrabold text-foreground md:text-4xl">{m.donors_title()}</h1>
			<p class="mt-2 text-muted-foreground">{m.donors_sub()}</p>
		</div>

		<div class="mb-6 rounded-2xl border border-border bg-card p-5 shadow-card">
			<BloodTypePills
				value={data.filters.bloodType}
				{allLabel}
				onChange={(val) => updateFilters({ blood_type: val, page: null })}
			/>

			<div class="mt-4 flex flex-wrap items-center gap-5">
				<div class="w-52">
					<FilterSelect
						variant="field"
						value={data.filters.city}
						onChange={(val) => updateFilters({ city: val, page: null })}
						options={[{ value: '', label: m.donors_allCities() }, ...CITIES.map((c) => ({ value: c, label: c }))]}
					/>
				</div>

				<button
					type="button"
					onclick={() => updateFilters({ is_available: data.filters.onlyAvailable ? '0' : null, page: null })}
					aria-pressed={data.filters.onlyAvailable}
					class="inline-flex items-center gap-2.5 text-sm font-semibold text-foreground"
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
					class="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
				>
					<RotateCcw class="size-3.5" aria-hidden="true" />
					{m.donors_reset()}
				</button>
			</div>
		</div>

		{#if chips.length > 0}
			<div class="mb-6 flex flex-wrap gap-2">
				{#each chips as chip (chip.key)}
					<button
						type="button"
						onclick={() => updateFilters({ [chip.key]: null, page: null })}
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
						<Skeleton class="mb-5 h-4 w-1/3" />
						<Skeleton class="h-9 w-full rounded-full" />
					</Card>
				{/each}
			</div>
		{:else if data.error}
			<Card class="flex flex-col items-center gap-4 px-6 py-14 text-center">
				<p class="text-destructive">{data.error}</p>
				<Button variant="outline" size="sm" onclick={() => invalidateAll()}>
					<RotateCcw aria-hidden="true" />
					{m.donors_reset()}
				</Button>
			</Card>
		{:else if data.donors.length === 0}
			<Card class="flex flex-col items-center gap-4 px-6 py-14 text-center">
				<div class="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
					<SearchX class="size-6" aria-hidden="true" />
				</div>
				<p class="font-semibold text-muted-foreground">{m.donors_empty()}</p>
				<Button variant="outline" size="sm" onclick={resetFilters}>
					<RotateCcw aria-hidden="true" />
					{m.donors_reset()}
				</Button>
			</Card>
		{:else}
			<div>
				<div class="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each data.donors as d (d.id)}
						<Card class="flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
							<div class="mb-4 flex items-start justify-between">
								<DropBadge type={d.blood_type || '?'} />
								<span
									class={cn(
										'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold',
										d.is_available
											? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
											: 'bg-secondary text-muted-foreground'
									)}
								>
									<span class="relative flex size-2">
										{#if d.is_available}
											<span class="ping-ring absolute inline-flex size-full rounded-full bg-emerald-500 opacity-60"></span>
										{/if}
										<span
											class={cn(
												'relative inline-flex size-2 rounded-full',
												d.is_available ? 'bg-emerald-500' : 'bg-muted-foreground/50'
											)}
										></span>
									</span>
									{d.is_available ? m.donors_active() : m.donors_inactive()}
								</span>
							</div>
							<h3 class="mb-2.5 text-lg font-extrabold text-foreground">{d.full_name || m.donors_donor()}</h3>
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
					<div class="flex items-center justify-center gap-4">
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
