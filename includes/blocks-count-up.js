/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/count-up/editor.scss":
/*!*****************************************!*\
  !*** ./src/blocks/count-up/editor.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/count-up/deprecated.js":
/*!*******************************************!*\
  !*** ./src/blocks/count-up/deprecated.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);


/**
 * BLOCK: Kadence Count-Up
 */

/**
 * Import External
 */

const {
  RichText
} = wp.blockEditor;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([{
  attributes: {
    uniqueID: {
      type: 'string',
      default: ''
    },
    title: {
      type: 'string',
      default: ''
    },
    displayTitle: {
      type: 'bool',
      default: true
    },
    titleFont: {
      type: 'array',
      default: [{
        level: 4,
        htmlTag: 'div',
        size: ['', '', ''],
        sizeType: 'px',
        lineHeight: ['', '', ''],
        lineType: 'px',
        letterSpacing: '',
        textTransform: '',
        family: '',
        google: false,
        style: '',
        weight: '',
        variant: '',
        subset: '',
        loadGoogle: true
      }]
    },
    titlePaddingType: {
      type: 'string',
      default: 'px'
    },
    titlePadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    titleTabletPadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    titleMobilePadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    titleMarginType: {
      type: 'string',
      default: 'px'
    },
    titleMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    titleTabletMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    titleMobileMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    titleAlign: {
      type: 'array',
      default: ['', '', '']
    },
    titleColor: {
      type: 'string',
      default: ''
    },
    titleHoverColor: {
      type: 'string',
      default: ''
    },
    titleMinHeight: {
      type: 'array',
      default: ['', '', '']
    },
    numberFont: {
      type: 'array',
      default: [{
        size: ['50', '', ''],
        sizeType: 'px',
        lineHeight: ['', '', ''],
        lineType: 'px',
        letterSpacing: '',
        textTransform: '',
        family: '',
        google: false,
        style: '',
        weight: '',
        variant: '',
        subset: '',
        loadGoogle: true
      }]
    },
    numberPaddingType: {
      type: 'string',
      default: 'px'
    },
    numberPadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    numberTabletPadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    numberMobilePadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    numberMarginType: {
      type: 'string',
      default: 'px'
    },
    numberMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    numberTabletMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    numberMobileMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    numberAlign: {
      type: 'array',
      default: ['', '', '']
    },
    numberColor: {
      type: 'string',
      default: ''
    },
    numberHoverColor: {
      type: 'string',
      default: ''
    },
    numberMinHeight: {
      type: 'array',
      default: ['', '', '']
    },
    start: {
      type: 'number',
      default: 0
    },
    end: {
      type: 'number',
      default: 100
    },
    prefix: {
      type: 'string',
      default: ''
    },
    suffix: {
      type: 'string',
      default: ''
    },
    duration: {
      type: 'number',
      default: 2.5
    },
    separator: {
      type: 'bool',
      default: false
    }
  },
  save: _ref => {
    let {
      attributes
    } = _ref;
    const {
      uniqueID,
      title,
      start,
      end,
      prefix,
      suffix,
      duration,
      separator,
      titleFont,
      displayTitle
    } = attributes;
    const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      [`kb-count-up-${uniqueID}`]: uniqueID,
      'kb-count-up': true
    });
    const tagName = titleFont[0].htmlTag && titleFont[0].htmlTag !== 'heading' ? titleFont[0].htmlTag : 'h' + titleFont[0].level;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classes,
      "data-start": start,
      "data-end": end,
      "data-prefix": prefix,
      "data-suffix": suffix,
      "data-duration": duration,
      "data-separator": separator
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kb-count-up-process kb-count-up-number'
    }), title && displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(RichText.Content, {
      tagName: tagName,
      className: 'kb-count-up-title',
      value: title
    }));
  }
}]);

/***/ }),

/***/ "./src/blocks/count-up/edit.js":
/*!*************************************!*\
  !*** ./src/blocks/count-up/edit.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _inspector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inspector */ "./src/blocks/count-up/inspector.js");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_countup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-countup */ "./node_modules/react-countup/build/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/count-up/editor.scss");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_10__);


/**
 * BLOCK: Kadence Count Up
 */

/**
 * Internal dependencies
 */



/**
 * Import External
 */



/**
 * Import Css
 */


/**
 * Internal block libraries
 */






const kbCountUpUniqueIDs = [];
/**
 * Build the count up edit
 */

