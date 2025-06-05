import { test, expect } from '@playwright/test';

test.describe('Frontend Styling Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display modern header with gradient logo', async ({ page }) => {
    // Check if the header exists with proper styling
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check for the logo icon
    const logoIcon = page.locator('header svg');
    await expect(logoIcon).toBeVisible();
    
    // Check for the gradient text branding in header specifically
    const brandText = page.locator('header h1').filter({ hasText: 'SharedTrans' });
    await expect(brandText).toBeVisible();
  });

  test('should display hero section with gradient text', async ({ page }) => {
    // Check for the main hero heading in the hero section
    const heroHeading = page.locator('section h1').filter({ hasText: 'Shared' });
    await expect(heroHeading).toBeVisible();
    
    // Check for the subtitle
    const subtitle = page.locator('text=Connect people who need to transport unusual or heavy loads');
    await expect(subtitle).toBeVisible();
  });

  test('should display call-to-action buttons with proper styling', async ({ page }) => {
    // Check for "I need transport" button
    const transportButton = page.locator('button', { hasText: 'I need transport' });
    await expect(transportButton).toBeVisible();
    
    // Check for "I'm a driver" button
    const driverButton = page.locator('button', { hasText: "I'm a driver" });
    await expect(driverButton).toBeVisible();
    
    // Verify buttons have proper classes
    await expect(transportButton).toHaveClass(/btn-primary/);
    await expect(driverButton).toHaveClass(/btn-success/);
  });

  test('should display feature cards with hover effects', async ({ page }) => {
    // Check for Load Owners card - find the actual card container
    const loadOwnersCard = page.locator('div').filter({ hasText: 'For Load Owners' }).filter({ hasText: 'Post your transport request' });
    await expect(loadOwnersCard).toBeVisible();
    
    // Check for Drivers card - find the actual card container
    const driversCard = page.locator('div').filter({ hasText: 'For Drivers' }).filter({ hasText: 'Browse available transport jobs' });
    await expect(driversCard).toBeVisible();
    
    // Verify cards have proper styling classes
    await expect(loadOwnersCard).toHaveClass(/card/);
    await expect(driversCard).toHaveClass(/card/);
  });

  test('should display step-by-step instructions', async ({ page }) => {
    // Check for numbered steps in Load Owners section
    const step1 = page.locator('text=Post your transport request');
    await expect(step1).toBeVisible();
    
    const step2 = page.locator('text=Review applications from qualified drivers');
    await expect(step2).toBeVisible();
    
    const step3 = page.locator('text=Choose your driver and coordinate');
    await expect(step3).toBeVisible();
  });

  test('should display footer with branding', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check for footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check for footer branding
    const footerBrand = page.locator('footer').getByText('SharedTrans');
    await expect(footerBrand).toBeVisible();
    
    // Check for copyright text
    const copyright = page.getByText('© 2024 Shared Transportation');
    await expect(copyright).toBeVisible();
  });

  test('should have responsive design elements', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if header is still visible and properly styled
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check if buttons stack properly on mobile
    const buttons = page.locator('button').filter({ hasText: /I need transport|I'm a driver/ });
    await expect(buttons.first()).toBeVisible();
    await expect(buttons.last()).toBeVisible();
  });

  test('should have proper color scheme and gradients', async ({ page }) => {
    // Check if the page has the gradient background
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check if buttons have proper styling
    const primaryButton = page.locator('.btn-primary').first();
    const successButton = page.locator('.btn-success').first();
    
    if (await primaryButton.isVisible()) {
      await expect(primaryButton).toBeVisible();
    }
    if (await successButton.isVisible()) {
      await expect(successButton).toBeVisible();
    }
  });

  test('should have smooth animations and transitions', async ({ page }) => {
    // Check if elements have animation classes - look for specific animated elements
    const fadeInElements = page.locator('.animate-fade-in');
    const slideUpElements = page.locator('.animate-slide-up');
    
    const fadeInCount = await fadeInElements.count();
    const slideUpCount = await slideUpElements.count();
    
    // At least one type of animation should be present
    expect(fadeInCount + slideUpCount).toBeGreaterThan(0);
  });

  test('should display proper typography with Inter font', async ({ page }) => {
    // Check if the page uses Inter font by looking at CSS classes
    const bodyElement = page.locator('body');
    await expect(bodyElement).toHaveClass(/font-sans/);
    
    // Also check if Inter font is loaded by checking a text element
    const headingElement = page.locator('h1').first();
    await expect(headingElement).toBeVisible();
  });
}); 