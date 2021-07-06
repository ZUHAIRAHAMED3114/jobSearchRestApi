module.exports = (user, statusCode, req, res) => {

    // creating the token
    const token = user.getJwtToken();

    // options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    // sending the response by assing the cookie  header
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })

}