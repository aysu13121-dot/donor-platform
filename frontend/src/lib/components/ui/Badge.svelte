<script module>
	import { cva } from 'class-variance-authority';

	export const badgeVariants = cva(
		'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold [&_svg]:size-3',
		{
			variants: {
				variant: {
					default: 'bg-secondary text-muted-foreground',
					accent: 'bg-accent text-accent-foreground',
					success: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
					warning: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
					destructive: 'bg-primary text-primary-foreground',
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
