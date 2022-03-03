/**
 * @description function throttle
 * @param {Function} func - the function that needs function throttling
 * @param {Number} time - delay time
 * @param {Options} options - configuration items
 * @return {Function} - the throttled function
 **/

/**
 * @typedef {Object} Options - configuration items
 * @property {Boolean} leading - whether an additional trigger is required to start
 * @property {Boolean} trailing - does it need to trigger an extra time after it ends
 * @property {this} context - context
 **/

const throttle = (func, time = 17, options = {
    // leading and trailing cannot be false at the same time
    leading: true,
    trailing: false,
    context: null
}) => {
    let previous = new Date(0).getTime()
    let timer;
    const _throttle = function (...args) {
        let now = new Date().getTime();

        if (!options.leading) {
            if (timer) return
            timer = setTimeout(() => {
                timer = null
                func.apply(options.context, args)
            }, time)
        } else if (now - previous > time) {
            func.apply(options.context, args)
            previous = now
        } else if (options.trailing) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                func.apply(options.context, args)
            }, time)
        }
    };
    // The closure returns the cancel function
    _throttle.cancel = () => {
        previous = 0;
        clearTimeout(timer);
        timer = null
    };
    return _throttle
};

//Use Proxy to implement function throttling
function proxy(func, time, options = {
    // leading and trailing cannot be false at the same time
    leading: false,
    trailing: true,
    context: null
}) {
    let timer;
    let previous = new Date(0).getTime();

    let handler = {
        apply(target, _, args) {
            // Same as the core logic of closure implementation
            let now = new Date().getTime();
            if (!options.leading) {
                if (timer) return;
                timer = setTimeout(() => {
                    timer = null;
                    Reflect.apply(func, options.context, args)
                }, time)
            } else if (now - previous > time) {
                Reflect.apply(func, options.context, args)
                previous = now
            } else if (options.trailing) {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    Reflect.apply(func, options.context, args)
                }, time)
            }
        }
    };
    return new Proxy(func, handler)
}
