import {
  addAriaToAllLiElements,
  classList,
  createElement,
  followActiveElement,
  getFirstElement,
  isObject,
  isPromise,
  offEvent,
  onEvent,
  output,
  scrollResultsToTop,
  select,
  setAriaActivedescendant,
  setAttributes,
  showBtnToClearData,
  ariaActiveDescendantDefault,
} from "./utils/function";

import KEY_CODES from "./utils/keyCodes";

/**
 * @typedef {Object} RegexConfig
 * @property {RegExp} expression - Regular expression for matching.
 * @property {string} replacement - Replacement string for matches.
 */

/**
 * @typedef {Object} AutocompleteOptions
 * @property {number} [delay=500] - Delay in milliseconds before searching.
 * @property {boolean} [clearButton=true] - Whether to show a clear button.
 * @property {boolean} [clearButtonOnInitial=false] - Show clear button initially.
 * @property {number} [howManyCharacters=1] - Minimum characters to trigger search.
 * @property {boolean} [selectFirst=false] - Automatically select the first result.
 * @property {boolean} [insertToInput=false] - Insert selected value into input.
 * @property {boolean} [showValuesOnClick=false] - Show all values on input click.
 * @property {boolean} [inline=false] - Inline mode for autocomplete.
 * @property {boolean} [cache=false] - Enable caching of results.
 * @property {boolean} [disableCloseOnSelect=false] - Prevent closing on selection.
 * @property {boolean} [preventScrollUp=false] - Prevent scrolling to the top.
 * @property {boolean} [removeResultsWhenInputIsEmpty=false] - Remove results when input is empty.
 * @property {RegexConfig} [regex] - Configuration for regex matching.
 * @property {string} [classGroup] - CSS class for grouping results.
 * @property {string} [classPreventClosing] - CSS class to prevent closing.
 * @property {string} [classPrefix] - Prefix for CSS classes.
 * @property {string} [ariaLabelClear] - ARIA label for the clear button.
 * @property {Function} onSearch - Callback for search.
 * @property {Function} [onResults] - Callback for rendering results.
 * @property {Function} [onSubmit] - Callback for submitting a result.
 * @property {Function} [onOpened] - Callback when results are opened.
 * @property {Function} [onReset] - Callback when reset is triggered.
 * @property {Function} [onRender] - Callback for rendering the component.
 * @property {Function} [onClose] - Callback when results are closed.
 * @property {Function} [noResults] - Callback when no results are found.
 * @property {Function} [onSelectedItem] - Callback when an item is selected.
 */

/**
 * @class Autocomplete
 */
