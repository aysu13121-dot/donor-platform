<script>
	import Activity from '@lucide/svelte/icons/activity';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Droplet from '@lucide/svelte/icons/droplet';
	import Search from '@lucide/svelte/icons/search';
	import Users from '@lucide/svelte/icons/users';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import BrandLogo from '$lib/components/BrandLogo.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Card } from '$lib/components/ui/card';
	import { bloodCompatibility } from '$lib/constants';
	import { cn } from '$lib/utils';

	let { data } = $props();

	let isAuthenticated = $derived(Boolean(page.data.user));
	let selectedType = $state('A+');

	const STATS_DISPLAY = [
		{ key: 'total_donors', icon: Users, label: m.stats_totalDonors },
		{ key: 'active_donors', icon: CheckCircle2, label: m.stats_activeDonors },
		{ key: 'active_requests', icon: Activity, label: m.stats_activeRequests },
		{ key: 'fulfilled_requests', icon: Droplet, label: m.stats_fulfilledRequests }
	];

	const HOW_STEPS = [
		{ num: m.how_step1_num, title: m.how_step1_title, desc: m.how_step1_desc },
		{ num: m.how_step2_num, title: m.how_step2_title, desc: m.how_step2_desc },
		{ num: m.how_step3_num, title: m.how_step3_title, desc: m.how_step3_desc },
	];

	const bloodTypes = bloodCompatibility();
	let selected = $derived(bloodTypes.find((bt) => bt.type === selectedType) ?? bloodTypes[0]);
</script>

<div>
	<Navbar />

	<!-- HERO -->
	<section class="flex items-center border-b border-border bg-background py-16 md:min-h-[calc(100svh-68px)] md:py-0">
		<div class="mx-auto w-full max-w-2xl px-6 text-center">
			<h1 class="mb-5 text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
				{m.hero_h1()} <span class="text-primary">{m.hero_h1em()}</span>
			</h1>
			<p class="mx-auto mb-9 max-w-xl text-base leading-relaxed text-muted-foreground">{m.hero_sub()}</p>
			<div class="flex flex-wrap items-center justify-center gap-3">
				{#if !isAuthenticated}
					<Button href="/signup" size="lg">{m.hero_cta1()}</Button>
				{/if}
				<Button href="/#blood-types" variant="outline" size="lg">
					<Search aria-hidden="true" />
					{m.hero_cta2()}
				</Button>
			</div>
		</div>
	</section>

	<!-- STATS -->
	{#if data.stats}
		<section class="border-b border-border bg-secondary/40 py-14">
			<div class="mx-auto max-w-6xl px-6">
				<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{#each STATS_DISPLAY as stat (stat.key)}
						<StatCard icon={stat.icon} label={stat.label()} value={String(data.stats[stat.key])} />
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

	<!-- HOW IT WORKS -->
	<section class="border-b border-border bg-background py-20">
		<div class="mx-auto max-w-6xl px-6">
			<div class="mb-12 text-center">
				<h2 class="text-2xl font-semibold text-foreground md:text-3xl">{m.how_title()}</h2>
			</div>
			<div class="grid gap-6 md:grid-cols-3">
				{#each HOW_STEPS as step}
					<div class="relative overflow-hidden rounded-xl border border-border bg-card p-8">
						<span class="pointer-events-none absolute bottom-3 right-3 select-none text-lg font-bold text-primary">
							{step.num()}
						</span>
						<h3 class="relative z-10 mb-2 text-base font-semibold text-foreground">{step.title()}</h3>
						<p class="relative z-10 text-sm leading-relaxed text-muted-foreground">{step.desc()}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- BLOOD TYPE SELECTOR -->
	<section class="bg-secondary/40 py-20" id="blood-types">
		<div class="mx-auto max-w-2xl px-6 text-center">
			<h2 class="mb-9 text-2xl font-semibold text-foreground md:text-3xl">{m.blood_title()}</h2>

			<p class="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{m.blood_selectPrompt()}</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each bloodTypes as bt (bt.type)}
					<button
						type="button"
						onclick={() => (selectedType = bt.type)}
						class={cn(
							'flex size-10 items-center justify-center rounded-md text-sm font-semibold transition-colors',
							selectedType === bt.type
								? 'bg-primary text-primary-foreground'
								: 'border border-border bg-card text-foreground hover:border-primary hover:text-primary'
						)}
					>
						{bt.type}
					</button>
				{/each}
			</div>

			<div class="mt-10 rounded-lg border border-border bg-card p-8">
				<div class="grid grid-cols-1 gap-8 text-center sm:grid-cols-2">
					<div>
						<p class="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{m.blood_gives()}</p>
						<div class="flex flex-wrap justify-center gap-2">
							{#each selected.gives as g (g)}
								<span class="rounded-md border border-border bg-background px-3 py-1.5 text-base font-semibold text-foreground">{g}</span>
							{/each}
						</div>
					</div>
					<div>
						<p class="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{m.blood_receives()}</p>
						<div class="flex flex-wrap justify-center gap-2">
							{#each selected.receives as r (r)}
								<span class="rounded-md border border-border bg-background px-3 py-1.5 text-base font-semibold text-foreground">{r}</span>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA BANNER -->
	{#if !isAuthenticated}
		<section class="border-t border-border bg-background py-16">
			<div class="mx-auto max-w-6xl px-6">
				<Card class="flex flex-col items-center gap-5 p-10 text-center sm:flex-row sm:justify-between sm:text-left">
					<div>
						<h2 class="mb-1.5 text-xl font-semibold text-foreground">{m.cta_title()}</h2>
						<p class="text-sm text-muted-foreground">{m.cta_sub()}</p>
					</div>
					<Button href="/signup" size="lg" class="shrink-0">
						{m.cta_btn()}
						<ArrowRight aria-hidden="true" />
					</Button>
				</Card>
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
