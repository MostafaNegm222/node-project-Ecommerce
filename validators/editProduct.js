const yup = require("yup");

let editProductSchema = yup.object(
  {
    name: yup
      .string()
      .min(6, "name must be 6 char or above")
      .max(30, "name must be below 30 char"),
    title: yup
      .string()
      .min(6, "title must be 6 char or above")
      .max(30, "title must be below 30 char"),
    description: yup
      .string()
      .min(6, "description must be 6 char or above"),
    category: yup
      .string()
      .min(6, "category must be 6 char or above")
      .max(30, "category must be below 30 char"),
    price: yup
      .number()
      .min(1,"price must be above zero")
      .max(12000,"price must be below 12k"),
  }
);

module.exports = editProductSchema;