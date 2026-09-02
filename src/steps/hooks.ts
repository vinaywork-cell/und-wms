import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Set Cucumber step default timeout to 30 seconds
setDefaultTimeout(30 * 1000);

let browser: Browser;
export interface CustomWorld {
  context: BrowserContext;
  page: Page;
  currentLpn?: string;
}

const world: Partial<CustomWorld> = {};

export { world };

BeforeAll(async function () {
  const reportsDir = path.join(process.cwd(), 'reports');
  const screenshotsDir = path.join(reportsDir, 'screenshots');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

  browser = await chromium.launch({
    headless: true
  });
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});

Before(async function () {
  world.context = await browser.newContext();
  world.page = await world.context.newPage();
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED && world.page) {
    const screenshot = await world.page.screenshot({
      path: `reports/screenshots/${scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
      fullPage: true
    });
    this.attach(screenshot, 'image/png');
  }

  if (world.page) {
    await world.page.close();
  }
  if (world.context) {
    await world.context.close();
  }
});
