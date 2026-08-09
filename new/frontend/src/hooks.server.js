import { sequence } from '@sveltejs/kit/hooks';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '$env/static/private';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

/** @type {import('@sveltejs/kit').Handle} */
const handleParaglide = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace('%paraglide.lang%', locale).replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

// Backend JWT-ni httpOnly cookie-də saxlayır (bax: backend/app/config.py).
// Əvvəllər burada hər sorğuda `/api/me`-yə tam şəbəkə müraciəti gedirdi -
// bu, hər səhifə keçidinə bir Neon sorğusu (backend-in DB baxışı) əlavə
// edirdi. Ona ehtiyac yoxdur: token-in imzasını backend ilə paylaşılan
// `JWT_SECRET_KEY` ilə burada, yerində yoxlamaq kifayətdir - yalnız
// istifadəçinin ID-si lazımdır (kim olduğu, "daxil olub-olmadığı"), tam
// profil yalnız ona həqiqətən ehtiyacı olan `/dashboard`-ın öz
// `load()`-unda çəkilir (bax: routes/dashboard/+page.server.js).
//
// Güzəşt: hesab silinsə/bloklansa, bunu server yalnız /dashboard-a
// girəndə görəcək - digər səhifələrdə köhnə token öz müddətinə (7 gün)
// qədər "etibarlı" sayılacaq. Çıxışa (logout, cookie-nin silinməsinə)
// təsiri yoxdur.
/** @type {import('@sveltejs/kit').Handle} */
function handleAuth({ event, resolve }) {
	event.locals.user = null;

	const token = event.cookies.get('access_token_cookie');
	if (token) {
		try {
			const payload = jwt.verify(token, JWT_SECRET_KEY, { algorithms: ['HS256'] });
			if (payload.type === 'access' && payload.sub) {
				event.locals.user = { id: Number(payload.sub) };
			}
		} catch {
			// Etibarsız/vaxtı bitmiş token - anonim kimi davam et.
		}
	}

	return resolve(event);
}

export const handle = sequence(handleParaglide, handleAuth);
