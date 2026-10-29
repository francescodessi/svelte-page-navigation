import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createServer } from 'node:http';
import { build } from 'vite';
import ts from 'typescript';
import { chromium, expect } from '@playwright/test';

const root = resolve('.');
const output = join(root, '.svelte-kit/compat');
await mkdir(output, { recursive: true });
const versions = ['svelte3min', 'svelte3', 'svelte4min', 'svelte4', 'svelte5min', 'svelte'];
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH });

try {
	for (const name of versions) {
		const compiler = await import(`${name}/compiler`);
		const major = Number(compiler.VERSION.split('.')[0]);
		// Resolve the shipped declarations against each consumer's actual Svelte types.
		const typeFile = join(output, `${name}.ts`);
		await writeFile(
			typeFile,
			`
            import { Paginator } from '@dflare/svelte-page-navigation';
            import { SvelteComponentTyped } from 'svelte';
            class Button extends SvelteComponentTyped<{page?: number | string}> {}
            const component = new Paginator({target: document.body, props: {
                pages: 20, currentPage: 6, initChunkSize: 10,
                initShowFirstButton: true, initShowLastButton: true,
                showCurrentPageLabel: true, customPaginatorButton: Button,
                onchange: detail => { const page: number = detail.page; void page; }
            }});
            component.$on('change', event => { const page: number = event.detail.page; void page; });
            component.$set({currentPage: 2});
            // @ts-expect-error page counts must be numbers
            component.$set({pages: 'invalid'});
            ${major === 5 ? `import { mount } from 'svelte'; mount(Paginator, {target: document.body, props: {pages: 20}});` : ''}
        `
		);
		const options = {
			strict: true,
			noEmit: true,
			skipLibCheck: false,
			target: ts.ScriptTarget.ES2022,
			module: ts.ModuleKind.ESNext,
			moduleResolution: ts.ModuleResolutionKind.Bundler
		};
		const host = ts.createCompilerHost(options);
		host.resolveModuleNames = (names, containingFile) =>
			names.map(
				(specifier) =>
					ts.resolveModuleName(
						specifier.replace(/^svelte(?=\/|$)/, name),
						containingFile,
						options,
						host
					).resolvedModule
			);
		const declarations = (await readdir(join(root, 'dist/components')))
			.filter((file) => file.endsWith('.d.ts'))
			.map((file) => join(root, 'dist/components', file));
		const diagnostics = ts.getPreEmitDiagnostics(
			ts.createProgram([typeFile, ...declarations], options, host)
		);
		if (diagnostics.length)
			throw Error(
				ts.formatDiagnosticsWithColorAndContext(diagnostics, {
					getCurrentDirectory: () => root,
					getCanonicalFileName: (file) => file,
					getNewLine: () => '\n'
				})
			);

		for (const mode of major === 5 ? ['Legacy', 'Runes'] : ['Legacy']) {
			const dir = join(output, `${name}-${mode}`);
			await mkdir(dir, { recursive: true });
			const fixture = join(root, 'tests/fixtures', `${mode}.svelte`).replaceAll('\\', '/');
			await writeFile(
				join(dir, 'index.html'),
				'<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script type="module" src="/entry.js"></script></body></html>'
			);
			await writeFile(
				join(dir, 'entry.js'),
				`import App from ${JSON.stringify(fixture)};
                ${major === 5 ? "import { mount } from 'svelte'; mount(App, {target: document.body});" : 'new App({target: document.body});'}`
			);
			await build({
				configFile: false,
				root: dir,
				logLevel: 'error',
				resolve: {
					alias: [
						{ find: '@dflare/svelte-page-navigation', replacement: join(root, 'dist/index.js') },
						{ find: /^svelte(?=\/|$)/, replacement: name }
					]
				},
				plugins: [
					{
						name: 'compat-compiler',
						transform(code, id) {
							if (!id.endsWith('.svelte')) return;
							// Exercise SSR compilation too; the demo additionally prerenders Svelte 5.
							compiler.compile(code, { filename: id, generate: 'ssr' });
							const result = compiler.compile(code, {
								filename: id,
								generate: major === 5 ? 'client' : 'dom',
								css: major >= 4 ? 'injected' : true
							});
							return { code: result.js.code, map: result.js.map };
						}
					}
				],
				build: { outDir: join(dir, 'build'), emptyOutDir: true }
			});
			const staticDir = join(dir, 'build');
			const server = createServer(async (request, response) => {
				try {
					const path = new URL(request.url, 'http://localhost').pathname;
					const file = join(staticDir, path === '/' ? 'index.html' : path);
					response.setHeader(
						'Content-Type',
						path.endsWith('.js') ? 'text/javascript' : 'text/html'
					);
					response.end(await readFile(file));
				} catch {
					response.writeHead(404).end();
				}
			});
			await new Promise((done) => server.listen(0, '127.0.0.1', done));
			try {
				for (const mobile of [false, true]) {
					const context = await browser.newContext({
						viewport: { width: mobile ? 320 : 1280, height: 800 },
						isMobile: mobile,
						hasTouch: mobile
					});
					const page = await context.newPage();
					const errors = [];
					page.on('pageerror', (error) => errors.push(error.message));
					await page.goto(`http://127.0.0.1:${server.address().port}`);
					const click = async (label) => {
						const button = page.getByRole('button', { name: label, exact: true });
						if (mobile) await button.tap();
						else await button.click();
					};
					await expect(page.getByTestId('callbacks')).toHaveText('1');
					if (mode === 'Legacy') await expect(page.getByTestId('events')).toHaveText('1');
					await click('Next');
					await expect(page.getByTestId('page')).toHaveText('1');
					await expect(page.getByTestId('callbacks')).toHaveText('2');
					if (mode === 'Legacy') await expect(page.getByTestId('events')).toHaveText('2');
					await click('Custom');
					await click('Next');
					await expect(page.getByTestId('page')).toHaveText('2');
					await expect(page.getByTestId('callbacks')).toHaveText('3');
					await click('Jump');
					await expect(page.getByTestId('page')).toHaveText('19');
					await click('Shrink');
					await expect(page.getByTestId('page')).toHaveText('2');
					await click('Empty');
					await expect(page.getByRole('navigation')).toHaveCount(0);
					await click('Restore');
					await expect(page.getByRole('navigation')).toBeVisible();
					await click('Next');
					await expect(page.getByTestId('page')).toHaveText('1');
					await click('Huge');
					expect(await page.getByRole('navigation').getByRole('button').count()).toBeLessThan(20);
					await page.setViewportSize({ width: 240, height: 800 });
					await expect
						.poll(() =>
							page
								.getByRole('navigation')
								.evaluate((nav) => new Set([...nav.children].map((child) => child.offsetTop)).size)
						)
						.toBe(1);
					await page.setViewportSize({ width: 1280, height: 800 });
					await expect
						.poll(() => page.getByRole('navigation').getByRole('button').count())
						.toBeGreaterThan(8);
					await click('Toggle');
					await expect(page.getByRole('navigation')).toHaveCount(0);
					await click('Toggle');
					await expect(page.getByRole('navigation')).toBeVisible();
					expect(errors).toEqual([]);
					await context.close();
				}
				console.log(
					`PASS Svelte ${compiler.VERSION}: ${mode}, SSR/client compilation, types, desktop/mobile behavior`
				);
			} finally {
				server.closeAllConnections();
				await new Promise((done) => server.close(done));
			}
		}
	}
} finally {
	await browser.close();
}
