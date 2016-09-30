Feature: User flow
  As a user from the API service
  I want to use the USER endpoints and execute the flow

  Scenario: Update the user
    Given I am using the REST API service and with the user list cleaned
    When I GET url the "/users"
    Then the http status should be 200
    And the user list should be empty