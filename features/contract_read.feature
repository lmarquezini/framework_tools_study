Feature: Read File request
  As a user from the API service
  I want to do some requests and check the service response
  And verify the CONTRACT of different clients

Scenario: Verify the response contract
    Given I an using the REST API service
    When I GET url the "/read_file"
    Then the http status should be 200
    And ensure read_file response matched ReadFileResponse documentation definition
    And ensure read_file/clients/clientA response matched contract definition
    And ensure read_file/clients/clientB response matched contract definition
    And ensure read_file/clients/clientC response matched contract definition