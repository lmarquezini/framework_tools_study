Feature: Hello World request
  As a user from the API service
  I want to do some requests and check the service response

  Scenario Outline: Post to Soma endpoint with values
    Given I an using the REST API service
    When I POST url the "/soma" with values "<valor_a>" and "<valor_b>"
    Then the http status should be 201
    And I should see "<resultado>" in the body
    And the body should equal "<resultado>" in the key "resultado"

    Examples:
    | valor_a | valor_b | resultado |
    | 1       | 1       | 2         |
    | 9       | 1       | 10        |
    | 12      | 12      | 24        |
    | -2      | 1       | -1        |
    | -1      | -1      | -2        |
    | 1000    | -999    | 1         |