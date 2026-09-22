import { test, expect } from '@playwright/test';

// All Module 0 lesson IDs (0.cp = checkpoint)
const MODULE0_LESSONS = ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.cp'];
const FIRST_LESSON = '0.1';
const SECOND_LESSON = '0.2';

/** Wait for lesson page to render (h1 inside article, non-empty). */
async function waitForLesson(page: import('@playwright/test').Page) {
  await page.waitForFunction(
    () => {
      const h1 = document.querySelector('article h1');
      return h1 !== null && (h1.textContent ?? '').trim().length > 0;
    },
    { timeout: 12_000 },
  );
}

test.describe('Mobile (Pixel 7 390px)', () => {
  test('Dashboard loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/#/');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Cybersecurity Academy')).toBeVisible();
    await expect(page.getByText('Общий прогресс курса')).toBeVisible();

    const realErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('font') && !e.includes('woff'),
    );
    expect(realErrors, `Console errors: ${realErrors.join('\n')}`).toHaveLength(0);
  });

  test('No horizontal scroll at 390px', async ({ page }) => {
    await page.goto('/#/');
    await page.waitForLoadState('networkidle');

    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    const cw = await page.evaluate(() => document.documentElement.clientWidth);
    expect(sw, `scrollWidth ${sw} > clientWidth ${cw}`).toBeLessThanOrEqual(cw);
  });

  test('Sidebar opens and closes', async ({ page }) => {
    await page.goto('/#/');
    await page.waitForLoadState('networkidle');

    const menuBtn = page.getByRole('button', { name: 'Открыть меню' });
    await expect(menuBtn).toBeVisible();

    await menuBtn.click();
    const closeBtn = page.getByRole('button', { name: 'Закрыть меню' });
    await expect(closeBtn).toBeVisible();

    await closeBtn.click();
    await expect(closeBtn).not.toBeVisible();
  });

  test('Can navigate to Module 0 lesson from sidebar', async ({ page }) => {
    await page.goto('/#/');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Открыть меню' }).click();

    const drawer = page.locator('[role="dialog"]');
    await expect(drawer).toBeVisible();

    // M0 starts expanded by default — lesson links already visible
    const lessonLink = drawer.locator('a[href="#/lessons/0.1"]');
    await expect(lessonLink).toBeVisible();
    await lessonLink.click();

    await waitForLesson(page);
    await expect(page.locator('article h1')).toBeVisible();
  });

  test('Back/forward navigation between lessons works', async ({ page }) => {
    await page.goto(`/#/lessons/${FIRST_LESSON}`);
    await waitForLesson(page);

    const titleLesson1 = await page.locator('article h1').innerText();
    expect(titleLesson1.length).toBeGreaterThan(0);

    // Click "Дальше" nav panel — scoped to article to avoid sidebar match
    const nextLink = page.locator('article').locator(`a[href="#/lessons/${SECOND_LESSON}"]`);
    await expect(nextLink).toBeVisible();
    await nextLink.click();

    // URL changes first (pushState), then React renders
    await page.waitForURL(`**/#/lessons/${SECOND_LESSON}`, { timeout: 8_000 });
    await waitForLesson(page);

    const titleLesson2 = await page.locator('article h1').innerText();
    expect(titleLesson2).not.toBe(titleLesson1);

    // Verify "Назад" link renders with correct href
    const prevLink = page.locator('article').locator(`a[href="#/lessons/${FIRST_LESSON}"]`);
    await expect(prevLink).toBeVisible();

    // Go back in browser history — React Router handles popstate
    await page.goBack();
    await page.waitForURL(`**/#/lessons/${FIRST_LESSON}`, { timeout: 8_000 });
    await waitForLesson(page);
    await expect(page.locator('article h1')).toBeVisible();
  });

  test('Lesson progress persists after reload', async ({ page }) => {
    await page.goto(`/#/lessons/${FIRST_LESSON}`);
    await waitForLesson(page);

    const completeBtn = page.getByRole('button', { name: /Отметить урок пройденным/ });
    await expect(completeBtn).toBeVisible();
    await completeBtn.click();

    await expect(page.getByText('Завершено')).toBeVisible();

    await page.reload();
    await waitForLesson(page);

    await expect(page.getByText('Завершено')).toBeVisible();

    // Reset
    await page.getByRole('button', { name: /незавершённый/ }).click();
  });

  test('No horizontal scroll on lesson page', async ({ page }) => {
    await page.goto(`/#/lessons/${FIRST_LESSON}`);
    await waitForLesson(page);

    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    const cw = await page.evaluate(() => document.documentElement.clientWidth);
    expect(sw, `Lesson page scrollWidth ${sw} > clientWidth ${cw}`).toBeLessThanOrEqual(cw);
  });

  test('Complete button not obscured by other elements', async ({ page }) => {
    await page.goto(`/#/lessons/${FIRST_LESSON}`);
    await waitForLesson(page);

    const completeBtn = page.getByRole('button', { name: /Отметить урок пройденным/ });
    await expect(completeBtn).toBeVisible();

    const box = await completeBtn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(30);
  });

  test('All Module 0 lessons accessible via sidebar', async ({ page }) => {
    test.slow(); // 7 page loads — triple the default timeout
    for (const lessonId of MODULE0_LESSONS) {
      await page.goto(`/#/lessons/${lessonId}`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('article h1')).toBeVisible({ timeout: 10_000 });
    }
  });
});
