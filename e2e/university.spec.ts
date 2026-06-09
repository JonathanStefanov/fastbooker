import { test, expect } from '@playwright/test';

test.describe('University Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/it');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Accept disclaimer
    const acceptBtn = page.getByRole('button', { name: /I Understand|Ho Capito|J'ai compris/i });
    await acceptBtn.click();
  });

  test('shows university modal with search', async ({ page }) => {
    const uniModal = page.locator('[data-testid="university-modal"]');
    await expect(uniModal).toBeVisible({ timeout: 5000 });

    // Should have a search input
    const search = uniModal.getByPlaceholder(/search|cerca|rechercher/i);
    await expect(search).toBeVisible();

    // Should show at least one university
    await expect(uniModal.getByText('ULB').first()).toBeVisible();
  });

  test('can search for universities', async ({ page }) => {
    const uniModal = page.locator('[data-testid="university-modal"]');
    await expect(uniModal).toBeVisible({ timeout: 5000 });

    const search = uniModal.getByPlaceholder(/search|cerca|rechercher/i);
    await search.fill('EPFL');

    await expect(uniModal.getByText('EPFL').first()).toBeVisible();
  });

  test('selecting a university closes modal and persists', async ({ page }) => {
    const uniModal = page.locator('[data-testid="university-modal"]');
    await expect(uniModal).toBeVisible({ timeout: 5000 });

    // Click on ULB inside the modal
    await uniModal.getByText('ULB').first().click();

    // Modal should close
    await expect(uniModal).toBeHidden();

    // University should persist in localStorage
    const saved = await page.evaluate(() => localStorage.getItem('selectedUniversity'));
    expect(saved).toBe('ulb');

    // Navbar should show the university badge
    await expect(page.locator('[data-testid="university-badge"]')).toBeVisible();
  });

  test('persists university across reloads', async ({ page }) => {
    const uniModal = page.locator('[data-testid="university-modal"]');
    await expect(uniModal).toBeVisible({ timeout: 5000 });

    await uniModal.getByText('ULB').first().click();
    await expect(uniModal).toBeHidden();

    // Reload — modal should not reappear
    await page.reload();
    const disclaimer = page.locator('[data-testid="disclaimer-modal"]');
    await expect(disclaimer).toBeHidden();

    const uniModalAfter = page.locator('[data-testid="university-modal"]');
    await expect(uniModalAfter).toBeHidden();

    // Navbar should still show university badge
    await expect(page.locator('[data-testid="university-badge"]')).toBeVisible();
  });
});
