"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Maybe_1 = require("purify-ts/Maybe");
var MaybeAsync_1 = require("purify-ts/MaybeAsync");
// Utilities
exports.identity = function (value) { return value; };
exports.trace = function (value) {
    console.log(value);
    return value;
};
// Control flow
exports.noop = function () { };
exports.maybe = function (value) { return Maybe_1.Maybe.fromNullable(value); };
exports.maybeAsync = function (asyncFn) { return MaybeAsync_1.MaybeAsync(asyncFn); };
exports.pipe = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return fns.reduce(function (a, b) { return function (arg) { return b(a(arg)); }; });
};
exports.ifElse = function (predicate, ifResult, elseResult) { return function (value) {
    return predicate(value) ? ifResult(value) : elseResult(value);
}; };
exports.or = function (predicate) { return function (value) { return value || predicate(value); }; };
exports.and = function (predicate) { return function (value) {
    return value && predicate(value) ? true : false;
}; };
exports.call = function (fn) { return function (value) { return fn.call(_this, value); }; };
// Arrays
exports.map = function (predicate) { return function (value) { return value.map(predicate); }; };
exports.forEach = function (predicate) { return function (value) { return value.forEach(predicate); }; };
exports.filter = function (predicate) { return function (value) { return value.filter(predicate); }; };
exports.join = function (joiner) { return function (value) { return value.join(joiner); }; };
exports.reduce = function (predicate, defaultValue) {
    if (defaultValue === void 0) { defaultValue = void 0; }
    return function (value) {
        return value.reduce(predicate);
    };
};
exports.length = function (value) { return value.length; };
exports.some = function (predicate) { return function (value) { return value.some(predicate); }; };
exports.every = function (predicate) { return function (value) { return value.every(predicate); }; };
exports.none = function (predicate) { return function (value) {
    return !value.every(predicate) && !value.some(predicate);
}; };
exports.includes = function (includer) { return function (value) { return value.includes(includer); }; };
exports.find = function (predicate) { return function (value) { return value.find(predicate); }; };
exports.head = function (value) { return value[0]; };
exports.tail = function (value) { return value.slice(1); };
exports.at = function (index) { return function (value) { return value[index]; }; };
exports.flatten = function (value) { return value.flat(); };
// Objects
exports.entries = function (value) { return Object.entries(value); };
exports.keys = function (value) { return Object.keys(value); };
exports.values = function (value) { return Object.values(value); };
exports.pluck = function () {
    var keys = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        keys[_i] = arguments[_i];
    }
    return exports.pipe(exports.entries, exports.filter(function (_a) {
        var key = _a[0], value = _a[1];
        return keys.includes(key);
    }), exports.map(exports.tail), exports.flatten, exports.ifElse(exports.pipe(exports.length, exports.equals(1)), exports.head, exports.ifElse(exports.pipe(exports.length, exports.equals(0)), function () { return void 0; }, exports.identity)));
};
exports.get = function (selector, defaultValue) {
    if (defaultValue === void 0) { defaultValue = void 0; }
    return function (value) {
        var pathArray = selector.split(".");
        return pathArray.reduce(function (obj, key) { return obj && obj[key]; }, value) || defaultValue;
    };
};
// Numbers
exports.gt = function (comparison) { return function (value) { return value > comparison; }; };
exports.lt = function (comparison) { return function (value) { return value < comparison; }; };
exports.gte = function (comparison) { return function (value) { return value >= comparison; }; };
exports.lte = function (comparison) { return function (value) { return value <= comparison; }; };
// Booleans
exports.not = function (value) { return !value; };
exports.equals = function (comparison) { return function (value) { return value === comparison; }; };
exports.isType = function (value) { return typeof value; };
exports.isString = exports.pipe(exports.isType, exports.equals("string"));
exports.isNumber = exports.pipe(exports.isType, exports.equals("number"));
exports.isFunction = exports.pipe(exports.isType, exports.equals("function"));
exports.isArray = function (value) { return Array.isArray(value); };
exports.isNull = exports.equals(null);
exports.isUndefined = exports.equals(void 0);
exports.isObject = exports.pipe(exports.isType("object"), exports.and, exports.pipe(exports.isArray, exports.not));
exports.isFalsy = exports.pipe(exports.isNull, exports.or, exports.isUndefined, exports.or, exports.lt(1), exports.or, exports.equals(""), exports.or, isNaN);
exports.isTruthy = exports.pipe(exports.isNull, exports.or, exports.isUndefined, exports.or, exports.lt(1), exports.or, exports.equals(""), exports.or, isNaN);
// Strings
exports.prefix = function (prefixer) { return function (value) { return "" + prefixer + value; }; };
exports.suffix = function (suffixer) { return function (value) { return "" + value + suffixer; }; };
exports.split = function (splitter) { return function (value) { return value.split(splitter); }; };
// Extra (moved down here since it uses functions declared above
exports.caseOf = function (cases) { return function (value) {
    var matchingCase = exports.pipe(exports.entries, exports.find(exports.pipe(exports.head, exports.equals(value))), exports.tail, exports.head);
    return matchingCase(cases)(value);
}; };
