const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:8000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'exec python3 -m http.server 8000',
    url: 'http://127.0.0.1:8000',
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'chromium',
      grepInvert: /@mobile/,
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--host-resolver-rules=MAP nicholascaplan.github.io 127.0.0.1'],
        },
      },
    },
    {
      name: 'firefox',
      grepInvert: /@mobile/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      grepInvert: /@mobile/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chromium',
      grep: /@mobile/,
      use: {
        ...devices['Pixel 5'],
        launchOptions: {
          args: ['--host-resolver-rules=MAP nicholascaplan.github.io 127.0.0.1'],
        },
      },
    },
  ],
});
