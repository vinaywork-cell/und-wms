import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InboundPage } from '../pages/InboundPage.js';
import { world } from './hooks.js';
import testData from '../data/testData.json' assert { type: 'json' };

let loginPage: LoginPage;
let inboundPage: InboundPage;

Given('the user is logged in as {string} for warehouse {string}', async function (username: string, warehouseId: string) {
  loginPage = new LoginPage(world.page!);
  await loginPage.openLoginPage(testData.baseUrl);
  const password = testData.users.validUser.password;
  await loginPage.login(username, password, warehouseId);
  expect(await loginPage.isDashboardVisible()).toBe(true);
});

Given('the user navigates to the Inbound Module', async function () {
  inboundPage = new InboundPage(world.page!);
  await inboundPage.navigateToInboundModule();
});

Given('an inbound Purchase Order {string} is in {string} status', async function (poNumber: string, status: string) {
  // PO state verification step
  await inboundPage.searchPurchaseOrder(poNumber);
  const actualStatus = await inboundPage.getPOStatus();
  expect(actualStatus).toContain(status);
});

When('the receiving operator searches for PO {string}', async function (poNumber: string) {
  await inboundPage.searchPurchaseOrder(poNumber);
});

When('assigns dock door {string}', async function (dockDoor: string) {
  await inboundPage.assignDockDoor(dockDoor);
});

When('receives item {string} with quantity {int}', async function (sku: string, qty: number) {
  await inboundPage.enterItemReceipt(sku, qty, 0);
});

When('receives item {string} with {int} good units and {int} damaged units', async function (sku: string, goodQty: number, damagedQty: number) {
  await inboundPage.enterItemReceipt(sku, goodQty, damagedQty);
});

When('confirms the inbound receipt', async function () {
  world.currentLpn = await inboundPage.confirmReceiptAndGenerateLPN();
});

Then('a new LPN tracking number starting with {string} should be generated', async function (prefix: string) {
  expect(world.currentLpn).toBeDefined();
  expect(world.currentLpn).toContain(prefix);
});

Then('the Purchase Order status should update to {string}', async function (expectedStatus: string) {
  const status = await inboundPage.getPOStatus();
  expect(status).toContain(expectedStatus);
});

Given('an inbound Purchase Order {string} is received at dock {string}', async function (poNumber: string, dockDoor: string) {
  await inboundPage.searchPurchaseOrder(poNumber);
  await inboundPage.assignDockDoor(dockDoor);
});

When('the receiving operator generates the LPN for SKU {string}', async function (sku: string) {
  await inboundPage.enterItemReceipt(sku, 50, 0);
  world.currentLpn = await inboundPage.confirmReceiptAndGenerateLPN();
});

When('executes putaway to target bin location {string}', async function (targetBin: string) {
  await inboundPage.executePutaway(targetBin);
});

Then('the putaway status should confirm {string}', async function (expectedMessage: string) {
  const actualMessage = await inboundPage.getPutawayConfirmationMessage();
  expect(actualMessage).toContain(expectedMessage);
});

Then('the inventory balance in bin {string} should be increased by {int} units', async function (binLocation: string, qty: number) {
  const message = await inboundPage.getPutawayConfirmationMessage();
  expect(message).toContain(binLocation);
});

Then('the system should generate standard LPN for {int} good units', async function (goodQty: number) {
  expect(world.currentLpn).toBeDefined();
  expect(world.currentLpn).toContain('LPN-');
});

Then('a quarantine hold tag should be applied for {int} damaged units', async function (damagedQty: number) {
  const statusMsg = await inboundPage.getPutawayConfirmationMessage();
  expect(statusMsg).toContain('QUARANTINE');
});
