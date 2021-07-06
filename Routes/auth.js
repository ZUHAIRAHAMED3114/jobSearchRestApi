const router = require('express').Router();
const { registerUser, loginUser, forgetPassword } = require('../Controllers/authController')

router.route('/register')
    .post(registerUser);

router.route('/login')
    .post(loginUser);

router.route('/password/reset:resetToken')
    .post((req, res, next) => {
        console.log(`${req.params.resetToken}`)
        console.log(`updating the new passwooooooooord`)

    });

router.route('/password/forgetpassword')
    .post(forgetPassword)

module.exports = router;