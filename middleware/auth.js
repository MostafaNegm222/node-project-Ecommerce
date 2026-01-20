const jwt = require("jsonwebtoken")
const {promisify} = require("util")
const User = require("../models/userModel.js")

const jwtVerify = promisify(jwt.verify)

module.exports = async (req,res,next) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1] // Bearer token
        let decoded = await jwtVerify(token,process.env.SECRET_KEY)
        let user = await User.findById(decoded.id)
        req.user = user
        next()
    } else {
        res.status(401).json({message:"you are not auth please log in"})
    }

}