<script>
	import Globe from '@lucide/svelte/icons/globe';
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	import { cn } from '$lib/utils';

	// Tək kliklə dil dəyişdirən düymə. `setLocale` cookie-ni yeniləyir və
	// səhifəni yenidən yükləyir ki, server-render olunan mətn də (SSR)
	// dərhal düzgün dildə görünsün.
	let { class: className = '' } = $props();
</script>

<button
	type="button"
	onclick={() => setLocale(getLocale() === 'az' ? 'en' : 'az')}
	class={cn(
		'inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
		className
	)}
>
	<Globe class="size-3.5" aria-hidden="true" />
	{getLocale() === 'az' ? 'EN' : 'AZ'}
</button>
