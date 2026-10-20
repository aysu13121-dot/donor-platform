import { fetchApi } from '$lib/server/api.js';
import { bloodCompatibility } from '$lib/constants';

// Köhnə təcili elanlar görünməsin deyə 14 gündən köhnələr gizlədilir.
const MAX_AGE_HOURS = 24 * 14;

export async function load(event) {
	const { url } = event;
	const bloodType = url.searchParams.get('blood_type') ?? '';
	const city = url.searchParams.get('city') ?? '';
	const urgency = url.searchParams.get('urgency') ?? '';

	const params = new URLSearchParams({ status: 'active' });
	if (bloodType) params.set('blood_type', bloodType);
	if (city) params.set('city', city);
	if (urgency) params.set('urgency', urgency);

	const [reqRes, donorRes] = await Promise.all([
		fetchApi(event, `/api/requests?${params.toString()}`),
		fetchApi(event, '/api/donors?is_available=true&limit=100')
	]);

	const donors = donorRes.ok ? donorRes.data.donors : [];
	const canReceiveFrom = Object.fromEntries(bloodCompatibility().map((b) => [b.type, b.receives]));
	const cutoff = Date.now() - MAX_AGE_HOURS * 3600 * 1000;

	const requests = (reqRes.ok ? reqRes.data.requests : [])
		.filter((r) => !r.created_at || new Date(r.created_at).getTime() >= cutoff)
		.map((r) => ({
			...r,
			match_count: donorRes.ok
				? donors.filter(
						(d) => d.city === r.city && (canReceiveFrom[r.blood_type] ?? []).includes(d.blood_type)
					).length
				: null
		}));

	return {
		requests,
		error: reqRes.ok ? null : reqRes.data?.error,
		filters: { bloodType, city, urgency }
	};
}
