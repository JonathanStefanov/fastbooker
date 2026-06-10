import { test, expect } from '@playwright/test';
import { mockLibraries, mockFloors, mockSeatData } from './fixtures/mock-data';

test.describe('Favorites', () => {
  test.beforeEach(async ({ page }) => {
    // Set up: accept disclaimer + select university via localStorage
    await page.goto('/it');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('disclaimer-accepted', 'true');
      localStorage.setItem('selectedUniversity', 'ulb');
    });
    await page.reload();

    // Mock libraries API
    await page.route('**/api/libraries**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockLibraries),
      });
    });

    // Mock floors API
    await page.route('**/api/**/floors**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockFloors),
      });
    });

    // Mock seats API
    await page.route('**/api/seats**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSeatData),
      });
    });
  });

  test('can favorite a seat on floor page', async ({ page }) => {
    await page.goto('/it/library/lib-1/floor/floor-1');
    // Wait for seats to load
    await page.waitForSelector('[data-testid^="favorite-btn-"]');
    // Click the first favorite button
    const btn = page.locator('[data-testid^="favorite-btn-"]').first();
    await btn.click();
    // Verify the icon changed (filled heart)
    await expect(btn.locator('svg')).toHaveAttribute('data-testid', 'FavoriteIcon');
  });

  test('favorite persists after navigation', async ({ page }) => {
    await page.goto('/it/library/lib-1/floor/floor-1');
    await page.waitForSelector('[data-testid^="favorite-btn-"]');
    const btn = page.locator('[data-testid^="favorite-btn-"]').first();
    await btn.click();
    // Navigate away and back
    await page.goto('/it');
    await page.goto('/it/library/lib-1/floor/floor-1');
    await page.waitForSelector('[data-testid^="favorite-btn-"]');
    // Should still be favorited
    const btnAgain = page.locator('[data-testid^="favorite-btn-"]').first();
    await expect(btnAgain.locator('svg')).toHaveAttribute('data-testid', 'FavoriteIcon');
  });

  test('can unfavorite a seat', async ({ page }) => {
    await page.goto('/it/library/lib-1/floor/floor-1');
    await page.waitForSelector('[data-testid^="favorite-btn-"]');
    const btn = page.locator('[data-testid^="favorite-btn-"]').first();
    // Favorite
    await btn.click();
    await expect(btn.locator('svg')).toHaveAttribute('data-testid', 'FavoriteIcon');
    // Unfavorite
    await btn.click();
    await expect(btn.locator('svg')).toHaveAttribute('data-testid', 'FavoriteBorderIcon');
  });

  test('favorites-only filter works', async ({ page }) => {
    await page.goto('/it/library/lib-1/floor/floor-1');
    await page.waitForSelector('[data-testid^="favorite-btn-"]');
    // Favorite first seat
    const btn = page.locator('[data-testid^="favorite-btn-"]').first();
    await btn.click();
    // Toggle favorites-only
    await page.click('[data-testid="favorites-only-toggle"]');
    // Should only show favorited seat(s)
    const seats = page.locator('[data-testid^="seat-tile-"]');
    await expect(seats).toHaveCount(1);
  });
});
