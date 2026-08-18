<script>
	import * as m from '$lib/paraglide/messages.js';
	import Navbar from '$lib/components/Navbar.svelte';

	const LOCATIONS = {
		baku: [
			{ name: 'Respublika Qan Mərkəzi', address: 'Əliağa Vahid küç. 8, Bakı', phone: '+994 12 562 00 11' },
			{ name: 'N.Nərimanov adına Şəhər Xəstəxanası', address: 'Tbilisi pr. 3, Bakı', phone: '+994 12 465 23 31' },
			{ name: 'Bakı Şəhər Klinik Xəstəxanası №1', address: 'Həsən Əliyev küç. 67, Bakı', phone: '+994 12 432 80 01' },
		],
		ganja: [
			{ name: 'Gəncə Regional Qan Mərkəzi', address: 'Nizami küç. 1, Gəncə', phone: '+994 22 256 44 10' },
			{ name: 'Gəncə Şəhər Xəstəxanası', address: 'Xaqani küç. 44, Gəncə', phone: '+994 22 255 11 23' },
		],
		sumgait: [
			{ name: 'Sumqayıt Şəhər Xəstəxanası', address: '47-ci məhəllə, Sumqayıt', phone: '+994 18 642 10 05' },
		],
		other: [
			{ name: 'Lənkəran Rayon Mərkəzi Xəstəxanası', address: 'Hüseyn Cavid küç. 12, Lənkəran', phone: '+994 25 255 02 30' },
			{ name: 'Mingəçevir Şəhər Xəstəxanası', address: 'Nizami küç. 5, Mingəçevir', phone: '+994 24 255 38 40' },
		],
	};
</script>

<svelte:head>
	<title>{m.locations_title()} — Donor.az</title>
</svelte:head>

<Navbar />

<main class="mx-auto max-w-3xl px-6 py-16">

	<div class="mb-12 text-center">
		<h1 class="mb-3 text-3xl font-semibold text-foreground">{m.locations_title()}</h1>
		<p class="text-sm text-muted-foreground">{m.locations_sub()}</p>
	</div>

	<div class="mb-6 rounded-lg border border-border bg-secondary/40 px-5 py-3">
		<p class="text-xs text-muted-foreground">⚠️ {m.locations_note()}</p>
	</div>

	{#each [
		{ key: 'baku',    label: m.locations_baku,    items: LOCATIONS.baku },
		{ key: 'ganja',   label: m.locations_ganja,   items: LOCATIONS.ganja },
		{ key: 'sumgait', label: m.locations_sumgait, items: LOCATIONS.sumgait },
		{ key: 'other',   label: m.locations_other,   items: LOCATIONS.other },
	] as section}
		<section class="mb-10">
			<h2 class="mb-4 text-base font-semibold text-foreground">{section.label()}</h2>
			<div class="space-y-3">
				{#each section.items as loc}
					<div class="flex items-center justify-between rounded-xl border border-border bg-card px-6 py-5">
						<div>
							<p class="text-sm font-medium text-foreground">{loc.name}</p>
							<p class="mt-0.5 text-xs text-muted-foreground">{loc.address}</p>
						</div>
						<a
							href="tel:{loc.phone}"
							class="ml-4 shrink-0 rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
						>
							{m.locations_call()}
						</a>
					</div>
				{/each}
			</div>
		</section>
	{/each}

</main>
