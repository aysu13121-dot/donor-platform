import { redirect } from '@sveltejs/kit';
import { fetchApi } from '$lib/server/api.js';

// Köhnə React tətbiqindəki `ProtectedRoute` komponentinin əvəzi - server-side,
// render-dən əvvəl yoxlanılır.
export async function load(event) {
	const { locals } = event;
	if (!locals.user) redirect(303, '/signin');

	const { ok, data } = await fetchApi(event, `/api/requests?status=all&user_id=${locals.user.id}`);
	return {
		requests: ok ? data.requests : [],
		requestsError: ok ? null : data?.error
	};
}