export default class Autocomplete {
  /**
   * Constructor
   *
   * @param {string} element - ID of the root element.
   * @param {AutocompleteOptions} object - Configuration options.
   */
  constructor(
    element,
    {
      delay = 500,
      clearButton = true,
      clearButtonOnInitial = false,
      howManyCharacters = 1,
      selectFirst = false,
      insertToInput = false,
      showValuesOnClick = false,
      inline = false,
      cache = false,
      disableCloseOnSelect = false,
      preventScrollUp = false,
      removeResultsWhenInputIsEmpty = false,
      regex = { expression: /[|\\{}()[\]^$+*?]/g, replacement: "\\$&" },
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
    },
  ) {
    /** @type {string} */
    this._id = element;
    /** @type {HTMLElement} */
    this._root = document.getElementById(element);
    /** @type {Function} */
    this._onSearch = isPromise(onSearch)
      ? onSearch
      : ({ currentValue, element }) =>
          Promise.resolve(onSearch({ currentValue, element }));
    /** @type {Function} */
    this._onResults = onResults;
    /** @type {Function} */
    this._onRender = onRender;
    /** @type {Function} */
    this._onSubmit = onSubmit;
    /** @type {Function} */
    this._onSelected = onSelectedItem;
    /** @type {Function} */
    this._onOpened = onOpened;
    /** @type {Function} */
    this._onReset = onReset;
    /** @type {Function} */
    this._noResults = noResults;
    /** @type {Function} */
    this._onClose = onClose;
    /** @type {number} */
    this._delay = delay;
    /** @type {number} */
    this._characters = howManyCharacters;
    /** @type {boolean} */
    this._clearButton = clearButton;
    /** @type {boolean} */
    this._clearButtonOnInitial = clearButtonOnInitial;
    /** @type {boolean} */
    this._selectFirst = selectFirst;
    /** @type {boolean} */
    this._toInput = insertToInput;
    /** @type {boolean} */
    this._showValuesOnClick = showValuesOnClick;
    /** @type {boolean} */
    this._inline = inline;
    /** @type {string|undefined} */
    this._classGroup = classGroup;
    /** @type {string|undefined} */
    this._prevClosing = classPreventClosing;
    /** @type {string} */
    this._clearBtnAriLabel = ariaLabelClear
      ? ariaLabelClear
      : "clear the search query";
    /** @type {string} */
    this._prefix = classPrefix ? `${classPrefix}-auto` : "auto";
    /** @type {boolean} */
    this._disable = disableCloseOnSelect;
    /** @type {boolean} */
    this._preventScrollUp = preventScrollUp;
    /** @type {boolean} */
    this._removeResultsWhenInputIsEmpty = removeResultsWhenInputIsEmpty;

    // default config
    /** @type {boolean} */
    this._cache = cache;
    /** @type {number|null} */
    this._timeout = null;
    /** @type {string} */
    this._outputUl = `${this._prefix}-${this._id}-results`;
    /** @type {string} */
    this._cacheData = `data-cache-auto-${this._id}`;
    /** @type {string} */
    this._isLoading = `${this._prefix}-is-loading`;
    /** @type {string} */
    this._isActive = `${this._prefix}-is-active`;
    /** @type {string} */
    this._activeList = `${this._prefix}-selected`;
    /** @type {string} */
    this._selectedOption = `${this._prefix}-selected-option`;
    /** @type {string} */
    this._err = `${this._prefix}-error`;
    /** @type {HTMLElement} */
    this._resultWrap = createElement("div");
    /** @type {HTMLElement} */
    this._resultList = createElement("ul");
    /** @type {HTMLElement} */
    this._clearBtn = createElement("button");

    // ----------------------------------------
    // regex

    /** @type {RegexConfig} */
    this._regex = {
      ...{ expression: /[|\\{}()[\]^$+*?]/g, replacement: "\\$&" },
      ...regex,
    };
    // if regex is don't have replacement then set default
    if (!this._regex.replacement) {
      this._regex.replacement = this._defaultExpression.replacement;
    }

    // if regex is don't have expression then set default
    if (!this._regex.expression) {
      this._regex.expression = this._defaultExpression.expression;
    }

    // ----------------------------------------

    this._initial();

    // Internal flag to prevent re-adding ARIA when component is disabled
    /** @type {boolean} */
    this._isComponentDisabled = false;
  }

