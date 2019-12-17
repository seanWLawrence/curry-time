import { Maybe } from 'purify-ts/Maybe';
import { MaybeAsync } from 'purify-ts/MaybeAsync';
import { Either } from 'purify-ts/Either';
import { EitherAsync } from 'purify-ts/EitherAsync';
import { List } from 'purify-ts/List';

export { Maybe, MaybeAsync, Either, EitherAsync, List };

// Utilities
export let identity = (value: any) => value;
export let trace = (value: any) => {
  console.log(value);
  return value;
};

// Control flow
export let noop = () => {};
export let wrap = (value: any) => () => value;
export let maybe = (value: any) => Maybe.fromNullable(value);
export let maybeAsync = asyncFn => MaybeAsync(asyncFn);
export let either = value => Either.of(value);
export let eitherAsync = asyncFn => EitherAsync(asyncFn);
export let pipe = (...fns) => fns.reduce((a, b) => arg => b(a(arg)));
export let ifElse = (predicate, ifResult, elseResult) => value =>
  predicate(value) ? ifResult(value) : elseResult(value);
export let all = (...fns) => value => every(fn => fn(value))(fns);
export let any = (...fns) => value => some(fn => fn(value))(fns);

// Arrays
export let map = predicate => value => value.map(predicate);
export let forEach = predicate => value => value.forEach(predicate);
export let filter = predicate => value => value.filter(predicate);
export let join = joiner => value => value.join(joiner);
export let reduce = (predicate, defaultValue: any = void 0) => value =>
  value.reduce(predicate, defaultValue);
export let length = value => value.length;
export let some = predicate => value => value.some(predicate);
export let every = predicate => value => value.every(predicate);
export let none = predicate =>
  all(pipe(every(predicate), not), pipe(some(predicate), not));
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
    filter(pipe(head, key => keys.includes(key))),
    map(tail),
    flatten,
    ifElse(
      pipe(length, equals(1)),
      head,
      ifElse(pipe(length, equals(0)), stubUndefined, identity)
    )
  );

export let get = (selector, defaultValue: any = void 0) => value => {
  let pathArray = selector.split('.');

  return pathArray.reduce((obj, key) => obj && obj[key], value) || defaultValue;
};

// Numbers
export let gt = comparison => value => value > comparison;
export let lt = comparison => value => value < comparison;
export let gte = comparison => value => value >= comparison;
export let lte = comparison => value => value <= comparison;

// Booleans
export let not = value => !value;
export let stubTrue = wrap(true);
export let stubFalse = wrap(false);
export let stubNull = wrap(null);
export let stubUndefined = wrap(void 0);

export let equals = comparison => value => value === comparison;

export let getType = ifElse(
  Array.isArray,
  wrap('array'),
  ifElse(equals(null), wrap('null'), v => typeof v)
);

export let isType = comparison => value =>
  equals(comparison)('array')
    ? Array.isArray(value)
    : equals(getType(value))(comparison);

export let isString = isType('string');
export let isNumber = isType('number');
export let isFunction = isType('function');
export let isArray = isType('array');
export let isNull = isType('null');
export let isUndefined = isType('undefined');
export let isObject = isType('object');
export let isTruthy = ifElse(
  isString,
  pipe(length, gt(0)),
  ifElse(
    any(isObject, isArray, isFunction),
    stubTrue,
    ifElse(all(isNumber, gt(0)), stubTrue, stubFalse)
  )
);

export let isFalsy = pipe(isTruthy, not);

// Strings
export let prefix = prefixer => value => `${prefixer}${value}`;
export let suffix = suffixer => value => `${value}${suffixer}`;
export let split = splitter => value => value.split(splitter);

// Extra (moved down here since it uses functions declared above

export let caseOf = cases => value => {
  let matchingCase = pipe(
    entries,
    find(pipe(head, equals(value))),
    ifElse(
      isUndefined,
      ifElse(
        pipe(wrap(keys(cases)), includes('default')),
        wrap(cases['default']),
        wrap(noop)
      ),
      pipe(tail, head)
    )
  );

  return matchingCase(cases)(value);
};
