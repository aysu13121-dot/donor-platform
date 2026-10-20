<script>
	import { getLocale } from '$lib/paraglide/runtime';
	import LegalPage from '$lib/components/LegalPage.svelte';

	const T = {
		az: {
			title: 'İstifadə şərtləri',
			updated: 'Son yenilənmə: Oktyabr 2026',
			sections: [
				{
					h: 'Platforma haqqında',
					p: 'Donor.az könüllü qan donorlarını ehtiyacı olan xəstələrlə birləşdirən müstəqil ictimai platformadır. Platforma rəsmi tibbi müəssisə deyil və tibbi məsləhət vermir.'
				},
				{
					h: 'İstifadəçi öhdəlikləri',
					p: 'Platformaya qeydiyyatdan keçərək siz düzgün məlumat təqdim etməyə, platformanı yalnız qanuni məqsədlər üçün istifadə etməyə və başqalarının şəxsi məlumatlarını qorumağa razılaşırsınız.'
				},
				{
					h: 'Məlumatların istifadəsi',
					p: 'Qeydiyyat zamanı verdiyiniz məlumatlar yalnız donor axtarışı məqsədi ilə istifadə olunur. Məlumatlarınız üçüncü şəxslərə satılmır.'
				},
				{
					h: 'Məsuliyyətin məhdudlaşdırılması',
					p: 'Donor.az platformada baş verən donor-xəstə əlaqəsinin nəticələrinə görə məsuliyyət daşımır. Bütün tibbi qərarlar ixtisaslı sağlamlıq mütəxəssisləri tərəfindən verilməlidir.'
				},
				{
					h: 'Dəyişikliklər',
					p: 'Bu şərtlər istənilən vaxt dəyişdirilə bilər. Platformadan istifadənizi davam etdirməklə yeni şərtləri qəbul etmiş sayılırsınız.'
				}
			]
		},
		en: {
			title: 'Terms of use',
			updated: 'Last updated: October 2026',
			sections: [
				{
					h: 'About the platform',
					p: 'Donor.az is an independent public platform that connects voluntary blood donors with patients in need. It is not an official medical institution and does not give medical advice.'
				},
				{
					h: 'User obligations',
					p: 'By registering, you agree to provide accurate information, to use the platform only for lawful purposes, and to protect the personal information of others.'
				},
				{
					h: 'Use of information',
					p: 'The information you give when you register is used only for donor search. Your information is not sold to third parties.'
				},
				{
					h: 'Limitation of liability',
					p: 'Donor.az is not responsible for the outcome of contact between donors and patients on the platform. All medical decisions must be made by qualified health professionals.'
				},
				{
					h: 'Changes',
					p: 'These terms may change at any time. By continuing to use the platform, you accept the new terms.'
				}
			]
		}
	};
	const t = T[getLocale()] ?? T.az;
</script>

<LegalPage title={t.title} sections={t.sections} updated={t.updated} />
