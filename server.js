var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config');

var app = express();

/*mongoose.connect(config.database, function(err) {
	if (err) {
		console.log(err);
	}
});*/

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

//API Router
var apiRouter = require('./api/apiRouter');


// All API Routes
app.use('/api', apiRouter);

app.use(express.static(path.join(__dirname, 'public')));

// viewed at http://localhost:8080 | Web Application Route
app.all("/*", function(req, res, next) {
  res.sendFile(path.join(__dirname + '/public/index-debug.html'));
});

var server = app.listen(8082, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Block Chain is listening at %s:%s", host, port)

});