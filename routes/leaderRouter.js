const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Leaders = require('../models/leaders')

const leaderRouter = express.Router()

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
.get((req, res, next) => {
    Leaders.find({})
    .then((leaders) => {
        // if promise fulfilled
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leaders) // takes the leaders data and send it to client in json format
    }, (err) => next(err))  // handling error
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.post((req, res, next) => {
    Leaders.create(req.body)
    .then((leader) => {
        // if promise fulfilled
        console.log('Created Leader: ', leader)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader) // show the newly added leader to the client
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.put((req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /leaders')
})
.delete((req, res, next) => {
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err))
})

leaderRouter.route('/:leaderId')
.get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        // if promise fulfilled
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader) // show the specified leader to the client
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.post((req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /leaders/' + req.params.leaderId)
})
.put((req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then((leader) => {
        // if promise fulfilled
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader) // show the updated leader to the client
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err)) // if any error, send it back to the overall error handler
})
.delete((req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, (err) => next(err))  // handling error)
    .catch((err) => next(err))
})



module.exports = leaderRouter