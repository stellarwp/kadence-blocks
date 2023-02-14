/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/icon/editor.scss":
/*!*************************************!*\
  !*** ./src/blocks/icon/editor.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/icon/style.scss":
/*!************************************!*\
  !*** ./src/blocks/icon/style.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/icon/block.js":
/*!**********************************!*\
  !*** ./src/blocks/icon/block.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block.json */ "./src/blocks/icon/block.json");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./edit */ "./src/blocks/icon/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./save */ "./src/blocks/icon/save.js");
/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./deprecated */ "./src/blocks/icon/deprecated.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/icon/style.scss");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__);


/**
 * BLOCK: Kadence Icon
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

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_10__.registerBlockType)('kadence/icon', { ..._block_json__WEBPACK_IMPORTED_MODULE_1__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Icon', 'kadence-blocks'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Create engaging lists with icons for bullets.', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('icon', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('svg', 'kadence-blocks'), 'KB'],
  icon: {
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.iconIcon
  },

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

  edit: _edit__WEBPACK_IMPORTED_MODULE_6__["default"],
  save: props => {
    const {
      attributes: {
        icons,
        iconCount,
        blockAlignment,
        textAlignment,
        uniqueID,
        verticalAlignment
      }
    } = props;

    const renderSaveIcons = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
      }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: icons[index].link,
        className: 'kt-svg-icon-link',
        target: '_blank' === icons[index].target ? icons[index].target : undefined,
        rel: '_blank' === icons[index].target ? 'noopener noreferrer' : undefined,
        "aria-label": undefined !== icons[index].linkTitle && '' !== icons[index].linkTitle ? icons[index].linkTitle : undefined,
        style: {
          marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
          marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
          marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
          marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconSpanTag, {
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
        name: icons[index].icon,
        size: icons[index].size,
        strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
        title: icons[index].title ? icons[index].title : '',
        ariaHidden: icons[index].title ? undefined : 'true',
        style: {
          color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].color) : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].background) : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].border) : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
        }
      })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconSpanTag, {
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
        name: icons[index].icon,
        size: icons[index].size,
        strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
        title: icons[index].title ? icons[index].title : '',
        ariaHidden: icons[index].title ? undefined : 'true',
        style: {
          color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].color) : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].background) : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].border) : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined,
          marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
          marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
          marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
          marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
        }
      }));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'none'}${verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : ''}`,
      style: {
        textAlign: textAlignment ? textAlignment : 'center'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(iconCount, n => renderSaveIcons(n)));
  },
  deprecated: [{
    attributes: {
      icons: {
        type: 'array',
        default: [{
          icon: 'fe_aperture',
          link: '',
          target: '_self',
          size: 50,
          width: 2,
          title: '',
          color: '#444444',
          background: 'transparent',
          border: '#444444',
          borderRadius: 0,
          borderWidth: 2,
          padding: 20,
          style: 'default',
          marginTop: 0,
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          hColor: '',
          hBackground: '',
          hBorder: '',
          linkTitle: ''
        }]
      },
      iconCount: {
        type: 'number',
        default: 1
      },
      uniqueID: {
        type: 'string',
        default: ''
      },
      blockAlignment: {
        type: 'string',
        default: ''
      },
      textAlignment: {
        type: 'string',
        default: 'center'
      },
      tabletTextAlignment: {
        type: 'string'
      },
      mobileTextAlignment: {
        type: 'string'
      },
      verticalAlignment: {
        type: 'string'
      },
      inQueryBlock: {
        type: 'bool',
        default: false
      }
    },
    save: props => {
      const {
        attributes: {
          icons,
          iconCount,
          blockAlignment,
          textAlignment,
          uniqueID,
          verticalAlignment
        }
      } = props;

      const renderSaveIcons = index => {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
        }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: icons[index].link,
          className: 'kt-svg-icon-link',
          target: '_blank' === icons[index].target ? icons[index].target : undefined,
          rel: '_blank' === icons[index].target ? 'noopener noreferrer' : undefined,
          "aria-label": undefined !== icons[index].linkTitle && '' !== icons[index].linkTitle ? icons[index].linkTitle : undefined,
          style: {
            marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
            marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
            marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
            marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
          }
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconRender, {
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
          name: icons[index].icon,
          size: icons[index].size,
          strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
          title: icons[index].title ? icons[index].title : '',
          ariaHidden: icons[index].title ? undefined : 'true',
          style: {
            color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].color) : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].background) : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].border) : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
          }
        })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconRender, {
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
          name: icons[index].icon,
          size: icons[index].size,
          strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
          title: icons[index].title ? icons[index].title : '',
          ariaHidden: icons[index].title ? undefined : 'true',
          style: {
            color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].color) : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].background) : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].border) : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined,
            marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
            marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
            marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
            marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
          }
        }));
      };

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'none'}${verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : ''}`,
        style: {
          textAlign: textAlignment ? textAlignment : 'center'
        }
      }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(iconCount, n => renderSaveIcons(n)));
    }
  }, {
    attributes: {
      icons: {
        type: 'array',
        default: [{
          icon: 'fe_aperture',
          link: '',
          target: '_self',
          size: 50,
          width: 2,
          title: '',
          color: '#444444',
          background: 'transparent',
          border: '#444444',
          borderRadius: 0,
          borderWidth: 2,
          padding: 20,
          style: 'default',
          marginTop: 0,
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          hColor: '',
          hBackground: '',
          hBorder: ''
        }]
      },
      iconCount: {
        type: 'number',
        default: 1
      },
      uniqueID: {
        type: 'string',
        default: ''
      },
      blockAlignment: {
        type: 'string',
        default: 'center'
      },
      textAlignment: {
        type: 'string',
        default: 'center'
      },
      tabletTextAlignment: {
        type: 'string'
      },
      mobileTextAlignment: {
        type: 'string'
      }
    },
    save: _ref2 => {
      let {
        attributes
      } = _ref2;
      const {
        icons,
        iconCount,
        blockAlignment,
        textAlignment,
        uniqueID,
        verticalAlignment
      } = attributes;

      const renderSaveIcons = index => {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
        }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: icons[index].link,
          className: 'kt-svg-icon-link',
          target: '_blank' === icons[index].target ? icons[index].target : undefined,
          rel: '_blank' === icons[index].target ? 'noopener noreferrer' : undefined,
          "aria-label": undefined !== icons[index].linkTitle && '' !== icons[index].linkTitle ? icons[index].linkTitle : undefined,
          style: {
            marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
            marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
            marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
            marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
          }
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconRender, {
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
          name: icons[index].icon,
          size: icons[index].size,
          strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
          title: icons[index].title ? icons[index].title : '',
          ariaHidden: icons[index].title ? undefined : 'true',
          style: {
            color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].color) : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].background) : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].border) : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
          }
        })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconRender, {
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
          name: icons[index].icon,
          size: icons[index].size,
          strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
          title: icons[index].title ? icons[index].title : '',
          ariaHidden: icons[index].title ? undefined : 'true',
          style: {
            color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].color) : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].background) : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].border) : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined,
            marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
            marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
            marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
            marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
          }
        }));
      };

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'center'}${verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : ''}`,
        style: {
          textAlign: textAlignment ? textAlignment : 'center'
        }
      }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(iconCount, n => renderSaveIcons(n)));
    }
  }, {
    attributes: {
      icons: {
        type: 'array',
        default: [{
          icon: 'fe_aperture',
          link: '',
          target: '_self',
          size: 50,
          width: 2,
          title: '',
          color: '#444444',
          background: 'transparent',
          border: '#444444',
          borderRadius: 0,
          borderWidth: 2,
          padding: 20,
          style: 'default',
          marginTop: 0,
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          hColor: '',
          hBackground: '',
          hBorder: ''
        }]
      },
      iconCount: {
        type: 'number',
        default: 1
      },
      uniqueID: {
        type: 'string',
        default: ''
      },
      blockAlignment: {
        type: 'string',
        default: 'center'
      },
      textAlignment: {
        type: 'string',
        default: 'center'
      },
      tabletTextAlignment: {
        type: 'string'
      },
      mobileTextAlignment: {
        type: 'string'
      }
    },
    save: _ref3 => {
      let {
        attributes
      } = _ref3;
      const {
        icons,
        iconCount,
        blockAlignment,
        textAlignment,
        uniqueID,
        verticalAlignment
      } = attributes;

      const renderSaveIcons = index => {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
        }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: icons[index].link,
          className: 'kt-svg-icon-link',
          target: '_blank' === icons[index].target ? icons[index].target : undefined,
          rel: '_blank' === icons[index].target ? 'noopener noreferrer' : undefined,
          "aria-label": undefined !== icons[index].linkTitle && '' !== icons[index].linkTitle ? icons[index].linkTitle : undefined,
          style: {
            marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
            marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
            marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
            marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
          }
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconRender, {
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
          name: icons[index].icon,
          size: icons[index].size,
          strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
          title: icons[index].title ? icons[index].title : '',
          style: {
            color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].color) : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].background) : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].border) : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
          }
        })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconRender, {
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
          name: icons[index].icon,
          size: icons[index].size,
          strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
          title: icons[index].title ? icons[index].title : '',
          style: {
            color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].color) : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].background) : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].border) : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined,
            marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
            marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
            marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
            marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
          }
        }));
      };

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'center'}${verticalAlignment ? verticalAlignment : ''}`,
        style: {
          textAlign: textAlignment ? textAlignment : 'center'
        }
      }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(iconCount, n => renderSaveIcons(n)));
    }
  }, {
    attributes: {
      icons: {
        type: 'array',
        default: [{
          icon: 'fe_aperture',
          link: '',
          target: '_self',
          size: 50,
          width: 2,
          title: '',
          color: '#444444',
          background: 'transparent',
          border: '#444444',
          borderRadius: 0,
          borderWidth: 2,
          padding: 20,
          style: 'default'
        }]
      },
      iconCount: {
        type: 'number',
        default: 1
      },
      uniqueID: {
        type: 'string',
        default: ''
      },
      blockAlignment: {
        type: 'string',
        default: 'center'
      },
      textAlignment: {
        type: 'string',
        default: 'center'
      }
    },
    save: _ref4 => {
      let {
        attributes
      } = _ref4;
      const {
        icons,
        iconCount,
        blockAlignment,
        textAlignment,
        uniqueID
      } = attributes;

      const renderSaveIcons = index => {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
        }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: icons[index].link,
          className: 'kt-svg-icon-link',
          target: '_blank' === icons[index].target ? icons[index].target : undefined,
          rel: '_blank' === icons[index].target ? 'noopener noreferrer' : undefined
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconRender, {
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
          name: icons[index].icon,
          size: icons[index].size,
          strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
          title: icons[index].title ? icons[index].title : '',
          style: {
            color: icons[index].color ? icons[index].color : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
          }
        })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconRender, {
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
          name: icons[index].icon,
          size: icons[index].size,
          strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
          title: icons[index].title ? icons[index].title : '',
          style: {
            color: icons[index].color ? icons[index].color : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
          }
        }));
      };

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'center'}`,
        style: {
          textAlign: textAlignment ? textAlignment : 'center'
        }
      }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(iconCount, n => renderSaveIcons(n)));
    }
  }, {
    attributes: {
      icons: {
        type: 'array',
        default: [{
          icon: 'fe_aperture',
          link: '',
          target: '_self',
          size: 50,
          width: 2,
          title: '',
          color: '#444444',
          background: 'transparent',
          border: '#444444',
          borderRadius: 0,
          borderWidth: 2,
          padding: 20,
          style: 'default'
        }]
      },
      iconCount: {
        type: 'number',
        default: 1
      },
      uniqueID: {
        type: 'string',
        default: ''
      },
      blockAlignment: {
        type: 'string',
        default: 'center'
      },
      textAlignment: {
        type: 'string',
        default: 'center'
      }
    },
    save: _ref5 => {
      let {
        attributes
      } = _ref5;
      const {
        icons,
        iconCount,
        blockAlignment,
        textAlignment,
        uniqueID
      } = attributes;

      const renderSaveIcons = index => {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
        }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: icons[index].link,
          className: 'kt-svg-icon-link',
          target: '_blank' === icons[index].target ? icons[index].target : undefined,
          rel: '_blank' === icons[index].target ? 'noopener noreferrer' : undefined
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          style: {
            color: icons[index].color ? icons[index].color : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
          },
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`
        })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          style: {
            color: icons[index].color ? icons[index].color : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
          },
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`
        }));
      };

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'center'}`,
        style: {
          textAlign: textAlignment ? textAlignment : 'center'
        }
      }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(iconCount, n => renderSaveIcons(n)));
    }
  }, {
    attributes: {
      icons: {
        type: 'array',
        default: [{
          icon: 'fe_aperture',
          link: '',
          target: '_self',
          size: 50,
          width: 2,
          title: '',
          color: '#444444',
          background: 'transparent',
          border: '#444444',
          borderRadius: 0,
          borderWidth: 2,
          padding: 20,
          style: 'default'
        }]
      },
      iconCount: {
        type: 'number',
        default: 1
      },
      uniqueID: {
        type: 'string',
        default: ''
      },
      blockAlignment: {
        type: 'string',
        default: 'center'
      },
      textAlignment: {
        type: 'string',
        default: 'center'
      }
    },
    save: _ref6 => {
      let {
        attributes
      } = _ref6;
      const {
        icons,
        iconCount,
        blockAlignment,
        textAlignment,
        uniqueID
      } = attributes;

      const renderSaveIcons = index => {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
        }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: icons[index].link,
          className: 'kt-svg-icon-link',
          target: icons[index].target
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconRender, {
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
          name: icons[index].icon,
          size: icons[index].size,
          strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
          title: icons[index].title ? icons[index].title : '',
          style: {
            color: icons[index].color ? icons[index].color : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
          }
        })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconRender, {
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
          name: icons[index].icon,
          size: icons[index].size,
          strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
          title: icons[index].title ? icons[index].title : '',
          style: {
            color: icons[index].color ? icons[index].color : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
          }
        }));
      };

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'center'}`,
        style: {
          textAlign: textAlignment ? textAlignment : 'center'
        }
      }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(iconCount, n => renderSaveIcons(n)));
    }
  }, {
    attributes: {
      icons: {
        type: 'array',
        default: [{
          icon: 'fe_aperture',
          link: '',
          target: '_self',
          size: 50,
          width: 2,
          title: '',
          color: '#444444',
          background: 'transparent',
          border: '#444444',
          borderRadius: 0,
          borderWidth: 2,
          padding: 20,
          style: 'default'
        }]
      },
      iconCount: {
        type: 'number',
        default: 1
      },
      uniqueID: {
        type: 'string',
        default: ''
      },
      blockAlignment: {
        type: 'string',
        default: 'center'
      },
      textAlignment: {
        type: 'string',
        default: 'center'
      }
    },
    save: _ref7 => {
      let {
        attributes
      } = _ref7;
      const {
        icons,
        iconCount,
        blockAlignment,
        textAlignment,
        uniqueID
      } = attributes;

      const renderSaveIcons = index => {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
        }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: icons[index].link,
          className: 'kt-svg-icon-link',
          target: icons[index].target,
          rel: "noopener noreferrer"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconRender, {
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
          name: icons[index].icon,
          size: icons[index].size,
          strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
          title: icons[index].title ? icons[index].title : '',
          style: {
            color: icons[index].color ? icons[index].color : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
          }
        })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconRender, {
          className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
          name: icons[index].icon,
          size: icons[index].size,
          strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
          title: icons[index].title ? icons[index].title : '',
          style: {
            color: icons[index].color ? icons[index].color : undefined,
            backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
            padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
            borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
            borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
            borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
          }
        }));
      };

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'center'}`,
        style: {
          textAlign: textAlignment ? textAlignment : 'center'
        }
      }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(iconCount, n => renderSaveIcons(n)));
    }
  }]
});

/***/ }),

