import { test, expect } from '@playwright/test';
import tags from '../data/tags.json';

test.beforeEach(async ({ page }) => {

  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    });
  });

  await page.route('*/**/api/articles', async route => {
    const response = await route.fetch();
    const responseBody = await response.json();
    responseBody.articles[0].title = 'Title Test';
    responseBody.articles[0].description = 'This is a test description';
    
    await route.fulfill({
      body: JSON.stringify(responseBody)
    });
  });

  // await page.goto('https://angular.realworld.io/');
  await page.goto('https://conduit.bondaracademy.com/');
});





test('has title', async ({ page }) => {

  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  // await expect(page.locator('app-article-list h1')).toContainText('Title Test');
  // await expect(page.locator('app-article-list p')).toContainText('This is a test description');
});






