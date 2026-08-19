<script>
	import Send from '@lucide/svelte/icons/send';
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

	<div class="space-y-4">

		<div class="rounded-xl border border-border bg-card p-8">
			<p class="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">{m.contact_email_title()}</p>
			<a href="mailto:{m.contact_email()}" class="text-base font-medium text-muted-foreground transition-colors hover:text-primary">
				{m.contact_email()}
			</a>
		</div>

		<div class="rounded-xl border border-border bg-card p-8">
			<p class="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">{m.contact_social_title()}</p>
			<div class="flex gap-4">
				<a
					href="https://instagram.com"
					target="_blank"
					rel="noopener"
					class="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 shrink-0" aria-hidden="true">
						<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
						<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
						<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
					</svg>
					Instagram
				</a>
				<a
					href="https://facebook.com"
					target="_blank"
					rel="noopener"
					class="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 shrink-0" aria-hidden="true">
						<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
					</svg>
					Facebook
				</a>
				<a
					href="https://t.me"
					target="_blank"
					rel="noopener"
					class="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
				>
					<Send class="size-4 shrink-0" aria-hidden="true" />
					Telegram
				</a>
			</div>
		</div>

	</div>

</main>
