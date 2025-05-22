import { test, expect, request } from '@playwright/test';
import tags from '../data/tags.json';

// test.beforeEach(async ({ page }) => {

//   await page.route('*/**/api/tags', async route => {
//     await route.fulfill({
//       body: JSON.stringify(tags)
//     });
//   });

//   // await page.goto('https://angular.realworld.io/');
//   await page.goto('https://conduit.bondaracademy.com/');
// });

test.beforeEach(async ({ page }) => {
  await page.goto('https://conduit.bondaracademy.com/');
});



// test.skip('has title', async ({ page }) => {

//   await page.route('*/**/api/articles', async route => {
//     const response = await route.fetch();
//     const responseBody = await response.json();
//     responseBody.articles[0].title = 'Title Test';
//     responseBody.articles[0].description = 'This is a test description';

//     await route.fulfill({
//       body: JSON.stringify(responseBody)
//     });
//   });

//   await expect(page.locator('.navbar-brand')).toHaveText('conduit');
//   // await expect(page.locator('app-article-list h1')).toContainText('Title Test');
//   // await expect(page.locator('app-article-list p')).toContainText('This is a test description');
// });


test.skip('create an article', async ({ page, request }) => {
  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      'user': {
        'email': 'stormtroopercr@hotmail.com',
        'password': 'Lizanito.7777'
      }
    }
  });

  const responseBody = await response.json();
  const token = responseBody.user.token;

  const articleStatus = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    data: {
      "article": {
        "title": "Article creation test",
        "description": "This is the description of the article",
        "body": "This is the body of the article to test",
        "tagList": [
          "automation",
          "playwright",
          "api"
        ]
      }
    },
    headers: {
      Authorization: `Token ${token}`
    }
  });

  expect(articleStatus.status()).toEqual(201);

  await page.getByText('Global Feed').click();
  await page.getByText('Article creation test').click();
  await page.getByRole('button', { name: 'Delete Article' }).first().click();
  await page.getByText('Global Feed').click();

  await expect(page.locator('app-article-list h1').first()).not.toContainText('Article creation test');


});

// token	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyNjk2OX0sImlhdCI6MTc0Nzg3NDIwMywiZXhwIjoxNzUzMDU4MjAzfQ.w5wFFlbaUVS2V6TNymDD-KVd2LMwyb3aFvp_Zu9xNi8"

test('delete an article', async ({ page, request }) => {
  await page.getByText('New Article').click();
  await page.getByRole('textbox', { name: 'Article Title' }).fill('Playwright is awesome');
  await page.getByRole('textbox', { name: "What's this article about?" }).fill('About Playwright');
  await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('Playwright is a test framework for web applications');
  await page.getByRole('button', { name: 'Publish Article' }).click();
  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/');
  const articleResponseBody = await articleResponse.json();
  const slugId = articleResponseBody.article.slug;




  await expect(page.locator('h1')).toContainText('Playwright is awesome');

  await page.getByText('Home').click();
  await page.getByText('Global Feed').click();

  await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome');

  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      'user': {
        'email': 'stormtroopercr@hotmail.com',
        'password': 'Lizanito.7777'
      }
    }
  });

  const responseBody = await response.json();
  const token = responseBody.user.token;

  const deleteArticleStatus = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: `Token ${token}`
    }
  });

  expect(deleteArticleStatus.status()).toEqual(204);


});
