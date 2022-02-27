import {
  addAriaToAllLiElements,
  createElement,
  followActiveElement,
  getFirstElementFromLiAndAddToInput,
  isObject,
  isPromise,
  output,
  scrollResultsToTop,
  setAriaActivedescendant,
  setAttributes,
  showBtnToClearData,
} from "./utils/function";

import keyCodes from "./utils/keyCodes";

/**
 * @class Autocomplete
 */
export default class Autocomplete {
  /**
   * Constructor
   *
   * @param {String} element
   * @param {Object} object
   */
  constructor(
    element,
    {
      delay = 500,
      clearButton = true,
      howManyCharacters = 1,
      selectFirst = false,
      insertToInput = false,
      showAllValues = false,
      cache = false,
      disableCloseOnSelect = false,
      classGroup,
      classPreventClosing,
      classPrefix,
      ariaLabelClear,
      onSearch,
      onResults = () => {},
      onSubmit = () => {},
      onOpened = () => {},
      onReset = () => {},
      onRender = () => {},
      onClose = () => {},
      noResults = () => {},
      onSelectedItem = () => {},
    }
  ) {
    this._id = element;
    this._root = document.getElementById(element);
    this._onSearch = isPromise(onSearch)
      ? onSearch
      : ({ currentValue, element }) =>
          Promise.resolve(onSearch({ currentValue, element }));
    this._onResults = onResults;
    this._onRender = onRender;
    this._onSubmit = onSubmit;
    this._onSelected = onSelectedItem;
    this._onOpened = onOpened;
    this._onReset = onReset;
    this._noResults = noResults;
    this._onClose = onClose;

    this._delay = delay;
    this._characters = howManyCharacters;
    this._clearButton = clearButton;
    this._selectFirst = selectFirst;
    this._toInput = insertToInput;
    this._showAll = showAllValues;
    this._classGroup = classGroup;
    this._prevClosing = classPreventClosing;
    this._clearBtnAriLabel = ariaLabelClear
      ? ariaLabelClear
      : "clear the search query";
    this._prefix = classPrefix ? `${classPrefix}-auto` : "auto";
    this._disable = disableCloseOnSelect;

    // default config
    this._cache = cache;
    this._outputUl = `${this._prefix}-${this._id}-results`;
    this._cacheData = `data-cache-auto-${this._id}`;
    this._isLoading = `${this._prefix}-is-loading`;
    this._isActive = `${this._prefix}-is-active`;
    this._activeList = `${this._prefix}-selected`;
    this._selectedOption = `${this._prefix}-selected-option`;
    this._err = `${this._prefix}-error`;
    this._regex = /[|\\{}()[\]^$+*?.]/g;
    this._timeout = null;

    this._resultWrap = createElement("div");
    this._resultList = createElement("ul");
    this._cBtn = createElement("button");

    this._initial();
  }

  /**
   * Initial function
   */
  _initial = () => {
    this._clearbutton();

    output(
      this._root,
      this._resultList,
      this._outputUl,
      this._resultWrap,
      this._prefix
    );

    // default aria
    // this.reset();
    this._root.addEventListener("input", this._handleInput);

    // show all values on click root input
    this._showAll && this._root.addEventListener("click", this._handleInput);

    // calback functions
    this._onRender({
      element: this._root,
      results: this._resultList,
    });
  };

  /**
   * Actions on input
   *
   * @param {String} type - set attribute depending on type
   * @param {String} target
   */
  _cacheAct = (type, target) => {
    if (!this._cache) return;

    if (type === "update") {
      this._root.setAttribute(this._cacheData, target.value);
    } else if (type === "remove") {
      this._root.removeAttribute(this._cacheData);
    } else {
      this._root.value = this._root.getAttribute(this._cacheData);
    }
  };

