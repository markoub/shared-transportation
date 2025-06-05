import { test, expect } from '@playwright/test';

test.describe('User Authentication System - Issue #2', () => {
  
  test.beforeEach(async ({ page }) => {
    // Start from the homepage
    await page.goto('/');
  });

  test('Load Owner registration flow works correctly', async ({ page }) => {
    // Click on Load Owner registration link
    await page.click('text=Get Started as Load Owner');
    
    // Should navigate to registration page with load owner type
    await expect(page).toHaveURL(/\/auth\/register\?type=load_owner/);
    
    // Fill out registration form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="phone"]', '+1-555-0123');
    await page.fill('input[name="location"]', 'Seattle, WA');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should see success message or redirect to dashboard
    await expect(page.locator('text=Registration successful')).toBeVisible();
  });

  test('Driver registration flow works correctly', async ({ page }) => {
    // Click on Driver registration link
    await page.click('text=Get Started as Driver');
    
    // Should navigate to registration page with driver type
    await expect(page).toHaveURL(/\/auth\/register\?type=driver/);
    
    // Fill out registration form
    await page.fill('input[name="name"]', 'Jane Smith');
    await page.fill('input[name="email"]', 'jane@example.com');
    await page.fill('input[name="phone"]', '+1-555-0124');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.fill('input[name="licenseInfo"]', 'CDL-A WA123456');
    await page.fill('input[name="serviceArea"]', 'Seattle Metro Area');
    await page.selectOption('select[name="vehicleType"]', 'Pickup Truck');
    await page.fill('input[name="vehicleCapacity"]', '1000');
    await page.fill('input[name="vehicleDimensions"]', '200x150x100');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should see success message or redirect to dashboard
    await expect(page.locator('text=Registration successful')).toBeVisible();
  });

  test('Login flow works correctly', async ({ page }) => {
    // Click on login link
    await page.click('text=Already have an account?');
    
    // Should navigate to login page
    await expect(page).toHaveURL('/auth/login');
    
    // Fill out login form
    await page.fill('input[name="email"]', 'sarah@example.com');
    await page.fill('input[name="password"]', 'demo123');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard or homepage with logged in state
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('Registration form validation works', async ({ page }) => {
    await page.goto('/auth/register?type=load_owner');
    
    // Try submitting empty form
    await page.click('button[type="submit"]');
    
    // Should see validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Phone is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('Login form validation works', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Try submitting empty form
    await page.click('button[type="submit"]');
    
    // Should see validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('Password confirmation validation works', async ({ page }) => {
    await page.goto('/auth/register?type=load_owner');
    
    // Fill passwords that don't match
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'different123');
    
    await page.click('button[type="submit"]');
    
    // Should see password mismatch error
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('Email format validation works', async ({ page }) => {
    await page.goto('/auth/register?type=load_owner');
    
    // Fill invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    
    // Should see email format error
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  });

  test('User session is maintained after login', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'sarah@example.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    // Navigate to another page
    await page.goto('/');
    
    // Should still be logged in (no login links visible)
    await expect(page.locator('text=Already have an account?')).not.toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('Logout functionality works', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'sarah@example.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    // Click logout
    await page.click('text=Logout');
    
    // Should be logged out and see login links again
    await expect(page.locator('text=Already have an account?')).toBeVisible();
    await expect(page.locator('text=Logout')).not.toBeVisible();
  });

  test('Different user types see appropriate dashboards', async ({ page }) => {
    // Test Load Owner dashboard
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'sarah@example.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Load Owner Dashboard')).toBeVisible();
    await expect(page.locator('text=Post New Load')).toBeVisible();
    
    // Logout and test Driver dashboard
    await page.click('text=Logout');
    
    await page.fill('input[name="email"]', 'tom@example.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Driver Dashboard')).toBeVisible();
    await expect(page.locator('text=Browse Loads')).toBeVisible();
  });
}); 