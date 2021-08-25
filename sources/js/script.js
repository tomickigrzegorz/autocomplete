import isPromise from './helpers/isPromise';
import isObject from './helpers/isObject';

class Autocomplete {
  constructor(
    element,
    {
      delay = 500,
      clearButton = true,
      howManyCharacters = 1,
      selectFirst = false,
      insertToInput = false,
      cache = false,
      disableCloseOnSelect = false,
      classGroup,
      onResults = () => {},
      onSearch = () => {},
      onSubmit = () => {},
      onOpened = () => {},
      onReset = () => {},
      onClose = () => {},
      noResults = () => {},
      onSelectedItem = () => {},
    }
  ) {
    this.search = element;
    this.root = document.getElementById(this.search);
    this.onSearch = isPromise(onSearch)
      ? onSearch
      : ({ currentValue: a, element: b }) =>
          Promise.resolve(onSearch({ currentValue: a, element: b }));
    this.onResults = onResults;
    this.onSubmit = onSubmit;
    this.onSelectedItem = onSelectedItem;
    this.onOpened = onOpened;
    this.onReset = onReset;
    this.noResults = noResults;
    this.onClose = onClose;

    this.delay = delay;
    this.characters = howManyCharacters;
    this.clearButton = clearButton;
    this.selectFirst = selectFirst;
    this.toInput = insertToInput;
    this.classGroup = classGroup;
    this.disableCloseOnSelect = disableCloseOnSelect;

    // default config
    this.cache = cache;
    this.outputUl = `auto-${this.search}`;
    this.cacheData = `data-cache-auto-${this.search}`;
    this.isLoading = 'auto-is-loading';
    this.isActive = 'auto-is-active';
    this.activeList = 'auto-selected';
    this.selectedOption = 'auto-selected-option';
    this.err = 'auto-error';
    this.regex = /[|\\{}()[\]^$+*?.]/g;
    this.timeout = null;

    this.resultList = document.createElement('ul');

    this.keyCodes = {
      ESC: 27,
      ENTER: 13,
      UP: 38,
      DOWN: 40,
      TAB: 9,
    };

    this.init();
  }

  init = () => {
    this.clearbutton();

    this.output();

    // default aria
    // this.reset();
    this.root.addEventListener('input', this.handleInput);
  };

  cacheAct = (type, target) => {
    if (!this.cache) return;
    const dataCache = document.getElementById(this.search);
    if (type === 'update') {
      dataCache.setAttribute(this.cacheData, target.value);
    }
    if (type === 'remove') {
      dataCache.removeAttribute(this.cacheData);
    }
    if (type === 'root') {
      this.root.value = dataCache.getAttribute(this.cacheData);
    }
  };

