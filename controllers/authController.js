const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {promisify} = require("util")
const User = require("../models/userModel.js")
const asyncCatch = require("../utils/asyncCatch.js")
const sendMail = require("../utils/email.js")
const template = require("../utils/emailHTML.js")
const { customAlphabet } = require("nanoid");
const AppError = require("../utils/classError.js")


const jwtSign = promisify(jwt.sign)

exports.signup = asyncCatch(async (req,res,next) => {
    // check email if exists 
    let {email,password} = req.body
    let findUser = await User.findOne({email}) 
    if(findUser) return next(new AppError("Invalid Credential",400))
    // hashing password
    let salt = await bcrypt.genSalt(+process.env.SALT_ROUND)
    let hashedPassword = await bcrypt.hash(password,salt)
    // send otp 
    const otp = customAlphabet("0123456789", 6)();
    sendMail(email,"confirm email","",template("confirm email",req.body.name,otp))
    const hashOTP = await bcrypt.hash(otp,salt);
    let user = await User.create({...req.body,password:hashedPassword,confirmOTP:hashOTP})
    user.password = undefined
    user.confirmOTP = undefined
    res.status(201).json({
        success:true,
        user
    })
})

exports.confirmEmail = asyncCatch(async (req,res,next) => {
    // check email if exists 
    let {email,confirmOTP} = req.body
    let findUser = await User.findOne({email}).select("+confirmOTP") 
    if(!findUser) return next(new AppError("email not found please signup!",400))
    if(findUser.confirmEmail) return next(new AppError("email is already active!",400))
    if(!confirmOTP) return next(new AppError("please send OTP",400))
    let check = await bcrypt.compare(confirmOTP,findUser.confirmOTP)
    if(!check) return next(new AppError("OTP is invalid please try again!",400))
    sendMail(email,"confirm email","email confirm successfully ✅")
    let user = await User.findByIdAndUpdate(findUser._id,{emailConfirm:true,$unset:{confirmOTP:""}},{new:true})
    res.status(201).json({
        user
    })
})

exports.login = asyncCatch(async (req,res,next) => {
    // user exist or not
    let {email,password} = req.body
    let findUser = await User.findOne({email}).select("+password")
    if(!findUser) return next(new AppError("Invalid Credential",400))
    if(!findUser.emailConfirm) return next(new AppError("please confirm your email first!",401))
    // password === hashed password
    let isMatched = await bcrypt.compare(password,findUser.password)
    let token = await jwtSign({id:findUser._id},process.env.SECRET_KEY,{expiresIn:"7d"})
    findUser.confirmOTP = undefined
    if(isMatched) {
        res.status(200).json({token})
    } else {
        return next(new AppError("Invalid Credential",400))
    }
})



exports.forgetPassword = asyncCatch(async (req,res,next) => {
    let {email} = req.body
    let findUser = await User.findOne({email})
    if(!findUser) return next(new AppError("email not found please signup!",400))
    // send otp 
    const otp = customAlphabet("0123456789", 6)();
    sendMail(email,"Forget password","",template("Forget password",findUser.name,otp))
    let salt = await bcrypt.genSalt(+process.env.SALT_ROUND)
    const hashOTP = await bcrypt.hash(otp,salt);
    let user = await User.findByIdAndUpdate(findUser._id,{confirmOTP:hashOTP})
    user.confirmOTP = undefined
    res.status(201).json({
        success:true,
        message : "OTP Sent to Your Email"
    })
})


exports.resetPassword = asyncCatch(async (req,res,next) => {
    // check email if exists 
    let {email,confirmOTP,newPassword,RepeatPassword} = req.body
    let findUser = await User.findOne({email}).select("+confirmOTP") 
    if(!findUser) return next(new AppError("email not found please signup!",400))
    if(!confirmOTP) return next(new AppError("please send OTP",400))
    let check = await bcrypt.compare(confirmOTP,findUser.confirmOTP)
    if(!check) return next(new AppError("OTP is invalid please try again!",400))
    if(newPassword != RepeatPassword) return next(new AppError("password and confirm password doesn't match",400))
      // hashing password
    let salt = await bcrypt.genSalt(+process.env.SALT_ROUND)
    let hashedPassword = await bcrypt.hash(newPassword,salt)
    let user = await User.findByIdAndUpdate(findUser._id,{password:hashedPassword,$unset:{confirmOTP:""}},{new:true})
    sendMail(email,"confirm email","email confirm successfully ✅")
    user.password = undefined
    user.confirmOTP = undefined
    res.status(201).json({
        success:true,
        user
    })
})