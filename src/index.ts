import { Maybe } from "purify-ts/Maybe";
import { MaybeAsync } from "purify-ts/MaybeAsync";
import { List } from "purify-ts/List";

// Utilities
export let identity = value => value;
export let trace = value => {
  console.log(value);
  return value;
};

// Control flow
export let noop = () => {};
export let maybe = value => Maybe.fromNullable(value);
export let maybeAsync = asyncFn => MaybeAsync(asyncFn);
export let pipe = (...fns) => fns.reduce((a, b) => arg => b(a(arg)));
export let ifElse = (predicate, ifResult, elseResult) => value =>
  predicate(value) ? ifResult(value) : elseResult(value);
export let or = predicate => value => value || predicate(value);
export let and = predicate => value =>
  value && predicate(value) ? true : false;
export let call = fn => value => fn.call(this, value);

// Arrays
export let map = predicate => value => value.map(predicate);
export let forEach = predicate => value => value.forEach(predicate);
export let filter = predicate => value => value.filter(predicate);
export let join = joiner => value => value.join(joiner);
export let reduce = (predicate, defaultValue = void 0) => value =>
  value.reduce(predicate);
export let length = value => value.length;
export let some = predicate => value => value.some(predicate);
export let every = predicate => value => value.every(predicate);
export let none = predicate => value =>
  !value.every(predicate) && !value.some(predicate);
export let includes = includer => value => value.includes(includer);
export let find = predicate => value => value.find(predicate);
export let head = value => value[0];
export let tail = value => value.slice(1);
export let at = index => value => value[index];
export let flatten = value => value.flat();

// Objects
export let entries = value => Object.entries(value);
export let keys = value => Object.keys(value);
export let values = value => Object.values(value);
export let pluck = (...keys) =>
  pipe(
    entries,
    filter(([key, value]) => keys.includes(key)),
    map(tail),
    flatten,
    ifElse(
      pipe(length, equals(1)),
      head,
      ifElse(pipe(length, equals(0)), () => void 0, identity)
    )
  );

export let get = (selector, defaultValue = void 0) => value => {
  let pathArray = selector.split(".");

  return pathArray.reduce((obj, key) => obj && obj[key], value) || defaultValue;
};

// Numbers
export let gt = comparison => value => value > comparison;
export let lt = comparison => value => value < comparison;
export let gte = comparison => value => value >= comparison;
export let lte = comparison => value => value <= comparison;

// Booleans
export let not = value => !value;
export let stubTrue = () => true;
export let stubFalse = () => false;
export let stubNull = () => null;
export let equals = comparison => value => value === comparison;
export let getType = value =>
  Array.isArray(value) ? "array" : equals(value)(null) ? "null" : typeof value;

export let isType = comparison => value =>
  equals(comparison)("array")
    ? Array.isArray(value)
    : equals(getType(value))(comparison);

export let isString = isType("string");
export let isNumber = isType("number");
export let isFunction = isType("function");
export let isArray = isType("array");
export let isNull = isType("null");
export let isUndefined = isType("undefined");
export let isObject = isType("object");
export let isTruthy = ifElse(
  isString,
  pipe(length, gt(0)),
  ifElse(
    v => isObject(v) || isArray(v) || isFunction(v),
    stubTrue,
    ifElse(v => isNumber(v) && gt(0)(v), stubTrue, stubFalse)
  )
);

export let isFalsy = pipe(isTruthy, not);

// Strings
export let prefix = prefixer => value => `${prefixer}${value}`;
export let suffix = suffixer => value => `${value}${suffixer}`;
export let split = splitter => value => value.split(splitter);

// Extra (moved down here since it uses functions declared above

export let caseOf = cases => value => {
  let matchingCase = pipe(entries, find(pipe(head, equals(value))), tail, head);

  return matchingCase(cases)(value);
};
