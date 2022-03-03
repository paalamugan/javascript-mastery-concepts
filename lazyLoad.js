// getBoundingClientRect implements lazy loading
let imgList1 = [...document.querySelectorAll(".get_bounding_rect")]
let num = imgList1.length

let lazyLoad1 = (function () {
    let count = 0
    return function () {
        let deleteIndexList = []
        imgList1.forEach((img,index) => {
            let rect = img.getBoundingClientRect()
            if (rect.top < window.innerHeight) {
                img.src = img.dataset.src
                // Add the image to the delete list after the load is successful
                deleteIndexList.push(index)
                count++
                if (count === num) {
                    //Unbind the scroll event when all images are loaded
                    document.removeEventListener('scroll', lazyLoad1)
                }
            }
        })
        // delete the image that has been loaded
        imgList1 = imgList1.filter((_,index)=>!deleteIndexList.includes(index))

    }
})()

// The throttle function of throttle.js is referenced here
lazyLoad1 = proxy(lazyLoad1, 100)

document.addEventListener('scroll', lazyLoad1)
// Manually load once, otherwise the picture on the first screen cannot be loaded without triggering scrolling
lazyLoad1()



// intersectionObserver implements lazy loading
let imgList2 = [...document.querySelectorAll(".intersection_observer")]

let lazyLoad2 = function () {
    // instantiate observer
    let observer = new IntersectionObserver(entries => {
        //entries store the intersectionObserverEntry configuration of all observed elements
        entries.forEach(entry => {
            // greater than 0 means entering the viewport
            if (entry.intersectionRatio > 0) {
                entry.target.src = entry.target.dataset.src
                // cancel observation
                observer.unobserve(entry.target)
            }
        })
    })
    imgList2.forEach(img => {
        observer.observe(img)
    })
}

lazyLoad2()