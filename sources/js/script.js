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
      specificOutput,
      howManyCharacters,
      clearButton,
    }
  ) {
    this.search = element;
    this.searchId = document.getElementById(this.search);
    this.placeholderError = placeholderError || 'something went wrong...';
    this.delay = delay || 500;
    this.clearButton = clearButton || false;
    this.searchLike = dataAPI.searchLike;
    this.path = dataAPI.path;
    this.specificOutput = specificOutput;
    this.howManyCharacters = howManyCharacters || 1;

    this.searchOutputUl = 'auto-output-list';
    this.isLoading = 'auto-is-loading';
    this.isActive = 'auto-is-active';
    this.errorClass = 'auto-error';
    this.activeList = 'auto-active-list';
    this.keyCode = {
      esc: 27,
      enter: 13,
      keyUp: 40,
      keyDown: 38,
    };

    this.initialSearch();
    this.createOutputSearch(this.search);
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
          addClass(this.searchId.parentNode, this.isLoading);
          this.searchItem(escapedChar.trim());
        } else {
          removeClass(this.matchList, this.isActive);
        }
      }, this.delay);

      removeClass(this.searchId, this.errorClass);
    });
  }

  // create output-list and put after search input
  createOutputSearch() {
    const outputAfterSearch = `${this.search}-auto`;
    const outputSearch = document.createElement('div');
    outputSearch.id = outputAfterSearch;
    outputSearch.className = 'auto-output-search';
    this.searchId.parentNode.insertBefore(
      outputSearch,
      this.searchId.nextSibling
    );

    this.matchList = document.getElementById(outputAfterSearch);
  }

  // hide output div when click on li or press escape
  closeOutputMatchesList() {
    document.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemActive = document.querySelector(`.${this.isActive}`);
      if (e.target.id !== this.search) {
        if (itemActive) {
          removeClass(itemActive, this.isActive);
        }
      }
    });
    // close outpu list when press ESC
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === this.keyCode.esc) {
        const itemActive = document.querySelector(`.${this.isActive}`);
        if (itemActive) {
          removeClass(itemActive, this.isActive);
        }
      }
    });
  }

  // preparation of the list
  outputHtml(matches) {
    const html = this.specificOutput(matches);
    if (html !== '') {
      this.matchList.innerHTML = `<ul id="${this.searchOutputUl}">${html}</ul>`;
      addClass(this.matchList, this.isActive);
      this.addTextFromLiToSearchInput();
      this.keyUpInsideUl();
      this.mouseActiveListItem();
      this.closeOutputMatchesList();
    }
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
          document.getElementById(this.searchOutputUl).outerHTML = '';
          removeClass(item.nextSibling, this.isActive);
          removeClass(itemActive, this.activeList);
        }
      }
    });
  }

  dataElements(item) {
    const checkIfDataElementsExist = item.getAttribute('data-elements');
    if (checkIfDataElementsExist !== null) {
      this.searchId.setAttribute('data-elements', item.getAttribute('data-elements'));
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
        }
        addClass(e.target, this.activeList);
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
      this.dataElements(item.parentNode);
      searchOutpuli.outerHTML = '';
    });
  }

  // navigating the elements li
  keyUpInsideUl() {
    let selected = 0;
    const itemsLi = document.querySelectorAll(
      `.${this.isActive} > #${this.searchOutputUl} > li`
    );

    if (itemsLi.length >= 1) {
      this.searchId.addEventListener('keydown', (e) => {
        const itemActive = document.querySelector(`li.${this.activeList}`);

        if (e.keyCode === this.keyCode.keyUp) {
          selected += 1;
          if (selected > itemsLi.length) {
            selected = 1;
          }
        }

        if (e.keyCode === this.keyCode.keyDown) {
          selected -= 1;
          if (selected <= 0) {
            selected = itemsLi.length;
          }
        }

        if (
          e.keyCode === this.keyCode.keyUp ||
          e.keyCode === this.keyCode.keyDown
        ) {
          if (itemActive) removeClass(itemActive, this.activeList);
          addClass(itemsLi[selected - 1], this.activeList);
        }
      });
    }
  }

  // Removing text from the input field
  clearSearchInput() {
    const clearButtonExist = document.querySelector('.auto-clear');


    if (clearButtonExist) {
      this.removeClearButton();
    }

    const clear = document.createElement('span');
    clear.classList.add('auto-clear');
    clear.setAttribute('title', 'clear the input field');
    this.searchId.parentNode.insertBefore(clear, this.searchId.nextSibling);

    clear.addEventListener('click', () => {
      this.searchId.value = '';
      this.searchId.focus();
      this.removeClearButton();
    });
  }

  removeClearButton() {
    this.searchId.nextElementSibling.remove();
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
      // console.log('aaaaaaaaaaaaa', matches);
      this.outputHtml(matches);
      if (this.clearButton) this.clearSearchInput();
    } catch (err) {
      removeClass(this.classSearch, this.isLoading);
      this.searchId.value = '';
      addClass(this.searchId, this.errorClass);
      this.searchId.placeholder = this.placeholderError;
    }
  }
}

export default Autosuggest;
