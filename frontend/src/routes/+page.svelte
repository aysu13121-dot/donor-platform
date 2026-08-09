<script>
	import Activity from '@lucide/svelte/icons/activity';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Droplet from '@lucide/svelte/icons/droplet';
	import Search from '@lucide/svelte/icons/search';
	import Users from '@lucide/svelte/icons/users';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
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

	const bloodTypes = bloodCompatibility();
	let selected = $derived(bloodTypes.find((bt) => bt.type === selectedType) ?? bloodTypes[0]);
</script>

<div>
	<Navbar />

	<!-- HERO - masaüstü/tablet-də navbar-dan aşağı bütün ekranı tutur; telefonda
	     bu tam-ekran hündürlük məzmunu çox aşağı itələyib pis görünürdü, ona görə
	     mobil-də sadə padding-lə auto-hündürlük saxlanılır. -->
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
		<section class="border-b border-border bg-background py-14">
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

	<!-- BLOOD TYPE SELECTOR -->
	<section class="bg-background py-20" id="blood-types">
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

			<div class="mt-10 rounded-lg border border-border p-8">
				<div class="grid grid-cols-1 gap-8 text-center sm:grid-cols-2">
					<div>
						<p class="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{m.blood_gives()}</p>
						<div class="flex flex-wrap justify-center gap-2">
							{#each selected.gives as g (g)}
								<span class="rounded-md border border-border bg-card px-3 py-1.5 text-base font-semibold text-foreground">{g}</span>
							{/each}
						</div>
					</div>
					<div>
						<p class="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{m.blood_receives()}</p>
						<div class="flex flex-wrap justify-center gap-2">
							{#each selected.receives as r (r)}
								<span class="rounded-md border border-border bg-card px-3 py-1.5 text-base font-semibold text-foreground">{r}</span>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA BANNER - yalnız qonaqlara göstərilir. -->
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
	<footer class="border-t border-border py-8">
		<div class="mx-auto max-w-6xl px-6 text-center">
			<p class="text-[13px] text-muted-foreground">{m.footer()}</p>
		</div>
	</footer>
</div>
