import '../scss/style.scss';

// import 'promise-polyfill/src/polyfill'; // enable if you want to support IE
import 'whatwg-fetch';
import removeClass from './helpers/removeClass';
import addClass from './helpers/addClass';

class Autosuggest {
  constructor(
    element,
    {
      delay,
      dataAPI,
      placeholderError,
      htmlTemplate,
      noResult,
      howManyCharacters,
      clearButton,
      onSubmit = () => { },
    }
  ) {
    this.search = element;
    this.searchId = document.getElementById(this.search);
    this.placeholderError = placeholderError || 'something went wrong...';
    this.path = dataAPI.path;
    this.searchLike = dataAPI.searchLike;
    this.htmlTemplate = htmlTemplate;
    this.onSubmit = onSubmit;
    this.delay = delay || 500;
    this.clearButton = clearButton || false;
    this.noResult = noResult || false;
    this.howManyCharacters = howManyCharacters || 1;

    // default config
    this.searchOutputUl = 'autocomplete-list';
    this.isLoading = 'auto-is-loading';
    this.isActive = 'auto-is-active';
    this.errorClass = 'auto-error';
    this.activeList = 'selected';
    this.selectedOption = 'selectedOption';
    this.keyCode = {
      esc: 27,
      enter: 13,
      keyUp: 40,
      keyDown: 38,
    };

    this.setDefaultAriaLabel();
    this.initialSearch();
    this.createOutputSearch(this.search);

    this.ariaActivedescendant = document.querySelector(
      '[aria-activedescendant]'
    );
  }

