const User = require('../Models/UserModel');
const cachingAsynError = require('../MIddleWares/catchingAsyncError');
const ErrorHandler = require('../utility/ErrorHandler');
const bcrypt = require('bcryptjs');
const sendToken = require('../utility/sendingTokeninCookie');
const sendEmail = require('../utility/SendingEmail');

// end point as :-> api/Register

let actionHandler = {

    registerUser: cachingAsynError(async(req, res, next) => {
        const { name, email, role, password } = req.body;
        const currentUser = await User.create({
            name,
            email,
            role,
            password
        });

        var jwtToken = currentUser.getJwtToken();
        console.log(jwtToken)
        res.status(200)
            .json({
                success: true,
                message: 'user is registered successfully',
                token: jwtToken
            })
    }),

    loginUser: cachingAsynError(async(req, res, next) => {
        const { email, password } = req.body;

        //after getting email , password :-we have to compare this password

        if (!email || !password) {
            return next(new ErrorHandler('please enter email and password', 404));
        }
        // checking wheather the email is registered email or not 
        // if not registered then it will return error

        const userdata = await User.findOne({ email }).select('+password');
        if (!userdata) {
            return next(new ErrorHandler('Invalid Email or Password', 401));
        }

        // after knowing the registered email then 
        //  checking wheather both password are same or not..

        //  const isValid = bcrypt.compareSync(password, userdata.password)
        const isValid = userdata.comparePassword(password)
        if (!isValid) {
            return res.status(401)
                .json({
                    success: false,
                    message: 'invalid username and password'
                })
        }

        sendToken(userdata, 201, req, res);

    }),

    forgetPassword: cachingAsynError(async(req, res, next) => {

        const { email } = req.body;
        const userInstance = await User.findOne({ email }).select('+password');
        console.log(userInstance);
        // checking wheather the user email is present in the data base or not
        if (!userInstance) {
            return next(new ErrorHandler(`NO user Found with this ${email}`, 404));
        }

        // Getting the reset password tokent
        // this below method will assing the resetPasswordtoken to the model instance
        // in the encrypted hash format... and  the Expires time period of 30 minutes

        let resetToken = userInstance.getResetPasswordToken();
        console.log(resetToken);
        await userInstance.save();


        //after saving the resetToken in the DataBase now we are sending 
        //this resetToken through the email....

        //creating a reset password url....
        const resetUrl = `${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`;
        const message = `here password reset link as follows:\n\n\n\n${resetUrl}\n\n\n if you have not request this,then please ignore that`;

        let optionstoEmail = {
            email: userInstance.email,
            subject: 'Reset Password Token',
            text: message

        };
        console.log(optionstoEmail.email);
        console.log(optionstoEmail.subject);
        console.log(message);

        try {

            await sendEmail(optionstoEmail);

            res.status(200)
                .json({
                    success: true,
                    message: 'email send successfully to the ' + userInstance.email
                })
        } catch (error) {

            userInstance.getResetPasswordToken = undefined;
            userInstance.resetPasswordExpire = undefined;
            // mainly above two properties are to be added
            // by the getResetPasswordToken()..
            // to the userInstance..    

            // 
            next(new ErrorHandler('Email is not sent :-> please update with valid email ', 500))

        }
        //sending Email



    })

}

module.exports = actionHandler;