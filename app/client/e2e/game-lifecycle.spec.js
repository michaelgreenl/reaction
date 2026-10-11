import { test, expect } from '@playwright/test';

// Countdown is 3s, then circles spawn every 1s and shrink in 1s (default settings).
const ROUND_TIMEOUT = 10_000;

test.beforeEach(async ({ page }) => {
    await page.route('**/users/check-auth', (route) => route.fulfill({ json: { success: false } }));
});

test('a round starts, scores a hit, ends on a miss, and restarts from zero', async ({ page }) => {
    await page.goto('/game');

    await page.getByTestId('start-button').click();

    const hudScore = page.getByTestId('hud').getByTestId('score');
    const circle = page.getByTestId('canvas').getByTestId('circle').first();
    await expect(circle).toBeVisible({ timeout: ROUND_TIMEOUT });
    await expect(hudScore).toHaveText('0');

    // The circle shrinks the whole time it is on screen, so it never counts as "stable".
    // eslint-disable-next-line playwright/no-force-option
    await circle.click({ force: true });
    await expect(hudScore).toHaveText('1');

    const endScreen = page.getByTestId('end-screen');
    await expect(endScreen).toBeVisible({ timeout: ROUND_TIMEOUT });
    await expect(page.getByTestId('canvas')).toBeHidden();
    await expect(endScreen.getByTestId('score')).toHaveText('1');

    await page.getByTestId('start-button').click();

    await expect(page.getByTestId('hud').getByTestId('score')).toHaveText('0', { timeout: ROUND_TIMEOUT });
    await expect(endScreen).toBeHidden();
});
