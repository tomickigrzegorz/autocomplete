import isPromise from './helpers/isPromise';
import isObject from './helpers/isObject';
import keyCodes from './helpers/defaults';

class Autocomplete {
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

  init = () => {
    const root = this.root;

    this.clearbutton();

    this.output();

    // default aria
    // this.reset();
    root.addEventListener('input', this.handleInput);

    // show all values on click root input
    this.showAll && root.addEventListener('click', this.handleInput);

    this.onRender({
      element: root,
      results: this.resultList,
    });
  };

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

  // create output-list and put after search input
  output = () => {
    this.setAttr(this.resultList, {
      id: this.outputUl,
      tabIndex: '0',
      role: 'listbox',
    });

    this.setAttr(this.resultWrap, {
      addClass: `${this.prefix}-wrapper`,
    });

    this.resultWrap.insertAdjacentElement('beforeend', this.resultList);

    this.root.parentNode.insertBefore(this.resultWrap, this.root.nextSibling);
  };

  // default aria
  reset = () => {
    this.setAttr(this.root, {
      'aria-owns': `${this.id}-list`,
      'aria-expanded': 'false',
      'aria-autocomplete': 'list',
      'aria-activedescendant': '',
      role: 'combobox',
      removeClass: 'auto-expanded',
    });

    this.resultWrap.classList.remove(this.isActive);

    // move the view item to the first item
    // this.resultList.scrollTop = 0;
    this.scrollResultsToTop();

    // remove result when lengh = 0 and insertToInput is false
    if ((this.matches?.length == 0 && !this.toInput) || this.showAll) {
      this.resultList.innerHTML = '';
    }

    this.index = this.selectFirst ? 0 : -1;

    this.onClose();
  };

  scrollResultsToTop = () => {
    // if there is an overflow of ul element, after
    // opening we always move ul to the top of the results
    this.resultList.scrollTop =
      this.resultList.offsetTop - this.resultWrap.offsetHeight;
  };

  // The async function gets the text from the search
  // and returns the matching array
  searchItem = (value) => {
    this.value = value;

    this.onLoading(true);

    // hide button clear
    this.showBtn();

    if (value.length == 0 && this.clearButton) {
      this.cBtn.classList.add('hidden');
    }

    if (this.characters > value.length && !this.showAll) {
      this.onLoading();
      return;
    }

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

  onLoading = (type) =>
    this.root.parentNode.classList[type ? 'add' : 'remove'](this.isLoading);

  error = () => this.root.classList.remove(this.err);

  // preparation of the list
  events = () => {
    this.root.addEventListener('keydown', this.handleKeys);
    this.root.addEventListener('click', this.handleShowItems);

    // temporarily disabled mouseleave
    ['mousemove', 'click'].map((eventType) => {
      this.resultList.addEventListener(eventType, this.handleMouse);
    });

    // close expanded items
    document.addEventListener('click', this.handleDocClick);
  };

  results = (template) => {
    this.setAttr(this.root, {
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

    this.scrollResultsToTop();

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
    this.addAria();
  };

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

  // adding role, tabindex, aria and call handleMouse
  addAria = () => {
    for (let i = 0; i < this.itemsLi.length; i++) {
      this.setAttr(this.itemsLi[i], {
        role: 'option',
        tabindex: '-1',
        'aria-selected': 'false',
        'aria-setsize': this.itemsLi.length,
        'aria-posinset': i,
      });
    }
  };

  // select first element
  selectFirstEl = () => {
    this.remAria(document.querySelector(`.${this.activeList}`));

    if (!this.selectFirst) {
      return;
    }

    const { firstElementChild } = this.resultList;

    const classSelectFirst =
      this.classGroup && this.matches.length > 0 && this.selectFirst
        ? firstElementChild.nextElementSibling
        : firstElementChild;

    this.setAttr(classSelectFirst, {
      id: `${this.selectedOption}-0`,
      addClass: this.activeList,
      'aria-selected': 'true',
    });

    // add fisrst element to root input
    // temporarily turned off
    // if (this.matches.length > 0 && this.toInput) {
    //   this.addToInput(this.itemsLi[this.index]);
    // }

    this.setAriaDes(`${this.selectedOption}-0`);

    // scrollIntoView when press up/down arrows
    this.follow(firstElementChild);
  };

  showBtn = () => {
    if (!this.cBtn) return;

    this.cBtn.classList.remove('hidden');
    this.cBtn.addEventListener('click', this.destroy);
  };

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

  // show items when items.length > 0 and is not empty
  handleShowItems = () => {
    const resultWrap = this.resultWrap;

    if (
      this.resultList.textContent.length > 0 &&
      !resultWrap.classList.contains(this.isActive)
    ) {
      this.setAttr(this.root, {
        'aria-expanded': 'true',
        addClass: `${this.prefix}-expanded`,
      });

      resultWrap.classList.add(this.isActive);

      this.scrollResultsToTop();

      // select first element
      this.selectFirstEl();

      this.onOpened({
        type: 'showItems',
        element: this.root,
        results: this.resultList,
      });
    }
  };

  // adding text from the list when li is clicking
  // or adding aria-selected to li elements
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
      this.getTextFromLi(targetClosest);
    }

    if (
      type === 'mousemove' &&
      !targetClosest.classList.contains(activeClass)
    ) {
      this.remAria(activeClassElement);

      this.setAria(targetClosest);
      this.index = this.indexLiSelected(targetClosest);

      this.onSelected({
        index: this.index,
        element: this.root,
        object: this.matches[this.index],
      });
    }
  };

  // get text from li on enter or click
  getTextFromLi = (element) => {
    if (!element || this.matches.length === 0) {
      // set default settings
      !this.disable && this.reset();

      return;
    }

    this.addToInput(element);

    // onSubmit passing text to function
    this.onSubmit({
      index: this.index,
      element: this.root,
      object: this.matches[this.index],
      results: this.resultList,
    });

    // set default settings
    if (!this.disable) {
      this.remAria(element);
      this.reset();
    }

    // show clearBtn when select element
    this.clearButton && this.cBtn.classList.remove('hidden');

    // remove cache
    this.cacheAct('remove');
  };

  // get first element from child
  firstElement = (element) => element.firstElementChild || element;

  // set data from li to input
  addToInput = (element) => {
    // add text to input
    this.root.value = this.firstElement(element).textContent.trim();
  };

  // return which li element was selected
  // by hovering the mouse over
  indexLiSelected = (target) =>
    Array.prototype.indexOf.call(this.itemsLi, target);

  // navigating the elements li and enter
  handleKeys = (event) => {
    const { keyCode } = event;
    const resultList = this.resultWrap.classList.contains(this.isActive);

    const matchesLength = this.matches.length + 1;
    this.selectedLi = document.querySelector(`.${this.activeList}`);

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

        this.remAria(this.selectedLi);

        if (
          matchesLength > 0 &&
          this.index >= 0 &&
          this.index < matchesLength - 1
        ) {
          this.onSelected({
            index: this.index,
            element: this.root,
            object: this.matches[this.index],
          });

          this.setAria(this.itemsLi[this.index]);
          if (this.toInput && resultList) {
            this.addToInput(this.itemsLi[this.index]);
          }
        } else {
          // focus on input
          this.cacheAct();
          this.setAriaDes();
        }

        break;
      case keyCodes.ENTER:
        this.getTextFromLi(this.selectedLi);
        break;

      case keyCodes.TAB:
      case keyCodes.ESC:
        this.reset();

        break;
      default:
        break;
    }
  };

