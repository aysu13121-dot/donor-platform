<script>
	import Navbar from '$lib/components/Navbar.svelte';

	// Hüquqi səhifələr (şərtlər, məxfilik) üçün ortaq görünüş.
	let { title, sections = [], updated = '' } = $props();
</script>

<svelte:head>
	<title>{title} - Donor.az</title>
</svelte:head>

<Navbar />

<main class="mx-auto max-w-3xl px-6 py-16">
	<h1 class="mb-10 text-3xl font-extrabold text-foreground md:text-4xl">{title}</h1>

	<div class="space-y-4">
		{#each sections as section, i (i)}
			<section class="rounded-2xl border border-border bg-card p-6 shadow-card">
				<h2 class="mb-2 flex items-center gap-3 text-base font-extrabold text-foreground">
					<span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">{i + 1}</span>
					{section.h}
				</h2>
				<p class="text-sm leading-relaxed text-muted-foreground">{section.p}</p>
			</section>
		{/each}
	</div>

	<p class="mt-10 text-xs text-muted-foreground">{updated}</p>
</main>
