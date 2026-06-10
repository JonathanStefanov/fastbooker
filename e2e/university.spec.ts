import { test, expect } from '@playwright/test';

test.describe('University Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const acceptBtn = page.getByRole('button', { name: /i understand/i });
    await acceptBtn.click();
  });

  test('shows university modal with search', async ({ page }) => {
    const uniModal = page.locator('[data-testid="university-modal"]');
    await expect(uniModal).toBeVisible({ timeout: 5000 });

    const search = uniModal.getByPlaceholder(/search/i);
    await expect(search).toBeVisible();

    await expect(uniModal.getByText('ULB').first()).toBeVisible();
  });

  test('can search for universities', async ({ page }) => {
    const uniModal = page.locator('[data-testid="university-modal"]');
    await expect(uniModal).toBeVisible({ timeout: 5000 });

    const search = uniModal.getByPlaceholder(/search/i);
    await search.fill('EPFL');

    await expect(uniModal.getByText('EPFL').first()).toBeVisible();
  });

  test('selecting a university closes modal and persists', async ({ page }) => {
    const uniModal = page.locator('[data-testid="university-modal"]');
    await expect(uniModal).toBeVisible({ timeout: 5000 });

    await uniModal.getByText('ULB').first().click();
    await expect(uniModal).toBeHidden();

    const saved = await page.evaluate(() => localStorage.getItem('selectedUniversity'));
    expect(saved).toBe('ulb');

    await expect(page.locator('[data-testid="university-badge"]')).toBeVisible();
  });

  test('persists university across reloads', async ({ page }) => {
    const uniModal = page.locator('[data-testid="university-modal"]');
    await expect(uniModal).toBeVisible({ timeout: 5000 });

    await uniModal.getByText('ULB').first().click();
    await expect(uniModal).toBeHidden();

    await page.reload();
    const disclaimer = page.locator('[data-testid="disclaimer-modal"]');
    await expect(disclaimer).toBeHidden();

    const uniModalAfter = page.locator('[data-testid="university-modal"]');
    await expect(uniModalAfter).toBeHidden();

    await expect(page.locator('[data-testid="university-badge"]')).toBeVisible();
  });
});
