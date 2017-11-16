var utils = {
  extend() {
    var options
    var name
    var src
    var copy
    var clone
    var target = arguments[0] || {}
    var i = 1
    var length = arguments.length
    var deep = false

    if (target.constructor === Boolean) {
      deep = target
      target = arguments[1] || {}
      i = 2
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      if ((options = arguments[i]) != null) {
        // Extend the base object
        for (name in options) {
          src = target[name]
          copy = options[name]

          // Prevent never-ending loop
          if (target === copy) {
            continue
          }

          // Recurse if we're merging plain objects or arrays
          if (
            deep &&
            copy &&
            (copy.constructor === Object || copy.constructor === Array)
          ) {
            clone = src && src.constructor === copy.constructor
              ? src
              : new copy.constructor()
            // Never move original objects, clone them
            // If is an array clear the target
            if (clone.constructor === Array) {
              clone = []
            }
            target[name] = this.extend(deep, clone, copy)

            // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy
          }
        }
      }
    }
    // Return the modified object
    return target
  },
}

export default utils
