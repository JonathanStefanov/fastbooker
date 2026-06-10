import { test, expect } from '@playwright/test';
import { mockLibraries, mockFloors, mockHeatmapData } from './fixtures/mock-data';

test.describe('Availability Heatmap', () => {
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

    // Mock heatmap API
    await page.route('**/api/heatmap**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockHeatmapData),
      });
    });

    // Mock seats API (for when clicking through to all-seats)
    await page.route('**/api/seats**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Mock all-seats API
    await page.route('**/api/all-seats**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
  });

  test('View Weekly Availability button visible on library page', async ({ page }) => {
    await page.goto('/en/library/lib-1');
    const btn = page.getByRole('link', { name: /weekly availability/i });
    await expect(btn).toBeVisible();
  });

  test('button navigates to heatmap page', async ({ page }) => {
    await page.goto('/en/library/lib-1');
    await page.getByRole('link', { name: /weekly availability/i }).click();
    await expect(page).toHaveURL(/\/library\/lib-1\/heatmap/);
    await expect(page.getByText(/weekly availability/i)).toBeVisible();
  });

  test('heatmap page shows day labels', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    await expect(page.getByText('Wed')).toBeVisible();
    await expect(page.getByText('Thu')).toBeVisible();
    await expect(page.getByText('Fri')).toBeVisible();
    await expect(page.getByText('Mon')).toBeVisible();
  });

  test('heatmap page shows time slot labels', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    await expect(page.getByText('08:00')).toBeVisible();
  });

  test('heatmap page shows legend', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    await expect(page.getByText(/plenty/i)).toBeVisible();
    await expect(page.getByText(/moderate/i)).toBeVisible();
    await expect(page.getByText(/few seats/i)).toBeVisible();
    await expect(page.getByText('Full (0%)').first()).toBeVisible();
  });

  test('today is highlighted', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    const todayChip = page.locator('.MuiChip-root', { hasText: 'Wed' });
    await expect(todayChip).toBeVisible();
  });

  test('clicking a cell navigates to all-seats with date', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    await expect(page.getByText('Wed')).toBeVisible();
    const cell = page.locator('[data-testid="heatmap-cell-2026-06-11-08:00"]');
    await cell.click();
    await expect(page).toHaveURL(/\/library\/lib-1\/all-seats\?date=2026-06-11/);
  });

  test('back button returns to library page', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    const backBtn = page.locator('button').first();
    await backBtn.click();
    await expect(page).toHaveURL(/\/library\/lib-1/);
  });

  test('heatmap shows hover tooltip', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    await expect(page.getByText('Wed')).toBeVisible();
    const cell = page.locator('[data-testid="heatmap-cell-2026-06-10-08:00"]');
    await cell.hover();
    await expect(page.getByText(/10 \/ 20 seats available/i)).toBeVisible();
  });

  test('empty days are not shown in grid', async ({ page }) => {
    await page.goto('/en/library/lib-1/heatmap');
    await expect(page.getByText('Wed')).toBeVisible();
    await expect(page.getByText('Thu')).toBeVisible();
    await expect(page.getByText('Fri')).toBeVisible();
    await expect(page.getByText('Mon')).toBeVisible();
    await expect(page.getByText('Tue')).toBeVisible();
    const dayChips = page.locator('.MuiChip-root');
    const chipTexts = await dayChips.allTextContents();
    expect(chipTexts).not.toContain('Sat');
    expect(chipTexts).not.toContain('Sun');
  });
});
