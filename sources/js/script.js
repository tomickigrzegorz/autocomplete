import isPromise from './helpers/isPromise';
import isObject from './helpers/isObject';

class Autocomplete {
  constructor(
    element,
    {
      delay,
      clearButton,
      howManyCharacters,
      selectFirst,
      onResults = () => { },
      onSearch = () => { },
      onSubmit = () => { },
      noResults = () => { },
    }
  ) {
    this.search = element;
    this.input = document.getElementById(this.search);
    this.onResults = onResults;
    this.onSubmit = onSubmit;
    this.noResults = noResults;
    this.onSearch = isPromise(onSearch)
      ? onSearch
      : (value) => Promise.resolve(onSearch(value));
    this.delay = delay || 500;
    this.howManyCharacters = howManyCharacters || 2;
    this.clearButton = clearButton || false;
    this.selectFirst = selectFirst || false;

    // default config
    this.searchOutputUl = `${this.search}-list`;
    this.isLoading = 'auto-is-loading';
    this.isActive = 'auto-is-active';
    this.activeList = 'auto-selected';
    this.selectedOption = 'selectedOption';
    this.error = 'auto-error';
    this.regex = /[`~!@#$%^&*()_|+\-=÷¿?;:'",.<>{}[\]\\/]/g;
    this.timeout = null;

    this.keyCodes = {
      ESC: 27,
      ENTER: 13,
      UP: 38,
      DOWN: 40,
      TAB: 9,
    };

    this.initialize();
  }

  initialize = () => {
    // set default index
    this.selectedIndex = this.selectFirst ? 0 : -1;

    this.createClearButton();

    this.outputSearch();

    // default aria
    this.setDefault();

    this.input.addEventListener('input', this.handleInput);
  };

  handleInput = ({ target }) => {
    target.value.replace(this.regex, '');
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.searchItem(target.value.trim());
    }, this.delay);
  };

  // create output-list and put after search input
  outputSearch = () => {
    this.resultList = document.createElement('ul');

    this.setAttribute(this.resultList, {
      id: this.searchOutputUl,
      addClass: 'auto-output-search',
      tabIndex: 0,
      role: 'listbox',
    });

    this.input.parentNode.insertBefore(this.resultList, this.input.nextSibling);
  };

  // default aria
  setDefault = () => {
    this.setAttribute(this.input, {
      'aria-owns': `${this.search}-list`,
      'aria-expanded': false,
      'aria-autocomplete': 'both',
      'aria-activedescendant': '',
      role: 'combobox',
      removeClass: 'expanded',
    });

    this.resultList.classList.remove(this.isActive);

    // move the view item to the first item
    this.resultList.scrollTop = 0;

    this.selectedIndex = this.selectFirst ? 0 : -1;
  };

  // The async function gets the text from the search
  // and returns the matching array
  searchItem = (input) => {
    this.value = input;

    this.onLoading(true);

    // hide button clear
    this.showHiddenButton();

    if (this.howManyCharacters > input.length) {
      this.onLoading();
      return;
    }

    this.onSearch(input)
      .then((result) => {
        // set no result
        this.matches = Array.isArray(result)
          ? [...result]
          : JSON.parse(JSON.stringify(result));

        this.onLoading();
        this.onError();

        if (result.length == 0) {
          this.input.classList.remove('expanded');
          this.setDefault();
          this.noResults(input, this.renderResults);
          this.handleEvents();
        } else if (result.length > 0 || isObject(result)) {
          this.renderResults();
          this.handleEvents();
        }
      })
      .catch(() => {
        this.onLoading();
        this.setDefault();
      });
  };

  onLoading = (type) => {
    this.input.parentNode.classList[type ? 'add' : 'remove'](this.isLoading);
  };

  onError = (type) => {
    this.input.classList[type ? 'add' : 'remove'](this.error);
  };

  // preparation of the list
  handleEvents = () => {
    this.input.addEventListener('keydown', this.handleKeys);
    this.input.addEventListener('click', this.handleShowItems);

    this.resultList.addEventListener('click', this.handleMouse);
    this.resultList.addEventListener('mousemove', this.handleMouse);

    // close expanded items
    document.addEventListener('click', this.handleDocumentClick);
  };

  renderResults = (template) => {
    this.setAttribute(this.input, {
      'aria-expanded': true,
      addClass: 'expanded',
    });

    // add all found records to otput ul
    this.resultList.innerHTML =
      this.matches.length === 0
        ? this.onResults(0, template)
        : this.onResults(this.matches, this.value);
    this.resultList.classList.add(this.isActive);

    this.itemsLi = document.querySelectorAll(`#${this.searchOutputUl} > li`);

    // select first element
    this.selectFirstEl();

    // adding role, tabindex and aria
    this.addAriaLabelToLi();
  };

  handleDocumentClick = ({ target }) => {
    if (target.id !== this.search) {
      this.setDefault();
      return;
    }
  };

  // adding role, tabindex, aria and call handleMouse
  addAriaLabelToLi = () => {
    for (let i = 0; i < this.itemsLi.length; i++) {
      this.setAttribute(this.itemsLi[i], {
        role: 'option',
        tabindex: -1,
        'aria-selected': 'false',
      });
    }
  };

  // select first element
  selectFirstEl = () => {
    this.removeAriaSelected(document.querySelector(`.${this.activeList}`));

    if (!this.selectFirst) {
      return;
    }

    const { firstElementChild } = this.resultList;

    this.setAttribute(firstElementChild, {
      id: `${this.selectedOption}-0`,
      addClass: this.activeList,
      'aria-selected': true,
    });
    this.setAriaDescendant(this.input, `${this.selectedOption}-0`);

    // scrollIntoView when press up/down arrows
    this.followElement(firstElementChild, this.resultList);
  };

  showHiddenButton = () => {
    if (!this.clearButton) {
      return;
    }
    this.clearButton.classList.remove('hidden');
    this.clearButton.addEventListener('click', this.handleClearButton);
  };

  setAttribute = (el, object) => {
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

  // show items when items.length >= 1 and is not empty
  handleShowItems = () => {
    if (this.resultList.textContent.length > 0) {
      this.setAttribute(this.input, {
        'aria-expanded': true,
        addClass: 'expanded',
      });
      this.resultList.classList.add(this.isActive);
      // select first element
      this.selectFirstEl();
    }
  };

  // adding text from the list when li is clicking
  // or adding aria-selected to li elements
  handleMouse = ({ screenX, screenY, target, type }) => {
    const targeClosest = target.closest('li');

    if (!targeClosest) return;

    let lastCurPos = {
      x: 0,
      y: 0,
    };

    if (type === 'click') {
      this.getTextFromLi(targeClosest);
    }
    if (type === 'mousemove') {
      const curPos = {
        x: screenX,
        y: screenY,
      };

      if (curPos.x === lastCurPos.x && curPos.y === lastCurPos.y) {
        return;
      }

      lastCurPos = { x: screenX, y: screenY };
      this.removeAriaSelected(document.querySelector(`.${this.activeList}`));

      this.setAriaSelectedItem(targeClosest);
      this.selectedIndex = this.indexLiSelected(targeClosest);
    }
  };

  // get text from li on enter or click
  getTextFromLi = (element) => {
    if (!element || this.matches.length === 0) {
      return;
    }

    // check if li have children elements
    this.getText = element.firstElementChild
      ? element.firstElementChild
      : element;

    // add text to input
    this.input.value = this.getText.textContent.trim();

    this.removeAriaSelected(element);

    // onSubmit passing text to function
    this.onSubmit(this.matches[this.selectedIndex], this.input.value);

    // set default settings
    this.setDefault();
  };

  // return which li element was selected
  // by hovering the mouse over
  indexLiSelected = (target) =>
    Array.prototype.indexOf.call(this.itemsLi, target);

  // navigating the elements li and enter
  handleKeys = (event) => {
    const { keyCode } = event;
    this.selectedLi = document.querySelector(`.${this.activeList}`);
    switch (keyCode) {
      case this.keyCodes.UP:
      case this.keyCodes.DOWN:
        if (this.matches.length <= 1 && this.selectFirst) {
          return;
        }

        if (keyCode === this.keyCodes.UP) {
          this.selectedIndex -= 1;
          if (this.selectedIndex < 0) {
            this.selectedIndex = this.matches.length - 1;
          }
        } else {
          this.selectedIndex += 1;
          if (this.selectedIndex >= this.matches.length) {
            this.selectedIndex = 0;
          }
        }
        this.removeAriaSelected(this.selectedLi);
        this.setAriaSelectedItem(this.itemsLi[this.selectedIndex]);

        break;
      case this.keyCodes.ENTER:
        this.removeAriaSelected(this.selectedLi);
        this.getTextFromLi(this.selectedLi);

        break;

      case this.keyCodes.TAB:
      case this.keyCodes.ESC:
        // this.removeAriaSelected(this.selectedLi);
        this.setDefault();

        break;
      default:
        break;
    }
  };

  // set aria label on item li
  setAriaSelectedItem = (target) => {
    this.setAttribute(target, {
      id: `${this.selectedOption}-${this.indexLiSelected(target)}`,
      'aria-selected': true,
      addClass: this.activeList,
    });

    this.setAriaDescendant(
      this.input,
      `${this.selectedOption}-${this.indexLiSelected(target)}`
    );

    // scrollIntoView when press up/down arrows
    this.followElement(target, this.resultList);
  };

  // follow active element
  followElement = (element, container) => {
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
  removeAriaSelected = (element) => {
    if (!element) {
      return;
    }
    this.setAttribute(element, {
      id: '',
      removeClass: this.activeList,
      'aria-selected': false,
    });
  };

  // Set aria-activedescendant
  setAriaDescendant = (element, type) => {
    element.setAttribute('aria-activedescendant', type || '');
  };

  // create clear button and
  // removing text from the input field
  createClearButton = () => {
    if (!this.clearButton) return;

    this.clearButton = document.createElement('button');

    this.setAttribute(this.clearButton, {
      id: `auto-clear-${this.search}`,
      class: 'auto-clear hidden',
      type: 'button',
      'aria-label': 'claar text from input',
    });

    this.input.insertAdjacentElement('afterend', this.clearButton);
  };

  // clicking on the clear button
  handleClearButton = ({ target }) => {
    // hides clear button
    target.classList.add('hidden');
    // clear value searchId
    this.input.value = '';
    // set focus
    this.input.focus();
    // remove li from ul
    this.resultList.textContent = '';
    // set default aria
    this.setDefault();
    // remove error if exist
    this.onError();
  };
}

export default Autocomplete;
