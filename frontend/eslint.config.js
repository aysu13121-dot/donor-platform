import path from 'node:path';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig([
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	svelte.configs.recommended,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } }
	},

	{
		files: ['**/*.svelte', '**/*.svelte.js'],
		languageOptions: { parserOptions: {} }
	},

	{
		// Layihə TypeScript-siz (jsconfig.json + JSDoc) olduğu üçün SvelteKit-in
		// generasiya etdiyi tipli route-lar yoxdur - `resolve()` bu qaydanın əsl
		// faydası (kompilyasiya zamanı marşrut yoxlanması) bizdə tətbiq
		// olunmur. Üstəlik paylaşılan `Button.svelte` həm daxili (məs.
		// /dashboard), həm xarici (tel:, wa.me) href-lər üçün istifadə olunur -
		// bu qayda hər ikisini eyni cür işarələyir.
		rules: { 'svelte/no-navigation-without-resolve': 'off' }
	}
]);
