# 🍜 Curry time

> In beta: documentation in progress

100% curried functional programming helpers to help you write more declarative logic.

## API

### Function

#### maybe

Wraps the value in a [Maybe.fromNullable](https://gigobyte.github.io/purify/adts/Maybe#fromNullable) from purify-ts.

```ts
import { maybe } from 'curry-time'

maybe(potentiallyNullValue)
  .map(doSomethingIfValueExists)
  .chain(doSomethingElseIfValueExistsThatReturnsAnotherMaybe)
  .ifNothing(doSomethingIfValueDoesNotExist)
  .orDefault(defaultValue)
```

#### safeMaybe

Wraps the value in a [Maybe.encase](https://gigobyte.github.io/purify/adts/Maybe#encase) from purify-ts. Exceptions thrown will be caught and can be handled as you see fit.

```ts
import { safeMaybe } from 'curry-time'

safeMaybe(() => doSomethingThatWillPotentiallyThrowAnException())
  .map(doSomethingIfValueDidNotThrow)
  .chain(doSomethingElseIfValueDoesNotThrowAndReturnsAnotherMaybe)
  .ifNothing(doSomethingIfValueThrows)
  .orDefault(defaultValue)
```

#### maybeAsync

Wraps the value in a [MaybeAsync](https://gigobyte.github.io/purify/adts/MaybeAsync) from purify-ts.

```ts
import { maybeAsync } from 'curry-time'

maybeAsync(async () => await doSomethingAsync())
  .map(doSomethingIfValueExists)
  .chain(doSomethingElseIfValueExistsThatReturnsAnotherMaybe)
  .ifNothing(doSomethingIfValueDoesNotExist)
  .orDefault(defaultValue)
  .run()
```

#### either

Wraps the value in an [Either.of](https://gigobyte.github.io/purify/adts/Either#of) from purify-ts.

```ts
import { either } from 'curry-time'

either(someValue)
  .map(doSomethingIfValueExists)
  .chain(doSomethingElseIfValueExistsThatReturnsAnotherMaybe)
  .ifLeft(doSomethingIfValueDoesNotExist)
  .orDefault(defaultValue)
```

#### safeEither

Wraps the value in an [Either.encase](https://gigobyte.github.io/purify/adts/Either#encase) from purify-ts.

```ts
import { safeEither } from 'curry-time'

safeEither(() => doSomethingThatWillPotentiallyThrowAnException())
  .map(doSomethingIfValueDidNotThrow)
  .chain(doSomethingElseIfValueDoesNotThrowAndReturnsAnotherMaybe)
  .ifLeft(doSomethingIfValueThrows)
  .orDefault(defaultValue)
```

#### eitherAsync

Wraps the value in an [EitherAsync](https://gigobyte.github.io/purify/adts/EitherAsync) from purify-ts.

```ts
import { eitherAsync } from 'curry-time'

eitherAsync(async () => await doSomethingAsync())
  .map(doSomethingIfValueExists)
  .chain(doSomethingElseIfValueExistsThatReturnsAnotherMaybe)
  .ifLeft(doSomethingIfValueDoesNotExist)
  .orDefault(defaultValue)
  .run()
```

#### pipe

Calls functions in  order from left to right, passing the value from each
function to the next.

```ts
import { pipe } from 'curry-time'

let someCalculation = pipe(
  add(1),
  multiply(10),
  subtract(5)
)

someCalculation(10) // 105
```

#### ifElse

Curried version of an if/else block.

```ts
import { ifElse } from 'curry-time'

let welcomeMessage = ifElse(
  pipe(
    pluck('role'),
    equals('admin')
  ),
  () => 'Hello Admin!',
  () => 'Hello, Non Admin!'
)

welcomeMessage({role: 'admin'}) // 'Hello, Admin!'
welcomeMessage({role: 'something else'}) // 'Hello, Non Admin!'
```

#### all

Returns true if all functions pass with the value.

```ts
import { all } from 'curry-time'

let isEligibleToDrinkAlchohol = all(
  pipe(
    get('age', 0),
    gte(21)
  ),
  pipe(
    get('license'),
    isObject
  )
)

isEligibleToDrinkAlchohol({age: 22, license: {id: 'some id'}}) // true
isEligibleToDrinkAlchohol({age: 20, license: {id: 'some id'}}) // false
isEligibleToDrinkAlchohol({age: 22, license: null}) // false
```

#### any

Returns true if any functions pass with the value.

```ts
import { any } from 'curry-time'

let canViewPremiumArticle = any(
  pipe(
    pluck('membershipLevel'),
    equals('premium')
  ),
  pipe(
    get('numberOfPremiumArticlesViewed', 0),
    lt(5)
  )
)

canViewPremiumArticle({membershipLevel: 'premium'}) // true
canViewPremiumArticle({
  membershipLevel: 'non-premium',
  numberOfPremiumArticlesViewed: 3
}) // true
```

#### caseOf

Curried `switch`-like statement.

```ts
import { caseOf } from 'curry-time'

let toastMessageClassName = caseOf({
  critical: () => 'fa fa-bomb',
  warning: () => 'fa fa-exclamation-triangle',
  success: () => 'fa fa-check',
  default: () => ''
})

toastMessageClassName('critical') // 'fa fa-bomb'
toastMessageClassName('warning') // 'fa fa-exclamation-triangle'
toastMessageClassName('success') // 'fa fa-check'
toastMessageClassName('something random') // ''
```

### Array

#### map

Curried `Array.map`.

```ts
import { map } from 'curry-time'

let names = map(pluck('name'))

names([{name: 'Jane'}, {name: 'John'}]) // ['Jane', 'John']
```

#### forEach

Curried `Array.forEach`.

```ts
import { forEach } from 'curry-time'

let logValues = forEach(console.log)

logValues(['some value', 'another value']) // logs 'some value' and 'another value' to the console
```


#### filter

Curried `Array.filter`.

```ts
import { filter } from 'curry-time'

let shortNames = filter(
  pipe(
    length,
    lt(5)
  )
)

shortNames(['JaneJane', 'Jane']) // ['Jane']
```

##### join

Curried `Array.join`.

```ts
import { join } from 'curry-time'

let makeSentence = join(', ')

makeSentence(['Hello', 'World!']) //  'Hello, World!'
```

#### reduce

Curried `Array.reduce`.

```ts
import { reduce } from 'curry-time'

let totalSum = reduce((total, next) => total + next, 0)

totalSum([1, 2, 3]) // 6
```

#### length

Returns the length. Also works on strings.

```ts
import { length } from 'curry-time'

length([1, 2, 3]) // 3
length('hello') // 5
```

#### some

Curried `Array.some`.

```ts
import { some } from 'curry-time'

let hasHadBadDayThisWeek = some(equals('bad'))

hasHadBadDayThisWeek(['good', 'ok', 'bad']) // true
hasHadBadDayThisWeek(['good', 'ok', 'good']) // false
```

#### every

Curried `Array.every`.

```ts
import { every } from 'curry-time'

let hasHadBadDayThisWeek = some(equals('bad'))

hasHadBadDayThisWeek(['good', 'ok', 'bad']) // true
hasHadBadDayThisWeek(['good', 'ok', 'good']) // false
```

#### none

Curried `Array.none`.

#### includes

Curried `Array.includes`.

#### find

Curried `Array.find`.

#### head

Returns the first item.

#### tail

Returns all items, except for the first.

#### at

Returns an item from a specific index.

#### flatten

Curried `Array.flat`.

### Object 

#### entries

Curried `Object.entries`.

#### keys

Curried `Object.keys`.

#### values

Curried `Object.values`.

#### pluck

Get the values for a specific list of keys.

#### get

Get the value for a specific key. Also takes an optional default value.

### Number

#### gt

Curried `>`.

#### lt

Curried `<`.

#### gte

Curried `>=`.

#### lte

Curried `<=`.

### Boolean

#### not

Curried `!`.

#### stubTrue

Returns `true`.

#### stubFalse

Returns `false`.

#### stubNull

Returns `null`.

#### stubUndefined

Returns `undefined`.

#### equals

Returns true if both values are equal with `===`.

#### getType

Returns a value's type in a clear way, unlike `typeof`. Array returns `'array'`,
and `null` returns `'null'`, instead of `'object'`.

#### isType

Returns true if a value matches the type received from `getType`.

#### isString

Returns true if the value is a `String`.

#### isNumber

Returns true if the value is a `Number`.

#### isFunction

Returns true if the value is a `Function`.

#### isArray

Returns true if the value is an `Array`.

#### isNull

Returns true if the value is `null`.

#### isUndefined

Returns true if the value is a `undefined`.

#### isObject

Returns true if the value is an `Object`.

#### isTruthy

Returns true if the value is a "truthy".

#### isFalsy

Returns true if the value is a "falsy".

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


```ts
import { identity } from 'curry-time'

```

#### trace

Logs to the console and returns the value passed in.

Type

```ts
import { trace } from 'curry-time'

let someCalculation = pipe(
  add(1),
  trace,
  subtract(5),
  trace
)

someCalculation(1) // logs 2, then logs and returns -4
```

#### noop

Does nothing.

```ts
import { noop } from 'curry-time'

```

#### wrap

Wraps the value in an anonymous function.

```ts
import { wrap } from 'curry-time'

let welcomeMessage = ifElse(
  pipe(
    pluck('role'),
    equals('admin')
  ),
  wrap('Hello Admin!'),
  wrap('Hello, Non Admin!')
)

welcomeMessage({role: 'admin'}) // 'Hello, Admin!'
welcomeMessage({role: 'something else'}) // 'Hello, Non Admin!'
```

### FAQ

#### SHould I use `maybe` or `either`?

Typically, `maybe` is used for handling potentially `null` values, and `either`
is used for handling when things go wrong.

## License

MIT