  initialSearch() {
    let timeout = null;

    this.searchId.addEventListener('input', (e) => {
      this.valueFromSearch = e.target.value;
      this.classSearch = e.target.parentNode;

      const escapedChar = this.valueFromSearch.replace(
        // eslint-disable-next-line no-useless-escape
        /[`~!@#$%^&*()_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/g,
        ''
      );

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (
          escapedChar.length >= this.howManyCharacters &&
          escapedChar.length > 0
        ) {
          if (escapedChar.trim().length <= 0) return;
          addClass(this.searchId.parentNode, this.isLoading);
          this.searchItem(escapedChar.trim());
        } else {
          this.searchId.classList.remove('expanded');
          this.setDefaultAriaLabel();
          removeClass(this.matchList, this.isActive);
        }
      }, this.delay);

      removeClass(this.searchId, this.errorClass);
    });
  }

  // default aria
  setDefaultAriaLabel() {
    this.searchId.setAttribute('aria-owns', 'autocomplete-list');
    this.searchId.setAttribute('aria-expanded', false);
    this.searchId.setAttribute('aria-describedby', 'initInstruction');
    this.searchId.setAttribute('aria-autocomplete', 'both');
    this.searchId.setAttribute('aria-activedescendant', '');
  }

  // create output-list and put after search input
  createOutputSearch() {
    this.outputAfterSearch = `${this.search}-auto`;
    this.outputSearch = document.createElement('div');
    this.outputSearch.id = this.outputAfterSearch;
    this.outputSearch.className = 'auto-output-search';
    this.searchId.parentNode.insertBefore(
      this.outputSearch,
      this.searchId.nextSibling
    );
    this.outputSearch.insertAdjacentElement('afterend', this.initInstruction());
    this.matchList = document.getElementById(this.outputAfterSearch);
  }

  // hide output div when click on li or press escape
  closeOutputMatchesList() {
    document.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemActive = document.querySelector(`.${this.isActive}`);
      if (e.target.id !== this.search) {
        if (itemActive) {
          removeClass(itemActive, this.isActive);
          this.searchId.setAttribute('aria-expanded', false);
          this.searchId.classList.remove('expanded');
          this.ariaActivedescendant.setAttribute('aria-activedescendant', '');
        }
      }
    });
    // close outpu list when press ESC
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === this.keyCode.esc) {
        const itemActive = document.querySelector(`.${this.isActive}`);
        if (itemActive) {
          removeClass(itemActive, this.isActive);
          this.searchId.setAttribute('aria-expanded', false);
          this.searchId.classList.remove('expanded');
          this.ariaActivedescendant.setAttribute('aria-activedescendant', '');
        }
      }
    });
  }

  // preparation of the list
  outputHtml(matches) {
    const html = this.htmlTemplate(matches);
    if (html !== '') {
      this.searchId.setAttribute('aria-expanded', true);
      this.searchId.classList.add('expanded');
      this.matchList.innerHTML = `<ul id="${this.searchOutputUl}" role="listbox" tabindex="0">${html}</ul>`;
      addClass(this.matchList, this.isActive);

      this.addTextFromLiToSearchInput();
      this.mouseActiveListItem();
      this.closeOutputMatchesList();
      this.keyUpInsideUl();
    } else if (html === '' && this.noResult) {
      this.searchId.setAttribute('aria-expanded', true);
      this.searchId.classList.add('expanded');
      this.matchList.innerHTML = `<ul id="${this.searchOutputUl}" role="listbox" tabindex="0"><li class="loupe no-result">${this.noResult}</li></ul>`;
      addClass(this.matchList, this.isActive);
      this.closeOutputMatchesList();
    }
  }

  // instruction aria-describedby
  initInstruction() {
    const describedby = document.createElement('span');
    describedby.id = 'initInstruction';
    describedby.className = 'init-instruction';
    const textContent = document.createTextNode(
      'When autocomplete results are available use up and down arrows to review and enter to select.  Touch device users, explore by touch or with swipe gestures.'
    );
    describedby.appendChild(textContent);
    return describedby;
  }

  // adding text from list when enter
  addTextFromLiToSearchInput() {
    document.addEventListener('keyup', (e) => {
      e.preventDefault();
      if (this.valueFromSearch.length) {
        const itemActive = document.querySelector(`li.${this.activeList} > *`);
        if (e.keyCode === this.keyCode.enter && itemActive != null) {
          const item = e.target;
          this.dataElements(itemActive.parentElement);
          document.getElementById(item.id).value = itemActive.innerText.trim();

          // onSubmit
          this.onSubmit(itemActive.innerText.trim());

          removeClass(item.nextSibling, this.isActive);
          removeClass(itemActive, this.activeList);
          removeClass(this.outputSearch, this.isActive);

          // set default
          this.searchId.setAttribute('aria-expanded', false);
          this.searchId.classList.remove('expanded');
          this.ariaActivedescendant.setAttribute('aria-activedescendant', '');
        }
      }
    });
  }

  // the part responsible for appending json to the search
  // field use - https://github.com/tomik23/Leaflet.Autocomplete
  dataElements(item) {
    const checkIfDataElementsExist = item.getAttribute('data-elements');
    if (checkIfDataElementsExist !== null) {
      this.searchId.setAttribute(
        'data-elements',
        item.getAttribute('data-elements')
      );
    }
  }

  // setting the active list with the mouse
  mouseActiveListItem() {
    const searchOutputUlLi = document.querySelectorAll(
      `#${this.searchOutputUl} > li`
    );
    for (let i = 0; i < searchOutputUlLi.length; i++) {
      searchOutputUlLi[i].addEventListener('mouseenter', (e) => {
        const itemActive = document.querySelector(`li.${this.activeList}`);
        if (itemActive) {
          removeClass(itemActive, this.activeList);
          itemActive.id = '';
          itemActive.setAttribute('aria-selected', false);
          this.ariaactivedescendant(this.ariaActivedescendant);
        }
        addClass(e.target, this.activeList);
        e.target.id = this.selectedOption;
        e.target.setAttribute('aria-selected', true);
        this.ariaactivedescendant(
          this.ariaActivedescendant,
          this.selectedOption
        );
      });
    }
    this.mouseAddListItemToSearchInput();
  }

  // add text from list when click mouse
  mouseAddListItemToSearchInput() {
    const searchOutpuli = document.getElementById(this.searchOutputUl);
    searchOutpuli.addEventListener('click', (e) => {
      e.preventDefault();
      const item = document.querySelector(`li.${this.activeList} > *`);
      this.searchId.value = item.innerText.trim();

      // onSubmit
      this.onSubmit(item.innerText.trim());

      this.dataElements(item.parentNode);
      // searchOutpuli.outerHTML = '';
    });
  }

  // show items when items.length >= 1 and is not empty
  showLiItems() {
    this.searchId.addEventListener('click', () => {
      const countCharInSearchId = this.searchId.value.length;
      const itemsLi = document.querySelectorAll(`#${this.searchOutputUl} > li`);

      if (countCharInSearchId >= this.howManyCharacters && itemsLi.length > 0) {
        this.searchId.setAttribute('aria-expanded', true);
        this.searchId.classList.add('expanded');
        addClass(this.outputSearch, this.isActive);
      }
    });
  }

  // navigating the elements li
  keyUpInsideUl() {
    let selected = 0;
    const itemsLi = document.querySelectorAll(
      `.${this.isActive} > #${this.searchOutputUl} > li`
    );

    if (itemsLi.length >= 1) {
      this.showLiItems(itemsLi);
      this.searchId.addEventListener('keydown', (e) => {
        const { keyCode } = e;
        const ariaExpanded = this.searchId.getAttribute('aria-expanded');
        const itemActive = document.querySelector(`li.${this.activeList}`);

        // preventing keydown when 'aria-expanded=false` is set
        if (ariaExpanded === 'false') return;

        if (keyCode === this.keyCode.keyUp) {
          selected += 1;
          if (selected > itemsLi.length) {
            selected = 1;
          }
        }

        if (keyCode === this.keyCode.keyDown) {
          selected -= 1;
          if (selected <= 0) {
            selected = itemsLi.length;
          }
        }

        if (
          keyCode === this.keyCode.keyUp ||
          keyCode === this.keyCode.keyDown
        ) {
          if (itemActive) {
            removeClass(itemActive, this.activeList);
            itemActive.id = '';
            itemActive.setAttribute('aria-selected', false);
            this.ariaactivedescendant(this.ariaActivedescendant);
          }
          addClass(itemsLi[selected - 1], this.activeList);
          itemsLi[selected - 1].id = this.selectedOption;
          itemsLi[selected - 1].setAttribute('aria-selected', true);

          this.ariaactivedescendant(
            this.ariaActivedescendant,
            this.selectedOption
          );
        }
      });
    }
  }

  // Set aria-activedescendant
  ariaactivedescendant(element, type) {
    element.setAttribute('aria-activedescendant', type || '');
  }

  // Removing text from the input field
  clearSearchInput() {
    const autoClear = document.querySelector(`#auto-clear-${this.search}`);

    if (autoClear) {
      this.removeClearButton(this.searchId);
    }

    const clear = document.createElement('button');
    clear.id = `auto-clear-${this.search}`;
    clear.classList.add('auto-clear');
    clear.setAttribute('type', 'button');
    const clearSpan = document.createElement('span');
    clearSpan.textContent = 'clear text';
    clear.insertAdjacentElement('beforeend', clearSpan);
    this.searchId.parentNode.insertBefore(clear, this.searchId.nextSibling);

    clear.addEventListener('click', () => {
      this.searchId.value = '';
      this.searchId.focus();
      this.removeClearButton(this.searchId);
    });
  }

  // clear button
  removeClearButton(id) {
    id.nextElementSibling.remove();
    this.ariaactivedescendant(this.ariaActivedescendant);

    const selectedOption = document.getElementById(this.selectedOption);
    if (selectedOption) selectedOption.classList.remove(this.activeList);
  }

  // The async function gets the text from the search
  // and returns the matching array
  async searchItem(searchText) {
    try {
      const dataResponse =
        this.searchLike === true ? this.path + searchText : this.path;

      const res = await fetch(dataResponse);
      const jsonData = await res.json();

      if (searchText.length === 0) {
        this.matchList.innerHTML = '';
      }

      const matches = Array.isArray(jsonData)
        ? [searchText, ...jsonData]
        : { searchText, ...jsonData };

      removeClass(this.classSearch, this.isLoading);
      // clear input
      // console.log('matches', matches);
      this.outputHtml(matches);
      if (this.clearButton) this.clearSearchInput();
    } catch (err) {
      // console.log(err);
      removeClass(this.classSearch, this.isLoading);
      this.searchId.value = '';

      addClass(this.searchId, this.errorClass);
      this.searchId.placeholder = this.placeholderError;
    }
  }
}

export default Autosuggest;
