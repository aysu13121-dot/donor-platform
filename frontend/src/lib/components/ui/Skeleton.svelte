<script>
	import { cn } from '$lib/utils';

	let { class: className, ...rest } = $props();
</script>

<div class={cn('shimmer rounded-xl bg-secondary', className)} {...rest}></div>
