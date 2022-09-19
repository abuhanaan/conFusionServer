const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const FacebookTokenStrategy = require('passport-facebook-token')

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

// verifying if a user is an admin
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
      return next()
    } else {
      const err = new Error('You are not authorized to perform this operation!');
      err.status = 403;
      return next(err);
    }
  };

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
            clientID: config.facebook.clientId,
            clientSecret: config.facebook.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
            // Searching the FB user in the system 
            User.findOne({facebookId: profile.id}, (err, user) => {
                if (err) { // the FB user is not found
                    return done(err, false)
                }
                if (!err && user !== null) { // FB user is found
                    return done(null, user)
                }
                else { // creating and registering the FB user
                    user = new User({username: profile.displayName})
                    user.facebookId = profile.id
                    user.firstname = profile.name.givenName
                    user.lastname = profile.name.familyName
                    user.save((err, user) => {
                        if (err) { // user not successfully created
                            return done(err, false)
                        }
                        else { // user created successfully
                            return done(null, user)
                        }
                    })
                }
            })
        }
    ))
    