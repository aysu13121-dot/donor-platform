<script>
	import { onMount } from 'svelte';
	import Activity from '@lucide/svelte/icons/activity';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Droplet from '@lucide/svelte/icons/droplet';
	import Search from '@lucide/svelte/icons/search';
	import Users from '@lucide/svelte/icons/users';
	import { page } from '$app/state';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import BrandLogo from '$lib/components/BrandLogo.svelte';
	import CountUp from '$lib/components/CountUp.svelte';
	import DonorMap from '$lib/components/DonorMap.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import UrgentBoard from '$lib/components/UrgentBoard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { bloodCompatibility } from '$lib/constants';
	import { cn } from '$lib/utils';

	let { data } = $props();

	let isAuthenticated = $derived(Boolean(page.data.user));
	let selectedType = $state('A+');
	let top = $derived(data.urgent?.[0] ?? null);

	const T = {
		az: {
			eyebrow: 'AZƏRBAYCAN · QAN DONORU PLATFORMASI',
			find: 'Donor tap',
			see: 'Sorğuya bax',
			all: 'Bütün sorğular',
			min: (n) => `${n} dəq əvvəl`,
			hour: (n) => `${n} saat əvvəl`,
			day: (n) => `${n} gün əvvəl`,
			mapTitle: 'Donor xəritəsi',
			mapSub: 'Hər şəhərdə hazır donorlar. Qırmızı nəbz: təcili sorğu var. Şəhərə bas, donorları gör.',
			donors: 'hazır donor',
			urgent: 'təcili sorğu'
		},
		en: {
			eyebrow: 'AZERBAIJAN · BLOOD DONOR PLATFORM',
			find: 'Find a donor',
			see: 'See request',
			all: 'All requests',
			min: (n) => `${n} min ago`,
			hour: (n) => `${n}h ago`,
			day: (n) => `${n}d ago`,
			mapTitle: 'Donor map',
			mapSub: 'Available donors in each city. Red pulse: an urgent request. Tap a city to see its donors.',
			donors: 'available donors',
			urgent: 'urgent requests'
		}
	};
	const t = T[getLocale()] ?? T.az;

	// Zaman yalnız brauzerdə hesablanır ki, server və brauzer mətni üst-üstə düşsün.
	let now = $state(null);
	onMount(() => {
		now = Date.now();
	});

	function ago(iso) {
		if (!now || !iso) return '';
		const min = Math.max(1, Math.floor((now - new Date(iso).getTime()) / 60000));
		if (min < 60) return t.min(min);
		const hours = Math.floor(min / 60);
		if (hours < 24) return t.hour(hours);
		return t.day(Math.floor(hours / 24));
	}

	const STATS_DISPLAY = [
		{ key: 'total_donors', icon: Users, label: m.stats_totalDonors },
		{ key: 'active_donors', icon: CheckCircle2, label: m.stats_activeDonors },
		{ key: 'active_requests', icon: Activity, label: m.stats_activeRequests },
		{ key: 'fulfilled_requests', icon: Droplet, label: m.stats_fulfilledRequests }
	];

	const HOW_STEPS = [
		{ num: m.how_step1_num, title: m.how_step1_title, desc: m.how_step1_desc },
		{ num: m.how_step2_num, title: m.how_step2_title, desc: m.how_step2_desc },
		{ num: m.how_step3_num, title: m.how_step3_title, desc: m.how_step3_desc }
	];

	const bloodTypes = bloodCompatibility();
	let selected = $derived(bloodTypes.find((bt) => bt.type === selectedType) ?? bloodTypes[0]);
</script>

