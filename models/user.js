const mongoose = require('mongoose')
var Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

var User = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
})

User.plugin(passportLocalMongoose) // Automatically adds in username field and hash/salt storage of password

module.exports = mongoose.model('User', User)