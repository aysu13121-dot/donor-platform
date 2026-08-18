<script>
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';

	let dark = $state(false);

	$effect(() => {
		dark = document.documentElement.classList.contains('dark');
	});

	function toggle() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}
</script>

<button
	type="button"
	onclick={toggle}
	aria-label="Toggle theme"
	class="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
>
	{#if dark}
		<Sun class="size-4" aria-hidden="true" />
	{:else}
		<Moon class="size-4" aria-hidden="true" />
	{/if}
</button>
