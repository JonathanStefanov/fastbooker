import { test, expect } from '@playwright/test';
import { mockLibraries, mockFloors, mockSeatData } from './fixtures/mock-data';

test.describe('Favorites', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('disclaimer-accepted', 'true');
      localStorage.setItem('selectedUniversity', 'ulb');
    });
    await page.reload();

    await page.route('**/api/libraries**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockLibraries),
      });
    });

    await page.route('**/api/**/floors**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockFloors),
      });
    });

    await page.route('**/api/seats**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSeatData),
      });
    });
  });

  test('can favorite a seat on floor page', async ({ page }) => {
    await page.goto('/en/library/lib-1/floor/floor-1');
    await page.waitForSelector('[data-testid^="favorite-btn-"]');
    const btn = page.locator('[data-testid^="favorite-btn-"]').first();
    await btn.click();
    await expect(btn.locator('svg')).toHaveAttribute('data-testid', 'FavoriteIcon');
  });

  test('favorite persists after navigation', async ({ page }) => {
    await page.goto('/en/library/lib-1/floor/floor-1');
    await page.waitForSelector('[data-testid^="favorite-btn-"]');
    const btn = page.locator('[data-testid^="favorite-btn-"]').first();
    await btn.click();
    await page.goto('/en');
    await page.goto('/en/library/lib-1/floor/floor-1');
    await page.waitForSelector('[data-testid^="favorite-btn-"]');
    const btnAgain = page.locator('[data-testid^="favorite-btn-"]').first();
    await expect(btnAgain.locator('svg')).toHaveAttribute('data-testid', 'FavoriteIcon');
  });

  test('can unfavorite a seat', async ({ page }) => {
    await page.goto('/en/library/lib-1/floor/floor-1');
    await page.waitForSelector('[data-testid^="favorite-btn-"]');
    const btn = page.locator('[data-testid^="favorite-btn-"]').first();
    await btn.click();
    await expect(btn.locator('svg')).toHaveAttribute('data-testid', 'FavoriteIcon');
    await btn.click();
    await expect(btn.locator('svg')).toHaveAttribute('data-testid', 'FavoriteBorderIcon');
  });

  test('favorites-only filter works', async ({ page }) => {
    await page.goto('/en/library/lib-1/floor/floor-1');
    await page.waitForSelector('[data-testid^="favorite-btn-"]');
    const btn = page.locator('[data-testid^="favorite-btn-"]').first();
    await btn.click();
    await page.click('[data-testid="favorites-only-toggle"]');
    const seats = page.locator('[data-testid^="seat-tile-"]');
    await expect(seats).toHaveCount(1);
  });
});
