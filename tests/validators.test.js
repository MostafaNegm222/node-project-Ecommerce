const addProduct = require("../validators/addProduct");
const editProduct = require("../validators/editProduct");
const login = require("../validators/login");
const register = require("../validators/register");

const validProduct = {
  name: "Gaming Laptop", title: "Laptop Pro 15", description: "Fast laptop for work",
  category: "Computers", price: 5000,
};

describe("register schema", () => {
  test("accepts a valid body", async () => {
    await expect(
      register.validate({ name: "Mostafa Negm", email: "a@b.com", password: "secret1" })
    ).resolves.toBeTruthy();
  });

  test("reports every problem at once", async () => {
    const err = await register
      .validate({ name: "abc", email: "not-an-email", password: "123" }, { abortEarly: false })
      .catch((e) => e);
    expect(err.errors).toEqual(
      expect.arrayContaining([
        "name must be 6 char or above",
        "email is invalid",
        "password must be 6 char or above",
      ])
    );
  });
});

describe("login schema", () => {
  test("requires an email", async () => {
    await expect(login.validate({ password: "secret1" })).rejects.toThrow("email is required");
  });
});

describe("addProduct schema", () => {
  test("accepts a valid product", async () => {
    await expect(addProduct.validate(validProduct)).resolves.toBeTruthy();
  });

  test("rejects a price of zero and a price above 12000", async () => {
    await expect(addProduct.validate({ ...validProduct, price: 0 })).rejects.toThrow("price must be above zero");
    await expect(addProduct.validate({ ...validProduct, price: 12001 })).rejects.toThrow("price must be below 12k");
  });

  test("requires a category", async () => {
    const { category, ...rest } = validProduct;
    await expect(addProduct.validate(rest)).rejects.toThrow("category is required");
  });
});

describe("editProduct schema", () => {
  test("allows a partial update", async () => {
    await expect(editProduct.validate({ price: 100 })).resolves.toBeTruthy();
  });

  test("still enforces limits on the fields that are sent", async () => {
    await expect(editProduct.validate({ name: "abc" })).rejects.toThrow("name must be 6 char or above");
  });
});
