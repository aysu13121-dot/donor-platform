<script>
	import Home from '@lucide/svelte/icons/home';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import ListChecks from '@lucide/svelte/icons/list-checks';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Menu from '@lucide/svelte/icons/menu';
	import Plus from '@lucide/svelte/icons/plus';
	import Users from '@lucide/svelte/icons/users';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import BrandLogo from '$lib/components/BrandLogo.svelte';
	import LanguageSwitch from '$lib/components/LanguageSwitch.svelte';
	import { api } from '$lib/api';
	import { cn } from '$lib/utils';

	const QUICK_LINKS = [
		{ href: '/', key: 'home', icon: Home, label: m.nav_home },
		{ href: '/donors', key: 'donors', icon: Users, label: m.nav_donors },
		{ href: '/requests', key: 'requests', icon: ListChecks, label: m.nav_requests }
	];

	const NAV_ITEM_BASE = 'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors';
	const NAV_ITEM_ACTIVE = 'bg-accent font-semibold text-primary';
	const NAV_ITEM_INACTIVE = 'font-medium text-muted-foreground hover:bg-secondary hover:text-foreground';
	const NAV_SECTION_LABEL = 'px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70';

	let { children } = $props();

	let open = $state(false);
	let user = $derived(page.data.user);
	let activePanel = $derived(page.url.searchParams.get('panel'));
	let initial = $derived((user?.full_name || user?.email || 'D').charAt(0).toUpperCase());

	async function handleLogout() {
		try {
			await api.post('/api/logout');
		} catch {
			// Cookie artıq etibarsızdırsa belə, istifadəçini çıxış etmiş kimi göndər.
		}
		await goto('/', { invalidateAll: true });
	}
</script>

{#snippet sidebarContent(onNavigate)}
	<div class="flex h-full flex-col bg-card">
		<div class="flex items-center justify-between px-5 pb-4 pt-6">
			<BrandLogo />
			<LanguageSwitch />
		</div>

		<nav class="flex-1 overflow-y-auto px-3">
			<div class="mb-4">
				<p class={NAV_SECTION_LABEL}>{m.nav_dashboard()}</p>
				<div class="flex flex-col gap-0.5">
					<a href="/dashboard" onclick={onNavigate} class={cn(NAV_ITEM_BASE, activePanel ? NAV_ITEM_INACTIVE : NAV_ITEM_ACTIVE)}>
						<LayoutDashboard class="size-4" aria-hidden="true" />
						{m.dashboard_navOverview()}
					</a>
					<a
						href="/dashboard?panel=create"
						onclick={onNavigate}
						class={cn(NAV_ITEM_BASE, activePanel === 'create' ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE)}
					>
						<Plus class="size-4" aria-hidden="true" />
						{m.nav_createRequest()}
					</a>
				</div>
			</div>

			<div>
				<p class={NAV_SECTION_LABEL}>{m.dashboard_quickLinks()}</p>
				<div class="flex flex-col gap-0.5">
					{#each QUICK_LINKS as item (item.key)}
						<a href={item.href} onclick={onNavigate} class={cn(NAV_ITEM_BASE, NAV_ITEM_INACTIVE)}>
							<item.icon class="size-4" aria-hidden="true" />
							{item.label()}
						</a>
					{/each}
				</div>
			</div>
		</nav>

		<div class="border-t border-border p-3">
			<div class="flex items-center gap-1.5">
				<a
					href="/dashboard?panel=profile"
					onclick={onNavigate}
					class={cn(
						'flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-2 transition-colors',
						activePanel === 'profile' ? 'bg-accent' : 'hover:bg-secondary'
					)}
				>
					<span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
						{initial}
					</span>
					<p class="min-w-0 truncate text-[13px] font-semibold text-foreground">{user?.full_name || m.donors_donor()}</p>
				</a>
				<button
					type="button"
					onclick={handleLogout}
					aria-label={m.nav_logout()}
					class="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
				>
					<LogOut class="size-4" aria-hidden="true" />
				</button>
			</div>
		</div>
	</div>
{/snippet}

<div class="flex min-h-screen bg-background">
	<aside class="hidden w-64 shrink-0 border-r border-border lg:sticky lg:top-0 lg:block lg:h-screen">
		{@render sidebarContent(null)}
	</aside>

	{#if open}
		<div class="fixed inset-0 z-50 lg:hidden">
			<div class="absolute inset-0 bg-foreground/40" onclick={() => (open = false)} aria-hidden="true"></div>
			<aside class="absolute inset-y-0 left-0 w-72 shadow-xl">
				{@render sidebarContent(() => (open = false))}
			</aside>
		</div>
	{/if}

	<div class="flex min-w-0 flex-1 flex-col">
		<header class="flex h-14 shrink-0 items-center border-b border-border bg-card px-4 lg:hidden">
			<button
				type="button"
				onclick={() => (open = true)}
				class="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary"
			>
				<Menu class="size-5" aria-hidden="true" />
			</button>
		</header>

		<main class="flex-1 px-4 py-8 lg:px-8">{@render children?.()}</main>
	</div>
</div>
