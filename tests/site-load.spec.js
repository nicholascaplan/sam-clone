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

test('hero actions navigate to their destinations', async ({ page }) => {
  await page.goto('/');

  await page.locator('.hero-actions').getByRole('button', { name: 'Listen' }).click();
  await expect(page.locator('#tab-watch-listen')).toBeVisible();

  await page.goto('/');
  await page.locator('.hero-actions').getByRole('button', { name: 'Explore works' }).click();
  await expect(page.locator('#tab-works')).toBeVisible();

  await page.goto('/');
  await page.locator('.hero-actions').getByRole('button', { name: 'Get in touch' }).click();
  await expect(page.locator('#tab-contact')).toBeVisible();
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

test('soundbar progress display is present and non-interactive', async ({ page }) => {
  await page.goto('/');

  const progress = page.locator('#soundbarProgress');
  await expect(progress).toHaveAttribute('role', 'progressbar');
  await expect(progress).toHaveAttribute('aria-valuenow', '0');
  await expect(progress).toHaveAttribute('aria-valuemax', '0');
  await expect(page.locator('#soundbarProgress button, #soundbarProgress input')).toHaveCount(0);
  await expect(page.locator('#soundbarElapsedTime')).toHaveText('0:00');
  await expect(page.locator('#soundbarDurationTime')).toHaveText('0:00');
  await expect(page.locator('#soundbarControls button')).toHaveCount(3);
  await expect(page.locator('#soundbarVisualizer')).toHaveCount(0);
});

test('header Listen control uses the shared playback toggle', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#ambientSoundBtn')).toHaveAttribute('onclick', 'toggleActivePlayback()');
});

test('soundbar starts with the default track name', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#soundbarLabel')).toHaveText('Everything Passes, Everything is Connected · The Crossing');
  await expect(page.locator('[data-spotify-track="3YV79qjiJLOgYjjEzTsVEy"]')).toHaveCount(2);
  await expect(page.locator('[data-spotify-track="3YV79qjiJLOgYjjEzTsVEy"]').first()).toContainText('Everything Passes, Everything is Connected');
});

test('Spotify playback resets to the beginning when a track loads', async ({ page }) => {
  await page.goto('/');

  const source = (await page.locator('script').allTextContents()).join('\n');
  expect(source).toContain('spotifyController.seek(0)');
});

test('header Listen opens the soundbar for the default track', async ({ page }) => {
  await page.goto('/');

  await page.locator('#ambientSoundBtn').click();

  await expect(page.locator('#soundbar')).toBeVisible();
  await expect(page.locator('#soundbarLabel')).toHaveText('Everything Passes, Everything is Connected · The Crossing');
});

test('soundbar stays visible while navigating between pages', async ({ page }) => {
  await page.goto('/');
  await page.locator('#ambientSoundBtn').click();
  await expect(page.locator('#soundbar')).toBeVisible();

  await page.getByRole('button', { name: 'Works List' }).click();

  await expect(page.locator('#tab-works')).toBeVisible();
  await expect(page.locator('#soundbar')).toBeVisible();
});

test('stopped playback is cleared when navigating away', async ({ page }) => {
  await page.goto('/');
  await page.locator('#ambientSoundBtn').click();
  await expect(page.locator('#soundbar')).toBeVisible();

  await expect(page.locator('#soundbarRestartBtn')).toHaveAttribute('aria-label', 'Restart track');
  await page.locator('#soundbarStopBtn').click();
  await expect(page.locator('#soundbarStopBtn')).toHaveAttribute('aria-label', 'Stop playback');

  await page.getByRole('button', { name: 'Works List' }).click();
  await expect(page.locator('#soundbar')).toBeHidden();
});

test('initialises navigation before the audio players', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Works List' }).click();
  await expect(page).toHaveURL(/#works$/);
  await expect(page.locator('#tab-works')).toBeVisible();
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
