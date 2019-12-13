import {
  identity,
  trace,
  noop,
  pipe,
  ifElse,
  or,
  and,
  call,
  map,
  forEach,
  reduce,
  filter,
  join,
  split,
  length,
  some,
  every,
  none,
  includes,
  head,
  tail,
  at,
  flatten,
  find,
  entries,
  keys,
  values,
  pluck,
  get
} from "./";

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

describe("call", () => {
  it("calls a function with the value", () => {
    let mock = jest.fn();

    expect(call(mock)("some value")).toBeUndefined();
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith("some value");
  });
});

describe("map", () => {
  it("calls a predicate on each item and returns a new array", () => {
    let mock = jest.fn(identity);
    let arr = [1, 2, 3];

    expect(map(mock)(arr)).toEqual(arr);
    expect(mock).toHaveBeenCalledTimes(arr.length);
    expect(mock).toHaveBeenNthCalledWith(1, arr[0], 0, arr);
    expect(mock).toHaveBeenNthCalledWith(2, arr[1], 1, arr);
    expect(mock).toHaveBeenNthCalledWith(3, arr[2], 2, arr);

    let mock2 = jest.fn(v => v + 1);
    let mock2Result = [2, 3, 4];

    expect(map(mock2)(arr)).toEqual(mock2Result);
    expect(mock2).toHaveBeenCalledTimes(arr.length);
    expect(mock2).toHaveBeenNthCalledWith(1, arr[0], 0, arr);
    expect(mock2).toHaveBeenNthCalledWith(2, arr[1], 1, arr);
    expect(mock2).toHaveBeenNthCalledWith(3, arr[2], 2, arr);
  });
});

describe("forEach", () => {
  it("calls a predicate on each item", () => {
    let mock = jest.fn(identity);
    let arr = [1, 2, 3];

    expect(forEach(mock)(arr)).toBeUndefined();
    expect(mock).toHaveBeenCalledTimes(arr.length);
    expect(mock).toHaveBeenNthCalledWith(1, arr[0], 0, arr);
    expect(mock).toHaveBeenNthCalledWith(2, arr[1], 1, arr);
    expect(mock).toHaveBeenNthCalledWith(3, arr[2], 2, arr);

    let mock2 = jest.fn(v => v + 1);
    let mock2Result = [2, 3, 4];

    expect(forEach(mock2)(arr)).toBeUndefined();
    expect(mock2).toHaveBeenCalledTimes(arr.length);
    expect(mock2).toHaveBeenNthCalledWith(1, arr[0], 0, arr);
    expect(mock2).toHaveBeenNthCalledWith(2, arr[1], 1, arr);
    expect(mock2).toHaveBeenNthCalledWith(3, arr[2], 2, arr);
  });
});

describe("reduce", () => {
  it("calls a predicate on each item and returns a new accumaltive array", () => {
    let mock = jest.fn((acc, next) => next);
    let arr = [1, 2, 3];

    expect(reduce((acc, next) => acc + next)(arr)).toEqual(6);
  });
});

describe("filter", () => {
  it("calls a predicate on each item and returns a new array with items that returned a truthy value", () => {
    let mock = jest.fn(identity);
    let arr = [1, 2, 3];

    expect(filter(mock)(arr)).toEqual(arr);
    expect(mock).toHaveBeenCalledTimes(arr.length);
    expect(mock).toHaveBeenNthCalledWith(1, arr[0], 0, arr);
    expect(mock).toHaveBeenNthCalledWith(2, arr[1], 1, arr);
    expect(mock).toHaveBeenNthCalledWith(3, arr[2], 2, arr);

    let mock2 = jest.fn(v => v - 1);
    let mock2Result = [2, 3];

    expect(filter(mock2)(arr)).toEqual(mock2Result);
    expect(mock2).toHaveBeenCalledTimes(arr.length);
    expect(mock2).toHaveBeenNthCalledWith(1, arr[0], 0, arr);
    expect(mock2).toHaveBeenNthCalledWith(2, arr[1], 1, arr);
    expect(mock2).toHaveBeenNthCalledWith(3, arr[2], 2, arr);
  });
});

describe("join", () => {
  it("joins an array of strings with a joiner", () => {
    let arr = ["hello", "world"];

    expect(join(":")(arr)).toBe("hello:world");
    expect(join(", ")(arr)).toBe("hello, world");
  });
});

describe("length", () => {
  it("returns the length of an array", () => {
    let arr = ["hello", "world"];

    expect(length(arr)).toBe(2);
  });
});

describe("some", () => {
  it("returns true if at least one item in an array returns a truthy value from the predicate", () => {
    let arr = ["hello", "world"];

    expect(some(w => w === "hello")(arr)).toBe(true);
  });

  it("returns false if at no items in an array return a truthy value from the predicate", () => {
    let arr = ["hello", "world"];

    expect(some(w => w === "hello2")(arr)).toBe(false);
  });
});

