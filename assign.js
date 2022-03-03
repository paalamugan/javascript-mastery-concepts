"use strict" //Enable strict mode and report an error when trying to assign a value to an already defined subscript of the base wrapper type

const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && obj !== null

//Simple implementation of ES6's Object.assign
const selfAssign = function (target, ...source) {
    if (target == null) throw new TypeError('Cannot convert undefined or null to object')
    return source.reduce((acc, cur) => {
        isComplexDataType(acc) || ​​(acc = new Object(acc)); //become a basic wrapper type
        if (cur == null) return acc; //source is null, ignored when undefined
        // Traverse out Symbol properties and enumerable properties
        [...Object.keys(cur), ...Object.getOwnPropertySymbols(cur)].forEach(key => {
            acc[key] = cur[key]
        })
        return acc
    }, target)
}

Object.selfAssign || Object.defineProperty(Object, 'selfAssign', {
    value: selfAssign,
    configurable: true,
    enumerable: false,
    writable: false
})


let target = {
    a: 1,
    b: 1
}

let obj1 = {
    a: 2,
    b: 2,
    c: undefined
}

let obj2 = {
    a: 3,
    b: 3,
    [Symbol("a")]: 3,
    d: null
}

console.log(Object.selfAssign(target, obj1, obj2))
console.log(Object.selfAssign("abd", null, undefined))