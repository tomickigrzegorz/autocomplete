// import 'promise-polyfill/src/polyfill'; // first install and enable if you want to support IE11
// import './helpers/element-closest-polyfill.js'; // enable if you want to support IE11

import isPromise from './helpers/isPromise';
import isObject from './helpers/isObject';
import hasClass from './helpers/hasClass';

class Autosuggest {
  constructor(
    element,
    {
      delay,
      clearButton,
      howManyCharacters,
      scrollIntoView,
      instruction,
      onResults,
      selectFirst,
      onSearch,
      onSubmit = () => {},
    }
  ) {
    this.search = element;
    this.searchId = document.getElementById(this.search);
    this.instruction =
      instruction ||
      'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.';
    this.onResults = onResults;
    this.onSubmit = onSubmit;
    this.onSearch = isPromise(onSearch)
      ? onSearch
      : (value) => Promise.resolve(onSearch(value));
    this.delay = delay || 1000;
    this.howManyCharacters = howManyCharacters || 2;
    this.clearButton = clearButton || false;
    this.selectFirst = selectFirst || false;
    this.scrollIntoView = scrollIntoView || false;

    // default config
    this.searchOutputUl = `${this.search}-list`;
    this.isLoading = 'auto-is-loading';
    this.isActive = 'auto-is-active';
    this.activeList = 'selected';
    this.selectedOption = 'selectedOption';

    this.keyCodes = {
      ESC: 27,
      ENTER: 13,
      UP: 38,
      DOWN: 40,
      TAB: 9,
    };

    this.initialize();

    this.createOutputSearch();

    // set default aria
    this.setDefault();
  }

