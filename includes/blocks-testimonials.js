/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@wordpress/icons/build-module/library/close-small.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/close-small.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

const closeSmall = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (closeSmall);
//# sourceMappingURL=close-small.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/image.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/image.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

const image = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (image);
//# sourceMappingURL=image.js.map

/***/ }),

/***/ "./src/blocks/testimonials/editor.scss":
/*!*********************************************!*\
  !*** ./src/blocks/testimonials/editor.scss ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/testimonials/style.scss":
/*!********************************************!*\
  !*** ./src/blocks/testimonials/style.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/testimonials/attributes.js":
/*!***********************************************!*\
  !*** ./src/blocks/testimonials/attributes.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * BLOCK: Kadence Testimonials
 */
const attributes = {
  uniqueID: {
    type: 'string',
    default: ''
  },
  style: {
    type: 'string',
    default: 'basic'
  },
  layout: {
    type: 'string',
    default: 'grid'
  },
  columns: {
    type: 'array',
    default: [1, 1, 1, 1, 1, 1]
  },
  columnControl: {
    type: 'string',
    default: 'linked'
  },
  columnGap: {
    type: 'number',
    default: 30
  },
  autoPlay: {
    type: 'bool',
    default: false
  },
  autoSpeed: {
    type: 'number',
    default: 7000
  },
  transSpeed: {
    type: 'number',
    default: 400
  },
  slidesScroll: {
    type: 'string',
    default: '1'
  },
  arrowStyle: {
    type: 'string',
    default: 'whiteondark'
  },
  dotStyle: {
    type: 'string',
    default: 'dark'
  },
  hAlign: {
    type: 'string',
    default: 'center'
  },
  containerMaxWidth: {
    type: 'number',
    default: 500
  },
  containerBackground: {
    type: 'string',
    default: ''
  },
  containerBackgroundOpacity: {
    type: 'number',
    default: 1
  },
  containerBorder: {
    type: 'string',
    default: '#eeeeee'
  },
  containerBorderOpacity: {
    type: 'number',
    default: 1
  },
  containerBorderWidth: {
    type: 'array',
    default: ['', '', '', '']
  },
  containerBorderRadius: {
    type: 'number',
    default: ''
  },
  containerPadding: {
    type: 'array',
    default: [20, 20, 20, 20]
  },
  testimonials: {
    type: 'array',
    default: [{
      url: '',
      id: '',
      alt: '',
      width: '',
      height: '',
      maxWidth: '',
      subtype: '',
      media: 'image',
      icon: 'fas_quote-left',
      isize: 50,
      istroke: 2,
      ititle: '',
      color: '#555555',
      title: '',
      content: '',
      name: '',
      occupation: '',
      rating: 5
    }]
  },
  mediaStyles: {
    type: 'array',
    default: [{
      width: 60,
      backgroundSize: 'cover',
      background: '',
      backgroundOpacity: 1,
      border: '#555555',
      borderRadius: '',
      borderWidth: [0, 0, 0, 0],
      padding: [0, 0, 0, 0],
      margin: ['', '', '', ''],
      ratio: ''
    }]
  },
  itemsCount: {
    type: 'number',
    default: 1
  },
  displayMedia: {
    type: 'bool',
    default: true
  },
  displayTitle: {
    type: 'bool',
    default: true
  },
  titleFont: {
    type: 'array',
    default: [{
      color: '',
      level: 2,
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
      loadGoogle: true,
      padding: [0, 0, 0, 0],
      margin: [0, 0, 15, 0]
    }]
  },
  displayContent: {
    type: 'bool',
    default: true
  },
  contentFont: {
    type: 'array',
    default: [{
      color: '#333333',
      size: ['', '', ''],
      sizeType: 'px',
      lineHeight: ['', '', ''],
      lineType: 'px',
      letterSpacing: '',
      textTransform: '',
      family: '',
      google: '',
      style: '',
      weight: '',
      variant: '',
      subset: '',
      loadGoogle: true
    }]
  },
  displayName: {
    type: 'bool',
    default: true
  },
  nameFont: {
    type: 'array',
    default: [{
      color: '#333333',
      size: ['', '', ''],
      sizeType: 'px',
      lineHeight: ['', '', ''],
      lineType: 'px',
      letterSpacing: '',
      textTransform: '',
      family: '',
      google: '',
      style: '',
      weight: '',
      variant: '',
      subset: '',
      loadGoogle: true
    }]
  },
  displayOccupation: {
    type: 'bool',
    default: true
  },
  occupationFont: {
    type: 'array',
    default: [{
      color: '#555555',
      size: [15, '', ''],
      sizeType: 'px',
      lineHeight: ['', '', ''],
      lineType: 'px',
      letterSpacing: '',
      textTransform: '',
      family: '',
      google: '',
      style: '',
      weight: '',
      variant: '',
      subset: '',
      loadGoogle: true
    }]
  },
  displayRating: {
    type: 'bool',
    default: false
  },
  ratingStyles: {
    type: 'array',
    default: [{
      color: '#ffd700',
      size: 16,
      margin: [10, 0, 10, 0],
      iconSpacing: '',
      icon: 'fas_star',
      stroke: 2
    }]
  },
  displayIcon: {
    type: 'bool',
    default: false
  },
  iconStyles: {
    type: 'array',
    default: [{
      size: 30,
      margin: ['', '', '', ''],
      padding: ['', '', '', ''],
      borderWidth: ['', '', '', ''],
      borderRadius: '',
      border: '',
      borderOpacity: 1,
      color: '',
      background: '',
      backgroundOpacity: 1,
      title: '',
      icon: 'fas_quote-left',
      stroke: 2
    }]
  },
  displayShadow: {
    type: 'bool',
    default: false
  },
  shadow: {
    type: 'array',
    default: [{
      color: '#000000',
      opacity: 0.2,
      spread: 0,
      blur: 14,
      hOffset: 4,
      vOffset: 2
    }]
  },
  containerMinHeight: {
    type: 'array',
    default: ['', '', '']
  },
  containerVAlign: {
    type: 'string',
    default: ''
  },
  titleMinHeight: {
    type: 'array',
    default: ['', '', '']
  },
  contentMinHeight: {
    type: 'array',
    default: ['', '', '']
  },
  showPresets: {
    type: 'bool',
    default: true
  },
  wrapperPaddingType: {
    type: 'string',
    default: 'px'
  },
  wrapperPadding: {
    type: 'array',
    default: ['', '', '', '']
  },
  wrapperTabletPadding: {
    type: 'array',
    default: ['', '', '', '']
  },
  wrapperMobilePadding: {
    type: 'array',
    default: ['', '', '', '']
  },
  tabletContainerPadding: {
    type: 'array',
    default: ['', '', '', '']
  },
  mobileContainerPadding: {
    type: 'array',
    default: ['', '', '', '']
  },
  containerPaddingType: {
    type: 'string',
    default: 'px'
  },
  inQueryBlock: {
    type: 'bool',
    default: false
  },
  useBlockQuoteTags: {
    type: 'bool',
    default: true
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (attributes);

/***/ }),

/***/ "./src/blocks/testimonials/block.js":
/*!******************************************!*\
  !*** ./src/blocks/testimonials/block.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/testimonials/style.scss");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _attributes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./attributes */ "./src/blocks/testimonials/attributes.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./block.json */ "./src/blocks/testimonials/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./edit */ "./src/blocks/testimonials/edit.js");
/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./deprecated */ "./src/blocks/testimonials/deprecated.js");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_12__);


/**
 * BLOCK: Kadence Testimonial
 */

/**
 * Import Css
 */

/**
 * Import Icons
 */





/**
 * Import attributes
 */



/**
 * Import edit
 */


/**
 * Import deprecated.
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

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_10__.registerBlockType)('kadence/testimonials', { ..._block_json__WEBPACK_IMPORTED_MODULE_7__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_12__.__)('Testimonials', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_12__.__)('testimonials', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_12__.__)('rating', 'kadence-blocks'), 'KB'],
  icon: {
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.testimonialBlockIcon
  },
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_6__["default"],
  edit: _edit__WEBPACK_IMPORTED_MODULE_8__["default"],
  save: props => {
    const {
      attributes: {
        uniqueID,
        testimonials,
        style,
        hAlign,
        layout,
        itemsCount,
        containerBackground,
        containerBorder,
        containerBorderWidth,
        containerBorderRadius,
        containerPadding,
        mediaStyles,
        displayTitle,
        titleFont,
        displayContent,
        displayName,
        displayMedia,
        displayShadow,
        shadow,
        displayRating,
        ratingStyles,
        displayOccupation,
        containerBackgroundOpacity,
        containerBorderOpacity,
        containerMaxWidth,
        columnGap,
        autoPlay,
        autoSpeed,
        transSpeed,
        slidesScroll,
        arrowStyle,
        dotStyle,
        columns,
        displayIcon,
        iconStyles,
        containerVAlign,
        containerPaddingType
      }
    } = props;
    const containerPaddingUnit = containerPaddingType ? containerPaddingType : 'px';
    const containerStyles = {
      boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
      borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
      background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
      borderRadius: undefined !== containerBorderRadius && '' !== containerBorderRadius && !isNaN(containerBorderRadius) ? containerBorderRadius + 'px' : undefined,
      borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
      borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
      borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
      borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
      paddingTop: containerPadding && undefined !== containerPadding[0] && '' !== containerPadding[0] && null !== containerPadding[0] ? containerPadding[0] + containerPaddingUnit : undefined,
      paddingRight: containerPadding && undefined !== containerPadding[1] && '' !== containerPadding[1] && null !== containerPadding[1] ? containerPadding[1] + containerPaddingUnit : undefined,
      paddingBottom: containerPadding && undefined !== containerPadding[2] && '' !== containerPadding[2] && null !== containerPadding[2] ? containerPadding[2] + containerPaddingUnit : undefined,
      paddingLeft: containerPadding && undefined !== containerPadding[3] && '' !== containerPadding[3] && null !== containerPadding[3] ? containerPadding[3] + containerPaddingUnit : undefined,
      maxWidth: 'bubble' === style || 'inlineimage' === style || undefined === containerMaxWidth || '' === containerMaxWidth ? undefined : containerMaxWidth + 'px'
    };

    const renderTestimonialIcon = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-svg-testimonial-global-icon-wrap",
        style: {
          margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconSpanTag, {
        className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
        name: iconStyles[0].icon,
        size: iconStyles[0].size,
        title: iconStyles[0].title ? iconStyles[0].title : '',
        strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
        style: {
          color: iconStyles[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(iconStyles[0].color) : undefined,
          borderRadius: undefined !== iconStyles[0].borderRadius ? iconStyles[0].borderRadius + 'px' : undefined,
          borderTopWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] && null !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
          borderRightWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] && null !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
          borderBottomWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] && null !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
          borderLeftWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] && null !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
          background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
          borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
          padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
        }
      }));
    };

    const renderTestimonialMedia = index => {
      let urlOutput = testimonials[index].url;

      if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
        if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
          urlOutput = testimonials[index].url;
        } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if ('card' === style && containerMaxWidth <= 100) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 75) {
          if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
            urlOutput = testimonials[index].sizes.thumbnail.url;
          } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-inner-wrap",
        style: {
          width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
          borderColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(mediaStyles[0].border),
          backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
          borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
          padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
          marginTop: mediaStyles[0].margin && '' !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
          marginRight: mediaStyles[0].margin && '' !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
          marginBottom: mediaStyles[0].margin && '' !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
          marginLeft: mediaStyles[0].margin && '' !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kadence-testimonial-image-intrisic',
        style: {
          paddingBottom: 'card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio) ? mediaStyles[0].ratio + '%' : undefined
        }
      }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconSpanTag, {
        className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
        name: testimonials[index].icon,
        size: testimonials[index].isize,
        title: testimonials[index].ititle ? testimonials[index].ititle : '',
        strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
        style: {
          display: 'flex',
          color: testimonials[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(testimonials[index].color) : undefined
        }
      }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-testimonial-image',
        style: {
          backgroundImage: "url('" + urlOutput + "')",
          backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined
        }
      }))));
    };

    const renderTestimonialPreview = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-item-wrap kt-testimonial-item-${index}${containerVAlign ? ' testimonial-valign-' + containerVAlign : ''}`,
        style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
          maxWidth: containerMaxWidth + 'px',
          paddingTop: displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-text-wrap",
        style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
      }, displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index), displayMedia && ('card' === style || 'inlineimage' === style) && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-title-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__.RichText.Content, {
        className: "kt-testimonial-title",
        tagName: 'h' + titleFont[0].level,
        value: testimonials[index].title
      })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
        style: {
          margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconSpanTag, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconSpanTag, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconSpanTag, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconSpanTag, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.IconSpanTag, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(ratingStyles[0].color)
        }
      })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__.RichText.Content, {
        className: "kt-testimonial-content",
        tagName: 'div',
        value: testimonials[index].content
      }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-wrap"
      }, displayMedia && 'card' !== style && 'inlineimage' !== style && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-name-wrap"
      }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-name-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__.RichText.Content, {
        className: "kt-testimonial-name",
        tagName: 'div',
        value: testimonials[index].name
      })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-occupation-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__.RichText.Content, {
        className: "kt-testimonial-occupation",
        tagName: 'div',
        value: testimonials[index].occupation
      })))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${columns[3]} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}${layout && layout === 'carousel' ? ' tns-carousel-wrap' : ''}`
    }, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle} kt-carousel-container-arrowstyle-${arrowStyle}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`,
      "data-columns-xxl": columns[0],
      "data-columns-xl": columns[1],
      "data-columns-md": columns[2],
      "data-columns-sm": columns[3],
      "data-columns-xs": columns[4],
      "data-columns-ss": columns[5],
      "data-slider-anim-speed": transSpeed,
      "data-slider-scroll": slidesScroll,
      "data-slider-arrows": 'none' === arrowStyle ? false : true,
      "data-slider-dots": 'none' === dotStyle ? false : true,
      "data-slider-hover-pause": "false",
      "data-slider-auto": autoPlay,
      "data-slider-speed": autoSpeed
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-testimonial-carousel-item kb-slide-item",
      key: n
    }, renderTestimonialPreview(n))))), layout && layout !== 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-testimonial-grid-wrap',
      style: {
        'grid-row-gap': columnGap + 'px',
        'grid-column-gap': columnGap + 'px'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(itemsCount, n => renderTestimonialPreview(n))));
  },
  deprecated: _deprecated__WEBPACK_IMPORTED_MODULE_9__["default"]
});

/***/ }),

/***/ "./src/blocks/testimonials/deprecated.js":
/*!***********************************************!*\
  !*** ./src/blocks/testimonials/deprecated.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
/* harmony import */ var _attributes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./attributes */ "./src/blocks/testimonials/attributes.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__);


/**
 * BLOCK: Kadence Testimonial
 */

/**
 * Import Icons
 */



