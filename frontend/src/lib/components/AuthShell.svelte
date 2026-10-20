<script>
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import { getLocale } from '$lib/paraglide/runtime';
	import BrandLogo from '$lib/components/BrandLogo.svelte';
	import LanguageSwitch from '$lib/components/LanguageSwitch.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { cn } from '$lib/utils';

	// Daxil ol / Qeydiyyat səhifələri üçün ortaq görünüş: solda qırmızı panel,
	// sağda forma. Telefonda yalnız forma görünür.
	let { title, wide = false, children } = $props();

	const T = {
		az: {
			head: 'Bir damcı, min həyat.',
			sub: 'Azərbaycanda qan donorlarını ehtiyacı olanlarla birləşdiririk.',
			points: [
				'Qan qrupu və şəhərə görə donor axtarışı',
				'Təcili sorğular və WhatsApp ilə sürətli əlaqə',
				'Telefon nömrən yalnız daxil olmuş istifadəçilərə görünür'
			]
		},
		en: {
			head: 'One drop, endless lives.',
			sub: 'We connect blood donors in Azerbaijan with people who need them.',
			points: [
				'Search donors by blood type and city',
				'Urgent requests and fast contact on WhatsApp',
				'Your phone number is shown only to signed-in users'
			]
		}
	};
	const t = T[getLocale()] ?? T.az;
</script>

<div class="grid min-h-screen bg-background lg:grid-cols-[1fr_1.1fr]">
	<aside class="hero-red relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
		<a href="/" class="relative inline-flex items-center gap-2 text-[1.3rem] font-bold">
			<svg viewBox="0 0 24 30" class="beat h-6 w-[19px]" aria-hidden="true">
				<path d="M12 1C12 1 2 12.5 2 19a10 10 0 0 0 20 0C22 12.5 12 1 12 1Z" fill="currentColor" />
			</svg>
			<span><strong class="font-extrabold">Donor</strong>.az</span>
		</a>

		<div class="relative">
			<h2 class="mb-4 text-5xl font-extrabold leading-[1.05]">{t.head}</h2>
			<p class="mb-8 max-w-sm text-lg text-white/90">{t.sub}</p>
			<ul class="space-y-3">
				{#each t.points as point (point)}
					<li class="flex items-start gap-3 text-white/95">
						<CheckCircle2 class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
						{point}
					</li>
				{/each}
			</ul>
		</div>

		<svg aria-hidden="true" viewBox="0 0 600 80" preserveAspectRatio="none" class="relative h-16 w-full">
			<path
				class="heartbeat-path"
				d="M0 40 H220 L245 40 L265 8 L295 72 L320 24 L340 40 H600"
				fill="none"
				stroke="rgba(255,255,255,0.5)"
				stroke-width="2.5"
				stroke-linejoin="round"
			/>
		</svg>
	</aside>

	<main class="flex flex-col px-5 py-6 sm:px-10">
		<div class="flex items-center justify-between">
			<BrandLogo class="lg:invisible" />
			<div class="flex items-center gap-1">
				<ThemeToggle />
				<LanguageSwitch />
			</div>
		</div>

		<div class="flex flex-1 items-center justify-center py-10">
			<div class={cn('w-full rounded-3xl border border-border bg-card p-7 shadow-card sm:p-10', wide ? 'max-w-[600px]' : 'max-w-[440px]')}>
				<h1 class="mb-7 text-3xl font-extrabold text-foreground">{title}</h1>
				{@render children?.()}
			</div>
		</div>
	</main>
</div>
