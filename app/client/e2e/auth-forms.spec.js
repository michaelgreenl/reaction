import { test, expect } from '@playwright/test';

const STRONG_PASSWORD = 'Password123';

test.beforeEach(async ({ page }) => {
    await page.route('**/users/check-auth', (route) => route.fulfill({ json: { success: false } }));
});

test.describe('login form', () => {
    test('sends the credentials and goes to the game on success', async ({ page }) => {
        let body;
        await page.route('**/users/login', async (route) => {
            body = route.request().postDataJSON();
            await route.fulfill({ json: { id: 1, username: 'tester' } });
        });

        await page.goto('/login');
        await page.getByTestId('username-input').fill('tester');
        await page.getByTestId('password-input').fill(STRONG_PASSWORD);
        await page.getByTestId('login-submit').click();

        await expect(page).toHaveURL(/\/game$/);
        expect(body).toEqual({ username: 'tester', password: STRONG_PASSWORD });
    });

    test('shows an error and clears the password when the server rejects it', async ({ page }) => {
        await page.route('**/users/login', (route) =>
            route.fulfill({ status: 401, json: { message: 'Invalid credentials' } }),
        );

        await page.goto('/login');
        await page.getByTestId('username-input').fill('tester');
        await page.getByTestId('password-input').fill('wrong');
        await page.getByTestId('login-submit').click();

        await expect(page.getByTestId('auth-error')).toBeVisible();
        await expect(page.getByTestId('password-input')).toHaveValue('');
        await expect(page).toHaveURL(/\/login$/);
    });
});

test.describe('register form', () => {
    for (const { name, password, retype } of [
        { name: 'passwords differ', password: STRONG_PASSWORD, retype: 'Password124' },
        { name: 'password is too short', password: 'Pass1', retype: 'Pass1' },
        { name: 'password has no uppercase letter', password: 'password1', retype: 'password1' },
        { name: 'password has no number', password: 'Password', retype: 'Password' },
    ]) {
        test(`blocks the request when the ${name}`, async ({ page }) => {
            let requested = false;
            await page.route('**/users/auth', (route) => {
                requested = true;
                return route.fulfill({ json: {} });
            });

            await page.goto('/register');
            await page.getByTestId('username-input').fill('tester');
            await page.getByTestId('password-input').fill(password);
            await page.getByTestId('retype-password-input').fill(retype);
            await page.getByTestId('register-submit').click();

            await expect(page.getByTestId('auth-error')).toBeVisible();
            await expect(page).toHaveURL(/\/register$/);
            expect(requested).toBe(false);
        });
    }

    test('sends the account and goes to login on success', async ({ page }) => {
        let body;
        await page.route('**/users/auth', async (route) => {
            body = route.request().postDataJSON();
            await route.fulfill({ json: { success: true } });
        });

        await page.goto('/register');
        await page.getByTestId('username-input').fill('tester');
        await page.getByTestId('password-input').fill(STRONG_PASSWORD);
        await page.getByTestId('retype-password-input').fill(STRONG_PASSWORD);
        await page.getByTestId('register-submit').click();

        await expect(page).toHaveURL(/\/login$/);
        expect(body).toEqual({ username: 'tester', password: STRONG_PASSWORD });
    });

    test('shows an error when the server rejects the account', async ({ page }) => {
        await page.route('**/users/auth', (route) =>
            route.fulfill({ status: 409, json: { message: 'Username taken' } }),
        );

        await page.goto('/register');
        await page.getByTestId('username-input').fill('tester');
        await page.getByTestId('password-input').fill(STRONG_PASSWORD);
        await page.getByTestId('retype-password-input').fill(STRONG_PASSWORD);
        await page.getByTestId('register-submit').click();

        await expect(page.getByTestId('auth-error')).toBeVisible();
        await expect(page).toHaveURL(/\/register$/);
    });
});
