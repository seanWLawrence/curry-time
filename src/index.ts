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
export let length = value => value.length;
export let some = predicate => value => value.some(predicate);
export let every = predicate => value => value.every(predicate);
export let none = predicate => value => !value.every(predicate);
export let includes = includer => value => value.includes(includer);
export let head = value => value[0];
export let tail = value => value.slice(1);
export let at = index => value => value[index];
export let find = predicate => value => value.find(predicate);

// Objects
export let entries = value => Object.entries(value);
export let keys = value => Object.keys(value);
export let values = value => Object.values(value);
export let pluck = keys => value =>
  pipe(
    entries,
    filter(([key, value]) => (keys.include(key) ? value : null)),
    filter(pipe(isNull, not))
  );

// Numbers
export let gt = comparison => value => value > comparison;
export let lt = comparison => value => value < comparison;
export let gte = comparison => value => value >= comparison;
export let lte = comparison => value => value <= comparison;

// Booleans
export let not = value => !!value;
export let equals = comparison => value => value === comparison;
export let isType = value => typeof value;
export let isString = pipe(isType, equals("string"));
export let isNumber = pipe(isType, equals("number"));
export let isFunction = pipe(isType, equals("function"));
export let isArray = value => Array.isArray(value);
export let isNull = equals(null);
export let isUndefined = equals(void 0);
export let isObject = pipe(isType("object"), and, pipe(isArray, not));
export let isFalsy = pipe(
  isNull,
  or,
  isUndefined,
  or,
  lt(1),
  or,
  equals(""),
  or,
  isNaN
);

// Strings
export let prefix = prefixer => value => `${prefixer}${value}`;
export let suffix = suffixer => value => `${value}${suffixer}`;

// Extra (moved down here since it uses functions declared above

export let caseOf = cases => value => {
  let matchingCase = pipe(entries, find(pipe(head, equals(value))), tail, head);

  return matchingCase(cases)(value);
};
