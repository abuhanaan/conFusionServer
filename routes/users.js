var express = require('express');
const bodyParser = require('body-parser')
const User = require('../models/user')

var router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  User.findOne({username: req.body.username}) // Checking if user alredy exist
  .then((user) => {
    if (user != null) {
      var err = new Error('User ' + req.body.username + ' already exist')
      err.status = 403
      next(err)
    }
    else {
      return User.create({username: req.body.username,
                          password: req.body.password})
    }
    })
    .then((user) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json({status: 'Registration Successful!', user: user})
  }, (err) => next(err))
  .catch((err) => next(err))
})

router.post('/login', (req, res, next) => {
  if (!req.session.user) { // checks that user is not yet authorised i.e
    //user properties are not included in the sesion
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

    User.findOne({username: username})
    .then((user => {
      if (user === null) {
        var err = new Error('User ' + username + ' does not exist!')
        err.status = 403
        return next(err) // sent to the overall error handler
      }
      else if (user.password !== password) {
        var err = new Error('Your password is incorrect')
        err.status = 403
        return next(err) // sent to the overall error handler
      }
      else if (user.username === username && user.password === password) {
        req.session.user = 'authenticated'
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain')
        res.end('You are authenticated')
      }
    }))
    .catch((err) => next(err))
  } // leaving the if block above means user is already authenticated
  else {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('You are already authenticated')
  }
})

router.get('/logout', (req, res, next) => {
  if (req.session) { // affirming that session already exist before attempting to logout
    req.session.destroy() // clear session info on server side
    res.clearCookie('session-id') // clears cookie info on the client side
    res.redirect('/') 
  }
  else {
    var err = new Error('You are not logged in!')
    err.status = 403
    next(err)
  }
})

module.exports = router;
