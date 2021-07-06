const { Schema, model } = require('mongoose');
const validator = require('validator');
const { schema } = require('./JobsModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchemaOption = {
    name: {
        type: String,
        required: [true, 'please enter your name']
    },
    email: {
        type: String,
        required: [true, 'please enter your email addres'],
        unique: true,
        validate: [validator.isEmail, 'please enter your valid Email']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'employeer'],
            message: 'please select correct role'

        },
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'please enter password for your account'],
        minlength: [8, 'your password must be atlease 8 characters long'],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }

}


const userSchema = new Schema(userSchemaOption);

// there is pre Event firing will be happen..

userSchema.pre('save', async function(next) {
    let currentUser = this;
    console.log("before hashing" + currentUser);
    let { password } = currentUser
    let salt = bcrypt.genSaltSync(10);
    let passwordHashing = bcrypt.hashSync(password, salt);
    currentUser.password = passwordHashing;
    console.log("after hashing" + currentUser);

    next();
})

// creating user Modle instance method :-> 
userSchema.method('getResetPasswordToken', function() {

    //Generating a Token
    const resetToken = crypto
        .randomBytes(20)
        .toString('hex');
    //hashing to the above Token
    this.resetPasswordToken = crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 30 * 60 * 100;

    return resetToken;



});


userSchema.method('getJwtToken', function() {
    // here this refer to the instance of the Model

    var token = jwt.sign({ id: this._id },
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME
        });

    return token;
});

userSchema.method('comparePassword', function(stringPassword) {
    return bcrypt.compareSync(stringPassword, this.password);
});

const userModel = model('User', userSchema);
module.exports = userModel;