/***/ "./src/blocks/icon/deprecated.js":
/*!***************************************!*\
  !*** ./src/blocks/icon/deprecated.js ***!
  \***************************************/
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
    icons: {
      type: 'array',
      default: [{
        icon: 'fe_aperture',
        link: '',
        target: '_self',
        size: 50,
        width: 2,
        title: '',
        color: '#444444',
        background: 'transparent',
        border: '#444444',
        borderRadius: 0,
        borderWidth: 2,
        padding: 20,
        style: 'default',
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        hColor: '',
        hBackground: '',
        hBorder: ''
      }]
    },
    iconCount: {
      type: 'number',
      default: 1
    },
    uniqueID: {
      type: 'string',
      default: ''
    },
    blockAlignment: {
      type: 'string',
      default: 'center'
    },
    textAlignment: {
      type: 'string',
      default: 'center'
    },
    tabletTextAlignment: {
      type: 'string'
    },
    mobileTextAlignment: {
      type: 'string'
    }
  },
  save: _ref => {
    let {
      attributes
    } = _ref;
    const {
      icons,
      iconCount,
      blockAlignment,
      textAlignment,
      uniqueID,
      verticalAlignment
    } = attributes;

    const renderSaveIcons = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
      }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: icons[index].link,
        className: 'kt-svg-icon-link',
        target: '_blank' === icons[index].target ? icons[index].target : undefined,
        rel: '_blank' === icons[index].target ? 'noopener noreferrer' : undefined,
        "aria-label": undefined !== icons[index].linkTitle && '' !== icons[index].linkTitle ? icons[index].linkTitle : undefined,
        style: {
          marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
          marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
          marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
          marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
        name: icons[index].icon,
        size: icons[index].size,
        strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
        title: icons[index].title ? icons[index].title : '',
        ariaHidden: icons[index].title ? undefined : 'true',
        style: {
          color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(icons[index].color) : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(icons[index].background) : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(icons[index].border) : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
        }
      })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
        name: icons[index].icon,
        size: icons[index].size,
        strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
        title: icons[index].title ? icons[index].title : '',
        ariaHidden: icons[index].title ? undefined : 'true',
        style: {
          color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(icons[index].color) : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(icons[index].background) : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(icons[index].border) : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined,
          marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
          marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
          marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
          marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
        }
      }));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'center'}${verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : ''}`,
      style: {
        textAlign: textAlignment ? textAlignment : 'center'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(iconCount, n => renderSaveIcons(n)));
  }
}, {
  attributes: {
    icons: {
      type: 'array',
      default: [{
        icon: 'fe_aperture',
        link: '',
        target: '_self',
        size: 50,
        width: 2,
        title: '',
        color: '#444444',
        background: 'transparent',
        border: '#444444',
        borderRadius: 0,
        borderWidth: 2,
        padding: 20,
        style: 'default',
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        hColor: '',
        hBackground: '',
        hBorder: ''
      }]
    },
    iconCount: {
      type: 'number',
      default: 1
    },
    uniqueID: {
      type: 'string',
      default: ''
    },
    blockAlignment: {
      type: 'string',
      default: 'center'
    },
    textAlignment: {
      type: 'string',
      default: 'center'
    },
    tabletTextAlignment: {
      type: 'string'
    },
    mobileTextAlignment: {
      type: 'string'
    }
  },
  save: _ref2 => {
    let {
      attributes
    } = _ref2;
    const {
      icons,
      iconCount,
      blockAlignment,
      textAlignment,
      uniqueID,
      verticalAlignment
    } = attributes;

    const renderSaveIcons = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
      }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: icons[index].link,
        className: 'kt-svg-icon-link',
        target: '_blank' === icons[index].target ? icons[index].target : undefined,
        rel: '_blank' === icons[index].target ? 'noopener noreferrer' : undefined,
        "aria-label": undefined !== icons[index].linkTitle && '' !== icons[index].linkTitle ? icons[index].linkTitle : undefined,
        style: {
          marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
          marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
          marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
          marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
        name: icons[index].icon,
        size: icons[index].size,
        strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
        title: icons[index].title ? icons[index].title : '',
        style: {
          color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(icons[index].color) : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(icons[index].background) : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(icons[index].border) : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
        }
      })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
        name: icons[index].icon,
        size: icons[index].size,
        strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
        title: icons[index].title ? icons[index].title : '',
        style: {
          color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(icons[index].color) : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(icons[index].background) : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(icons[index].border) : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined,
          marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
          marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
          marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
          marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
        }
      }));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'center'}${verticalAlignment ? verticalAlignment : ''}`,
      style: {
        textAlign: textAlignment ? textAlignment : 'center'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(iconCount, n => renderSaveIcons(n)));
  }
}, {
  attributes: {
    icons: {
      type: 'array',
      default: [{
        icon: 'fe_aperture',
        link: '',
        target: '_self',
        size: 50,
        width: 2,
        title: '',
        color: '#444444',
        background: 'transparent',
        border: '#444444',
        borderRadius: 0,
        borderWidth: 2,
        padding: 20,
        style: 'default'
      }]
    },
    iconCount: {
      type: 'number',
      default: 1
    },
    uniqueID: {
      type: 'string',
      default: ''
    },
    blockAlignment: {
      type: 'string',
      default: 'center'
    },
    textAlignment: {
      type: 'string',
      default: 'center'
    }
  },
  save: _ref3 => {
    let {
      attributes
    } = _ref3;
    const {
      icons,
      iconCount,
      blockAlignment,
      textAlignment,
      uniqueID
    } = attributes;

    const renderSaveIcons = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
      }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: icons[index].link,
        className: 'kt-svg-icon-link',
        target: '_blank' === icons[index].target ? icons[index].target : undefined,
        rel: '_blank' === icons[index].target ? 'noopener noreferrer' : undefined
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
        name: icons[index].icon,
        size: icons[index].size,
        strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
        title: icons[index].title ? icons[index].title : '',
        style: {
          color: icons[index].color ? icons[index].color : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
        }
      })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
        name: icons[index].icon,
        size: icons[index].size,
        strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
        title: icons[index].title ? icons[index].title : '',
        style: {
          color: icons[index].color ? icons[index].color : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
        }
      }));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'center'}`,
      style: {
        textAlign: textAlignment ? textAlignment : 'center'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(iconCount, n => renderSaveIcons(n)));
  }
}, {
  attributes: {
    icons: {
      type: 'array',
      default: [{
        icon: 'fe_aperture',
        link: '',
        target: '_self',
        size: 50,
        width: 2,
        title: '',
        color: '#444444',
        background: 'transparent',
        border: '#444444',
        borderRadius: 0,
        borderWidth: 2,
        padding: 20,
        style: 'default'
      }]
    },
    iconCount: {
      type: 'number',
      default: 1
    },
    uniqueID: {
      type: 'string',
      default: ''
    },
    blockAlignment: {
      type: 'string',
      default: 'center'
    },
    textAlignment: {
      type: 'string',
      default: 'center'
    }
  },
  save: _ref4 => {
    let {
      attributes
    } = _ref4;
    const {
      icons,
      iconCount,
      blockAlignment,
      textAlignment,
      uniqueID
    } = attributes;

    const renderSaveIcons = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
      }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: icons[index].link,
        className: 'kt-svg-icon-link',
        target: '_blank' === icons[index].target ? icons[index].target : undefined,
        rel: '_blank' === icons[index].target ? 'noopener noreferrer' : undefined
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        style: {
          color: icons[index].color ? icons[index].color : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
        },
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`
      })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        style: {
          color: icons[index].color ? icons[index].color : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
        },
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`
      }));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'center'}`,
      style: {
        textAlign: textAlignment ? textAlignment : 'center'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(iconCount, n => renderSaveIcons(n)));
  }
}, {
  attributes: {
    icons: {
      type: 'array',
      default: [{
        icon: 'fe_aperture',
        link: '',
        target: '_self',
        size: 50,
        width: 2,
        title: '',
        color: '#444444',
        background: 'transparent',
        border: '#444444',
        borderRadius: 0,
        borderWidth: 2,
        padding: 20,
        style: 'default'
      }]
    },
    iconCount: {
      type: 'number',
      default: 1
    },
    uniqueID: {
      type: 'string',
      default: ''
    },
    blockAlignment: {
      type: 'string',
      default: 'center'
    },
    textAlignment: {
      type: 'string',
      default: 'center'
    }
  },
  save: _ref5 => {
    let {
      attributes
    } = _ref5;
    const {
      icons,
      iconCount,
      blockAlignment,
      textAlignment,
      uniqueID
    } = attributes;

    const renderSaveIcons = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
      }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: icons[index].link,
        className: 'kt-svg-icon-link',
        target: icons[index].target
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
        name: icons[index].icon,
        size: icons[index].size,
        strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
        title: icons[index].title ? icons[index].title : '',
        style: {
          color: icons[index].color ? icons[index].color : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
        }
      })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
        name: icons[index].icon,
        size: icons[index].size,
        strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
        title: icons[index].title ? icons[index].title : '',
        style: {
          color: icons[index].color ? icons[index].color : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
        }
      }));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'center'}`,
      style: {
        textAlign: textAlignment ? textAlignment : 'center'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(iconCount, n => renderSaveIcons(n)));
  }
}, {
  attributes: {
    icons: {
      type: 'array',
      default: [{
        icon: 'fe_aperture',
        link: '',
        target: '_self',
        size: 50,
        width: 2,
        title: '',
        color: '#444444',
        background: 'transparent',
        border: '#444444',
        borderRadius: 0,
        borderWidth: 2,
        padding: 20,
        style: 'default'
      }]
    },
    iconCount: {
      type: 'number',
      default: 1
    },
    uniqueID: {
      type: 'string',
      default: ''
    },
    blockAlignment: {
      type: 'string',
      default: 'center'
    },
    textAlignment: {
      type: 'string',
      default: 'center'
    }
  },
  save: _ref6 => {
    let {
      attributes
    } = _ref6;
    const {
      icons,
      iconCount,
      blockAlignment,
      textAlignment,
      uniqueID
    } = attributes;

    const renderSaveIcons = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
      }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: icons[index].link,
        className: 'kt-svg-icon-link',
        target: icons[index].target,
        rel: "noopener noreferrer"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
        name: icons[index].icon,
        size: icons[index].size,
        strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
        title: icons[index].title ? icons[index].title : '',
        style: {
          color: icons[index].color ? icons[index].color : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
        }
      })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
        name: icons[index].icon,
        size: icons[index].size,
        strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
        title: icons[index].title ? icons[index].title : '',
        style: {
          color: icons[index].color ? icons[index].color : undefined,
          backgroundColor: icons[index].background && icons[index].style !== 'default' ? icons[index].background : undefined,
          padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
          borderColor: icons[index].border && icons[index].style !== 'default' ? icons[index].border : undefined,
          borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
          borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
        }
      }));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'center'}`,
      style: {
        textAlign: textAlignment ? textAlignment : 'center'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(iconCount, n => renderSaveIcons(n)));
  }
}]);

