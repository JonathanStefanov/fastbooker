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

  test('decline button is visible', async ({ page }) => {
    // Button text varies by locale: "Use Official App Instead" / "Usa l'App Ufficiale" / "App officielle"
    const disclaimer = page.locator('[data-testid="disclaimer-modal"]');
    await expect(disclaimer).toBeVisible();
    // Just verify there are two action buttons (decline + accept)
    const buttons = disclaimer.locator('button');
    await expect(buttons).toHaveCount(2);
  });

  test('accept dismisses disclaimer and shows university modal', async ({ page }) => {
    const acceptBtn = page.getByRole('button', { name: /I Understand|Ho Capito|J'ai compris/i });
    await acceptBtn.click();

    // Disclaimer should be gone
    const disclaimer = page.locator('[data-testid="disclaimer-modal"]');
    await expect(disclaimer).toBeHidden();

    // University selection modal should appear
    const uniModal = page.locator('[data-testid="university-modal"]');
    await expect(uniModal).toBeVisible({ timeout: 5000 });
  });

  test('accepted disclaimer persists across reloads', async ({ page }) => {
    const acceptBtn = page.getByRole('button', { name: /I Understand|Ho Capito|J'ai compris/i });
    await acceptBtn.click();

    // Reload — disclaimer should not reappear
    await page.reload();
    const disclaimer = page.locator('[data-testid="disclaimer-modal"]');
    await expect(disclaimer).toBeHidden();
  });
});
