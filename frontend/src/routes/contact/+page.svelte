<script>
	import * as m from '$lib/paraglide/messages.js';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<svelte:head>
	<title>{m.contact_title()} - Donor.az</title>
</svelte:head>

<Navbar />

<main class="mx-auto max-w-2xl px-6 py-16">
	<div class="mb-12 text-center">
		<h1 class="text-3xl font-semibold text-foreground">{m.contact_title()}</h1>
	</div>

	<div class="rounded-xl border border-border bg-card p-8">
		<p class="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">{m.contact_email_title()}</p>
		<a
			href="mailto:{m.contact_email()}"
			class="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
		>
			{m.contact_email()}
		</a>
	</div>
</main>
