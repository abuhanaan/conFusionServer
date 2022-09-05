const express = require('express')
const bodyParser = require('body-parser')

const dishRouter = express.Router()
// const dishRouter2 = express.Router()

dishRouter.use(bodyParser.json())
// dishRouter2.use(bodyParser.json())

dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
    // whatever method comes in to the /dishes endpoint, this block would first of all
    // be executed and whatever data that comes in would be passed as parameters
    // to the corresponding method (get, post, put or delete) as specified in the methods below
})
.get((req, res, next) => {
    res.end('Will send all the dishes to you')
})
.post((req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: '
    + req.body.description)
})
.put((req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /dishes')
})
.delete((req, res, next) => {
    res.end("Deleting all the dishes")
})

dishRouter.route('/:dishId')
.all((req,res,next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
    // whatever method comes in to the /dishes endpoint, this block would first of all
    // be executed and whatever data that comes in would be passed as parameters
    // to the corresponding method (get, post, put or delete) as specified in the methods below
})
.get((req, res, next) => {
    res.end('Will send details of the dish: ' + req.params.dishId +
    ' to you')
})
.post((req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /dishes/' + req.params.dishId)
})
.put((req, res, next) => {
    res.write('Updating the dish: ' + req.params.dishId + '\n')
    res.end('Will update the dish: ' + req.body.name +
    ' with details ' + req.body.description)
})
.delete((req, res, next) => {
    res.end("Deleting dish: " + req.params.dishId)
})


module.exports = dishRouter