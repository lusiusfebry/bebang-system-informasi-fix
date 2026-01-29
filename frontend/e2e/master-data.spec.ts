import { test, expect } from '@playwright/test';

test.describe('Master Data Management Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('NIK / Email').fill('999999');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: 'Sign in' }).click();
    });

    test('should manage Divisi', async ({ page }) => {
        await page.getByRole('link', { name: 'Master Data' }).click();
        await page.getByRole('link', { name: 'Divisi' }).click();

        // Create
        await page.getByRole('button', { name: 'Add Divisi' }).click();
        await page.getByLabel('Nama Divisi').fill('New Divisi');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('New Divisi')).toBeVisible();

        // Edit
        await page.getByRole('row', { name: 'New Divisi' }).getByRole('button', { name: 'Edit' }).click();
        await page.getByLabel('Nama Divisi').fill('Updated Divisi');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('Updated Divisi')).toBeVisible();

        // Delete
        await page.getByRole('row', { name: 'Updated Divisi' }).getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Confirm' }).click();
        await expect(page.getByText('Updated Divisi')).not.toBeVisible();
    });
});
