<script>
	import { cn } from '$lib/utils';

	// Marka loqosu tək yerdə - Navbar, Login/Signup kartları, dashboard
	// sidebar-ı və footer eyni komponentdən istifadə edir.
	let { class: className = '', textClass = '', as = 'link' } = $props();
</script>

{#snippet content()}
	<svg viewBox="0 0 24 30" class="beat mr-2 h-6 w-[19px] shrink-0 text-primary" aria-hidden="true">
		<path d="M12 1C12 1 2 12.5 2 19a10 10 0 0 0 20 0C22 12.5 12 1 12 1Z" fill="currentColor" />
	</svg>
	<span class={textClass}><strong class="font-extrabold text-primary">Donor</strong>.az</span>
{/snippet}

{#if as === 'span'}
	<span class={cn('inline-flex items-center text-[1.3rem] font-bold text-foreground', className)}>
		{@render content()}
	</span>
{:else}
	<a href="/" class={cn('inline-flex items-center text-[1.3rem] font-bold text-foreground', className)}>
		{@render content()}
	</a>
{/if}
