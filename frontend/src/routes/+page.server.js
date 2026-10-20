import { fetchApi } from '$lib/server/api.js';
import { CITIES } from '$lib/constants';

// Köhnə təcili elanlar landing-də görünməsin deyə 14 gündən köhnələr gizlədilir.
const MAX_AGE_HOURS = 24 * 14;

export async function load(event) {
	const [statsRes, urgentRes, donorsRes] = await Promise.all([
		fetchApi(event, '/api/stats'),
		fetchApi(event, '/api/requests?status=active&urgency=Urgent'),
		fetchApi(event, '/api/donors?is_available=true&limit=100')
	]);

	const cutoff = Date.now() - MAX_AGE_HOURS * 3600 * 1000;
	const urgentAll = urgentRes.ok
		? urgentRes.data.requests.filter((r) => !r.created_at || new Date(r.created_at).getTime() >= cutoff)
		: [];

	// Donor xəritəsi: hər şəhər üçün hazır donor və təcili sorğu sayı.
	const donors = donorsRes.ok ? donorsRes.data.donors : [];
	const cityMap = CITIES.map((city) => ({
		city,
		donors: donors.filter((d) => d.city === city).length,
		urgent: urgentAll.filter((r) => r.city === city).length
	}));

	return {
		stats: statsRes.ok ? statsRes.data.stats : null,
		urgent: urgentAll.slice(0, 3),
		cityMap: donorsRes.ok ? cityMap : null
	};
}
