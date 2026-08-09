import { fetchApi } from '$lib/server/api.js';

export async function load(event) {
	const { url } = event;
	const bloodType = url.searchParams.get('blood_type') ?? '';
	const city = url.searchParams.get('city') ?? '';
	const urgency = url.searchParams.get('urgency') ?? '';

	const params = new URLSearchParams({ status: 'active' });
	if (bloodType) params.set('blood_type', bloodType);
	if (city) params.set('city', city);
	if (urgency) params.set('urgency', urgency);

	const { ok, data } = await fetchApi(event, `/api/requests?${params.toString()}`);

	return {
		requests: ok ? data.requests : [],
		error: ok ? null : data?.error,
		filters: { bloodType, city, urgency }
	};
}
