<script module>
	import { cva } from 'class-variance-authority';

	export const buttonVariants = cva(
		'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:size-4 [&_svg]:shrink-0',
		{
			variants: {
				variant: {
					primary: 'bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-card',
					outline: 'border-2 border-border text-foreground hover:border-primary hover:text-primary',
					ghost: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
					destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
					dark: 'bg-foreground text-background hover:opacity-90',
					light: 'bg-white text-[#a3172f] hover:bg-white/90',
					outlineLight: 'border-2 border-white/70 text-white hover:bg-white/10'
				},
				size: {
					default: 'h-10 px-5',
					sm: 'h-9 px-4 text-[13px]',
					lg: 'h-12 px-7 text-base',
					icon: 'h-9 w-9'
				}
			},
			defaultVariants: { variant: 'primary', size: 'default' }
		}
	);
</script>

<script>
	import { cn } from '$lib/utils';

	// `href` verilibsə <a>, yoxdursa <button> kimi render olunur.
	let { class: className, variant, size, href, children, ...rest } = $props();
</script>

{#if href}
	<a {href} class={cn(buttonVariants({ variant, size }), className)} {...rest}>
		{@render children?.()}
	</a>
{:else}
	<button class={cn(buttonVariants({ variant, size }), className)} {...rest}>
		{@render children?.()}
	</button>
{/if}
