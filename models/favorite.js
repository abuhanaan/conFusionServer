const mongoose = require('mongoose')
const Schema = mongoose.Schema

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Dish'
    }]
}, {
    timestamps: true // automatically including the time of creation and updation
})

var Favorites = mongoose.model('Favorite', favoriteSchema)

module.exports = Favorites