import { test as setup } from '@playwright/test';

const authFile = '.auth/user.json';

setup('auth', async ({ page }) => {
     await page.goto('https://conduit.bondaracademy.com/');
     await page.getByText('Sign in').click();
     await page.getByPlaceholder('Email').fill('stormtroopercr@hotmail.com');
     await page.getByPlaceholder('Password').fill('Lizanito.7777');
     await page.getByRole('button').click();

     // await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles');

     await page.context().storageState({ path: authFile });
})