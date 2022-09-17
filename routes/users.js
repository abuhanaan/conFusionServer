var express = require('express');
const bodyParser = require('body-parser')
const User = require('../models/user')
var passport = require('passport')
const authenticate = require('../authenticate');
const cors = require('./cors')

const Users = require('../models/user')

var router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  // res.send('respond with a resource');
  Users.find({}, (err, users) => {
    if (err) {
      return next(err)
    }
    else {
      res.status(200);
      res.setHeader('Content-type', 'application/json');
      res.json(users);
    }
  })
})
//   .then((users) => {
//     // if promise fulfilled
//     res.statusCode = 200
//     res.setHeader('Content-Type', 'application/json')
//     res.json(users) // takes the users data and send it to client in json format
// }, (err) => next(err))  // handling error
// .catch((err) => next(err)) // if any error, send it back to the overall error handler
// });

router.post('/signup', cors.corsWithOptions,  function(req, res, next) {
  User.register(new User({username: req.body.username}), req.body.password, 
  (err, user) => {
    if (err) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.json({err: err})
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname
      if (req.body.lastname)
        user.lastname = req.body.lastname
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.json({err: err})
          return
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json({success: true, status: 'Registration Successful!', user: user})
        })
      })
    }
    } 
  )
})

router.post('/login', cors.corsWithOptions,  passport.authenticate('local', {session: false}), (req, res) => {
  
  var token = authenticate.getToken({_id: req.user._id}) // creates a token at login point
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.json({success: true, token: token, status: 'You are Successfully logged in!'})
})

router.get('/logout', cors.corsWithOptions,  (req, res, next) => {
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
