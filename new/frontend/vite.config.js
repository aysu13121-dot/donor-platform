import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
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