/**
 * Import attributes
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([{
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: props => {
    const {
      attributes: {
        uniqueID,
        testimonials,
        style,
        hAlign,
        layout,
        itemsCount,
        containerBackground,
        containerBorder,
        containerBorderWidth,
        containerBorderRadius,
        containerPadding,
        mediaStyles,
        displayTitle,
        titleFont,
        displayContent,
        displayName,
        displayMedia,
        displayShadow,
        shadow,
        displayRating,
        ratingStyles,
        displayOccupation,
        containerBackgroundOpacity,
        containerBorderOpacity,
        containerMaxWidth,
        columnGap,
        autoPlay,
        autoSpeed,
        transSpeed,
        slidesScroll,
        arrowStyle,
        dotStyle,
        columns,
        displayIcon,
        iconStyles,
        containerVAlign,
        containerPaddingType
      }
    } = props;
    const containerPaddingUnit = containerPaddingType ? containerPaddingType : 'px';
    const containerStyles = {
      boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
      borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
      background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
      borderRadius: undefined !== containerBorderRadius && '' !== containerBorderRadius && !isNaN(containerBorderRadius) ? containerBorderRadius + 'px' : undefined,
      borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
      borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
      borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
      borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
      paddingTop: containerPadding && undefined !== containerPadding[0] && '' !== containerPadding[0] && null !== containerPadding[0] ? containerPadding[0] + containerPaddingUnit : undefined,
      paddingRight: containerPadding && undefined !== containerPadding[1] && '' !== containerPadding[1] && null !== containerPadding[1] ? containerPadding[1] + containerPaddingUnit : undefined,
      paddingBottom: containerPadding && undefined !== containerPadding[2] && '' !== containerPadding[2] && null !== containerPadding[2] ? containerPadding[2] + containerPaddingUnit : undefined,
      paddingLeft: containerPadding && undefined !== containerPadding[3] && '' !== containerPadding[3] && null !== containerPadding[3] ? containerPadding[3] + containerPaddingUnit : undefined,
      maxWidth: 'bubble' === style || 'inlineimage' === style || undefined === containerMaxWidth || '' === containerMaxWidth ? undefined : containerMaxWidth + 'px'
    };

    const renderTestimonialIcon = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-svg-testimonial-global-icon-wrap",
        style: {
          margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
        name: iconStyles[0].icon,
        size: iconStyles[0].size,
        title: iconStyles[0].title ? iconStyles[0].title : '',
        strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
        style: {
          color: iconStyles[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].color) : undefined,
          borderRadius: undefined !== iconStyles[0].borderRadius ? iconStyles[0].borderRadius + 'px' : undefined,
          borderTopWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] && null !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
          borderRightWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] && null !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
          borderBottomWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] && null !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
          borderLeftWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] && null !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
          background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
          borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
          padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
        }
      }));
    };

    const renderTestimonialMedia = index => {
      let urlOutput = testimonials[index].url;

      if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
        if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
          urlOutput = testimonials[index].url;
        } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if ('card' === style && containerMaxWidth <= 100) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 75) {
          if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
            urlOutput = testimonials[index].sizes.thumbnail.url;
          } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-inner-wrap",
        style: {
          width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
          borderColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(mediaStyles[0].border),
          backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
          borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
          padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
          marginTop: mediaStyles[0].margin && '' !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
          marginRight: mediaStyles[0].margin && '' !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
          marginBottom: mediaStyles[0].margin && '' !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
          marginLeft: mediaStyles[0].margin && '' !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kadence-testimonial-image-intrisic',
        style: {
          paddingBottom: 'card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio) ? mediaStyles[0].ratio + '%' : undefined
        }
      }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
        name: testimonials[index].icon,
        size: testimonials[index].isize,
        title: testimonials[index].ititle ? testimonials[index].ititle : '',
        strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
        style: {
          display: 'flex',
          color: testimonials[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(testimonials[index].color) : undefined
        }
      }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-testimonial-image',
        style: {
          backgroundImage: "url('" + urlOutput + "')",
          backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined
        }
      }))));
    };

    const renderTestimonialPreview = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-item-wrap kt-testimonial-item-${index}${containerVAlign ? ' testimonial-valign-' + containerVAlign : ''}`,
        style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
          maxWidth: containerMaxWidth + 'px',
          paddingTop: displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-text-wrap",
        style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
      }, displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index), displayMedia && ('card' === style || 'inlineimage' === style) && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-title-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-title",
        tagName: 'h' + titleFont[0].level,
        value: testimonials[index].title
      })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
        style: {
          margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-content",
        tagName: 'div',
        value: testimonials[index].content
      }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-wrap"
      }, displayMedia && 'card' !== style && 'inlineimage' !== style && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-name-wrap"
      }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-name-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-name",
        tagName: 'div',
        value: testimonials[index].name
      })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-occupation-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-occupation",
        tagName: 'div',
        value: testimonials[index].occupation
      })))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${columns[3]} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}${layout && layout === 'carousel' ? ' tns-carousel-wrap' : ''}`
    }, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle} kt-carousel-container-arrowstyle-${arrowStyle}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`,
      "data-columns-xxl": columns[0],
      "data-columns-xl": columns[1],
      "data-columns-md": columns[2],
      "data-columns-sm": columns[3],
      "data-columns-xs": columns[4],
      "data-columns-ss": columns[5],
      "data-slider-anim-speed": transSpeed,
      "data-slider-scroll": slidesScroll,
      "data-slider-arrows": 'none' === arrowStyle ? false : true,
      "data-slider-dots": 'none' === dotStyle ? false : true,
      "data-slider-hover-pause": "false",
      "data-slider-auto": autoPlay,
      "data-slider-speed": autoSpeed
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-testimonial-carousel-item kb-slide-item",
      key: n
    }, renderTestimonialPreview(n))))), layout && layout !== 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-testimonial-grid-wrap',
      style: {
        'grid-row-gap': columnGap + 'px',
        'grid-column-gap': columnGap + 'px'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => renderTestimonialPreview(n))));
  }
}, {
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: _ref => {
    let {
      attributes
    } = _ref;
    const {
      uniqueID,
      testimonials,
      style,
      hAlign,
      layout,
      itemsCount,
      containerBackground,
      containerBorder,
      containerBorderWidth,
      containerBorderRadius,
      containerPadding,
      mediaStyles,
      displayTitle,
      titleFont,
      displayContent,
      displayName,
      displayMedia,
      displayShadow,
      shadow,
      displayRating,
      ratingStyles,
      displayOccupation,
      containerBackgroundOpacity,
      containerBorderOpacity,
      containerMaxWidth,
      columnGap,
      autoPlay,
      autoSpeed,
      transSpeed,
      slidesScroll,
      arrowStyle,
      dotStyle,
      columns,
      displayIcon,
      iconStyles,
      containerVAlign
    } = attributes;
    const containerStyles = {
      boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
      borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
      background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
      borderRadius: undefined !== containerBorderRadius && '' !== containerBorderRadius && !isNaN(containerBorderRadius) ? containerBorderRadius + 'px' : undefined,
      borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
      borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
      borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
      borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
      paddingTop: containerPadding && undefined !== containerPadding[0] && '' !== containerPadding[0] && null !== containerPadding[0] ? containerPadding[0] + 'px' : undefined,
      paddingRight: containerPadding && undefined !== containerPadding[1] && '' !== containerPadding[1] && null !== containerPadding[1] ? containerPadding[1] + 'px' : undefined,
      paddingBottom: containerPadding && undefined !== containerPadding[2] && '' !== containerPadding[2] && null !== containerPadding[2] ? containerPadding[2] + 'px' : undefined,
      paddingLeft: containerPadding && undefined !== containerPadding[3] && '' !== containerPadding[3] && null !== containerPadding[3] ? containerPadding[3] + 'px' : undefined,
      maxWidth: 'bubble' === style || 'inlineimage' === style || undefined === containerMaxWidth || '' === containerMaxWidth ? undefined : containerMaxWidth + 'px'
    };

    const renderTestimonialIcon = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-svg-testimonial-global-icon-wrap",
        style: {
          margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
        name: iconStyles[0].icon,
        size: iconStyles[0].size,
        title: iconStyles[0].title ? iconStyles[0].title : '',
        strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
        style: {
          color: iconStyles[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].color) : undefined,
          borderRadius: undefined !== iconStyles[0].borderRadius ? iconStyles[0].borderRadius + 'px' : undefined,
          borderTopWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] && null !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
          borderRightWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] && null !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
          borderBottomWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] && null !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
          borderLeftWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] && null !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
          background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
          borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
          padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
        }
      }));
    };

    const renderTestimonialMedia = index => {
      let urlOutput = testimonials[index].url;

      if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
        if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
          urlOutput = testimonials[index].url;
        } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if ('card' === style && containerMaxWidth <= 100) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 75) {
          if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
            urlOutput = testimonials[index].sizes.thumbnail.url;
          } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-inner-wrap",
        style: {
          width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
          borderColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(mediaStyles[0].border),
          backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
          borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
          padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
          marginTop: mediaStyles[0].margin && '' !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
          marginRight: mediaStyles[0].margin && '' !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
          marginBottom: mediaStyles[0].margin && '' !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
          marginLeft: mediaStyles[0].margin && '' !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kadence-testimonial-image-intrisic',
        style: {
          paddingBottom: 'card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio) ? mediaStyles[0].ratio + '%' : undefined
        }
      }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
        name: testimonials[index].icon,
        size: testimonials[index].isize,
        title: testimonials[index].ititle ? testimonials[index].ititle : '',
        strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
        style: {
          display: 'flex',
          color: testimonials[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(testimonials[index].color) : undefined
        }
      }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-testimonial-image',
        style: {
          backgroundImage: "url('" + urlOutput + "')",
          backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined
        }
      }))));
    };

    const renderTestimonialPreview = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-item-wrap kt-testimonial-item-${index}${containerVAlign ? ' testimonial-valign-' + containerVAlign : ''}`,
        style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
          maxWidth: containerMaxWidth + 'px',
          paddingTop: displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-text-wrap",
        style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
      }, displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index), displayMedia && ('card' === style || 'inlineimage' === style) && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-title-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-title",
        tagName: 'h' + titleFont[0].level,
        value: testimonials[index].title
      })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
        style: {
          margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-content",
        tagName: 'div',
        value: testimonials[index].content
      }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-wrap"
      }, displayMedia && 'card' !== style && 'inlineimage' !== style && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-name-wrap"
      }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-name-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-name",
        tagName: 'div',
        value: testimonials[index].name
      })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-occupation-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-occupation",
        tagName: 'div',
        value: testimonials[index].occupation
      })))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${columns[3]} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`
    }, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`,
      "data-columns-xxl": columns[0],
      "data-columns-xl": columns[1],
      "data-columns-md": columns[2],
      "data-columns-sm": columns[3],
      "data-columns-xs": columns[4],
      "data-columns-ss": columns[5],
      "data-slider-anim-speed": transSpeed,
      "data-slider-scroll": slidesScroll,
      "data-slider-arrows": 'none' === arrowStyle ? false : true,
      "data-slider-dots": 'none' === dotStyle ? false : true,
      "data-slider-hover-pause": "false",
      "data-slider-auto": autoPlay,
      "data-slider-speed": autoSpeed
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-testimonial-carousel-item kb-slide-item",
      key: n
    }, renderTestimonialPreview(n))))), layout && layout !== 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-testimonial-grid-wrap',
      style: {
        'grid-row-gap': columnGap + 'px',
        'grid-column-gap': columnGap + 'px'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => renderTestimonialPreview(n))));
  }
}, {
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: _ref2 => {
    let {
      attributes
    } = _ref2;
    const {
      uniqueID,
      testimonials,
      style,
      hAlign,
      layout,
      itemsCount,
      containerBackground,
      containerBorder,
      containerBorderWidth,
      containerBorderRadius,
      containerPadding,
      mediaStyles,
      displayTitle,
      titleFont,
      displayContent,
      displayName,
      displayMedia,
      displayShadow,
      shadow,
      displayRating,
      ratingStyles,
      displayOccupation,
      containerBackgroundOpacity,
      containerBorderOpacity,
      containerMaxWidth,
      columnGap,
      autoPlay,
      autoSpeed,
      transSpeed,
      slidesScroll,
      arrowStyle,
      dotStyle,
      columns,
      displayIcon,
      iconStyles,
      containerVAlign
    } = attributes;
    const containerStyles = {
      boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
      borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
      background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
      borderRadius: undefined !== containerBorderRadius && '' !== containerBorderRadius && !isNaN(containerBorderRadius) ? containerBorderRadius + 'px' : undefined,
      borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
      borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
      borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
      borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
      paddingTop: containerPadding && undefined !== containerPadding[0] && '' !== containerPadding[0] && null !== containerPadding[0] ? containerPadding[0] + 'px' : undefined,
      paddingRight: containerPadding && undefined !== containerPadding[1] && '' !== containerPadding[1] && null !== containerPadding[1] ? containerPadding[1] + 'px' : undefined,
      paddingBottom: containerPadding && undefined !== containerPadding[2] && '' !== containerPadding[2] && null !== containerPadding[2] ? containerPadding[2] + 'px' : undefined,
      paddingLeft: containerPadding && undefined !== containerPadding[3] && '' !== containerPadding[3] && null !== containerPadding[3] ? containerPadding[3] + 'px' : undefined,
      maxWidth: 'bubble' === style || 'inlineimage' === style || undefined === containerMaxWidth || '' === containerMaxWidth ? undefined : containerMaxWidth + 'px'
    };

    const renderTestimonialIcon = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-svg-testimonial-global-icon-wrap",
        style: {
          margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
        name: iconStyles[0].icon,
        size: iconStyles[0].size,
        title: iconStyles[0].title ? iconStyles[0].title : '',
        strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
        style: {
          color: iconStyles[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].color) : undefined,
          borderRadius: undefined !== iconStyles[0].borderRadius ? iconStyles[0].borderRadius + 'px' : undefined,
          borderTopWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] && null !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
          borderRightWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] && null !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
          borderBottomWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] && null !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
          borderLeftWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] && null !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
          background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
          borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
          padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
        }
      }));
    };

    const renderTestimonialMedia = index => {
      let urlOutput = testimonials[index].url;

      if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
        if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
          urlOutput = testimonials[index].url;
        } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if ('card' === style && containerMaxWidth <= 100) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 75) {
          if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
            urlOutput = testimonials[index].sizes.thumbnail.url;
          } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-inner-wrap",
        style: {
          width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
          borderColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(mediaStyles[0].border),
          backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
          borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
          padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
          marginTop: mediaStyles[0].margin && '' !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
          marginRight: mediaStyles[0].margin && '' !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
          marginBottom: mediaStyles[0].margin && '' !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
          marginLeft: mediaStyles[0].margin && '' !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kadence-testimonial-image-intrisic',
        style: {
          paddingBottom: 'card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio) ? mediaStyles[0].ratio + '%' : undefined
        }
      }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
        name: testimonials[index].icon,
        size: testimonials[index].isize,
        title: testimonials[index].ititle ? testimonials[index].ititle : '',
        strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
        style: {
          display: 'flex',
          color: testimonials[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(testimonials[index].color) : undefined
        }
      }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-testimonial-image',
        style: {
          backgroundImage: "url('" + urlOutput + "')",
          backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined
        }
      }))));
    };

    const renderTestimonialPreview = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-item-wrap kt-testimonial-item-${index}${containerVAlign ? ' testimonial-valign-' + containerVAlign : ''}`,
        style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
          maxWidth: containerMaxWidth + 'px',
          paddingTop: displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-text-wrap",
        style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
      }, displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index), displayMedia && ('card' === style || 'inlineimage' === style) && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-title-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-title",
        tagName: 'h' + titleFont[0].level,
        value: testimonials[index].title
      })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
        style: {
          margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-content",
        tagName: 'div',
        value: testimonials[index].content
      }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-wrap"
      }, displayMedia && 'card' !== style && 'inlineimage' !== style && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-name-wrap"
      }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-name-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-name",
        tagName: 'div',
        value: testimonials[index].name
      })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-occupation-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-occupation",
        tagName: 'div',
        value: testimonials[index].occupation
      })))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${columns[3]} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`
    }, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`,
      "data-columns-xxl": columns[0],
      "data-columns-xl": columns[1],
      "data-columns-md": columns[2],
      "data-columns-sm": columns[3],
      "data-columns-xs": columns[4],
      "data-columns-ss": columns[5],
      "data-slider-anim-speed": transSpeed,
      "data-slider-scroll": slidesScroll,
      "data-slider-arrows": 'none' === arrowStyle ? false : true,
      "data-slider-dots": 'none' === dotStyle ? false : true,
      "data-slider-hover-pause": "false",
      "data-slider-auto": autoPlay,
      "data-slider-speed": autoSpeed
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-testimonial-carousel-item kb-slide-item",
      key: n
    }, renderTestimonialPreview(n))))), layout && layout !== 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-testimonial-grid-wrap',
      style: {
        'grid-row-gap': columnGap + 'px',
        'grid-column-gap': columnGap + 'px'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => renderTestimonialPreview(n))));
  }
}, {
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: _ref3 => {
    let {
      attributes
    } = _ref3;
    const {
      uniqueID,
      testimonials,
      style,
      hAlign,
      layout,
      itemsCount,
      containerBackground,
      containerBorder,
      containerBorderWidth,
      containerBorderRadius,
      containerPadding,
      mediaStyles,
      displayTitle,
      titleFont,
      displayContent,
      displayName,
      displayMedia,
      displayShadow,
      shadow,
      displayRating,
      ratingStyles,
      displayOccupation,
      containerBackgroundOpacity,
      containerBorderOpacity,
      containerMaxWidth,
      columnGap,
      autoPlay,
      autoSpeed,
      transSpeed,
      slidesScroll,
      arrowStyle,
      dotStyle,
      columns,
      displayIcon,
      iconStyles,
      containerVAlign
    } = attributes;
    const containerStyles = {
      boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
      borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
      background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
      borderRadius: !isNaN(containerBorderRadius) ? containerBorderRadius + 'px' : undefined,
      borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
      borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
      borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
      borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
      paddingTop: containerPadding && undefined !== containerPadding[0] && '' !== containerPadding[0] && null !== containerPadding[0] ? containerPadding[0] + 'px' : undefined,
      paddingRight: containerPadding && undefined !== containerPadding[1] && '' !== containerPadding[1] && null !== containerPadding[1] ? containerPadding[1] + 'px' : undefined,
      paddingBottom: containerPadding && undefined !== containerPadding[2] && '' !== containerPadding[2] && null !== containerPadding[2] ? containerPadding[2] + 'px' : undefined,
      paddingLeft: containerPadding && undefined !== containerPadding[3] && '' !== containerPadding[3] && null !== containerPadding[3] ? containerPadding[3] + 'px' : undefined,
      maxWidth: 'bubble' === style || 'inlineimage' === style || undefined === containerMaxWidth || '' === containerMaxWidth ? undefined : containerMaxWidth + 'px'
    };

    const renderTestimonialIcon = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-svg-testimonial-global-icon-wrap",
        style: {
          margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
        name: iconStyles[0].icon,
        size: iconStyles[0].size,
        title: iconStyles[0].title ? iconStyles[0].title : '',
        strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
        style: {
          color: iconStyles[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].color) : undefined,
          borderRadius: undefined !== iconStyles[0].borderRadius ? iconStyles[0].borderRadius + 'px' : undefined,
          borderTopWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] && null !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
          borderRightWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] && null !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
          borderBottomWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] && null !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
          borderLeftWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] && null !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
          background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
          borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
          padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
        }
      }));
    };

    const renderTestimonialMedia = index => {
      let urlOutput = testimonials[index].url;

      if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
        if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
          urlOutput = testimonials[index].url;
        } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if ('card' === style && containerMaxWidth <= 100) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 75) {
          if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
            urlOutput = testimonials[index].sizes.thumbnail.url;
          } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-inner-wrap",
        style: {
          width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
          borderColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(mediaStyles[0].border),
          backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
          borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
          padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
          marginTop: mediaStyles[0].margin && '' !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
          marginRight: mediaStyles[0].margin && '' !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
          marginBottom: mediaStyles[0].margin && '' !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
          marginLeft: mediaStyles[0].margin && '' !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kadence-testimonial-image-intrisic',
        style: {
          paddingBottom: 'card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio) ? mediaStyles[0].ratio + '%' : undefined
        }
      }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
        name: testimonials[index].icon,
        size: testimonials[index].isize,
        title: testimonials[index].ititle ? testimonials[index].ititle : '',
        strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
        style: {
          display: 'flex',
          color: testimonials[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(testimonials[index].color) : undefined
        }
      }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-testimonial-image',
        style: {
          backgroundImage: "url('" + urlOutput + "')",
          backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined
        }
      }))));
    };

    const renderTestimonialPreview = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-item-wrap kt-testimonial-item-${index}${containerVAlign ? ' testimonial-valign-' + containerVAlign : ''}`,
        style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
          maxWidth: containerMaxWidth + 'px',
          paddingTop: displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-text-wrap",
        style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
      }, displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index), displayMedia && ('card' === style || 'inlineimage' === style) && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-title-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-title",
        tagName: 'h' + titleFont[0].level,
        value: testimonials[index].title
      })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
        style: {
          margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-content",
        tagName: 'div',
        value: testimonials[index].content
      }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-wrap"
      }, displayMedia && 'card' !== style && 'inlineimage' !== style && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-name-wrap"
      }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-name-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-name",
        tagName: 'div',
        value: testimonials[index].name
      })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-occupation-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-occupation",
        tagName: 'div',
        value: testimonials[index].occupation
      })))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${columns[3]} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`
    }, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`,
      "data-columns-xxl": columns[0],
      "data-columns-xl": columns[1],
      "data-columns-md": columns[2],
      "data-columns-sm": columns[3],
      "data-columns-xs": columns[4],
      "data-columns-ss": columns[5],
      "data-slider-anim-speed": transSpeed,
      "data-slider-scroll": slidesScroll,
      "data-slider-arrows": 'none' === arrowStyle ? false : true,
      "data-slider-dots": 'none' === dotStyle ? false : true,
      "data-slider-hover-pause": "false",
      "data-slider-auto": autoPlay,
      "data-slider-speed": autoSpeed
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-testimonial-carousel-item kb-slide-item",
      key: n
    }, renderTestimonialPreview(n))))), layout && layout !== 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-testimonial-grid-wrap',
      style: {
        'grid-row-gap': columnGap + 'px',
        'grid-column-gap': columnGap + 'px'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => renderTestimonialPreview(n))));
  }
}, {
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: _ref4 => {
    let {
      attributes
    } = _ref4;
    const {
      uniqueID,
      testimonials,
      style,
      hAlign,
      layout,
      itemsCount,
      containerBackground,
      containerBorder,
      containerBorderWidth,
      containerBorderRadius,
      containerPadding,
      mediaStyles,
      displayTitle,
      titleFont,
      displayContent,
      displayName,
      displayMedia,
      displayShadow,
      shadow,
      displayRating,
      ratingStyles,
      displayOccupation,
      containerBackgroundOpacity,
      containerBorderOpacity,
      containerMaxWidth,
      columnGap,
      autoPlay,
      autoSpeed,
      transSpeed,
      slidesScroll,
      arrowStyle,
      dotStyle,
      columns,
      displayIcon,
      iconStyles
    } = attributes;
    const containerStyles = {
      boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
      borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
      background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
      borderRadius: containerBorderRadius ? containerBorderRadius + 'px' : undefined,
      borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
      borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
      borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
      borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
      paddingTop: containerPadding && undefined !== containerPadding[0] && '' !== containerPadding[0] && null !== containerPadding[0] ? containerPadding[0] + 'px' : undefined,
      paddingRight: containerPadding && undefined !== containerPadding[1] && '' !== containerPadding[1] && null !== containerPadding[1] ? containerPadding[1] + 'px' : undefined,
      paddingBottom: containerPadding && undefined !== containerPadding[2] && '' !== containerPadding[2] && null !== containerPadding[2] ? containerPadding[2] + 'px' : undefined,
      paddingLeft: containerPadding && undefined !== containerPadding[3] && '' !== containerPadding[3] && null !== containerPadding[3] ? containerPadding[3] + 'px' : undefined,
      maxWidth: 'bubble' === style || 'inlineimage' === style || undefined === containerMaxWidth || '' === containerMaxWidth ? undefined : containerMaxWidth + 'px'
    };

    const renderTestimonialIcon = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-svg-testimonial-global-icon-wrap",
        style: {
          margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
        name: iconStyles[0].icon,
        size: iconStyles[0].size,
        title: iconStyles[0].title ? iconStyles[0].title : '',
        strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
        style: {
          color: iconStyles[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].color) : undefined,
          borderRadius: undefined !== iconStyles[0].borderRadius ? iconStyles[0].borderRadius + 'px' : undefined,
          borderTopWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] && null !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
          borderRightWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] && null !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
          borderBottomWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] && null !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
          borderLeftWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] && null !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
          background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
          borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
          padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
        }
      }));
    };

    const renderTestimonialMedia = index => {
      let urlOutput = testimonials[index].url;

      if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
        if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
          urlOutput = testimonials[index].url;
        } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if ('card' === style && containerMaxWidth <= 100) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 75) {
          if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
            urlOutput = testimonials[index].sizes.thumbnail.url;
          } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-inner-wrap",
        style: {
          width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
          borderColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(mediaStyles[0].border),
          backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
          borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
          padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
          marginTop: mediaStyles[0].margin && '' !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
          marginRight: mediaStyles[0].margin && '' !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
          marginBottom: mediaStyles[0].margin && '' !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
          marginLeft: mediaStyles[0].margin && '' !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kadence-testimonial-image-intrisic',
        style: {
          paddingBottom: 'card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio) ? mediaStyles[0].ratio + '%' : undefined
        }
      }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
        name: testimonials[index].icon,
        size: testimonials[index].isize,
        title: testimonials[index].ititle ? testimonials[index].ititle : '',
        strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
        style: {
          display: 'flex',
          color: testimonials[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(testimonials[index].color) : undefined
        }
      }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-testimonial-image',
        style: {
          backgroundImage: "url('" + urlOutput + "')",
          backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined
        }
      }))));
    };

    const renderTestimonialPreview = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-item-wrap kt-testimonial-item-${index}`,
        style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
          maxWidth: containerMaxWidth + 'px',
          paddingTop: displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-text-wrap",
        style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
      }, displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index), displayMedia && ('card' === style || 'inlineimage' === style) && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-title-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-title",
        tagName: 'h' + titleFont[0].level,
        value: testimonials[index].title
      })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
        style: {
          margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-content",
        tagName: 'div',
        value: testimonials[index].content
      }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-wrap"
      }, displayMedia && 'card' !== style && 'inlineimage' !== style && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-name-wrap"
      }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-name-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-name",
        tagName: 'div',
        value: testimonials[index].name
      })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-occupation-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-occupation",
        tagName: 'div',
        value: testimonials[index].occupation
      })))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${columns[3]} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`
    }, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`,
      "data-columns-xxl": columns[0],
      "data-columns-xl": columns[1],
      "data-columns-md": columns[2],
      "data-columns-sm": columns[3],
      "data-columns-xs": columns[4],
      "data-columns-ss": columns[5],
      "data-slider-anim-speed": transSpeed,
      "data-slider-scroll": slidesScroll,
      "data-slider-arrows": 'none' === arrowStyle ? false : true,
      "data-slider-dots": 'none' === dotStyle ? false : true,
      "data-slider-hover-pause": "false",
      "data-slider-auto": autoPlay,
      "data-slider-speed": autoSpeed
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-testimonial-carousel-item kb-slide-item",
      key: n
    }, renderTestimonialPreview(n))))), layout && layout !== 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-testimonial-grid-wrap',
      style: {
        'grid-row-gap': columnGap + 'px',
        'grid-column-gap': columnGap + 'px'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => renderTestimonialPreview(n))));
  }
}, {
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: _ref5 => {
    let {
      attributes
    } = _ref5;
    const {
      uniqueID,
      testimonials,
      style,
      hAlign,
      layout,
      itemsCount,
      containerBackground,
      containerBorder,
      containerBorderWidth,
      containerBorderRadius,
      containerPadding,
      mediaStyles,
      displayTitle,
      titleFont,
      displayContent,
      displayName,
      displayMedia,
      displayShadow,
      shadow,
      displayRating,
      ratingStyles,
      displayOccupation,
      containerBackgroundOpacity,
      containerBorderOpacity,
      containerMaxWidth,
      columnGap,
      autoPlay,
      autoSpeed,
      transSpeed,
      slidesScroll,
      arrowStyle,
      dotStyle,
      columns,
      displayIcon,
      iconStyles
    } = attributes;
    const containerStyles = {
      boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
      borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
      background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
      borderRadius: containerBorderRadius ? containerBorderRadius + 'px' : undefined,
      borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
      borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
      borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
      borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
      paddingTop: containerPadding && undefined !== containerPadding[0] && '' !== containerPadding[0] && null !== containerPadding[0] ? containerPadding[0] + 'px' : undefined,
      paddingRight: containerPadding && undefined !== containerPadding[1] && '' !== containerPadding[1] && null !== containerPadding[1] ? containerPadding[1] + 'px' : undefined,
      paddingBottom: containerPadding && undefined !== containerPadding[2] && '' !== containerPadding[2] && null !== containerPadding[2] ? containerPadding[2] + 'px' : undefined,
      paddingLeft: containerPadding && undefined !== containerPadding[3] && '' !== containerPadding[3] && null !== containerPadding[3] ? containerPadding[3] + 'px' : undefined,
      maxWidth: 'bubble' === style || 'inlineimage' === style || undefined === containerMaxWidth || '' === containerMaxWidth ? undefined : containerMaxWidth + 'px'
    };

    const renderTestimonialIcon = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-svg-testimonial-global-icon-wrap",
        style: {
          margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
        name: iconStyles[0].icon,
        size: iconStyles[0].size,
        title: iconStyles[0].title ? iconStyles[0].title : '',
        strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
        style: {
          color: iconStyles[0].color ? iconStyles[0].color : undefined,
          borderRadius: undefined !== iconStyles[0].borderRadius ? iconStyles[0].borderRadius + 'px' : undefined,
          borderTopWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] && null !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
          borderRightWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] && null !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
          borderBottomWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] && null !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
          borderLeftWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] && null !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
          background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
          borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
          padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
        }
      }));
    };

    const renderTestimonialMedia = index => {
      let urlOutput = testimonials[index].url;

      if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
        if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
          urlOutput = testimonials[index].url;
        } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if ('card' === style && containerMaxWidth <= 100) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 75) {
          if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
            urlOutput = testimonials[index].sizes.thumbnail.url;
          } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-inner-wrap",
        style: {
          width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
          borderColor: mediaStyles[0].border,
          backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
          borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
          padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
          marginTop: mediaStyles[0].margin && '' !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
          marginRight: mediaStyles[0].margin && '' !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
          marginBottom: mediaStyles[0].margin && '' !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
          marginLeft: mediaStyles[0].margin && '' !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kadence-testimonial-image-intrisic',
        style: {
          paddingBottom: 'card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio) ? mediaStyles[0].ratio + '%' : undefined
        }
      }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
        name: testimonials[index].icon,
        size: testimonials[index].isize,
        title: testimonials[index].ititle ? testimonials[index].ititle : '',
        strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
        style: {
          display: 'flex',
          color: testimonials[index].color ? testimonials[index].color : undefined
        }
      }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-testimonial-image',
        style: {
          backgroundImage: 'url("' + urlOutput + '")',
          backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined
        }
      }))));
    };

    const renderTestimonialPreview = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-item-wrap kt-testimonial-item-${index}`,
        style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
          maxWidth: containerMaxWidth + 'px',
          paddingTop: displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-text-wrap",
        style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
      }, displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index), displayMedia && ('card' === style || 'inlineimage' === style) && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-title-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-title",
        tagName: 'h' + titleFont[0].level,
        value: testimonials[index].title
      })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
        style: {
          margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-content",
        tagName: 'div',
        value: testimonials[index].content
      }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-wrap"
      }, displayMedia && 'card' !== style && 'inlineimage' !== style && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-name-wrap"
      }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-name-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-name",
        tagName: 'div',
        value: testimonials[index].name
      })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-occupation-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-occupation",
        tagName: 'div',
        value: testimonials[index].occupation
      })))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${columns[3]} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`
    }, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`,
      "data-columns-xxl": columns[0],
      "data-columns-xl": columns[1],
      "data-columns-md": columns[2],
      "data-columns-sm": columns[3],
      "data-columns-xs": columns[4],
      "data-columns-ss": columns[5],
      "data-slider-anim-speed": transSpeed,
      "data-slider-scroll": slidesScroll,
      "data-slider-arrows": 'none' === arrowStyle ? false : true,
      "data-slider-dots": 'none' === dotStyle ? false : true,
      "data-slider-hover-pause": "false",
      "data-slider-auto": autoPlay,
      "data-slider-speed": autoSpeed
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-testimonial-carousel-item kb-slide-item",
      key: n
    }, renderTestimonialPreview(n))))), layout && layout !== 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-testimonial-grid-wrap',
      style: {
        'grid-row-gap': columnGap + 'px',
        'grid-column-gap': columnGap + 'px'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => renderTestimonialPreview(n))));
  }
}, {
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: _ref6 => {
    let {
      attributes
    } = _ref6;
    const {
      uniqueID,
      testimonials,
      style,
      hAlign,
      layout,
      itemsCount,
      containerBackground,
      containerBorder,
      containerBorderWidth,
      containerBorderRadius,
      containerPadding,
      mediaStyles,
      displayTitle,
      titleFont,
      displayContent,
      displayName,
      displayMedia,
      displayShadow,
      shadow,
      displayRating,
      ratingStyles,
      displayOccupation,
      containerBackgroundOpacity,
      containerBorderOpacity,
      containerMaxWidth,
      columnGap,
      autoPlay,
      autoSpeed,
      transSpeed,
      slidesScroll,
      arrowStyle,
      dotStyle,
      columns,
      displayIcon,
      iconStyles
    } = attributes;
    const containerStyles = {
      boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
      borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
      background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
      borderRadius: containerBorderRadius ? containerBorderRadius + 'px' : undefined,
      borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
      borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
      borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
      borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
      paddingTop: containerPadding && undefined !== containerPadding[0] && '' !== containerPadding[0] && null !== containerPadding[0] ? containerPadding[0] + 'px' : undefined,
      paddingLeft: containerPadding && undefined !== containerPadding[1] && '' !== containerPadding[1] && null !== containerPadding[1] ? containerPadding[1] + 'px' : undefined,
      paddingBottom: containerPadding && undefined !== containerPadding[2] && '' !== containerPadding[2] && null !== containerPadding[2] ? containerPadding[2] + 'px' : undefined,
      paddingRight: containerPadding && undefined !== containerPadding[3] && '' !== containerPadding[3] && null !== containerPadding[3] ? containerPadding[3] + 'px' : undefined,
      maxWidth: 'bubble' === style || 'inlineimage' === style || undefined === containerMaxWidth || '' === containerMaxWidth ? undefined : containerMaxWidth + 'px'
    };

    const renderTestimonialIcon = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-svg-testimonial-global-icon-wrap",
        style: {
          margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
        name: iconStyles[0].icon,
        size: iconStyles[0].size,
        title: iconStyles[0].title ? iconStyles[0].title : '',
        strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
        style: {
          color: iconStyles[0].color ? iconStyles[0].color : undefined,
          borderRadius: undefined !== iconStyles[0].borderRadius ? iconStyles[0].borderRadius + 'px' : undefined,
          borderTopWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] && null !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
          borderRightWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] && null !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
          borderBottomWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] && null !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
          borderLeftWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] && null !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
          background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
          borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
          padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
        }
      }));
    };

    const renderTestimonialMedia = index => {
      let urlOutput = testimonials[index].url;

      if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
        if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
          urlOutput = testimonials[index].url;
        } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if ('card' === style && containerMaxWidth <= 100) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 75) {
          if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
            urlOutput = testimonials[index].sizes.thumbnail.url;
          } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-inner-wrap",
        style: {
          width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
          borderColor: mediaStyles[0].border,
          backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
          borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
          padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
          marginTop: mediaStyles[0].margin && '' !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
          marginRight: mediaStyles[0].margin && '' !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
          marginBottom: mediaStyles[0].margin && '' !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
          marginLeft: mediaStyles[0].margin && '' !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kadence-testimonial-image-intrisic',
        style: {
          paddingBottom: 'card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio) ? mediaStyles[0].ratio + '%' : undefined
        }
      }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
        name: testimonials[index].icon,
        size: testimonials[index].isize,
        title: testimonials[index].ititle ? testimonials[index].ititle : '',
        strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
        style: {
          display: 'flex',
          color: testimonials[index].color ? testimonials[index].color : undefined
        }
      }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-testimonial-image',
        style: {
          backgroundImage: 'url("' + urlOutput + '")',
          backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined
        }
      }))));
    };

    const renderTestimonialPreview = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-item-wrap kt-testimonial-item-${index}`,
        style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
          maxWidth: containerMaxWidth + 'px',
          paddingTop: displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-text-wrap",
        style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
      }, displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index), displayMedia && ('card' === style || 'inlineimage' === style) && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-title-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-title",
        tagName: 'h' + titleFont[0].level,
        value: testimonials[index].title
      })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
        style: {
          margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-content",
        tagName: 'div',
        value: testimonials[index].content
      }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-wrap"
      }, displayMedia && 'card' !== style && 'inlineimage' !== style && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-name-wrap"
      }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-name-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-name",
        tagName: 'div',
        value: testimonials[index].name
      })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-occupation-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-occupation",
        tagName: 'div',
        value: testimonials[index].occupation
      })))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${columns[3]} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`
    }, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`,
      "data-columns-xxl": columns[0],
      "data-columns-xl": columns[1],
      "data-columns-md": columns[2],
      "data-columns-sm": columns[3],
      "data-columns-xs": columns[4],
      "data-columns-ss": columns[5],
      "data-slider-anim-speed": transSpeed,
      "data-slider-scroll": slidesScroll,
      "data-slider-arrows": 'none' === arrowStyle ? false : true,
      "data-slider-dots": 'none' === dotStyle ? false : true,
      "data-slider-hover-pause": "false",
      "data-slider-auto": autoPlay,
      "data-slider-speed": autoSpeed
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-testimonial-carousel-item kb-slide-item",
      key: n
    }, renderTestimonialPreview(n))))), layout && layout !== 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-testimonial-grid-wrap',
      style: {
        'grid-row-gap': columnGap + 'px',
        'grid-column-gap': columnGap + 'px'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => renderTestimonialPreview(n))));
  }
}, {
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: _ref7 => {
    let {
      attributes
    } = _ref7;
    const {
      uniqueID,
      testimonials,
      style,
      hAlign,
      layout,
      itemsCount,
      containerBackground,
      containerBorder,
      containerBorderWidth,
      containerBorderRadius,
      containerPadding,
      mediaStyles,
      displayTitle,
      titleFont,
      displayContent,
      displayName,
      displayMedia,
      displayShadow,
      shadow,
      displayRating,
      ratingStyles,
      displayOccupation,
      containerBackgroundOpacity,
      containerBorderOpacity,
      containerMaxWidth,
      columnGap,
      autoPlay,
      autoSpeed,
      transSpeed,
      slidesScroll,
      arrowStyle,
      dotStyle,
      columns,
      displayIcon,
      iconStyles
    } = attributes;
    const containerStyles = {
      boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
      borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
      background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
      borderRadius: containerBorderRadius ? containerBorderRadius + 'px' : undefined,
      borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
      borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
      borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
      borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
      padding: containerPadding ? containerPadding[0] + 'px ' + containerPadding[1] + 'px ' + containerPadding[2] + 'px ' + containerPadding[3] + 'px' : '',
      maxWidth: 'bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px'
    };

    const renderTestimonialIcon = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-svg-testimonial-global-icon-wrap",
        style: {
          margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
        name: iconStyles[0].icon,
        size: iconStyles[0].size,
        title: iconStyles[0].title ? iconStyles[0].title : '',
        strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
        style: {
          color: iconStyles[0].color ? iconStyles[0].color : undefined,
          borderRadius: undefined !== iconStyles[0].borderRadius ? iconStyles[0].borderRadius + 'px' : undefined,
          borderTopWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] && null !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
          borderRightWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] && null !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
          borderBottomWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] && null !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
          borderLeftWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] && null !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
          background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
          borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
          padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
        }
      }));
    };

    const renderTestimonialMedia = index => {
      let urlOutput = testimonials[index].url;

      if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
        if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
          urlOutput = testimonials[index].url;
        } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if ('card' === style && containerMaxWidth <= 100) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 75) {
          if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
            urlOutput = testimonials[index].sizes.thumbnail.url;
          } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-inner-wrap",
        style: {
          width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
          borderColor: mediaStyles[0].border,
          backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
          borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
          padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
          marginTop: mediaStyles[0].margin && '' !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
          marginRight: mediaStyles[0].margin && '' !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
          marginBottom: mediaStyles[0].margin && '' !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
          marginLeft: mediaStyles[0].margin && '' !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kadence-testimonial-image-intrisic',
        style: {
          paddingBottom: 'card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio) ? mediaStyles[0].ratio + '%' : undefined
        }
      }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
        name: testimonials[index].icon,
        size: testimonials[index].isize,
        title: testimonials[index].ititle ? testimonials[index].ititle : '',
        strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
        style: {
          display: 'flex',
          color: testimonials[index].color ? testimonials[index].color : undefined
        }
      }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-testimonial-image',
        style: {
          backgroundImage: 'url("' + urlOutput + '")',
          backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined
        }
      }))));
    };

    const renderTestimonialPreview = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-item-wrap kt-testimonial-item-${index}`,
        style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
          maxWidth: containerMaxWidth + 'px',
          paddingTop: displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-text-wrap",
        style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
      }, displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index), displayMedia && ('card' === style || 'inlineimage' === style) && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-title-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-title",
        tagName: 'h' + titleFont[0].level,
        value: testimonials[index].title
      })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
        style: {
          margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-content",
        tagName: 'div',
        value: testimonials[index].content
      }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-wrap"
      }, displayMedia && 'card' !== style && 'inlineimage' !== style && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-name-wrap"
      }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-name-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-name",
        tagName: 'div',
        value: testimonials[index].name
      })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-occupation-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-occupation",
        tagName: 'div',
        value: testimonials[index].occupation
      })))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${columns[3]} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`
    }, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`,
      "data-columns-xxl": columns[0],
      "data-columns-xl": columns[1],
      "data-columns-md": columns[2],
      "data-columns-sm": columns[3],
      "data-columns-xs": columns[4],
      "data-columns-ss": columns[5],
      "data-slider-anim-speed": transSpeed,
      "data-slider-scroll": slidesScroll,
      "data-slider-arrows": 'none' === arrowStyle ? false : true,
      "data-slider-dots": 'none' === dotStyle ? false : true,
      "data-slider-hover-pause": "false",
      "data-slider-auto": autoPlay,
      "data-slider-speed": autoSpeed
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-testimonial-carousel-item kb-slide-item",
      key: n
    }, renderTestimonialPreview(n))))), layout && layout !== 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-testimonial-grid-wrap',
      style: {
        'grid-row-gap': columnGap + 'px',
        'grid-column-gap': columnGap + 'px'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => renderTestimonialPreview(n))));
  }
}, {
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: _ref8 => {
    let {
      attributes
    } = _ref8;
    const {
      uniqueID,
      testimonials,
      style,
      hAlign,
      layout,
      itemsCount,
      containerBackground,
      containerBorder,
      containerBorderWidth,
      containerBorderRadius,
      containerPadding,
      mediaStyles,
      displayTitle,
      titleFont,
      displayContent,
      displayName,
      displayMedia,
      displayShadow,
      shadow,
      displayRating,
      ratingStyles,
      displayOccupation,
      containerBackgroundOpacity,
      containerBorderOpacity,
      containerMaxWidth,
      columnGap,
      autoPlay,
      autoSpeed,
      transSpeed,
      slidesScroll,
      arrowStyle,
      dotStyle,
      columns,
      displayIcon,
      iconStyles
    } = attributes;
    const containerStyles = {
      boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
      borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
      background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
      borderRadius: containerBorderRadius + 'px',
      borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
      borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
      borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
      borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
      padding: containerPadding ? containerPadding[0] + 'px ' + containerPadding[1] + 'px ' + containerPadding[2] + 'px ' + containerPadding[3] + 'px' : '',
      maxWidth: 'bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px'
    };

    const renderTestimonialIcon = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-svg-testimonial-global-icon-wrap",
        style: {
          margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
        name: iconStyles[0].icon,
        size: iconStyles[0].size,
        title: iconStyles[0].title ? iconStyles[0].title : '',
        strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
        style: {
          color: iconStyles[0].color ? iconStyles[0].color : undefined,
          borderRadius: undefined !== iconStyles[0].borderRadius ? iconStyles[0].borderRadius + 'px' : undefined,
          borderTopWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] && null !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
          borderRightWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] && null !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
          borderBottomWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] && null !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
          borderLeftWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] && null !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
          background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
          borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
          padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
        }
      }));
    };

    const renderTestimonialMedia = index => {
      let urlOutput = testimonials[index].url;

      if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
        if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
          urlOutput = testimonials[index].url;
        } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if ('card' === style && containerMaxWidth <= 100) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 75) {
          if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
            urlOutput = testimonials[index].sizes.thumbnail.url;
          } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-inner-wrap",
        style: {
          width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
          borderColor: mediaStyles[0].border,
          backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
          borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
          padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
          marginTop: mediaStyles[0].margin && '' !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
          marginRight: mediaStyles[0].margin && '' !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
          marginBottom: mediaStyles[0].margin && '' !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
          marginLeft: mediaStyles[0].margin && '' !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kadence-testimonial-image-intrisic',
        style: {
          paddingBottom: 'card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio) ? mediaStyles[0].ratio + '%' : undefined
        }
      }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
        name: testimonials[index].icon,
        size: testimonials[index].isize,
        title: testimonials[index].ititle ? testimonials[index].ititle : '',
        strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
        style: {
          display: 'flex',
          color: testimonials[index].color ? testimonials[index].color : undefined
        }
      }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-testimonial-image',
        style: {
          backgroundImage: 'url("' + urlOutput + '")',
          backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined
        }
      }))));
    };

    const renderTestimonialPreview = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-item-wrap kt-testimonial-item-${index}`,
        style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
          maxWidth: containerMaxWidth + 'px',
          paddingTop: displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-text-wrap",
        style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
      }, displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index), displayMedia && ('card' === style || 'inlineimage' === style) && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-title-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-title",
        tagName: 'h' + titleFont[0].level,
        value: testimonials[index].title
      })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
        style: {
          margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-content",
        tagName: 'div',
        value: testimonials[index].content
      }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-wrap"
      }, displayMedia && 'card' !== style && 'inlineimage' !== style && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-name-wrap"
      }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-name-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-name",
        tagName: 'div',
        value: testimonials[index].name
      })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-occupation-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-occupation",
        tagName: 'div',
        value: testimonials[index].occupation
      })))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${columns[3]} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`
    }, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`,
      "data-columns-xxl": columns[0],
      "data-columns-xl": columns[1],
      "data-columns-md": columns[2],
      "data-columns-sm": columns[3],
      "data-columns-xs": columns[4],
      "data-columns-ss": columns[5],
      "data-slider-anim-speed": transSpeed,
      "data-slider-scroll": slidesScroll,
      "data-slider-arrows": 'none' === arrowStyle ? false : true,
      "data-slider-dots": 'none' === dotStyle ? false : true,
      "data-slider-hover-pause": "false",
      "data-slider-auto": autoPlay,
      "data-slider-speed": autoSpeed
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-testimonial-carousel-item kb-slide-item",
      key: n
    }, renderTestimonialPreview(n))))), layout && layout !== 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-testimonial-grid-wrap',
      style: {
        'grid-row-gap': columnGap + 'px',
        'grid-column-gap': columnGap + 'px'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => renderTestimonialPreview(n))));
  }
}, {
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: _ref9 => {
    let {
      attributes
    } = _ref9;
    const {
      uniqueID,
      testimonials,
      style,
      hAlign,
      layout,
      itemsCount,
      containerBackground,
      containerBorder,
      containerBorderWidth,
      containerBorderRadius,
      containerPadding,
      mediaStyles,
      displayTitle,
      titleFont,
      displayContent,
      displayName,
      displayMedia,
      displayShadow,
      shadow,
      displayRating,
      ratingStyles,
      displayOccupation,
      containerBackgroundOpacity,
      containerBorderOpacity,
      containerMaxWidth,
      columnGap,
      autoPlay,
      autoSpeed,
      transSpeed,
      slidesScroll,
      arrowStyle,
      dotStyle,
      columns,
      displayIcon,
      iconStyles
    } = attributes;
    const containerStyles = {
      boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
      borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
      background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
      borderRadius: containerBorderRadius + 'px',
      borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
      borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
      borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
      borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
      padding: containerPadding ? containerPadding[0] + 'px ' + containerPadding[1] + 'px ' + containerPadding[2] + 'px ' + containerPadding[3] + 'px' : '',
      maxWidth: 'bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px'
    };

    const renderTestimonialIcon = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-svg-testimonial-global-icon-wrap",
        style: {
          margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
        name: iconStyles[0].icon,
        size: iconStyles[0].size,
        title: iconStyles[0].title ? iconStyles[0].title : '',
        strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
        style: {
          color: iconStyles[0].color ? iconStyles[0].color : undefined,
          borderRadius: undefined !== iconStyles[0].borderRadius ? iconStyles[0].borderRadius + 'px' : undefined,
          borderTopWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] && null !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
          borderRightWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] && null !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
          borderBottomWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] && null !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
          borderLeftWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] && null !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
          background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
          borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
          padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
        }
      }));
    };

    const renderTestimonialMedia = index => {
      let urlOutput = testimonials[index].url;

      if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
        if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
          urlOutput = testimonials[index].url;
        } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if ('card' === style && containerMaxWidth <= 100) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 75) {
          if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
            urlOutput = testimonials[index].sizes.thumbnail.url;
          } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-inner-wrap",
        style: {
          width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
          borderColor: mediaStyles[0].border,
          backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
          borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
          padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
          marginTop: mediaStyles[0].margin && '' !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
          marginRight: mediaStyles[0].margin && '' !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
          marginBottom: mediaStyles[0].margin && '' !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
          marginLeft: mediaStyles[0].margin && '' !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kadence-testimonial-image-intrisic',
        style: {
          paddingBottom: 'card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio) ? mediaStyles[0].ratio + '%' : undefined
        }
      }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
        name: testimonials[index].icon,
        size: testimonials[index].isize,
        title: testimonials[index].ititle ? testimonials[index].ititle : '',
        strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
        style: {
          display: 'flex',
          color: testimonials[index].color ? testimonials[index].color : undefined
        }
      }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-testimonial-image',
        style: {
          backgroundImage: 'url("' + urlOutput + '")',
          backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined
        }
      }))));
    };

    const renderTestimonialPreview = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-item-wrap kt-testimonial-item-${index}`,
        style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
          maxWidth: containerMaxWidth + 'px',
          paddingTop: displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-text-wrap",
        style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
      }, displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index), displayMedia && ('card' === style || 'inlineimage' === style) && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-title-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-title",
        tagName: 'h' + titleFont[0].level,
        value: testimonials[index].title
      })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
        style: {
          margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-content",
        tagName: 'div',
        value: testimonials[index].content
      }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-wrap"
      }, displayMedia && 'card' !== style && 'inlineimage' !== style && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-name-wrap"
      }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-name-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-name",
        tagName: 'div',
        value: testimonials[index].name
      })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-occupation-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-occupation",
        tagName: 'div',
        value: testimonials[index].occupation
      })))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${columns[3]} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`
    }, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`,
      "data-columns-xxl": columns[0],
      "data-columns-xl": columns[1],
      "data-columns-md": columns[2],
      "data-columns-sm": columns[3],
      "data-columns-xs": columns[4],
      "data-columns-ss": columns[5],
      "data-slider-anim-speed": transSpeed,
      "data-slider-scroll": slidesScroll,
      "data-slider-arrows": 'none' === arrowStyle ? false : true,
      "data-slider-dots": 'none' === dotStyle ? false : true,
      "data-slider-hover-pause": "false",
      "data-slider-auto": autoPlay,
      "data-slider-speed": autoSpeed
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-testimonial-carousel-item",
      key: n
    }, renderTestimonialPreview(n))))), layout && layout !== 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-testimonial-grid-wrap',
      style: {
        'grid-row-gap': columnGap + 'px',
        'grid-column-gap': columnGap + 'px'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => renderTestimonialPreview(n))));
  }
}, {
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: _ref10 => {
    let {
      attributes
    } = _ref10;
    const {
      uniqueID,
      testimonials,
      style,
      hAlign,
      layout,
      itemsCount,
      containerBackground,
      containerBorder,
      containerBorderWidth,
      containerBorderRadius,
      containerPadding,
      mediaStyles,
      displayTitle,
      titleFont,
      displayContent,
      displayName,
      displayMedia,
      displayShadow,
      shadow,
      displayRating,
      ratingStyles,
      displayOccupation,
      containerBackgroundOpacity,
      containerBorderOpacity,
      containerMaxWidth,
      columnGap,
      autoPlay,
      autoSpeed,
      transSpeed,
      slidesScroll,
      arrowStyle,
      dotStyle,
      columns,
      displayIcon,
      iconStyles
    } = attributes;
    const containerStyles = {
      boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
      borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
      background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
      borderRadius: containerBorderRadius + 'px',
      borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
      borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
      borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
      borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
      padding: containerPadding ? containerPadding[0] + 'px ' + containerPadding[1] + 'px ' + containerPadding[2] + 'px ' + containerPadding[3] + 'px' : '',
      maxWidth: 'bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px'
    };

    const renderTestimonialIcon = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-svg-testimonial-global-icon-wrap",
        style: {
          margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
        name: iconStyles[0].icon,
        size: iconStyles[0].size,
        title: iconStyles[0].title ? iconStyles[0].title : '',
        strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
        style: {
          color: iconStyles[0].color ? iconStyles[0].color : undefined,
          borderRadius: undefined !== iconStyles[0].borderRadius ? iconStyles[0].borderRadius + 'px' : undefined,
          borderTopWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
          borderRightWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
          borderBottomWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
          borderLeftWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
          background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
          borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
          padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
        }
      }));
    };

    const renderTestimonialMedia = index => {
      let urlOutput = testimonials[index].url;

      if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
        if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
          urlOutput = testimonials[index].url;
        } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if ('card' === style && containerMaxWidth <= 100) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 75) {
          if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
            urlOutput = testimonials[index].sizes.thumbnail.url;
          } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-inner-wrap",
        style: {
          width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
          borderColor: mediaStyles[0].border,
          backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
          borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
          padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
          marginTop: mediaStyles[0].margin && '' !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
          marginRight: mediaStyles[0].margin && '' !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
          marginBottom: mediaStyles[0].margin && '' !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
          marginLeft: mediaStyles[0].margin && '' !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kadence-testimonial-image-intrisic',
        style: {
          paddingBottom: undefined === mediaStyles[0].ratio || '' === mediaStyles[0].ratio ? undefined : mediaStyles[0].ratio + '%'
        }
      }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
        name: testimonials[index].icon,
        size: testimonials[index].isize,
        title: testimonials[index].ititle ? testimonials[index].ititle : '',
        strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
        style: {
          display: 'flex',
          color: testimonials[index].color ? testimonials[index].color : undefined
        }
      }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-testimonial-image',
        style: {
          backgroundImage: 'url("' + urlOutput + '")',
          backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
          borderRadius: undefined !== mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined
        }
      }))));
    };

    const renderTestimonialPreview = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-item-wrap kt-testimonial-item-${index}`,
        style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
          maxWidth: containerMaxWidth + 'px',
          paddingTop: displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-text-wrap",
        style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
      }, displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index), displayMedia && ('card' === style || 'inlineimage' === style) && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-title-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-title",
        tagName: 'h' + titleFont[0].level,
        value: testimonials[index].title
      })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
        style: {
          margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-content",
        tagName: 'div',
        value: testimonials[index].content
      }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-wrap"
      }, displayMedia && 'card' !== style && 'inlineimage' !== style && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-name-wrap"
      }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-name-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-name",
        tagName: 'div',
        value: testimonials[index].name
      })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-occupation-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-occupation",
        tagName: 'div',
        value: testimonials[index].occupation
      })))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${columns[3]} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`
    }, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`,
      "data-columns-xxl": columns[0],
      "data-columns-xl": columns[1],
      "data-columns-md": columns[2],
      "data-columns-sm": columns[3],
      "data-columns-xs": columns[4],
      "data-columns-ss": columns[5],
      "data-slider-anim-speed": transSpeed,
      "data-slider-scroll": slidesScroll,
      "data-slider-arrows": 'none' === arrowStyle ? false : true,
      "data-slider-dots": 'none' === dotStyle ? false : true,
      "data-slider-hover-pause": "false",
      "data-slider-auto": autoPlay,
      "data-slider-speed": autoSpeed
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-testimonial-carousel-item",
      key: n
    }, renderTestimonialPreview(n))))), layout && layout !== 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-testimonial-grid-wrap',
      style: {
        'grid-row-gap': columnGap + 'px',
        'grid-column-gap': columnGap + 'px'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => renderTestimonialPreview(n))));
  }
}, {
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: _ref11 => {
    let {
      attributes
    } = _ref11;
    const {
      uniqueID,
      testimonials,
      style,
      hAlign,
      layout,
      itemsCount,
      containerBackground,
      containerBorder,
      containerBorderWidth,
      containerBorderRadius,
      containerPadding,
      mediaStyles,
      displayTitle,
      titleFont,
      displayContent,
      displayName,
      displayMedia,
      displayShadow,
      shadow,
      displayRating,
      ratingStyles,
      displayOccupation,
      containerBackgroundOpacity,
      containerBorderOpacity,
      containerMaxWidth,
      columnGap,
      autoPlay,
      autoSpeed,
      transSpeed,
      slidesScroll,
      arrowStyle,
      dotStyle,
      columns,
      displayIcon,
      iconStyles
    } = attributes;
    const containerStyles = {
      boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
      borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
      background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
      borderRadius: containerBorderRadius + 'px',
      borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
      borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
      borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
      borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
      padding: containerPadding ? containerPadding[0] + 'px ' + containerPadding[1] + 'px ' + containerPadding[2] + 'px ' + containerPadding[3] + 'px' : '',
      maxWidth: 'bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px'
    };

    const renderTestimonialMedia = index => {
      let urlOutput = testimonials[index].url;

      if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
        if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
          urlOutput = testimonials[index].url;
        } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if ('card' === style && containerMaxWidth <= 100) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
          if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
          if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        } else if (mediaStyles[0].width <= 75) {
          if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
            urlOutput = testimonials[index].sizes.thumbnail.url;
          } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
            urlOutput = testimonials[index].sizes.medium.url;
          } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
            urlOutput = testimonials[index].sizes.large.url;
          }
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-media-inner-wrap",
        style: {
          width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
          borderColor: mediaStyles[0].border,
          backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
          borderRadius: mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
          borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
          padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
          marginTop: mediaStyles[0].margin && '' !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
          marginRight: mediaStyles[0].margin && '' !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
          marginBottom: mediaStyles[0].margin && '' !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
          marginLeft: mediaStyles[0].margin && '' !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kadence-testimonial-image-intrisic'
      }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
        name: testimonials[index].icon,
        size: testimonials[index].isize,
        title: testimonials[index].ititle ? testimonials[index].ititle : '',
        strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
        style: {
          display: 'flex',
          color: testimonials[index].color ? testimonials[index].color : undefined
        }
      }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-testimonial-image',
        style: {
          backgroundImage: 'url("' + urlOutput + '")',
          backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
          borderRadius: mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined
        }
      }))));
    };

    const renderTestimonialPreview = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-item-wrap kt-testimonial-item-${index}`,
        style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
          maxWidth: containerMaxWidth + 'px',
          paddingTop: displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-text-wrap",
        style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
      }, displayIcon && iconStyles[0].icon && 'card' !== style && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-svg-testimonial-global-icon-wrap",
        style: {
          margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
        name: iconStyles[0].icon,
        size: iconStyles[0].size,
        title: iconStyles[0].title ? iconStyles[0].title : '',
        strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
        style: {
          color: iconStyles[0].color ? iconStyles[0].color : undefined,
          borderRadius: iconStyles[0].borderRadius ? iconStyles[0].borderRadius + 'px' : undefined,
          borderTopWidth: iconStyles[0].borderWidth && '' !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
          borderRightWidth: iconStyles[0].borderWidth && '' !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
          borderBottomWidth: iconStyles[0].borderWidth && '' !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
          borderLeftWidth: iconStyles[0].borderWidth && '' !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
          background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
          borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
          padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
        }
      })), displayMedia && ('card' === style || 'inlineimage' === style) && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-title-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-title",
        tagName: 'h' + titleFont[0].level,
        value: testimonials[index].title
      })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
        style: {
          margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconRender, {
        className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
        name: 'fas_star',
        size: ratingStyles[0].size,
        style: {
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(ratingStyles[0].color)
        }
      })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-content",
        tagName: 'div',
        value: testimonials[index].content
      }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-wrap"
      }, displayMedia && 'card' !== style && 'inlineimage' !== style && ('icon' !== testimonials[index].media && testimonials[index].url || 'icon' === testimonials[index].media && testimonials[index].icon) && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-meta-name-wrap"
      }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-name-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-name",
        tagName: 'div',
        value: testimonials[index].name
      })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-testimonial-occupation-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        className: "kt-testimonial-occupation",
        tagName: 'div',
        value: testimonials[index].occupation
      })))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]} kt-blocks-testimonials-wrap${uniqueID}`
    }, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`,
      "data-columns-xxl": columns[0],
      "data-columns-xl": columns[1],
      "data-columns-md": columns[2],
      "data-columns-sm": columns[3],
      "data-columns-xs": columns[4],
      "data-columns-ss": columns[5],
      "data-slider-anim-speed": transSpeed,
      "data-slider-scroll": slidesScroll,
      "data-slider-arrows": 'none' === arrowStyle ? false : true,
      "data-slider-dots": 'none' === dotStyle ? false : true,
      "data-slider-hover-pause": "false",
      "data-slider-auto": autoPlay,
      "data-slider-speed": autoSpeed
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-testimonial-carousel-item",
      key: n
    }, renderTestimonialPreview(n))))), layout && layout !== 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-testimonial-grid-wrap',
      style: {
        'grid-row-gap': columnGap + 'px',
        'grid-column-gap': columnGap + 'px'
      }
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_1__.times)(itemsCount, n => renderTestimonialPreview(n))));
  }
}]);

/***/ }),

