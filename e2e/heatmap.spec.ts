import { test, expect } from '@playwright/test';
import { mockLibraries, mockFloors, mockHeatmapData } from './fixtures/mock-data';

test.describe('Availability Heatmap', () => {
  test.beforeEach(async ({ page }) => {
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
    await page.goto('/it/library/lib-1');
    // Italian translation: "Vedi disponibilità settimanale"
    const btn = page.getByRole('link', { name: /disponibilità settimanale/i });
    await expect(btn).toBeVisible();
  });

  test('button navigates to heatmap page', async ({ page }) => {
    await page.goto('/it/library/lib-1');
    await page.getByRole('link', { name: /disponibilità settimanale/i }).click();
    await expect(page).toHaveURL(/\/library\/lib-1\/heatmap/);
    // Italian page title: "Disponibilità settimanale"
    await expect(page.getByText(/disponibilità settimanale/i)).toBeVisible();
  });

  test('heatmap page shows day labels', async ({ page }) => {
    await page.goto('/it/library/lib-1/heatmap');
    // Should show day names from mock data
    await expect(page.getByText('Wed')).toBeVisible();
    await expect(page.getByText('Thu')).toBeVisible();
    await expect(page.getByText('Fri')).toBeVisible();
    await expect(page.getByText('Mon')).toBeVisible();
  });

  test('heatmap page shows time slot labels', async ({ page }) => {
    await page.goto('/it/library/lib-1/heatmap');
    // Should show at least some time labels
    await expect(page.getByText('08:00')).toBeVisible();
  });

  test('heatmap page shows legend', async ({ page }) => {
    await page.goto('/it/library/lib-1/heatmap');
    // Italian legend: Molti, Moderato, Pochi posti, Pieno
    await expect(page.getByText(/molti/i)).toBeVisible();
    await expect(page.getByText(/moderato/i)).toBeVisible();
    await expect(page.getByText(/pochi posti/i)).toBeVisible();
    await expect(page.getByText(/pieno/i)).toBeVisible();
  });

  test('today is highlighted', async ({ page }) => {
    await page.goto('/it/library/lib-1/heatmap');
    // Today's chip (Wed) should have primary background — check it exists
    const todayChip = page.locator('.MuiChip-root', { hasText: 'Wed' });
    await expect(todayChip).toBeVisible();
  });

  test('clicking a cell navigates to all-seats with date', async ({ page }) => {
    await page.goto('/it/library/lib-1/heatmap');
    // Wait for heatmap to render
    await expect(page.getByText('Wed')).toBeVisible();
    // Click a cell for June 11 (Thu)
    const cell = page.locator('[data-testid="heatmap-cell-2026-06-11-08:00"]');
    await cell.click();
    await expect(page).toHaveURL(/\/library\/lib-1\/all-seats\?date=2026-06-11/);
  });

  test('back button returns to library page', async ({ page }) => {
    await page.goto('/it/library/lib-1/heatmap');
    // Click back button (the arrow icon button)
    await page.locator('button').filter({ has: page.locator('svg[data-testid="ArrowBackIcon"]') }).click();
    await expect(page).toHaveURL(/\/library\/lib-1$/);
  });

  test('heatmap shows hover tooltip', async ({ page }) => {
    await page.goto('/it/library/lib-1/heatmap');
    await expect(page.getByText('Wed')).toBeVisible();
    // Hover over a cell
    const cell = page.locator('[data-testid="heatmap-cell-2026-06-10-08:00"]');
    await cell.hover();
    // Tooltip should show seat count (Italian: "posti disponibili")
    await expect(page.getByText(/posti disponibili/i)).toBeVisible();
    await expect(page.getByText(/clicca per vedere/i)).toBeVisible();
  });

  test('empty days are not shown in grid', async ({ page }) => {
    await page.goto('/it/library/lib-1/heatmap');
    // Sat and Sun have empty slots, should not appear as columns
    // (they're filtered out by validDays)
    await expect(page.getByText('Wed')).toBeVisible();
    await expect(page.getByText('Thu')).toBeVisible();
    await expect(page.getByText('Fri')).toBeVisible();
    await expect(page.getByText('Mon')).toBeVisible();
    await expect(page.getByText('Tue')).toBeVisible();
    // Sat and Sun should NOT be visible (empty slots)
    await expect(page.getByText('Sat')).not.toBeVisible();
    await expect(page.getByText('Sun')).not.toBeVisible();
  });
});
