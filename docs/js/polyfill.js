function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}!function(e,t){"object"==("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module?t():"function"==typeof define&&define.amd?define(t):t()}(0,(function(){function e(e){var t=this.constructor;return this.then((function(n){return t.resolve(e()).then((function(){return n}))}),(function(n){return t.resolve(e()).then((function(){return t.reject(n)}))}))}function t(e){return!(!e||void 0===e.length)}function n(){}function o(e){if(!(this instanceof o))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],c(e,this)}function r(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,o._immediateFn((function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null!==n){var o;try{o=n(e._value)}catch(e){return void f(t.promise,e)}i(t.promise,o)}else(1===e._state?i:f)(t.promise,e._value)}))):e._deferreds.push(t)}function i(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==_typeof(t)||"function"==typeof t)){var n=t.then;if(t instanceof o)return e._state=3,e._value=t,void u(e);if("function"==typeof n)return void c(function(e,t){return function(){e.apply(t,arguments)}}(n,t),e)}e._state=1,e._value=t,u(e)}catch(t){f(e,t)}}function f(e,t){e._state=2,e._value=t,u(e)}function u(e){2===e._state&&0===e._deferreds.length&&o._immediateFn((function(){e._handled||o._unhandledRejectionFn(e._value)}));for(var t=0,n=e._deferreds.length;n>t;t++)r(e,e._deferreds[t]);e._deferreds=null}function c(e,t){var n=!1;try{e((function(e){n||(n=!0,i(t,e))}),(function(e){n||(n=!0,f(t,e))}))}catch(e){if(n)return;n=!0,f(t,e)}}var l=setTimeout;o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){var o=new this.constructor(n);return r(this,new function(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}(e,t,o)),o},o.prototype.finally=e,o.all=function(e){return new o((function(n,o){function r(e,t){try{if(t&&("object"==_typeof(t)||"function"==typeof t)){var u=t.then;if("function"==typeof u)return void u.call(t,(function(t){r(e,t)}),o)}i[e]=t,0==--f&&n(i)}catch(e){o(e)}}if(!t(e))return o(new TypeError("Promise.all accepts an array"));var i=Array.prototype.slice.call(e);if(0===i.length)return n([]);for(var f=i.length,u=0;i.length>u;u++)r(u,i[u])}))},o.resolve=function(e){return e&&"object"==_typeof(e)&&e.constructor===o?e:new o((function(t){t(e)}))},o.reject=function(e){return new o((function(t,n){n(e)}))},o.race=function(e){return new o((function(n,r){if(!t(e))return r(new TypeError("Promise.race accepts an array"));for(var i=0,f=e.length;f>i;i++)o.resolve(e[i]).then(n,r)}))},o._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){l(e,0)},o._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var a=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("unable to locate global object")}();"Promise"in a?a.Promise.prototype.finally||(a.Promise.prototype.finally=e):a.Promise=o})),Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest||(Element.prototype.closest=function(e){var t=this;do{if(Element.prototype.matches.call(t,e))return t;t=t.parentElement||t.parentNode}while(null!==t&&1===t.nodeType);return null});