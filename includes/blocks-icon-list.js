/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@wordpress/icons/build-module/library/plus.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/plus.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);


/**
 * WordPress dependencies
 */

const plus = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plus);
//# sourceMappingURL=plus.js.map

/***/ }),

/***/ "./src/blocks/icon-list/editor.scss":
/*!******************************************!*\
  !*** ./src/blocks/icon-list/editor.scss ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/icon-list/style.scss":
/*!*****************************************!*\
  !*** ./src/blocks/icon-list/style.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/icon-list/block.js":
/*!***************************************!*\
  !*** ./src/blocks/icon-list/block.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edit */ "./src/blocks/icon-list/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./save */ "./src/blocks/icon-list/save.js");
/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./deprecated */ "./src/blocks/icon-list/deprecated.js");
/* harmony import */ var _transforms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./transforms */ "./src/blocks/icon-list/transforms.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/blocks/icon-list/block.json");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/icon-list/style.scss");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__);
/**
 * BLOCK: Kadence Icon List
 */





/**
 * Import Icon stuff
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

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_10__.registerBlockType)('kadence/iconlist', { ..._block_json__WEBPACK_IMPORTED_MODULE_4__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Icon List', 'kadence-blocks'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Create engaging lists with icons for bullets.', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('icon', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('svg', 'kadence-blocks'), 'KB'],
  icon: {
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_5__.iconListBlockIcon
  },
  transforms: _transforms__WEBPACK_IMPORTED_MODULE_3__["default"],

  getEditWrapperProps(_ref) {
    let {
      blockAlignment
    } = _ref;

    if ('left' === blockAlignment || 'right' === blockAlignment || 'center' === blockAlignment) {
      return {
        'data-align': blockAlignment
      };
    }
  },

  deprecated: _deprecated__WEBPACK_IMPORTED_MODULE_2__["default"],
  edit: _edit__WEBPACK_IMPORTED_MODULE_0__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/icon-list/deprecated.js":
/*!********************************************!*\
  !*** ./src/blocks/icon-list/deprecated.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);


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
    items: {
      type: 'array',
      default: [{
        icon: 'fe_checkCircle',
        link: '',
        target: '_self',
        size: 20,
        width: 2,
        text: '',
        color: '',
        background: '',
        border: '',
        borderRadius: 0,
        padding: 5,
        borderWidth: 1,
        style: 'default'
      }]
    },
    listStyles: {
      type: 'array',
      default: [{
        size: ['', '', ''],
        sizeType: 'px',
        lineHeight: ['', '', ''],
        lineType: 'px',
        letterSpacing: '',
        family: '',
        google: false,
        style: '',
        weight: '',
        variant: '',
        subset: '',
        loadGoogle: true,
        color: '',
        textTransform: ''
      }]
    },
    listCount: {
      type: 'number',
      default: 1
    },
    columns: {
      type: 'number',
      default: 1
    },
    tabletColumns: {
      type: 'number',
      default: ''
    },
    mobileColumns: {
      type: 'number',
      default: ''
    },
    listGap: {
      type: 'number',
      default: 5
    },
    listLabelGap: {
      type: 'number',
      default: 10
    },
    uniqueID: {
      type: 'string',
      default: ''
    },
    blockAlignment: {
      type: 'string',
      default: 'none'
    },
    listMargin: {
      type: 'array',
      default: [0, 0, 10, 0]
    },
    iconAlign: {
      type: 'string',
      default: 'middle'
    }
  },
  save: _ref => {
    let {
      attributes
    } = _ref;
    const {
      items,
      listCount,
      columns,
      blockAlignment,
      iconAlign,
      uniqueID,
      tabletColumns,
      mobileColumns
    } = attributes;

    const renderItems = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
        className: `kt-svg-icon-list-style-${items[index].style} kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${index}`
      }, items[index].icon && items[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: items[index].link,
        className: 'kt-svg-icon-link',
        target: '_blank' === items[index].target ? items[index].target : undefined,
        rel: '_blank' === items[index].target ? 'noopener noreferrer' : undefined
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon-list-single kt-svg-icon-list-single-${items[index].icon}`,
        name: items[index].icon,
        size: items[index].size,
        strokeWidth: 'fe' === items[index].icon.substring(0, 2) ? items[index].width : undefined,
        ariaHidden: 'true',
        style: {
          color: items[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(items[index].color) : undefined,
          backgroundColor: items[index].background && items[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(items[index].background) : undefined,
          padding: items[index].padding && items[index].style !== 'default' ? items[index].padding + 'px' : undefined,
          borderColor: items[index].border && items[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(items[index].border) : undefined,
          borderWidth: items[index].borderWidth && items[index].style !== 'default' ? items[index].borderWidth + 'px' : undefined,
          borderRadius: items[index].borderRadius && items[index].style !== 'default' ? items[index].borderRadius + '%' : undefined
        }
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.RichText.Content, {
        tagName: "span",
        value: items[index].text,
        className: 'kt-svg-icon-list-text'
      })), items[index].icon && !items[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon-list-single kt-svg-icon-list-single-${items[index].icon}`,
        name: items[index].icon,
        size: items[index].size,
        strokeWidth: 'fe' === items[index].icon.substring(0, 2) ? items[index].width : undefined,
        ariaHidden: 'true',
        style: {
          color: items[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(items[index].color) : undefined,
          backgroundColor: items[index].background && items[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(items[index].background) : undefined,
          padding: items[index].padding && items[index].style !== 'default' ? items[index].padding + 'px' : undefined,
          borderColor: items[index].border && items[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(items[index].border) : undefined,
          borderWidth: items[index].borderWidth && items[index].style !== 'default' ? items[index].borderWidth + 'px' : undefined,
          borderRadius: items[index].borderRadius && items[index].style !== 'default' ? items[index].borderRadius + '%' : undefined,
          marginTop: items[index].marginTop ? items[index].marginTop + 'px' : undefined,
          marginRight: items[index].marginRight ? items[index].marginRight + 'px' : undefined,
          marginBottom: items[index].marginBottom ? items[index].marginBottom + 'px' : undefined,
          marginLeft: items[index].marginLeft ? items[index].marginLeft + 'px' : undefined
        }
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.RichText.Content, {
        tagName: "span",
        value: items[index].text,
        className: 'kt-svg-icon-list-text'
      })));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-svg-icon-list-items kt-svg-icon-list-items${uniqueID} kt-svg-icon-list-columns-${columns} align${blockAlignment ? blockAlignment : 'none'}${undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : ''}${undefined !== tabletColumns && '' !== tabletColumns ? ' kt-tablet-svg-icon-list-columns-' + tabletColumns : ''}${undefined !== mobileColumns && '' !== mobileColumns ? ' kt-mobile-svg-icon-list-columns-' + mobileColumns : ''}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
      className: "kt-svg-icon-list"
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(listCount, n => renderItems(n))));
  }
}, {
  attributes: {
    items: {
      type: 'array',
      default: [{
        icon: 'fe_checkCircle',
        link: '',
        target: '_self',
        size: 20,
        width: 2,
        text: '',
        color: '',
        background: '',
        border: '',
        borderRadius: 0,
        padding: 5,
        borderWidth: 1,
        style: 'default'
      }]
    },
    listStyles: {
      type: 'array',
      default: [{
        size: ['', '', ''],
        sizeType: 'px',
        lineHeight: ['', '', ''],
        lineType: 'px',
        letterSpacing: '',
        family: '',
        google: false,
        style: '',
        weight: '',
        variant: '',
        subset: '',
        loadGoogle: true,
        color: '',
        textTransform: ''
      }]
    },
    listCount: {
      type: 'number',
      default: 1
    },
    columns: {
      type: 'number',
      default: 1
    },
    listGap: {
      type: 'number',
      default: 5
    },
    listLabelGap: {
      type: 'number',
      default: 10
    },
    uniqueID: {
      type: 'string',
      default: ''
    },
    blockAlignment: {
      type: 'string',
      default: 'none'
    },
    listMargin: {
      type: 'array',
      default: [0, 0, 10, 0]
    },
    iconAlign: {
      type: 'string',
      default: 'middle'
    }
  },
  save: _ref2 => {
    let {
      attributes
    } = _ref2;
    const {
      items,
      listCount,
      columns,
      blockAlignment,
      iconAlign,
      uniqueID
    } = attributes;

    const renderItems = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
        className: `kt-svg-icon-list-style-${items[index].style} kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${index}`
      }, items[index].icon && items[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: items[index].link,
        className: 'kt-svg-icon-link',
        target: '_blank' === items[index].target ? items[index].target : undefined,
        rel: '_blank' === items[index].target ? 'noopener noreferrer' : undefined
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon-list-single kt-svg-icon-list-single-${items[index].icon}`,
        name: items[index].icon,
        size: items[index].size,
        strokeWidth: 'fe' === items[index].icon.substring(0, 2) ? items[index].width : undefined,
        style: {
          color: items[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(items[index].color) : undefined,
          backgroundColor: items[index].background && items[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(items[index].background) : undefined,
          padding: items[index].padding && items[index].style !== 'default' ? items[index].padding + 'px' : undefined,
          borderColor: items[index].border && items[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(items[index].border) : undefined,
          borderWidth: items[index].borderWidth && items[index].style !== 'default' ? items[index].borderWidth + 'px' : undefined,
          borderRadius: items[index].borderRadius && items[index].style !== 'default' ? items[index].borderRadius + '%' : undefined
        }
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.RichText.Content, {
        tagName: "span",
        value: items[index].text,
        className: 'kt-svg-icon-list-text'
      })), items[index].icon && !items[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon-list-single kt-svg-icon-list-single-${items[index].icon}`,
        name: items[index].icon,
        size: items[index].size,
        strokeWidth: 'fe' === items[index].icon.substring(0, 2) ? items[index].width : undefined,
        style: {
          color: items[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(items[index].color) : undefined,
          backgroundColor: items[index].background && items[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(items[index].background) : undefined,
          padding: items[index].padding && items[index].style !== 'default' ? items[index].padding + 'px' : undefined,
          borderColor: items[index].border && items[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(items[index].border) : undefined,
          borderWidth: items[index].borderWidth && items[index].style !== 'default' ? items[index].borderWidth + 'px' : undefined,
          borderRadius: items[index].borderRadius && items[index].style !== 'default' ? items[index].borderRadius + '%' : undefined,
          marginTop: items[index].marginTop ? items[index].marginTop + 'px' : undefined,
          marginRight: items[index].marginRight ? items[index].marginRight + 'px' : undefined,
          marginBottom: items[index].marginBottom ? items[index].marginBottom + 'px' : undefined,
          marginLeft: items[index].marginLeft ? items[index].marginLeft + 'px' : undefined
        }
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.RichText.Content, {
        tagName: "span",
        value: items[index].text,
        className: 'kt-svg-icon-list-text'
      })));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-svg-icon-list-items kt-svg-icon-list-items${uniqueID} kt-svg-icon-list-columns-${columns} align${blockAlignment ? blockAlignment : 'none'}${undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : ''}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
      className: "kt-svg-icon-list"
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(listCount, n => renderItems(n))));
  }
}]);

/***/ }),

