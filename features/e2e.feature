Feature: E2E Purchase Flow

  @ui @e2e @purchase
  Scenario Outline: Successful purchase flow
    Given I am on the login page
    When I login with username "<username>" and password "<password>"
    And I add product "Sauce Labs Backpack" to cart
    And I go to cart page
    And I proceed to checkout
    And I fill checkout information
    Then I should complete the order successfully

     Examples:
      | username      | password     |
      | standard_user | secret_sauce |