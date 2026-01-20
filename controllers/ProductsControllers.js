const Product = require("../models/productModel.js");
const ApiFeatures = require("../utils/apiFeatures.js");
const AppError = require("../utils/classError.js")
const asyncCatch = require("../utils/asyncCatch.js");
const jwt = require("jsonwebtoken");

exports.getAllProducts = asyncCatch(async (req, res) => {
    let features = new ApiFeatures(Product.find({isDeleted:false}), req.query);
    features.filter().search().sort().fields().pagination();
    const products = await features.query;
    let count = await Product.countDocuments()
    res.status(200).json({
      success: true,
      count,
      ProductsCount: products.length,
      products,
    });
  })

exports.getStatus = asyncCatch(async (req,res) => {
  let status = await Product.aggregate([
    {$group : {
      _id : "$category",
      sum : {$sum : 1},
      min : {$min : "$price"},
      max : {$max : "$price"},
      avg : {$avg : "$price"}
    }}
  ])
  res.status(200).json({
    status
  })
})

exports.getOneProduct = asyncCatch(async (req, res,next) => {
    let product = await Product.findById(req.params.id);

    if (
      !product ||
      (await Product.findOne({ isDeleted: true, _id: req.params.id }))
    ) {
      return next(new AppError("PRODUCT NOT FOUND",404))
    }
    res.status(200).json({
      success: true,
      product,
    });
});

exports.getProductsForUser = asyncCatch(async (req,res,next) => {
  let {_id} = req.user
  let products = await Product.find({userID:_id}).populate("userID","name email")

  res.status(200).json({products})
})

exports.createProduct = asyncCatch(async (req, res) => {
    if(req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1]
      let {id} = jwt.verify(token,process.env.SECRET_KEY)
      let product = await Product.create({...req.body,userID:id});
      res.status(201).json({
        success: true,
        product,
      });
    }
});

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!product) {
      return next(new AppError("PRODUCT NOT FOUND",404))
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        deletedAt: Date.now(),
      },
      { new: true }
    );
    if (!product) {
      return next(new AppError("PRODUCT NOT FOUND",404))
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getDeletedItems = async (req, res) => {
  try {
    let products = await Product.find(
      { isDeleted: true },
      { name: 1, price: 1 }
    );
    res.status(200).json({
      success: true,
      ProductsCount: products.length,
      products,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err,
    });
  }
};
