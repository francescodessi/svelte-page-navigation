import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import adapter from '@sveltejs/adapter-static';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter({ pages: 'build', assets: 'build', strict: true }),
			paths: { base: /** @type {'' | `/${string}`} */ (process.env.BASE_PATH || '') }
		})
	]
});