/***/ }),

/***/ "./src/blocks/icon/edit.js":
/*!*********************************!*\
  !*** ./src/blocks/icon/edit.js ***!
  \*********************************/
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
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/icon/editor.scss");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__);



/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Icons
 */

/**
 * Import externals
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

const kticonUniqueIDs = [];

function KadenceIcons(_ref) {
  let {
    attributes,
    className,
    setAttributes,
    clientId,
    context
  } = _ref;
  const {
    iconCount,
    inQueryBlock,
    icons,
    blockAlignment,
    textAlignment,
    tabletTextAlignment,
    mobileTextAlignment,
    uniqueID,
    verticalAlignment
  } = attributes;
  const [marginControl, setMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('general');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (!uniqueID) {
      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      kticonUniqueIDs.push('_' + clientId.substr(2, 9));
    } else if (kticonUniqueIDs.includes(uniqueID)) {
      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      kticonUniqueIDs.push('_' + clientId.substr(2, 9));
    } else {
      kticonUniqueIDs.push(uniqueID);
    }

    if (context && context.queryId && context.postId) {
      if (!inQueryBlock) {
        setAttributes({
          inQueryBlock: true
        });
      }
    } else if (inQueryBlock) {
      setAttributes({
        inQueryBlock: false
      });
    }
  }, []);

  const saveArrayUpdate = (value, index) => {
    const newItems = icons.map((item, thisIndex) => {
      if (index === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      icons: newItems
    });
  };

  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.useBlockProps)({
    className: className
  });
  const controlTypes = [{
    key: 'linked',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Linked', 'kadence-blocks'),
    micon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.linkedIcon
  }, {
    key: 'individual',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Individual', 'kadence-blocks'),
    micon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.individualIcon
  }];
  const verticalAlignOptions = [[{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.VerticalAlignmentIcon, {
      value: 'top',
      isPressed: verticalAlignment === 'top' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Align Top', 'kadence-blocks'),
    isActive: verticalAlignment === 'top' ? true : false,
    onClick: () => setAttributes({
      verticalAlignment: 'top'
    })
  }], [{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.VerticalAlignmentIcon, {
      value: 'middle',
      isPressed: verticalAlignment === 'middle' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Align Middle', 'kadence-blocks'),
    isActive: verticalAlignment === 'middle' ? true : false,
    onClick: () => setAttributes({
      verticalAlignment: 'middle'
    })
  }], [{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.VerticalAlignmentIcon, {
      value: 'bottom',
      isPressed: verticalAlignment === 'bottom' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Align Bottom', 'kadence-blocks'),
    isActive: verticalAlignment === 'bottom' ? true : false,
    onClick: () => setAttributes({
      verticalAlignment: 'bottom'
    })
  }]];
  const tabAlignControls = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.TabPanel, {
    className: "kt-size-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'desk',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Dashicon, {
        icon: "desktop"
      }),
      className: 'kt-desk-tab'
    }, {
      name: 'tablet',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Dashicon, {
        icon: "tablet"
      }),
      className: 'kt-tablet-tab'
    }, {
      name: 'mobile',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Dashicon, {
        icon: "smartphone"
      }),
      className: 'kt-mobile-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('mobile' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.AlignmentToolbar, {
          value: mobileTextAlignment,
          isCollapsed: false,
          onChange: nextAlign => {
            setAttributes({
              mobileTextAlignment: nextAlign
            });
          }
        });
      } else if ('tablet' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.AlignmentToolbar, {
          value: tabletTextAlignment,
          isCollapsed: false,
          onChange: nextAlign => {
            setAttributes({
              tabletTextAlignment: nextAlign
            });
          }
        });
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.AlignmentToolbar, {
          value: textAlignment,
          isCollapsed: false,
          onChange: nextAlign => {
            setAttributes({
              textAlignment: nextAlign
            });
          }
        });
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  });

  const hoverSettings = index => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Icon Hover Color', 'kadence-blocks'),
      value: icons[index].hColor ? icons[index].hColor : '',
      default: '',
      onChange: value => {
        saveArrayUpdate({
          hColor: value
        }, index);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Icon Style', 'kadence-blocks'),
      value: icons[index].style,
      options: [{
        value: 'default',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Default', 'kadence-blocks')
      }, {
        value: 'stacked',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Stacked', 'kadence-blocks')
      }],
      onChange: value => {
        saveArrayUpdate({
          style: value
        }, index);
      }
    }), icons[index].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Hover Background Color', 'kadence-blocks'),
      value: icons[index].hBackground ? icons[index].hBackground : '',
      default: '',
      onChange: value => {
        saveArrayUpdate({
          hBackground: value
        }, index);
      }
    })), icons[index].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Hover Border Color', 'kadence-blocks'),
      value: icons[index].hBorder ? icons[index].hBorder : '',
      default: '',
      onChange: value => {
        saveArrayUpdate({
          hBorder: value
        }, index);
      }
    })));
  };

  const normalSettings = index => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Icon Color', 'kadence-blocks'),
      value: icons[index].color ? icons[index].color : '',
      default: '',
      onChange: value => {
        saveArrayUpdate({
          color: value
        }, index);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Icon Style', 'kadence-blocks'),
      value: icons[index].style,
      options: [{
        value: 'default',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Default', 'kadence-blocks')
      }, {
        value: 'stacked',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Stacked', 'kadence-blocks')
      }],
      onChange: value => {
        saveArrayUpdate({
          style: value
        }, index);
      }
    }), icons[index].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('background Color', 'kadence-blocks'),
      value: icons[index].background ? icons[index].background : '',
      default: '',
      onChange: value => {
        saveArrayUpdate({
          background: value
        }, index);
      }
    })), icons[index].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Border Color', 'kadence-blocks'),
      value: icons[index].border ? icons[index].border : '',
      default: '',
      onChange: value => {
        saveArrayUpdate({
          border: value
        }, index);
      }
    })));
  };

  const renderIconSettings = index => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Icon', 'kadence-blocks') + ' ' + (index + 1) + ' ' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Settings', 'kadence-blocks'),
      initialOpen: 1 === iconCount ? true : false,
      panelName: 'kb-icon-settings-' + index
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconControl, {
      value: icons[index].icon,
      onChange: value => {
        saveArrayUpdate({
          icon: value
        }, index);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Icon Size', 'kadence-blocks'),
      value: icons[index].size,
      onChange: value => {
        saveArrayUpdate({
          size: value
        }, index);
      },
      min: 5,
      max: 250
    }), icons[index].icon && 'fe' === icons[index].icon.substring(0, 2) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Line Width'),
      value: icons[index].width,
      onChange: value => {
        saveArrayUpdate({
          width: value
        }, index);
      },
      step: 0.5,
      min: 0.5,
      max: 4
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
      className: "kt-tab-wrap-title kt-color-settings-title"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Color Settings', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.TabPanel, {
      className: "kt-inspect-tabs kt-hover-tabs",
      activeClass: "active-tab",
      tabs: [{
        name: 'normal' + index,
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Normal', 'kadence-blocks'),
        className: 'kt-normal-tab'
      }, {
        name: 'hover' + index,
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Hover', 'kadence-blocks'),
        className: 'kt-hover-tab'
      }]
    }, tab => {
      let tabout;

      if (tab.name) {
        if ('hover' + index === tab.name) {
          tabout = hoverSettings(index);
        } else {
          tabout = normalSettings(index);
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
        className: tab.className,
        key: tab.className
      }, tabout);
    }), icons[index].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Border Size (px)', 'kadence-blocks'),
      value: icons[index].borderWidth,
      onChange: value => {
        saveArrayUpdate({
          borderWidth: value
        }, index);
      },
      min: 0,
      max: 20
    }), icons[index].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Border Radius (%)', 'kadence-blocks'),
      value: icons[index].borderRadius,
      onChange: value => {
        saveArrayUpdate({
          borderRadius: value
        }, index);
      },
      min: 0,
      max: 50
    }), icons[index].style !== 'default' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Padding (px)', 'kadence-blocks'),
      value: icons[index].padding,
      onChange: value => {
        saveArrayUpdate({
          padding: value
        }, index);
      },
      min: 0,
      max: 180
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.ButtonGroup, {
      className: "kt-size-type-options kt-outline-control",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Margin Control Type', 'kadence-blocks')
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(controlTypes, _ref2 => {
      let {
        name,
        key,
        micon
      } = _ref2;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Tooltip, {
        text: name
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
        key: key,
        className: "kt-size-btn",
        isSmall: true,
        isPrimary: marginControl === key,
        "aria-pressed": marginControl === key,
        onClick: () => setMarginControl(key)
      }, micon));
    })), marginControl && marginControl !== 'individual' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Margin (px)', 'kadence-blocks'),
      value: icons[index].marginTop ? icons[index].marginTop : 0,
      onChange: value => {
        saveArrayUpdate({
          marginTop: value,
          marginRight: value,
          marginBottom: value,
          marginLeft: value
        }, index);
      },
      min: 0,
      max: 180,
      step: 1
    }), marginControl && marginControl === 'individual' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Margin (px)', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
      className: "kt-icon-rangecontrol",
      label: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.outlineTopIcon,
      value: icons[index].marginTop ? icons[index].marginTop : 0,
      onChange: value => {
        saveArrayUpdate({
          marginTop: value
        }, index);
      },
      min: 0,
      max: 180,
      step: 1
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
      className: "kt-icon-rangecontrol",
      label: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.outlineRightIcon,
      value: icons[index].marginRight ? icons[index].marginRight : 0,
      onChange: value => {
        saveArrayUpdate({
          marginRight: value
        }, index);
      },
      min: 0,
      max: 180,
      step: 1
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
      className: "kt-icon-rangecontrol",
      label: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.outlineBottomIcon,
      value: icons[index].marginBottom ? icons[index].marginBottom : 0,
      onChange: value => {
        saveArrayUpdate({
          marginBottom: value
        }, index);
      },
      min: 0,
      max: 180,
      step: 1
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
      className: "kt-icon-rangecontrol",
      label: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.outlineLeftIcon,
      value: icons[index].marginLeft ? icons[index].marginLeft : 0,
      onChange: value => {
        saveArrayUpdate({
          marginLeft: value
        }, index);
      },
      min: 0,
      max: 180,
      step: 1
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.URLInputControl, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Link', 'kadence-blocks'),
      url: icons[index].link,
      onChangeUrl: value => {
        saveArrayUpdate({
          link: value
        }, index);
      },
      additionalControls: true,
      opensInNewTab: icons[index].target && '_blank' == icons[index].target ? true : false,
      onChangeTarget: value => {
        if (value) {
          saveArrayUpdate({
            target: '_blank'
          }, index);
        } else {
          saveArrayUpdate({
            target: '_self'
          }, index);
        }
      },
      dynamicAttribute: 'icons:' + index + ':link',
      linkTitle: icons[index].linkTitle,
      onChangeTitle: value => {
        saveArrayUpdate({
          linkTitle: value
        }, index);
      }
    }, attributes)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Title for Accessibility', 'kadence-blocks'),
      value: icons[index].title,
      onChange: value => {
        saveArrayUpdate({
          title: value
        }, index);
      }
    }));
  };

  const renderSettings = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(iconCount, n => renderIconSettings(n)));

  const renderIconsPreview = index => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
    }, icons[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconRender, {
      className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
      name: icons[index].icon,
      size: icons[index].size,
      strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
      title: icons[index].title ? icons[index].title : '',
      style: {
        color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].color) : undefined,
        backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].background) : undefined,
        padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
        borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].border) : undefined,
        borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
        borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined,
        marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
        marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
        marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
        marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
      }
    }));
  };

  const renderIconCSS = index => {
    return `.kt-svg-icons-${uniqueID} .kt-svg-item-${index}:hover .kt-svg-icon {
					${undefined !== icons[index].hColor && icons[index].hColor ? 'color:' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].hColor) + '!important;' : ''}
					${undefined !== icons[index].hBackground && icons[index].hBackground ? 'background:' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].hBackground) + '!important;' : ''}
					${undefined !== icons[index].hBorder && icons[index].hBorder ? 'border-color:' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(icons[index].hBorder) + '!important;' : ''}
				}`;
  };

  const renderCSS = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("style", null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(iconCount, n => renderIconCSS(n)));
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", blockProps, renderCSS, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.BlockControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.BlockAlignmentToolbar, {
    value: blockAlignment,
    controls: ['center', 'left', 'right'],
    onChange: value => setAttributes({
      blockAlignment: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.ToolbarGroup, {
    isCollapsed: true,
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.VerticalAlignmentIcon, {
      value: verticalAlignment ? verticalAlignment : 'bottom'
    }),
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Vertical Align', 'kadence-blocks'),
    controls: verticalAlignOptions
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.AlignmentToolbar, {
    value: textAlignment,
    onChange: value => setAttributes({
      textAlignment: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.InspectorControlTabs, {
    panelName: 'icon',
    allowedTabs: ['general', 'advanced'],
    setActiveTab: value => setActiveTab(value),
    activeTab: activeTab
  }), activeTab === 'general' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Icon Count', 'kadence-blocks'),
    initialOpen: true,
    panelName: 'kb-icon-count'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.StepControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Number of Icons', 'kadence-blocks'),
    value: iconCount,
    onChange: newcount => {
      const newicons = icons;

      if (newicons.length < newcount) {
        const amount = Math.abs(newcount - newicons.length);
        {
          (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(amount, n => {
            newicons.push({
              icon: newicons[0].icon,
              link: newicons[0].link,
              target: newicons[0].target,
              size: newicons[0].size,
              width: newicons[0].width,
              title: newicons[0].title,
              color: newicons[0].color,
              background: newicons[0].background,
              border: newicons[0].border,
              borderRadius: newicons[0].borderRadius,
              borderWidth: newicons[0].borderWidth,
              padding: newicons[0].padding,
              style: newicons[0].style,
              marginTop: newicons[0].marginTop ? newicons[0].marginTop : 0,
              marginRight: newicons[0].marginRight ? newicons[0].marginRight : 0,
              marginBottom: newicons[0].marginBottom ? newicons[0].marginBottom : 0,
              marginLeft: newicons[0].marginLeft ? newicons[0].marginLeft : 0,
              hColor: newicons[0].hColor ? newicons[0].hColor : '',
              hBackground: newicons[0].hBackground ? newicons[0].hBackground : '',
              hBorder: newicons[0].hBorder ? newicons[0].hBorder : ''
            });
          });
        }
        setAttributes({
          icons: newicons
        });
        saveArrayUpdate({
          title: icons[0].title
        }, 0);
      }

      setAttributes({
        iconCount: newcount
      });
    },
    min: 1,
    max: 10
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kb-sidebar-alignment components-base-control"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
    className: "kb-component-label kb-responsive-label"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Text Alignment', 'kadence-blocks')), tabAlignControls)), renderSettings)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: `kt-svg-icons ${clientId} kt-svg-icons-${uniqueID}${verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : ''}`,
    style: {
      textAlign: textAlignment ? textAlignment : 'center'
    }
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(iconCount, n => renderIconsPreview(n))));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KadenceIcons);

/***/ }),