/***/ "./src/blocks/icon-list/edit.js":
/*!**************************************!*\
  !*** ./src/blocks/icon-list/edit.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/icon-list/editor.scss");
/* harmony import */ var _moveItem__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./moveItem */ "./src/blocks/icon-list/moveItem.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plus.js");



/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Icons
 */

/**
 * Import Externals
 */


/**
 * Import Kadence Components
 */



/**
 * Import Css
 */


/**
 * Import Block Specific.
 */


/**
 * Internal block libraries
 */









/**
 * This allows for checking to see if the block needs to generate a new ID.
 */

const kticonlistUniqueIDs = [];

function KadenceIconLists(_ref) {
  let {
    attributes,
    className,
    setAttributes,
    isSelected,
    container,
    getPreviewDevice,
    clientId
  } = _ref;
  const {
    listCount,
    items,
    listStyles,
    columns,
    listLabelGap,
    listGap,
    blockAlignment,
    uniqueID,
    listMargin,
    iconAlign,
    tabletColumns,
    mobileColumns
  } = attributes;
  const [focusIndex, setFocusIndex] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const [marginControl, setMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('general');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (!uniqueID) {
      const blockConfigObject = kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : [];

      if (blockConfigObject['kadence/iconlist'] !== undefined && typeof blockConfigObject['kadence/iconlist'] === 'object') {
        Object.keys(blockConfigObject['kadence/iconlist']).map(attribute => {
          if (attribute === 'items') {
            attributes[attribute] = attributes[attribute].map((item, index) => {
              item.icon = blockConfigObject['kadence/iconlist'][attribute][0].icon;
              item.size = blockConfigObject['kadence/iconlist'][attribute][0].size;
              item.color = blockConfigObject['kadence/iconlist'][attribute][0].color;
              item.background = blockConfigObject['kadence/iconlist'][attribute][0].background;
              item.border = blockConfigObject['kadence/iconlist'][attribute][0].border;
              item.borderRadius = blockConfigObject['kadence/iconlist'][attribute][0].borderRadius;
              item.padding = blockConfigObject['kadence/iconlist'][attribute][0].padding;
              item.borderWidth = blockConfigObject['kadence/iconlist'][attribute][0].borderWidth;
              item.style = blockConfigObject['kadence/iconlist'][attribute][0].style;
              item.level = (0,lodash__WEBPACK_IMPORTED_MODULE_3__.get)(blockConfigObject['kadence/iconlist'][attribute][0], 'level', 0);
              return item;
            });
          } else {
            attributes[attribute] = blockConfigObject['kadence/iconlist'][attribute];
          }
        });
      }

      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      kticonlistUniqueIDs.push('_' + clientId.substr(2, 9));
    } else if (kticonlistUniqueIDs.includes(uniqueID)) {
      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      kticonlistUniqueIDs.push('_' + clientId.substr(2, 9));
    } else {
      kticonlistUniqueIDs.push(uniqueID);
    }

    if (undefined !== listMargin && undefined !== listMargin[0] && listMargin[0] === listMargin[1] && listMargin[0] === listMargin[2] && listMargin[0] === listMargin[3]) {
      setMarginControl('linked');
    } else {
      setMarginControl('individual');
    }
  }, []);

  const componentDidUpdate = prevProps => {
    // Deselect images when deselecting the block
    if (!isSelected && prevProps.isSelected) {
      setFocusIndex(null);
    }
  };

  const createNewListItem = (value, entireOld, previousIndex) => {
    const previousValue = entireOld.replace(value, '');
    const amount = Math.abs(1 + listCount);
    const currentItems = items;
    const newItems = [{
      icon: currentItems[0].icon,
      link: currentItems[0].link,
      target: currentItems[0].target,
      size: currentItems[0].size,
      text: currentItems[0].text,
      width: currentItems[0].width,
      color: currentItems[0].color,
      background: currentItems[0].background,
      border: currentItems[0].border,
      borderRadius: currentItems[0].borderRadius,
      borderWidth: currentItems[0].borderWidth,
      padding: currentItems[0].padding,
      style: currentItems[0].style,
      level: (0,lodash__WEBPACK_IMPORTED_MODULE_3__.get)(currentItems[0], 'level', 0)
    }];
    const addin = Math.abs(previousIndex + 1);
    {
      (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(amount, n => {
        let ind = n;

        if (n === 0) {
          if (0 === previousIndex) {
            newItems[0].text = previousValue;
          }
        } else if (n === addin) {
          newItems.push({
            icon: currentItems[previousIndex].icon,
            link: currentItems[previousIndex].link,
            target: currentItems[previousIndex].target,
            size: currentItems[previousIndex].size,
            text: value,
            width: currentItems[previousIndex].width,
            color: currentItems[previousIndex].color,
            background: currentItems[previousIndex].background,
            border: currentItems[previousIndex].border,
            borderRadius: currentItems[previousIndex].borderRadius,
            borderWidth: currentItems[previousIndex].borderWidth,
            padding: currentItems[previousIndex].padding,
            style: currentItems[previousIndex].style,
            level: (0,lodash__WEBPACK_IMPORTED_MODULE_3__.get)(currentItems[previousIndex], 'level', 0)
          });
        } else if (n === previousIndex) {
          newItems.push({
            icon: currentItems[previousIndex].icon,
            link: currentItems[previousIndex].link,
            target: currentItems[previousIndex].target,
            size: currentItems[previousIndex].size,
            text: previousValue,
            width: currentItems[previousIndex].width,
            color: currentItems[previousIndex].color,
            background: currentItems[previousIndex].background,
            border: currentItems[previousIndex].border,
            borderRadius: currentItems[previousIndex].borderRadius,
            borderWidth: currentItems[previousIndex].borderWidth,
            padding: currentItems[previousIndex].padding,
            style: currentItems[previousIndex].style,
            level: (0,lodash__WEBPACK_IMPORTED_MODULE_3__.get)(currentItems[previousIndex], 'level', 0)
          });
        } else {
          if (n > addin) {
            ind = Math.abs(n - 1);
          }

          newItems.push({
            icon: currentItems[ind].icon,
            link: currentItems[ind].link,
            target: currentItems[ind].target,
            size: currentItems[ind].size,
            text: currentItems[ind].text,
            width: currentItems[ind].width,
            color: currentItems[ind].color,
            background: currentItems[ind].background,
            border: currentItems[ind].border,
            borderRadius: currentItems[ind].borderRadius,
            borderWidth: currentItems[ind].borderWidth,
            padding: currentItems[ind].padding,
            style: currentItems[ind].style,
            level: (0,lodash__WEBPACK_IMPORTED_MODULE_3__.get)(currentItems[ind], 'level', 0)
          });
        }
      });
      setAttributes({
        items: newItems
      });
      setAttributes({
        listCount: amount
      });
      setFocusIndex(addin);
      setFocusOnNewItem(addin, uniqueID);
    }
  }; // Silly Hack to handle focus.


  const setFocusOnNewItem = (index, uniqueID) => {
    setTimeout(function () {
      if (document.querySelector(`.kt-svg-icon-list-items${uniqueID} .kt-svg-icon-list-item-${index}`)) {
        const parent = document.querySelector(`.kt-svg-icon-list-items${uniqueID} .kt-svg-icon-list-item-${index}`);
        const rich = parent.querySelector('.rich-text');
        rich.focus();
      }
    }, 100);
  };

  const onSelectItem = index => {
    return () => {
      if (focusIndex !== index) {
        setFocusIndex({
          index
        });
      }
    };
  };

  const onMoveVertical = (oldIndex, newIndex) => {
    const items = [...items];
    items.splice(newIndex, 1, items[oldIndex]);
    items.splice(oldIndex, 1, items[newIndex]);
    setFocusIndex(newIndex);
    setAttributes({
      items
    });
  };

  const onMoveHorizontal = (index, newLevel) => {
    const items = [...items];
    items[index].level = newLevel;
    setAttributes({
      items
    });
  };

  const onMoveDown = oldIndex => {
    return () => {
      if (oldIndex === items.length - 1) {
        return;
      }

      onMoveVertical(oldIndex, oldIndex + 1);
    };
  };

  const onMoveUp = oldIndex => {
    return () => {
      if (oldIndex === 0) {
        return;
      }

      onMoveVertical(oldIndex, oldIndex - 1);
    };
  };

  const onMoveLeft = index => {
    return () => {
      if (items[index].level === 0) {
        return;
      }

      onMoveHorizontal(index, items[index].level - 1);
    };
  };

  const onMoveRight = index => {
    return () => {
      let currentLevel = (0,lodash__WEBPACK_IMPORTED_MODULE_3__.get)(items[index], 'level', 0);

      if (currentLevel === 5) {
        return;
      }

      onMoveHorizontal(index, currentLevel + 1);
    };
  };

  const saveListItem = (value, thisIndex) => {
    const currentItems = items;
    const newUpdate = currentItems.map((item, index) => {
      if (index === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      items: newUpdate
    });
  };

  const gconfig = {
    google: {
      families: [listStyles[0].family + (listStyles[0].variant ? ':' + listStyles[0].variant : '')]
    }
  };
  const config = listStyles[0].google ? gconfig : '';
  const previewFontSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== listStyles[0].size && undefined !== listStyles[0].size[0] ? listStyles[0].size[0] : '', undefined !== listStyles[0].size && undefined !== listStyles[0].size[1] ? listStyles[0].size[1] : '', undefined !== listStyles[0].size && undefined !== listStyles[0].size[2] ? listStyles[0].size[2] : '');
  const previewLineHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== listStyles[0].lineHeight && undefined !== listStyles[0].lineHeight[0] ? listStyles[0].lineHeight[0] : '', undefined !== listStyles[0].lineHeight && undefined !== listStyles[0].lineHeight[1] ? listStyles[0].lineHeight[1] : '', undefined !== listStyles[0].lineHeight && undefined !== listStyles[0].lineHeight[2] ? listStyles[0].lineHeight[2] : '');

  const saveListStyles = value => {
    const newUpdate = listStyles.map((item, index) => {
      if (index === 0) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      listStyles: newUpdate
    });
  };

  const saveAllListItem = value => {
    const newUpdate = items.map((item, index) => {
      item = { ...item,
        ...value
      };
      return item;
    });
    setAttributes({
      items: newUpdate
    });
  };

  const iconAlignOptions = [{
    key: 'top',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Top', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.alignTopIcon
  }, {
    key: 'middle',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Middle', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.alignMiddleIcon
  }, {
    key: 'bottom',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Bottom', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.alignBottomIcon
  }];

  const stopOnReplace = (value, index) => {
    if (value && undefined !== value[0] && undefined !== value[0].attributes && value[0].attributes.content) {
      saveListItem({
        text: value[0].attributes.content
      }, index);
    }
  };

  const removeListItem = (value, previousIndex) => {
    const amount = Math.abs(listCount);

    if (amount === 1) {
      // Remove Block.
      onDelete();
    } else {
      const newAmount = Math.abs(amount - 1);
      const currentItems = (0,lodash__WEBPACK_IMPORTED_MODULE_3__.filter)(items, (item, i) => previousIndex !== i);
      const addin = Math.abs(previousIndex - 1);
      setFocusIndex(addin);
      setAttributes({
        items: currentItems,
        listCount: newAmount
      });
    }
  };

  const blockToolControls = index => {
    const isLineSelected = isSelected && focusIndex === index && kadence_blocks_params.dynamic_enabled;

    if (!isLineSelected) {
      return;
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.DynamicTextControl, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      dynamicAttribute: 'items:' + index + ':text'
    }, attributes));
  };

  const renderIconSettings = index => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Item', 'kadence-blocks') + ' ' + (index + 1) + ' ' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Settings', 'kadence-blocks'),
      initialOpen: 1 === listCount ? true : false,
      panelName: 'kb-icon-item-' + index
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.URLInputControl, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Link', 'kadence-blocks'),
      url: items[index].link,
      onChangeUrl: value => {
        saveListItem({
          link: value
        }, index);
      },
      additionalControls: true,
      opensInNewTab: items[index].target && '_blank' == items[index].target ? true : false,
      onChangeTarget: value => {
        if (value) {
          saveListItem({
            target: '_blank'
          }, index);
        } else {
          saveListItem({
            target: '_self'
          }, index);
        }
      },
      dynamicAttribute: 'items:' + index + ':link',
      allowClear: true
    }, attributes)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.IconControl, {
      value: items[index].icon,
      onChange: value => {
        saveListItem({
          icon: value
        }, index);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Size'),
      value: items[index].size,
      onChange: value => {
        saveListItem({
          size: value
        }, index);
      },
      min: 5,
      max: 250
    }), items[index].icon && 'fe' === items[index].icon.substring(0, 2) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Line Width'),
      value: items[index].width,
      onChange: value => {
        saveListItem({
          width: value
        }, index);
      },
      step: 0.5,
      min: 0.5,
      max: 4
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Color'),
      value: items[index].color ? items[index].color : '',
      default: '',
      onChange: value => {
        saveListItem({
          color: value
        }, index);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Style'),
      value: items[index].style,
      options: [{
        value: 'default',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Default')
      }, {
        value: 'stacked',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Stacked')
      }],
      onChange: value => {
        saveListItem({
          style: value
        }, index);
      }
    }), items[index].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Background'),
      value: items[index].background ? items[index].background : '',
      default: '',
      onChange: value => {
        saveListItem({
          background: value
        }, index);
      }
    }), items[index].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Border Color'),
      value: items[index].border ? items[index].border : '',
      default: '',
      onChange: value => {
        saveListItem({
          border: value
        }, index);
      }
    }), items[index].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Border Size (px)'),
      value: items[index].borderWidth,
      onChange: value => {
        saveListItem({
          borderWidth: value
        }, index);
      },
      min: 0,
      max: 20
    }), items[index].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Border Radius (%)'),
      value: items[index].borderRadius,
      onChange: value => {
        saveListItem({
          borderRadius: value
        }, index);
      },
      min: 0,
      max: 50
    }), items[index].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Padding (px)'),
      value: items[index].padding,
      onChange: value => {
        saveListItem({
          padding: value
        }, index);
      },
      min: 0,
      max: 180
    }));
  };

  const renderSettings = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(listCount, n => renderIconSettings(n)));
  const renderToolControls = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(listCount, n => blockToolControls(n)));

  const renderIconsPreview = index => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: `kt-svg-icon-list-style-${items[index].style} kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${index} kt-svg-icon-list-level-${(0,lodash__WEBPACK_IMPORTED_MODULE_3__.get)(items[index], 'level', 0)}`
    }, items[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.IconRender, {
      className: `kt-svg-icon-list-single kt-svg-icon-list-single-${items[index].icon}`,
      name: items[index].icon,
      size: items[index].size,
      strokeWidth: 'fe' === items[index].icon.substring(0, 2) ? items[index].width : undefined,
      style: {
        color: items[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(items[index].color) : undefined,
        backgroundColor: items[index].background && items[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(items[index].background) : undefined,
        padding: items[index].padding && items[index].style !== 'default' ? items[index].padding + 'px' : undefined,
        borderColor: items[index].border && items[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(items[index].border) : undefined,
        borderWidth: items[index].borderWidth && items[index].style !== 'default' ? items[index].borderWidth + 'px' : undefined,
        borderRadius: items[index].borderRadius && items[index].style !== 'default' ? items[index].borderRadius + '%' : undefined
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.RichText, {
      tagName: "div",
      value: items[index].text,
      onChange: value => {
        saveListItem({
          text: value
        }, index);
      },
      onSplit: value => {
        if (!value) {
          return createNewListItem('', items[index].text, index);
        }

        return createNewListItem(value, items[index].text, index);
      },
      onRemove: value => {
        removeListItem(value, index);
      } //isSelected={ this.state.focusIndex === index }
      ,
      unstableOnFocus: () => onSelectItem(index),
      onReplace: value => {
        stopOnReplace(value, index);
      },
      className: 'kt-svg-icon-list-text'
    }));
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: className
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.BlockControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.BlockAlignmentToolbar, {
    value: blockAlignment,
    controls: ['center', 'left', 'right'],
    onChange: value => setAttributes({
      blockAlignment: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_moveItem__WEBPACK_IMPORTED_MODULE_7__["default"], {
    onMoveUp: value => onMoveUp(value),
    onMoveDown: value => onMoveDown(value),
    onMoveRight: value => onMoveRight(value),
    onMoveLeft: value => onMoveLeft(value),
    focusIndex: focusIndex,
    itemCount: items.length,
    level: (0,lodash__WEBPACK_IMPORTED_MODULE_3__.get)(items[focusIndex ? focusIndex : 0], 'level', 0)
  })), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('allSettings', 'kadence/iconlist') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.InspectorControlTabs, {
    panelName: 'icon-list',
    setActiveTab: value => setActiveTab(value),
    activeTab: activeTab
  }), activeTab === 'general' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('List Controls'),
    initialOpen: true,
    panelName: 'kb-icon-list-controls'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.StepControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Number of Items'),
    value: listCount,
    onChange: newcount => {
      const newitems = items;

      if (newitems.length < newcount) {
        const amount = Math.abs(newcount - newitems.length);
        {
          (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(amount, n => {
            newitems.push({
              icon: newitems[0].icon,
              link: newitems[0].link,
              target: newitems[0].target,
              size: newitems[0].size,
              width: newitems[0].width,
              color: newitems[0].color,
              background: newitems[0].background,
              border: newitems[0].border,
              borderRadius: newitems[0].borderRadius,
              borderWidth: newitems[0].borderWidth,
              padding: newitems[0].padding,
              style: newitems[0].style,
              level: (0,lodash__WEBPACK_IMPORTED_MODULE_3__.get)(newitems[0], 'level', 0)
            });
          });
        }
        setAttributes({
          items: newitems
        });
        saveListItem({
          size: items[0].size
        }, 0);
      }

      setAttributes({
        listCount: newcount
      });
    },
    min: 1,
    max: 40,
    step: 1
  }), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('column', 'kadence/iconlist') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('List Columns', 'kadence-blocks'),
    value: columns,
    onChange: value => setAttributes({
      columns: value
    }),
    tabletValue: tabletColumns ? tabletColumns : '',
    onChangeTablet: value => setAttributes({
      tabletColumns: value
    }),
    mobileValue: mobileColumns ? mobileColumns : '',
    onChangeMobile: value => setAttributes({
      mobileColumns: value
    }),
    min: 1,
    max: 3,
    step: 1,
    showUnit: false
  }), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('spacing', 'kadence/iconlist') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('List Vertical Spacing'),
    value: listGap,
    onChange: value => {
      setAttributes({
        listGap: value
      });
    },
    min: 0,
    max: 60
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('List Horizontal Icon and Label Spacing'),
    value: listLabelGap,
    onChange: value => {
      setAttributes({
        listLabelGap: value
      });
    },
    min: 0,
    max: 60
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-btn-size-settings-container"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
    className: "kt-beside-btn-group"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Align')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
    className: "kt-button-size-type-options",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Align')
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(iconAlignOptions, _ref2 => {
    let {
      name,
      icon,
      key
    } = _ref2;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Tooltip, {
      text: name
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
      key: key,
      className: "kt-btn-size-btn",
      isSmall: true,
      isPrimary: iconAlign === key,
      "aria-pressed": iconAlign === key,
      onClick: () => setAttributes({
        iconAlign: key
      })
    }, icon));
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('List Margin'),
    measurement: undefined !== listMargin ? listMargin : [0, 0, 10, 0],
    control: marginControl,
    onChange: value => setAttributes({
      listMargin: value
    }),
    onControl: value => setState({
      marginControl: value
    }),
    min: -200,
    max: 200,
    step: 1
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-sidebar-settings-spacer"
  }), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('individualIcons', 'kadence/iconlist') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Individual list Item Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-list-individual-item-settings'
  }, renderSettings)), activeTab === 'style' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('textStyle', 'kadence/iconlist') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('List Text Styling'),
    panelName: 'kb-list-text-styling'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Color Settings'),
    value: listStyles[0].color ? listStyles[0].color : '',
    default: '',
    onChange: value => {
      saveListStyles({
        color: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.TypographyControls, {
    fontSize: listStyles[0].size,
    onFontSize: value => saveListStyles({
      size: value
    }),
    fontSizeType: listStyles[0].sizeType,
    onFontSizeType: value => saveListStyles({
      sizeType: value
    }),
    lineHeight: listStyles[0].lineHeight,
    onLineHeight: value => saveListStyles({
      lineHeight: value
    }),
    lineHeightType: listStyles[0].lineType,
    onLineHeightType: value => saveListStyles({
      lineType: value
    }),
    letterSpacing: listStyles[0].letterSpacing,
    onLetterSpacing: value => saveListStyles({
      letterSpacing: value
    }),
    fontFamily: listStyles[0].family,
    onFontFamily: value => saveListStyles({
      family: value
    }),
    onFontChange: select => {
      saveListStyles({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => saveListStyles(values),
    googleFont: listStyles[0].google,
    onGoogleFont: value => saveListStyles({
      google: value
    }),
    loadGoogleFont: listStyles[0].loadGoogle,
    onLoadGoogleFont: value => saveListStyles({
      loadGoogle: value
    }),
    fontVariant: listStyles[0].variant,
    onFontVariant: value => saveListStyles({
      variant: value
    }),
    fontWeight: listStyles[0].weight,
    onFontWeight: value => saveListStyles({
      weight: value
    }),
    fontStyle: listStyles[0].style,
    onFontStyle: value => saveListStyles({
      style: value
    }),
    fontSubset: listStyles[0].subset,
    onFontSubset: value => saveListStyles({
      subset: value
    }),
    textTransform: listStyles[0].textTransform,
    onTextTransform: value => saveListStyles({
      textTransform: value
    })
  }))), activeTab === 'advanced' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('joinedIcons', 'kadence/iconlist') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Edit All Icon Styles Together'),
    panelName: 'kb-icon-all-styles'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('PLEASE NOTE: This will override individual list item settings.')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.IconControl, {
    value: items[0].icon,
    onChange: value => {
      if (value !== items[0].icon) {
        saveAllListItem({
          icon: value
        });
      }
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Size'),
    value: items[0].size,
    onChange: value => {
      saveAllListItem({
        size: value
      });
    },
    min: 5,
    max: 250
  }), items[0].icon && 'fe' === items[0].icon.substring(0, 2) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Line Width'),
    value: items[0].width,
    onChange: value => {
      saveAllListItem({
        width: value
      });
    },
    step: 0.5,
    min: 0.5,
    max: 4
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Color'),
    value: items[0].color ? items[0].color : '',
    default: '',
    onChange: value => {
      saveAllListItem({
        color: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Style'),
    value: items[0].style,
    options: [{
      value: 'default',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Default')
    }, {
      value: 'stacked',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Stacked')
    }],
    onChange: value => {
      saveAllListItem({
        style: value
      });
    }
  }), items[0].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Background'),
    value: items[0].background ? items[0].background : '',
    default: '',
    onChange: value => {
      saveAllListItem({
        background: value
      });
    }
  }), items[0].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Border Color'),
    value: items[0].border ? items[0].border : '',
    default: '',
    onChange: value => {
      saveAllListItem({
        border: value
      });
    }
  }), items[0].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Border Size (px)'),
    value: items[0].borderWidth,
    onChange: value => {
      saveAllListItem({
        borderWidth: value
      });
    },
    min: 0,
    max: 20
  }), items[0].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Border Radius (%)'),
    value: items[0].borderRadius,
    onChange: value => {
      saveAllListItem({
        borderRadius: value
      });
    },
    min: 0,
    max: 50
  }), items[0].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Padding (px)'),
    value: items[0].padding,
    onChange: value => {
      saveAllListItem({
        padding: value
      });
    },
    min: 0,
    max: 180
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("style", null, `.kt-svg-icon-list-items${uniqueID} .kt-svg-icon-list-item-wrap:not(:last-child) { margin-bottom: ${listGap}px; }`, `body:not(.rtl) .kt-svg-icon-list-items${uniqueID} .kt-svg-icon-list-single { margin-right: ${listLabelGap}px; }`, `body.rtl .kt-svg-icon-list-items${uniqueID} .kt-svg-icon-list-single { margin-left: ${listLabelGap}px; }`, `.kt-svg-icon-list-items${uniqueID} .kt-svg-icon-list-item-wrap {
							font-weight: ${listStyles[0].weight ? listStyles[0].weight : ''};
							font-style: ${listStyles[0].style ? listStyles[0].style : ''};
							color:  ${listStyles[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(listStyles[0].color) : ''};
							font-size: ${previewFontSize ? previewFontSize + listStyles[0].sizeType : ''};
							line-height: ${previewLineHeight ? previewLineHeight + listStyles[0].lineType : ''};
							letter-spacing: ${listStyles[0].letterSpacing ? listStyles[0].letterSpacing + 'px' : ''};
							font-family: ${listStyles[0].family ? listStyles[0].family : ''};
							text-transform: ${listStyles[0].textTransform ? listStyles[0].textTransform : ''};
						}`), listStyles[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.WebfontLoader, {
    config: config
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    ref: container,
    className: `kt-svg-icon-list-container kt-svg-icon-list-items${uniqueID} kt-svg-icon-list-columns-${columns}${undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : ''}${undefined !== tabletColumns && '' !== tabletColumns ? ' kt-tablet-svg-icon-list-columns-' + tabletColumns : ''}${undefined !== mobileColumns && '' !== mobileColumns ? ' kt-mobile-svg-icon-list-columns-' + mobileColumns : ''}`,
    style: {
      margin: listMargin && undefined !== listMargin[0] && null !== listMargin[0] ? listMargin[0] + 'px ' + listMargin[1] + 'px ' + listMargin[2] + 'px ' + listMargin[3] + 'px' : ''
    }
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(listCount, n => renderIconsPreview(n)), isSelected && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
    isDefault: true,
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_13__["default"],
    onClick: () => {
      const newitems = items;
      const newcount = listCount + 1;

      if (newitems.length < newcount) {
        const amount = Math.abs(newcount - newitems.length);
        {
          (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(amount, n => {
            newitems.push({
              icon: newitems[0].icon,
              link: newitems[0].link,
              target: newitems[0].target,
              size: newitems[0].size,
              width: newitems[0].width,
              color: newitems[0].color,
              background: newitems[0].background,
              border: newitems[0].border,
              borderRadius: newitems[0].borderRadius,
              borderWidth: newitems[0].borderWidth,
              padding: newitems[0].padding,
              style: newitems[0].style,
              level: (0,lodash__WEBPACK_IMPORTED_MODULE_3__.get)(newitems[0], 'level', 0)
            });
          });
        }
        setAttributes({
          items: newitems
        });
        saveListItem({
          size: items[0].size
        }, 0);
      }

      setAttributes({
        listCount: newcount
      });
    },
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Add List Item', 'kadence-blocks')
  }))));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_11__.compose)([(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_12__.withSelect)((select, ownProps) => {
  return {
    getPreviewDevice: select('kadenceblocks/data').getPreviewDeviceType()
  };
}), (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_12__.withDispatch)((dispatch, _ref3) => {
  let {
    clientId,
    rootClientId
  } = _ref3;
  const {
    removeBlock
  } = dispatch('core/block-editor');
  return {
    onDelete: () => {
      removeBlock(clientId, rootClientId);
    }
  };
})])(KadenceIconLists));

