import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// `@lucide/svelte/icons/*` hər ikon üçün ayrı alt-modul idxal edir - Vite
// dev-də bunları tənbəlliklə (yalnız ilk dəfə həmin ikonu import edən route
// ziyarət olunanda) kəşf edir. Bu, hər YENİ səhifəyə ilk gedişdə "asılılıqlar
// yenidən optimallaşdırıldı, reload olunur" push-una səbəb olurdu - naviqasiyanın
// ortasında baş verəndə "Failed to fetch dynamically imported module"/"Redirect
// loop" kimi xətalar yaradırdı. Hamısını burada əvvəlcədən siyahıya salmaqla
// Vite server başlayanda bir dəfəyə bundle edir, naviqasiya zamanı təkrar
// optimallaşdırma tetiklənmir.
const LUCIDE_ICONS = [
	'activity', 'alert-triangle', 'arrow-right', 'building-2', 'calendar', 'check',
	'check-circle-2', 'chevron-down', 'chevron-left', 'chevron-right', 'clipboard-list',
	'droplet', 'globe', 'home', 'info', 'layout-dashboard', 'list-checks', 'log-out',
	'map-pin', 'menu', 'message-circle', 'phone', 'plus', 'rotate-ccw', 'save', 'search',
	'send', 'sticky-note', 'trash-2', 'triangle-alert', 'users', 'x', 'x-circle'
].map((name) => `@lucide/svelte/icons/${name}`);

export default defineConfig({
	optimizeDeps: {
		include: LUCIDE_ICONS
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter()
		}),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			// Layihə TypeScript-siz (jsconfig.json + JSDoc) olduğu üçün .d.ts
			// generasiyası lazım deyil - "typescript" paketi belə quraşdırılmayıb.
			// Köhnə tətbiqdəki kimi tək domain, URL prefiksi olmadan (/en/... yoxdur) -
			// dil seçimi sadəcə cookie ilə idarə olunur. Cookie adı da köhnə tətbiqlə
			// eyni saxlanılıb ki, `lang` cookie-si onsuz da tanış olsun.
			strategy: ['cookie', 'baseLocale'],
			cookieName: 'lang'
		})
	]
});
