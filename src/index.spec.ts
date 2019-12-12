import { identity, trace, noop, pipe, ifElse, or, and } from "./";

describe("identity", () => {
  it("returns the value passed in", () => {
    let expecteds = [
      1,
      "two",
      null,
      {},
      { hello: "world" },
      [1, 2, 3, { hello: "world" }],
      [],
      "",
      void 0
    ];

    expecteds.forEach(e => expect(identity(e)).toEqual(e));
  });
});

describe("trace", () => {
  it("returns the value passed in and logs to console", () => {
    let log = jest.fn();

    global.console.log = log;

    let expecteds = [
      1,
      "two",
      null,
      {},
      { hello: "world" },
      [1, 2, 3, { hello: "world" }],
      [],
      "",
      void 0
    ];

    expecteds.forEach(e => expect(trace(e)).toEqual(e));
    expect(log).toHaveBeenCalledTimes(expecteds.length);
  });
});

describe("noop", () => {
  it("does nothing", () => {
    expect(noop()).toBe(void 0);
  });
});

describe("pipe", () => {
  it("calls functions from left to right, passing the value to each function", () => {
    let add1 = value => value + 1;
    let subtractTwo = value => value - 2;
    let multiply5 = value => value * 5;
    let divide2 = value => value / 2;

    expect(pipe(add1, subtractTwo, multiply5, divide2)(1)).toBe(0);
    expect(pipe(add1, subtractTwo, multiply5, divide2)(2)).toBe(2.5);
    expect(pipe(add1, subtractTwo, multiply5, divide2)(5)).toBe(10);
  });
});

describe("ifElse", () => {
  it("calls predicate with the curried value, and if true calls the first function with the value", () => {
    expect(
      ifElse(
        value => value,
        () => 10,
        () => 20
      )(true)
    ).toBe(10);

    expect(
      ifElse(
        value => value === "hello",
        () => 20,
        () => 10
      )("hello")
    ).toBe(20);
  });

  it("calls predicate with the curried value, and if false calls the second function with the value", () => {
    expect(
      ifElse(
        value => value,
        () => 10,
        () => 20
      )(false)
    ).toBe(20);

    expect(
      ifElse(
        value => value === "hello",
        () => 20,
        () => 10
      )("not hello")
    ).toBe(10);
  });
});

describe("or", () => {
  it("returns the value without checking the predicate if truthy", () => {
    expect(or(() => false)(true)).toBe(true);
    expect(or(() => 1)("hello")).toBe("hello");
    expect(or(() => "")({})).toEqual({});
  });

  it("returns the value of the predicate if the value is falsy", () => {
    expect(or(() => true)(false)).toBe(true);
    expect(or(() => 1)("")).toBe(1);
    expect(or(() => "")(null)).toBe("");
  });
});

describe("and", () => {
  it("returns true if the value and predicate are truthy", () => {
    expect(and(() => "hello")(true)).toBe(true);
    expect(and(() => 1)("hello")).toBe(true);
    expect(and(() => [])({})).toBe(true);
  });

  it("returns false if the value is falsy", () => {
    expect(and(() => "hello")(false)).toBe(false);
    expect(and(() => 1)("")).toBe(false);
    expect(and(() => [])(0)).toBe(false);
  });

  it("returns false if the value is truthy and the predicate is falsy", () => {
    expect(and(() => false)({})).toBe(false);
    expect(and(() => 0)("hello")).toBe(false);
    expect(and(() => "")(true)).toBe(false);
  });
});
