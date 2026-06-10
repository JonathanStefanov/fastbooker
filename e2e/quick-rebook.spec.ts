import { test, expect } from '@playwright/test';

test.describe('Quick Rebook', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('disclaimer-accepted', 'true');
      localStorage.setItem('selectedUniversity', 'ulb');
    });
    await page.reload();
  });

  test('does not show quick rebook when no history', async ({ page }) => {
    await expect(page.locator('[data-testid="quick-rebook-btn"]')).not.toBeVisible();
  });

  test('shows quick rebook when booking history exists', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('fastbooker-booking-history', JSON.stringify([{
        seatId: '12345',
        seatName: 'E 1 01',
        libraryId: 'lib-1',
        floorId: 'floor-1',
        date: '2026-06-09',
        startTime: '09:00',
        endTime: '12:00',
        email: 'test@ulb.be',
        bookedAt: Date.now(),
      }]));
    });
    await page.reload();

    await expect(page.getByText(/book again/i)).toBeVisible();
    await expect(page.getByText('E 1 01')).toBeVisible();
    await expect(page.getByText('09:00 → 12:00')).toBeVisible();
    await expect(page.locator('[data-testid="quick-rebook-btn"]')).toBeVisible();
  });

  test('shows "today" label for today\'s booking', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    await page.evaluate((date) => {
      localStorage.setItem('fastbooker-booking-history', JSON.stringify([{
        seatId: '12345',
        seatName: 'E 1 01',
        libraryId: 'lib-1',
        floorId: 'floor-1',
        date,
        startTime: '09:00',
        endTime: '12:00',
        email: 'test@ulb.be',
        bookedAt: Date.now(),
      }]));
    }, today);
    await page.reload();

    await expect(page.getByText(/today/i)).toBeVisible();
  });

  test('view seat button navigates to floor page', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('fastbooker-booking-history', JSON.stringify([{
        seatId: '12345',
        seatName: 'E 1 01',
        libraryId: 'lib-1',
        floorId: 'floor-1',
        date: '2026-06-09',
        startTime: '09:00',
        endTime: '12:00',
        email: 'test@ulb.be',
        bookedAt: Date.now(),
      }]));
    });
    await page.reload();

    await page.getByRole('button', { name: /view/i }).click();
    await expect(page).toHaveURL(/\/library\/lib-1\/floor\/floor-1/);
  });
});