  handleInput = ({ target }) => {
    const regex = target.value.replace(this.regex, '\\$&');
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.searchItem(regex.trim());
    }, this.delay);

    // update data attribute cache
    this.cacheAct('update', target);
  };

  // create output-list and put after search input
  output = () => {
    this.setAttr(this.resultList, {
      id: this.outputUl,
      addClass: 'auto-output-search',
      tabIndex: 0,
      role: 'listbox',
    });

    this.root.parentNode.insertBefore(this.resultList, this.root.nextSibling);
  };

  // default aria
  reset = () => {
    this.setAttr(this.root, {
      'aria-owns': `${this.search}-list`,
      'aria-expanded': false,
      'aria-autocomplete': 'list',
      'aria-activedescendant': '',
      role: 'combobox',
      removeClass: 'auto-expanded',
    });

    this.resultList.classList.remove(this.isActive);

    // move the view item to the first item
    this.resultList.scrollTop = 0;

    // remove result when lengh = 0 and insertToInput is false
    if (this.matches?.length == 0 && !this.toInput) {
      this.resultList.innerHTML = '';
    }

    this.index = this.selectFirst ? 0 : -1;

    this.onClose();
  };

  // The async function gets the text from the search
  // and returns the matching array
  searchItem = (value) => {
    this.value = value;

    this.onLoading(true);

    // hide button clear
    this.showBtn();

    if (value.length == 0 && this.clearButton) {
      this.clearBtn.classList.add('hidden');
    }

    if (this.characters > value.length) {
      this.onLoading();
      return;
    }

    this.onSearch({ currentValue: value, element: this.root })
      .then((result) => {
        // set no result
        this.matches = Array.isArray(result)
          ? [...result]
          : JSON.parse(JSON.stringify(result));

        this.onLoading();
        this.error();

        // if use destroy() method
        if (result.length == 0 && this.root.value.length == 0) {
          this.clearBtn.classList.add('hidden');
        }

        if (result.length == 0 && this.root.value.length) {
          this.root.classList.remove('auto-expanded');
          this.reset();
          this.noResults({
            element: this.root,
            currentValue: value,
            template: this.results,
          });
          this.events();
        } else if (result.length > 0 || isObject(result)) {
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
    const liElements = [].slice.call(this.resultList.children);

    this.root.addEventListener('keydown', this.handleKeys);
    this.root.addEventListener('click', this.handleShowItems);

    for (let i = 0; i < liElements.length; i++) {
      liElements[i].addEventListener('mousemove', this.handleMouse);
      liElements[i].addEventListener('click', this.handleMouse, false);
    }

    // close expanded items
    document.addEventListener('click', this.handleDocClick);
  };

  results = (template) => {
    this.setAttr(this.root, {
      'aria-expanded': true,
      addClass: 'auto-expanded',
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

    this.resultList.classList.add(this.isActive);

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
    if (target.closest('ul') && this.disableCloseOnSelect) {
      disableClose = true;
    }

    if (target.id !== this.search && !disableClose) {
      this.reset();
      return;
    }
  };

  // adding role, tabindex, aria and call handleMouse
  addAria = () => {
    for (let i = 0; i < this.itemsLi.length; i++) {
      this.setAttr(this.itemsLi[i], {
        role: 'option',
        tabindex: -1,
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
      'aria-selected': true,
    });

    // add fisrst element to root input
    // temporarily turned off
    // if (this.matches.length > 0 && this.toInput) {
    //   this.addToInput(this.itemsLi[this.index]);
    // }

    this.setAriaDes(`${this.selectedOption}-0`);

    // scrollIntoView when press up/down arrows
    this.follow(firstElementChild, this.resultList);
  };

  showBtn = () => {
    if (!this.clearBtn) return;

    this.clearBtn.classList.remove('hidden');
    this.clearBtn.addEventListener('click', this.destroy);
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
    if (
      this.resultList.textContent.length > 0 &&
      !this.resultList.classList.contains(this.isActive)
    ) {
      this.setAttr(this.root, {
        'aria-expanded': true,
        addClass: 'auto-expanded',
      });
      this.resultList.classList.add(this.isActive);
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

    if (!targetClosest || !targetClosestRole) {
      return;
    }

    // click on li get element
    if (type === 'click') {
      this.getTextFromLi(targetClosest);
    }

    if (targetClosest.classList.contains(this.activeList)) {
      return;
    }

    if (type === 'mousemove') {
      this.remAria(document.querySelector(`.${this.activeList}`));

      this.setAria(targetClosest);
      this.index = this.indexLiSelected(targetClosest);

      this.onSelectedItem({
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
      if (!this.disableCloseOnSelect) {
        this.reset();
      }
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
    if (!this.disableCloseOnSelect) {
      this.remAria(element);
      this.reset();
    }

    // show clearBtn when select element
    if (this.clearButton) {
      this.clearBtn.classList.remove('hidden');
    }

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
    const resultList = this.resultList.classList.contains(this.isActive);

    const matchesLength = this.matches.length + 1;
    this.selectedLi = document.querySelector(`.${this.activeList}`);

    switch (keyCode) {
      case this.keyCodes.UP:
      case this.keyCodes.DOWN:
        // Wrong cursor position in the input field #62
        // Prevents the cursor from moving to the beginning
        // of input as the cursor hovers over the results.
        event.preventDefault();

        if ((matchesLength <= 1 && this.selectFirst) || !resultList) {
          return;
        }

        if (keyCode === this.keyCodes.UP) {
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
          this.onSelectedItem({
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
          this.cacheAct('root');
          this.setAriaDes();
        }

        break;
      case this.keyCodes.ENTER:
        this.getTextFromLi(this.selectedLi);
        break;

      case this.keyCodes.TAB:
      case this.keyCodes.ESC:
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
      'aria-selected': true,
      addClass: this.activeList,
    });

    this.setAriaDes(selectedOption);

    // scrollIntoView when press up/down arrows
    this.follow(target, this.resultList);
  };

  // follow active element
  follow = (element, container) => {
    if (element.offsetTop < container.scrollTop) {
      container.scrollTop = element.offsetTop;
    } else {
      const offsetBottom = element.offsetTop + element.offsetHeight;
      const scrollBottom = container.scrollTop + container.offsetHeight;
      if (offsetBottom > scrollBottom) {
        container.scrollTop = offsetBottom - container.offsetHeight;
      }
    }
  };

  // remove aria label from item li
  remAria = (element) => {
    if (!element) return;

    this.setAttr(element, {
      id: '',
      removeClass: this.activeList,
      'aria-selected': false,
    });
  };

  // Set aria-activedescendant
  setAriaDes = (type) =>
    this.root.setAttribute('aria-activedescendant', type || '');

  // create clear button and
  // removing text from the input field
  clearbutton = () => {
    if (!this.clearButton) return;

    this.clearBtn = document.createElement('button');

    this.setAttr(this.clearBtn, {
      id: `auto-clear-${this.search}`,
      class: 'auto-clear hidden',
      type: 'button',
      'aria-label': 'claar text from input',
    });

    this.root.insertAdjacentElement('afterend', this.clearBtn);
  };

  // clicking on the clear button
  // publick destroy method
  destroy = () => {
    if (this.clearButton) {
      this.clearBtn.classList.add('hidden');
    }
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
