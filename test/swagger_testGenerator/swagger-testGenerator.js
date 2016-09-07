var stt = require('swagger-test-templates');

var yaml = require("js-yaml");
var fs = require("fs");
// var e = yaml.load(fs.readFileSync("../../api/swagger/swagger.yaml"));	// to run with command "node swagger-testGenerator.js" in the folder of swagger_testGenerator
var e = yaml.load(fs.readFileSync("./api/swagger/swagger.yaml"));
//console.log(e);

var swagger = e;

var config = {
  assertionFormat: 'should',
  testModule: 'supertest',
  pathName: ['/'],
  loadTest: [{pathName:'/', operation:'get', load:{requests: 1000, concurrent: 100}}],
  maxLen: 80
};
 
// Generates an array of JavaScript test files following specified configuration 
//console.log(stt.testGen(swagger, config));
var generateTests = stt.testGen(swagger, config)


// CREATE FILE AND SAVE CONTENT
//fs.writeFile('./generatedTests.json', JSON.stringify(generateTests,null,4), function (err) {
fs.writeFile('./test/swagger_testGenerator/generatedTests.json', JSON.stringify(generateTests,null,4), function (err) {
  if (err) throw err;
  //console.log('It\'s saved! in same location.');
});