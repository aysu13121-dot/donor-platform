<script>
	import { Card } from '$lib/components/ui/card';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import { cn } from '$lib/utils';

	let { icon: Icon, label, value, tone = 'default', loading = false } = $props();
</script>

{#if loading}
	<Card class="flex items-center gap-4 p-5">
		<Skeleton class="size-11 shrink-0" />
		<div class="flex min-w-0 flex-1 flex-col gap-2">
			<Skeleton class="h-6 w-14" />
			<Skeleton class="h-3 w-20" />
		</div>
	</Card>
{:else}
	<Card class="flex items-center gap-4 p-5">
		<span
			class={cn(
				'flex size-11 shrink-0 items-center justify-center rounded-md',
				tone === 'primary' ? 'bg-accent text-primary' : 'bg-secondary text-foreground'
			)}
		>
			<Icon class="size-5" aria-hidden="true" />
		</span>
		<div class="min-w-0">
			<p class="text-2xl font-bold text-foreground">{value}</p>
			<p class="truncate text-xs text-muted-foreground">{label}</p>
		</div>
	</Card>
{/if}
