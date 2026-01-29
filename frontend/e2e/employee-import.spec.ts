import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Import Employee Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('NIK / Email').fill('999999');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: 'Sign in' }).click();
    });

    test('should upload and import excel file', async ({ page }) => {
        await page.getByRole('link', { name: 'Import' }).click();

        // Upload file
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.getByRole('button', { name: 'Upload Excel' }).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(__dirname, 'mock_data.xlsx'));

        // Preview
        await expect(page.getByText('Preview Data')).toBeVisible();
        await expect(page.getByText('Valid Rows')).toBeVisible();

        // Confirm
        await page.getByRole('button', { name: 'Confirm Import' }).click();

        await expect(page.getByText('Import successful')).toBeVisible();
    });
});
