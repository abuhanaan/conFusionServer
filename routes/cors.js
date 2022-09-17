const express = require('express')
const cors = require('cors')
const app = express()

const whitelist = ['http://localhost:3000', 'https://localhost:3443']
var corsOptionsDelegate = (req, callback) => {
    var corsOptions

    // checking if the the incoming request origin is in the whitelist
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // gives the header Access Allow Control Origin
    }
    else {
        corsOptions = { origin: false } // Access Allow Control Origin will not be returned to the client
    }
    callback(null, corsOptions)
}

exports.cors = cors()
// if no option is supplied in the export above, it returns the CORS ops with wildCard*
exports.corsWithOptions = cors(corsOptionsDelegate) // CORS ops with specific origin