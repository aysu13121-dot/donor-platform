<script>
	import { cn } from '$lib/utils';

	// Marka loqosu tək yerdə - Navbar, Login/Signup kartları, dashboard
	// sidebar-ı və footer eyni komponentdən istifadə edir.
	let { class: className = '', textClass = '', as = 'link' } = $props();
</script>

{#snippet content()}
	<span class={textClass}><strong class="text-primary">Donor</strong>.az</span>
{/snippet}

{#if as === 'span'}
	<span class={cn('inline-flex items-center text-[1.25rem] font-semibold text-foreground', className)}>
		{@render content()}
	</span>
{:else}
	<a href="/" class={cn('inline-flex items-center text-[1.25rem] font-semibold text-foreground', className)}>
		{@render content()}
	</a>
{/if}
