let asyncHandler = function(callback) {
    return function(req, res, next) {
        return Promise.resolve(callback(req, res, next))
            .catch(next);
    }
}


module.exports = asyncHandler;