function KadenceCounterUp(_ref) {
  let {
    clientId,
    attributes,
    className,
    isSelected,
    setAttributes,
    getPreviewDevice
  } = _ref;
  const {
    uniqueID,
    title,
    start,
    end,
    prefix,
    suffix,
    duration,
    separator,
    displayTitle,
    titleFont,
    titleAlign,
    titleColor,
    titleMinHeight,
    numberFont,
    numberAlign,
    numberColor,
    numberMinHeight,
    numberPadding,
    numberMobilePadding,
    numberMobileMargin,
    numberTabletMargin,
    numberTabletPadding,
    numberMargin,
    numberPaddingType,
    numberMarginType,
    titlePadding,
    titleMobilePadding,
    titleMobileMargin,
    titleTabletMargin,
    titleTabletPadding,
    titleMargin,
    titlePaddingType,
    titleMarginType,
    decimal,
    decimalSpaces
  } = attributes;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!uniqueID) {
      const blockConfigObject = kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : [];
      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9),
        numberFont: [...numberFont]
      });
      kbCountUpUniqueIDs.push('_' + clientId.substr(2, 9));
    } else if (kbCountUpUniqueIDs.includes(uniqueID)) {
      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      kbCountUpUniqueIDs.push('_' + clientId.substr(2, 9));
    } else {
      kbCountUpUniqueIDs.push(uniqueID);
    }
  }, []);
  const tagName = titleFont[0].htmlTag && titleFont[0].htmlTag !== 'heading' ? titleFont[0].htmlTag : 'h' + titleFont[0].level;
  const gconfig = {
    google: {
      families: [titleFont[0].family + (titleFont[0].variant ? ':' + titleFont[0].variant : '')]
    }
  };
  const config = titleFont[0].google ? gconfig : '';
  const ngconfig = {
    google: {
      families: [numberFont[0].family + (numberFont[0].variant ? ':' + numberFont[0].variant : '')]
    }
  };
  const nconfig = numberFont[0].google ? ngconfig : '';
  const previewTitleAlign = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== titleAlign[0] ? titleAlign[0] : '', undefined !== titleAlign[1] ? titleAlign[1] : '', undefined !== titleAlign[2] ? titleAlign[2] : '');
  const previewNumberAlign = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== numberAlign[0] ? numberAlign[0] : '', undefined !== numberAlign[1] ? numberAlign[1] : '', undefined !== numberAlign[2] ? numberAlign[2] : '');
  const previewNumberMarginTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== numberMargin && undefined !== numberMargin[0] ? numberMargin[0] : '', undefined !== numberTabletMargin && undefined !== numberTabletMargin[0] ? numberTabletMargin[0] : '', undefined !== numberMobileMargin && undefined !== numberMobileMargin[0] ? numberMobileMargin[0] : '');
  const previewNumberMarginRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== numberMargin && undefined !== numberMargin[1] ? numberMargin[1] : '', undefined !== numberTabletMargin && undefined !== numberTabletMargin[1] ? numberTabletMargin[1] : '', undefined !== numberMobileMargin && undefined !== numberMobileMargin[1] ? numberMobileMargin[1] : '');
  const previewNumberMarginBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== numberMargin && undefined !== numberMargin[2] ? numberMargin[2] : '', undefined !== numberTabletMargin && undefined !== numberTabletMargin[2] ? numberTabletMargin[2] : '', undefined !== numberMobileMargin && undefined !== numberMobileMargin[2] ? numberMobileMargin[2] : '');
  const previewNumberMarginLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== numberMargin && undefined !== numberMargin[3] ? numberMargin[3] : '', undefined !== numberTabletMargin && undefined !== numberTabletMargin[3] ? numberTabletMargin[3] : '', undefined !== numberMobileMargin && undefined !== numberMobileMargin[3] ? numberMobileMargin[3] : '');
  const previewNumberPaddingTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== numberPadding && undefined !== numberPadding[0] ? numberPadding[0] : '', undefined !== numberTabletPadding && undefined !== numberTabletPadding[0] ? numberTabletPadding[0] : '', undefined !== numberMobilePadding && undefined !== numberMobilePadding[0] ? numberMobilePadding[0] : '');
  const previewNumberPaddingRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== numberPadding && undefined !== numberPadding[1] ? numberPadding[1] : '', undefined !== numberTabletPadding && undefined !== numberTabletPadding[1] ? numberTabletPadding[1] : '', undefined !== numberMobilePadding && undefined !== numberMobilePadding[1] ? numberMobilePadding[1] : '');
  const previewNumberPaddingBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== numberPadding && undefined !== numberPadding[2] ? numberPadding[2] : '', undefined !== numberTabletPadding && undefined !== numberTabletPadding[2] ? numberTabletPadding[2] : '', undefined !== numberMobilePadding && undefined !== numberMobilePadding[2] ? numberMobilePadding[2] : '');
  const previewNumberPaddingLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== numberPadding && undefined !== numberPadding[3] ? numberPadding[3] : '', undefined !== numberTabletPadding && undefined !== numberTabletPadding[3] ? numberTabletPadding[3] : '', undefined !== numberMobilePadding && undefined !== numberMobilePadding[3] ? numberMobilePadding[3] : '');
  const previewTitleMarginTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== titleMargin && undefined !== titleMargin[0] ? titleMargin[0] : '', undefined !== titleTabletMargin && undefined !== titleTabletMargin[0] ? titleTabletMargin[0] : '', undefined !== titleMobileMargin && undefined !== titleMobileMargin[0] ? titleMobileMargin[0] : '');
  const previewTitleMarginRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== titleMargin && undefined !== titleMargin[1] ? titleMargin[1] : '', undefined !== titleTabletMargin && undefined !== titleTabletMargin[1] ? titleTabletMargin[1] : '', undefined !== titleMobileMargin && undefined !== titleMobileMargin[1] ? titleMobileMargin[1] : '');
  const previewTitleMarginBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== titleMargin && undefined !== titleMargin[2] ? titleMargin[2] : '', undefined !== titleTabletMargin && undefined !== titleTabletMargin[2] ? titleTabletMargin[2] : '', undefined !== titleMobileMargin && undefined !== titleMobileMargin[2] ? titleMobileMargin[2] : '');
  const previewTitleMarginLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== titleMargin && undefined !== titleMargin[3] ? titleMargin[3] : '', undefined !== titleTabletMargin && undefined !== titleTabletMargin[3] ? titleTabletMargin[3] : '', undefined !== titleMobileMargin && undefined !== titleMobileMargin[3] ? titleMobileMargin[3] : '');
  const previewTitlePaddingTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== titlePadding && undefined !== titlePadding[0] ? titlePadding[0] : '', undefined !== titleTabletPadding && undefined !== titleTabletPadding[0] ? titleTabletPadding[0] : '', undefined !== titleMobilePadding && undefined !== titleMobilePadding[0] ? titleMobilePadding[0] : '');
  const previewTitlePaddingRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== titlePadding && undefined !== titlePadding[1] ? titlePadding[1] : '', undefined !== titleTabletPadding && undefined !== titleTabletPadding[1] ? titleTabletPadding[1] : '', undefined !== titleMobilePadding && undefined !== titleMobilePadding[1] ? titleMobilePadding[1] : '');
  const previewTitlePaddingBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== titlePadding && undefined !== titlePadding[2] ? titlePadding[2] : '', undefined !== titleTabletPadding && undefined !== titleTabletPadding[2] ? titleTabletPadding[2] : '', undefined !== titleMobilePadding && undefined !== titleMobilePadding[2] ? titleMobilePadding[2] : '');
  const previewTitlePaddingLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, undefined !== titlePadding && undefined !== titlePadding[3] ? titlePadding[3] : '', undefined !== titleTabletPadding && undefined !== titleTabletPadding[3] ? titleTabletPadding[3] : '', undefined !== titleMobilePadding && undefined !== titleMobilePadding[3] ? titleMobilePadding[3] : '');
  const classes = classnames__WEBPACK_IMPORTED_MODULE_5___default()({
    [`kb-count-up-${uniqueID}`]: uniqueID,
    'kb-count-up': true
  });
  let theSeparator = separator === true ? ',' : separator;
  theSeparator = theSeparator === false ? '' : theSeparator;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__.useBlockProps)({});
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, isSelected && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_inspector__WEBPACK_IMPORTED_MODULE_1__["default"], {
    setAttributes: setAttributes,
    attributes: attributes
  }), displayTitle && titleFont[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.WebfontLoader, {
    config: config
  }), numberFont[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.WebfontLoader, {
    config: nconfig
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: classes
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: 'kb-count-up-number',
    style: {
      fontWeight: numberFont[0].weight,
      fontStyle: numberFont[0].style,
      color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(numberColor),
      fontSize: numberFont[0].size[0] + numberFont[0].sizeType,
      lineHeight: numberFont[0].lineHeight && numberFont[0].lineHeight[0] ? numberFont[0].lineHeight[0] + numberFont[0].lineType : undefined,
      letterSpacing: numberFont[0].letterSpacing + 'px',
      fontFamily: numberFont[0].family ? numberFont[0].family : '',
      minHeight: undefined !== numberMinHeight && undefined !== numberMinHeight[0] ? numberMinHeight[0] + 'px' : undefined,
      textAlign: previewNumberAlign,
      paddingTop: '' !== previewNumberPaddingTop ? previewNumberPaddingTop + numberPaddingType : undefined,
      paddingRight: '' !== previewNumberPaddingRight ? previewNumberPaddingRight + numberPaddingType : undefined,
      paddingBottom: '' !== previewNumberPaddingBottom ? previewNumberPaddingBottom + numberPaddingType : undefined,
      paddingLeft: '' !== previewNumberPaddingLeft ? previewNumberPaddingLeft + numberPaddingType : undefined,
      marginTop: previewNumberMarginTop ? previewNumberMarginTop + numberMarginType : undefined,
      marginRight: previewNumberMarginRight ? previewNumberMarginRight + numberMarginType : undefined,
      marginBottom: previewNumberMarginBottom ? previewNumberMarginBottom + numberMarginType : undefined,
      marginLeft: previewNumberMarginLeft ? previewNumberMarginLeft + numberMarginType : undefined
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_countup__WEBPACK_IMPORTED_MODULE_4__["default"], {
    start: start,
    end: end,
    duration: duration,
    separator: theSeparator,
    decimal: decimal ? decimal : undefined,
    decimals: decimal && decimalSpaces ? decimalSpaces : undefined,
    prefix: prefix,
    suffix: suffix
  })), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__.RichText, {
    tagName: tagName,
    className: 'kb-count-up-title',
    value: title,
    onChange: content => setAttributes({
      title: content
    }),
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Type Here...', 'kadence-blocks'),
    style: {
      fontWeight: titleFont[0].weight,
      fontStyle: titleFont[0].style,
      color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(titleColor),
      fontSize: titleFont[0].size[0] + titleFont[0].sizeType,
      lineHeight: titleFont[0].lineHeight && titleFont[0].lineHeight[0] ? titleFont[0].lineHeight[0] + titleFont[0].lineType : undefined,
      letterSpacing: titleFont[0].letterSpacing + 'px',
      fontFamily: titleFont[0].family ? titleFont[0].family : '',
      minHeight: undefined !== titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] + 'px' : undefined,
      textAlign: previewTitleAlign,
      paddingTop: '' !== previewTitlePaddingTop ? previewTitlePaddingTop + titlePaddingType : undefined,
      paddingRight: '' !== previewTitlePaddingRight ? previewTitlePaddingRight + titlePaddingType : undefined,
      paddingBottom: '' !== previewTitlePaddingBottom ? previewTitlePaddingBottom + titlePaddingType : undefined,
      paddingLeft: '' !== previewTitlePaddingLeft ? previewTitlePaddingLeft + titlePaddingType : undefined,
      marginTop: previewTitleMarginTop ? previewTitleMarginTop + titleMarginType : undefined,
      marginRight: previewTitleMarginRight ? previewTitleMarginRight + titleMarginType : undefined,
      marginBottom: previewTitleMarginBottom ? previewTitleMarginBottom + titleMarginType : undefined,
      marginLeft: previewTitleMarginLeft ? previewTitleMarginLeft + titleMarginType : undefined,
      textTransform: titleFont[0].textTransform ? titleFont[0].textTransform : undefined
    }
  })));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_9__.compose)([(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_10__.withSelect)(select => {
  return {
    getPreviewDevice: select('kadenceblocks/data').getPreviewDeviceType()
  };
})])(KadenceCounterUp));

