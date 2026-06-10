import { test, expect } from '@playwright/test';
import { mockLibraries, mockFloors, mockOccupancyData } from './fixtures/mock-data';

test.describe('Occupancy Heatmap', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
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

    // Mock occupancy API
    await page.route('**/api/occupancy**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOccupancyData),
      });
    });
  });

  test('View Occupancy button visible on library page', async ({ page }) => {
    await page.goto('/en/library/lib-1');
    const btn = page.getByRole('link', { name: /occupancy/i });
    await expect(btn).toBeVisible();
  });

  test('button navigates to occupancy page', async ({ page }) => {
    await page.goto('/en/library/lib-1');
    await page.getByRole('link', { name: /occupancy/i }).click();
    await expect(page).toHaveURL(/\/library\/lib-1\/heatmap/);
    await expect(page.getByText(/occupancy/i).first()).toBeVisible();
  });

  test('occupancy page shows site name', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    await expect(page.getByText('Bibliothèque des Sciences')).toBeVisible();
  });

  test('occupancy page shows forecast bars', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    await expect(page.getByText('16:30')).toBeVisible();
    await expect(page.getByText('17:00')).toBeVisible();
    await expect(page.getByText('19:00')).toBeVisible();
  });

  test('occupancy page shows percentages', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    await expect(page.getByText('60%').first()).toBeVisible();
    await expect(page.getByText('55%').first()).toBeVisible();
    await expect(page.getByText('25%')).toBeVisible();
  });

  test('occupancy page shows buildings', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    await expect(page.getByText('Bâtiment GE')).toBeVisible();
    await expect(page.getByText('Bâtiment D')).toBeVisible();
  });

  test('occupancy page shows legend', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    await expect(page.getByText(/quiet/i).first()).toBeVisible();
    await expect(page.getByText(/moderate/i).first()).toBeVisible();
  });

  test('back button returns to library page', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    const backBtn = page.locator('button').first();
    await backBtn.click();
    await expect(page).toHaveURL(/\/library\/lib-1/);
  });

  test('hovering shows tooltip', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    await expect(page.getByText('16:30')).toBeVisible();
    const bar = page.locator('[data-testid="occupancy-bar-16:30"]');
    await bar.hover();
    await expect(page.getByText(/60% occupancy/i)).toBeVisible();
  });
});
