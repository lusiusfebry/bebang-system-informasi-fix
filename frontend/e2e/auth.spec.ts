import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should login successfully with valid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('NIK / Email').fill('999999'); // Adjust credentials as needed
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: 'Sign in' }).click();

        await expect(page).toHaveURL('/dashboard');
        await expect(page.getByText('Admin User')).toBeVisible(); // Adjust name
    });

    test('should show error with invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('NIK / Email').fill('999999');
        await page.getByLabel('Password').fill('wrongpass');
        await page.getByRole('button', { name: 'Sign in' }).click();

        await expect(page.getByText('NIK atau password salah')).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.getByLabel('NIK / Email').fill('999999');
        await page.getByLabel('Password').fill('admin123');
        await page.getByRole('button', { name: 'Sign in' }).click();
        await expect(page).toHaveURL('/dashboard');

        // Logout
        await page.getByRole('img', { name: 'User' }).click(); // Profile dropdown
        await page.getByText('Sign out').click();

        await expect(page).toHaveURL('/login');
    });
});
