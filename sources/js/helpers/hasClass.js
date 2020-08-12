import classListSupport from './classListSupport';

const hasClass = classListSupport
  ? (el, str) => el.classList.contains(str)
  : (el, str) => el.className.indexOf(str) >= 0;

export default hasClass;
