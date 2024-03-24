/**
 * Check is a Object
 * @param {Object} value
 * @returns {Boolean}
 */
export const isObject = (value) =>
  value && typeof value === "object" && value.constructor === Object;

/**
 * Check if is a Promise
 * https://stackoverflow.com/a/53955664/10424385
 *
 * @param {Object} value
 * @returns {Boolean}
 */
export const isPromise = (value) =>
  Boolean(value && typeof value.then === "function");

/**
 * Set attributes to element
 *
 * @param {HTMLElement} el
 * @param {Object} object
 */
export const setAttributes = (el, object) => {
  for (let key in object) {
    if (key === "addClass") {
      classList(el, "add", object[key]);
    } else if (key === "removeClass") {
      classList(el, "remove", object[key]);
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
export const getFirstElement = (element) =>
  (element.firstElementChild || element).textContent.trim();

/**
 * Scroll to top result-list
 * @param {HTMLElement} resultList
 * @param {HTMLElement} resultWrap
 */
export const scrollResultsToTop = (resultList, resultWrap) => {
  // if there is an overflow of ul element, after
  // opening we always move ul to the top of the results
  resultList.scrollTop = resultList.offsetTop - resultWrap.offsetHeight;
};

/**
 * Adding role, tabindex, aria and call handleMouse
 *
 * @param {HTMLElement} itemsLi
 */
export const addAriaToAllLiElements = (itemsLi) => {
  // add role to all li elements
  for (let i = 0; i < itemsLi.length; i++) {
    setAttributes(itemsLi[i], {
      role: "option",
      tabindex: "-1",
      "aria-selected": "false",
      "aria-setsize": itemsLi.length,
      // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-posinset
      "aria-posinset": i + 1,
    });
  }
};

/**
 * Show btn to clear data
 *
 * @param {HTMLElement} clearButton - button to clear data
 * @param {Function} destroy - destroy function
 */
export const showBtnToClearData = (clearButton = false, destroy) => {
  if (!clearButton) return;

  classList(clearButton, "remove", "hidden");
  // add event to clear button
  onEvent(clearButton, "click", destroy);
};

/**
 * ClassList add/remove/contains
 *
 * @param {HTMLElement} element - html element
 * @param {String} action - add/remove/contains
 * @param {String} className - class name
 */
export const classList = (element, action, className) =>
  element.classList[action](className);

/**
 * Set aria-activedescendant
 *
 * @param {HTMLElement} root - search input
 * @param {String} type
 */
export const setAriaActivedescendant = (root, type) => {
  setAttributes(root, {
    "aria-activedescendant": type || "",
  });
};

/**
 * Get height of ul without group class
 *
 * @param {String} outputUl
 * @param {String} classGroup
 * @returns {Number}
 */
export const getClassGroupHeight = (outputUl, classGroup) => {
  // get height of ul without group class
  const allLiElements = document.querySelectorAll(
    `#${outputUl} > li:not(.${classGroup})`,
  );
  let height = 0;
  [].slice.call(allLiElements).map((el) => (height += el.offsetHeight));

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
export const followActiveElement = (
  target,
  outputUl,
  classGroup,
  resultList,
) => {
  const previusElement = resultList.previousSibling;

  const previusElementHeight = previusElement ? previusElement.offsetHeight : 0;

  if (target.getAttribute("aria-posinset") == "0") {
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
export const output = (root, resultList, outputUl, resultWrap, prefix) => {
  // set attribute to results-list
  setAttributes(resultList, {
    id: outputUl,
    tabIndex: "0",
    role: "listbox",
  });

  // add class to wrap element
  setAttributes(resultWrap, {
    addClass: `${prefix}-results-wrapper`,
  });

  // insert the results into the wrap element
  resultWrap.insertAdjacentElement("beforeend", resultList);

  // insert the wrap element after the search input
  root.parentNode.insertBefore(resultWrap, root.nextSibling);
};

/**
 * Create element
 *
 * @param {String} type - type of element
 * @returns {HTMLDivElement}
 */
export const createElement = (type) => document.createElement(type);

/**
 * Get element
 *
 * @param {String} element
 * @returns {HTMLElement}
 */
export const select = (element) => document.querySelector(element);

/**
 * Event listeners
 *
 * @param {HTMLElement} element
 * @param {String} action
 * @param {Function} callback
 */
export const onEvent = (element, action, callback) => {
  element.addEventListener(action, callback);
};

/**
 * Remove event listeners
 *
 * @param {HTMLElement} element
 * @param {String} action
 * @param {Function} callback
 */
export const offEvent = (element, action, callback) => {
  element.removeEventListener(action, callback);
};

/**
 * Add event listeners to all elements
 *
 * @param {HTMLElement} id
 *
 */
export const ariaActiveDescendantDefault = (id) => {
  return {
    "aria-owns": id,
    "aria-expanded": "false",
    "aria-autocomplete": "list",
    role: "combobox",
    removeClass: "auto-expanded",
  };
};
