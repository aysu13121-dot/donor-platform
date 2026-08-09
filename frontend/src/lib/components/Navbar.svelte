<script>
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import BrandLogo from '$lib/components/BrandLogo.svelte';
	import LanguageSwitch from '$lib/components/LanguageSwitch.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { cn } from '$lib/utils';

	const NAV_LINKS = [
		{ href: '/', key: 'home', label: m.nav_home },
		{ href: '/donors', key: 'donors', label: m.nav_donors },
		{ href: '/requests', key: 'requests', label: m.nav_requests }
	];

	let menuOpen = $state(false);

	// `data.user` root `+layout.server.js`-də SSR zamanı doldurulur - əvvəlki
	// React tətbiqindəki `ready` bayrağına ehtiyac yoxdur, ilk render-dən
	// düzgün auth vəziyyəti göstərilir.
	let isAuthenticated = $derived(Boolean(page.data.user));
	let isActive = (path) => page.url.pathname === path;
</script>

<nav class="sticky top-0 z-50 border-b border-border bg-background">
	<div class="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-6 lg:grid lg:grid-cols-3">
		<BrandLogo class="lg:justify-self-start" />

		<ul class="hidden items-center gap-9 lg:flex lg:justify-self-center">
			{#each NAV_LINKS as link (link.key)}
				<li>
					<a
						href={link.href}
						class={cn(
							'text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
							isActive(link.href) && 'text-primary'
						)}
					>
						{link.label()}
					</a>
				</li>
			{/each}
		</ul>

		<div class="hidden items-center gap-5 lg:flex lg:justify-self-end">
			<LanguageSwitch />
			{#if isAuthenticated}
				<Button href="/dashboard" size="sm">
					<LayoutDashboard aria-hidden="true" />
					{m.nav_dashboard()}
				</Button>
			{:else}
				<a href="/signin" class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
					{m.nav_login()}
				</a>
				<Button href="/signup" size="sm">{m.nav_register()}</Button>
			{/if}
		</div>

		<button
			type="button"
			class="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary lg:hidden"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label="Toggle menu"
		>
			{#if menuOpen}
				<X aria-hidden="true" />
			{:else}
				<Menu aria-hidden="true" />
			{/if}
		</button>
	</div>

	{#if menuOpen}
		<div class="absolute inset-x-0 top-full z-40 flex max-h-[calc(100vh-68px)] flex-col gap-4 overflow-y-auto border-t border-border bg-background px-6 py-5 shadow-lg lg:hidden">
			{#each NAV_LINKS as link (link.key)}
				<a href={link.href} onclick={() => (menuOpen = false)} class="text-base font-medium text-foreground">
					{link.label()}
				</a>
			{/each}
			<div class="flex items-center justify-between">
				{#if isAuthenticated}
					<Button href="/dashboard" size="sm" class="w-fit" onclick={() => (menuOpen = false)}>
						<LayoutDashboard aria-hidden="true" />
						{m.nav_dashboard()}
					</Button>
				{:else}
					<div class="flex items-center gap-4">
						<a href="/signin" onclick={() => (menuOpen = false)} class="text-base font-medium text-foreground">
							{m.nav_login()}
						</a>
						<Button href="/signup" size="sm" onclick={() => (menuOpen = false)}>{m.nav_register()}</Button>
					</div>
				{/if}
				<LanguageSwitch class="w-fit text-base" />
			</div>
		</div>
	{/if}
</nav>
