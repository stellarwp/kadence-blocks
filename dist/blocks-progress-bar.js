/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/progress-bar/editor.scss":
/*!*********************************************!*\
  !*** ./src/blocks/progress-bar/editor.scss ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/progress-bar/edit.js":
/*!*****************************************!*\
  !*** ./src/blocks/progress-bar/edit.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Edit": () => (/* binding */ Edit),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/progress-bar/editor.scss");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_9__);


/**
 * BLOCK: Kadence Block Template
 */

/**
 * Import Css
 */



/**
* Internal block libraries
*/








/**
 * Internal dependencies
 */


const ktUniqueIDs = [];
function Edit(_ref) {
  let {
    attributes,
    setAttributes,
    className,
    clientId
  } = _ref;
  const {
    uniqueID,
    align,
    paddingTablet,
    paddingDesktop,
    paddingMobile,
    paddingUnit,
    marginTablet,
    marginDesktop,
    marginMobile,
    marginUnit,
    barBackground,
    barBackgroundOpacity,
    containerBorder,
    containerTabletBorder,
    containerMobileBorder,
    containerBorderType,
    borderColor,
    borderOpacity,
    barType
  } = attributes;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!uniqueID) {
      const blockConfigObject = kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : [];

      if (blockConfigObject['kadence/block-template'] !== undefined && typeof blockConfigObject['kadence/block-template'] === 'object') {
        Object.keys(blockConfigObject['kadence/block-template']).map(attribute => {
          uniqueID = blockConfigObject['kadence/block-template'][attribute];
        });
      }

      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      ktUniqueIDs.push('_' + clientId.substr(2, 9));
    } else if (ktUniqueIDs.includes(uniqueID)) {
      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      ktUniqueIDs.push('_' + clientId.substr(2, 9));
    } else {
      ktUniqueIDs.push(uniqueID);
    }
  }, []);
  const {
    isUniqueID,
    isUniqueBlock,
    previewDevice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useSelect)(select => {
    return {
      isUniqueID: value => select('kadenceblocks/data').isUniqueID(value),
      isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
      previewDevice: select('kadenceblocks/data').getPreviewDeviceType()
    };
  }, [clientId]);
  const previewMarginTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== marginDesktop ? marginDesktop[0] : '', undefined !== marginTablet ? marginTablet[0] : '', undefined !== marginMobile ? marginMobile[0] : '');
  const previewMarginRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== marginDesktop ? marginDesktop[1] : '', undefined !== marginTablet ? marginTablet[1] : '', undefined !== marginMobile ? marginMobile[1] : '');
  const previewMarginBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== marginDesktop ? marginDesktop[2] : '', undefined !== marginTablet ? marginTablet[2] : '', undefined !== marginMobile ? marginMobile[2] : '');
  const previewMarginLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== marginDesktop ? marginDesktop[3] : '', undefined !== marginTablet ? marginTablet[3] : '', undefined !== marginMobile ? marginMobile[3] : '');
  const previewPaddingTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== paddingDesktop ? paddingDesktop[0] : '', undefined !== paddingTablet ? paddingTablet[0] : '', undefined !== paddingMobile ? paddingMobile[0] : '');
  const previewPaddingRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== paddingDesktop ? paddingDesktop[1] : '', undefined !== paddingTablet ? paddingTablet[1] : '', undefined !== paddingMobile ? paddingMobile[1] : '');
  const previewPaddingBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== paddingDesktop ? paddingDesktop[2] : '', undefined !== paddingTablet ? paddingTablet[2] : '', undefined !== paddingMobile ? paddingMobile[2] : '');
  const previewPaddingLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== paddingDesktop ? paddingDesktop[3] : '', undefined !== paddingTablet ? paddingTablet[3] : '', undefined !== paddingMobile ? paddingMobile[3] : '');
  const previewBarBorderTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== containerBorder && undefined !== containerBorder[0] ? containerBorder[0] : '', undefined !== containerTabletBorder && undefined !== containerTabletBorder[0] ? containerTabletBorder[0] : '', undefined !== containerMobileBorder && undefined !== containerMobileBorder[0] ? containerMobileBorder[0] : '');
  const previewBarBorderRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== containerBorder && undefined !== containerBorder[1] ? containerBorder[1] : '', undefined !== containerTabletBorder && undefined !== containerTabletBorder[1] ? containerTabletBorder[1] : '', undefined !== containerMobileBorder && undefined !== containerMobileBorder[1] ? containerMobileBorder[1] : '');
  const previewBarBorderBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== containerBorder && undefined !== containerBorder[2] ? containerBorder[2] : '', undefined !== containerTabletBorder && undefined !== containerTabletBorder[2] ? containerTabletBorder[2] : '', undefined !== containerMobileBorder && undefined !== containerMobileBorder[2] ? containerMobileBorder[2] : '');
  const previewBarBorderLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== containerBorder && undefined !== containerBorder[3] ? containerBorder[3] : '', undefined !== containerTabletBorder && undefined !== containerTabletBorder[3] ? containerTabletBorder[3] : '', undefined !== containerMobileBorder && undefined !== containerMobileBorder[3] ? containerMobileBorder[3] : '');
  const [marginControl, setMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('individual');
  const [paddingControl, setPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('individual');
  const [borderControl, setBorderControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('individual');
  const classes = classnames__WEBPACK_IMPORTED_MODULE_9___default()(className, {
    [`kt-block-template${uniqueID}`]: uniqueID
  });
  const containerClasses = classnames__WEBPACK_IMPORTED_MODULE_9___default()({
    'kb-block-template-container': true,
    [`kb-block-template-container${uniqueID}`]: true
  });
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.useBlockProps)({
    className: classes
  });
  const layoutPresetOptions = [{
    key: 'line',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Line', 'kadence-blocks'),
    icon: "infoStartIcon"
  }, {
    key: 'circle',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Circle', 'kadence-blocks'),
    icon: "infoBasicIcon"
  }];
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.BlockControls, {
    group: "block"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.BlockAlignmentControl, {
    value: align,
    onChange: value => setAttributes({
      align: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Progress Bar Layout', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__.ButtonGroup, {
    className: "kt-style-btn-group kb-info-layouts",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Progress Bar Layout', 'kadence-blocks')
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_7__.map)(layoutPresetOptions, _ref2 => {
    let {
      name,
      key,
      icon
    } = _ref2;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__.Button, {
      key: key,
      className: "kt-style-btn",
      isSmall: true,
      isPrimary: false,
      "aria-pressed": false,
      onClick: value => setAttributes({
        barType: value
      })
    }, name);
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Size Controls', 'kadence-blocks'),
    initialOpen: false
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_2__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Padding', 'kadence-blocks'),
    value: [previewPaddingTop, previewPaddingRight, previewPaddingBottom, previewPaddingLeft],
    control: paddingControl,
    tabletValue: paddingTablet,
    mobileValue: paddingMobile,
    onChange: value => setAttributes({
      paddingDesktop: value
    }),
    onChangeTablet: value => setAttributes({
      paddingTablet: value
    }),
    onChangeMobile: value => setAttributes({
      paddingMobile: value
    }),
    onChangeControl: value => setPaddingControl(value),
    min: 0,
    max: paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 200,
    step: paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1,
    unit: paddingUnit,
    units: ['px', 'em', 'rem', '%'],
    onUnit: value => setAttributes({
      paddingUnit: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_2__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Margin', 'kadence-blocks'),
    value: [previewMarginTop, previewMarginRight, previewMarginBottom, previewMarginLeft],
    control: marginControl,
    tabletValue: marginTablet,
    mobileValue: marginMobile,
    onChange: value => {
      setAttributes({
        marginDesktop: [value[0], value[1], value[2], value[3]]
      });
    },
    onChangeTablet: value => setAttributes({
      marginTablet: value
    }),
    onChangeMobile: value => setAttributes({
      marginMobile: value
    }),
    onChangeControl: value => setMarginControl(value),
    min: marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200,
    max: marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200,
    step: marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1,
    unit: marginUnit,
    units: ['px', 'em', 'rem', '%', 'vh'],
    onUnit: value => setAttributes({
      marginUnit: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_8__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Progress Bar Settings', 'kadence-blocks'),
    initialOpen: false
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_2__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Bar Background', 'kadence-blocks'),
    colorValue: barBackground ? barBackground : '#4A5568',
    colorDefault: '#4A5568',
    opacityValue: barBackgroundOpacity,
    onColorChange: value => setAttributes({
      barBackground: value
    }),
    onOpacityChange: value => setAttributes({
      barBackgroundOpacity: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_2__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Border Color', 'kadence-blocks'),
    colorValue: borderColor ? borderColor : '#4A5568',
    colorDefault: '#4A5568',
    opacityValue: borderOpacity,
    onColorChange: value => setAttributes({
      borderColor: value
    }),
    onOpacityChange: value => setAttributes({
      borderOpacity: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_2__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Bar Border', 'kadence-blocks'),
    control: borderControl,
    tabletControl: borderControl,
    mobileControl: borderControl,
    value: containerBorder,
    tabletValue: containerTabletBorder,
    mobileValue: containerMobileBorder,
    onChange: value => {
      setAttributes({
        containerBorder: value
      });
    },
    onChangeTablet: value => {
      setAttributes({
        containerTabletBorder: value
      });
    },
    onChangeMobile: value => {
      setAttributes({
        containerMobileBorder: value
      });
    },
    onChangeControl: value => setBorderControl(value),
    onChangeTabletControl: value => setBorderControl(value),
    onChangeMobileControl: value => setBorderControl(value),
    allowEmpty: true,
    min: 0,
    max: 100,
    step: 1,
    unit: containerBorderType,
    units: ['px'],
    onUnit: value => setAttributes({
      containerBorderType: value
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: containerClasses,
    style: {
      marginTop: '' !== previewMarginTop ? previewMarginTop + marginUnit : undefined,
      marginRight: '' !== previewMarginRight ? previewMarginRight + marginUnit : undefined,
      marginBottom: '' !== previewMarginBottom ? previewMarginBottom + marginUnit : undefined,
      marginLeft: '' !== previewMarginLeft ? previewMarginLeft + marginUnit : undefined,
      paddingTop: '' !== previewPaddingTop ? previewPaddingTop + paddingUnit : undefined,
      paddingRight: '' !== previewPaddingRight ? previewPaddingRight + paddingUnit : undefined,
      paddingBottom: '' !== previewPaddingBottom ? previewPaddingBottom + paddingUnit : undefined,
      paddingLeft: '' !== previewPaddingLeft ? previewPaddingLeft + paddingUnit : undefined
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "container"
  }, barType === "line" && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "progress-bar__container",
    style: {
      backgroundColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(barBackground, barBackgroundOpacity),
      borderTopWidth: previewBarBorderTop + containerBorderType,
      borderBottomWidth: previewBarBorderBottom + containerBorderType,
      borderRightWidth: previewBarBorderRight + containerBorderType,
      borderLeftWidth: previewBarBorderLeft + containerBorderType,
      borderColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(borderColor, borderOpacity),
      borderStyle: "solid"
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "progressbar-1"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "progress-bar__text"
  }))), barType === "circle" && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "circle-bars"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    class: "bg",
    cx: "57",
    cy: "57",
    r: "52"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    class: "circlebar-1",
    cx: "57",
    cy: "57",
    r: "52"
  }))))));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Edit);

/***/ }),

/***/ "./src/blocks/progress-bar/save.js":
/*!*****************************************!*\
  !*** ./src/blocks/progress-bar/save.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/**
 * BLOCK: Kadence Block Template
 */
const {
  rest_url
} = kadence_blocks_params;
/**
 * External dependencies
 */



function Save(_ref) {
  let {
    attributes
  } = _ref;
  const {
    uniqueID
  } = attributes;
  const classes = classnames__WEBPACK_IMPORTED_MODULE_0___default()({
    'kb-block-template-container': true,
    [`kb-block-template-container${uniqueID}`]: true
  }); // return (
  // 	<div className={ classes }>
  // 		Block template content
  // 	</div>
  // );

  return null;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Save);

/***/ }),

/***/ "./src/blocks/progress-bar/transforms.js":
/*!***********************************************!*\
  !*** ./src/blocks/progress-bar/transforms.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
const transforms = {
  from: [],
  to: []
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

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = window["lodash"];

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

/***/ "./src/blocks/progress-bar/block.json":
/*!********************************************!*\
  !*** ./src/blocks/progress-bar/block.json ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"apiVersion":2,"name":"kadence/progress-bar","title":"Progress Bar","category":"kadence-blocks","description":"Kadence progress bar","textdomain":"kadence-blocks","keywords":["kb","progress bar"],"attributes":{"align":{"type":"string"},"id":{"type":"number"},"width":{"type":"number","default":"0"},"uniqueID":{"type":"string"},"marginDesktop":{"type":"array","default":["","","",""]},"marginTablet":{"type":"array","default":["","","",""]},"marginMobile":{"type":"array","default":["","","",""]},"marginUnit":{"type":"string","default":"px"},"paddingDesktop":{"type":"array","default":["","","",""]},"paddingTablet":{"type":"array","default":["","","",""]},"paddingMobile":{"type":"array","default":["","","",""]},"paddingUnit":{"type":"string","default":"px"},"barBackground":{"type":"string","default":"#4A5568"},"barBackgroundOpacity":{"type":"number","default":1},"containerBorder":{"type":"array","default":[0,0,0,0]},"containerTabletBorder":{"type":"array","default":["","","",""]},"containerMobileBorder":{"type":"array","default":["","","",""]},"containerBorderType":{"type":"string","default":"px"},"borderColor":{"type":"string","default":"#4A5568"},"borderOpacity":{"type":"number","default":1},"barType":{"enum":["line","circle"],"default":"line"}},"editorScript":"file:editor.js"}');

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
/*!******************************************!*\
  !*** ./src/blocks/progress-bar/index.js ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/blocks/progress-bar/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/blocks/progress-bar/block.json");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./src/blocks/progress-bar/save.js");
/* harmony import */ var _transforms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./transforms */ "./src/blocks/progress-bar/transforms.js");


/**
 * Internal dependencies
 */





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('kadence/progress-bar', { ..._block_json__WEBPACK_IMPORTED_MODULE_3__,
  icon: {
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_0__.rowIcon
  },
  transforms: _transforms__WEBPACK_IMPORTED_MODULE_5__["default"],
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
});
})();

(this.kadence = this.kadence || {})["blocks-progress-bar"] = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=blocks-progress-bar.js.map