  initialize = () => {
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
  createOutputSearch = () => {
    this.outputSearch = document.createElement('ul');
    this.outputSearch.id = this.searchOutputUl;
    this.outputSearch.className = 'auto-output-search';
    this.outputSearch.tabIndex = -1;
    this.outputSearch.setAttribute('role', 'listbox');

    this.searchId.parentNode.insertBefore(
      this.outputSearch,
      this.searchId.nextSibling
    );

    this.matchList = document.getElementById(this.searchOutputUl);
    // set instruction
    this.initInstruction();
  };

  // default aria
  setDefault = () => {
    this.searchId.setAttribute('aria-owns', `${this.search}-list`);
    this.searchId.setAttribute('aria-expanded', false);
    this.searchId.setAttribute(
      'aria-describedby',
      `${this.search}-initInstruction`
    );
    this.searchId.setAttribute('aria-autocomplete', 'both');
    this.searchId.setAttribute('aria-activedescendant', '');
    this.searchId.setAttribute('role', 'combobox');

    this.searchId.classList.remove('expanded');

    if (hasClass(this.matchList, this.isActive)) {
      this.outputSearch.classList.remove(this.isActive);
    }

    this.activeElement = document.querySelector(`.${this.activeList}`);

    if (this.activeElement) this.actionsOnTheElementLi(this.activeElement, '');
  };

  // The async function gets the text from the search
  // and returns the matching array
  searchItem = (input) => {
    this.searchId.parentNode.classList.add(this.isLoading);

    if (this.howManyCharacters > input.length) {
      this.classSearch.classList.remove(this.isLoading);
      this.hiddenButtonHide();
      this.setDefault();
      return;
    }

    this.onSearch(input).then((result) => {
      // set no result
      const matches = Array.isArray(result)
        ? [...result]
        : JSON.parse(JSON.stringify(result));

      this.classSearch.classList.remove(this.isLoading);

      if (result.length === 0) {
        this.hiddenButtonHide();
        this.searchId.classList.remove('expanded');

        this.setDefault();
      }

      if (result.length > 0 || isObject(result)) {
        this.outputHtml(matches, input);
      }
    });
  };

  // instruction aria-describedby
  initInstruction = () => {
    this.describedby = document.createElement('span');
    this.describedby.id = `${this.search}-initInstruction`;
    this.describedby.className = 'init-instruction';

    this.textContent = document.createTextNode(this.instruction);
    this.outputSearch.insertAdjacentElement('afterend', this.describedby);
    this.describedby.appendChild(this.textContent);
  };

  // hide output div when click on li or press escape
  closeOutputMatchesList = ({ target }) => {
    if (target.id === this.search) return;

    // move the view item to the first item
    this.outputSearch.scrollTop = 0;

    // set default settings
    this.setDefault();
  };

  // preparation of the list
  outputHtml = (matches, input) => {
    // set default index
    this.selected = 0;

    this.searchId.setAttribute('aria-expanded', true);
    this.searchId.classList.add('expanded');

    // add all found records to otput ul
    this.matchList.innerHTML = this.onResults(matches, input);

    // get all li
    this.itemsLi = document.querySelectorAll(`#${this.searchOutputUl} > li`);

    this.matchList.classList.add(this.isActive);

    // close expanded items
    document.addEventListener('click', this.closeOutputMatchesList);

    // move with the up / down arrows
    this.searchId.addEventListener('keydown', this.handelEvent);

    // showing results on clicking on the input field
    // if these results exist
    this.searchId.addEventListener('click', this.showLiItems);

    // clicking will add the text from the first
    // element to the input field
    this.matchList.addEventListener('click', this.addTextFromLiToSearchInput);

    // adding aria-selected on mouse event
    // if (this.itemsLi.length >= 1) {
    for (let i = 0; i < this.itemsLi.length; i++) {
      this.itemsLi[i].addEventListener(
        'mouseenter',
        this.addTextFromLiToSearchInput
      );
      this.itemsLi[i].addEventListener(
        'mouseleave',
        this.addTextFromLiToSearchInput
      );
      // }
    }

    // select first li element
    if (this.selectFirst) {
      this.selectFirstItem();
    }

    // hide button clear
    this.hiddenButtonHide();
  };

  // select first element
  selectFirstItem = () => {
    const { firstElementChild } = document.getElementById(this.searchOutputUl);
    firstElementChild.id = `${this.selectedOption}-1`;
    firstElementChild.setAttribute('aria-selected', true);
    firstElementChild.classList.add(this.activeList);

    this.ariaactivedescendant(this.searchId, `${this.selectedOption}-1`);

    // set default index
    this.selected = 1;
  };

  hiddenButtonHide = () => {
    if (this.clearButton) {
      this.clearButton.classList.remove('hidden');
      this.clearButton.addEventListener('click', this.handleClearButton);
    }
  };

  // show items when items.length >= 1 and is not empty
  showLiItems = () => {
    if (this.matchList.textContent.length > 0) {
      this.searchId.setAttribute('aria-expanded', true);
      this.searchId.classList.add('expanded');
      this.outputSearch.classList.add(this.isActive);
      this.selectFirstItem();
    }
  };

  // adding text from the list when li is clicking
  // or adding aria-selected to li elements
  addTextFromLiToSearchInput = ({ type, target }) => {
    switch (type) {
      case 'click':
        this.getTextFromLi(target.closest('li'));
        // set default index
        this.selected = 0;
        break;

      case 'mouseenter':
      case 'mouseleave':
        this.actionsOnTheElementLi(target, type === 'mouseenter');
        break;

      default:
        break;
    }
  };

  // event on mouse
  actionsOnTheElementLi = (target, type) => {
    // reset previous active li
    this.checkActiveListExist = document.querySelector(`.${this.activeList}`);
    if (this.checkActiveListExist) {
      this.checkActiveListExist.classList.remove(this.activeList);
      this.checkActiveListExist.setAttribute('aria-selected', 'fasle');
      this.checkActiveListExist.id = '';
    }

    target.id = type
      ? `${this.selectedOption}-${this.indexLiSelected(target)}`
      : '';
    target.setAttribute('aria-selected', !!type);

    // add or remove class from selected menu
    target.classList[type ? 'add' : 'remove'](this.activeList);

    this.ariaactivedescendant(
      this.searchId,
      type ? `${this.selectedOption}-${this.indexLiSelected(target)}` : null
    );

    // return which li element
    // was selected and set
    this.selected = type ? this.indexLiSelected(target) : 0;
  };

  // get text from li on enter or mouseenter
  getTextFromLi = (element) => {
    // check if li have children elements
    this.getText = element.firstElementChild
      ? element.firstElementChild
      : element;

    // add text to input
    this.searchId.value = this.getText.textContent.trim();

    // move the view item to the first item
    this.outputSearch.scrollTop = 0;

    // set default settings
    this.setDefault();

    // onSubmit passing text to function
    this.onSubmit(this.getText.textContent.trim());

    // the part responsible for appending json to the search
    // field use - https://github.com/tomik23/Leaflet.Autocomplete
    if (element.hasAttribute('data-elements')) {
      this.dataElements(element.getAttribute('data-elements'));
    }
  };

  // return which li element was selected
  // by hovering the mouse over
  indexLiSelected = (target) =>
    Array.prototype.indexOf.call(this.itemsLi, target) + 1;

  // navigating the elements li and enter
  handelEvent = (event) => {
    const { keyCode } = event;
    this.selectedLi = document.querySelector(`.${this.activeList}`);

    switch (keyCode) {
      case this.keyCodes.UP:
      case this.keyCodes.DOWN:
        if (this.itemsLi.length <= 1 && this.selectFirst) return;

        if (keyCode === this.keyCodes.UP) {
          this.selected -= 1;
          if (this.selected <= 0) {
            this.selected = this.itemsLi.length;
          }
        } else {
          this.selected += 1;
          if (this.selected > this.itemsLi.length) {
            this.selected = 1;
          }
        }

        this.setAriaSelectedItem(this.itemsLi[this.selected - 1]);
        this.removeAriaSelectedItem();
        event.preventDefault();

        break;
      case this.keyCodes.ENTER:
        if (this.selectedLi) {
          this.getTextFromLi(this.selectedLi);
        } else {
          this.setDefault();
        }

        break;

      case this.keyCodes.TAB:
      case this.keyCodes.ESC:
        this.setDefault();

        break;
      default:
        break;
    }
  };

  // set aria label on item li
  setAriaSelectedItem = (target) => {
    target.id = `${this.selectedOption}-${this.indexLiSelected(target)}`;
    target.setAttribute('aria-selected', true);
    target.classList.add(this.activeList);

    this.ariaactivedescendant(
      this.searchId,
      `${this.selectedOption}-${this.indexLiSelected(target)}`
    );

    // scrollIntoView when press up/down arrows
    if (this.scrollIntoView) {
      this.followActiveElement(target, this.outputSearch);
    }
  };

  // follow active element
  followActiveElement = (element, container) => {
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
  removeAriaSelectedItem = () => {
    if (!this.selectedLi) return;
    this.selectedLi.id = '';
    this.selectedLi.classList.remove(this.activeList);
    this.selectedLi.setAttribute('aria-selected', false);
  };

  // Set aria-activedescendant
  ariaactivedescendant = (element, type) => {
    element.setAttribute('aria-activedescendant', type || '');
  };

  // create clear button and
  // removing text from the input field
  createClearButton = () => {
    this.clearButton = document.createElement('button');
    this.clearButton.id = `auto-clear-${this.search}`;
    this.clearButton.classList.add('auto-clear', 'hidden');
    this.clearButton.setAttribute('type', 'button');
    this.clearButton.setAttribute('aria-label', 'claar text from input');

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
  };

  // the part responsible for appending json to the search
  // field use - https://github.com/tomik23/Leaflet.Autocomplete
  dataElements = (item) => {
    this.searchId.setAttribute('data-elements', item);
  };
}

export default Autosuggest;
