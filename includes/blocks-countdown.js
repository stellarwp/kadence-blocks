/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/countdown/editor.scss":
/*!******************************************!*\
  !*** ./src/blocks/countdown/editor.scss ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/countdown/style.scss":
/*!*****************************************!*\
  !*** ./src/blocks/countdown/style.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/countdown/block.js":
/*!***************************************!*\
  !*** ./src/blocks/countdown/block.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _countdown_timer_block_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./countdown-timer/block.js */ "./src/blocks/countdown/countdown-timer/block.js");
/* harmony import */ var _countdown_inner_block_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./countdown-inner/block.js */ "./src/blocks/countdown/countdown-inner/block.js");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/countdown/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/countdown/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./save */ "./src/blocks/countdown/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block.json */ "./src/blocks/countdown/block.json");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__);
/**
 * BLOCK: Kadence Countdown
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Register sub blocks.
 */


/**
 * Import Icons
 */


/**
 * Import Css
 */


/**
 * Internal dependencies
 */




/**
 * WordPress dependencies
 */



/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__.registerBlockType)('kadence/countdown', { ..._block_json__WEBPACK_IMPORTED_MODULE_6__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Countdown', 'kadence-blocks'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('The countdown timer', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('countdown', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('timer', 'kadence-blocks'), 'KB'],
  icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.countdownIcon,
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_5__["default"]
});

/***/ }),

/***/ "./src/blocks/countdown/countdown-inner/block.js":
/*!*******************************************************!*\
  !*** ./src/blocks/countdown/countdown-inner/block.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/blocks/countdown/countdown-inner/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/blocks/countdown/countdown-inner/block.json");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__);


/**
 * BLOCK: Kadence Countdown
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */

/**
 * Internal dependencies
 */



/**
 * WordPress dependencies
 */




/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.registerBlockType)('kadence/countdown-inner', { ..._block_json__WEBPACK_IMPORTED_MODULE_3__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Countdown Content', 'kadence-blocks'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Inner Container for Countdown Block', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('countdown', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('timer', 'kadence-blocks'), 'KB'],
  icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.countdownInnerIcon,
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],

  save(_ref) {
    let {
      attributes
    } = _ref;
    const {
      location,
      uniqueID
    } = attributes;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.useBlockProps.save({
      className: `kb-countdown-inner kb-countdown-inner-${location} kb-countdown-inner-${uniqueID}`
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.InnerBlocks.Content, null));
  }

});

/***/ }),

/***/ "./src/blocks/countdown/countdown-inner/edit.js":
/*!******************************************************!*\
  !*** ./src/blocks/countdown/countdown-inner/edit.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);


/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */


/**
 * This allows for checking to see if the block needs to generate a new ID.
 */

const kbcountInnerUniqueIDs = [];
/**
 * Build the spacer edit
 */

function KadenceCountdownInner(props) {
  const {
    attributes: {
      location,
      uniqueID
    },
    clientId
  } = props;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!uniqueID) {
      this.props.setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      kbcountInnerUniqueIDs.push('_' + clientId.substr(2, 9));
    } else if (kbcountInnerUniqueIDs.includes(uniqueID)) {
      this.props.setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      kbcountInnerUniqueIDs.push('_' + clientId.substr(2, 9));
    } else {
      kbcountInnerUniqueIDs.push(uniqueID);
    }
  }, []);
  const hasChildBlocks = wp.data.select('core/block-editor').getBlockOrder(clientId).length > 0;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: `kb-countdown-inner kb-countdown-inner-${location} kb-countdown-inner-${uniqueID}`
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
    templateLock: false,
    renderAppender: hasChildBlocks ? undefined : () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.ButtonBlockAppender, null)
  }));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KadenceCountdownInner);

/***/ }),

/***/ "./src/blocks/countdown/countdown-timer/block.js":
/*!*******************************************************!*\
  !*** ./src/blocks/countdown/countdown-timer/block.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/blocks/countdown/countdown-timer/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/blocks/countdown/countdown-timer/block.json");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__);


/**
 * BLOCK: Kadence Countdown
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */

/**
 * Internal dependencies
 */



/**
 * WordPress dependencies
 */




/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.registerBlockType)('kadence/countdown-timer', { ..._block_json__WEBPACK_IMPORTED_MODULE_3__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Countdown Timer', 'kadence-blocks'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('The countdown timer', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('countdown', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('timer', 'kadence-blocks'), 'KB'],
  icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.countdownInnerIcon,
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: props => {
    const {
      attributes: {
        uniqueID,
        className
      }
    } = props;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.useBlockProps.save({
      className: `kb-countdown-timer-${uniqueID} kb-countdown-timer${className ? ' ' + className : ''}`
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kb-countdown-item kb-countdown-date-item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "kb-countdown-number"
    }, "\xA0"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "kb-countdown-label"
    }, "\xA0")));
  }
});

/***/ }),

/***/ "./src/blocks/countdown/countdown-timer/edit.js":
/*!******************************************************!*\
  !*** ./src/blocks/countdown/countdown-timer/edit.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_countdown__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-countdown */ "./node_modules/react-countdown/dist/index.es.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_6__);



/**
 * BLOCK: Kadence Timer Block
 *
 * Registering a basic block with Gutenberg.
 */






/**
 * This allows for checking to see if the block needs to generate a new ID.
 */

const kbTimerUniqueIDs = [];
/**
 * Build the spacer edit
 */

function KadenceCoundownTimer(props) {
  const {
    attributes: {
      uniqueID
    },
    setAttributes,
    clientId,
    parentBlock
  } = props;
  const parentID = undefined !== parentBlock[0].attributes.uniqueID ? parentBlock[0].attributes.uniqueID : rootID;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (!uniqueID) {
      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      kbTimerUniqueIDs.push('_' + clientId.substr(2, 9));
    } else if (kbTimerUniqueIDs.includes(uniqueID)) {
      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      kbTimerUniqueIDs.push('_' + clientId.substr(2, 9));
    } else {
      kbTimerUniqueIDs.push(uniqueID);
    }
  }, []);
  const displayUnits = parentBlock[0].attributes.units;
  const labels = {};
  labels.days = parentBlock[0].attributes.daysLabel ? parentBlock[0].attributes.daysLabel : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Days', 'kadence-blocks');
  labels.hours = parentBlock[0].attributes.hoursLabel ? parentBlock[0].attributes.hoursLabel : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Hrs', 'kadence-blocks');
  labels.minutes = parentBlock[0].attributes.minutesLabel ? parentBlock[0].attributes.minutesLabel : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Mins', 'kadence-blocks');
  labels.seconds = parentBlock[0].attributes.secondsLabel ? parentBlock[0].attributes.secondsLabel : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Secs', 'kadence-blocks');
  const preText = parentBlock[0].attributes.preLabel ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kb-countdown-item kb-pre-timer"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
    className: "kb-pre-timer-inner"
  }, parentBlock[0].attributes.preLabel)) : '';
  const postText = parentBlock[0].attributes.postLabel ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kb-countdown-item kb-post-timer"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
    className: "kb-post-timer-inner"
  }, parentBlock[0].attributes.postLabel)) : '';
  const timeNumbers = parentBlock[0].attributes.timeNumbers ? true : false;
  const enableDividers = undefined !== parentBlock[0].attributes.timerLayout && 'inline' !== parentBlock[0].attributes.timerLayout && parentBlock[0].attributes.countdownDivider ? true : false;

  const calculateNumberDesign = number => {
    if (timeNumbers) {
      return number > 9 ? '' + number : '0' + number;
    }

    return number;
  };

  const renderer = _ref => {
    let {
      total,
      days,
      hours,
      minutes,
      seconds,
      completed
    } = _ref;

    if (completed) {
      const parts = {};

      if (undefined !== displayUnits && undefined !== displayUnits[0] && undefined !== displayUnits[0].days && !displayUnits[0].days) {
        if (undefined !== displayUnits && undefined !== displayUnits[0] && undefined !== displayUnits[0].hours && !displayUnits[0].hours) {
          if (undefined !== displayUnits && undefined !== displayUnits[0] && undefined !== displayUnits[0].minutes && !displayUnits[0].minutes) {
            parts.seconds = 0;
          } else {
            parts.minutes = 0;
            parts.seconds = 0;
          }
        } else {
          parts.hours = 0;
          parts.minutes = 0;
          parts.seconds = 0;
        }
      } else {
        parts.days = 0;
        parts.hours = 0;
        parts.minutes = 0;
        parts.seconds = 0;
      }

      const remaining = Object.keys(parts).map(part => {
        if ('seconds' !== part && enableDividers) {
          return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
            className: `kb-countdown-date-item kb-countdown-item kb-countdown-date-item-${part}`
          }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
            className: "kb-countdown-number"
          }, calculateNumberDesign(parts[part])), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
            className: "kb-countdown-label"
          }, labels[part])), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
            className: `kb-countdown-item kb-countdown-date-item kb-countdown-divider-item kb-countdown-divider-item-${part}`
          }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
            className: "kb-countdown-number"
          }, ":"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
            className: "kb-countdown-label"
          }, "\xA0")));
        }

        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: `kb-countdown-date-item kb-countdown-item kb-countdown-date-item-${part}`
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
          className: "kb-countdown-number"
        }, calculateNumberDesign(parts[part])), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
          className: "kb-countdown-label"
        }, labels[part]));
      });
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, preText, remaining, postText);
    } else {
      // Render a countdown
      const parts = {};
      let calculateHours = Math.floor(total / (1000 * 60 * 60) % 24);
      let calculateMinutes = Math.floor(total / 1000 / 60 % 60);
      let calculateSeconds = Math.floor(total / 1000 % 60);

      if (undefined !== displayUnits && undefined !== displayUnits[0] && undefined !== displayUnits[0].days && !displayUnits[0].days) {
        //Do nothing.
        calculateHours = Math.floor(total / (1000 * 60 * 60));

        if (undefined !== displayUnits && undefined !== displayUnits[0] && undefined !== displayUnits[0].hours && !displayUnits[0].hours) {
          //Do nothing.
          calculateMinutes = Math.floor(total / 1000 / 60);

          if (undefined !== displayUnits && undefined !== displayUnits[0] && undefined !== displayUnits[0].minutes && !displayUnits[0].minutes) {
            //Do nothing.
            calculateSeconds = Math.floor(total / 1000);
            parts.seconds = calculateSeconds;
          } else {
            parts.minutes = calculateMinutes;
            parts.seconds = calculateSeconds;
          }
        } else {
          parts.hours = calculateHours;
          parts.minutes = calculateMinutes;
          parts.seconds = calculateSeconds;
        }
      } else {
        parts.days = Math.floor(total / (1000 * 60 * 60 * 24));
        parts.hours = calculateHours;
        parts.minutes = calculateMinutes;
        parts.seconds = calculateSeconds;
      }

      const remaining = Object.keys(parts).map(part => {
        if ('seconds' !== part && enableDividers) {
          return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
            className: `kb-countdown-date-item kb-countdown-item kb-countdown-date-item-${part}`
          }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
            className: "kb-countdown-number"
          }, calculateNumberDesign(parts[part])), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
            className: "kb-countdown-label"
          }, labels[part])), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
            className: `kb-countdown-item kb-countdown-date-item kb-countdown-divider-item kb-countdown-divider-item-${part}`
          }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
            className: "kb-countdown-number"
          }, ":"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
            className: "kb-countdown-label"
          }, "\xA0")));
        }

        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: `kb-countdown-date-item kb-countdown-item kb-countdown-date-item-${part}`
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
          className: "kb-countdown-number"
        }, calculateNumberDesign(parts[part])), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
          className: "kb-countdown-label"
        }, labels[part]));
      });
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, preText, remaining, postText);
    }
  };

  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.useBlockProps)({
    className: `kb-countdown-timer kb-countdown-timer-${uniqueID}`
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, blockProps, {
    id: `kb-timer-${parentID}`
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(react_countdown__WEBPACK_IMPORTED_MODULE_2__["default"], {
    date: new Date(parentBlock[0].attributes.timestamp),
    renderer: renderer
  }));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_6__.compose)([(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.withSelect)((select, ownProps) => {
  const {
    clientId
  } = ownProps;
  const {
    getBlockRootClientId,
    getBlocksByClientId
  } = select('core/block-editor');
  const rootID = getBlockRootClientId(clientId);
  const parentBlock = getBlocksByClientId(rootID);
  return {
    parentBlock: parentBlock,
    rootID: rootID
  };
})])(KadenceCoundownTimer));

