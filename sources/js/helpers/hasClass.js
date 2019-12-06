import classListSupport from './classListSupport';

const hasClass = classListSupport
  ? (el, str) => {
      return el.classList.contains(str);
    }
  : (el, str) => {
      return el.className.indexOf(str) >= 0;
    };

export default hasClass;
