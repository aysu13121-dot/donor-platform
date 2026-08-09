<script>
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { cn } from '$lib/utils';

	// Native <select> ox-işarəsi brauzerdən brauzerə fərqli görünür və
	// tətbiqin özəl input stilindən qopur - `appearance-none` ilə gizlədilir,
	// yerinə tək tərz üçün öz ChevronDown ikonumuz qoyulur.
	let { class: className, value = $bindable(), children, ...rest } = $props();
</script>

<div class={cn('relative', className)}>
	<select
		bind:value
		class="h-10 w-full appearance-none rounded-md border border-input bg-card px-3.5 pr-9 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10"
		{...rest}
	>
		{@render children?.()}
	</select>
	<ChevronDown
		class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
		aria-hidden="true"
	/>
</div>
