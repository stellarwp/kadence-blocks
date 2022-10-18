/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/packages/helpers/src/advanced-get-preview-size/index.js":
/*!*********************************************************************!*\
  !*** ./src/packages/helpers/src/advanced-get-preview-size/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Return the proper preview size, given the current preview device
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((device, index, desktopData, tabletData, mobileData) => {
  const desktopSize = undefined !== desktopData[index] ? desktopData[index] : '';
  const tabletSize = undefined !== tabletData[index] ? tabletData[index] : '';
  const mobileSize = undefined !== mobileData[index] ? mobileData[index] : '';

  if (device === 'Mobile') {
    if (undefined !== mobileSize && '' !== mobileSize && null !== mobileSize) {
      return mobileSize;
    } else if (undefined !== tabletSize && '' !== tabletSize && null !== tabletSize) {
      return tabletSize;
    }
  } else if (device === 'Tablet') {
    if (undefined !== tabletSize && '' !== tabletSize && null !== tabletSize) {
      return tabletSize;
    }
  }

  return desktopSize;
});

/***/ }),

/***/ "./src/packages/helpers/src/capital-first/index.js":
/*!*********************************************************!*\
  !*** ./src/packages/helpers/src/capital-first/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * function to return string with capital letter.
 * @param {string} string the word string.
 * @returns {string} with capital letter.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
});

/***/ }),

/***/ "./src/packages/helpers/src/deprecated-kadence-color-output/index.js":
/*!***************************************************************************!*\
  !*** ./src/packages/helpers/src/deprecated-kadence-color-output/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ KadenceColorOutput)
/* harmony export */ });
/* harmony import */ var _hex_to_rgba__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hex-to-rgba */ "./src/packages/helpers/src/hex-to-rgba/index.js");
/**
 * function to return string with var if needed.
 * @param {string} string the word string.
 * @returns {string} with var if needed.
 */

/* global kadence_blocks_params */
 // eslint-disable-next-line camelcase

function KadenceColorOutput(string) {
  let opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (string && string.startsWith('palette')) {
    string = 'var(--global-' + string + ')';
  } else if (opacity !== null && !isNaN(opacity) && 1 !== Number(opacity) && undefined !== string && '' !== string) {
    string = (0,_hex_to_rgba__WEBPACK_IMPORTED_MODULE_0__["default"])(string, opacity);
  }

  return string;
}

/***/ }),

/***/ "./src/packages/helpers/src/fetch-json/index.js":
/*!******************************************************!*\
  !*** ./src/packages/helpers/src/fetch-json/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Fetch JSON.
 *
 * Helper function to return parsed JSON and also the response headers.
 *
 * @param {object} args
 * @param {array} headerKeys Array of headers to include.
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function (args) {
  let headerKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['x-wp-totalpages'];
  return new Promise(resolve => {
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({ ...args,
      parse: false
    }).then(response => Promise.all([response.json ? response.json() : [], (0,lodash__WEBPACK_IMPORTED_MODULE_0__.zipObject)(headerKeys, headerKeys.map(key => response.headers.get(key)))])).then(data => resolve(data)).catch(() => {});
  });
});

/***/ }),

/***/ "./src/packages/helpers/src/get-preview-size/index.js":
/*!************************************************************!*\
  !*** ./src/packages/helpers/src/get-preview-size/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Return the proper preview size, given the current preview device
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((device, desktopSize, tabletSize, mobileSize) => {
  if (device === 'Mobile') {
    if (undefined !== mobileSize && '' !== mobileSize && null !== mobileSize) {
      return mobileSize;
    } else if (undefined !== tabletSize && '' !== tabletSize && null !== tabletSize) {
      return tabletSize;
    }
  } else if (device === 'Tablet') {
    if (undefined !== tabletSize && '' !== tabletSize && null !== tabletSize) {
      return tabletSize;
    }
  }

  return desktopSize;
});

/***/ }),

/***/ "./src/packages/helpers/src/get-unit-icon/index.js":
/*!*********************************************************!*\
  !*** ./src/packages/helpers/src/get-unit-icon/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Return the icon given a unit
 */

/**
 * Import Icons
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (unit => {
  let lowerUnit = unit.toLowerCase();

  if (lowerUnit === '%') {
    return _kadence_icons__WEBPACK_IMPORTED_MODULE_0__.percentIcon;
  } else if (lowerUnit === 'em') {
    return _kadence_icons__WEBPACK_IMPORTED_MODULE_0__.emIcon;
  } else if (lowerUnit === 'vh') {
    return _kadence_icons__WEBPACK_IMPORTED_MODULE_0__.vhIcon;
  } else if (lowerUnit === 'vw') {
    return _kadence_icons__WEBPACK_IMPORTED_MODULE_0__.vwIcon;
  } else if (lowerUnit === 'rem') {
    return _kadence_icons__WEBPACK_IMPORTED_MODULE_0__.remIcon;
  }

  return _kadence_icons__WEBPACK_IMPORTED_MODULE_0__.pxIcon;
});

/***/ }),

