const mongoose = require("mongoose")

const ProductSchema = mongoose.Schema({
    title : {
        type : String,
        minLength : [3,"title must be 3 characters or above"],
        maxLength : [30,"title must be below 30 characters "],
        required : true,
    },
    name : {
        type : String,
        minLength : [3,"name must be 3 characters or above"],
        maxLength : [30,"name must be below 30 characters "],
        required : true,
    },
    description : {
        type : String,
        minLength : [3,"name must be 3 characters or above"],
        required : true,
    },
    image :{
        type : String,
        minLength : [3,"name must be 3 characters or above"],
    },
    price : {
        type : Number,
        default : 0
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    updatedAt : {
        type : Date,
    },
    isDeleted: {
        type : Boolean,
        default : false
    },
    deletedAt : {
        type : Date
    },
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

// ProductSchema.index({
//      title: "text",
//      name: "text",
//      description:"text"
// })

const Product = mongoose.model("product",ProductSchema)

module.exports = Product