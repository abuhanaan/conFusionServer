const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Dishes = require('../models/dishes')

const dishRouter = express.Router()

dishRouter.use(bodyParser.json())

dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({})
    .then((dishes) => {
        // if promise fulfilled
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes) // takes the dishes data and send it to client in json format
    }, (err) => next(err))  // handling error
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.post((req, res, next) => {
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
.put((req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /dishes')
})
.delete((req, res, next) => {
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
    .then((dish) => {
        // if promise fulfilled
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish) // show the specified dish to the client
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.post((req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /dishes/' + req.params.dishId)
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err))
})


module.exports = dishRouter