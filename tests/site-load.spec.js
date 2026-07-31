const { test, expect } = require('@playwright/test');

test('loads the site and renders primary navigation', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Samantha Fernando - Composer');
  await expect(page.getByRole('navigation')).toContainText('Biography');
  await expect(page.getByRole('button', { name: 'Works List' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Listen & Watch' })).toBeVisible();
});
