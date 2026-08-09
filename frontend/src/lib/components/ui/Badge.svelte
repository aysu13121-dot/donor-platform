<script module>
	import { cva } from 'class-variance-authority';

	export const badgeVariants = cva(
		'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium [&_svg]:size-3',
		{
			variants: {
				variant: {
					default: 'bg-secondary text-muted-foreground',
					accent: 'bg-accent text-accent-foreground',
					success: 'bg-emerald-50 text-emerald-700',
					warning: 'bg-amber-50 text-amber-700',
					destructive: 'bg-red-50 text-destructive',
					outline: 'border border-border text-foreground'
				}
			},
			defaultVariants: { variant: 'default' }
		}
	);
</script>

<script>
	import { cn } from '$lib/utils';

	let { class: className, variant, icon: Icon, children, ...rest } = $props();
</script>

<span class={cn(badgeVariants({ variant }), className)} {...rest}>
	{#if Icon}
		<Icon aria-hidden="true" />
	{/if}
	{@render children?.()}
</span>
