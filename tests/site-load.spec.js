const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

async function mockPlaybackProviders(page) {
  await page.addInitScript(() => {
    window.__spotifyCalls = [];
    window.__spotifyIFrameApi = {
      createController: (_container, _options, callback) => {
        const controller = {
          loadUri: uri => window.__spotifyCalls.push(['loadUri', uri]),
          seek: position => window.__spotifyCalls.push(['seek', position]),
          play: () => window.__spotifyCalls.push(['play']),
          pause: () => window.__spotifyCalls.push(['pause']),
        };
        callback(controller);
      },
    };

    window.__soundCloudCalls = [];
    const Widget = element => {
      const handlers = {};
      const player = {
        bind: (event, handler) => { handlers[event] = handler; },
        getDuration: callback => callback(60_000),
        getPosition: callback => callback(0),
        pause: () => {
          window.__soundCloudCalls.push(['pause', element.id]);
          handlers.PAUSE?.();
        },
        play: () => {
          window.__soundCloudCalls.push(['play', element.id]);
          handlers.PLAY?.();
        },
        seekTo: position => window.__soundCloudCalls.push(['seekTo', element.id, position]),
      };
      window.__soundCloudPlayers ??= {};
      window.__soundCloudPlayers[element.id] = { handlers, player };
      return player;
    };
    Widget.Events = {
      READY: 'READY',
      PLAY: 'PLAY',
      PAUSE: 'PAUSE',
      FINISH: 'FINISH',
      ERROR: 'ERROR',
    };
    window.SC = { Widget };
  });

  await page.route('https://w.soundcloud.com/player/api.js', route =>
    route.fulfill({ contentType: 'application/javascript', body: '' }),
  );
  await page.route('https://open.spotify.com/embed/iframe-api/v1', route => route.abort());
}