  /**
   * Initial function
   */
  _initial = () => {
    this._clearbutton();

    const ariaAcrivedescentDefault = ariaActiveDescendantDefault(
      this._outputUl,
      this._toInput,
    );
    setAttributes(this._root, ariaAcrivedescentDefault);

    output(
      this._root,
      this._resultList,
      this._outputUl,
      this._resultWrap,
      this._prefix,
    );

    // default aria
    onEvent(this._root, "input", this._handleInput);

    // show all values on click root input
    this._showValuesOnClick && onEvent(this._root, "click", this._handleInput);

    // show all values
    if (this._inline) {
      const config = { root: this._root, type: "load" };
      onEvent(this._root, "load", this._handleInput(config));
    }

    // calback functions
    this._onRender({
      element: this._root,
      results: this._resultList,
    });

    // show clear button if
    if (this._clearButtonOnInitial) {
      showBtnToClearData(this._clearBtn, this.destroy);
    }
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
      this._root.setAttribute(this._cacheData, target?.value);
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

    // if inline is true then set root to target
    target = this._inline ? this._root : target;
    // replace all special characters
    const regex = target?.value.replace(
      this._regex.expression,
      this._regex.replacement,
    );

    // update data attribute cache
    this._cacheAct("update", target);

    const delay =
      this._showValuesOnClick || (this._inline && type === "load")
        ? 0
        : this._delay;

    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => {
      // removeResultsWhenInputIsEmpty
      // remove results when input is empty
      if (this._removeResultsWhenInputIsEmpty) {
        if (target?.value.length === 0) {
          this.destroy();
          return;
        }
      }

      this._searchItem(regex?.trim());
    }, delay);
  };

  /**
   * Default aria
   */
  _reset = () => {
    if (this._isComponentDisabled) {
      // ensure list wrapper inactive and do nothing else
      classList(this._resultWrap, "remove", this._isActive);
      return;
    }
    // remove class isActive
    classList(this._resultWrap, "remove", this._isActive);

    const ariaAcrivedescentDefault = ariaActiveDescendantDefault(
      this._outputUl,
      this._toInput,
    );

    const ariaAcrivedescent = this._preventScrollUp
      ? ariaAcrivedescentDefault
      : { ...ariaAcrivedescentDefault, "aria-activedescendant": "" };

    // set attributes to root - input
    setAttributes(this._root, ariaAcrivedescent);

    if (!this._preventScrollUp) {
      // set default aria-selected, remove id and remove class 'auto-selected'
      this._removeAria(select(`.${this._activeList}`));

      // set index
      this._index = this._selectFirst ? 0 : -1;
    }

    // remove result when lengh = 0 and insertToInput is false
    // https://github.com/tomickigrzegorz/autocomplete/issues/136
    if (
      (this._matches?.length == 0 && !this._toInput) ||
      this._showValuesOnClick
    ) {
      this._resultList.textContent = "";
    }

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
    showBtnToClearData(this._clearBtn, this.destroy);

    // if there is no value and clearButton is true
    if (
      (!value || value?.length === 0) &&
      this._clearButton &&
      !this._clearButtonOnInitial
    ) {
      classList(this._clearBtn, "add", "hidden");
    }

    // if declare characters more then value.len and showAll is false
    // remove class isActive
    if (
      this._characters > value?.length &&
      !this._showValuesOnClick &&
      !this._inline
    ) {
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
          ? result
          : JSON.parse(JSON.stringify(result));

        this._onLoading();
        this._error();

        // if use destroy() method
        if (resultLength === 0 && rootValueLength === 0) {
          classList(this._clearBtn, "add", "hidden");
        }

        if (resultLength === 0 && rootValueLength) {
          classList(this._root, "remove", "auto-expanded");
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
  _error = () => classList(this._root, "remove", this._err);

  /**
   * Events
   */
  _events = () => {
    // handle click on keydown [up, down, enter, tab, esc]
    onEvent(this._root, "keydown", this._handleKeys);

    onEvent(this._root, "click", this._handleShowItems);

    // close expanded items
    if (!this._inline) {
      onEvent(document, "click", this._handleDocClick);
    }

    // temporarily disabled mouseleave
    ["mousemove", "click"].map((eventType) => {
      onEvent(this._resultList, eventType, this._handleMouse);
    });
  };

  /**
   * Results
   *
   * @param {HTMLElement|String} template - html or string returned from the function,
   * look at the example - https://github.com/tomickigrzegorz/autocomplete/blob/master/docs/js/examples/no-results.js#L30
   */
  _results = (template) => {
    // set attribute to root
    setAttributes(this._root, {
      "aria-expanded": "true",
      addClass: `${this._prefix}-expanded`,
    });

    // clear result list
    this._resultList.textContent = "";

    // add all found records to otput ul
    const dataResults =
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

    // add data to ul
    this._resultList.insertAdjacentHTML("afterbegin", dataResults);

    // add class isActive
    classList(this._resultWrap, "add", this._isActive);

    const checkIfClassGroupExist = this._classGroup
      ? `:not(.${this._classGroup})`
      : "";

    this._itemsLi = document.querySelectorAll(
      `#${this._outputUl} > li${checkIfClassGroupExist}`,
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
    this._selectFirstElement();

    // move the view item to the first item
    // this.resultList.scrollTop = 0;
    // if (this._preventScrollUp) return;
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
  _selectFirstElement = () => {
    this._removeAria(select(`.${this._activeList}`));

    if (!this._selectFirst) {
      return;
    }

    const { firstElementChild } = this._resultList;

    const classSelectFirst =
      this._classGroup && this._matches.length > 0 && this._selectFirst
        ? firstElementChild.nextElementSibling
        : firstElementChild;

    // Insert text to input if insertToInput is true and selectFirst is true
    // this._root.value = getFirstElement(classSelectFirst);

    // if (this._toInput && classSelectFirst) {
    //   this._root.value = getFirstElement(classSelectFirst);
    //   Show clear button if enabled
    //   this._clearButton && classList(this._clearBtn, "remove", "hidden");
    // }

    // calback function onSelect when first element is true
    this._onSelected({
      index: this._index,
      element: this._root,
      object: this._matches[this._index],
      currentValue: this._root.value,
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
      !classList(this._resultWrap, "contains", this._isActive)
    ) {
      // set attribute to root
      setAttributes(this._root, {
        "aria-expanded": "true",
        addClass: `${this._prefix}-expanded`,
      });

      // add isActive class to resultWrap
      classList(this._resultWrap, "add", this._isActive);

      // move the view item to the first item
      // this.resultList.scrollTop = 0;
      if (!this._preventScrollUp) {
        scrollResultsToTop(this._resultList, this._resultWrap);
        // select first element
        this._selectFirstElement();
      }

      // callback function
      this._onOpened({
        type: "showItems",
        element: this._root,
        results: this._resultList,
      });

      if (!this._cache) return;
      this._cacheAct("update", this._root);
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
    const activeClassElement = select(`.${activeClass}`);

    if (
      !targetClosest ||
      !targetClosestRole ||
      target.closest(`.${this._prevClosing}`)
    ) {
      return;
    }

    if (type === "click") {
      // click on li get element
      // get text from clicked li
      this._getTextFromLi(targetClosest);
    }

    if (
      type === "mousemove" &&
      !classList(targetClosest, "contains", activeClass)
    ) {
      this._removeAria(activeClassElement);

      // add aria to li
      this._setAria(targetClosest);
      this._index = this._indexLiSelected(targetClosest);

      // Insert text to input on mouse hover if insertToInput is true
      if (this._toInput) {
        this._root.value = getFirstElement(targetClosest);
      }

      this._onSelected({
        index: this._index,
        element: this._root,
        object: this._matches[this._index],
      });

      if (this._root.value.length > 0) {
        this._clearButton && classList(this._clearBtn, "remove", "hidden");
      }
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

    // show clearBtn when select element
    this._clearButton && classList(this._clearBtn, "remove", "hidden");

    // get first element from li and set it to root
    this._root.value = getFirstElement(element);

    // onSubmit passing text to function
    this._onSubmit({
      index: this._index,
      element: this._root,
      object: this._matches[this._index],
      results: this._resultList,
    });

    // set default settings
    if (!this._disable) {
      if (!this._preventScrollUp) {
        this._removeAria(element);
      }
      this._reset();
    }

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

    const resultList = classList(this._resultWrap, "contains", this._isActive);

    const matchesLength = this._matches.length + 1;
    this._selectedLi = select(`.${this._activeList}`);

    // switch between keys
    switch (keyCode) {
      case KEY_CODES.UP:
      case KEY_CODES.DOWN:
        // Wrong cursor position in the input field #62
        // Prevents the cursor from moving to the beginning
        // of input as the cursor hovers over the results.
        event.preventDefault();

        if ((matchesLength <= 1 && this._selectFirst) || !resultList) {
          return;
        }

        // if keyCode is up
        if (keyCode === KEY_CODES.UP) {
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
        this._removeAria(this._selectedLi);

        if (this._index >= 0 && this._index < matchesLength - 1) {
          const selectedElement = this._itemsLi[this._index];

          if (this._toInput && resultList) {
            this._root.value = getFirstElement(selectedElement);

            this._clearButton && classList(this._clearBtn, "remove", "hidden");
          }

          // callback function
          this._onSelected({
            index: this._index,
            element: this._root,
            object: this._matches[this._index],
          });

          // set aria-selected
          this._setAria(selectedElement);
        } else {
          // catch action
          this._cacheAct();
          setAriaActivedescendant(this._root);

          this._onSelected({
            index: null,
            element: this._root,
            object: null,
          });
        }

        break;
      // keycode enter
      case KEY_CODES.ENTER:
        // https:github.com/tomickigrzegorz/autocomplete/issues/145
        event.preventDefault();

        this._getTextFromLi(this._selectedLi);
        break;

      // keycode escape and keycode tab
      case KEY_CODES.TAB:
      case KEY_CODES.ESC:
        event.stopPropagation();
        if (!this._inline) {
          this._reset();
        }
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
      target,
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
      this._resultList,
    );
  };

  /**
   * Remove aria label from item li
   *
   * @param {HTMLElement} element
   */
  _removeAria = (element) => {
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
    if (!this._clearButton) return;
    setAttributes(this._clearBtn, {
      type: "button",
      class: `${this._prefix}-clear hidden`,
      title: this._clearBtnAriLabel,
      "aria-label": this._clearBtnAriLabel,
    });
    this._root.insertAdjacentElement("afterend", this._clearBtn);
  };

  /**
   * Rerender rows without remove root input and close elements
   * @param {String} inputValue
   */
  rerender = (inputValue) => {
    const text = inputValue?.trim() ? inputValue.trim() : this._root.value;
    if (inputValue?.trim()) {
      this._root.value = inputValue.trim();
      this._cacheAct("update", this._root);
    }
    const regexText = text.replace(
      this._regex.expression,
      this._regex.replacement,
    );
    this._searchItem(regexText.trim());
  };

  /**
   * Disable autocomplete functionality
   * Use this when you want to disable autocomplete but keep the selected value
   * @param {boolean} clearInput - If true, clears the input value, if false keeps it
   */
  disable = (clearInput = false) => {
    this._isComponentDisabled = true;
    clearTimeout(this._timeout);
    // if clear button is true then add class hidden
    this._clearButton && classList(this._clearBtn, "add", "hidden");

    // clear value searchId only if clearInput is true
    if (clearInput) {
      this._root.value = "";
      this._root.focus();
    }

    // remove li from ul
    this._resultList.textContent = "";

    // remove class isActive
    classList(this._resultWrap, "remove", this._isActive);

    // reset aria attributes and add accessibility information for disabled state
    setAttributes(this._root, {
      "aria-expanded": "false",
      removeClass: `${this._prefix}-expanded`,
      "aria-activedescendant": "",
      // Explicitly set to none to indicate no autocomplete suggestions when disabled
      "aria-autocomplete": "none",
    });

    // remove all event listeners
    offEvent(this._root, "input", this._handleInput);
    offEvent(this._root, "keydown", this._handleKeys);
    offEvent(this._root, "click", this._handleShowItems);
    if (this._showValuesOnClick) {
      offEvent(this._root, "click", this._handleInput);
    }

    // remove document click listener
    if (!this._inline) {
      offEvent(document, "click", this._handleDocClick);
    }

    // remove mouse events from result list
    ["mousemove", "click"].forEach((eventType) => {
      offEvent(this._resultList, eventType, this._handleMouse);
    });

    // remove loading animation
    this._onLoading(false);

    // remove error classes
    this._error();

    // callback function (without clearing input)
    this._onClose();
  };

  /**
   * Enable autocomplete functionality
   * Restores all functionality after disable() was called
   */
  enable = () => {
    if (!this._isComponentDisabled) return; // already enabled
    this._isComponentDisabled = false;
    this._root.removeAttribute("data-auto-disabled");
    // Restore normal ARIA attributes based on insertToInput setting
    const ariaAttributes = ariaActiveDescendantDefault(
      this._outputUl,
      this._toInput,
    );
    setAttributes(this._root, ariaAttributes);

    // Re-enable all event listeners
    onEvent(this._root, "input", this._handleInput);
    onEvent(this._root, "keydown", this._handleKeys);
    onEvent(this._root, "click", this._handleShowItems);
    if (this._showValuesOnClick) {
      onEvent(this._root, "click", this._handleInput);
    }
    if (!this._inline) {
      onEvent(document, "click", this._handleDocClick);
    }

    // Re-enable mouse events on result list
    ["mousemove", "click"].forEach((eventType) => {
      onEvent(this._resultList, eventType, this._handleMouse);
    });

    // Show clear button if input has value and clearButton is enabled
    if (this._clearButton && this._root.value.length > 0) {
      classList(this._clearBtn, "remove", "hidden");
    }

    // Callback function
    this._onOpened({
      type: "enable",
      element: this._root,
      results: this._resultList,
    });
  };

  /**
   * Clicking on the clear button
   * publick destroy method
   */
  destroy = () => {
    this._isComponentDisabled = true;
    clearTimeout(this._timeout);
    // if clear button is true then add class hidden
    this._clearButton && classList(this._clearBtn, "add", "hidden");
    // clear value searchId
    this._root.value = "";
    // set focus
    this._root.focus();
    // remove li from ul
    this._resultList.textContent = "";
    // if inline: true don't reset
    if (!this._inline) this._reset();
    // if inline: true keep onClose method
    if (this._inline) this._onClose();
    // remove error if exist
    this._error();
    // callback function
    this._onReset(this._root);
    // remove animation on loading
    this._onLoading();

    // remove listener
    offEvent(this._root, "keydown", this._handleKeys);
    offEvent(this._root, "click", this._handleShowItems);
    // remove listener on click on document
    offEvent(document, "click", this._handleDocClick);

    // Completely remove all ARIA attributes to clean up the component
    setAttributes(this._root, {
      "aria-owns": null,
      "aria-expanded": null,
      "aria-autocomplete": null,
      role: null,
      "aria-activedescendant": null,
      "data-auto-disabled": null,
    });
  };
}