/***/ "./src/blocks/testimonials/edit.js":
/*!*****************************************!*\
  !*** ./src/blocks/testimonials/edit.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/testimonials/editor.scss");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_slick__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-slick */ "./node_modules/react-slick/lib/index.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/close-small.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/image.js");



/**
 * BLOCK: Kadence Split Content
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Css
 */

/**
 * Import Icons
 */


/**
 * Import External
 */



/**
 * Import Components
 */



/**
 * Internal block libraries
 */







/**
 * Build the overlay edit
 */

function KadenceTestimonials(_ref) {
  let {
    attributes,
    setAttributes,
    className,
    clientId,
    isSelected,
    context
  } = _ref;
  const {
    uniqueID,
    testimonials,
    style,
    hAlign,
    layout,
    itemsCount,
    containerBackground,
    containerBorder,
    containerBorderWidth,
    containerBorderRadius,
    containerPadding,
    tabletContainerPadding,
    mobileContainerPadding,
    containerPaddingType,
    mediaStyles,
    displayTitle,
    titleFont,
    titleMinHeight,
    containerMinHeight,
    containerVAlign,
    contentMinHeight,
    displayContent,
    contentFont,
    displayName,
    displayMedia,
    nameFont,
    displayShadow,
    shadow,
    displayRating,
    ratingStyles,
    displayOccupation,
    occupationFont,
    containerBackgroundOpacity,
    containerBorderOpacity,
    containerMaxWidth,
    columnGap,
    autoPlay,
    autoSpeed,
    transSpeed,
    slidesScroll,
    arrowStyle,
    dotStyle,
    columns,
    columnControl,
    displayIcon,
    iconStyles,
    wrapperPaddingType,
    wrapperPadding,
    wrapperTabletPadding,
    wrapperMobilePadding,
    inQueryBlock
  } = attributes;
  const [containerPaddingControl, setContainerPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [tabletContainerPaddingControl, setTabletContainerPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [mobileContainerPaddingControl, setMobileContainerPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [containerBorderControl, setContainerBorderControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [mediaBorderControl, setMediaBorderControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [mediaPaddingControl, setMediaPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [mediaMarginControl, setMediaMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [titlePaddingControl, setTitlePaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [titleMarginControl, setTitleMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [ratingMarginControl, setRatingMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [iconBorderControl, setIconBorderControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [iconMarginControl, setIconMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [iconPaddingControl, setIconPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [showPreset, setShowPreset] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [wrapperPaddingControls, setWrapperPaddingControls] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const {
    addUniqueID
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_10__.useDispatch)('kadenceblocks/data');
  const {
    isUniqueID,
    isUniqueBlock,
    previewDevice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_10__.useSelect)(select => {
    return {
      isUniqueID: value => select('kadenceblocks/data').isUniqueID(value),
      isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
      previewDevice: select('kadenceblocks/data').getPreviewDeviceType()
    };
  }, [clientId]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    let smallID = '_' + clientId.substr(2, 9);

    if (!uniqueID) {
      setAttributes({
        uniqueID: smallID
      });
      addUniqueID(smallID, clientId);
    } else if (!isUniqueID(uniqueID)) {
      // This checks if we are just switching views, client ID the same means we don't need to update.
      if (!isUniqueBlock(uniqueID, clientId)) {
        attributes.uniqueID = smallID;
        setAttributes({
          uniqueID: smallID
        });
        addUniqueID(smallID, clientId);
      }
    } else {
      addUniqueID(uniqueID, clientId);
    }

    if (mediaStyles[0].borderWidth[0] === mediaStyles[0].borderWidth[1] && mediaStyles[0].borderWidth[0] === mediaStyles[0].borderWidth[2] && mediaStyles[0].borderWidth[0] === mediaStyles[0].borderWidth[3]) {
      setMediaBorderControl('linked');
    } else {
      setMediaBorderControl('individual');
    }

    if (mediaStyles[0].padding[0] === mediaStyles[0].padding[1] && mediaStyles[0].padding[0] === mediaStyles[0].padding[2] && mediaStyles[0].padding[0] === mediaStyles[0].padding[3]) {
      setMediaPaddingControl('linked');
    } else {
      setMediaPaddingControl('individual');
    }

    if (mediaStyles[0].margin[0] === mediaStyles[0].margin[1] && mediaStyles[0].margin[0] === mediaStyles[0].margin[2] && mediaStyles[0].margin[0] === mediaStyles[0].margin[3]) {
      setMediaMarginControl('linked');
    } else {
      setMediaMarginControl('individual');
    }

    if (titleFont[0].padding[0] === titleFont[0].padding[1] && titleFont[0].padding[0] === titleFont[0].padding[2] && titleFont[0].padding[0] === titleFont[0].padding[3]) {
      setTitlePaddingControl('linked');
    } else {
      setTitlePaddingControl('individual');
    }

    if (titleFont[0].margin[0] === titleFont[0].margin[1] && titleFont[0].margin[0] === titleFont[0].margin[2] && titleFont[0].margin[0] === titleFont[0].margin[3]) {
      setTitleMarginControl('linked');
    } else {
      setTitleMarginControl('individual');
    }

    if (containerBorderWidth[0] === containerBorderWidth[1] && containerBorderWidth[0] === containerBorderWidth[2] && containerBorderWidth[0] === containerBorderWidth[3]) {
      setContainerBorderControl('linked');
    } else {
      setContainerBorderControl('individual');
    }

    if (containerPadding[0] === containerPadding[1] && containerPadding[0] === containerPadding[2] && containerPadding[0] === containerPadding[3]) {
      setContainerPaddingControl('linked');
    } else {
      setContainerPaddingControl('individual');
    }

    if (tabletContainerPadding[0] === tabletContainerPadding[1] && tabletContainerPadding[0] === tabletContainerPadding[2] && tabletContainerPadding[0] === tabletContainerPadding[3]) {
      setTabletContainerPaddingControl('linked');
    } else {
      setTabletContainerPaddingControl('individual');
    }

    if (mobileContainerPadding[0] === mobileContainerPadding[1] && mobileContainerPadding[0] === mobileContainerPadding[2] && mobileContainerPadding[0] === mobileContainerPadding[3]) {
      setMobileContainerPaddingControl('linked');
    } else {
      setMobileContainerPaddingControl('individual');
    }

    if (ratingStyles[0] && ratingStyles[0].margin && ratingStyles[0].margin[0] === ratingStyles[0].margin[1] && ratingStyles[0].margin[0] === ratingStyles[0].margin[2] && ratingStyles[0].margin[0] === ratingStyles[0].margin[3]) {
      setRatingMarginControl('linked');
    } else {
      setRatingMarginControl('individual');
    }

    if (undefined !== iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] && iconStyles[0].borderWidth[0] === iconStyles[0].borderWidth[1] && iconStyles[0].borderWidth[0] === iconStyles[0].borderWidth[2] && iconStyles[0].borderWidth[0] === iconStyles[0].borderWidth[3]) {
      setIconBorderControl('linked');
    } else {
      setIconBorderControl('individual');
    }

    if (undefined !== iconStyles[0].padding && undefined !== iconStyles[0].padding[0] && iconStyles[0].padding[0] === iconStyles[0].padding[1] && iconStyles[0].padding[0] === iconStyles[0].padding[2] && iconStyles[0].padding[0] === iconStyles[0].padding[3]) {
      setIconPaddingControl('linked');
    } else {
      setIconPaddingControl('individual');
    }

    if (iconStyles[0].margin[0] === iconStyles[0].margin[1] && iconStyles[0].margin[0] === iconStyles[0].margin[2] && iconStyles[0].margin[0] === iconStyles[0].margin[3]) {
      setIconMarginControl('linked');
    } else {
      setIconMarginControl('individual');
    }

    if (context && context.queryId && context.postId) {
      if (context.queryId !== inQueryBlock) {
        setAttributes({
          inQueryBlock: context.queryId
        });
      }
    } else if (inQueryBlock) {
      setAttributes({
        inQueryBlock: false
      });
    }
  }, []);

  const onMove = (oldIndex, newIndex) => {
    let newTestimonials = [...testimonials];
    newTestimonials.splice(newIndex, 1, testimonials[oldIndex]);
    newTestimonials.splice(oldIndex, 1, testimonials[newIndex]);
    setAttributes({
      testimonials: newTestimonials
    });
  };

  const onMoveForward = oldIndex => {
    if (oldIndex === testimonials.length - 1) {
      return;
    }

    onMove(oldIndex, oldIndex + 1);
  };

  const onMoveBackward = oldIndex => {
    if (oldIndex === 0) {
      return;
    }

    onMove(oldIndex, oldIndex - 1);
  };

  const onColumnChange = value => {
    let columnarray = [];

    if (1 === value) {
      columnarray = [1, 1, 1, 1, 1, 1];
    } else if (2 === value) {
      columnarray = [2, 2, 2, 2, 1, 1];
    } else if (3 === value) {
      columnarray = [3, 3, 3, 2, 1, 1];
    } else if (4 === value) {
      columnarray = [4, 4, 4, 3, 2, 2];
    } else if (5 === value) {
      columnarray = [5, 5, 5, 4, 4, 3];
    }

    setAttributes({
      columns: columnarray
    });
  };

  const setInitalLayout = key => {
    if ('skip' === key) {} else if ('basic' === key) {
      setAttributes({
        style: 'basic'
      });
    } else if ('card' === key) {
      setAttributes({
        style: 'card'
      });
    } else if ('bubble' === key) {
      setAttributes({
        style: 'bubble'
      });
    } else if ('inlineimage' === key) {
      setAttributes({
        style: 'inlineimage'
      });
    }
  };

  const styleOptions = [{
    key: 'basic',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Basic', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.testimonialBasicIcon
  }, {
    key: 'card',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Card', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.testimonialCardIcon
  }, {
    key: 'bubble',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Bubble', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.testimonialBubbleIcon
  }, {
    key: 'inlineimage',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Image In Content', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.testimonialInLineIcon
  }];
  const startlayoutOptions = [{
    key: 'skip',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Skip', 'kadence-blocks'),
    icon: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Skip')
  }, {
    key: 'basic',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Basic', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.testimonialBasicIcon
  }, {
    key: 'card',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Card', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.testimonialCardIcon
  }, {
    key: 'bubble',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Bubble', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.testimonialBubbleIcon
  }, {
    key: 'inlineimage',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Image In Content', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.testimonialInLineIcon
  }];
  const columnControlTypes = [{
    key: 'linked',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Linked', 'kadence-blocks'),
    icon: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Linked', 'kadence-blocks')
  }, {
    key: 'individual',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Individual', 'kadence-blocks'),
    icon: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Individual', 'kadence-blocks')
  }];
  const VAlignOptions = [{
    key: 'top',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Top', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.alignTopIcon
  }, {
    key: 'middle',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Middle', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.alignMiddleIcon
  }, {
    key: 'bottom',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Bottom', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.alignBottomIcon
  }];
  const paddingMin = wrapperPaddingType === 'em' || wrapperPaddingType === 'rem' ? 0 : 0;
  const paddingMax = wrapperPaddingType === 'em' || wrapperPaddingType === 'rem' ? 12 : 200;
  const paddingStep = wrapperPaddingType === 'em' || wrapperPaddingType === 'rem' ? 0.1 : 1;
  const previewContainerMinHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== containerMinHeight && undefined !== containerMinHeight[0] ? containerMinHeight[0] : '', undefined !== containerMinHeight && undefined !== containerMinHeight[1] ? containerMinHeight[1] : '', undefined !== containerMinHeight && undefined !== containerMinHeight[2] ? containerMinHeight[2] : '');
  const previewTitleMinHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : '', undefined !== titleMinHeight && undefined !== titleMinHeight[1] ? titleMinHeight[1] : '', undefined !== titleMinHeight && undefined !== titleMinHeight[2] ? titleMinHeight[2] : '');
  const previewContentMinHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== contentMinHeight && undefined !== contentMinHeight[0] ? contentMinHeight[0] : '', undefined !== contentMinHeight && undefined !== contentMinHeight[1] ? contentMinHeight[1] : '', undefined !== contentMinHeight && undefined !== contentMinHeight[2] ? contentMinHeight[2] : '');
  const previewWrapperPaddingTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== wrapperPadding && undefined !== wrapperPadding[0] ? wrapperPadding[0] : '', undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[0] ? wrapperTabletPadding[0] : '', undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[0] ? wrapperMobilePadding[0] : '');
  const previewWrapperPaddingRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== wrapperPadding && undefined !== wrapperPadding[1] ? wrapperPadding[1] : '', undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[1] ? wrapperTabletPadding[1] : '', undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[1] ? wrapperMobilePadding[1] : '');
  const previewWrapperPaddingBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== wrapperPadding && undefined !== wrapperPadding[2] ? wrapperPadding[2] : '', undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[2] ? wrapperTabletPadding[2] : '', undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[2] ? wrapperMobilePadding[2] : '');
  const previewWrapperPaddingLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== wrapperPadding && undefined !== wrapperPadding[3] ? wrapperPadding[3] : '', undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[3] ? wrapperTabletPadding[3] : '', undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[3] ? wrapperMobilePadding[3] : '');
  const previewContainerPaddingTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== containerPadding && undefined !== containerPadding[0] ? containerPadding[0] : '', undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[0] ? tabletContainerPadding[0] : '', undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[0] ? mobileContainerPadding[0] : '');
  const previewContainerPaddingRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== containerPadding && undefined !== containerPadding[1] ? containerPadding[1] : '', undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[1] ? tabletContainerPadding[1] : '', undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[1] ? mobileContainerPadding[1] : '');
  const previewContainerPaddingBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== containerPadding && undefined !== containerPadding[2] ? containerPadding[2] : '', undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[2] ? tabletContainerPadding[2] : '', undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[2] ? mobileContainerPadding[2] : '');
  const previewContainerPaddingLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== containerPadding && undefined !== containerPadding[3] ? containerPadding[3] : '', undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[3] ? tabletContainerPadding[3] : '', undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[3] ? mobileContainerPadding[3] : '');
  const previewTitleFont = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== titleFont[0].size && undefined !== titleFont[0].size[0] && '' !== titleFont[0].size[0] ? titleFont[0].size[0] : '', undefined !== titleFont[0].size && undefined !== titleFont[0].size[1] && '' !== titleFont[0].size[1] ? titleFont[0].size[1] : '', undefined !== titleFont[0].size && undefined !== titleFont[0].size[2] && '' !== titleFont[0].size[2] ? titleFont[0].size[2] : '');
  const previewTitleLineHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[0] && '' !== titleFont[0].lineHeight[0] ? titleFont[0].lineHeight[0] : '', undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[1] && '' !== titleFont[0].lineHeight[1] ? titleFont[0].lineHeight[1] : '', undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[2] && '' !== titleFont[0].lineHeight[2] ? titleFont[0].lineHeight[2] : '');
  const previewContentFont = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== contentFont[0].size && undefined !== contentFont[0].size[0] && '' !== contentFont[0].size[0] ? contentFont[0].size[0] : '', undefined !== contentFont[0].size && undefined !== contentFont[0].size[1] && '' !== contentFont[0].size[1] ? contentFont[0].size[1] : '', undefined !== contentFont[0].size && undefined !== contentFont[0].size[2] && '' !== contentFont[0].size[2] ? contentFont[0].size[2] : '');
  const previewContentLineHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== contentFont[0].lineHeight && undefined !== contentFont[0].lineHeight[0] && '' !== contentFont[0].lineHeight[0] ? contentFont[0].lineHeight[0] : '', undefined !== contentFont[0].lineHeight && undefined !== contentFont[0].lineHeight[1] && '' !== contentFont[0].lineHeight[1] ? contentFont[0].lineHeight[1] : '', undefined !== contentFont[0].lineHeight && undefined !== contentFont[0].lineHeight[2] && '' !== contentFont[0].lineHeight[2] ? contentFont[0].lineHeight[2] : '');
  const previewNameFont = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== nameFont[0].size && undefined !== nameFont[0].size[0] && '' !== nameFont[0].size[0] ? nameFont[0].size[0] : '', undefined !== nameFont[0].size && undefined !== nameFont[0].size[1] && '' !== nameFont[0].size[1] ? nameFont[0].size[1] : '', undefined !== nameFont[0].size && undefined !== nameFont[0].size[2] && '' !== nameFont[0].size[2] ? nameFont[0].size[2] : '');
  const previewNameLineHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== nameFont[0].lineHeight && undefined !== nameFont[0].lineHeight[0] && '' !== nameFont[0].lineHeight[0] ? nameFont[0].lineHeight[0] : '', undefined !== nameFont[0].lineHeight && undefined !== nameFont[0].lineHeight[1] && '' !== nameFont[0].lineHeight[1] ? nameFont[0].lineHeight[1] : '', undefined !== nameFont[0].lineHeight && undefined !== nameFont[0].lineHeight[2] && '' !== nameFont[0].lineHeight[2] ? nameFont[0].lineHeight[2] : '');
  const previewOccupationFont = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== occupationFont[0].size && undefined !== occupationFont[0].size[0] && '' !== occupationFont[0].size[0] ? occupationFont[0].size[0] : '', undefined !== occupationFont[0].size && undefined !== occupationFont[0].size[1] && '' !== occupationFont[0].size[1] ? occupationFont[0].size[1] : '', undefined !== occupationFont[0].size && undefined !== occupationFont[0].size[2] && '' !== occupationFont[0].size[2] ? occupationFont[0].size[2] : '');
  const previewOccupationLineHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== occupationFont[0].lineHeight && undefined !== occupationFont[0].lineHeight[0] && '' !== occupationFont[0].lineHeight[0] ? occupationFont[0].lineHeight[0] : '', undefined !== occupationFont[0].lineHeight && undefined !== occupationFont[0].lineHeight[1] && '' !== occupationFont[0].lineHeight[1] ? occupationFont[0].lineHeight[1] : '', undefined !== occupationFont[0].lineHeight && undefined !== occupationFont[0].lineHeight[2] && '' !== occupationFont[0].lineHeight[2] ? occupationFont[0].lineHeight[2] : '');
  const ref = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)();
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.useBlockProps)({
    ref
  });
  const columnControls = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.ButtonGroup, {
    className: "kt-size-type-options kt-outline-control",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Column Control Type', 'kadence-blocks')
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_5__.map)(columnControlTypes, _ref2 => {
    let {
      name,
      key,
      icon
    } = _ref2;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Tooltip, {
      text: name
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
      key: key,
      className: "kt-size-btn",
      isSmall: true,
      isPrimary: columnControl === key,
      "aria-pressed": columnControl === key,
      onClick: () => setAttributes({
        columnControl: key
      })
    }, icon));
  })), columnControl && columnControl !== 'individual' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Columns', 'kadence-blocks'),
    value: columns[2],
    onChange: onColumnChange,
    min: 1,
    max: 5
  }), columnControl && columnControl === 'individual' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h4", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Columns', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Screen Above 1500px', 'kadence-blocks'),
    value: columns[0],
    onChange: value => setAttributes({
      columns: [value, columns[1], columns[2], columns[3], columns[4], columns[5]]
    }),
    min: 1,
    max: 5
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Screen 1200px - 1499px', 'kadence-blocks'),
    value: columns[1],
    onChange: value => setAttributes({
      columns: [columns[0], value, columns[2], columns[3], columns[4], columns[5]]
    }),
    min: 1,
    max: 5
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Screen 992px - 1199px', 'kadence-blocks'),
    value: columns[2],
    onChange: value => setAttributes({
      columns: [columns[0], columns[1], value, columns[3], columns[4], columns[5]]
    }),
    min: 1,
    max: 5
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Screen 768px - 991px', 'kadence-blocks'),
    value: columns[3],
    onChange: value => setAttributes({
      columns: [columns[0], columns[1], columns[2], value, columns[4], columns[5]]
    }),
    min: 1,
    max: 5
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Screen 544px - 767px', 'kadence-blocks'),
    value: columns[4],
    onChange: value => setAttributes({
      columns: [columns[0], columns[1], columns[2], columns[3], value, columns[5]]
    }),
    min: 1,
    max: 5
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Screen Below 543px', 'kadence-blocks'),
    value: columns[5],
    onChange: value => setAttributes({
      columns: [columns[0], columns[1], columns[2], columns[3], columns[4], value]
    }),
    min: 1,
    max: 5
  })));
  const gconfig = {
    google: {
      families: [titleFont[0].family + (titleFont[0].variant ? ':' + titleFont[0].variant : '')]
    }
  };
  const tgconfig = {
    google: {
      families: [contentFont[0].family + (contentFont[0].variant ? ':' + contentFont[0].variant : '')]
    }
  };
  const lgconfig = {
    google: {
      families: [nameFont[0].family + (nameFont[0].variant ? ':' + nameFont[0].variant : '')]
    }
  };
  const ogconfig = {
    google: {
      families: [occupationFont[0].family + (occupationFont[0].variant ? ':' + occupationFont[0].variant : '')]
    }
  };
  const config = titleFont[0].google ? gconfig : '';
  const tconfig = contentFont[0].google ? tgconfig : '';
  const lconfig = nameFont[0].google ? lgconfig : '';
  const oconfig = occupationFont[0].google ? ogconfig : '';

  const saveTestimonials = (value, thisIndex) => {
    const newUpdate = testimonials.map((item, index) => {
      if (index === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      testimonials: newUpdate
    });
  };

  const ALLOWED_MEDIA_TYPES = ['image'];

  function CustomNextArrow(props) {
    const {
      className,
      style,
      onClick
    } = props;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("button", {
      className: className,
      style: { ...style,
        display: 'block'
      },
      onClick: onClick
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Dashicon, {
      icon: "arrow-right-alt2"
    }));
  }

  function CustomPrevArrow(props) {
    const {
      className,
      style,
      onClick
    } = props;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("button", {
      className: className,
      style: { ...style,
        display: 'block'
      },
      onClick: onClick
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Dashicon, {
      icon: "arrow-left-alt2"
    }));
  }

  const sliderSettings = {
    dots: dotStyle === 'none' ? false : true,
    arrows: arrowStyle === 'none' ? false : true,
    infinite: true,
    speed: transSpeed,
    draggable: false,
    autoplaySpeed: autoSpeed,
    autoplay: autoPlay,
    slidesToShow: columns[0],
    slidesToScroll: slidesScroll === 'all' ? columns[0] : 1,
    nextArrow: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(CustomNextArrow, null),
    prevArrow: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(CustomPrevArrow, null)
  };

  const savemediaStyles = value => {
    const newUpdate = mediaStyles.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      mediaStyles: newUpdate
    });
  };

  const saveIconStyles = value => {
    const newUpdate = iconStyles.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      iconStyles: newUpdate
    });
  };

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

  const saveContentFont = value => {
    const newUpdate = contentFont.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      contentFont: newUpdate
    });
  };

  const saveNameFont = value => {
    const newUpdate = nameFont.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      nameFont: newUpdate
    });
  };

  const saveOccupationFont = value => {
    const newUpdate = occupationFont.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      occupationFont: newUpdate
    });
  };

  const saveShadow = value => {
    const newUpdate = shadow.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      shadow: newUpdate
    });
  };

  const saveRatingStyles = value => {
    const newUpdate = ratingStyles.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      ratingStyles: newUpdate
    });
  };

  const renderTestimonialSettings = index => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Testimonial', 'kadence-blocks') + ' ' + (index + 1) + ' ' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Settings', 'kadence-blocks'),
      initialOpen: 1 === itemsCount ? true : false,
      panelName: 'kb-testimonials-' + index
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Media Type', 'kadence-blocks'),
      value: testimonials[index].media,
      options: [{
        value: 'image',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Image', 'kadence-blocks')
      }, {
        value: 'icon',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon', 'kadence-blocks')
      }],
      onChange: value => saveTestimonials({
        media: value
      }, index)
    }), 'icon' === testimonials[index].media && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.IconControl, {
      value: testimonials[index].icon,
      onChange: value => {
        saveTestimonials({
          icon: value
        }, index);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Size', 'kadence-blocks'),
      value: testimonials[index].isize,
      onChange: value => {
        saveTestimonials({
          isize: value
        }, index);
      },
      min: 5,
      max: 250
    }), testimonials[index].icon && 'fe' === testimonials[index].icon.substring(0, 2) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Line Width', 'kadence-blocks'),
      value: testimonials[index].istroke,
      onChange: value => {
        saveTestimonials({
          istroke: value
        }, index);
      },
      step: 0.5,
      min: 0.5,
      max: 4
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Color', 'kadence-blocks'),
      value: testimonials[index].color ? testimonials[index].color : '#555555',
      default: '#555555',
      onChange: value => saveTestimonials({
        color: value
      }, index)
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Rating', 'kadence-blocks'),
      value: testimonials[index].rating,
      onChange: value => {
        saveTestimonials({
          rating: value
        }, index);
      },
      step: 1,
      min: 1,
      max: 5
    }));
  };

  const renderSettings = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", null, (0,lodash__WEBPACK_IMPORTED_MODULE_5__.times)(itemsCount, n => renderTestimonialSettings(n)));

  const renderTestimonialIcon = index => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kt-svg-testimonial-global-icon-wrap",
      style: {
        margin: iconStyles[0].margin ? iconStyles[0].margin[0] + 'px ' + iconStyles[0].margin[1] + 'px ' + iconStyles[0].margin[2] + 'px ' + iconStyles[0].margin[3] + 'px' : ''
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.IconRender, {
      className: `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`,
      name: iconStyles[0].icon,
      size: iconStyles[0].size,
      title: iconStyles[0].title ? iconStyles[0].title : '',
      strokeWidth: 'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined,
      style: {
        color: iconStyles[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(iconStyles[0].color) : undefined,
        borderRadius: iconStyles[0].borderRadius + 'px',
        borderTopWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0] ? iconStyles[0].borderWidth[0] + 'px' : undefined,
        borderRightWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1] ? iconStyles[0].borderWidth[1] + 'px' : undefined,
        borderBottomWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2] ? iconStyles[0].borderWidth[2] + 'px' : undefined,
        borderLeftWidth: iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3] ? iconStyles[0].borderWidth[3] + 'px' : undefined,
        background: iconStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(iconStyles[0].background, undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1) : undefined,
        borderColor: iconStyles[0].border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(iconStyles[0].border, undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1) : undefined,
        padding: iconStyles[0].padding ? iconStyles[0].padding[0] + 'px ' + iconStyles[0].padding[1] + 'px ' + iconStyles[0].padding[2] + 'px ' + iconStyles[0].padding[3] + 'px' : ''
      }
    }));
  };

  const renderTestimonialMedia = index => {
    let urlOutput = testimonials[index].url;

    if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
      if ('card' === style && containerMaxWidth > 500 || mediaStyles[0].width > 600) {
        urlOutput = testimonials[index].url;
      } else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
        if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
          urlOutput = testimonials[index].sizes.large.url;
        }
      } else if ('card' === style && containerMaxWidth <= 100) {
        if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
          urlOutput = testimonials[index].sizes.medium.url;
        } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
          urlOutput = testimonials[index].sizes.large.url;
        }
      } else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
        if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
          urlOutput = testimonials[index].sizes.large.url;
        }
      } else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
        if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
          urlOutput = testimonials[index].sizes.medium.url;
        } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
          urlOutput = testimonials[index].sizes.large.url;
        }
      } else if (mediaStyles[0].width <= 75) {
        if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
          urlOutput = testimonials[index].sizes.thumbnail.url;
        } else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
          urlOutput = testimonials[index].sizes.medium.url;
        } else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
          urlOutput = testimonials[index].sizes.large.url;
        }
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kt-testimonial-media-wrap"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kt-testimonial-media-inner-wrap",
      style: {
        width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
        borderColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(mediaStyles[0].border),
        backgroundColor: mediaStyles[0].background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(mediaStyles[0].background, undefined !== mediaStyles[0].backgroundOpacity ? mediaStyles[0].backgroundOpacity : 1) : undefined,
        borderRadius: mediaStyles[0].borderRadius + 'px',
        borderWidth: mediaStyles[0].borderWidth ? mediaStyles[0].borderWidth[0] + 'px ' + mediaStyles[0].borderWidth[1] + 'px ' + mediaStyles[0].borderWidth[2] + 'px ' + mediaStyles[0].borderWidth[3] + 'px' : '',
        padding: mediaStyles[0].padding ? mediaStyles[0].padding[0] + 'px ' + mediaStyles[0].padding[1] + 'px ' + mediaStyles[0].padding[2] + 'px ' + mediaStyles[0].padding[3] + 'px' : '',
        marginTop: mediaStyles[0].margin && undefined !== mediaStyles[0].margin[0] ? mediaStyles[0].margin[0] + 'px' : undefined,
        marginRight: mediaStyles[0].margin && undefined !== mediaStyles[0].margin[1] ? mediaStyles[0].margin[1] + 'px' : undefined,
        marginBottom: mediaStyles[0].margin && undefined !== mediaStyles[0].margin[2] ? mediaStyles[0].margin[2] + 'px' : undefined,
        marginLeft: mediaStyles[0].margin && undefined !== mediaStyles[0].margin[3] ? mediaStyles[0].margin[3] + 'px' : undefined
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: 'kadence-testimonial-image-intrisic',
      style: {
        paddingBottom: 'card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio) ? mediaStyles[0].ratio + '%' : undefined
      }
    }, 'icon' === testimonials[index].media && testimonials[index].icon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.IconRender, {
      className: `kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`,
      name: testimonials[index].icon,
      size: testimonials[index].isize,
      title: testimonials[index].ititle ? testimonials[index].ititle : '',
      strokeWidth: 'fe' === testimonials[index].icon.substring(0, 2) ? testimonials[index].istroke : undefined,
      style: {
        display: 'flex',
        color: testimonials[index].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(testimonials[index].color) : undefined
      }
    }), 'icon' !== testimonials[index].media && testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.MediaUpload, {
      onSelect: media => {
        saveTestimonials({
          id: media.id,
          url: media.url,
          alt: media.alt,
          subtype: media.subtype,
          sizes: media.sizes
        }, index);
      },
      type: "image",
      value: testimonials[index].id ? testimonials[index].id : '',
      allowedTypes: ALLOWED_MEDIA_TYPES,
      render: _ref3 => {
        let {
          open
        } = _ref3;
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Tooltip, {
          text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Edit Image', 'kadence-blocks')
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
          style: {
            backgroundImage: 'url("' + urlOutput + '")',
            backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
            borderRadius: mediaStyles[0].borderRadius + 'px'
          },
          className: 'kt-testimonial-image',
          onClick: open
        }));
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Remove Image', 'kadence-blocks'),
      className: 'kt-remove-img kt-testimonial-remove-image',
      onClick: () => {
        saveTestimonials({
          id: null,
          url: null,
          alt: null,
          subtype: null,
          sizes: null
        }, index);
      },
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_12__["default"],
      showTooltip: true
    })), 'icon' !== testimonials[index].media && !testimonials[index].url && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, 'card' === style && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadenceMediaPlaceholder, {
      onSelect: media => {
        saveTestimonials({
          id: media.id,
          url: media.url,
          alt: media.alt,
          sizes: media.sizes,
          subtype: media.subtype
        }, index);
      },
      value: '',
      allowedTypes: ALLOWED_MEDIA_TYPES,
      onSelectURL: media => {
        if (media !== testimonials[index].url) {
          saveTestimonials({
            id: null,
            url: media,
            alt: null,
            sizes: null,
            subtype: null
          }, index);
        }
      },
      accept: "image/*",
      className: 'kadence-image-upload'
    }), 'card' !== style && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.MediaUpload, {
      onSelect: media => {
        saveTestimonials({
          id: media.id,
          url: media.url,
          alt: media.alt,
          sizes: media.sizes,
          subtype: media.subtype
        }, index);
      },
      type: "image",
      value: '',
      allowedTypes: ALLOWED_MEDIA_TYPES,
      render: _ref4 => {
        let {
          open
        } = _ref4;
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
          className: "kt-testimonial-image-placeholder",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Add Image', 'kadence-blocks'),
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_13__["default"],
          style: {
            borderRadius: mediaStyles[0].borderRadius + 'px'
          },
          onClick: open
        });
      }
    })))));
  };

  const containerStyles = {
    boxShadow: displayShadow ? shadow[0].hOffset + 'px ' + shadow[0].vOffset + 'px ' + shadow[0].blur + 'px ' + shadow[0].spread + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000', shadow[0].opacity ? shadow[0].opacity : 0.2) : undefined,
    borderColor: containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
    background: containerBackground ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(containerBackground, undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1) : undefined,
    borderRadius: !isNaN(containerBorderRadius) ? containerBorderRadius + 'px' : undefined,
    borderTopWidth: containerBorderWidth && undefined !== containerBorderWidth[0] ? containerBorderWidth[0] + 'px' : undefined,
    borderRightWidth: containerBorderWidth && undefined !== containerBorderWidth[1] ? containerBorderWidth[1] + 'px' : undefined,
    borderBottomWidth: containerBorderWidth && undefined !== containerBorderWidth[2] ? containerBorderWidth[2] + 'px' : undefined,
    borderLeftWidth: containerBorderWidth && undefined !== containerBorderWidth[3] ? containerBorderWidth[3] + 'px' : undefined,
    paddingTop: previewContainerPaddingTop ? previewContainerPaddingTop + (containerPaddingType ? containerPaddingType : 'px') : undefined,
    paddingRight: previewContainerPaddingRight ? previewContainerPaddingRight + (containerPaddingType ? containerPaddingType : 'px') : undefined,
    paddingBottom: previewContainerPaddingBottom ? previewContainerPaddingBottom + (containerPaddingType ? containerPaddingType : 'px') : undefined,
    paddingLeft: previewContainerPaddingLeft ? previewContainerPaddingLeft + (containerPaddingType ? containerPaddingType : 'px') : undefined,
    maxWidth: 'bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px',
    minHeight: 'bubble' === style || 'inlineimage' === style || !previewContainerMinHeight ? undefined : previewContainerMinHeight + 'px',
    marginTop: layout && layout === 'carousel' && previewWrapperPaddingTop ? previewWrapperPaddingTop + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
    marginBottom: layout && layout === 'carousel' && previewWrapperPaddingBottom ? previewWrapperPaddingBottom + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined
  };

  const renderTestimonialPreview = function (index) {
    let isCarousel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let iconPadding = displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] < 0 ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined;

    if (iconPadding === undefined && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && iconStyles[0].margin[0] >= 0) {
      iconPadding = '0px';
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: `kt-testimonial-item-wrap kt-testimonial-item-${index}${containerVAlign ? ' testimonial-valign-' + containerVAlign : ''}`,
      style: 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
        maxWidth: containerMaxWidth + 'px',
        minHeight: previewContainerMinHeight ? previewContainerMinHeight + 'px' : undefined,
        paddingTop: iconPadding ? iconPadding : undefined,
        marginTop: isCarousel && previewWrapperPaddingTop ? previewWrapperPaddingTop + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
        marginBottom: isCarousel && previewWrapperPaddingBottom ? previewWrapperPaddingBottom + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined
      }
    }, itemsCount > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kt-testimonial-item__move-menu"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
      icon: "arrow-left",
      onClick: () => {
        0 === index ? undefined : onMoveBackward(index);
      },
      className: "kt-testimonial-item__move-backward",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Move Testimonial Backward', 'kadence-blocks'),
      "aria-disabled": 0 === index
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
      icon: "arrow-right",
      onClick: () => {
        itemsCount === index + 1 ? undefined : onMoveForward(index);
      },
      className: "kt-testimonial-item__move-forward",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Move Testimonial Forward', 'kadence-blocks'),
      "aria-disabled": itemsCount === index + 1
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kt-testimonial-text-wrap",
      style: 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined
    }, displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index), displayMedia && ('card' === style || 'inlineimage' === style) && renderTestimonialMedia(index), displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kt-testimonial-title-wrap",
      style: {
        minHeight: previewTitleMinHeight ? previewTitleMinHeight + 'px' : undefined
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.RichText, {
      tagName: 'h' + titleFont[0].level,
      value: testimonials[index].title,
      onChange: value => {
        saveTestimonials({
          title: value
        }, index);
      },
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Best product I have ever used!', 'kadence-blocks'),
      style: {
        fontWeight: titleFont[0].weight,
        fontStyle: titleFont[0].style,
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(titleFont[0].color),
        fontSize: previewTitleFont ? previewTitleFont + titleFont[0].sizeType : undefined,
        lineHeight: previewTitleLineHeight ? previewTitleLineHeight + titleFont[0].lineType : undefined,
        letterSpacing: titleFont[0].letterSpacing + 'px',
        textTransform: titleFont[0].textTransform ? titleFont[0].textTransform : undefined,
        fontFamily: titleFont[0].family ? titleFont[0].family : '',
        padding: titleFont[0].padding ? titleFont[0].padding[0] + 'px ' + titleFont[0].padding[1] + 'px ' + titleFont[0].padding[2] + 'px ' + titleFont[0].padding[3] + 'px' : '',
        margin: titleFont[0].margin ? titleFont[0].margin[0] + 'px ' + titleFont[0].margin[1] + 'px ' + titleFont[0].margin[2] + 'px ' + titleFont[0].margin[3] + 'px' : ''
      },
      className: 'kt-testimonial-title'
    })), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: `kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`,
      style: {
        margin: ratingStyles[0].margin ? ratingStyles[0].margin[0] + 'px ' + ratingStyles[0].margin[1] + 'px ' + ratingStyles[0].margin[2] + 'px ' + ratingStyles[0].margin[3] + 'px' : ''
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.IconRender, {
      className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1',
      name: 'fas_star',
      size: ratingStyles[0].size,
      style: {
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(ratingStyles[0].color)
      }
    }), testimonials[index].rating > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.IconRender, {
      className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2',
      name: 'fas_star',
      size: ratingStyles[0].size,
      style: {
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(ratingStyles[0].color)
      }
    }), testimonials[index].rating > 2 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.IconRender, {
      className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3',
      name: 'fas_star',
      size: ratingStyles[0].size,
      style: {
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(ratingStyles[0].color)
      }
    }), testimonials[index].rating > 3 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.IconRender, {
      className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4',
      name: 'fas_star',
      size: ratingStyles[0].size,
      style: {
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(ratingStyles[0].color)
      }
    }), testimonials[index].rating > 4 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.IconRender, {
      className: 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5',
      name: 'fas_star',
      size: ratingStyles[0].size,
      style: {
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(ratingStyles[0].color)
      }
    })), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kt-testimonial-content-wrap",
      style: {
        minHeight: previewContentMinHeight ? previewContentMinHeight + 'px' : undefined
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.RichText, {
      tagName: 'div',
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('I have been looking for a product like this for years. I have tried everything and nothing did what I wanted until using this product. I am so glad I found it!', 'kadence-blocks'),
      value: testimonials[index].content,
      onChange: value => {
        saveTestimonials({
          content: value
        }, index);
      },
      style: {
        fontWeight: contentFont[0].weight,
        fontStyle: contentFont[0].style,
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(contentFont[0].color),
        fontSize: previewContentFont ? previewContentFont + contentFont[0].sizeType : undefined,
        lineHeight: previewContentLineHeight ? previewContentLineHeight + contentFont[0].lineType : undefined,
        textTransform: contentFont[0].textTransform ? contentFont[0].textTransform : undefined,
        letterSpacing: contentFont[0].letterSpacing + 'px',
        fontFamily: contentFont[0].family ? contentFont[0].family : ''
      },
      className: 'kt-testimonial-content'
    }))), (displayMedia && 'card' !== style && 'inlineimage' !== style || displayOccupation || displayName) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kt-testimonial-meta-wrap"
    }, displayMedia && 'card' !== style && 'inlineimage' !== style && renderTestimonialMedia(index), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kt-testimonial-meta-name-wrap"
    }, displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kt-testimonial-name-wrap"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.RichText, {
      tagName: 'div',
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Sophia Reily', 'kadence-blocks'),
      value: testimonials[index].name,
      onChange: value => {
        saveTestimonials({
          name: value
        }, index);
      },
      style: {
        fontWeight: nameFont[0].weight,
        fontStyle: nameFont[0].style,
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(nameFont[0].color),
        fontSize: previewNameFont ? previewNameFont + nameFont[0].sizeType : undefined,
        lineHeight: previewNameLineHeight ? previewNameLineHeight + nameFont[0].lineType : undefined,
        textTransform: nameFont[0].textTransform ? nameFont[0].textTransform : undefined,
        letterSpacing: nameFont[0].letterSpacing + 'px',
        fontFamily: nameFont[0].family ? nameFont[0].family : ''
      },
      className: 'kt-testimonial-name'
    })), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kt-testimonial-occupation-wrap"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.RichText, {
      tagName: 'div',
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('CEO of Company', 'kadence-blocks'),
      value: testimonials[index].occupation,
      onChange: value => {
        saveTestimonials({
          occupation: value
        }, index);
      },
      style: {
        fontWeight: occupationFont[0].weight,
        fontStyle: occupationFont[0].style,
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(occupationFont[0].color),
        fontSize: previewOccupationFont ? previewOccupationFont + occupationFont[0].sizeType : undefined,
        lineHeight: previewOccupationLineHeight ? previewOccupationLineHeight + occupationFont[0].lineType : undefined,
        textTransform: occupationFont[0].textTransform ? occupationFont[0].textTransform : undefined,
        letterSpacing: occupationFont[0].letterSpacing + 'px',
        fontFamily: occupationFont[0].family ? occupationFont[0].family : ''
      },
      className: 'kt-testimonial-occupation'
    })))));
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    id: `kt-blocks-testimonials-wrap${uniqueID}`
  }, blockProps, {
    className: `wp-block-kadence-testimonials kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${displayMedia ? 'on' : 'off'} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${columns[0]}`
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("style", null, layout === 'carousel' ? `#kt-blocks-testimonials-wrap${uniqueID} .slick-slide { padding: 0 ${columnGap / 2}px; }` : '', layout === 'carousel' ? `#kt-blocks-testimonials-wrap${uniqueID} .kt-blocks-carousel .slick-slider { margin: 0 -${columnGap / 2}px; }` : '', layout === 'carousel' ? `#kt-blocks-testimonials-wrap${uniqueID} .kt-blocks-carousel .slick-prev { left: ${columnGap / 2}px; }` : '', layout === 'carousel' ? `#kt-blocks-testimonials-wrap${uniqueID} .kt-blocks-carousel .slick-next { right: ${columnGap / 2}px; }` : '', style === 'bubble' || style === 'inlineimage' ? `#kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-text-wrap:after { margin-top: ${containerBorderWidth && undefined !== containerBorderWidth[2] ? containerBorderWidth[2] : '1'}px; }` : '', style === 'bubble' || style === 'inlineimage' ? `#kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-text-wrap:after { border-top-color: ${containerBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1)} }` : ''), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('allSettings') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.BlockControls, {
    key: "controls"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.AlignmentToolbar, {
    value: hAlign,
    onChange: value => setAttributes({
      hAlign: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
    panelName: 'kb-testimonials-settings'
  }, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('layoutSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Layout', 'kadence-blocks'),
    value: layout,
    options: [{
      value: 'grid',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Grid', 'kadence-blocks')
    }, {
      value: 'carousel',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Carousel', 'kadence-blocks')
    }],
    onChange: value => setAttributes({
      layout: value
    })
  }), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('styleSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
    className: "components-base-control__label"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Testimonial Style', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.ButtonGroup, {
    className: "kt-style-btn-group",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Testimonial Style', 'kadence-blocks')
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_5__.map)(styleOptions, _ref5 => {
    let {
      name,
      key,
      icon
    } = _ref5;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Tooltip, {
      text: name
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
      key: key,
      className: "kt-style-btn",
      isSmall: true,
      isPrimary: style === key,
      "aria-pressed": style === key,
      onClick: () => setAttributes({
        style: key
      })
    }, icon));
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Testimonial Items', 'kadence-blocks'),
    value: itemsCount,
    onChange: newcount => {
      let newitems = testimonials;

      if (newitems.length < newcount) {
        const amount = Math.abs(newcount - newitems.length);
        {
          (0,lodash__WEBPACK_IMPORTED_MODULE_5__.times)(amount, n => {
            newitems.push({
              url: newitems[0].url,
              id: newitems[0].id,
              alt: newitems[0].alt,
              width: newitems[0].width,
              height: newitems[0].height,
              maxWidth: newitems[0].maxWidth,
              subtype: newitems[0].subtype,
              media: newitems[0].media,
              icon: newitems[0].icon,
              isize: newitems[0].isize,
              istroke: newitems[0].istroke,
              ititle: newitems[0].ititle,
              color: newitems[0].color,
              title: '',
              content: '',
              name: '',
              occupation: '',
              rating: newitems[0].rating
            });
          });
        }
        setAttributes({
          testimonials: newitems
        });
        saveTestimonials({
          ititle: testimonials[0].ititle
        }, 0);
      }

      setAttributes({
        itemsCount: newcount
      });
    },
    min: 1,
    max: 40
  }), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('columnSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, columnControls, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Column Gap', 'kadence-blocks'),
    value: columnGap,
    onChange: value => setAttributes({
      columnGap: value
    }),
    min: 0,
    max: 80
  }))), layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('carouselSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Carousel Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonials-carousel'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Carousel Auto Play', 'kadence-blocks'),
    checked: autoPlay,
    onChange: value => setAttributes({
      autoPlay: value
    })
  }), autoPlay && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Autoplay Speed', 'kadence-blocks'),
    value: autoSpeed,
    onChange: value => setAttributes({
      autoSpeed: value
    }),
    min: 500,
    max: 15000,
    step: 10
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Carousel Slide Transition Speed', 'kadence-blocks'),
    value: transSpeed,
    onChange: value => setAttributes({
      transSpeed: value
    }),
    min: 100,
    max: 2000,
    step: 10
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Slides to Scroll', 'kadence-blocks'),
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('One'),
      value: '1'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('All'),
      value: 'all'
    }],
    value: slidesScroll,
    onChange: value => setAttributes({
      slidesScroll: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Arrow Style', 'kadence-blocks'),
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('White on Dark', 'kadence-blocks'),
      value: 'whiteondark'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Black on Light', 'kadence-blocks'),
      value: 'blackonlight'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Outline Black', 'kadence-blocks'),
      value: 'outlineblack'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Outline White', 'kadence-blocks'),
      value: 'outlinewhite'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('None', 'kadence-blocks'),
      value: 'none'
    }],
    value: arrowStyle,
    onChange: value => setAttributes({
      arrowStyle: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Dot Style', 'kadence-blocks'),
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Dark', 'kadence-blocks'),
      value: 'dark'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Light', 'kadence-blocks'),
      value: 'light'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Outline Dark', 'kadence-blocks'),
      value: 'outlinedark'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Outline Light', 'kadence-blocks'),
      value: 'outlinelight'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('None', 'kadence-blocks'),
      value: 'none'
    }],
    value: dotStyle,
    onChange: value => setAttributes({
      dotStyle: value
    })
  }))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('containerSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Container Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonials-container-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-spacer-sidebar-15"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Container Border Width (px)', 'kadence-blocks'),
    measurement: containerBorderWidth,
    control: containerBorderControl,
    onChange: value => setAttributes({
      containerBorderWidth: value
    }),
    onControl: value => setContainerBorderControl(value),
    min: 0,
    max: 40,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Container Border Radius (px)', 'kadence-blocks'),
    value: containerBorderRadius,
    onChange: value => setAttributes({
      containerBorderRadius: value
    }),
    step: 1,
    min: 0,
    max: 200
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Container Background', 'kadence-blocks'),
    value: containerBackground ? containerBackground : '',
    default: '',
    onChange: value => setAttributes({
      containerBackground: value
    }),
    opacityValue: containerBackgroundOpacity,
    onOpacityChange: value => setAttributes({
      containerBackgroundOpacity: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Container Border', 'kadence-blocks'),
    value: containerBorder ? containerBorder : '',
    default: '',
    onChange: value => setAttributes({
      containerBorder: value
    }),
    opacityValue: containerBorderOpacity,
    onOpacityChange: value => setAttributes({
      containerBorderOpacity: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-spacer-sidebar-15"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Container Padding', 'kadence-blocks'),
    control: containerPaddingControl,
    tabletControl: tabletContainerPaddingControl,
    mobileControl: mobileContainerPaddingControl,
    value: containerPadding,
    tabletValue: tabletContainerPadding,
    mobileValue: mobileContainerPadding,
    onChange: value => setAttributes({
      containerPadding: value
    }),
    onChangeTablet: value => setAttributes({
      tabletContainerPadding: value
    }),
    onChangeMobile: value => setAttributes({
      mobileContainerPadding: value
    }),
    onChangeControl: value => setContainerPaddingControl(value),
    onChangeTabletControl: value => setTabletContainerPaddingControl(value),
    onChangeMobileControl: value => setMobileContainerPaddingControl(value),
    allowEmpty: true,
    min: 0,
    max: containerPaddingType === 'em' || containerPaddingType === 'rem' ? 12 : 200,
    step: containerPaddingType === 'em' || containerPaddingType === 'rem' ? 0.1 : 1,
    unit: containerPaddingType ? containerPaddingType : 'px',
    units: ['px', 'em', 'rem'],
    onUnit: value => setAttributes({
      containerPaddingType: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Container Max Width (px)', 'kadence-blocks'),
    value: containerMaxWidth,
    onChange: value => setAttributes({
      containerMaxWidth: value
    }),
    step: 5,
    min: 50,
    max: 2000
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Container Min Height', 'kadence-blocks'),
    value: containerMinHeight && undefined !== containerMinHeight[0] ? containerMinHeight[0] : '',
    onChange: value => setAttributes({
      containerMinHeight: [value, containerMinHeight && undefined !== containerMinHeight[1] ? containerMinHeight[1] : '', containerMinHeight && undefined !== containerMinHeight[2] ? containerMinHeight[2] : '']
    }),
    tabletValue: containerMinHeight && undefined !== containerMinHeight[1] ? containerMinHeight[1] : '',
    onChangeTablet: value => setAttributes({
      containerMinHeight: [containerMinHeight && undefined !== containerMinHeight[0] ? containerMinHeight[0] : '', value, containerMinHeight && undefined !== containerMinHeight[2] ? containerMinHeight[2] : '']
    }),
    mobileValue: containerMinHeight && undefined !== containerMinHeight[2] ? containerMinHeight[2] : '',
    onChangeMobile: value => setAttributes({
      containerMinHeight: [containerMinHeight && undefined !== containerMinHeight[0] ? containerMinHeight[0] : '', containerMinHeight && undefined !== containerMinHeight[1] ? containerMinHeight[1] : '', value]
    }),
    min: 0,
    max: 600,
    step: 1,
    unit: 'px',
    showUnit: true,
    units: ['px']
  }), containerMinHeight && (containerMinHeight[0] || containerMinHeight[1] || containerMinHeight[2]) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-btn-size-settings-container"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
    className: "kt-beside-btn-group"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Inner Content Align', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.ButtonGroup, {
    className: "kt-button-size-type-options",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Inner Content Align', 'kadence-blocks')
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_5__.map)(VAlignOptions, _ref6 => {
    let {
      name,
      icon,
      key
    } = _ref6;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Tooltip, {
      text: name
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
      key: key,
      className: "kt-btn-size-btn",
      isSmall: true,
      isPrimary: containerVAlign === key,
      "aria-pressed": containerVAlign === key,
      onClick: () => setAttributes({
        containerVAlign: key
      })
    }, icon));
  })))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('iconSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonials-icon-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Show Top Icon', 'kadence-blocks'),
    checked: displayIcon,
    onChange: value => setAttributes({
      displayIcon: value
    })
  }), displayIcon && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.IconControl, {
    value: iconStyles[0].icon,
    onChange: value => {
      saveIconStyles({
        icon: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Size', 'kadence-blocks'),
    value: iconStyles[0].size,
    onChange: value => saveIconStyles({
      size: value
    }),
    step: 1,
    min: 1,
    max: 120
  }), iconStyles[0].icon && 'fe' === iconStyles[0].icon.substring(0, 2) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Line Width', 'kadence-blocks'),
    value: iconStyles[0].stroke,
    onChange: value => {
      saveIconStyles({
        stroke: value
      });
    },
    step: 0.5,
    min: 0.5,
    max: 4
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Color', 'kadence-blocks'),
    value: iconStyles[0].color ? iconStyles[0].color : '',
    default: '',
    onChange: value => saveIconStyles({
      color: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-spacer-sidebar-15"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Border Width (px)', 'kadence-blocks'),
    measurement: iconStyles[0].borderWidth,
    control: iconBorderControl,
    onChange: value => saveIconStyles({
      borderWidth: value
    }),
    onControl: value => setIconBorderControl(value),
    min: 0,
    max: 40,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Border Radius (px)', 'kadence-blocks'),
    value: iconStyles[0].borderRadius,
    onChange: value => saveIconStyles({
      borderRadius: value
    }),
    step: 1,
    min: 0,
    max: 200
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Background', 'kadence-blocks'),
    value: iconStyles[0].background ? iconStyles[0].background : '',
    default: '',
    onChange: value => saveIconStyles({
      background: value
    }),
    opacityValue: iconStyles[0].backgroundOpacity,
    onOpacityChange: value => saveIconStyles({
      backgroundOpacity: value
    }),
    onArrayChange: (color, opacity) => saveIconStyles({
      background: color,
      backgroundOpacity: opacity
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Border Color', 'kadence-blocks'),
    value: iconStyles[0].border ? iconStyles[0].border : '',
    default: '',
    onChange: value => saveIconStyles({
      border: value
    }),
    opacityValue: iconStyles[0].borderOpacity,
    onOpacityChange: value => saveIconStyles({
      borderOpacity: value
    }),
    onArrayChange: (color, opacity) => saveIconStyles({
      border: color,
      borderOpacity: opacity
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-spacer-sidebar-15"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Padding', 'kadence-blocks'),
    measurement: iconStyles[0].padding,
    control: iconPaddingControl,
    onChange: value => saveIconStyles({
      padding: value
    }),
    onControl: value => setIconPaddingControl(value),
    min: 0,
    max: 100,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Margin', 'kadence-blocks'),
    measurement: iconStyles[0].margin,
    control: iconMarginControl,
    onChange: value => saveIconStyles({
      margin: value
    }),
    onControl: value => setIconMarginControl(value),
    min: -100,
    max: 100,
    step: 1
  }))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('titleSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Title Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonials-title-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Show Title', 'kadence-blocks'),
    checked: displayTitle,
    onChange: value => setAttributes({
      displayTitle: value
    })
  }), displayTitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Color Settings', 'kadence-blocks'),
    value: titleFont[0].color ? titleFont[0].color : '',
    default: '',
    onChange: value => saveTitleFont({
      color: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.TypographyControls, {
    fontGroup: 'heading',
    tagLevel: titleFont[0].level,
    tagLowLevel: 2,
    onTagLevel: value => saveTitleFont({
      level: value
    }),
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
    textTransform: titleFont[0].textTransform,
    onTextTransform: value => saveTitleFont({
      textTransform: value
    }),
    fontFamily: titleFont[0].family,
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
    }),
    padding: titleFont[0].padding,
    onPadding: value => saveTitleFont({
      padding: value
    }),
    paddingControl: titlePaddingControl,
    onPaddingControl: value => setTitlePaddingControl(value),
    margin: titleFont[0].margin,
    onMargin: value => saveTitleFont({
      margin: value
    }),
    marginControl: titleMarginControl,
    onMarginControl: value => setTitleMarginControl(value)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Title Min Height', 'kadence-blocks'),
    value: titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : '',
    onChange: value => setAttributes({
      titleMinHeight: [value, titleMinHeight && undefined !== titleMinHeight[1] ? titleMinHeight[1] : '', titleMinHeight && undefined !== titleMinHeight[2] ? titleMinHeight[2] : '']
    }),
    tabletValue: titleMinHeight && undefined !== titleMinHeight[1] ? titleMinHeight[1] : '',
    onChangeTablet: value => setAttributes({
      titleMinHeight: [titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : '', value, titleMinHeight && undefined !== titleMinHeight[2] ? titleMinHeight[2] : '']
    }),
    mobileValue: titleMinHeight && undefined !== titleMinHeight[2] ? titleMinHeight[2] : '',
    onChangeMobile: value => setAttributes({
      titleMinHeight: [titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : '', titleMinHeight && undefined !== titleMinHeight[1] ? titleMinHeight[1] : '', value]
    }),
    min: 0,
    max: 200,
    step: 1,
    unit: 'px',
    showUnit: true,
    units: ['px']
  }))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('ratingSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Rating Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonials-rating-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Show Rating', 'kadence-blocks'),
    checked: displayRating,
    onChange: value => setAttributes({
      displayRating: value
    })
  }), displayRating && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Color', 'kadence-blocks'),
    value: ratingStyles[0].color ? ratingStyles[0].color : '',
    default: '',
    onChange: value => saveRatingStyles({
      color: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Icon Size', 'kadence-blocks'),
    value: ratingStyles[0].size,
    onChange: value => saveRatingStyles({
      size: value
    }),
    step: 1,
    min: 1,
    max: 120
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Rating Margin', 'kadence-blocks'),
    measurement: ratingStyles[0].margin,
    control: ratingMarginControl,
    onChange: value => saveRatingStyles({
      margin: value
    }),
    onControl: value => setRatingMarginControl(value),
    min: 0,
    max: 100,
    step: 1
  }))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('contentSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Content Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonials-content-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Show Content', 'kadence-blocks'),
    checked: displayContent,
    onChange: value => setAttributes({
      displayContent: value
    })
  }), displayContent && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Color', 'kadence-blocks'),
    value: contentFont[0].color ? contentFont[0].color : '',
    default: '',
    onChange: value => saveContentFont({
      color: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.TypographyControls, {
    fontSize: contentFont[0].size,
    onFontSize: value => saveContentFont({
      size: value
    }),
    fontSizeType: contentFont[0].sizeType,
    onFontSizeType: value => saveContentFont({
      sizeType: value
    }),
    lineHeight: contentFont[0].lineHeight,
    onLineHeight: value => saveContentFont({
      lineHeight: value
    }),
    lineHeightType: contentFont[0].lineType,
    onLineHeightType: value => saveContentFont({
      lineType: value
    }),
    letterSpacing: contentFont[0].letterSpacing,
    onLetterSpacing: value => saveContentFont({
      letterSpacing: value
    }),
    textTransform: contentFont[0].textTransform,
    onTextTransform: value => saveContentFont({
      textTransform: value
    }),
    fontFamily: contentFont[0].family,
    onFontFamily: value => saveContentFont({
      family: value
    }),
    onFontChange: select => {
      saveContentFont({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => saveContentFont(values),
    googleFont: contentFont[0].google,
    onGoogleFont: value => saveContentFont({
      google: value
    }),
    loadGoogleFont: contentFont[0].loadGoogle,
    onLoadGoogleFont: value => saveContentFont({
      loadGoogle: value
    }),
    fontVariant: contentFont[0].variant,
    onFontVariant: value => saveContentFont({
      variant: value
    }),
    fontWeight: contentFont[0].weight,
    onFontWeight: value => saveContentFont({
      weight: value
    }),
    fontStyle: contentFont[0].style,
    onFontStyle: value => saveContentFont({
      style: value
    }),
    fontSubset: contentFont[0].subset,
    onFontSubset: value => saveContentFont({
      subset: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Content Min Height', 'kadence-blocks'),
    value: contentMinHeight && undefined !== contentMinHeight[0] ? contentMinHeight[0] : '',
    onChange: value => setAttributes({
      contentMinHeight: [value, contentMinHeight && undefined !== contentMinHeight[1] ? contentMinHeight[1] : '', contentMinHeight && undefined !== contentMinHeight[2] ? contentMinHeight[2] : '']
    }),
    tabletValue: contentMinHeight && undefined !== contentMinHeight[1] ? contentMinHeight[1] : '',
    onChangeTablet: value => setAttributes({
      contentMinHeight: [contentMinHeight && undefined !== contentMinHeight[0] ? contentMinHeight[0] : '', value, contentMinHeight && undefined !== contentMinHeight[2] ? contentMinHeight[2] : '']
    }),
    mobileValue: contentMinHeight && undefined !== contentMinHeight[2] ? contentMinHeight[2] : '',
    onChangeMobile: value => setAttributes({
      contentMinHeight: [contentMinHeight && undefined !== contentMinHeight[0] ? contentMinHeight[0] : '', contentMinHeight && undefined !== contentMinHeight[1] ? contentMinHeight[1] : '', value]
    }),
    min: 0,
    max: 400,
    step: 1,
    unit: 'px',
    showUnit: true,
    units: ['px']
  }))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('mediaSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Media Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonials-media-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Show Media', 'kadence-blocks'),
    checked: displayMedia,
    onChange: value => setAttributes({
      displayMedia: value
    })
  }), displayMedia && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, 'card' !== style && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Media Max Size', 'kadence-blocks'),
    value: mediaStyles[0].width,
    onChange: value => savemediaStyles({
      width: value
    }),
    step: 1,
    min: 2,
    max: 800
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Media Border Width (px)', 'kadence-blocks'),
    measurement: mediaStyles[0].borderWidth,
    control: mediaBorderControl,
    onChange: value => savemediaStyles({
      borderWidth: value
    }),
    onControl: value => setMediaBorderControl(value),
    min: 0,
    max: 40,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Media Border Radius (px)', 'kadence-blocks'),
    value: mediaStyles[0].borderRadius,
    onChange: value => savemediaStyles({
      borderRadius: value
    }),
    step: 1,
    min: 0,
    max: 200
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Media Background', 'kadence-blocks'),
    value: mediaStyles[0].background ? mediaStyles[0].background : '',
    default: '',
    onChange: value => savemediaStyles({
      background: value
    }),
    opacityValue: mediaStyles[0].backgroundOpacity,
    onOpacityChange: value => savemediaStyles({
      backgroundOpacity: value
    }),
    onArrayChange: (color, opacity) => savemediaStyles({
      background: color,
      backgroundOpacity: opacity
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Media Border Color', 'kadence-blocks'),
    value: mediaStyles[0].border ? mediaStyles[0].border : '',
    default: '',
    onChange: value => savemediaStyles({
      border: value
    }),
    opacityValue: mediaStyles[0].borderOpacity,
    onOpacityChange: value => savemediaStyles({
      borderOpacity: value
    }),
    onArrayChange: (color, opacity) => savemediaStyles({
      border: color,
      borderOpacity: opacity
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-spacer-sidebar-15"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Media Padding', 'kadence-blocks'),
    measurement: mediaStyles[0].padding,
    control: mediaPaddingControl,
    onChange: value => savemediaStyles({
      padding: value
    }),
    onControl: value => setMediaPaddingControl(value),
    min: 0,
    max: 100,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Media Margin', 'kadence-blocks'),
    measurement: mediaStyles[0].margin,
    control: mediaMarginControl,
    onChange: value => savemediaStyles({
      margin: value
    }),
    onControl: value => setMediaMarginControl(value),
    min: -100,
    max: 100,
    step: 1
  }), 'card' === style && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Image Size', 'kadence-blocks'),
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Cover', 'kadence-blocks'),
      value: 'cover'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Contain', 'kadence-blocks'),
      value: 'Contain'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Auto', 'kadence-blocks'),
      value: 'auto'
    }],
    value: mediaStyles[0].backgroundSize,
    onChange: value => savemediaStyles({
      backgroundSize: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Image Ratio', 'kadence-blocks'),
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Landscape 4:2', 'kadence-blocks'),
      value: '50'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Landscape 3:2', 'kadence-blocks'),
      value: '66.67'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Landscape 4:3', 'kadence-blocks'),
      value: '75'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Portrait 3:4', 'kadence-blocks'),
      value: '133.33'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Portrait 2:3', 'kadence-blocks'),
      value: '150'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Square 1:1', 'kadence-blocks'),
      value: '100'
    }],
    value: undefined === mediaStyles[0].ratio || '' === mediaStyles[0].ratio ? '50' : mediaStyles[0].ratio,
    onChange: value => savemediaStyles({
      ratio: value
    })
  })))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('nameSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Name Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonials-name-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Show Name', 'kadence-blocks'),
    checked: displayName,
    onChange: value => setAttributes({
      displayName: value
    })
  }), displayName && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Color', 'kadence-blocks'),
    value: nameFont[0].color ? nameFont[0].color : '',
    default: '',
    onChange: value => saveNameFont({
      color: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.TypographyControls, {
    fontSize: nameFont[0].size,
    onFontSize: value => saveNameFont({
      size: value
    }),
    fontSizeType: nameFont[0].sizeType,
    onFontSizeType: value => saveNameFont({
      sizeType: value
    }),
    lineHeight: nameFont[0].lineHeight,
    onLineHeight: value => saveNameFont({
      lineHeight: value
    }),
    lineHeightType: nameFont[0].lineType,
    onLineHeightType: value => saveNameFont({
      lineType: value
    }),
    letterSpacing: nameFont[0].letterSpacing,
    onLetterSpacing: value => saveNameFont({
      letterSpacing: value
    }),
    textTransform: nameFont[0].textTransform,
    onTextTransform: value => saveNameFont({
      textTransform: value
    }),
    fontFamily: nameFont[0].family,
    onFontFamily: value => saveNameFont({
      family: value
    }),
    onFontChange: select => {
      saveNameFont({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => saveNameFont(values),
    googleFont: nameFont[0].google,
    onGoogleFont: value => saveNameFont({
      google: value
    }),
    loadGoogleFont: nameFont[0].loadGoogle,
    onLoadGoogleFont: value => saveNameFont({
      loadGoogle: value
    }),
    fontVariant: nameFont[0].variant,
    onFontVariant: value => saveNameFont({
      variant: value
    }),
    fontWeight: nameFont[0].weight,
    onFontWeight: value => saveNameFont({
      weight: value
    }),
    fontStyle: nameFont[0].style,
    onFontStyle: value => saveNameFont({
      style: value
    }),
    fontSubset: nameFont[0].subset,
    onFontSubset: value => saveNameFont({
      subset: value
    })
  }))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('occupationSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Occupation Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonails-occupation-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Show Occupation', 'kadence-blocks'),
    checked: displayOccupation,
    onChange: value => setAttributes({
      displayOccupation: value
    })
  }), displayOccupation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Color', 'kadence-blocks'),
    value: occupationFont[0].color ? occupationFont[0].color : '',
    default: '',
    onChange: value => saveOccupationFont({
      color: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.TypographyControls, {
    fontSize: occupationFont[0].size,
    onFontSize: value => saveOccupationFont({
      size: value
    }),
    fontSizeType: occupationFont[0].sizeType,
    onFontSizeType: value => saveOccupationFont({
      sizeType: value
    }),
    lineHeight: occupationFont[0].lineHeight,
    onLineHeight: value => saveOccupationFont({
      lineHeight: value
    }),
    lineHeightType: occupationFont[0].lineType,
    onLineHeightType: value => saveOccupationFont({
      lineType: value
    }),
    textTransform: occupationFont[0].textTransform,
    onTextTransform: value => saveOccupationFont({
      textTransform: value
    }),
    letterSpacing: occupationFont[0].letterSpacing,
    onLetterSpacing: value => saveOccupationFont({
      letterSpacing: value
    }),
    fontFamily: occupationFont[0].family,
    onFontFamily: value => saveOccupationFont({
      family: value
    }),
    onFontChange: select => {
      saveOccupationFont({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => saveOccupationFont(values),
    googleFont: occupationFont[0].google,
    onGoogleFont: value => saveOccupationFont({
      google: value
    }),
    loadGoogleFont: occupationFont[0].loadGoogle,
    onLoadGoogleFont: value => saveOccupationFont({
      loadGoogle: value
    }),
    fontVariant: occupationFont[0].variant,
    onFontVariant: value => saveOccupationFont({
      variant: value
    }),
    fontWeight: occupationFont[0].weight,
    onFontWeight: value => saveOccupationFont({
      weight: value
    }),
    fontStyle: occupationFont[0].style,
    onFontStyle: value => saveOccupationFont({
      style: value
    }),
    fontSubset: occupationFont[0].subset,
    onFontSubset: value => saveOccupationFont({
      subset: value
    })
  }))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('shadowSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Container Shadow', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonials-container-shadow'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Enable Shadow', 'kadence-blocks'),
    checked: displayShadow,
    onChange: value => setAttributes({
      displayShadow: value
    })
  }), displayShadow && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Shadow Color', 'kadence-blocks'),
    value: shadow[0].color ? shadow[0].color : '',
    default: '',
    onChange: value => saveShadow({
      color: value
    }),
    opacityValue: shadow[0].opacity,
    onOpacityChange: value => saveShadow({
      opacity: value
    }),
    onArrayChange: (color, opacity) => saveShadow({
      color: color,
      opacity: opacity
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Shadow Blur', 'kadence-blocks'),
    value: shadow[0].blur,
    onChange: value => saveShadow({
      blur: value
    }),
    min: 0,
    max: 100,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Shadow Spread', 'kadence-blocks'),
    value: shadow[0].spread,
    onChange: value => saveShadow({
      spread: value
    }),
    min: -100,
    max: 100,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Shadow Vertical Offset', 'kadence-blocks'),
    value: shadow[0].vOffset,
    onChange: value => saveShadow({
      vOffset: value
    }),
    min: -100,
    max: 100,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Shadow Horizontal Offset', 'kadence-blocks'),
    value: shadow[0].hOffset,
    onChange: value => saveShadow({
      hOffset: value
    }),
    min: -100,
    max: 100,
    step: 1
  }))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('wrapperSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Wrapper Padding', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonials-wrapper-padding'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Wrapper Padding', 'kadence-blocks'),
    value: wrapperPadding,
    control: wrapperPaddingControls,
    tabletValue: wrapperTabletPadding,
    mobileValue: wrapperMobilePadding,
    onChange: value => setAttributes({
      wrapperPadding: value
    }),
    onChangeTablet: value => setAttributes({
      wrapperTabletPadding: value
    }),
    onChangeMobile: value => setAttributes({
      wrapperMobilePadding: value
    }),
    onChangeControl: value => setWrapperPaddingControls(value),
    min: paddingMin,
    max: paddingMax,
    step: paddingStep,
    unit: wrapperPaddingType,
    units: ['px', 'em', 'rem', '%'],
    onUnit: value => setAttributes({
      wrapperPaddingType: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-sidebar-settings-spacer"
  }), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.showSettings)('individualSettings', 'kadence/testimonials') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Individual Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonials-individual-settings'
  }, renderSettings))), showPreset && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-select-starter-style-tabs kt-select-starter-style-infobox"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-select-starter-style-tabs-title"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Select Initial Style', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.ButtonGroup, {
    className: "kt-init-tabs-btn-group",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Initial Style', 'kadence-blocks')
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_5__.map)(startlayoutOptions, _ref7 => {
    let {
      name,
      key,
      icon
    } = _ref7;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_11__.Button, {
      key: key,
      className: "kt-inital-tabs-style-btn",
      isSmall: true,
      onClick: () => {
        setInitalLayout(key);
        setShowPreset(false);
      }
    }, icon);
  }))), !showPreset && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, blockProps, layout && layout === 'carousel' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: `kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`,
    style: {
      paddingRight: previewWrapperPaddingRight ? previewWrapperPaddingRight + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
      paddingLeft: previewWrapperPaddingLeft ? previewWrapperPaddingLeft + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined
    }
  }, itemsCount !== 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(react_slick__WEBPACK_IMPORTED_MODULE_4__["default"], (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    className: `kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`
  }, sliderSettings), (0,lodash__WEBPACK_IMPORTED_MODULE_5__.times)(itemsCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-blocks-testimonial-carousel-item",
    key: n
  }, renderTestimonialPreview(n, true)))), itemsCount === 1 && (0,lodash__WEBPACK_IMPORTED_MODULE_5__.times)(itemsCount, n => renderTestimonialPreview(n, true))), layout && layout === 'grid' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: 'kt-testimonial-grid-wrap',
    style: {
      'grid-row-gap': columnGap + 'px',
      'grid-column-gap': columnGap + 'px',
      paddingTop: previewWrapperPaddingTop ? previewWrapperPaddingTop + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
      paddingRight: previewWrapperPaddingRight ? previewWrapperPaddingRight + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
      paddingBottom: previewWrapperPaddingBottom ? previewWrapperPaddingBottom + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined,
      paddingLeft: previewWrapperPaddingLeft ? previewWrapperPaddingLeft + (wrapperPaddingType ? wrapperPaddingType : 'px') : undefined
    }
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_5__.times)(itemsCount, n => renderTestimonialPreview(n))), displayTitle && titleFont[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.WebfontLoader, {
    config: config
  }), displayContent && contentFont[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.WebfontLoader, {
    config: tconfig
  }), displayName && nameFont[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.WebfontLoader, {
    config: lconfig
  }), displayOccupation && occupationFont[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.WebfontLoader, {
    config: oconfig
  })));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KadenceTestimonials);

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

