import { test, expect } from '@playwright/test';

test('demo works on the Pages subpath with local assets and keyboard/touch navigation', async ({
	page,
	baseURL,
	isMobile
}) => {
	const errors = [];
	const failures = [];
	page.on('pageerror', (error) => errors.push(error.message));
	page.on('response', (response) => {
		if (response.status() >= 400) failures.push(response.url());
	});
	await page.goto(baseURL);
	await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeEnabled();
	if (isMobile) await page.getByRole('button', { name: 'Next', exact: true }).tap();
	else {
		await page.getByRole('button', { name: 'Next', exact: true }).focus();
		await page.keyboard.press('Enter');
	}
	await expect(page.getByRole('heading', { name: 'Current Page: 2' })).toBeVisible();
	await page.getByLabel('Pages', { exact: true }).fill('4.5');
	await page.getByLabel('Pages', { exact: true }).blur();
	await expect(page.getByText('It must be an integer greater than 0.')).toBeVisible();
	await page.reload();
	await expect(page.getByRole('navigation')).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	const favicon = await page.request.get(new URL('favicon.png', baseURL).href);
	expect(favicon.ok()).toBe(true);
	expect(errors).toEqual([]);
	expect(failures).toEqual([]);
});
