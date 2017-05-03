# safethen
Function wrappers for synchronous and asynchronous try/catch.

## Motivation

This tiny package provides two functions that let you write less error checking code. Useful for handling `MongoDB` documents, `DOM` nodes etc.

```js
const { safe, safeThen } = require('safethen');
```

## safe() - use in synchronous code

```js
const { safe } = require('safethen');

// a random nested objects
const obj = { a: { } };

// if undefined is an accepted value
// valueOrUndefined === undefined
const valueOrUndefined = safe(_ => obj.a.b.c);

// if you don't want undefined
// valueOrUndefined === 'some default'
const valueOrDefault = safe(_ => obj.a.b.c, 'some default');

// wrap any logic in safe()
// valueOrUndefined === 'some default'
const valueOrDefault = safe(_ => 1 < 2 && obj.a.b.c, 'some default');


// if-like conditions in promise chains
Promise.resolve(false)
    .then(x => safe(_ => { if (!x) throw 'boom'; }, 'phew!'))
    .then(console.log); // logs 'phew!'

// vanila promises version
Promise.resolve(false)
    .then(x => Promise.resolve()
        // this then/catch nesting is necessary, as don't want to
        // swallow outer errors
        .then(_ => { if (!x) throw 'boom'; })
        .catch(_ => 'phew!');
    )
    .then(console.log); // logs 'phew!'
```

## safeThen() - use with promises
```js
const { safeThen } = require('safethen');

const obj = { a: { b: { c: true }} };

// value === 123
safeThen(_ => obj.x.y, 123).then(value => ...);

const ajaxRequest = _ => Promise.resolve('OK');

// value === 'OK'
safeThen(_ => obj.a.b.c && ajaxRequest(), 123)
    .then(value => ...);

// value === 123, ajaxRequest() is never called
safeThen(_ => obj.ohNoes() && ajaxRequest(), 123)
    .then(value => ...);


// value === undefined
safeThen(_ => blowUp())
    .then(value => console.log(value === undefined))   // true
    .catch(err => console.log('this is never logged');
```


## Source

```js
/**
 * safe
 *
 * @param {function} syncFunc       function exectued inside try/catch block
 * @param {any}      [defaultValue]
 * @returns {any}    result of `syncFunc()` call or `defaultValue`
 */
function safe(syncFunc, defaultValue) {
    try {
        const value = syncFunc();
        return value !== void 0 ? value : defaultValue;
    } catch (ex) {
        return defaultValue;
    }
}

/**
 * safeThen
 *
 * @param {function}  asyncFunc      function executed in a Promise context
 * @param {any}       [defaultValue]
 * @returns {Promise} resolved with the `asyncFunc()` result or `defaultValue`
 */
function safeThen(asyncFunc, defaultValue) {
    return Promise.resolve()
        .then(asyncFunc)
        .then(function (value) { return value !== void 0 ? value : defaultValue; })
        .catch(function () { return defaultValue; });
}
```
