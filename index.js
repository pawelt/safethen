/**
 * Executes the syncFunc wrapped in try/catch.
 * If syncFunc throws or returns undefined, returns defaultValue (which can be undefined too),
 * otherwise it returns the `syncFunc()` call result.
 *
 * This is handy for working with nested objects (Mongo data etc.), for ex.:
 * <pre>
 *     const nestedObject = { ... };
 *
 *     // if undefined is an accepted value
 *     const valueOrUndefined = safe(_ => nestedObject.a.b.c.d);
 *
 *     // if you don't want undefined
 *     const valueOrDefault = safe(_ => nestedObject.a.b.c.d, 'some default');
 * </pre>
 * @param {function} syncFunc
 * @param {any} [defaultValue]
 * @returns {string}
 */
function safe(syncFunc, defaultValue) {
    try {
        const result = syncFunc();
        return result !== void 0 ? result : defaultValue;
    } catch (ex) {
        return defaultValue;
    }
};
/**
 * Promise-safe version of safe.
 * `asyncFunc` function can fail synchronously (throw an error) 
 * asynchronously (return a rejected promise).
 *
 * <pre>
 *     safeThen(_ => blow.up.here, 123)
 *         .then(value => ...); // value == 123
 *     safeThen(_ => maybe.blow.up && getAjaxData(), 123)
 *         .then(value => ...); // value == resolved ajax result or 123
 * </pre>
 *
 * @param {funciton} asyncFunc
 * @param {any} defaultValue
 * @returns {Promise}
 */
function safeThen(asyncFunc, defaultValue) {
    return Promise.resolve()
        .then(_ => asyncFunc())
        .then(result => result !== void 0 ? result : defaultValue)
        .catch(_ => defaultValue);
};

module.exports = {
    safe: safe,
    safeThen: safeThen,
};
