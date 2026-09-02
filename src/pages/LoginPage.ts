import { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  // Selectors
  private readonly usernameInput = '#username';
  private readonly passwordInput = '#password';
  private readonly warehouseDropdown = '#warehouse';
  private readonly loginButton = '#login-btn';
  private readonly errorMessage = '#error-message';
  private readonly userBadge = '#user-badge';
  private readonly activeWarehouse = '#active-warehouse';

  constructor(page: Page) {
    super(page);
  }

  async openLoginPage(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/login`);
  }

  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async selectWarehouse(warehouseId: string): Promise<void> {
    await this.selectOption(this.warehouseDropdown, warehouseId);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  async login(username: string, password: string, warehouseId: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.selectWarehouse(warehouseId);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  async getLoggedInUser(): Promise<string> {
    await this.waitForElement(this.userBadge);
    return await this.getText(this.userBadge);
  }

  async getSelectedWarehouse(): Promise<string> {
    await this.waitForElement(this.activeWarehouse);
    return await this.getText(this.activeWarehouse);
  }

  async isDashboardVisible(): Promise<boolean> {
    return await this.isVisible('#dashboard-container');
  }
}
