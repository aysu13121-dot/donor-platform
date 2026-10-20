import { fetchApi } from '$lib/server/api.js';
import { bloodCompatibility } from '$lib/constants';

// "Donor tap" sehrbazı: xəstənin qan qrupu + şəhər URL-də saxlanılır.
// Hazır donorlar bir sorğu ilə gətirilir, uyğunluq (kim kimə qan verə bilər)
// burada hesablanır. Eyni qan qrupu olan donorlar siyahıda birinci gəlir.
export async function load(event) {
	const { url } = event;
	const bloodType = url.searchParams.get('blood_type') ?? '';
	const city = url.searchParams.get('city') ?? '';

	const res = await fetchApi(event, '/api/donors?is_available=true&limit=100');
	const donors = res.ok ? res.data.donors : [];

	const canReceiveFrom = Object.fromEntries(bloodCompatibility().map((b) => [b.type, b.receives]));
	const compatible = bloodType
		? donors.filter((d) => (canReceiveFrom[bloodType] ?? []).includes(d.blood_type))
		: [];

	const perCity = {};
	for (const d of compatible) perCity[d.city] = (perCity[d.city] ?? 0) + 1;

	const matches = city
		? compatible
				.filter((d) => d.city === city)
				.sort((a, b) => Number(b.blood_type === bloodType) - Number(a.blood_type === bloodType))
		: [];

	return {
		bloodType,
		city,
		perCity,
		matches,
		total: compatible.length,
		error: res.ok ? null : res.data?.error
	};
}
