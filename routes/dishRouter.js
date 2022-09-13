const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')

const Dishes = require('../models/dishes')

const dishRouter = express.Router()

dishRouter.use(bodyParser.json())


dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        // if promise fulfilled
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes) // takes the dishes data and send it to client in json format
    }, (err) => next(err))  // handling error
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        // if promise fulfilled
        console.log('Created Dish: ', dish)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish) // show the newly added dish to the client
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /dishes')
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err))
})

dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        // if promise fulfilled
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish) // show the specified dish to the client
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /dishes/' + req.params.dishId)
})
.put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true })
    .then((dish) => {
        // if promise fulfilled
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish) // show the updated dish to the client
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err))
})


{/****************HANDLING THE /dishes/:dishId/comments endpoint*******************/}
dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null) { // checking if dish actually exists
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish.comments) // takes the comments of the specified dish and send it to client in json format
        }
        else {
            err = new Error('Dish ' + req.params.dishId + 'not found')
            err.status = 404
            return next(err)
        }
        }, (err) => next(err))  // handling error
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) { // checking if dish actually exists
            req.body.author = req.user._id
            dish.comments.push(req.body)
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish) => {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(dish) // takes the specified dish and send it to client in json format
                    })
                }, (err) => next(err))
        }
        else {
            err = new Error('Dish ' + req.params.dishId + 'not found')
            err.status = 404
            return next(err)
        }
        }, (err) => next(err))  // handling error)
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /dishes/'
    + req.params.dishId + '/comments')
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) { // checking if dish actually exists
            // looping through the comments array and deleting each of them
            for (var i = (dish.comments.length -1); i>=0; i--) {
                dish.comments.id(dish.comments[i]._id).remove()
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish) // takes the specified dish and send it to client in json format
            }, (err) => next(err))
        }
        else {
            err = new Error('Dish ' + req.params.dishId + 'not found')
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err))
})


{/****************HANDLING THE /dishes/:dishId/comments/:commentId endpoint*******************/}
dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) { // checking if specified dish and specified comment of dish actually exist
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish.comments.id(req.params.commentId)) // takes the specified comment of the specified dish and send it to client in json format
        }
        else if (dish == null){
            err = new Error('Dish ' + req.params.dishId + 'not found')
            err.status = 404
            return next(err)
        }
        else {
            err = new Error('Comment ' + req.params.commentId + 'not found')
            err.status = 404
            return next(err)
        }
        }, (err) => next(err))  // handling error)
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /dishes/' + req.params.dishId
    + '/comments/' + req.params.commentId)
})
.put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) { // checking if specified dish and specified comment of dish actually exist
            // explicitly specifying the fields the user is allowed to modify
            if (req.body.rating){
                dish.comments.id(req.params.commentId).rating = req.body.rating
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment
            }
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(dish) // takes the specified dish and send it to client in json format 
                })
                }, (err) => next(err))
        }
        else if (dish == null){
            err = new Error('Dish ' + req.params.dishId + 'not found')
            err.status = 404
            return next(err)
        }
        else {
            err = new Error('Comment ' + req.params.commentId + 'not found')
            err.status = 404
            return next(err)
        }
        }, (err) => next(err))  // handling error
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) { // checking if specified dish and specified comment of dish actually exist
            dish.comments.id(req.params.commentId).remove() // removing the specified comment
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(dish) // takes the specified dish and send it to client in json format 
                })
            }, (err) => next(err))
        }
        else if (dish == null){
            err = new Error('Dish ' + req.params.dishId + 'not found')
            err.status = 404
            return next(err)
        }
        else {
            err = new Error('Comment ' + req.params.commentId + 'not found')
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))  // handling error
    .catch((err) => next(err))
})

module.exports = dishRouter
