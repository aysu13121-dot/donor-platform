<script>
	import * as m from '$lib/paraglide/messages.js';
	import Navbar from '$lib/components/Navbar.svelte';
	import LocationsMap from '$lib/components/LocationsMap.svelte';

	let groups = $derived([
		{
			label: m.locations_baku(),
			lat: 40.4093,
			lng: 49.8671,
			items: [
				{ name: 'Milli Hematologiya və Transfuziologiya Mərkəzi', address: '' },
				{ name: 'Mərkəzi Klinik Xəstəxananın qanköçürmə şöbəsi', address: '' },
				{ name: 'Mərkəzi Neftçilər Xəstəxanasının qanköçürmə şöbəsi', address: '' }
			]
		},
		{
			label: 'Şirvan',
			lat: 39.9318,
			lng: 48.9206,
			items: [{ name: 'Şirvan Şəhər Mərkəzi Xəstəxanasının qanköçürmə şöbəsi', address: '' }]
		},
		{
			label: m.locations_mingachevir(),
			lat: 40.7703,
			lng: 47.0496,
			items: [{ name: 'Mingəçevir Şəhər Mərkəzi Xəstəxanasının qanköçürmə şöbəsi', address: '' }]
		}
	]);
</script>

<svelte:head>
	<title>{m.locations_title()} - Donor.az</title>
</svelte:head>

<Navbar />

<main class="mx-auto max-w-3xl px-6 py-16">
	<div class="mb-8 text-center">
		<h1 class="text-3xl font-semibold text-foreground">{m.locations_title()}</h1>
		<p class="mt-2 text-sm text-muted-foreground">{m.locations_note()}</p>
	</div>

	<LocationsMap {groups} />

	<div class="mt-10 space-y-8">
		{#each groups as group (group.label)}
			<section>
				<h2 class="mb-3 text-base font-semibold text-foreground">{group.label}</h2>
				<ul class="space-y-2">
					{#each group.items as item (item.name)}
						<li class="rounded-xl border border-border bg-card px-6 py-4 text-sm text-foreground">
							{item.name}
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</main>
