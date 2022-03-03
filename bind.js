"use strict"

const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && obj !== null

// Implement a simple bind
const selfBind = function (bindTarget, ...args1) {
    if (typeof this !== 'function') throw new TypeError('Bind must be called on a function')
    const originFunc = this
    const boundFunc = function (...args2) {
        // use the new keyword call to return a new object
        if (new.target) {
            let res = originFunc.call(this, ...args1, ...args2)
            //If the constructor returns an object, return this object
            if (isComplexDataType(res)) return res
            //otherwise return the new object
            return this
        } else {
            return originFunc.call(bindTarget, ...args1, ...args2)
        }
    }
    /**
     * The function created by the real bind does not have a prototype. Instead, there is a [[TargetFunction]] to save the function before bind
     * Using new will connect the __proto__ of the created object to the [[TargetFunction] prototype (not an arrow function)
     * Here, manually set a prototype property for the function after bind to simulate this behavior
     * **/
    // Arrow functions have no prototype
    if (originFunc.prototype) {
        boundFunc.prototype = originFunc.prototype
    }

    // Define the length and name of the bound function
    const desc = Object.getOwnPropertyDescriptors(originFunc)
    Object.defineProperties(boundFunc, {
        length: desc.length,
        name: Object.assign(desc.name, {
            value: `bound ${desc.name.value}`
        })
    })
    return boundFunc
}


Function.prototype.selfBind || (Object.defineProperty(Function.prototype, 'selfBind', {
    value: selfBind,
    enumerable: false,
    configurable: true,
    writable: true
}))


function originFunc() {
    this.name = 'yeyan1996'
    return {}
}

let obj = {
    age: 22
}

const boundFunc = originFunc.selfBind(obj)

console.dir(originFunc)
console.dir(boundFunc)

// Even though obj is bound, this will still point to the newly created object when using new as the constructor
// That is, no name attribute will be added to obj
new boundFunc()
console.log(obj)

// Otherwise pointing to boundFunc will add the name attribute to the bound obj object
boundFunc()
console.log(obj)


function originFunc2() {
    this.name = 'yeyan1996'
}

const boundFunc2 = originFunc2.selfBind({})
let instance = new boundFunc2()
// Use the bound function as a constructor, and the __proto__ of the generated object points to the prototype of the function before binding
console.log(instance.__proto__ === originFunc2.prototype)
