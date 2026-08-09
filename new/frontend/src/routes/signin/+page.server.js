import { redirect } from '@sveltejs/kit';

// Köhnə React tətbiqindəki `GuestRoute` komponentinin əvəzi - artıq daxil
// olmuş istifadəçi bu səhifəyə girə bilməz, birbaşa dashboard-a yönləndirilir.
// `locals.user` SSR zamanı artıq bəlli olduğu üçün bu, render-dən əvvəl,
// server-side baş verir - client-də "yanıb-sönən" məzmun riski yoxdur.
export function load({ locals }) {
	if (locals.user) redirect(303, '/dashboard');
}
