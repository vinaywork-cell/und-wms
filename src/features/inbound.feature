@inbound @operations
Feature: WMS Inbound Goods Receipt & Bin Putaway Automation
  As a WMS Inbound Receiving Operator
  I want to search Purchase Orders, receive items at the dock, generate LPN tags, and perform Putaway
  So that incoming inventory is accurately recorded and stored in warehouse bin locations.

  Background:
    Given the user is logged in as "wms_manager" for warehouse "WH-MAIN-01"
    And the user navigates to the Inbound Module

  @smoke @critical @inbound-receipt
  Scenario: Inbound Purchase Order Receipt and LPN Generation
    Given an inbound Purchase Order "PO-2026-9901" is in "OPEN" status
    When the receiving operator searches for PO "PO-2026-9901"
    And assigns dock door "DOCK-04"
    And receives item "SKU-BARCODE-1001" with quantity 50
    And confirms the inbound receipt
    Then a new LPN tracking number starting with "LPN-" should be generated
    And the Purchase Order status should update to "RECEIVED"

  @regression @putaway
  Scenario: Complete End-to-End Putaway of Received Inbound LPN
    Given an inbound Purchase Order "PO-2026-9901" is received at dock "DOCK-04"
    When the receiving operator generates the LPN for SKU "SKU-BARCODE-1001"
    And executes putaway to target bin location "BIN-A1-04"
    Then the putaway status should confirm "Putaway Successful: LPN assigned to BIN-A1-04"
    And the inventory balance in bin "BIN-A1-04" should be increased by 50 units

  @regression @exceptions
  Scenario: Inbound Receipt with Damaged Items Handling
    Given an inbound Purchase Order "PO-2026-9902" is in "OPEN" status
    When the receiving operator searches for PO "PO-2026-9902"
    And assigns dock door "DOCK-02"
    And receives item "SKU-LABEL-2002" with 90 good units and 10 damaged units
    And confirms the inbound receipt
    Then the system should generate standard LPN for 90 good units
    And a quarantine hold tag should be applied for 10 damaged units
