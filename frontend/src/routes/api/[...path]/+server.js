import { PUBLIC_API_URL } from '$env/static/public';

// Brauzer bütün `/api/*` sorğularını (login, signup, profil/sorğu
// mutasiyaları) birbaşa Flask-a yox, HƏMİŞƏ frontend-in öz domeninə göndərsin
// deyə buradan backend-ə server-tərəfdən proksiləyirik.
//
// Səbəb: frontend və backend fərqli domendə deploy olunduqda (Render-in
// təsadüfi subdomain-ləri kimi), brauzer birbaşa backend-ə cross-origin fetch
// edəndə Flask-ın qoyduğu `access_token_cookie` yalnız BACKEND-in domenində
// saxlanılır - `hooks.server.js` isə yalnız FRONTEND-in öz domenindəki
// cookie-ni oxuyur (bax: handleAuth). Nəticədə giriş/qeydiyyat "uğurlu" olur,
// amma dashboard həmişə "token yoxdur" deyib geri /signin-ə atır.
//
// Bu proksi ilə brauzer həmişə frontend-in öz origin-inə müraciət edir -
// Flask-ın Set-Cookie cavabı brauzerin gözündə frontend domenindən gəlmiş
// kimi görünür, `hooks.server.js` onu normal görür.
async function proxy(event) {
	const { request, params, url } = event;
	const target = `${PUBLIC_API_URL}/api/${params.path}${url.search}`;

	const headers = new Headers();
	const contentType = request.headers.get('content-type');
	if (contentType) headers.set('content-type', contentType);
	const cookie = request.headers.get('cookie');
	if (cookie) headers.set('cookie', cookie);
	const csrfToken = request.headers.get('x-csrf-token');
	if (csrfToken) headers.set('x-csrf-token', csrfToken);

	const hasBody = !['GET', 'HEAD'].includes(request.method);
	const res = await event.fetch(target, {
		method: request.method,
		headers,
		body: hasBody ? await request.arrayBuffer() : undefined
	});

	const outHeaders = new Headers();
	const responseContentType = res.headers.get('content-type');
	if (responseContentType) outHeaders.set('content-type', responseContentType);
	for (const value of res.headers.getSetCookie()) {
		outHeaders.append('set-cookie', value);
	}

	return new Response(res.body, { status: res.status, headers: outHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