  // set aria label on item li
  setAria = (target) => {
    const selectedOption = `${this.selectedOption}-${this.indexLiSelected(
      target
    )}`;

    this.setAttr(target, {
      id: selectedOption,
      'aria-selected': 'true',
      addClass: this.activeList,
    });

    this.setAriaDes(selectedOption);

    // scrollIntoView when press up/down arrows
    this.follow(target);
  };

  getClassGroupHeight = () => {
    const allLi = document.querySelectorAll(
      `#${this.outputUl} > li:not(.${this.classGroup})`
    );
    let height = 0;
    [].slice.call(allLi).map((el) => (height += el.offsetHeight));

    return height;
  };

  // follow active element
  follow = (target) => {
    const resultList = this.resultList;
    const previusElement = resultList.previousSibling;

    const previusElementHeight = previusElement
      ? previusElement.offsetHeight
      : 0;

    if (target.getAttribute('aria-posinset') == '0') {
      resultList.scrollTop = target.offsetTop - this.getClassGroupHeight();
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

  // remove aria label from item li
  remAria = (element) => {
    if (!element) return;

    this.setAttr(element, {
      id: '',
      removeClass: this.activeList,
      'aria-selected': 'false',
    });
  };

  // Set aria-activedescendant
  setAriaDes = (type) =>
    this.root.setAttribute('aria-activedescendant', type || '');

  // create clear button and
  // removing text from the input field
  clearbutton = () => {
    if (!this.clearButton) return;

    this.setAttr(this.cBtn, {
      class: `${this.prefix}-clear hidden`,
      type: 'button',
      'aria-label': this.clearBtnAriLabel,
    });

    this.root.insertAdjacentElement('afterend', this.cBtn);
  };

  // clicking on the clear button
  // publick destroy method
  destroy = () => {
    this.clearButton && this.cBtn.classList.add('hidden');
    // clear value searchId
    this.root.value = '';
    // set focus
    this.root.focus();
    // remove li from ul
    this.resultList.textContent = '';
    // set default aria
    this.reset();
    // remove error if exist
    this.error();

    this.onReset(this.root);

    // remove listener
    this.root.removeEventListener('keydown', this.handleKeys);
    this.root.removeEventListener('click', this.handleShowItems);
    document.removeEventListener('click', this.handleDocClick);
  };
}

export default Autocomplete;
