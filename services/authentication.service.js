const MongoDB = require('./mongodb.service')
const { mongoConfig, tokenSecret } = require('../config')
const nodemailer = require('nodemailer')
const fast2sms = require('fast-two-sms')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('../routes/authentication')
const { ObjectID } = require('bson')
const axios = require('axios')
var unirest = require("unirest");



const adminRegister = async (admin) => {
    try {
        let hashedPassword = await bcrypt.hash(admin?.password, 12)
        let adminObject = {
            name: admin?.name,
            username: admin?.username,
            password: hashedPassword
        }
        let savedAdmin = await MongoDB.db
            .collection(mongoConfig.collections.ADMIN)
            .insertOne(adminObject)
    } catch (error) {
        console.log(error);
    }
}

const userRegister = async (user) => {
    try {
        const OTPpass = await bcrypt.hash(user?.password, 12)
        let userObject = {
            username: user?.username,
            email: user?.email,
            password: OTPpass,
            phone: user?.phone,
            img:'',
            lastseen: {
                date: '',
                time: ''
            }
        }
        let savedUser = await MongoDB.db
            .collection(mongoConfig.collections.USERS)
            .insertOne(userObject)

    } catch (error) {
        // console.log(error);
        if (error.status === "11000") { // it could be .status, .code etc.. not sure
            return res.json({ status: "error", msg: "User already exist." });
        }
        return res.json({ status: "error" });

    }


}

const createOTP = async (user) => {
    var digits = '0123456789'
    let OTP = ''
    for (var i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)]
    }
    const OTPpass = await bcrypt.hash(OTP, 12)
    if (user?.email) {
        if (user?.email === 'admin@d2dfix.com') {
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dtwodfix@gmail.com',
                    pass: 'gaiwhblxfmjzebuq'
                }
            })
            let mailDetails = {
                from: 'HomeTech',
                to: `${user?.email}`,
                subject: 'OTP Verification Code',
                text: `your verification code is : ${OTP}`
            }
            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log(`Error Occurs : ${err}`);
                } else {
                    console.log('Email sent successfully');
                }
            });
            return {
                status: true,
                message: 'Otp send successfully'
            }
        }
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dtwodfix@gmail.com',
                pass: 'gaiwhblxfmjzebuq'
            }
        })
        let mailDetails = {
            from: 'D2D Fix',
            to: `${user?.email}`,
            subject: 'OTP Verification Code',
            text: `Your d2dFix verification code is ${OTP}. Please do not share it with anybody.`
        }
        await mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log(`Error Occurs : ${err}`);
            } else {
                console.log('Email sent successfully');
            }
        });

        let savedUser = await MongoDB.db.collection(mongoConfig.collections.USERS)
            .updateOne({ email: user?.email }, { $set: { password: OTPpass } })

        return {
            status: true,
            message: 'Otp send successfully'
        }
    } else {
        console.log('phone otp')
        try {


            var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            req.headers({
                "authorization": "340nl9X6czDQBpWiPCFmLVsMYgbHr1SdIURZo7akwjTyuEKA8G278UZsCPEW3zOKwomIhFtH6MSgr1L5"
            });

            req.form({
                "sender_id": "DTWODF",
                "message": "149215",
                "variables_values": `${OTP}`,
                "route": "dlt",
                "numbers": `${user?.phone}`,
            });

            req.end(function (res) {
                if (res.error) {
                    throw new Error(res.error);
                } else {

                    console.log(res.body);
                    return {
                        status: true,
                        message: 'sms sent successfully'
                    }
                }
            });

            let savedUser = await MongoDB.db.collection(mongoConfig.collections.USERS)
                .updateOne({ phone: user?.phone }, { $set: { password: OTPpass } })

            return {
                status: true,
                message: 'Otp send successfully'
            }



        } catch (error) {
            console.log(error);
        }

    }

}



