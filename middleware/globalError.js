const AppError = require("../utils/classError");

const TokenExpired = () => {
    return new AppError("you are unauthenticated please log in",401)
} 
const JWTError = () => {
    return new AppError("token is not valid",401)
} 
module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode;
  if (err.name == "TokenExpiredError") {
    error = TokenExpired()
  }
  if (err.name == "JsonWebTokenError") {
    error = JWTError()
  }


  if (err.name === "CastError")
    error = new AppError(`Invalid${err.path}:${err.value}`, 400);

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`${field} already exists`, 400);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(e => e.message);
    error = new AppError(messages.join(", "), 400);
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};
