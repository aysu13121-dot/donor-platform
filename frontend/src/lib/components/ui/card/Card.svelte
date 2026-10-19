<script>
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest } = $props();
</script>

<div class={cn('rounded-2xl border border-border bg-card text-card-foreground shadow-card', className)} {...rest}>
	{@render children?.()}
</div>
