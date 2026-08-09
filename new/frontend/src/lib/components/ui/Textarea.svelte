<script>
	import { cn } from '$lib/utils';

	let { class: className, value = $bindable(), ...rest } = $props();
</script>

<textarea
	bind:value
	class={cn(
		'w-full resize-none rounded-md border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10',
		className
	)}
	{...rest}
></textarea>
