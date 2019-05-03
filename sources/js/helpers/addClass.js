import { classListSupport, hasClass } from './hasClass.js';

const addClass = classListSupport
  ? function(el, str) {
      if (!hasClass(el, str)) {
        el.classList.add(str);
      }
    }
  : function(el, str) {
      if (!hasClass(el, str)) {
        el.className += ` ${str}`;
      }
    };

export { addClass };