/***/ }),

/***/ "./src/blocks/count-up/inspector.js":
/*!******************************************!*\
  !*** ./src/blocks/count-up/inspector.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);


/**
 * BLOCK: Kadence Count Up
 */

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */

/**
 * WordPress dependencies
 */





/**
 * Count Up Settings
 */

function Inspector(props) {
  const [titlePaddingControl, setTitlePaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('individual');
  const [titleMarginControl, setTitleMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('individual');
  const [numberPaddingControl, setNumberPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('individual');
  const [numberMarginControl, setNumberMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('individual');
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('general');
  const {
    attributes,
    setAttributes
  } = props;
  const {
    start,
    end,
    prefix,
    suffix,
    duration,
    separator,
    displayTitle,
    titleFont,
    titleAlign,
    titleColor,
    titleMinHeight,
    titlePadding,
    titleMobilePadding,
    titleMobileMargin,
    titleTabletMargin,
    titleTabletPadding,
    titleMargin,
    titlePaddingType,
    titleMarginType,
    numberColor,
    numberMinHeight,
    numberFont,
    numberAlign,
    numberPadding,
    numberMobilePadding,
    numberMobileMargin,
    numberTabletMargin,
    numberTabletPadding,
    numberMargin,
    numberPaddingType,
    numberMarginType,
    decimalSpaces,
    decimal
  } = attributes;

  const saveTitleFont = value => {
    const newUpdate = titleFont.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      titleFont: newUpdate
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

  let theSeparator = separator === true ? ',' : separator;
  theSeparator = theSeparator === false ? '' : theSeparator;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.InspectorControlTabs, {
    panelName: 'count-up',
    setActiveTab: value => setActiveTab(value),
    activeTab: activeTab
  }), activeTab === 'general' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Count Up Settings'),
    initialOpen: true,
    panelName: 'kb-inspector-countup-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "kt-columns-control"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      marginBottom: '15px'
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalNumberControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Starting Number', 'kadence-blocks'),
    value: start,
    onChange: value => setAttributes({
      start: parseInt(value)
    }),
    min: 0,
    isShiftStepEnabled: true,
    shiftStep: 10
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      marginBottom: '15px'
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalNumberControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Ending Number', 'kadence-blocks'),
    value: end,
    onChange: value => setAttributes({
      end: parseInt(value)
    }),
    min: 0,
    isShiftStepEnabled: true,
    shiftStep: 10
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Number Prefix', 'kadence-blocks'),
    value: prefix,
    onChange: value => setAttributes({
      prefix: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Number Suffix', 'kadence-blocks'),
    value: suffix,
    onChange: value => setAttributes({
      suffix: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Animation Duration', 'kadence-blocks'),
    value: duration,
    onChange: value => setAttributes({
      duration: value
    }),
    min: 0.1,
    max: 25,
    step: 0.1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Thousand Separator', 'kadence-blocks'),
    value: theSeparator,
    options: [{
      value: '',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('None', 'kadence-blocks')
    }, {
      value: ',',
      label: ','
    }, {
      value: '.',
      label: '.'
    }],
    onChange: value => setAttributes({
      separator: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Decimal', 'kadence-blocks'),
    value: decimal,
    options: [{
      value: '',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('None', 'kadence-blocks')
    }, {
      value: '.',
      label: '.'
    }, {
      value: ',',
      label: ','
    }],
    onChange: value => setAttributes({
      decimal: value
    })
  }), decimal && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Decimal Spaces', 'kadence-blocks'),
    value: decimalSpaces,
    onChange: value => setAttributes({
      decimalSpaces: value
    }),
    min: 1,
    max: 25,
    step: 1
  })))), activeTab === 'style' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Title Settings', 'kadence-blocks'),
    panelName: 'kb-inspector-title-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Show Title', 'kadence-blocks'),
    checked: displayTitle,
    onChange: value => setAttributes({
      displayTitle: value
    })
  }), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Title Color', 'kadence-blocks'),
    value: titleColor ? titleColor : '',
    default: '',
    onChange: value => setAttributes({
      titleColor: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.ResponsiveAlignControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Text Alignment', 'kadence-blocks'),
    value: titleAlign && titleAlign[0] ? titleAlign[0] : '',
    mobileValue: titleAlign && titleAlign[2] ? titleAlign[2] : '',
    tabletValue: titleAlign && titleAlign[1] ? titleAlign[1] : '',
    onChange: nextAlign => setAttributes({
      titleAlign: [nextAlign, titleAlign && titleAlign[1] ? titleAlign[1] : '', titleAlign && titleAlign[2] ? titleAlign[2] : '']
    }),
    onChangeTablet: nextAlign => setAttributes({
      titleAlign: [titleAlign && titleAlign[0] ? titleAlign[0] : '', nextAlign, titleAlign && titleAlign[2] ? titleAlign[2] : '']
    }),
    onChangeMobile: nextAlign => setAttributes({
      titleAlign: [titleAlign && titleAlign[0] ? titleAlign[0] : '', titleAlign && titleAlign[1] ? titleAlign[1] : '', nextAlign]
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "kt-heading-size-title"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Min Height')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TabPanel, {
    className: "kt-size-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'desk',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Dashicon, {
        icon: "desktop"
      }),
      className: 'kt-desk-tab'
    }, {
      name: 'tablet',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Dashicon, {
        icon: "tablet"
      }),
      className: 'kt-tablet-tab'
    }, {
      name: 'mobile',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Dashicon, {
        icon: "smartphone"
      }),
      className: 'kt-mobile-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('mobile' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
          value: undefined !== titleMinHeight && undefined !== titleMinHeight[2] ? titleMinHeight[2] : '',
          onChange: value => setAttributes({
            titleMinHeight: [undefined !== titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : '', undefined !== titleMinHeight && undefined !== titleMinHeight[1] ? titleMinHeight[1] : '', value]
          }),
          step: 1,
          min: 0,
          max: 600
        });
      } else if ('tablet' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
          value: undefined !== titleMinHeight && undefined !== titleMinHeight[1] ? titleMinHeight[1] : '',
          onChange: value => setAttributes({
            titleMinHeight: [undefined !== titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : '', value, undefined !== titleMinHeight && undefined !== titleMinHeight[2] ? titleMinHeight[2] : '']
          }),
          step: 1,
          min: 0,
          max: 600
        });
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
          value: undefined !== titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : '',
          onChange: value => setAttributes({
            titleMinHeight: [value, undefined !== titleMinHeight && undefined !== titleMinHeight[1] ? titleMinHeight[1] : '', undefined !== titleMinHeight && undefined !== titleMinHeight[2] ? titleMinHeight[2] : '']
          }),
          step: 1,
          min: 0,
          max: 600
        });
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.TypographyControls, {
    fontGroup: 'heading',
    tagLowLevel: 2,
    tagHighLevel: 7,
    otherTags: {
      'p': true,
      'span': true,
      'div': true
    },
    tagLevel: titleFont[0].level,
    htmlTag: titleFont[0].htmlTag,
    onTagLevel: value => saveTitleFont({
      level: value
    }),
    onTagLevelHTML: (level, tag) => {
      saveTitleFont({
        level: level,
        htmlTag: tag
      });
    },
    fontSize: titleFont[0].size,
    onFontSize: value => saveTitleFont({
      size: value
    }),
    fontSizeType: titleFont[0].sizeType,
    onFontSizeType: value => saveTitleFont({
      sizeType: value
    }),
    lineHeight: titleFont[0].lineHeight,
    onLineHeight: value => saveTitleFont({
      lineHeight: value
    }),
    lineHeightType: titleFont[0].lineType,
    onLineHeightType: value => saveTitleFont({
      lineType: value
    }),
    letterSpacing: titleFont[0].letterSpacing,
    onLetterSpacing: value => saveTitleFont({
      letterSpacing: value
    }),
    fontFamily: titleFont[0].family,
    textTransform: titleFont[0].textTransform,
    onTextTransform: value => saveTitleFont({
      textTransform: value
    }),
    onFontFamily: value => saveTitleFont({
      family: value
    }),
    onFontChange: select => {
      saveTitleFont({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => saveTitleFont(values),
    googleFont: titleFont[0].google,
    onGoogleFont: value => saveTitleFont({
      google: value
    }),
    loadGoogleFont: titleFont[0].loadGoogle,
    onLoadGoogleFont: value => saveTitleFont({
      loadGoogle: value
    }),
    fontVariant: titleFont[0].variant,
    onFontVariant: value => saveTitleFont({
      variant: value
    }),
    fontWeight: titleFont[0].weight,
    onFontWeight: value => saveTitleFont({
      weight: value
    }),
    fontStyle: titleFont[0].style,
    onFontStyle: value => saveTitleFont({
      style: value
    }),
    fontSubset: titleFont[0].subset,
    onFontSubset: value => saveTitleFont({
      subset: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Title Padding', 'kadence-blocks'),
    value: titlePadding,
    control: titlePaddingControl,
    tabletValue: titleTabletPadding,
    mobileValue: titleMobilePadding,
    onChange: value => setAttributes({
      titlePadding: value
    }),
    onChangeTablet: value => setAttributes({
      titleTabletPadding: value
    }),
    onChangeMobile: value => setAttributes({
      titleMobilePadding: value
    }),
    onChangeControl: value => setTitlePaddingControl(value),
    min: 0,
    max: titlePaddingType === 'em' || titlePaddingType === 'rem' ? 12 : 200,
    step: titlePaddingType === 'em' || titlePaddingType === 'rem' ? 0.1 : 1,
    unit: titlePaddingType,
    units: ['px', 'em', 'rem', '%'],
    onUnit: value => setAttributes({
      titlePaddingType: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Title Margin', 'kadence-blocks'),
    value: titleMargin,
    control: titleMarginControl,
    tabletValue: titleTabletMargin,
    mobileValue: titleMobileMargin,
    onChange: value => setAttributes({
      titleMargin: value
    }),
    onChangeTablet: value => setAttributes({
      titleTabletMargin: value
    }),
    onChangeMobile: value => setAttributes({
      titleMobileMargin: value
    }),
    onChangeControl: value => setTitleMarginControl(value),
    min: titleMarginType === 'em' || titleMarginType === 'rem' ? -12 : -200,
    max: titleMarginType === 'em' || titleMarginType === 'rem' ? 12 : 200,
    step: titleMarginType === 'em' || titleMarginType === 'rem' ? 0.1 : 1,
    unit: titleMarginType,
    units: ['px', 'em', 'rem', '%', 'vh'],
    onUnit: value => setAttributes({
      titleMarginType: value
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Number Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-inspector-number-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Number Color', 'kadence-blocks'),
    value: numberColor ? numberColor : '',
    default: '',
    onChange: value => setAttributes({
      numberColor: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.ResponsiveAlignControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Text Alignment', 'kadence-blocks'),
    value: numberAlign && numberAlign[0] ? numberAlign[0] : '',
    mobileValue: numberAlign && numberAlign[2] ? numberAlign[2] : '',
    tabletValue: numberAlign && numberAlign[1] ? numberAlign[1] : '',
    onChange: nextAlign => setAttributes({
      numberAlign: [nextAlign, numberAlign && numberAlign[1] ? numberAlign[1] : '', numberAlign && numberAlign[2] ? numberAlign[2] : '']
    }),
    onChangeTablet: nextAlign => setAttributes({
      numberAlign: [numberAlign && numberAlign[0] ? numberAlign[0] : '', nextAlign, numberAlign && numberAlign[2] ? numberAlign[2] : '']
    }),
    onChangeMobile: nextAlign => setAttributes({
      numberAlign: [numberAlign && numberAlign[0] ? numberAlign[0] : '', numberAlign && numberAlign[1] ? numberAlign[1] : '', nextAlign]
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "kt-heading-size-title"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Min Height')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TabPanel, {
    className: "kt-size-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'desk',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Dashicon, {
        icon: "desktop"
      }),
      className: 'kt-desk-tab'
    }, {
      name: 'tablet',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Dashicon, {
        icon: "tablet"
      }),
      className: 'kt-tablet-tab'
    }, {
      name: 'mobile',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Dashicon, {
        icon: "smartphone"
      }),
      className: 'kt-mobile-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('mobile' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
          value: undefined !== numberMinHeight && undefined !== numberMinHeight[2] ? numberMinHeight[2] : '',
          onChange: value => setAttributes({
            numberMinHeight: [undefined !== numberMinHeight && undefined !== numberMinHeight[0] ? numberMinHeight[0] : '', undefined !== numberMinHeight && undefined !== numberMinHeight[1] ? numberMinHeight[1] : '', value]
          }),
          step: 1,
          min: 0,
          max: 600
        });
      } else if ('tablet' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
          value: undefined !== numberMinHeight && undefined !== numberMinHeight[1] ? numberMinHeight[1] : '',
          onChange: value => setAttributes({
            numberMinHeight: [undefined !== numberMinHeight && undefined !== numberMinHeight[0] ? numberMinHeight[0] : '', value, undefined !== numberMinHeight && undefined !== numberMinHeight[2] ? numberMinHeight[2] : '']
          }),
          step: 1,
          min: 0,
          max: 600
        });
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
          value: undefined !== numberMinHeight && undefined !== numberMinHeight[0] ? numberMinHeight[0] : '',
          onChange: value => setAttributes({
            numberMinHeight: [value, undefined !== numberMinHeight && undefined !== numberMinHeight[1] ? numberMinHeight[1] : '', undefined !== numberMinHeight && undefined !== numberMinHeight[2] ? numberMinHeight[2] : '']
          }),
          step: 1,
          min: 0,
          max: 600
        });
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.TypographyControls, {
    fontGroup: 'number',
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
    letterSpacing: numberFont[0].letterSpacing,
    onLetterSpacing: value => saveNumberFont({
      letterSpacing: value
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
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Number Padding', 'kadence-blocks'),
    value: numberPadding,
    control: numberPaddingControl,
    tabletValue: numberTabletPadding,
    mobileValue: numberMobilePadding,
    onChange: value => setAttributes({
      numberPadding: value
    }),
    onChangeTablet: value => setAttributes({
      numberTabletPadding: value
    }),
    onChangeMobile: value => setAttributes({
      numberMobilePadding: value
    }),
    onChangeControl: value => setNumberPaddingControl(value),
    min: 0,
    max: numberPaddingType === 'em' || numberPaddingType === 'rem' ? 12 : 200,
    step: numberPaddingType === 'em' || numberPaddingType === 'rem' ? 0.1 : 1,
    unit: numberPaddingType,
    units: ['px', 'em', 'rem', '%'],
    onUnit: value => setAttributes({
      numberPaddingType: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Number Margin', 'kadence-blocks'),
    value: numberMargin,
    control: numberMarginControl,
    tabletValue: numberTabletMargin,
    mobileValue: numberMobileMargin,
    onChange: value => setAttributes({
      numberMargin: value
    }),
    onChangeTablet: value => setAttributes({
      numberTabletMargin: value
    }),
    onChangeMobile: value => setAttributes({
      numberMobileMargin: value
    }),
    onChangeControl: value => setNumberMarginControl(value),
    min: numberMarginType === 'em' || numberMarginType === 'rem' ? -12 : -200,
    max: numberMarginType === 'em' || numberMarginType === 'rem' ? 12 : 200,
    step: numberMarginType === 'em' || numberMarginType === 'rem' ? 0.1 : 1,
    unit: numberMarginType,
    units: ['px', 'em', 'rem', '%', 'vh'],
    onUnit: value => setAttributes({
      numberMarginType: value
    })
  }))));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Inspector);

/***/ }),

/***/ "./src/blocks/count-up/save.js":
/*!*************************************!*\
  !*** ./src/blocks/count-up/save.js ***!
  \*************************************/
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
 * BLOCK: Kadence Count-Up
 */

/**
 * Import External
 */

/**
 * Internal block libraries
 */


/**
 * Build the count up save
 */

function KadenceCounterUpSave(props) {
  const {
    attributes
  } = props;
  const {
    uniqueID,
    title,
    start,
    end,
    prefix,
    suffix,
    duration,
    separator,
    titleFont,
    displayTitle,
    decimal,
    decimalSpaces
  } = attributes;
  const classes = classnames__WEBPACK_IMPORTED_MODULE_2___default()({
    [`kb-count-up-${uniqueID}`]: uniqueID,
    'kb-count-up': true
  });
  const tagName = titleFont[0].htmlTag && titleFont[0].htmlTag !== 'heading' ? titleFont[0].htmlTag : 'h' + titleFont[0].level;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps.save({
    className: classes
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, blockProps, {
    "data-start": start,
    "data-end": end,
    "data-prefix": prefix,
    "data-suffix": suffix,
    "data-duration": duration,
    "data-separator": separator,
    "data-decimal": decimal ? decimal : undefined,
    "data-decimal-spaces": decimal ? decimalSpaces : undefined
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: 'kb-count-up-process kb-count-up-number'
  }), title && displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.Content, {
    tagName: tagName,
    className: 'kb-count-up-title',
    value: title
  }));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KadenceCounterUpSave);

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

