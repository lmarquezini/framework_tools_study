'use strict';

/* jshint -W061 */
// wtf jshint? eval can be harmful? But that is not eval, it's JSONPath#eval
var jsonPath = require('JSONPath').eval;
/* jshint +W061 */
var url = require('url')

// TO READ FILES
var fs = require('fs')

// USING YAML PACKAGE
var YAML = require('yamljs');

// USING JSON VALIDATOR
var validate = require('jsonschema').validate;


var GithubStepsWrapper = function () {

  this.World = require('../support/world.js').World

  /* GIVEN */

  this.Given(/^I an using the REST API service$/, function (callback) {
    //callback(null, 'pending');
    return callback()
  });


  // [START] ################### CREATED BY MARQUEZINI ###################
  this.When(/^I GET url the "([^"]*)"$/, function(address, callback) {
    console.log("This was the got content: " + address)
    console.log("This final uri: " + this.uri(address))
    this.get(address, callback)
  })

  this.When(/^I execute$/, function(callback) {
    console.log("This final uri: " + this.rootPath())
    this.get(this.rootPath(), callback)
  })

  this.When(/^I POST url the "([^"]*)"$/, function(address, callback) {
    console.log("This was the got content: " + address)
    console.log("This final uri: " + this.uri(address))
    var requestBody = '{"a" : 65, "b" : 5}'
    console.log("This is the response body: " + requestBody)
    this.post(address, requestBody, callback)
  })

  this.When(/^I POST url the "([^"]*)" with values "([^"]*)" and "([^"]*)"$/, function(address, valueA, valueB, callback) {
    console.log("This was the got content: " + address)
    console.log("This final uri: " + this.uri(address))
    console.log("This the valueA: " + valueA)
    console.log("This the valueB: " + valueB)
    var requestBody = '{"a" : ' + valueA + ', "b" : ' + valueB + '}'
    console.log("This is the response body: " + requestBody)
    this.post(address, requestBody, callback)
  })





  // [END] ################### CREATED BY MARQUEZINI ###################

  this.When(/^I GET the root document$/,
      function(callback) {
    this.get(this.rootPath(), callback)
  })

  this.When(/^I GET the gist (\d+)$/, function(gist, callback) {
    this.get(this.gistPath(gist), callback)
  })

  this.When(/^I GET the issue (\d+) in repository (.*) owned by (.*)$/,
      function(issue, repo, owner, callback) {
    this.get(this.issuePath(owner, repo, issue), callback)
  })

  this.When(/^I GET a non-existing resource$/, function(callback) {
    this.get('/does/not/exist', callback)
  })

  /* THEN */

  this.Then(/^the http status should be (\d+)$/, function(status, callback) {
    if (!assertResponse(this.lastResponse, callback)) { return }
    // SHOW DATA IN THE CONSOLE
    console.log(this.lastResponse.statusCode)
    console.log(this.lastResponse.body)
    
    if (this.lastResponse.statusCode != status) {
    /* jshint +W116 */
      //return callback.fail('The last http response did not have the expected ' +
      //  'status, expected ' + status + ' but got ' +
      //  this.lastResponse.statusCode)
      return callback(new Error('The last http response did not have the expected ' +
        'status, expected ' + status + ' but got ' +
        this.lastResponse.statusCode))
    } else {
      return callback()
    }
  })

  // Check if a certain property of the response is equal to something
  this.Then(/^(?:the )?([\w_.$\[\]]+) should equal "([^"]+)"$/,
      function(key, expectedValue, callback) {
    console.log("KEY VALUE: " + key)
    console.log("EXPECTED VALUE: " + expectedValue)
    if (!assertPropertyIs(this.lastResponse, key, expectedValue, callback)) {
      return
    }
    callback()
  })

  // MARQUEZINI - CREATE TO CHECK THE KEY VALUE
  this.Then(/^(?:the )?([\w_.$\[\]]+) should equal "([^"]+)" in the key "([^"]*)"$/,
      function(key, expectedValue, bodyKey, callback) {
    console.log("KEY VALUE: " + key)
    console.log("EXPECTED VALUE: " + expectedValue)
    console.log("BODYKEY VALUE: " + bodyKey)
    if (!assertPropertyKeyValue(this.lastResponse, key, expectedValue, bodyKey, callback)) {
      return
    }
    callback()
  })

  // MARQUEZINI - CREATE TO CHECK THE CONTRACT
  this.Then(/^ensure ([\w_.$\[\]]+) ([^"]*) matched contract definition$/,
      function(key, file, callback) {

    // READ THE INDICATED YAML FILE
    var contractPath = "./test/resources/contract/" + key + "/"
    var yamlFile = file + ".yaml"
    var pathAbsolute = contractPath + yamlFile
    var contents = fs.readFileSync(pathAbsolute, 'utf8');

    // CONVERT THE YAML TO JSON
    var nativeObject = YAML.parse(contents)
    var json = JSON.stringify(nativeObject)
    var jsonObject = JSON.parse(json)

    var contractSchema = ""
    // EXECUTE THE JSON VALIDATION
    if (file == "response") {
        contractSchema = this.lastResponse.body
      } else if (file == "request") {
        contractSchema = this.lastRequest
      } else {
        contractSchema = this.lastResponse.body
      }
    var responseObject = JSON.parse(contractSchema)

    //console.log("\nRESPONSE OBJECT: " , responseObject)

    //console.log("\n#####  SHOW VALIDATE  ######")
    //console.log(validate(responseObject, jsonObject)); 

    //console.log("\n#####  SHOW ONLY THE RESULT  ######")
    //console.log(validate(responseObject, jsonObject).valid);
    var contractResult = validate(responseObject, jsonObject).valid

    if (!contractResult) {
      callback.fail(new Error('precisa de message.'))
      return false
    }

    callback()
  })

  // MARQUEZINI - CREATE TO CHECK THE SERVICE DEFINITION (SWAGGER YAML FILE)
  this.Then(/^ensure ([\w_.$\[\]]+) ([^"]*) matched ([^"]*) documentation definition$/,
      function(key, file, service, callback) {

    // READ THE SWAGGER YAML FILE
    var swaggerPath = "./api/swagger/"
    var swaggerFile = "swagger.yaml"
    var pathAbsolute = swaggerPath + swaggerFile
    var contents = fs.readFileSync(pathAbsolute, 'utf8');

    // CONVERT THE YAML TO JSON
    var nativeObject = YAML.parse(contents)
    var json = JSON.stringify(nativeObject)
    var jsonObject = JSON.parse(json)
    //console.log("\nJSON OBJECT: " , jsonObject.definitions.SomaResponse)

    var jsonObjectService = ""
    var contractSchema = ""
    // EXECUTE THE JSON VALIDATION
    if (file == "response") {
        contractSchema = this.lastResponse.body
        jsonObjectService = jsonObject.definitions[service]
      } else if (file == "request") {
        contractSchema = this.lastRequest
        jsonObjectService = jsonObject.definitions[service]
      } else {
        contractSchema = this.lastResponse.body
      }
    var responseObject = JSON.parse(contractSchema)

    var contractResult = validate(responseObject, jsonObjectService).valid

    if (!contractResult) {
      callback.fail(new Error('precisa de message.'))
      return false
    }

    callback()
  })

  // Check if a substring is contained in a certain property of the response
  this.Then(/^I should see "([^"]+)" in the (\w+)$/,
      function(expectedContent, key, callback) {
    if (!assertPropertyContains(this.lastResponse, key, expectedContent,
        callback)) {
      return
    }
    return callback()
  })

  function assertResponse(lastResponse, callback) {
    if (!lastResponse) {
      callback.fail(new Error('No request has been made until now.'))
      return false
    }
    return true
  }

  function assertBody(lastResponse, callback) {
    if (!assertResponse(lastResponse, callback)) { return false }
    if (!lastResponse.body) {
      callback.fail(new Error('The response to the last request had no body.'))
      return null
    }
    return lastResponse.body
  }

  function assertValidJson(lastResponse, callback) {
    var body = assertBody(lastResponse, callback)
    console.log("Body content of assertValidJson method: ", body)
    if (!body) {
      console.log("MESSAGE DENTRO DO IF")
      return null
    }
    try {
      console.log("MESSAGE DENTRO DO TRY")
      return JSON.parse(body)
    } catch (e) {
      console.log("MESSAGE DENTRO DO CATCH")
      callback.fail(
        new Error('The body of the last response was not valid JSON.'))
      return null
    }
  }

  function assertPropertyExists(lastResponse, key, expectedValue,
      callback) {
    // ###### MARQUEZINI - ADDED TO CHECK THE VALUES
    //console.log("Last response: ", lastResponse) // TO SHOW OBJECT
    console.log("Key value: " + key)
    //console.log("Expected Value: " + expectedValue)

    //var object = assertValidJson(lastResponse, callback)
    var object = lastResponse
    //console.log("Content after ASSERT VALID JSON: ", object)
    
    if (!object) { return null }
    var property
    if (key.indexOf('$.') !== 0 && key.indexOf('$[') !== 0){
      // normal property
      property = object[key]
      console.log("Content value of PROPERTY: " + property)
    } else {
      // JSONPath expression
      var matches = jsonPath(object, key)
      if (matches.length === 0) {
        // no match
        callback.fail('The last response did not have the property: ' +
          key + '\nExpected it to be\n' + expectedValue)
        return null
      } else if (matches.length > 1) {
        // ambigious match
        callback.fail('JSONPath expression ' + key + ' returned more than ' +
          'one match in object:\n' + JSON.stringify(object))
        return null
      } else {
        // exactly one match, good
        property = matches[0]
      }
    }
    if (property == null) {
      //callback.fail('The last response did not have the property ' +
      //  key + '\nExpected it to be\n' + expectedValue)
      // ######### MARQUEZINI - CHANGED FAIL TO NEW ERROR
      callback(new Error('The last response did not have the property ' +
        key + '\nExpected it to be\n' + expectedValue))
      return null
    }
    return property
  }

  function assertPropertyIs(lastResponse, key, expectedValue, callback) {
    //console.log("FUNCTION LastResponse value: " , lastResponse) // TO SHOW OBJECT
    console.log("FUNCTION Key value: " + key)
    console.log("FUNCTION ExpectedValue value: " + expectedValue)
    var value = assertPropertyExists(lastResponse, key, expectedValue, callback)
    console.log("FUNCTION VALUE after assertPropertyExists: " + value)
    if (!value) { return false }
    if (value !== expectedValue) {
      callback.fail('The last response did not have the expected content in ' +
        'property ' + key + '. ' + 'Got:\n\n' + value + '\n\nExpected:\n\n' +
        expectedValue)
      return false
    }
    return true
  }

  // MARQUEZINI - CREATE NEW FUNCTUON TO GET VALUE
  function assertPropertyKeyValue(lastResponse, key, expectedValue, bodyKey, callback) {
    //console.log("FUNCTION LastResponse value: " , lastResponse) // TO SHOW OBJECT
    console.log("FUNCTION Key value: " + key)
    console.log("FUNCTION ExpectedValue value: " + expectedValue)
    console.log("FUNCTION bodyKey value: " + bodyKey)
    var value = assertPropertyExists(lastResponse, key, expectedValue, callback)
    console.log("FUNCTION VALUE value: " , value)
    var bodyJSON = JSON.parse(value)
    var bodyValue = bodyJSON[bodyKey]
    
    if (!bodyValue) { return false }
    if (bodyValue != expectedValue) {
      //callback.fail('The last response did not have the expected content in ' +
      //  'property ' + key + '. ' + 'Got:\n\n' + value + '\n\nExpected:\n\n' +
      //  expectedValue)
      callback(new Error('The last response did not have the expected content in ' +
        'property ' + key + '.' + bodyKey + '. ' + 'Got:\n\n' + bodyValue + '\n\nExpected:\n\n' +
        expectedValue))
      return false
    }
    return true
  }

  function assertPropertyContains(lastResponse, key, expectedValue, callback) {
    var value = assertPropertyExists(lastResponse, key, expectedValue, callback)
    if (!value) { return false }
    if (value.indexOf(expectedValue) === -1) {
      //callback.fail('The last response did not have the expected content in ' +
      //  'property ' + key + '. ' +
      //  'Got:\n\n' + value + '\n\nExpected it to contain:\n\n' + expectedValue)
      // ######### MARQUEZINI - CHANGED FAIL TO NEW ERROR
      callback(new Error('The last response did not have the expected content in ' +
        'property ' + key + '. ' +
        'Got:\n\n' + value + '\n\nExpected it to contain:\n\n' + expectedValue))
      return false
    }
    return true
  }
}

module.exports = GithubStepsWrapper