/***/ }),

/***/ "./src/blocks/icon-list/moveItem.js":
/*!******************************************!*\
  !*** ./src/blocks/icon-list/moveItem.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);


/**
 * Move Icon List Items Component
 *
 */


const {
  Component,
  Fragment
} = wp.element;

/**
 * Build the icon list move controls
 */

class MoveItem extends Component {
  constructor() {
    super(...arguments);
  }

  componentDidMount() {}

  render() {
    const {
      onMoveUp,
      onMoveDown,
      onMoveRight,
      onMoveLeft,
      focusIndex,
      itemCount,
      level
    } = this.props;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Toolbar, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.DropdownMenu, {
      className: "block-editor-block-settings-menu",
      icon: 'move',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Move items', 'kadence-blocks'),
      popoverProps: {
        className: 'block-editor-block-settings-menu__popover',
        position: 'bottom right'
      }
    }, _ref => {
      let {
        onClose
      } = _ref;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.MenuGroup, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.MenuItem, {
        icon: 'arrow-up',
        disabled: focusIndex === 0,
        onClick: (0,lodash__WEBPACK_IMPORTED_MODULE_1__.flow)(onClose, onMoveUp(focusIndex)),
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Move Up', 'kadence-blocks')
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Move Up', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.MenuItem, {
        icon: 'arrow-down',
        disabled: focusIndex === itemCount - 1,
        onClick: (0,lodash__WEBPACK_IMPORTED_MODULE_1__.flow)(onClose, onMoveDown(focusIndex)),
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Move Down', 'kadence-blocks')
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Move Down', 'kadence-blocks'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.MenuGroup, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.MenuItem, {
        icon: 'arrow-left',
        disabled: level === 0,
        onClick: (0,lodash__WEBPACK_IMPORTED_MODULE_1__.flow)(onClose, onMoveLeft(focusIndex)),
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Decrease Indent', 'kadence-blocks')
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Decrease Indent', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.MenuItem, {
        icon: 'arrow-right',
        onClick: (0,lodash__WEBPACK_IMPORTED_MODULE_1__.flow)(onClose, onMoveRight(focusIndex)),
        disabled: level === 5,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Increase Indent', 'kadence-blocks')
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Increase Indent', 'kadence-blocks'))));
    }));
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MoveItem);

