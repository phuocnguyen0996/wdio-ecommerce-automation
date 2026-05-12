Feature: paralle test

  @ui @login @negative
  Scenario Outline: Login unsuccessfully with locked out user
    Given I am on the login page
    When I login with username "<username>" and password "<password>"
    Then I validate result "<result>"
   Examples:
      | username                | result  | password     |
      | locked_out_user         | fail    | secret_sauce |