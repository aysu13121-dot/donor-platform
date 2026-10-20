<script>
	import Home from '@lucide/svelte/icons/home';
	import Search from '@lucide/svelte/icons/search';
	import { page } from '$app/state';
	import { getLocale } from '$lib/paraglide/runtime';
	import Navbar from '$lib/components/Navbar.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const T = {
		az: {
			notFound: 'Səhifə tapılmadı',
			notFoundSub: 'Axtardığınız səhifə mövcud deyil və ya köçürülüb.',
			error: 'Xəta baş verdi',
			home: 'Ana səhifəyə qayıt',
			find: 'Donor tap'
		},
		en: {
			notFound: 'Page not found',
			notFoundSub: 'The page you are looking for does not exist or has moved.',
			error: 'Something went wrong',
			home: 'Back to home',
			find: 'Find a donor'
		}
	};
	const t = T[getLocale()] ?? T.az;
	let is404 = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{is404 ? t.notFound : t.error} - Donor.az</title>
</svelte:head>

<Navbar />

<main class="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 py-16 text-center">
	<div class="relative h-36 w-28">
		<svg viewBox="0 0 64 80" class="beat h-36 w-28" style="color: var(--primary)" aria-hidden="true">
			<path d="M32 4C32 4 6 34 6 52a26 26 0 0 0 52 0C58 34 32 4 32 4Z" fill="currentColor" />
		</svg>
		<span class="absolute inset-x-0 top-[62%] -translate-y-1/2 text-center text-3xl font-extrabold text-white">{page.status}</span>
	</div>
	<h1 class="text-3xl font-extrabold text-foreground">{is404 ? t.notFound : t.error}</h1>
	<p class="max-w-md text-muted-foreground">{is404 ? t.notFoundSub : (page.error?.message ?? '')}</p>
	<div class="flex flex-wrap justify-center gap-3">
		<Button href="/">
			<Home aria-hidden="true" />
			{t.home}
		</Button>
		<Button href="/find" variant="outline">
			<Search aria-hidden="true" />
			{t.find}
		</Button>
	</div>
</main>