const adminLogin = async (admin) => {
    let adminObject = {
        username: admin?.username,
        password: admin?.password
    }
    let savedAdmin = await MongoDB.db.collection(mongoConfig.collections.ADMIN)
        .findOne({ username: admin?.username })
    if (!savedAdmin) {
        return {

            error: true,
            message: 'no user found'
        }
    } else {
        let isPasswordVerified = await bcrypt.compare(admin?.password, savedAdmin.password)
        if (isPasswordVerified) {
            let token = await jwt.sign({ username: adminObject?.username }, tokenSecret)
            const { _id, username, name } = savedAdmin
            return {
                status: true,
                message: 'admin Logged in Successfully',
                token: token,
                admin: { _id, username, name }
            }
        } else {
            return {
                status: false,
                error: 'user Login failed'
            }
        }
    }

}

const userLogin = async (user) => {
    if (user?.email) {
        let userObject = {
            email: user?.email,
            password: user?.password
        }
        let savedUser = await MongoDB.db.collection(mongoConfig.collections.USERS)
            .findOne({ email: user?.email })
        let isPasswordVerified = await bcrypt.compare(user?.password, savedUser.password)
        console.log(isPasswordVerified);
        if (isPasswordVerified) {
            let token = await jwt.sign({ email: userObject?.email }, tokenSecret)
            return {
                status: true,
                message: 'user Logged in Successfully',
                data: token,
                name: savedUser.username,
                email: savedUser.email,
                img : savedUser?.img
            }
        } else {
            return {
                status: false,
                error: 'user Login failed'
            }
        }

    } else {
        let userObject = {
            phone: user?.phone,
            password: user?.password
        }
        let savedUser = await MongoDB.db.collection(mongoConfig.collections.USERS)
            .findOne({ phone: user?.phone })
        let isPasswordVerified = await bcrypt.compare(user?.password, savedUser.password)
        if (isPasswordVerified) {
            let token = await jwt.sign({ phone: userObject?.phone }, tokenSecret)
            return {
                status: true,
                message: 'user logged in successfully',
                data: token,
                name: savedUser.username,
                phone: savedUser.phone,
                img : savedUser?.img
            }
        } else {
            return {
                status: false,
                error: 'user login failed'
            }
        }
    }
}

const postUpdate = async (post) => {

    let savedPost = await MongoDB.db.collection(mongoConfig.collections.POST).findOneAndUpdate({ _id: ObjectID(post?.id) }, { $set: { status: post?.status, amount: post?.amount, techie: post?.techie } })
    return savedPost


}

const userDpUpdate = async(user)=>{
    let userData = await MongoDB.db.collection(mongoConfig.collections.USERS).findOneAndUpdate({_id: ObjectID(user?.data?.id)},{$set:{img: user?.data?.img}})
    console.log(userData);
    return userData
}
const userLastSeenUpdate = async (user) => {
        console.log(user);
        let savedUser = await MongoDB.db.collection(mongoConfig.collections.USERS).findOneAndUpdate({ _id: ObjectID(user?.id) }, { $set: { lastseen: user?.lastseen } })
        return savedUser

}

const userNameUpdate = async (user) => {
    console.log(user);
    if (user?.email) {
        let savedUser = await MongoDB.db.collection(mongoConfig.collections.USERS).findOneAndUpdate({ email: user?.email }, { $set: { username: user?.name } })
        return savedUser

    }
    else if (user?.phone) {
        let savedUser = await MongoDB.db.collection(mongoConfig.collections.USERS).findOneAndUpdate({ phone: user?.phone }, { $set: { username: user?.name } })
        return savedUser
    }
}

