<script>
	import { getLocale } from '$lib/paraglide/runtime';

	let { count = null, city = '' } = $props();

	const T = {
		az: {
			some: (n) => `${n} uyğun hazır donor var`,
			none: 'Bu şəhərdə uyğun hazır donor tapılmadı',
			see: 'Donorlara bax',
			note: 'Elan istifadəçi tərəfindən yaradılıb, xəstəxana ilə təsdiqlənməyib.'
		},
		en: {
			some: (n) => `${n} compatible available donors`,
			none: 'No compatible available donors in this city',
			see: 'See donors',
			note: 'Posted by a user. Not verified with the hospital.'
		}
	};
	const t = T[getLocale()] ?? T.az;
</script>

{#if count !== null}
	<div class="mb-3.5 rounded-md border border-border bg-secondary/50 px-3 py-2">
		<p class="text-xs font-semibold {count > 0 ? 'text-primary' : 'text-muted-foreground'}">
			{count > 0 ? t.some(count) : t.none}
			{#if city}
				<span class="font-normal text-muted-foreground">· {city}</span>
			{/if}
		</p>
		{#if count > 0}
			<a href="/donors?city={encodeURIComponent(city)}" class="text-xs text-primary hover:underline">{t.see} →</a>
		{/if}
		<p class="mt-1 text-[11px] leading-snug text-muted-foreground">{t.note}</p>
	</div>
{/if}
