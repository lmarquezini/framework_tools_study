Feature: Hello World request
  As a user from the API service
  I want to do some requests and check the service response

  Scenario: Get to Hellow World endpoint
    Given I an using the REST API service
    When I execute
    Then the http status should be 200

	Scenario: Get to Hellow World endpoint
    Given I an using the REST API service
    When I GET url the "/"
    Then the http status should be 201

	Scenario: Post to Soma endpoint
    Given I an using the REST API service
    When I POST url the "/soma"
    Then the http status should be 201
    And I should see "resultado" in the body

	Scenario: Post to Soma endpoint with values
    Given I an using the REST API service
    When I POST url the "/soma" with values "8" and "2"
    Then the http status should be 201
    And I should see "8" in the body
    And the body should equal "10" in the key "resultado"

	Scenario: Verify the response contract
    Given I an using the REST API service
    When I POST url the "/soma" with values "12" and "4"
    Then the http status should be 201
    And the body should equal "16" in the key "resultado"
    And ensure soma request matched SomaRequest documentation definition
    And ensure soma response matched SomaResponse documentation definition
    And ensure soma request matched contract definition
    And ensure soma response matched contract definition
    