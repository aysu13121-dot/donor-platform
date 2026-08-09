import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_API_URL } from '$env/static/public';
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
// Hər sorğuda bu cookie-ni Flask-a ötürüb "kimdir" soruşuruq ki, auth
// vəziyyəti SSR zamanı bəlli olsun - əvvəlki React tətbiqindəki `ready`
// bayrağı və reload-da "yanlış vəziyyət yanıb-sönməsi" problemi bununla
// kökündən aradan qalxır (server ilk render-i artıq düzgün göndərir).
/** @type {import('@sveltejs/kit').Handle} */
async function handleAuth({ event, resolve }) {
	event.locals.user = null;

	const token = event.cookies.get('access_token_cookie');
	if (token) {
		try {
			const res = await event.fetch(`${PUBLIC_API_URL}/api/me`, {
				headers: { cookie: `access_token_cookie=${token}` }
			});
			if (res.ok) {
				event.locals.user = (await res.json()).user;
			}
		} catch {
			// Backend əlçatan deyilsə anonim kimi davam et - səhifə hələ də yüklənsin.
		}
	}

	return resolve(event);
}

export const handle = sequence(handleParaglide, handleAuth);
