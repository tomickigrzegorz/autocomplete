import isPromise from './helpers/isPromise';
import isObject from './helpers/isObject';

class Autosuggest {
  constructor(
    element,
    {
      delay,
      clearButton,
      howManyCharacters,
      onResults,
      selectFirst,
      onSearch,
      onSubmit = () => { },
    }
  ) {
    this.search = element;
    this.searchId = document.getElementById(this.search);
    this.onResults = onResults;
    this.onSubmit = onSubmit;
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
    this.outputSearch();

    // default aria
    this.setDefault();

    if (this.clearButton) this.createClearButton();

    let timeout = null;

    this.searchId.addEventListener('input', ({ target }) => {
      this.valueFromSearch = target.value;
      this.classSearch = target.parentNode;

      this.escapedChar = this.valueFromSearch.replace(
        // eslint-disable-next-line no-useless-escape
        /[`~!@#$%^&*()_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/g,
        ''
      );
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.searchItem(this.escapedChar.trim());
      }, this.delay);
    });
  };

  // create output-list and put after search input
  outputSearch = () => {
    this.outputSearch = document.createElement('ul');

    this.setAttribute(this.outputSearch, {
      id: this.searchOutputUl,
      addClass: 'auto-output-search',
      tabIndex: 0,
      role: 'listbox',
    });

    this.searchId.parentNode.insertBefore(
      this.outputSearch,
      this.searchId.nextSibling
    );

    this.matchList = document.getElementById(this.searchOutputUl);
  };

  // default aria
  setDefault = () => {
    this.setAttribute(this.searchId, {
      'aria-owns': `${this.search}-list`,
      'aria-expanded': false,
      'aria-autocomplete': 'both',
      'aria-activedescendant': '',
      role: 'combobox',
      removeClass: 'expanded',
    });

    if (this.matchList.classList.contains(this.isActive)) {
      this.outputSearch.classList.remove(this.isActive);
    }

    // move the view item to the first item
    this.outputSearch.scrollTop = 0;
  };

  // The async function gets the text from the search
  // and returns the matching array
  searchItem = (input) => {
    this.searchId.parentNode.classList.add(this.isLoading);

    // hide button clear
    this.showHiddenButton();

    if (this.howManyCharacters > input.length) {
      this.classSearch.classList.remove(this.isLoading);
      this.showHiddenButton();
      this.setDefault();
      return;
    }

    this.onSearch(input)
      .then((result) => {
        // set no result
        const matches = Array.isArray(result)
          ? [...result]
          : JSON.parse(JSON.stringify(result));

        this.classSearch.classList.remove(this.isLoading);

        if (result.length === 0) {
          this.searchId.classList.remove('expanded');
          this.showHiddenButton();
          this.setDefault();
        }

        if (result.length > 0 || isObject(result)) {
          this.outputHtml(matches, input);
        }

        this.searchId.classList.remove(this.error);
      })
      .catch(() => {
        this.searchId.parentNode.classList.remove(this.isLoading);
        this.searchId.classList.add(this.error);
        this.showHiddenButton();
        this.setDefault();
      });
  };

  // preparation of the list
  outputHtml = (matches, input) => {
    // set default index
    this.selectedIndex = 0;

    this.matches = matches;

    this.setAttribute(this.searchId, {
      'aria-expanded': true,
      addClass: 'expanded',
    });

    // add all found records to otput ul
    this.matchList.innerHTML = this.onResults(this.matches, input);
    this.matchList.classList.add(this.isActive);
    this.matchList.addEventListener('click', this.textToInput);

    this.searchId.addEventListener('keydown', this.handleEvent);
    this.searchId.addEventListener('click', this.showLiItems);

    this.itemsLi = document.querySelectorAll(`#${this.searchOutputUl} > li`);

    // close expanded items
    document.addEventListener('click', (event) => {
      if (event.target.id !== this.search) {
        this.setDefault();
      }
    });

    // adding role, tabindex and aria
    this.mouseEvent();

    // select first element
    if (this.selectFirst) {
      this.selectFirstEl();
    }
  };

  // adding role, tabindex, aria and call textToInput
  mouseEvent = () => {
    for (let i = 0; i < this.itemsLi.length; i++) {
      this.setAttribute(this.itemsLi[i], {
        role: 'option',
        tabindex: -1,
        'aria-selected': 'false',
      });
      this.itemsLi[i].addEventListener('mousemove', this.textToInput);
    }
  };

  // select first element
  selectFirstEl = () => {
    this.selectedIndex = 1;
    this.removeAriaSelected(document.querySelector(`.${this.activeList}`));

    const { firstElementChild } = this.outputSearch;

    this.setAttribute(firstElementChild, {
      id: `${this.selectedOption}-0`,
      addClass: this.activeList,
      'aria-selected': true,
    });

    this.ariaDescendant(this.searchId, `${this.selectedOption}-0`);

    // scrollIntoView when press up/down arrows
    this.followElement(firstElementChild, this.outputSearch);
  };

  showHiddenButton = () => {
    if (!this.clearButton) return;
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
  showLiItems = () => {
    if (this.matchList.textContent.length > 0) {
      this.setAttribute(this.searchId, {
        'aria-expanded': true,
        addClass: 'expanded',
      });
      this.outputSearch.classList.add(this.isActive);
      this.selectFirstEl();
    }
  };

  // adding text from the list when li is clicking
  // or adding aria-selected to li elements
  textToInput = ({ screenX, screenY, target, type }) => {
    const targeClosest = target.closest('li');
    let lastCursorPos = {
      x: 0,
      y: 0,
    };

    if (type === 'click') {
      this.getTextFromLi(targeClosest);
    } else if (type === 'mousemove') {
      const currentCursorPos = {
        x: screenX,
        y: screenY,
      };

      if (
        currentCursorPos.x === lastCursorPos.x &&
        currentCursorPos.y === lastCursorPos.y
      ) {
        return;
      }
      lastCursorPos = { x: screenX, y: screenY };
      this.removeAriaSelected(document.querySelector(`.${this.activeList}`));

      this.setAriaSelectedItem(targeClosest);
      this.selectedIndex = this.indexLiSelected(targeClosest) + 1;
    }
  };

  // get text from li on enter or click
  getTextFromLi = (element) => {
    if (!element) return;

    // check if li have children elements
    this.getText = element.firstElementChild
      ? element.firstElementChild
      : element;

    // add text to input
    this.searchId.value = this.getText.textContent.trim();

    this.removeAriaSelected(element);

    // onSubmit passing text to function
    this.onSubmit(this.matches[this.selectedIndex - 1], this.searchId.value);

    // set default settings
    this.setDefault();
  };

  // return which li element was selected
  // by hovering the mouse over
  indexLiSelected = (target) =>
    Array.prototype.indexOf.call(this.itemsLi, target);

  // navigating the elements li and enter
  handleEvent = (event) => {
    const { keyCode } = event;
    this.selectedLi = document.querySelector(`.${this.activeList}`);

    switch (keyCode) {
      case this.keyCodes.UP:
      case this.keyCodes.DOWN:
        if (this.matches.length <= 1 && this.selectFirst) return;
        if (keyCode === this.keyCodes.UP) {
          this.selectedIndex -= 1;
          if (this.selectedIndex <= 0) {
            this.selectedIndex = this.matches.length;
          }
        } else {
          this.selectedIndex += 1;
          if (this.selectedIndex > this.matches.length) {
            this.selectedIndex = 1;
          }
        }

        this.removeAriaSelected(this.selectedLi);
        this.setAriaSelectedItem(this.itemsLi[this.selectedIndex - 1]);

        break;
      case this.keyCodes.ENTER:
        this.removeAriaSelected(this.selectedLi);
        this.getTextFromLi(this.selectedLi);

        break;

      case this.keyCodes.TAB:
      case this.keyCodes.ESC:
        this.removeAriaSelected(this.selectedLi);
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

    this.ariaDescendant(
      this.searchId,
      `${this.selectedOption}-${this.indexLiSelected(target)}`
    );

    // scrollIntoView when press up/down arrows
    this.followElement(target, this.outputSearch);
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
    if (!element) return;
    this.setAttribute(element, {
      id: '',
      removeClass: this.activeList,
      'aria-selected': false,
    });
  };

  // Set aria-activedescendant
  ariaDescendant = (element, type) => {
    element.setAttribute('aria-activedescendant', type || '');
  };

  // create clear button and
  // removing text from the input field
  createClearButton = () => {
    this.clearButton = document.createElement('button');

    this.setAttribute(this.clearButton, {
      id: `auto-clear-${this.search}`,
      class: 'auto-clear hidden',
      type: 'button',
      'aria-label': 'claar text from input',
    });

    this.searchId.insertAdjacentElement('afterend', this.clearButton);
  };

  // clicking on the clear button
  handleClearButton = ({ target }) => {
    // hides clear button
    target.classList.add('hidden');
    // clear value searchId
    this.searchId.value = '';
    // set focus
    this.searchId.focus();
    // remove li from ul
    this.outputSearch.textContent = '';
    // set default aria
    this.setDefault();
    // remove error if exist
    this.searchId.classList.remove(this.error);
  };
}

export default Autosuggest;