/***/ "./node_modules/countup.js/dist/countUp.min.js":
/*!*****************************************************!*\
  !*** ./node_modules/countup.js/dist/countUp.min.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CountUp": () => (/* binding */ CountUp)
/* harmony export */ });
var __assign=undefined&&undefined.__assign||function(){return(__assign=Object.assign||function(t){for(var i,n=1,a=arguments.length;n<a;n++)for(var s in i=arguments[n])Object.prototype.hasOwnProperty.call(i,s)&&(t[s]=i[s]);return t}).apply(this,arguments)},CountUp=function(){function t(t,i,n){var a=this;this.endVal=i,this.options=n,this.version="2.2.0",this.defaults={startVal:0,decimalPlaces:0,duration:2,useEasing:!0,useGrouping:!0,smartEasingThreshold:999,smartEasingAmount:333,separator:",",decimal:".",prefix:"",suffix:"",enableScrollSpy:!1,scrollSpyDelay:200,scrollSpyOnce:!1},this.finalEndVal=null,this.useEasing=!0,this.countDown=!1,this.error="",this.startVal=0,this.paused=!0,this.once=!1,this.count=function(t){a.startTime||(a.startTime=t);var i=t-a.startTime;a.remaining=a.duration-i,a.useEasing?a.countDown?a.frameVal=a.startVal-a.easingFn(i,0,a.startVal-a.endVal,a.duration):a.frameVal=a.easingFn(i,a.startVal,a.endVal-a.startVal,a.duration):a.countDown?a.frameVal=a.startVal-(a.startVal-a.endVal)*(i/a.duration):a.frameVal=a.startVal+(a.endVal-a.startVal)*(i/a.duration),a.countDown?a.frameVal=a.frameVal<a.endVal?a.endVal:a.frameVal:a.frameVal=a.frameVal>a.endVal?a.endVal:a.frameVal,a.frameVal=Number(a.frameVal.toFixed(a.options.decimalPlaces)),a.printValue(a.frameVal),i<a.duration?a.rAF=requestAnimationFrame(a.count):null!==a.finalEndVal?a.update(a.finalEndVal):a.callback&&a.callback()},this.formatNumber=function(t){var i,n,s,e,r=t<0?"-":"";i=Math.abs(t).toFixed(a.options.decimalPlaces);var o=(i+="").split(".");if(n=o[0],s=o.length>1?a.options.decimal+o[1]:"",a.options.useGrouping){e="";for(var l=0,h=n.length;l<h;++l)0!==l&&l%3==0&&(e=a.options.separator+e),e=n[h-l-1]+e;n=e}return a.options.numerals&&a.options.numerals.length&&(n=n.replace(/[0-9]/g,function(t){return a.options.numerals[+t]}),s=s.replace(/[0-9]/g,function(t){return a.options.numerals[+t]})),r+a.options.prefix+n+s+a.options.suffix},this.easeOutExpo=function(t,i,n,a){return n*(1-Math.pow(2,-10*t/a))*1024/1023+i},this.options=__assign(__assign({},this.defaults),n),this.formattingFn=this.options.formattingFn?this.options.formattingFn:this.formatNumber,this.easingFn=this.options.easingFn?this.options.easingFn:this.easeOutExpo,this.startVal=this.validateValue(this.options.startVal),this.frameVal=this.startVal,this.endVal=this.validateValue(i),this.options.decimalPlaces=Math.max(this.options.decimalPlaces),this.resetDuration(),this.options.separator=String(this.options.separator),this.useEasing=this.options.useEasing,""===this.options.separator&&(this.options.useGrouping=!1),this.el="string"==typeof t?document.getElementById(t):t,this.el?this.printValue(this.startVal):this.error="[CountUp] target is null or undefined",void 0!==window&&this.options.enableScrollSpy&&(this.error?console.error(this.error,t):(window.onScrollFns=window.onScrollFns||[],window.onScrollFns.push(function(){return a.handleScroll(a)}),window.onscroll=function(){window.onScrollFns.forEach(function(t){return t()})},this.handleScroll(this)))}return t.prototype.handleScroll=function(t){if(t&&window&&!t.once){var i=window.innerHeight+window.scrollY,n=t.el.offsetTop+t.el.offsetHeight;n<i&&n>window.scrollY&&t.paused?(t.paused=!1,setTimeout(function(){return t.start()},t.options.scrollSpyDelay),t.options.scrollSpyOnce&&(t.once=!0)):window.scrollY>n&&!t.paused&&t.reset()}},t.prototype.determineDirectionAndSmartEasing=function(){var t=this.finalEndVal?this.finalEndVal:this.endVal;this.countDown=this.startVal>t;var i=t-this.startVal;if(Math.abs(i)>this.options.smartEasingThreshold){this.finalEndVal=t;var n=this.countDown?1:-1;this.endVal=t+n*this.options.smartEasingAmount,this.duration=this.duration/2}else this.endVal=t,this.finalEndVal=null;this.finalEndVal?this.useEasing=!1:this.useEasing=this.options.useEasing},t.prototype.start=function(t){this.error||(this.callback=t,this.duration>0?(this.determineDirectionAndSmartEasing(),this.paused=!1,this.rAF=requestAnimationFrame(this.count)):this.printValue(this.endVal))},t.prototype.pauseResume=function(){this.paused?(this.startTime=null,this.duration=this.remaining,this.startVal=this.frameVal,this.determineDirectionAndSmartEasing(),this.rAF=requestAnimationFrame(this.count)):cancelAnimationFrame(this.rAF),this.paused=!this.paused},t.prototype.reset=function(){cancelAnimationFrame(this.rAF),this.paused=!0,this.resetDuration(),this.startVal=this.validateValue(this.options.startVal),this.frameVal=this.startVal,this.printValue(this.startVal)},t.prototype.update=function(t){cancelAnimationFrame(this.rAF),this.startTime=null,this.endVal=this.validateValue(t),this.endVal!==this.frameVal&&(this.startVal=this.frameVal,this.finalEndVal||this.resetDuration(),this.finalEndVal=null,this.determineDirectionAndSmartEasing(),this.rAF=requestAnimationFrame(this.count))},t.prototype.printValue=function(t){var i=this.formattingFn(t);"INPUT"===this.el.tagName?this.el.value=i:"text"===this.el.tagName||"tspan"===this.el.tagName?this.el.textContent=i:this.el.innerHTML=i},t.prototype.ensureNumber=function(t){return"number"==typeof t&&!isNaN(t)},t.prototype.validateValue=function(t){var i=Number(t);return this.ensureNumber(i)?i:(this.error="[CountUp] invalid start or end value: ".concat(t),null)},t.prototype.resetDuration=function(){this.startTime=null,this.duration=1e3*Number(this.options.duration),this.remaining=this.duration},t}();

