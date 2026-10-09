<script>
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest } = $props();
</script>

<div class={cn('rounded-lg border border-border bg-card text-card-foreground shadow-[0_8px_24px_rgba(24,24,27,0.035)]', className)} {...rest}>
	{@render children?.()}
</div>
