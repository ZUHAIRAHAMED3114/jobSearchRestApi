const { Router } = require('express');
const Error = require('../utility/ErrorHandler');
module.exports = function(err, req, res, next) {
    // comming to discussing with two errors 
    // production
    // development

    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV.trimEnd() === 'development') {
        res.status(err.statusCode)
            .json({
                success: false,
                error: err,
                errMessage: err.message,
                stack: err.stack
            });

    }
    if (process.env.NODE_ENV.trimEnd() === 'production') {
        // copiying the previous error

        // if wrong mongoose object id i.e is invalid id i.e is casting Error
        if (err.name === 'CastError') {
            const Message = 'Resource not found' + err.path;
            err = new Error(Message, 404);
        }


        // Handling mongoose validation Error
        if (err.name === 'ValidationError') {
            err.statusCode = 400;
            let newError = [];
            for (let error of Object.values(err.errors)) {
                newError.push(error.message);
            }
            err.message = newError;

        }
        // handling the mongoose Error
        // Mongoose error means after updating the mongo Db there i will 
        if (err.name === 'MongoError') {
            err.statusCode = 400;
        }
        if (err.name === 'JsonWebTokenError') {
            err.statusCode = 401;
            err.message = 'you are unable to access this services'
        }

        res.status(err.statusCode)
            .json({
                success: false,
                message: err.message || 'internal server error'
            })

    }


}