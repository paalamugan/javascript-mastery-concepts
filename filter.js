// ES5 loop to implement filter
const selfFilter = function (fn, context) {
    let arr = Array.prototype.slice.call(this)
    let filteredArr = []
    for (let i = 0; i < arr.length; i++) {
        if(!arr.hasOwnProperty(i)) continue;
         fn.call(context, arr[i], i, this) && filteredArr.push(arr[i])
    }
    return filteredArr
}


// reduce implements filter
const selfFilter2 = function (fn, context) {
    return this.reduce((pre, cur, index) => {
        return fn.call(context, cur, index, this) ? [...pre, cur] : [...pre]
    }, [])
}

Array.prototype.selfFilter || (Object.defineProperty(Array.prototype, 'selfFilter', {
    value: selfFilter,
    enumerable: false,
    configurable: true,
    writable: true
}))

Array.prototype.selfFilter2 || (Object.defineProperty(Array.prototype, 'selfFilter2', {
    value: selfFilter2,
    enumerable: false,
    configurable: true,
    writable: true
}))

let arr = [1, 2, 3]
console.log(arr.selfFilter(item => item === 2))

// When passing the second parameter to the filter function, the first parameter cannot be an arrow function
// Otherwise, the second parameter will be invalid due to lexical binding, and the same is true for other iterative methods
console.log(arr.selfFilter2(function (item) {
    return item === 2
}, ['a', 'b', 'c']))