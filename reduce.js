// ES5 loop implements reduce

Array.prototype.selfReduce = function (fn, initialValue) {
    let arr = Array.prototype.slice.call(this)
    let res
    let startIndex
    if (initialValue === undefined) {
        // find the element and subscript of the first non-empty cell (true)
        for (let i = 0; i < arr.length; i++) {
            if (!arr.hasOwnProperty(i)) continue
            startIndex = i
            res = arr[i]
            break
        }
    } else {
        res = initialValue
    }
    // The starting point of the traversal is a real element after the real element found in the previous step
    // Each traversal will skip elements of empty cells
    for (let i = ++startIndex || 0; i < arr.length; i++) {
        if (!arr.hasOwnProperty(i)) continue
        res = fn.call(null, res, arr[i], i, this)
    }
    return res
}

Array.prototype.selfReduce || (Object.defineProperty(Array.prototype, 'selfReduce', {
    value: selfReduce,
    enumerable: false,
    configurable: true,
    writable: true
}))


let arr = [1, 2, 3, 4, 5]

console.log(arr.selfReduce((acc, cur) => acc + cur))
console.log(arr.reduce((acc, cur) => acc + cur))