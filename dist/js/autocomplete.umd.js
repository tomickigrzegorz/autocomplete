/*!
* @name autocomplete
* @version 3.0.1
* @author Grzegorz Tomicki
* @link https://github.com/tomickigrzegorz/autocomplete
* @license MIT
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Autocomplete = factory());
})(this, (function () { 'use strict';

  var isObject = function isObject(value) {
    return value && typeof value === "object" && value.constructor === Object;
  };
  var isPromise = function isPromise(value) {
    return Boolean(value && typeof value.then === "function");
  };
  var setAttributes = function setAttributes(el, attributes) {
    Object.entries(attributes).forEach(function (_ref) {
      var key = _ref[0],
        value = _ref[1];
      if (key === "addClass" || key === "removeClass") {
        classList(el, key === "addClass" ? "add" : "remove", value);
      } else {
        el.setAttribute(key, value);
      }
    });
  };
  var getFirstElement = function getFirstElement(element) {
    return (element.firstElementChild || element).textContent.trim();
  };
  var scrollResultsToTop = function scrollResultsToTop(resultList, resultWrap) {
    resultList.scrollTop = resultList.offsetTop - resultWrap.offsetHeight;
  };
  var addAriaToAllLiElements = function addAriaToAllLiElements(itemsLi) {
    itemsLi.forEach(function (item, index) {
      setAttributes(item, {
        role: "option",
        tabindex: "-1",
        "aria-selected": "false",
        "aria-setsize": itemsLi.length,
        "aria-posinset": index + 1
      });
    });
  };
  var showBtnToClearData = function showBtnToClearData(clearButton, destroy) {
    if (!clearButton) return;
    classList(clearButton, "remove", "hidden");
    onEvent(clearButton, "click", destroy);
  };
  var classList = function classList(element, action, className) {
    return element.classList[action](className);
  };
  var setAriaActivedescendant = function setAriaActivedescendant(root, type) {
    setAttributes(root, {
      "aria-activedescendant": type || ""
    });
  };
  var getClassGroupHeight = function getClassGroupHeight(outputUl, classGroup) {
    var allLiElements = document.querySelectorAll("#" + outputUl + " > li:not(." + classGroup + ")");
    return Array.from(allLiElements).reduce(function (height, el) {
      return height + el.offsetHeight;
    }, 0);
  };
  var followActiveElement = function followActiveElement(target, outputUl, classGroup, resultList) {
    var previousElement = resultList.previousSibling;
    var previousElementHeight = previousElement ? previousElement.offsetHeight : 0;
    if (target.getAttribute("aria-posinset") === "0") {
      resultList.scrollTop = target.offsetTop - getClassGroupHeight(outputUl, classGroup);
    }
    if (target.offsetTop - previousElementHeight < resultList.scrollTop) {
      resultList.scrollTop = target.offsetTop - previousElementHeight;
    } else {
      var offsetBottom = target.offsetTop + target.offsetHeight - previousElementHeight;
      var scrollBottom = resultList.scrollTop + resultList.offsetHeight;
      if (offsetBottom > scrollBottom) {
        resultList.scrollTop = offsetBottom - resultList.offsetHeight;
      }
    }
  };
  var output = function output(root, resultList, outputUl, resultWrap, prefix) {
    setAttributes(resultList, {
      id: outputUl,
      role: "listbox"
    });
    setAttributes(resultWrap, {
      addClass: prefix + "-results-wrapper"
    });
    resultWrap.insertAdjacentElement("beforeend", resultList);
    root.parentNode.insertBefore(resultWrap, root.nextSibling);
  };
  var createElement = function createElement(type) {
    return document.createElement(type);
  };
  var select = function select(selector) {
    return document.querySelector(selector);
  };
  var onEvent = function onEvent(element, action, callback) {
    element.addEventListener(action, callback);
  };
  var offEvent = function offEvent(element, action, callback) {
    element.removeEventListener(action, callback);
  };
  var ariaActiveDescendantDefault = function ariaActiveDescendantDefault(id) {
    return {
      "aria-owns": id,
      "aria-expanded": "false",
      "aria-autocomplete": "list",
      role: "combobox",
      removeClass: "auto-expanded"
    };
  };

  var KEY_CODES = Object.freeze({
    ESC: 27,
    ENTER: 13,
    UP: 38,
    DOWN: 40,
    TAB: 9
  });

  var Autocomplete =
  function Autocomplete(_element, _ref) {
    var _this = this;
    var _ref$delay = _ref.delay,
      _delay = _ref$delay === void 0 ? 500 : _ref$delay,
      _ref$clearButton = _ref.clearButton,
      clearButton = _ref$clearButton === void 0 ? true : _ref$clearButton,
      _ref$clearButtonOnIni = _ref.clearButtonOnInitial,
      clearButtonOnInitial = _ref$clearButtonOnIni === void 0 ? false : _ref$clearButtonOnIni,
      _ref$howManyCharacter = _ref.howManyCharacters,
      howManyCharacters = _ref$howManyCharacter === void 0 ? 1 : _ref$howManyCharacter,
      _ref$selectFirst = _ref.selectFirst,
      selectFirst = _ref$selectFirst === void 0 ? false : _ref$selectFirst,
      _ref$insertToInput = _ref.insertToInput,
      insertToInput = _ref$insertToInput === void 0 ? false : _ref$insertToInput,
      _ref$showValuesOnClic = _ref.showValuesOnClick,
      showValuesOnClick = _ref$showValuesOnClic === void 0 ? false : _ref$showValuesOnClic,
      _ref$inline = _ref.inline,
      inline = _ref$inline === void 0 ? false : _ref$inline,
      _ref$cache = _ref.cache,
      cache = _ref$cache === void 0 ? false : _ref$cache,
      _ref$disableCloseOnSe = _ref.disableCloseOnSelect,
      disableCloseOnSelect = _ref$disableCloseOnSe === void 0 ? false : _ref$disableCloseOnSe,
      _ref$preventScrollUp = _ref.preventScrollUp,
      preventScrollUp = _ref$preventScrollUp === void 0 ? false : _ref$preventScrollUp,
      _ref$removeResultsWhe = _ref.removeResultsWhenInputIsEmpty,
      removeResultsWhenInputIsEmpty = _ref$removeResultsWhe === void 0 ? false : _ref$removeResultsWhe,
      _ref$regex = _ref.regex,
      _regex = _ref$regex === void 0 ? {
        expression: /[|\\{}()[\]^$+*?]/g,
        replacement: "\\$&"
      } : _ref$regex,
      classGroup = _ref.classGroup,
      classPreventClosing = _ref.classPreventClosing,
      classPrefix = _ref.classPrefix,
      ariaLabelClear = _ref.ariaLabelClear,
      onSearch = _ref.onSearch,
      _ref$onResults = _ref.onResults,
      onResults = _ref$onResults === void 0 ? function () {} : _ref$onResults,
      _ref$onSubmit = _ref.onSubmit,
      onSubmit = _ref$onSubmit === void 0 ? function () {} : _ref$onSubmit,
      _ref$onOpened = _ref.onOpened,
      onOpened = _ref$onOpened === void 0 ? function () {} : _ref$onOpened,
      _ref$onReset = _ref.onReset,
      onReset = _ref$onReset === void 0 ? function () {} : _ref$onReset,
      _ref$onRender = _ref.onRender,
      onRender = _ref$onRender === void 0 ? function () {} : _ref$onRender,
      _ref$onClose = _ref.onClose,
      onClose = _ref$onClose === void 0 ? function () {} : _ref$onClose,
      _ref$noResults = _ref.noResults,
      noResults = _ref$noResults === void 0 ? function () {} : _ref$noResults,
      _ref$onSelectedItem = _ref.onSelectedItem,
      onSelectedItem = _ref$onSelectedItem === void 0 ? function () {} : _ref$onSelectedItem;
    this._initial = function () {
      _this._clearbutton();
      var ariaAcrivedescentDefault = ariaActiveDescendantDefault(_this._outputUl);
      setAttributes(_this._root, ariaAcrivedescentDefault);
      output(_this._root, _this._resultList, _this._outputUl, _this._resultWrap, _this._prefix);
      onEvent(_this._root, "input", _this._handleInput);
      _this._showValuesOnClick && onEvent(_this._root, "click", _this._handleInput);
      if (_this._inline) {
        var config = {
          root: _this._root,
          type: "load"
        };
        onEvent(_this._root, "load", _this._handleInput(config));
      }
      _this._onRender({
        element: _this._root,
        results: _this._resultList
      });
      if (_this._clearButtonOnInitial) {
        showBtnToClearData(_this._clearBtn, _this.destroy);
      }
    };
    this._cacheAct = function (type, target) {
      if (!_this._cache) return;
      if (type === "update") {
        _this._root.setAttribute(_this._cacheData, target == null ? void 0 : target.value);
      } else if (type === "remove") {
        _this._root.removeAttribute(_this._cacheData);
      } else {
        _this._root.value = _this._root.getAttribute(_this._cacheData);
      }
    };
    this._handleInput = function (_ref2) {
      var _target;
      var target = _ref2.target,
        type = _ref2.type;
      if (_this._root.getAttribute("aria-expanded") === "true" && type === "click") {
        return;
      }
      target = _this._inline ? _this._root : target;
      var regex = (_target = target) == null ? void 0 : _target.value.replace(_this._regex.expression, _this._regex.replacement);
      _this._cacheAct("update", target);
      var delay = _this._showValuesOnClick || _this._inline && type === "load" ? 0 : _this._delay;
      clearTimeout(_this._timeout);
      _this._timeout = setTimeout(function () {
        if (_this._removeResultsWhenInputIsEmpty) {
          var _target2;
          if (((_target2 = target) == null ? void 0 : _target2.value.length) === 0) {
            _this.destroy();
            return;
          }
        }
        _this._searchItem(regex == null ? void 0 : regex.trim());
      }, delay);
    };
    this._reset = function () {
      var _this$_matches;
      classList(_this._resultWrap, "remove", _this._isActive);
      var ariaAcrivedescentDefault = ariaActiveDescendantDefault(_this._outputUl);
      var ariaAcrivedescent = _this._preventScrollUp ? ariaAcrivedescentDefault : Object.assign({}, ariaAcrivedescentDefault, {
        "aria-activedescendant": ""
      });
      setAttributes(_this._root, ariaAcrivedescent);
      if (!_this._preventScrollUp) {
        _this._removeAria(select("." + _this._activeList));
        _this._index = _this._selectFirst ? 0 : -1;
      }
      if (((_this$_matches = _this._matches) == null ? void 0 : _this$_matches.length) == 0 && !_this._toInput || _this._showValuesOnClick) {
        _this._resultList.textContent = "";
      }
      _this._onClose();
    };
    this._searchItem = function (value) {
      _this._value = value;
      _this._onLoading(true);
      showBtnToClearData(_this._clearBtn, _this.destroy);
      if ((!value || (value == null ? void 0 : value.length) === 0) && _this._clearButton && !_this._clearButtonOnInitial) {
        classList(_this._clearBtn, "add", "hidden");
      }
      if (_this._characters > (value == null ? void 0 : value.length) && !_this._showValuesOnClick && !_this._inline) {
        _this._onLoading();
        return;
      }
      _this._onSearch({
        currentValue: value,
        element: _this._root
      }).then(function (result) {
        var rootValueLength = _this._root.value.length;
        var resultLength = result.length;
        _this._matches = Array.isArray(result) ? result : JSON.parse(JSON.stringify(result));
        _this._onLoading();
        _this._error();
        if (resultLength === 0 && rootValueLength === 0) {
          classList(_this._clearBtn, "add", "hidden");
        }
        if (resultLength === 0 && rootValueLength) {
          classList(_this._root, "remove", "auto-expanded");
          _this._reset();
          _this._noResults({
            element: _this._root,
            currentValue: value,
            template: _this._results
          });
          _this._events();
        } else if (resultLength > 0 || isObject(result)) {
          _this._index = _this._selectFirst ? 0 : -1;
          _this._results();
          _this._events();
        }
      }).catch(function () {
        _this._onLoading();
        _this._reset();
      });
    };
    this._onLoading = function (type) {
      return _this._root.parentNode.classList[type ? "add" : "remove"](_this._isLoading);
    };
    this._error = function () {
      return classList(_this._root, "remove", _this._err);
    };
    this._events = function () {
      onEvent(_this._root, "keydown", _this._handleKeys);
      onEvent(_this._root, "click", _this._handleShowItems);
      if (!_this._inline) {
        onEvent(document, "click", _this._handleDocClick);
      }
      ["mousemove", "click"].map(function (eventType) {
        onEvent(_this._resultList, eventType, _this._handleMouse);
      });
    };
    this._results = function (template) {
      setAttributes(_this._root, {
        "aria-expanded": "true",
        addClass: _this._prefix + "-expanded"
      });
      _this._resultList.textContent = "";
      var dataResults = _this._matches.length === 0 ? _this._onResults({
        currentValue: _this._value,
        matches: 0,
        template: template
      }) : _this._onResults({
        currentValue: _this._value,
        matches: _this._matches,
        classGroup: _this._classGroup
      });
      _this._resultList.insertAdjacentHTML("afterbegin", dataResults);
      classList(_this._resultWrap, "add", _this._isActive);
      var checkIfClassGroupExist = _this._classGroup ? ":not(." + _this._classGroup + ")" : "";
      _this._itemsLi = document.querySelectorAll("#" + _this._outputUl + " > li" + checkIfClassGroupExist);
      addAriaToAllLiElements(_this._itemsLi);
      _this._onOpened({
        type: "results",
        element: _this._root,
        results: _this._resultList
      });
      _this._selectFirstElement();
      scrollResultsToTop(_this._resultList, _this._resultWrap);
    };
    this._handleDocClick = function (_ref3) {
      var target = _ref3.target;
      var disableClose = null;
      if (target.closest("ul") && _this._disable ||
      target.closest("." + _this._prevClosing)) {
        disableClose = true;
      }
      if (target.id !== _this._id && !disableClose) {
        _this._reset();
        return;
      }
    };
    this._selectFirstElement = function () {
      _this._removeAria(select("." + _this._activeList));
      if (!_this._selectFirst) {
        return;
      }
      var firstElementChild = _this._resultList.firstElementChild;
      var classSelectFirst = _this._classGroup && _this._matches.length > 0 && _this._selectFirst ? firstElementChild.nextElementSibling : firstElementChild;
      _this._onSelected({
        index: _this._index,
        element: _this._root,
        object: _this._matches[_this._index],
        currentValue: _this._root.value
      });
      setAttributes(classSelectFirst, {
        id: _this._selectedOption + "-0",
        addClass: _this._activeList,
        "aria-selected": "true"
      });
      setAriaActivedescendant(_this._root, _this._selectedOption + "-0");
    };
    this._handleShowItems = function () {
      if (_this._resultList.textContent.length > 0 && !classList(_this._resultWrap, "contains", _this._isActive)) {
        setAttributes(_this._root, {
          "aria-expanded": "true",
          addClass: _this._prefix + "-expanded"
        });
        classList(_this._resultWrap, "add", _this._isActive);
        if (!_this._preventScrollUp) {
          scrollResultsToTop(_this._resultList, _this._resultWrap);
          _this._selectFirstElement();
        }
        _this._onOpened({
          type: "showItems",
          element: _this._root,
          results: _this._resultList
        });
        if (!_this._cache) return;
        _this._cacheAct("update", _this._root);
      }
    };
    this._handleMouse = function (event) {
      event.preventDefault();
      var target = event.target,
        type = event.type;
      var targetClosest = target.closest("li");
      var targetClosestRole = targetClosest == null ? void 0 : targetClosest.hasAttribute("role");
      var activeClass = _this._activeList;
      var activeClassElement = select("." + activeClass);
      if (!targetClosest || !targetClosestRole || target.closest("." + _this._prevClosing)) {
        return;
      }
      if (type === "click") {
        _this._getTextFromLi(targetClosest);
      }
      if (type === "mousemove" && !classList(targetClosest, "contains", activeClass)) {
        _this._removeAria(activeClassElement);
        _this._setAria(targetClosest);
        _this._index = _this._indexLiSelected(targetClosest);
        _this._onSelected({
          index: _this._index,
          element: _this._root,
          object: _this._matches[_this._index]
        });
        if (_this._root.value.length > 0) {
          _this._clearButton && classList(_this._clearBtn, "remove", "hidden");
        }
      }
    };
    this._getTextFromLi = function (element) {
      if (!element || _this._matches.length === 0) {
        !_this._disable && _this._reset();
        return;
      }
      _this._clearButton && classList(_this._clearBtn, "remove", "hidden");
      _this._root.value = getFirstElement(element);
      _this._onSubmit({
        index: _this._index,
        element: _this._root,
        object: _this._matches[_this._index],
        results: _this._resultList
      });
      if (!_this._disable) {
        if (!_this._preventScrollUp) {
          _this._removeAria(element);
        }
        _this._reset();
      }
      _this._cacheAct("remove");
    };
    this._indexLiSelected = function (target) {
      return (
        Array.prototype.indexOf.call(_this._itemsLi, target)
      );
    };
    this._handleKeys = function (event) {
      var keyCode = event.keyCode;
      var resultList = classList(_this._resultWrap, "contains", _this._isActive);
      var matchesLength = _this._matches.length + 1;
      _this._selectedLi = select("." + _this._activeList);
      switch (keyCode) {
        case KEY_CODES.UP:
        case KEY_CODES.DOWN:
          event.preventDefault();
          if (matchesLength <= 1 && _this._selectFirst || !resultList) {
            return;
          }
          if (keyCode === KEY_CODES.UP) {
            if (_this._index < 0) {
              _this._index = matchesLength - 1;
            }
            _this._index -= 1;
          } else {
            _this._index += 1;
            if (_this._index >= matchesLength) {
              _this._index = 0;
            }
          }
          _this._removeAria(_this._selectedLi);
          if (_this._index >= 0 && _this._index < matchesLength - 1) {
            var selectedElement = _this._itemsLi[_this._index];
            if (_this._toInput && resultList) {
              _this._root.value = getFirstElement(selectedElement);
              _this._clearButton && classList(_this._clearBtn, "remove", "hidden");
            }
            _this._onSelected({
              index: _this._index,
              element: _this._root,
              object: _this._matches[_this._index]
            });
            _this._setAria(selectedElement);
          } else {
            _this._cacheAct();
            setAriaActivedescendant(_this._root);
            _this._onSelected({
              index: null,
              element: _this._root,
              object: null
            });
          }
          break;
        case KEY_CODES.ENTER:
          event.preventDefault();
          _this._getTextFromLi(_this._selectedLi);
          break;
        case KEY_CODES.TAB:
        case KEY_CODES.ESC:
          event.stopPropagation();
          if (!_this._inline) {
            _this._reset();
          }
          break;
      }
    };
    this._setAria = function (target) {
      var selectedOption = _this._selectedOption + "-" + _this._indexLiSelected(target);
      setAttributes(target, {
        id: selectedOption,
        "aria-selected": "true",
        addClass: _this._activeList
      });
      setAriaActivedescendant(_this._root, selectedOption);
      followActiveElement(target, _this._outputUl, _this._classGroup, _this._resultList);
    };
    this._removeAria = function (element) {
      if (!element) return;
      setAttributes(element, {
        id: "",
        removeClass: _this._activeList,
        "aria-selected": "false"
      });
    };
    this._clearbutton = function () {
      if (!_this._clearButton) return;
      setAttributes(_this._clearBtn, {
        type: "button",
        class: _this._prefix + "-clear hidden",
        title: _this._clearBtnAriLabel,
        "aria-label": _this._clearBtnAriLabel
      });
      _this._root.insertAdjacentElement("afterend", _this._clearBtn);
    };
    this.rerender = function (inputValue) {
      var text = inputValue != null && inputValue.trim() ? inputValue.trim() : _this._root.value;
      if (inputValue != null && inputValue.trim()) {
        _this._root.value = inputValue.trim();
        _this._cacheAct("update", _this._root);
      }
      var regexText = text.replace(_this._regex.expression, _this._regex.replacement);
      _this._searchItem(regexText.trim());
    };
    this.disable = function (clearInput) {
      if (clearInput === void 0) {
        clearInput = false;
      }
      _this._clearButton && classList(_this._clearBtn, "add", "hidden");
      if (clearInput) {
        _this._root.value = "";
        _this._root.focus();
      }
      _this._resultList.textContent = "";
      classList(_this._resultWrap, "remove", _this._isActive);
      setAttributes(_this._root, {
        "aria-expanded": "false",
        removeClass: _this._prefix + "-expanded",
        "aria-activedescendant": ""
      });
      offEvent(_this._root, "input", _this._handleInput);
      offEvent(_this._root, "keydown", _this._handleKeys);
      offEvent(_this._root, "click", _this._handleShowItems);
      if (_this._showValuesOnClick) {
        offEvent(_this._root, "click", _this._handleInput);
      }
      if (!_this._inline) {
        offEvent(document, "click", _this._handleDocClick);
      }
      ["mousemove", "click"].forEach(function (eventType) {
        offEvent(_this._resultList, eventType, _this._handleMouse);
      });
      _this._onLoading(false);
      _this._error();
      _this._onClose();
    };
    this.destroy = function () {
      _this._clearButton && classList(_this._clearBtn, "add", "hidden");
      _this._root.value = "";
      _this._root.focus();
      _this._resultList.textContent = "";
      if (!_this._inline) _this._reset();
      if (_this._inline) _this._onClose();
      _this._error();
      _this._onReset(_this._root);
      _this._onLoading();
      offEvent(_this._root, "keydown", _this._handleKeys);
      offEvent(_this._root, "click", _this._handleShowItems);
      offEvent(document, "click", _this._handleDocClick);
    };
    this._id = _element;
    this._root = document.getElementById(_element);
    this._onSearch = isPromise(onSearch) ? onSearch : function (_ref4) {
      var currentValue = _ref4.currentValue,
        element = _ref4.element;
      return Promise.resolve(onSearch({
        currentValue: currentValue,
        element: element
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
    this._showValuesOnClick = showValuesOnClick;
    this._inline = inline;
    this._classGroup = classGroup;
    this._prevClosing = classPreventClosing;
    this._clearBtnAriLabel = ariaLabelClear ? ariaLabelClear : "clear the search query";
    this._prefix = classPrefix ? classPrefix + "-auto" : "auto";
    this._disable = disableCloseOnSelect;
    this._preventScrollUp = preventScrollUp;
    this._removeResultsWhenInputIsEmpty = removeResultsWhenInputIsEmpty;
    this._cache = cache;
    this._timeout = null;
    this._outputUl = this._prefix + "-" + this._id + "-results";
    this._cacheData = "data-cache-auto-" + this._id;
    this._isLoading = this._prefix + "-is-loading";
    this._isActive = this._prefix + "-is-active";
    this._activeList = this._prefix + "-selected";
    this._selectedOption = this._prefix + "-selected-option";
    this._err = this._prefix + "-error";
    this._resultWrap = createElement("div");
    this._resultList = createElement("ul");
    this._clearBtn = createElement("button");
    this._regex = Object.assign({}, {
      expression: /[|\\{}()[\]^$+*?]/g,
      replacement: "\\$&"
    }, _regex);
    if (!this._regex.replacement) {
      this._regex.replacement = this._defaultExpression.replacement;
    }
    if (!this._regex.expression) {
      this._regex.expression = this._defaultExpression.expression;
    }
    this._initial();
  };

  return Autocomplete;

}));
