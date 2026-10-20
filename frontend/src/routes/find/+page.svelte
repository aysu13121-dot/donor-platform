<script>
	import MapPin from '@lucide/svelte/icons/map-pin';
	import SearchX from '@lucide/svelte/icons/search-x';
	import { goto } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import BloodTypePills from '$lib/components/BloodTypePills.svelte';
	import ContactActions from '$lib/components/ContactActions.svelte';
	import DropBadge from '$lib/components/DropBadge.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Card } from '$lib/components/ui/card';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import { CITIES } from '$lib/constants';
	import { cn } from '$lib/utils';

	let { data } = $props();

	let isAuthenticated = $derived(Boolean(page.data.user));

	const T = {
		az: {
			title: '30 saniyəyə donor tap',
			sub: 'İki addım: qan qrupu və şəhər. Qalanını biz hesablayırıq.',
			step1: '1. Hansı qan qrupu lazımdır?',
			step2: '2. Şəhər',
			hint: 'Əvvəlcə qan qrupunu seç.',
			pickCity: 'İndi şəhəri seç.',
			total: (n) => `Bütün ölkə üzrə ${n} uyğun hazır donor var.`,
			found: (n, city) => `${city}: ${n} uyğun hazır donor`,
			same: 'Eyni qrup',
			compat: 'Uyğun qrup',
			none: 'Bu şəhərdə uyğun hazır donor tapılmadı.',
			cant: 'Uyğun donor tapmadın?',
			post: 'Sorğu yarat',
			note: 'Uyğunluq qan qrupu cədvəlinə görə hesablanır. Son qərarı həkim verir.'
		},
		en: {
			title: 'Find a donor in 30 seconds',
			sub: 'Two steps: blood type and city. We work out the rest.',
			step1: '1. Which blood type is needed?',
			step2: '2. City',
			hint: 'Choose the blood type first.',
			pickCity: 'Now choose the city.',
			total: (n) => `${n} compatible available donors across the country.`,
			found: (n, city) => `${city}: ${n} compatible available donors`,
			same: 'Same type',
			compat: 'Compatible',
			none: 'No compatible available donors in this city.',
			cant: "Can't find a match?",
			post: 'Post a request',
			note: 'Matching follows the blood type table. A doctor makes the final decision.'
		}
	};
	const t = T[getLocale()] ?? T.az;

	function update(patch) {
		const params = new SvelteURLSearchParams(page.url.searchParams);
		for (const [key, value] of Object.entries(patch)) {
			if (!value) params.delete(key);
			else params.set(key, value);
		}
		goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
	}
</script>

<div class="min-h-screen bg-background">
	<Navbar />
	<main class="mx-auto max-w-4xl px-6 pb-16">
		<div class="py-10 text-center">
			<h1 class="text-3xl font-extrabold text-foreground md:text-5xl">{t.title}</h1>
			<p class="mt-3 text-muted-foreground">{t.sub}</p>
		</div>

		<Card class="mb-4 p-6">
			<p class="mb-3 text-sm font-extrabold text-foreground">{t.step1}</p>
			<BloodTypePills
				value={data.bloodType}
				showAll={false}
				onChange={(val) => update({ blood_type: val, city: data.city })}
			/>
		</Card>

		<Card class="mb-6 p-6">
			<p class="mb-3 text-sm font-extrabold text-foreground">{t.step2}</p>
			{#if !data.bloodType}
				<p class="text-sm text-muted-foreground">{t.hint}</p>
			{:else}
				<div class="flex flex-wrap gap-2">
					{#each CITIES as c (c)}
						{@const n = data.perCity[c] ?? 0}
						<button
							type="button"
							aria-pressed={data.city === c}
							onclick={() => update({ city: c, blood_type: data.bloodType })}
							class={cn(
								'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition-all',
								data.city === c
									? 'bg-primary text-primary-foreground shadow-card'
									: 'border-2 border-border bg-card text-foreground hover:border-primary hover:text-primary',
								n === 0 && data.city !== c && 'opacity-60'
							)}
						>
							{c}
							<span
								class={cn(
									'rounded-full px-2 py-0.5 text-[11px] font-extrabold',
									data.city === c ? 'bg-white/20' : 'bg-accent text-accent-foreground'
								)}>{n}</span
							>
						</button>
					{/each}
				</div>
			{/if}
		</Card>

		{#if data.error}
			<Card class="px-6 py-10 text-center"><p class="text-destructive">{data.error}</p></Card>
		{:else if !data.bloodType}
			<p class="text-center text-sm text-muted-foreground">{t.hint}</p>
		{:else if navigating.to}
			<div class="grid gap-4 sm:grid-cols-2">
				{#each [1, 2] as n (n)}
					<Card class="p-5">
						<Skeleton class="mb-4 h-[65px] w-[52px]" />
						<Skeleton class="mb-2 h-5 w-2/3" />
						<Skeleton class="h-9 w-full rounded-full" />
					</Card>
				{/each}
			</div>
		{:else if !data.city}
			<p class="text-center font-semibold text-foreground">{t.total(data.total)}</p>
			<p class="mt-1 text-center text-sm text-muted-foreground">{t.pickCity}</p>
		{:else if data.matches.length === 0}
			<Card class="flex flex-col items-center gap-4 px-6 py-12 text-center">
				<div class="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
					<SearchX class="size-6" aria-hidden="true" />
				</div>
				<p class="font-semibold text-muted-foreground">{t.none}</p>
				<Button href={isAuthenticated ? '/dashboard' : '/signup'}>{t.post}</Button>
			</Card>
		{:else}
			<p class="mb-4 flex items-center gap-2 text-lg font-extrabold text-foreground">
				<MapPin class="size-5 text-primary" aria-hidden="true" />
				{t.found(data.matches.length, data.city)}
			</p>
			<div class="mb-10 grid gap-4 sm:grid-cols-2">
				{#each data.matches as d (d.id)}
					<Card class="flex flex-col p-5">
						<div class="mb-4 flex items-start justify-between">
							<DropBadge type={d.blood_type || '?'} />
							<span
								class={cn(
									'rounded-full px-2.5 py-1 text-[11px] font-extrabold',
									d.blood_type === data.bloodType
										? 'bg-primary text-primary-foreground'
										: 'bg-accent text-accent-foreground'
								)}
							>
								{d.blood_type === data.bloodType ? t.same : t.compat}
							</span>
						</div>
						<h3 class="mb-1 text-lg font-extrabold text-foreground">{d.full_name || m.donors_donor()}</h3>
						<p class="mb-4 text-sm text-muted-foreground">{d.city}</p>
						<ContactActions phone={d.phone} callLabel={m.donors_call()} locked={!isAuthenticated} class="mt-auto" />
					</Card>
				{/each}
			</div>
		{/if}

		{#if data.bloodType}
			<Card class="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
				<div class="text-center sm:text-left">
					<p class="font-extrabold text-foreground">{t.cant}</p>
					<p class="text-xs text-muted-foreground">{t.note}</p>
				</div>
				<Button href={isAuthenticated ? '/dashboard' : '/signup'} class="shrink-0">{t.post}</Button>
			</Card>
		{/if}
	</main>
</div>
