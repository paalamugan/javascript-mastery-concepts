const display = (a, b, c, d, e, f, g, h) => [a, b, c, d, e, f, g, h];


/**
 * @description partial function (creates a function with one or more parameters already set, and adds placeholder functionality)
 * @param {Function} func - the partially evaluated function
 * @param {...*} [args] - partially evaluated arguments
 * @return {Function} - the partially evaluated function
 **/

const partialFunc = (func, ...args) => {
    let placeholderNum = 0
    return (...args2) => {
        args2.forEach(arg => {
            let index = args.findIndex(item => item === "_")
            if (index < 0) return
            args[index] = arg
            placeholderNum++
        })
        if (placeholderNum < args2.length) {
            args2 = args2.slice(placeholderNum, args2.length)
        }
        return func.apply(this, [...args, ...args2])
    }
}


let partialDisplay = partialFunc(display, 1, 2)
console.log("partialFunc", partialDisplay(3, 4, 5, 6, 7, 8))


let partialDisplay2 = partialFunc(display, '_', 2, '_') // use a placeholder
console.log('partialFunc2', partialDisplay2(1, 3, 4, 5, 6, 7, 8))