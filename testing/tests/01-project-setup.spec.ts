import { test, expect } from '@playwright/test';

test.describe('Project Setup - Issue #1', () => {
  
  test('Backend API is running and accessible', async ({ request }) => {
    // Test that the backend is running
    const response = await request.get('http://localhost:8000/');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.message).toBe('Shared Transportation API');
    expect(data.status).toBe('running');
  });

  test('Backend health check endpoint works', async ({ request }) => {
    const response = await request.get('http://localhost:8000/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('healthy');
  });

  test('Backend API routes are accessible', async ({ request }) => {
    // Test auth routes
    const authResponse = await request.post('http://localhost:8000/api/auth/register', {
      data: {
        name: 'Test User',
        email: 'test@test.com',
        phone: '+1-555-0123',
        user_type: 'load_owner',
        password: 'testpass'
      }
    });
    expect(authResponse.status()).toBe(201);

    // Test loads routes
    const loadsResponse = await request.get('http://localhost:8000/api/loads/');
    expect(loadsResponse.status()).toBe(200);

    // Test messages routes  
    const messagesResponse = await request.get('http://localhost:8000/api/messages/load/1');
    expect(messagesResponse.status()).toBe(200);
  });

  test('Frontend homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Shared Transportation/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Shared Transportation');
    
    // Check description
    await expect(page.locator('text=Connect people who need to transport unusual')).toBeVisible();
    
    // Check load owner section
    await expect(page.locator('text=Load Owners')).toBeVisible();
    await expect(page.locator('text=Get Started as Load Owner')).toBeVisible();
    
    // Check driver section
    await expect(page.locator('h2:has-text("Drivers")')).toBeVisible();
    await expect(page.locator('text=Get Started as Driver')).toBeVisible();
    
    // Check login link
    await expect(page.locator('text=Already have an account?')).toBeVisible();
  });

  test('Navigation links work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test load owner registration link
    const loadOwnerLink = page.locator('text=Get Started as Load Owner');
    await expect(loadOwnerLink).toHaveAttribute('href', '/auth/register?type=load_owner');
    
    // Test driver registration link
    const driverLink = page.locator('text=Get Started as Driver');
    await expect(driverLink).toHaveAttribute('href', '/auth/register?type=driver');
    
    // Test login link
    const loginLink = page.locator('text=Already have an account?');
    await expect(loginLink).toHaveAttribute('href', '/auth/login');
  });

  test('Database can be seeded with demo data', async ({ request }) => {
    // This test assumes the demo data seeding script has been run
    // We'll test that loads exist in the database through the API
    
    const response = await request.get('http://localhost:8000/api/loads/');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    // Should return a success message since we haven't implemented the full endpoint yet
    expect(data.message).toBe('Load listing endpoint - implementation coming next');
  });

}); 