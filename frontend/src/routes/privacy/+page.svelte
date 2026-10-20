<script>
	import { getLocale } from '$lib/paraglide/runtime';
	import LegalPage from '$lib/components/LegalPage.svelte';

	const T = {
		az: {
			title: 'Məxfilik siyasəti',
			updated: 'Son yenilənmə: Oktyabr 2026',
			sections: [
				{
					h: 'Hansı məlumatları toplayırıq?',
					p: 'Ad soyad, e-poçt ünvanı, telefon nömrəsi, qan qrupu və şəhər məlumatları. Bu məlumatlar yalnız qeydiyyat zamanı könüllü olaraq təqdim edilir.'
				},
				{
					h: 'Məlumatlar necə istifadə olunur?',
					p: 'Məlumatlarınız yalnız donor axtarışını təmin etmək üçün istifadə edilir. Ad, qan qrupu və şəhər məlumatları digər istifadəçilərə görünür. Telefon nömrəsi yalnız daxil olmuş istifadəçilərə göstərilir.'
				},
				{
					h: 'Məlumatların qorunması',
					p: 'Şifrələr kriptoqrafik hash funksiyaları ilə qorunur. Bütün məlumatlar şifrəli bağlantı (HTTPS) üzərindən ötürülür.'
				},
				{
					h: 'Məlumatların silinməsi',
					p: 'İstifadəçilər istənilən vaxt öz hesablarını paneldən silə bilər. Hesab silindikdə bütün şəxsi məlumatlar sistemdən tamamilə çıxarılır.'
				},
				{
					h: 'Üçüncü tərəflər',
					p: 'Məlumatlarınız heç bir üçüncü tərəfə satılmır və ya paylaşılmır. Yalnız xidmətin təqdim edilməsi üçün lazım olan texniki infrastrukturdan istifadə edilir.'
				}
			]
		},
		en: {
			title: 'Privacy policy',
			updated: 'Last updated: October 2026',
			sections: [
				{
					h: 'What information do we collect?',
					p: 'Full name, email address, phone number, blood type and city. You give this information voluntarily when you register.'
				},
				{
					h: 'How is the information used?',
					p: 'Your information is used only for donor search. Name, blood type and city are visible to other users. The phone number is shown only to signed-in users.'
				},
				{
					h: 'How is the information protected?',
					p: 'Passwords are protected with cryptographic hash functions. All data is sent over an encrypted connection (HTTPS).'
				},
				{
					h: 'Deleting your information',
					p: 'You can delete your account from the dashboard at any time. When an account is deleted, all of its personal information is removed from the system.'
				},
				{
					h: 'Third parties',
					p: 'Your information is never sold or shared with third parties. Only the technical infrastructure needed to run the service is used.'
				}
			]
		}
	};
	const t = T[getLocale()] ?? T.az;
</script>

<LegalPage title={t.title} sections={t.sections} updated={t.updated} />