test('loads the site and renders primary navigation', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Samantha Fernando - Composer');
  await expect(page.getByRole('navigation')).toContainText('Biography');
  await expect(page.getByRole('button', { name: 'Home' }).first()).toHaveClass(/text-amber-400/);
  await expect(page.getByRole('button', { name: 'Works List' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Listen & Watch' })).toBeVisible();
});

test('switches to the works list and filters by category', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Works List' }).click();
  await expect(page).toHaveURL(/#works$/);
  await expect(page.locator('#tab-works')).toBeVisible();
  await expect(page.locator('#worksContainer')).toContainText('Wintering');
  await expect(page.locator('#worksFilterToolbar')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Search works by title or instrumentation' })).toBeVisible();
  await expect(page.locator('#worksFilterToolbar')).toContainText('Instrumentation: All');

  await page.getByRole('button', { name: 'Instrumentation: All' }).click();
  await expect(page.getByRole('option', { name: 'Opera & Stage' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('option', { name: 'Opera & Stage' })).toBeHidden();

  await page.getByRole('button', { name: 'Instrumentation: All' }).click();
  await page.getByRole('option', { name: 'Opera & Stage' }).click();
  await expect(page.locator('#worksContainer')).toContainText('glass human');
  await expect(page.locator('#worksContainer')).not.toContainText('Wintering');
});

test('hero actions navigate to their destinations', async ({ page }) => {
  await page.goto('/');

  await page.locator('.hero-actions').getByRole('button', { name: 'Listen' }).click();
  await expect(page.locator('#tab-works')).toBeVisible();
  await expect(page.locator('#works-view-listen')).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/');
  await page.locator('.hero-actions').getByRole('button', { name: 'Explore works' }).click();
  await expect(page.locator('#tab-works')).toBeVisible();

  await page.goto('/');
  await page.locator('.hero-actions').getByRole('button', { name: 'Get in touch' }).click();
  await expect(page.locator('#tab-contact')).toBeVisible();
});

test('Biography opens as the shared in-page route', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Biography' }).click();
  await expect(page).toHaveURL(/#bio$/);
  await expect(page.locator('#tab-bio')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Samantha Fernando' })).toBeVisible();
  await expect(page.locator('#tab-bio')).toContainText('In recent years, her music');
  await page.getByRole('button', { name: /Commissions, score hire/ }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('#tab-contact')).toBeVisible();
});

test('restores site sections with browser Back and Forward', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Works List' }).click();
  await page.getByRole('button', { name: 'Writing' }).click();
  await expect(page).toHaveURL(/#writing$/);

  await page.goBack();
  await expect(page).toHaveURL(/#works$/);
  await expect(page.locator('#tab-works')).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#tab-home')).toBeVisible();

  await page.goForward();
  await expect(page).toHaveURL(/#works$/);
  await expect(page.locator('#tab-works')).toBeVisible();
});

test('restores Listen and Watch views with browser Back', async ({ page }) => {
  await page.goto('/#works');

  await page.locator('#works-view-listen').click();
  await page.locator('#works-view-watch').click();
  await expect(page).toHaveURL(/#watch$/);

  await page.goBack();
  await expect(page).toHaveURL(/#listen$/);
  await expect(page.locator('#works-view-listen')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#worksContainer .work-media-action').first()).toBeVisible();
});

test('toggles the visual theme', async ({ page }) => {
  await page.goto('/');

  await page.locator('#themeToggleBtn').click();
  await expect(page.locator('body')).not.toHaveClass(/light-mode/);

  await page.locator('#themeToggleBtn').click();
  await expect(page.locator('body')).toHaveClass(/light-mode/);
});

test('opens and closes the mobile navigation menu @mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menuButton = page.locator('#mobileMenuToggle');
  const menu = page.locator('#mobileMenu');

  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('button', { name: 'Home' })).toBeVisible();
  await expect(menu.getByRole('button', { name: 'Biography' })).toBeVisible();
  await expect(menu.getByRole('button', { name: 'Contact' })).toBeVisible();

  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeHidden();
});

test('keeps mobile header controls and hero content usable @mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menuButton = page.locator('#mobileMenuToggle');
  const portrait = page.locator('#tab-home .lg\\:col-span-5 img');
  const introduction = page.locator('.hero-introduction');

  await expect(menuButton).toBeVisible();
  await expect(portrait).toBeVisible();
  await expect(introduction).toBeVisible();
  await menuButton.click();
  await expect(page.locator('#mobileMenu')).toBeVisible();
});

test('uses the shared Instrumentation menu on mobile @mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#works');

  await page.getByRole('button', { name: 'Instrumentation: All' }).click();
  await expect(page.getByRole('option', { name: 'Opera & Stage' })).toBeVisible();
  await page.getByRole('option', { name: 'Opera & Stage' }).click();
  await expect(page.locator('#worksContainer')).toContainText('glass human');
  await expect(page.locator('#worksContainer')).not.toContainText('Wintering');
});

test('uses a compact portrait on mobile Biography @mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#bio');

  await expect(page.locator('.bio-mobile-portrait')).toBeVisible();
  await expect(page.locator('#tab-bio aside > figure')).toBeHidden();
});

test('aligns Works and Listen CTAs with card content on mobile @mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#works');

  const wintering = page.locator('#worksContainer > div', { has: page.getByRole('heading', { name: 'Wintering' }) });
  const worksAction = wintering.getByRole('button', { name: 'Watch Wintering (Trailer)' });
  await expect(worksAction).toHaveText('Trailer');
  const worksContent = wintering.locator('div').first();
  expect((await worksAction.boundingBox()).x).toBe((await worksContent.boundingBox()).x);

  await page.locator('#works-view-listen').click();
  const listenAction = page.locator('#worksContainer .work-media-action').first();
  const listenCard = page.locator('#worksContainer > div').first();
  const listenContent = listenCard.locator('div').first();
  expect((await listenAction.boundingBox()).x).toBe((await listenContent.boundingBox()).x);
});

test('mobile preview uses the real mobile viewport', async ({ page }) => {
  await page.goto('/');
  await page.locator('#mobilePreviewBtn').click();

  const dialog = page.locator('#mobilePreviewDialog');
  const preview = page.frameLocator('#mobilePreviewFrame');
  await expect(dialog).toBeVisible();
  await expect(page.locator('#mobilePreviewBtn')).toHaveAttribute('aria-pressed', 'true');
  await expect(preview.locator('#mobileMenuToggle')).toBeVisible();
  await expect(preview.locator('header nav')).toBeHidden();
  await expect(preview.locator('html')).toHaveClass(/mobile-preview-session/);

  await page.locator('#closeMobilePreview').click();
  await expect(dialog).toBeHidden();
  await expect(page.locator('#mobilePreviewBtn')).toHaveAttribute('aria-pressed', 'false');
});

test('submits the contact form through Formspree', async ({ page }) => {
  await page.goto('/');
  await page.route('https://formspree.io/f/mlgqqjen', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  await page.getByRole('button', { name: 'Contact' }).click();
  await expect(page.locator('#tab-contact')).toBeVisible();

  await page.getByPlaceholder('Name...').fill('Test Visitor');
  await page.getByPlaceholder('Email...').fill('test@example.com');
  await page.getByPlaceholder('Specify work title or details...').fill('Test inquiry');
  await page.getByRole('button', { name: 'Send Inquiry Message' }).click();

  await expect(page.locator('#contactToast')).toBeVisible();
  await expect(page.locator('#contactToast')).toContainText('Message sent successfully');
});

test('shows a contact error when Formspree rejects the submission', async ({ page }) => {
  await page.goto('/#contact');
  await page.route('https://formspree.io/f/mlgqqjen', async route => {
    await route.fulfill({ status: 422, contentType: 'application/json', body: '{}' });
  });

  await page.getByPlaceholder('Name...').fill('Test Visitor');
  await page.getByPlaceholder('Email...').fill('test@example.com');
  await page.getByPlaceholder('Specify work title or details...').fill('Test inquiry');
  await page.getByRole('button', { name: 'Send Inquiry Message' }).click();

  await expect(page.locator('#contactError')).toBeVisible();
  await expect(page.locator('#contactError')).toContainText('Unable to send your message');
});

test('filters the Listen view by instrumentation', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Listen & Watch' }).click();
  await expect(page.locator('#tab-works')).toBeVisible();
  await expect(page.locator('#works-view-listen')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#worksContainer .work-media-action').first()).toBeVisible();

  await page.getByRole('button', { name: 'Instrumentation: All' }).click();
  await page.getByRole('option', { name: 'Vocal & Choral', exact: true }).click();
  await expect(page.locator('#worksInstrumentationLabel')).toHaveText('Vocal & Choral');
  await expect(page.locator('#worksContainer')).toContainText('Everything Passes, Everything is Connected');
  await expect(page.locator('#worksContainer h3', { hasText: 'Balconies' })).toHaveCount(0);
});

test('shows Wintering watch CTA in All Works', async ({ page }) => {
  await page.goto('/#works');

  const wintering = page.locator('#worksContainer > div', { has: page.getByRole('heading', { name: 'Wintering' }) });
  await expect(wintering.getByRole('button', { name: 'Watch Wintering (Trailer)' })).toBeVisible();
});

test('shows CTAs for title variants linked to works', async ({ page }) => {
  await page.goto('/#works');

  for (const [workTitle, mediaTitle] of [
    ['glass human', 'glass human - Official Trailer'],
    ['Current, Rising', "Current, Rising: The World's First Hyper-Reality Opera"],
    ['Fault-Line', 'Fault Line for Solo Cello']
  ]) {
    const work = page.locator('#worksContainer > div', { has: page.getByRole('heading', { name: workTitle, exact: true }) });
    await expect(work.getByRole('button', { name: `Watch ${mediaTitle}` })).toBeVisible();
  }
});

test('resets filters when switching between Works, Listen and Watch views', async ({ page }) => {
  await page.goto('/#listen');
  const search = page.locator('#worksSearchInput');

  await search.fill('Vocal');
  await page.getByRole('button', { name: 'Instrumentation: All' }).click();
  await page.getByRole('option', { name: 'Vocal & Choral', exact: true }).click();

  await page.locator('#works-view-watch').click();
  await expect(page).toHaveURL(/#watch$/);
  await expect(page.locator('#works-view-watch')).toHaveAttribute('aria-pressed', 'true');
  await expect(search).toHaveValue('');
  await expect(page.locator('#worksInstrumentationLabel')).toHaveText('Instrumentation: All');
  await expect(page.locator('#worksContainer')).toContainText('Composition for Voice & Electronics');
  await expect(page.locator('#worksContainer').getByRole('button', { name: 'Watch Sound Inhabitants' })).toBeVisible();

  await page.locator('#works-view-all').click();
  await expect(page).toHaveURL(/#works$/);
  await expect(page.locator('#works-view-all')).toHaveAttribute('aria-pressed', 'true');
  await expect(search).toHaveValue('');
  await expect(page.locator('#worksInstrumentationLabel')).toHaveText('Instrumentation: All');
  await expect(page.locator('#worksContainer')).toContainText('Wintering');
});

test('soundbar progress display is present and non-interactive', async ({ page }) => {
  await page.goto('/');

  const progress = page.locator('#soundbarProgress');
  await expect(progress).toHaveAttribute('role', 'progressbar');
  await expect(progress).toHaveAttribute('aria-valuenow', '0');
  await expect(progress).toHaveAttribute('aria-valuemax', '0');
  await expect(page.locator('#soundbarProgress button, #soundbarProgress input')).toHaveCount(0);
  await expect(page.locator('#soundbarElapsedTime')).toHaveText('0:00');
  await expect(page.locator('#soundbarDurationTime')).toBeHidden();
  await expect(page.locator('#soundbarPauseBtn')).toHaveAttribute('aria-label', 'Pause playback');
  await expect(page.locator('#soundbarRestartBtn')).toHaveAttribute('aria-label', 'Restart track');
  await expect(page.locator('#soundbarStopBtn')).toHaveAttribute('aria-label', 'Stop playback');
});

test('soundbar starts with the default track name', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#soundbarLabel')).toHaveText('Everything Passes, Everything is Connected · The Crossing');
  await page.getByRole('button', { name: 'Listen & Watch' }).click();
  await expect(page.locator('#worksContainer [data-spotify-track="3YV79qjiJLOgYjjEzTsVEy"]')).toBeVisible();
});

test('lists confirmed Listen metadata without placeholder details', async ({ page }) => {
  await page.goto('/#listen');

  const works = page.locator('#worksContainer');
  await expect(works).toContainText('The Journey Between Us - Reflection 1');
  await expect(works).toContainText('How Many Moments Must');
  const spotifyCard = works.locator('[data-spotify-track="2wNL47uCuwDpbOqCIpbSTS"]').locator('../..');
  await expect(spotifyCard).toContainText('Solo & Chamber');
  await expect(spotifyCard).toContainText('6:53');
  await expect(spotifyCard.getByRole('button', { name: 'Preview' })).toBeVisible();
  await expect(spotifyCard).not.toContainText('30 sec preview');
  await expect(spotifyCard).not.toContainText('Spotify');
  await expect(works).not.toContainText('[Missing Spotify title]');
  await expect(works).not.toContainText('[Missing duration]');
});

test('keeps Works view controls legible in light mode', async ({ page }) => {
  await page.goto('/#listen');

  await expect(page.locator('#works-view-listen')).toHaveCSS('background-color', 'rgb(111, 53, 8)');
  await expect(page.locator('#works-view-listen')).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(page.locator('#works-view-all')).toHaveCSS('background-color', 'rgb(232, 225, 213)');
  await expect(page.locator('#works-view-all')).toHaveCSS('color', 'rgb(24, 33, 31)');
});

test('Spotify loads the selected first track from the beginning', async ({ page }) => {
  await mockPlaybackProviders(page);
  await page.goto('/');
  await page.evaluate(() => window.onSpotifyIframeApiReady(window.__spotifyIFrameApi));
  await page.getByRole('button', { name: 'Listen & Watch' }).click();

  await page.locator('#worksContainer [data-spotify-track="2wNL47uCuwDpbOqCIpbSTS"]').click();

  await expect(page.locator('#soundbarLabel')).toHaveText('Balconies · Olivia de Prato');
  await expect.poll(() => page.evaluate(() => window.__spotifyCalls)).toContainEqual([
    'loadUri',
    'spotify:track:2wNL47uCuwDpbOqCIpbSTS',
  ]);
  await expect.poll(() => page.evaluate(() => window.__spotifyCalls)).toContainEqual(['seek', 0]);
  await expect(page.locator('#soundbarDurationTime')).toHaveText('0:30');
  await expect(page.locator('#soundbarProgress')).toHaveAttribute('aria-valuemax', '30000');
});

test('SoundCloud and Spotify playback are mutually exclusive', async ({ page }) => {
  await mockPlaybackProviders(page);
  await page.goto('/');
  await page.evaluate(() => window.onSpotifyIframeApiReady(window.__spotifyIFrameApi));
  await page.getByRole('button', { name: 'Listen & Watch' }).click();

  await page.locator('#worksContainer [data-spotify-track="2wNL47uCuwDpbOqCIpbSTS"]').click();
  await page.locator('#worksContainer [data-track="look-up"]').click();
  await expect.poll(() => page.evaluate(() => Boolean(window.__soundCloudPlayers?.soundcloudPlayerLookUp))).toBe(true);
  await page.evaluate(() => window.__soundCloudPlayers.soundcloudPlayerLookUp.handlers.READY());

  await expect(page.locator('#soundbarLabel')).toHaveText('Look Up · 4 voices, viola da gamba and electronics');
  await expect(page.locator('#soundbarPauseBtn')).toHaveAttribute('aria-label', 'Pause playback');
  await expect.poll(() => page.evaluate(() => window.__spotifyCalls)).toContainEqual(['pause']);
  await expect.poll(() => page.evaluate(() => window.__soundCloudCalls)).toContainEqual(['play', 'soundcloudPlayerLookUp']);
});

test('SoundCloud queued playback responds to pause and finish events', async ({ page }) => {
  await mockPlaybackProviders(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Listen & Watch' }).click();

  await page.locator('#worksContainer [data-track="look-up"]').click();
  await expect.poll(() => page.evaluate(() => Boolean(window.__soundCloudPlayers?.soundcloudPlayerLookUp))).toBe(true);
  await page.evaluate(() => window.__soundCloudPlayers.soundcloudPlayerLookUp.handlers.READY());
  await expect(page.locator('#soundbarPauseBtn')).toHaveAttribute('aria-label', 'Pause playback');

  await page.locator('#soundbarPauseBtn').click();
  await expect(page.locator('#soundbarPauseBtn')).toHaveAttribute('aria-label', 'Resume playback');

  await page.evaluate(() => window.__soundCloudPlayers.soundcloudPlayerLookUp.handlers.FINISH());
  await page.getByRole('button', { name: 'Works List' }).click();
  await expect(page.locator('#soundbar')).toBeHidden();
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

test('opens and closes a featured project modal', async ({ page }) => {
  await page.goto('/');

  const trigger = page.getByRole('button', { name: 'View Full Project Details' }).first();
  await trigger.click();
  await expect(page.locator('#modalOverlay')).toBeVisible();
  await expect(page.locator('#modalContent')).toContainText('Wintering');
  await expect(page.getByRole('button', { name: 'Close project details' })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(page.locator('#modalOverlay')).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('opens and closes a YouTube modal without playing video', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await page.getByRole('button', { name: 'Listen & Watch' }).click();
  await page.locator('#works-view-watch').click();
  await page.locator('#worksContainer').getByRole('button', { name: /^Watch / }).first().click();

  await expect(page.locator('#videoModalOverlay')).toBeVisible();
  await expect(page.locator('#videoFrame')).toHaveAttribute('src', /youtube\.com\/embed/);

  await page.getByRole('button', { name: 'Close video' }).click();
  await expect(page.locator('#videoModalOverlay')).toBeHidden();
  await expect(page.locator('#videoFrame')).toHaveAttribute('src', '');
});

test('Listen and Watch views expose their selected state and deep links', async ({ page }) => {
  await page.goto('/#listen');

  await expect(page.locator('#works-view-listen')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#works-view-watch').click();
  await expect(page).toHaveURL(/#watch$/);
  await expect(page.locator('#works-view-watch')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#works-view-listen')).toHaveAttribute('aria-pressed', 'false');

  await page.getByRole('button', { name: 'Works', exact: true }).click();
  await expect(page).toHaveURL(/#works$/);
  await expect(page.locator('#works-view-all')).toHaveAttribute('aria-pressed', 'true');
});

test('deployed hostname shows the password gate and honours persisted unlocks', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Chromium maps the deployed hostname to the local server.');
  await page.goto('http://nicholascaplan.github.io:8000/');

  const gate = page.getByRole('dialog', { name: 'Private site' });
  await expect(gate).toBeVisible();
  await page.getByPlaceholder('Password').fill('invalid');
  await page.getByRole('button', { name: 'Enter site' }).click();
  await expect(page.getByRole('alert')).toHaveText('Incorrect password.');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(page.getByPlaceholder('Password')).toHaveAttribute('type', 'text');

  await page.evaluate(() => sessionStorage.setItem('siteUnlocked', 'true'));
  await page.reload();
  await expect(gate).toBeHidden();
  await expect(page.getByRole('navigation')).toBeVisible();
});

test('searches works and shows the empty result state', async ({ page }) => {
  await page.goto('/#works');

  const search = page.locator('#worksSearchInput');
  await search.fill('Wintering');
  await expect(page.locator('#worksContainer')).toContainText('Wintering');

  await search.fill('No matching composition');
  await expect(page.locator('#worksContainer')).toContainText('No compositions found matching your search query.');
});

test('uses mobile navigation to switch sections @mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.locator('#mobileMenuToggle').click();
  await page.getByRole('button', { name: 'Contact' }).last().click();

  await expect(page.locator('#tab-contact')).toBeVisible();
  await expect(page.locator('#mobileMenu')).toBeHidden();
});

[
  ['bio', '#tab-bio'],
  ['works', '#tab-works'],
  ['listen', '#tab-works'],
  ['watch', '#tab-works'],
  ['writing', '#tab-writing'],
  ['contact', '#tab-contact'],
].forEach(([anchor, sectionSelector]) => {
  test(`opens the ${anchor} deep link`, async ({ page }) => {
    await page.goto(`/#${anchor}`, { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(new RegExp(`#${anchor}$`));
    await expect(page.locator(sectionSelector)).toBeVisible();
  });
});

async function expectNoSeriousAxeViolations(page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  const blockingViolations = results.violations.filter(
    violation => ['serious', 'critical'].includes(violation.impact),
  );

  expect(blockingViolations).toEqual([]);
}

test('has no serious or critical accessibility violations across interactive states', async ({ page }) => {
  await page.goto('/');
  await expectNoSeriousAxeViolations(page);

  await page.getByRole('button', { name: 'Works List' }).click();
  await expectNoSeriousAxeViolations(page);

  await page.getByRole('button', { name: 'Listen & Watch' }).click();
  await expectNoSeriousAxeViolations(page);

  await page.getByRole('button', { name: 'Contact' }).click();
  await expectNoSeriousAxeViolations(page);

  await page.getByRole('button', { name: 'Biography' }).click();
  await expectNoSeriousAxeViolations(page);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#mobileMenuToggle').click();
  await expectNoSeriousAxeViolations(page);
});
