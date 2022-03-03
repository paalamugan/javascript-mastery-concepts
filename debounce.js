/**
 * @description function anti-shake
 * @param {Function} func - the function that needs function debounce
 * @param {Number} time - delay time
 * @param {Options} options - configuration items
 * @return {Function} - the debounced function
 **/

/**
 * @typedef {Object} Options - configuration items
 * @property {Boolean} leading - whether an additional trigger is required to start
 * @property {Boolean} trailing - does it need to trigger an extra time after it ends
 * @property {this} context - context
 **/

 const debounce = (func, time = 17, options = {
    leading: true,
    context: null
}) => {
    let timer;
    const _debounce = function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        if (options.leading && !timer) {
            timer = setTimeout(null, time)
            func.apply(options.context, args)
        }else{
            timer = setTimeout(() => {
                func.apply(options.context, args)
                timer = null
            }, time)
        }
    };
    /**
     * @description cancel function
     **/
    _debounce.cancel = function () {
        clearTimeout(timer)
        timer = null
    };
    return _debounce
};