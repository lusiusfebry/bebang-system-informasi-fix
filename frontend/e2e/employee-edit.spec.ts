import { test, expect } from '@playwright/test';

test.describe('Edit Employee Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('NIK / Email').fill('999999');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: 'Sign in' }).click();
    });

    test('should edit employee details', async ({ page }) => {
        await page.getByRole('link', { name: 'Karyawan' }).click();

        // Search for employee
        await page.getByPlaceholder('Search...').fill('Test Employee');
        await page.getByRole('button', { name: 'Edit' }).first().click();

        // Edit name
        await page.getByLabel('Nama Lengkap').fill('Test Employee Updated');
        await page.getByRole('button', { name: 'Save Changes' }).click();

        await expect(page.getByText('Employee updated successfully')).toBeVisible();
        await expect(page.getByText('Test Employee Updated')).toBeVisible();
    });
});
