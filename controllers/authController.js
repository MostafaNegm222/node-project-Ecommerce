const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {promisify} = require("util")
const User = require("../models/userModel.js")
const asyncCatch = require("../utils/asyncCatch.js")
const sendMail = require("../utils/email.js")
const template = require("../utils/emailHTML.js")
const { customAlphabet } = require("nanoid");


const jwtSign = promisify(jwt.sign)

exports.signup = asyncCatch(async (req,res) => {
    // check email if exists 
    let {email,password} = req.body
    let findUser = await User.findOne({email}) 
    if(findUser) return res.status(400).json({message:"Invalid Credential"})
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
        user
    })
})

exports.confirmEmail = asyncCatch(async (req,res) => {
    // check email if exists 
    let {email,confirmOTP} = req.body
    let findUser = await User.findOne({email}).select("+confirmOTP") 
    if(!findUser) return res.status(400).json({message:"email not found please signup!"})
    if(findUser.confirmEmail) return res.status(400).json({message:"email is already active!"})
    if(!confirmOTP) return res.status(400).json({message:"please send OTP"})
    let check = await bcrypt.compare(confirmOTP,findUser.confirmOTP)
    if(!check) return res.status(400).json({message:"OTP is invalid please try again!"})
    sendMail(email,"confirm email","email confirm successfully ✅")
    let user = await User.findByIdAndUpdate(findUser._id,{emailConfirm:true,$unset:{confirmOTP:""}},{new:true})
    res.status(201).json({
        user
    })
})

exports.login = async (req,res) => {
    // user exist or not
    let {email,password} = req.body
    let findUser = await User.findOne({email}).select("+password")
    if(!findUser) return res.status(400).json({message:"Invalid Credential"})
    if(!findUser.emailConfirm) return res.status(401).json({message:"please confirm your email first!"})
    // password === hashed password
    let isMatched = await bcrypt.compare(password,findUser.password)
    let token = await jwtSign({id:findUser._id},process.env.SECRET_KEY,{expiresIn:"7d"})
    if(isMatched) {
        res.status(200).json({token})
    } else {
        return res.status(400).json({message:"Invalid Credential"})
    }
}