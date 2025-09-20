/**
 * Check if a value is an object
 * @param {any} value
 * @returns {boolean}
 */
export const isObject = (value) =>
  value && typeof value === "object" && value.constructor === Object;

/**
 * Check if a value is a Promise
 * @param {any} value
 * @returns {boolean}
 */
export const isPromise = (value) =>
  Boolean(value && typeof value.then === "function");

/**
 * Set attributes to an element
 * @param {HTMLElement} el
 * @param {Object<string, string | number | boolean>} attributes
 */
export const setAttributes = (el, attributes) => {
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "addClass" || key === "removeClass") {
      classList(el, key === "addClass" ? "add" : "remove", value);
    } else {
      el.setAttribute(key, value);
    }
  });
};

/**
 * Get the trimmed text content of the first child element
 * @param {HTMLElement} element
 * @returns {string}
 */
export const getFirstElement = (element) =>
  (element.firstElementChild || element).textContent.trim();

/**
 * Scroll the result list to the top
 * @param {HTMLElement} resultList
 * @param {HTMLElement} resultWrap
 */
export const scrollResultsToTop = (resultList, resultWrap) => {
  resultList.scrollTop = resultList.offsetTop - resultWrap.offsetHeight;
};

/**
 * Add ARIA attributes to all list items
 * @param {NodeListOf<HTMLElement>} itemsLi
 */
export const addAriaToAllLiElements = (itemsLi) => {
  itemsLi.forEach((item, index) => {
    setAttributes(item, {
      role: "option",
      tabindex: "-1",
      "aria-selected": "false",
      "aria-setsize": itemsLi.length,
      "aria-posinset": index + 1,
    });
  });
};

/**
 * Show the clear button and attach a destroy event
 * @param {HTMLElement} clearButton
 * @param {Function} destroy
 */
export const showBtnToClearData = (clearButton, destroy) => {
  if (!clearButton) return;
  classList(clearButton, "remove", "hidden");
  onEvent(clearButton, "click", destroy);
};

/**
 * Manage class list actions
 * @param {HTMLElement} element
 * @param {"add" | "remove"} action
 * @param {string} className
 */
export const classList = (element, action, className) =>
  element.classList[action](className);

/**
 * Set the aria-activedescendant attribute
 * @param {HTMLElement} root
 * @param {string} type
 */
export const setAriaActivedescendant = (root, type) => {
  setAttributes(root, { "aria-activedescendant": type || "" });
};

/**
 * Get the height of list items excluding a specific group class
 * @param {string} outputUl
 * @param {string} classGroup
 * @returns {number}
 */
export const getClassGroupHeight = (outputUl, classGroup) => {
  const allLiElements = document.querySelectorAll(
    `#${outputUl} > li:not(.${classGroup})`,
  );
  return Array.from(allLiElements).reduce(
    (height, el) => height + el.offsetHeight,
    0,
  );
};

/**
 * Scroll the active element into view
 * @param {HTMLElement} target
 * @param {string} outputUl
 * @param {string} classGroup
 * @param {HTMLElement} resultList
 */
export const followActiveElement = (
  target,
  outputUl,
  classGroup,
  resultList,
) => {
  const previousElement = resultList.previousSibling;
  const previousElementHeight = previousElement
    ? previousElement.offsetHeight
    : 0;

  if (target.getAttribute("aria-posinset") === "0") {
    resultList.scrollTop =
      target.offsetTop - getClassGroupHeight(outputUl, classGroup);
  }

  if (target.offsetTop - previousElementHeight < resultList.scrollTop) {
    resultList.scrollTop = target.offsetTop - previousElementHeight;
  } else {
    const offsetBottom =
      target.offsetTop + target.offsetHeight - previousElementHeight;
    const scrollBottom = resultList.scrollTop + resultList.offsetHeight;
    if (offsetBottom > scrollBottom) {
      resultList.scrollTop = offsetBottom - resultList.offsetHeight;
    }
  }
};

/**
 * Create and configure the output list
 * @param {HTMLElement} root
 * @param {HTMLElement} resultList
 * @param {string} outputUl
 * @param {HTMLElement} resultWrap
 * @param {string} prefix
 */
export const output = (root, resultList, outputUl, resultWrap, prefix) => {
  setAttributes(resultList, { id: outputUl, role: "listbox" });
  setAttributes(resultWrap, { addClass: `${prefix}-results-wrapper` });
  resultWrap.insertAdjacentElement("beforeend", resultList);
  root.parentNode.insertBefore(resultWrap, root.nextSibling);
};

/**
 * Create an HTML element
 * @param {string} type
 * @returns {HTMLElement}
 */
export const createElement = (type) => document.createElement(type);

/**
 * Select an element by its selector
 * @param {string} selector
 * @returns {HTMLElement | null}
 */
export const select = (selector) => document.querySelector(selector);

/**
 * Attach an event listener to an element
 * @param {HTMLElement} element
 * @param {string} action
 * @param {Function} callback
 */
export const onEvent = (element, action, callback) => {
  element.addEventListener(action, callback);
};

/**
 * Remove an event listener from an element
 * @param {HTMLElement} element
 * @param {string} action
 * @param {Function} callback
 */
export const offEvent = (element, action, callback) => {
  element.removeEventListener(action, callback);
};

/**
 * Default ARIA attributes for active descendant
 * @param {string} id
 * @param {boolean} insertToInput - Whether text is inserted into input
 * @returns {Object<string, string>}
 */
export const ariaActiveDescendantDefault = (id, insertToInput = false) => ({
  "aria-owns": id,
  "aria-expanded": "false",
  "aria-autocomplete": insertToInput ? "both" : "list",
  role: "combobox",
  removeClass: "auto-expanded",
});
