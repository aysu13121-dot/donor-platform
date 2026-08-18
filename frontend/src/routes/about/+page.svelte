<script>
	import * as m from '$lib/paraglide/messages.js';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<svelte:head>
	<title>{m.about_title()} — Donor.az</title>
</svelte:head>

<Navbar />

<main class="mx-auto max-w-3xl px-6 py-16">

	<!-- Header -->
	<div class="mb-12 text-center">
		<h1 class="mb-3 text-3xl font-semibold text-foreground">{m.about_title()}</h1>
		<p class="text-sm text-muted-foreground">{m.about_sub()}</p>
	</div>

	<!-- Mission -->
	<section class="mb-10 rounded-xl border border-border bg-card p-8">
		<h2 class="mb-4 text-lg font-semibold text-foreground">{m.about_mission_title()}</h2>
		<p class="text-sm leading-relaxed text-muted-foreground">{m.about_mission_text()}</p>
	</section>

	<!-- What we do -->
	<section class="mb-10 rounded-xl border border-border bg-card p-8">
		<h2 class="mb-5 text-lg font-semibold text-foreground">{m.about_what_title()}</h2>
		<ul class="space-y-3">
			{#each [m.about_what_1(), m.about_what_2(), m.about_what_3(), m.about_what_4()] as item}
				<li class="flex items-start gap-3 text-sm text-muted-foreground">
					<span class="mt-0.5 size-2 shrink-0 rounded-full bg-primary"></span>
					{item}
				</li>
			{/each}
		</ul>
	</section>

	<!-- Stats -->
	<section class="mb-10">
		<h2 class="mb-5 text-lg font-semibold text-foreground">{m.about_stats_title()}</h2>
		<div class="grid gap-4 sm:grid-cols-3">
			{#each [
				{ title: m.about_free(), desc: m.about_free_desc() },
				{ title: m.about_fast(), desc: m.about_fast_desc() },
				{ title: m.about_safe(), desc: m.about_safe_desc() },
			] as card}
				<div class="rounded-xl border border-border bg-card p-6 text-center">
					<p class="mb-2 font-semibold text-primary">{card.title}</p>
					<p class="text-xs leading-relaxed text-muted-foreground">{card.desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Disclaimer -->
	<div class="rounded-lg border border-border bg-secondary/40 px-6 py-4">
		<p class="text-xs leading-relaxed text-muted-foreground">{m.about_disclaimer()}</p>
	</div>

</main>