/***/ "./node_modules/enquire.js/src/MediaQuery.js":
/*!***************************************************!*\
  !*** ./node_modules/enquire.js/src/MediaQuery.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var QueryHandler = __webpack_require__(/*! ./QueryHandler */ "./node_modules/enquire.js/src/QueryHandler.js");
var each = (__webpack_require__(/*! ./Util */ "./node_modules/enquire.js/src/Util.js").each);

/**
 * Represents a single media query, manages it's state and registered handlers for this query
 *
 * @constructor
 * @param {string} query the media query string
 * @param {boolean} [isUnconditional=false] whether the media query should run regardless of whether the conditions are met. Primarily for helping older browsers deal with mobile-first design
 */
function MediaQuery(query, isUnconditional) {
    this.query = query;
    this.isUnconditional = isUnconditional;
    this.handlers = [];
    this.mql = window.matchMedia(query);

    var self = this;
    this.listener = function(mql) {
        // Chrome passes an MediaQueryListEvent object, while other browsers pass MediaQueryList directly
        self.mql = mql.currentTarget || mql;
        self.assess();
    };
    this.mql.addListener(this.listener);
}

MediaQuery.prototype = {

    constuctor : MediaQuery,

    /**
     * add a handler for this query, triggering if already active
     *
     * @param {object} handler
     * @param {function} handler.match callback for when query is activated
     * @param {function} [handler.unmatch] callback for when query is deactivated
     * @param {function} [handler.setup] callback for immediate execution when a query handler is registered
     * @param {boolean} [handler.deferSetup=false] should the setup callback be deferred until the first time the handler is matched?
     */
    addHandler : function(handler) {
        var qh = new QueryHandler(handler);
        this.handlers.push(qh);

        this.matches() && qh.on();
    },

    /**
     * removes the given handler from the collection, and calls it's destroy methods
     *
     * @param {object || function} handler the handler to remove
     */
    removeHandler : function(handler) {
        var handlers = this.handlers;
        each(handlers, function(h, i) {
            if(h.equals(handler)) {
                h.destroy();
                return !handlers.splice(i,1); //remove from array and exit each early
            }
        });
    },

    /**
     * Determine whether the media query should be considered a match
     *
     * @return {Boolean} true if media query can be considered a match, false otherwise
     */
    matches : function() {
        return this.mql.matches || this.isUnconditional;
    },

    /**
     * Clears all handlers and unbinds events
     */
    clear : function() {
        each(this.handlers, function(handler) {
            handler.destroy();
        });
        this.mql.removeListener(this.listener);
        this.handlers.length = 0; //clear array
    },

    /*
        * Assesses the query, turning on all handlers if it matches, turning them off if it doesn't match
        */
    assess : function() {
        var action = this.matches() ? 'on' : 'off';

        each(this.handlers, function(handler) {
            handler[action]();
        });
    }
};

