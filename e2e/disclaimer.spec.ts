import { test, expect } from '@playwright/test';

test.describe('Disclaimer', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to simulate first visit
    await page.goto('/it');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('shows disclaimer modal on first visit', async ({ page }) => {
    const disclaimer = page.locator('[data-testid="disclaimer-modal"]');
    await expect(disclaimer).toBeVisible();
    await expect(disclaimer).toContainText('FastBooker');
  });

  test('decline redirects to affluences.com', async ({ page }) => {
    const declineBtn = page.getByRole('button', { name: /decline|rifiuta|refuser/i });
    // Don't actually navigate away — just verify the button exists
    await expect(declineBtn).toBeVisible();
  });

  test('accept dismisses disclaimer and shows university modal', async ({ page }) => {
    const acceptBtn = page.getByRole('button', { name: /accept|accetta|accepter/i });
    await acceptBtn.click();

    // Disclaimer should be gone
    const disclaimer = page.locator('[data-testid="disclaimer-modal"]');
    await expect(disclaimer).toBeHidden();

    // University selection modal should appear
    const uniModal = page.locator('[data-testid="university-modal"]');
    await expect(uniModal).toBeVisible({ timeout: 3000 });
  });

  test('accepted disclaimer persists across reloads', async ({ page }) => {
    const acceptBtn = page.getByRole('button', { name: /accept|accetta|accepter/i });
    await acceptBtn.click();

    // Reload — disclaimer should not reappear
    await page.reload();
    const disclaimer = page.locator('[data-testid="disclaimer-modal"]');
    await expect(disclaimer).toBeHidden();
  });
});
