import 'whatwg-fetch';
import './Autosuggest.scss';
import { removeClass } from '../helpers/removeClass';
import { addClass } from '../helpers/addClass';
import { htmlTemplate } from '../helpers/htmlTemplate';

class SearchJson {
  constructor(options) {
    this.options = options;
    this.initialSearch();
  }

  initialSearch() {
    const {
      search,
      isLoading,
      howManyCharacters,
      delay,
      isActive,
    } = this.options;
    let timeout;

    this.searchId = document.getElementById(search);
    this.createOutputSearch();
    this.searchId.addEventListener('input', e => {
      this.valueFromSearch = e.target.value;
      this.classSearch = e.target.parentNode;
      if (this.valueFromSearch.length > howManyCharacters) {
        this.searchId.parentNode.classList.add(isLoading);
        if (!timeout) {
          timeout = setTimeout(() => {
            removeClass(this.classSearch, isLoading);
            this.searchCountry(this.valueFromSearch);
            timeout = null;
          }, delay);
        }
      } else {
        removeClass(this.matchList, isActive);
      }
    });
  }

  // create output-list and put after search input
  createOutputSearch() {
    const { searchOutput } = this.options;

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
  closeOutputMatchesList() {
    const { search, isActive } = this.options;

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
      if (e.keyCode === 27) {
        const itemActive = document.querySelector(`.${isActive}`);
        if (itemActive) {
          removeClass(itemActive, isActive);
        }
      }
    });
  }

  // preparation of the list
  outputHtml(matches) {
    if (matches.length > 0) {
      const { howManyRecordsShow, searchOutputUl, isActive } = this.options;
      const rowMax = this.searchId.getAttribute(howManyRecordsShow) || 10;

      const html = matches
        .filter((test, index) => index > 0 && index <= rowMax)
        .map(match => {
          const { listItem } = this.options;
          return htmlTemplate({ match, matches, listItem });
        })
        .join('');

      this.matchList.innerHTML = `<ul id="${searchOutputUl}">${html}</ul>`;

      addClass(this.matchList, isActive);
      this.addTextFromLiToSearchInput();
      this.keyUpInsideUl();
      this.mouseActiveListItem();
      this.closeOutputMatchesList();
    }
  }

  // adding text from list when enter button
  addTextFromLiToSearchInput() {
    const { activeList, searchOutput, isActive } = this.options;

    document.addEventListener('keyup', e => {
      e.preventDefault();
      if (this.valueFromSearch.length) {
        const active = document.querySelector(
          `#${searchOutput} .${activeList}`
        );
        if (e.keyCode === 13 && active != null) {
          this.searchId.value = active.innerText.trim();
          removeClass(e.target.nextSibling, isActive);
        }
      }
    });
  }

  // setting the active list with the mouse
  mouseActiveListItem() {
    const { listItem, activeList } = this.options;

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

    this.mouseAddListItemToSearchInput();
  }

  // add text from list when click mouse
  mouseAddListItemToSearchInput() {
    const { search, searchOutputUl } = this.options;

    document.getElementById(searchOutputUl).addEventListener('click', e => {
      e.preventDefault();
      const item = e.target.parentNode.innerText;
      document.getElementById(search).value = item.trim();
    });
  }

  // navigating the elements li
  keyUpInsideUl() {
    const { searchOutputUl, listItem, activeList, searchOutput } = this.options;

    let selected = 0;
    const countItems = document.querySelectorAll(
      `#${searchOutput} .${listItem}`
    ).length;
    const outputLi = document.querySelectorAll(`#${searchOutputUl} > li`);

    if (countItems >= 1) {
      this.searchId.addEventListener('keydown', e => {
        const itemActive = document.querySelector(`li.${activeList}`);
        const { keyCode } = e;
        if (keyCode === 40) {
          selected++;
          if (selected > countItems) {
            selected = 1;
          }
          if (itemActive) {
            removeClass(itemActive, activeList);
          }
          outputLi[selected - 1].classList.add(activeList);
        }
        if (keyCode === 38) {
          selected--;
          if (selected <= 0) {
            selected = countItems;
          }
          if (itemActive) {
            removeClass(itemActive, activeList);
          }
          outputLi[selected - 1].classList.add(activeList);
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
      const escapedChar = searchText.replace(
        // eslint-disable-next-line no-useless-escape
        /[-\/\\^$*+?.()|[\]{}]/g,
        '\\$&'
      );
      const regex = new RegExp(`^${escapedChar}`, 'gi');
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
