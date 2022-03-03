// Simple implementation of JSON.stringify method

const isString = value => typeof value === 'string';
const isSymbol = value => typeof value === 'symbol'
const isUndefined = value => typeof value === 'undefined'
const isDate = obj => Object.prototype.toString.call(obj) === '[object Date]'
const isFunction = obj => Object.prototype.toString.call(obj) === '[object Function]';
const isComplexDataType = value => (typeof value === 'object' || typeof value === 'function') && value !== null;
const isValidBasicDataType = value => value !== undefined && !isSymbol(value); // valid basic type
const isValidObj = obj => Array.isArray(obj) || Object.prototype.toString.call(obj) === '[object Object]';// valid complex type (object)
const isInfinity = value => value === Infinity || value === -Infinity


// The existence of Symbol/Undefined/Function types in the array will become null
// Infinity/NaN also becomes null
const processSpecialValueInArray = value =>
    isSymbol(value) || isFunction(value) || isUndefined(value) || isInfinity(value) || isNaN(value) ? null : value;

// Process property value according to JSON specification
const processValue = value => {
    if (isInfinity(value) || isNaN(value)) {
        return null
    }
    if (isString(value)) {
        return `"${value}"`
    }
    return value
};

let s = Symbol('s')
let obj = {
    str: "123",
    arr: [1, {e: 1}, s, () => {
    }, undefined,Infinity,NaN],
    obj: {a: 1},
    Infinity: -Infinity,
    nan: NaN,
    undef: undefined,
    symbol: s,
    date: new Date(),
    reg: /123/g,
    func: () => {
    },
    dom: document.querySelector('body'),
};

// obj.loop = obj

const jsonStringify = (function () {
    // Closure + WeakMap to prevent circular references
    let wp = new WeakMap()
    // The recursive call to jsonStringify is this function in the closure, not the jsonStringify function declared by const
    return function jsonStringify(obj) {
        if (wp.get(obj)) throw new TypeError('Converting circular structure to JSON');
        let res = "";

        if (isComplexDataType(obj)) { // case of complex type
            if (obj.toJSON) return obj.toJSON; // directly call if it contains toJSON method
            if (!isValidObj(obj)) { // Illegal complex type returns directly
               return
            }
            wp.set(obj, obj);
            if (Array.isArray(obj)) { // case of array
                res += "[";
                let temp = []; //declare a temporary array to control commas between properties
                obj.forEach((value) => {
                    temp.push(
                        isComplexDataType(value) && !isFunction(value) ?
                            jsonStringify(value) :
                            `${processSpecialValueInArray(value, true)}`
                    )
                });
                res += `${temp.join(',')}]`
            } else { // object case
                res += "{";
                let temp = [];
                Object.keys(obj).forEach((key) => {
                    // the case where the value is an object
                    if (isComplexDataType(obj[key])) {
                        // if the value is a valid object
                        if (isValidObj(obj[key])) {
                            temp.push(`"${key}":${jsonStringify(obj[key])}`)
                        } else if (isDate(obj[key])) { // Call toISOString for Date type
                            temp.push(`"${key}":"${obj[key].toISOString()}"`)
                        } else if (!isFunction(obj[key])) { // other non-function types return empty objects
                            temp.push(`"${key}":{}`)
                        }
                    } else if (isValidBasicDataType(obj[key])) { // value is basic type
                        temp.push(`"${key}":${processValue(obj[key])}`)
                    }
                });
                res += `${temp.join(',')}}`
            }
        } else if (isSymbol(obj)) { // Symbol returns undefined
            return
        } else {
            return obj // non-Symbol primitive types are returned directly
        }
        return res
    }
})();


console.log(jsonStringify(obj));
console.log(JSON.stringify(obj));