/***/ }),

/***/ "./src/blocks/icon-list/save.js":
/*!**************************************!*\
  !*** ./src/blocks/icon-list/save.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);



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
    items,
    listCount,
    columns,
    blockAlignment,
    iconAlign,
    uniqueID,
    tabletColumns,
    mobileColumns
  } = attributes;

  const renderItems = index => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("li", {
      className: `kt-svg-icon-list-style-${items[index].style} kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${index} kt-svg-icon-list-level-${items[index].level}`
    }, items[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("a", {
      href: items[index].link,
      className: 'kt-svg-icon-link',
      target: '_blank' === items[index].target ? items[index].target : undefined,
      rel: '_blank' === items[index].target ? 'noopener noreferrer' : undefined
    }, items[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
      className: `kt-svg-icon-list-single kt-svg-icon-list-single-${items[index].icon}`,
      name: items[index].icon,
      size: items[index].size,
      strokeWidth: 'fe' === items[index].icon.substring(0, 2) ? items[index].width : undefined,
      ariaHidden: 'true',
      style: {
        color: items[index].color ? (0,_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(items[index].color) : undefined,
        backgroundColor: items[index].background && items[index].style !== 'default' ? (0,_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(items[index].background) : undefined,
        padding: items[index].padding && items[index].style !== 'default' ? items[index].padding + 'px' : undefined,
        borderColor: items[index].border && items[index].style !== 'default' ? (0,_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(items[index].border) : undefined,
        borderWidth: items[index].borderWidth && items[index].style !== 'default' ? items[index].borderWidth + 'px' : undefined,
        borderRadius: items[index].borderRadius && items[index].style !== 'default' ? items[index].borderRadius + '%' : undefined
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
      tagName: "span",
      value: items[index].text,
      className: 'kt-svg-icon-list-text'
    })), !items[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, items[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
      className: `kt-svg-icon-list-single kt-svg-icon-list-single-${items[index].icon}`,
      name: items[index].icon,
      size: items[index].size,
      strokeWidth: 'fe' === items[index].icon.substring(0, 2) ? items[index].width : undefined,
      ariaHidden: 'true',
      style: {
        color: items[index].color ? (0,_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(items[index].color) : undefined,
        backgroundColor: items[index].background && items[index].style !== 'default' ? (0,_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(items[index].background) : undefined,
        padding: items[index].padding && items[index].style !== 'default' ? items[index].padding + 'px' : undefined,
        borderColor: items[index].border && items[index].style !== 'default' ? (0,_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(items[index].border) : undefined,
        borderWidth: items[index].borderWidth && items[index].style !== 'default' ? items[index].borderWidth + 'px' : undefined,
        borderRadius: items[index].borderRadius && items[index].style !== 'default' ? items[index].borderRadius + '%' : undefined,
        marginTop: items[index].marginTop ? items[index].marginTop + 'px' : undefined,
        marginRight: items[index].marginRight ? items[index].marginRight + 'px' : undefined,
        marginBottom: items[index].marginBottom ? items[index].marginBottom + 'px' : undefined,
        marginLeft: items[index].marginLeft ? items[index].marginLeft + 'px' : undefined
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
      tagName: "span",
      value: items[index].text,
      className: 'kt-svg-icon-list-text'
    })));
  };

  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({});
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, blockProps, {
    className: `wp-block-kadence-iconlist kt-svg-icon-list-items kt-svg-icon-list-items${uniqueID} kt-svg-icon-list-columns-${columns} align${blockAlignment ? blockAlignment : 'none'}${undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : ''}${undefined !== tabletColumns && '' !== tabletColumns ? ' kt-tablet-svg-icon-list-columns-' + tabletColumns : ''}${undefined !== mobileColumns && '' !== mobileColumns ? ' kt-mobile-svg-icon-list-columns-' + mobileColumns : ''}`
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("ul", {
    className: "kt-svg-icon-list"
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.times)(listCount, n => renderItems(n))));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Save);

/***/ }),

