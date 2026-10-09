<script>
	import { onMount } from 'svelte';
	import { getLocale } from '$lib/paraglide/runtime';

	let { requests = [] } = $props();

	const T = {
		az: {
			title: 'Təcili ehtiyaclar',
			sub: 'İndi qan axtaran xəstələr',
			all: 'Bütün sorğular',
			units: 'vahid',
			min: (n) => `${n} dəq əvvəl`,
			hour: (n) => `${n} saat əvvəl`,
			day: (n) => `${n} gün əvvəl`
		},
		en: {
			title: 'Urgent needs',
			sub: 'Patients looking for blood right now',
			all: 'All requests',
			units: 'units',
			min: (n) => `${n} min ago`,
			hour: (n) => `${n}h ago`,
			day: (n) => `${n}d ago`
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
</script>

{#if requests.length > 0}
	<section class="border-b border-border bg-background py-12">
		<div class="mx-auto max-w-6xl px-6">
			<div class="mb-6 flex items-end justify-between gap-4">
				<div>
					<div class="flex items-center gap-2">
						<span class="relative flex size-2.5">
							<span class="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60"></span>
							<span class="relative inline-flex size-2.5 rounded-full bg-primary"></span>
						</span>
						<h2 class="text-xl font-semibold text-foreground">{t.title}</h2>
					</div>
					<p class="mt-1 text-sm text-muted-foreground">{t.sub}</p>
				</div>
				<a href="/requests" class="text-sm font-medium text-primary hover:underline">{t.all} →</a>
			</div>

			<div class="grid gap-4 sm:grid-cols-3">
				{#each requests as req (req.id)}
					<a
						href="/requests"
						class="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
					>
						<div class="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
							{req.blood_type}
						</div>
						<div class="min-w-0">
							<p class="truncate text-sm font-semibold text-foreground">{req.hospital}</p>
							<p class="text-sm text-muted-foreground">{req.city} · {req.units_needed} {t.units}</p>
							<p class="mt-1 text-xs text-muted-foreground">{ago(req.created_at)}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}
