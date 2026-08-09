import { fetchApi } from '$lib/server/api.js';

// Statistika landing səhifəsində SSR zamanı yüklənir - əvvəlki React
// versiyasında client-side useEffect + loading skeleton var idi, SvelteKit-in
// server `load()`-u ilə buna ehtiyac qalmır, məzmun ilk render-də hazırdır.
export async function load(event) {
	const { ok, data } = await fetchApi(event, '/api/stats');
	return { stats: ok ? data.stats : null };
}
