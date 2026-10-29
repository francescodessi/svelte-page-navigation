import js from '@eslint/js';
import globals from 'globals';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';

export default [
	{
		ignores: [
			'build/**',
			'dist/**',
			'.svelte-kit/**',
			'test-results/**',
			'playwright-report/**',
			'**/*.d.ts'
		]
	},
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }] }
	}
];
