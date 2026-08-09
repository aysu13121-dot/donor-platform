<script>
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest } = $props();
</script>

<div class={cn('flex flex-col gap-1.5 p-5', className)} {...rest}>
	{@render children?.()}
</div>
