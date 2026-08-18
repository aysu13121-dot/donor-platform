<script>
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Search from '@lucide/svelte/icons/search';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import Navbar from '$lib/components/Navbar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { bloodCompatibility } from '$lib/constants';
	import { cn } from '$lib/utils';

	let { data } = $props();

	let isAuthenticated = $derived(Boolean(page.data.user));
	let selectedType = $state('A+');

	const STATS_DISPLAY = [
		{ key: 'total_donors',       label: m.stats_totalDonors },
		{ key: 'active_donors',      label: m.stats_activeDonors },
		{ key: 'active_requests',    label: m.stats_activeRequests },
		{ key: 'fulfilled_requests', label: m.stats_fulfilledRequests },
	];

	const HOW_STEPS = [
		{ num: m.how_step1_num, title: m.how_step1_title, desc: m.how_step1_desc },
		{ num: m.how_step2_num, title: m.how_step2_title, desc: m.how_step2_desc },
		{ num: m.how_step3_num, title: m.how_step3_title, desc: m.how_step3_desc },
	];

	const ALL_BLOOD_TYPES = ['A+', 'A−', 'B+', 'B−', 'O+', 'O−', 'AB+', 'AB−'];

	const bloodTypes = bloodCompatibility();
	let selected = $derived(bloodTypes.find((bt) => bt.type === selectedType) ?? bloodTypes[0]);
</script>

