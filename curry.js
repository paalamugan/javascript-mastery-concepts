const display = (a, b, c, d, e, f, g, h) => [a, b, c, d, e, f, g, h];

/**
 * @description function currying (determines how many times the currying function needs to be executed according to the number of parameters of the function before currying)
 * @param {function} fn - the curried function
 */

 function curry(fn) {
    if (fn.length <= 1) return fn;
    const generator = (...args) => {
        if (fn.length === args.length) {
            //Execute fn and return the execution result
            return fn(...args)
        } else {
            return (...args2) => {
                //return generator function
                return generator(...args, ...args2)
            }
        }
    }
    return generator
}

const curriedDisplay = curry(display);
console.log("curriedDisplay", curriedDisplay(1)(2)(3)(4)(5)(6)(7)(8));




// ES6 shorthand
const curry2 = fn => {
    if (fn.length <= 1) return fn;
    const generator = (...args) => (args.length === fn.length ? fn(...args) : (...args2) => generator(...args, ...args2) );
    return generator;
};
const curriedDisplay2 = curry2(display);
console.log("curriedDisplay2", curriedDisplay2(1)(2)(3)(4)(5)(6)(7)(8));




/**
 * @description function currying (supports placeholder version)
 * @param {function} fn - the curried function
 * @param {String} [placeholder = "_"] - placeholder
 */

 const curry3 = (fn, placeholder = "_") => {
    curry3.placeholder = placeholder
    if (fn.length <= 1) return fn;
    let argsList = []
    const generator = (...args) => {
        let currentPlaceholderIndex = -1 // Record the nearest placeholder index of the non-current round to prevent the current round element from covering the current round's placeholder
        args.forEach(arg => {
            let placeholderIndex = argsList.findIndex(item => item === curry3.placeholder)
            if (placeholderIndex < 0) { // if there is no placeholder in the array, put an element directly at the end of the array
                currentPlaceholderIndex = argsList.push(arg) - 1
                // Prevent filling elements into placeholders for the current round parameter
                // (1,'_')('_',2) The number 2 should fill the placeholder after 1, not the placeholder before 2
            } else if (placeholderIndex !== currentPlaceholderIndex) {
                argsList[placeholderIndex] = arg
            } else { // the case where the current element is a placeholder
                argsList.push(arg)
            }
        })
        let realArgsList = argsList.filter(arg => arg !== curry3.placeholder) //Filter out the array without placeholders
        if (realArgsList.length >= fn.length) {
            return fn(...argsList)
        } else {
            return generator
        }
    }

    return generator
}

const curriedDisplay3 = curry3(display);
console.log("curriedDisplay3", curriedDisplay3('_', 2)(1, '_', 4)(3, '_',)('_', 5)(6)(7, 8))




/**
 * @example function composition + function currying
 **/

const compose = function (...fns) {
    return function (initValue) {
        return fns.reduceRight((acc, cur) => {
            return cur(acc)
        }, initValue)
    }
}

const curriedJoin = curry3((separator, arr) => arr.join(separator))
const curriedMap = curry3((fn, arr) => arr.map(fn))
const curriedSplit = curry3((separator, str) => str.split(separator))


const composeFunc = compose(
    curriedJoin("1"),
    curriedMap(item => `${item}1`),
    curriedSplit(""),
)

console.log("compose + curry", composeFunc('helloworld'))



/**
 * @example defers path parameters to later passing in placeholders
 **/

 if (!window) {
    const {readFile} = require("fs")
    const {join} = require("path")

    const callback = (err, data) => {
        err ? console.error(err) : console.log(data)
    }

    ['curry.js', 'curry.html'] // Turn the file list into an array for easy management and maintenance
        .map(file => join(__dirname, file)) // The join function cannot be curried because the parameters are optional and the length is 0
        .map(curry3(readFile)('_', 'utf-8', callback))

} else {
    console.warn('Please use the nodejs environment to run the following code')
}