/***/ "./src/blocks/icon-list/transforms.js":
/*!********************************************!*\
  !*** ./src/blocks/icon-list/transforms.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/rich-text */ "@wordpress/rich-text");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */




const lineSep = _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.LINE_SEPARATOR ? _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.LINE_SEPARATOR : _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.__UNSTABLE_LINE_SEPARATOR;
const transforms = {
  from: [{
    type: 'block',
    blocks: ['core/list'],
    transform: _ref => {
      let {
        values
      } = _ref;
      const listArray = (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.split)((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.create)({
        html: values,
        multilineTag: 'li',
        multilineWrapperTags: ['ul', 'ol']
      }), lineSep);
      const newitems = [{
        icon: 'fe_checkCircle',
        link: '',
        target: '_self',
        size: 20,
        width: 2,
        text: (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.toHTMLString)({
          value: listArray[0]
        }),
        color: '',
        background: '',
        border: '',
        borderRadius: 0,
        padding: 5,
        borderWidth: 1,
        style: 'default',
        level: 0
      }];
      const amount = Math.abs(listArray.length);
      {
        (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(amount, n => {
          if (n !== 0) {
            newitems.push({
              icon: 'fe_checkCircle',
              link: '',
              target: '_self',
              size: 20,
              width: 2,
              text: (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.toHTMLString)({
                value: listArray[n]
              }),
              color: '',
              background: '',
              border: '',
              borderRadius: 0,
              padding: 5,
              borderWidth: 1,
              style: 'default',
              level: 0
            });
          }
        });
      }
      return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('kadence/iconlist', {
        items: newitems,
        listCount: amount
      });
    }
  }],
  to: [{
    type: 'block',
    blocks: ['core/list'],
    transform: blockAttributes => {
      return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/list', {
        values: (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.toHTMLString)({
          value: (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.join)(blockAttributes.items.map(_ref2 => {
            let {
              text
            } = _ref2;
            return (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.create)({
              html: text
            });
          }), lineSep),
          multilineTag: 'li'
        })
      });
    }
  }]
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (transforms);

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = window["lodash"];

