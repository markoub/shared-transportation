import { test, expect } from '@playwright/test';

test.describe('Homepage Redesign with shadcn/ui', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display modern header with branding', async ({ page }) => {
    // Check for SharedTrans branding
    await expect(page.locator('h1:has-text("SharedTrans")')).toBeVisible();
    
    // Check navigation buttons exist (they might be hidden on mobile)
    await expect(page.locator('button:has-text("Login"), a:has-text("Login")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Get Started"), a:has-text("Get Started")').first()).toBeVisible();
  });

  test('should display trust indicators and hero section', async ({ page }) => {
    // Check trust badge
    await expect(page.locator('text=Trusted by 10,000+ users')).toBeVisible();
    
    // Check main heading
    await expect(page.locator('h1:has-text("Smart Load")')).toBeVisible();
    
    // Check hero description
    await expect(page.locator('text=Connect with professional drivers')).toBeVisible();
    
    // Check CTA buttons with icons
    await expect(page.getByRole('button', { name: 'I need transport' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'I\'m a driver' })).toBeVisible();
  });

  test('should display stats section with impressive metrics', async ({ page }) => {
    // Check key stats are visible
    await expect(page.locator('text=10K+')).toBeVisible();
    await expect(page.locator('text=25K+')).toBeVisible();
    await expect(page.locator('text=50+')).toBeVisible();
    
    // Check stat labels
    await expect(page.locator('text=Active Users')).toBeVisible();
    await expect(page.locator('text=Completed Jobs')).toBeVisible();
    await expect(page.locator('text=Cities')).toBeVisible();
  });

  test('should display feature cards with proper structure', async ({ page }) => {
    // Check "How it works" section
    await expect(page.locator('text=Simple steps to connect')).toBeVisible();
    
    // Check Load Owners card
    await expect(page.locator('text=For Load Owners')).toBeVisible();
    await expect(page.locator('text=Need something transported?')).toBeVisible();
    
    // Check Drivers card
    await expect(page.locator('text=For Drivers')).toBeVisible();
    await expect(page.locator('text=Own a truck or van?')).toBeVisible();
    
    // Check CTA buttons in cards
    await expect(page.getByRole('button', { name: 'Start as Load Owner' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start as Driver' })).toBeVisible();
  });

  test('should display trust section with security features', async ({ page }) => {
    // Check trust section heading
    await expect(page.locator('text=Why choose SharedTrans?')).toBeVisible();
    
    // Check trust features
    await expect(page.locator('text=Secure & Insured')).toBeVisible();
    await expect(page.locator('text=Trusted Community')).toBeVisible();
    await expect(page.locator('text=Top Rated')).toBeVisible();
  });

  test('should display professional footer', async ({ page }) => {
    // Check copyright
    await expect(page.locator('text=© 2024 SharedTrans')).toBeVisible();
    await expect(page.locator('text=Connecting communities through smart logistics')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Test that registration links exist
    await expect(page.locator('a[href="/auth/register?type=load_owner"]').first()).toBeVisible();
    await expect(page.locator('a[href="/auth/register?type=driver"]').first()).toBeVisible();
  });

  test('should display icons properly', async ({ page }) => {
    // Check that icons are rendered (SVG elements)
    const icons = page.locator('svg');
    await expect(icons.first()).toBeVisible();
    
    // Should have multiple icons throughout the page
    const iconCount = await icons.count();
    expect(iconCount).toBeGreaterThan(5);
  });

  test('should have modern design elements', async ({ page }) => {
    // Check that badges are styled properly
    await expect(page.locator('text=Trusted by 10,000+ users')).toBeVisible();
    
    // Check that main content is visible
    await expect(page.locator('h1:has-text("Smart Load")')).toBeVisible();
    
    // Check that the page loads without errors
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('h1:has-text("SharedTrans")')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1:has-text("SharedTrans")')).toBeVisible();
  });
}); 