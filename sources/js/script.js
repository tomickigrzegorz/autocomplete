import '../scss/style.scss';

// import 'promise-polyfill/src/polyfill'; // enable if you want to support IE
import isPromise from './helpers/isPromise';
import isObject from './helpers/isObject';

class Autosuggest {
  constructor(
    element,
    {
      delay,
      clearButton,
      howManyCharacters,
      instruction,
      onResults,
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

    // set default aria
    this.setDefault();

    this.initialize();

    this.createOutputSearch();
  }

  // default aria
  setDefault = () => {
    this.searchId.setAttribute('aria-owns', 'autocomplete-list');
    this.searchId.setAttribute('aria-expanded', false);
    this.searchId.setAttribute('aria-describedby', 'initInstruction');
    this.searchId.setAttribute('aria-autocomplete', 'both');
    this.searchId.setAttribute('aria-activedescendant', '');
    this.ariaActivedescendant = document.querySelector(
      '[aria-activedescendant]',
    );
    this.searchId.classList.remove('expanded');
  }

  initialize = () => {
    this.createClearButton();

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
      this.hiddenButtonHide();
      this.classSearch.classList.remove(this.isLoading);
      this.outputSearch.classList.remove(this.isActive);
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
        this.outputSearch.classList.remove(this.isActive);
        this.setDefault();
      }

      if (result.length > 0 || isObject(result)) {
        this.outputHtml(matches, input);
      }
    });
  }

  // instruction aria-describedby
  initInstruction = () => {
    const describedby = document.createElement('span');
    describedby.id = 'initInstruction';
    describedby.className = 'init-instruction';
    this.textContent = document.createTextNode(this.instruction);
    this.outputSearch.insertAdjacentElement('afterend', describedby);
    describedby.appendChild(this.textContent);
  }

  // hide output div when click on li or press escape
  closeOutputMatchesList = ({ target }) => {
    if (target.id === this.search) return;

    this.outputSearch.classList.remove(this.isActive);

    // set default settings
    this.setDefault();
  }

  // preparation of the list
  outputHtml(matches, input) {
    this.selected = 0;

    this.searchId.setAttribute('aria-expanded', true);
    this.searchId.classList.add('expanded');
    this.matchList.innerHTML = this.onResults(matches, input);

    this.searchOutpuli = document.getElementById(this.searchOutputUl);
    this.itemsLi = document.querySelectorAll(`#${this.searchOutputUl} > li`);

    this.matchList.classList.add(this.isActive);

    this.hiddenButtonHide();

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

    // close expanded items
    document.addEventListener('click', this.closeOutputMatchesList);
  }

  hiddenButtonHide = () => {
    if (!this.clearButton) return;
    this.clearButton.classList.remove('hidden');
  }

  // show items when items.length >= 1 and is not empty
  showLiItems = () => {
    if (this.matchList.innerText.length > 0) {
      this.searchId.setAttribute('aria-expanded', true);
      this.searchId.classList.add('expanded');
      this.outputSearch.classList.add(this.isActive);
    }
  }

  // adding text from the list when li is clicking
  // or adding aria-selected to li elements
  addTextFromLiToSearchInput = ({ type, target }) => {
    const activeList = document.querySelector(`.${this.activeList}`);

    switch (type) {
      case 'click':
        this.selected = 0;

        this.firstElementFromLi = target.closest('li');

        if (!this.firstElementFromLi) return;

        this.searchId.value = this.firstElementFromLi.firstElementChild.innerText.trim();

        this.dataElements(this.firstElementFromLi.getAttribute('data-elements'));

        this.outputSearch.classList.remove(this.isActive);

        // set default settings
        this.setDefault();

        // onSubmit
        this.onSubmit(
          this.firstElementFromLi.firstElementChild.innerText.trim(),
        );
        break;

      case 'mouseenter':
        this.selected = 0;
        if (activeList) activeList.classList.remove(this.activeList);
        target.id = this.selectedOption;
        target.setAttribute('aria-selected', true);
        target.classList.add(this.activeList);
        this.ariaactivedescendant(
          this.ariaActivedescendant,
          this.selectedOption,
        );
        break;

      case 'mouseleave':
        this.selected = 0;
        if (activeList) activeList.classList.remove(this.activeList);
        target.id = '';
        target.setAttribute('aria-selected', false);
        target.classList.remove(this.activeList);
        this.ariaactivedescendant(this.ariaActivedescendant);
        break;

      default:
        break;
    }
  }

  // the part responsible for appending json to the search
  // field use - https://github.com/tomik23/Leaflet.Autocomplete
  dataElements = (item) => {
    if (!item) return;
    this.searchId.setAttribute('data-elements', item);
  }

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
        this.setAriaSelectedItem(this.selected - 1);

        break;
      case this.keyCodes.DOWN:
        this.selected -= 1;
        if (this.selected <= 0) {
          this.selected = this.itemsLi.length;
        }
        this.setAriaSelectedItem(this.selected - 1);

        break;
      case this.keyCodes.ENTER:
        this.searchId.value = this.selectedLi.firstElementChild.innerText.trim();

        this.dataElements(this.selectedLi.getAttribute('data-elements'));

        this.outputSearch.classList.remove(this.isActive);

        this.setDefault();

        // onSubmit
        this.onSubmit(this.selectedLi.firstElementChild.innerText.trim());
        break;
      case this.keyCodes.ESC:
        this.outputSearch.classList.remove(this.isActive);

        this.setDefault();
        break;
      default:
        break;
    }

    if (this.selectedLi) this.removeAriaSelectedItem();
  }

  // set aria label on item li
  setAriaSelectedItem = (number) => {
    this.itemsLi[number].id = this.selectedOption;
    this.itemsLi[number].setAttribute('aria-selected', true);
    this.itemsLi[number].classList.add(this.activeList);

    this.ariaactivedescendant(this.ariaActivedescendant, this.selectedOption);
  }

  // remove aria label from item li
  removeAriaSelectedItem = () => {
    this.selectedLi.id = '';
    this.selectedLi.setAttribute('aria-selected', false);
    this.selectedLi.classList.remove(this.activeList);

    this.ariaactivedescendant(this.ariaActivedescendant);
  }

  // Set aria-activedescendant
  ariaactivedescendant = (element, type) => {
    element.setAttribute('aria-activedescendant', type || '');
  }

  // create clear button and
  // removing text from the input field
  createClearButton = () => {
    if (!this.clearButton) return;

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
    this.outputSearch.innerHTML = '';
    // set default aria
    this.setDefault();
  }
}

export default Autosuggest;