  /**
   * Handle input
   *
   * @param {Event} object
   */
  _handleInput = ({ target, type }) => {
    if (
      this._root.getAttribute("aria-expanded") === "true" &&
      type === "click"
    ) {
      return;
    }

    // replace all special characters
    const regex = target.value.replace(this._regex, "\\$&");

    // update data attribute cache
    this._cacheAct("update", target);

    const delay = this._showAll ? 0 : this._delay;
    // clear timeout
    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => {
      this._searchItem(regex.trim());
    }, delay);
  };

  /**
   * Default aria
   */
  _reset = () => {
    // set attributes to root - input
    setAttributes(this._root, {
      "aria-owns": `${this._id}-list`,
      "aria-expanded": "false",
      "aria-autocomplete": "list",
      "aria-activedescendant": "",
      role: "combobox",
      removeClass: "auto-expanded",
    });

    // remove class isActive
    this._resultWrap.classList.remove(this._isActive);

    // move the view item to the first item
    // this.resultList.scrollTop = 0;
    // scrollResultsToTop(this.resultList, this.resultWrap);

    // remove result when lengh = 0 and insertToInput is false
    if ((this._matches?.length == 0 && !this._toInput) || this._showAll) {
      this._resultList.innerHTML = "";
    }

    // set index
    this._index = this._selectFirst ? 0 : -1;

    // callback function
    this._onClose();
  };

  /**
   * The async function gets the text from the search
   * and returns the matching array
   *
   * @param {String} value
   */
  _searchItem = (value) => {
    this._value = value;

    // if searching show loading icon
    this._onLoading(true);

    // hide button clear
    showBtnToClearData(this._cBtn, this.destroy);

    // if there is no value and clearButton is true
    if (value.length == 0 && this._clearButton) {
      this._cBtn.classList.add("hidden");
    }

    // if declare characters more then value.len and showAll is false
    // remove class isActive
    if (this._characters > value.length && !this._showAll) {
      this._onLoading();
      return;
    }

    // callblack function onSearch
    this._onSearch({ currentValue: value, element: this._root })
      .then((result) => {
        const rootValueLength = this._root.value.length;
        const resultLength = result.length;
        // set no result
        this._matches = Array.isArray(result)
          ? [...result]
          : JSON.parse(JSON.stringify(result));

        this._onLoading();
        this._error();

        // if use destroy() method
        if (resultLength == 0 && rootValueLength == 0) {
          this._cBtn.classList.add("hidden");
        }

        if (resultLength == 0 && rootValueLength) {
          this._root.classList.remove("auto-expanded");
          this._reset();
          this._noResults({
            element: this._root,
            currentValue: value,
            template: this._results,
          });
          this._events();
        } else if (resultLength > 0 || isObject(result)) {
          this._index = this._selectFirst ? 0 : -1;
          this._results();
          this._events();
        }
      })
      .catch(() => {
        this._onLoading();
        this._reset();
      });
  };

  /**
   * Set or remove loading class
   *
   * @param {Boolean} type
   */
  _onLoading = (type) =>
    this._root.parentNode.classList[type ? "add" : "remove"](this._isLoading);

  /**
   * Set error class to the root element
   */
  _error = () => this._root.classList.remove(this._err);

  /**
   * Events
   */
  _events = () => {
    // handle click on keydown [up, down, enter, tab, esc]
    this._root.addEventListener("keydown", this._handleKeys);

    //
    this._root.addEventListener("click", this._handleShowItems);

    // temporarily disabled mouseleave
    ["mousemove", "click"].map((eventType) => {
      this._resultList.addEventListener(eventType, this._handleMouse);
    });

    // close expanded items
    document.addEventListener("click", this._handleDocClick);
  };

  /**
   * Results
   *
   * @param {HTMLElement|String} template - html or string returned from the function,
   * look at the example - https://github.com/tomik23/autocomplete/blob/master/docs/js/examples/no-results.js#L30
   */
  _results = (template) => {
    // set attribute to root
    setAttributes(this._root, {
      "aria-expanded": "true",
      addClass: `${this._prefix}-expanded`,
    });

    // add all found records to otput ul
    this._resultList.innerHTML =
      this._matches.length === 0
        ? this._onResults({
            currentValue: this._value,
            matches: 0,
            template,
          })
        : this._onResults({
            currentValue: this._value,
            matches: this._matches,
            classGroup: this._classGroup,
          });

    this._resultWrap.classList.add(this._isActive);

    const checkIfClassGroupExist = this._classGroup
      ? `:not(.${this._classGroup})`
      : "";

    this._itemsLi = document.querySelectorAll(
      `#${this._outputUl} > li${checkIfClassGroupExist}`
    );

    // adding role, tabindex and aria
    addAriaToAllLiElements(this._itemsLi);

    // action on open results
    this._onOpened({
      type: "results",
      element: this._root,
      results: this._resultList,
    });

    // select first element
    this._selectFirstEl();

    // move the view item to the first item
    // this.resultList.scrollTop = 0;
    scrollResultsToTop(this._resultList, this._resultWrap);
  };

  /**
   * Hangle click on document
   *
   * @param {Event} object
   */
  _handleDocClick = ({ target }) => {
    let disableClose = null;

    // if 'target' is a ul and 'disableCloseOnSelect'
    // is a 'true' set 'disableClose' on true
    if (
      (target.closest("ul") && this._disable) ||
      // when class classDisableClose
      // then do not not close results
      target.closest(`.${this._prevClosing}`)
    ) {
      disableClose = true;
    }

    if (target.id !== this._id && !disableClose) {
      this._reset();
      return;
    }
  };

  /**
   * Select first element
   */
  _selectFirstEl = () => {
    this._remAria(document.querySelector(`.${this._activeList}`));

    if (!this._selectFirst) {
      return;
    }

    const { firstElementChild } = this._resultList;

    const classSelectFirst =
      this._classGroup && this._matches.length > 0 && this._selectFirst
        ? firstElementChild.nextElementSibling
        : firstElementChild;

    // calback function onSelect when first element is true
    this._onSelected({
      index: this._index,
      element: this._root,
      object: this._matches[this._index],
    });

    // set attribute to first element
    setAttributes(classSelectFirst, {
      id: `${this._selectedOption}-0`,
      addClass: this._activeList,
      "aria-selected": "true",
    });

    // set aria active descendant
    setAriaActivedescendant(this._root, `${this._selectedOption}-0`);
  };

  /**
   * show items when items.length > 0 and is not empty
   */
  _handleShowItems = () => {
    // if resultWrap is not active and resultList is not empty
    if (
      this._resultList.textContent.length > 0 &&
      !this._resultWrap.classList.contains(this._isActive)
    ) {
      // set attribute to root
      setAttributes(this._root, {
        "aria-expanded": "true",
        addClass: `${this._prefix}-expanded`,
      });

      // add isActive class to resultWrap
      this._resultWrap.classList.add(this._isActive);

      // move the view item to the first item
      // this.resultList.scrollTop = 0;
      scrollResultsToTop(this._resultList, this._resultWrap);

      // select first element
      this._selectFirstEl();

      // callback function
      this._onOpened({
        type: "showItems",
        element: this._root,
        results: this._resultList,
      });
    }
  };

  /**
   * Adding text from the list when li is clicking
   * or adding aria-selected to li elements
   *
   * @param {Event} event
   */
  _handleMouse = (event) => {
    event.preventDefault();

    const { target, type } = event;
    const targetClosest = target.closest("li");
    const targetClosestRole = targetClosest?.hasAttribute("role");
    const activeClass = this._activeList;
    const activeClassElement = document.querySelector(`.${activeClass}`);

    if (!targetClosest || !targetClosestRole) {
      return;
    }

    // click on li get element
    if (type === "click") {
      // get text from clicked li
      this._getTextFromLi(targetClosest);
    }

    if (
      type === "mousemove" &&
      !targetClosest.classList.contains(activeClass)
    ) {
      this._remAria(activeClassElement);

      // add aria to li
      this._setAria(targetClosest);
      this._index = this._indexLiSelected(targetClosest);

      this._onSelected({
        index: this._index,
        element: this._root,
        object: this._matches[this._index],
      });
    }
  };

  /**
   * Get text from li on enter or click
   *
   * @param {HTMLElement} element
   */
  _getTextFromLi = (element) => {
    if (!element || this._matches.length === 0) {
      // set default settings
      !this._disable && this._reset();

      return;
    }

    // get first element from li and set it to root
    getFirstElementFromLiAndAddToInput(element, this._root);

    // onSubmit passing text to function
    this._onSubmit({
      index: this._index,
      element: this._root,
      object: this._matches[this._index],
      results: this._resultList,
    });

    // set default settings
    if (!this._disable) {
      this._remAria(element);
      this._reset();
    }

    // show clearBtn when select element
    this._clearButton && this._cBtn.classList.remove("hidden");

    // remove cache
    this._cacheAct("remove");
  };

  /**
   * Return which li element was selected
   * by hovering the mouse over
   *
   * @param {HTMLElement} target
   * @returns {Number}
   */
  _indexLiSelected = (target) =>
    // get index of li element
    Array.prototype.indexOf.call(this._itemsLi, target);

  /**
   * Navigating the elements li and enter
   *
   * @param {Event} event
   */
  _handleKeys = (event) => {
    const { keyCode } = event;

    const resultList = this._resultWrap.classList.contains(this._isActive);

    const matchesLength = this._matches.length + 1;
    this._selectedLi = document.querySelector(`.${this._activeList}`);

    // switch between keys
    switch (keyCode) {
      case keyCodes.UP:
      case keyCodes.DOWN:
        // Wrong cursor position in the input field #62
        // Prevents the cursor from moving to the beginning
        // of input as the cursor hovers over the results.
        event.preventDefault();

        if ((matchesLength <= 1 && this._selectFirst) || !resultList) {
          return;
        }

        // if keyCode is up
        if (keyCode === keyCodes.UP) {
          if (this._index < 0) {
            this._index = matchesLength - 1;
          }
          this._index -= 1;
        } else {
          this._index += 1;
          if (this._index >= matchesLength) {
            this._index = 0;
          }
        }

        // remove aria-selected
        this._remAria(this._selectedLi);

        if (
          matchesLength > 0 &&
          this._index >= 0 &&
          this._index < matchesLength - 1
        ) {
          // callback function
          this._onSelected({
            index: this._index,
            element: this._root,
            object: this._matches[this._index],
          });

          // set aria-selected
          this._setAria(this._itemsLi[this._index]);
          if (this._toInput && resultList) {
            getFirstElementFromLiAndAddToInput(
              this._itemsLi[this._index],
              this._root
            );
          }
        } else {
          // catch action
          this._cacheAct();
          setAriaActivedescendant(this._root);
        }

        break;
      // keycode enter
      case keyCodes.ENTER:
        this._getTextFromLi(this._selectedLi);
        break;

      // keycode escape and keycode tab
      case keyCodes.TAB:
      case keyCodes.ESC:
        event.stopPropagation(); // #120
        this._reset();

        break;
      default:
        break;
    }
  };

  /**
   * Set aria label on item li
   *
   * @param {HTMLElement} target
   */
  _setAria = (target) => {
    const selectedOption = `${this._selectedOption}-${this._indexLiSelected(
      target
    )}`;

    // set aria to li
    setAttributes(target, {
      id: selectedOption,
      "aria-selected": "true",
      addClass: this._activeList,
    });

    setAriaActivedescendant(this._root, selectedOption);

    // scrollIntoView when press up/down arrows
    followActiveElement(
      target,
      this._outputUl,
      this._classGroup,
      this._resultList
    );
  };

  /**
   * Remove aria label from item li
   *
   * @param {HTMLElement} element
   */
  _remAria = (element) => {
    if (!element) return;

    // remove aria from li
    setAttributes(element, {
      id: "",
      removeClass: this._activeList,
      "aria-selected": "false",
    });
  };

  /**
   * Create clear button and
   * removing text from the input field
   */
  _clearbutton = () => {
    // stop when clear button is disabled
    if (!this._clearButton) return;

    // add aria to clear button
    setAttributes(this._cBtn, {
      class: `${this._prefix}-clear hidden`,
      type: "button",
      title: this._clearBtnAriLabel,
      "aria-label": this._clearBtnAriLabel,
    });

    // insert clear button after input - root
    this._root.insertAdjacentElement("afterend", this._cBtn);
  };

  /**
   * Clicking on the clear button
   * publick destroy method
   */
  destroy = () => {
    // if clear button is true then add class hidden
    this._clearButton && this._cBtn.classList.add("hidden");
    // clear value searchId
    this._root.value = "";
    // set focus
    this._root.focus();
    // remove li from ul
    this._resultList.textContent = "";
    // set default aria
    this._reset();
    // remove error if exist
    this._error();

    // callback function
    this._onReset(this._root);

    // remove listener
    this._root.removeEventListener("keydown", this._handleKeys);
    this._root.removeEventListener("click", this._handleShowItems);
    // remove listener on click on document
    document.removeEventListener("click", this._handleDocClick);
  };
}
