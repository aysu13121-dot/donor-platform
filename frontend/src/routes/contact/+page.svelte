<script>
	import * as m from '$lib/paraglide/messages.js';
	import Navbar from '$lib/components/Navbar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
</script>

<svelte:head>
	<title>{m.contact_title()} — Donor.az</title>
</svelte:head>

<Navbar />

<main class="mx-auto max-w-2xl px-6 py-16">

	<div class="mb-12 text-center">
		<h1 class="mb-3 text-3xl font-semibold text-foreground">{m.contact_title()}</h1>
		<p class="text-sm text-muted-foreground">{m.contact_sub()}</p>
	</div>

	<div class="space-y-4">

		<div class="rounded-xl border border-border bg-card p-8">
			<p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{m.contact_email_title()}</p>
			<a href="mailto:{m.contact_email()}" class="text-base font-medium text-primary hover:underline">
				{m.contact_email()}
			</a>
		</div>

		<div class="rounded-xl border border-border bg-card p-8">
			<p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{m.contact_social_title()}</p>
			<div class="flex gap-4">
				<a href="https://instagram.com" target="_blank" rel="noopener" class="text-sm text-muted-foreground transition-colors hover:text-primary">Instagram</a>
				<a href="https://facebook.com" target="_blank" rel="noopener" class="text-sm text-muted-foreground transition-colors hover:text-primary">Facebook</a>
				<a href="https://t.me" target="_blank" rel="noopener" class="text-sm text-muted-foreground transition-colors hover:text-primary">Telegram</a>
			</div>
		</div>

		<div class="rounded-xl border border-border bg-secondary/40 p-8">
			<p class="mb-3 text-sm leading-relaxed text-muted-foreground">{m.contact_note()}</p>
			<p class="mb-5 text-sm leading-relaxed text-muted-foreground">{m.contact_emergency()}</p>
			<Button href="/requests">{m.contact_create_request()}</Button>
		</div>

	</div>

</main>
