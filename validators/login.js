const yup = require("yup");

let loginSchema = yup.object(
  {
    email: yup.string().required("email is required").email("email is invalid"),
    password: yup.string().min(6, "password must be 6 char or above"),
  }
);

module.exports = loginSchema;