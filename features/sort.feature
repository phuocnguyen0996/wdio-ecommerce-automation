Feature: Inventory Page - Product Sorting

  Background:
    Given I am on the login page
    When I login with username "standard_user" and password "secret_sauce"

  @ui @smoke @sort
  Scenario: Sort products by name Z to A
    When I sort products by "Name (Z to A)"
    Then the first product name should be "Test.allTheThings() T-Shirt (Red)"

  @ui @sort
  Scenario: Sort products by price low to high
    When I sort products by "Price (low to high)"
    Then all product prices should be sorted in ascending order
