<script>
	import { onMount } from 'svelte';

	let { value = 0 } = $props();

	// Server və brauzer əvvəlcə son rəqəmi göstərir; say yalnız ekranda görünəndə işləyir.
	let animated = $state(null);
	let shown = $derived(animated ?? value);
	let el = $state();

	onMount(() => {
		const target = Number(value);
		if (!Number.isFinite(target) || target <= 0) return;
		if (typeof IntersectionObserver === 'undefined') return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const io = new IntersectionObserver((entries) => {
			if (!entries[0].isIntersecting) return;
			io.disconnect();
			// Başlanğıc vaxtı ilk kadrın vaxtından götürülür: bəzən rAF vaxtı
			// performance.now()-dan əvvəl olur və mənfi rəqəm göstərirdi.
			let start = null;
			const tick = (now) => {
				if (start === null) start = now;
				const p = Math.min(1, Math.max(0, (now - start) / 1100));
				animated = Math.round(target * (1 - Math.pow(1 - p, 3)));
				if (p < 1) requestAnimationFrame(tick);
			};
			animated = 0;
			requestAnimationFrame(tick);
		});
		io.observe(el);
		return () => io.disconnect();
	});
</script>

<span bind:this={el}>{shown}</span>
