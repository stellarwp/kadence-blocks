/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/show-more/editor.scss":
/*!******************************************!*\
  !*** ./src/blocks/show-more/editor.scss ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/show-more/edit.js":
/*!**************************************!*\
  !*** ./src/blocks/show-more/edit.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Edit": () => (/* binding */ Edit),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/show-more/editor.scss");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_10__);


/**
 * BLOCK: Kadence Show More Block
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


const ktShowMoreUniqueIDs = [];
function Edit(_ref) {
  let {
    attributes,
    setAttributes,
    clientId,
    previewDevice
  } = _ref;
  const {
    uniqueID,
    showHideMore,
    defaultExpandedMobile,
    defaultExpandedTablet,
    defaultExpandedDesktop,
    heightDesktop,
    heightTablet,
    heightMobile,
    heightType,
    marginDesktop,
    marginTablet,
    marginMobile,
    marginUnit,
    paddingDesktop,
    paddingTablet,
    paddingMobile,
    paddingUnit,
    enableFadeOut,
    fadeOutSize
  } = attributes;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.useEffect)(() => {
    if (!uniqueID) {
      const blockConfigObject = kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : [];

      if (blockConfigObject['kadence/show-more'] !== undefined && typeof blockConfigObject['kadence/show-more'] === 'object') {
        Object.keys(blockConfigObject['kadence/show-more']).map(attribute => {
          attributes[attribute] = blockConfigObject['kadence/show-more'][attribute];
        });
      }

      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      ktShowMoreUniqueIDs.push('_' + clientId.substr(2, 9));
    } else if (ktShowMoreUniqueIDs.includes(uniqueID)) {
      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      ktShowMoreUniqueIDs.push('_' + clientId.substr(2, 9));
    } else {
      ktShowMoreUniqueIDs.push(uniqueID);
    }
  }, []);
  const [marginControl, setMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.useState)('individual');
  const [paddingControl, setPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.useState)('individual');
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.useState)('general');

  const getPreviewSize = (device, desktopSize, tabletSize, mobileSize) => {
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
  };

  const childBlocks = wp.data.select('core/block-editor').getBlockOrder(clientId);
  const buttonOneUniqueID = childBlocks[1] ? childBlocks[1].substr(2, 9) : (0,lodash__WEBPACK_IMPORTED_MODULE_9__.uniqueId)('button-one-');
  const previewMarginTop = getPreviewSize(previewDevice, undefined !== marginDesktop ? marginDesktop[0] : '', undefined !== marginTablet ? marginTablet[0] : '', undefined !== marginMobile ? marginMobile[0] : '');
  const previewMarginRight = getPreviewSize(previewDevice, undefined !== marginDesktop ? marginDesktop[1] : '', undefined !== marginTablet ? marginTablet[1] : '', undefined !== marginMobile ? marginMobile[1] : '');
  const previewMarginBottom = getPreviewSize(previewDevice, undefined !== marginDesktop ? marginDesktop[2] : '', undefined !== marginTablet ? marginTablet[2] : '', undefined !== marginMobile ? marginMobile[2] : '');
  const previewMarginLeft = getPreviewSize(previewDevice, undefined !== marginDesktop ? marginDesktop[3] : '', undefined !== marginTablet ? marginTablet[3] : '', undefined !== marginMobile ? marginMobile[3] : '');
  const previewPaddingTop = getPreviewSize(previewDevice, undefined !== paddingDesktop ? paddingDesktop[0] : '', undefined !== paddingTablet ? paddingTablet[0] : '', undefined !== paddingMobile ? paddingMobile[0] : '');
  const previewPaddingRight = getPreviewSize(previewDevice, undefined !== paddingDesktop ? paddingDesktop[1] : '', undefined !== paddingTablet ? paddingTablet[1] : '', undefined !== paddingMobile ? paddingMobile[1] : '');
  const previewPaddingBottom = getPreviewSize(previewDevice, undefined !== paddingDesktop ? paddingDesktop[2] : '', undefined !== paddingTablet ? paddingTablet[2] : '', undefined !== paddingMobile ? paddingMobile[2] : '');
  const previewPaddingLeft = getPreviewSize(previewDevice, undefined !== paddingDesktop ? paddingDesktop[3] : '', undefined !== paddingTablet ? paddingTablet[3] : '', undefined !== paddingMobile ? paddingMobile[3] : '');
  const previewPreviewHeight = getPreviewSize(previewDevice, undefined !== heightDesktop ? heightDesktop : '', undefined !== heightTablet ? heightTablet : '', undefined !== heightMobile ? heightMobile : '');
  const isExpanded = getPreviewSize(previewDevice, defaultExpandedDesktop, defaultExpandedTablet, defaultExpandedMobile);
  const ref = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.useRef)();
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.useBlockProps)({
    ref
  });

  const FadeOut = () => {
    let fadeSize = enableFadeOut && !isExpanded ? Math.abs(fadeOutSize - 100) : 100;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)("div", {
      className: "Class"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)("style", null, `
        .kb-show-more-buttons .btn-area-wrap:last-of-type {
       	display: ${showHideMore ? 'inline' : 'none'};
       	}

        .wp-block-kadence-show-more .kb-show-more-content:not(.is-selected, .has-child-selected) {
		   max-height: ${isExpanded ? 'none' : previewPreviewHeight + heightType};
		  -webkit-mask-image: linear-gradient(to bottom, black ${fadeSize}%, transparent 100%);
		  mask-image: linear-gradient(to bottom, black ${fadeSize}%, transparent 100%);

        }
      `));
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(react__WEBPACK_IMPORTED_MODULE_10__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.InspectorControlTabs, {
    panelName: 'lottie',
    setActiveTab: setActiveTab,
    activeTab: activeTab
  }), activeTab === 'general' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(react__WEBPACK_IMPORTED_MODULE_10__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Show More Settings', 'kadence-blocks'),
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Display "hide" button once expanded', 'kadence-blocks'),
    checked: showHideMore,
    onChange: value => setAttributes({
      showHideMore: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Maximum Preview Height', 'kadence-blocks'),
    value: heightDesktop ? heightDesktop : '',
    onChange: value => {
      setAttributes({
        heightDesktop: value
      });
    },
    tabletValue: undefined !== heightTablet ? heightTablet : '',
    onChangeTablet: value => {
      setAttributes({
        heightTablet: value
      });
    },
    mobileValue: undefined !== heightMobile ? heightMobile : '',
    onChangeMobile: value => {
      setAttributes({
        heightMobile: value
      });
    },
    min: 0,
    max: (heightType ? heightType : 'px') !== 'px' ? 10 : 2000,
    step: (heightType ? heightType : 'px') !== 'px' ? 0.1 : 1,
    unit: heightType ? heightType : 'px',
    onUnit: value => {
      setAttributes({
        heightType: value
      });
    },
    units: ['px', 'em', 'rem']
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Fade out preview', 'kadence-blocks'),
    checked: enableFadeOut,
    onChange: value => setAttributes({
      enableFadeOut: value
    })
  }), enableFadeOut && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Fade Size', 'kadence-blocks'),
    value: fadeOutSize,
    onChange: value => setAttributes({
      fadeOutSize: value
    })
  }))), activeTab === 'style' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(react__WEBPACK_IMPORTED_MODULE_10__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Spacing Settings', 'kadence-blocks')
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Padding', 'kadence-blocks'),
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
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Margin', 'kadence-blocks'),
    value: [previewMarginTop, previewMarginRight, previewMarginBottom, previewMarginLeft],
    control: marginControl,
    tabletValue: marginTablet,
    mobileValue: marginMobile,
    onChange: value => {
      setAttributes({
        marginDesktop: value
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
  }))), activeTab === 'advanced' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(react__WEBPACK_IMPORTED_MODULE_10__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Expand Settings', 'kadence-blocks')
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Default Expanded on Desktop', 'kadence-blocks'),
    checked: defaultExpandedDesktop,
    onChange: value => setAttributes({
      defaultExpandedDesktop: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Default Expanded on Tablet', 'kadence-blocks'),
    checked: defaultExpandedTablet,
    onChange: value => setAttributes({
      defaultExpandedTablet: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Default Expanded on Mobile', 'kadence-blocks'),
    checked: defaultExpandedMobile,
    onChange: value => setAttributes({
      defaultExpandedMobile: value
    })
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(FadeOut, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, blockProps, {
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
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.InnerBlocks, {
    templateLock: "all",
    renderAppender: false,
    template: [['kadence/column', {
      className: 'kb-show-more-content'
    }], ['kadence/advancedbtn', {
      lock: {
        remove: true,
        move: true
      },
      lockBtnCount: true,
      hAlign: 'left',
      thAlign: "",
      mhAlign: "",
      btnCount: 2,
      uniqueID: buttonOneUniqueID,
      className: 'kb-show-more-buttons',
      btns: [{
        'text': (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Show More', 'kadence-blocks'),
        'link': '',
        'target': '_self',
        'size': '',
        'paddingBT': '',
        'paddingLR': '',
        'color': '',
        'background': '',
        'border': '',
        'backgroundOpacity': 1,
        'borderOpacity': 1,
        'borderRadius': '',
        'borderWidth': '',
        'colorHover': '',
        'backgroundHover': '',
        'borderHover': '',
        'backgroundHoverOpacity': 1,
        'borderHoverOpacity': 1,
        'icon': '',
        'iconSide': 'right',
        'iconHover': false,
        'cssClass': '',
        'noFollow': false,
        'gap': 5,
        'responsiveSize': ['', ''],
        'gradient': ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
        'gradientHover': ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
        'btnStyle': 'basic',
        'btnSize': 'small',
        'backgroundType': 'solid',
        'backgroundHoverType': 'solid',
        'width': ['', '', ''],
        'responsivePaddingBT': ['', ''],
        'responsivePaddingLR': ['', ''],
        'boxShadow': [false, '#000000', 0.2, 1, 1, 2, 0, false],
        'boxShadowHover': [false, '#000000', 0.4, 2, 2, 3, 0, false],
        'inheritStyles': 'inherit',
        'borderStyle': '',
        'onlyIcon': [false, '', '']
      }, {
        'text': (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Show Less', 'kadence-blocks'),
        'link': '',
        'target': '_self',
        'size': '',
        'paddingBT': '',
        'paddingLR': '',
        'color': '',
        'background': '',
        'border': '',
        'backgroundOpacity': 1,
        'borderOpacity': 1,
        'borderRadius': '',
        'borderWidth': '',
        'colorHover': '',
        'backgroundHover': '',
        'borderHover': '',
        'backgroundHoverOpacity': 1,
        'borderHoverOpacity': 1,
        'icon': '',
        'iconSide': 'right',
        'iconHover': false,
        'cssClass': '',
        'noFollow': false,
        'gap': 5,
        'responsiveSize': ['', ''],
        'gradient': ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
        'gradientHover': ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
        'btnStyle': 'basic',
        'btnSize': 'small',
        'backgroundType': 'solid',
        'backgroundHoverType': 'solid',
        'width': ['', '', ''],
        'responsivePaddingBT': ['', ''],
        'responsivePaddingLR': ['', ''],
        'boxShadow': [false, '#000000', 0.2, 1, 1, 2, 0, false],
        'boxShadowHover': [false, '#000000', 0.4, 2, 2, 3, 0, false],
        'inheritStyles': 'inherit',
        'borderStyle': '',
        'onlyIcon': [false, '', '']
      }],
      "typography": "",
      "googleFont": false,
      "loadGoogleFont": true,
      "fontSubset": "",
      "fontVariant": "",
      "fontWeight": "regular",
      "fontStyle": "normal",
      "textTransform": "",
      "widthType": "auto",
      "widthUnit": "px",
      "forceFullwidth": false,
      "collapseFullwidth": false,
      "margin": [{
        "desk": ["", "", "", ""],
        "tablet": ["", "", "", ""],
        "mobile": ["", "", "", ""]
      }],
      "marginUnit": "px",
      "inQueryBlock": false,
      "kadenceAOSOptions": [{
        "duration": "",
        "offset": "",
        "easing": "",
        "once": "",
        "delay": "",
        "delayOffset": ""
      }]
    }]]
  })));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__.compose)([(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.withSelect)(select => {
  return {
    previewDevice: select('kadenceblocks/data').getPreviewDeviceType()
  };
}), (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.withDispatch)(dispatch => ({
  addUniqueID: (value, clientID) => dispatch('kadenceblocks/data').addUniqueID(value, clientID)
}))])(Edit));

/***/ }),

