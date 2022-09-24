const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')

const Favorites = require('../models/favorite')

const favoriteRouter = express.Router()

favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
})
.get(cors.cors,authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ 'user': req.user._id })
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
        if (favorite !== null) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(favorite)
        }
        else {
            err = new Error('You dont have a fav doc yet, try creating one!!!')
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))  // handling error
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    Favorites.findOne({user: req.user._id}, (err, favorite) => {
        if(err) {
            return next(err)
        }
        if(favorite) { // if a favorite document is aleady attributed to the current user
            // req.body.filter((dish) => {
            //     if(!favorite.dishes.includes(dish)) {
            //         favorite.dishes.push(dish)
            //     }
            // })
            // req.body.forEach((dishId) => {
            //     if(!favorite.dishes.includes(dishId)){
            //         favorite.dishes.push(dishId);
            //     }            
            // });
            // looping through the array of dishes in the body while
            // avoiding duplicate in the favorite document
            for (var i = (req.body.length -1); i>=0; i--) {
                if(!favorite.dishes.includes(req.body[i]._id)) {
                    favorite.dishes.push(req.body[i]._id)
                }
                else {
                    console.log("dish " + req.body[i]._id + " is already in your favorite list")
                }
            }
            favorite.save()
            .then((favorite) => {
                //  console.log('Favorite updated with the new dishes', req.body);
                 res.statusCode = 200;
                 res.setHeader('Content-Type','application/json');
                 res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err))
        }
        // if the current user does not have a favorite list, create one for them
        else {
            Favorites.create({
                user: req.user._id,
                dishes: [...req.body]
            })
            .then((favorite) => {        
                console.log('Favorite created', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
               }, (err) => next(err))
               .catch((err) => next(err))
        }
    });      
    })
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /favorites endpoint')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({'user': req.user._id})
    .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err))
})
    

{/****************HANDLING THE /favorites/:dishId endpoint*******************/}
favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
    Favorites.findOne({user: req.user._id}, (err, favorite) => {
        if (err) {
            return next(err)
        }
        if (favorite){ // favorite found
            // checking if the about to be added dish does not exist in the list of favorite already
            if (!favorite.dishes.includes(req.params.dishId)){
                favorite.dishes.push(req.params.dishId)
                favorite.save()
                .then((favorite) => {
                    console.log('Dish ' + req.params.dishId + ' added to your list of favorites');
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
            else {
                console.log('Dish ' + req.params.dishId + ' already exist in your list of favorites')
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
            }
        }
        else{
            Favorites.create({ user: req.user._id,
                dishes:[req.params.dishId]
            })
            then((favorite) => {
                console.log('Favorite: ' + favorite + ' added');
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favor);
            }, (err) => next(err))
            .catch((err) => next(err))
        }
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /favorites/dishId');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id}, (err, favorite) => {
        if (err) {
            return next(err)
        }
        if (favorite) {
            if (favorite.dishes.includes(req.params.dishId)) {
                favorite.update({ $pullAll: { 'dishes': [req.params.dishId] }})
                // favorite.save()
                .then((favorite) => {
                    console.log('Dish ' + req.params.dishId + ' removed from your favorite list')
                    res.statusCode = 200
                    res.setHeader('Content-Type','application/json')
                    res.json(favorite)
                }, (err) => next(err))
                .catch((err) => next(err))
            }
            else {
                err = new Error('Dish' + req.params.dishId + ' not found in your favorite list');
                err.statusCode = 404;
                return next(err); 
            }
        }
    })
})

module.exports = favoriteRouter