const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const imageFileFilter = (req, file, cb) => {
    // checking if the extension of file to be uploaded match any of the given options
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can only upload image files!'), false)
    }
    cb(null, true)
}

const upload = multer({storage: storage,
                    fileFilter: imageFileFilter})

const uploadRouter = express.Router()

uploadRouter.use(bodyParser.json())

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end('GET operation not supported on /imageUpload')
})
uploadRouter.route('/')
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(req.file)
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /imageUpload')
})
uploadRouter.route('/')
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end('DELETE operation not supported on /imageUpload')
})

module.exports = uploadRouter