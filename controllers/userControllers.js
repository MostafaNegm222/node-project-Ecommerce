let User = require("../models/userModel.js");
const ApiFeatures = require("../utils/apiFeatures.js");
const asyncCatch = require("../utils/asyncCatch.js");

exports.getAllUsers = async (req,res) => {
    let features = new ApiFeatures(User.find({isActive:true}), req.query);
    features.filter().search().sort().fields().pagination();
    const users = await features.query;
    let count = await User.countDocuments()
    res.status(200).json({
      success: true,
      count,
      usersCount: users.length,
      users,
    });
}

exports.getOneUser = asyncCatch(async (req,res) => {
    let user = await User.findById(req.params.id);
    if (
      !user ||
      (await User.findOne({ isActive: false, _id: req.params.id }))
    ) {
      return next(new AppError("USER NOT FOUND",404))
    }
    res.status(200).json({
      success: true,
      user,
    });
})


exports.createUser = asyncCatch(async (req, res) => {
      let user = await User.create({...req.body});
      res.status(201).json({
        success: true,
        user,
      });
});

exports.updateUser = asyncCatch(async (req, res) => {
    let {name,profileImage} = req.body
    let user = await User.findByIdAndUpdate(
      req.params.id,
      {name,profileImage,updatedAt: Date.now()},
      { new: true, runValidators: true }
    );
    if (!user) {
      return next(new AppError("USER NOT FOUND",404))
    }
    if(req.body.password || req.body.email || req.body.role) {
        return next(new AppError("Can't Edit this fields",400))
    }
    res.status(200).json({
      success: true,
      user,
    });
})

exports.updateUserRole = asyncCatch(async (req, res) => {
    let user = await User.findByIdAndUpdate(
      req.params.id,
      {role:"admin",updatedAt: Date.now()},
      { new: true, runValidators: true }
    );
    if (!user) {
      return next(new AppError("USER NOT FOUND",404))
    }
    res.status(200).json({
      success: true,
      message: "user role update successfully"
    });
})

exports.deleteUser = asyncCatch(async (req, res) => {
    let user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
        deActiveAt: Date.now(),
      },
      { new: true }
    );
    if (!user) {
      return next(new AppError("USER NOT FOUND",404))
    }
    res.status(200).json({
      success: true,
      user,
    });
  })


  exports.deleteUserPermanently = asyncCatch(async (req, res) => {
      let user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return next(new AppError("USER NOT FOUND",404))
      }
      res.status(204).json({
        success: true,
      });
    })
