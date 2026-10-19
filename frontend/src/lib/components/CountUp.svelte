<script>
	import { onMount } from 'svelte';

	let { value = 0 } = $props();

	let shown = $state(0);
	let el = $state();

	// Server və brauzer ilk olaraq son rəqəmi göstərir; say yalnız ekranda görünəndə işləyir.
	$effect(() => {
		shown = Number(value) || 0;
	});

	onMount(() => {
		const target = Number(value);
		if (!Number.isFinite(target) || target <= 0) return;
		if (typeof IntersectionObserver === 'undefined') return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const io = new IntersectionObserver((entries) => {
			if (!entries[0].isIntersecting) return;
			io.disconnect();
			const start = performance.now();
			const tick = (now) => {
				const p = Math.min(1, (now - start) / 1100);
				shown = Math.round(target * (1 - Math.pow(1 - p, 3)));
				if (p < 1) requestAnimationFrame(tick);
			};
			shown = 0;
			requestAnimationFrame(tick);
		});
		io.observe(el);
		return () => io.disconnect();
	});
</script>

<span bind:this={el}>{shown}</span>