module.exports = MediaQuery;


/***/ }),

/***/ "./node_modules/enquire.js/src/MediaQueryDispatch.js":
/*!***********************************************************!*\
  !*** ./node_modules/enquire.js/src/MediaQueryDispatch.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MediaQuery = __webpack_require__(/*! ./MediaQuery */ "./node_modules/enquire.js/src/MediaQuery.js");
var Util = __webpack_require__(/*! ./Util */ "./node_modules/enquire.js/src/Util.js");
var each = Util.each;
var isFunction = Util.isFunction;
var isArray = Util.isArray;

/**
 * Allows for registration of query handlers.
 * Manages the query handler's state and is responsible for wiring up browser events
 *
 * @constructor
 */
function MediaQueryDispatch () {
    if(!window.matchMedia) {
        throw new Error('matchMedia not present, legacy browsers require a polyfill');
    }

    this.queries = {};
    this.browserIsIncapable = !window.matchMedia('only all').matches;
}

MediaQueryDispatch.prototype = {

    constructor : MediaQueryDispatch,

    /**
     * Registers a handler for the given media query
     *
     * @param {string} q the media query
     * @param {object || Array || Function} options either a single query handler object, a function, or an array of query handlers
     * @param {function} options.match fired when query matched
     * @param {function} [options.unmatch] fired when a query is no longer matched
     * @param {function} [options.setup] fired when handler first triggered
     * @param {boolean} [options.deferSetup=false] whether setup should be run immediately or deferred until query is first matched
     * @param {boolean} [shouldDegrade=false] whether this particular media query should always run on incapable browsers
     */
    register : function(q, options, shouldDegrade) {
        var queries         = this.queries,
            isUnconditional = shouldDegrade && this.browserIsIncapable;

        if(!queries[q]) {
            queries[q] = new MediaQuery(q, isUnconditional);
        }

        //normalise to object in an array
        if(isFunction(options)) {
            options = { match : options };
        }
        if(!isArray(options)) {
            options = [options];
        }
        each(options, function(handler) {
            if (isFunction(handler)) {
                handler = { match : handler };
            }
            queries[q].addHandler(handler);
        });

        return this;
    },

    /**
     * unregisters a query and all it's handlers, or a specific handler for a query
     *
     * @param {string} q the media query to target
     * @param {object || function} [handler] specific handler to unregister
     */
    unregister : function(q, handler) {
        var query = this.queries[q];

        if(query) {
            if(handler) {
                query.removeHandler(handler);
            }
            else {
                query.clear();
                delete this.queries[q];
            }
        }

        return this;
    }
};

module.exports = MediaQueryDispatch;


/***/ }),

/***/ "./node_modules/enquire.js/src/QueryHandler.js":
/*!*****************************************************!*\
  !*** ./node_modules/enquire.js/src/QueryHandler.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Delegate to handle a media query being matched and unmatched.
 *
 * @param {object} options
 * @param {function} options.match callback for when the media query is matched
 * @param {function} [options.unmatch] callback for when the media query is unmatched
 * @param {function} [options.setup] one-time callback triggered the first time a query is matched
 * @param {boolean} [options.deferSetup=false] should the setup callback be run immediately, rather than first time query is matched?
 * @constructor
 */
function QueryHandler(options) {
    this.options = options;
    !options.deferSetup && this.setup();
}

QueryHandler.prototype = {

    constructor : QueryHandler,

    /**
     * coordinates setup of the handler
     *
     * @function
     */
    setup : function() {
        if(this.options.setup) {
            this.options.setup();
        }
        this.initialised = true;
    },

    /**
     * coordinates setup and triggering of the handler
     *
     * @function
     */
    on : function() {
        !this.initialised && this.setup();
        this.options.match && this.options.match();
    },

    /**
     * coordinates the unmatch event for the handler
     *
     * @function
     */
    off : function() {
        this.options.unmatch && this.options.unmatch();
    },

    /**
     * called when a handler is to be destroyed.
     * delegates to the destroy or unmatch callbacks, depending on availability.
     *
     * @function
     */
    destroy : function() {
        this.options.destroy ? this.options.destroy() : this.off();
    },

    /**
     * determines equality by reference.
     * if object is supplied compare options, if function, compare match callback
     *
     * @function
     * @param {object || function} [target] the target for comparison
     */
    equals : function(target) {
        return this.options === target || this.options.match === target;
    }

};

module.exports = QueryHandler;


/***/ }),

/***/ "./node_modules/enquire.js/src/Util.js":
/*!*********************************************!*\
  !*** ./node_modules/enquire.js/src/Util.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Helper function for iterating over a collection
 *
 * @param collection
 * @param fn
 */
function each(collection, fn) {
    var i      = 0,
        length = collection.length,
        cont;

    for(i; i < length; i++) {
        cont = fn(collection[i], i);
        if(cont === false) {
            break; //allow early exit
        }
    }
}

/**
 * Helper function for determining whether target object is an array
 *
 * @param target the object under test
 * @return {Boolean} true if array, false otherwise
 */
function isArray(target) {
    return Object.prototype.toString.apply(target) === '[object Array]';
}

/**
 * Helper function for determining whether target object is a function
 *
 * @param target the object under test
 * @return {Boolean} true if function, false otherwise
 */
function isFunction(target) {
    return typeof target === 'function';
}

module.exports = {
    isFunction : isFunction,
    isArray : isArray,
    each : each
};


/***/ }),

/***/ "./node_modules/enquire.js/src/index.js":
/*!**********************************************!*\
  !*** ./node_modules/enquire.js/src/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MediaQueryDispatch = __webpack_require__(/*! ./MediaQueryDispatch */ "./node_modules/enquire.js/src/MediaQueryDispatch.js");
module.exports = new MediaQueryDispatch();


/***/ }),

/***/ "./node_modules/json2mq/index.js":
/*!***************************************!*\
  !*** ./node_modules/json2mq/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var camel2hyphen = __webpack_require__(/*! string-convert/camel2hyphen */ "./node_modules/string-convert/camel2hyphen.js");

var isDimension = function (feature) {
  var re = /[height|width]$/;
  return re.test(feature);
};

var obj2mq = function (obj) {
  var mq = '';
  var features = Object.keys(obj);
  features.forEach(function (feature, index) {
    var value = obj[feature];
    feature = camel2hyphen(feature);
    // Add px to dimension features
    if (isDimension(feature) && typeof value === 'number') {
      value = value + 'px';
    }
    if (value === true) {
      mq += feature;
    } else if (value === false) {
      mq += 'not ' + feature;
    } else {
      mq += '(' + feature + ': ' + value + ')';
    }
    if (index < features.length-1) {
      mq += ' and '
    }
  });
  return mq;
};

var json2mq = function (query) {
  var mq = '';
  if (typeof query === 'string') {
    return query;
  }
  // Handling array of media queries
  if (query instanceof Array) {
    query.forEach(function (q, index) {
      mq += obj2mq(q);
      if (index < query.length-1) {
        mq += ', '
      }
    });
    return mq;
  }
  // Handling single media query
  return obj2mq(query);
};

module.exports = json2mq;

/***/ }),

/***/ "./node_modules/lodash.debounce/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.debounce/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;


/***/ }),

/***/ "./node_modules/react-slick/lib/arrows.js":
/*!************************************************!*\
  !*** ./node_modules/react-slick/lib/arrows.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.NextArrow = exports.PrevArrow = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));

var _innerSliderUtils = __webpack_require__(/*! ./utils/innerSliderUtils */ "./node_modules/react-slick/lib/utils/innerSliderUtils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var PrevArrow =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(PrevArrow, _React$PureComponent);

  function PrevArrow() {
    _classCallCheck(this, PrevArrow);

    return _possibleConstructorReturn(this, _getPrototypeOf(PrevArrow).apply(this, arguments));
  }

  _createClass(PrevArrow, [{
    key: "clickHandler",
    value: function clickHandler(options, e) {
      if (e) {
        e.preventDefault();
      }

      this.props.clickHandler(options, e);
    }
  }, {
    key: "render",
    value: function render() {
      var prevClasses = {
        "slick-arrow": true,
        "slick-prev": true
      };
      var prevHandler = this.clickHandler.bind(this, {
        message: "previous"
      });

      if (!this.props.infinite && (this.props.currentSlide === 0 || this.props.slideCount <= this.props.slidesToShow)) {
        prevClasses["slick-disabled"] = true;
        prevHandler = null;
      }

      var prevArrowProps = {
        key: "0",
        "data-role": "none",
        className: (0, _classnames.default)(prevClasses),
        style: {
          display: "block"
        },
        onClick: prevHandler
      };
      var customProps = {
        currentSlide: this.props.currentSlide,
        slideCount: this.props.slideCount
      };
      var prevArrow;

      if (this.props.prevArrow) {
        prevArrow = _react.default.cloneElement(this.props.prevArrow, _objectSpread({}, prevArrowProps, customProps));
      } else {
        prevArrow = _react.default.createElement("button", _extends({
          key: "0",
          type: "button"
        }, prevArrowProps), " ", "Previous");
      }

      return prevArrow;
    }
  }]);

  return PrevArrow;
}(_react.default.PureComponent);

exports.PrevArrow = PrevArrow;

var NextArrow =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(NextArrow, _React$PureComponent2);

  function NextArrow() {
    _classCallCheck(this, NextArrow);

    return _possibleConstructorReturn(this, _getPrototypeOf(NextArrow).apply(this, arguments));
  }

  _createClass(NextArrow, [{
    key: "clickHandler",
    value: function clickHandler(options, e) {
      if (e) {
        e.preventDefault();
      }

      this.props.clickHandler(options, e);
    }
  }, {
    key: "render",
    value: function render() {
      var nextClasses = {
        "slick-arrow": true,
        "slick-next": true
      };
      var nextHandler = this.clickHandler.bind(this, {
        message: "next"
      });

      if (!(0, _innerSliderUtils.canGoNext)(this.props)) {
        nextClasses["slick-disabled"] = true;
        nextHandler = null;
      }

      var nextArrowProps = {
        key: "1",
        "data-role": "none",
        className: (0, _classnames.default)(nextClasses),
        style: {
          display: "block"
        },
        onClick: nextHandler
      };
      var customProps = {
        currentSlide: this.props.currentSlide,
        slideCount: this.props.slideCount
      };
      var nextArrow;

      if (this.props.nextArrow) {
        nextArrow = _react.default.cloneElement(this.props.nextArrow, _objectSpread({}, nextArrowProps, customProps));
      } else {
        nextArrow = _react.default.createElement("button", _extends({
          key: "1",
          type: "button"
        }, nextArrowProps), " ", "Next");
      }

      return nextArrow;
    }
  }]);

  return NextArrow;
}(_react.default.PureComponent);