/***/ "./src/blocks/icon/save.js":
/*!*********************************!*\
  !*** ./src/blocks/icon/save.js ***!
  \*********************************/
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
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);



/**
 * BLOCK: Kadence Spacer
 */

/**
 * External dependencies
 */





function Save(_ref) {
  let {
    attributes,
    className
  } = _ref;
  const {
    icons,
    iconCount,
    blockAlignment,
    textAlignment,
    uniqueID,
    verticalAlignment
  } = attributes;

  const renderSaveIcons = index => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: `kt-svg-style-${icons[index].style} kt-svg-icon-wrap kt-svg-item-${index}`
    }, icons[index].icon && icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("a", {
      href: icons[index].link,
      className: 'kt-svg-icon-link',
      target: '_blank' === icons[index].target ? icons[index].target : undefined,
      rel: '_blank' === icons[index].target ? 'noopener noreferrer' : undefined,
      "aria-label": undefined !== icons[index].linkTitle && '' !== icons[index].linkTitle ? icons[index].linkTitle : undefined,
      style: {
        marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
        marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
        marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
        marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
      className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
      name: icons[index].icon,
      size: icons[index].size,
      strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
      title: icons[index].title ? icons[index].title : '',
      ariaHidden: icons[index].title ? undefined : 'true',
      style: {
        color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(icons[index].color) : undefined,
        backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(icons[index].background) : undefined,
        padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
        borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(icons[index].border) : undefined,
        borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
        borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined
      }
    })), icons[index].icon && !icons[index].link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
      className: `kt-svg-icon kt-svg-icon-${icons[index].icon}`,
      name: icons[index].icon,
      size: icons[index].size,
      strokeWidth: 'fe' === icons[index].icon.substring(0, 2) ? icons[index].width : undefined,
      title: icons[index].title ? icons[index].title : '',
      ariaHidden: icons[index].title ? undefined : 'true',
      style: {
        color: icons[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(icons[index].color) : undefined,
        backgroundColor: icons[index].background && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(icons[index].background) : undefined,
        padding: icons[index].padding && icons[index].style !== 'default' ? icons[index].padding + 'px' : undefined,
        borderColor: icons[index].border && icons[index].style !== 'default' ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(icons[index].border) : undefined,
        borderWidth: icons[index].borderWidth && icons[index].style !== 'default' ? icons[index].borderWidth + 'px' : undefined,
        borderRadius: icons[index].borderRadius && icons[index].style !== 'default' ? icons[index].borderRadius + '%' : undefined,
        marginTop: icons[index].marginTop ? icons[index].marginTop + 'px' : undefined,
        marginRight: icons[index].marginRight ? icons[index].marginRight + 'px' : undefined,
        marginBottom: icons[index].marginBottom ? icons[index].marginBottom + 'px' : undefined,
        marginLeft: icons[index].marginLeft ? icons[index].marginLeft + 'px' : undefined
      }
    }));
  };

  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: className
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, blockProps, {
    className: 'wp-block-kadence-icon ' + `kt-svg-icons kt-svg-icons${uniqueID} align${blockAlignment ? blockAlignment : 'none'}${verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : ''}`,
    style: {
      textAlign: textAlignment ? textAlignment : 'center'
    }
  }), (0,lodash__WEBPACK_IMPORTED_MODULE_5__.times)(iconCount, n => renderSaveIcons(n)));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Save);

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

