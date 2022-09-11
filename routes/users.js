var express = require('express');
const bodyParser = require('body-parser')
const User = require('../models/user')
const passport = require('passport')

var router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  User.register(new User({username: req.body.username}), req.body.password, 
  (err, user) => {
    if (err) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.json({err: err})
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({success: true, status: 'Registration Successful!', user: user})
      })
    }
    } 
  )
})

router.post('/login',passport.authenticate('local'), (req, res, next) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.json({success: true, status: 'Registration Successfully logged in!', user: user})
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