/***/ "./src/blocks/show-more/save.js":
/*!**************************************!*\
  !*** ./src/blocks/show-more/save.js ***!
  \**************************************/
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


/**
 * BLOCK: Kadence Show More Block
 */

/**
 * External dependencies
 */



function Save(_ref) {
  let {
    attributes,
    innerBlocks
  } = _ref;
  const {
    uniqueID
  } = attributes;
  const classes = classnames__WEBPACK_IMPORTED_MODULE_2___default()({
    'kb-block-show-more-container': true,
    [`kb-block-show-more-container${uniqueID}`]: true
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
    className: classes
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Save);

/***/ }),

/***/ "./src/blocks/show-more/transforms.js":
/*!********************************************!*\
  !*** ./src/blocks/show-more/transforms.js ***!
  \********************************************/
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

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

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

/***/ "./src/blocks/show-more/block.json":
/*!*****************************************!*\
  !*** ./src/blocks/show-more/block.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"kadence/show-more","title":"Show More","category":"kadence-blocks","textdomain":"kadence-blocks","attributes":{"align":{"type":"string"},"id":{"type":"number"},"uniqueID":{"type":"string"},"showHideMore":{"type":"boolean","default":true},"defaultExpandedMobile":{"type":"boolean","default":false},"defaultExpandedTablet":{"type":"boolean","default":false},"defaultExpandedDesktop":{"type":"boolean","default":false},"heightDesktop":{"type":"number","default":250},"heightTablet":{"type":"number","default":""},"heightMobile":{"type":"number","default":""},"heightType":{"type":"string","default":"px"},"enableFadeOut":{"type":"boolean","default":false},"fadeOutSize":{"type":"number","default":50},"marginDesktop":{"type":"array","default":["","","",""]},"marginTablet":{"type":"array","default":["","","",""]},"marginMobile":{"type":"array","default":["","","",""]},"marginUnit":{"type":"string","default":"px"},"paddingDesktop":{"type":"array","default":["","","",""]},"paddingTablet":{"type":"array","default":["","","",""]},"paddingMobile":{"type":"array","default":["","","",""]},"paddingUnit":{"type":"string","default":"px"}}}');

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
/*!***************************************!*\
  !*** ./src/blocks/show-more/index.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./src/blocks/show-more/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/blocks/show-more/block.json");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./save */ "./src/blocks/show-more/save.js");
/* harmony import */ var _transforms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./transforms */ "./src/blocks/show-more/transforms.js");



/**
 * Internal dependencies
 */





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('kadence/show-more', { ..._block_json__WEBPACK_IMPORTED_MODULE_4__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__._x)('Show More', 'block title', 'kadence-blocks'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__._x)('Hide content and enable a show more button to reveal', 'block description', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('show', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('hide', 'kadence-blocks'), "kb"],
  icon: {
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_0__.showMoreIcon
  },
  transforms: _transforms__WEBPACK_IMPORTED_MODULE_6__["default"],
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_5__["default"]
});
})();

(this.kadence = this.kadence || {})["blocks-show-more"] = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=blocks-show-more.js.map