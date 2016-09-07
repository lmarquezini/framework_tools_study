// JASMINE REPORTERS -> https://www.npmjs.com/package/jasmine-reporters

//###########################################

var reporters = require('jasmine-reporters');
var junitReporter = new reporters.JUnitXmlReporter({
    savePath: './reports',
    consolidateAll: false
});


//###########################################

var frisby = require('frisby');

// EXAMPLE USING JASMINE
describe('Jasmine Suite to verify XUZ', function() {
    it('Jasmine Spec to execute something ABC', function() {
        frisby.create('Frisby')
            .get('http://localhost:3000/')
            .expectStatus(200)
            .toss();
    });
});


// GENERATE REPORT
jasmine.getEnv().addReporter(junitReporter);