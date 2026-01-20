const AppError = require("../utils/classError");
const asyncCatch = require("../utils/asyncCatch.js");
module.exports = (schema) => async (req, res, next) => {
  try {
    let checkSchema = await schema.validate(req.body, { abortEarly: false });
    if (checkSchema) {
      next();
    }
  } catch (err) {
    const errors = err.errors.join(", ")
    next(new AppError(errors, 400));
  }
};
