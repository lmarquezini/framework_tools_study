// http://frisbyjs.com/
// EXAMPLES OF FRISBY API: http://frisbyjs.com/docs/api/
// EXAMPLES OF EXPECT CONTENT: https://ian_lin.gitbooks.io/javascript-testing/content/chapter6.html
// https://ptmccarthy.github.io/2014/06/28/rest-testing-with-frisby/
// http://bazscott.com/blog/2014/11/25/API-Testing-With-Frisby/

// RUN COMMAND IN CONTINUOUS INTEGRATION
// $ jasmine-node spec/api/ --junitreport




//https://www.npmjs.com/package/frisby
var frisby = require('frisby');

// TEST 
frisby.create('Response of request to Hello World')
  .get('http://localhost:3000/')
  .expectStatus(200)
  .expectMaxResponseTime(500)
  .inspectHeaders()
  .inspectRequest()
  .inspectStatus()
  .inspectBody()
.toss();


// EXAMPLE USING JASMINE
describe('Suite to verify XUZ', function() {
    it('Spec to execute something ABC', function() {
        frisby.create('Frisby')
            .get('http://localhost:3000/')
            .expectStatus(200)
            .toss();
    });
});


// TEST 
frisby.create('primeiro teste')
  .get('http://localhost:3000/urldata?dado="teste"')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectBodyContains('teste')
  /*
  .expectJSON(valores, {
      dado: "teste",
      firstName: "Anna",
      lastName: "Smith"
    })
  */
.toss();


// POST TEST
var test_a_value = '65'
var test_b_value = '5'
frisby.create('Send a SOMA request')
  .post('http://localhost:3000/soma',
   { a : test_a_value, b : test_b_value },
   { json: true },
   { headers: { 'Content-Type': 'application/json' }}
  )
  .expectStatus(201)
  .expectHeader('Content-Type', 'application/json; charset=utf-8')
  .expectHeaderContains('content-type', 'application/json')
  
  // INSPECT THE RESPONSE CONTENT
  .expectJSON({
    resultado: 70,
    valores: [
      test_a_value,
      test_b_value
    ]
  }) 

  // INSPECT THE REPSONSE CONTENT TYPE
  .expectJSONTypes({
    resultado: Number,
    valores: Array
  })
  .inspectJSON()
  
.toss();


// REPORTER
var jasmineReporters = require('jasmine-reporters');
var junitReporter = new jasmineReporters.JUnitXmlReporter({
    savePath: '..',
    consolidateAll: false
});
jasmine.getEnv().addReporter(junitReporter);