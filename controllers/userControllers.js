let User = require("../models/userModel.js")

exports.getAllUsers = async (req,res) => {
    let users = await User.find()
    res.status(200).json({
        users
    })
}