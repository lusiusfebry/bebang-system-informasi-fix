import { test, expect } from '@playwright/test';

test.describe('Create Employee Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/login');
        await page.getByLabel('NIK / Email').fill('999999');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: 'Sign in' }).click();
        await expect(page).toHaveURL('/dashboard');
    });

    test('should create a new employee', async ({ page }) => {
        await page.getByRole('link', { name: 'Karyawan' }).click();
        await page.getByRole('button', { name: 'Tambah Karyawan' }).click();

        // Personal Info
        await page.getByLabel('Nama Lengkap').fill('Test Employee');
        await page.getByLabel('NIK', { exact: true }).fill('NIK12345');
        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Tempat Lahir').fill('Jakarta');
        await page.getByRole('button', { name: 'Next' }).click();

        // HR Info
        // Assuming Select components need specific interaction
        // Simplify for now, waiting for real implementation details
        await page.getByRole('button', { name: 'Next' }).click();

        // Family Info
        await page.getByRole('button', { name: 'Submit' }).click();

        await expect(page.getByText('Employee created successfully')).toBeVisible();
    });
});
