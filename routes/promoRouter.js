const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')

const Promotions = require('../models/promotions')

const promoRouter = express.Router()

promoRouter.use(bodyParser.json())

promoRouter.route('/')
.get((req, res, next) => {
    Promotions.find({})
    .then((promotions) => {
        // if promise fulfilled
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotions) // takes the promotions data and send it to client in json format
    }, (err) => next(err))  // handling error
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.post(authenticate.verifyUser, (req, res, next) => {
    Promotions.create(req.body)
    .then((promo) => {
        // if promise fulfilled
        console.log('Created Promo: ', promo)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promo) // show the newly added promo to the client
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /promotions')
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err))
})

promoRouter.route('/:promoId')
.get((req, res, next) => {
    Promotions.findById(req.params.promoId)
    .then((promo) => {
        // if promise fulfilled
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promo) // show the specified promo to the client
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /promotions/' + req.params.promoId)
})
.put(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true })
    .then((promo) => {
        // if promise fulfilled
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promo) // show the updated promo to the client
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err))
})



module.exports = promoRouter