import { PUBLIC_API_URL } from '$env/static/public';

// `+page.server.js` `load` funksiyaları üçün Flask API müştərisi. Brauzerin
// cookie jar-ı server-side yoxdur, ona görə auth cookie `event.cookies`-dən
// əl ilə oxunub sorğuya əlavə edilir - beləliklə SSR zamanı da (məs. donor/
// sorğu siyahılarında telefon nömrəsi) authenticated cavab alınır. Bax:
// hooks.server.js-dəki eyni pattern (`/api/me` üçün).
export async function fetchApi(event, path, { method = 'GET', body } = {}) {
	const headers = { };
	if (body !== undefined) headers['Content-Type'] = 'application/json';

	const token = event.cookies.get('access_token_cookie');
	if (token) headers['cookie'] = `access_token_cookie=${token}`;

	const res = await event.fetch(`${PUBLIC_API_URL}${path}`, {
		method,
		headers,
		body: body !== undefined ? JSON.stringify(body) : undefined
	});
	const data = await res.json().catch(() => null);
	return { ok: res.ok, status: res.status, data };
}