/***/ }),

/***/ "./node_modules/react-countup/build/index.js":
/*!***************************************************!*\
  !*** ./node_modules/react-countup/build/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var React = __webpack_require__(/*! react */ "react");
var countup_js = __webpack_require__(/*! countup.js */ "./node_modules/countup.js/dist/countUp.min.js");

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
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

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

/**
 * Silence SSR Warnings.
 * Borrowed from Formik v2.1.1, Licensed MIT.
 *
 * https://github.com/formium/formik/blob/9316a864478f8fcd4fa99a0735b1d37afdf507dc/LICENSE
 */

var useIsomorphicLayoutEffect = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Create a stable reference to a callback which is updated after each render is committed.
 * Typed version borrowed from Formik v2.2.1. Licensed MIT.
 *
 * https://github.com/formium/formik/blob/9316a864478f8fcd4fa99a0735b1d37afdf507dc/LICENSE
 */

function useEventCallback(fn) {
  var ref = React.useRef(fn); // we copy a ref to the callback scoped to the current state/props on each render

  useIsomorphicLayoutEffect(function () {
    ref.current = fn;
  });
  return React.useCallback(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return ref.current.apply(void 0, args);
  }, []);
}

var createCountUpInstance = function createCountUpInstance(el, props) {
  var decimal = props.decimal,
      decimals = props.decimals,
      duration = props.duration,
      easingFn = props.easingFn,
      end = props.end,
      formattingFn = props.formattingFn,
      numerals = props.numerals,
      prefix = props.prefix,
      separator = props.separator,
      start = props.start,
      suffix = props.suffix,
      useEasing = props.useEasing,
      enableScrollSpy = props.enableScrollSpy,
      scrollSpyDelay = props.scrollSpyDelay;
  return new countup_js.CountUp(el, end, {
    startVal: start,
    duration: duration,
    decimal: decimal,
    decimalPlaces: decimals,
    easingFn: easingFn,
    formattingFn: formattingFn,
    numerals: numerals,
    separator: separator,
    prefix: prefix,
    suffix: suffix,
    useEasing: useEasing,
    useGrouping: !!separator,
    enableScrollSpy: enableScrollSpy,
    scrollSpyDelay: scrollSpyDelay
  });
};

