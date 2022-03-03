//Private variable (Proxy)
const proxy = function (obj) {
    return new Proxy(obj, {
        get(target, key) {
            if (key.startsWith('_')) {
                throw new Error('private key')
            }
            return Reflect.get(target, key)
        },
        //Intercept all traversal operations
        ownKeys(target) {
            return Reflect.ownKeys(target).filter(key => !key.startsWith('_'))
        }
    })
}

class Person {
    constructor(name) {
        this._name = name
        return proxy(this)
    }

    get name() {
        return this._name
    }
}


let person = new Person('zhl')

console.log(person)
try {
    console.log(person._name)
} catch (e) {
    console.error(e)
}
console.log(person.name)


//Private variable (Symbol)
const Person1 = (function () {
    const _name = Symbol('name')

    class Person1 {
        constructor(name) {
            this[_name] = name
        }

        getName() {
            return this[_name]
        }
    }

    return Person1
})()

let person1 = new Person1('zhl')

console.log('Symbol:', person1)
console.log(person1._name) //undefined
console.log(person1.getName())


//Private variable (WeakMap)
//WeakMap is automatically removed from the mapping table when the object does not exist compared to Map, which automatically reduces the memory usage
const Person2 = (function () {
    let wp = new WeakMap()

    class Person2 {
        constructor(name) {
            //Store the current instance and the private variables of the current instance
            wp.set(this, {name})
        }

        getName() {
            return wp.get(this).name
        }
    }

    return Person2
})()

let person2 = new Person2('zhl')

console.log("WeakMap:", person2)
console.log(person2.name)
console.log(person2.getName())


// //private variable (closure)
class Person4 {
    constructor(name) {
        let _name = name
        this.getName = function () {
            return _name
        }
    }
}


let person4 = new Person4('zhl')

console.log("closure:", person4)
console.log(person4.name)
console.log(person4.getName())