/***/ "./src/packages/helpers/src/hex-to-rgba/index.js":
/*!*******************************************************!*\
  !*** ./src/packages/helpers/src/hex-to-rgba/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * function to return string with capital letter.
 * @param {string} hex the color hex.
 * @param {number} alpha the alpha number.
 * @returns {string} rgba color.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((hex, alpha) => {
  if (null === hex) {
    return '';
  }
  /**
   * Detect CSS variables in form of var(--color) and get their current
   * values from the :root selector.
   */


  if (hex.indexOf('var(') > -1) {
    hex = window.getComputedStyle(document.documentElement).getPropertyValue(hex.replace('var(', '').replace(')', '')) || '#fff';
  }

  hex = hex.replace('#', '');
  const r = parseInt(hex.length === 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2), 16);
  const g = parseInt(hex.length === 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4), 16);
  const b = parseInt(hex.length === 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
});

/***/ }),

/***/ "./src/packages/helpers/src/kadence-color-output/index.js":
/*!****************************************************************!*\
  !*** ./src/packages/helpers/src/kadence-color-output/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ KadenceColorOutput)
/* harmony export */ });
/* harmony import */ var _hex_to_rgba__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hex-to-rgba */ "./src/packages/helpers/src/hex-to-rgba/index.js");
/**
 * function to return string with var if needed.
 * @param {string} string the word string.
 * @returns {string} with var if needed.
 */

/* global kadence_blocks_params */
 // eslint-disable-next-line camelcase

function KadenceColorOutput(string) {
  let opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (string && string.startsWith('palette')) {
    string = 'var(--global-' + string + ')';
  } else if (opacity !== null && !isNaN(opacity) && 1 !== Number(opacity) && undefined !== string && '' !== string) {
    string = (0,_hex_to_rgba__WEBPACK_IMPORTED_MODULE_0__["default"])(string, opacity);
  }

  return string;
}

/***/ }),

/***/ "./src/packages/helpers/src/parse-json/index.js":
/*!******************************************************!*\
  !*** ./src/packages/helpers/src/parse-json/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Try Parsing
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function (jsonString) {
  let forceJson = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  try {
    var o = JSON.parse(jsonString); // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:

    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) {}

  if (jsonString && typeof jsonString === "object") {
    return jsonString;
  }

  if (forceJson) {
    return {};
  }

  return false;
});

/***/ }),

/***/ "./src/packages/helpers/src/show-settings/index.js":
/*!*********************************************************!*\
  !*** ./src/packages/helpers/src/show-settings/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Return boolean about showing settings.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((key, blockName) => {
  const blockSettings = kadence_blocks_params.settings ? JSON.parse(kadence_blocks_params.settings) : {};
  let settings = {};

  if (blockSettings[blockName] !== undefined && typeof blockSettings[blockName] === 'object') {
    settings = blockSettings[blockName];
  }

  const user = kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin';

  if (undefined === settings[key] || 'all' === settings[key]) {
    return true;
  } else if ('contributor' === settings[key] && ('contributor' === user || 'author' === user || 'editor' === user || 'admin' === user)) {
    return true;
  } else if ('author' === settings[key] && ('author' === user || 'editor' === user || 'admin' === user)) {
    return true;
  } else if ('editor' === settings[key] && ('editor' === user || 'admin' === user)) {
    return true;
  } else if ('admin' === settings[key] && 'admin' === user) {
    return true;
  }

  return false;
});

/***/ }),

/***/ "./src/packages/helpers/src/typography-style/index.js":
/*!************************************************************!*\
  !*** ./src/packages/helpers/src/typography-style/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _get_preview_size__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../get-preview-size */ "./src/packages/helpers/src/get-preview-size/index.js");

