const express = require('express')
const bodyParser = require('body-parser')

const leaderRouter = express.Router()

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
    // whatever method comes in to the /leaders endpoint, this block would first of all
    // be executed and whatever data that comes in would be passed as parameters
    // to the corresponding method (get, post, put or delete) as specified in the methods below
})
.get((req, res, next) => {
    res.end('Will send all the leaders to you')
})
.post((req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + ' with details: '
    + req.body.description)
})
.put((req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /leaders')
})
.delete((req, res, next) => {
    res.end("Deleting all the leaders")
})

leaderRouter.route('/:leaderId')
.all((req,res,next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
    // whatever method comes in to the /leaders endpoint, this block would first of all
    // be executed and whatever data that comes in would be passed as parameters
    // to the corresponding method (get, post, put or delete) as specified in the methods below
})
.get((req, res, next) => {
    res.end('Will send details of the leader: ' + req.params.leaderId +
    ' to you')
})
.post((req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /leaders/' + req.params.leaderId)
})
.put((req, res, next) => {
    res.write('Updating the leader: ' + req.params.leaderId + '\n')
    res.end('Will update the leader: ' + req.body.name +
    ' with details ' + req.body.description)
})
.delete((req, res, next) => {
    res.end("Deleting leader: " + req.params.leaderId)
})


module.exports = leaderRouter