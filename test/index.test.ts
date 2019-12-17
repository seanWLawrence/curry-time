import {
  identity,
  trace,
  noop,
  pipe,
  ifElse,
  map,
  forEach,
  reduce,
  filter,
  join,
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
  get,
  gt,
  lt,
  gte,
  lte,
  not,
  equals,
  getType,
  isType,
  isString,
  isNumber,
  isFunction,
  isArray,
  isNull,
  isUndefined,
  isObject,
  isFalsy,
  isTruthy,
  prefix,
  suffix,
  split,
  caseOf,
} from '../src';

describe('identity', () => {
  it('returns the value passed in', () => {
    let expecteds = [
      1,
      'two',
      null,
      {},
      { hello: 'world' },
      [1, 2, 3, { hello: 'world' }],
      [],
      '',
      void 0,
    ];

    expecteds.forEach(e => expect(identity(e)).toEqual(e));
  });
});

describe('trace', () => {
  it('returns the value passed in and logs to console', () => {
    let log = jest.fn();

    global.console.log = log;

    let expecteds = [
      1,
      'two',
      null,
      {},
      { hello: 'world' },
      [1, 2, 3, { hello: 'world' }],
      [],
      '',
      void 0,
    ];

    expecteds.forEach(e => expect(trace(e)).toEqual(e));
    expect(log).toHaveBeenCalledTimes(expecteds.length);
  });
});

describe('noop', () => {
  it('does nothing', () => {
    expect(noop()).toBe(void 0);
  });
});

describe('pipe', () => {
  it('calls functions from left to right, passing the value to each function', () => {
    let add1 = value => value + 1;
    let subtractTwo = value => value - 2;
    let multiply5 = value => value * 5;
    let divide2 = value => value / 2;

    expect(pipe(add1, subtractTwo, multiply5, divide2)(1)).toBe(0);
    expect(pipe(add1, subtractTwo, multiply5, divide2)(2)).toBe(2.5);
    expect(pipe(add1, subtractTwo, multiply5, divide2)(5)).toBe(10);
  });
});

describe('ifElse', () => {
  it('calls predicate with the curried value, and if true calls the first function with the value', () => {
    expect(
      ifElse(
        value => value,
        () => 10,
        () => 20
      )(true)
    ).toBe(10);

    expect(
      ifElse(
        value => value === 'hello',
        () => 20,
        () => 10
      )('hello')
    ).toBe(20);
  });

  it('calls predicate with the curried value, and if false calls the second function with the value', () => {
    expect(
      ifElse(
        value => value,
        () => 10,
        () => 20
      )(false)
    ).toBe(20);

    expect(
      ifElse(
        value => value === 'hello',
        () => 20,
        () => 10
      )('not hello')
    ).toBe(10);
  });
});

