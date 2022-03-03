const isFunction = func => Object.prototype.toString.call(func) === '[object Function]'

const selfAll = iterator => {
    // The argument to all must be an iterable data structure
    if (!iterator[Symbol.iterator]) throw new Error('argument is not iterable')
    return new Promise((resolve, reject) => {
        // If the parameter length is 0, directly return a resolved promise synchronously
        if (!iterator.length) {
            resolve()
            return
        }
        let resolvedValues ​​= []

        let onResolve = res => {
            resolvedValues.push(res)
            if (resolvedValues.length === iterator.length) {
                resolve(resolvedValues)
            }
        }

        iterator.map(item => Promise.resolve(item)).forEach(promise => {
            promise.then(onResolve, reject)
        })

    })
}

const selfRace = iterator => {
    if (!iterator[Symbol.iterator]) throw new Error('argument is not iterable')
    return new Promise((resolve, reject) => { // If the parameter length is 0, return a promise that is always pending
        if (!iterator.length) {
            return
        }
        iterator.map(item => Promise.resolve(item)).forEach(promise => {
            promise.then(resolve, reject)
        })
    })
}

// const selfAllSettled = iterator => {
// if (!iterator[Symbol.iterator]) throw new Error('argument is not iterable')
// return new Promise((resolve,reject) => {
//
// })
// }

// finally satisfy:
// finally callback will not accept any arguments
// If the callback of finally returns a promise, then finally will wait for the promise resolution in the callback to complete before resolving itself
// finally returns a promise, and the promise's value is the resolved value of the first non-finally-returned promise before finally
// e.g: Promise.resolve(1).finally(()=>{}).then(res=>console.log(res)) // print 1

const selfFinally = function (callback) {
    if (!isFunction(callback)) callback = () => {}
    // Implement the operation of waiting for the previous promise to be executed before executing the callback through then
    // At the same time finally also returns a promise to support continued chaining
    return this.then(
        // Implement through Promise.resolve if callback is a promise, wait for the promise to resolve and resolve the finally promise
        // By then returning the res implementation to store the value of the last non-finally promise resolution
        res => Promise.resolve(callback()).then(() => res),
        err => Promise.resolve(callback()).then(() => {
            throw err
        })
    )
}


Promise.selfAll || (Object.defineProperty(Promise, 'selfAll', {
    value: selfAll,
    enumerable: false,
    configurable: true,
    writable: true
}))

Promise.selfRace || (Object.defineProperty(Promise, 'selfRace', {
    value: selfRace,
    enumerable: false,
    configurable: true,
    writable: true
}))

// Promise.selfAllSettled || (Object.defineProperty(Promise, 'selfAllSettled', {
//     value: selfAllSettled,
//     enumerable: false,
//     configurable: true,
//     writable: true
// }))

Promise.prototype.selfFinally || (Object.defineProperty(Promise.prototype, 'selfFinally', {
    value: selfFinally,
    enumerable: false,
    configurable: true,
    writable: true
}))


let promise1 = new Promise(resolve => {
    setTimeout(() => {
        resolve(1)
    }, 1000)
})

let promise2 = new Promise(resolve => {
    setTimeout(() => {
        resolve(2)
    }, 2000)
})

let promise3 = new Promise(resolve => {
    setTimeout(() => {
        resolve(3)
    }, 3000)
})

let promise4 = new Promise((_, reject) => {
    setTimeout(() => {
        reject('err')
    }, 1500)
})


Promise.selfAll([promise1, promise2, promise3, promise4])
    .then(res => console.log(res))
    .catch(err => console.log('promise all:' + err))

Promise.selfRace([promise1, promise2, promise3, promise4])
    .then(res => console.log('promise race:' + res))

Promise.resolve('promise finally:ok')
    .selfFinally()
    .selfFinally(() => {})
    .then(res => console.log(res)) //1

Promise.resolve('promise finally:ok')
    .finally()
    .finally(() => {})
    .then(res => console.log(res)) //1
