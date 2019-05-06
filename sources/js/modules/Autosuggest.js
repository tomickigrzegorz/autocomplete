import 'whatwg-fetch';
import './Autosuggest.scss';
import { removeClass } from '../helpers/removeClass';
import { addClass } from '../helpers/addClass';
import { htmlTemplate } from '../helpers/htmlTemplate';

class SearchJson {
  constructor(options) {
    this.options = options;
    this.initialSearch(this.options);
    this.keyCode = {
      esc: 27,
      enter: 13,
      keyUp: 40,
      keyDown: 38,
    };
  }

  initialSearch({
    search,
    isLoading,
    howManyCharacters,
    delay,
    isActive,
    searchBy,
  }) {
    let timeout;

    this.searchId = document.getElementById(search);
    this.createOutputSearch(search);

    this.searchId.addEventListener('input', e => {
      this.valueFromSearch = e.target.value;
      this.classSearch = e.target.parentNode;

      const escapedChar = this.valueFromSearch.replace(
        // eslint-disable-next-line no-useless-escape
        /[`~!@#$%^&*()_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi,
        ''
      );

      if (escapedChar.length > howManyCharacters) {
        this.searchId.parentNode.classList.add(isLoading);
        if (!timeout) {
          timeout = setTimeout(() => {
            removeClass(this.classSearch, isLoading);
            this.searchCountry(escapedChar, searchBy);
            timeout = null;
          }, delay);
        }
      } else {
        removeClass(this.matchList, isActive);
      }
    });
  }

  // create output-list and put after search input
  createOutputSearch(search) {
    const outputAfterSearch = `${search}-auto`;
    const outputSearch = document.createElement('div');
    outputSearch.id = outputAfterSearch;
    outputSearch.className = 'output-search';
    this.searchId.parentNode.insertBefore(
      outputSearch,
      this.searchId.nextSibling
    );

    this.matchList = document.getElementById(outputAfterSearch);
  }

  // hide output div when click on li or press escape
  closeOutputMatchesList({ search, isActive }) {
    document.addEventListener('click', e => {
      e.stopPropagation();
      const itemActive = document.querySelector(`.${isActive}`);
      if (e.target.id !== search) {
        if (itemActive) {
          removeClass(itemActive, isActive);
        }
      }
    });
    // close outpu list when press ESC
    document.addEventListener('keyup', e => {
      if (e.keyCode === this.keyCode.esc) {
        const itemActive = document.querySelector(`.${isActive}`);
        if (itemActive) {
          removeClass(itemActive, isActive);
        }
      }
    });
  }

  // preparation of the list
  outputHtml(matches) {
    if (matches.length > 1) {
      const {
        howManyRecordsShow,
        searchOutputUl,
        isActive,
        searchBy,
        specificOutput,
      } = this.options;

      const rowMax = howManyRecordsShow || 10;

      const html = matches
        .filter((test, index) => index > 0 && index <= rowMax)
        .map(match => {
          const htmlTemp = specificOutput
            ? specificOutput({ ...match, matches })
            : htmlTemplate({ match, matches, searchBy });
          return htmlTemp;
        })
        .join('');

      this.matchList.innerHTML = `<ul id="${searchOutputUl}">${html}</ul>`;

      addClass(this.matchList, isActive);
      this.addTextFromLiToSearchInput(this.options);
      this.keyUpInsideUl(this.options);
      this.mouseActiveListItem(this.options);
      this.closeOutputMatchesList(this.options);
    }
  }

  // adding text from list when enter
  addTextFromLiToSearchInput({ activeList, isActive }) {
    document.addEventListener('keyup', e => {
      e.preventDefault();
      if (this.valueFromSearch.length) {
        const itemActive = document.querySelector(`li.${activeList} > a`);
        if (e.keyCode === this.keyCode.enter && itemActive != null) {
          const item = e.target;
          document.getElementById(item.id).value = itemActive.innerText.trim();

          removeClass(item.nextSibling, isActive);
          removeClass(itemActive, activeList);
        }
      }
    });
  }

  // setting the active list with the mouse
  mouseActiveListItem({ search, searchOutputUl, activeList }) {
    const searchOutputUlLi = document.querySelectorAll(
      `#${searchOutputUl} > li`
    );
    for (let i = 0; i < searchOutputUlLi.length; i++) {
      searchOutputUlLi[i].addEventListener('mouseenter', function(e) {
        const itemActive = document.querySelector(`li.${activeList}`);
        if (itemActive) {
          removeClass(itemActive, activeList);
        }
        e.target.classList.add(activeList);
      });
    }
    this.mouseAddListItemToSearchInput({ search, activeList, searchOutputUl });
  }

  // add text from list when click mouse
  // eslint-disable-next-line class-methods-use-this
  mouseAddListItemToSearchInput({ search, activeList, searchOutputUl }) {
    document.getElementById(searchOutputUl).addEventListener('click', e => {
      e.preventDefault();
      const item = document.querySelector(`li.${activeList} > a`).innerText;
      document.getElementById(search).value = item.trim();
    });
  }

  // navigating the elements li
  keyUpInsideUl({ searchOutputUl, activeList }) {
    let selected = 0;
    const itemsLi = document.querySelectorAll(`#${searchOutputUl} > li`);

    if (itemsLi.length >= 1) {
      this.searchId.addEventListener('keydown', e => {
        const itemActive = document.querySelector(`li.${activeList}`);
        const { keyCode } = e;

        if (keyCode === this.keyCode.keyUp) {
          selected++;
          if (selected > itemsLi.length) {
            selected = 1;
          }
          if (itemActive) {
            removeClass(itemActive, activeList);
          }
          itemsLi[selected - 1].classList.add(activeList);
        }
        if (keyCode === this.keyCode.keyDown) {
          selected--;
          if (selected <= 0) {
            selected = itemsLi.length;
          }
          if (itemActive) {
            removeClass(itemActive, activeList);
          }
          itemsLi[selected - 1].classList.add(activeList);
        }
      });
    }
  }

  // The async function gets the text from the search
  // and returns the matching array
  async searchCountry(searchText, searchBy) {
    const res = await fetch(this.options.urlPath);
    const jsonData = await res.json();

    // console.log(this.options.searchBy);
    let matches = jsonData.filter(element => {
      const regex = new RegExp(`^${searchText}`, 'gi');
      return element[searchBy].match(regex);
    });

    if (searchText.length === 0) {
      matches = [];
      this.matchList.innerHTML = '';
    }

    matches = [searchText, ...matches];
    this.outputHtml(matches);
  }
}

export default SearchJson;
