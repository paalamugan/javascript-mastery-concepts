// loop through the map
const selfMap = function (fn, context) {
    let arr = Array.prototype.slice.call(this)
    let mappedArr = Array()
    for (let i = 0; i < arr.length; i++) {
        // Determine the case of sparse array
        if (!arr.hasOwnProperty(i)) continue;
        mappedArr[i] = fn.call(context, arr[i], i, this)
    }
    return mappedArr
}


// reduce implements map
// This polyfill cannot handle empty cell arrays since reduce skips over empty cell arrays
const selfMap2 = function (fn, context) {
    let arr = Array.prototype.slice.call(this)
    return arr.reduce((pre, cur, index) => [...pre, fn.call(context, cur, index, this)], [])
}


Array.prototype.selfMap || (Object.defineProperty(Array.prototype, 'selfMap', {
    value: selfMap,
    enumerable: false,
    configurable: true,
    writable: true
}))
Array.prototype.selfMap2 || (Object.defineProperty(Array.prototype, 'selfMap2', {
    value: selfMap2,
    enumerable: false,
    configurable: true,
    writable: true
}))

let arr = ['z', 'h', ,'l']
console.log(arr.selfMap(item => item + "1"))
console.log(selfMap2.call({0:'a',1:'b',length:2}, item => item + "1")) // map method also supports array-like