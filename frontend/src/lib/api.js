export class ApiError extends Error {
	constructor(message, status) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
	}
}

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function readCookie(name) {
	if (typeof document === 'undefined') return null;
	const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : null;
}

// APIFlask validasiya xətaları `{ detail: { json: { sahə: ["mesaj"] } }, message: "..." }`
// şəklində gəlir - öz route-larımızın `{ error: "..." }` cavabından fərqli.
// Formada göstərmək üçün hər ikisini tək, oxunaqlı mesaja endiririk.
function extractErrorMessage(data) {
	if (!data) return 'Naməlum xəta baş verdi.';
	if (data.error) return data.error;
	if (data.detail) {
		const fieldErrors = Object.values(data.detail)
			.flatMap((location) => Object.values(location ?? {}))
			.flat();
		if (fieldErrors.length) return fieldErrors[0];
	}
	return data.message || 'Naməlum xəta baş verdi.';
}

async function request(path, { method = 'GET', body } = {}) {
	const headers = {};
	if (body !== undefined) headers['Content-Type'] = 'application/json';
	if (MUTATING_METHODS.has(method)) {
		const csrfToken = readCookie('csrf_access_token');
		if (csrfToken) headers['X-CSRF-TOKEN'] = csrfToken;
	}

	let res;
	try {
		// Backend-ə birbaşa yox, `routes/api/[...path]/+server.js` proksisinin
		// üstündən (özümüzün origin-imizə, relative path ilə) - bax o faylın
		// başındakı izaha: fərqli domendə deploy olunanda cookie problemi
		// yaratmamaq üçün.
		res = await fetch(path, {
			method,
			headers,
			credentials: 'include',
			body: body !== undefined ? JSON.stringify(body) : undefined
		});
	} catch {
		throw new ApiError('Server ilə əlaqə qurmaq mümkün olmadı.', 0);
	}

	const data = await res.json().catch(() => null);
	if (!res.ok) throw new ApiError(extractErrorMessage(data), res.status);
	return data;
}

// Client-side (brauzerdə işləyən) API müştərisi - login/signup, profil
// yeniləmə, sorğu yaratma/silmə kimi mutasiyalar üçün. Cookie-lər
// `credentials: 'include'` ilə avtomatik göndərilir. Server-side `load`
// funksiyaları üçün bunun əvəzinə `$lib/server/api.js` istifadə olunur -
// orada brauzerin cookie jar-ı yoxdur, cookie əl ilə ötürülməlidir.
export const api = {
	get: (path, opts) => request(path, { ...opts, method: 'GET' }),
	post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
	put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
	delete: (path, opts) => request(path, { ...opts, method: 'DELETE' })
};