/***/ }),

/***/ "@kadence/components":
/*!*****************************************!*\
  !*** external ["kadence","components"] ***!
  \*****************************************/
/***/ ((module) => {

module.exports = window["kadence"]["components"];

/***/ }),

/***/ "@kadence/helpers":
/*!**************************************!*\
  !*** external ["kadence","helpers"] ***!
  \**************************************/
/***/ ((module) => {

module.exports = window["kadence"]["helpers"];

/***/ }),

/***/ "@kadence/icons":
/*!************************************!*\
  !*** external ["kadence","icons"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["kadence"]["icons"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["primitives"];

/***/ }),

/***/ "@wordpress/rich-text":
/*!**********************************!*\
  !*** external ["wp","richText"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["richText"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

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

/***/ "./src/blocks/icon-list/block.json":
/*!*****************************************!*\
  !*** ./src/blocks/icon-list/block.json ***!
  \*****************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Icon List","name":"kadence/iconlist","category":"kadence-blocks","attributes":{"items":{"type":"array","default":[{"icon":"fe_checkCircle","link":"","target":"_self","size":20,"width":2,"text":"","color":"","background":"","border":"","borderRadius":0,"padding":5,"borderWidth":1,"style":"default","level":0}]},"listStyles":{"type":"array","default":[{"size":["","",""],"sizeType":"px","lineHeight":["","",""],"lineType":"px","letterSpacing":"","family":"","google":false,"style":"","weight":"","variant":"","subset":"","loadGoogle":true,"color":"","textTransform":""}]},"listCount":{"type":"number","default":1},"columns":{"type":"number","default":1},"tabletColumns":{"type":"number","default":""},"mobileColumns":{"type":"number","default":""},"listGap":{"type":"number","default":5},"listLabelGap":{"type":"number","default":10},"uniqueID":{"type":"string","default":""},"blockAlignment":{"type":"string","default":"none"},"listMargin":{"type":"array","default":[0,0,10,0]},"iconAlign":{"type":"string","default":"middle"}},"supports":{"ktdynamic":true}}');

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
/******/ 			"blocks-icon-list": 0,
/******/ 			"./style-blocks-icon-list": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-blocks-icon-list"], () => (__webpack_require__("./src/blocks/icon-list/block.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	(this.kadence = this.kadence || {})["blocks-icon-list"] = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=blocks-icon-list.js.map