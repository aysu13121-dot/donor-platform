<script>
	import * as m from '$lib/paraglide/messages.js';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<svelte:head>
	<title>{m.about_title()} - Donor.az</title>
</svelte:head>

<Navbar />

<main class="mx-auto max-w-3xl px-6 py-16">

	<!-- Header -->
	<div class="mb-12 text-center">
		<h1 class="text-3xl font-semibold text-foreground">{m.about_title()}</h1>
	</div>

	<!-- Hekayəmiz -->
	<section class="mb-10 rounded-xl border border-border bg-card p-8">
		<h2 class="mb-4 text-lg font-semibold text-foreground">{m.about_story_title()}</h2>
		<p class="text-sm leading-relaxed text-muted-foreground">{m.about_story_text()}</p>
	</section>

	<!-- Missiyamız -->
	<section class="mb-10 rounded-xl border border-border bg-card p-8">
		<h2 class="mb-4 text-lg font-semibold text-foreground">{m.about_mission_title()}</h2>
		<p class="text-sm leading-relaxed text-muted-foreground">{m.about_mission_text()}</p>
	</section>

	<!-- Dəyərlərimiz -->
	<section class="rounded-xl border border-border bg-card p-8">
		<h2 class="mb-4 text-lg font-semibold text-foreground">{m.about_stats_title()}</h2>
		<p class="text-sm leading-relaxed text-muted-foreground">{m.about_values_text()}</p>
	</section>

</main>
