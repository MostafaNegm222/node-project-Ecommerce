const ApiFeatures = require("../utils/apiFeatures");

// Minimal chainable stand-in for a Mongoose query that records every call.
function fakeQuery() {
  const calls = [];
  const q = {
    calls,
    find: (arg) => (calls.push(["find", arg]), q),
    sort: (arg) => (calls.push(["sort", arg]), q),
    select: (arg) => (calls.push(["select", arg]), q),
    skip: (arg) => (calls.push(["skip", arg]), q),
    limit: (arg) => (calls.push(["limit", arg]), q),
  };
  return q;
}
const lastCall = (q, name) => q.calls.filter((c) => c[0] === name).pop()[1];

describe("ApiFeatures.filter", () => {
  test("turns bracket operators into Mongo operators and casts numbers", () => {
    const q = fakeQuery();
    new ApiFeatures(q, { "price[gte]": "100", "price[lte]": "500" }).filter();
    expect(lastCall(q, "find")).toEqual({ price: { $gte: 100, $lte: 500 } });
  });

  test("ignores search, sort, limit, skip, fields and page keys", () => {
    const q = fakeQuery();
    new ApiFeatures(q, {
      search: "x", sort: "price", limit: "5", skip: "1", fields: "name", page: "2", category: "phones",
    }).filter();
    expect(lastCall(q, "find")).toEqual({ category: "phones" });
  });
});

describe("ApiFeatures.search", () => {
  test("does nothing without a search keyword", () => {
    const q = fakeQuery();
    new ApiFeatures(q, {}).search();
    expect(q.calls).toHaveLength(0);
  });

  test("matches title, name and description case-insensitively", () => {
    const q = fakeQuery();
    new ApiFeatures(q, { search: "lap" }).search();
    const { $or } = lastCall(q, "find");
    expect($or).toHaveLength(3);
    expect($or[0]).toEqual({ title: { $regex: "^lap", $options: "i" } });
    expect($or[1].name.$options).toBe("i");
    expect($or[2].description.$options).toBe("i");
  });
});

describe("ApiFeatures.sort / fields / pagination", () => {
  test("sorts by _id by default and by the given comma list otherwise", () => {
    const a = fakeQuery();
    new ApiFeatures(a, {}).sort();
    expect(lastCall(a, "sort")).toBe("_id");
    const b = fakeQuery();
    new ApiFeatures(b, { sort: "price,-title" }).sort();
    expect(lastCall(b, "sort")).toBe("price -title");
  });

  test("hides isDeleted and __v by default, or selects the requested fields", () => {
    const a = fakeQuery();
    new ApiFeatures(a, {}).fields();
    expect(lastCall(a, "select")).toBe("-isDeleted -__v");
    const b = fakeQuery();
    new ApiFeatures(b, { fields: "name,price" }).fields();
    expect(lastCall(b, "select")).toBe("name price");
  });

  test("defaults to page 1 with 10 items and computes skip from page and limit", () => {
    const a = fakeQuery();
    new ApiFeatures(a, {}).pagination();
    expect(lastCall(a, "skip")).toBe(0);
    expect(lastCall(a, "limit")).toBe(10);
    const b = fakeQuery();
    new ApiFeatures(b, { page: "3", limit: "5" }).pagination();
    expect(lastCall(b, "skip")).toBe(10);
    expect(lastCall(b, "limit")).toBe(5);
  });
});
