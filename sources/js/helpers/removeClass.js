import hasClass from './hasClass';
import classListSupport from './classListSupport';

const removeClass = classListSupport
  ? (el, str) => {
      if (hasClass(el, str)) {
        el.classList.remove(str);
      }
    }
  : (el, str) => {
      if (hasClass(el, str)) {
        el.className = el.className.replace(str, '');
      }
    };

export default removeClass;
