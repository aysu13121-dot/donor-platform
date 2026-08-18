<script>
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<svelte:head>
	<title>Məxfilik Siyasəti — Donor.az</title>
</svelte:head>

<Navbar />

<main class="mx-auto max-w-3xl px-6 py-16">
	<h1 class="mb-8 text-3xl font-semibold text-foreground">Məxfilik Siyasəti</h1>

	<div class="space-y-8 text-sm leading-relaxed text-muted-foreground">
		<section>
			<h2 class="mb-3 text-base font-semibold text-foreground">1. Hansı məlumatları toplayırıq?</h2>
			<p>Ad soyad, e-poçt ünvanı, telefon nömrəsi, qan qrupu və şəhər məlumatları. Bu məlumatlar yalnız qeydiyyat zamanı könüllü olaraq təqdim edilir.</p>
		</section>
		<section>
			<h2 class="mb-3 text-base font-semibold text-foreground">2. Məlumatlar necə istifadə olunur?</h2>
			<p>Məlumatlarınız yalnız donor axtarışını təmin etmək üçün istifadə edilir. Ad, qan qrupu və şəhər məlumatları digər istifadəçilərə görünür. Telefon nömrəsi yalnız daxil olmuş istifadəçilərə göstərilir.</p>
		</section>
		<section>
			<h2 class="mb-3 text-base font-semibold text-foreground">3. Məlumatların qorunması</h2>
			<p>Şifrələr kriptoqrafik hash funksiyaları ilə qorunur. Bütün məlumatlar şifrəli bağlantı (HTTPS) üzərindən ötürülür.</p>
		</section>
		<section>
			<h2 class="mb-3 text-base font-semibold text-foreground">4. Məlumatların silinməsi</h2>
			<p>İstifadəçilər istənilən vaxt öz hesablarını paneldən silə bilər. Hesab silindikdə bütün şəxsi məlumatlar sistemdən tamamilə çıxarılır.</p>
		</section>
		<section>
			<h2 class="mb-3 text-base font-semibold text-foreground">5. Üçüncü tərəflər</h2>
			<p>Məlumatlarınız heç bir üçüncü tərəfə satılmır və ya paylaşılmır. Yalnız xidmətin təqdim edilməsi üçün lazım olan texniki infrastrukturdan istifadə edilir.</p>
		</section>
	</div>

	<p class="mt-10 text-xs text-muted-foreground">Son yenilənmə: Avqust 2026</p>
</main>
