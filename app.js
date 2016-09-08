// REQUIRED LIBRARIES
var express = require('express');
var bodyParser = require('body-parser');
var moment  = require('moment');
var fs = require('fs');
var nunjucks = require('nunjucks');
var log4js = require('log4js');


// INITIALIZE SOME ITEMS
var app = express();
var obj = new Object();

// GET THE CURRENT DATE
var today = moment();


// LOGGING SETUP
// Will access the file "log4js.json" inside the folder config to set the configuration of LOG4JS
log4js.configure( "./config/log4js.json" );


// LOGGER will use the configuration set in the category called "test-file-appender"
var logger = log4js.getLogger( "test-file-appender" );


// READ CONTENT OF A FILE IN PATH
var readFile_staticMessage = "./fixtures/files/file.txt"
var contents_readFile_staticMessage = fs.readFileSync(readFile_staticMessage, 'utf8');

var txtFileTemplate = "./src/templates/fileTemplate.txt"
var contentsTemplate = fs.readFileSync(txtFileTemplate, 'utf8');


// SET THE USE OF BODYPARSER TO READ THE CONTENT
app.use(bodyParser.json())			     // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({		   // to support URL-encoded bodies
  extended: true
}))


// COPY THE FILE FROM DOCUMENTATION FOLDER TO SWAGGER_UI/DICT
fs.createReadStream('./api/swagger/swagger.yaml').pipe(fs.createWriteStream('./node_modules/swagger-ui/dist/swagger.yaml'));


// JUST SOME EXAMPLES OF AVAILABLE LOGS
logger.debug("Debug message.");
logger.error("Erro log.");
logger.info("Adding info message.");
logger.warn("Warning message!!!");
logger.trace("Trace message.");


// JUST SOME EXAMPLES OF AVAILABLE CONSOLE LOG
// needs to set "replaceConsole" as false in the log4js config file
console.log("Sample of console log message")
console.info("Sample of console info message");
console.warn("Sample of console warn message");


// SET THE SWAGGER-UI ENDPOINT
// This will expose the swagger.yaml file content in the endpoint /swagger
app.use('/swagger', express.static('./node_modules/swagger-ui/dist'));


// This URL is a sample example to check that the service is up and running
// It returns a message inside the response body
app.get('/', function (req, res) {
  res.send('Hello World!')
});


// This URL will read the content of a previously file available in the system
// It will read the content and send it as a message
app.get('/read_file', function (req, res) {
  // GET THE CONTENT OF A STRING WHERE IT READ FROM A STATIC FILE 
  // find by "var contents_readFile_staticMessage" to read the code where we get the content from a file
  var texto = contents_readFile_staticMessage;
  res.send(texto)
});


// This URL is using a TEMPLATE and it will change some values
app.get('/change_template', function (req, res) {
  nunjucks.configure({ autoescape: true });
  var textoTemplate = nunjucks.renderString(contentsTemplate, { 
  		data1: 'James',
  		data2: 'outro texto',
  		data3: '456789',
  		data4: 'primeiro key do array',
  		data5: 'segundo valor do array'
  });
  res.send(textoTemplate)
});


// This URL will get the request body and will try to apply a REGEX to find some information
// With the content filtered by the REGEX expression, it will return in the response body
app.post('/find_date', function (req, res) {
  var str = req.body.text;
  // REGEX RULE - find something like 0000-00-00 00:00:00.000
  regex = "[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}"
  regexSearch = str.match(regex)
  res.send(regexSearch)
});


// This URL is reading the request body and it will get the VALUE of KEY "test"
// The value read will be added in a response without be a JSON, just a simple text/message
app.post('/post_example', function (req, res) {
  //res.send('Got a POST request');
  //console.log(req.body)
  var name = req.body.test

  // RETURN A SIMPLE MESSAGE AS RESPONSE
  res.send("valor lido: " + name)
});


// This URL is a simple example to use the PUT method request
// It will read the request body, paste it in the response body inside the KEY "lido" and add another KEY with the data
app.put('/put_example', function (req, res) {
  //console.log(req.body)
  var startDate = today;              // TO DO: it is necessary to create a function to get a date refreshed
  obj.lido = req.body;
  obj.data = startDate;
  res.status(200).json(obj)
});


// This URL requests two values (A and B) and it will execute a math operation
app.post('/soma', function (req, res) {
  //console.log(req.body)
  var valorA = req.body.a
  //console.log(valorA)
  var valorB = req.body.b
  //console.log(valorB)
  var resultado = Number(valorA) + Number(valorB)

  // CREATE OBJECT WHERE ".<string>" WILL CREATE A KEY IN THE OBJECT WITH VALUE WHAT IS BEING ATTRIBUTED
  obj.resultado = resultado;
  
  var listaValores = []
  listaValores.push(valorA)
  listaValores.push(valorB)
  obj.valores = listaValores;
  //console.log(obj)

  // SET THE HTTP RESPONSE CODE
  res.status(201).json(obj)
});


// This URL sends a PARAMETER after the PATH, per example: http://localhost:3000/urldata?dado="teste"
// get the value and add it in the response content
app.get('/urldata', function (req, res) {
  // ".query" WILL FIND THE PARAMETERS IN THE URL
  var dado = JSON.parse(req.query.dado || 'false');
  var startDate = req.query.startDate || today;
  //console.log(startDate)

  // EXAMPLE OF JSON WRITE DIRECTLY IN A VAR STRING
  var text = '{ "valores" : [' +
			'{ "dado":"' + dado + '" , "data":"' + startDate + '" },' +
			'{ "firstName":"Anna" , "lastName":"Smith" }' +
			']}';

  // TO PARSE A STRING TO A JSON
  var jsonData = JSON.parse(text);
  res.status(200).json(jsonData)
});


