const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');
const catchingAsynError = require('./catchingAsyncError');
const ErrorHandler = require('../utility/ErrorHandler');

// creating a middleware 
// this middleware will check wheather the person is authenticated or not 
// if authenticated then it will  other wise return block the flow and return the response...

module.exports.authenticationMiddleware = catchingAsynError(async(req, res, next) => {
    let token;

    // checking to the header i.e contain the token as bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization;
        token = token.split(' ')[1];
    }


    if (!token) {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }

    // if token exist then parse this token after i.e we retrive the id 
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }

    if (!decoded) {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }
    req.user = await User.findById(decoded.id);
    console.log(req.user)
    next();
});

// handling user roles and exports authorizeds
module.exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resources`, 403))
        }
        next();
    }
}