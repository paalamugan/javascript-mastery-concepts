// koa-compose

let app = {
    use(mid) {
        this.middleware.push(mid)
    },
    middleware: []
}

app.use(async function mid1(ctx, next) {
    console.log('mid1 enter')
    await next()
    // Using the characteristics of async / await syntax, after the middleware hands over the execution right, it will eventually return to this middleware and execute the subsequent code of await
    console.log('mid1 out')
})

app.use(async function mid2(ctx, next) {
    console.log('mid2 enter')
    await asyncFunc(1000)
    await next()
    console.log('mid2 out')
})

app.use(async function mid3(ctx, next) {
    console.log('mid3 enter')
    await asyncFunc(2000)
    await next()
    console.log('mid3 out')
})


function compose(middleware) {
    // return a function, wait until needed and execute it
    return function (ctx) {
        function dispatch(index) {
            if(index === middleware.length) return
            let mid = middleware[index]
            // The next method is called in the koa middleware, and it will be handed over to the next middleware
            // recursively call dispatch
            // Because the middleware is an async function, use Promise.resolve to wrap it
            return Promise.resolve(mid(ctx, () => dispatch(index + 1)))
        }
        dispatch(0)
    }
}

function asyncFunc(duration) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, duration)
    })
}

const composedFunc = compose(app.middleware)
composedFunc({})