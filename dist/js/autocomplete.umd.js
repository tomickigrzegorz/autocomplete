(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Autocomplete = factory());
})(this, (function () { 'use strict';

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

  /**
   * Key codes
   */
  const keyCodes = {
    ESC: 27,
    ENTER: 13,
    UP: 38,
    DOWN: 40,
    TAB: 9,
  };

  /**
   * @class Autocomplete
   */
  class Autocomplete {
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
      this.id = element;
      this.root = document.getElementById(this.id);
      this.onSearch = isPromise(onSearch)
        ? onSearch
        : ({ currentValue, element }) =>
            Promise.resolve(onSearch({ currentValue, element }));
      this.onResults = onResults;
      this.onRender = onRender;
      this.onSubmit = onSubmit;
      this.onSelected = onSelectedItem;
      this.onOpened = onOpened;
      this.onReset = onReset;
      this.noResults = noResults;
      this.onClose = onClose;

      this.delay = delay;
      this.characters = howManyCharacters;
      this.clearButton = clearButton;
      this.selectFirst = selectFirst;
      this.toInput = insertToInput;
      this.showAll = showAllValues;
      this.classGroup = classGroup;
      this.prevClosing = classPreventClosing;
      this.clearBtnAriLabel = ariaLabelClear
        ? ariaLabelClear
        : 'clear text from input';
      this.prefix = classPrefix ? `${classPrefix}-auto` : 'auto';
      this.disable = disableCloseOnSelect;

      // default config
      this.cache = cache;
      this.outputUl = `${this.prefix}-${this.id}-results`;
      this.cacheData = `data-cache-auto-${this.id}`;
      this.isLoading = `${this.prefix}-is-loading`;
      this.isActive = `${this.prefix}-is-active`;
      this.activeList = `${this.prefix}-selected`;
      this.selectedOption = `${this.prefix}-selected-option`;
      this.err = `${this.prefix}-error`;
      this.regex = /[|\\{}()[\]^$+*?.]/g;
      this.timeout = null;

      this.resultWrap = document.createElement('div');
      this.resultList = document.createElement('ul');
      this.cBtn = document.createElement('button');

      this.init();
    }

    /**
     * Initial function
     */
    init = () => {
      const { resultList, root } = this;

      this.clearbutton();

      output(root, resultList, this.outputUl, this.resultWrap, this.prefix);

      // default aria
      // this.reset();
      root.addEventListener('input', this.handleInput);

      // show all values on click root input
      this.showAll && root.addEventListener('click', this.handleInput);

      // calback functions
      this.onRender({
        element: root,
        results: resultList,
      });
    };

    /**
     * Actions on input
     *
     * @param {String} type - set attribute depending on type
     * @param {String} target
     */
    cacheAct = (type, target) => {
      const root = this.root;
      if (!this.cache) return;

      if (type === 'update') {
        root.setAttribute(this.cacheData, target.value);
      } else if (type === 'remove') {
        root.removeAttribute(this.cacheData);
      } else {
        root.value = root.getAttribute(this.cacheData);
      }
    };

    /**
     * Handle input
     *
     * @param {Event} object
     */
    handleInput = ({ target, type }) => {
      if (
        this.root.getAttribute('aria-expanded') === 'true' &&
        type === 'click'
      ) {
        return;
      }

      const regex = target.value.replace(this.regex, '\\$&');

      // update data attribute cache
      this.cacheAct('update', target);

      // if showing all values is set on
      // true we are no need timeout
      if (this.showAll && type === 'click') {
        this.reset();
        this.searchItem(regex.trim());
        return;
      }

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.searchItem(regex.trim());
      }, this.delay);
    };

    /**
     * Default aria
     */
    reset = () => {
      // set attributes to root - input
      setAttributes(this.root, {
        'aria-owns': `${this.id}-list`,
        'aria-expanded': 'false',
        'aria-autocomplete': 'list',
        'aria-activedescendant': '',
        role: 'combobox',
        removeClass: 'auto-expanded',
      });

      // remove class isActive
      this.resultWrap.classList.remove(this.isActive);

      // move the view item to the first item
      // this.resultList.scrollTop = 0;
      // scrollResultsToTop(this.resultList, this.resultWrap);

      // remove result when lengh = 0 and insertToInput is false
      if ((this.matches?.length == 0 && !this.toInput) || this.showAll) {
        this.resultList.innerHTML = '';
      }

      // set index
      this.index = this.selectFirst ? 0 : -1;

      // callback function
      this.onClose();
    };

    /**
     * The async function gets the text from the search
     * and returns the matching array
     *
     * @param {String} value
     */
    searchItem = (value) => {
      this.value = value;

      // if searching show loading icon
      this.onLoading(true);

      // hide button clear
      showBtnToClearData(this.cBtn, this.destroy);

      // if there is no value and clearButton is true
      if (value.length == 0 && this.clearButton) {
        this.cBtn.classList.add('hidden');
      }

      // if declare characters more then value.len and showAll is false
      // remove class isActive
      if (this.characters > value.length && !this.showAll) {
        this.onLoading();
        return;
      }

      // callblack function onSearch
      this.onSearch({ currentValue: value, element: this.root })
        .then((result) => {
          const rootValueLength = this.root.value.length;
          const resultLength = result.length;
          // set no result
          this.matches = Array.isArray(result)
            ? [...result]
            : JSON.parse(JSON.stringify(result));

          this.onLoading();
          this.error();

          // if use destroy() method
          if (resultLength == 0 && rootValueLength == 0) {
            this.cBtn.classList.add('hidden');
          }

          if (resultLength == 0 && rootValueLength) {
            this.root.classList.remove('auto-expanded');
            this.reset();
            this.noResults({
              element: this.root,
              currentValue: value,
              template: this.results,
            });
            this.events();
          } else if (resultLength > 0 || isObject(result)) {
            this.index = this.selectFirst ? 0 : -1;
            this.results();
            this.events();
          }
        })
        .catch(() => {
          this.onLoading();
          this.reset();
        });
    };

    /**
     * Set or remove loading class
     *
     * @param {Boolean} type
     */
    onLoading = (type) =>
      this.root.parentNode.classList[type ? 'add' : 'remove'](this.isLoading);

    /**
     * Set error class to the root element
     */
    error = () => this.root.classList.remove(this.err);

    /**
     * Events
     */
    events = () => {
      const { root, resultList } = this;

      // handle click on keydown [up, down, enter, tab, esc]
      root.addEventListener('keydown', this.handleKeys);

      //
      root.addEventListener('click', this.handleShowItems);

      // temporarily disabled mouseleave
      ['mousemove', 'click'].map((eventType) => {
        resultList.addEventListener(eventType, this.handleMouse);
      });

      // close expanded items
      document.addEventListener('click', this.handleDocClick);
    };

    /**
     * Results
     *
     * @param {HTMLElement|String} template - html or string returned from the function,
     * look at the example - https://github.com/tomik23/autocomplete/blob/master/docs/js/examples/no-results.js#L30
     */
    results = (template) => {
      // set attribute to root
      setAttributes(this.root, {
        'aria-expanded': 'true',
        addClass: `${this.prefix}-expanded`,
      });

      // add all found records to otput ul
      this.resultList.innerHTML =
        this.matches.length === 0
          ? this.onResults({
              currentValue: this.value,
              matches: 0,
              template,
            })
          : this.onResults({
              currentValue: this.value,
              matches: this.matches,
              classGroup: this.classGroup,
            });

      this.resultWrap.classList.add(this.isActive);

      // scrollResultsToTop(this.resultList, this.resultWrap);

      const checkIfClassGroupExist = this.classGroup
        ? `:not(.${this.classGroup})`
        : '';

      this.itemsLi = document.querySelectorAll(
        `#${this.outputUl} > li${checkIfClassGroupExist}`
      );

      // select first element
      this.selectFirstEl();

      // action on open results
      this.onOpened({
        type: 'results',
        element: this.root,
        results: this.resultList,
      });

      // adding role, tabindex and aria
      addAriaToAllLiElements(this.itemsLi);
    };

    /**
     * Hangle click on document
     *
     * @param {Event} object
     */
    handleDocClick = ({ target }) => {
      let disableClose = null;

      // if 'target' is a ul and 'disableCloseOnSelect'
      // is a 'true' set 'disableClose' on true
      if (
        (target.closest('ul') && this.disable) ||
        // when class classDisableClose
        // then do not not close results
        target.closest(`.${this.prevClosing}`)
      ) {
        disableClose = true;
      }

      if (target.id !== this.id && !disableClose) {
        this.reset();
        return;
      }
    };

    /**
     * Select first element
     */
    selectFirstEl = () => {
      const { activeList, selectedOption, selectFirst, root } = this;

      this.remAria(document.querySelector(`.${activeList}`));

      if (!selectFirst) {
        return;
      }

      const { firstElementChild } = this.resultList;

      const classSelectFirst =
        this.classGroup && this.matches.length > 0 && selectFirst
          ? firstElementChild.nextElementSibling
          : firstElementChild;

      // set attribute to first element
      setAttributes(classSelectFirst, {
        id: `${selectedOption}-0`,
        addClass: activeList,
        'aria-selected': 'true',
      });

      // add fisrst element to root input
      // temporarily turned off
      // if (this.matches.length > 0 && this.toInput) {
      //   this.addToInput(this.itemsLi[this.index]);
      // }

      // set aria active descendant
      setAriaActivedescendant(root, `${selectedOption}-0`);

      // scrollIntoView when press up/down arrows
      // this.follow(firstElementChild);
    };

    /**
     * Add/remove class or set attribute
     * @param {HTMLElement} el
     * @param {Object} object
     */
    setAttr = (el, object) => {
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
     * show items when items.length > 0 and is not empty
     */
    handleShowItems = () => {
      const { root, resultWrap, resultList, isActive } = this;

      // if resultWrap is not active and resultList is not empty
      if (
        resultList.textContent.length > 0 &&
        !resultWrap.classList.contains(isActive)
      ) {
        // set attribute to root
        setAttributes(root, {
          'aria-expanded': 'true',
          addClass: `${this.prefix}-expanded`,
        });

        // add isActive class to resultWrap
        resultWrap.classList.add(isActive);

        scrollResultsToTop(resultList, resultWrap);

        // select first element
        this.selectFirstEl();

        // callback function
        this.onOpened({
          type: 'showItems',
          element: root,
          results: resultList,
        });
      }
    };

    /**
     * Adding text from the list when li is clicking
     * or adding aria-selected to li elements
     * @param {Event} event
     */
    handleMouse = (event) => {
      event.preventDefault();

      const { target, type } = event;
      const targetClosest = target.closest('li');
      const targetClosestRole = targetClosest?.hasAttribute('role');
      const activeClass = this.activeList;
      const activeClassElement = document.querySelector(`.${activeClass}`);

      if (!targetClosest || !targetClosestRole) {
        return;
      }

      // click on li get element
      if (type === 'click') {
        // get text from clicked li
        this.getTextFromLi(targetClosest);
      }

      if (
        type === 'mousemove' &&
        !targetClosest.classList.contains(activeClass)
      ) {
        this.remAria(activeClassElement);

        // add aria to li
        this.setAria(targetClosest);
        this.index = this.indexLiSelected(targetClosest);

        this.onSelected({
          index: this.index,
          element: this.root,
          object: this.matches[this.index],
        });
      }
    };

    /**
     * Get text from li on enter or click
     *
     * @param {HTMLElement} element
     */
    getTextFromLi = (element) => {
      const { root, index, disable } = this;

      if (!element || this.matches.length === 0) {
        // set default settings
        !disable && this.reset();

        return;
      }

      // get first element from li and set it to root
      getFirstElementFromLiAndAddToInput(element, root);

      // onSubmit passing text to function
      this.onSubmit({
        index: index,
        element: root,
        object: this.matches[index],
        results: this.resultList,
      });

      // set default settings
      if (!disable) {
        this.remAria(element);
        this.reset();
      }

      // show clearBtn when select element
      this.clearButton && this.cBtn.classList.remove('hidden');

      // remove cache
      this.cacheAct('remove');
    };

    /**
     * Return which li element was selected
     * by hovering the mouse over
     *
     * @param {HTMLElement} target
     * @returns {Number}
     */
    indexLiSelected = (target) =>
      // get index of li element
      Array.prototype.indexOf.call(this.itemsLi, target);

    /**
     * Navigating the elements li and enter
     *
     * @param {Event} event
     */
    handleKeys = (event) => {
      const { root } = this;
      const { keyCode } = event;

      const resultList = this.resultWrap.classList.contains(this.isActive);

      const matchesLength = this.matches.length + 1;
      this.selectedLi = document.querySelector(`.${this.activeList}`);

      // switch between keys
      switch (keyCode) {
        case keyCodes.UP:
        case keyCodes.DOWN:
          // Wrong cursor position in the input field #62
          // Prevents the cursor from moving to the beginning
          // of input as the cursor hovers over the results.
          event.preventDefault();

          if ((matchesLength <= 1 && this.selectFirst) || !resultList) {
            return;
          }

          // if keyCode is up
          if (keyCode === keyCodes.UP) {
            if (this.index < 0) {
              this.index = matchesLength - 1;
            }
            this.index -= 1;
          } else {
            this.index += 1;
            if (this.index >= matchesLength) {
              this.index = 0;
            }
          }

          // remove aria-selected
          this.remAria(this.selectedLi);

          if (
            matchesLength > 0 &&
            this.index >= 0 &&
            this.index < matchesLength - 1
          ) {
            // callback function
            this.onSelected({
              index: this.index,
              element: root,
              object: this.matches[this.index],
            });

            // set aria-selected
            this.setAria(this.itemsLi[this.index]);
            if (this.toInput && resultList) {
              getFirstElementFromLiAndAddToInput(this.itemsLi[this.index], root);
            }
          } else {
            // catch action
            this.cacheAct();
            setAriaActivedescendant(root);
          }

          break;
        // keycode enter
        case keyCodes.ENTER:
          this.getTextFromLi(this.selectedLi);
          break;

        // keycode escape and keycode tab
        case keyCodes.TAB:
        case keyCodes.ESC:
          this.reset();

          break;
      }
    };

    /**
     * Set aria label on item li
     *
     * @param {HTMLElement} target
     */
    setAria = (target) => {
      const selectedOption = `${this.selectedOption}-${this.indexLiSelected(
      target
    )}`;

      // set aria to li
      setAttributes(target, {
        id: selectedOption,
        'aria-selected': 'true',
        addClass: this.activeList,
      });

      setAriaActivedescendant(this.root, selectedOption);

      // scrollIntoView when press up/down arrows
      followActiveElement(
        target,
        this.outputUl,
        this.classGroup,
        this.resultList
      );
    };

    /**
     * Remove aria label from item li
     *
     * @param {HTMLElement} element
     */
    remAria = (element) => {
      if (!element) return;

      // remove aria from li
      setAttributes(element, {
        id: '',
        removeClass: this.activeList,
        'aria-selected': 'false',
      });
    };

    /**
     * Create clear button and
     * removing text from the input field
     */
    clearbutton = () => {
      // stop when clear button is disabled
      if (!this.clearButton) return;

      const { cBtn } = this;

      // add aria to clear button
      setAttributes(cBtn, {
        class: `${this.prefix}-clear hidden`,
        type: 'button',
        'aria-label': this.clearBtnAriLabel,
      });

      // insert clear button after input - root
      this.root.insertAdjacentElement('afterend', cBtn);
    };

    /**
     * Clicking on the clear button
     * publick destroy method
     */
    destroy = () => {
      const { root } = this;
      // if clear button is true then add class hidden
      this.clearButton && this.cBtn.classList.add('hidden');
      // clear value searchId
      root.value = '';
      // set focus
      root.focus();
      // remove li from ul
      this.resultList.textContent = '';
      // set default aria
      this.reset();
      // remove error if exist
      this.error();

      // callback function
      this.onReset(root);

      // remove listener
      root.removeEventListener('keydown', this.handleKeys);
      root.removeEventListener('click', this.handleShowItems);
      // remove listener on click on document
      document.removeEventListener('click', this.handleDocClick);
    };
  }

  return Autocomplete;

}));
//# sourceMappingURL=autocomplete.umd.js.map