<div>
	<Navbar />

	<!-- HERO — split layout -->
	<section class="border-b border-border bg-background">
		<div class="mx-auto max-w-6xl px-6">
			<div class="grid min-h-[calc(100svh-116px)] grid-cols-1 items-center gap-12 py-20 md:grid-cols-2 md:py-0">

				<!-- Left: text -->
				<div>
					<div class="mb-4 flex items-center gap-3">
						<div class="h-px w-8 bg-primary"></div>
						<span class="text-xs font-semibold uppercase tracking-widest text-primary">
							Azərbaycan · Blood Donor Platform
						</span>
					</div>
					<h1 class="mb-5 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-[3.5rem]">
						{m.hero_h1()}<br /><span class="text-primary">{m.hero_h1em()}</span>
					</h1>
					<p class="mb-9 max-w-md text-base leading-relaxed text-muted-foreground">
						{m.hero_sub()}
					</p>
					<div class="flex flex-wrap gap-3">
						{#if !isAuthenticated}
							<Button href="/signup" size="lg">{m.hero_cta1()}</Button>
						{/if}
						<Button href="/#blood-types" variant="outline" size="lg">
							<Search aria-hidden="true" />
							{m.hero_cta2()}
						</Button>
					</div>
				</div>

				<!-- Right: blood type grid decoration -->
				<div class="hidden justify-end md:flex">
					<div class="grid grid-cols-4 gap-3">
						{#each ALL_BLOOD_TYPES as bt}
							<div class={cn(
								'flex size-[72px] items-center justify-center rounded-xl border text-sm font-bold transition-colors',
								bt.replace('−', '-') === selectedType
									? 'border-primary bg-primary text-primary-foreground shadow-sm'
									: 'border-border bg-card text-foreground'
							)}>
								{bt}
							</div>
						{/each}
					</div>
				</div>

			</div>
		</div>
	</section>

	<!-- STATS — dark authority bar -->
	{#if data.stats}
		<section class="border-b border-border bg-[#0d1b2a] py-0">
			<div class="mx-auto max-w-6xl px-6">
				<div class="grid grid-cols-2 divide-x divide-white/10 lg:grid-cols-4">
					{#each STATS_DISPLAY as stat (stat.key)}
						<div class="px-8 py-10 text-center">
							<div class="text-3xl font-bold text-white md:text-4xl">
								{data.stats[stat.key]}
							</div>
							<div class="mt-2 text-[11px] font-medium uppercase tracking-wider text-white/45">
								{stat.label()}
							</div>
						</div>
					{/each}
				</div>
				{#if typeof data.stats.total_cities === 'number'}
					<p class="pb-3 text-center text-[11px] text-white/30">
						{m.stats_acrossCities({ n: data.stats.total_cities })}
					</p>
				{/if}
			</div>
		</section>
	{/if}

	<!-- HOW IT WORKS -->
	<section class="border-b border-border bg-background py-20">
		<div class="mx-auto max-w-6xl px-6">
			<div class="mb-14 text-center">
				<div class="mx-auto mb-4 h-0.5 w-8 bg-primary"></div>
				<h2 class="mb-2 text-2xl font-bold text-foreground md:text-3xl">{m.how_title()}</h2>
				<p class="text-sm text-muted-foreground">{m.how_sub()}</p>
			</div>
			<div class="grid gap-px bg-border md:grid-cols-3">
				{#each HOW_STEPS as step, i}
					<div class="relative bg-background p-10">
						<div class="mb-6 text-5xl font-black text-primary/10 leading-none">
							{step.num()}
						</div>
						<div class="mb-3 h-px w-8 bg-primary"></div>
						<h3 class="mb-3 text-base font-bold text-foreground">{step.title()}</h3>
						<p class="text-sm leading-relaxed text-muted-foreground">{step.desc()}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- BLOOD TYPE SELECTOR -->
	<section class="border-b border-border bg-secondary/30 py-20" id="blood-types">
		<div class="mx-auto max-w-2xl px-6 text-center">
			<div class="mx-auto mb-4 h-0.5 w-8 bg-primary"></div>
			<h2 class="mb-10 text-2xl font-bold text-foreground md:text-3xl">{m.blood_title()}</h2>

			<p class="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
				{m.blood_selectPrompt()}
			</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each bloodTypes as bt (bt.type)}
					<button
						type="button"
						onclick={() => (selectedType = bt.type)}
						class={cn(
							'flex h-10 min-w-[3rem] items-center justify-center rounded-none border px-3 text-sm font-bold transition-colors',
							selectedType === bt.type
								? 'border-primary bg-primary text-primary-foreground'
								: 'border-border bg-background text-foreground hover:border-primary hover:text-primary'
						)}
					>
						{bt.type}
					</button>
				{/each}
			</div>

			<div class="mt-8 border border-border bg-background">
				<div class="grid grid-cols-2 divide-x divide-border">
					<div class="p-8">
						<p class="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
							{m.blood_gives()}
						</p>
						<div class="flex flex-wrap justify-center gap-2">
							{#each selected.gives as g (g)}
								<span class="border border-border px-3 py-1.5 text-sm font-bold text-foreground">{g}</span>
							{/each}
						</div>
					</div>
					<div class="p-8">
						<p class="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
							{m.blood_receives()}
						</p>
						<div class="flex flex-wrap justify-center gap-2">
							{#each selected.receives as r (r)}
								<span class="border border-border px-3 py-1.5 text-sm font-bold text-foreground">{r}</span>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA BANNER — full red section -->
	{#if !isAuthenticated}
		<section class="bg-primary py-20">
			<div class="mx-auto max-w-6xl px-6">
				<div class="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
					<div>
						<p class="mb-1 text-xs font-semibold uppercase tracking-widest text-white/60">
							Donor.az
						</p>
						<h2 class="mb-2 text-2xl font-bold text-white">{m.cta_title()}</h2>
						<p class="text-sm text-white/70">{m.cta_sub()}</p>
					</div>
					<a
						href="/signup"
						class="shrink-0 rounded-none border-2 border-white bg-white px-8 py-3 text-sm font-bold text-primary transition-colors hover:bg-transparent hover:text-white"
					>
						{m.cta_btn()} →
					</a>
				</div>
			</div>
		</section>
	{/if}

	<!-- FOOTER -->
	<footer class="border-t border-border bg-secondary/40 py-12">
		<div class="mx-auto max-w-6xl px-6">
			<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
				<div class="col-span-2 md:col-span-1">
					<div class="mb-3 text-lg font-bold text-foreground">
						<span class="text-primary">Donor</span>.az
					</div>
					<p class="text-xs leading-relaxed text-muted-foreground">{m.footer_tagline()}</p>
				</div>
				<div>
					<p class="mb-3 text-[11px] font-bold uppercase tracking-widest text-foreground">{m.footer_links()}</p>
					<ul class="space-y-2">
						<li><a href="/donors" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.nav_donors()}</a></li>
						<li><a href="/requests" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.nav_requests()}</a></li>
						<li><a href="/about" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_about()}</a></li>
						<li><a href="/faq" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_faq()}</a></li>
					</ul>
				</div>
				<div>
					<p class="mb-3 text-[11px] font-bold uppercase tracking-widest text-foreground">Resurslar</p>
					<ul class="space-y-2">
						<li><a href="/locations" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_locations()}</a></li>
						<li><a href="/eligibility" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_eligibility()}</a></li>
						<li><a href="/contact" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_contact()}</a></li>
					</ul>
				</div>
				<div>
					<p class="mb-3 text-[11px] font-bold uppercase tracking-widest text-foreground">Hüquqi</p>
					<ul class="space-y-2">
						<li><a href="/terms" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_terms()}</a></li>
						<li><a href="/privacy" class="text-sm text-muted-foreground transition-colors hover:text-primary">{m.footer_privacy()}</a></li>
					</ul>
				</div>
			</div>
			<div class="mt-10 border-t border-border pt-6 text-center">
				<p class="text-[11px] text-muted-foreground">{m.footer_legal()}</p>
				<p class="mt-1 text-[11px] text-muted-foreground">{m.footer()}</p>
			</div>
		</div>
	</footer>
</div>
