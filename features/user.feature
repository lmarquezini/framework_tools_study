Feature: User CRUD
  As a user from the API service
  I want to use the USER endpoints and check the CRUD service

  Scenario: Get to users endpoint
    Given I an using the REST API service
    When I GET url the "/users"
    Then the http status should be 200
    And the user list should be empty

  Scenario: Post to user endpoint
    Given I an using the REST API service
    When I POST to the URL "/user" with username as "LEONARDO" and registry as "741741741"
    Then the http status should be 201
    And the ID should be a NUMBER

  Scenario: Get to users endpoint again
    Given I an using the REST API service
    When I GET url the "/users"
    Then the http status should be 200
    And the user list should be empty

  Scenario: Delete all the users from the system
    Given I an using the REST API service
    When I DELETE url the "/users/deleteAll"
    Then the http status should be 200

  Scenario: Get to users endpoint one more time
    Given I an using the REST API service
    When I GET url the "/users"
    Then the http status should be 200
    And the user list should be empty