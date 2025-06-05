import { test, expect } from '@playwright/test';

test.describe('Load Posting Functionality - Issue #3', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
  });

  test('Load owner can access load posting form from dashboard', async ({ page }) => {
    // First register and login as a load owner
    await page.click('text=Register');
    await page.selectOption('select[name="userType"]', 'load_owner');
    await page.fill('input[name="name"]', 'Test Load Owner');
    await page.fill('input[name="email"]', 'loadowner@test.com');
    await page.fill('input[name="phone"]', '+1-555-0123');
    await page.fill('input[name="location"]', 'Seattle, WA');
    await page.fill('input[name="password"]', 'testpass123');
    await page.fill('input[name="confirmPassword"]', 'testpass123');
    await page.click('button[type="submit"]');
    
    // Should be redirected to load owner dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard/load-owner');
    
    // Click on "Post New Load" button
    await page.click('text=Post New Load');
    
    // Should navigate to load posting form
    await expect(page).toHaveURL('http://localhost:3000/loads/create');
    await expect(page.locator('h1')).toContainText('Post a New Load');
  });

  test('Load posting form has all required fields', async ({ page }) => {
    // Login as load owner first
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'loadowner@test.com');
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    
    // Navigate to load posting
    await page.goto('http://localhost:3000/loads/create');
    
    // Check all required fields are present
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('input[name="pickupLocation"]')).toBeVisible();
    await expect(page.locator('input[name="deliveryLocation"]')).toBeVisible();
    await expect(page.locator('input[name="weight"]')).toBeVisible();
    await expect(page.locator('input[name="dimensions"]')).toBeVisible();
    await expect(page.locator('input[name="pickupDate"]')).toBeVisible();
    await expect(page.locator('textarea[name="specialRequirements"]')).toBeVisible();
    await expect(page.locator('input[name="images"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Form validation works for required fields', async ({ page }) => {
    // Login and navigate to form
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'loadowner@test.com');
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.goto('http://localhost:3000/loads/create');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Description is required')).toBeVisible();
    await expect(page.locator('text=Pickup location is required')).toBeVisible();
    await expect(page.locator('text=Delivery location is required')).toBeVisible();
  });

  test('Load owner can successfully create a load', async ({ page }) => {
    // Login and navigate to form
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'loadowner@test.com');
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.goto('http://localhost:3000/loads/create');
    
    // Fill out the form
    await page.fill('input[name="title"]', 'Test Load - Moving Piano');
    await page.fill('textarea[name="description"]', 'Need to move a baby grand piano from my house to new apartment. Very delicate and valuable.');
    await page.fill('input[name="pickupLocation"]', '123 Main St, Seattle, WA');
    await page.fill('input[name="deliveryLocation"]', '456 Oak Ave, Bellevue, WA');
    await page.fill('input[name="weight"]', '300');
    await page.fill('input[name="dimensions"]', '150x140x100 cm');
    
    // Set pickup date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('input[name="pickupDate"]', dateString);
    
    await page.fill('textarea[name="specialRequirements"]', 'Fragile, requires piano moving equipment');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should show success message and redirect
    await expect(page.locator('text=Load posted successfully!')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/dashboard/load-owner');
  });

  test('Load appears in load owner dashboard after creation', async ({ page }) => {
    // Login and go to dashboard
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'loadowner@test.com');
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    
    // Should see the created load in dashboard
    await expect(page.locator('text=Test Load - Moving Piano')).toBeVisible();
    await expect(page.locator('text=Posted')).toBeVisible();
  });

  test('Form clears validation errors when user starts typing', async ({ page }) => {
    // Login and navigate to form
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'loadowner@test.com');
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.goto('http://localhost:3000/loads/create');
    
    // Submit empty form to trigger validation
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Title is required')).toBeVisible();
    
    // Start typing in title field
    await page.fill('input[name="title"]', 'T');
    
    // Error should disappear
    await expect(page.locator('text=Title is required')).not.toBeVisible();
  });

  test('Image upload functionality works', async ({ page }) => {
    // Login and navigate to form
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'loadowner@test.com');
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.goto('http://localhost:3000/loads/create');
    
    // Check that file input accepts images
    const fileInput = page.locator('input[name="images"]');
    await expect(fileInput).toHaveAttribute('accept', 'image/*');
    await expect(fileInput).toHaveAttribute('multiple');
  });

  test('Weight and dimensions validation works', async ({ page }) => {
    // Login and navigate to form
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'loadowner@test.com');
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.goto('http://localhost:3000/loads/create');
    
    // Try invalid weight
    await page.fill('input[name="weight"]', '-10');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Weight must be positive')).toBeVisible();
    
    // Fix weight
    await page.fill('input[name="weight"]', '100');
    await expect(page.locator('text=Weight must be positive')).not.toBeVisible();
  });

  test('Date validation prevents past dates', async ({ page }) => {
    // Login and navigate to form
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'loadowner@test.com');
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.goto('http://localhost:3000/loads/create');
    
    // Try to set pickup date to yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toISOString().split('T')[0];
    await page.fill('input[name="pickupDate"]', dateString);
    
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Pickup date cannot be in the past')).toBeVisible();
  });

  test('Only load owners can access load posting', async ({ page }) => {
    // Try to access load posting without login
    await page.goto('http://localhost:3000/loads/create');
    
    // Should be redirected to login
    await expect(page).toHaveURL('http://localhost:3000/auth/login');
    
    // Login as driver
    await page.fill('input[name="email"]', 'driver@test.com');
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    
    // Try to access load posting as driver
    await page.goto('http://localhost:3000/loads/create');
    
    // Should be redirected or show error
    await expect(page.locator('text=Access denied')).toBeVisible();
  });
}); 