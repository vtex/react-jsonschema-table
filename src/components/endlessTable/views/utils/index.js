function areArraysEqual(a, b) {
  if (!a || !b) {
    return false
  }

  if (a.length !== b.length) {
    return false
  }

  for (var i = 0, length = a.length; i < length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

function topFromWindow(element) {
  if (!element || element === window) {
    return 0
  }

  return element.offsetTop + topFromWindow(element.offsetParent)
}

function topDifference(element, container) {
  return topFromWindow(element) - topFromWindow(container)
}

function viewTop(element) {
  var viewTop
  if (element === window) {
    viewTop = window.pageYOffset
    if (!viewTop && document) {
      viewTop = document.documentElement.scrollTop
    }
    if (!viewTop && document) {
      viewTop = document.body.scrollTop
    }
  } else {
    viewTop = element.scrollY
    if (!viewTop) {
      viewTop = element.scrollTop
    }
  }
  return !viewTop ? 0 : viewTop
}

function debounce(func, wait, immediate) {
  if (!wait) {
    return func
  }

  var timeout

  return function() {
    var context = this
    var args = arguments

    var later = function() {
      timeout = null

      if (!immediate) {
        func.apply(context, args)
      }
    }

    var callNow = immediate && !timeout

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) {
      func.apply(context, args)
    }
  }
}

module.exports = {
  areArraysEqual: areArraysEqual,
  topDifference: topDifference,
  topFromWindow: topFromWindow,
  viewTop: viewTop,
  debounce: debounce,
}
