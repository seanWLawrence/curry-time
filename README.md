# 🍜 Curry time

> In beta: documentation in progress

100% curried functional programming helpers to help you write more declarative logic.

## API

### Function

#### maybe

Wraps the value in a [Maybe.fromNullable](https://gigobyte.github.io/purify/adts/Maybe#fromNullable) from purify-ts.

#### safeMaybe

Wraps the value in a [Maybe.encase](https://gigobyte.github.io/purify/adts/Maybe#encase) from purify-ts.

#### maybeAsync

Wraps the value in a [MaybeAsync](https://gigobyte.github.io/purify/adts/MaybeAsync) from purify-ts.

#### either

Wraps the value in an [Either.of](https://gigobyte.github.io/purify/adts/Either#of) from purify-ts.

#### safeEither

Wraps the value in an [Either.encase](https://gigobyte.github.io/purify/adts/Either#encase) from purify-ts.

#### eitherAsync

Wraps the value in an [EitherAsync](https://gigobyte.github.io/purify/adts/EitherAsync) from purify-ts.

#### pipe

Calls functions in  order from left to right, passing the value from each
function to the next.


#### ifElse

```ts
function ifElse(
  predicate: (value: any) => boolean, 
  ifFunction: (value: any) => any,
  elseFunction(value: any) => any)
)
```

#### call

#### all
#### any
#### caseOf

### Array

#### map
#### forEach
#### filter
##### join
#### reduce
#### length
#### some
#### every
#### none
#### includes
#### find
#### head
#### tail
#### at
#### flatten

### Object 

#### entries
#### keys
#### values
#### pluck
#### values
#### get

### Number

#### gt
#### lt
#### gte
#### lte

### Boolean

#### not
#### stubTrue
#### stubFalse
#### stubNull
#### stubUndefined
#### equals
#### getType
#### isType
#### isString
#### isNumber
#### isFunction
#### isArray
#### isNull
#### isUndefined
#### isObject
#### isTruthy
#### isFalsy

### Strings

#### prefix

Curried `String.concat` or `Array.concat`, but with the value inserted in the beginning
instead of the end.

#### suffix

Curried `String.concat` or `Array.concat`.

#### split

Curried `String.split`.

#### Utility

#### identity 

Returns the value passed in.

Type

```ts
function identity(value: any): any
```

#### trace

Logs to the console and returns the value passed in.

Type

```ts
function trace(value: any): any
```

#### noop

Does nothing.

Type

```ts
function noop(): void
```

#### wrap

Wraps the value in an anonymous function.

Type

```ts
function wrap(value: any): () => any
```

## License

MIT
