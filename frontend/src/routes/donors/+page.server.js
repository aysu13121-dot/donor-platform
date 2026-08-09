import { fetchApi } from '$lib/server/api.js';

// Filtrlər (blood_type, city, is_available, page) URL query-də saxlanılır -
// köhnə React versiyasında client-side useState + useEffect fetch var idi,
// burada isə SvelteKit-in `load()`-u URL-ə görə server-side render edir.
// Bu, filtrlənmiş nəticələri paylaşıla bilən/bookmark edilə bilən edir və
// ilk yükləmədə loading skeleton-a ehtiyacı aradan qaldırır.
export async function load(event) {
	const { url } = event;
	const bloodType = url.searchParams.get('blood_type') ?? '';
	const city = url.searchParams.get('city') ?? '';
	// Defolt "yalnız hazır olanlar" aktivdir (köhnə tətbiqlə eyni) - yalnız
	// `is_available=0` açıq şəkildə göndərildikdə söndürülür.
	const onlyAvailable = url.searchParams.get('is_available') !== '0';
	const page = Number(url.searchParams.get('page') ?? '1') || 1;

	const params = new URLSearchParams({ page: String(page), limit: '12' });
	if (bloodType) params.set('blood_type', bloodType);
	if (city) params.set('city', city);
	if (onlyAvailable) params.set('is_available', '1');

	const { ok, data } = await fetchApi(event, `/api/donors?${params.toString()}`);

	return {
		donors: ok ? data.donors : [],
		pagination: ok ? data.pagination : { page: 1, total_pages: 1 },
		error: ok ? null : data?.error,
		filters: { bloodType, city, onlyAvailable, page }
	};
}