/**
 * Return boolean about showing settings.
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((data, cssClass, previewDevice) => {
  let outputCSS = '';

  if (undefined !== data && undefined !== data[0]) {
    const previewTypographySize = (0,_get_preview_size__WEBPACK_IMPORTED_MODULE_0__["default"])(previewDevice, undefined !== data && undefined !== data[0] && undefined !== data[0].size && undefined !== data[0].size[0] ? data[0].size[0] : '', undefined !== data && undefined !== data[0] && undefined !== data[0].size && undefined !== data[0].size[1] ? data[0].size[1] : '', undefined !== data && undefined !== data[0] && undefined !== data[0].size && undefined !== data[0].size[2] ? data[0].size[2] : '');

    if (previewTypographySize) {
      outputCSS = outputCSS + 'font-size:' + previewTypographySize + (undefined !== data[0].sizeType ? data[0].sizeType : 'px') + ';';
    }

    const previewTypographyLineHeight = (0,_get_preview_size__WEBPACK_IMPORTED_MODULE_0__["default"])(previewDevice, undefined !== data && undefined !== data[0] && undefined !== data[0].lineHeight && undefined !== data[0].lineHeight[0] ? data[0].lineHeight[0] : '', undefined !== data && undefined !== data[0] && undefined !== data[0].lineHeight && undefined !== data[0].lineHeight[1] ? data[0].lineHeight[1] : '', undefined !== data && undefined !== data[0] && undefined !== data[0].lineHeight && undefined !== data[0].lineHeight[2] ? data[0].lineHeight[2] : '');

    if (previewTypographyLineHeight) {
      outputCSS = outputCSS + 'line-height:' + previewTypographyLineHeight + (undefined !== data[0].lineType ? data[0].lineType : 'px') + ';';
    }

    const previewTypographyLetterSpacing = (0,_get_preview_size__WEBPACK_IMPORTED_MODULE_0__["default"])(previewDevice, undefined !== data && undefined !== data[0] && undefined !== data[0].letterSpacing && undefined !== data[0].letterSpacing[0] ? data[0].letterSpacing[0] : '', undefined !== data && undefined !== data[0] && undefined !== data[0].letterSpacing && undefined !== data[0].letterSpacing[1] ? data[0].letterSpacing[1] : '', undefined !== data && undefined !== data[0] && undefined !== data[0].letterSpacing && undefined !== data[0].letterSpacing[2] ? data[0].letterSpacing[2] : '');

    if (previewTypographyLetterSpacing) {
      outputCSS = outputCSS + 'letter-spacing:' + previewTypographyLetterSpacing + (undefined !== data[0].letterSpacingType ? data[0].letterSpacingType : 'px') + ';';
    }

    if (undefined !== data[0].weight && '' !== data[0].weight) {
      outputCSS = outputCSS + 'font-weight:' + data[0].weight + ';';
    }

    if (undefined !== data[0].style && '' !== data[0].style) {
      outputCSS = outputCSS + 'font-style:' + data[0].style + ';';
    }

    if (undefined !== data[0].textTransform && '' !== data[0].textTransform) {
      outputCSS = outputCSS + 'text-transform:' + data[0].textTransform + ';';
    }

    if (undefined !== data[0].family && '' !== data[0].family) {
      outputCSS = outputCSS + 'font-family:' + data[0].family + ';';
    }
  }

  if (!outputCSS) {
    return '';
  }

  return cssClass + '{' + outputCSS + '}';
});

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = window["lodash"];

/***/ }),

/***/ "@kadence/icons":
/*!************************************!*\
  !*** external ["kadence","icons"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["kadence"]["icons"];

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["apiFetch"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************************!*\
  !*** ./src/packages/helpers/src/index.js ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DeprecatedKadenceColorOutput": () => (/* reexport safe */ _deprecated_kadence_color_output__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "KadenceColorOutput": () => (/* reexport safe */ _kadence_color_output__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "KadenceTryParseJSON": () => (/* reexport safe */ _parse_json__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   "advancedGetPreviewSize": () => (/* reexport safe */ _advanced_get_preview_size__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "capitalizeFirstLetter": () => (/* reexport safe */ _capital_first__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "fetchJson": () => (/* reexport safe */ _fetch_json__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "getPreviewSize": () => (/* reexport safe */ _get_preview_size__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "getUnitIcon": () => (/* reexport safe */ _get_unit_icon__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   "hexToRGBA": () => (/* reexport safe */ _hex_to_rgba__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "showSettings": () => (/* reexport safe */ _show_settings__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "typographyStyle": () => (/* reexport safe */ _typography_style__WEBPACK_IMPORTED_MODULE_10__["default"])
/* harmony export */ });
/* harmony import */ var _get_preview_size__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-preview-size */ "./src/packages/helpers/src/get-preview-size/index.js");
/* harmony import */ var _advanced_get_preview_size__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./advanced-get-preview-size */ "./src/packages/helpers/src/advanced-get-preview-size/index.js");
/* harmony import */ var _show_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./show-settings */ "./src/packages/helpers/src/show-settings/index.js");
/* harmony import */ var _hex_to_rgba__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hex-to-rgba */ "./src/packages/helpers/src/hex-to-rgba/index.js");
/* harmony import */ var _kadence_color_output__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./kadence-color-output */ "./src/packages/helpers/src/kadence-color-output/index.js");
/* harmony import */ var _deprecated_kadence_color_output__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./deprecated-kadence-color-output */ "./src/packages/helpers/src/deprecated-kadence-color-output/index.js");
/* harmony import */ var _fetch_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./fetch-json */ "./src/packages/helpers/src/fetch-json/index.js");
/* harmony import */ var _capital_first__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./capital-first */ "./src/packages/helpers/src/capital-first/index.js");
/* harmony import */ var _parse_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parse-json */ "./src/packages/helpers/src/parse-json/index.js");
/* harmony import */ var _get_unit_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./get-unit-icon */ "./src/packages/helpers/src/get-unit-icon/index.js");
/* harmony import */ var _typography_style__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./typography-style */ "./src/packages/helpers/src/typography-style/index.js");











})();

(this.kadence = this.kadence || {}).helpers = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=helpers.js.map