const AppError = require("../utils/classError");
const asyncCatch = require("../utils/asyncCatch");
const validator = require("../middleware/validator");
const globalError = require("../middleware/globalError");
const restrictTo = require("../middleware/restrictTo");
const loginSchema = require("../validators/login");

function fakeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("AppError", () => {
  test("keeps message and status and is marked operational", () => {
    const e = new AppError("nope", 404);
    expect(e).toBeInstanceOf(Error);
    expect(e.message).toBe("nope");
    expect(e.statusCode).toBe(404);
    expect(e.isOperational).toBe(true);
  });
});

describe("asyncCatch", () => {
  test("forwards a rejected promise to next", async () => {
    const err = new Error("boom");
    const next = jest.fn();
    await asyncCatch(async () => { throw err; })({}, {}, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  test("does not call next when the handler succeeds", async () => {
    const next = jest.fn();
    await asyncCatch(async () => {})({}, {}, next);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("validator middleware", () => {
  test("calls next() for a valid body", async () => {
    const next = jest.fn();
    await validator(loginSchema)({ body: { email: "a@b.com", password: "secret1" } }, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("calls next with a 400 AppError for an invalid body", async () => {
    const next = jest.fn();
    await validator(loginSchema)({ body: { email: "bad" } }, {}, next);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
  });
});

describe("globalError", () => {
  const run = (err) => {
    const res = fakeRes();
    globalError(err, {}, res, jest.fn());
    return res;
  };

  test("uses the status code of an AppError", () => {
    const res = run(new AppError("PRODUCT NOT FOUND", 404));
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "PRODUCT NOT FOUND" });
  });

  test("falls back to 500", () => {
    expect(run(new Error("unexpected")).status).toHaveBeenCalledWith(500);
  });

  test("maps JWT errors to 401", () => {
    const e = new Error("jwt"); e.name = "JsonWebTokenError";
    const res = run(e);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json.mock.calls[0][0].message).toBe("token is not valid");
  });

  test("maps duplicate-key errors to 400 naming the field", () => {
    const e = new Error("dup"); e.code = 11000; e.keyValue = { email: "a@b.com" };
    const res = run(e);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toBe("email already exists");
  });
});

describe("restrictTo", () => {
  test("lets an allowed role through", async () => {
    const next = jest.fn();
    const res = fakeRes();
    await restrictTo("admin")({ user: { role: "admin" } }, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("answers 403 for a role that is not allowed", async () => {
    const res = fakeRes();
    const next = jest.fn();
    await restrictTo("admin")({ user: { role: "user" } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
