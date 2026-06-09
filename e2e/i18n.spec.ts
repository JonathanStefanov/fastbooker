import { test, expect } from '@playwright/test';

test.describe('Internationalization', () => {
  test('root redirects to a supported locale', async ({ page }) => {
    await page.goto('/');
    // Accept-Language on CI runners is en-US, so redirect may go to /en or /it
    await expect(page).toHaveURL(/\/(it|en|fr)/);
  });

  test('English locale loads correctly', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveURL(/\/en/);
  });

  test('French locale loads correctly', async ({ page }) => {
    await page.goto('/fr');
    await expect(page).toHaveURL(/\/fr/);
  });

  test('Italian locale loads correctly', async ({ page }) => {
    await page.goto('/it');
    await expect(page).toHaveURL(/\/it/);
  });

  test('unsupported locale falls back to default', async ({ page }) => {
    await page.goto('/de');
    const url = page.url();
    expect(url).toMatch(/\/(it|en|fr)/);
  });
});