const userCheck = async (user) => {
    if (user?.email) {
        let userObject = {
            username: '',
            email: user?.email,
            password: user?.password,
            phone: user?.phone
        }

        let savedUser = await MongoDB.db.collection(mongoConfig.collections.USERS)
            .findOne({ email: user?.email })
        if (!savedUser) {
            let createUser = await MongoDB.db.collection(mongoConfig.collections.USERS)
                .insertOne(userObject)
            return {
                status: true,
                message: 'user Created successfully',

            }
        }
        else {
            return {
                status: true,
                message: 'user already exist',
                name: savedUser.username
            }
        }
    }
    else if (user?.phone) {
        let userObject = {
            username: user?.username,
            email: user?.email,
            password: user?.password,
            phone: user?.phone
        }
        let savedUser = await MongoDB.db.collection(mongoConfig.collections.USERS)
            .findOne({ phone: user?.phone })
        if (!savedUser) {
            let createUser = await MongoDB.db.collection(mongoConfig.collections.USERS)
                .insertOne(userObject)
            return {
                status: true,
                message: 'user Created successfully',

            }
        }
        else {
            return {
                status: true,
                message: 'user already exist',
                name: savedUser.username
            }
        }
    }
}

const tokenVerification = async (req, res, next) => {
    console.log(`authentication.service | tokenVerification | ${req?.originalUrl}`);
    try {
        if (req?.originalUrl.endsWith('/') || req?.originalUrl.endsWith('/login') || req?.originalUrl.endsWith('/otp') || req?.originalUrl.endsWith('/register') || req?.originalUrl.endsWith('/userUpdate') || req?.originalUrl.endsWith('/refresh-token') || req?.originalUrl.endsWith('/add-admin') || req?.originalUrl.endsWith('/admin-login') || req?.originalUrl.endsWith('/lastseen'))  {
            return next()
        }
        let token = req?.headers["authorization"]
        if (token && token.startsWith("Bearer ")) {
            token = token.slice(7, token?.length)
            jwt.verify(token, tokenSecret, (error, decoded) => {
                if (error) {
                    res.status(401).json({
                        status: false,
                        message: error?.name ? error?.name : 'Invalid Token',
                        error: `Invalid Token | ${error?.message} `
                    })
                } else {
                    req['email'] = decoded?.email
                    next()
                }
            })
        } else {
            res.status(401).json({
                status: false,
                message: 'Token is Missing',
                error: 'Token is missing'
            })
        }
    } catch (error) {
        res.status(401).json({
            status: false,
            message: error?.name ? error?.name : 'Authentication failed',
            error: `Authentication failed | ${error?.message} `
        })
    }
}

const tokenRefresh = async (req, res) => {
    console.log(`authentication.service | tokenRefresh | ${req?.originalUrl}`);
    try {
        console.log('trying');
        let token = req?.headers["authorization"]
        if (token && token.startsWith("Bearer ")) {
            console.log('if started');
            token = token.slice(7, token?.length)
            jwt.verify(token, tokenSecret, { ignoreExpiration: true }, (error, decoded) => {
                if (error) {
                    console.log('error here');
                    res.status(401).json({
                        status: false,
                        message: error?.name ? error?.name : 'Invalid Token ',
                        error: `Invalid Token | ${error?.message} `,
                        body: 'no body'
                    })
                } else {

                    if (decoded?.email) {
                        let newToken = jwt.sign({ email: decoded?.email }, tokenSecret, { expiresIn: '24h' })
                        res.json({
                            status: true,
                            message: 'user Logged in Successfully',
                            data: newToken,

                        })
                    } else {
                        console.log('2');
                        res.status(401).json({
                            status: false,
                            message: error?.name ? error?.name : 'Invalid Token ',
                            error: `Invalid Token | ${error?.message} `
                        })
                    }
                }
            })
        } else {
            console.log('3');
            res.status(401).json({
                status: false,
                message: error?.name ? error?.name : 'Token missing',
                error: ` Token missing | ${error?.message} `
            })
        }
    } catch (error) {
        console.log('4');
        res.status(401).json({
            status: false,
            message: error?.name ? error?.name : 'Token refresh failed',
            error: `Token refresh failed | ${error?.message} `
        })
    }

}



module.exports = { userRegister, createOTP, userCheck, userLogin, userNameUpdate, tokenVerification, tokenRefresh, adminRegister, adminLogin, postUpdate,userLastSeenUpdate, userDpUpdate }