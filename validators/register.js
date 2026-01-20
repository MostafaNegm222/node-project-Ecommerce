const yup = require("yup");

let registerSchema = yup.object(
  {
    name: yup
      .string()
      .required("name is required")
      .min(6, "name must be 6 char or above")
      .max(20, "name must be below 20 char"),
    email: yup.string().required("email is required").email("email is invalid"),
    password: yup.string().min(6, "password must be 6 char or above"),
  }
);

module.exports = registerSchema;