/***/ }),

/***/ "./src/blocks/countdown/edit.js":
/*!**************************************!*\
  !*** ./src/blocks/countdown/edit.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/countdown/editor.scss");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__);



/**
 * BLOCK: Kadence Countdown
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * External dependencies
 */

/**
 * Import Icons
 */




/**
 * Import Css
 */


/**
 * Internal block libraries
 */









/**
 * This allows for checking to see if the block needs to generate a new ID.
 */

const ktcountdownUniqueIDs = [];
const COUNTDOWN_TEMPLATE = [['kadence/countdown-timer', {}]];
const COUNTDOWN_TEMPLATE_WITH_MESSAGE = [['kadence/countdown-timer', {}], ['kadence/countdown-inner', {
  location: 'complete'
}]];
const COUNTDOWN_NO_TIMER_WITH_MESSAGE = [['kadence/countdown-inner', {
  location: 'first'
}], ['kadence/countdown-inner', {
  location: 'complete'
}]];
const COUNTDOWN_NO_TIMER = [['kadence/countdown-inner', {
  location: 'first'
}]];
const ALLOWED_BLOCKS = ['kadence/countdown-timer', 'kadence/countdown-inner'];
const typeOptions = [{
  value: 'date',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Date', 'kadence-blocks'),
  disabled: false
}, {
  value: 'evergreen',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Evergreen (Pro addon)', 'kadence-blocks'),
  disabled: true
}];
const actionOptions = [{
  value: 'none',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Show Timer at Zero', 'kadence-blocks'),
  disabled: false
}, {
  value: 'hide',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Hide (Pro addon)', 'kadence-blocks'),
  disabled: true
}, {
  value: 'message',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Replace with Content (Pro addon)', 'kadence-blocks'),
  disabled: true
}, {
  value: 'redirect',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Redirect (Pro addon)', 'kadence-blocks'),
  disabled: true
}];
const ANCHOR_REGEX = /[\s#]/g;
/**
 * Build the spacer edit
 */

function KadenceCountdown(_ref) {
  let {
    attributes,
    setAttributes,
    className,
    clientId,
    isNested,
    parentBlock,
    getPreviewDevice
  } = _ref;
  const {
    uniqueID,
    expireAction,
    units,
    enableTimer,
    evergreenHours,
    evergreenMinutes,
    redirectURL,
    timerLayout,
    date,
    timestamp,
    evergreenReset,
    timezone,
    timeOffset,
    preLabel,
    postLabel,
    daysLabel,
    hoursLabel,
    minutesLabel,
    secondsLabel,
    counterAlign,
    campaignID,
    numberColor,
    numberFont,
    labelColor,
    labelFont,
    preLabelColor,
    preLabelFont,
    postLabelColor,
    postLabelFont,
    border,
    borderRadius,
    borderWidth,
    mobileBorderWidth,
    tabletBorderWidth,
    background,
    vsdesk,
    vstablet,
    vsmobile,
    countdownType,
    paddingType,
    marginType,
    containerMobilePadding,
    containerTabletPadding,
    containerPadding,
    containerMobileMargin,
    containerTabletMargin,
    containerMargin,
    itemBorder,
    itemBorderWidth,
    itemBackground,
    itemTabletBorderWidth,
    itemMobileBorderWidth,
    itemPadding,
    itemTabletPadding,
    itemMobilePadding,
    itemBorderRadius,
    itemPaddingType,
    timeNumbers,
    countdownDivider,
    revealOnLoad,
    evergreenStrict
  } = attributes;
  const [borderWidthControl, setBorderWidthControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [borderRadiusControl, setBorderRadiusControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [paddingControl, setPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [marginControl, setMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [itemBorderWidthControl, setItemBorderWidthControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [itemBorderRadiusControl, setItemBorderRadiusControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [itemPaddingControl, setItemPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [previewExpired, setPreviewExpired] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('general');
  let dateSettings = {};
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (!uniqueID) {
      const blockConfigObject = kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : [];
      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      ktcountdownUniqueIDs.push('_' + clientId.substr(2, 9));
    } else if (ktcountdownUniqueIDs.includes(uniqueID)) {
      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      ktcountdownUniqueIDs.push('_' + clientId.substr(2, 9));
    } else {
      ktcountdownUniqueIDs.push(uniqueID);
    }

    if (borderRadius && borderRadius[0] === borderRadius[1] && borderRadius[0] === borderRadius[2] && borderRadius[0] === borderRadius[3]) {
      setBorderRadiusControl('linked');
    } else {
      setBorderRadiusControl('individual');
    }

    if (!date) {
      dateSettings = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_8__.__experimentalGetSettings)();
      const {
        timezone
      } = dateSettings;
      const today = new Date();
      const newDate = new Date();
      newDate.setDate(today.getDate() + 2);
      const theTimeOffset = timezone && timezone.offset ? timezone.offset : 0;
      const theSiteTimezoneTimestamp = getTimestamp(newDate, theTimeOffset);
      setAttributes({
        date: newDate,
        timestamp: theSiteTimezoneTimestamp,
        timezone: timezone && timezone.string ? timezone.string : '',
        timeOffset: theTimeOffset
      });
    }
  }, []);

  const getTimestamp = (value, theTimeOffset) => {
    const userTimezoneOffset = -1 * (new Date().getTimezoneOffset() / 60);

    if (Number(theTimeOffset) === userTimezoneOffset) {
      return new Date(value).getTime();
    }

    return timezoneShifter(value, theTimeOffset);
  };

  const timezoneShifter = (value, theTimeOffset) => {
    // Get the timezone offset of current site user.
    const userTimezoneOffset = -1 * (new Date().getTimezoneOffset() / 60); // Get the difference in offset from the sites set timezone.

    const shiftDiff = userTimezoneOffset - theTimeOffset; // Get the date in the timezone of the user.

    const currentDate = new Date(value); // Shift that date the difference in timezones from the user to the site.

    return new Date(currentDate.getTime() + shiftDiff * 60 * 60 * 1000).getTime();
  };

  const countdownTypes = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_9__.applyFilters)('kadence.countdownTypes', typeOptions);
  const countdownActions = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_9__.applyFilters)('kadence.countdownActions', actionOptions);
  dateSettings = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_8__.__experimentalGetSettings)(); // To know if the current timezone is a 12 hour time with look for "a" in the time format
  // We also make sure this a is not escaped by a "/"

  const is12HourTime = /a(?!\\)/i.test(dateSettings.formats.time.toLowerCase() // Test only the lower case a
  .replace(/\\\\/g, '') // Replace "//" with empty strings
  .split('').reverse().join('') // Reverse the string and test for "a" not followed by a slash
  );

  const saveUnits = value => {
    const newUpdate = units.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      units: newUpdate
    });
  };

  const saveDate = value => {
    const theTimezone = settings.timezone && settings.timezone.string ? settings.timezone.string : '';
    const theTimeOffset = settings.timezone && settings.timezone.offset ? settings.timezone.offset : 0;
    const theSiteTimezoneTimestamp = getTimestamp(value, theTimeOffset);
    setAttributes({
      date: value,
      timestamp: theSiteTimezoneTimestamp,
      timezone: theTimezone,
      timeOffset: theTimeOffset
    });
  };

  const getEverGreenTimestamp = value => {
    const newDate = new Date();
    newDate.setTime(newDate.getTime() + Number(value) * 60 * 60 * 1000);
    newDate.setTime(newDate.getTime() + (evergreenMinutes ? Number(evergreenMinutes) : 0) * 60 * 1000);
    return newDate.getTime();
  };

  const saveEvergreenHours = value => {
    const theEvergreenTimeStamp = getEverGreenTimestamp(value);
    setAttributes({
      evergreenHours: value,
      timestamp: theEvergreenTimeStamp
    });
  };

  const getEverGreenMinTimestamp = value => {
    const newDate = new Date();
    newDate.setTime(newDate.getTime() + (evergreenHours ? Number(evergreenHours) : 0) * 60 * 60 * 1000);
    newDate.setTime(newDate.getTime() + Number(value) * 60 * 1000);
    return newDate.getTime();
  };

  const saveEvergreenMinutes = value => {
    const theEvergreenTimeStamp = getEverGreenMinTimestamp(value);
    setAttributes({
      evergreenMinutes: value,
      timestamp: theEvergreenTimeStamp
    });
  };

  const saveNumberFont = value => {
    const newUpdate = numberFont.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      numberFont: newUpdate
    });
  };

  const saveLabelFont = value => {
    const newUpdate = labelFont.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      labelFont: newUpdate
    });
  };

  const savePreFont = value => {
    const newUpdate = preLabelFont.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      preLabelFont: newUpdate
    });
  };

  const savePostFont = value => {
    const newUpdate = postLabelFont.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      postLabelFont: newUpdate
    });
  };

  const numberConfigSettings = {
    google: {
      families: [(undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].family && '' !== numberFont[0].family && numberFont[0].google ? numberFont[0].family : '') + (undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].variant && '' !== numberFont[0].variant ? ':' + numberFont[0].variant : '')]
    }
  };
  const labelConfigSettings = {
    google: {
      families: [(undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].family && '' !== labelFont[0].family && labelFont[0].google ? labelFont[0].family : '') + (undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].variant && '' !== labelFont[0].variant ? ':' + labelFont[0].variant : '')]
    }
  };
  const preLabelConfigSettings = {
    google: {
      families: [(undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].family && '' !== preLabelFont[0].family && preLabelFont[0].google ? preLabelFont[0].family : '') + (undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].variant && '' !== preLabelFont[0].variant ? ':' + preLabelFont[0].variant : '')]
    }
  };
  const postLabelConfigSettings = {
    google: {
      families: [(undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].family && '' !== postLabelFont[0].family && postLabelFont[0].google ? postLabelFont[0].family : '') + (undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].variant && '' !== postLabelFont[0].variant ? ':' + postLabelFont[0].variant : '')]
    }
  };
  const numberConfig = undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].family && '' !== numberFont[0].family && numberFont[0].google ? numberConfigSettings : '';
  const labelConfig = undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].family && '' !== labelFont[0].family && labelFont[0].google ? labelConfigSettings : '';
  const preLabelConfig = undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].family && '' !== preLabelFont[0].family && preLabelFont[0].google ? preLabelConfigSettings : '';
  const postLabelConfig = undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].family && '' !== postLabelFont[0].family && postLabelFont[0].google ? postLabelConfigSettings : '';
  const templateWithTimer = 'message' === expireAction ? COUNTDOWN_TEMPLATE_WITH_MESSAGE : COUNTDOWN_TEMPLATE;
  const templateNoTimer = 'message' === expireAction ? COUNTDOWN_NO_TIMER_WITH_MESSAGE : COUNTDOWN_NO_TIMER;
  const marginMin = marginType === 'em' || marginType === 'rem' ? -2 : -200;
  const marginMax = marginType === 'em' || marginType === 'rem' ? 12 : 200;
  const marginStep = marginType === 'em' || marginType === 'rem' ? 0.1 : 1;
  const paddingMin = paddingType === 'em' || paddingType === 'rem' ? 0 : 0;
  const paddingMax = paddingType === 'em' || paddingType === 'rem' ? 12 : 200;
  const paddingStep = paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1;
  const previewPaddingType = undefined !== paddingType ? paddingType : 'px';
  const itemPaddingMin = itemPaddingType === 'em' || itemPaddingType === 'rem' ? 0 : 0;
  const itemPaddingMax = itemPaddingType === 'em' || itemPaddingType === 'rem' ? 12 : 200;
  const itemPaddingStep = itemPaddingType === 'em' || itemPaddingType === 'rem' ? 0.1 : 1;
  const previewItemPaddingType = undefined !== itemPaddingType ? itemPaddingType : 'px';
  const previewMarginType = undefined !== marginType ? marginType : 'px';
  const previewMarginTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== containerMargin && undefined !== containerMargin[0] ? containerMargin[0] : '', undefined !== containerTabletMargin && undefined !== containerTabletMargin[0] ? containerTabletMargin[0] : '', undefined !== containerMobileMargin && undefined !== containerMobileMargin[0] ? containerMobileMargin[0] : '');
  const previewMarginRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== containerMargin && undefined !== containerMargin[1] ? containerMargin[1] : '', undefined !== containerTabletMargin && undefined !== containerTabletMargin[1] ? containerTabletMargin[1] : '', undefined !== containerMobileMargin && undefined !== containerMobileMargin[1] ? containerMobileMargin[1] : '');
  const previewMarginBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== containerMargin && undefined !== containerMargin[2] ? containerMargin[2] : '', undefined !== containerTabletMargin && undefined !== containerTabletMargin[2] ? containerTabletMargin[2] : '', undefined !== containerMobileMargin && undefined !== containerMobileMargin[2] ? containerMobileMargin[2] : '');
  const previewMarginLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== containerMargin && undefined !== containerMargin[3] ? containerMargin[3] : '', undefined !== containerTabletMargin && undefined !== containerTabletMargin[3] ? containerTabletMargin[3] : '', undefined !== containerMobileMargin && undefined !== containerMobileMargin[3] ? containerMobileMargin[3] : '');
  const previewPaddingTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== containerPadding && undefined !== containerPadding[0] ? containerPadding[0] : '', undefined !== containerTabletPadding && undefined !== containerTabletPadding[0] ? containerTabletPadding[0] : '', undefined !== containerMobilePadding && undefined !== containerMobilePadding[0] ? containerMobilePadding[0] : '');
  const previewPaddingRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== containerPadding && undefined !== containerPadding[1] ? containerPadding[1] : '', undefined !== containerTabletPadding && undefined !== containerTabletPadding[1] ? containerTabletPadding[1] : '', undefined !== containerMobilePadding && undefined !== containerMobilePadding[1] ? containerMobilePadding[1] : '');
  const previewPaddingBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== containerPadding && undefined !== containerPadding[2] ? containerPadding[2] : '', undefined !== containerTabletPadding && undefined !== containerTabletPadding[2] ? containerTabletPadding[2] : '', undefined !== containerMobilePadding && undefined !== containerMobilePadding[2] ? containerMobilePadding[2] : '');
  const previewPaddingLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== containerPadding && undefined !== containerPadding[3] ? containerPadding[3] : '', undefined !== containerTabletPadding && undefined !== containerTabletPadding[3] ? containerTabletPadding[3] : '', undefined !== containerMobilePadding && undefined !== containerMobilePadding[3] ? containerMobilePadding[3] : '');
  const previewBorderTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== borderWidth ? borderWidth[0] : '', undefined !== tabletBorderWidth ? tabletBorderWidth[0] : '', undefined !== mobileBorderWidth ? mobileBorderWidth[0] : '');
  const previewBorderRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== borderWidth ? borderWidth[1] : '', undefined !== tabletBorderWidth ? tabletBorderWidth[1] : '', undefined !== mobileBorderWidth ? mobileBorderWidth[1] : '');
  const previewBorderBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== borderWidth ? borderWidth[2] : '', undefined !== tabletBorderWidth ? tabletBorderWidth[2] : '', undefined !== mobileBorderWidth ? mobileBorderWidth[2] : '');
  const previewBorderLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== borderWidth ? borderWidth[3] : '', undefined !== tabletBorderWidth ? tabletBorderWidth[3] : '', undefined !== mobileBorderWidth ? mobileBorderWidth[3] : '');
  const previewItemPaddingTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== itemPadding && undefined !== itemPadding[0] ? itemPadding[0] : '', undefined !== itemTabletPadding && undefined !== itemTabletPadding[0] ? itemTabletPadding[0] : '', undefined !== itemMobilePadding && undefined !== itemMobilePadding[0] ? itemMobilePadding[0] : '');
  const previewItemPaddingRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== itemPadding && undefined !== itemPadding[1] ? itemPadding[1] : '', undefined !== itemTabletPadding && undefined !== itemTabletPadding[1] ? itemTabletPadding[1] : '', undefined !== itemMobilePadding && undefined !== itemMobilePadding[1] ? itemMobilePadding[1] : '');
  const previewItemPaddingBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== itemPadding && undefined !== itemPadding[2] ? itemPadding[2] : '', undefined !== itemTabletPadding && undefined !== itemTabletPadding[2] ? itemTabletPadding[2] : '', undefined !== itemMobilePadding && undefined !== itemMobilePadding[2] ? itemMobilePadding[2] : '');
  const previewItemPaddingLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== itemPadding && undefined !== itemPadding[3] ? itemPadding[3] : '', undefined !== itemTabletPadding && undefined !== itemTabletPadding[3] ? itemTabletPadding[3] : '', undefined !== itemMobilePadding && undefined !== itemMobilePadding[3] ? itemMobilePadding[3] : '');
  const previewItemBorderTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== itemBorderWidth ? itemBorderWidth[0] : '', undefined !== itemTabletBorderWidth ? itemTabletBorderWidth[0] : '', undefined !== itemMobileBorderWidth ? itemMobileBorderWidth[0] : '');
  const previewItemBorderRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== itemBorderWidth ? itemBorderWidth[1] : '', undefined !== itemTabletBorderWidth ? itemTabletBorderWidth[1] : '', undefined !== itemMobileBorderWidth ? itemMobileBorderWidth[1] : '');
  const previewItemBorderBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== itemBorderWidth ? itemBorderWidth[2] : '', undefined !== itemTabletBorderWidth ? itemTabletBorderWidth[2] : '', undefined !== itemMobileBorderWidth ? itemMobileBorderWidth[2] : '');
  const previewItemBorderLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== itemBorderWidth ? itemBorderWidth[3] : '', undefined !== itemTabletBorderWidth ? itemTabletBorderWidth[3] : '', undefined !== itemMobileBorderWidth ? itemMobileBorderWidth[3] : '');
  const previewNumberSizeType = undefined !== numberFont && undefined !== numberFont[0] && '' !== numberFont[0].sizeType ? numberFont[0].sizeType : 'px';
  const previewNumberLineType = undefined !== numberFont && undefined !== numberFont[0] && '' !== numberFont[0].lineType ? numberFont[0].lineType : 'px';
  const previewNumberLetterType = undefined !== numberFont && undefined !== numberFont[0] && '' !== numberFont[0].letterType ? numberFont[0].letterType : 'px';
  const previewNumberFontSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].size && undefined !== numberFont[0].size[0] && '' !== numberFont[0].size[0] ? numberFont[0].size[0] : '', undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].size && undefined !== numberFont[0].size[1] && '' !== numberFont[0].size[1] ? numberFont[0].size[1] : '', undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].size && undefined !== numberFont[0].size[2] && '' !== numberFont[0].size[2] ? numberFont[0].size[2] : '');
  const previewNumberLineSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].lineHeight && undefined !== numberFont[0].lineHeight[0] && '' !== numberFont[0].lineHeight[0] ? numberFont[0].lineHeight[0] : '', undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].lineHeight && undefined !== numberFont[0].lineHeight[1] && '' !== numberFont[0].lineHeight[1] ? numberFont[0].lineHeight[1] : '', undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].lineHeight && undefined !== numberFont[0].lineHeight[2] && '' !== numberFont[0].lineHeight[2] ? numberFont[0].lineHeight[2] : '');
  const previewNumberLetterSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].letterSpacing && undefined !== numberFont[0].letterSpacing[0] && '' !== numberFont[0].letterSpacing[0] ? numberFont[0].letterSpacing[0] : '', undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].letterSpacing && undefined !== numberFont[0].letterSpacing[1] && '' !== numberFont[0].letterSpacing[1] ? numberFont[0].letterSpacing[1] : '', undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].letterSpacing && undefined !== numberFont[0].letterSpacing[2] && '' !== numberFont[0].letterSpacing[2] ? numberFont[0].letterSpacing[2] : '');
  const previewLabelSizeType = undefined !== labelFont && undefined !== labelFont[0] && '' !== labelFont[0].sizeType ? labelFont[0].sizeType : 'px';
  const previewLabelLineType = undefined !== labelFont && undefined !== labelFont[0] && '' !== labelFont[0].lineType ? labelFont[0].lineType : 'px';
  const previewLabelLetterType = undefined !== labelFont && undefined !== labelFont[0] && '' !== labelFont[0].letterType ? labelFont[0].letterType : 'px';
  const previewLabelFontSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].size && undefined !== labelFont[0].size[0] && '' !== labelFont[0].size[0] ? labelFont[0].size[0] : '', undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].size && undefined !== labelFont[0].size[1] && '' !== labelFont[0].size[1] ? labelFont[0].size[1] : '', undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].size && undefined !== labelFont[0].size[2] && '' !== labelFont[0].size[2] ? labelFont[0].size[2] : '');
  const previewLabelLineSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].lineHeight && undefined !== labelFont[0].lineHeight[0] && '' !== labelFont[0].lineHeight[0] ? labelFont[0].lineHeight[0] : '', undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].lineHeight && undefined !== labelFont[0].lineHeight[1] && '' !== labelFont[0].lineHeight[1] ? labelFont[0].lineHeight[1] : '', undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].lineHeight && undefined !== labelFont[0].lineHeight[2] && '' !== labelFont[0].lineHeight[2] ? labelFont[0].lineHeight[2] : '');
  const previewLabelLetterSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].letterSpacing && undefined !== labelFont[0].letterSpacing[0] && '' !== labelFont[0].letterSpacing[0] ? labelFont[0].letterSpacing[0] : '', undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].letterSpacing && undefined !== labelFont[0].letterSpacing[1] && '' !== labelFont[0].letterSpacing[1] ? labelFont[0].letterSpacing[1] : '', undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].letterSpacing && undefined !== labelFont[0].letterSpacing[2] && '' !== labelFont[0].letterSpacing[2] ? labelFont[0].letterSpacing[2] : '');
  const previewPreLabelSizeType = undefined !== preLabelFont && undefined !== preLabelFont[0] && '' !== preLabelFont[0].sizeType ? preLabelFont[0].sizeType : 'px';
  const previewPreLabelLineType = undefined !== preLabelFont && undefined !== preLabelFont[0] && '' !== preLabelFont[0].lineType ? preLabelFont[0].lineType : 'px';
  const previewPreLabelLetterType = undefined !== preLabelFont && undefined !== preLabelFont[0] && '' !== preLabelFont[0].letterType ? preLabelFont[0].letterType : 'px';
  const previewPreLabelFontSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].size && undefined !== preLabelFont[0].size[0] && '' !== preLabelFont[0].size[0] ? preLabelFont[0].size[0] : '', undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].size && undefined !== preLabelFont[0].size[1] && '' !== preLabelFont[0].size[1] ? preLabelFont[0].size[1] : '', undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].size && undefined !== preLabelFont[0].size[2] && '' !== preLabelFont[0].size[2] ? preLabelFont[0].size[2] : '');
  const previewPreLabelLineSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].lineHeight && undefined !== preLabelFont[0].lineHeight[0] && '' !== preLabelFont[0].lineHeight[0] ? preLabelFont[0].lineHeight[0] : '', undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].lineHeight && undefined !== preLabelFont[0].lineHeight[1] && '' !== preLabelFont[0].lineHeight[1] ? preLabelFont[0].lineHeight[1] : '', undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].lineHeight && undefined !== preLabelFont[0].lineHeight[2] && '' !== preLabelFont[0].lineHeight[2] ? preLabelFont[0].lineHeight[2] : '');
  const previewPreLabelLetterSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].letterSpacing && undefined !== preLabelFont[0].letterSpacing[0] && '' !== preLabelFont[0].letterSpacing[0] ? preLabelFont[0].letterSpacing[0] : '', undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].letterSpacing && undefined !== preLabelFont[0].letterSpacing[1] && '' !== preLabelFont[0].letterSpacing[1] ? preLabelFont[0].letterSpacing[1] : '', undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].letterSpacing && undefined !== preLabelFont[0].letterSpacing[2] && '' !== preLabelFont[0].letterSpacing[2] ? preLabelFont[0].letterSpacing[2] : '');
  const previewPostLabelSizeType = undefined !== postLabelFont && undefined !== postLabelFont[0] && '' !== postLabelFont[0].sizeType ? postLabelFont[0].sizeType : 'px';
  const previewPostLabelLineType = undefined !== postLabelFont && undefined !== postLabelFont[0] && '' !== postLabelFont[0].lineType ? postLabelFont[0].lineType : 'px';
  const previewPostLabelLetterType = undefined !== postLabelFont && undefined !== postLabelFont[0] && '' !== postLabelFont[0].letterType ? postLabelFont[0].letterType : 'px';
  const previewPostLabelFontSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].size && undefined !== postLabelFont[0].size[0] && '' !== postLabelFont[0].size[0] ? postLabelFont[0].size[0] : '', undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].size && undefined !== postLabelFont[0].size[1] && '' !== postLabelFont[0].size[1] ? postLabelFont[0].size[1] : '', undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].size && undefined !== postLabelFont[0].size[2] && '' !== postLabelFont[0].size[2] ? postLabelFont[0].size[2] : '');
  const previewPostLabelLineSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].lineHeight && undefined !== postLabelFont[0].lineHeight[0] && '' !== postLabelFont[0].lineHeight[0] ? postLabelFont[0].lineHeight[0] : '', undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].lineHeight && undefined !== postLabelFont[0].lineHeight[1] && '' !== postLabelFont[0].lineHeight[1] ? postLabelFont[0].lineHeight[1] : '', undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].lineHeight && undefined !== postLabelFont[0].lineHeight[2] && '' !== postLabelFont[0].lineHeight[2] ? postLabelFont[0].lineHeight[2] : '');
  const previewPostLabelLetterSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.getPreviewSize)(getPreviewDevice, undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].letterSpacing && undefined !== postLabelFont[0].letterSpacing[0] && '' !== postLabelFont[0].letterSpacing[0] ? postLabelFont[0].letterSpacing[0] : '', undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].letterSpacing && undefined !== postLabelFont[0].letterSpacing[1] && '' !== postLabelFont[0].letterSpacing[1] ? postLabelFont[0].letterSpacing[1] : '', undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].letterSpacing && undefined !== postLabelFont[0].letterSpacing[2] && '' !== postLabelFont[0].letterSpacing[2] ? postLabelFont[0].letterSpacing[2] : '');
  const classes = classnames__WEBPACK_IMPORTED_MODULE_2___default()({
    'kb-countdown-container': true,
    [`kb-countdown-container-${uniqueID}`]: uniqueID,
    [`kb-countdown-timer-layout-${timerLayout}`]: timerLayout && enableTimer,
    'kb-countdown-enable-dividers': 'inline' !== timerLayout && countdownDivider && enableTimer,
    'kb-countdown-has-timer': enableTimer,
    'kb-countdown-preview-expired': previewExpired,
    [`kb-countdown-align-${counterAlign[0]}`]: undefined !== counterAlign && undefined !== counterAlign[0] && enableTimer ? counterAlign[0] : false,
    [`kb-countdown-align-tablet-${counterAlign[1]}`]: undefined !== counterAlign && undefined !== counterAlign[1] && enableTimer ? counterAlign[1] : false,
    [`kb-countdown-align-mobile-${counterAlign[2]}`]: undefined !== counterAlign && undefined !== counterAlign[2] && enableTimer ? counterAlign[2] : false,
    'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
    'kvs-md-false': vstablet !== 'undefined' && vstablet,
    'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
    [className]: className
  });

  if (isNested && parentBlock) {
    if (undefined !== parentBlock.attributes.countdownType && parentBlock.attributes.countdownType !== countdownType) {
      setAttributes({
        countdownType: parentBlock.attributes.countdownType
      });
    }

    if (undefined !== parentBlock.attributes.evergreenMinutes && parentBlock.attributes.evergreenMinutes !== evergreenMinutes) {
      setAttributes({
        evergreenMinutes: parentBlock.attributes.evergreenMinutes
      });
    }

    if (undefined !== parentBlock.attributes.timeOffset && parentBlock.attributes.timeOffset !== timeOffset) {
      setAttributes({
        timeOffset: parentBlock.attributes.timeOffset
      });
    }

    if (undefined !== parentBlock.attributes.timezone && parentBlock.attributes.timezone !== timezone) {
      setAttributes({
        timezone: parentBlock.attributes.timezone
      });
    }

    if (undefined !== parentBlock.attributes.timestamp && parentBlock.attributes.timestamp !== timestamp) {
      setAttributes({
        timestamp: parentBlock.attributes.timestamp
      });
    }

    if (undefined !== parentBlock.attributes.evergreenHours && parentBlock.attributes.evergreenHours !== evergreenHours) {
      setAttributes({
        evergreenHours: parentBlock.attributes.evergreenHours
      });
    }

    if (undefined !== parentBlock.attributes.date && parentBlock.attributes.date !== date) {
      setAttributes({
        date: parentBlock.attributes.date
      });
    }

    if (undefined !== parentBlock.attributes.campaignID && parentBlock.attributes.campaignID !== campaignID) {
      setAttributes({
        campaignID: parentBlock.attributes.campaignID
      });
    }

    if (undefined !== parentBlock.attributes.evergreenReset && parentBlock.attributes.evergreenReset !== evergreenReset) {
      setAttributes({
        evergreenReset: parentBlock.attributes.evergreenReset
      });
    }

    if (undefined !== parentBlock.attributes.evergreenStrict && parentBlock.attributes.evergreenStrict !== evergreenStrict) {
      setAttributes({
        evergreenStrict: parentBlock.attributes.evergreenStrict
      });
    }
  }

  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.useBlockProps)({
    className: classes
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, blockProps, {
    style: {
      background: background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(background) : undefined,
      borderColor: border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(border) : undefined,
      borderTopWidth: previewBorderTop ? previewBorderTop + 'px' : undefined,
      borderRightWidth: previewBorderRight ? previewBorderRight + 'px' : undefined,
      borderBottomWidth: previewBorderBottom ? previewBorderBottom + 'px' : undefined,
      borderLeftWidth: previewBorderLeft ? previewBorderLeft + 'px' : undefined,
      borderTopLeftRadius: borderRadius && borderRadius[0] ? borderRadius[0] + 'px' : undefined,
      borderTopRightRadius: borderRadius && borderRadius[1] ? borderRadius[1] + 'px' : undefined,
      borderBottomRightRadius: borderRadius && borderRadius[2] ? borderRadius[2] + 'px' : undefined,
      borderBottomLeftRadius: borderRadius && borderRadius[3] ? borderRadius[3] + 'px' : undefined,
      paddingTop: '' !== previewPaddingTop ? previewPaddingTop + previewPaddingType : undefined,
      paddingRight: '' !== previewPaddingRight ? previewPaddingRight + previewPaddingType : undefined,
      paddingBottom: '' !== previewPaddingBottom ? previewPaddingBottom + previewPaddingType : undefined,
      paddingLeft: '' !== previewPaddingLeft ? previewPaddingLeft + previewPaddingType : undefined,
      marginTop: previewMarginTop ? previewMarginTop + previewMarginType : undefined,
      marginRight: previewMarginRight ? previewMarginRight + previewMarginType : undefined,
      marginBottom: previewMarginBottom ? previewMarginBottom + previewMarginType : undefined,
      marginLeft: previewMarginLeft ? previewMarginLeft + previewMarginType : undefined
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("style", null, `.kb-countdown-container #kb-timer-${uniqueID} .kb-countdown-date-item .kb-countdown-number {`, numberColor ? `color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(numberColor)};` : '', numberFont && numberFont[0] && numberFont[0].family ? `font-family: ${numberFont[0].family};` : '', numberFont && numberFont[0] && numberFont[0].textTransform ? `text-transform: ${numberFont[0].textTransform};` : '', numberFont && numberFont[0] && numberFont[0].weight ? `font-weight: ${numberFont[0].weight};` : '', numberFont && numberFont[0] && numberFont[0].style ? `font-style: ${numberFont[0].style};` : '', previewNumberFontSize ? `font-size: ${previewNumberFontSize + previewNumberSizeType};` : '', previewNumberLineSize ? `line-height: ${previewNumberLineSize + previewNumberLineType};` : '', previewNumberLetterSize ? `letter-spacing: ${previewNumberLetterSize + previewNumberLetterType};` : '', '}', `.kb-countdown-container #kb-timer-${uniqueID} .kb-countdown-date-item  {`, previewNumberFontSize ? `font-size: ${previewNumberFontSize + previewNumberSizeType};` : '', '}', `#kb-timer-${uniqueID} .kb-countdown-date-item .kb-countdown-label {`, labelColor ? `color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(labelColor)};` : '', labelFont && labelFont[0] && labelFont[0].family ? `font-family: ${labelFont[0].family};` : '', labelFont && labelFont[0] && labelFont[0].textTransform ? `text-transform: ${labelFont[0].textTransform};` : '', labelFont && labelFont[0] && labelFont[0].weight ? `font-weight: ${labelFont[0].weight};` : '', labelFont && labelFont[0] && labelFont[0].style ? `font-style: ${labelFont[0].style};` : '', previewLabelFontSize ? `font-size: ${previewLabelFontSize + previewLabelSizeType};` : '', previewLabelLineSize ? `line-height: ${previewLabelLineSize + previewLabelLineType};` : '', previewLabelLetterSize ? `letter-spacing: ${previewLabelLetterSize + previewLabelLetterType};` : '', '}', '' !== preLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, `#kb-timer-${uniqueID} .kb-countdown-item.kb-pre-timer {`, preLabelColor ? `color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(preLabelColor)};` : '', preLabelFont && preLabelFont[0] && preLabelFont[0].family ? `font-family: ${preLabelFont[0].family};` : '', preLabelFont && preLabelFont[0] && preLabelFont[0].textTransform ? `text-transform: ${preLabelFont[0].textTransform};` : '', preLabelFont && preLabelFont[0] && preLabelFont[0].weight ? `font-weight: ${preLabelFont[0].weight};` : '', preLabelFont && preLabelFont[0] && preLabelFont[0].style ? `font-style: ${preLabelFont[0].style};` : '', previewPreLabelFontSize ? `font-size: ${previewPreLabelFontSize + previewPreLabelSizeType};` : '', previewPreLabelLineSize ? `line-height: ${previewPreLabelLineSize + previewPreLabelLineType};` : '', previewPreLabelLetterSize ? `letter-spacing: ${previewPreLabelLetterSize + previewPreLabelLetterType};` : '', '}'), '' !== postLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, `#kb-timer-${uniqueID} .kb-countdown-item.kb-post-timer {`, postLabelColor ? `color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(postLabelColor)};` : '', postLabelFont && postLabelFont[0] && postLabelFont[0].family ? `font-family: ${postLabelFont[0].family};` : '', postLabelFont && postLabelFont[0] && postLabelFont[0].textTransform ? `text-transform: ${postLabelFont[0].textTransform};` : '', postLabelFont && postLabelFont[0] && postLabelFont[0].weight ? `font-weight: ${postLabelFont[0].weight};` : '', postLabelFont && postLabelFont[0] && postLabelFont[0].style ? `font-style: ${postLabelFont[0].style};` : '', previewPostLabelFontSize ? `font-size: ${previewPostLabelFontSize + previewPostLabelSizeType};` : '', previewPostLabelLineSize ? `line-height: ${previewPostLabelLineSize + previewPostLabelLineType};` : '', previewPostLabelLetterSize ? `letter-spacing: ${previewPostLabelLetterSize + previewPostLabelLetterType};` : '', '}'), `.kb-countdown-container #kb-timer-${uniqueID} .kb-countdown-date-item:not( .kb-countdown-divider-item ) {`, itemBackground ? `background: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(itemBackground)};` : '', itemBorder ? `border-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(itemBorder)};` : '', itemBorderRadius && itemBorderRadius[0] ? `border-top-left-radius: ${itemBorderRadius[0] + 'px'};` : '', itemBorderRadius && itemBorderRadius[1] ? `border-top-right-radius: ${itemBorderRadius[1] + 'px'};` : '', itemBorderRadius && itemBorderRadius[2] ? `border-bottom-right-radius: ${itemBorderRadius[2] + 'px'};` : '', itemBorderRadius && itemBorderRadius[3] ? `border-bottom-left-radius: ${itemBorderRadius[3] + 'px'};` : '', previewItemBorderTop ? `border-top-width: ${previewItemBorderTop + 'px'};` : '', previewItemBorderRight ? `border-right-width: ${previewItemBorderRight + 'px'};` : '', previewItemBorderBottom ? `border-bottom-width: ${previewItemBorderBottom + 'px'};` : '', previewItemBorderLeft ? `border-left-width: ${previewItemBorderLeft + 'px'};` : '', previewItemPaddingTop ? `padding-top: ${previewItemPaddingTop + previewItemPaddingType};` : '', previewItemPaddingRight ? `padding-right: ${previewItemPaddingRight + previewItemPaddingType};` : '', previewItemPaddingBottom ? `padding-bottom: ${previewItemPaddingBottom + previewItemPaddingType};` : '', previewItemPaddingLeft ? `padding-left: ${previewItemPaddingLeft + previewItemPaddingType};` : '', '}', `.kb-countdown-container #kb-timer-${uniqueID} .kb-countdown-date-item.kb-countdown-divider-item {`, previewItemBorderTop ? `border-top-width: ${previewItemBorderTop + 'px'};` : '', previewItemBorderBottom ? `border-bottom-width: ${previewItemBorderBottom + 'px'};` : '', previewItemPaddingTop ? `padding-top: ${previewItemPaddingTop + previewItemPaddingType};` : '', previewItemPaddingBottom ? `padding-bottom: ${previewItemPaddingBottom + previewItemPaddingType};` : '', '}'), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.showSettings)('allSettings', 'kadence/countdown') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.BlockControls, null, enableTimer && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.AlignmentToolbar, {
    value: undefined !== counterAlign && undefined !== counterAlign[0] ? counterAlign[0] : '',
    onChange: nextAlign => setAttributes({
      counterAlign: [nextAlign, undefined !== counterAlign && undefined !== counterAlign[1] ? counterAlign[1] : '', undefined !== counterAlign && undefined !== counterAlign[2] ? counterAlign[2] : '']
    })
  }), 'message' === expireAction && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToolbarGroup, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    className: "components-tab-button",
    isPressed: !previewExpired,
    onClick: () => setPreviewExpired(false)
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Live', 'kadence-blocks'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    className: "components-tab-button",
    isPressed: previewExpired,
    onClick: () => setPreviewExpired(true)
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Expired', 'kadence-blocks')))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.InspectorControlTabs, {
    panelName: 'countdown',
    setActiveTab: value => setActiveTab(value),
    activeTab: activeTab
  }), activeTab === 'general' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Panel, {
    className: 'components-panel__body is-opened'
  }, isNested && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Countdown Time Settings Synced to Parent Block', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    className: "kb-select-parent-button",
    isSecondary: true,
    onClick: () => selectBlock(parentBlock.clientId)
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Edit Settings', 'kadence-blocks')))), !isNested && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Countdown Type', 'kadence-blocks'),
    options: countdownTypes,
    value: countdownType,
    onChange: value => setAttributes({
      countdownType: value
    })
  }), 'date' === countdownType && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "components-base-control"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.DateTimePicker, {
    currentDate: !date ? undefined : date,
    onChange: value => {
      saveDate(value);
    },
    is12Hour: is12HourTime,
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Date set according to your sites timezone', 'kadence-blocks')
  })), 'evergreen' === countdownType && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Evergreen Hours', 'kadence-blocks'),
    value: evergreenHours,
    onChange: value => {
      saveEvergreenHours(value);
    },
    min: 0,
    max: 100,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Evergreen Minutes', 'kadence-blocks'),
    value: evergreenMinutes,
    onChange: value => {
      saveEvergreenMinutes(value);
    },
    min: 0,
    max: 59,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Campaign ID'),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Create a unique ID. To reset the timer for everyone change this id. To link with other timers give them all the same ID.', 'kadence-blocks'),
    value: campaignID || '',
    onChange: nextValue => {
      nextValue = nextValue.replace(ANCHOR_REGEX, '-');
      setAttributes({
        campaignID: nextValue
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Amount of days to wait until the evergreen is reset for visitors', 'kadence-blocks'),
    value: evergreenReset,
    onChange: value => {
      setAttributes({
        evergreenReset: value
      });
    },
    min: 0,
    max: 100,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Verify by IP Address', 'kadence-blocks'),
    checked: evergreenStrict,
    onChange: value => setAttributes({
      evergreenStrict: value
    }),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('This will add a delay to the rendering of the countdown if no cookie found as it will query the server database to see if the user can be found by their IP address', 'kadence-blocks')
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Action on Expire', 'kadence-blocks'),
    options: countdownActions,
    value: expireAction,
    onChange: value => setAttributes({
      expireAction: value
    })
  }), 'redirect' === expireAction && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.URLInputControl, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Redirect URL', 'kadence-blocks'),
    url: redirectURL,
    onChangeUrl: value => setAttributes({
      redirectURL: value
    }),
    additionalControls: false
  }, this.props))), expireAction && 'none' !== expireAction && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Reveal onLoad', 'kadence-blocks'),
    checked: revealOnLoad,
    onChange: value => setAttributes({
      revealOnLoad: value
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Countdown Layout', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-countdown-layout'
  }, expireAction && 'none' !== expireAction && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Display Countdown', 'kadence-blocks'),
    checked: enableTimer,
    onChange: value => setAttributes({
      enableTimer: value
    })
  }), enableTimer && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.ResponsiveAlignControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Countdown Alignment', 'kadence-blocks'),
    value: undefined !== counterAlign && undefined !== counterAlign[0] ? counterAlign[0] : '',
    tabletValue: undefined !== counterAlign && undefined !== counterAlign[1] ? counterAlign[1] : '',
    mobileValue: undefined !== counterAlign && undefined !== counterAlign[2] ? counterAlign[2] : '',
    onChange: nextAlign => setAttributes({
      counterAlign: [nextAlign, undefined !== counterAlign && undefined !== counterAlign[1] ? counterAlign[1] : '', undefined !== counterAlign && undefined !== counterAlign[2] ? counterAlign[2] : '']
    }),
    onChangeTablet: nextAlign => setAttributes({
      counterAlign: [undefined !== counterAlign && undefined !== counterAlign[0] ? counterAlign[0] : '', nextAlign, undefined !== counterAlign && undefined !== counterAlign[2] ? counterAlign[2] : '']
    }),
    onChangeMobile: nextAlign => setAttributes({
      counterAlign: [undefined !== counterAlign && undefined !== counterAlign[0] ? counterAlign[0] : '', undefined !== counterAlign && undefined !== counterAlign[1] ? counterAlign[1] : '', nextAlign]
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadenceRadioButtons, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Countdown Layout', 'kadence-blocks'),
    value: timerLayout,
    options: [{
      value: 'block',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Block', 'kadence-blocks')
    }, {
      value: 'inline',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Inline', 'kadence-blocks')
    }],
    onChange: value => setAttributes({
      timerLayout: value
    })
  }), 'inline' !== timerLayout && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Enable Divider', 'kadence-blocks'),
    checked: countdownDivider,
    onChange: value => setAttributes({
      countdownDivider: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Enable 00 Number format', 'kadence-blocks'),
    checked: timeNumbers,
    onChange: value => setAttributes({
      timeNumbers: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Countdown Pre Text'),
    value: preLabel,
    onChange: value => setAttributes({
      preLabel: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Countdown Post Text'),
    value: postLabel,
    onChange: value => setAttributes({
      postLabel: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Display Days Unit', 'kadence-blocks'),
    checked: undefined !== units && undefined !== units[0] && undefined !== units[0].days ? units[0].days : true,
    onChange: value => saveUnits({
      days: value
    })
  }), undefined !== units && undefined !== units[0] && undefined !== units[0].days && !units[0].days && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Hours', 'kadence-blocks'),
    checked: undefined !== units && undefined !== units[0] && undefined !== units[0].hours ? units[0].hours : true,
    onChange: value => saveUnits({
      hours: value
    })
  }), undefined !== units && undefined !== units[0] && undefined !== units[0].hours && !units[0].hours && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Minutes', 'kadence-blocks'),
    checked: undefined !== units && undefined !== units[0] && undefined !== units[0].minutes ? units[0].minutes : true,
    onChange: value => saveUnits({
      minutes: value
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Labels', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Days Label'),
    value: daysLabel,
    onChange: value => setAttributes({
      daysLabel: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Hours Label'),
    value: hoursLabel,
    onChange: value => setAttributes({
      hoursLabel: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Minutes Label'),
    value: minutesLabel,
    onChange: value => setAttributes({
      minutesLabel: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Seconds Label'),
    value: secondsLabel,
    onChange: value => setAttributes({
      secondsLabel: value
    })
  })))), activeTab === 'style' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, enableTimer && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Count Item Settings', 'kadence-blocks'),
    panelName: 'kb-countdown-item-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Background Color', 'kadence-blocks'),
    value: itemBackground ? itemBackground : '',
    default: '',
    onChange: value => setAttributes({
      itemBackground: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Border Color', 'kadence-blocks'),
    value: itemBorder ? itemBorder : '',
    default: '',
    onChange: value => setAttributes({
      itemBorder: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Border Width', 'kadence-blocks'),
    value: itemBorderWidth,
    control: itemBorderWidthControl,
    tabletValue: itemTabletBorderWidth,
    mobileValue: itemMobileBorderWidth,
    onChange: value => setAttributes({
      itemBorderWidth: value
    }),
    onChangeTablet: value => setAttributes({
      itemTabletBorderWidth: value
    }),
    onChangeMobile: value => setAttributes({
      itemMobileBorderWidth: value
    }),
    onChangeControl: value => setItemBorderWidthControl(value),
    min: 0,
    max: 40,
    step: 1,
    unit: 'px',
    units: ['px'],
    showUnit: true,
    preset: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Border Radius', 'kadence-blocks'),
    measurement: itemBorderRadius,
    control: itemBorderRadiusControl,
    onChange: value => setAttributes({
      itemBorderRadius: value
    }),
    onControl: value => setItemBorderRadiusControl(value),
    min: 0,
    max: 200,
    step: 1,
    controlTypes: [{
      key: 'linked',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Linked', 'kadence-blocks'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.radiusLinkedIcon
    }, {
      key: 'individual',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Individual', 'kadence-blocks'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.radiusIndividualIcon
    }],
    firstIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.topLeftIcon,
    secondIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.topRightIcon,
    thirdIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.bottomRightIcon,
    fourthIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.bottomLeftIcon
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Padding', 'kadence-blocks'),
    value: itemPadding,
    control: itemPaddingControl,
    tabletValue: itemTabletPadding,
    mobileValue: itemMobilePadding,
    onChange: value => setAttributes({
      itemPadding: value
    }),
    onChangeTablet: value => setAttributes({
      itemTabletPadding: value
    }),
    onChangeMobile: value => setAttributes({
      itemMobilePadding: value
    }),
    onChangeControl: value => setItemPaddingControl(value),
    min: itemPaddingMin,
    max: itemPaddingMax,
    step: itemPaddingStep,
    unit: itemPaddingType,
    units: ['px', 'em', 'rem', '%'],
    onUnit: value => setAttributes({
      itemPaddingType: value
    })
  })), enableTimer && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Number Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-countdown-number-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Color', 'kadence-blocks'),
    value: numberColor ? numberColor : '',
    default: '',
    onChange: value => setAttributes({
      numberColor: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.TypographyControls, {
    fontGroup: 'number-item',
    fontSize: numberFont[0].size,
    onFontSize: value => saveNumberFont({
      size: value
    }),
    fontSizeType: numberFont[0].sizeType,
    onFontSizeType: value => saveNumberFont({
      sizeType: value
    }),
    lineHeight: numberFont[0].lineHeight,
    onLineHeight: value => saveNumberFont({
      lineHeight: value
    }),
    lineHeightType: numberFont[0].lineType,
    onLineHeightType: value => saveNumberFont({
      lineType: value
    }),
    reLetterSpacing: numberFont[0].letterSpacing,
    onLetterSpacing: value => saveNumberFont({
      letterSpacing: value
    }),
    letterSpacingType: numberFont[0].letterType,
    onLetterSpacingType: value => saveNumberFont({
      letterType: value
    }),
    textTransform: numberFont[0].textTransform,
    onTextTransform: value => saveNumberFont({
      textTransform: value
    }),
    fontFamily: numberFont[0].family,
    onFontFamily: value => saveNumberFont({
      family: value
    }),
    onFontChange: select => {
      saveNumberFont({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => saveNumberFont(values),
    googleFont: numberFont[0].google,
    onGoogleFont: value => saveNumberFont({
      google: value
    }),
    loadGoogleFont: numberFont[0].loadGoogle,
    onLoadGoogleFont: value => saveNumberFont({
      loadGoogle: value
    }),
    fontVariant: numberFont[0].variant,
    onFontVariant: value => saveNumberFont({
      variant: value
    }),
    fontWeight: numberFont[0].weight,
    onFontWeight: value => saveNumberFont({
      weight: value
    }),
    fontStyle: numberFont[0].style,
    onFontStyle: value => saveNumberFont({
      style: value
    }),
    fontSubset: numberFont[0].subset,
    onFontSubset: value => saveNumberFont({
      subset: value
    })
  })), enableTimer && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Label Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-countdown-label-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Color', 'kadence-blocks'),
    value: labelColor ? labelColor : '',
    default: '',
    onChange: value => setAttributes({
      labelColor: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.TypographyControls, {
    fontGroup: 'label-item',
    fontSize: labelFont[0].size,
    onFontSize: value => saveLabelFont({
      size: value
    }),
    fontSizeType: labelFont[0].sizeType,
    onFontSizeType: value => saveLabelFont({
      sizeType: value
    }),
    lineHeight: labelFont[0].lineHeight,
    onLineHeight: value => saveLabelFont({
      lineHeight: value
    }),
    lineHeightType: labelFont[0].lineType,
    onLineHeightType: value => saveLabelFont({
      lineType: value
    }),
    reLetterSpacing: labelFont[0].letterSpacing,
    onLetterSpacing: value => saveLabelFont({
      letterSpacing: value
    }),
    letterSpacingType: labelFont[0].letterType,
    onLetterSpacingType: value => saveLabelFont({
      letterType: value
    }),
    textTransform: labelFont[0].textTransform,
    onTextTransform: value => saveLabelFont({
      textTransform: value
    }),
    fontFamily: labelFont[0].family,
    onFontFamily: value => saveLabelFont({
      family: value
    }),
    onFontChange: select => {
      saveLabelFont({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => saveLabelFont(values),
    googleFont: labelFont[0].google,
    onGoogleFont: value => saveLabelFont({
      google: value
    }),
    loadGoogleFont: labelFont[0].loadGoogle,
    onLoadGoogleFont: value => saveLabelFont({
      loadGoogle: value
    }),
    fontVariant: labelFont[0].variant,
    onFontVariant: value => saveLabelFont({
      variant: value
    }),
    fontWeight: labelFont[0].weight,
    onFontWeight: value => saveLabelFont({
      weight: value
    }),
    fontStyle: labelFont[0].style,
    onFontStyle: value => saveLabelFont({
      style: value
    }),
    fontSubset: labelFont[0].subset,
    onFontSubset: value => saveLabelFont({
      subset: value
    })
  })), enableTimer && '' !== preLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Pre Text', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-countdown-pre-text'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Color', 'kadence-blocks'),
    value: preLabelColor ? preLabelColor : '',
    default: '',
    onChange: value => setAttributes({
      preLabelColor: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.TypographyControls, {
    fontGroup: 'prelabel-item',
    fontSize: preLabelFont[0].size,
    onFontSize: value => savePreFont({
      size: value
    }),
    fontSizeType: preLabelFont[0].sizeType,
    onFontSizeType: value => savePreFont({
      sizeType: value
    }),
    lineHeight: preLabelFont[0].lineHeight,
    onLineHeight: value => savePreFont({
      lineHeight: value
    }),
    lineHeightType: preLabelFont[0].lineType,
    onLineHeightType: value => savePreFont({
      lineType: value
    }),
    reLetterSpacing: preLabelFont[0].letterSpacing,
    onLetterSpacing: value => savePreFont({
      letterSpacing: value
    }),
    letterSpacingType: preLabelFont[0].letterType,
    onLetterSpacingType: value => savePreFont({
      letterType: value
    }),
    textTransform: preLabelFont[0].textTransform,
    onTextTransform: value => savePreFont({
      textTransform: value
    }),
    fontFamily: preLabelFont[0].family,
    onFontFamily: value => savePreFont({
      family: value
    }),
    onFontChange: select => {
      savePreFont({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => savePreFont(values),
    googleFont: preLabelFont[0].google,
    onGoogleFont: value => savePreFont({
      google: value
    }),
    loadGoogleFont: preLabelFont[0].loadGoogle,
    onLoadGoogleFont: value => savePreFont({
      loadGoogle: value
    }),
    fontVariant: preLabelFont[0].variant,
    onFontVariant: value => savePreFont({
      variant: value
    }),
    fontWeight: preLabelFont[0].weight,
    onFontWeight: value => savePreFont({
      weight: value
    }),
    fontStyle: preLabelFont[0].style,
    onFontStyle: value => savePreFont({
      style: value
    }),
    fontSubset: preLabelFont[0].subset,
    onFontSubset: value => savePreFont({
      subset: value
    })
  })), enableTimer && '' !== postLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Post Text', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-countdown-post-text'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Color', 'kadence-blocks'),
    value: postLabelColor ? postLabelColor : '',
    default: '',
    onChange: value => setAttributes({
      postLabelColor: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.TypographyControls, {
    fontGroup: 'postlabel-item',
    fontSize: postLabelFont[0].size,
    onFontSize: value => savePostFont({
      size: value
    }),
    fontSizeType: postLabelFont[0].sizeType,
    onFontSizeType: value => savePostFont({
      sizeType: value
    }),
    lineHeight: postLabelFont[0].lineHeight,
    onLineHeight: value => savePostFont({
      lineHeight: value
    }),
    lineHeightType: postLabelFont[0].lineType,
    onLineHeightType: value => savePostFont({
      lineType: value
    }),
    reLetterSpacing: postLabelFont[0].letterSpacing,
    onLetterSpacing: value => savePostFont({
      letterSpacing: value
    }),
    letterSpacingType: postLabelFont[0].letterType,
    onLetterSpacingType: value => savePostFont({
      letterType: value
    }),
    textTransform: postLabelFont[0].textTransform,
    onTextTransform: value => savePostFont({
      textTransform: value
    }),
    fontFamily: postLabelFont[0].family,
    onFontFamily: value => savePostFont({
      family: value
    }),
    onFontChange: select => {
      savePostFont({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => savePostFont(values),
    googleFont: postLabelFont[0].google,
    onGoogleFont: value => savePostFont({
      google: value
    }),
    loadGoogleFont: postLabelFont[0].loadGoogle,
    onLoadGoogleFont: value => savePostFont({
      loadGoogle: value
    }),
    fontVariant: postLabelFont[0].variant,
    onFontVariant: value => savePostFont({
      variant: value
    }),
    fontWeight: postLabelFont[0].weight,
    onFontWeight: value => savePostFont({
      weight: value
    }),
    fontStyle: postLabelFont[0].style,
    onFontStyle: value => savePostFont({
      style: value
    }),
    fontSubset: postLabelFont[0].subset,
    onFontSubset: value => savePostFont({
      subset: value
    })
  }))), activeTab === 'advanced' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Container Settings', 'kadence-blocks'),
    panelName: 'kb-coutdown-container-settings'
  }, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.showSettings)('container', 'kadence/countdown') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Background Color', 'kadence-blocks'),
    value: background ? background : '',
    default: '',
    onChange: value => setAttributes({
      background: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Border Color', 'kadence-blocks'),
    value: border ? border : '',
    default: '',
    onChange: value => setAttributes({
      border: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Border Width', 'kadence-blocks'),
    value: borderWidth,
    control: borderWidthControl,
    tabletValue: tabletBorderWidth,
    mobileValue: mobileBorderWidth,
    onChange: value => setAttributes({
      borderWidth: value
    }),
    onChangeTablet: value => setAttributes({
      tabletBorderWidth: value
    }),
    onChangeMobile: value => setAttributes({
      mobileBorderWidth: value
    }),
    onChangeControl: value => setBorderWidthControl(value),
    min: 0,
    max: 40,
    step: 1,
    unit: 'px',
    units: ['px'],
    showUnit: true,
    preset: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Border Radius', 'kadence-blocks'),
    measurement: borderRadius,
    control: borderRadiusControl,
    onChange: value => setAttributes({
      borderRadius: value
    }),
    onControl: value => setBorderRadiusControl(value),
    min: 0,
    max: 200,
    step: 1,
    controlTypes: [{
      key: 'linked',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Linked', 'kadence-blocks'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.radiusLinkedIcon
    }, {
      key: 'individual',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Individual', 'kadence-blocks'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.radiusIndividualIcon
    }],
    firstIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.topLeftIcon,
    secondIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.topRightIcon,
    thirdIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.bottomRightIcon,
    fourthIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.bottomLeftIcon
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Container Padding', 'kadence-blocks'),
    value: containerPadding,
    control: paddingControl,
    tabletValue: containerTabletPadding,
    mobileValue: containerMobilePadding,
    onChange: value => setAttributes({
      containerPadding: value
    }),
    onChangeTablet: value => setAttributes({
      containerTabletPadding: value
    }),
    onChangeMobile: value => setAttributes({
      containerMobilePadding: value
    }),
    onChangeControl: value => setPaddingControl(value),
    min: paddingMin,
    max: paddingMax,
    step: paddingStep,
    unit: paddingType,
    units: ['px', 'em', 'rem', '%'],
    onUnit: value => setAttributes({
      paddingType: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Container Margin', 'kadence-blocks'),
    value: containerMargin,
    control: marginControl,
    tabletValue: containerTabletMargin,
    mobileValue: containerMobileMargin,
    onChange: value => setAttributes({
      containerMargin: value
    }),
    onChangeTablet: value => setAttributes({
      containerTabletMargin: value
    }),
    onChangeMobile: value => setAttributes({
      containerMobileMargin: value
    }),
    onChangeControl: value => setMarginControl(value),
    min: marginMin,
    max: marginMax,
    step: marginStep,
    unit: marginType,
    units: ['px', 'em', 'rem', '%', 'vh'],
    onUnit: value => setAttributes({
      marginType: value
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Visibility Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-countdown-visibility-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Hide on Desktop', 'kadence-blocks'),
    checked: undefined !== vsdesk ? vsdesk : false,
    onChange: value => setAttributes({
      vsdesk: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Hide on Tablet', 'kadence-blocks'),
    checked: undefined !== vstablet ? vstablet : false,
    onChange: value => setAttributes({
      vstablet: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Hide on Mobile', 'kadence-blocks'),
    checked: undefined !== vsmobile ? vsmobile : false,
    onChange: value => setAttributes({
      vsmobile: value
    })
  }))))), undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].family && '' !== numberFont[0].family && numberFont[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.WebfontLoader, {
    config: numberConfig
  }), undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].family && '' !== labelFont[0].family && labelFont[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.WebfontLoader, {
    config: labelConfig
  }), '' !== preLabel && undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].family && '' !== preLabelFont[0].family && preLabelFont[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.WebfontLoader, {
    config: preLabelConfig
  }), '' !== postLabel && undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].family && '' !== postLabelFont[0].family && postLabelFont[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.WebfontLoader, {
    config: postLabelConfig
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.InnerBlocks, {
    templateLock: "all",
    template: !enableTimer ? templateNoTimer : templateWithTimer
  }));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_11__.compose)([(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_10__.withSelect)((select, ownProps) => {
  const {
    clientId
  } = ownProps;
  let isNested = false;
  const {
    getBlock,
    getBlockParentsByBlockName
  } = select('core/block-editor');
  const parentBlocks = getBlockParentsByBlockName(clientId, 'kadence/countdown');

  if (parentBlocks.length && undefined !== parentBlocks[0] && '' !== parentBlocks[0]) {
    isNested = true;
  }

  return {
    isNested: isNested,
    parentBlock: isNested ? getBlock(parentBlocks[0]) : '',
    getPreviewDevice: select('kadenceblocks/data').getPreviewDeviceType()
  };
}), (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_10__.withDispatch)((dispatch, _ref2) => {
  let {
    clientId
  } = _ref2;
  const {
    selectBlock
  } = dispatch(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.store);
  return {
    selectBlock: id => selectBlock(id)
  };
})])(KadenceCountdown));

/***/ }),

/***/ "./src/blocks/countdown/save.js":
/*!**************************************!*\
  !*** ./src/blocks/countdown/save.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);



/**
 * BLOCK: Kadence Countdown
 */

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */



function Save(_ref) {
  let {
    attributes
  } = _ref;
  const {
    uniqueID,
    vsdesk,
    vstablet,
    vsmobile,
    timerLayout,
    countdownDivider,
    enableTimer,
    counterAlign,
    revealOnLoad
  } = attributes;
  const classes = classnames__WEBPACK_IMPORTED_MODULE_2___default()({
    'kb-countdown-container': true,
    [`kb-countdown-container-${uniqueID}`]: uniqueID,
    [`kb-countdown-timer-layout-${timerLayout}`]: enableTimer && timerLayout,
    'kb-countdown-has-timer': enableTimer,
    'kb-countdown-reveal-on-load': revealOnLoad,
    'kb-countdown-enable-dividers': 'inline' !== timerLayout && countdownDivider && enableTimer,
    [`kb-countdown-align-${counterAlign[0]}`]: undefined !== counterAlign && undefined !== counterAlign[0] && enableTimer ? counterAlign[0] : false,
    [`kb-countdown-align-tablet-${counterAlign[1]}`]: undefined !== counterAlign && undefined !== counterAlign[1] && enableTimer ? counterAlign[1] : false,
    [`kb-countdown-align-mobile-${counterAlign[2]}`]: undefined !== counterAlign && undefined !== counterAlign[2] && enableTimer ? counterAlign[2] : false,
    'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
    'kvs-md-false': vstablet !== 'undefined' && vstablet,
    'kvs-sm-false': vsmobile !== 'undefined' && vsmobile
  });
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
    className: classes
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, blockProps, {
    "data-id": uniqueID
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Save);

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js":
/*!************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data: {};
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
          {expectedType: expectedType}
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (true) {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError(
      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
    );
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "./node_modules/prop-types/index.js":
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "./node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/prop-types/lib/has.js":
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/react-countdown/dist/index.es.js":
/*!*******************************************************!*\
  !*** ./node_modules/react-countdown/dist/index.es.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "calcTimeDelta": () => (/* binding */ calcTimeDelta),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "formatTimeDelta": () => (/* binding */ formatTimeDelta),
/* harmony export */   "zeroPad": () => (/* binding */ zeroPad)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);



function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function zeroPad(value) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var strValue = String(value);
  if (length === 0) return strValue;
  var match = strValue.match(/(.*?)([0-9]+)(.*)/);
  var prefix = match ? match[1] : '';
  var suffix = match ? match[3] : '';
  var strNo = match ? match[2] : strValue;
  var paddedNo = strNo.length >= length ? strNo : (_toConsumableArray(Array(length)).map(function () {
    return '0';
  }).join('') + strNo).slice(length * -1);
  return "".concat(prefix).concat(paddedNo).concat(suffix);
}
var timeDeltaFormatOptionsDefaults = {
  daysInHours: false,
  zeroPadTime: 2
};
function calcTimeDelta(date) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$now = options.now,
      now = _options$now === void 0 ? Date.now : _options$now,
      _options$precision = options.precision,
      precision = _options$precision === void 0 ? 0 : _options$precision,
      controlled = options.controlled,
      _options$offsetTime = options.offsetTime,
      offsetTime = _options$offsetTime === void 0 ? 0 : _options$offsetTime,
      overtime = options.overtime;
  var startTimestamp;

  if (typeof date === 'string') {
    startTimestamp = new Date(date).getTime();
  } else if (date instanceof Date) {
    startTimestamp = date.getTime();
  } else {
    startTimestamp = date;
  }

  if (!controlled) {
    startTimestamp += offsetTime;
  }

  var timeLeft = controlled ? startTimestamp : startTimestamp - now();
  var clampedPrecision = Math.min(20, Math.max(0, precision));
  var total = Math.round(parseFloat(((overtime ? timeLeft : Math.max(0, timeLeft)) / 1000).toFixed(clampedPrecision)) * 1000);
  var seconds = Math.abs(total) / 1000;
  return {
    total: total,
    days: Math.floor(seconds / (3600 * 24)),
    hours: Math.floor(seconds / 3600 % 24),
    minutes: Math.floor(seconds / 60 % 60),
    seconds: Math.floor(seconds % 60),
    milliseconds: Number((seconds % 1 * 1000).toFixed()),
    completed: total <= 0
  };
}
function formatTimeDelta(timeDelta, options) {
  var days = timeDelta.days,
      hours = timeDelta.hours,
      minutes = timeDelta.minutes,
      seconds = timeDelta.seconds;

  var _Object$assign = Object.assign(Object.assign({}, timeDeltaFormatOptionsDefaults), options),
      daysInHours = _Object$assign.daysInHours,
      zeroPadTime = _Object$assign.zeroPadTime,
      _Object$assign$zeroPa = _Object$assign.zeroPadDays,
      zeroPadDays = _Object$assign$zeroPa === void 0 ? zeroPadTime : _Object$assign$zeroPa;

  var zeroPadTimeLength = Math.min(2, zeroPadTime);
  var formattedHours = daysInHours ? zeroPad(hours + days * 24, zeroPadTime) : zeroPad(hours, zeroPadTimeLength);
  return {
    days: daysInHours ? '' : zeroPad(days, zeroPadDays),
    hours: formattedHours,
    minutes: zeroPad(minutes, zeroPadTimeLength),
    seconds: zeroPad(seconds, zeroPadTimeLength)
  };
}

var Countdown = function (_React$Component) {
  _inherits(Countdown, _React$Component);

  var _super = _createSuper(Countdown);

  function Countdown() {
    var _this;

    _classCallCheck(this, Countdown);

    _this = _super.apply(this, arguments);
    _this.state = {
      count: _this.props.count || 3
    };

    _this.startCountdown = function () {
      _this.interval = window.setInterval(function () {
        var count = _this.state.count - 1;

        if (count === 0) {
          _this.stopCountdown();

          _this.props.onComplete && _this.props.onComplete();
        } else {
          _this.setState(function (prevState) {
            return {
              count: prevState.count - 1
            };
          });
        }
      }, 1000);
    };

    _this.stopCountdown = function () {
      clearInterval(_this.interval);
    };

    _this.addTime = function (seconds) {
      _this.stopCountdown();

      _this.setState(function (prevState) {
        return {
          count: prevState.count + seconds
        };
      }, _this.startCountdown);
    };

    return _this;
  }

  _createClass(Countdown, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.startCountdown();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearInterval(this.interval);
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children ? (0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(this.props.children, {
        count: this.state.count
      }) : null;
    }
  }]);

  return Countdown;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);
Countdown.propTypes = {
  count: prop_types__WEBPACK_IMPORTED_MODULE_1__.number,
  children: prop_types__WEBPACK_IMPORTED_MODULE_1__.element,
  onComplete: prop_types__WEBPACK_IMPORTED_MODULE_1__.func
};

var Countdown$1 = function (_React$Component) {
  _inherits(Countdown$1, _React$Component);

  var _super = _createSuper(Countdown$1);

  function Countdown$1(props) {
    var _this;

    _classCallCheck(this, Countdown$1);

    _this = _super.call(this, props);
    _this.mounted = false;
    _this.initialTimestamp = _this.calcOffsetStartTimestamp();
    _this.offsetStartTimestamp = _this.props.autoStart ? 0 : _this.initialTimestamp;
    _this.offsetTime = 0;
    _this.legacyMode = false;
    _this.legacyCountdownRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.createRef)();

    _this.tick = function () {
      var timeDelta = _this.calcTimeDelta();

      var callback = timeDelta.completed && !_this.props.overtime ? undefined : _this.props.onTick;

      _this.setTimeDeltaState(timeDelta, undefined, callback);
    };

    _this.start = function () {
      if (_this.isStarted()) return;
      var prevOffsetStartTimestamp = _this.offsetStartTimestamp;
      _this.offsetStartTimestamp = 0;
      _this.offsetTime += prevOffsetStartTimestamp ? _this.calcOffsetStartTimestamp() - prevOffsetStartTimestamp : 0;

      var timeDelta = _this.calcTimeDelta();

      _this.setTimeDeltaState(timeDelta, "STARTED", _this.props.onStart);

      if (!_this.props.controlled && (!timeDelta.completed || _this.props.overtime)) {
        _this.clearTimer();

        _this.interval = window.setInterval(_this.tick, _this.props.intervalDelay);
      }
    };

    _this.pause = function () {
      if (_this.isPaused()) return;

      _this.clearTimer();

      _this.offsetStartTimestamp = _this.calcOffsetStartTimestamp();

      _this.setTimeDeltaState(_this.state.timeDelta, "PAUSED", _this.props.onPause);
    };

    _this.stop = function () {
      if (_this.isStopped()) return;

      _this.clearTimer();

      _this.offsetStartTimestamp = _this.calcOffsetStartTimestamp();
      _this.offsetTime = _this.offsetStartTimestamp - _this.initialTimestamp;

      _this.setTimeDeltaState(_this.calcTimeDelta(), "STOPPED", _this.props.onStop);
    };

    _this.isStarted = function () {
      return _this.isStatus("STARTED");
    };

    _this.isPaused = function () {
      return _this.isStatus("PAUSED");
    };

    _this.isStopped = function () {
      return _this.isStatus("STOPPED");
    };

    _this.isCompleted = function () {
      return _this.isStatus("COMPLETED");
    };

    _this.handleOnComplete = function (timeDelta) {
      if (_this.props.onComplete) _this.props.onComplete(timeDelta);
    };

    if (props.date) {
      var timeDelta = _this.calcTimeDelta();

      _this.state = {
        timeDelta: timeDelta,
        status: timeDelta.completed ? "COMPLETED" : "STOPPED"
      };
    } else {
      _this.legacyMode = true;
    }

    return _this;
  }

  _createClass(Countdown$1, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.legacyMode) {
        return;
      }

      this.mounted = true;
      if (this.props.onMount) this.props.onMount(this.calcTimeDelta());
      if (this.props.autoStart) this.start();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.legacyMode) {
        return;
      }

      if (this.props.date !== prevProps.date) {
        this.initialTimestamp = this.calcOffsetStartTimestamp();
        this.offsetStartTimestamp = this.initialTimestamp;
        this.offsetTime = 0;
        this.setTimeDeltaState(this.calcTimeDelta());
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.legacyMode) {
        return;
      }

      this.mounted = false;
      this.clearTimer();
    }
  }, {
    key: "calcTimeDelta",
    value: function calcTimeDelta$1() {
      var _this$props = this.props,
          date = _this$props.date,
          now = _this$props.now,
          precision = _this$props.precision,
          controlled = _this$props.controlled,
          overtime = _this$props.overtime;
      return calcTimeDelta(date, {
        now: now,
        precision: precision,
        controlled: controlled,
        offsetTime: this.offsetTime,
        overtime: overtime
      });
    }
  }, {
    key: "calcOffsetStartTimestamp",
    value: function calcOffsetStartTimestamp() {
      return Date.now();
    }
  }, {
    key: "addTime",
    value: function addTime(seconds) {
      this.legacyCountdownRef.current.addTime(seconds);
    }
  }, {
    key: "clearTimer",
    value: function clearTimer() {
      window.clearInterval(this.interval);
    }
  }, {
    key: "isStatus",
    value: function isStatus(status) {
      return this.state.status === status;
    }
  }, {
    key: "setTimeDeltaState",
    value: function setTimeDeltaState(timeDelta, status, callback) {
      var _this2 = this;

      if (!this.mounted) return;
      var completedCallback;

      if (!this.state.timeDelta.completed && timeDelta.completed) {
        if (!this.props.overtime) this.clearTimer();
        completedCallback = this.handleOnComplete;
      }

      var onDone = function onDone() {
        if (callback) callback(_this2.state.timeDelta);
        if (completedCallback) completedCallback(_this2.state.timeDelta);
      };

      return this.setState(function (prevState) {
        var newStatus = status || prevState.status;

        if (timeDelta.completed && !_this2.props.overtime) {
          newStatus = "COMPLETED";
        } else if (!status && newStatus === "COMPLETED") {
          newStatus = "STOPPED";
        }

        return {
          timeDelta: timeDelta,
          status: newStatus
        };
      }, onDone);
    }
  }, {
    key: "getApi",
    value: function getApi() {
      return this.api = this.api || {
        start: this.start,
        pause: this.pause,
        stop: this.stop,
        isStarted: this.isStarted,
        isPaused: this.isPaused,
        isStopped: this.isStopped,
        isCompleted: this.isCompleted
      };
    }
  }, {
    key: "getRenderProps",
    value: function getRenderProps() {
      var _this$props2 = this.props,
          daysInHours = _this$props2.daysInHours,
          zeroPadTime = _this$props2.zeroPadTime,
          zeroPadDays = _this$props2.zeroPadDays;
      var timeDelta = this.state.timeDelta;
      return Object.assign(Object.assign({}, timeDelta), {
        api: this.getApi(),
        props: this.props,
        formatted: formatTimeDelta(timeDelta, {
          daysInHours: daysInHours,
          zeroPadTime: zeroPadTime,
          zeroPadDays: zeroPadDays
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.legacyMode) {
        var _this$props3 = this.props,
            count = _this$props3.count,
            _children = _this$props3.children,
            onComplete = _this$props3.onComplete;
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Countdown, {
          ref: this.legacyCountdownRef,
          count: count,
          onComplete: onComplete
        }, _children);
      }

      var _this$props4 = this.props,
          className = _this$props4.className,
          overtime = _this$props4.overtime,
          children = _this$props4.children,
          renderer = _this$props4.renderer;
      var renderProps = this.getRenderProps();

      if (renderer) {
        return renderer(renderProps);
      }

      if (children && this.state.timeDelta.completed && !overtime) {
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(children, {
          countdown: renderProps
        });
      }

      var _renderProps$formatte = renderProps.formatted,
          days = _renderProps$formatte.days,
          hours = _renderProps$formatte.hours,
          minutes = _renderProps$formatte.minutes,
          seconds = _renderProps$formatte.seconds;
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        className: className
      }, renderProps.total < 0 ? '-' : '', days, days ? ':' : '', hours, ":", minutes, ":", seconds);
    }
  }]);

  return Countdown$1;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);
Countdown$1.defaultProps = Object.assign(Object.assign({}, timeDeltaFormatOptionsDefaults), {
  controlled: false,
  intervalDelay: 1000,
  precision: 0,
  autoStart: true
});
Countdown$1.propTypes = {
  date: (0,prop_types__WEBPACK_IMPORTED_MODULE_1__.oneOfType)([(0,prop_types__WEBPACK_IMPORTED_MODULE_1__.instanceOf)(Date), prop_types__WEBPACK_IMPORTED_MODULE_1__.string, prop_types__WEBPACK_IMPORTED_MODULE_1__.number]),
  daysInHours: prop_types__WEBPACK_IMPORTED_MODULE_1__.bool,
  zeroPadTime: prop_types__WEBPACK_IMPORTED_MODULE_1__.number,
  zeroPadDays: prop_types__WEBPACK_IMPORTED_MODULE_1__.number,
  controlled: prop_types__WEBPACK_IMPORTED_MODULE_1__.bool,
  intervalDelay: prop_types__WEBPACK_IMPORTED_MODULE_1__.number,
  precision: prop_types__WEBPACK_IMPORTED_MODULE_1__.number,
  autoStart: prop_types__WEBPACK_IMPORTED_MODULE_1__.bool,
  overtime: prop_types__WEBPACK_IMPORTED_MODULE_1__.bool,
  className: prop_types__WEBPACK_IMPORTED_MODULE_1__.string,
  children: prop_types__WEBPACK_IMPORTED_MODULE_1__.element,
  renderer: prop_types__WEBPACK_IMPORTED_MODULE_1__.func,
  now: prop_types__WEBPACK_IMPORTED_MODULE_1__.func,
  onMount: prop_types__WEBPACK_IMPORTED_MODULE_1__.func,
  onStart: prop_types__WEBPACK_IMPORTED_MODULE_1__.func,
  onPause: prop_types__WEBPACK_IMPORTED_MODULE_1__.func,
  onStop: prop_types__WEBPACK_IMPORTED_MODULE_1__.func,
  onTick: prop_types__WEBPACK_IMPORTED_MODULE_1__.func,
  onComplete: prop_types__WEBPACK_IMPORTED_MODULE_1__.func
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Countdown$1);



/***/ }),

