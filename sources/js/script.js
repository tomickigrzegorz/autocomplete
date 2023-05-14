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
      clearButtonOnInitial = false,
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
    this._clearButtonOnInitial = clearButtonOnInitial;
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
    this._clearBtn = createElement("button");

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
    onEvent(this._root, "input", this._handleInput);

    // show all values on click root input
    this._showAll && onEvent(this._root, "click", this._handleInput);

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
    classList(this._resultWrap, "remove", this._isActive);

    // set default aria-selected, remove id and remove class 'auto-selected'
    this._removeAria(select(`.${this._activeList}`));

    // remove result when lengh = 0 and insertToInput is false
    // https://github.com/tomickigrzegorz/autocomplete/issues/136
    if ((this._matches?.length == 0 && !this._toInput) || this._showAll) {
      this._resultList.textContent = "";
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
    showBtnToClearData(this._clearBtn, this.destroy);

    // if there is no value and clearButton is true
    if (value.length == 0 && this._clearButton) {
      classList(this._clearBtn, "add", "hidden");
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
          ? result
          : JSON.parse(JSON.stringify(result));

        this._onLoading();
        this._error();

        // if use destroy() method
        if (resultLength == 0 && rootValueLength == 0) {
          classList(this._clearBtn, "add", "hidden");
        }

        if (resultLength == 0 && rootValueLength) {
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
    onEvent(document, "click", this._handleDocClick);

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
    this._selectFirstElement();

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
      scrollResultsToTop(this._resultList, this._resultWrap);

      // select first element
      this._selectFirstElement();

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
      this._removeAria(element);
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
        this._removeAria(this._selectedLi);

        if (this._index >= 0 && this._index < matchesLength - 1) {
          const selectedElement = this._itemsLi[this._index];

          if (this._toInput && resultList) {
            this._root.value = getFirstElement(selectedElement);
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
      case keyCodes.ENTER:
        // https:github.com/tomickigrzegorz/autocomplete/issues/145
        event.preventDefault();

        this._getTextFromLi(this._selectedLi);
        break;

      // keycode escape and keycode tab
      case keyCodes.TAB:
      case keyCodes.ESC:
        event.stopPropagation();
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
    // stop when clear button is disabled
    if (!this._clearButton) return;

    // add aria to clear button
    setAttributes(this._clearBtn, {
      class: `${this._prefix}-clear hidden`,
      type: "button",
      title: this._clearBtnAriLabel,
      "aria-label": this._clearBtnAriLabel,
    });

    // insert clear button after input - root
    this._root.insertAdjacentElement("afterend", this._clearBtn);
  };

  /**
   * Rerender rows without remove root input and close elements
   */
  rerender = (inputValue) => {
    const text = inputValue?.trim() ? inputValue.trim() : this._root.value;
    if (inputValue?.trim()) {
      this._root.value = inputValue.trim();
      this._cacheAct("update", this._root);
    }
    const regexText = text.replace(this._regex, "\\$&");
    this._searchItem(regexText.trim());
  };

  /**
   * Clicking on the clear button
   * publick destroy method
   */
  destroy = () => {
    // if clear button is true then add class hidden
    this._clearButton && classList(this._clearBtn, "add", "hidden");
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
    offEvent(this._root, "keydown", this._handleKeys);
    offEvent(this._root, "click", this._handleShowItems);
    // remove listener on click on document
    offEvent(document, "click", this._handleDocClick);
  };
}