<div>
	<Navbar />

	<!-- HERO -->
	<section class="hero-red relative overflow-hidden text-white">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -right-6 -top-10 select-none text-[22rem] font-extrabold leading-none tracking-tighter text-white/[0.07] max-md:hidden"
		>
			A+
		</div>
		<svg
			aria-hidden="true"
			viewBox="0 0 1280 80"
			preserveAspectRatio="none"
			class="pointer-events-none absolute inset-x-0 bottom-8 h-20 w-full"
		>
			<path
				class="heartbeat-path"
				d="M0 40 H520 L550 40 L575 8 L610 72 L640 24 L665 40 H1280"
				fill="none"
				stroke="rgba(255,255,255,0.45)"
				stroke-width="2.5"
				stroke-linejoin="round"
			/>
		</svg>

		<div class="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:min-h-[calc(100svh-68px)] md:grid-cols-[1.1fr_1fr] md:py-20">
			<div>
				<p class="rise mb-5 text-xs font-bold tracking-[0.14em] text-white/85">{t.eyebrow}</p>
				<h1 class="rise-2 mb-6 text-5xl font-extrabold leading-[1.02] md:text-7xl">
					{m.hero_h1()} <span class="text-white/75">{m.hero_h1em()}</span>
				</h1>
				<p class="rise-3 mb-9 max-w-md text-lg leading-relaxed text-white/90">{m.hero_sub()}</p>
				<div class="rise-4 flex flex-wrap gap-3">
					{#if !isAuthenticated}
						<Button href="/signup" variant="light" size="lg">{m.hero_cta1()}</Button>
					{/if}
					<Button href="/find" variant="outlineLight" size="lg">
						<Search aria-hidden="true" />
						{t.find}
					</Button>
				</div>
				<a href="/#blood-types" class="rise-4 mt-5 inline-block text-sm font-semibold text-white/85 underline underline-offset-4 hover:text-white">{m.hero_cta2()}</a>
			</div>

			<div class="rise-3 w-full max-w-md justify-self-center rounded-3xl bg-card p-6 text-card-foreground shadow-pop md:justify-self-end">
				{#if top}
					<div class="flex items-center justify-between">
						<span class="flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-accent-foreground">
							<span class="relative flex size-2">
								<span class="ping-ring absolute inline-flex size-full rounded-full bg-primary opacity-60"></span>
								<span class="relative inline-flex size-2 rounded-full bg-primary"></span>
							</span>
							{m.requests_urgent()}
						</span>
						<span class="text-xs font-medium text-muted-foreground">{ago(top.created_at)}</span>
					</div>
					<div class="my-5 flex items-center gap-4">
						<div class="relative h-20 w-16 shrink-0">
							<svg viewBox="0 0 64 80" class="beat h-20 w-16 text-primary" aria-hidden="true">
								<path d="M32 4C32 4 6 34 6 52a26 26 0 0 0 52 0C58 34 32 4 32 4Z" fill="currentColor" />
							</svg>
							<span class="absolute inset-x-0 top-9 text-center text-xl font-extrabold text-white">{top.blood_type}</span>
						</div>
						<div class="min-w-0">
							<p class="truncate text-lg font-extrabold">{top.hospital}</p>
							<p class="text-sm text-muted-foreground">{top.city} · {top.units_needed} {m.requests_units()}</p>
						</div>
					</div>
					<Button href="/requests" class="w-full">{t.see}</Button>
				{:else}
					<p class="text-sm font-semibold text-muted-foreground">{m.requests_empty()}</p>
					<Button href="/requests" variant="outline" class="mt-4 w-full">{t.all}</Button>
				{/if}
			</div>
		</div>
	</section>

	<!-- URGENT BOARD (the rest of the urgent requests) -->
	<UrgentBoard requests={data.urgent?.slice(1) ?? []} />

	<!-- STATS -->
	{#if data.stats}
		<section class="border-b border-border bg-secondary/50 py-14">
			<div class="mx-auto max-w-6xl px-6">
				<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{#each STATS_DISPLAY as stat (stat.key)}
						{@const Icon = stat.icon}
						<div class="rounded-2xl border border-border bg-card p-6 shadow-card">
							<div class="mb-4 flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
								<Icon class="size-5" aria-hidden="true" />
							</div>
							<div class="text-4xl font-extrabold tracking-tight text-foreground">
								<CountUp value={data.stats[stat.key]} />
							</div>
							<div class="mt-1 text-sm font-semibold text-muted-foreground">{stat.label()}</div>
						</div>
					{/each}
				</div>
				{#if typeof data.stats.total_cities === 'number'}
					<p class="mt-4 text-center text-xs text-muted-foreground">
						{m.stats_acrossCities({ n: data.stats.total_cities })}
					</p>
				{/if}
			</div>
		</section>
	{/if}

	<!-- DONOR MAP -->
	{#if data.cityMap}
		<section class="border-b border-border bg-background py-20">
			<div class="mx-auto max-w-6xl px-6">
				<div class="mb-10 text-center">
					<h2 class="text-3xl font-extrabold text-foreground md:text-4xl">{t.mapTitle}</h2>
					<p class="mx-auto mt-3 max-w-xl text-muted-foreground">{t.mapSub}</p>
				</div>
				<div class="grid gap-6 lg:grid-cols-[1fr_17rem]">
					<DonorMap cities={data.cityMap} donorsLabel={t.donors} urgentLabel={t.urgent} />
					<ul class="grid grid-cols-2 gap-2 lg:grid-cols-1">
						{#each [...data.cityMap].sort((a, b) => b.donors - a.donors) as c (c.city)}
							<li>
								<a
									href="/donors?city={encodeURIComponent(c.city)}"
									class="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-primary"
								>
									<span class="flex items-center gap-2">
										{#if c.urgent > 0}
											<span class="relative flex size-2">
												<span class="ping-ring absolute inline-flex size-full rounded-full bg-primary opacity-60"></span>
												<span class="relative inline-flex size-2 rounded-full bg-primary"></span>
											</span>
										{/if}
										{c.city}
									</span>
									<span class="rounded-full bg-accent px-2 py-0.5 text-xs font-extrabold text-accent-foreground">{c.donors}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>
	{/if}

	<!-- HOW IT WORKS -->
	<section class="border-b border-border bg-background py-20">
		<div class="mx-auto max-w-6xl px-6">
			<div class="mb-12 text-center">
				<h2 class="text-3xl font-extrabold text-foreground md:text-4xl">{m.how_title()}</h2>
			</div>
			<div class="grid gap-5 md:grid-cols-3">
				{#each HOW_STEPS as step (step.num())}
					<div class="rounded-2xl border border-border bg-card p-8 shadow-card">
						<div class="mb-5 flex size-11 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
							{step.num()}
						</div>
						<h3 class="mb-2 text-lg font-extrabold text-foreground">{step.title()}</h3>
						<p class="text-sm leading-relaxed text-muted-foreground">{step.desc()}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- BLOOD TYPE SELECTOR -->
	<section class="bg-secondary/50 py-20" id="blood-types">
		<div class="mx-auto max-w-4xl px-6 text-center">
			<h2 class="mb-9 text-3xl font-extrabold text-foreground md:text-4xl">{m.blood_title()}</h2>

			<p class="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{m.blood_selectPrompt()}</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each bloodTypes as bt (bt.type)}
					<button
						type="button"
						aria-pressed={selectedType === bt.type}
						onclick={() => (selectedType = bt.type)}
						class={cn(
							'flex h-11 min-w-12 items-center justify-center rounded-full px-4 text-sm font-bold transition-all',
							selectedType === bt.type
								? 'scale-105 bg-primary text-primary-foreground shadow-card'
								: 'border-2 border-border bg-card text-foreground hover:border-primary hover:text-primary'
						)}
					>
						{bt.type}
					</button>
				{/each}
			</div>

			<div class="mt-10 grid items-center gap-8 rounded-3xl border border-border bg-card p-8 shadow-card md:grid-cols-[1fr_auto_1fr]">
				<div class="md:text-right">
					<p class="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{m.blood_receives()}</p>
					<div class="flex flex-wrap justify-center gap-2 md:justify-end">
						{#each selected.receives as r (r)}
							<span class="rounded-full border border-border bg-background px-3.5 py-1.5 text-base font-bold text-foreground">{r}</span>
						{/each}
					</div>
				</div>

				<div class="relative mx-auto h-28 w-24">
					<svg viewBox="0 0 64 80" class="beat h-28 w-24 text-primary" aria-hidden="true">
						<path d="M32 4C32 4 6 34 6 52a26 26 0 0 0 52 0C58 34 32 4 32 4Z" fill="currentColor" />
					</svg>
					<span class="absolute inset-x-0 top-12 text-center text-3xl font-extrabold text-white">{selected.type}</span>
				</div>

				<div class="md:text-left">
					<p class="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{m.blood_gives()}</p>
					<div class="flex flex-wrap justify-center gap-2 md:justify-start">
						{#each selected.gives as g (g)}
							<span class="rounded-full border border-border bg-background px-3.5 py-1.5 text-base font-bold text-foreground">{g}</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA BANNER -->
	{#if !isAuthenticated}
		<section class="hero-red py-16 text-white">
			<div class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
				<div>
					<h2 class="mb-1.5 text-2xl font-extrabold">{m.cta_title()}</h2>
					<p class="text-sm text-white/85">{m.cta_sub()}</p>
				</div>
				<Button href="/signup" variant="light" size="lg" class="shrink-0">
					{m.cta_btn()}
					<ArrowRight aria-hidden="true" />
				</Button>
			</div>
		</section>
	{/if}

	<!-- FOOTER -->
	<footer class="border-t border-border bg-secondary/40 py-12">
		<div class="mx-auto max-w-6xl px-6">
			<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
				<!-- Brand -->
				<div class="col-span-2 md:col-span-1">
					<BrandLogo class="mb-3" />
					<p class="text-xs leading-relaxed text-muted-foreground">{m.footer_tagline()}</p>
				</div>

				<!-- Platform links -->
				<div>
					<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">{m.footer_links()}</p>
					<ul class="space-y-2">
						<li><a href="/donors" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.nav_donors()}</a></li>
						<li><a href="/requests" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.nav_requests()}</a></li>
						<li><a href="/about" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_about()}</a></li>
						<li><a href="/faq" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_faq()}</a></li>
					</ul>
				</div>

				<!-- Resources -->
				<div>
					<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">{m.footer_resources()}</p>
					<ul class="space-y-2">
						<li><a href="/locations" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_locations()}</a></li>
						<li><a href="/eligibility" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_eligibility()}</a></li>
						<li><a href="/contact" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_contact()}</a></li>
					</ul>
				</div>

				<!-- Legal -->
				<div>
					<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">{m.footer_legal_heading()}</p>
					<ul class="space-y-2">
						<li><a href="/terms" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_terms()}</a></li>
						<li><a href="/privacy" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_privacy()}</a></li>
					</ul>
				</div>
			</div>

			<div class="mt-10 border-t border-border pt-6 text-center">
				<p class="text-[11px] text-muted-foreground">{m.footer_legal()}</p>
				<p class="mt-1 text-[11px] text-muted-foreground">{m.footer({ year: new Date().getFullYear() })}</p>
			</div>
		</div>
	</footer>
</div>