// ###################################################################################
// This URL will get the content and create/write in a file the available userid
app.post('/user', function (req, res) {
  var username = req.body.username
  var registry = req.body.registry

  // GENERATE RANDOM VALUE UNTIL THE SPECIFIED VALUE
  var id = Math.floor(Math.random() * 1000000000);

  var text = '{ "user" :' +
      '{ "username":"' + username + '" , "registry":"' + registry + '" },' +
      '"id": ' + id + 
      '}';

  // TO PARSE A STRING TO A JSON
  var jsonData = JSON.parse(text);

  // STORE IN A FILE
  //fs.writeFile('./src/store/user.txt', JSON.stringify(jsonData,null,4), function (err) {
  fs.appendFile('./src/store/user.txt', "," + JSON.stringify(jsonData,null,4), function (err) {
    if (err) throw err;
    //console.log('It\'s saved! in same location.');
  });

  res.status(201).json(jsonData)
});


// This url will get the users content inside the stored file
app.get('/users', function (req, res) {
  // CALL FOR THE FUNCTION "usersData"
  var usersJson = usersData()
  //console.log(usersJson)

  // TO PARSE A STRING TO A JSON
  var usersResponse = JSON.parse(usersJson)
  res.status(200).json(usersResponse)
});


// This url will get the user content of specific ID
app.get('/user/:id', function (req, res) {

  // GET THE PARAMETERS ID IN THE URL
  var identification = req.params.id

  // CALL FOR THE FUNCTION "usersData"
  var usersJson = usersData()

  // FIND THE INDEX
  var objs = JSON.parse(usersJson);
  //console.log("OBJECT: " + objs)
  
  // TO PARSE A STRING TO A JSON
  var usersResponse = JSON.parse(usersJson)

  // FIND THE OBJECT IN ARRAY BY THE IDENTIFICATION
  var result = usersResponse.filter(function( obj ) {
  return obj.id == identification;
  });

  //console.log(result)
  res.status(200).json(result[0])
});


// This URL will delete a specified user by userId
app.delete('/user/:id', function (req, res) {

  // GET THE PARAMETERS ID IN THE URL
  var identification = req.params.id

  // CALL FOR THE FUNCTION "usersData"
  var usersJson = usersData()

  // FIND THE INDEX
  var objs = JSON.parse(usersJson);
  var index = findWithAttr(objs, 'id', identification);
  //console.log("INDEX FOUND: " + index)

  // REMOVE BASED IN THE INDEX
  removedUser = objs.splice(index, 1)
  //console.log("AFTER REMOVE: " , objs)
  
  // WRITE THE USER LIST AFTER REMOVE ONE
  fs.writeFile('./src/store/user.txt', JSON.stringify(objs).substr(1,JSON.stringify(objs).length-2), function (err) {
    if (err) throw err;
    //console.log('It\'s saved! in same location.');
  });

  //console.log(result)
  res.status(200).json(('{ "message": "REMOVED"}'))
});


// This url will update the user content of specific ID
app.put('/user/:id', function (req, res) {

  // GET THE PARAMETERS ID IN THE URL
  var identification = req.params.id
  var username = req.body.username
  var registry = req.body.registry

  // CALL FOR THE FUNCTION "usersData"
  var usersJson = usersData()

  // FIND THE INDEX
  var objs = JSON.parse(usersJson);
  var index = findWithAttr(objs, 'id', identification);

  //REMOVE OLD AND ADD NEW
  removedUser = objs.splice(index, 1)

  var text = '{ "user" :' +
      '{ "username":"' + username + '" , "registry":"' + registry + '" },' +
      '"id": ' + identification + 
      '}';
  var jsonData = JSON.parse(text);

  objs.splice(index, 0, jsonData)
  
  // WRITE THE USER LIST AFTER REMOVE ONE
  fs.writeFile('./src/store/user.txt', JSON.stringify(objs).substr(1,JSON.stringify(objs).length-2), function (err) {
    if (err) throw err;
    //console.log('It\'s saved! in same location.');
  });

  //console.log(result)
  res.status(200).json('{ "message": "UPDATED"}')
});


// This URL will delete all users
app.delete('/users/deleteAll', function (req, res) {
  // WRITE THE USER LIST AFTER REMOVE ONE
  fs.writeFile('./src/store/user.txt', "", function (err) {
    if (err) throw err;
  });

  res.status(200).json(('{ "message": "REMOVED ALL USERS"}'))
});



// ###################################################################################

// This is a default setting enviroment with information about the PORT that the service will startup
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

function usersData() {
  var readFile_users = "./src/store/user.txt"
  var contents_readFile_users = fs.readFileSync(readFile_users, 'utf8');
  var content_UserReplaced = contents_readFile_users.replace("}{", "},{");
  var content_UserReplaced_fixed = ""
  
  if (content_UserReplaced.substr(0,1) == ",") {
    content_UserReplaced_fixed = content_UserReplaced.substr(1)
  } else {
    content_UserReplaced_fixed = content_UserReplaced
  }

  var usersJson = "[" + content_UserReplaced_fixed + "]"
  return usersJson
}

function findWithAttr(array, attr, value) {
  for(var i = 0; i < array.length; i += 1) {
    //console.log("DENTRO DO ARRAY: " + array[i][attr])
    if(array[i][attr] == value) {
      return i;
    }
  }
  return -1;
}

module.exports = app