var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter')
var promoRouter = require('./routes/promoRouter')
var leaderRouter = require('./routes/leaderRouter')

const mongoose = require('mongoose')

const Dishes = require('./models/dishes')

const url = 'mongodb://localhost:27017/conFusion'
const connect = mongoose.connect(url)

// establishing connection with the server
connect.then((db) => {
  console.log('Connected Correctly To The Server')

}, (err) => { console.log(err) })


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));

function auth(req, res, next) {
  console.log(req.signedCookies)

  if (!req.signedCookies.user) { // checks that user is not yet authorised i.e
    //user properties are not included in the signedCokies
    var authHeader = req.headers.authorization

    if (!authHeader) { // if auth is not included in the user request
      var err = new Error('You are not authenticated')

      res.setHeader('WWW.Authenticate', 'Basic')
      err.status = 401
      return next(err) // sent to the overall error handler
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    // the auth in the request comes in the form 'Basic Token', so the first split
    // in the line above gets the base64 encoded token that comes with the request
    // and the second split seperate the username from the password since they are 
    // both encoded inside the token
    var username = auth[0]
    var password = auth[1]

    if (username === 'admin' && password === 'password') {
      res.cookie('user', 'admin', { signed: true })
      next() // pass the flow to the next middleware
    }
    else {
      var err = new Error('You are not authenticated')

      res.setHeader('WWW.Authenticate', 'Basic')
      err.status = 401
      return next(err) // sent to the overall error handler
    }
  }
  else {
    if (req.signedCookies.user === 'admin') {
      next()
    }
    else {
      var err = new Error('You are not authenticated')

      err.status = 401
      return next(err) // sent to the overall error handler
    }
  }
  
}

app.use(auth)

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
