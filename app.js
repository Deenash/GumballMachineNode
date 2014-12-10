var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = require('./db/mongodb');
var model = require('./model/gumball');
var routes = require('./routes');
var index = require('./routes/index');
var users = require('./routes/users');


var app = express();
app.set('port',process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('hostname',process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/',index.welcome);
app.get('/gumballDetails', index.gumballDetails);
app.post('/updateGumballState', index.updateGumballState);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('exError', {
            errorMessage: err.message,
            error: err
        });
    });
}



app.listen(app.get('port'),app.get('hostname'),function(){
	console.log("We have started our server on port "+app.get('port'));
	});

module.exports = app;
