//Simple simulation of ES6 class implementation
// class Animal {
// constructor(name) {
// this.name = name
// }
//
// sleep() {
// console.log('animal is sleeping')
// }
//
// static staticFunc() {
// console.log('staticFunc')
// }
// }
//
// class Dog extends Animal {
// constructor(name, color) {
// super(name)
// this.color = color
// }
//
// barking() {
// console.log('wang!')
// }
// }
//
// let brownTeddy = new Dog('teddy', 'brown')
// Dog.staticFunc()
// console.log(brownTeddy)
// brownTeddy.sleep()
// brownTeddy.barking()


function Animal(name) {
    this.name = name
}

Animal.staticFunc = function () {
    console.log('staticFunc')
}
Animal.prototype.sleep = function () {
    console.log('animal is sleeping')
}

function Dog(name, color) {
    Animal.call(this, name)
    this.color = color
}

//Parasitic composition inheritance + inheritance between constructors
function inherit(subType, superType) {
    //Because of the characteristics of JavaScript reference types and functions passed by value, the reference address of subType cannot be changed
    subType.prototype = Object.create(superType.prototype, {
        constructor: {
            enumerable: false,
            configurable: true,
            writable: true,
            // Points to subclasses, consistent with default inheritance behavior
            value: subType
        }
    })
    //The child constructor inherits the parent constructor (the child class inherits the static methods and static properties of the parent class)
    Object.setPrototypeOf(subType, superType)
}

inherit(Dog, Animal)

//Need to add prototype method to Dog after inheritance, otherwise it will be overwritten
Dog.prototype.barking = function () {
    console.log('wang!')
}


let brownTeddy = new Dog('teddy', 'brown')
Dog.staticFunc()
console.log(brownTeddy)
brownTeddy.sleep()
brownTeddy.barking()