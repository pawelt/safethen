# safethen
Function wrappers for synchronous and asynchronous try/catch.

## Motivation

This tiny package provides two functions that let you write less error checking code.

### safe() - synchronous code

Use in synchronous code, for ex.:

```js
// a random nested objects (MongoDB document, DOM node etc.)
const obj = { a: { } };

// if undefined is an accepted value
const valueOrUndefined = safe(_ => obj.a.b.c); // returns undefined

// if you don't want undefined
const valueOrDefault = safe(_ => obj.a.b.c, 'some default'); // returns 'some default'

// wrap any logic in safe()
const valueOrDefault = safe(_ => 1 < 2 && obj.a.b.c, 'some default'); // returns 'some default'
```

### safeThen() - promises

Use in asynchronous code, for ex.:

```js
const obj = { a: { b: { c: true }} };

safeThen(_ => obj.x.y, 123)
    .then(value => ...); // value == 123


// synchronous condition mixed in
const ajaxRequest = _ => Promise.resolve('OK');
safeThen(_ => obj.a.b.c && ajaxRequest(), 123)
    .then(value => ...); // value == 'OK'

safeThen(_ => obj.ohNoes() && ajaxRequest(), 123)
    .then(value => ...); // value == 123, ajaxRequest() is never called
```

