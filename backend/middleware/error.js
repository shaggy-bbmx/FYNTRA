import ErrorHandler from "../utils/errorhandler.js"

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || 'External Server Error'

    if (err.name === 'CastError') {
        const message = `Resources not found. Invalid:${err.path}`
        err = new ErrorHandler(message, 400)
    }

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        error: err.message
    })
}

export default errorMiddleware