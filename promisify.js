// run the following code using nodejs
// promisify generic function suitable for err-first style asynchronous operations (eg. nodejs)

const fs = require("fs")

function promisify(asyncFunc) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            args.push(function callback(err, ...values) {
                if (err) {
                    return reject(err);
                }
                return resolve(...values)
            });
            asyncFunc.call(this, ...args);
        });
    };
}

const fsp = new Proxy(fs,{
    get(target, key) {
        return promisify(target[key])
    }
})


async function generateCommit() {
    try {
        let data = await fsp.readFile('./promisify.js', 'utf-8')
        data += `\n//I am a comment`
        await fsp.writeFile('./promisify.js', data)
    } catch (e) {
        console.log(e)
    }
}

generateCommit()