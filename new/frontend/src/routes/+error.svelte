<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/Button.svelte';
</script>

<div class="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 py-10 text-center">
	<span class="text-6xl font-bold text-primary md:text-7xl">{page.status}</span>
	<h1 class="text-xl font-semibold text-foreground">
		{page.status === 404 ? 'Səhifə tapılmadı' : 'Xəta baş verdi'}
	</h1>
	<p class="text-sm text-muted-foreground">
		{page.status === 404 ? 'Axtardığınız səhifə mövcud deyil.' : (page.error?.message ?? '')}
	</p>
	<Button href="/">Ana səhifəyə qayıt</Button>
</div>
