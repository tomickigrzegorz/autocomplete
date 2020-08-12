import hasClass from './hasClass'
import classListSupport from './classListSupport'

const addClass = classListSupport
  ? (el, str) => {
    if (!hasClass(el, str)) {
      el.classList.add(str)
    }
  }
  : (el, str) => {
    if (!hasClass(el, str)) {
      el.className += ` ${str}`
    }
  }

export default addClass
