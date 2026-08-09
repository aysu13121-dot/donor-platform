<script>
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest } = $props();
</script>

<label class={cn('text-[13px] font-semibold text-foreground', className)} {...rest}>
	{@render children?.()}
</label>