exports.NextArrow = NextArrow;

/***/ }),

/***/ "./node_modules/react-slick/lib/default-props.js":
/*!*******************************************************!*\
  !*** ./node_modules/react-slick/lib/default-props.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultProps = {
  accessibility: true,
  adaptiveHeight: false,
  afterChange: null,
  appendDots: function appendDots(dots) {
    return _react.default.createElement("ul", {
      style: {
        display: "block"
      }
    }, dots);
  },
  arrows: true,
  autoplay: false,
  autoplaySpeed: 3000,
  beforeChange: null,
  centerMode: false,
  centerPadding: "50px",
  className: "",
  cssEase: "ease",
  customPaging: function customPaging(i) {
    return _react.default.createElement("button", null, i + 1);
  },
  dots: false,
  dotsClass: "slick-dots",
  draggable: true,
  easing: "linear",
  edgeFriction: 0.35,
  fade: false,
  focusOnSelect: false,
  infinite: true,
  initialSlide: 0,
  lazyLoad: null,
  nextArrow: null,
  onEdge: null,
  onInit: null,
  onLazyLoadError: null,
  onReInit: null,
  pauseOnDotsHover: false,
  pauseOnFocus: false,
  pauseOnHover: true,
  prevArrow: null,
  responsive: null,
  rows: 1,
  rtl: false,
  slide: "div",
  slidesPerRow: 1,
  slidesToScroll: 1,
  slidesToShow: 1,
  speed: 500,
  swipe: true,
  swipeEvent: null,
  swipeToSlide: false,
  touchMove: true,
  touchThreshold: 5,
  useCSS: true,
  useTransform: true,
  variableWidth: false,
  vertical: false,
  waitForAnimate: true
};
var _default = defaultProps;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/react-slick/lib/dots.js":
/*!**********************************************!*\
  !*** ./node_modules/react-slick/lib/dots.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Dots = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var getDotCount = function getDotCount(spec) {
  var dots;

  if (spec.infinite) {
    dots = Math.ceil(spec.slideCount / spec.slidesToScroll);
  } else {
    dots = Math.ceil((spec.slideCount - spec.slidesToShow) / spec.slidesToScroll) + 1;
  }

  return dots;
};

var Dots =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Dots, _React$PureComponent);

  function Dots() {
    _classCallCheck(this, Dots);

    return _possibleConstructorReturn(this, _getPrototypeOf(Dots).apply(this, arguments));
  }

  _createClass(Dots, [{
    key: "clickHandler",
    value: function clickHandler(options, e) {
      // In Autoplay the focus stays on clicked button even after transition
      // to next slide. That only goes away by click somewhere outside
      e.preventDefault();
      this.props.clickHandler(options);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var dotCount = getDotCount({
        slideCount: this.props.slideCount,
        slidesToScroll: this.props.slidesToScroll,
        slidesToShow: this.props.slidesToShow,
        infinite: this.props.infinite
      }); // Apply join & split to Array to pre-fill it for IE8
      //
      // Credit: http://stackoverflow.com/a/13735425/1849458

      var _this$props = this.props,
          onMouseEnter = _this$props.onMouseEnter,
          onMouseOver = _this$props.onMouseOver,
          onMouseLeave = _this$props.onMouseLeave;
      var mouseEvents = {
        onMouseEnter: onMouseEnter,
        onMouseOver: onMouseOver,
        onMouseLeave: onMouseLeave
      };
      var dots = Array.apply(null, Array(dotCount + 1).join("0").split("")).map(function (x, i) {
        var leftBound = i * _this.props.slidesToScroll;
        var rightBound = i * _this.props.slidesToScroll + (_this.props.slidesToScroll - 1);
        var className = (0, _classnames.default)({
          "slick-active": _this.props.currentSlide >= leftBound && _this.props.currentSlide <= rightBound
        });
        var dotOptions = {
          message: "dots",
          index: i,
          slidesToScroll: _this.props.slidesToScroll,
          currentSlide: _this.props.currentSlide
        };

        var onClick = _this.clickHandler.bind(_this, dotOptions);

        return _react.default.createElement("li", {
          key: i,
          className: className
        }, _react.default.cloneElement(_this.props.customPaging(i), {
          onClick: onClick
        }));
      });
      return _react.default.cloneElement(this.props.appendDots(dots), _objectSpread({
        className: this.props.dotsClass
      }, mouseEvents));
    }
  }]);

  return Dots;
}(_react.default.PureComponent);

exports.Dots = Dots;

/***/ }),

/***/ "./node_modules/react-slick/lib/index.js":
/*!***********************************************!*\
  !*** ./node_modules/react-slick/lib/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _slider = _interopRequireDefault(__webpack_require__(/*! ./slider */ "./node_modules/react-slick/lib/slider.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _slider.default;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/react-slick/lib/initial-state.js":
/*!*******************************************************!*\
  !*** ./node_modules/react-slick/lib/initial-state.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var initialState = {
  animating: false,
  autoplaying: null,
  currentDirection: 0,
  currentLeft: null,
  currentSlide: 0,
  direction: 1,
  dragging: false,
  edgeDragged: false,
  initialized: false,
  lazyLoadedList: [],
  listHeight: null,
  listWidth: null,
  scrolling: false,
  slideCount: null,
  slideHeight: null,
  slideWidth: null,
  swipeLeft: null,
  swiped: false,
  // used by swipeEvent. differentites between touch and swipe.
  swiping: false,
  touchObject: {
    startX: 0,
    startY: 0,
    curX: 0,
    curY: 0
  },
  trackStyle: {},
  trackWidth: 0
};
var _default = initialState;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/react-slick/lib/inner-slider.js":
/*!******************************************************!*\
  !*** ./node_modules/react-slick/lib/inner-slider.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.InnerSlider = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _reactDom = _interopRequireDefault(__webpack_require__(/*! react-dom */ "react-dom"));

var _initialState = _interopRequireDefault(__webpack_require__(/*! ./initial-state */ "./node_modules/react-slick/lib/initial-state.js"));

var _lodash = _interopRequireDefault(__webpack_require__(/*! lodash.debounce */ "./node_modules/lodash.debounce/index.js"));

var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));

var _innerSliderUtils = __webpack_require__(/*! ./utils/innerSliderUtils */ "./node_modules/react-slick/lib/utils/innerSliderUtils.js");

var _track = __webpack_require__(/*! ./track */ "./node_modules/react-slick/lib/track.js");

var _dots = __webpack_require__(/*! ./dots */ "./node_modules/react-slick/lib/dots.js");

var _arrows = __webpack_require__(/*! ./arrows */ "./node_modules/react-slick/lib/arrows.js");

