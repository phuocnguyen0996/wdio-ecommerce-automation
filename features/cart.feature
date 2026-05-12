Feature: Cart Management

  Background:
    Given I am on the login page
    When I login with username "standard_user" and password "secret_sauce"

  @ui @cart @smoke
  Scenario: Add multiple products increases cart badge count
    When I add product "Sauce Labs Backpack" to cart
    And I add product "Sauce Labs Bike Light" to cart
    Then the cart badge should show "2"

  @ui @cart
  Scenario: Remove product from cart clears the item
    When I add product "Sauce Labs Backpack" to cart
    And I go to cart page
    And I remove "Sauce Labs Backpack" from cart
    Then the cart should be empty

  @ui @cart
  Scenario: Continue shopping from cart returns to inventory page
    When I add product "Sauce Labs Backpack" to cart
    And I go to cart page
    And I click continue shopping
    Then I should be on the inventory page