var _excluded$1 = ["ref", "startOnMount", "enableReinitialize", "delay", "onEnd", "onStart", "onPauseResume", "onReset", "onUpdate"];
var DEFAULTS = {
  decimal: '.',
  delay: null,
  prefix: '',
  suffix: '',
  duration: 2,
  start: 0,
  startOnMount: true,
  enableReinitialize: true
};

var useCountUp = function useCountUp(props) {
  var _useMemo = React.useMemo(function () {
    return _objectSpread2(_objectSpread2({}, DEFAULTS), props);
  }, [props]),
      ref = _useMemo.ref,
      startOnMount = _useMemo.startOnMount,
      enableReinitialize = _useMemo.enableReinitialize,
      delay = _useMemo.delay,
      onEnd = _useMemo.onEnd,
      onStart = _useMemo.onStart,
      onPauseResume = _useMemo.onPauseResume,
      onReset = _useMemo.onReset,
      onUpdate = _useMemo.onUpdate,
      instanceProps = _objectWithoutProperties(_useMemo, _excluded$1);

  var countUpRef = React.useRef();
  var timerRef = React.useRef();
  var isInitializedRef = React.useRef(false);
  var createInstance = useEventCallback(function () {
    return createCountUpInstance(typeof ref === 'string' ? ref : ref.current, instanceProps);
  });
  var getCountUp = useEventCallback(function (recreate) {
    var countUp = countUpRef.current;

    if (countUp && !recreate) {
      return countUp;
    }

    var newCountUp = createInstance();
    countUpRef.current = newCountUp;
    return newCountUp;
  });
  var start = useEventCallback(function () {
    var run = function run() {
      return getCountUp(true).start(function () {
        onEnd === null || onEnd === void 0 ? void 0 : onEnd({
          pauseResume: pauseResume,
          reset: reset,
          start: restart,
          update: update
        });
      });
    };

    if (delay && delay > 0) {
      timerRef.current = setTimeout(run, delay * 1000);
    } else {
      run();
    }

    onStart === null || onStart === void 0 ? void 0 : onStart({
      pauseResume: pauseResume,
      reset: reset,
      update: update
    });
  });
  var pauseResume = useEventCallback(function () {
    getCountUp().pauseResume();
    onPauseResume === null || onPauseResume === void 0 ? void 0 : onPauseResume({
      reset: reset,
      start: restart,
      update: update
    });
  });
  var reset = useEventCallback(function () {
    timerRef.current && clearTimeout(timerRef.current);
    getCountUp().reset();
    onReset === null || onReset === void 0 ? void 0 : onReset({
      pauseResume: pauseResume,
      start: restart,
      update: update
    });
  });
  var update = useEventCallback(function (newEnd) {
    getCountUp().update(newEnd);
    onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate({
      pauseResume: pauseResume,
      reset: reset,
      start: restart
    });
  });
  var restart = useEventCallback(function () {
    reset();
    start();
  });
  var maybeInitialize = useEventCallback(function (shouldReset) {
    if (startOnMount) {
      if (shouldReset) {
        reset();
      }

      start();
    }
  });
  React.useEffect(function () {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      maybeInitialize();
    } else if (enableReinitialize) {
      maybeInitialize(true);
    }
  }, [enableReinitialize, isInitializedRef, maybeInitialize, delay, props.start, props.suffix, props.prefix, props.duration, props.separator, props.decimals, props.decimal, props.formattingFn]);
  React.useEffect(function () {
    return function () {
      reset();
    };
  }, [reset]);
  return {
    start: restart,
    pauseResume: pauseResume,
    reset: reset,
    update: update,
    getCountUp: getCountUp
  };
};

