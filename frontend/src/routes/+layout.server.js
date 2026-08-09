// `locals.user` `hooks.server.js`-də (auth cookie-dən) doldurulur - hər
// səhifə `$page.data.user`/`data.user` vasitəsilə buna çıxış əldə edir.
// Bu, köhnə React tətbiqindəki AuthContext + `ready` bayrağının əvəzidir:
// istifadəçi SSR zamanı artıq bəllidir, client-də ayrıca "yüklənir" halı
// lazım deyil.
export async function load({ locals }) {
	return { user: locals.user };
}
