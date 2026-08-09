<script>
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest } = $props();
</script>

<h3 class={cn('text-base font-semibold text-foreground', className)} {...rest}>
	{@render children?.()}
</h3>
