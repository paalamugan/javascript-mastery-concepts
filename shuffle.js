/**
 * @description shuffling algorithm
 * @see https://github.com/mqyqingfeng/Blog/issues/51
 **/

//The old version of chrome uses the insertion algorithm to sort the array within 10 elements (the latest version has modified the sorting algorithm)
function originSort(arr) {
    arr = arr.sort(() => Math.random() - 0.5)
    return arr
}


//The principle is to randomly select one of all elements after the current element and exchange it with the current element
function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        let randomIndex = i + Math.floor(Math.random() * (arr.length - i));
        [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
    }
    return arr
}

//Create a new array, randomly take an element from the original array and put it into the new array
function shuffle2(arr) {
    let _arr = []
    while (arr.length) {
        let randomIndex = Math.floor(Math.random() * (arr.length))
        _arr.push(arr.splice(randomIndex, 1)[0])
    }
    return _arr
}

// function to analyze probability
function statistics(fn, arr) {
    let times = 100000;
    let res = {};
    for (let i = 0; i < times; i++) {
        //Declare once per loop to prevent referencing the same array
        let _arr = [...arr]
        let key = JSON.stringify(fn(_arr));
        res[key] ? res[key]++ : res[key] = 1;
    }

    // In order to facilitate display, convert to percentage
    Object.keys(res).forEach(key => {
        res[key] = res[key] / times * 100 + '%'
    })

    console.log(fn.name,res)
}

statistics(originSort, [1, 2, 3])
statistics(shuffle, [1, 2, 3])
statistics(shuffle2, [1, 2, 3])