describe("every", () => {
  it("returns true if every item in an array returns a truthy value from the predicate", () => {
    let arr = ["hello", "world"];

    expect(every(w => length(w) === 5)(arr)).toBe(true);
  });

  it("returns false if at least one item in an array return a falsy value from the predicate", () => {
    let arr = ["hello", "world"];

    expect(every(w => w === "hello")(arr)).toBe(false);
  });
});

describe("none", () => {
  it("returns true if every item in an array returns a falsy value from the predicate", () => {
    let arr = ["hello", "world"];

    expect(none(w => length(w) !== 5)(arr)).toBe(true);
  });

  it("returns false if at least one item in an array returns a truthy value from the predicate", () => {
    let arr = ["hello", "world"];

    expect(none(w => w === "hello")(arr)).toBe(false);
  });
});

describe("includes", () => {
  it("returns true if at least one item in an array matches the value", () => {
    let arr = ["hello", "world"];

    expect(includes("hello")(arr)).toBe(true);
  });

  it("returns false if no items in an array match the value", () => {
    let arr = ["hello", "world"];

    expect(includes("hello2")(arr)).toBe(false);
  });
});

describe("find", () => {
  it("returns the first item in an array that returns a truthy value from the predicate", () => {
    let arr = ["hello", "world"];

    expect(find(w => length(w) === 5)(arr)).toBe("hello");

    expect(find(w => w === "world")(arr)).toBe("world");
  });

  it("returns undefined if no items in an array return a truthy value from the predicate", () => {
    let arr = ["hello", "world"];

    expect(find(w => w === "hello2")(arr)).toBeUndefined();
  });
});

describe("head", () => {
  it("returns the first item in an array", () => {
    let arr = ["hello", "world"];

    expect(head(arr)).toBe("hello");
  });
});

describe("tail", () => {
  it("returns all items in an array except the first", () => {
    let arr = ["hello", "world", "I", "am", "here"];

    expect(tail(arr)).toEqual(["world", "I", "am", "here"]);
  });
});

describe("at", () => {
  it("returns an item from an array at the index", () => {
    let arr = ["hello", ["world"]];

    expect(at(0)(arr)).toBe("hello");
    expect(at(1)(arr)).toEqual(["world"]);
  });
});

describe("flatten", () => {
  it("returns a flattened array by one level", () => {
    let arr = ["hello", ["world"]];
    let arr2 = ["hello", [["world"]]];

    expect(flatten(arr)).toEqual(["hello", "world"]);
    expect(flatten(arr2)).toEqual(["hello", ["world"]]);
  });
});
describe("entries", () => {
  it("returns an array of key/value pairs for an object", () => {
    let obj = { hello: "world", hola: "mundo" };

    expect(entries(obj)).toEqual([
      ["hello", "world"],
      ["hola", "mundo"]
    ]);
  });
});

describe("keys", () => {
  it("returns an array of keys for an object", () => {
    let obj = { hello: "world", hola: "mundo" };

    expect(keys(obj)).toEqual(["hello", "hola"]);
  });
});

describe("values", () => {
  it("returns an array of values for an object", () => {
    let obj = { hello: "world", hola: "mundo" };

    expect(values(obj)).toEqual(["world", "mundo"]);
  });
});

describe("pluck", () => {
  it("returns a value if the key is found in an object", () => {
    let obj = { hello: "world", hola: "mundo" };

    expect(pluck("hello")(obj)).toEqual("world");
  });

  it("returns an array of values if multiple keys are passed and found in an object", () => {
    let obj = { hello: "world", hola: "mundo" };

    expect(pluck("hello", "hola")(obj)).toEqual(["world", "mundo"]);
  });

  it("returns undefined is key is not found in an object", () => {
    let obj = { hello: "world", hola: "mundo" };

    expect(pluck("hello2")(obj)).toBeUndefined();
  });

  it("returns undefined is multiple keys are not found in an object", () => {
    let obj = { hello: "world", hola: "mundo" };

    expect(pluck("hello2", "hola2")(obj)).toBeUndefined();
  });
});

describe("get", () => {
  it("returns a value if the path is found in an object", () => {
    let obj = { hello: "world", hola: "mundo" };

    expect(get("hello")(obj)).toEqual("world");
  });

  it("returns value if the path is found in an object, even if a default value is passed", () => {
    let obj = { hello: "world", hola: "mundo" };

    expect(get("hello", "default")(obj)).toBe("world");
  });

  it("returns undefined is key is not found in an object", () => {
    let obj = { hello: "world", hola: "mundo" };

    expect(get("hello2")(obj)).toBeUndefined();
  });

  it("returns defaultValue if specified and key is not found in an object", () => {
    let obj = { hello: "world", hola: "mundo" };

    expect(get("hello2", "default")(obj)).toBe("default");
  });
});

describe("split", () => {
  it("splits a string into an array for each occurence of the splitter", () => {
    let str = "hello, world!";

    expect(split(",")(str)).toEqual(["hello", " world!"]);
  });
});
