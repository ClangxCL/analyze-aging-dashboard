import { test, expect } from '@playwright/test';

test.describe('Analyze Aging Dashboard E2E', () => {

  test('should mount dashboard and hydrate KPI summary cards', async ({ page }) => {
    await page.goto('/aging_dashboard.html');
    await expect(page).toHaveTitle(/Analyze Aging/);

    // Verify KPI card hydration
    const targetPop = page.locator('#kpi-target-pop');
    await expect(targetPop).not.toHaveText('-', { timeout: 10000 });

    const screenedCount = page.locator('#kpi-screened-count');
    await expect(screenedCount).not.toHaveText('-');

    const coverageBadge = page.locator('#kpi-coverage-badge');
    await expect(coverageBadge).toContainText('%');
  });

  test('should render TOP Rank leaderboard and respond to limit buttons', async ({ page }) => {
    await page.goto('/aging_dashboard.html');

    // Wait for leaderboard table rows
    const rows = page.locator('#ranking-table-body tr');
    await expect(rows).toHaveCount(10, { timeout: 10000 });

    // Switch to Top 5
    await page.click('#btn-limit-5');
    await expect(rows).toHaveCount(5);
  });

  test('should render Thailand choropleth map with SVG paths and tooltip', async ({ page }) => {
    await page.goto('/aging_dashboard.html');

    // Wait for SVG province paths to render
    const provincePaths = page.locator('#thailand-map-svg path');
    await expect(provincePaths.first()).toBeVisible({ timeout: 10000 });
    const count = await provincePaths.count();
    expect(count).toBeGreaterThan(70);

    // Hover over a province to check tooltip visibility
    await provincePaths.first().hover();
    const tooltip = page.locator('#map-tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('อัตราความเสี่ยง');
  });

  test('should switch domain filter and synchronize UI components', async ({ page }) => {
    await page.goto('/aging_dashboard.html');

    // Change domain to d6_depression
    await page.selectOption('#filter-domain', 'd6_depression');

    // Verify title reflects depression
    const leaderboardTitle = page.locator('#leaderboard-title');
    await expect(leaderboardTitle).toContainText('ภาวะซึมเศร้า', { timeout: 10000 });

    const domainTitle = page.locator('#kpi-active-domain-title');
    await expect(domainTitle).toContainText('ซึมเศร้า');
  });

  test('should open Validation Loop Health modal displaying 5 validated loops', async ({ page }) => {
    await page.goto('/aging_dashboard.html');

    // Click validation pill in header
    const pill = page.locator('#validation-pill');
    await expect(pill).toBeVisible();
    await pill.click();

    // Verify modal appears with 5 loops
    const modal = page.locator('#validation-modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Ingestion & Schema Contract Loop');
    await expect(modal).toContainText('Transformation & Invariant Loop');
    await expect(modal).toContainText('Hierarchical Rollup Loop');
    await expect(modal).toContainText('Geo-Spatial Topological Join Loop');
    await expect(modal).toContainText('Serving & Perception Telemetry Loop');

    // Close modal
    await page.locator('#validation-modal button:has-text("ปิดหน้าต่าง")').click();
    await expect(modal).toBeHidden();
  });

});
