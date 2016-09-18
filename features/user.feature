Feature: Hello World request
  As a user from the API service
  I want to do some requests and check the service response

  Scenario: Get to users endpoint
    Given I an using the REST API service
    When I GET url the "/users"
    Then the http status should be 200

  Scenario: Post to user endpoint
    Given I an using the REST API service
    When I POST to the URL "/user" with username as "LEONARDO" and registry as "741741741"
    Then the http status should be 201

  Scenario: Get to users endpoint again
    Given I an using the REST API service
    When I GET url the "/users"
    Then the http status should be 200