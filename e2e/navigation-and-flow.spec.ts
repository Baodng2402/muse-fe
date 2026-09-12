import { test, expect } from '@playwright/test';

test.describe('Muse Platform E2E Flows', () => {
  test('home page loads with editorial hero banner', async ({ page }) => {
    await page.goto('/');

    // Check title and hero content
    await expect(page).toHaveTitle(/Muse/i);
    await expect(page.getByText('Nơi tài năng tỏa sáng')).toBeVisible();

    // Check header CTA
    const postCta = page.getByRole('link', { name: /đăng tin ngay/i });
    await expect(postCta).toBeVisible();
  });

  test('posts feed page displays filters and posts', async ({ page }) => {
    await page.goto('/posts');

    // Verify main header
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Verify view mode toggles
    await expect(page.getByTitle(/xem dạng lưới 2 cột/i)).toBeVisible();
    await expect(page.getByTitle(/xem dạng danh sách 1 cột/i)).toBeVisible();
  });

  test('bookings page displays prompt for unauthenticated guest', async ({ page }) => {
    await page.goto('/bookings');

    // Should prompt login
    await expect(page.getByText(/đăng nhập để xem lịch hẹn/i)).toBeVisible();
  });

  test('search page renders discovery hub', async ({ page }) => {
    await page.goto('/search');

    // Verify search input
    const searchInput = page.getByPlaceholder(/tìm theo layout/i);
    await expect(searchInput).toBeVisible();

    // Verify category tiles
    await expect(page.getByText(/khám phá theo chuyên ngành/i)).toBeVisible();
  });
});
