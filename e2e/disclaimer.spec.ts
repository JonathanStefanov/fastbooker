import { test, expect } from '@playwright/test';

test.describe('Disclaimer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('shows disclaimer modal on first visit', async ({ page }) => {
    const disclaimer = page.locator('[data-testid="disclaimer-modal"]');
    await expect(disclaimer).toBeVisible();
    await expect(disclaimer).toContainText('FastBooker');
  });

  test('decline button is visible', async ({ page }) => {
    const disclaimer = page.locator('[data-testid="disclaimer-modal"]');
    await expect(disclaimer).toBeVisible();
    const buttons = disclaimer.locator('button');
    await expect(buttons).toHaveCount(2);
  });

  test('accept dismisses disclaimer and shows university modal', async ({ page }) => {
    const acceptBtn = page.getByRole('button', { name: /i understand/i });
    await acceptBtn.click();

    const disclaimer = page.locator('[data-testid="disclaimer-modal"]');
    await expect(disclaimer).toBeHidden();

    const uniModal = page.locator('[data-testid="university-modal"]');
    await expect(uniModal).toBeVisible({ timeout: 5000 });
  });

  test('accepted disclaimer persists across reloads', async ({ page }) => {
    const acceptBtn = page.getByRole('button', { name: /i understand/i });
    await acceptBtn.click();

    await page.reload();
    const disclaimer = page.locator('[data-testid="disclaimer-modal"]');
    await expect(disclaimer).toBeHidden();
  });
});
