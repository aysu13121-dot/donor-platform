<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';

	let { children } = $props();

	// Render-in pulsuz planında API yatanda onu yalnız Render-dən KƏNAR sorğu
	// oyada bilir (frontend serverinin sorğusu 429 alır). Ona görə ziyarətçinin
	// brauzeri API-ni birbaşa "dürtür". API yatmış idisə, oyanan kimi səhifənin
	// məlumatlarını yenidən yükləyirik (xəritə, sorğular, giriş vəziyyəti).
	onMount(() => {
		fetch(`${PUBLIC_API_URL}/api/stats`, { mode: 'no-cors', cache: 'no-store' }).catch(() => {});

		let stopped = false;
		let wasAsleep = false;
		(async () => {
			for (let i = 0; i < 40 && !stopped; i++) {
				const ok = await fetch('/api/stats', { cache: 'no-store' })
					.then((r) => r.ok)
					.catch(() => false);
				if (ok) {
					if (wasAsleep) invalidateAll();
					return;
				}
				wasAsleep = true;
				await new Promise((r) => setTimeout(r, 4000));
			}
		})();
		return () => (stopped = true);
	});
</script>

<svelte:head>
	<title>Donor.az - Qan Donorluğu Platforması</title>
	<meta
		name="description"
		content="Azərbaycan üzrə təcili qan donorluğu platforması. Təcili qan ehtiyaclarını bildirin, donor tapın və ya donor olaraq həyat qurtarın."
	/>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
