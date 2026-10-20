<script>
	import { BLOOD_TYPES } from '$lib/constants';
	import { cn } from '$lib/utils';

	// Qan qrupu seçimi düymələr kimi. `showAll` açıqdırsa "hamısı" düyməsi filtri təmizləyir.
	let { value = '', onChange, allLabel = 'All', showAll = true } = $props();

	const options = $derived([
		...(showAll ? [{ v: '', l: allLabel }] : []),
		...BLOOD_TYPES.map((b) => ({ v: b, l: b }))
	]);
</script>

<div class="flex flex-wrap gap-1.5" role="group">
	{#each options as o (o.v)}
		<button
			type="button"
			aria-pressed={value === o.v}
			onclick={() => onChange(o.v)}
			class={cn(
				'h-9 min-w-10 rounded-full px-3.5 text-sm font-bold transition-all',
				value === o.v
					? 'bg-primary text-primary-foreground shadow-card'
					: 'border-2 border-border bg-card text-foreground hover:border-primary hover:text-primary'
			)}
		>
			{o.l}
		</button>
	{/each}
</div>