describe('map', () => {
  it('calls a predicate on each item and returns a new array', () => {
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

describe('forEach', () => {
  it('calls a predicate on each item', () => {
    let mock = jest.fn(identity);
    let arr = [1, 2, 3];

    expect(forEach(mock)(arr)).toBeUndefined();
    expect(mock).toHaveBeenCalledTimes(arr.length);
    expect(mock).toHaveBeenNthCalledWith(1, arr[0], 0, arr);
    expect(mock).toHaveBeenNthCalledWith(2, arr[1], 1, arr);
    expect(mock).toHaveBeenNthCalledWith(3, arr[2], 2, arr);

    let mock2 = jest.fn(v => v + 1);

    expect(forEach(mock2)(arr)).toBeUndefined();
    expect(mock2).toHaveBeenCalledTimes(arr.length);
    expect(mock2).toHaveBeenNthCalledWith(1, arr[0], 0, arr);
    expect(mock2).toHaveBeenNthCalledWith(2, arr[1], 1, arr);
    expect(mock2).toHaveBeenNthCalledWith(3, arr[2], 2, arr);
  });
});

describe('reduce', () => {
  it('calls a predicate on each item and returns a new accumaltive array', () => {
    let arr = [1, 2, 3];

    expect(reduce((acc, next) => acc + next, 0)(arr)).toEqual(6);
  });
});

describe('filter', () => {
  it('calls a predicate on each item and returns a new array with items that returned a truthy value', () => {
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

describe('join', () => {
  it('joins an array of strings with a joiner', () => {
    let arr = ['hello', 'world'];

    expect(join(':')(arr)).toBe('hello:world');
    expect(join(', ')(arr)).toBe('hello, world');
  });
});

describe('length', () => {
  it('returns the length of an array', () => {
    let arr = ['hello', 'world'];

    expect(length(arr)).toBe(2);
  });
});

describe('some', () => {
  it('returns true if at least one item in an array returns a truthy value from the predicate', () => {
    let arr = ['hello', 'world'];

    expect(some(w => w === 'hello')(arr)).toBe(true);
  });

  it('returns false if at no items in an array return a truthy value from the predicate', () => {
    let arr = ['hello', 'world'];

    expect(some(w => w === 'hello2')(arr)).toBe(false);
  });
});

describe('every', () => {
  it('returns true if every item in an array returns a truthy value from the predicate', () => {
    let arr = ['hello', 'world'];

    expect(every(w => length(w) === 5)(arr)).toBe(true);
  });

  it('returns false if at least one item in an array return a falsy value from the predicate', () => {
    let arr = ['hello', 'world'];

    expect(every(w => w === 'hello')(arr)).toBe(false);
  });
});

describe('none', () => {
  it('returns true if every item in an array returns a falsy value from the predicate', () => {
    let arr = ['hello', 'world'];

    expect(none(equals('hello2'))(arr)).toBe(true);
    expect(none(gt(5))([1, 2, 3])).toBe(true);
  });

  it('returns false if at least one item in an array returns a truthy value from the predicate', () => {
    let arr = ['hello', 'world'];

    expect(none(w => w === 'hello')(arr)).toBe(false);
    expect(none(gt(5))([1, 2, 3, 6])).toBe(false);
  });
});

describe('includes', () => {
  it('returns true if at least one item in an array matches the value', () => {
    let arr = ['hello', 'world'];

    expect(includes('hello')(arr)).toBe(true);
  });

  it('returns false if no items in an array match the value', () => {
    let arr = ['hello', 'world'];

    expect(includes('hello2')(arr)).toBe(false);
  });
});

describe('find', () => {
  it('returns the first item in an array that returns a truthy value from the predicate', () => {
    let arr = ['hello', 'world'];

    expect(find(w => length(w) === 5)(arr)).toBe('hello');

    expect(find(w => w === 'world')(arr)).toBe('world');
  });

  it('returns undefined if no items in an array return a truthy value from the predicate', () => {
    let arr = ['hello', 'world'];

    expect(find(w => w === 'hello2')(arr)).toBeUndefined();
  });
});

describe('head', () => {
  it('returns the first item in an array', () => {
    let arr = ['hello', 'world'];

    expect(head(arr)).toBe('hello');
  });
});

describe('tail', () => {
  it('returns all items in an array except the first', () => {
    let arr = ['hello', 'world', 'I', 'am', 'here'];

    expect(tail(arr)).toEqual(['world', 'I', 'am', 'here']);
  });
});

describe('at', () => {
  it('returns an item from an array at the index', () => {
    let arr = ['hello', ['world']];

    expect(at(0)(arr)).toBe('hello');
    expect(at(1)(arr)).toEqual(['world']);
  });
});

describe('flatten', () => {
  it('returns a flattened array by one level', () => {
    let arr = ['hello', ['world']];
    let arr2 = ['hello', [['world']]];

    expect(flatten(arr)).toEqual(['hello', 'world']);
    expect(flatten(arr2)).toEqual(['hello', ['world']]);
  });
});
describe('entries', () => {
  it('returns an array of key/value pairs for an object', () => {
    let obj = { hello: 'world', hola: 'mundo' };

    expect(entries(obj)).toEqual([
      ['hello', 'world'],
      ['hola', 'mundo'],
    ]);
  });
});

describe('keys', () => {
  it('returns an array of keys for an object', () => {
    let obj = { hello: 'world', hola: 'mundo' };

    expect(keys(obj)).toEqual(['hello', 'hola']);
  });
});

describe('values', () => {
  it('returns an array of values for an object', () => {
    let obj = { hello: 'world', hola: 'mundo' };

    expect(values(obj)).toEqual(['world', 'mundo']);
  });
});

describe('pluck', () => {
  it('returns a value if the key is found in an object', () => {
    let obj = { hello: 'world', hola: 'mundo' };

    expect(pluck('hello')(obj)).toEqual('world');
  });

  it('returns an array of values if multiple keys are passed and found in an object', () => {
    let obj = { hello: 'world', hola: 'mundo' };

    expect(pluck('hello', 'hola')(obj)).toEqual(['world', 'mundo']);
  });

  it('returns undefined is key is not found in an object', () => {
    let obj = { hello: 'world', hola: 'mundo' };

    expect(pluck('hello2')(obj)).toBeUndefined();
  });

  it('returns undefined is multiple keys are not found in an object', () => {
    let obj = { hello: 'world', hola: 'mundo' };

    expect(pluck('hello2', 'hola2')(obj)).toBeUndefined();
  });
});

describe('get', () => {
  it('returns a value if the path is found in an object', () => {
    let obj = { hello: 'world', hola: 'mundo' };

    expect(get('hello')(obj)).toEqual('world');
  });

  it('returns value if the path is found in an object, even if a default value is passed', () => {
    let obj = { hello: 'world', hola: 'mundo' };

    expect(get('hello', 'default')(obj)).toBe('world');
  });

  it('returns undefined is key is not found in an object', () => {
    let obj = { hello: 'world', hola: 'mundo' };

    expect(get('hello2')(obj)).toBeUndefined();
  });

  it('returns defaultValue if specified and key is not found in an object', () => {
    let obj = { hello: 'world', hola: 'mundo' };

    expect(get('hello2', 'default')(obj)).toBe('default');
  });
});

describe('gt', () => {
  it('returns true if value is greater than the comparison', () => {
    expect(gt(5)(10)).toBe(true);
    expect(gt(10)(20)).toBe(true);
  });

  it('returns false if value is less than the comparison', () => {
    expect(gt(10)(5)).toBe(false);
    expect(gt(20)(10)).toBe(false);
  });
});

describe('lt', () => {
  it('returns true if value is less than the comparison', () => {
    expect(lt(10)(5)).toBe(true);
    expect(lt(20)(10)).toBe(true);
  });

  it('returns false if value is greater than the comparison', () => {
    expect(lt(5)(10)).toBe(false);
    expect(lt(10)(20)).toBe(false);
  });
});

describe('gte', () => {
  it('returns true if value is greater or equal to the comparison', () => {
    expect(gt(5)(10)).toBe(true);
    expect(gt(10)(20)).toBe(true);
    expect(gte(20)(20)).toBe(true);
  });

  it('returns false if value is less than the comparison', () => {
    expect(gte(10)(5)).toBe(false);
    expect(gte(20)(10)).toBe(false);
  });
});

describe('lte', () => {
  it('returns true if value is less or equal to the comparison', () => {
    expect(lte(10)(5)).toBe(true);
    expect(lte(20)(10)).toBe(true);
    expect(lte(20)(20)).toBe(true);
  });

  it('returns false if value is greater than the comparison', () => {
    expect(lte(5)(10)).toBe(false);
    expect(lte(10)(20)).toBe(false);
  });
});

describe('not', () => {
  it('returns the opposite of the value based on truthiness', () => {
    expect(not(false)).toBe(true);
    expect(not('')).toBe(true);
    expect(not(0)).toBe(true);

    expect(not(true)).toBe(false);
    expect(not({})).toBe(false);
    expect(not('hello')).toBe(false);
    expect(not([])).toBe(false);
  });
});

describe('equals', () => {
  it('returns true if both the value and comparison equal with ===', () => {
    expect(equals(false)(false)).toBe(true);
    expect(equals('hello')('hello')).toBe(true);
    expect(equals(0)(0)).toBe(true);
  });

  it('returns false if both the value and comparison do not equal with ===', () => {
    expect(equals(false)(true)).toBe(false);
    expect(equals('hello')('hellos')).toBe(false);
    expect(equals(0)(1)).toBe(false);
  });
});

describe('getType', () => {
  it("returns typeof value or 'array' if Array.isArray or 'null' if null", () => {
    expect(getType([])).toBe('array');
    expect(getType({})).toBe('object');
    expect(getType(() => {})).toBe('function');
    expect(getType('hello')).toBe('string');
    expect(getType(1)).toBe('number');
    expect(getType(false)).toBe('boolean');
    expect(getType(null)).toBe('null');
    expect(getType(void 0)).toBe('undefined');
  });
});

describe('isType', () => {
  it('returns true if the value from getType equals the comparison', () => {
    expect(isType('array')([])).toBe(true);
    expect(isType('null')(null)).toBe(true);
    expect(isType('object')({})).toBe(true);
    expect(isType('string')('hello')).toBe(true);
    expect(isType('number')(0)).toBe(true);
    expect(isType('undefined')(void 0)).toBe(true);
    expect(isType('boolean')(false)).toBe(true);
  });

  it('returns false if the value from getType does not equal the comparison', () => {
    expect(isType('array')({})).toBe(false);
    expect(isType('null')(void 0)).toBe(false);
    expect(isType('object')([])).toBe(false);
    expect(isType('string')(void 0)).toBe(false);
    expect(isType('number')(null)).toBe(false);
    expect(isType('undefined')('hello')).toBe(false);
    expect(isType('boolean')(0)).toBe(false);
  });
});

describe('isString', () => {
  it('returns true if the value is a string type', () => {
    expect(isString('hello')).toBe(true);
  });

  it('returns false if the value is not a string type', () => {
    expect(isString({})).toBe(false);
  });
});

describe('isNumber', () => {
  it('returns true if the value is a number type', () => {
    expect(isNumber(0)).toBe(true);
  });

  it('returns false if the value is not a number type', () => {
    expect(isNumber('number')).toBe(false);
  });
});

describe('isFunction', () => {
  it('returns true if the value is a function type', () => {
    expect(isFunction(() => {})).toBe(true);
  });

  it('returns false if the value is not a function type', () => {
    expect(isFunction({})).toBe(false);
  });
});
describe('isArray', () => {
  it('returns true if the value is an array type', () => {
    expect(isArray([])).toBe(true);
  });

  it('returns false if the value is not an array type', () => {
    expect(isArray({})).toBe(false);
  });
});

describe('isNull', () => {
  it('returns true if the value is an null type', () => {
    expect(isNull(null)).toBe(true);
  });

  it('returns false if the value is not an null type', () => {
    expect(isNull(void 0)).toBe(false);
  });
});

describe('isUndefined', () => {
  it('returns true if the value is an undefined type', () => {
    expect(isUndefined(void 0)).toBe(true);
  });

  it('returns false if the value is not an undefined type', () => {
    expect(isUndefined(null)).toBe(false);
  });
});

describe('isObject', () => {
  it('returns true if the value is an object type', () => {
    expect(isObject({})).toBe(true);
  });

  it('returns false if the value is not an object type', () => {
    expect(isObject([])).toBe(false);
    expect(isObject(null)).toBe(false);
  });
});

describe('isTruthy', () => {
  it('returns true if the value is truthy', () => {
    expect(isTruthy({})).toBe(true);
    expect(isTruthy('hello')).toBe(true);
    expect(isTruthy([])).toBe(true);
    expect(isTruthy(() => {})).toBe(true);
    expect(isTruthy(1)).toBe(true);
  });

  it('returns false if the value is falsy', () => {
    expect(isTruthy('')).toBe(false);
    expect(isTruthy(null)).toBe(false);
    expect(isTruthy(0)).toBe(false);
    expect(isTruthy(-1)).toBe(false);
    expect(isTruthy(void 0)).toBe(false);
    expect(isTruthy(NaN)).toBe(false);
  });
});

describe('isFalsy', () => {
  it('returns true if the value is falsy', () => {
    expect(isFalsy('')).toBe(true);
    expect(isFalsy(null)).toBe(true);
    expect(isFalsy(0)).toBe(true);
    expect(isFalsy(-1)).toBe(true);
    expect(isFalsy(void 0)).toBe(true);
    expect(isFalsy(NaN)).toBe(true);
  });

  it('returns false if the value is truthy', () => {
    expect(isFalsy({})).toBe(false);
    expect(isFalsy('hello')).toBe(false);
    expect(isFalsy([])).toBe(false);
    expect(isFalsy(() => {})).toBe(false);
    expect(isFalsy(1)).toBe(false);
  });
});

describe('prefix', () => {
  it('adds a prefix to the string', () => {
    expect(prefix('yo')('dude')).toBe('yodude');
  });
});

describe('suffix', () => {
  it('adds a suffix to the string', () => {
    expect(suffix('yo')('dude')).toBe('dudeyo');
  });
});

describe('split', () => {
  it('splits a string into an array for each occurence of the splitter', () => {
    let str = 'hello, world!';

    expect(split).toBeDefined();
    expect(split(',')(str)).toEqual(['hello', ' world!']);
  });
});

describe('caseOf', () => {
  it('calls the function if the value matches a key in the cases object', () => {
    let mockHello = jest.fn(() => 'hello');
    let mockWorld = jest.fn(() => 'world');

    expect(caseOf({ hello: mockHello, world: mockWorld })('hello')).toBe(
      'hello'
    );
    expect(caseOf({ hello: mockHello, world: mockWorld })('world')).toBe(
      'world'
    );
    expect(mockHello).toHaveReturnedTimes(1);
    expect(mockWorld).toHaveReturnedTimes(1);
    expect(mockHello).toHaveBeenLastCalledWith('hello');
    expect(mockWorld).toHaveBeenLastCalledWith('world');
  });

  it('runs the default function if the value does not match a key in the cases object and a default key in the cases object is specified', () => {
    let mockDefault = jest.fn(() => 'default');

    expect(caseOf({ hello2: noop, default: mockDefault })('hello')).toBe(
      'default'
    );
    expect(mockDefault).toHaveReturnedTimes(1);
    expect(mockDefault).toHaveBeenLastCalledWith('hello');
  });

  it('does nothing if the value does not match a key in the cases object and there is no default key', () => {
    let mockHello = jest.fn(() => 'hello');

    expect(caseOf({ hello2: mockHello })('hello')).toBeUndefined();
    expect(mockHello).toHaveBeenCalledTimes(0);
  });
});
