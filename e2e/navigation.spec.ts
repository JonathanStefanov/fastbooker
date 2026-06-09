import { test, expect } from '@playwright/test';
import { mockLibraries, mockFloors, mockSeats } from './fixtures/mock-data';

test.describe('Library Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept API calls
    await page.route('**/api/libraries**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockLibraries),
      });
    });

    // Set up: accept disclaimer + select university
    await page.goto('/it');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('disclaimer-accepted', 'true');
      localStorage.setItem('selectedUniversity', 'ulb');
    });
    await page.reload();
  });

  test('homepage shows library list', async ({ page }) => {
    // Wait for libraries to load
    await expect(page.getByText('Bibliothèque des Sciences')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Bibliothèque de Philosophie')).toBeVisible();
    await expect(page.getByText('Bibliothèque Droit')).toBeVisible();
  });

  test('clicking library navigates to detail page', async ({ page }) => {
    // Intercept floors API
    await page.route('**/api/**/floors**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockFloors),
      });
    }).catch(() => {});

    await expect(page.getByText('Bibliothèque des Sciences')).toBeVisible({ timeout: 10000 });
    await page.getByText('Bibliothèque des Sciences').click();

    // Should navigate to library detail page
    await expect(page).toHaveURL(/\/library\/lib-1/);
  });

  test('navbar shows university badge', async ({ page }) => {
    await expect(page.getByText('ULB')).toBeVisible({ timeout: 5000 });
  });

  test('can navigate back from library page', async ({ page }) => {
    await page.route('**/api/**/floors**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockFloors),
      });
    }).catch(() => {});

    await expect(page.getByText('Bibliothèque des Sciences')).toBeVisible({ timeout: 10000 });
    await page.getByText('Bibliothèque des Sciences').click();
    await expect(page).toHaveURL(/\/library\/lib-1/);

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/\/it$/);
  });
});

test.describe('Responsive Design', () => {
  test('mobile viewport renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone size
    await page.goto('/it');
    await page.evaluate(() => {
      localStorage.setItem('disclaimer-accepted', 'true');
      localStorage.setItem('selectedUniversity', 'ulb');
    });
    await page.reload();

    // Page should still render without horizontal overflow
    const body = page.locator('body');
    const box = await body.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(375);
  });
});
