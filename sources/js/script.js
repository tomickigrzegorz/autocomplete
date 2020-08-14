// import 'promise-polyfill/src/polyfill'; // enable if you want to support IE11
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
      onSubmit = () => { },
    },
  ) {
    this.search = element;
    this.searchId = document.getElementById(this.search);
    this.instruction = instruction
      || 'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.';
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
    this.searchOutputUl = 'autocomplete-list';
    this.isLoading = 'auto-is-loading';
    this.isActive = 'auto-is-active';
    this.activeList = 'selected';
    this.selectedOption = 'selectedOption';

    this.keyCodes = {
      ESC: 27,
      ENTER: 13,
      UP: 40,
      DOWN: 38,
      TAB: 9,
    };

    this.initialize();

    this.createOutputSearch();

    // set default aria
    this.setDefault();
  }

  // default aria
  setDefault = () => {
    this.searchId.setAttribute('aria-owns', 'autocomplete-list');
    this.searchId.setAttribute('aria-expanded', false);
    this.searchId.setAttribute('aria-describedby', 'initInstruction');
    this.searchId.setAttribute('aria-autocomplete', 'both');
    this.searchId.setAttribute('aria-activedescendant', '');
    this.searchId.setAttribute('role', 'combobox');
    this.ariaActivedescendant = document.querySelector(
      '[aria-activedescendant]',
    );
    this.searchId.classList.remove('expanded');

    if (hasClass(this.matchList, this.isActive)) {
      this.outputSearch.classList.remove(this.isActive);
    }
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
        '',
      );

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.searchItem(this.escapedChar.trim());
      }, this.delay);
    });
  }

  // create output-list and put after search input
  createOutputSearch = () => {
    this.outputSearch = document.createElement('ul');
    this.outputSearch.id = this.searchOutputUl;
    this.outputSearch.className = 'auto-output-search';
    this.outputSearch.tabIndex = 0;
    this.outputSearch.setAttribute('role', 'listbox');

    this.searchId.parentNode.insertBefore(
      this.outputSearch,
      this.searchId.nextSibling,
    );

    this.matchList = document.getElementById(this.searchOutputUl);
    // set instruction
    this.initInstruction();
  }

  // The async function gets the text from the search
  // and returns the matching array
  searchItem = (input) => {
    this.searchId.parentNode.classList.add(this.isLoading);

    // console.log(this.howManny, input.length);
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
  }

  // instruction aria-describedby
  initInstruction = () => {
    this.describedby = document.createElement('span');
    this.describedby.id = 'initInstruction';
    this.describedby.className = 'init-instruction';
    this.textContent = document.createTextNode(this.instruction);
    this.outputSearch.insertAdjacentElement('afterend', this.describedby);
    this.describedby.appendChild(this.textContent);
  }

  // hide output div when click on li or press escape
  closeOutputMatchesList = ({ target }) => {
    if (target.id === this.search) return;

    // set default settings
    this.setDefault();
  }

  // preparation of the list
  outputHtml(matches, input) {
    // set default index
    this.selected = 0;

    this.searchId.setAttribute('aria-expanded', true);
    this.searchId.classList.add('expanded');
    this.matchList.innerHTML = this.onResults(matches, input);

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
    for (let i = 0; i < this.itemsLi.length; i++) {
      this.itemsLi[i].addEventListener(
        'mouseenter',
        this.addTextFromLiToSearchInput,
      );
      this.itemsLi[i].addEventListener(
        'mouseleave',
        this.addTextFromLiToSearchInput,
      );
    }

    // select first li element
    if (this.selectFirst) {
      this.selectFirstItem();
    };

    // hide button clear
    this.hiddenButtonHide();
  }

  // select first element
  selectFirstItem = () => {
    const { firstElementChild } = document.getElementById(this.searchOutputUl);
    firstElementChild.id = `${this.selectedOption}-1`;
    firstElementChild.setAttribute('aria-selected', true);
    firstElementChild.classList.add(this.activeList);

    this.ariaactivedescendant(
      this.ariaActivedescendant,
      `${this.selectedOption}-1`,
    );

    // set default index
    this.selected = 1;
  }

  hiddenButtonHide = () => {
    if (!this.clearButton) return;
    this.clearButton.classList.remove('hidden');
  }

  // show items when items.length >= 1 and is not empty
  showLiItems = () => {
    if (this.matchList.textContent.length > 0) {
      this.searchId.setAttribute('aria-expanded', true);
      this.searchId.classList.add('expanded');
      this.outputSearch.classList.add(this.isActive);
    }
  }

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
        this.mouseentermouseleave(target, type === 'mouseenter');
        break;

      default:
        break;
    }
  }

  // event on mouse
  mouseentermouseleave = (target, type) => {
    this.checkActiveListExist = document.querySelector(`.${this.activeList}`);
    if (this.checkActiveListExist) this.checkActiveListExist.classList.remove(this.activeList);

    target.id = type ? `${this.selectedOption}-${this.indexLiSelected(target)}` : '';
    target.setAttribute('aria-selected', !!type);

    // add or remove class from selected menu
    target.classList[type ? 'add' : 'remove'](this.activeList);

    this.ariaactivedescendant(
      this.ariaActivedescendant,
      type ? `${this.selectedOption}-${this.indexLiSelected(target)}` : null,
    );

    // return which li element
    // was selected and set
    this.selected = type ? this.indexLiSelected(target) : 0;
  }

  // get text from li on enter or mouseenter
  getTextFromLi = (element) => {
    // check if li have children elements
    this.getText = element.firstElementChild
      ? element.firstElementChild
      : element;

    // add text to input
    this.searchId.value = this.getText.textContent.trim();

    // set default settings
    this.setDefault();

    // onSubmit passing text to function
    this.onSubmit(this.getText.textContent.trim());

    // the part responsible for appending json to the search
    // field use - https://github.com/tomik23/Leaflet.Autocomplete
    if (element.hasAttribute('data-elements')) {
      this.dataElements(element.getAttribute('data-elements'));
    }
  }

  // return which li element was selected
  // by hovering the mouse over
  indexLiSelected = (target) => Array.prototype.indexOf.call(this.itemsLi, target) + 1;

  // navigating the elements li and enter
  handelEvent = ({ keyCode }) => {
    this.selectedLi = document.querySelector(`.${this.activeList}`);

    if (this.searchId.getAttribute('aria-expanded') === 'false') return;

    switch (keyCode) {
      case this.keyCodes.UP:
        this.selected += 1;
        if (this.selected > this.itemsLi.length) {
          this.selected = 1;
        }
        this.setAriaSelectedItem(this.itemsLi[this.selected - 1]);
        break;
      case this.keyCodes.DOWN:
        this.selected -= 1;
        if (this.selected <= 0) {
          this.selected = this.itemsLi.length;
        }
        this.setAriaSelectedItem(this.itemsLi[this.selected - 1]);

        break;
      case this.keyCodes.ENTER:

        this.getTextFromLi(this.selectedLi);

        break;

      case this.keyCodes.ESC:

        this.setDefault();

        break;
      default:
        break;
    }

    this.removeAriaSelectedItem();
  }

  // set aria label on item li
  setAriaSelectedItem = (target) => {
    target.id = `${this.selectedOption}-${this.indexLiSelected(target)}`;
    target.setAttribute('aria-selected', true);
    target.classList.add(this.activeList);

    this.ariaactivedescendant(this.ariaActivedescendant, `${this.selectedOption}-${this.indexLiSelected(target)}`);

    // scrollIntoView when press up/down arrows
    if (this.scrollIntoView) {
      setTimeout(() => {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }, 0);
    }
  }

  // remove aria label from item li
  removeAriaSelectedItem = () => {
    if (!this.selectedLi) return;
    this.selectedLi.id = '';
    this.selectedLi.classList.remove(this.activeList);
    this.selectedLi.setAttribute('aria-selected', false);
  }

  // Set aria-activedescendant
  ariaactivedescendant = (element, type) => {
    element.setAttribute('aria-activedescendant', type || '');
  }

  // create clear button and
  // removing text from the input field
  createClearButton = () => {
    this.clearButton = document.createElement('button');
    this.clearButton.id = `auto-clear-${this.search}`;
    this.clearButton.classList.add('auto-clear', 'hidden');
    this.clearButton.setAttribute('type', 'button');
    this.clearButton.setAttribute('aria-label', 'claar text from input');

    this.searchId.insertAdjacentElement('afterend', this.clearButton);

    this.clearButton.addEventListener('click', this.handleClearButton);
  }

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
  }

  // the part responsible for appending json to the search
  // field use - https://github.com/tomik23/Leaflet.Autocomplete
  dataElements = (item) => {
    if (!item) return;
    this.searchId.setAttribute('data-elements', item);
  }
}

export default Autosuggest;