var _excluded = ["className", "redraw", "containerProps", "children", "style"];

var CountUp = function CountUp(props) {
  var className = props.className,
      redraw = props.redraw,
      containerProps = props.containerProps,
      children = props.children,
      style = props.style,
      useCountUpProps = _objectWithoutProperties(props, _excluded);

  var containerRef = React__default["default"].useRef(null);
  var isInitializedRef = React__default["default"].useRef(false);

  var _useCountUp = useCountUp(_objectSpread2(_objectSpread2({}, useCountUpProps), {}, {
    ref: containerRef,
    startOnMount: typeof children !== 'function' || props.delay === 0,
    // component manually restarts
    enableReinitialize: false
  })),
      start = _useCountUp.start,
      reset = _useCountUp.reset,
      updateCountUp = _useCountUp.update,
      pauseResume = _useCountUp.pauseResume,
      getCountUp = _useCountUp.getCountUp;

  var restart = useEventCallback(function () {
    start();
  });
  var update = useEventCallback(function (end) {
    if (!props.preserveValue) {
      reset();
    }

    updateCountUp(end);
  });
  var initializeOnMount = useEventCallback(function () {
    if (typeof props.children === 'function') {
      // Warn when user didn't use containerRef at all
      if (!(containerRef.current instanceof Element)) {
        console.error("Couldn't find attached element to hook the CountUp instance into! Try to attach \"containerRef\" from the render prop to a an Element, eg. <span ref={containerRef} />.");
        return;
      }
    } // unlike the hook, the CountUp component initializes on mount


    getCountUp();
  });
  React.useEffect(function () {
    initializeOnMount();
  }, [initializeOnMount]);
  React.useEffect(function () {
    if (isInitializedRef.current) {
      update(props.end);
    }
  }, [props.end, update]);
  var redrawDependencies = redraw && props; // if props.redraw, call this effect on every props change

  React.useEffect(function () {
    if (redraw && isInitializedRef.current) {
      restart();
    }
  }, [restart, redraw, redrawDependencies]); // if not props.redraw, call this effect only when certain props are changed

  React.useEffect(function () {
    if (!redraw && isInitializedRef.current) {
      restart();
    }
  }, [restart, redraw, props.start, props.suffix, props.prefix, props.duration, props.separator, props.decimals, props.decimal, props.className, props.formattingFn]);
  React.useEffect(function () {
    isInitializedRef.current = true;
  }, []);

  if (typeof children === 'function') {
    // TypeScript forces functional components to return JSX.Element | null.
    return children({
      countUpRef: containerRef,
      start: start,
      reset: reset,
      update: updateCountUp,
      pauseResume: pauseResume,
      getCountUp: getCountUp
    });
  }

  return /*#__PURE__*/React__default["default"].createElement("span", _extends({
    className: className,
    ref: containerRef,
    style: style
  }, containerProps), props.start ? getCountUp().formattingFn(props.start) : '');
};

