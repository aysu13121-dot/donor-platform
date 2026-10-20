<script>
	import { cn } from '$lib/utils';

	let { type = '?', size = 'md', class: className = '' } = $props();

	const SIZES = {
		sm: 'h-[50px] w-10 text-sm',
		md: 'h-[65px] w-[52px] text-base',
		lg: 'h-20 w-16 text-xl'
	};
</script>

<span class={cn('relative inline-block shrink-0 align-middle', SIZES[size] ?? SIZES.md, className)} role="img" aria-label={type}>
	<svg viewBox="0 0 64 80" class="absolute inset-0 h-full w-full text-primary" aria-hidden="true">
		<path d="M32 4C32 4 6 34 6 52a26 26 0 0 0 52 0C58 34 32 4 32 4Z" fill="currentColor" />
	</svg>
	<span class="absolute inset-x-0 top-[65%] -translate-y-1/2 text-center font-extrabold leading-none text-white">{type}</span>
</span>