/***/ "./src/blocks/icon/block.json":
/*!************************************!*\
  !*** ./src/blocks/icon/block.json ***!
  \************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Icon","name":"kadence/icon","category":"kadence-blocks","attributes":{"icons":{"type":"array","default":[{"icon":"fe_aperture","link":"","target":"_self","size":50,"width":2,"title":"","color":"#444444","background":"transparent","border":"#444444","borderRadius":0,"borderWidth":2,"padding":20,"style":"default","marginTop":0,"marginRight":0,"marginBottom":0,"marginLeft":0,"hColor":"","hBackground":"","hBorder":"","linkTitle":""}]},"iconCount":{"type":"number","default":1},"uniqueID":{"type":"string","default":""},"blockAlignment":{"type":"string","default":""},"textAlignment":{"type":"string","default":"center"},"tabletTextAlignment":{"type":"string"},"mobileTextAlignment":{"type":"string"},"verticalAlignment":{"type":"string"},"inQueryBlock":{"type":"bool","default":false}},"supports":{"ktdynamic":true},"usesContext":["postId","queryId"]}');

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
/******/ 			"blocks-icon": 0,
/******/ 			"./style-blocks-icon": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-blocks-icon"], () => (__webpack_require__("./src/blocks/icon/block.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	(this.kadence = this.kadence || {})["blocks-icon"] = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=blocks-icon.js.map