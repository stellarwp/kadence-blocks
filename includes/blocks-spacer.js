/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/spacer/editor.scss":
/*!***************************************!*\
  !*** ./src/blocks/spacer/editor.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/spacer/deprecated.js":
/*!*****************************************!*\
  !*** ./src/blocks/spacer/deprecated.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _svg_pattern__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./svg-pattern */ "./src/blocks/spacer/svg-pattern.js");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);


/**
 * BLOCK: Spacer
 *
 * Depreciated.
 */




/**
 * Internal block libraries
 */


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([{
  attributes: {
    blockAlignment: {
      type: 'string',
      default: 'center'
    },
    hAlign: {
      type: 'string',
      default: 'center'
    },
    spacerHeight: {
      type: 'number',
      default: 60
    },
    spacerHeightUnits: {
      type: 'string',
      default: 'px'
    },
    tabletSpacerHeight: {
      type: 'number',
      default: ''
    },
    mobileSpacerHeight: {
      type: 'number',
      default: ''
    },
    dividerEnable: {
      type: 'boolean',
      default: true
    },
    dividerStyle: {
      type: 'string',
      default: 'solid'
    },
    dividerOpacity: {
      type: 'number',
      default: 100
    },
    dividerColor: {
      type: 'string',
      default: '#eee'
    },
    dividerWidth: {
      type: 'number',
      default: 80
    },
    dividerHeight: {
      type: 'number',
      default: 1
    },
    uniqueID: {
      type: 'string',
      default: ''
    },
    rotate: {
      type: 'number',
      default: 40
    },
    strokeWidth: {
      type: 'number',
      default: 4
    },
    strokeGap: {
      type: 'number',
      default: 5
    },
    tabletHAlign: {
      type: 'string',
      default: ''
    },
    mobileHAlign: {
      type: 'string',
      default: ''
    },
    vsdesk: {
      type: 'bool',
      default: false
    },
    vstablet: {
      type: 'bool',
      default: false
    },
    vsmobile: {
      type: 'bool',
      default: false
    }
  },
  save: _ref => {
    let {
      attributes
    } = _ref;
    const {
      blockAlignment,
      spacerHeight,
      dividerEnable,
      dividerStyle,
      hAlign,
      dividerColor,
      dividerOpacity,
      dividerHeight,
      dividerWidth,
      uniqueID,
      spacerHeightUnits,
      rotate,
      strokeWidth,
      strokeGap,
      tabletHAlign,
      mobileHAlign,
      vsdesk,
      vstablet,
      vsmobile
    } = attributes;
    let alp;

    if (dividerOpacity < 10) {
      alp = '0.0' + dividerOpacity;
    } else if (dividerOpacity >= 100) {
      alp = '1';
    } else {
      alp = '0.' + dividerOpacity;
    }

    const dividerBorderColor = !dividerColor ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)('#eeeeee', alp) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(dividerColor, alp);
    const classes = classnames__WEBPACK_IMPORTED_MODULE_3___default()({
      [`align${blockAlignment ? blockAlignment : 'none'}`]: true,
      [`kt-block-spacer-${uniqueID}`]: uniqueID,
      'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
      'kvs-md-false': vstablet !== 'undefined' && vstablet,
      'kvs-sm-false': vsmobile !== 'undefined' && vsmobile
    });
    const innerSpacerClasses = classnames__WEBPACK_IMPORTED_MODULE_3___default()({
      'kt-block-spacer': true,
      [`kt-block-spacer-halign-${hAlign}`]: hAlign,
      [`kt-block-spacer-thalign-${tabletHAlign}`]: tabletHAlign,
      [`kt-block-spacer-malign-${mobileHAlign}`]: mobileHAlign
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classes
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: innerSpacerClasses,
      style: {
        height: spacerHeight + (spacerHeightUnits ? spacerHeightUnits : 'px')
      }
    }, dividerEnable && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, dividerStyle === 'stripe' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "kt-divider-stripe",
      style: {
        height: (dividerHeight < 10 ? 10 : dividerHeight) + 'px',
        width: dividerWidth + '%'
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_svg_pattern__WEBPACK_IMPORTED_MODULE_1__["default"], {
      uniqueID: uniqueID,
      color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(dividerColor),
      opacity: dividerOpacity,
      rotate: rotate,
      strokeWidth: strokeWidth,
      strokeGap: strokeGap
    })), dividerStyle !== 'stripe' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("hr", {
      className: "kt-divider",
      style: {
        borderTopColor: dividerBorderColor,
        borderTopWidth: dividerHeight + 'px',
        width: dividerWidth + '%',
        borderTopStyle: dividerStyle
      }
    }))));
  }
}, {
  attributes: {
    blockAlignment: {
      type: 'string',
      default: 'center'
    },
    hAlign: {
      type: 'string',
      default: 'center'
    },
    spacerHeight: {
      type: 'number',
      default: 60
    },
    spacerHeightUnits: {
      type: 'string',
      default: 'px'
    },
    tabletSpacerHeight: {
      type: 'number',
      default: ''
    },
    mobileSpacerHeight: {
      type: 'number',
      default: ''
    },
    dividerEnable: {
      type: 'boolean',
      default: true
    },
    dividerStyle: {
      type: 'string',
      default: 'solid'
    },
    dividerOpacity: {
      type: 'number',
      default: 100
    },
    dividerColor: {
      type: 'string',
      default: '#eee'
    },
    dividerWidth: {
      type: 'number',
      default: 80
    },
    dividerHeight: {
      type: 'number',
      default: 1
    },
    uniqueID: {
      type: 'string',
      default: ''
    },
    rotate: {
      type: 'number',
      default: 40
    },
    strokeWidth: {
      type: 'number',
      default: 4
    },
    strokeGap: {
      type: 'number',
      default: 5
    },
    tabletHAlign: {
      type: 'string',
      default: ''
    },
    mobileHAlign: {
      type: 'string',
      default: ''
    },
    vsdesk: {
      type: 'bool',
      default: false
    },
    vstablet: {
      type: 'bool',
      default: false
    },
    vsmobile: {
      type: 'bool',
      default: false
    }
  },
  save: _ref2 => {
    let {
      attributes
    } = _ref2;
    const {
      blockAlignment,
      spacerHeight,
      dividerEnable,
      dividerStyle,
      hAlign,
      dividerColor,
      dividerOpacity,
      dividerHeight,
      dividerWidth,
      uniqueID,
      spacerHeightUnits,
      rotate,
      strokeWidth,
      strokeGap,
      tabletHAlign,
      mobileHAlign,
      vsdesk,
      vstablet,
      vsmobile
    } = attributes;
    let alp;

    if (dividerOpacity < 10) {
      alp = '0.0' + dividerOpacity;
    } else if (dividerOpacity >= 100) {
      alp = '1';
    } else {
      alp = '0.' + dividerOpacity;
    }

    const dividerBorderColor = !dividerColor ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.DeprecatedKadenceColorOutput)('#eeeeee', alp) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.DeprecatedKadenceColorOutput)(dividerColor, alp);

    const getDataUri = () => {
      let svgStringPre = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.renderToString)((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_svg_pattern__WEBPACK_IMPORTED_MODULE_1__["default"], {
        uniqueID: uniqueID,
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.DeprecatedKadenceColorOutput)(dividerColor),
        opacity: dividerOpacity,
        rotate: rotate,
        strokeWidth: strokeWidth,
        strokeGap: strokeGap
      }));
      svgStringPre = svgStringPre.replace('patterntransform', 'patternTransform');
      svgStringPre = svgStringPre.replace('patternunits', 'patternUnits');
      const dataUri = `url("data:image/svg+xml;base64,${btoa(svgStringPre)}")`;
      return dataUri;
    };

    const classes = classnames__WEBPACK_IMPORTED_MODULE_3___default()({
      [`align${blockAlignment ? blockAlignment : 'none'}`]: true,
      [`kt-block-spacer-${uniqueID}`]: uniqueID,
      'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
      'kvs-md-false': vstablet !== 'undefined' && vstablet,
      'kvs-sm-false': vsmobile !== 'undefined' && vsmobile
    });
    const innerSpacerClasses = classnames__WEBPACK_IMPORTED_MODULE_3___default()({
      'kt-block-spacer': true,
      [`kt-block-spacer-halign-${hAlign}`]: hAlign,
      [`kt-block-spacer-thalign-${tabletHAlign}`]: tabletHAlign,
      [`kt-block-spacer-malign-${mobileHAlign}`]: mobileHAlign
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classes
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: innerSpacerClasses,
      style: {
        height: spacerHeight + (spacerHeightUnits ? spacerHeightUnits : 'px')
      }
    }, dividerEnable && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, dividerStyle === 'stripe' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "kt-divider-stripe",
      style: {
        height: (dividerHeight < 10 ? 10 : dividerHeight) + 'px',
        width: dividerWidth + '%'
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_svg_pattern__WEBPACK_IMPORTED_MODULE_1__["default"], {
      uniqueID: uniqueID,
      color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.DeprecatedKadenceColorOutput)(dividerColor),
      opacity: dividerOpacity,
      rotate: rotate,
      strokeWidth: strokeWidth,
      strokeGap: strokeGap
    })), dividerStyle !== 'stripe' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("hr", {
      className: "kt-divider",
      style: {
        borderTopColor: dividerBorderColor,
        borderTopWidth: dividerHeight + 'px',
        width: dividerWidth + '%',
        borderTopStyle: dividerStyle
      }
    }))));
  }
}, {
  attributes: {
    blockAlignment: {
      type: 'string',
      default: 'center'
    },
    hAlign: {
      type: 'string',
      default: 'center'
    },
    spacerHeight: {
      type: 'number',
      default: 60
    },
    spacerHeightUnits: {
      type: 'string',
      default: 'px'
    },
    tabletSpacerHeight: {
      type: 'number',
      default: ''
    },
    mobileSpacerHeight: {
      type: 'number',
      default: ''
    },
    dividerEnable: {
      type: 'boolean',
      default: true
    },
    dividerStyle: {
      type: 'string',
      default: 'solid'
    },
    dividerOpacity: {
      type: 'number',
      default: 100
    },
    dividerColor: {
      type: 'string',
      default: '#eee'
    },
    dividerWidth: {
      type: 'number',
      default: 80
    },
    dividerHeight: {
      type: 'number',
      default: 1
    },
    uniqueID: {
      type: 'string',
      default: ''
    }
  },
  save: _ref3 => {
    let {
      attributes
    } = _ref3;
    const {
      blockAlignment,
      spacerHeight,
      dividerEnable,
      dividerStyle,
      hAlign,
      dividerHeight,
      dividerWidth,
      uniqueID,
      spacerHeightUnits
    } = attributes;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `align${blockAlignment ? blockAlignment : 'none'} kt-block-spacer-${uniqueID}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-block-spacer kt-block-spacer-halign-${hAlign}`,
      style: {
        height: spacerHeight + (spacerHeightUnits ? spacerHeightUnits : 'px')
      }
    }, dividerEnable && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("hr", {
      className: "kt-divider",
      style: {
        borderTopWidth: dividerHeight + 'px',
        width: dividerWidth + '%',
        borderTopStyle: dividerStyle
      }
    })));
  }
}, {
  attributes: {
    blockAlignment: {
      type: 'string',
      default: 'center'
    },
    hAlign: {
      type: 'string',
      default: 'center'
    },
    spacerHeight: {
      type: 'number',
      default: '60'
    },
    dividerEnable: {
      type: 'boolean',
      default: true
    },
    dividerStyle: {
      type: 'string',
      default: 'solid'
    },
    dividerOpacity: {
      type: 'number',
      default: '100'
    },
    dividerColor: {
      type: 'string',
      default: '#eee'
    },
    dividerWidth: {
      type: 'number',
      default: '80'
    },
    dividerHeight: {
      type: 'number',
      default: '1'
    },
    uniqueID: {
      type: 'string',
      default: ''
    }
  },
  save: _ref4 => {
    let {
      attributes
    } = _ref4;
    const {
      blockAlignment,
      spacerHeight,
      dividerEnable,
      dividerStyle,
      hAlign,
      dividerColor,
      dividerOpacity,
      dividerHeight,
      dividerWidth
    } = attributes;
    const dividerBorderColor = !dividerColor ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.DeprecatedKadenceColorOutput)('#eeeeee', dividerOpacity) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.DeprecatedKadenceColorOutput)(dividerColor, dividerOpacity);
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `align${blockAlignment}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-block-spacer kt-block-spacer-halign-${hAlign}`,
      style: {
        height: spacerHeight + 'px'
      }
    }, dividerEnable && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("hr", {
      className: "kt-divider",
      style: {
        borderTopColor: dividerBorderColor,
        borderTopWidth: dividerHeight + 'px',
        width: dividerWidth + '%',
        borderTopStyle: dividerStyle
      }
    })));
  }
}, {
  attributes: {
    blockAlignment: {
      type: 'string',
      default: 'center'
    },
    hAlign: {
      type: 'string',
      default: 'center'
    },
    spacerHeight: {
      type: 'number',
      default: '60'
    },
    dividerEnable: {
      type: 'boolean',
      default: true
    },
    dividerStyle: {
      type: 'string',
      default: 'solid'
    },
    dividerOpacity: {
      type: 'number',
      default: '100'
    },
    dividerColor: {
      type: 'string',
      default: '#eee'
    },
    dividerWidth: {
      type: 'number',
      default: '80'
    },
    dividerHeight: {
      type: 'number',
      default: '1'
    }
  },
  save: _ref5 => {
    let {
      attributes
    } = _ref5;
    const {
      blockAlignment,
      spacerHeight,
      dividerEnable,
      dividerStyle,
      dividerColor,
      dividerOpacity,
      dividerHeight,
      dividerWidth
    } = attributes;
    const dividerBorderColor = !dividerColor ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.DeprecatedKadenceColorOutput)('#eee', dividerOpacity) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.DeprecatedKadenceColorOutput)(dividerColor, dividerOpacity);
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `align${blockAlignment}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-block-spacer",
      style: {
        height: spacerHeight + 'px'
      }
    }, dividerEnable && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("hr", {
      className: "kt-divider",
      style: {
        borderTopColor: dividerBorderColor,
        borderTopWidth: dividerHeight + 'px',
        width: dividerWidth + '%',
        borderTopStyle: dividerStyle
      }
    })));
  }
}]);

/***/ }),

/***/ "./src/blocks/spacer/edit.js":
/*!***********************************!*\
  !*** ./src/blocks/spacer/edit.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _svg_pattern__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./svg-pattern */ "./src/blocks/spacer/svg-pattern.js");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/spacer/editor.scss");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_9__);


/**
 * BLOCK: Kadence Spacer
 *
 * Registering a basic block with Gutenberg.
 */



/**
 * Import Css
 */


/**
 * Internal block libraries
 */







const ktspacerUniqueIDs = [];
/**
 * Build the spacer edit
 */

function KadenceSpacerDivider(_ref) {
  let {
    attributes,
    className,
    clientId,
    setAttributes,
    toggleSelection,
    getPreviewDevice
  } = _ref;
  const {
    blockAlignment,
    spacerHeight,
    tabletSpacerHeight,
    mobileSpacerHeight,
    dividerEnable,
    dividerStyle,
    dividerColor,
    dividerOpacity,
    dividerHeight,
    dividerWidth,
    hAlign,
    uniqueID,
    spacerHeightUnits,
    rotate,
    strokeWidth,
    strokeGap,
    mobileHAlign,
    tabletHAlign,
    dividerWidthUnits,
    tabletDividerWidth,
    mobileDividerWidth,
    tabletDividerHeight,
    mobileDividerHeight,
    vsdesk,
    vstablet,
    vsmobile
  } = attributes;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!uniqueID) {
      const oldBlockConfig = kadence_blocks_params.config && kadence_blocks_params.config['kadence/spacer'] ? kadence_blocks_params.config['kadence/spacer'] : undefined;
      const blockConfigObject = kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : [];

      if (blockConfigObject['kadence/spacer'] !== undefined && typeof blockConfigObject['kadence/spacer'] === 'object') {
        Object.keys(blockConfigObject['kadence/spacer']).map(attribute => {
          attributes[attribute] = blockConfigObject['kadence/spacer'][attribute];
        });
      } else if (oldBlockConfig !== undefined && typeof oldBlockConfig === 'object') {
        Object.keys(oldBlockConfig).map(attribute => {
          attributes[attribute] = oldBlockConfig[attribute];
        });
      }

      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      ktspacerUniqueIDs.push('_' + clientId.substr(2, 9));
    } else if (ktspacerUniqueIDs.includes(uniqueID)) {
      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      ktspacerUniqueIDs.push('_' + clientId.substr(2, 9));
    } else {
      ktspacerUniqueIDs.push(uniqueID);
    }
  }, []);
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('general');
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.useBlockProps)({
    className: className,
    style: {
      color: 'blue'
    }
  });
  let alp;

  if (dividerOpacity < 10) {
    alp = '0.0' + dividerOpacity;
  } else if (dividerOpacity >= 100) {
    alp = '1';
  } else {
    alp = '0.' + dividerOpacity;
  }

  const editorDocument = document.querySelector('iframe[name="editor-canvas"]')?.contentWindow.document || document;
  const dividerBorderColor = !dividerColor ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)('#eeeeee', alp) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(dividerColor, alp);
  const previewHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, '' !== spacerHeight ? spacerHeight : 60, '' !== tabletSpacerHeight ? tabletSpacerHeight : '', '' !== mobileSpacerHeight ? mobileSpacerHeight : '');
  const previewHAlign = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, '' !== hAlign ? hAlign : '', '' !== tabletHAlign ? tabletHAlign : '', '' !== mobileHAlign ? mobileHAlign : '');
  const minD = dividerStyle !== 'stripe' ? 1 : 10;
  const maxD = dividerStyle !== 'stripe' ? 400 : 60;
  const previewDividerHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, '' !== dividerHeight ? dividerHeight : 1, '' !== tabletDividerHeight ? tabletDividerHeight : '', '' !== mobileDividerHeight ? mobileDividerHeight : '');
  const previewDividerWidth = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.getPreviewSize)(getPreviewDevice, '' !== dividerWidth ? dividerWidth : 1, '' !== tabletDividerWidth ? tabletDividerWidth : '', '' !== mobileDividerWidth ? mobileDividerWidth : '');
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.showSettings)('spacerDivider', 'kadence/spacer') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.BlockControls, {
    key: "controls"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.BlockAlignmentToolbar, {
    value: blockAlignment,
    controls: ['center', 'wide', 'full'],
    onChange: value => setAttributes({
      blockAlignment: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.AlignmentToolbar, {
    value: hAlign,
    onChange: value => setAttributes({
      hAlign: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.InspectorControlTabs, {
    panelName: 'spacer',
    allowedTabs: ['general', 'advanced'],
    setActiveTab: value => setActiveTab(value),
    activeTab: activeTab
  }), activeTab === 'general' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Spacer Settings', 'kadence-blocks'),
    initialOpen: true,
    panelName: 'kb-spacer-settings'
  }, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.showSettings)('spacerHeight', 'kadence/spacer') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Height', 'kadence-blocks'),
    value: spacerHeight,
    onChange: value => setAttributes({
      spacerHeight: value
    }),
    tabletValue: tabletSpacerHeight ? tabletSpacerHeight : '',
    onChangeTablet: value => setAttributes({
      tabletSpacerHeight: value
    }),
    mobileValue: mobileSpacerHeight ? mobileSpacerHeight : '',
    onChangeMobile: value => setAttributes({
      mobileSpacerHeight: value
    }),
    min: 6,
    max: 600,
    step: 1,
    unit: spacerHeightUnits,
    onUnit: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.showSettings)('spacerHeightUnits', 'kadence/spacer') ? value => setAttributes({
      spacerHeightUnits: value
    }) : false,
    units: ['px', 'vh']
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Divider Settings', 'kadence-blocks'),
    initialOpen: true,
    panelName: 'kb-divider-settings'
  }, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.showSettings)('dividerToggle', 'kadence/spacer') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Enable Divider', 'kadence-blocks'),
    checked: dividerEnable,
    onChange: value => setAttributes({
      dividerEnable: value
    })
  }), dividerEnable && (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.showSettings)('dividerStyles', 'kadence/spacer') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.ResponsiveAlignControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Alignment', 'kadence-blocks'),
    value: hAlign ? hAlign : '',
    mobileValue: mobileHAlign ? mobileHAlign : '',
    tabletValue: tabletHAlign ? tabletHAlign : '',
    onChange: nextAlign => setAttributes({
      hAlign: nextAlign
    }),
    onChangeTablet: nextAlign => setAttributes({
      tabletHAlign: nextAlign
    }),
    onChangeMobile: nextAlign => setAttributes({
      mobileHAlign: nextAlign
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Divider Style', 'kadence-blocks'),
    value: dividerStyle,
    options: [{
      value: 'solid',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Solid', 'kadence-blocks')
    }, {
      value: 'dashed',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Dashed', 'kadence-blocks')
    }, {
      value: 'dotted',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Dotted', 'kadence-blocks')
    }, {
      value: 'stripe',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Stripe', 'kadence-blocks')
    }],
    onChange: value => setAttributes({
      dividerStyle: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Divider Color', 'kadence-blocks'),
    value: dividerColor ? dividerColor : '',
    default: '',
    opacityValue: dividerOpacity,
    onChange: value => setAttributes({
      dividerColor: value
    }),
    onOpacityChange: value => setAttributes({
      dividerOpacity: value
    }),
    opacityUnit: 100
  }), 'stripe' === dividerStyle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Stripe Angle', 'kadence-blocks'),
    value: rotate,
    onChange: value => setAttributes({
      rotate: value
    }),
    min: 0,
    max: 135
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Stripe Width', 'kadence-blocks'),
    value: strokeWidth,
    onChange: value => setAttributes({
      strokeWidth: value
    }),
    min: 1,
    max: 30
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Stripe Gap', 'kadence-blocks'),
    value: strokeGap,
    onChange: value => setAttributes({
      strokeGap: value
    }),
    min: 1,
    max: 30
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Divider Height', 'kadence-blocks'),
    value: dividerHeight,
    onChange: value => setAttributes({
      dividerHeight: value
    }),
    tabletValue: tabletDividerHeight ? tabletDividerHeight : '',
    onChangeTablet: value => setAttributes({
      tabletDividerHeight: value
    }),
    mobileValue: mobileDividerHeight ? mobileDividerHeight : '',
    onChangeMobile: value => setAttributes({
      mobileDividerHeight: value
    }),
    min: minD,
    max: maxD,
    step: 1,
    unit: 'px'
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Divider Width', 'kadence-blocks'),
    value: dividerWidth,
    onChange: value => setAttributes({
      dividerWidth: value
    }),
    tabletValue: tabletDividerWidth ? tabletDividerWidth : '',
    onChangeTablet: value => setAttributes({
      tabletDividerWidth: value
    }),
    mobileValue: mobileDividerWidth ? mobileDividerWidth : '',
    onChangeMobile: value => setAttributes({
      mobileDividerWidth: value
    }),
    min: 0,
    max: dividerWidthUnits == 'px' ? 3000 : 100,
    step: 1,
    unit: dividerWidthUnits,
    onUnit: value => setAttributes({
      dividerWidthUnits: value
    }),
    units: ['px', '%']
  })))), activeTab === 'advanced' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Visibility Settings', 'kadence-blocks'),
    panelName: 'kb-visibility-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Hide on Desktop', 'kadence-blocks'),
    checked: undefined !== vsdesk ? vsdesk : false,
    onChange: value => setAttributes({
      vsdesk: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Hide on Tablet', 'kadence-blocks'),
    checked: undefined !== vstablet ? vstablet : false,
    onChange: value => setAttributes({
      vstablet: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Hide on Mobile', 'kadence-blocks'),
    checked: undefined !== vsmobile ? vsmobile : false,
    onChange: value => setAttributes({
      vsmobile: value
    })
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `kt-block-spacer kt-block-spacer-halign-${previewHAlign}`
  }, dividerEnable && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, dividerStyle === 'stripe' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "kt-divider-stripe",
    style: {
      height: (previewDividerHeight < 10 ? 10 : previewDividerHeight) + 'px',
      width: previewDividerWidth + (dividerWidthUnits ? dividerWidthUnits : '%')
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_svg_pattern__WEBPACK_IMPORTED_MODULE_1__["default"], {
    uniqueID: uniqueID,
    color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(dividerColor),
    opacity: dividerOpacity,
    rotate: rotate,
    strokeWidth: strokeWidth,
    strokeGap: strokeGap
  })), dividerStyle !== 'stripe' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("hr", {
    className: "kt-divider",
    style: {
      borderTopColor: dividerBorderColor,
      borderTopWidth: previewDividerHeight + 'px',
      width: previewDividerWidth + (dividerWidthUnits ? dividerWidthUnits : '%'),
      borderTopStyle: dividerStyle
    }
  })), spacerHeightUnits && 'vh' === spacerHeightUnits && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "kt-spacer-height-preview",
    style: {
      height: spacerHeight + (spacerHeightUnits ? spacerHeightUnits : 'px')
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    id: `spacing-height-${uniqueID}`
  }, spacerHeight + (spacerHeightUnits ? spacerHeightUnits : 'px'))), 'vh' !== spacerHeightUnits && (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.showSettings)('spacerDivider', 'kadence/spacer') && (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.showSettings)('spacerHeight', 'kadence/spacer') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.ResizableBox, {
    size: {
      height: previewHeight
    },
    minHeight: "20",
    handleClasses: {
      top: 'kadence-spacer__resize-handler-top',
      bottom: 'kadence-spacer__resize-handler-bottom'
    },
    enable: {
      top: false,
      right: false,
      bottom: true,
      left: false,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
      topLeft: false
    },
    onResize: (event, direction, elt, delta) => {
      editorDocument.getElementById('spacing-height-' + (uniqueID ? uniqueID : 'no-unique')).innerHTML = parseInt(previewHeight + delta.height, 10) + (spacerHeightUnits ? spacerHeightUnits : 'px');
    },
    onResizeStop: (event, direction, elt, delta) => {
      toggleSelection(true);

      if ('Mobile' === getPreviewDevice) {
        setAttributes({
          mobileSpacerHeight: parseInt(previewHeight + delta.height, 10)
        });
      } else if ('Tablet' === getPreviewDevice) {
        setAttributes({
          tabletSpacerHeight: parseInt(previewHeight + delta.height, 10)
        });
      } else {
        setAttributes({
          spacerHeight: parseInt(previewHeight + delta.height, 10)
        });
      }
    },
    onResizeStart: () => {
      toggleSelection(false);
    }
  }, uniqueID && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "kt-spacer-height-preview"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    id: `spacing-height-${uniqueID}`
  }, previewHeight + (spacerHeightUnits ? spacerHeightUnits : 'px')))), 'vh' !== spacerHeightUnits && (!(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.showSettings)('spacerDivider', 'kadence/spacer') || !(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.showSettings)('spacerHeight', 'kadence/spacer')) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "kt-spacer-height-preview",
    style: {
      height: previewHeight + (spacerHeightUnits ? spacerHeightUnits : 'px')
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    id: `spacing-height-${uniqueID}`
  }, previewHeight + (spacerHeightUnits ? spacerHeightUnits : 'px')))));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_9__.compose)([(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_8__.withSelect)(select => {
  return {
    getPreviewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
    getUniqueIDs: select('kadenceblocks/data').getUniqueIDs()
  };
}), (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_8__.withDispatch)(dispatch => ({
  addUniqueID: (value, clientID) => dispatch('kadenceblocks/data').addUniqueID(value, clientID)
}))])(KadenceSpacerDivider));

/***/ }),

/***/ "./src/blocks/spacer/save.js":
/*!***********************************!*\
  !*** ./src/blocks/spacer/save.js ***!
  \***********************************/
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
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _svg_pattern__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./svg-pattern */ "./src/blocks/spacer/svg-pattern.js");


/**
 * BLOCK: Kadence Spacer
 */

/**
 * External dependencies
 */





function Save(_ref) {
  let {
    attributes
  } = _ref;
  const {
    blockAlignment,
    dividerEnable,
    dividerStyle,
    hAlign,
    dividerColor,
    dividerOpacity,
    uniqueID,
    rotate,
    strokeWidth,
    strokeGap,
    tabletHAlign,
    mobileHAlign,
    vsdesk,
    vstablet,
    vsmobile
  } = attributes;
  const innerSpacerClasses = classnames__WEBPACK_IMPORTED_MODULE_2___default()({
    'kt-block-spacer': true,
    [`kt-block-spacer-halign-${hAlign}`]: hAlign,
    [`kt-block-spacer-thalign-${tabletHAlign}`]: tabletHAlign,
    [`kt-block-spacer-malign-${mobileHAlign}`]: mobileHAlign
  });
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()({
      [`align${blockAlignment ? blockAlignment : 'none'}`]: true,
      [`kt-block-spacer-${uniqueID}`]: uniqueID,
      'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
      'kvs-md-false': vstablet !== 'undefined' && vstablet,
      'kvs-sm-false': vsmobile !== 'undefined' && vsmobile
    })
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: innerSpacerClasses
  }, dividerEnable && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, dividerStyle === 'stripe' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "kt-divider-stripe"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_svg_pattern__WEBPACK_IMPORTED_MODULE_4__["default"], {
    uniqueID: uniqueID,
    color: (0,_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(dividerColor),
    opacity: dividerOpacity,
    rotate: rotate,
    strokeWidth: strokeWidth,
    strokeGap: strokeGap
  })), dividerStyle !== 'stripe' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("hr", {
    className: "kt-divider"
  }))));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Save);

/***/ }),

/***/ "./src/blocks/spacer/svg-pattern.js":
/*!******************************************!*\
  !*** ./src/blocks/spacer/svg-pattern.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

const {
  Component
} = wp.element;

class SvgPattern extends Component {
  render() {
    const {
      uniqueID = 'a',
      color = '#eeeeee',
      rotate = 40,
      strokeWidth = 9,
      strokeGap = 9,
      opacity = 1
    } = this.props;
    const gap = strokeWidth / 2 + strokeGap;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "100%",
      height: "100%",
      className: "kb-pattern-svg-divider kb-stripes-svg"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("pattern", {
      id: 'pat' + uniqueID,
      width: gap,
      height: gap,
      patternTransform: 'rotate(' + rotate + ')',
      patternUnits: "userSpaceOnUse"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("line", {
      x1: "0",
      y: "0",
      x2: "0",
      y2: gap,
      stroke: color,
      "stroke-width": strokeWidth
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
      width: "100%",
      height: "100%",
      fill: 'url(' + '#pat' + uniqueID + ')',
      opacity: opacity / 100
    }));
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SvgPattern);

/***/ }),

/***/ "./src/blocks/spacer/transforms.js":
/*!*****************************************!*\
  !*** ./src/blocks/spacer/transforms.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

const transforms = {
  from: [{
    type: 'block',
    blocks: ['core/spacer'],
    transform: _ref => {
      let {
        height
      } = _ref;
      return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('kadence/spacer', {
        spacerHeight: height,
        divider: false
      });
    }
  }, {
    type: 'block',
    blocks: ['core/separator'],
    transform: () => {
      return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('kadence/spacer', {
        spacerHeight: 30,
        divider: true
      });
    }
  }],
  to: [{
    type: 'block',
    blocks: ['core/spacer'],
    transform: _ref2 => {
      let {
        spacerHeight
      } = _ref2;
      return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/spacer', {
        height: spacerHeight
      });
    }
  }, {
    type: 'block',
    blocks: ['core/separator'],
    transform: () => {
      return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/separator');
    }
  }]
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (transforms);

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

/***/ "./src/blocks/spacer/block.json":
/*!**************************************!*\
  !*** ./src/blocks/spacer/block.json ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Spacer/Divider","name":"kadence/spacer","category":"kadence-blocks","attributes":{"blockAlignment":{"type":"string","default":"center"},"hAlign":{"type":"string","default":"center"},"spacerHeight":{"type":"number","default":60},"spacerHeightUnits":{"type":"string","default":"px"},"tabletSpacerHeight":{"type":"number","default":""},"mobileSpacerHeight":{"type":"number","default":""},"dividerEnable":{"type":"boolean","default":true},"dividerStyle":{"type":"string","default":"solid"},"dividerOpacity":{"type":"number","default":100},"dividerColor":{"type":"string","default":"#eee"},"dividerWidth":{"type":"number","default":80},"dividerWidthUnits":{"type":"string","default":"%"},"tabletDividerWidth":{"type":"number"},"mobileDividerWidth":{"type":"number"},"dividerHeight":{"type":"number","default":1},"tabletDividerHeight":{"type":"number"},"mobileDividerHeight":{"type":"number"},"uniqueID":{"type":"string","default":""},"rotate":{"type":"number","default":40},"strokeWidth":{"type":"number","default":4},"strokeGap":{"type":"number","default":5},"tabletHAlign":{"type":"string","default":""},"mobileHAlign":{"type":"string","default":""},"vsdesk":{"type":"bool","default":false},"vstablet":{"type":"bool","default":false},"vsmobile":{"type":"bool","default":false}},"supports":{"anchor":true}}');

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
/*!************************************!*\
  !*** ./src/blocks/spacer/index.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "metadata": () => (/* reexport default export from named module */ _block_json__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   "name": () => (/* binding */ name),
/* harmony export */   "settings": () => (/* binding */ settings)
/* harmony export */ });
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/spacer/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./block.json */ "./src/blocks/spacer/block.json");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/blocks/spacer/save.js");
/* harmony import */ var _transforms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./transforms */ "./src/blocks/spacer/transforms.js");
/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./deprecated */ "./src/blocks/spacer/deprecated.js");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__);

/**
 * Internal dependencies
 */






const {
  name
} = _block_json__WEBPACK_IMPORTED_MODULE_2__;



const settings = {};
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('kadence/spacer', {
  getEditWrapperProps(_ref) {
    let {
      blockAlignment
    } = _ref;

    if ('full' === blockAlignment || 'wide' === blockAlignment || 'center' === blockAlignment) {
      return {
        'data-align': blockAlignment
      };
    }
  },

  ..._block_json__WEBPACK_IMPORTED_MODULE_2__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Spacer/Divider', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('spacer', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('divider', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('separator', 'kadence-blocks'), 'KB'],
  icon: {
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_6__.spacerIcon
  },
  transforms: _transforms__WEBPACK_IMPORTED_MODULE_4__["default"],
  deprecated: _deprecated__WEBPACK_IMPORTED_MODULE_5__["default"],
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});
})();

(this.kadence = this.kadence || {})["blocks-spacer"] = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=blocks-spacer.js.map