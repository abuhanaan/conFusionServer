const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')

const config = require('./config')

// User authentication and fields validation by passport
exports.local = passport.use(new LocalStrategy(User.authenticate()))
// support for sessions by passport
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,  // creates a JWT where user is the payload in json format,
        {expiresIn: 3600})                   // expires in an hr and secretkey for encryption
}

var opts = {}
// specifying how jwt should be extracted from the request
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload)
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false)
            }
            else if (user) {
                return done(null, user)
            }
            else {
                return done(null, false)
            }
        })
    }))

// verifying incoming user
exports.verifyUser = passport.authenticate('jwt', {session: false})