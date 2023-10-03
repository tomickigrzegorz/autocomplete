/*!
* @name autocomplete
* @version 1.9.0
* @author Grzegorz Tomicki
* @link https://github.com/tomickigrzegorz/autocomplete
* @license MIT
*/
var Autocomplete = (function () {
  'use strict';

  const isObject = value => value && typeof value === "object" && value.constructor === Object;
  const isPromise = value => Boolean(value && typeof value.then === "function");
  const setAttributes = (el, object) => {
    for (let key in object) {
      if (key === "addClass") {
        classList(el, "add", object[key]);
      } else if (key === "removeClass") {
        classList(el, "remove", object[key]);
      } else {
        el.setAttribute(key, object[key]);
      }
    }
  };
  const getFirstElement = element => (element.firstElementChild || element).textContent.trim();
  const scrollResultsToTop = (resultList, resultWrap) => {
    resultList.scrollTop = resultList.offsetTop - resultWrap.offsetHeight;
  };
  const addAriaToAllLiElements = itemsLi => {
    for (let i = 0; i < itemsLi.length; i++) {
      setAttributes(itemsLi[i], {
        role: "option",
        tabindex: "-1",
        "aria-selected": "false",
        "aria-setsize": itemsLi.length,
        "aria-posinset": i
      });
    }
  };
  const showBtnToClearData = function (clearButton, destroy) {
    if (clearButton === void 0) {
      clearButton = false;
    }
    if (!clearButton) return;
    classList(clearButton, "remove", "hidden");
    onEvent(clearButton, "click", destroy);
  };
  const classList = (element, action, className) => element.classList[action](className);
  const setAriaActivedescendant = (root, type) => {
    setAttributes(root, {
      "aria-activedescendant": type || ""
    });
  };
  const getClassGroupHeight = (outputUl, classGroup) => {
    const allLiElements = document.querySelectorAll(`#${outputUl} > li:not(.${classGroup})`);
    let height = 0;
    [].slice.call(allLiElements).map(el => height += el.offsetHeight);
    return height;
  };
  const followActiveElement = (target, outputUl, classGroup, resultList) => {
    const previusElement = resultList.previousSibling;
    const previusElementHeight = previusElement ? previusElement.offsetHeight : 0;
    if (target.getAttribute("aria-posinset") == "0") {
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
      tabIndex: "0",
      role: "listbox"
    });
    setAttributes(resultWrap, {
      addClass: `${prefix}-results-wrapper`
    });
    resultWrap.insertAdjacentElement("beforeend", resultList);
    root.parentNode.insertBefore(resultWrap, root.nextSibling);
  };
  const createElement = type => document.createElement(type);
  const select = element => document.querySelector(element);
  const onEvent = (element, action, callback) => {
    element.addEventListener(action, callback);
  };
  const offEvent = (element, action, callback) => {
    element.removeEventListener(action, callback);
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
        clearButtonOnInitial = false,
        howManyCharacters = 1,
        selectFirst = false,
        insertToInput = false,
        showAllValues = false,
        cache = false,
        disableCloseOnSelect = false,
        preventScrollUp = false,
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
      this._initial = () => {
        this._clearbutton();
        output(this._root, this._resultList, this._outputUl, this._resultWrap, this._prefix);
        onEvent(this._root, "input", this._handleInput);
        this._showAll && onEvent(this._root, "click", this._handleInput);
        this._onRender({
          element: this._root,
          results: this._resultList
        });
        if (this._clearButtonOnInitial) {
          showBtnToClearData(this._clearBtn, this.destroy);
        }
      };
      this._cacheAct = (type, target) => {
        if (!this._cache) return;
        if (type === "update") {
          this._root.setAttribute(this._cacheData, target.value);
        } else if (type === "remove") {
          this._root.removeAttribute(this._cacheData);
        } else {
          this._root.value = this._root.getAttribute(this._cacheData);
        }
      };
      this._handleInput = _ref2 => {
        let {
          target,
          type
        } = _ref2;
        if (this._root.getAttribute("aria-expanded") === "true" && type === "click") {
          return;
        }
        const regex = target.value.replace(this._regex, "\\$&");
        this._cacheAct("update", target);
        const delay = this._showAll ? 0 : this._delay;
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
          this._searchItem(regex.trim());
        }, delay);
      };
      this._reset = () => {
        var _this$_matches;
        classList(this._resultWrap, "remove", this._isActive);
        const ariaAcrivedescentDefault = {
          "aria-owns": `${this._id}-list`,
          "aria-expanded": "false",
          "aria-autocomplete": "list",
          role: "combobox",
          removeClass: "auto-expanded"
        };
        const ariaAcrivedescent = this._preventScrollUp ? ariaAcrivedescentDefault : {
          ...ariaAcrivedescentDefault,
          "aria-activedescendant": ""
        };
        setAttributes(this._root, ariaAcrivedescent);
        if (!this._preventScrollUp) {
          this._removeAria(select(`.${this._activeList}`));
          this._index = this._selectFirst ? 0 : -1;
        }
        if (((_this$_matches = this._matches) == null ? void 0 : _this$_matches.length) == 0 && !this._toInput || this._showAll) {
          this._resultList.textContent = "";
        }
        this._onClose();
      };
      this._searchItem = value => {
        this._value = value;
        this._onLoading(true);
        showBtnToClearData(this._clearBtn, this.destroy);
        if (value.length == 0 && this._clearButton) {
          classList(this._clearBtn, "add", "hidden");
        }
        if (this._characters > value.length && !this._showAll) {
          this._onLoading();
          return;
        }
        this._onSearch({
          currentValue: value,
          element: this._root
        }).then(result => {
          const rootValueLength = this._root.value.length;
          const resultLength = result.length;
          this._matches = Array.isArray(result) ? result : JSON.parse(JSON.stringify(result));
          this._onLoading();
          this._error();
          if (resultLength == 0 && rootValueLength == 0) {
            classList(this._clearBtn, "add", "hidden");
          }
          if (resultLength == 0 && rootValueLength) {
            classList(this._root, "remove", "auto-expanded");
            this._reset();
            this._noResults({
              element: this._root,
              currentValue: value,
              template: this._results
            });
            this._events();
          } else if (resultLength > 0 || isObject(result)) {
            this._index = this._selectFirst ? 0 : -1;
            this._results();
            this._events();
          }
        }).catch(() => {
          this._onLoading();
          this._reset();
        });
      };
      this._onLoading = type => this._root.parentNode.classList[type ? "add" : "remove"](this._isLoading);
      this._error = () => classList(this._root, "remove", this._err);
      this._events = () => {
        onEvent(this._root, "keydown", this._handleKeys);
        onEvent(this._root, "click", this._handleShowItems);
        onEvent(document, "click", this._handleDocClick);
        ["mousemove", "click"].map(eventType => {
          onEvent(this._resultList, eventType, this._handleMouse);
        });
      };
      this._results = template => {
        setAttributes(this._root, {
          "aria-expanded": "true",
          addClass: `${this._prefix}-expanded`
        });
        this._resultList.textContent = "";
        const dataResults = this._matches.length === 0 ? this._onResults({
          currentValue: this._value,
          matches: 0,
          template
        }) : this._onResults({
          currentValue: this._value,
          matches: this._matches,
          classGroup: this._classGroup
        });
        this._resultList.insertAdjacentHTML("afterbegin", dataResults);
        classList(this._resultWrap, "add", this._isActive);
        const checkIfClassGroupExist = this._classGroup ? `:not(.${this._classGroup})` : "";
        this._itemsLi = document.querySelectorAll(`#${this._outputUl} > li${checkIfClassGroupExist}`);
        addAriaToAllLiElements(this._itemsLi);
        this._onOpened({
          type: "results",
          element: this._root,
          results: this._resultList
        });
        this._selectFirstElement();
        scrollResultsToTop(this._resultList, this._resultWrap);
      };
      this._handleDocClick = _ref3 => {
        let {
          target
        } = _ref3;
        let disableClose = null;
        if (target.closest("ul") && this._disable ||
        target.closest(`.${this._prevClosing}`)) {
          disableClose = true;
        }
        if (target.id !== this._id && !disableClose) {
          this._reset();
          return;
        }
      };
      this._selectFirstElement = () => {
        this._removeAria(select(`.${this._activeList}`));
        if (!this._selectFirst) {
          return;
        }
        const {
          firstElementChild
        } = this._resultList;
        const classSelectFirst = this._classGroup && this._matches.length > 0 && this._selectFirst ? firstElementChild.nextElementSibling : firstElementChild;
        this._onSelected({
          index: this._index,
          element: this._root,
          object: this._matches[this._index]
        });
        setAttributes(classSelectFirst, {
          id: `${this._selectedOption}-0`,
          addClass: this._activeList,
          "aria-selected": "true"
        });
        setAriaActivedescendant(this._root, `${this._selectedOption}-0`);
      };
      this._handleShowItems = () => {
        if (this._resultList.textContent.length > 0 && !classList(this._resultWrap, "contains", this._isActive)) {
          setAttributes(this._root, {
            "aria-expanded": "true",
            addClass: `${this._prefix}-expanded`
          });
          classList(this._resultWrap, "add", this._isActive);
          if (!this._preventScrollUp) {
            scrollResultsToTop(this._resultList, this._resultWrap);
            this._selectFirstElement();
          }
          this._onOpened({
            type: "showItems",
            element: this._root,
            results: this._resultList
          });
          if (!this._cache) return;
          this._cacheAct("update", this._root);
        }
      };
      this._handleMouse = event => {
        event.preventDefault();
        const {
          target,
          type
        } = event;
        const targetClosest = target.closest("li");
        const targetClosestRole = targetClosest == null ? void 0 : targetClosest.hasAttribute("role");
        const activeClass = this._activeList;
        const activeClassElement = select(`.${activeClass}`);
        if (!targetClosest || !targetClosestRole || target.closest(`.${this._prevClosing}`)) {
          return;
        }
        if (type === "click") {
          this._getTextFromLi(targetClosest);
        }
        if (type === "mousemove" && !classList(targetClosest, "contains", activeClass)) {
          this._removeAria(activeClassElement);
          this._setAria(targetClosest);
          this._index = this._indexLiSelected(targetClosest);
          this._onSelected({
            index: this._index,
            element: this._root,
            object: this._matches[this._index]
          });
        }
      };
      this._getTextFromLi = element => {
        if (!element || this._matches.length === 0) {
          !this._disable && this._reset();
          return;
        }
        this._clearButton && classList(this._clearBtn, "remove", "hidden");
        this._root.value = getFirstElement(element);
        this._onSubmit({
          index: this._index,
          element: this._root,
          object: this._matches[this._index],
          results: this._resultList
        });
        if (!this._disable) {
          if (!this._preventScrollUp) {
            this._removeAria(element);
          }
          this._reset();
        }
        this._cacheAct("remove");
      };
      this._indexLiSelected = target =>
      Array.prototype.indexOf.call(this._itemsLi, target);
      this._handleKeys = event => {
        const {
          keyCode
        } = event;
        const resultList = classList(this._resultWrap, "contains", this._isActive);
        const matchesLength = this._matches.length + 1;
        this._selectedLi = select(`.${this._activeList}`);
        switch (keyCode) {
          case keyCodes.UP:
          case keyCodes.DOWN:
            event.preventDefault();
            if (matchesLength <= 1 && this._selectFirst || !resultList) {
              return;
            }
            if (keyCode === keyCodes.UP) {
              if (this._index < 0) {
                this._index = matchesLength - 1;
              }
              this._index -= 1;
            } else {
              this._index += 1;
              if (this._index >= matchesLength) {
                this._index = 0;
              }
            }
            this._removeAria(this._selectedLi);
            if (this._index >= 0 && this._index < matchesLength - 1) {
              const selectedElement = this._itemsLi[this._index];
              if (this._toInput && resultList) {
                this._root.value = getFirstElement(selectedElement);
              }
              this._onSelected({
                index: this._index,
                element: this._root,
                object: this._matches[this._index]
              });
              this._setAria(selectedElement);
            } else {
              this._cacheAct();
              setAriaActivedescendant(this._root);
              this._onSelected({
                index: null,
                element: this._root,
                object: null
              });
            }
            break;
          case keyCodes.ENTER:
            event.preventDefault();
            this._getTextFromLi(this._selectedLi);
            break;
          case keyCodes.TAB:
          case keyCodes.ESC:
            event.stopPropagation();
            this._reset();
            break;
        }
      };
      this._setAria = target => {
        const selectedOption = `${this._selectedOption}-${this._indexLiSelected(target)}`;
        setAttributes(target, {
          id: selectedOption,
          "aria-selected": "true",
          addClass: this._activeList
        });
        setAriaActivedescendant(this._root, selectedOption);
        followActiveElement(target, this._outputUl, this._classGroup, this._resultList);
      };
      this._removeAria = element => {
        if (!element) return;
        setAttributes(element, {
          id: "",
          removeClass: this._activeList,
          "aria-selected": "false"
        });
      };
      this._clearbutton = () => {
        if (!this._clearButton) return;
        setAttributes(this._clearBtn, {
          class: `${this._prefix}-clear hidden`,
          type: "button",
          title: this._clearBtnAriLabel,
          "aria-label": this._clearBtnAriLabel
        });
        this._root.insertAdjacentElement("afterend", this._clearBtn);
      };
      this.rerender = inputValue => {
        const text = inputValue != null && inputValue.trim() ? inputValue.trim() : this._root.value;
        if (inputValue != null && inputValue.trim()) {
          this._root.value = inputValue.trim();
          this._cacheAct("update", this._root);
        }
        const regexText = text.replace(this._regex, "\\$&");
        this._searchItem(regexText.trim());
      };
      this.destroy = () => {
        this._clearButton && classList(this._clearBtn, "add", "hidden");
        this._root.value = "";
        this._root.focus();
        this._resultList.textContent = "";
        this._reset();
        this._error();
        this._onReset(this._root);
        offEvent(this._root, "keydown", this._handleKeys);
        offEvent(this._root, "click", this._handleShowItems);
        offEvent(document, "click", this._handleDocClick);
      };
      this._id = _element;
      this._root = document.getElementById(_element);
      this._onSearch = isPromise(onSearch) ? onSearch : _ref4 => {
        let {
          currentValue,
          element
        } = _ref4;
        return Promise.resolve(onSearch({
          currentValue,
          element
        }));
      };
      this._onResults = onResults;
      this._onRender = onRender;
      this._onSubmit = onSubmit;
      this._onSelected = onSelectedItem;
      this._onOpened = onOpened;
      this._onReset = onReset;
      this._noResults = noResults;
      this._onClose = onClose;
      this._delay = _delay;
      this._characters = howManyCharacters;
      this._clearButton = clearButton;
      this._clearButtonOnInitial = clearButtonOnInitial;
      this._selectFirst = selectFirst;
      this._toInput = insertToInput;
      this._showAll = showAllValues;
      this._classGroup = classGroup;
      this._prevClosing = classPreventClosing;
      this._clearBtnAriLabel = ariaLabelClear ? ariaLabelClear : "clear the search query";
      this._prefix = classPrefix ? `${classPrefix}-auto` : "auto";
      this._disable = disableCloseOnSelect;
      this._preventScrollUp = preventScrollUp;
      this._cache = cache;
      this._outputUl = `${this._prefix}-${this._id}-results`;
      this._cacheData = `data-cache-auto-${this._id}`;
      this._isLoading = `${this._prefix}-is-loading`;
      this._isActive = `${this._prefix}-is-active`;
      this._activeList = `${this._prefix}-selected`;
      this._selectedOption = `${this._prefix}-selected-option`;
      this._err = `${this._prefix}-error`;
      this._regex = /[|\\{}()[\]^$+*?.]/g;
      this._timeout = null;
      this._resultWrap = createElement("div");
      this._resultList = createElement("ul");
      this._clearBtn = createElement("button");
      this._initial();
    }
  }

  return Autocomplete;

})();
//# sourceMappingURL=autocomplete.js.map
