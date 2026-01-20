const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {promisify} = require("util")
const User = require("../models/userModel.js")
const asyncCatch = require("../utils/asyncCatch.js")
const sendMail = require("../utils/email.js")

const jwtSign = promisify(jwt.sign)

exports.signup = asyncCatch(async (req,res) => {
    // check email if exists 
    let {email,password} = req.body
    // let findUser = await User.findOne({email}) 
    // if(findUser) return res.status(400).json({message:"Invalid Credential"})
    // hashing password
    let salt = await bcrypt.genSalt(+process.env.SALT_ROUND)
    let hashedPassword = await bcrypt.hash(password,salt)
    console.log(password,hashedPassword);
    let user = await User.create({...req.body,password:hashedPassword})
    user.password = undefined
    res.status(201).json({
        user
    })
})

exports.login = async (req,res) => {
    // user exist or not
    let {email,password} = req.body
    let findUser = await User.findOne({email}).select("+password")
    if(!findUser) return res.status(400).json({message:"Invalid Credential"})
    // password === hashed password
    let isMatched = await bcrypt.compare(password,findUser.password)
    let token = await jwtSign({id:findUser._id},process.env.SECRET_KEY,{expiresIn:"7d"})
    await sendMail(email,"send Token",token)
    if(isMatched) {
        res.status(200).json({token})
    } else {
        return res.status(400).json({message:"Invalid Credential"})
    }
}