exports["default"] = CountUp;
exports.useCountUp = useCountUp;


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

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

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

/***/ "./src/blocks/count-up/block.json":
/*!****************************************!*\
  !*** ./src/blocks/count-up/block.json ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Count Up","name":"kadence/countup","category":"kadence-blocks","description":"","attributes":{"uniqueID":{"type":"string","default":""},"title":{"type":"string","default":""},"displayTitle":{"type":"bool","default":true},"titleFont":{"type":"array","default":[{"level":4,"htmlTag":"div","size":["","",""],"sizeType":"px","lineHeight":["","",""],"lineType":"px","letterSpacing":"","textTransform":"","family":"","google":false,"style":"","weight":"","variant":"","subset":"","loadGoogle":true}]},"titlePaddingType":{"type":"string","default":"px"},"titlePadding":{"type":"array","default":["","","",""]},"titleTabletPadding":{"type":"array","default":["","","",""]},"titleMobilePadding":{"type":"array","default":["","","",""]},"titleMarginType":{"type":"string","default":"px"},"titleMargin":{"type":"array","default":["","","",""]},"titleTabletMargin":{"type":"array","default":["","","",""]},"titleMobileMargin":{"type":"array","default":["","","",""]},"titleAlign":{"type":"array","default":["","",""]},"titleColor":{"type":"string","default":""},"titleHoverColor":{"type":"string","default":""},"titleMinHeight":{"type":"array","default":["","",""]},"numberFont":{"type":"array","default":[{"size":["50","",""],"sizeType":"px","lineHeight":["","",""],"lineType":"px","letterSpacing":"","textTransform":"","family":"","google":false,"style":"","weight":"","variant":"","subset":"","loadGoogle":true}]},"numberPaddingType":{"type":"string","default":"px"},"numberPadding":{"type":"array","default":["","","",""]},"numberTabletPadding":{"type":"array","default":["","","",""]},"numberMobilePadding":{"type":"array","default":["","","",""]},"numberMarginType":{"type":"string","default":"px"},"numberMargin":{"type":"array","default":["","","",""]},"numberTabletMargin":{"type":"array","default":["","","",""]},"numberMobileMargin":{"type":"array","default":["","","",""]},"numberAlign":{"type":"array","default":["","",""]},"numberColor":{"type":"string","default":""},"numberHoverColor":{"type":"string","default":""},"numberMinHeight":{"type":"array","default":["","",""]},"start":{"type":"number","default":0},"end":{"type":"number","default":100},"prefix":{"type":"string","default":""},"suffix":{"type":"string","default":""},"duration":{"type":"number","default":2.5},"separator":{"type":"string","default":""},"decimal":{"type":"string","default":""},"decimalSpaces":{"type":"number","default":2}}}');

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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************!*\
  !*** ./src/blocks/count-up/block.js ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/count-up/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./save */ "./src/blocks/count-up/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/blocks/count-up/block.json");
/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./deprecated */ "./src/blocks/count-up/deprecated.js");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/count-up/editor.scss");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__);
/**
 * BLOCK: Kadence Count Up
 */

/**
 * Import Icons
 */

/**
 * Import edit
 */


/**
 * Import save
 */


/**
 * Import metadata
 */


/**
 * Import deprecated
 */


/**
 * Import Css
 */


/**
 * Internal block libraries
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

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.registerBlockType)('kadence/countup', { ..._block_json__WEBPACK_IMPORTED_MODULE_3__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Count Up', 'kadence-blocks'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('An animated count up or down to a specific value.', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('count down', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('count up', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('counter', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('number', 'kadence-blocks'), 'KB'],
  icon: {
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_0__.countUpIcon
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_2__["default"],
  deprecated: _deprecated__WEBPACK_IMPORTED_MODULE_4__["default"]
});
})();

(this.kadence = this.kadence || {})["blocks-count-up"] = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=blocks-count-up.js.map