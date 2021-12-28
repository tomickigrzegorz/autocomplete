var Autocomplete = (function () {
  'use strict';

  const isObject = value => value && typeof value === 'object' && value.constructor === Object;
  const isPromise = value => Boolean(value && typeof value.then === 'function');
  const setAttributes = (el, object) => {
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
  const getFirstElement = element => element.firstElementChild || element;
  const getFirstElementFromLiAndAddToInput = (element, root) =>
  root.value = getFirstElement(element).textContent.trim();
  const scrollResultsToTop = (resultList, resultWrap) => {
    resultList.scrollTop = resultList.offsetTop - resultWrap.offsetHeight;
  };
  const addAriaToAllLiElements = itemsLi => {
    for (let i = 0; i < itemsLi.length; i++) {
      setAttributes(itemsLi[i], {
        role: 'option',
        tabindex: '-1',
        'aria-selected': 'false',
        'aria-setsize': itemsLi.length,
        'aria-posinset': i
      });
    }
  };
  const showBtnToClearData = function (clearButton, destroy) {
    if (clearButton === void 0) {
      clearButton = false;
    }
    if (!clearButton) return;
    clearButton.classList.remove('hidden');
    clearButton.addEventListener('click', destroy);
  };
  const setAriaActivedescendant = (root, type) => {
    root.setAttribute('aria-activedescendant', type || '');
  };
  const getClassGroupHeight = (outputUl, classGroup) => {
    const allLi = document.querySelectorAll("#" + outputUl + " > li:not(." + classGroup + ")");
    let height = 0;
    [].slice.call(allLi).map(el => height += el.offsetHeight);
    return height;
  };
  const followActiveElement = (target, outputUl, classGroup, resultList) => {
    const previusElement = resultList.previousSibling;
    const previusElementHeight = previusElement ? previusElement.offsetHeight : 0;
    if (target.getAttribute('aria-posinset') == '0') {
      resultList.scrollTop = target.offsetTop - getClassGroupHeight(outputUl, classGroup);
    }
    if (target.offsetTop - previusElementHeight < resultList.scrollTop) {
      resultList.scrollTop = target.offsetTop - previusElementHeight;
    } else {
      const offsetBottom = target.offsetTop + target.offsetHeight - previusElementHeight;
      const scrollBottom = resultList.scrollTop + resultList.offsetHeight;
      if (offsetBottom > scrollBottom) {
        resultList.scrollTop = offsetBottom - resultList.offsetHeight;
      }
    }
  };
  const output = (root, resultList, outputUl, resultWrap, prefix) => {
    setAttributes(resultList, {
      id: outputUl,
      tabIndex: '0',
      role: 'listbox'
    });
    setAttributes(resultWrap, {
      addClass: prefix + "-results-wrapper"
    });
    resultWrap.insertAdjacentElement('beforeend', resultList);
    root.parentNode.insertBefore(resultWrap, root.nextSibling);
  };

  const keyCodes = {
    ESC: 27,
    ENTER: 13,
    UP: 38,
    DOWN: 40,
    TAB: 9
  };

  class Autocomplete {
    constructor(_element, _ref) {
      let {
        delay: _delay = 500,
        clearButton = true,
        howManyCharacters = 1,
        selectFirst: _selectFirst = false,
        insertToInput = false,
        showAllValues = false,
        cache = false,
        disableCloseOnSelect = false,
        classGroup,
        classPreventClosing,
        classPrefix,
        ariaLabelClear,
        onSearch,
        onResults = () => {},
        onSubmit = () => {},
        onOpened = () => {},
        onReset = () => {},
        onRender = () => {},
        onClose = () => {},
        noResults = () => {},
        onSelectedItem = () => {}
      } = _ref;
      this.init = () => {
        const {
          resultList,
          root
        } = this;
        this.clearbutton();
        output(root, resultList, this.outputUl, this.resultWrap, this.prefix);
        root.addEventListener('input', this.handleInput);
        this.showAll && root.addEventListener('click', this.handleInput);
        this.onRender({
          element: root,
          results: resultList
        });
      };
      this.cacheAct = (type, target) => {
        const root = this.root;
        if (!this.cache) return;
        if (type === 'update') {
          root.setAttribute(this.cacheData, target.value);
        } else if (type === 'remove') {
          root.removeAttribute(this.cacheData);
        } else {
          root.value = root.getAttribute(this.cacheData);
        }
      };
      this.handleInput = _ref2 => {
        let {
          target,
          type
        } = _ref2;
        if (this.root.getAttribute('aria-expanded') === 'true' && type === 'click') {
          return;
        }
        const regex = target.value.replace(this.regex, '\\$&');
        this.cacheAct('update', target);
        const delay = this.showAll ? 0 : this.delay;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.searchItem(regex.trim());
        }, delay);
      };
      this.reset = () => {
        var _this$matches;
        setAttributes(this.root, {
          'aria-owns': this.id + "-list",
          'aria-expanded': 'false',
          'aria-autocomplete': 'list',
          'aria-activedescendant': '',
          role: 'combobox',
          removeClass: 'auto-expanded'
        });
        this.resultWrap.classList.remove(this.isActive);
        if (((_this$matches = this.matches) == null ? void 0 : _this$matches.length) == 0 && !this.toInput || this.showAll) {
          this.resultList.innerHTML = '';
        }
        this.index = this.selectFirst ? 0 : -1;
        this.onClose();
      };
      this.searchItem = value => {
        this.value = value;
        this.onLoading(true);
        showBtnToClearData(this.cBtn, this.destroy);
        if (value.length == 0 && this.clearButton) {
          this.cBtn.classList.add('hidden');
        }
        if (this.characters > value.length && !this.showAll) {
          this.onLoading();
          return;
        }
        this.onSearch({
          currentValue: value,
          element: this.root
        }).then(result => {
          const rootValueLength = this.root.value.length;
          const resultLength = result.length;
          this.matches = Array.isArray(result) ? [...result] : JSON.parse(JSON.stringify(result));
          this.onLoading();
          this.error();
          if (resultLength == 0 && rootValueLength == 0) {
            this.cBtn.classList.add('hidden');
          }
          if (resultLength == 0 && rootValueLength) {
            this.root.classList.remove('auto-expanded');
            this.reset();
            this.noResults({
              element: this.root,
              currentValue: value,
              template: this.results
            });
            this.events();
          } else if (resultLength > 0 || isObject(result)) {
            this.index = this.selectFirst ? 0 : -1;
            this.results();
            this.events();
          }
        }).catch(() => {
          this.onLoading();
          this.reset();
        });
      };
      this.onLoading = type => this.root.parentNode.classList[type ? 'add' : 'remove'](this.isLoading);
      this.error = () => this.root.classList.remove(this.err);
      this.events = () => {
        const {
          root,
          resultList
        } = this;
        root.addEventListener('keydown', this.handleKeys);
        root.addEventListener('click', this.handleShowItems);
        ['mousemove', 'click'].map(eventType => {
          resultList.addEventListener(eventType, this.handleMouse);
        });
        document.addEventListener('click', this.handleDocClick);
      };
      this.results = template => {
        setAttributes(this.root, {
          'aria-expanded': 'true',
          addClass: this.prefix + "-expanded"
        });
        this.resultList.innerHTML = this.matches.length === 0 ? this.onResults({
          currentValue: this.value,
          matches: 0,
          template
        }) : this.onResults({
          currentValue: this.value,
          matches: this.matches,
          classGroup: this.classGroup
        });
        this.resultWrap.classList.add(this.isActive);
        const checkIfClassGroupExist = this.classGroup ? ":not(." + this.classGroup + ")" : '';
        this.itemsLi = document.querySelectorAll("#" + this.outputUl + " > li" + checkIfClassGroupExist);
        this.selectFirstEl();
        this.onOpened({
          type: 'results',
          element: this.root,
          results: this.resultList
        });
        addAriaToAllLiElements(this.itemsLi);
        scrollResultsToTop(this.resultList, this.resultWrap);
      };
      this.handleDocClick = _ref3 => {
        let {
          target
        } = _ref3;
        let disableClose = null;
        if (target.closest('ul') && this.disable ||
        target.closest("." + this.prevClosing)) {
          disableClose = true;
        }
        if (target.id !== this.id && !disableClose) {
          this.reset();
          return;
        }
      };
      this.selectFirstEl = () => {
        const {
          index,
          activeList,
          selectedOption,
          selectFirst,
          root
        } = this;
        this.remAria(document.querySelector("." + activeList));
        if (!selectFirst) {
          return;
        }
        const {
          firstElementChild
        } = this.resultList;
        const classSelectFirst = this.classGroup && this.matches.length > 0 && selectFirst ? firstElementChild.nextElementSibling : firstElementChild;
        setAttributes(classSelectFirst, {
          id: selectedOption + "-0",
          addClass: activeList,
          'aria-selected': 'true'
        });
        this.onSelected({
          index,
          element: root,
          object: this.matches[index]
        });
        setAriaActivedescendant(root, selectedOption + "-0");
      };
      this.setAttr = (el, object) => {
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
      this.handleShowItems = () => {
        const {
          root,
          resultWrap,
          resultList,
          isActive
        } = this;
        if (resultList.textContent.length > 0 && !resultWrap.classList.contains(isActive)) {
          setAttributes(root, {
            'aria-expanded': 'true',
            addClass: this.prefix + "-expanded"
          });
          resultWrap.classList.add(isActive);
          scrollResultsToTop(resultList, resultWrap);
          this.selectFirstEl();
          this.onOpened({
            type: 'showItems',
            element: root,
            results: resultList
          });
        }
      };
      this.handleMouse = event => {
        event.preventDefault();
        const {
          target,
          type
        } = event;
        const targetClosest = target.closest('li');
        const targetClosestRole = targetClosest == null ? void 0 : targetClosest.hasAttribute('role');
        const activeClass = this.activeList;
        const activeClassElement = document.querySelector("." + activeClass);
        if (!targetClosest || !targetClosestRole) {
          return;
        }
        if (type === 'click') {
          this.getTextFromLi(targetClosest);
        }
        if (type === 'mousemove' && !targetClosest.classList.contains(activeClass)) {
          this.remAria(activeClassElement);
          this.setAria(targetClosest);
          this.index = this.indexLiSelected(targetClosest);
          this.onSelected({
            index: this.index,
            element: this.root,
            object: this.matches[this.index]
          });
        }
      };
      this.getTextFromLi = element => {
        const {
          root,
          index,
          disable
        } = this;
        if (!element || this.matches.length === 0) {
          !disable && this.reset();
          return;
        }
        getFirstElementFromLiAndAddToInput(element, root);
        this.onSubmit({
          index: index,
          element: root,
          object: this.matches[index],
          results: this.resultList
        });
        if (!disable) {
          this.remAria(element);
          this.reset();
        }
        this.clearButton && this.cBtn.classList.remove('hidden');
        this.cacheAct('remove');
      };
      this.indexLiSelected = target =>
      Array.prototype.indexOf.call(this.itemsLi, target);
      this.handleKeys = event => {
        const {
          root
        } = this;
        const {
          keyCode
        } = event;
        const resultList = this.resultWrap.classList.contains(this.isActive);
        const matchesLength = this.matches.length + 1;
        this.selectedLi = document.querySelector("." + this.activeList);
        switch (keyCode) {
          case keyCodes.UP:
          case keyCodes.DOWN:
            event.preventDefault();
            if (matchesLength <= 1 && this.selectFirst || !resultList) {
              return;
            }
            if (keyCode === keyCodes.UP) {
              if (this.index < 0) {
                this.index = matchesLength - 1;
              }
              this.index -= 1;
            } else {
              this.index += 1;
              if (this.index >= matchesLength) {
                this.index = 0;
              }
            }
            this.remAria(this.selectedLi);
            if (matchesLength > 0 && this.index >= 0 && this.index < matchesLength - 1) {
              this.onSelected({
                index: this.index,
                element: root,
                object: this.matches[this.index]
              });
              this.setAria(this.itemsLi[this.index]);
              if (this.toInput && resultList) {
                getFirstElementFromLiAndAddToInput(this.itemsLi[this.index], root);
              }
            } else {
              this.cacheAct();
              setAriaActivedescendant(root);
            }
            break;
          case keyCodes.ENTER:
            this.getTextFromLi(this.selectedLi);
            break;
          case keyCodes.TAB:
          case keyCodes.ESC:
            event.stopPropagation();
            this.reset();
            break;
        }
      };
      this.setAria = target => {
        const selectedOption = this.selectedOption + "-" + this.indexLiSelected(target);
        setAttributes(target, {
          id: selectedOption,
          'aria-selected': 'true',
          addClass: this.activeList
        });
        setAriaActivedescendant(this.root, selectedOption);
        followActiveElement(target, this.outputUl, this.classGroup, this.resultList);
      };
      this.remAria = element => {
        if (!element) return;
        setAttributes(element, {
          id: '',
          removeClass: this.activeList,
          'aria-selected': 'false'
        });
      };
      this.clearbutton = () => {
        if (!this.clearButton) return;
        const {
          cBtn
        } = this;
        setAttributes(cBtn, {
          class: this.prefix + "-clear hidden",
          type: 'button',
          'aria-label': this.clearBtnAriLabel
        });
        this.root.insertAdjacentElement('afterend', cBtn);
      };
      this.destroy = () => {
        const {
          root
        } = this;
        this.clearButton && this.cBtn.classList.add('hidden');
        root.value = '';
        root.focus();
        this.resultList.textContent = '';
        this.reset();
        this.error();
        this.onReset(root);
        root.removeEventListener('keydown', this.handleKeys);
        root.removeEventListener('click', this.handleShowItems);
        document.removeEventListener('click', this.handleDocClick);
      };
      this.id = _element;
      this.root = document.getElementById(_element);
      this.onSearch = isPromise(onSearch) ? onSearch : _ref4 => {
        let {
          currentValue,
          element
        } = _ref4;
        return Promise.resolve(onSearch({
          currentValue,
          element
        }));
      };
      this.onResults = onResults;
      this.onRender = onRender;
      this.onSubmit = onSubmit;
      this.onSelected = onSelectedItem;
      this.onOpened = onOpened;
      this.onReset = onReset;
      this.noResults = noResults;
      this.onClose = onClose;
      this.delay = _delay;
      this.characters = howManyCharacters;
      this.clearButton = clearButton;
      this.selectFirst = _selectFirst;
      this.toInput = insertToInput;
      this.showAll = showAllValues;
      this.classGroup = classGroup;
      this.prevClosing = classPreventClosing;
      this.clearBtnAriLabel = ariaLabelClear ? ariaLabelClear : 'clear text from input';
      this.prefix = classPrefix ? classPrefix + "-auto" : 'auto';
      this.disable = disableCloseOnSelect;
      this.cache = cache;
      this.outputUl = this.prefix + "-" + this.id + "-results";
      this.cacheData = "data-cache-auto-" + this.id;
      this.isLoading = this.prefix + "-is-loading";
      this.isActive = this.prefix + "-is-active";
      this.activeList = this.prefix + "-selected";
      this.selectedOption = this.prefix + "-selected-option";
      this.err = this.prefix + "-error";
      this.regex = /[|\\{}()[\]^$+*?.]/g;
      this.timeout = null;
      this.resultWrap = document.createElement('div');
      this.resultList = document.createElement('ul');
      this.cBtn = document.createElement('button');
      this.init();
    }
  }

  return Autocomplete;

})();
//# sourceMappingURL=autocomplete.js.map
