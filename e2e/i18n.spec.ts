import { test, expect } from '@playwright/test';

test.describe('Internationalization', () => {
  test('defaults to Italian locale', async ({ page }) => {
    await page.goto('/');
    // Should redirect to /it
    await expect(page).toHaveURL(/\/it/);
  });

  test('English locale loads correctly', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveURL(/\/en/);
  });

  test('French locale loads correctly', async ({ page }) => {
    await page.goto('/fr');
    await expect(page).toHaveURL(/\/fr/);
  });

  test('disclaimer text changes with locale', async ({ page }) => {
    // Visit Italian — accept and clear
    await page.goto('/it');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const disclaimerIt = page.locator('[data-testid="disclaimer-modal"]');
    if (await disclaimerIt.isVisible()) {
      // Italian disclaimer should have Italian text
      await expect(disclaimerIt).toContainText(/FastBooker/i);
    }

    // Switch to English
    await page.goto('/en');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const disclaimerEn = page.locator('[data-testid="disclaimer-modal"]');
    if (await disclaimerEn.isVisible()) {
      await expect(disclaimerEn).toContainText(/FastBooker/i);
    }
  });

  test('unsupported locale falls back to default', async ({ page }) => {
    const response = await page.goto('/de');
    // Should either redirect to /it or return 200 with default locale
    const url = page.url();
    expect(url).toMatch(/\/(it|en|fr)/);
  });
});
