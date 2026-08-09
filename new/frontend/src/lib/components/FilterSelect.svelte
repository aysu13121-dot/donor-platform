<script>
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { cn } from '$lib/utils';

	// Native <select>-in açılan siyahısı brauzer/OS tərəfindən çəkilir və CSS
	// ilə sayt dizaynına uyğunlaşdırıla bilmir. Bunun əvəzinə filtr sətirlərində
	// (donors, requests) və form sahələrində (profil və s.) tam özəl, sayt
	// dizaynında bir dropdown istifadə olunur.
	//
	// variant="filter" - kutu/border olmayan, sadə mətn+ox (filtr sətirləri üçün)
	// variant="field"  - digər form input-ları ilə eyni bordered qutu (formalar üçün)
	// Panel açıq olanda ehtiyac olan yer 256px (max-h-64) + kiçik boşluqdur -
	// aşağıda bu qədər yer yoxdursa panel yuxarı açılır.
	const PANEL_SPACE = 280;

	let { value, onChange, options, class: className = '', variant = 'filter', id } = $props();

	let open = $state(false);
	let openUpward = $state(false);
	let ref = $state();

	let selected = $derived(options.find((opt) => opt.value === value));
	let isField = $derived(variant === 'field');

	function handleToggle() {
		if (!open && ref) {
			const spaceBelow = window.innerHeight - ref.getBoundingClientRect().bottom;
			openUpward = spaceBelow < PANEL_SPACE;
		}
		open = !open;
	}

	function select(optValue) {
		onChange(optValue);
		open = false;
	}

	function handleClickOutside(event) {
		if (ref && !ref.contains(event.target)) open = false;
	}

	$effect(() => {
		if (!open) return;
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	});
</script>

<div bind:this={ref} class={cn('relative inline-flex', isField && 'w-full', className)}>
	<button
		type="button"
		{id}
		onclick={handleToggle}
		aria-haspopup="listbox"
		aria-expanded={open}
		class={isField
			? 'flex h-10 w-full items-center justify-between rounded-md border border-input bg-card px-3.5 text-sm outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10'
			: 'inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary'}
	>
		<span class={cn(isField && 'truncate text-foreground', isField && !value && 'text-muted-foreground/70')}>
			{selected?.label}
		</span>
		<ChevronDown class={cn('size-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} aria-hidden="true" />
	</button>

	{#if open}
		<div
			role="listbox"
			class={cn(
				'absolute left-0 z-20 max-h-64 overflow-y-auto rounded-md border border-border bg-card p-1 shadow-lg',
				openUpward ? 'bottom-full mb-2' : 'top-full mt-2',
				isField ? 'w-full' : 'min-w-[11rem]'
			)}
		>
			{#each options as opt (opt.value)}
				<button
					type="button"
					role="option"
					aria-selected={opt.value === value}
					onclick={() => select(opt.value)}
					class={cn(
						'flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors',
						opt.value === value ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-secondary'
					)}
				>
					{opt.label}
					{#if opt.value === value}
						<Check class="size-3.5 shrink-0" aria-hidden="true" />
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
