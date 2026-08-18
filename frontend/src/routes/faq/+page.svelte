<script>
	import * as m from '$lib/paraglide/messages.js';
	import Navbar from '$lib/components/Navbar.svelte';

	const FAQS = [
		{ q: m.faq_q1, a: m.faq_a1 },
		{ q: m.faq_q2, a: m.faq_a2 },
		{ q: m.faq_q3, a: m.faq_a3 },
		{ q: m.faq_q4, a: m.faq_a4 },
		{ q: m.faq_q5, a: m.faq_a5 },
		{ q: m.faq_q6, a: m.faq_a6 },
		{ q: m.faq_q7, a: m.faq_a7 },
		{ q: m.faq_q8, a: m.faq_a8 },
	];

	let openIndex = $state(null);

	function toggle(i) {
		openIndex = openIndex === i ? null : i;
	}
</script>

<svelte:head>
	<title>{m.faq_title()} — Donor.az</title>
</svelte:head>

<Navbar />

<main class="mx-auto max-w-3xl px-6 py-16">

	<div class="mb-12 text-center">
		<h1 class="mb-3 text-3xl font-semibold text-foreground">{m.faq_title()}</h1>
		<p class="text-sm text-muted-foreground">{m.faq_sub()}</p>
	</div>

	<div class="space-y-3">
		{#each FAQS as faq, i}
			<div class="rounded-xl border border-border bg-card overflow-hidden">
				<button
					type="button"
					class="flex w-full items-center justify-between px-6 py-5 text-left"
					onclick={() => toggle(i)}
				>
					<span class="text-sm font-medium text-foreground">{faq.q()}</span>
					<span class="ml-4 shrink-0 text-lg font-light text-muted-foreground">
						{openIndex === i ? '−' : '+'}
					</span>
				</button>
				{#if openIndex === i}
					<div class="border-t border-border px-6 py-5">
						<p class="text-sm leading-relaxed text-muted-foreground">{faq.a()}</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>

</main>
