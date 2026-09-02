import { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';

export interface InboundReceiptData {
  poNumber: string;
  dockDoor: string;
  sku: string;
  receivedQty: number;
  damagedQty?: number;
  targetBin: string;
}

export class InboundPage extends BasePage {
  // Selectors
  private readonly inboundNavTab = '#nav-inbound';
  private readonly poSearchInput = '#po-search-input';
  private readonly searchPoBtn = '#btn-search-po';
  private readonly poStatusBadge = '#po-status-badge';
  private readonly dockDoorDropdown = '#dock-door-select';
  private readonly skuInput = '#sku-input';
  private readonly receivedQtyInput = '#received-qty-input';
  private readonly damagedQtyInput = '#damaged-qty-input';
  private readonly confirmReceiptBtn = '#btn-confirm-receipt';
  private readonly generatedLpnBadge = '#generated-lpn-badge';
  private readonly targetBinInput = '#target-bin-input';
  private readonly putawayBtn = '#btn-execute-putaway';
  private readonly putawayStatusMessage = '#putaway-status-msg';

  constructor(page: Page) {
    super(page);
  }

  async navigateToInboundModule(): Promise<void> {
    await this.click(this.inboundNavTab);
    await this.waitForElement('#inbound-module-container');
  }

  async searchPurchaseOrder(poNumber: string): Promise<void> {
    await this.fill(this.poSearchInput, poNumber);
    await this.click(this.searchPoBtn);
    await this.waitForElement(this.poStatusBadge);
  }

  async getPOStatus(): Promise<string> {
    return await this.getText(this.poStatusBadge);
  }

  async assignDockDoor(dockDoor: string): Promise<void> {
    await this.selectOption(this.dockDoorDropdown, dockDoor);
  }

  async enterItemReceipt(sku: string, receivedQty: number, damagedQty: number = 0): Promise<void> {
    await this.fill(this.skuInput, sku);
    await this.fill(this.receivedQtyInput, receivedQty.toString());
    await this.fill(this.damagedQtyInput, damagedQty.toString());
  }

  async confirmReceiptAndGenerateLPN(): Promise<string> {
    await this.click(this.confirmReceiptBtn);
    await this.waitForElement(this.generatedLpnBadge);
    return await this.getText(this.generatedLpnBadge);
  }

  async executePutaway(targetBin: string): Promise<void> {
    await this.fill(this.targetBinInput, targetBin);
    await this.click(this.putawayBtn);
    await this.waitForElement(this.putawayStatusMessage);
  }

  async getPutawayConfirmationMessage(): Promise<string> {
    return await this.getText(this.putawayStatusMessage);
  }
}
