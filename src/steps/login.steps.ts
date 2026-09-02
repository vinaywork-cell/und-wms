import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { world } from './hooks.js';
import testData from '../data/testData.json' assert { type: 'json' };

let loginPage: LoginPage;

Given('the user navigates to the WMS Login Page', async function () {
  loginPage = new LoginPage(world.page!);
  await loginPage.openLoginPage(testData.baseUrl);
});

When('the user enters username {string} and password {string}', async function (username: string, password: string) {
  await loginPage.enterUsername(username);
  await loginPage.enterPassword(password);
});

When('selects warehouse {string}', async function (warehouseId: string) {
  await loginPage.selectWarehouse(warehouseId);
});

When('clicks the Login button', async function () {
  await loginPage.clickLogin();
});

Then('the user should be redirected to the WMS Dashboard', async function () {
  const isDashboardVisible = await loginPage.isDashboardVisible();
  expect(isDashboardVisible).toBe(true);
});

Then('the active user badge should display {string}', async function (expectedUser: string) {
  const actualUser = await loginPage.getLoggedInUser();
  expect(actualUser).toContain(expectedUser);
});

Then('the active warehouse should display {string}', async function (expectedWarehouse: string) {
  const actualWarehouse = await loginPage.getSelectedWarehouse();
  expect(actualWarehouse).toContain(expectedWarehouse);
});

Then('an error message {string} should be displayed', async function (expectedError: string) {
  const actualError = await loginPage.getErrorMessage();
  expect(actualError).toContain(expectedError);
});

Then('the user should remain on the Login Page', async function () {
  const isDashboardVisible = await loginPage.isDashboardVisible();
  expect(isDashboardVisible).toBe(false);
});
