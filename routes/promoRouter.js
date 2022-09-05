const express = require('express')
const bodyParser = require('body-parser')

const promoRouter = express.Router()

promoRouter.use(bodyParser.json())

promoRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
    // whatever method comes in to the /promotions endpoint, this block would first of all
    // be executed and whatever data that comes in would be passed as parameters
    // to the corresponding method (get, post, put or delete) as specified in the methods below
})
.get((req, res, next) => {
    res.end('Will send all the promos to you')
})
.post((req, res, next) => {
    res.end('Will add the promo: ' + req.body.name + ' with details: '
    + req.body.description)
})
.put((req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /promotions')
})
.delete((req, res, next) => {
    res.end("Deleting all the promotions")
})

promoRouter.route('/:promoId')
.all((req,res,next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
    // whatever method comes in to the /dishes endpoint, this block would first of all
    // be executed and whatever data that comes in would be passed as parameters
    // to the corresponding method (get, post, put or delete) as specified in the methods below
})
.get((req, res, next) => {
    res.end('Will send details of the promo: ' + req.params.promoId +
    ' to you')
})
.post((req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /promotions/' + req.params.promoId)
})
.put((req, res, next) => {
    res.write('Updating the promo: ' + req.params.promoId + '\n')
    res.end('Will update the promo: ' + req.body.name +
    ' with details ' + req.body.description)
})
.delete((req, res, next) => {
    res.end("Deleting promo: " + req.params.promoId)
})


module.exports = promoRouter