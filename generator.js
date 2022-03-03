//Self-executing generator function

const data = "{a:1,b:2}"
const data2 = "{c:3,d:4}"
const data3 = "{e:5,f:6}"

const api = function (data) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data)
        }, 1000)
    })

}


function* func() {
    let res = yield api(data)
    console.log(res)
    let res2 = yield api(data2)
    console.log(res2)
    let res3 = yield api(data3)
    console.log(res3)
    console.log(res, res2, res3)
}


function makePromisify(source) {
    if (source.then && typeof source.then === "function") return source
    return Promise.resolve(source)
}

function run(generatorFunc) {
    let it = generatorFunc()
    let result = it.next()

    return new Promise((resolve, reject) => {
        const next = function (result) {
            if (result.done) {
               return resolve(result.value)
            }
            // Guaranteed to return a promise
            result.value = makePromisify(result.value)
            result.value.then(res => {
                //Pass the return value res of promise into the next method of the iterator iterator as the return value of the expression after yield
                //it.next will continue the execution of the stopped yield to the next yield, and the returned result is an object composed of value and done properties
                let result = it.next(res)
                // execute the next function recursively
                next(result)
            }).catch(err => {
                reject(err)
            })
        }
        next(result)
    })
}

run(func)