/***/ "./node_modules/react-is/cjs/react-is.development.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ }),

/***/ "./node_modules/react-is/index.js":
/*!****************************************!*\
  !*** ./node_modules/react-is/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "@kadence/components":
/*!*****************************************!*\
  !*** external ["kadence","components"] ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = window["kadence"]["components"];

/***/ }),

/***/ "@kadence/helpers":
/*!**************************************!*\
  !*** external ["kadence","helpers"] ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = window["kadence"]["helpers"];

/***/ }),

/***/ "@kadence/icons":
/*!************************************!*\
  !*** external ["kadence","icons"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["kadence"]["icons"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/date":
/*!******************************!*\
  !*** external ["wp","date"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["date"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./src/blocks/countdown/block.json":
/*!*****************************************!*\
  !*** ./src/blocks/countdown/block.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Countdown","name":"kadence/countdown","category":"kadence-blocks","description":"","attributes":{"uniqueID":{"type":"string","default":""},"countdownType":{"type":"string","default":"date"},"date":{"type":"string","default":""},"timezone":{"type":"string","default":""},"timestamp":{"type":"number","default":""},"timeOffset":{"type":"number","default":""},"expireAction":{"type":"string","default":"none"},"redirectURL":{"type":"string","default":""},"campaignID":{"type":"string"},"evergreenHours":{"type":"number"},"evergreenMinutes":{"type":"number"},"evergreenReset":{"type":"number","default":30},"evergreenStrict":{"type":"bool","default":false},"enableTimer":{"type":"bool","default":true},"revealOnLoad":{"type":"bool","default":false},"units":{"type":"array","default":[{"days":true,"hours":true,"minutes":true,"seconds":true}]},"timerLayout":{"type":"string","default":"block"},"timeNumbers":{"type":"bool","default":false},"countdownDivider":{"type":"bool","default":false},"preLabel":{"type":"string","default":""},"postLabel":{"type":"string","default":""},"daysLabel":{"type":"string","default":""},"hoursLabel":{"type":"string","default":""},"minutesLabel":{"type":"string","default":""},"secondsLabel":{"type":"string","default":""},"numberColor":{"type":"string"},"numberFont":{"type":"array","default":[{"size":["","",""],"sizeType":"px","lineHeight":["","",""],"lineType":"px","letterSpacing":["","",""],"letterType":"px","textTransform":"","family":"","google":false,"style":"","weight":"","variant":"","subset":"","loadGoogle":true}]},"itemBackground":{"type":"string","default":""},"itemBorder":{"type":"string","default":""},"itemBorderWidth":{"type":"array","default":[0,0,0,0]},"itemTabletBorderWidth":{"type":"array","default":["","","",""]},"itemMobileBorderWidth":{"type":"array","default":["","","",""]},"itemBorderRadius":{"type":"array","default":[0,0,0,0]},"itemPaddingType":{"type":"string","default":"px"},"itemPadding":{"type":"array","default":["","","",""]},"itemTabletPadding":{"type":"array","default":["","","",""]},"itemMobilePadding":{"type":"array","default":["","","",""]},"labelColor":{"type":"string"},"labelFont":{"type":"array","default":[{"size":["","",""],"sizeType":"px","lineHeight":["","",""],"lineType":"px","letterSpacing":["","",""],"letterType":"px","textTransform":"","family":"","google":false,"style":"","weight":"","variant":"","subset":"","loadGoogle":true}]},"preLabelColor":{"type":"string"},"preLabelFont":{"type":"array","default":[{"size":["","",""],"sizeType":"px","lineHeight":["","",""],"lineType":"px","letterSpacing":["","",""],"letterType":"px","textTransform":"","family":"","google":false,"style":"","weight":"","variant":"","subset":"","loadGoogle":true}]},"postLabelColor":{"type":"string"},"postLabelFont":{"type":"array","default":[{"size":["","",""],"sizeType":"px","lineHeight":["","",""],"lineType":"px","letterSpacing":["","",""],"letterType":"px","textTransform":"","family":"","google":false,"style":"","weight":"","variant":"","subset":"","loadGoogle":true}]},"counterAlign":{"type":"array","default":["","",""]},"border":{"type":"string","default":""},"borderWidth":{"type":"array","default":[0,0,0,0]},"tabletBorderWidth":{"type":"array","default":["","","",""]},"mobileBorderWidth":{"type":"array","default":["","","",""]},"borderRadius":{"type":"array","default":[0,0,0,0]},"background":{"type":"string","default":""},"paddingType":{"type":"string","default":"px"},"containerPadding":{"type":"array","default":["","","",""]},"containerTabletPadding":{"type":"array","default":["","","",""]},"containerMobilePadding":{"type":"array","default":["","","",""]},"marginType":{"type":"string","default":"px"},"containerMargin":{"type":"array","default":["","","",""]},"containerTabletMargin":{"type":"array","default":["","","",""]},"containerMobileMargin":{"type":"array","default":["","","",""]},"vsdesk":{"type":"bool","default":false},"vstablet":{"type":"bool","default":false},"vsmobile":{"type":"bool","default":false}},"supports":{"anchor":true,"align":["wide","full"],"reusable":false,"html":false}}');

/***/ }),

/***/ "./src/blocks/countdown/countdown-inner/block.json":
/*!*********************************************************!*\
  !*** ./src/blocks/countdown/countdown-inner/block.json ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Countdown Content","name":"kadence/countdown-inner","category":"kadence-blocks","parent":["kadence/countdown"],"description":"","attributes":{"uniqueID":{"type":"string"},"location":{"type":"string"}},"supports":{"inserter":false,"reusable":false,"html":false}}');

/***/ }),

/***/ "./src/blocks/countdown/countdown-timer/block.json":
/*!*********************************************************!*\
  !*** ./src/blocks/countdown/countdown-timer/block.json ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Countdown Timer","name":"kadence/countdown-timer","category":"kadence-blocks","parent":["kadence/countdown"],"description":"","attributes":{"uniqueID":{"type":"string"}},"supports":{"inserter":false,"reusable":false,"html":false}}');

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"blocks-countdown": 0,
/******/ 			"./style-blocks-countdown": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkkadence"] = globalThis["webpackChunkkadence"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-blocks-countdown"], () => (__webpack_require__("./src/blocks/countdown/block.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	(this.kadence = this.kadence || {})["blocks-countdown"] = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=blocks-countdown.js.map