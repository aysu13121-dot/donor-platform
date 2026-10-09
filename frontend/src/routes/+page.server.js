import { fetchApi } from '$lib/server/api.js';

// Köhnə təcili elanlar landing-də görünməsin deyə 72 saatdan köhnələr gizlədilir.
const MAX_AGE_HOURS = 72;

export async function load(event) {
	const [statsRes, urgentRes] = await Promise.all([
		fetchApi(event, '/api/stats'),
		fetchApi(event, '/api/requests?status=active&urgency=Urgent')
	]);

	const cutoff = Date.now() - MAX_AGE_HOURS * 3600 * 1000;
	const urgent = urgentRes.ok
		? urgentRes.data.requests
				.filter((r) => !r.created_at || new Date(r.created_at).getTime() >= cutoff)
				.slice(0, 3)
		: [];

	return { stats: statsRes.ok ? statsRes.data.stats : null, urgent };
}
