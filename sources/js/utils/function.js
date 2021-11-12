/**
 * Check is a Object
 * @param {Object} value
 * @returns {Boolean}
 */
const isObject = (value) =>
  value && typeof value === 'object' && value.constructor === Object;

/**
 * Check if is a Promise
 * https://stackoverflow.com/a/53955664/10424385
 *
 * @param {Object} value
 * @returns {Boolean}
 */
const isPromise = (value) => Boolean(value && typeof value.then === 'function');

/**
 * Set attributes to element
 *
 * @param {HTMLElement} el
 * @param {Object} object
 */
const setAttributes = (el, object) => {
  for (let key in object) {
    if (key === 'addClass') {
      el.classList.add(object[key]);
    } else if (key === 'removeClass') {
      el.classList.remove(object[key]);
    } else {
      el.setAttribute(key, object[key]);
    }
  }
};

/**
 * Get first element from child
 *
 * @param {HTMLElement} element
 * @returns {HTMLELement}
 */
const getFirstElement = (element) => element.firstElementChild || element;

/**
 * Set data from li to input
 *
 * @param {String} element
 * @param {HTMLElement} root
 * @returns {String}
 */
const getFirstElementFromLiAndAddToInput = (element, root) =>
  // get first element from li and add to input
  (root.value = getFirstElement(element).textContent.trim());

/**
 * Scroll to top result-list
 * @param {HTMLElement} resultList
 * @param {HTMLElement} resultWrap
 */
const scrollResultsToTop = (resultList, resultWrap) => {
  // if there is an overflow of ul element, after
  // opening we always move ul to the top of the results
  resultList.scrollTop = resultList.offsetTop - resultWrap.offsetHeight;
};

/**
 * Adding role, tabindex, aria and call handleMouse
 *
 * @param {HTMLElement} itemsLi
 */
const addAriaToAllLiElements = (itemsLi) => {
  // add role to all li elements
  for (let i = 0; i < itemsLi.length; i++) {
    setAttributes(itemsLi[i], {
      role: 'option',
      tabindex: '-1',
      'aria-selected': 'false',
      'aria-setsize': itemsLi.length,
      'aria-posinset': i,
    });
  }
};

/**
 * Show btn to clear data
 *
 * @param {HTMLElement} clearButton - button to clear data
 * @param {Function} destroy - destroy function
 */
const showBtnToClearData = (clearButton = false, destroy) => {
  if (!clearButton) return;

  clearButton.classList.remove('hidden');
  // add event to clear button
  clearButton.addEventListener('click', destroy);
};

/**
 * Set aria-activedescendant
 *
 * @param {HTMLElement} root - search input
 * @param {String} type
 */
const setAriaActivedescendant = (root, type) => {
  root.setAttribute('aria-activedescendant', type || '');
};

/**
 * Get height of ul without group class
 *
 * @param {String} outputUl
 * @param {String} classGroup
 * @returns {Number}
 */
const getClassGroupHeight = (outputUl, classGroup) => {
  // get height of ul without group class
  const allLi = document.querySelectorAll(
    `#${outputUl} > li:not(.${classGroup})`
  );
  let height = 0;
  [].slice.call(allLi).map((el) => (height += el.offsetHeight));

  // return height
  return height;
};

/**
 * Scroll into view when press up/down arrows
 *
 * @param {HTMLElement} target
 * @param {HTMLElement} outputUl
 * @param {String} classGroup
 * @param {HTMLElement} resultList
 */
const followActiveElement = (target, outputUl, classGroup, resultList) => {
  const previusElement = resultList.previousSibling;

  const previusElementHeight = previusElement ? previusElement.offsetHeight : 0;

  if (target.getAttribute('aria-posinset') == '0') {
    resultList.scrollTop =
      target.offsetTop - getClassGroupHeight(outputUl, classGroup);
  }

  if (target.offsetTop - previusElementHeight < resultList.scrollTop) {
    resultList.scrollTop = target.offsetTop - previusElementHeight;
  } else {
    const offsetBottom =
      target.offsetTop + target.offsetHeight - previusElementHeight;
    const scrollBottom = resultList.scrollTop + resultList.offsetHeight;
    if (offsetBottom > scrollBottom) {
      resultList.scrollTop = offsetBottom - resultList.offsetHeight;
    }
  }
};

/**
 * Create output-list and put after search input
 *
 * @param {HTMLElement} root - search input
 * @param {HTMLElement} resultList - output-list ul
 * @param {String} outputUl - id name of output-list
 * @param {HTMLElement} resultWrap - wrapper ul element
 * @param {String} prefix - add prefix to all class auto
 */
const output = (root, resultList, outputUl, resultWrap, prefix) => {
  // set attribute to results-list
  setAttributes(resultList, {
    id: outputUl,
    tabIndex: '0',
    role: 'listbox',
  });

  // add class to wrap element
  setAttributes(resultWrap, {
    addClass: `${prefix}-wrapper`,
  });

  // insert the results into the wrap element
  resultWrap.insertAdjacentElement('beforeend', resultList);

  // insert the wrap element after the search input
  root.parentNode.insertBefore(resultWrap, root.nextSibling);
};

export {
  addAriaToAllLiElements,
  followActiveElement,
  getFirstElementFromLiAndAddToInput,
  isObject,
  isPromise,
  output,
  scrollResultsToTop,
  setAriaActivedescendant,
  setAttributes,
  showBtnToClearData,
};
