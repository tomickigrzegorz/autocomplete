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
    searchOutput,
    search,
    isLoading,
    howManyCharacters,
    delay,
    isActive,
  }) {
    let timeout;

    this.searchId = document.getElementById(search);
    this.createOutputSearch(searchOutput);

    this.searchId.addEventListener('input', e => {
      this.valueFromSearch = e.target.value;
      const escapedChar = this.valueFromSearch.replace(
        // eslint-disable-next-line no-useless-escape
        /[`~!@#$%^&*()_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi,
        ''
      );

      this.classSearch = e.target.parentNode;
      if (this.valueFromSearch.length > howManyCharacters) {
        this.searchId.parentNode.classList.add(isLoading);
        if (!timeout) {
          timeout = setTimeout(() => {
            removeClass(this.classSearch, isLoading);
            this.searchCountry(escapedChar);
            timeout = null;
          }, delay);
        }
      } else {
        removeClass(this.matchList, isActive);
      }
    });
  }

  // create output-list and put after search input
  createOutputSearch(searchOutput) {
    const outputSearch = document.createElement('div');
    outputSearch.id = searchOutput;
    outputSearch.className = 'output-search';
    this.searchId.parentNode.insertBefore(
      outputSearch,
      this.searchId.nextSibling
    );

    this.matchList = document.getElementById(searchOutput);
  }

  // hide output div when klic on li or press escape
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
        search,
        howManyRecordsShow,
        searchOutputUl,
        listItem,
        isActive,
        activeList,
        searchOutput,
      } = this.options;

      const rowMax = this.searchId.getAttribute(howManyRecordsShow) || 10;

      const html = matches
        .filter((test, index) => index > 0 && index <= rowMax)
        .map(match => {
          return htmlTemplate({ match, matches, listItem });
        })
        .join('');

      this.matchList.innerHTML = `<ul id="${searchOutputUl}">${html}</ul>`;

      addClass(this.matchList, isActive);
      this.addTextFromLiToSearchInput({ activeList, searchOutput, isActive });
      this.keyUpInsideUl({ searchOutputUl, activeList });
      this.mouseActiveListItem({
        search,
        searchOutputUl,
        listItem,
        activeList,
      });
      this.closeOutputMatchesList({ search, isActive });
    }
  }

  // adding text from list when enter button
  addTextFromLiToSearchInput({ activeList, searchOutput, isActive }) {
    document.addEventListener('keyup', e => {
      e.preventDefault();
      if (this.valueFromSearch.length) {
        const active = document.querySelector(
          `#${searchOutput} .${activeList}`
        );
        if (e.keyCode === this.keyCode.enter && active != null) {
          this.searchId.value = active.innerText.trim();
          removeClass(e.target.nextSibling, isActive);
        }
      }
    });
  }

  // setting the active list with the mouse
  mouseActiveListItem({ search, searchOutputUl, listItem, activeList }) {
    const searchOutputUlLi = document.querySelectorAll(`.${listItem}`);
    for (let i = 0; i < searchOutputUlLi.length; i++) {
      searchOutputUlLi[i].addEventListener('mouseenter', function(e) {
        const itemActive = document.querySelector(`li.${activeList}`);
        if (itemActive) {
          removeClass(itemActive, activeList);
        }
        e.target.classList.add(activeList);
      });
    }
    this.mouseAddListItemToSearchInput({ search, searchOutputUl });
  }

  // add text from list when click mouse
  // eslint-disable-next-line class-methods-use-this
  mouseAddListItemToSearchInput({ search, searchOutputUl }) {
    document.getElementById(searchOutputUl).addEventListener('click', e => {
      e.preventDefault();
      const item = e.target.parentNode.innerText;
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
  async searchCountry(searchText) {
    const res = await fetch(this.options.urlPath + searchText);
    const jsonData = await res.json();

    let matches = jsonData.filter(country => {
      const regex = new RegExp(`^${searchText}`, 'gi');
      return country.name.match(regex);
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
