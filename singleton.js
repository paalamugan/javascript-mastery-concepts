function proxy(func) {
    let instance;
    let handler = {
        construct(target, args) {
            if (!instance) {
                // create an instance without an instance
                instance = Reflect.construct(func,args)
            }
            // returns an instance anyway (new keyword)
            return instance
        }
    }
    return new Proxy(func, handler)
}

function Person(name, age) {
    this.name = name
    this.age = age
}

const SingletonPerson = proxy(Person)

let person1 = new SingletonPerson('zhl', 22)

let person2 = new SingletonPerson('cyw', 22)

console.log(person1 === person2) // true