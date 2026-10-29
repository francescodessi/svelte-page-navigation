import { defineConfig, devices } from '@playwright/test';

const base = process.env.BASE_PATH || '';
export default defineConfig({
	testDir: './tests/browser',
	use: {
		baseURL: `http://127.0.0.1:4173${base}/`,
		launchOptions: { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		{ name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } }
	],
	webServer: {
		command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
		url: `http://127.0.0.1:4173${base}/`,
		reuseExistingServer: false
	}
});
