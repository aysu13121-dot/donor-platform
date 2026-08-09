<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
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
