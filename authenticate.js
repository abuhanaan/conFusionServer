const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')

// User authentication and fields validation by passport
exports.local = passport.use(new LocalStrategy(User.authenticate()))
// support for sessions by passport
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())