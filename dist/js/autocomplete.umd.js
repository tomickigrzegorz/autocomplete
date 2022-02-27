(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Autocomplete = factory());
})(this, (function () { 'use strict';

  const isObject = value => value && typeof value === "object" && value.constructor === Object;
  const isPromise = value => Boolean(value && typeof value.then === "function");
  const setAttributes = (el, object) => {
    for (let key in object) {
      if (key === "addClass") {
        el.classList.add(object[key]);
      } else if (key === "removeClass") {
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
    clearButton.classList.remove("hidden");
    clearButton.addEventListener("click", destroy);
  };
  const setAriaActivedescendant = (root, type) => {
    root.setAttribute("aria-activedescendant", type || "");
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
      addClass: prefix + "-results-wrapper"
    });
    resultWrap.insertAdjacentElement("beforeend", resultList);
    root.parentNode.insertBefore(resultWrap, root.nextSibling);
  };
  const createElement = type => document.createElement(type);

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
        selectFirst = false,
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
      this._initial = () => {
        this._clearbutton();
        output(this._root, this._resultList, this._outputUl, this._resultWrap, this._prefix);
        this._root.addEventListener("input", this._handleInput);
        this._showAll && this._root.addEventListener("click", this._handleInput);
        this._onRender({
          element: this._root,
          results: this._resultList
        });
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
        setAttributes(this._root, {
          "aria-owns": this._id + "-list",
          "aria-expanded": "false",
          "aria-autocomplete": "list",
          "aria-activedescendant": "",
          role: "combobox",
          removeClass: "auto-expanded"
        });
        this._resultWrap.classList.remove(this._isActive);
        if (((_this$_matches = this._matches) == null ? void 0 : _this$_matches.length) == 0 && !this._toInput || this._showAll) {
          this._resultList.innerHTML = "";
        }
        this._index = this._selectFirst ? 0 : -1;
        this._onClose();
      };
      this._searchItem = value => {
        this._value = value;
        this._onLoading(true);
        showBtnToClearData(this._cBtn, this.destroy);
        if (value.length == 0 && this._clearButton) {
          this._cBtn.classList.add("hidden");
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
          this._matches = Array.isArray(result) ? [...result] : JSON.parse(JSON.stringify(result));
          this._onLoading();
          this._error();
          if (resultLength == 0 && rootValueLength == 0) {
            this._cBtn.classList.add("hidden");
          }
          if (resultLength == 0 && rootValueLength) {
            this._root.classList.remove("auto-expanded");
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
      this._error = () => this._root.classList.remove(this._err);
      this._events = () => {
        this._root.addEventListener("keydown", this._handleKeys);
        this._root.addEventListener("click", this._handleShowItems);
        ["mousemove", "click"].map(eventType => {
          this._resultList.addEventListener(eventType, this._handleMouse);
        });
        document.addEventListener("click", this._handleDocClick);
      };
      this._results = template => {
        setAttributes(this._root, {
          "aria-expanded": "true",
          addClass: this._prefix + "-expanded"
        });
        this._resultList.innerHTML = this._matches.length === 0 ? this._onResults({
          currentValue: this._value,
          matches: 0,
          template
        }) : this._onResults({
          currentValue: this._value,
          matches: this._matches,
          classGroup: this._classGroup
        });
        this._resultWrap.classList.add(this._isActive);
        const checkIfClassGroupExist = this._classGroup ? ":not(." + this._classGroup + ")" : "";
        this._itemsLi = document.querySelectorAll("#" + this._outputUl + " > li" + checkIfClassGroupExist);
        addAriaToAllLiElements(this._itemsLi);
        this._onOpened({
          type: "results",
          element: this._root,
          results: this._resultList
        });
        this._selectFirstEl();
        scrollResultsToTop(this._resultList, this._resultWrap);
      };
      this._handleDocClick = _ref3 => {
        let {
          target
        } = _ref3;
        let disableClose = null;
        if (target.closest("ul") && this._disable ||
        target.closest("." + this._prevClosing)) {
          disableClose = true;
        }
        if (target.id !== this._id && !disableClose) {
          this._reset();
          return;
        }
      };
      this._selectFirstEl = () => {
        this._remAria(document.querySelector("." + this._activeList));
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
          id: this._selectedOption + "-0",
          addClass: this._activeList,
          "aria-selected": "true"
        });
        setAriaActivedescendant(this._root, this._selectedOption + "-0");
      };
      this._handleShowItems = () => {
        if (this._resultList.textContent.length > 0 && !this._resultWrap.classList.contains(this._isActive)) {
          setAttributes(this._root, {
            "aria-expanded": "true",
            addClass: this._prefix + "-expanded"
          });
          this._resultWrap.classList.add(this._isActive);
          scrollResultsToTop(this._resultList, this._resultWrap);
          this._selectFirstEl();
          this._onOpened({
            type: "showItems",
            element: this._root,
            results: this._resultList
          });
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
        const activeClassElement = document.querySelector("." + activeClass);
        if (!targetClosest || !targetClosestRole) {
          return;
        }
        if (type === "click") {
          this._getTextFromLi(targetClosest);
        }
        if (type === "mousemove" && !targetClosest.classList.contains(activeClass)) {
          this._remAria(activeClassElement);
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
        getFirstElementFromLiAndAddToInput(element, this._root);
        this._onSubmit({
          index: this._index,
          element: this._root,
          object: this._matches[this._index],
          results: this._resultList
        });
        if (!this._disable) {
          this._remAria(element);
          this._reset();
        }
        this._clearButton && this._cBtn.classList.remove("hidden");
        this._cacheAct("remove");
      };
      this._indexLiSelected = target =>
      Array.prototype.indexOf.call(this._itemsLi, target);
      this._handleKeys = event => {
        const {
          keyCode
        } = event;
        const resultList = this._resultWrap.classList.contains(this._isActive);
        const matchesLength = this._matches.length + 1;
        this._selectedLi = document.querySelector("." + this._activeList);
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
            this._remAria(this._selectedLi);
            if (matchesLength > 0 && this._index >= 0 && this._index < matchesLength - 1) {
              this._onSelected({
                index: this._index,
                element: this._root,
                object: this._matches[this._index]
              });
              this._setAria(this._itemsLi[this._index]);
              if (this._toInput && resultList) {
                getFirstElementFromLiAndAddToInput(this._itemsLi[this._index], this._root);
              }
            } else {
              this._cacheAct();
              setAriaActivedescendant(this._root);
            }
            break;
          case keyCodes.ENTER:
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
        const selectedOption = this._selectedOption + "-" + this._indexLiSelected(target);
        setAttributes(target, {
          id: selectedOption,
          "aria-selected": "true",
          addClass: this._activeList
        });
        setAriaActivedescendant(this._root, selectedOption);
        followActiveElement(target, this._outputUl, this._classGroup, this._resultList);
      };
      this._remAria = element => {
        if (!element) return;
        setAttributes(element, {
          id: "",
          removeClass: this._activeList,
          "aria-selected": "false"
        });
      };
      this._clearbutton = () => {
        if (!this._clearButton) return;
        setAttributes(this._cBtn, {
          class: this._prefix + "-clear hidden",
          type: "button",
          title: this._clearBtnAriLabel,
          "aria-label": this._clearBtnAriLabel
        });
        this._root.insertAdjacentElement("afterend", this._cBtn);
      };
      this.destroy = () => {
        this._clearButton && this._cBtn.classList.add("hidden");
        this._root.value = "";
        this._root.focus();
        this._resultList.textContent = "";
        this._reset();
        this._error();
        this._onReset(this._root);
        this._root.removeEventListener("keydown", this._handleKeys);
        this._root.removeEventListener("click", this._handleShowItems);
        document.removeEventListener("click", this._handleDocClick);
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
      this._selectFirst = selectFirst;
      this._toInput = insertToInput;
      this._showAll = showAllValues;
      this._classGroup = classGroup;
      this._prevClosing = classPreventClosing;
      this._clearBtnAriLabel = ariaLabelClear ? ariaLabelClear : "clear the search query";
      this._prefix = classPrefix ? classPrefix + "-auto" : "auto";
      this._disable = disableCloseOnSelect;
      this._cache = cache;
      this._outputUl = this._prefix + "-" + this._id + "-results";
      this._cacheData = "data-cache-auto-" + this._id;
      this._isLoading = this._prefix + "-is-loading";
      this._isActive = this._prefix + "-is-active";
      this._activeList = this._prefix + "-selected";
      this._selectedOption = this._prefix + "-selected-option";
      this._err = this._prefix + "-error";
      this._regex = /[|\\{}()[\]^$+*?.]/g;
      this._timeout = null;
      this._resultWrap = createElement("div");
      this._resultList = createElement("ul");
      this._cBtn = createElement("button");
      this._initial();
    }
  }

  return Autocomplete;

}));
//# sourceMappingURL=autocomplete.umd.js.map
