const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "password must be 6 char or above"],
      select: false,
    },
    profileImage: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    emailConfirm: { type: Boolean, default: false },
    deActiveAt: Boolean,
    confirmOTP:{type:String,select:false}
  },
  {
    timestamps: true,
  },
);

let User = mongoose.model("User", userSchema);

module.exports = User;
