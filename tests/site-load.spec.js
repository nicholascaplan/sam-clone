const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('loads the site and renders primary navigation', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Samantha Fernando - Composer');
  await expect(page.getByRole('navigation')).toContainText('Biography');
  await expect(page.getByRole('button', { name: 'Works List' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Listen & Watch' })).toBeVisible();
});

test('switches to the works list and filters by category', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Works List' }).click();
  await expect(page).toHaveURL(/#works$/);
  await expect(page.locator('#tab-works')).toBeVisible();
  await expect(page.locator('#worksContainer')).toContainText('Wintering');

  await page.getByRole('button', { name: 'Opera & Stage' }).click();
  await expect(page.locator('#worksContainer')).toContainText('glass human');
  await expect(page.locator('#worksContainer')).not.toContainText('Wintering');
});

test('toggles the visual theme', async ({ page }) => {
  await page.goto('/');

  await page.locator('#themeToggleBtn').click();
  await expect(page.locator('body')).not.toHaveClass(/light-mode/);

  await page.locator('#themeToggleBtn').click();
  await expect(page.locator('body')).toHaveClass(/light-mode/);
});

test('opens and closes the mobile navigation menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menuButton = page.locator('#mobileMenuToggle');
  const menu = page.locator('#mobileMenu');

  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();

  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeHidden();
});

test('shows contact confirmation without submitting externally', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Contact' }).click();
  await expect(page.locator('#tab-contact')).toBeVisible();

  await page.getByPlaceholder('Name...').fill('Test Visitor');
  await page.getByPlaceholder('Email...').fill('test@example.com');
  await page.getByPlaceholder('Specify work title or details...').fill('Test inquiry');
  await page.getByRole('button', { name: 'Send Inquiry Message' }).click();

  await expect(page.locator('#contactToast')).toBeVisible();
  await expect(page.locator('#contactToast')).toContainText('Message sent successfully');
});

test('switches between Listen and Watch content', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Listen & Watch' }).click();
  await page.getByRole('tab', { name: 'Watch' }).click();
  await expect(page.getByRole('tab', { name: 'Watch' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#combined-watch-content')).toBeVisible();

  await page.getByRole('tab', { name: 'Listen' }).click();
  await expect(page.getByRole('tab', { name: 'Listen' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#combined-listen-content')).toBeVisible();
});

test('opens and closes a work detail modal', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'View Full Project Details' }).first().click();
  await expect(page.locator('#modalOverlay')).toBeVisible();
  await expect(page.locator('#modalContent')).toContainText('Wintering');

  await page.locator('#modalOverlay button').first().click();
  await expect(page.locator('#modalOverlay')).toBeHidden();
});

test('opens and closes a YouTube modal without playing video', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Listen & Watch' }).click();
  await page.getByRole('tab', { name: 'Watch' }).click();
  await page.getByRole('button', { name: /^Watch / }).first().click();

  await expect(page.locator('#videoModalOverlay')).toBeVisible();
  await expect(page.locator('#videoFrame')).toHaveAttribute('src', /youtube\.com\/embed/);

  await page.getByRole('button', { name: 'Close video' }).click();
  await expect(page.locator('#videoModalOverlay')).toBeHidden();
  await expect(page.locator('#videoFrame')).toHaveAttribute('src', '');
});

test('searches works and shows the empty result state', async ({ page }) => {
  await page.goto('/#works');

  const search = page.locator('#worksSearchInput');
  await search.fill('Wintering');
  await expect(page.locator('#worksContainer')).toContainText('Wintering');

  await search.fill('No matching composition');
  await expect(page.locator('#worksContainer')).toContainText('No compositions found matching your search query.');
});

test('prefills a score request from the works list', async ({ page }) => {
  await page.goto('/#works');

  await page.locator('#worksSearchInput').fill('Wintering');
  await page.locator('#worksContainer').getByRole('button', { name: 'Score Request' }).click();

  await expect(page.locator('#tab-contact')).toBeVisible();
  await expect(page.getByPlaceholder('Specify work title or details...')).toHaveValue(/Wintering/);
});

test('uses mobile navigation to switch sections', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.locator('#mobileMenuToggle').click();
  await page.getByRole('button', { name: 'Contact' }).last().click();

  await expect(page.locator('#tab-contact')).toBeVisible();
  await expect(page.locator('#mobileMenu')).toBeHidden();
});

[
  ['works', '#tab-works'],
  ['listen', '#tab-watch-listen'],
  ['writing', '#tab-writing'],
  ['contact', '#tab-contact'],
].forEach(([anchor, sectionSelector]) => {
  test(`opens the ${anchor} deep link`, async ({ page }) => {
    await page.goto(`/#${anchor}`);

    await expect(page).toHaveURL(new RegExp(`#${anchor}$`));
    await expect(page.locator(sectionSelector)).toBeVisible();
  });
});

test('has no serious or critical accessibility violations on the homepage', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  const blockingViolations = results.violations.filter(
    violation => ['serious', 'critical'].includes(violation.impact),
  );

  expect(blockingViolations).toEqual([]);
});