var _resizeObserverPolyfill = _interopRequireDefault(__webpack_require__(/*! resize-observer-polyfill */ "./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var InnerSlider =
/*#__PURE__*/
function (_React$Component) {
  _inherits(InnerSlider, _React$Component);

  function InnerSlider(props) {
    var _this;

    _classCallCheck(this, InnerSlider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InnerSlider).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "listRefHandler", function (ref) {
      return _this.list = ref;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "trackRefHandler", function (ref) {
      return _this.track = ref;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "adaptHeight", function () {
      if (_this.props.adaptiveHeight && _this.list) {
        var elem = _this.list.querySelector("[data-index=\"".concat(_this.state.currentSlide, "\"]"));

        _this.list.style.height = (0, _innerSliderUtils.getHeight)(elem) + "px";
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "componentWillMount", function () {
      _this.ssrInit();

      _this.props.onInit && _this.props.onInit();

      if (_this.props.lazyLoad) {
        var slidesToLoad = (0, _innerSliderUtils.getOnDemandLazySlides)(_objectSpread({}, _this.props, _this.state));

        if (slidesToLoad.length > 0) {
          _this.setState(function (prevState) {
            return {
              lazyLoadedList: prevState.lazyLoadedList.concat(slidesToLoad)
            };
          });

          if (_this.props.onLazyLoad) {
            _this.props.onLazyLoad(slidesToLoad);
          }
        }
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "componentDidMount", function () {
      var spec = _objectSpread({
        listRef: _this.list,
        trackRef: _this.track
      }, _this.props);

      _this.updateState(spec, true, function () {
        _this.adaptHeight();

        _this.props.autoplay && _this.autoPlay("update");
      });

      if (_this.props.lazyLoad === "progressive") {
        _this.lazyLoadTimer = setInterval(_this.progressiveLazyLoad, 1000);
      }

      _this.ro = new _resizeObserverPolyfill.default(function () {
        if (_this.state.animating) {
          _this.onWindowResized(false); // don't set trackStyle hence don't break animation


          _this.callbackTimers.push(setTimeout(function () {
            return _this.onWindowResized();
          }, _this.props.speed));
        } else {
          _this.onWindowResized();
        }
      });

      _this.ro.observe(_this.list);

      Array.prototype.forEach.call(document.querySelectorAll(".slick-slide"), function (slide) {
        slide.onfocus = _this.props.pauseOnFocus ? _this.onSlideFocus : null;
        slide.onblur = _this.props.pauseOnFocus ? _this.onSlideBlur : null;
      }); // To support server-side rendering

      if (!window) {
        return;
      }

      if (window.addEventListener) {
        window.addEventListener("resize", _this.onWindowResized);
      } else {
        window.attachEvent("onresize", _this.onWindowResized);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "componentWillUnmount", function () {
      if (_this.animationEndCallback) {
        clearTimeout(_this.animationEndCallback);
      }

      if (_this.lazyLoadTimer) {
        clearInterval(_this.lazyLoadTimer);
      }

      if (_this.callbackTimers.length) {
        _this.callbackTimers.forEach(function (timer) {
          return clearTimeout(timer);
        });

        _this.callbackTimers = [];
      }

      if (window.addEventListener) {
        window.removeEventListener("resize", _this.onWindowResized);
      } else {
        window.detachEvent("onresize", _this.onWindowResized);
      }

      if (_this.autoplayTimer) {
        clearInterval(_this.autoplayTimer);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "componentWillReceiveProps", function (nextProps) {
      var spec = _objectSpread({
        listRef: _this.list,
        trackRef: _this.track
      }, nextProps, _this.state);

      var setTrackStyle = false;

      var _arr = Object.keys(_this.props);

      for (var _i = 0; _i < _arr.length; _i++) {
        var key = _arr[_i];

        if (!nextProps.hasOwnProperty(key)) {
          setTrackStyle = true;
          break;
        }

        if (_typeof(nextProps[key]) === "object" || typeof nextProps[key] === "function") {
          continue;
        }

        if (nextProps[key] !== _this.props[key]) {
          setTrackStyle = true;
          break;
        }
      }

      _this.updateState(spec, setTrackStyle, function () {
        if (_this.state.currentSlide >= _react.default.Children.count(nextProps.children)) {
          _this.changeSlide({
            message: "index",
            index: _react.default.Children.count(nextProps.children) - nextProps.slidesToShow,
            currentSlide: _this.state.currentSlide
          });
        }

        if (nextProps.autoplay) {
          _this.autoPlay("update");
        } else {
          _this.pause("paused");
        }
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "componentDidUpdate", function () {
      _this.checkImagesLoad();

      _this.props.onReInit && _this.props.onReInit();

      if (_this.props.lazyLoad) {
        var slidesToLoad = (0, _innerSliderUtils.getOnDemandLazySlides)(_objectSpread({}, _this.props, _this.state));

        if (slidesToLoad.length > 0) {
          _this.setState(function (prevState) {
            return {
              lazyLoadedList: prevState.lazyLoadedList.concat(slidesToLoad)
            };
          });

          if (_this.props.onLazyLoad) {
            _this.props.onLazyLoad(slidesToLoad);
          }
        }
      } // if (this.props.onLazyLoad) {
      //   this.props.onLazyLoad([leftMostSlide])
      // }


      _this.adaptHeight();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onWindowResized", function (setTrackStyle) {
      if (_this.debouncedResize) _this.debouncedResize.cancel();
      _this.debouncedResize = (0, _lodash.default)(function () {
        return _this.resizeWindow(setTrackStyle);
      }, 50);

      _this.debouncedResize();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "resizeWindow", function () {
      var setTrackStyle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (!_reactDom.default.findDOMNode(_this.track)) return;

      var spec = _objectSpread({
        listRef: _this.list,
        trackRef: _this.track
      }, _this.props, _this.state);

      _this.updateState(spec, setTrackStyle, function () {
        if (_this.props.autoplay) _this.autoPlay("update");else _this.pause("paused");
      }); // animating state should be cleared while resizing, otherwise autoplay stops working


      _this.setState({
        animating: false
      });

      clearTimeout(_this.animationEndCallback);
      delete _this.animationEndCallback;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "updateState", function (spec, setTrackStyle, callback) {
      var updatedState = (0, _innerSliderUtils.initializedState)(spec);
      spec = _objectSpread({}, spec, updatedState, {
        slideIndex: updatedState.currentSlide
      });
      var targetLeft = (0, _innerSliderUtils.getTrackLeft)(spec);
      spec = _objectSpread({}, spec, {
        left: targetLeft
      });
      var trackStyle = (0, _innerSliderUtils.getTrackCSS)(spec);

      if (setTrackStyle || _react.default.Children.count(_this.props.children) !== _react.default.Children.count(spec.children)) {
        updatedState["trackStyle"] = trackStyle;
      }

      _this.setState(updatedState, callback);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "ssrInit", function () {
      if (_this.props.variableWidth) {
        var _trackWidth = 0,
            _trackLeft = 0;
        var childrenWidths = [];
        var preClones = (0, _innerSliderUtils.getPreClones)(_objectSpread({}, _this.props, _this.state, {
          slideCount: _this.props.children.length
        }));
        var postClones = (0, _innerSliderUtils.getPostClones)(_objectSpread({}, _this.props, _this.state, {
          slideCount: _this.props.children.length
        }));

        _this.props.children.forEach(function (child) {
          childrenWidths.push(child.props.style.width);
          _trackWidth += child.props.style.width;
        });

        for (var i = 0; i < preClones; i++) {
          _trackLeft += childrenWidths[childrenWidths.length - 1 - i];
          _trackWidth += childrenWidths[childrenWidths.length - 1 - i];
        }

        for (var _i2 = 0; _i2 < postClones; _i2++) {
          _trackWidth += childrenWidths[_i2];
        }

        for (var _i3 = 0; _i3 < _this.state.currentSlide; _i3++) {
          _trackLeft += childrenWidths[_i3];
        }

        var _trackStyle = {
          width: _trackWidth + "px",
          left: -_trackLeft + "px"
        };

        if (_this.props.centerMode) {
          var currentWidth = "".concat(childrenWidths[_this.state.currentSlide], "px");
          _trackStyle.left = "calc(".concat(_trackStyle.left, " + (100% - ").concat(currentWidth, ") / 2 ) ");
        }

        _this.setState({
          trackStyle: _trackStyle
        });

        return;
      }

      var childrenCount = _react.default.Children.count(_this.props.children);

      var spec = _objectSpread({}, _this.props, _this.state, {
        slideCount: childrenCount
      });

      var slideCount = (0, _innerSliderUtils.getPreClones)(spec) + (0, _innerSliderUtils.getPostClones)(spec) + childrenCount;
      var trackWidth = 100 / _this.props.slidesToShow * slideCount;
      var slideWidth = 100 / slideCount;
      var trackLeft = -slideWidth * ((0, _innerSliderUtils.getPreClones)(spec) + _this.state.currentSlide) * trackWidth / 100;

      if (_this.props.centerMode) {
        trackLeft += (100 - slideWidth * trackWidth / 100) / 2;
      }

      var trackStyle = {
        width: trackWidth + "%",
        left: trackLeft + "%"
      };

      _this.setState({
        slideWidth: slideWidth + "%",
        trackStyle: trackStyle
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "checkImagesLoad", function () {
      var images = document.querySelectorAll(".slick-slide img");
      var imagesCount = images.length,
          loadedCount = 0;
      Array.prototype.forEach.call(images, function (image) {
        var handler = function handler() {
          return ++loadedCount && loadedCount >= imagesCount && _this.onWindowResized();
        };

        if (!image.onclick) {
          image.onclick = function () {
            return image.parentNode.focus();
          };
        } else {
          var prevClickHandler = image.onclick;

          image.onclick = function () {
            prevClickHandler();
            image.parentNode.focus();
          };
        }

        if (!image.onload) {
          if (_this.props.lazyLoad) {
            image.onload = function () {
              _this.adaptHeight();

              _this.callbackTimers.push(setTimeout(_this.onWindowResized, _this.props.speed));
            };
          } else {
            image.onload = handler;

            image.onerror = function () {
              handler();
              _this.props.onLazyLoadError && _this.props.onLazyLoadError();
            };
          }
        }
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "progressiveLazyLoad", function () {
      var slidesToLoad = [];

      var spec = _objectSpread({}, _this.props, _this.state);

      for (var index = _this.state.currentSlide; index < _this.state.slideCount + (0, _innerSliderUtils.getPostClones)(spec); index++) {
        if (_this.state.lazyLoadedList.indexOf(index) < 0) {
          slidesToLoad.push(index);
          break;
        }
      }

      for (var _index = _this.state.currentSlide - 1; _index >= -(0, _innerSliderUtils.getPreClones)(spec); _index--) {
        if (_this.state.lazyLoadedList.indexOf(_index) < 0) {
          slidesToLoad.push(_index);
          break;
        }
      }

      if (slidesToLoad.length > 0) {
        _this.setState(function (state) {
          return {
            lazyLoadedList: state.lazyLoadedList.concat(slidesToLoad)
          };
        });

        if (_this.props.onLazyLoad) {
          _this.props.onLazyLoad(slidesToLoad);
        }
      } else {
        if (_this.lazyLoadTimer) {
          clearInterval(_this.lazyLoadTimer);
          delete _this.lazyLoadTimer;
        }
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "slideHandler", function (index) {
      var dontAnimate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var _this$props = _this.props,
          asNavFor = _this$props.asNavFor,
          beforeChange = _this$props.beforeChange,
          onLazyLoad = _this$props.onLazyLoad,
          speed = _this$props.speed,
          afterChange = _this$props.afterChange; // capture currentslide before state is updated

      var currentSlide = _this.state.currentSlide;

      var _slideHandler = (0, _innerSliderUtils.slideHandler)(_objectSpread({
        index: index
      }, _this.props, _this.state, {
        trackRef: _this.track,
        useCSS: _this.props.useCSS && !dontAnimate
      })),
          state = _slideHandler.state,
          nextState = _slideHandler.nextState;

      if (!state) return;
      beforeChange && beforeChange(currentSlide, state.currentSlide);
      var slidesToLoad = state.lazyLoadedList.filter(function (value) {
        return _this.state.lazyLoadedList.indexOf(value) < 0;
      });
      onLazyLoad && slidesToLoad.length > 0 && onLazyLoad(slidesToLoad);

      _this.setState(state, function () {
        asNavFor && asNavFor.innerSlider.state.currentSlide !== _this.state.currentSlide && asNavFor.innerSlider.slideHandler(index);
        if (!nextState) return;
        _this.animationEndCallback = setTimeout(function () {
          var animating = nextState.animating,
              firstBatch = _objectWithoutProperties(nextState, ["animating"]);

          _this.setState(firstBatch, function () {
            _this.callbackTimers.push(setTimeout(function () {
              return _this.setState({
                animating: animating
              });
            }, 10));

            afterChange && afterChange(state.currentSlide);
            delete _this.animationEndCallback;
          });
        }, speed);
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "changeSlide", function (options) {
      var dontAnimate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var spec = _objectSpread({}, _this.props, _this.state);

      var targetSlide = (0, _innerSliderUtils.changeSlide)(spec, options);
      if (targetSlide !== 0 && !targetSlide) return;

      if (dontAnimate === true) {
        _this.slideHandler(targetSlide, dontAnimate);
      } else {
        _this.slideHandler(targetSlide);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "clickHandler", function (e) {
      if (_this.clickable === false) {
        e.stopPropagation();
        e.preventDefault();
      }

      _this.clickable = true;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "keyHandler", function (e) {
      var dir = (0, _innerSliderUtils.keyHandler)(e, _this.props.accessibility, _this.props.rtl);
      dir !== "" && _this.changeSlide({
        message: dir
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "selectHandler", function (options) {
      _this.changeSlide(options);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "disableBodyScroll", function () {
      var preventDefault = function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
      };

      window.ontouchmove = preventDefault;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "enableBodyScroll", function () {
      window.ontouchmove = null;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "swipeStart", function (e) {
      if (_this.props.verticalSwiping) {
        _this.disableBodyScroll();
      }

      var state = (0, _innerSliderUtils.swipeStart)(e, _this.props.swipe, _this.props.draggable);
      state !== "" && _this.setState(state);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "swipeMove", function (e) {
      var state = (0, _innerSliderUtils.swipeMove)(e, _objectSpread({}, _this.props, _this.state, {
        trackRef: _this.track,
        listRef: _this.list,
        slideIndex: _this.state.currentSlide
      }));
      if (!state) return;

      if (state["swiping"]) {
        _this.clickable = false;
      }

      _this.setState(state);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "swipeEnd", function (e) {
      var state = (0, _innerSliderUtils.swipeEnd)(e, _objectSpread({}, _this.props, _this.state, {
        trackRef: _this.track,
        listRef: _this.list,
        slideIndex: _this.state.currentSlide
      }));
      if (!state) return;
      var triggerSlideHandler = state["triggerSlideHandler"];
      delete state["triggerSlideHandler"];

      _this.setState(state);

      if (triggerSlideHandler === undefined) return;

      _this.slideHandler(triggerSlideHandler);

      if (_this.props.verticalSwiping) {
        _this.enableBodyScroll();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "slickPrev", function () {
      // this and fellow methods are wrapped in setTimeout
      // to make sure initialize setState has happened before
      // any of such methods are called
      _this.callbackTimers.push(setTimeout(function () {
        return _this.changeSlide({
          message: "previous"
        });
      }, 0));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "slickNext", function () {
      _this.callbackTimers.push(setTimeout(function () {
        return _this.changeSlide({
          message: "next"
        });
      }, 0));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "slickGoTo", function (slide) {
      var dontAnimate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      slide = Number(slide);
      if (isNaN(slide)) return "";

      _this.callbackTimers.push(setTimeout(function () {
        return _this.changeSlide({
          message: "index",
          index: slide,
          currentSlide: _this.state.currentSlide
        }, dontAnimate);
      }, 0));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "play", function () {
      var nextIndex;

      if (_this.props.rtl) {
        nextIndex = _this.state.currentSlide - _this.props.slidesToScroll;
      } else {
        if ((0, _innerSliderUtils.canGoNext)(_objectSpread({}, _this.props, _this.state))) {
          nextIndex = _this.state.currentSlide + _this.props.slidesToScroll;
        } else {
          return false;
        }
      }

      _this.slideHandler(nextIndex);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "autoPlay", function (playType) {
      if (_this.autoplayTimer) {
        clearInterval(_this.autoplayTimer);
      }

      var autoplaying = _this.state.autoplaying;

      if (playType === "update") {
        if (autoplaying === "hovered" || autoplaying === "focused" || autoplaying === "paused") {
          return;
        }
      } else if (playType === "leave") {
        if (autoplaying === "paused" || autoplaying === "focused") {
          return;
        }
      } else if (playType === "blur") {
        if (autoplaying === "paused" || autoplaying === "hovered") {
          return;
        }
      }

      _this.autoplayTimer = setInterval(_this.play, _this.props.autoplaySpeed + 50);

      _this.setState({
        autoplaying: "playing"
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "pause", function (pauseType) {
      if (_this.autoplayTimer) {
        clearInterval(_this.autoplayTimer);
        _this.autoplayTimer = null;
      }

      var autoplaying = _this.state.autoplaying;

      if (pauseType === "paused") {
        _this.setState({
          autoplaying: "paused"
        });
      } else if (pauseType === "focused") {
        if (autoplaying === "hovered" || autoplaying === "playing") {
          _this.setState({
            autoplaying: "focused"
          });
        }
      } else {
        // pauseType  is 'hovered'
        if (autoplaying === "playing") {
          _this.setState({
            autoplaying: "hovered"
          });
        }
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onDotsOver", function () {
      return _this.props.autoplay && _this.pause("hovered");
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onDotsLeave", function () {
      return _this.props.autoplay && _this.state.autoplaying === "hovered" && _this.autoPlay("leave");
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onTrackOver", function () {
      return _this.props.autoplay && _this.pause("hovered");
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onTrackLeave", function () {
      return _this.props.autoplay && _this.state.autoplaying === "hovered" && _this.autoPlay("leave");
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onSlideFocus", function () {
      return _this.props.autoplay && _this.pause("focused");
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onSlideBlur", function () {
      return _this.props.autoplay && _this.state.autoplaying === "focused" && _this.autoPlay("blur");
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "render", function () {
      var className = (0, _classnames.default)("slick-slider", _this.props.className, {
        "slick-vertical": _this.props.vertical,
        "slick-initialized": true
      });

      var spec = _objectSpread({}, _this.props, _this.state);

      var trackProps = (0, _innerSliderUtils.extractObject)(spec, ["fade", "cssEase", "speed", "infinite", "centerMode", "focusOnSelect", "currentSlide", "lazyLoad", "lazyLoadedList", "rtl", "slideWidth", "slideHeight", "listHeight", "vertical", "slidesToShow", "slidesToScroll", "slideCount", "trackStyle", "variableWidth", "unslick", "centerPadding"]);
      var pauseOnHover = _this.props.pauseOnHover;
      trackProps = _objectSpread({}, trackProps, {
        onMouseEnter: pauseOnHover ? _this.onTrackOver : null,
        onMouseLeave: pauseOnHover ? _this.onTrackLeave : null,
        onMouseOver: pauseOnHover ? _this.onTrackOver : null,
        focusOnSelect: _this.props.focusOnSelect ? _this.selectHandler : null
      });
      var dots;

      if (_this.props.dots === true && _this.state.slideCount >= _this.props.slidesToShow) {
        var dotProps = (0, _innerSliderUtils.extractObject)(spec, ["dotsClass", "slideCount", "slidesToShow", "currentSlide", "slidesToScroll", "clickHandler", "children", "customPaging", "infinite", "appendDots"]);
        var pauseOnDotsHover = _this.props.pauseOnDotsHover;
        dotProps = _objectSpread({}, dotProps, {
          clickHandler: _this.changeSlide,
          onMouseEnter: pauseOnDotsHover ? _this.onDotsLeave : null,
          onMouseOver: pauseOnDotsHover ? _this.onDotsOver : null,
          onMouseLeave: pauseOnDotsHover ? _this.onDotsLeave : null
        });
        dots = _react.default.createElement(_dots.Dots, dotProps);
      }

      var prevArrow, nextArrow;
      var arrowProps = (0, _innerSliderUtils.extractObject)(spec, ["infinite", "centerMode", "currentSlide", "slideCount", "slidesToShow", "prevArrow", "nextArrow"]);
      arrowProps.clickHandler = _this.changeSlide;

      if (_this.props.arrows) {
        prevArrow = _react.default.createElement(_arrows.PrevArrow, arrowProps);
        nextArrow = _react.default.createElement(_arrows.NextArrow, arrowProps);
      }

      var verticalHeightStyle = null;

      if (_this.props.vertical) {
        verticalHeightStyle = {
          height: _this.state.listHeight
        };
      }

      var centerPaddingStyle = null;

      if (_this.props.vertical === false) {
        if (_this.props.centerMode === true) {
          centerPaddingStyle = {
            padding: "0px " + _this.props.centerPadding
          };
        }
      } else {
        if (_this.props.centerMode === true) {
          centerPaddingStyle = {
            padding: _this.props.centerPadding + " 0px"
          };
        }
      }

      var listStyle = _objectSpread({}, verticalHeightStyle, centerPaddingStyle);

      var touchMove = _this.props.touchMove;
      var listProps = {
        className: "slick-list",
        style: listStyle,
        onClick: _this.clickHandler,
        onMouseDown: touchMove ? _this.swipeStart : null,
        onMouseMove: _this.state.dragging && touchMove ? _this.swipeMove : null,
        onMouseUp: touchMove ? _this.swipeEnd : null,
        onMouseLeave: _this.state.dragging && touchMove ? _this.swipeEnd : null,
        onTouchStart: touchMove ? _this.swipeStart : null,
        onTouchMove: _this.state.dragging && touchMove ? _this.swipeMove : null,
        onTouchEnd: touchMove ? _this.swipeEnd : null,
        onTouchCancel: _this.state.dragging && touchMove ? _this.swipeEnd : null,
        onKeyDown: _this.props.accessibility ? _this.keyHandler : null
      };
      var innerSliderProps = {
        className: className,
        dir: "ltr"
      };

      if (_this.props.unslick) {
        listProps = {
          className: "slick-list"
        };
        innerSliderProps = {
          className: className
        };
      }

      return _react.default.createElement("div", innerSliderProps, !_this.props.unslick ? prevArrow : "", _react.default.createElement("div", _extends({
        ref: _this.listRefHandler
      }, listProps), _react.default.createElement(_track.Track, _extends({
        ref: _this.trackRefHandler
      }, trackProps), _this.props.children)), !_this.props.unslick ? nextArrow : "", !_this.props.unslick ? dots : "");
    });

    _this.list = null;
    _this.track = null;
    _this.state = _objectSpread({}, _initialState.default, {
      currentSlide: _this.props.initialSlide,
      slideCount: _react.default.Children.count(_this.props.children)
    });
    _this.callbackTimers = [];
    _this.clickable = true;
    _this.debouncedResize = null;
    return _this;
  }

  return InnerSlider;
}(_react.default.Component);

exports.InnerSlider = InnerSlider;

/***/ }),

/***/ "./node_modules/react-slick/lib/slider.js":
/*!************************************************!*\
  !*** ./node_modules/react-slick/lib/slider.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _innerSlider = __webpack_require__(/*! ./inner-slider */ "./node_modules/react-slick/lib/inner-slider.js");

var _json2mq = _interopRequireDefault(__webpack_require__(/*! json2mq */ "./node_modules/json2mq/index.js"));

var _defaultProps = _interopRequireDefault(__webpack_require__(/*! ./default-props */ "./node_modules/react-slick/lib/default-props.js"));

var _innerSliderUtils = __webpack_require__(/*! ./utils/innerSliderUtils */ "./node_modules/react-slick/lib/utils/innerSliderUtils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var enquire = (0, _innerSliderUtils.canUseDOM)() && __webpack_require__(/*! enquire.js */ "./node_modules/enquire.js/src/index.js");

var Slider =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Slider, _React$Component);

  function Slider(props) {
    var _this;

    _classCallCheck(this, Slider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Slider).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "innerSliderRefHandler", function (ref) {
      return _this.innerSlider = ref;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "slickPrev", function () {
      return _this.innerSlider.slickPrev();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "slickNext", function () {
      return _this.innerSlider.slickNext();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "slickGoTo", function (slide) {
      var dontAnimate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return _this.innerSlider.slickGoTo(slide, dontAnimate);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "slickPause", function () {
      return _this.innerSlider.pause("paused");
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "slickPlay", function () {
      return _this.innerSlider.autoPlay("play");
    });

    _this.state = {
      breakpoint: null
    };
    _this._responsiveMediaHandlers = [];
    return _this;
  }

  _createClass(Slider, [{
    key: "media",
    value: function media(query, handler) {
      // javascript handler for  css media query
      enquire.register(query, handler);

      this._responsiveMediaHandlers.push({
        query: query,
        handler: handler
      });
    } // handles responsive breakpoints

  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      // performance monitoring
      //if (process.env.NODE_ENV !== 'production') {
      //const { whyDidYouUpdate } = require('why-did-you-update')
      //whyDidYouUpdate(React)
      //}
      if (this.props.responsive) {
        var breakpoints = this.props.responsive.map(function (breakpt) {
          return breakpt.breakpoint;
        }); // sort them in increasing order of their numerical value

        breakpoints.sort(function (x, y) {
          return x - y;
        });
        breakpoints.forEach(function (breakpoint, index) {
          // media query for each breakpoint
          var bQuery;

          if (index === 0) {
            bQuery = (0, _json2mq.default)({
              minWidth: 0,
              maxWidth: breakpoint
            });
          } else {
            bQuery = (0, _json2mq.default)({
              minWidth: breakpoints[index - 1] + 1,
              maxWidth: breakpoint
            });
          } // when not using server side rendering


          (0, _innerSliderUtils.canUseDOM)() && _this2.media(bQuery, function () {
            _this2.setState({
              breakpoint: breakpoint
            });
          });
        }); // Register media query for full screen. Need to support resize from small to large
        // convert javascript object to media query string

        var query = (0, _json2mq.default)({
          minWidth: breakpoints.slice(-1)[0]
        });
        (0, _innerSliderUtils.canUseDOM)() && this.media(query, function () {
          _this2.setState({
            breakpoint: null
          });
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._responsiveMediaHandlers.forEach(function (obj) {
        enquire.unregister(obj.query, obj.handler);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var settings;
      var newProps;

      if (this.state.breakpoint) {
        newProps = this.props.responsive.filter(function (resp) {
          return resp.breakpoint === _this3.state.breakpoint;
        });
        settings = newProps[0].settings === "unslick" ? "unslick" : _objectSpread({}, _defaultProps.default, this.props, newProps[0].settings);
      } else {
        settings = _objectSpread({}, _defaultProps.default, this.props);
      } // force scrolling by one if centerMode is on


      if (settings.centerMode) {
        if (settings.slidesToScroll > 1 && "development" !== "production") {
          console.warn("slidesToScroll should be equal to 1 in centerMode, you are using ".concat(settings.slidesToScroll));
        }

        settings.slidesToScroll = 1;
      } // force showing one slide and scrolling by one if the fade mode is on


      if (settings.fade) {
        if (settings.slidesToShow > 1 && "development" !== "production") {
          console.warn("slidesToShow should be equal to 1 when fade is true, you're using ".concat(settings.slidesToShow));
        }

        if (settings.slidesToScroll > 1 && "development" !== "production") {
          console.warn("slidesToScroll should be equal to 1 when fade is true, you're using ".concat(settings.slidesToScroll));
        }

        settings.slidesToShow = 1;
        settings.slidesToScroll = 1;
      } // makes sure that children is an array, even when there is only 1 child


      var children = _react.default.Children.toArray(this.props.children); // Children may contain false or null, so we should filter them
      // children may also contain string filled with spaces (in certain cases where we use jsx strings)


      children = children.filter(function (child) {
        if (typeof child === "string") {
          return !!child.trim();
        }

        return !!child;
      }); // rows and slidesPerRow logic is handled here

      if (settings.variableWidth && (settings.rows > 1 || settings.slidesPerRow > 1)) {
        console.warn("variableWidth is not supported in case of rows > 1 or slidesPerRow > 1");
        settings.variableWidth = false;
      }

      var newChildren = [];
      var currentWidth = null;

      for (var i = 0; i < children.length; i += settings.rows * settings.slidesPerRow) {
        var newSlide = [];

        for (var j = i; j < i + settings.rows * settings.slidesPerRow; j += settings.slidesPerRow) {
          var row = [];

          for (var k = j; k < j + settings.slidesPerRow; k += 1) {
            if (settings.variableWidth && children[k].props.style) {
              currentWidth = children[k].props.style.width;
            }

            if (k >= children.length) break;
            row.push(_react.default.cloneElement(children[k], {
              key: 100 * i + 10 * j + k,
              tabIndex: -1,
              style: {
                width: "".concat(100 / settings.slidesPerRow, "%"),
                display: "inline-block"
              }
            }));
          }

          newSlide.push(_react.default.createElement("div", {
            key: 10 * i + j
          }, row));
        }

        if (settings.variableWidth) {
          newChildren.push(_react.default.createElement("div", {
            key: i,
            style: {
              width: currentWidth
            }
          }, newSlide));
        } else {
          newChildren.push(_react.default.createElement("div", {
            key: i
          }, newSlide));
        }
      }

      if (settings === "unslick") {
        var className = "regular slider " + (this.props.className || "");
        return _react.default.createElement("div", {
          className: className
        }, newChildren);
      } else if (newChildren.length <= settings.slidesToShow) {
        settings.unslick = true;
      }

      return _react.default.createElement(_innerSlider.InnerSlider, _extends({
        ref: this.innerSliderRefHandler
      }, settings), newChildren);
    }
  }]);

  return Slider;
}(_react.default.Component);

exports["default"] = Slider;

/***/ }),

/***/ "./node_modules/react-slick/lib/track.js":
/*!***********************************************!*\
  !*** ./node_modules/react-slick/lib/track.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Track = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));

var _innerSliderUtils = __webpack_require__(/*! ./utils/innerSliderUtils */ "./node_modules/react-slick/lib/utils/innerSliderUtils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// given specifications/props for a slide, fetch all the classes that need to be applied to the slide
var getSlideClasses = function getSlideClasses(spec) {
  var slickActive, slickCenter, slickCloned;
  var centerOffset, index;

  if (spec.rtl) {
    index = spec.slideCount - 1 - spec.index;
  } else {
    index = spec.index;
  }

  slickCloned = index < 0 || index >= spec.slideCount;

  if (spec.centerMode) {
    centerOffset = Math.floor(spec.slidesToShow / 2);
    slickCenter = (index - spec.currentSlide) % spec.slideCount === 0;

    if (index > spec.currentSlide - centerOffset - 1 && index <= spec.currentSlide + centerOffset) {
      slickActive = true;
    }
  } else {
    slickActive = spec.currentSlide <= index && index < spec.currentSlide + spec.slidesToShow;
  }

  var slickCurrent = index === spec.currentSlide;
  return {
    "slick-slide": true,
    "slick-active": slickActive,
    "slick-center": slickCenter,
    "slick-cloned": slickCloned,
    "slick-current": slickCurrent // dubious in case of RTL

  };
};

var getSlideStyle = function getSlideStyle(spec) {
  var style = {};

  if (spec.variableWidth === undefined || spec.variableWidth === false) {
    style.width = spec.slideWidth;
  }

  if (spec.fade) {
    style.position = "relative";

    if (spec.vertical) {
      style.top = -spec.index * parseInt(spec.slideHeight);
    } else {
      style.left = -spec.index * parseInt(spec.slideWidth);
    }

    style.opacity = spec.currentSlide === spec.index ? 1 : 0;
    style.transition = "opacity " + spec.speed + "ms " + spec.cssEase + ", " + "visibility " + spec.speed + "ms " + spec.cssEase;
    style.WebkitTransition = "opacity " + spec.speed + "ms " + spec.cssEase + ", " + "visibility " + spec.speed + "ms " + spec.cssEase;
  }

  return style;
};

var getKey = function getKey(child, fallbackKey) {
  return child.key || fallbackKey;
};

var renderSlides = function renderSlides(spec) {
  var key;
  var slides = [];
  var preCloneSlides = [];
  var postCloneSlides = [];

  var childrenCount = _react.default.Children.count(spec.children);

  var startIndex = (0, _innerSliderUtils.lazyStartIndex)(spec);
  var endIndex = (0, _innerSliderUtils.lazyEndIndex)(spec);

  _react.default.Children.forEach(spec.children, function (elem, index) {
    var child;
    var childOnClickOptions = {
      message: "children",
      index: index,
      slidesToScroll: spec.slidesToScroll,
      currentSlide: spec.currentSlide
    }; // in case of lazyLoad, whether or not we want to fetch the slide

    if (!spec.lazyLoad || spec.lazyLoad && spec.lazyLoadedList.indexOf(index) >= 0) {
      child = elem;
    } else {
      child = _react.default.createElement("div", null);
    }

    var childStyle = getSlideStyle(_objectSpread({}, spec, {
      index: index
    }));
    var slideClass = child.props.className || "";
    var slideClasses = getSlideClasses(_objectSpread({}, spec, {
      index: index
    })); // push a cloned element of the desired slide

    slides.push(_react.default.cloneElement(child, {
      key: "original" + getKey(child, index),
      "data-index": index,
      className: (0, _classnames.default)(slideClasses, slideClass),
      tabIndex: "-1",
      "aria-hidden": !slideClasses["slick-active"],
      style: _objectSpread({
        outline: "none"
      }, child.props.style || {}, childStyle),
      onClick: function onClick(e) {
        child.props && child.props.onClick && child.props.onClick(e);

        if (spec.focusOnSelect) {
          spec.focusOnSelect(childOnClickOptions);
        }
      }
    })); // if slide needs to be precloned or postcloned

    if (spec.infinite && spec.fade === false) {
      var preCloneNo = childrenCount - index;

      if (preCloneNo <= (0, _innerSliderUtils.getPreClones)(spec) && childrenCount !== spec.slidesToShow) {
        key = -preCloneNo;

        if (key >= startIndex) {
          child = elem;
        }

        slideClasses = getSlideClasses(_objectSpread({}, spec, {
          index: key
        }));
        preCloneSlides.push(_react.default.cloneElement(child, {
          key: "precloned" + getKey(child, key),
          "data-index": key,
          tabIndex: "-1",
          className: (0, _classnames.default)(slideClasses, slideClass),
          "aria-hidden": !slideClasses["slick-active"],
          style: _objectSpread({}, child.props.style || {}, childStyle),
          onClick: function onClick(e) {
            child.props && child.props.onClick && child.props.onClick(e);

            if (spec.focusOnSelect) {
              spec.focusOnSelect(childOnClickOptions);
            }
          }
        }));
      }

      if (childrenCount !== spec.slidesToShow) {
        key = childrenCount + index;

        if (key < endIndex) {
          child = elem;
        }

        slideClasses = getSlideClasses(_objectSpread({}, spec, {
          index: key
        }));
        postCloneSlides.push(_react.default.cloneElement(child, {
          key: "postcloned" + getKey(child, key),
          "data-index": key,
          tabIndex: "-1",
          className: (0, _classnames.default)(slideClasses, slideClass),
          "aria-hidden": !slideClasses["slick-active"],
          style: _objectSpread({}, child.props.style || {}, childStyle),
          onClick: function onClick(e) {
            child.props && child.props.onClick && child.props.onClick(e);

            if (spec.focusOnSelect) {
              spec.focusOnSelect(childOnClickOptions);
            }
          }
        }));
      }
    }
  });

  if (spec.rtl) {
    return preCloneSlides.concat(slides, postCloneSlides).reverse();
  } else {
    return preCloneSlides.concat(slides, postCloneSlides);
  }
};

var Track =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Track, _React$PureComponent);

  function Track() {
    _classCallCheck(this, Track);

    return _possibleConstructorReturn(this, _getPrototypeOf(Track).apply(this, arguments));
  }

  _createClass(Track, [{
    key: "render",
    value: function render() {
      var slides = renderSlides(this.props);
      var _this$props = this.props,
          onMouseEnter = _this$props.onMouseEnter,
          onMouseOver = _this$props.onMouseOver,
          onMouseLeave = _this$props.onMouseLeave;
      var mouseEvents = {
        onMouseEnter: onMouseEnter,
        onMouseOver: onMouseOver,
        onMouseLeave: onMouseLeave
      };
      return _react.default.createElement("div", _extends({
        className: "slick-track",
        style: this.props.trackStyle
      }, mouseEvents), slides);
    }
  }]);

  return Track;
}(_react.default.PureComponent);

exports.Track = Track;

/***/ }),

/***/ "./node_modules/react-slick/lib/utils/innerSliderUtils.js":
/*!****************************************************************!*\
  !*** ./node_modules/react-slick/lib/utils/innerSliderUtils.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.canUseDOM = exports.slidesOnLeft = exports.slidesOnRight = exports.siblingDirection = exports.getTotalSlides = exports.getPostClones = exports.getPreClones = exports.getTrackLeft = exports.getTrackAnimateCSS = exports.getTrackCSS = exports.checkSpecKeys = exports.getSlideCount = exports.checkNavigable = exports.getNavigableIndexes = exports.swipeEnd = exports.swipeMove = exports.swipeStart = exports.keyHandler = exports.changeSlide = exports.slideHandler = exports.initializedState = exports.extractObject = exports.canGoNext = exports.getSwipeDirection = exports.getHeight = exports.getWidth = exports.lazySlidesOnRight = exports.lazySlidesOnLeft = exports.lazyEndIndex = exports.lazyStartIndex = exports.getRequiredLazySlides = exports.getOnDemandLazySlides = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _reactDom = _interopRequireDefault(__webpack_require__(/*! react-dom */ "react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getOnDemandLazySlides = function getOnDemandLazySlides(spec) {
  var onDemandSlides = [];
  var startIndex = lazyStartIndex(spec);
  var endIndex = lazyEndIndex(spec);

  for (var slideIndex = startIndex; slideIndex < endIndex; slideIndex++) {
    if (spec.lazyLoadedList.indexOf(slideIndex) < 0) {
      onDemandSlides.push(slideIndex);
    }
  }

  return onDemandSlides;
}; // return list of slides that need to be present


exports.getOnDemandLazySlides = getOnDemandLazySlides;

var getRequiredLazySlides = function getRequiredLazySlides(spec) {
  var requiredSlides = [];
  var startIndex = lazyStartIndex(spec);
  var endIndex = lazyEndIndex(spec);

  for (var slideIndex = startIndex; slideIndex < endIndex; slideIndex++) {
    requiredSlides.push(slideIndex);
  }

  return requiredSlides;
}; // startIndex that needs to be present


exports.getRequiredLazySlides = getRequiredLazySlides;

var lazyStartIndex = function lazyStartIndex(spec) {
  return spec.currentSlide - lazySlidesOnLeft(spec);
};

exports.lazyStartIndex = lazyStartIndex;

var lazyEndIndex = function lazyEndIndex(spec) {
  return spec.currentSlide + lazySlidesOnRight(spec);
};

exports.lazyEndIndex = lazyEndIndex;

var lazySlidesOnLeft = function lazySlidesOnLeft(spec) {
  return spec.centerMode ? Math.floor(spec.slidesToShow / 2) + (parseInt(spec.centerPadding) > 0 ? 1 : 0) : 0;
};

exports.lazySlidesOnLeft = lazySlidesOnLeft;

var lazySlidesOnRight = function lazySlidesOnRight(spec) {
  return spec.centerMode ? Math.floor((spec.slidesToShow - 1) / 2) + 1 + (parseInt(spec.centerPadding) > 0 ? 1 : 0) : spec.slidesToShow;
}; // get width of an element


exports.lazySlidesOnRight = lazySlidesOnRight;

var getWidth = function getWidth(elem) {
  return elem && elem.offsetWidth || 0;
};

exports.getWidth = getWidth;

var getHeight = function getHeight(elem) {
  return elem && elem.offsetHeight || 0;
};

exports.getHeight = getHeight;

var getSwipeDirection = function getSwipeDirection(touchObject) {
  var verticalSwiping = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var xDist, yDist, r, swipeAngle;
  xDist = touchObject.startX - touchObject.curX;
  yDist = touchObject.startY - touchObject.curY;
  r = Math.atan2(yDist, xDist);
  swipeAngle = Math.round(r * 180 / Math.PI);

  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle);
  }

  if (swipeAngle <= 45 && swipeAngle >= 0 || swipeAngle <= 360 && swipeAngle >= 315) {
    return "left";
  }

  if (swipeAngle >= 135 && swipeAngle <= 225) {
    return "right";
  }

  if (verticalSwiping === true) {
    if (swipeAngle >= 35 && swipeAngle <= 135) {
      return "up";
    } else {
      return "down";
    }
  }

  return "vertical";
}; // whether or not we can go next


exports.getSwipeDirection = getSwipeDirection;

var canGoNext = function canGoNext(spec) {
  var canGo = true;

  if (!spec.infinite) {
    if (spec.centerMode && spec.currentSlide >= spec.slideCount - 1) {
      canGo = false;
    } else if (spec.slideCount <= spec.slidesToShow || spec.currentSlide >= spec.slideCount - spec.slidesToShow) {
      canGo = false;
    }
  }

  return canGo;
}; // given an object and a list of keys, return new object with given keys


exports.canGoNext = canGoNext;

var extractObject = function extractObject(spec, keys) {
  var newObject = {};
  keys.forEach(function (key) {
    return newObject[key] = spec[key];
  });
  return newObject;
}; // get initialized state


exports.extractObject = extractObject;

var initializedState = function initializedState(spec) {
  // spec also contains listRef, trackRef
  var slideCount = _react.default.Children.count(spec.children);

  var listWidth = Math.ceil(getWidth(_reactDom.default.findDOMNode(spec.listRef)));
  var trackWidth = Math.ceil(getWidth(_reactDom.default.findDOMNode(spec.trackRef)));
  var slideWidth;

  if (!spec.vertical) {
    var centerPaddingAdj = spec.centerMode && parseInt(spec.centerPadding) * 2;

    if (typeof spec.centerPadding === "string" && spec.centerPadding.slice(-1) === "%") {
      centerPaddingAdj *= listWidth / 100;
    }

    slideWidth = Math.ceil((listWidth - centerPaddingAdj) / spec.slidesToShow);
  } else {
    slideWidth = listWidth;
  }

  var slideHeight = _reactDom.default.findDOMNode(spec.listRef) && getHeight(_reactDom.default.findDOMNode(spec.listRef).querySelector('[data-index="0"]'));
  var listHeight = slideHeight * spec.slidesToShow;
  var currentSlide = spec.currentSlide === undefined ? spec.initialSlide : spec.currentSlide;

  if (spec.rtl && spec.currentSlide === undefined) {
    currentSlide = slideCount - 1 - spec.initialSlide;
  }

  var lazyLoadedList = spec.lazyLoadedList || [];
  var slidesToLoad = getOnDemandLazySlides({
    currentSlide: currentSlide,
    lazyLoadedList: lazyLoadedList
  }, spec);
  lazyLoadedList.concat(slidesToLoad);
  var state = {
    slideCount: slideCount,
    slideWidth: slideWidth,
    listWidth: listWidth,
    trackWidth: trackWidth,
    currentSlide: currentSlide,
    slideHeight: slideHeight,
    listHeight: listHeight,
    lazyLoadedList: lazyLoadedList
  };

  if (spec.autoplaying === null && spec.autoplay) {
    state["autoplaying"] = "playing";
  }

  return state;
};

exports.initializedState = initializedState;

var slideHandler = function slideHandler(spec) {
  var waitForAnimate = spec.waitForAnimate,
      animating = spec.animating,
      fade = spec.fade,
      infinite = spec.infinite,
      index = spec.index,
      slideCount = spec.slideCount,
      lazyLoadedList = spec.lazyLoadedList,
      lazyLoad = spec.lazyLoad,
      currentSlide = spec.currentSlide,
      centerMode = spec.centerMode,
      slidesToScroll = spec.slidesToScroll,
      slidesToShow = spec.slidesToShow,
      useCSS = spec.useCSS;
  if (waitForAnimate && animating) return {};
  var animationSlide = index,
      finalSlide,
      animationLeft,
      finalLeft;
  var state = {},
      nextState = {};

  if (fade) {
    if (!infinite && (index < 0 || index >= slideCount)) return {};

    if (index < 0) {
      animationSlide = index + slideCount;
    } else if (index >= slideCount) {
      animationSlide = index - slideCount;
    }

    if (lazyLoad && lazyLoadedList.indexOf(animationSlide) < 0) {
      lazyLoadedList.push(animationSlide);
    }

    state = {
      animating: true,
      currentSlide: animationSlide,
      lazyLoadedList: lazyLoadedList
    };
    nextState = {
      animating: false
    };
  } else {
    finalSlide = animationSlide;

    if (animationSlide < 0) {
      finalSlide = animationSlide + slideCount;
      if (!infinite) finalSlide = 0;else if (slideCount % slidesToScroll !== 0) finalSlide = slideCount - slideCount % slidesToScroll;
    } else if (!canGoNext(spec) && animationSlide > currentSlide) {
      animationSlide = finalSlide = currentSlide;
    } else if (centerMode && animationSlide >= slideCount) {
      animationSlide = infinite ? slideCount : slideCount - 1;
      finalSlide = infinite ? 0 : slideCount - 1;
    } else if (animationSlide >= slideCount) {
      finalSlide = animationSlide - slideCount;
      if (!infinite) finalSlide = slideCount - slidesToShow;else if (slideCount % slidesToScroll !== 0) finalSlide = 0;
    }

    animationLeft = getTrackLeft(_objectSpread({}, spec, {
      slideIndex: animationSlide
    }));
    finalLeft = getTrackLeft(_objectSpread({}, spec, {
      slideIndex: finalSlide
    }));

    if (!infinite) {
      if (animationLeft === finalLeft) animationSlide = finalSlide;
      animationLeft = finalLeft;
    }

    lazyLoad && lazyLoadedList.concat(getOnDemandLazySlides(_objectSpread({}, spec, {
      currentSlide: animationSlide
    })));

    if (!useCSS) {
      state = {
        currentSlide: finalSlide,
        trackStyle: getTrackCSS(_objectSpread({}, spec, {
          left: finalLeft
        })),
        lazyLoadedList: lazyLoadedList
      };
    } else {
      state = {
        animating: true,
        currentSlide: finalSlide,
        trackStyle: getTrackAnimateCSS(_objectSpread({}, spec, {
          left: animationLeft
        })),
        lazyLoadedList: lazyLoadedList
      };
      nextState = {
        animating: false,
        currentSlide: finalSlide,
        trackStyle: getTrackCSS(_objectSpread({}, spec, {
          left: finalLeft
        })),
        swipeLeft: null
      };
    }
  }

  return {
    state: state,
    nextState: nextState
  };
};

exports.slideHandler = slideHandler;

var changeSlide = function changeSlide(spec, options) {
  var indexOffset, previousInt, slideOffset, unevenOffset, targetSlide;
  var slidesToScroll = spec.slidesToScroll,
      slidesToShow = spec.slidesToShow,
      slideCount = spec.slideCount,
      currentSlide = spec.currentSlide,
      lazyLoad = spec.lazyLoad,
      infinite = spec.infinite;
  unevenOffset = slideCount % slidesToScroll !== 0;
  indexOffset = unevenOffset ? 0 : (slideCount - currentSlide) % slidesToScroll;

  if (options.message === "previous") {
    slideOffset = indexOffset === 0 ? slidesToScroll : slidesToShow - indexOffset;
    targetSlide = currentSlide - slideOffset;

    if (lazyLoad && !infinite) {
      previousInt = currentSlide - slideOffset;
      targetSlide = previousInt === -1 ? slideCount - 1 : previousInt;
    }
  } else if (options.message === "next") {
    slideOffset = indexOffset === 0 ? slidesToScroll : indexOffset;
    targetSlide = currentSlide + slideOffset;

    if (lazyLoad && !infinite) {
      targetSlide = (currentSlide + slidesToScroll) % slideCount + indexOffset;
    }
  } else if (options.message === "dots") {
    // Click on dots
    targetSlide = options.index * options.slidesToScroll;

    if (targetSlide === options.currentSlide) {
      return null;
    }
  } else if (options.message === "children") {
    // Click on the slides
    targetSlide = options.index;

    if (targetSlide === options.currentSlide) {
      return null;
    }

    if (infinite) {
      var direction = siblingDirection(_objectSpread({}, spec, {
        targetSlide: targetSlide
      }));

      if (targetSlide > options.currentSlide && direction === "left") {
        targetSlide = targetSlide - slideCount;
      } else if (targetSlide < options.currentSlide && direction === "right") {
        targetSlide = targetSlide + slideCount;
      }
    }
  } else if (options.message === "index") {
    targetSlide = Number(options.index);

    if (targetSlide === options.currentSlide) {
      return null;
    }
  }

  return targetSlide;
};

exports.changeSlide = changeSlide;

var keyHandler = function keyHandler(e, accessibility, rtl) {
  if (e.target.tagName.match("TEXTAREA|INPUT|SELECT") || !accessibility) return "";
  if (e.keyCode === 37) return rtl ? "next" : "previous";
  if (e.keyCode === 39) return rtl ? "previous" : "next";
  return "";
};

exports.keyHandler = keyHandler;

var swipeStart = function swipeStart(e, swipe, draggable) {
  e.target.tagName === "IMG" && e.preventDefault();
  if (!swipe || !draggable && e.type.indexOf("mouse") !== -1) return "";
  return {
    dragging: true,
    touchObject: {
      startX: e.touches ? e.touches[0].pageX : e.clientX,
      startY: e.touches ? e.touches[0].pageY : e.clientY,
      curX: e.touches ? e.touches[0].pageX : e.clientX,
      curY: e.touches ? e.touches[0].pageY : e.clientY
    }
  };
};

exports.swipeStart = swipeStart;

var swipeMove = function swipeMove(e, spec) {
  // spec also contains, trackRef and slideIndex
  var scrolling = spec.scrolling,
      animating = spec.animating,
      vertical = spec.vertical,
      swipeToSlide = spec.swipeToSlide,
      verticalSwiping = spec.verticalSwiping,
      rtl = spec.rtl,
      currentSlide = spec.currentSlide,
      edgeFriction = spec.edgeFriction,
      edgeDragged = spec.edgeDragged,
      onEdge = spec.onEdge,
      swiped = spec.swiped,
      swiping = spec.swiping,
      slideCount = spec.slideCount,
      slidesToScroll = spec.slidesToScroll,
      infinite = spec.infinite,
      touchObject = spec.touchObject,
      swipeEvent = spec.swipeEvent,
      listHeight = spec.listHeight,
      listWidth = spec.listWidth;
  if (scrolling) return;
  if (animating) return e.preventDefault();
  if (vertical && swipeToSlide && verticalSwiping) e.preventDefault();
  var swipeLeft,
      state = {};
  var curLeft = getTrackLeft(spec);
  touchObject.curX = e.touches ? e.touches[0].pageX : e.clientX;
  touchObject.curY = e.touches ? e.touches[0].pageY : e.clientY;
  touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(touchObject.curX - touchObject.startX, 2)));
  var verticalSwipeLength = Math.round(Math.sqrt(Math.pow(touchObject.curY - touchObject.startY, 2)));

  if (!verticalSwiping && !swiping && verticalSwipeLength > 10) {
    return {
      scrolling: true
    };
  }

  if (verticalSwiping) touchObject.swipeLength = verticalSwipeLength;
  var positionOffset = (!rtl ? 1 : -1) * (touchObject.curX > touchObject.startX ? 1 : -1);
  if (verticalSwiping) positionOffset = touchObject.curY > touchObject.startY ? 1 : -1;
  var dotCount = Math.ceil(slideCount / slidesToScroll);
  var swipeDirection = getSwipeDirection(spec.touchObject, verticalSwiping);
  var touchSwipeLength = touchObject.swipeLength;

  if (!infinite) {
    if (currentSlide === 0 && swipeDirection === "right" || currentSlide + 1 >= dotCount && swipeDirection === "left" || !canGoNext(spec) && swipeDirection === "left") {
      touchSwipeLength = touchObject.swipeLength * edgeFriction;

      if (edgeDragged === false && onEdge) {
        onEdge(swipeDirection);
        state["edgeDragged"] = true;
      }
    }
  }

  if (!swiped && swipeEvent) {
    swipeEvent(swipeDirection);
    state["swiped"] = true;
  }

  if (!vertical) {
    if (!rtl) {
      swipeLeft = curLeft + touchSwipeLength * positionOffset;
    } else {
      swipeLeft = curLeft - touchSwipeLength * positionOffset;
    }
  } else {
    swipeLeft = curLeft + touchSwipeLength * (listHeight / listWidth) * positionOffset;
  }

  if (verticalSwiping) {
    swipeLeft = curLeft + touchSwipeLength * positionOffset;
  }

  state = _objectSpread({}, state, {
    touchObject: touchObject,
    swipeLeft: swipeLeft,
    trackStyle: getTrackCSS(_objectSpread({}, spec, {
      left: swipeLeft
    }))
  });

  if (Math.abs(touchObject.curX - touchObject.startX) < Math.abs(touchObject.curY - touchObject.startY) * 0.8) {
    return state;
  }

  if (touchObject.swipeLength > 10) {
    state["swiping"] = true;
    e.preventDefault();
  }

  return state;
};

exports.swipeMove = swipeMove;

var swipeEnd = function swipeEnd(e, spec) {
  var dragging = spec.dragging,
      swipe = spec.swipe,
      touchObject = spec.touchObject,
      listWidth = spec.listWidth,
      touchThreshold = spec.touchThreshold,
      verticalSwiping = spec.verticalSwiping,
      listHeight = spec.listHeight,
      currentSlide = spec.currentSlide,
      swipeToSlide = spec.swipeToSlide,
      scrolling = spec.scrolling,
      onSwipe = spec.onSwipe;

  if (!dragging) {
    if (swipe) e.preventDefault();
    return {};
  }

  var minSwipe = verticalSwiping ? listHeight / touchThreshold : listWidth / touchThreshold;
  var swipeDirection = getSwipeDirection(touchObject, verticalSwiping); // reset the state of touch related state variables.

  var state = {
    dragging: false,
    edgeDragged: false,
    scrolling: false,
    swiping: false,
    swiped: false,
    swipeLeft: null,
    touchObject: {}
  };

  if (scrolling) {
    return state;
  }

  if (!touchObject.swipeLength) {
    return state;
  }

  if (touchObject.swipeLength > minSwipe) {
    e.preventDefault();

    if (onSwipe) {
      onSwipe(swipeDirection);
    }

    var slideCount, newSlide;

    switch (swipeDirection) {
      case "left":
      case "up":
        newSlide = currentSlide + getSlideCount(spec);
        slideCount = swipeToSlide ? checkNavigable(spec, newSlide) : newSlide;
        state["currentDirection"] = 0;
        break;

      case "right":
      case "down":
        newSlide = currentSlide - getSlideCount(spec);
        slideCount = swipeToSlide ? checkNavigable(spec, newSlide) : newSlide;
        state["currentDirection"] = 1;
        break;

      default:
        slideCount = currentSlide;
    }

    state["triggerSlideHandler"] = slideCount;
  } else {
    // Adjust the track back to it's original position.
    var currentLeft = getTrackLeft(spec);
    state["trackStyle"] = getTrackAnimateCSS(_objectSpread({}, spec, {
      left: currentLeft
    }));
  }

  return state;
};

exports.swipeEnd = swipeEnd;

var getNavigableIndexes = function getNavigableIndexes(spec) {
  var max = spec.infinite ? spec.slideCount * 2 : spec.slideCount;
  var breakpoint = spec.infinite ? spec.slidesToShow * -1 : 0;
  var counter = spec.infinite ? spec.slidesToShow * -1 : 0;
  var indexes = [];

  while (breakpoint < max) {
    indexes.push(breakpoint);
    breakpoint = counter + spec.slidesToScroll;
    counter += Math.min(spec.slidesToScroll, spec.slidesToShow);
  }

  return indexes;
};

exports.getNavigableIndexes = getNavigableIndexes;

var checkNavigable = function checkNavigable(spec, index) {
  var navigables = getNavigableIndexes(spec);
  var prevNavigable = 0;

  if (index > navigables[navigables.length - 1]) {
    index = navigables[navigables.length - 1];
  } else {
    for (var n in navigables) {
      if (index < navigables[n]) {
        index = prevNavigable;
        break;
      }

      prevNavigable = navigables[n];
    }
  }

  return index;
};

exports.checkNavigable = checkNavigable;

var getSlideCount = function getSlideCount(spec) {
  var centerOffset = spec.centerMode ? spec.slideWidth * Math.floor(spec.slidesToShow / 2) : 0;

  if (spec.swipeToSlide) {
    var swipedSlide;

    var slickList = _reactDom.default.findDOMNode(spec.listRef);

    var slides = slickList.querySelectorAll(".slick-slide");
    Array.from(slides).every(function (slide) {
      if (!spec.vertical) {
        if (slide.offsetLeft - centerOffset + getWidth(slide) / 2 > spec.swipeLeft * -1) {
          swipedSlide = slide;
          return false;
        }
      } else {
        if (slide.offsetTop + getHeight(slide) / 2 > spec.swipeLeft * -1) {
          swipedSlide = slide;
          return false;
        }
      }

      return true;
    });

    if (!swipedSlide) {
      return 0;
    }

    var currentIndex = spec.rtl === true ? spec.slideCount - spec.currentSlide : spec.currentSlide;
    var slidesTraversed = Math.abs(swipedSlide.dataset.index - currentIndex) || 1;
    return slidesTraversed;
  } else {
    return spec.slidesToScroll;
  }
};

exports.getSlideCount = getSlideCount;

var checkSpecKeys = function checkSpecKeys(spec, keysArray) {
  return keysArray.reduce(function (value, key) {
    return value && spec.hasOwnProperty(key);
  }, true) ? null : console.error("Keys Missing:", spec);
};

exports.checkSpecKeys = checkSpecKeys;

var getTrackCSS = function getTrackCSS(spec) {
  checkSpecKeys(spec, ["left", "variableWidth", "slideCount", "slidesToShow", "slideWidth"]);
  var trackWidth, trackHeight;
  var trackChildren = spec.slideCount + 2 * spec.slidesToShow;

  if (!spec.vertical) {
    trackWidth = getTotalSlides(spec) * spec.slideWidth;
  } else {
    trackHeight = trackChildren * spec.slideHeight;
  }

  var style = {
    opacity: 1,
    transition: "",
    WebkitTransition: ""
  };

  if (spec.useTransform) {
    var WebkitTransform = !spec.vertical ? "translate3d(" + spec.left + "px, 0px, 0px)" : "translate3d(0px, " + spec.left + "px, 0px)";
    var transform = !spec.vertical ? "translate3d(" + spec.left + "px, 0px, 0px)" : "translate3d(0px, " + spec.left + "px, 0px)";
    var msTransform = !spec.vertical ? "translateX(" + spec.left + "px)" : "translateY(" + spec.left + "px)";
    style = _objectSpread({}, style, {
      WebkitTransform: WebkitTransform,
      transform: transform,
      msTransform: msTransform
    });
  } else {
    if (spec.vertical) {
      style["top"] = spec.left;
    } else {
      style["left"] = spec.left;
    }
  }

  if (spec.fade) style = {
    opacity: 1
  };
  if (trackWidth) style.width = trackWidth;
  if (trackHeight) style.height = trackHeight; // Fallback for IE8

  if (window && !window.addEventListener && window.attachEvent) {
    if (!spec.vertical) {
      style.marginLeft = spec.left + "px";
    } else {
      style.marginTop = spec.left + "px";
    }
  }

  return style;
};

exports.getTrackCSS = getTrackCSS;

var getTrackAnimateCSS = function getTrackAnimateCSS(spec) {
  checkSpecKeys(spec, ["left", "variableWidth", "slideCount", "slidesToShow", "slideWidth", "speed", "cssEase"]);
  var style = getTrackCSS(spec); // useCSS is true by default so it can be undefined

  if (spec.useTransform) {
    style.WebkitTransition = "-webkit-transform " + spec.speed + "ms " + spec.cssEase;
    style.transition = "transform " + spec.speed + "ms " + spec.cssEase;
  } else {
    if (spec.vertical) {
      style.transition = "top " + spec.speed + "ms " + spec.cssEase;
    } else {
      style.transition = "left " + spec.speed + "ms " + spec.cssEase;
    }
  }

  return style;
};

exports.getTrackAnimateCSS = getTrackAnimateCSS;

var getTrackLeft = function getTrackLeft(spec) {
  if (spec.unslick) {
    return 0;
  }

  checkSpecKeys(spec, ["slideIndex", "trackRef", "infinite", "centerMode", "slideCount", "slidesToShow", "slidesToScroll", "slideWidth", "listWidth", "variableWidth", "slideHeight"]);
  var slideIndex = spec.slideIndex,
      trackRef = spec.trackRef,
      infinite = spec.infinite,
      centerMode = spec.centerMode,
      slideCount = spec.slideCount,
      slidesToShow = spec.slidesToShow,
      slidesToScroll = spec.slidesToScroll,
      slideWidth = spec.slideWidth,
      listWidth = spec.listWidth,
      variableWidth = spec.variableWidth,
      slideHeight = spec.slideHeight,
      fade = spec.fade,
      vertical = spec.vertical;
  var slideOffset = 0;
  var targetLeft;
  var targetSlide;
  var verticalOffset = 0;

  if (fade || spec.slideCount === 1) {
    return 0;
  }

  var slidesToOffset = 0;

  if (infinite) {
    slidesToOffset = -getPreClones(spec); // bring active slide to the beginning of visual area
    // if next scroll doesn't have enough children, just reach till the end of original slides instead of shifting slidesToScroll children

    if (slideCount % slidesToScroll !== 0 && slideIndex + slidesToScroll > slideCount) {
      slidesToOffset = -(slideIndex > slideCount ? slidesToShow - (slideIndex - slideCount) : slideCount % slidesToScroll);
    } // shift current slide to center of the frame


    if (centerMode) {
      slidesToOffset += parseInt(slidesToShow / 2);
    }
  } else {
    if (slideCount % slidesToScroll !== 0 && slideIndex + slidesToScroll > slideCount) {
      slidesToOffset = slidesToShow - slideCount % slidesToScroll;
    }

    if (centerMode) {
      slidesToOffset = parseInt(slidesToShow / 2);
    }
  }

  slideOffset = slidesToOffset * slideWidth;
  verticalOffset = slidesToOffset * slideHeight;

  if (!vertical) {
    targetLeft = slideIndex * slideWidth * -1 + slideOffset;
  } else {
    targetLeft = slideIndex * slideHeight * -1 + verticalOffset;
  }

  if (variableWidth === true) {
    var targetSlideIndex;

    var trackElem = _reactDom.default.findDOMNode(trackRef);

    targetSlideIndex = slideIndex + getPreClones(spec);
    targetSlide = trackElem && trackElem.childNodes[targetSlideIndex];
    targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;

    if (centerMode === true) {
      targetSlideIndex = infinite ? slideIndex + getPreClones(spec) : slideIndex;
      targetSlide = trackElem && trackElem.children[targetSlideIndex];
      targetLeft = 0;

      for (var slide = 0; slide < targetSlideIndex; slide++) {
        targetLeft -= trackElem && trackElem.children[slide] && trackElem.children[slide].offsetWidth;
      }

      targetLeft -= parseInt(spec.centerPadding);
      targetLeft += targetSlide && (listWidth - targetSlide.offsetWidth) / 2;
    }
  }

  return targetLeft;
};

exports.getTrackLeft = getTrackLeft;

var getPreClones = function getPreClones(spec) {
  if (spec.unslick || !spec.infinite) {
    return 0;
  }

  if (spec.variableWidth) {
    return spec.slideCount;
  }

  return spec.slidesToShow + (spec.centerMode ? 1 : 0);
};

exports.getPreClones = getPreClones;

var getPostClones = function getPostClones(spec) {
  if (spec.unslick || !spec.infinite) {
    return 0;
  }

  return spec.slideCount;
};

exports.getPostClones = getPostClones;

var getTotalSlides = function getTotalSlides(spec) {
  return spec.slideCount === 1 ? 1 : getPreClones(spec) + spec.slideCount + getPostClones(spec);
};

exports.getTotalSlides = getTotalSlides;

var siblingDirection = function siblingDirection(spec) {
  if (spec.targetSlide > spec.currentSlide) {
    if (spec.targetSlide > spec.currentSlide + slidesOnRight(spec)) {
      return "left";
    }

    return "right";
  } else {
    if (spec.targetSlide < spec.currentSlide - slidesOnLeft(spec)) {
      return "right";
    }

    return "left";
  }
};

exports.siblingDirection = siblingDirection;

var slidesOnRight = function slidesOnRight(_ref) {
  var slidesToShow = _ref.slidesToShow,
      centerMode = _ref.centerMode,
      rtl = _ref.rtl,
      centerPadding = _ref.centerPadding;

  // returns no of slides on the right of active slide
  if (centerMode) {
    var right = (slidesToShow - 1) / 2 + 1;
    if (parseInt(centerPadding) > 0) right += 1;
    if (rtl && slidesToShow % 2 === 0) right += 1;
    return right;
  }

  if (rtl) {
    return 0;
  }

  return slidesToShow - 1;
};

exports.slidesOnRight = slidesOnRight;

var slidesOnLeft = function slidesOnLeft(_ref2) {
  var slidesToShow = _ref2.slidesToShow,
      centerMode = _ref2.centerMode,
      rtl = _ref2.rtl,
      centerPadding = _ref2.centerPadding;

  // returns no of slides on the left of active slide
  if (centerMode) {
    var left = (slidesToShow - 1) / 2 + 1;
    if (parseInt(centerPadding) > 0) left += 1;
    if (!rtl && slidesToShow % 2 === 0) left += 1;
    return left;
  }

  if (rtl) {
    return slidesToShow - 1;
  }

  return 0;
};

exports.slidesOnLeft = slidesOnLeft;

var canUseDOM = function canUseDOM() {
  return !!(typeof window !== "undefined" && window.document && window.document.createElement);
};

exports.canUseDOM = canUseDOM;

/***/ }),

/***/ "./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js":
/*!*************************************************************************!*\
  !*** ./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = (function () {
    if (typeof Map !== 'undefined') {
        return Map;
    }
    /**
     * Returns index in provided array that matches the specified key.
     *
     * @param {Array<Array>} arr
     * @param {*} key
     * @returns {number}
     */
    function getIndex(arr, key) {
        var result = -1;
        arr.some(function (entry, index) {
            if (entry[0] === key) {
                result = index;
                return true;
            }
            return false;
        });
        return result;
    }
    return /** @class */ (function () {
        function class_1() {
            this.__entries__ = [];
        }
        Object.defineProperty(class_1.prototype, "size", {
            /**
             * @returns {boolean}
             */
            get: function () {
                return this.__entries__.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {*} key
         * @returns {*}
         */
        class_1.prototype.get = function (key) {
            var index = getIndex(this.__entries__, key);
            var entry = this.__entries__[index];
            return entry && entry[1];
        };
        /**
         * @param {*} key
         * @param {*} value
         * @returns {void}
         */
        class_1.prototype.set = function (key, value) {
            var index = getIndex(this.__entries__, key);
            if (~index) {
                this.__entries__[index][1] = value;
            }
            else {
                this.__entries__.push([key, value]);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.delete = function (key) {
            var entries = this.__entries__;
            var index = getIndex(entries, key);
            if (~index) {
                entries.splice(index, 1);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.has = function (key) {
            return !!~getIndex(this.__entries__, key);
        };
        /**
         * @returns {void}
         */
        class_1.prototype.clear = function () {
            this.__entries__.splice(0);
        };
        /**
         * @param {Function} callback
         * @param {*} [ctx=null]
         * @returns {void}
         */
        class_1.prototype.forEach = function (callback, ctx) {
            if (ctx === void 0) { ctx = null; }
            for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                var entry = _a[_i];
                callback.call(ctx, entry[1], entry[0]);
            }
        };
        return class_1;
    }());
})();

/**
 * Detects whether window and document objects are available in current environment.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

// Returns global object of a current environment.
var global$1 = (function () {
    if (typeof __webpack_require__.g !== 'undefined' && __webpack_require__.g.Math === Math) {
        return __webpack_require__.g;
    }
    if (typeof self !== 'undefined' && self.Math === Math) {
        return self;
    }
    if (typeof window !== 'undefined' && window.Math === Math) {
        return window;
    }
    // eslint-disable-next-line no-new-func
    return Function('return this')();
})();

/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
var requestAnimationFrame$1 = (function () {
    if (typeof requestAnimationFrame === 'function') {
        // It's required to use a bounded function because IE sometimes throws
        // an "Invalid calling object" error if rAF is invoked without the global
        // object on the left hand side.
        return requestAnimationFrame.bind(global$1);
    }
    return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
})();

// Defines minimum timeout before adding a trailing call.
var trailingTimeout = 2;
/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */
function throttle (callback, delay) {
    var leadingCall = false, trailingCall = false, lastCallTime = 0;
    /**
     * Invokes the original callback function and schedules new invocation if
     * the "proxy" was called during current request.
     *
     * @returns {void}
     */
    function resolvePending() {
        if (leadingCall) {
            leadingCall = false;
            callback();
        }
        if (trailingCall) {
            proxy();
        }
    }
    /**
     * Callback invoked after the specified delay. It will further postpone
     * invocation of the original function delegating it to the
     * requestAnimationFrame.
     *
     * @returns {void}
     */
    function timeoutCallback() {
        requestAnimationFrame$1(resolvePending);
    }
    /**
     * Schedules invocation of the original function.
     *
     * @returns {void}
     */
    function proxy() {
        var timeStamp = Date.now();
        if (leadingCall) {
            // Reject immediately following calls.
            if (timeStamp - lastCallTime < trailingTimeout) {
                return;
            }
            // Schedule new call to be in invoked when the pending one is resolved.
            // This is important for "transitions" which never actually start
            // immediately so there is a chance that we might miss one if change
            // happens amids the pending invocation.
            trailingCall = true;
        }
        else {
            leadingCall = true;
            trailingCall = false;
            setTimeout(timeoutCallback, delay);
        }
        lastCallTime = timeStamp;
    }
    return proxy;
}

// Minimum delay before invoking the update of observers.
var REFRESH_DELAY = 20;
// A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.
var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
// Check if MutationObserver is available.
var mutationObserverSupported = typeof MutationObserver !== 'undefined';
/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */
var ResizeObserverController = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserverController.
     *
     * @private
     */
    function ResizeObserverController() {
        /**
         * Indicates whether DOM listeners have been added.
         *
         * @private {boolean}
         */
        this.connected_ = false;
        /**
         * Tells that controller has subscribed for Mutation Events.
         *
         * @private {boolean}
         */
        this.mutationEventsAdded_ = false;
        /**
         * Keeps reference to the instance of MutationObserver.
         *
         * @private {MutationObserver}
         */
        this.mutationsObserver_ = null;
        /**
         * A list of connected observers.
         *
         * @private {Array<ResizeObserverSPI>}
         */
        this.observers_ = [];
        this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
        this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
    }
    /**
     * Adds observer to observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be added.
     * @returns {void}
     */
    ResizeObserverController.prototype.addObserver = function (observer) {
        if (!~this.observers_.indexOf(observer)) {
            this.observers_.push(observer);
        }
        // Add listeners if they haven't been added yet.
        if (!this.connected_) {
            this.connect_();
        }
    };
    /**
     * Removes observer from observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be removed.
     * @returns {void}
     */
    ResizeObserverController.prototype.removeObserver = function (observer) {
        var observers = this.observers_;
        var index = observers.indexOf(observer);
        // Remove observer if it's present in registry.
        if (~index) {
            observers.splice(index, 1);
        }
        // Remove listeners if controller has no connected observers.
        if (!observers.length && this.connected_) {
            this.disconnect_();
        }
    };
    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes.
     *
     * @returns {void}
     */
    ResizeObserverController.prototype.refresh = function () {
        var changesDetected = this.updateObservers_();
        // Continue running updates if changes have been detected as there might
        // be future ones caused by CSS transitions.
        if (changesDetected) {
            this.refresh();
        }
    };
    /**
     * Updates every observer from observers list and notifies them of queued
     * entries.
     *
     * @private
     * @returns {boolean} Returns "true" if any observer has detected changes in
     *      dimensions of it's elements.
     */
    ResizeObserverController.prototype.updateObservers_ = function () {
        // Collect observers that have active observations.
        var activeObservers = this.observers_.filter(function (observer) {
            return observer.gatherActive(), observer.hasActive();
        });
        // Deliver notifications in a separate cycle in order to avoid any
        // collisions between observers, e.g. when multiple instances of
        // ResizeObserver are tracking the same element and the callback of one
        // of them changes content dimensions of the observed target. Sometimes
        // this may result in notifications being blocked for the rest of observers.
        activeObservers.forEach(function (observer) { return observer.broadcastActive(); });
        return activeObservers.length > 0;
    };
    /**
     * Initializes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.connect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already added.
        if (!isBrowser || this.connected_) {
            return;
        }
        // Subscription to the "Transitionend" event is used as a workaround for
        // delayed transitions. This way it's possible to capture at least the
        // final state of an element.
        document.addEventListener('transitionend', this.onTransitionEnd_);
        window.addEventListener('resize', this.refresh);
        if (mutationObserverSupported) {
            this.mutationsObserver_ = new MutationObserver(this.refresh);
            this.mutationsObserver_.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        else {
            document.addEventListener('DOMSubtreeModified', this.refresh);
            this.mutationEventsAdded_ = true;
        }
        this.connected_ = true;
    };
    /**
     * Removes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.disconnect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already removed.
        if (!isBrowser || !this.connected_) {
            return;
        }
        document.removeEventListener('transitionend', this.onTransitionEnd_);
        window.removeEventListener('resize', this.refresh);
        if (this.mutationsObserver_) {
            this.mutationsObserver_.disconnect();
        }
        if (this.mutationEventsAdded_) {
            document.removeEventListener('DOMSubtreeModified', this.refresh);
        }
        this.mutationsObserver_ = null;
        this.mutationEventsAdded_ = false;
        this.connected_ = false;
    };
    /**
     * "Transitionend" event handler.
     *
     * @private
     * @param {TransitionEvent} event
     * @returns {void}
     */
    ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
        var _b = _a.propertyName, propertyName = _b === void 0 ? '' : _b;
        // Detect whether transition may affect dimensions of an element.
        var isReflowProperty = transitionKeys.some(function (key) {
            return !!~propertyName.indexOf(key);
        });
        if (isReflowProperty) {
            this.refresh();
        }
    };
    /**
     * Returns instance of the ResizeObserverController.
     *
     * @returns {ResizeObserverController}
     */
    ResizeObserverController.getInstance = function () {
        if (!this.instance_) {
            this.instance_ = new ResizeObserverController();
        }
        return this.instance_;
    };
    /**
     * Holds reference to the controller's instance.
     *
     * @private {ResizeObserverController}
     */
    ResizeObserverController.instance_ = null;
    return ResizeObserverController;
}());

/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */
var defineConfigurable = (function (target, props) {
    for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
        var key = _a[_i];
        Object.defineProperty(target, key, {
            value: props[key],
            enumerable: false,
            writable: false,
            configurable: true
        });
    }
    return target;
});

/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */
var getWindowOf = (function (target) {
    // Assume that the element is an instance of Node, which means that it
    // has the "ownerDocument" property from which we can retrieve a
    // corresponding global object.
    var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
    // Return the local global object if it's not possible extract one from
    // provided element.
    return ownerGlobal || global$1;
});

// Placeholder of an empty content rectangle.
var emptyRect = createRectInit(0, 0, 0, 0);
/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */
function toFloat(value) {
    return parseFloat(value) || 0;
}
/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */
function getBordersSize(styles) {
    var positions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        positions[_i - 1] = arguments[_i];
    }
    return positions.reduce(function (size, position) {
        var value = styles['border-' + position + '-width'];
        return size + toFloat(value);
    }, 0);
}
/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */
function getPaddings(styles) {
    var positions = ['top', 'right', 'bottom', 'left'];
    var paddings = {};
    for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
        var position = positions_1[_i];
        var value = styles['padding-' + position];
        paddings[position] = toFloat(value);
    }
    return paddings;
}
/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */
function getSVGContentRect(target) {
    var bbox = target.getBBox();
    return createRectInit(0, 0, bbox.width, bbox.height);
}
/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */
function getHTMLElementContentRect(target) {
    // Client width & height properties can't be
    // used exclusively as they provide rounded values.
    var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
    // By this condition we can catch all non-replaced inline, hidden and
    // detached elements. Though elements with width & height properties less
    // than 0.5 will be discarded as well.
    //
    // Without it we would need to implement separate methods for each of
    // those cases and it's not possible to perform a precise and performance
    // effective test for hidden elements. E.g. even jQuery's ':visible' filter
    // gives wrong results for elements with width & height less than 0.5.
    if (!clientWidth && !clientHeight) {
        return emptyRect;
    }
    var styles = getWindowOf(target).getComputedStyle(target);
    var paddings = getPaddings(styles);
    var horizPad = paddings.left + paddings.right;
    var vertPad = paddings.top + paddings.bottom;
    // Computed styles of width & height are being used because they are the
    // only dimensions available to JS that contain non-rounded values. It could
    // be possible to utilize the getBoundingClientRect if only it's data wasn't
    // affected by CSS transformations let alone paddings, borders and scroll bars.
    var width = toFloat(styles.width), height = toFloat(styles.height);
    // Width & height include paddings and borders when the 'border-box' box
    // model is applied (except for IE).
    if (styles.boxSizing === 'border-box') {
        // Following conditions are required to handle Internet Explorer which
        // doesn't include paddings and borders to computed CSS dimensions.
        //
        // We can say that if CSS dimensions + paddings are equal to the "client"
        // properties then it's either IE, and thus we don't need to subtract
        // anything, or an element merely doesn't have paddings/borders styles.
        if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, 'left', 'right') + horizPad;
        }
        if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
        }
    }
    // Following steps can't be applied to the document's root element as its
    // client[Width/Height] properties represent viewport area of the window.
    // Besides, it's as well not necessary as the <html> itself neither has
    // rendered scroll bars nor it can be clipped.
    if (!isDocumentElement(target)) {
        // In some browsers (only in Firefox, actually) CSS width & height
        // include scroll bars size which can be removed at this step as scroll
        // bars are the only difference between rounded dimensions + paddings
        // and "client" properties, though that is not always true in Chrome.
        var vertScrollbar = Math.round(width + horizPad) - clientWidth;
        var horizScrollbar = Math.round(height + vertPad) - clientHeight;
        // Chrome has a rather weird rounding of "client" properties.
        // E.g. for an element with content width of 314.2px it sometimes gives
        // the client width of 315px and for the width of 314.7px it may give
        // 314px. And it doesn't happen all the time. So just ignore this delta
        // as a non-relevant.
        if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
        }
        if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
        }
    }
    return createRectInit(paddings.left, paddings.top, width, height);
}
/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
var isSVGGraphicsElement = (function () {
    // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
    // interface.
    if (typeof SVGGraphicsElement !== 'undefined') {
        return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
    }
    // If it's so, then check that element is at least an instance of the
    // SVGElement and that it has the "getBBox" method.
    // eslint-disable-next-line no-extra-parens
    return function (target) { return (target instanceof getWindowOf(target).SVGElement &&
        typeof target.getBBox === 'function'); };
})();
/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
function isDocumentElement(target) {
    return target === getWindowOf(target).document.documentElement;
}
/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */
function getContentRect(target) {
    if (!isBrowser) {
        return emptyRect;
    }
    if (isSVGGraphicsElement(target)) {
        return getSVGContentRect(target);
    }
    return getHTMLElementContentRect(target);
}
/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */
function createReadOnlyRect(_a) {
    var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    // If DOMRectReadOnly is available use it as a prototype for the rectangle.
    var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
    var rect = Object.create(Constr.prototype);
    // Rectangle's properties are not writable and non-enumerable.
    defineConfigurable(rect, {
        x: x, y: y, width: width, height: height,
        top: y,
        right: x + width,
        bottom: height + y,
        left: x
    });
    return rect;
}
/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */
function createRectInit(x, y, width, height) {
    return { x: x, y: y, width: width, height: height };
}

/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */
var ResizeObservation = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObservation.
     *
     * @param {Element} target - Element to be observed.
     */
    function ResizeObservation(target) {
        /**
         * Broadcasted width of content rectangle.
         *
         * @type {number}
         */
        this.broadcastWidth = 0;
        /**
         * Broadcasted height of content rectangle.
         *
         * @type {number}
         */
        this.broadcastHeight = 0;
        /**
         * Reference to the last observed content rectangle.
         *
         * @private {DOMRectInit}
         */
        this.contentRect_ = createRectInit(0, 0, 0, 0);
        this.target = target;
    }
    /**
     * Updates content rectangle and tells whether it's width or height properties
     * have changed since the last broadcast.
     *
     * @returns {boolean}
     */
    ResizeObservation.prototype.isActive = function () {
        var rect = getContentRect(this.target);
        this.contentRect_ = rect;
        return (rect.width !== this.broadcastWidth ||
            rect.height !== this.broadcastHeight);
    };
    /**
     * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
     * from the corresponding properties of the last observed content rectangle.
     *
     * @returns {DOMRectInit} Last observed content rectangle.
     */
    ResizeObservation.prototype.broadcastRect = function () {
        var rect = this.contentRect_;
        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;
        return rect;
    };
    return ResizeObservation;
}());

var ResizeObserverEntry = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObserverEntry.
     *
     * @param {Element} target - Element that is being observed.
     * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
     */
    function ResizeObserverEntry(target, rectInit) {
        var contentRect = createReadOnlyRect(rectInit);
        // According to the specification following properties are not writable
        // and are also not enumerable in the native implementation.
        //
        // Property accessors are not being used as they'd require to define a
        // private WeakMap storage which may cause memory leaks in browsers that
        // don't support this type of collections.
        defineConfigurable(this, { target: target, contentRect: contentRect });
    }
    return ResizeObserverEntry;
}());

var ResizeObserverSPI = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback function that is invoked
     *      when one of the observed elements changes it's content dimensions.
     * @param {ResizeObserverController} controller - Controller instance which
     *      is responsible for the updates of observer.
     * @param {ResizeObserver} callbackCtx - Reference to the public
     *      ResizeObserver instance which will be passed to callback function.
     */
    function ResizeObserverSPI(callback, controller, callbackCtx) {
        /**
         * Collection of resize observations that have detected changes in dimensions
         * of elements.
         *
         * @private {Array<ResizeObservation>}
         */
        this.activeObservations_ = [];
        /**
         * Registry of the ResizeObservation instances.
         *
         * @private {Map<Element, ResizeObservation>}
         */
        this.observations_ = new MapShim();
        if (typeof callback !== 'function') {
            throw new TypeError('The callback provided as parameter 1 is not a function.');
        }
        this.callback_ = callback;
        this.controller_ = controller;
        this.callbackCtx_ = callbackCtx;
    }
    /**
     * Starts observing provided element.
     *
     * @param {Element} target - Element to be observed.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.observe = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is already being observed.
        if (observations.has(target)) {
            return;
        }
        observations.set(target, new ResizeObservation(target));
        this.controller_.addObserver(this);
        // Force the update of observations.
        this.controller_.refresh();
    };
    /**
     * Stops observing provided element.
     *
     * @param {Element} target - Element to stop observing.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.unobserve = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is not being observed.
        if (!observations.has(target)) {
            return;
        }
        observations.delete(target);
        if (!observations.size) {
            this.controller_.removeObserver(this);
        }
    };
    /**
     * Stops observing all elements.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.disconnect = function () {
        this.clearActive();
        this.observations_.clear();
        this.controller_.removeObserver(this);
    };
    /**
     * Collects observation instances the associated element of which has changed
     * it's content rectangle.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.gatherActive = function () {
        var _this = this;
        this.clearActive();
        this.observations_.forEach(function (observation) {
            if (observation.isActive()) {
                _this.activeObservations_.push(observation);
            }
        });
    };
    /**
     * Invokes initial callback function with a list of ResizeObserverEntry
     * instances collected from active resize observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.broadcastActive = function () {
        // Do nothing if observer doesn't have active observations.
        if (!this.hasActive()) {
            return;
        }
        var ctx = this.callbackCtx_;
        // Create ResizeObserverEntry instance for every active observation.
        var entries = this.activeObservations_.map(function (observation) {
            return new ResizeObserverEntry(observation.target, observation.broadcastRect());
        });
        this.callback_.call(ctx, entries, ctx);
        this.clearActive();
    };
    /**
     * Clears the collection of active observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.clearActive = function () {
        this.activeObservations_.splice(0);
    };
    /**
     * Tells whether observer has active observations.
     *
     * @returns {boolean}
     */
    ResizeObserverSPI.prototype.hasActive = function () {
        return this.activeObservations_.length > 0;
    };
    return ResizeObserverSPI;
}());

// Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.
var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */
var ResizeObserver = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback that is invoked when
     *      dimensions of the observed elements change.
     */
    function ResizeObserver(callback) {
        if (!(this instanceof ResizeObserver)) {
            throw new TypeError('Cannot call a class as a function.');
        }
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        var controller = ResizeObserverController.getInstance();
        var observer = new ResizeObserverSPI(callback, controller, this);
        observers.set(this, observer);
    }
    return ResizeObserver;
}());
// Expose public methods of ResizeObserver.
[
    'observe',
    'unobserve',
    'disconnect'
].forEach(function (method) {
    ResizeObserver.prototype[method] = function () {
        var _a;
        return (_a = observers.get(this))[method].apply(_a, arguments);
    };
});

var index = (function () {
    // Export existing implementation if available.
    if (typeof global$1.ResizeObserver !== 'undefined') {
        return global$1.ResizeObserver;
    }
    return ResizeObserver;
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (index);


/***/ }),

/***/ "./node_modules/string-convert/camel2hyphen.js":
/*!*****************************************************!*\
  !*** ./node_modules/string-convert/camel2hyphen.js ***!
  \*****************************************************/
/***/ ((module) => {

var camel2hyphen = function (str) {
  return str
          .replace(/[A-Z]/g, function (match) {
            return '-' + match.toLowerCase();
          })
          .toLowerCase();
};

module.exports = camel2hyphen;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = window["ReactDOM"];

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

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["primitives"];

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

/***/ "./src/blocks/testimonials/block.json":
/*!********************************************!*\
  !*** ./src/blocks/testimonials/block.json ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Testimonials","name":"kadence/testimonials","category":"kadence-blocks","textdomain":"kadence-blocks","attributes":{"uniqueID":{"type":"string","default":""},"style":{"type":"string","default":"basic"},"layout":{"type":"string","default":"grid"},"columns":{"type":"array","default":[1,1,1,1,1,1]},"columnControl":{"type":"string","default":"linked"},"columnGap":{"type":"number","default":30},"autoPlay":{"type":"bool","default":false},"autoSpeed":{"type":"number","default":7000},"transSpeed":{"type":"number","default":400},"slidesScroll":{"type":"string","default":"1"},"arrowStyle":{"type":"string","default":"whiteondark"},"dotStyle":{"type":"string","default":"dark"},"hAlign":{"type":"string","default":"center"},"containerMaxWidth":{"type":"number","default":500},"containerBackground":{"type":"string","default":""},"containerBackgroundOpacity":{"type":"number","default":1},"containerBorder":{"type":"string","default":"#eeeeee"},"containerBorderOpacity":{"type":"number","default":1},"containerBorderWidth":{"type":"array","default":["","","",""]},"containerBorderRadius":{"type":"number","default":""},"containerPadding":{"type":"array","default":[20,20,20,20]},"testimonials":{"type":"array","default":[{"url":"","id":"","alt":"","width":"","height":"","maxWidth":"","subtype":"","media":"image","icon":"fas_quote-left","isize":50,"istroke":2,"ititle":"","color":"#555555","title":"","content":"","name":"","occupation":"","rating":5}]},"mediaStyles":{"type":"array","default":[{"width":60,"backgroundSize":"cover","background":"","backgroundOpacity":1,"border":"#555555","borderRadius":"","borderWidth":[0,0,0,0],"padding":[0,0,0,0],"margin":["","","",""],"ratio":""}]},"itemsCount":{"type":"number","default":1},"displayMedia":{"type":"bool","default":true},"displayTitle":{"type":"bool","default":true},"titleFont":{"type":"array","default":[{"color":"","level":2,"size":["","",""],"sizetype":"px","lineHeight":["","",""],"linetype":"px","letterSpacing":"","textTransform":"","family":"","google":false,"style":"","weight":"","variant":"","subset":"","loadGoogle":true,"padding":[0,0,0,0],"margin":[0,0,15,0]}]},"displayContent":{"type":"bool","default":true},"contentFont":{"type":"array","default":[{"color":"#333333","size":["","",""],"sizetype":"px","lineHeight":["","",""],"linetype":"px","letterSpacing":"","textTransform":"","family":"","google":"","style":"","weight":"","variant":"","subset":"","loadGoogle":true}]},"displayName":{"type":"bool","default":true},"nameFont":{"type":"array","default":[{"color":"#333333","size":["","",""],"sizetype":"px","lineHeight":["","",""],"linetype":"px","letterSpacing":"","textTransform":"","family":"","google":"","style":"","weight":"","variant":"","subset":"","loadGoogle":true}]},"displayOccupation":{"type":"bool","default":true},"occupationFont":{"type":"array","default":[{"color":"#555555","size":[15,"",""],"sizetype":"px","lineHeight":["","",""],"linetype":"px","letterSpacing":"","textTransform":"","family":"","google":"","style":"","weight":"","variant":"","subset":"","loadGoogle":true}]},"displayRating":{"type":"bool","default":false},"ratingStyles":{"type":"array","default":[{"color":"#ffd700","size":16,"margin":[10,0,10,0],"iconSpacing":"","icon":"fas_star","stroke":2}]},"displayIcon":{"type":"bool","default":false},"iconStyles":{"type":"array","default":[{"size":30,"margin":["","","",""],"padding":["","","",""],"borderWidth":["","","",""],"borderRadius":"","border":"","borderOpacity":1,"color":"","background":"","backgroundOpacity":1,"title":"","icon":"fas_quote-left","stroke":2}]},"displayShadow":{"type":"bool","default":false},"shadow":{"type":"array","default":[{"color":"#000000","opacity":0.2,"spread":0,"blur":14,"hOffset":4,"vOffset":2}]},"containerMinHeight":{"type":"array","default":["","",""]},"containerVAlign":{"type":"string","default":""},"titleMinHeight":{"type":"array","default":["","",""]},"contentMinHeight":{"type":"array","default":["","",""]},"showPresets":{"type":"bool","default":true},"wrapperPaddingType":{"type":"string","default":"px"},"wrapperPadding":{"type":"array","default":["","","",""]},"wrapperTabletPadding":{"type":"array","default":["","","",""]},"wrapperMobilePadding":{"type":"array","default":["","","",""]},"tabletContainerPadding":{"type":"array","default":["","","",""]},"mobileContainerPadding":{"type":"array","default":["","","",""]},"containerPaddingType":{"type":"string","default":"px"},"inQueryBlock":{"type":"bool","default":false},"useBlockQuoteTags":{"type":"bool","default":true}},"usesContext":["postId","queryId"],"supports":{"anchor":true}}');

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 			"blocks-testimonials": 0,
/******/ 			"./style-blocks-testimonials": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-blocks-testimonials"], () => (__webpack_require__("./src/blocks/testimonials/block.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	(this.kadence = this.kadence || {})["blocks-testimonials"] = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=blocks-testimonials.js.map