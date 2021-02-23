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
      insertToInput,
      classGroup,
      onResults = () => { },
      onSearch = () => { },
      onSubmit = () => { },
      onOpened = () => { },
      onReset = () => { },
      noResults = () => { },
      onSelectedItem = () => { },
    }
  ) {
    this.search = element;
    this.root = document.getElementById(this.search);
    this.onSearch = isPromise(onSearch)
      ? onSearch
      : ({ currentValue: a, element: b }) =>
        Promise.resolve(onSearch({ currentValue: a, element: b }));
    this.onResults = onResults;
    this.onSubmit = onSubmit;
    this.onSelectedItem = onSelectedItem;
    this.onOpened = onOpened;
    this.onReset = onReset;
    this.noResults = noResults;

    this.delay = delay || 500;
    this.characters = howManyCharacters || 1;
    this.clearBtn = clearButton || false;
    this.selectFirst = selectFirst || false;
    this.toInput = insertToInput || false;
    this.classGroup = classGroup;

    // default config
    this.outputUl = `${this.search}-list`;
    this.isLoading = 'auto-is-loading';
    this.isActive = 'auto-is-active';
    this.activeList = 'auto-selected';
    this.selectedOption = 'selectedOption';
    this.err = 'auto-error';
    this.regex = /[|\\{}()[\]^$+*?.]/g;
    this.timeout = null;

    this.keyCodes = {
      ESC: 27,
      ENTER: 13,
      UP: 38,
      DOWN: 40,
      TAB: 9,
    };

    this.init();
  }

  init = () => {
    if (this.clearBtn) {
      this.clearButton();
    }

    this.output();

    // default aria
    this.reset();

    this.root.addEventListener('input', this.handleInput);
  };

  handleInput = ({ target }) => {
    const regex = target.value.replace(this.regex, '\\$&');
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.searchItem(regex.trim());
    }, this.delay);
  };

  // create output-list and put after search input
  output = () => {
    this.resultList = document.createElement('ul');

    this.setAttr(this.resultList, {
      id: this.outputUl,
      addClass: 'auto-output-search',
      tabIndex: 0,
      role: 'listbox',
    });

    this.root.parentNode.insertBefore(this.resultList, this.root.nextSibling);
  };

  // default aria
  reset = () => {
    this.setAttr(this.root, {
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

    // remove result when lengh = 0 and insertToInput is false
    if (this.matches?.length == 0 && !this.toInput) {
      this.resultList.innerHTML = '';
    }

    this.index = this.selectFirst ? 0 : -1;
  };

  // The async function gets the text from the search
  // and returns the matching array
  searchItem = (value) => {
    this.value = value;

    this.onLoading(true);

    // hide button clear
    this.showBtn();

    if (this.characters > value.length) {
      this.onLoading();
      return;
    }

    this.onSearch({ currentValue: value, element: this.root })
      .then((result) => {
        // set no result
        this.matches = Array.isArray(result)
          ? [...result]
          : JSON.parse(JSON.stringify(result));

        this.onLoading();
        this.error();

        if (result.length == 0) {
          this.root.classList.remove('expanded');
          this.reset();
          this.noResults({
            element: this.root,
            currentValue: value,
            template: this.results,
          });
          this.events();
        } else if (result.length > 0 || isObject(result)) {
          this.results();
          this.events();
        }
      })
      .catch(() => {
        this.onLoading();
        this.reset();
      });
  };

  onLoading = (type) => {
    this.root.parentNode.classList[type ? 'add' : 'remove'](this.isLoading);
  };

  error = (type) => {
    this.root.classList[type ? 'add' : 'remove'](this.err);
  };

  // preparation of the list
  events = () => {
    const liElement = [].slice.call(this.resultList.children);

    this.root.addEventListener('keydown', this.handleKeys);
    this.root.addEventListener('click', this.handleShowItems);

    for (let i = 0; i < liElement.length; i++) {
      liElement[i].addEventListener('mousemove', this.handleMouse);
      liElement[i].addEventListener('click', this.handleMouse);
    }

    // close expanded items
    document.addEventListener('click', this.handleDocClick);
  };

  results = (template) => {
    this.setAttr(this.root, {
      'aria-expanded': true,
      addClass: 'expanded',
    });

    // add all found records to otput ul
    this.resultList.innerHTML =
      this.matches.length === 0
        ? this.onResults({
          currentValue: this.value,
          matches: 0,
          template,
        })
        : this.onResults({
          currentValue: this.value,
          matches: this.matches,
          classGroup: this.classGroup,
        });

    this.resultList.classList.add(this.isActive);

    const checkIfClassGroupExist = this.classGroup
      ? `:not(.${this.classGroup})`
      : '';

    this.itemsLi = document.querySelectorAll(
      `#${this.outputUl} > li${checkIfClassGroupExist}`
    );

    // select first element
    this.selectFirstEl();

    // action on open results
    this.onOpened({
      type: 'results',
      element: this.root,
      results: this.resultList,
    });

    // adding role, tabindex and aria
    this.addAriaToLi();
  };

  handleDocClick = ({ target }) => {
    if (target.id !== this.search) {
      this.reset();
      return;
    }
  };

  // adding role, tabindex, aria and call handleMouse
  addAriaToLi = () => {
    for (let i = 0; i < this.itemsLi.length; i++) {
      this.setAttr(this.itemsLi[i], {
        role: 'option',
        tabindex: -1,
        'aria-selected': 'false',
      });
    }
  };

  // select first element
  selectFirstEl = () => {
    this.remAria(document.querySelector(`.${this.activeList}`));

    if (!this.selectFirst) {
      return;
    }

    const { firstElementChild } = this.resultList;

    const classSelectFirst =
      this.classGroup && this.matches.length > 0 && this.selectFirst
        ? firstElementChild.nextElementSibling
        : firstElementChild;

    this.setAttr(classSelectFirst, {
      id: `${this.selectedOption}-0`,
      addClass: this.activeList,
      'aria-selected': true,
    });

    this.setAriaDes(this.root, `${this.selectedOption}-0`);

    // scrollIntoView when press up/down arrows
    this.follow(firstElementChild, this.resultList);
  };

  showBtn = () => {
    if (!this.clearBtn) {
      return;
    }
    this.clearBtn.classList.remove('hidden');
    this.clearBtn.addEventListener('click', this.handleClearButton);
  };

  setAttr = (el, object) => {
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

  // show items when items.length > 0 and is not empty
  handleShowItems = () => {
    const resultList = this.resultList;
    if (
      resultList.textContent.length > 0 &&
      !resultList.classList.contains(this.isActive)
    ) {
      this.setAttr(this.root, {
        'aria-expanded': true,
        addClass: 'expanded',
      });
      resultList.classList.add(this.isActive);
      // select first element
      this.selectFirstEl();

      this.onOpened({
        type: 'showItems',
        element: this.root,
        results: this.resultList,
      });
    }
  };

  // adding text from the list when li is clicking
  // or adding aria-selected to li elements
  handleMouse = ({ target, type }) => {
    const targetClosest = target.closest('li');
    const targetClosestRole = targetClosest?.hasAttribute('role');

    if (!targetClosest || !targetClosestRole) {
      return;
    }

    if (type === 'click') {
      this.getTextFromLi(targetClosest);
    }

    if (targetClosest.classList.contains(this.activeList)) {
      return;
    }

    if (type === 'mousemove') {
      this.remAria(document.querySelector(`.${this.activeList}`));

      this.setAria(targetClosest);
      this.index = this.indexLiSelected(targetClosest);

      this.onSelectedItem({
        index: this.index,
        element: this.root,
        object: this.matches[this.index],
      });
    }
  };

  // get text from li on enter or click
  getTextFromLi = (element) => {
    if (!element || this.matches.length === 0) {
      return;
    }

    this.addToInput(element);

    this.remAria(element);

    // onSubmit passing text to function
    this.onSubmit({
      index: this.index,
      element: this.root,
      object: this.matches[this.index],
      results: this.resultList,
    });

    // set default settings
    this.reset();
  };

  // get first element from child
  firstElement = (element) => element.firstElementChild || element;

  // set data from li to input
  addToInput = (element) => {
    // add text to input
    this.root.value = this.firstElement(element).textContent.trim();
  };

  // return which li element was selected
  // by hovering the mouse over
  indexLiSelected = (target) =>
    Array.prototype.indexOf.call(this.itemsLi, target);

  // navigating the elements li and enter
  handleKeys = ({ keyCode }) => {
    const resultList = this.resultList.classList.contains(this.isActive);

    const matchesLength = this.matches.length;
    this.selectedLi = document.querySelector(`.${this.activeList}`);

    switch (keyCode) {
      case this.keyCodes.UP:
      case this.keyCodes.DOWN:
        if ((matchesLength <= 1 && this.selectFirst) || !resultList) {
          return;
        }

        if (keyCode === this.keyCodes.UP) {
          this.index -= 1;
          if (this.index < 0) {
            this.index = matchesLength - 1;
          }
        } else {
          this.index += 1;
          if (this.index >= matchesLength) {
            this.index = 0;
          }
        }

        this.remAria(this.selectedLi);

        if (matchesLength > 0) {
          this.onSelectedItem({
            index: this.index,
            element: this.root,
            object: this.matches[this.index],
          });

          this.setAria(this.itemsLi[this.index]);
          if (this.toInput && resultList) {
            this.addToInput(this.itemsLi[this.index]);
          }
        }

        break;
      case this.keyCodes.ENTER:
        this.remAria(this.selectedLi);
        this.getTextFromLi(this.selectedLi);
        break;

      case this.keyCodes.TAB:
      case this.keyCodes.ESC:
        this.reset();

        break;
      default:
        break;
    }
  };

  // set aria label on item li
  setAria = (target) => {
    // eslint-disable-next-line prettier/prettier
    const selectedOption = `${this.selectedOption}-${this.indexLiSelected(target)}`;

    this.setAttr(target, {
      id: selectedOption,
      'aria-selected': true,
      addClass: this.activeList,
    });

    this.setAriaDes(this.root, selectedOption);

    // scrollIntoView when press up/down arrows
    this.follow(target, this.resultList);
  };

  // follow active element
  follow = (element, container) => {
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
  remAria = (element) => {
    if (!element) {
      return;
    }
    this.setAttr(element, {
      id: '',
      removeClass: this.activeList,
      'aria-selected': false,
    });
  };

  // Set aria-activedescendant
  setAriaDes = (element, type) => {
    element.setAttribute('aria-activedescendant', type || '');
  };

  // create clear button and
  // removing text from the input field
  clearButton = () => {
    this.clearBtn = document.createElement('button');

    this.setAttr(this.clearBtn, {
      id: `auto-clear-${this.search}`,
      class: 'auto-clear hidden',
      type: 'button',
      'aria-label': 'claar text from input',
    });

    this.root.insertAdjacentElement('afterend', this.clearBtn);
  };

  // clicking on the clear button
  handleClearButton = ({ target }) => {
    // hides clear button
    target.classList.add('hidden');
    // clear value searchId
    this.root.value = '';
    // set focus
    this.root.focus();
    // remove li from ul
    this.resultList.textContent = '';
    // set default aria
    this.reset();
    // remove error if exist
    this.error();

    this.onReset(this.root);
  };
}

export default Autocomplete;
