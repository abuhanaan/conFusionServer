var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var FileStorage = require('session-file-store')(session)

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
// app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStorage()
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req, res, next) {
  console.log(req.session)

  if (!req.session.user) { // checks that user is not yet authorised i.e
    //user properties are not included in the sesion
   
    var err = new Error('You are not authenticated')

    res.setHeader('WWW.Authenticate', 'Basic')
    err.status = 401
    return next(err) // sent to the overall error handler
  }
  else {
    if (req.session.user === 'authenticated') { // req.session.user has bn set to 'authenticated' in users.js
      next()
    }
    else {
      var err = new Error('You are not authenticated')
      err.status = 403
      return next(err) // sent to the overall error handler
    }
  }
  
}

app.use(auth)

app.use(express.static(path.join(__dirname, 'public')));

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
