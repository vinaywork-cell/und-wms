@login @authentication
Feature: WMS User Login & Multi-Warehouse Access
  As a WMS Warehouse Manager or Operator
  I want to securely log into the Warehouse Management System with my assigned credentials
  So that I can access my designated warehouse operations and inventory.

  Background:
    Given the user navigates to the WMS Login Page

  @smoke @critical
  Scenario: Successful Login with Valid Credentials and Warehouse Selection
    When the user enters username "wms_manager" and password "Password123!"
    And selects warehouse "WH-MAIN-01"
    And clicks the Login button
    Then the user should be redirected to the WMS Dashboard
    And the active user badge should display "wms_manager"
    And the active warehouse should display "WH-MAIN-01"

  @regression @negative
  Scenario: Unsuccessful Login with Invalid Password
    When the user enters username "wms_manager" and password "WrongPassword!"
    And selects warehouse "WH-MAIN-01"
    And clicks the Login button
    Then an error message "Invalid credentials provided. Access denied." should be displayed
    And the user should remain on the Login Page

  @regression @multi-warehouse
  Scenario Outline: Validate Login Across Multiple Warehouses
    When the user enters username "<username>" and password "<password>"
    And selects warehouse "<warehouseId>"
    And clicks the Login button
    Then the user should be redirected to the WMS Dashboard
    And the active warehouse should display "<warehouseId>"

    Examples:
      | username         | password     | warehouseId |
      | wms_manager      | Password123! | WH-MAIN-01  |
      | wms_receiving_op | Password123! | WH-EAST-02  |
