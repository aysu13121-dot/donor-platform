import { redirect } from '@sveltejs/kit';
import { fetchApi } from '$lib/server/api.js';

// Köhnə React tətbiqindəki `ProtectedRoute` komponentinin əvəzi - server-side,
// render-dən əvvəl yoxlanılır.
//
// `hooks.server.js` `locals.user`-i JWT-dən (şəbəkəyə çıxmadan) doldurur,
// ona görə burada tam profili (`/api/me`) özümüz çəkirik - bu, dashboard-un
// həqiqətən tam profilə ehtiyacı olan YEGANƏ yerdir. Qaytardığımız `user`
// açarı root layout-un minimal `{ id }` versiyasının üzərinə yazılır (eyni
// açar adı - SvelteKit uşaq `load()`-un dəyərini valideyninkindən üstün tutur).
export async function load(event) {
	const { locals } = event;
	if (!locals.user) redirect(303, '/signin');

	const [userRes, requestsRes] = await Promise.all([
		fetchApi(event, '/api/me'),
		fetchApi(event, `/api/requests?status=all&user_id=${locals.user.id}`)
	]);

	if (!userRes.ok) {
		// Token imzası doğrudur, amma arxasındakı istifadəçi artıq yoxdur
		// (məs. hesab silinib) - əsl mənbəyə görə çıxış etmiş sayılır.
		redirect(303, '/signin');
	}

	return {
		user: userRes.data.user,
		requests: requestsRes.ok ? requestsRes.data.requests : [],
		requestsError: requestsRes.ok ? null : requestsRes.data?.error
	};
}
