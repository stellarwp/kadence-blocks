/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/column/editor.scss":
/*!***************************************!*\
  !*** ./src/blocks/column/editor.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/column/style.scss":
/*!**************************************!*\
  !*** ./src/blocks/column/style.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/column/copy-paste-style.js":
/*!***********************************************!*\
  !*** ./src/blocks/column/copy-paste-style.js ***!
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
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);


/**
 * Copy and Paste Block Styles Component
 *
 */


const {
  Component,
  Fragment
} = wp.element;

const {
  localStorage
} = window;
const POPOVER_PROPS = {
  className: 'block-editor-block-settings-menu__popover',
  position: 'bottom right'
};
/**
 * Build the copy and paste controls
 * @returns {object} copy and paste settings.
 */

class ColumnStyleCopyPaste extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      iconOptions: [],
      iconOptionsNames: []
    };
  }

  componentDidMount() {}

  render() {
    const {
      onPaste,
      blockAttributes
    } = this.props;
    const copyIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      fillRule: "evenodd",
      strokeLinejoin: "round",
      strokeMiterlimit: "2",
      clipRule: "evenodd",
      viewBox: "0 0 32 32",
      width: "20px",
      height: "20px"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      fillRule: "nonzero",
      d: "M26 8h-6V6l-6-6H0v24h12v8h20V14l-6-6zm0 2.828L29.172 14H26v-3.172zm-12-8L17.172 6H14V2.828zM2 2h10v6h6v14H2V2zm28 28H14v-6h6V10h4v6h6v14z"
    }));
    const headingCopiedStyles = JSON.parse(localStorage.getItem('kadenceColumnStyle'));

    const copyAction = () => {
      const copyStyles = {};

      if (blockAttributes.topPadding || blockAttributes.topPadding === 0) {
        copyStyles.topPadding = blockAttributes.topPadding;
      }

      if (blockAttributes.bottomPadding || blockAttributes.bottomPadding === 0) {
        copyStyles.bottomPadding = blockAttributes.bottomPadding;
      }

      if (blockAttributes.leftPadding || blockAttributes.leftPadding === 0) {
        copyStyles.leftPadding = blockAttributes.leftPadding;
      }

      if (blockAttributes.rightPadding || blockAttributes.rightPadding === 0) {
        copyStyles.rightPadding = blockAttributes.rightPadding;
      }

      if (blockAttributes.topPaddingM || blockAttributes.topPaddingM === 0) {
        copyStyles.topPaddingM = blockAttributes.topPaddingM;
      }

      if (blockAttributes.bottomPaddingM || blockAttributes.bottomPaddingM === 0) {
        copyStyles.bottomPaddingM = blockAttributes.bottomPaddingM;
      }

      if (blockAttributes.leftPaddingM || blockAttributes.leftPaddingM === 0) {
        copyStyles.leftPaddingM = blockAttributes.leftPaddingM;
      }

      if (blockAttributes.rightPaddingM || blockAttributes.rightPaddingM === 0) {
        copyStyles.rightPaddingM = blockAttributes.rightPaddingM;
      }

      if (blockAttributes.topMargin || blockAttributes.topMargin === 0) {
        copyStyles.topMargin = blockAttributes.topMargin;
      }

      if (blockAttributes.bottomMargin || blockAttributes.bottomMargin === 0) {
        copyStyles.bottomMargin = blockAttributes.bottomMargin;
      }

      if (blockAttributes.topMarginM || blockAttributes.topMarginM === 0) {
        copyStyles.topMarginM = blockAttributes.topMarginM;
      }

      if (blockAttributes.bottomMarginM || blockAttributes.bottomMarginM === 0) {
        copyStyles.bottomMarginM = blockAttributes.bottomMarginM;
      }

      if (blockAttributes.leftMargin || blockAttributes.leftMargin === 0) {
        copyStyles.leftMargin = blockAttributes.leftMargin;
      }

      if (blockAttributes.rightMargin || blockAttributes.rightMargin === 0) {
        copyStyles.rightMargin = blockAttributes.rightMargin;
      }

      if (blockAttributes.leftMarginM || blockAttributes.leftMarginM === 0) {
        copyStyles.leftMarginM = blockAttributes.leftMarginM;
      }

      if (blockAttributes.rightMarginM || blockAttributes.rightMarginM === 0) {
        copyStyles.rightMarginM = blockAttributes.rightMarginM;
      }

      if (blockAttributes.zIndex) {
        copyStyles.zIndex = blockAttributes.zIndex;
      }

      if (blockAttributes.background) {
        copyStyles.background = blockAttributes.background;
      }

      if (blockAttributes.backgroundOpacity) {
        copyStyles.backgroundOpacity = blockAttributes.backgroundOpacity;
      }

      if (blockAttributes.border) {
        copyStyles.border = blockAttributes.border;
      }

      if (blockAttributes.borderOpacity) {
        copyStyles.borderOpacity = blockAttributes.borderOpacity;
      }

      if (blockAttributes.borderWidth) {
        copyStyles.borderWidth = blockAttributes.borderWidth;
      }

      if (blockAttributes.tabletBorderWidth) {
        copyStyles.tabletBorderWidth = blockAttributes.tabletBorderWidth;
      }

      if (blockAttributes.mobileBorderWidth) {
        copyStyles.mobileBorderWidth = blockAttributes.mobileBorderWidth;
      }

      if (blockAttributes.borderRadius) {
        copyStyles.borderRadius = blockAttributes.borderRadius;
      }

      if (blockAttributes.backgroundImg) {
        copyStyles.backgroundImg = blockAttributes.backgroundImg;
      }

      if (blockAttributes.textAlign) {
        copyStyles.textAlign = blockAttributes.textAlign;
      }

      if (blockAttributes.textColor) {
        copyStyles.textColor = blockAttributes.textColor;
      }

      if (blockAttributes.linkColor) {
        copyStyles.linkColor = blockAttributes.linkColor;
      }

      if (blockAttributes.linkHoverColor) {
        copyStyles.linkHoverColor = blockAttributes.linkHoverColor;
      }

      if (blockAttributes.topPaddingT || blockAttributes.bottomPadding === 0) {
        copyStyles.topPaddingT = blockAttributes.topPaddingT;
      }

      if (blockAttributes.bottomPaddingT || blockAttributes.bottomPaddingT === 0) {
        copyStyles.bottomPaddingT = blockAttributes.bottomPaddingT;
      }

      if (blockAttributes.leftPaddingT || blockAttributes.leftPaddingT === 0) {
        copyStyles.leftPaddingT = blockAttributes.leftPaddingT;
      }

      if (blockAttributes.rightPaddingT || blockAttributes.rightPaddingT === 0) {
        copyStyles.rightPaddingT = blockAttributes.rightPaddingT;
      }

      if (blockAttributes.topMarginT || blockAttributes.topMarginT === 0) {
        copyStyles.topMarginT = blockAttributes.topMarginT;
      }

      if (blockAttributes.bottomMarginT || blockAttributes.bottomMarginT === 0) {
        copyStyles.bottomMarginT = blockAttributes.bottomMarginT;
      }

      if (blockAttributes.leftMarginT || blockAttributes.leftMarginT === 0) {
        copyStyles.leftMarginT = blockAttributes.leftMarginT;
      }

      if (blockAttributes.rightMarginT || blockAttributes.rightMarginT === 0) {
        copyStyles.rightMarginT = blockAttributes.rightMarginT;
      }

      if (blockAttributes.marginType) {
        copyStyles.marginType = blockAttributes.marginType;
      }

      if (blockAttributes.paddingType) {
        copyStyles.paddingType = blockAttributes.paddingType;
      }

      if (blockAttributes.displayShadow) {
        copyStyles.displayShadow = blockAttributes.displayShadow;
      }

      if (blockAttributes.shadow) {
        copyStyles.shadow = blockAttributes.shadow;
      }

      if (blockAttributes.vsdesk) {
        copyStyles.vsdesk = blockAttributes.vsdesk;
      }

      if (blockAttributes.vstablet) {
        copyStyles.vstablet = blockAttributes.vstablet;
      }

      if (blockAttributes.vsmobile) {
        copyStyles.vsmobile = blockAttributes.vsmobile;
      }

      if (blockAttributes.direction) {
        copyStyles.direction = blockAttributes.direction;
      }

      if (blockAttributes.gutter) {
        copyStyles.gutter = blockAttributes.gutter;
      }

      if (blockAttributes.gutterUnit) {
        copyStyles.gutterUnit = blockAttributes.gutterUnit;
      }

      if (blockAttributes.verticalAlignment) {
        copyStyles.verticalAlignment = blockAttributes.verticalAlignment;
      }

      if (blockAttributes.justifyContent) {
        copyStyles.justifyContent = blockAttributes.justifyContent;
      }

      if (blockAttributes.backgroundImgHover) {
        copyStyles.backgroundImgHover = blockAttributes.backgroundImgHover;
      }

      if (blockAttributes.backgroundHover) {
        copyStyles.backgroundHover = blockAttributes.backgroundHover;
      }

      if (blockAttributes.borderHover) {
        copyStyles.borderHover = blockAttributes.borderHover;
      }

      if (blockAttributes.borderHoverWidth) {
        copyStyles.borderHoverWidth = blockAttributes.borderHoverWidth;
      }

      if (blockAttributes.tabletBorderHoverWidth) {
        copyStyles.tabletBorderHoverWidth = blockAttributes.tabletBorderHoverWidth;
      }

      if (blockAttributes.mobileBorderHoverWidth) {
        copyStyles.mobileBorderHoverWidth = blockAttributes.mobileBorderHoverWidth;
      }

      if (blockAttributes.borderHoverRadius) {
        copyStyles.borderHoverRadius = blockAttributes.borderHoverRadius;
      }

      if (blockAttributes.displayHoverShadow) {
        copyStyles.displayHoverShadow = blockAttributes.displayHoverShadow;
      }

      if (blockAttributes.shadowHover) {
        copyStyles.shadowHover = blockAttributes.shadowHover;
      }

      if (blockAttributes.textColorHover) {
        copyStyles.textColorHover = blockAttributes.textColorHover;
      }

      if (blockAttributes.linkColorHover) {
        copyStyles.linkColorHover = blockAttributes.linkColorHover;
      }

      if (blockAttributes.linkHoverColorHover) {
        copyStyles.linkHoverColorHover = blockAttributes.linkHoverColorHover;
      }

      if (blockAttributes.maxWidth) {
        copyStyles.maxWidth = blockAttributes.maxWidth;
      }

      if (blockAttributes.maxWidthUnit) {
        copyStyles.maxWidthUnit = blockAttributes.maxWidthUnit;
      }

      if (blockAttributes.height) {
        copyStyles.height = blockAttributes.height;
      }

      if (blockAttributes.heightUnit) {
        copyStyles.heightUnit = blockAttributes.heightUnit;
      }

      if (blockAttributes.htmlTag) {
        copyStyles.htmlTag = blockAttributes.htmlTag;
      }

      if (blockAttributes.sticky) {
        copyStyles.sticky = blockAttributes.sticky;
      }

      if (blockAttributes.stickyOffset) {
        copyStyles.stickyOffset = blockAttributes.stickyOffset;
      }

      if (blockAttributes.stickyUnit) {
        copyStyles.stickyUnit = blockAttributes.stickyUnit;
      }

      if (blockAttributes.overlay) {
        copyStyles.overlay = blockAttributes.overlay;
      }

      if (blockAttributes.overlayHover) {
        copyStyles.overlayHover = blockAttributes.overlayHover;
      }

      if (blockAttributes.overlayImg) {
        copyStyles.overlayImg = blockAttributes.overlayImg;
      }

      if (blockAttributes.overlayImgHover) {
        copyStyles.overlayImgHover = blockAttributes.overlayImgHover;
      }

      if (undefined !== blockAttributes.overlayOpacity) {
        copyStyles.overlayOpacity = blockAttributes.overlayOpacity;
      }

      if (undefined !== blockAttributes.overlayHoverOpacity) {
        copyStyles.overlayHoverOpacity = blockAttributes.overlayHoverOpacity;
      }

      localStorage.setItem('kadenceColumnStyle', JSON.stringify(copyStyles));
    };

    const pasteAction = () => {
      const pasteItem = JSON.parse(localStorage.getItem('kadenceColumnStyle'));

      if (pasteItem) {
        onPaste(pasteItem);
      }
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Toolbar, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.DropdownMenu, {
      className: "block-editor-block-settings-menu",
      icon: copyIcon,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Copy/Paste Styles', 'kadence-blocks'),
      popoverProps: POPOVER_PROPS
    }, _ref => {
      let {
        onClose
      } = _ref;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.MenuGroup, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.MenuItem, {
        icon: 'clipboard',
        onClick: (0,lodash__WEBPACK_IMPORTED_MODULE_1__.flow)(onClose, copyAction),
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Copy Styles', 'kadence-blocks')
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Copy Styles', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.MenuItem, {
        icon: 'editor-paste-text',
        onClick: (0,lodash__WEBPACK_IMPORTED_MODULE_1__.flow)(onClose, pasteAction),
        disabled: !headingCopiedStyles,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Paste Styles', 'kadence-blocks')
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Paste Styles', 'kadence-blocks'))));
    }));
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ColumnStyleCopyPaste);

/***/ }),

/***/ "./src/blocks/column/deprecated.js":
/*!*****************************************!*\
  !*** ./src/blocks/column/deprecated.js ***!
  \*****************************************/
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
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);


/**
 * BLOCK: Kadence Section
 *
 * Registering Deprecations.
 */

/**
 * External dependencies
 */


/**
 * Internal dependencies
 */


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([{
  attributes: {
    id: {
      type: 'number',
      default: 1
    },
    topPadding: {
      type: 'number',
      default: ''
    },
    bottomPadding: {
      type: 'number',
      default: ''
    },
    leftPadding: {
      type: 'number',
      default: ''
    },
    rightPadding: {
      type: 'number',
      default: ''
    },
    topPaddingM: {
      type: 'number',
      default: ''
    },
    bottomPaddingM: {
      type: 'number',
      default: ''
    },
    leftPaddingM: {
      type: 'number',
      default: ''
    },
    rightPaddingM: {
      type: 'number',
      default: ''
    },
    topMargin: {
      type: 'number',
      default: ''
    },
    bottomMargin: {
      type: 'number',
      default: ''
    },
    topMarginM: {
      type: 'number',
      default: ''
    },
    bottomMarginM: {
      type: 'number',
      default: ''
    },
    leftMargin: {
      type: 'number',
      default: ''
    },
    rightMargin: {
      type: 'number',
      default: ''
    },
    leftMarginM: {
      type: 'number',
      default: ''
    },
    rightMarginM: {
      type: 'number',
      default: ''
    },
    zIndex: {
      type: 'number',
      default: ''
    },
    background: {
      type: 'string',
      default: ''
    },
    backgroundOpacity: {
      type: 'number',
      default: 1
    },
    border: {
      type: 'string',
      default: ''
    },
    borderOpacity: {
      type: 'number',
      default: 1
    },
    borderWidth: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    tabletBorderWidth: {
      type: 'array',
      default: ['', '', '', '']
    },
    mobileBorderWidth: {
      type: 'array',
      default: ['', '', '', '']
    },
    borderRadius: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    uniqueID: {
      type: 'string',
      default: ''
    },
    collapseOrder: {
      type: 'number'
    },
    backgroundImg: {
      type: 'array',
      default: [{
        bgImg: '',
        bgImgID: '',
        bgImgSize: 'cover',
        bgImgPosition: 'center center',
        bgImgAttachment: 'scroll',
        bgImgRepeat: 'no-repeat'
      }]
    },
    textAlign: {
      type: 'array',
      default: ['', '', '']
    },
    textColor: {
      type: 'string',
      default: ''
    },
    linkColor: {
      type: 'string',
      default: ''
    },
    linkHoverColor: {
      type: 'string',
      default: ''
    },
    topPaddingT: {
      type: 'number',
      default: ''
    },
    bottomPaddingT: {
      type: 'number',
      default: ''
    },
    leftPaddingT: {
      type: 'number',
      default: ''
    },
    rightPaddingT: {
      type: 'number',
      default: ''
    },
    topMarginT: {
      type: 'number',
      default: ''
    },
    bottomMarginT: {
      type: 'number',
      default: ''
    },
    leftMarginT: {
      type: 'number',
      default: ''
    },
    rightMarginT: {
      type: 'number',
      default: ''
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
        hOffset: 0,
        vOffset: 0,
        inset: false
      }]
    },
    noCustomDefaults: {
      type: 'bool',
      default: false
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
    },
    paddingType: {
      type: 'string',
      default: 'px'
    },
    marginType: {
      type: 'string',
      default: 'px'
    },
    bgColorClass: {
      type: 'string',
      default: ''
    },
    templateLock: {
      type: 'string'
    },
    direction: {
      type: 'array',
      default: ['', '', '']
    },
    justifyContent: {
      type: 'array',
      default: ['', '', '']
    },
    gutter: {
      type: 'array',
      default: ['', '', '']
    },
    gutterUnit: {
      type: 'string',
      default: 'px'
    },
    verticalAlignment: {
      type: 'string'
    },
    backgroundImgHover: {
      type: 'array',
      default: [{
        bgImg: '',
        bgImgID: '',
        bgImgSize: 'cover',
        bgImgPosition: 'center center',
        bgImgAttachment: 'scroll',
        bgImgRepeat: 'no-repeat'
      }]
    },
    backgroundHover: {
      type: 'string',
      default: ''
    },
    borderHover: {
      type: 'string',
      default: ''
    },
    borderHoverWidth: {
      type: 'array',
      default: ['', '', '', '']
    },
    tabletBorderHoverWidth: {
      type: 'array',
      default: ['', '', '', '']
    },
    mobileBorderHoverWidth: {
      type: 'array',
      default: ['', '', '', '']
    },
    borderHoverRadius: {
      type: 'array',
      default: ['', '', '', '']
    },
    displayHoverShadow: {
      type: 'bool',
      default: false
    },
    shadowHover: {
      type: 'array',
      default: [{
        color: '#000000',
        opacity: 0.2,
        spread: 0,
        blur: 14,
        hOffset: 0,
        vOffset: 0,
        inset: false
      }]
    },
    textColorHover: {
      type: 'string',
      default: ''
    },
    linkColorHover: {
      type: 'string',
      default: ''
    },
    linkHoverColorHover: {
      type: 'string',
      default: ''
    },
    inQueryBlock: {
      type: 'bool',
      default: false
    },
    kadenceBlockCSS: {
      type: 'string',
      default: ''
    },
    kadenceAnimation: {
      type: 'string'
    },
    kadenceAOSOptions: {
      type: 'array',
      default: [{
        duration: '',
        offset: '',
        easing: '',
        once: '',
        delay: '',
        delayOffset: ''
      }]
    },
    kadenceDynamic: {
      type: 'object'
    },
    kadenceConditional: {
      type: 'object'
    }
  },
  save: _ref => {
    let {
      attributes
    } = _ref;
    const {
      id,
      background,
      backgroundOpacity,
      backgroundImg,
      uniqueID,
      vsdesk,
      vstablet,
      vsmobile,
      bgColorClass
    } = attributes;
    const bgImg = backgroundImg && backgroundImg[0] && backgroundImg[0].bgImg ? backgroundImg[0].bgImg : '';
    const backgroundString = background && '' === bgImg ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(background, backgroundOpacity) : undefined;
    const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      [`inner-column-${id}`]: id,
      [`kadence-column${uniqueID}`]: uniqueID,
      'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
      'kvs-md-false': vstablet !== 'undefined' && vstablet,
      'kvs-sm-false': vsmobile !== 'undefined' && vsmobile
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classes
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-inside-inner-col',
      style: {
        background: backgroundString
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null)));
  }
}, {
  attributes: {
    id: {
      type: 'number',
      default: 1
    },
    topPadding: {
      type: 'number',
      default: ''
    },
    bottomPadding: {
      type: 'number',
      default: ''
    },
    leftPadding: {
      type: 'number',
      default: ''
    },
    rightPadding: {
      type: 'number',
      default: ''
    },
    topPaddingM: {
      type: 'number',
      default: ''
    },
    bottomPaddingM: {
      type: 'number',
      default: ''
    },
    leftPaddingM: {
      type: 'number',
      default: ''
    },
    rightPaddingM: {
      type: 'number',
      default: ''
    },
    topMargin: {
      type: 'number',
      default: ''
    },
    bottomMargin: {
      type: 'number',
      default: ''
    },
    topMarginM: {
      type: 'number',
      default: ''
    },
    bottomMarginM: {
      type: 'number',
      default: ''
    },
    leftMargin: {
      type: 'number',
      default: ''
    },
    rightMargin: {
      type: 'number',
      default: ''
    },
    leftMarginM: {
      type: 'number',
      default: ''
    },
    rightMarginM: {
      type: 'number',
      default: ''
    },
    zIndex: {
      type: 'number',
      default: ''
    },
    background: {
      type: 'string',
      default: ''
    },
    backgroundOpacity: {
      type: 'number',
      default: 1
    },
    border: {
      type: 'string',
      default: ''
    },
    borderOpacity: {
      type: 'number',
      default: 1
    },
    borderWidth: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    tabletBorderWidth: {
      type: 'array',
      default: ['', '', '', '']
    },
    mobileBorderWidth: {
      type: 'array',
      default: ['', '', '', '']
    },
    borderRadius: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    uniqueID: {
      type: 'string',
      default: ''
    },
    collapseOrder: {
      type: 'number'
    },
    backgroundImg: {
      type: 'array',
      default: [{
        bgImg: '',
        bgImgID: '',
        bgImgSize: 'cover',
        bgImgPosition: 'center center',
        bgImgAttachment: 'scroll',
        bgImgRepeat: 'no-repeat'
      }]
    },
    textAlign: {
      type: 'array',
      default: ['', '', '']
    },
    textColor: {
      type: 'string',
      default: ''
    },
    linkColor: {
      type: 'string',
      default: ''
    },
    linkHoverColor: {
      type: 'string',
      default: ''
    },
    topPaddingT: {
      type: 'number',
      default: ''
    },
    bottomPaddingT: {
      type: 'number',
      default: ''
    },
    leftPaddingT: {
      type: 'number',
      default: ''
    },
    rightPaddingT: {
      type: 'number',
      default: ''
    },
    topMarginT: {
      type: 'number',
      default: ''
    },
    bottomMarginT: {
      type: 'number',
      default: ''
    },
    leftMarginT: {
      type: 'number',
      default: ''
    },
    rightMarginT: {
      type: 'number',
      default: ''
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
        hOffset: 0,
        vOffset: 0,
        inset: false
      }]
    },
    noCustomDefaults: {
      type: 'bool',
      default: false
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
    },
    paddingType: {
      type: 'string',
      default: 'px'
    },
    marginType: {
      type: 'string',
      default: 'px'
    },
    bgColorClass: {
      type: 'string',
      default: ''
    },
    templateLock: {
      type: 'string'
    }
  },
  save: _ref2 => {
    let {
      attributes
    } = _ref2;
    const {
      id,
      background,
      backgroundOpacity,
      backgroundImg,
      uniqueID,
      vsdesk,
      vstablet,
      vsmobile
    } = attributes;
    const bgImg = backgroundImg && backgroundImg[0] && backgroundImg[0].bgImg ? backgroundImg[0].bgImg : '';
    const backgroundString = background && '' === bgImg ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(background, backgroundOpacity) : undefined;
    const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      [`inner-column-${id}`]: id,
      [`kadence-column${uniqueID}`]: uniqueID,
      'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
      'kvs-md-false': vstablet !== 'undefined' && vstablet,
      'kvs-sm-false': vsmobile !== 'undefined' && vsmobile
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classes
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-inside-inner-col',
      style: {
        background: backgroundString
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null)));
  }
}, {
  attributes: {
    id: {
      type: 'number',
      default: 1
    },
    topPadding: {
      type: 'number',
      default: ''
    },
    bottomPadding: {
      type: 'number',
      default: ''
    },
    leftPadding: {
      type: 'number',
      default: ''
    },
    rightPadding: {
      type: 'number',
      default: ''
    },
    topPaddingM: {
      type: 'number',
      default: ''
    },
    bottomPaddingM: {
      type: 'number',
      default: ''
    },
    leftPaddingM: {
      type: 'number',
      default: ''
    },
    rightPaddingM: {
      type: 'number',
      default: ''
    },
    topMargin: {
      type: 'number',
      default: ''
    },
    bottomMargin: {
      type: 'number',
      default: ''
    },
    topMarginM: {
      type: 'number',
      default: ''
    },
    bottomMarginM: {
      type: 'number',
      default: ''
    },
    leftMargin: {
      type: 'number',
      default: ''
    },
    rightMargin: {
      type: 'number',
      default: ''
    },
    leftMarginM: {
      type: 'number',
      default: ''
    },
    rightMarginM: {
      type: 'number',
      default: ''
    },
    zIndex: {
      type: 'number',
      default: ''
    },
    background: {
      type: 'string',
      default: ''
    },
    backgroundOpacity: {
      type: 'number',
      default: 1
    },
    border: {
      type: 'string',
      default: ''
    },
    borderOpacity: {
      type: 'number',
      default: 1
    },
    borderWidth: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    borderRadius: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    uniqueID: {
      type: 'string',
      default: ''
    },
    collapseOrder: {
      type: 'number'
    },
    backgroundImg: {
      type: 'array',
      default: [{
        bgImg: '',
        bgImgID: '',
        bgImgSize: 'cover',
        bgImgPosition: 'center center',
        bgImgAttachment: 'scroll',
        bgImgRepeat: 'no-repeat'
      }]
    },
    textAlign: {
      type: 'array',
      default: ['', '', '']
    },
    textColor: {
      type: 'string',
      default: ''
    },
    linkColor: {
      type: 'string',
      default: ''
    },
    linkHoverColor: {
      type: 'string',
      default: ''
    },
    topPaddingT: {
      type: 'number',
      default: ''
    },
    bottomPaddingT: {
      type: 'number',
      default: ''
    },
    leftPaddingT: {
      type: 'number',
      default: ''
    },
    rightPaddingT: {
      type: 'number',
      default: ''
    },
    topMarginT: {
      type: 'number',
      default: ''
    },
    bottomMarginT: {
      type: 'number',
      default: ''
    },
    leftMarginT: {
      type: 'number',
      default: ''
    },
    rightMarginT: {
      type: 'number',
      default: ''
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
        hOffset: 0,
        vOffset: 0,
        inset: false
      }]
    },
    noCustomDefaults: {
      type: 'bool',
      default: false
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
  save: _ref3 => {
    let {
      attributes
    } = _ref3;
    const {
      id,
      background,
      backgroundOpacity,
      backgroundImg,
      uniqueID
    } = attributes;
    const bgImg = backgroundImg && backgroundImg[0] && backgroundImg[0].bgImg ? backgroundImg[0].bgImg : '';
    const backgroundString = background && '' === bgImg ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(background, backgroundOpacity) : undefined;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `inner-column-${id} kadence-column${uniqueID}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-inside-inner-col',
      style: {
        background: backgroundString
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null)));
  }
}, {
  attributes: {
    id: {
      type: 'number',
      default: 1
    },
    topPadding: {
      type: 'number',
      default: ''
    },
    bottomPadding: {
      type: 'number',
      default: ''
    },
    leftPadding: {
      type: 'number',
      default: ''
    },
    rightPadding: {
      type: 'number',
      default: ''
    },
    topPaddingM: {
      type: 'number',
      default: ''
    },
    bottomPaddingM: {
      type: 'number',
      default: ''
    },
    leftPaddingM: {
      type: 'number',
      default: ''
    },
    rightPaddingM: {
      type: 'number',
      default: ''
    },
    topMargin: {
      type: 'number',
      default: ''
    },
    bottomMargin: {
      type: 'number',
      default: ''
    },
    topMarginM: {
      type: 'number',
      default: ''
    },
    bottomMarginM: {
      type: 'number',
      default: ''
    },
    leftMargin: {
      type: 'number',
      default: ''
    },
    rightMargin: {
      type: 'number',
      default: ''
    },
    leftMarginM: {
      type: 'number',
      default: ''
    },
    rightMarginM: {
      type: 'number',
      default: ''
    },
    zIndex: {
      type: 'number',
      default: ''
    },
    background: {
      type: 'string',
      default: ''
    },
    backgroundOpacity: {
      type: 'number',
      default: 1
    }
  },
  save: _ref4 => {
    let {
      attributes
    } = _ref4;
    const {
      id,
      background,
      backgroundOpacity
    } = attributes;
    const backgroundString = background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.hexToRGBA)(background, backgroundOpacity) : undefined;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `inner-column-${id}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-inside-inner-col',
      style: {
        background: backgroundString
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null)));
  }
}, {
  attributes: {
    id: {
      type: 'number',
      default: 1
    }
  },
  save: _ref5 => {
    let {
      attributes
    } = _ref5;
    const {
      id
    } = attributes;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `inner-column-${id}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-inside-inner-col'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null)));
  }
}, {
  attributes: {
    id: {
      type: 'number',
      default: 1
    }
  },
  save: _ref6 => {
    let {
      attributes
    } = _ref6;
    const {
      id
    } = attributes;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `inner-column-${id}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null));
  }
}]);

/***/ }),

/***/ "./src/blocks/column/edit.js":
/*!***********************************!*\
  !*** ./src/blocks/column/edit.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _copy_paste_style__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./copy-paste-style */ "./src/blocks/column/copy-paste-style.js");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/column/editor.scss");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_13__);



/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */

/**
 * Import Controls
 */



/**
 * Kadence Components.
 */



/**
 * Blocks Specific.
 */



/**
 * Import WordPress
 */







/**
 * Build the section edit.
 */

function SectionEdit(_ref) {
  let {
    attributes,
    setAttributes,
    isSelected,
    clientId,
    context,
    className
  } = _ref;
  const {
    id,
    topPadding,
    bottomPadding,
    leftPadding,
    rightPadding,
    topPaddingM,
    bottomPaddingM,
    leftPaddingM,
    rightPaddingM,
    topMargin,
    bottomMargin,
    topMarginM,
    bottomMarginM,
    leftMargin,
    rightMargin,
    leftMarginM,
    rightMarginM,
    topMarginT,
    bottomMarginT,
    leftMarginT,
    rightMarginT,
    topPaddingT,
    bottomPaddingT,
    leftPaddingT,
    rightPaddingT,
    backgroundOpacity,
    background,
    zIndex,
    border,
    borderWidth,
    borderOpacity,
    borderRadius,
    uniqueID,
    kadenceAnimation,
    kadenceAOSOptions,
    collapseOrder,
    backgroundImg,
    textAlign,
    textColor,
    linkColor,
    linkHoverColor,
    shadow,
    displayShadow,
    vsdesk,
    vstablet,
    vsmobile,
    paddingType,
    marginType,
    mobileBorderWidth,
    tabletBorderWidth,
    templateLock,
    kadenceBlockCSS,
    kadenceDynamic,
    direction,
    gutter,
    gutterUnit,
    verticalAlignment,
    justifyContent,
    backgroundImgHover,
    backgroundHover,
    borderHover,
    borderHoverWidth,
    borderHoverRadius,
    shadowHover,
    displayHoverShadow,
    tabletBorderHoverWidth,
    mobileBorderHoverWidth,
    textColorHover,
    linkColorHover,
    linkHoverColorHover,
    linkNoFollow,
    linkSponsored,
    link,
    linkTarget,
    linkTitle,
    wrapContent,
    heightUnit,
    height,
    maxWidth,
    maxWidthUnit,
    htmlTag,
    sticky,
    stickyOffset,
    stickyOffsetUnit,
    overlay,
    overlayHover,
    overlayImg,
    overlayImgHover,
    overlayOpacity,
    overlayHoverOpacity,
    align
  } = attributes;

  const getDynamic = () => {
    let contextPost = null;

    if (context && context.queryId && context.postId) {
      contextPost = context.postId;
    }

    if (attributes.kadenceDynamic && attributes.kadenceDynamic['backgroundImg:0:bgImg'] && attributes.kadenceDynamic['backgroundImg:0:bgImg'].enable) {
      (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_13__.applyFilters)('kadence.dynamicBackground', '', attributes, setAttributes, 'backgroundImg:0:bgImg', contextPost);
    }

    if (attributes.kadenceDynamic && attributes.kadenceDynamic['backgroundImgHover:0:bgImg'] && attributes.kadenceDynamic['backgroundImgHover:0:bgImg'].enable) {
      (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_13__.applyFilters)('kadence.dynamicBackground', '', attributes, setAttributes, 'backgroundImgHover:0:bgImg', contextPost);
    }
  };

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
      const blockConfigObject = kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : [];

      if (undefined === attributes.noCustomDefaults || !attributes.noCustomDefaults) {
        if (blockConfigObject['kadence/column'] !== undefined && typeof blockConfigObject['kadence/column'] === 'object') {
          Object.keys(blockConfigObject['kadence/column']).map(attribute => {
            attributes[attribute] = blockConfigObject['kadence/column'][attribute];
          });
        }
      }

      if (!isUniqueID(uniqueID)) {
        smallID = (0,lodash__WEBPACK_IMPORTED_MODULE_4__.uniqueId)(smallID);
      }

      setAttributes({
        uniqueID: smallID
      });
      addUniqueID(smallID, clientId);
    } else if (!isUniqueID(uniqueID)) {
      // This checks if we are just switching views, client ID the same means we don't need to update.
      if (!isUniqueBlock(uniqueID, clientId)) {
        attributes.uniqueID = smallID;
        addUniqueID(smallID, clientId);
      }
    } else {
      addUniqueID(uniqueID, clientId);
    }

    if (context && context.queryId && context.postId) {
      if (!attributes.inQueryBlock) {
        setAttributes({
          inQueryBlock: true
        });
      }
    } else if (attributes.inQueryBlock) {
      setAttributes({
        inQueryBlock: false
      });
    }

    (0,lodash__WEBPACK_IMPORTED_MODULE_4__.debounce)(getDynamic, 200);
  }, []);
  const {
    hasInnerBlocks,
    inRowBlock
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_10__.useSelect)(select => {
    const {
      getBlock,
      getBlockRootClientId,
      getBlocksByClientId
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__.store);
    const block = getBlock(clientId);
    const rootID = getBlockRootClientId(clientId);
    let inRowBlock = false;

    if (rootID) {
      const parentBlock = getBlocksByClientId(rootID);
      inRowBlock = undefined !== parentBlock && undefined !== parentBlock[0] && undefined !== parentBlock[0].name && parentBlock[0].name === 'kadence/rowlayout' ? true : false;
    }

    return {
      inRowBlock: inRowBlock,
      hasInnerBlocks: !!(block && block.innerBlocks.length)
    };
  }, [clientId]);
  const [borderRadiusControl, setBorderRadiusControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [borderWidthControl, setBorderWidthControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [paddingControl, setPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [marginControl, setMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('general');

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

  const saveShadowHover = value => {
    const newItems = shadowHover.map((item, thisIndex) => {
      if (0 === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      shadowHover: newItems
    });
  };

  const saveBackgroundImage = value => {
    const newUpdate = backgroundImg.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      backgroundImg: newUpdate
    });
  };

  const saveHoverBackgroundImage = value => {
    const newUpdate = backgroundImgHover.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      backgroundImgHover: newUpdate
    });
  };

  const onRemoveBGImage = () => {
    saveBackgroundImage({
      bgImgID: '',
      bgImg: ''
    });
  };

  const onRemoveHoverBGImage = () => {
    saveHoverBackgroundImage({
      bgImgID: '',
      bgImg: ''
    });
  };

  const saveOverlayImage = value => {
    const newUpdate = overlayImg.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      overlayImg: newUpdate
    });
  };

  const saveHoverOverlayImage = value => {
    const newUpdate = overlayImgHover.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      overlayImgHover: newUpdate
    });
  };

  const onRemoveOverlayImage = () => {
    saveOverlayImage({
      bgImgID: '',
      bgImg: ''
    });
  };

  const onRemoveHoverOverlayImage = () => {
    saveHoverOverlayImage({
      bgImgID: '',
      bgImg: ''
    });
  };

  const gutterMax = gutterUnit !== 'px' ? 12 : 200;
  const gutterStep = gutterUnit !== 'px' ? 0.1 : 1;
  const marginMin = marginType === 'em' || marginType === 'rem' ? -2 : -200;
  const marginMax = marginType === 'em' || marginType === 'rem' ? 12 : 200;
  const marginStep = marginType === 'em' || marginType === 'rem' ? 0.1 : 1;
  const paddingMin = paddingType === 'em' || paddingType === 'rem' ? 0 : 0;
  const paddingMax = paddingType === 'em' || paddingType === 'rem' ? 12 : 200;
  const paddingStep = paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1;
  const previewPaddingType = undefined !== paddingType ? paddingType : 'px';
  const previewMarginType = undefined !== marginType ? marginType : 'px';
  const previewMarginTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== topMargin ? topMargin : '', undefined !== topMarginT ? topMarginT : '', undefined !== topMarginM ? topMarginM : '');
  const previewMarginRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== rightMargin ? rightMargin : '', undefined !== rightMarginT ? rightMarginT : '', undefined !== rightMarginM ? rightMarginM : '');
  const previewMarginBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== bottomMargin ? bottomMargin : '', undefined !== bottomMarginT ? bottomMarginT : '', undefined !== bottomMarginM ? bottomMarginM : '');
  const previewMarginLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== leftMargin ? leftMargin : '', undefined !== leftMarginT ? leftMarginT : '', undefined !== leftMarginM ? leftMarginM : '');
  const previewPaddingTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== topPadding ? topPadding : '', undefined !== topPaddingT ? topPaddingT : '', undefined !== topPaddingM ? topPaddingM : '');
  const previewPaddingRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== rightPadding ? rightPadding : '', undefined !== rightPaddingT ? rightPaddingT : '', undefined !== rightPaddingM ? rightPaddingM : '');
  const previewPaddingBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== bottomPadding ? bottomPadding : '', undefined !== bottomPaddingT ? bottomPaddingT : '', undefined !== bottomPaddingM ? bottomPaddingM : '');
  const previewPaddingLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== leftPadding ? leftPadding : '', undefined !== leftPaddingT ? leftPaddingT : '', undefined !== leftPaddingM ? leftPaddingM : '');
  const previewBorderTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== borderWidth ? borderWidth[0] : '', undefined !== tabletBorderWidth ? tabletBorderWidth[0] : '', undefined !== mobileBorderWidth ? mobileBorderWidth[0] : '');
  const previewBorderRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== borderWidth ? borderWidth[1] : '', undefined !== tabletBorderWidth ? tabletBorderWidth[1] : '', undefined !== mobileBorderWidth ? mobileBorderWidth[1] : '');
  const previewBorderBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== borderWidth ? borderWidth[2] : '', undefined !== tabletBorderWidth ? tabletBorderWidth[2] : '', undefined !== mobileBorderWidth ? mobileBorderWidth[2] : '');
  const previewBorderLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== borderWidth ? borderWidth[3] : '', undefined !== tabletBorderWidth ? tabletBorderWidth[3] : '', undefined !== mobileBorderWidth ? mobileBorderWidth[3] : '');
  const previewHoverBorderTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== borderHoverWidth ? borderHoverWidth[0] : '', undefined !== tabletBorderHoverWidth ? tabletBorderHoverWidth[0] : '', undefined !== mobileBorderHoverWidth ? mobileBorderHoverWidth[0] : '');
  const previewHoverBorderRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== borderHoverWidth ? borderHoverWidth[1] : '', undefined !== tabletBorderHoverWidth ? tabletBorderHoverWidth[1] : '', undefined !== mobileBorderHoverWidth ? mobileBorderHoverWidth[1] : '');
  const previewHoverBorderBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== borderHoverWidth ? borderHoverWidth[2] : '', undefined !== tabletBorderHoverWidth ? tabletBorderHoverWidth[2] : '', undefined !== mobileBorderHoverWidth ? mobileBorderHoverWidth[2] : '');
  const previewHoverBorderLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, undefined !== borderHoverWidth ? borderHoverWidth[3] : '', undefined !== tabletBorderHoverWidth ? tabletBorderHoverWidth[3] : '', undefined !== mobileBorderHoverWidth ? mobileBorderHoverWidth[3] : '');
  const previewAlign = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, textAlign && textAlign[0] ? textAlign[0] : '', textAlign && textAlign[1] ? textAlign[1] : '', textAlign && textAlign[2] ? textAlign[2] : '');
  const previewGutter = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, gutter && '' !== gutter[0] ? gutter[0] : '', gutter && '' !== gutter[1] ? gutter[1] : '', gutter && '' !== gutter[2] ? gutter[2] : '');
  const previewDirection = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, direction && '' !== direction[0] ? direction[0] : '', direction && '' !== direction[1] ? direction[1] : '', direction && '' !== direction[2] ? direction[2] : '');
  const previewJustify = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, justifyContent && '' !== justifyContent[0] ? justifyContent[0] : '', justifyContent && '' !== justifyContent[1] ? justifyContent[1] : '', justifyContent && '' !== justifyContent[2] ? justifyContent[2] : '');
  const previewWrap = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, wrapContent && '' !== wrapContent[0] ? wrapContent[0] : '', wrapContent && '' !== wrapContent[1] ? wrapContent[1] : '', wrapContent && '' !== wrapContent[2] ? wrapContent[2] : '');
  const backgroundString = background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(background, backgroundOpacity) : 'transparent';
  const borderString = border ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(border, borderOpacity) : 'transparent';
  const previewMaxWidth = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, maxWidth && maxWidth[0] ? maxWidth[0] : '', maxWidth && maxWidth[1] ? maxWidth[1] : '', maxWidth && maxWidth[2] ? maxWidth[2] : '');
  const previewMinHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, height && height[0] ? height[0] : '', height && height[1] ? height[1] : '', height && height[2] ? height[2] : '');
  const previewStickyOffset = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(previewDevice, stickyOffset && stickyOffset[0] ? stickyOffset[0] : '', stickyOffset && stickyOffset[1] ? stickyOffset[1] : '', stickyOffset && stickyOffset[2] ? stickyOffset[2] : '');
  const previewMinHeightUnit = heightUnit ? heightUnit : 'px';
  const previewMaxWidthUnit = maxWidthUnit ? maxWidthUnit : 'px';
  const previewStickyOffsetUnit = stickyOffsetUnit ? stickyOffsetUnit : 'px';
  const classes = classnames__WEBPACK_IMPORTED_MODULE_3___default()({
    [className]: className,
    'kadence-column': true,
    [`inner-column-${id}`]: id,
    [`kadence-column-${uniqueID}`]: uniqueID,
    [`kadence-section-sticky`]: sticky !== undefined ? sticky : false,
    'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
    'kvs-md-false': vstablet !== 'undefined' && vstablet,
    'kvs-sm-false': vsmobile !== 'undefined' && vsmobile
  });
  const hasBackgroundImage = backgroundImg && backgroundImg[0] && backgroundImg[0].bgImg ? true : false;
  const hasHoverBackgroundImage = backgroundImgHover && backgroundImgHover[0] && backgroundImgHover[0].bgImg ? true : false;
  const hasOverlayImage = overlayImg && overlayImg[0] && overlayImg[0].bgImg ? true : false;
  const hasHoverOverlayImage = overlayImgHover && overlayImgHover[0] && overlayImgHover[0].bgImg ? true : false;
  const verticalAlignOptions = [[{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.VerticalAlignmentIcon, {
      value: 'top',
      isPressed: verticalAlignment === 'top' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Align Top', 'kadence-blocks'),
    isActive: verticalAlignment === 'top' ? true : false,
    onClick: () => {
      if (verticalAlignment === 'top') {
        setAttributes({
          verticalAlignment: ''
        });
      } else {
        setAttributes({
          verticalAlignment: 'top'
        });
      }
    }
  }], [{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.VerticalAlignmentIcon, {
      value: 'middle',
      isPressed: verticalAlignment === 'middle' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Align Middle', 'kadence-blocks'),
    isActive: verticalAlignment === 'middle' ? true : false,
    onClick: () => {
      if (verticalAlignment === 'middle') {
        setAttributes({
          verticalAlignment: ''
        });
      } else {
        setAttributes({
          verticalAlignment: 'middle'
        });
      }
    }
  }], [{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.VerticalAlignmentIcon, {
      value: 'bottom',
      isPressed: verticalAlignment === 'bottom' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Align Bottom', 'kadence-blocks'),
    isActive: verticalAlignment === 'bottom' ? true : false,
    onClick: () => {
      if (verticalAlignment === 'bottom') {
        setAttributes({
          verticalAlignment: ''
        });
      } else {
        setAttributes({
          verticalAlignment: 'bottom'
        });
      }
    }
  }]];
  const innerClasses = classnames__WEBPACK_IMPORTED_MODULE_3___default()({
    'kadence-inner-column-inner': true,
    'aos-animate': true,
    'kt-animation-wrap': true,
    [`kadence-inner-column-direction-${previewDirection ? previewDirection : 'vertical'}`]: true,
    [`kadence-inner-column-text-align-${previewAlign ? previewAlign : 'normal'}`]: true,
    [`kadence-inner-column-vertical-align-${verticalAlignment ? verticalAlignment : 'inherit'}`]: true
  });
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__.useBlockProps)({
    className: classes,
    style: {
      top: sticky && undefined !== previewStickyOffset ? previewStickyOffset + previewStickyOffsetUnit : undefined
    },
    'data-align': !inRowBlock && ('full' === align || 'wide' === align) ? align : undefined,
    'data-vertical-align': 'top' === verticalAlignment || 'middle' === verticalAlignment || 'bottom' === verticalAlignment ? verticalAlignment : undefined
  });
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__.useInnerBlocksProps)({
    className: innerClasses
  }, {
    orientation: direction && direction[0] ? direction[0] : 'vertical',
    templateLock: templateLock ? templateLock : false,
    renderAppender: hasInnerBlocks ? undefined : _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__.InnerBlocks.ButtonBlockAppender
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("style", null, overlayOpacity !== undefined && overlayOpacity !== '' ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { opacity: ${overlayOpacity} }` : '', overlay ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { background-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(overlay)} }` : '', hasOverlayImage ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { background-image: url(${overlayImg[0].bgImg}); }` : '', hasOverlayImage && overlayImg[0].bgImgPosition ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { background-position:${overlayImg[0].bgImgPosition}; }` : '', hasOverlayImage && overlayImg[0].bgImgSize ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { background-size:${overlayImg[0].bgImgSize}; }` : '', hasOverlayImage && overlayImg[0].bgImgRepeat ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { background-repeat:${overlayImg[0].bgImgRepeat}; }` : '', hasOverlayImage && overlayImg[0].bgImgAttachment ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { background-attachment:${overlayImg[0].bgImgAttachment}; }` : '', overlayHoverOpacity !== undefined && overlayHoverOpacity !== '' ? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { opacity: ${overlayHoverOpacity} }` : '', overlayHover ? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { background-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(overlayHover)} }` : '', hasHoverOverlayImage ? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { background-image: url(${overlayImgHover[0].bgImg}); }` : '', hasHoverOverlayImage && overlayImgHover[0].bgImgPosition ? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { background-position:${overlayImgHover[0].bgImgPosition}; }` : '', hasHoverOverlayImage && overlayImgHover[0].bgImgSize ? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { background-size:${overlayImgHover[0].bgImgSize}; }` : '', hasHoverOverlayImage && overlayImgHover[0].bgImgRepeat ? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { background-repeat:${overlayImgHover[0].bgImgRepeat}; }` : '', hasHoverOverlayImage && overlayImgHover[0].bgImgAttachment ? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { background-attachment:${overlayImgHover[0].bgImgAttachment}; }` : '', undefined !== previewMaxWidth && '' !== previewMaxWidth ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner { max-width:${previewMaxWidth + previewMaxWidthUnit}; }` : '', undefined !== previewMaxWidth && '' !== previewMaxWidth ? `.wp-block-kadence-column > .kadence-inner-column-direction-horizontal > .wp-block-kadence-column.kadence-column-${uniqueID} > .kadence-inner-column-inner { max-width:100%; }` : '', undefined !== previewMaxWidth && '' !== previewMaxWidth ? `.wp-block-kadence-column > .kadence-inner-column-direction-horizontal > .wp-block-kadence-column.kadence-column-${uniqueID} { flex: 0 1 ${previewMaxWidth + previewMaxWidthUnit}; }` : '', undefined !== zIndex && '' !== zIndex ? `.kadence-column-${uniqueID} { z-index: ${zIndex}; }` : '', textColor ? `.kadence-column-${uniqueID}, .kadence-column-${uniqueID} p, .kadence-column-${uniqueID} h1, .kadence-column-${uniqueID} h2, .kadence-column-${uniqueID} h3, .kadence-column-${uniqueID} h4, .kadence-column-${uniqueID} h5, .kadence-column-${uniqueID} h6 { color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(textColor)}; }` : '', linkColor ? `.kadence-column-${uniqueID} a { color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(linkColor)}; }` : '', linkHoverColor ? `.kadence-column-${uniqueID} a:hover { color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(linkHoverColor)}; }` : '', '' !== previewGutter ? `.kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal { gap: ${previewGutter + (gutterUnit ? gutterUnit : 'px')}; }` : '', previewJustify ? `.kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal { justify-content: ${previewJustify}; }` : '', previewWrap ? `.kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal { flex-wrap: ${previewWrap}; }` : '', previewJustify && ('space-around' == previewJustify || 'space-between' == previewJustify || 'space-evenly' == previewJustify) ? `.kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal > .block-list-appender { display:none; }` : '', textColorHover ? `.kadence-column-${uniqueID}:hover, .kadence-column-${uniqueID}:hover p, .kadence-column-${uniqueID}:hover h1, .kadence-column-${uniqueID}:hover h2, .kadence-column-${uniqueID}:hover h3, .kadence-column-${uniqueID}:hover h4, .kadence-column-${uniqueID}:hover h5, .kadence-column-${uniqueID}:hover h6 { color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(textColorHover)}; }` : '', linkColorHover ? `.kadence-column-${uniqueID}:hover a { color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(linkColorHover)}; }` : '', linkHoverColorHover ? `.kadence-column-${uniqueID}:hover a:hover { color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(linkHoverColorHover)}; }` : '', hasHoverBackgroundImage ? `.kadence-column-${uniqueID}:hover .kadence-inner-column-inner { background-image: url(${backgroundImgHover[0].bgImg}) !important; }` : '', hasHoverBackgroundImage && backgroundImgHover[0].bgImgPosition ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { background-position:${backgroundImgHover[0].bgImgPosition} !important; }` : '', hasHoverBackgroundImage && backgroundImgHover[0].bgImgSize ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { background-size:${backgroundImgHover[0].bgImgSize} !important; }` : '', hasHoverBackgroundImage && backgroundImgHover[0].bgImgRepeat ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { background-repeat:${backgroundImgHover[0].bgImgRepeat} !important; }` : '', hasHoverBackgroundImage && backgroundImgHover[0].bgImgAttachment ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { background-attachment:${backgroundImgHover[0].bgImgAttachment} !important; }` : '', previewHoverBorderTop ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-top-width:${previewHoverBorderTop}px !important; }` : '', previewHoverBorderRight ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-right-width:${previewHoverBorderRight}px !important; }` : '', previewHoverBorderBottom ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-bottom-width:${previewHoverBorderBottom}px !important; }` : '', previewHoverBorderLeft ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-left-width:${previewHoverBorderLeft}px !important; }` : '', borderHover ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-color:${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(borderHover)} !important; }` : '', borderHoverRadius && undefined !== borderHoverRadius[0] && '' !== borderHoverRadius[0] ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-top-left-radius:${borderHoverRadius[0]}px !important; }` : '', borderHoverRadius && undefined !== borderHoverRadius[1] && '' !== borderHoverRadius[1] ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-top-right-radius:${borderHoverRadius[1]}px !important; }` : '', borderHoverRadius && undefined !== borderHoverRadius[2] && '' !== borderHoverRadius[2] ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-bottom-right-radius:${borderHoverRadius[2]}px !important; }` : '', borderHoverRadius && undefined !== borderHoverRadius[3] && '' !== borderHoverRadius[3] ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-bottom-left-radius:${borderHoverRadius[3]}px !important; }` : '', displayHoverShadow && undefined !== shadowHover && undefined !== shadowHover[0] && undefined !== shadowHover[0].color ? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { box-shadow:${(undefined !== shadowHover[0].inset && shadowHover[0].inset ? 'inset ' : '') + (undefined !== shadowHover[0].hOffset ? shadowHover[0].hOffset : 0) + 'px ' + (undefined !== shadowHover[0].vOffset ? shadowHover[0].vOffset : 0) + 'px ' + (undefined !== shadowHover[0].blur ? shadowHover[0].blur : 14) + 'px ' + (undefined !== shadowHover[0].spread ? shadowHover[0].spread : 0) + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(undefined !== shadowHover[0].color ? shadowHover[0].color : '#000000', undefined !== shadowHover[0].opacity ? shadowHover[0].opacity : 1)} !important; }` : '', kadenceBlockCSS && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, kadenceBlockCSS.replace(/selector/g, `.kadence-column-${uniqueID}`))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('allSettings', 'kadence/column') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__.BlockControls, null, !inRowBlock && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__.BlockAlignmentToolbar, {
    value: align,
    controls: ['wide', 'full'],
    onChange: value => setAttributes({
      align: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.ToolbarGroup, {
    isCollapsed: true,
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.VerticalAlignmentIcon, {
      value: verticalAlignment ? verticalAlignment : direction && direction[0] && direction[0] === 'horizontal' ? 'middle' : 'top'
    }),
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Vertical Align', 'kadence-blocks'),
    controls: verticalAlignOptions
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_copy_paste_style__WEBPACK_IMPORTED_MODULE_7__["default"], {
    onPaste: value => setAttributes(value),
    blockAttributes: attributes
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.InspectorControlTabs, {
    panelName: 'section',
    setActiveTab: setActiveTab,
    activeTab: activeTab
  }), activeTab === 'general' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('textAlign', 'kadence/column') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Flex Align Settings', 'kadence-blocks'),
    panelName: 'kb-col-align-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.SmallResponsiveControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Inner Block Direction', 'kadence-blocks'),
    desktopChildren: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadenceRadioButtons //label={ __( 'Inner Block Direction', 'kadence-blocks' ) }
    , {
      value: direction && direction[0] ? direction[0] : 'vertical',
      options: [{
        value: 'vertical',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Vertical', 'kadence-blocks')
      }, {
        value: 'horizontal',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Horizontal', 'kadence-blocks')
      }],
      onChange: value => setAttributes({
        direction: [value, direction && direction[1] ? direction[1] : '', direction && direction[2] ? direction[2] : '']
      })
    }),
    tabletChildren: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadenceRadioButtons //label={ __( 'Inner Block Direction', 'kadence-blocks' ) }
    , {
      value: direction && direction[1] ? direction[1] : '',
      options: [{
        value: 'vertical',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Vertical', 'kadence-blocks')
      }, {
        value: 'horizontal',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Horizontal', 'kadence-blocks')
      }],
      onChange: value => setAttributes({
        direction: [direction && direction[0] ? direction[0] : 'vertical', value, direction && direction[2] ? direction[2] : '']
      })
    }),
    mobileChildren: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadenceRadioButtons //label={ __( 'Inner Block Direction', 'kadence-blocks' ) }
    , {
      value: direction && direction[2] ? direction[2] : '',
      options: [{
        value: 'vertical',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Vertical', 'kadence-blocks')
      }, {
        value: 'horizontal',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Horizontal', 'kadence-blocks')
      }],
      onChange: value => setAttributes({
        direction: [direction && direction[0] ? direction[0] : 'vertical', direction && direction[1] ? direction[1] : '', value]
      })
    })
  }), (previewDirection ? previewDirection : 'vertical') === 'horizontal' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Default Horizontal Block Gap', 'kadence-blocks'),
    value: gutter && '' !== gutter[0] ? gutter[0] : 10,
    onChange: value => setAttributes({
      gutter: [value, gutter && gutter[1] ? gutter[1] : '', gutter && gutter[2] ? gutter[2] : '']
    }),
    tabletValue: gutter && '' !== gutter[1] ? gutter[1] : '',
    onChangeTablet: value => setAttributes({
      gutter: [gutter && gutter[0] ? gutter[0] : 10, value, gutter && gutter[2] ? gutter[2] : '']
    }),
    mobileValue: gutter && '' !== gutter[2] ? gutter[2] : '',
    onChangeMobile: value => setAttributes({
      gutter: [gutter && gutter[0] ? gutter[0] : 10, gutter && gutter[2] ? gutter[2] : '', value]
    }),
    min: 0,
    max: gutterMax,
    step: gutterStep,
    unit: gutterUnit,
    onUnit: value => setAttributes({
      gutterUnit: value
    }),
    units: ['px', 'em', 'rem']
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.SmallResponsiveControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Justify Content', 'kadence-blocks'),
    desktopChildren: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.SelectControl //label={ __( 'Justify Content', 'kadence-blocks' ) }
    , {
      value: justifyContent && justifyContent[0] ? justifyContent[0] : '',
      options: [{
        value: '',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Inherit', 'kadence-blocks')
      }, {
        value: 'flex-start',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Start', 'kadence-blocks')
      }, {
        value: 'center',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center', 'kadence-blocks')
      }, {
        value: 'flex-end',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('End', 'kadence-blocks')
      }, {
        value: 'space-between',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Space Between', 'kadence-blocks')
      }, {
        value: 'space-around',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Space Around', 'kadence-blocks')
      }, {
        value: 'space-evenly',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Space Evenly', 'kadence-blocks')
      }],
      onChange: value => setAttributes({
        justifyContent: [value, justifyContent && justifyContent[1] ? justifyContent[1] : '', justifyContent && justifyContent[2] ? justifyContent[2] : '']
      })
    }),
    tabletChildren: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.SelectControl //label={ __( 'Justify Content', 'kadence-blocks' ) }
    , {
      value: justifyContent && justifyContent[1] ? justifyContent[1] : '',
      options: [{
        value: '',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Inherit', 'kadence-blocks')
      }, {
        value: 'flex-start',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Start', 'kadence-blocks')
      }, {
        value: 'center',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center', 'kadence-blocks')
      }, {
        value: 'flex-end',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('End', 'kadence-blocks')
      }, {
        value: 'space-between',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Space Between', 'kadence-blocks')
      }, {
        value: 'space-around',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Space Around', 'kadence-blocks')
      }, {
        value: 'space-evenly',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Space Evenly', 'kadence-blocks')
      }],
      onChange: value => setAttributes({
        justifyContent: [justifyContent && justifyContent[0] ? justifyContent[0] : '', value, justifyContent && justifyContent[2] ? justifyContent[2] : '']
      })
    }),
    mobileChildren: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.SelectControl //label={ __( 'Justify Content', 'kadence-blocks' ) }
    , {
      value: justifyContent && justifyContent[2] ? justifyContent[2] : '',
      options: [{
        value: '',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Inherit', 'kadence-blocks')
      }, {
        value: 'flex-start',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Start', 'kadence-blocks')
      }, {
        value: 'center',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center', 'kadence-blocks')
      }, {
        value: 'flex-end',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('End', 'kadence-blocks')
      }, {
        value: 'space-between',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Space Between', 'kadence-blocks')
      }, {
        value: 'space-around',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Space Around', 'kadence-blocks')
      }, {
        value: 'space-evenly',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Space Evenly', 'kadence-blocks')
      }],
      onChange: value => setAttributes({
        justifyContent: [justifyContent && justifyContent[0] ? justifyContent[0] : '', justifyContent && justifyContent[1] ? justifyContent[1] : '', value]
      })
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.SmallResponsiveControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Wrap Content', 'kadence-blocks'),
    desktopChildren: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.SelectControl //label={ __( 'Justify Content', 'kadence-blocks' ) }
    , {
      value: wrapContent && wrapContent[0] ? wrapContent[0] : '',
      options: [{
        value: '',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Inherit', 'kadence-blocks')
      }, {
        value: 'nowrap',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('No Wrap', 'kadence-blocks')
      }, {
        value: 'wrap',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Wrap', 'kadence-blocks')
      }, {
        value: 'wrap-reverse',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Wrap Reverse', 'kadence-blocks')
      }],
      onChange: value => setAttributes({
        wrapContent: [value, wrapContent && wrapContent[1] ? wrapContent[1] : '', wrapContent && wrapContent[2] ? wrapContent[2] : '']
      })
    }),
    tabletChildren: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.SelectControl //label={ __( 'Justify Content', 'kadence-blocks' ) }
    , {
      value: wrapContent && wrapContent[1] ? wrapContent[1] : '',
      options: [{
        value: '',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Inherit', 'kadence-blocks')
      }, {
        value: 'nowrap',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('No Wrap', 'kadence-blocks')
      }, {
        value: 'wrap',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Wrap', 'kadence-blocks')
      }, {
        value: 'wrap-reverse',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Wrap Reverse', 'kadence-blocks')
      }],
      onChange: value => setAttributes({
        wrapContent: [wrapContent && wrapContent[0] ? wrapContent[0] : '', value, wrapContent && wrapContent[2] ? wrapContent[2] : '']
      })
    }),
    mobileChildren: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.SelectControl //label={ __( 'Justify Content', 'kadence-blocks' ) }
    , {
      value: wrapContent && wrapContent[2] ? wrapContent[2] : '',
      options: [{
        value: '',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Inherit', 'kadence-blocks')
      }, {
        value: 'nowrap',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('No Wrap', 'kadence-blocks')
      }, {
        value: 'wrap',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Wrap', 'kadence-blocks')
      }, {
        value: 'wrap-reverse',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Wrap Reverse', 'kadence-blocks')
      }],
      onChange: value => setAttributes({
        wrapContent: [wrapContent && wrapContent[0] ? wrapContent[0] : '', wrapContent && wrapContent[1] ? wrapContent[1] : '', value]
      })
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.ResponsiveAlignControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Text Alignment', 'kadence-blocks'),
    value: textAlign && textAlign[0] ? textAlign[0] : '',
    mobileValue: textAlign && textAlign[2] ? textAlign[2] : '',
    tabletValue: textAlign && textAlign[1] ? textAlign[1] : '',
    onChange: nextAlign => setAttributes({
      textAlign: [nextAlign, textAlign && textAlign[1] ? textAlign[1] : '', textAlign && textAlign[2] ? textAlign[2] : '']
    }),
    onChangeTablet: nextAlign => setAttributes({
      textAlign: [textAlign && textAlign[0] ? textAlign[0] : '', nextAlign, textAlign && textAlign[2] ? textAlign[2] : '']
    }),
    onChangeMobile: nextAlign => setAttributes({
      textAlign: [textAlign && textAlign[0] ? textAlign[0] : '', textAlign && textAlign[1] ? textAlign[1] : '', nextAlign]
    })
  })), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('container', 'kadence/column') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Structure Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-col-container-style-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Container HTML tag', 'kadence-blocks'),
    value: htmlTag,
    options: [{
      value: 'div',
      label: 'div'
    }, {
      value: 'header',
      label: 'header'
    }, {
      value: 'section',
      label: 'section'
    }, {
      value: 'article',
      label: 'article'
    }, {
      value: 'main',
      label: 'main'
    }, {
      value: 'aside',
      label: 'aside'
    }, {
      value: 'footer',
      label: 'footer'
    }],
    onChange: value => setAttributes({
      htmlTag: value
    })
  }), !inRowBlock && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Max Width', 'kadence-blocks'),
    value: undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : '',
    onChange: value => {
      setAttributes({
        maxWidth: [value, undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : '', undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : '']
      });
    },
    tabletValue: undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : '',
    onChangeTablet: value => {
      setAttributes({
        maxWidth: [undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : '', value, undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : '']
      });
    },
    mobileValue: undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : '',
    onChangeMobile: value => {
      setAttributes({
        maxWidth: [undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : '', undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : '', value]
      });
    },
    min: 0,
    max: maxWidthUnit === 'px' ? 2000 : 100,
    step: 1,
    unit: maxWidthUnit ? maxWidthUnit : 'px',
    onUnit: value => {
      setAttributes({
        maxWidthUnit: value
      });
    },
    units: ['px', '%', 'vw']
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Min Height', 'kadence-blocks'),
    value: undefined !== height && undefined !== height[0] ? height[0] : '',
    onChange: value => {
      setAttributes({
        height: [value, undefined !== height && undefined !== height[1] ? height[1] : '', undefined !== height && undefined !== height[2] ? height[2] : '']
      });
    },
    tabletValue: undefined !== height && undefined !== height[1] ? height[1] : '',
    onChangeTablet: value => {
      setAttributes({
        height: [undefined !== height && undefined !== height[0] ? height[0] : '', value, undefined !== height && undefined !== height[2] ? height[2] : '']
      });
    },
    mobileValue: undefined !== height && undefined !== height[2] ? height[2] : '',
    onChangeMobile: value => {
      setAttributes({
        height: [undefined !== height && undefined !== height[0] ? height[0] : '', undefined !== height && undefined !== height[1] ? height[1] : '', value]
      });
    },
    min: 0,
    max: heightUnit === 'px' ? 2000 : 200,
    step: 1,
    unit: heightUnit ? heightUnit : 'px',
    onUnit: value => {
      setAttributes({
        heightUnit: value
      });
    },
    units: ['px', 'vw', 'vh']
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Z Index Control', 'kadence-blocks'),
    value: zIndex,
    onChange: value => {
      setAttributes({
        zIndex: value
      });
    },
    min: -200,
    max: 200
  }))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('overlayLink', 'kadence/column') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Overlay Link', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-col-overlay-link'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
    className: "kadence-sidebar-notice"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Please note, If a link is added nothing else inside of the section will be selectable.', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.URLInputControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Link entire section', 'kadence-blocks'),
    url: link,
    onChangeUrl: value => setAttributes({
      link: value
    }),
    additionalControls: true,
    opensInNewTab: undefined !== linkTarget ? linkTarget : false,
    onChangeTarget: value => setAttributes({
      linkTarget: value
    }),
    linkNoFollow: undefined !== linkNoFollow ? linkNoFollow : false,
    onChangeFollow: value => setAttributes({
      linkNoFollow: value
    }),
    linkSponsored: undefined !== linkSponsored ? linkSponsored : false,
    onChangeSponsored: value => setAttributes({
      linkSponsored: value
    }),
    linkTitle: linkTitle,
    onChangeTitle: value => {
      setAttributes({
        linkTitle: value
      });
    },
    dynamicAttribute: 'link',
    allowClear: true,
    isSelected: isSelected,
    attributes: attributes,
    setAttributes: setAttributes,
    name: 'kadence/column',
    clientId: clientId
  }))), activeTab === 'advanced' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, inRowBlock && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Sticky Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-col-sticky-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Make sticky', 'kadence-blocks'),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('This will stick the section to viewport for the height of outer row block.', 'kadence-blocks'),
    checked: undefined !== sticky ? sticky : false,
    onChange: value => setAttributes({
      sticky: value
    })
  }), sticky && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Sticky Header Offset', 'kadence-blocks'),
    value: undefined !== stickyOffset && undefined !== stickyOffset[0] ? stickyOffset[0] : '',
    onChange: value => {
      setAttributes({
        stickyOffset: [value, undefined !== stickyOffset && undefined !== stickyOffset[1] ? stickyOffset[1] : '', undefined !== stickyOffset && undefined !== stickyOffset[2] ? stickyOffset[2] : '']
      });
    },
    tabletValue: undefined !== stickyOffset && undefined !== stickyOffset[1] ? stickyOffset[1] : '',
    onChangeTablet: value => {
      setAttributes({
        stickyOffset: [undefined !== stickyOffset && undefined !== stickyOffset[0] ? stickyOffset[0] : '', value, undefined !== stickyOffset && undefined !== stickyOffset[2] ? stickyOffset[2] : '']
      });
    },
    mobileValue: undefined !== stickyOffset && undefined !== stickyOffset[2] ? stickyOffset[2] : '',
    onChangeMobile: value => {
      setAttributes({
        stickyOffset: [undefined !== stickyOffset && undefined !== stickyOffset[0] ? stickyOffset[0] : '', undefined !== stickyOffset && undefined !== stickyOffset[1] ? stickyOffset[1] : '', value]
      });
    },
    min: 0,
    max: stickyOffsetUnit === 'px' ? 2000 : 100,
    step: 1,
    unit: stickyOffsetUnit ? stickyOffsetUnit : 'px',
    onUnit: value => {
      setAttributes({
        stickyOffsetUnit: value
      });
    },
    units: ['px', 'rem', 'vh']
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Visibility Settings', 'kadence-blocks'),
    panelName: 'kb-col-visibility-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Hide on Desktop', 'kadence-blocks'),
    checked: undefined !== vsdesk ? vsdesk : false,
    onChange: value => setAttributes({
      vsdesk: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Hide on Tablet', 'kadence-blocks'),
    checked: undefined !== vstablet ? vstablet : false,
    onChange: value => setAttributes({
      vstablet: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Hide on Mobile', 'kadence-blocks'),
    checked: undefined !== vsmobile ? vsmobile : false,
    onChange: value => setAttributes({
      vsmobile: value
    })
  }))), activeTab === 'style' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('paddingMargin', 'kadence/column') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Padding/Margin', 'kadence-blocks'),
    panelName: 'kb-col-padding-margin'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Padding', 'kadence-blocks'),
    control: paddingControl,
    value: [undefined !== topPadding ? topPadding : '', undefined !== rightPadding ? rightPadding : '', undefined !== bottomPadding ? bottomPadding : '', undefined !== leftPadding ? leftPadding : ''],
    tabletValue: [undefined !== topPaddingT ? topPaddingT : '', undefined !== rightPaddingT ? rightPaddingT : '', undefined !== bottomPaddingT ? bottomPaddingT : '', undefined !== leftPaddingT ? leftPaddingT : ''],
    mobileValue: [undefined !== topPaddingM ? topPaddingM : '', undefined !== rightPaddingM ? rightPaddingM : '', undefined !== bottomPaddingM ? bottomPaddingM : '', undefined !== leftPaddingM ? leftPaddingM : ''],
    onChange: value => {
      setAttributes({
        topPadding: value[0],
        rightPadding: value[1],
        bottomPadding: value[2],
        leftPadding: value[3]
      });
    },
    onChangeTablet: value => {
      setAttributes({
        topPaddingT: value[0],
        rightPaddingT: value[1],
        bottomPaddingT: value[2],
        leftPaddingT: value[3]
      });
    },
    onChangeMobile: value => {
      setAttributes({
        topPaddingM: value[0],
        rightPaddingM: value[1],
        bottomPaddingM: value[2],
        leftPaddingM: value[3]
      });
    },
    onChangeControl: value => setPaddingControl(value),
    allowEmpty: true,
    min: paddingMin,
    max: paddingMax,
    step: paddingStep,
    unit: paddingType,
    units: ['px', 'em', 'rem', '%'],
    onUnit: value => setAttributes({
      paddingType: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Margin', 'kadence-blocks'),
    control: marginControl,
    value: [undefined !== topMargin ? topMargin : '', undefined !== rightMargin ? rightMargin : '', undefined !== bottomMargin ? bottomMargin : '', undefined !== leftMargin ? leftMargin : ''],
    tabletValue: [undefined !== topMarginT ? topMarginT : '', undefined !== rightMarginT ? rightMarginT : '', undefined !== bottomMarginT ? bottomMarginT : '', undefined !== leftMarginT ? leftMarginT : ''],
    mobileValue: [undefined !== topMarginM ? topMarginM : '', undefined !== rightMarginM ? rightMarginM : '', undefined !== bottomMarginM ? bottomMarginM : '', undefined !== leftMarginM ? leftMarginM : ''],
    onChange: value => {
      setAttributes({
        topMargin: value[0],
        rightMargin: value[1],
        bottomMargin: value[2],
        leftMargin: value[3]
      });
    },
    onChangeTablet: value => {
      setAttributes({
        topMarginT: value[0],
        rightMarginT: value[1],
        bottomMarginT: value[2],
        leftMarginT: value[3]
      });
    },
    onChangeMobile: value => {
      setAttributes({
        topMarginM: value[0],
        rightMarginM: value[1],
        bottomMarginM: value[2],
        leftMarginM: value[3]
      });
    },
    onChangeControl: value => setMarginControl(value),
    allowEmpty: true,
    min: marginMin,
    max: marginMax,
    step: marginStep,
    unit: marginType,
    units: ['px', 'em', 'rem', '%', 'vh'],
    onUnit: value => setAttributes({
      marginType: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Settings', 'kadence-blocks'),
    initialOpen: !(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('paddingMargin', 'kadence/column'),
    panelName: 'kb-col-bg-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.TabPanel, {
    className: "kt-inspect-tabs kt-hover-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'normal',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Normal', 'kadence-blocks'),
      className: 'kt-normal-tab'
    }, {
      name: 'hover',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Hover', 'kadence-blocks'),
      className: 'kt-hover-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('hover' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Color', 'kadence-blocks'),
          value: backgroundHover ? backgroundHover : '',
          default: '',
          onChange: value => setAttributes({
            backgroundHover: value
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.BackgroundControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Image', 'kadence-blocks'),
          hasImage: hasHoverBackgroundImage,
          imageURL: backgroundImgHover && backgroundImgHover[0] && backgroundImgHover[0].bgImg ? backgroundImgHover[0].bgImg : '',
          imageID: backgroundImgHover && backgroundImgHover[0] && backgroundImgHover[0].bgImgID ? backgroundImgHover[0].bgImgID : '',
          imagePosition: backgroundImgHover && backgroundImgHover[0] && backgroundImgHover[0].bgImgPosition ? backgroundImgHover[0].bgImgPosition : 'center center',
          imageSize: backgroundImgHover && backgroundImgHover[0] && backgroundImgHover[0].bgImgSize ? backgroundImgHover[0].bgImgSize : 'cover',
          imageRepeat: backgroundImgHover && backgroundImgHover[0] && backgroundImgHover[0].bgImgRepeat ? backgroundImgHover[0].bgImgRepeat : 'no-repeat',
          imageAttachment: backgroundImgHover && backgroundImgHover[0] && backgroundImgHover[0].bgImgAttachment ? backgroundImgHover[0].bgImgAttachment : 'scroll',
          onRemoveImage: onRemoveHoverBGImage,
          onSaveImage: img => {
            saveHoverBackgroundImage({
              bgImgID: img.id,
              bgImg: img.url
            });
          },
          onSaveURL: newURL => {
            if (newURL !== (backgroundImgHover && backgroundImgHover[0] && backgroundImgHover[0].bgImg ? backgroundImgHover[0].bgImg : '')) {
              saveHoverBackgroundImage({
                bgImgID: undefined,
                bgImg: newURL
              });
            }
          },
          onSavePosition: value => saveHoverBackgroundImage({
            bgImgPosition: value
          }),
          onSaveSize: value => saveHoverBackgroundImage({
            bgImgSize: value
          }),
          onSaveRepeat: value => saveHoverBackgroundImage({
            bgImgRepeat: value
          }),
          onSaveAttachment: value => saveHoverBackgroundImage({
            bgImgAttachment: value
          }),
          disableMediaButtons: backgroundImgHover && backgroundImgHover[0] && backgroundImgHover[0].bgImg ? backgroundImgHover[0].bgImg : '',
          dynamicAttribute: "backgroundImgHover:0:bgImg",
          isSelected: isSelected,
          attributes: attributes,
          setAttributes: setAttributes,
          name: 'kadence/column',
          clientId: clientId
        }));
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Color', 'kadence-blocks'),
          value: background ? background : '',
          default: '',
          opacityValue: backgroundOpacity,
          onChange: value => setAttributes({
            background: value
          }),
          onOpacityChange: value => setAttributes({
            backgroundOpacity: value
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.BackgroundControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Image', 'kadence-blocks'),
          hasImage: hasBackgroundImage,
          imageURL: backgroundImg && backgroundImg[0] && backgroundImg[0].bgImg ? backgroundImg[0].bgImg : '',
          imageID: backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgID ? backgroundImg[0].bgImgID : '',
          imagePosition: backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgPosition ? backgroundImg[0].bgImgPosition : 'center center',
          imageSize: backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgSize ? backgroundImg[0].bgImgSize : 'cover',
          imageRepeat: backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgRepeat ? backgroundImg[0].bgImgRepeat : 'no-repeat',
          imageAttachment: backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgAttachment ? backgroundImg[0].bgImgAttachment : 'scroll',
          onRemoveImage: onRemoveBGImage,
          onSaveImage: img => {
            saveBackgroundImage({
              bgImgID: img.id,
              bgImg: img.url
            });
          },
          onSaveURL: newURL => {
            if (newURL !== (backgroundImg && backgroundImg[0] && backgroundImg[0].bgImg ? backgroundImg[0].bgImg : '')) {
              saveBackgroundImage({
                bgImgID: undefined,
                bgImg: newURL
              });
            }
          },
          onSavePosition: value => saveBackgroundImage({
            bgImgPosition: value
          }),
          onSaveSize: value => saveBackgroundImage({
            bgImgSize: value
          }),
          onSaveRepeat: value => saveBackgroundImage({
            bgImgRepeat: value
          }),
          onSaveAttachment: value => saveBackgroundImage({
            bgImgAttachment: value
          }),
          disableMediaButtons: backgroundImg && backgroundImg[0] && backgroundImg[0].bgImg ? backgroundImg[0].bgImg : '',
          dynamicAttribute: "backgroundImg:0:bgImg",
          isSelected: isSelected,
          attributes: attributes,
          setAttributes: setAttributes,
          name: 'kadence/column',
          clientId: clientId
        }));
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Overlay Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-col-bg-overlay-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.TabPanel, {
    className: "kt-inspect-tabs kt-hover-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'normal',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Normal', 'kadence-blocks'),
      className: 'kt-normal-tab'
    }, {
      name: 'hover',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Hover', 'kadence-blocks'),
      className: 'kt-hover-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('hover' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Overlay Opacity', 'kadence-blocks'),
          value: overlayHoverOpacity,
          onChange: value => {
            setAttributes({
              overlayHoverOpacity: value
            });
          },
          step: 0.01,
          min: 0,
          max: 1
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Color', 'kadence-blocks'),
          value: overlayHover ? overlayHover : '',
          default: '',
          onChange: value => setAttributes({
            overlayHover: value
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.BackgroundControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Image', 'kadence-blocks'),
          hasImage: hasHoverOverlayImage,
          imageURL: overlayImgHover && overlayImgHover[0] && overlayImgHover[0].bgImg ? overlayImgHover[0].bgImg : '',
          imageID: overlayImgHover && overlayImgHover[0] && overlayImgHover[0].bgImgID ? overlayImgHover[0].bgImgID : '',
          imagePosition: overlayImgHover && overlayImgHover[0] && overlayImgHover[0].bgImgPosition ? overlayImgHover[0].bgImgPosition : 'center center',
          imageSize: overlayImgHover && overlayImgHover[0] && overlayImgHover[0].bgImgSize ? overlayImgHover[0].bgImgSize : 'cover',
          imageRepeat: overlayImgHover && overlayImgHover[0] && overlayImgHover[0].bgImgRepeat ? overlayImgHover[0].bgImgRepeat : 'no-repeat',
          imageAttachment: overlayImgHover && overlayImgHover[0] && overlayImgHover[0].bgImgAttachment ? overlayImgHover[0].bgImgAttachment : 'scroll',
          onRemoveImage: onRemoveHoverOverlayImage,
          onSaveImage: img => {
            saveHoverOverlayImage({
              bgImgID: img.id,
              bgImg: img.url
            });
          },
          onSaveURL: newURL => {
            if (newURL !== (overlayImgHover && overlayImgHover[0] && overlayImgHover[0].bgImg ? overlayImgHover[0].bgImg : '')) {
              saveHoverOverlayImage({
                bgImgID: undefined,
                bgImg: newURL
              });
            }
          },
          onSavePosition: value => saveHoverOverlayImage({
            bgImgPosition: value
          }),
          onSaveSize: value => saveHoverOverlayImage({
            bgImgSize: value
          }),
          onSaveRepeat: value => saveHoverOverlayImage({
            bgImgRepeat: value
          }),
          onSaveAttachment: value => saveHoverOverlayImage({
            bgImgAttachment: value
          }),
          disableMediaButtons: overlayImgHover && overlayImgHover[0] && overlayImgHover[0].bgImg ? overlayImgHover[0].bgImg : '',
          dynamicAttribute: "overlayImgHover:0:bgImg",
          isSelected: isSelected,
          attributes: attributes,
          setAttributes: setAttributes,
          name: 'kadence/column',
          clientId: clientId
        }));
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Overlay Opacity', 'kadence-blocks'),
          value: overlayOpacity,
          onChange: value => {
            setAttributes({
              overlayOpacity: value
            });
          },
          step: 0.01,
          min: 0,
          max: 1
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Color', 'kadence-blocks'),
          value: overlay ? overlay : '',
          default: '',
          onChange: value => setAttributes({
            overlay: value
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.BackgroundControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Image', 'kadence-blocks'),
          hasImage: hasOverlayImage,
          imageURL: overlayImg && overlayImg[0] && overlayImg[0].bgImg ? overlayImg[0].bgImg : '',
          imageID: overlayImg && overlayImg[0] && overlayImg[0].bgImgID ? overlayImg[0].bgImgID : '',
          imagePosition: overlayImg && overlayImg[0] && overlayImg[0].bgImgPosition ? overlayImg[0].bgImgPosition : 'center center',
          imageSize: overlayImg && overlayImg[0] && overlayImg[0].bgImgSize ? overlayImg[0].bgImgSize : 'cover',
          imageRepeat: overlayImg && overlayImg[0] && overlayImg[0].bgImgRepeat ? overlayImg[0].bgImgRepeat : 'no-repeat',
          imageAttachment: overlayImg && overlayImg[0] && overlayImg[0].bgImgAttachment ? overlayImg[0].bgImgAttachment : 'scroll',
          onRemoveImage: onRemoveOverlayImage,
          onSaveImage: img => {
            saveOverlayImage({
              bgImgID: img.id,
              bgImg: img.url
            });
          },
          onSaveURL: newURL => {
            if (newURL !== (overlayImg && overlayImg[0] && overlayImg[0].bgImg ? overlayImg[0].bgImg : '')) {
              saveOverlayImage({
                bgImgID: undefined,
                bgImg: newURL
              });
            }
          },
          onSavePosition: value => saveOverlayImage({
            bgImgPosition: value
          }),
          onSaveSize: value => saveOverlayImage({
            bgImgSize: value
          }),
          onSaveRepeat: value => saveOverlayImage({
            bgImgRepeat: value
          }),
          onSaveAttachment: value => saveOverlayImage({
            bgImgAttachment: value
          }),
          disableMediaButtons: overlayImg && overlayImg[0] && overlayImg[0].bgImg ? overlayImg[0].bgImg : '',
          dynamicAttribute: "overlayImg:0:bgImg",
          isSelected: isSelected,
          attributes: attributes,
          setAttributes: setAttributes,
          name: 'kadence/column',
          clientId: clientId
        }));
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Styles', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-col-border-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.TabPanel, {
    className: "kt-inspect-tabs kt-hover-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'normal',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Normal', 'kadence-blocks'),
      className: 'kt-normal-tab'
    }, {
      name: 'hover',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Hover', 'kadence-blocks'),
      className: 'kt-hover-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('hover' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Color', 'kadence-blocks'),
          value: borderHover ? borderHover : '',
          default: '',
          onChange: value => setAttributes({
            borderHover: value
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.ResponsiveMeasurementControls, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Width', 'kadence-blocks'),
          value: borderHoverWidth,
          control: borderWidthControl,
          tabletValue: tabletBorderHoverWidth,
          mobileValue: mobileBorderHoverWidth,
          onChange: value => setAttributes({
            borderHoverWidth: value
          }),
          onChangeTablet: value => setAttributes({
            tabletBorderHoverWidth: value
          }),
          onChangeMobile: value => setAttributes({
            mobileBorderHoverWidth: value
          }),
          onChangeControl: value => setBorderWidthControl(value),
          min: 0,
          max: 40,
          step: 1,
          unit: 'px',
          units: ['px'],
          showUnit: true,
          preset: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.MeasurementControls, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Radius', 'kadence-blocks'),
          measurement: borderHoverRadius,
          control: borderRadiusControl,
          onChange: value => setAttributes({
            borderHoverRadius: value
          }),
          onControl: value => setBorderRadiusControl(value),
          min: 0,
          max: 200,
          step: 1,
          controlTypes: [{
            key: 'linked',
            name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Linked', 'kadence-blocks'),
            icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.radiusLinkedIcon
          }, {
            key: 'individual',
            name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Individual', 'kadence-blocks'),
            icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.radiusIndividualIcon
          }],
          firstIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.topLeftIcon,
          secondIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.topRightIcon,
          thirdIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.bottomRightIcon,
          fourthIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.bottomLeftIcon
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.BoxShadowControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Box Shadow', 'kadence-blocks'),
          enable: undefined !== displayHoverShadow ? displayHoverShadow : false,
          color: undefined !== shadowHover && undefined !== shadowHover[0] && undefined !== shadowHover[0].color ? shadowHover[0].color : '#000000',
          colorDefault: '#000000',
          onArrayChange: (color, opacity) => {
            saveShadowHover({
              color: color,
              opacity: opacity
            });
          },
          opacity: undefined !== shadowHover && undefined !== shadowHover[0] && undefined !== shadowHover[0].opacity ? shadowHover[0].opacity : 0.2,
          hOffset: undefined !== shadowHover && undefined !== shadowHover[0] && undefined !== shadowHover[0].hOffset ? shadowHover[0].hOffset : 0,
          vOffset: undefined !== shadowHover && undefined !== shadowHover[0] && undefined !== shadowHover[0].vOffset ? shadowHover[0].vOffset : 0,
          blur: undefined !== shadowHover && undefined !== shadowHover[0] && undefined !== shadowHover[0].blur ? shadowHover[0].blur : 14,
          spread: undefined !== shadowHover && undefined !== shadowHover[0] && undefined !== shadowHover[0].spread ? shadowHover[0].spread : 0,
          inset: undefined !== shadowHover && undefined !== shadowHover[0] && undefined !== shadowHover[0].inset ? shadowHover[0].inset : false,
          onEnableChange: value => {
            setAttributes({
              displayHoverShadow: value
            });
          },
          onColorChange: value => {
            saveShadowHover({
              color: value
            });
          },
          onOpacityChange: value => {
            saveShadowHover({
              opacity: value
            });
          },
          onHOffsetChange: value => {
            saveShadowHover({
              hOffset: value
            });
          },
          onVOffsetChange: value => {
            saveShadowHover({
              vOffset: value
            });
          },
          onBlurChange: value => {
            saveShadowHover({
              blur: value
            });
          },
          onSpreadChange: value => {
            saveShadowHover({
              spread: value
            });
          },
          onInsetChange: value => {
            saveShadowHover({
              inset: value
            });
          }
        }));
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Color', 'kadence-blocks'),
          value: border ? border : '',
          default: '',
          opacityValue: borderOpacity,
          onChange: value => setAttributes({
            border: value
          }),
          onOpacityChange: value => setAttributes({
            borderOpacity: value
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.ResponsiveMeasurementControls, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Width', 'kadence-blocks'),
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
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.MeasurementControls, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Radius', 'kadence-blocks'),
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
            name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Linked', 'kadence-blocks'),
            icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.radiusLinkedIcon
          }, {
            key: 'individual',
            name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Individual', 'kadence-blocks'),
            icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.radiusIndividualIcon
          }],
          firstIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.topLeftIcon,
          secondIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.topRightIcon,
          thirdIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.bottomRightIcon,
          fourthIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.bottomLeftIcon
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.BoxShadowControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Box Shadow', 'kadence-blocks'),
          enable: undefined !== displayShadow ? displayShadow : false,
          color: undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].color ? shadow[0].color : '#000000',
          colorDefault: '#000000',
          onArrayChange: (color, opacity) => {
            saveShadow({
              color: color,
              opacity: opacity
            });
          },
          opacity: undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].opacity ? shadow[0].opacity : 0.2,
          hOffset: undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].hOffset ? shadow[0].hOffset : 0,
          vOffset: undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].vOffset ? shadow[0].vOffset : 0,
          blur: undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].blur ? shadow[0].blur : 14,
          spread: undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].spread ? shadow[0].spread : 0,
          inset: undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].inset ? shadow[0].inset : false,
          onEnableChange: value => {
            setAttributes({
              displayShadow: value
            });
          },
          onColorChange: value => {
            saveShadow({
              color: value
            });
          },
          onOpacityChange: value => {
            saveShadow({
              opacity: value
            });
          },
          onHOffsetChange: value => {
            saveShadow({
              hOffset: value
            });
          },
          onVOffsetChange: value => {
            saveShadow({
              vOffset: value
            });
          },
          onBlurChange: value => {
            saveShadow({
              blur: value
            });
          },
          onSpreadChange: value => {
            saveShadow({
              spread: value
            });
          },
          onInsetChange: value => {
            saveShadow({
              inset: value
            });
          }
        }));
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-sidebar-settings-spacer"
  }), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('textColor', 'kadence/column') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Text Color Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-col-text-color-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__.TabPanel, {
    className: "kt-inspect-tabs kt-hover-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'normal',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Normal', 'kadence-blocks'),
      className: 'kt-normal-tab'
    }, {
      name: 'hover',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Hover', 'kadence-blocks'),
      className: 'kt-hover-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('hover' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Text Color', 'kadence-blocks'),
          value: textColorHover ? textColorHover : '',
          default: '',
          onChange: value => setAttributes({
            textColorHover: value
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Text Link Color', 'kadence-blocks'),
          value: linkColorHover ? linkColorHover : '',
          default: '',
          onChange: value => setAttributes({
            linkColorHover: value
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Text Link Hover Color', 'kadence-blocks'),
          value: linkHoverColorHover ? linkHoverColorHover : '',
          default: '',
          onChange: value => setAttributes({
            linkHoverColorHover: value
          })
        }));
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Text Color', 'kadence-blocks'),
          value: textColor ? textColor : '',
          default: '',
          onChange: value => setAttributes({
            textColor: value
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Text Link Color', 'kadence-blocks'),
          value: linkColor ? linkColor : '',
          default: '',
          onChange: value => setAttributes({
            linkColor: value
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Text Link Hover Color', 'kadence-blocks'),
          value: linkHoverColor ? linkHoverColor : '',
          default: '',
          onChange: value => setAttributes({
            linkHoverColor: value
          })
        }));
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  })), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('overlayLink', 'kadence/column') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Overlay Link', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-col-overlay-link'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
    className: "kadence-sidebar-notice"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Please note, If a link is added nothing else inside of the section will be selectable.', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.URLInputControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Link entire section', 'kadence-blocks'),
    url: link,
    onChangeUrl: value => setAttributes({
      link: value
    }),
    additionalControls: true,
    opensInNewTab: undefined !== linkTarget ? linkTarget : false,
    onChangeTarget: value => setAttributes({
      linkTarget: value
    }),
    linkNoFollow: undefined !== linkNoFollow ? linkNoFollow : false,
    onChangeFollow: value => setAttributes({
      linkNoFollow: value
    }),
    linkSponsored: undefined !== linkSponsored ? linkSponsored : false,
    onChangeSponsored: value => setAttributes({
      linkSponsored: value
    }),
    linkTitle: linkTitle,
    onChangeTitle: value => {
      setAttributes({
        linkTitle: value
      });
    },
    dynamicAttribute: 'link',
    allowClear: true,
    isSelected: isSelected,
    attributes: attributes,
    setAttributes: setAttributes,
    name: 'kadence/column',
    clientId: clientId
  }))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_11__.InspectorAdvancedControls, null, inRowBlock && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Mobile Collapse Order'),
    value: collapseOrder,
    onChange: value => {
      setAttributes({
        collapseOrder: value
      });
    },
    min: -10,
    max: 10
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    id: `animate-id${uniqueID}`,
    "data-aos": kadenceAnimation ? kadenceAnimation : undefined,
    "data-aos-duration": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration ? kadenceAOSOptions[0].duration : undefined,
    "data-aos-easing": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing ? kadenceAOSOptions[0].easing : undefined,
    style: {
      minHeight: undefined !== previewMinHeight ? previewMinHeight + previewMinHeightUnit : undefined,
      paddingLeft: undefined !== previewPaddingLeft ? previewPaddingLeft + previewPaddingType : undefined,
      paddingRight: undefined !== previewPaddingRight ? previewPaddingRight + previewPaddingType : undefined,
      paddingTop: undefined !== previewPaddingTop ? previewPaddingTop + previewPaddingType : undefined,
      paddingBottom: undefined !== previewPaddingBottom ? previewPaddingBottom + previewPaddingType : undefined,
      marginLeft: undefined !== previewMarginLeft ? previewMarginLeft + previewMarginType : undefined,
      marginRight: undefined !== previewMarginRight ? previewMarginRight + previewMarginType : undefined,
      marginTop: undefined !== previewMarginTop ? previewMarginTop + previewMarginType : undefined,
      marginBottom: undefined !== previewMarginBottom ? previewMarginBottom + previewMarginType : undefined,
      textAlign: previewAlign ? previewAlign : undefined,
      backgroundColor: backgroundString,
      backgroundImage: hasBackgroundImage ? `url( ${backgroundImg[0].bgImg} )` : undefined,
      backgroundSize: backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgSize ? backgroundImg[0].bgImgSize : undefined,
      backgroundPosition: backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgPosition ? backgroundImg[0].bgImgPosition : undefined,
      backgroundRepeat: backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgRepeat ? backgroundImg[0].bgImgRepeat : undefined,
      backgroundAttachment: backgroundImg && backgroundImg[0] && backgroundImg[0].bgImgAttachment ? backgroundImg[0].bgImgAttachment : undefined,
      borderColor: borderString,
      borderRadius: borderRadius ? borderRadius[0] + 'px ' + borderRadius[1] + 'px ' + borderRadius[2] + 'px ' + borderRadius[3] + 'px' : '',
      borderTopWidth: previewBorderTop ? previewBorderTop + 'px' : undefined,
      borderRightWidth: previewBorderRight ? previewBorderRight + 'px' : undefined,
      borderBottomWidth: previewBorderBottom ? previewBorderBottom + 'px' : undefined,
      borderLeftWidth: previewBorderLeft ? previewBorderLeft + 'px' : undefined,
      boxShadow: undefined !== displayShadow && displayShadow && undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].color ? (undefined !== shadow[0].inset && shadow[0].inset ? 'inset ' : '') + (undefined !== shadow[0].hOffset ? shadow[0].hOffset : 0) + 'px ' + (undefined !== shadow[0].vOffset ? shadow[0].vOffset : 0) + 'px ' + (undefined !== shadow[0].blur ? shadow[0].blur : 14) + 'px ' + (undefined !== shadow[0].spread ? shadow[0].spread : 0) + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(undefined !== shadow[0].color ? shadow[0].color : '#000000', undefined !== shadow[0].opacity ? shadow[0].opacity : 1) : undefined
    }
  }, innerBlocksProps)));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SectionEdit);

/***/ }),

/***/ "./src/blocks/column/index.js":
/*!************************************!*\
  !*** ./src/blocks/column/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/column/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./src/blocks/column/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/blocks/column/block.json");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./save */ "./src/blocks/column/save.js");
/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./deprecated */ "./src/blocks/column/deprecated.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__);
/**
 * Import Icons
 */


/**
 * Import Css
 */


/**
 * Internal dependencies
 */






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('kadence/column', { ..._block_json__WEBPACK_IMPORTED_MODULE_4__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Section', 'kadence-blocks'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('A container to style a section of content.', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('column', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('section', 'kadence-blocks'), 'KB'],
  icon: {
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_0__.blockColumnIcon
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_5__["default"],
  deprecated: _deprecated__WEBPACK_IMPORTED_MODULE_6__["default"]
});

/***/ }),

/***/ "./src/blocks/column/save.js":
/*!***********************************!*\
  !*** ./src/blocks/column/save.js ***!
  \***********************************/
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
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);


/**
 * BLOCK: Kadence Section
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
    id,
    uniqueID,
    vsdesk,
    vstablet,
    vsmobile,
    link,
    linkNoFollow,
    linkSponsored,
    sticky,
    linkTarget,
    linkTitle,
    htmlTag,
    overlay,
    overlayImg,
    overlayHover,
    overlayImgHover,
    align
  } = attributes;
  const hasOverlay = overlay || overlayImg && overlayImg[0] && overlayImg[0].bgImg || overlayHover || overlayImgHover && overlayImgHover[0] && overlayImgHover[0].bgImg ? true : false;
  const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
    [`inner-column-${id}`]: id,
    [`kadence-column${uniqueID}`]: uniqueID,
    'kvs-lg-false': vsdesk !== undefined && vsdesk,
    'kvs-md-false': vstablet !== undefined && vstablet,
    'kvs-sm-false': vsmobile !== undefined && vsmobile,
    'kb-section-has-link': undefined !== link && '' !== link,
    'kb-section-is-sticky': undefined !== sticky && sticky,
    'kb-section-has-overlay': undefined !== hasOverlay && hasOverlay,
    [`align${align}`]: align === 'full' || align === 'wide'
  });
  let relAttr;

  if (linkTarget) {
    relAttr = 'noopener noreferrer';
  }

  if (undefined !== linkNoFollow && true === linkNoFollow) {
    relAttr = relAttr ? relAttr.concat(' nofollow') : 'nofollow';
  }

  if (undefined !== linkSponsored && true === linkSponsored) {
    relAttr = relAttr ? relAttr.concat(' sponsored') : 'sponsored';
  }

  const HtmlTagOut = !htmlTag ? 'div' : htmlTag;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTagOut, _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: classes
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: 'kt-inside-inner-col'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null)), link && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: link,
    className: `kb-section-link-overlay`,
    target: linkTarget ? '_blank' : undefined,
    rel: relAttr ? relAttr : undefined,
    "aria-label": linkTitle ? linkTitle : undefined
  }));
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

/***/ "./src/blocks/column/block.json":
/*!**************************************!*\
  !*** ./src/blocks/column/block.json ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"apiVersion":2,"title":"Section","name":"kadence/column","category":"kadence-blocks","usesContext":["postId","queryId"],"textdomain":"kadence-blocks","attributes":{"id":{"type":"number","default":1},"topPadding":{"type":"number","default":""},"bottomPadding":{"type":"number","default":""},"leftPadding":{"type":"number","default":""},"rightPadding":{"type":"number","default":""},"topPaddingM":{"type":"number","default":""},"bottomPaddingM":{"type":"number","default":""},"leftPaddingM":{"type":"number","default":""},"rightPaddingM":{"type":"number","default":""},"topMargin":{"type":"number","default":""},"bottomMargin":{"type":"number","default":""},"topMarginM":{"type":"number","default":""},"bottomMarginM":{"type":"number","default":""},"leftMargin":{"type":"number","default":""},"rightMargin":{"type":"number","default":""},"leftMarginM":{"type":"number","default":""},"rightMarginM":{"type":"number","default":""},"zIndex":{"type":"number","default":""},"background":{"type":"string","default":""},"backgroundOpacity":{"type":"number","default":1},"border":{"type":"string","default":""},"borderOpacity":{"type":"number","default":1},"borderWidth":{"type":"array","default":[0,0,0,0]},"tabletBorderWidth":{"type":"array","default":["","","",""]},"mobileBorderWidth":{"type":"array","default":["","","",""]},"borderRadius":{"type":"array","default":[0,0,0,0]},"uniqueID":{"type":"string","default":""},"collapseOrder":{"type":"number"},"backgroundImg":{"type":"array","default":[{"bgImg":"","bgImgID":"","bgImgSize":"cover","bgImgPosition":"center center","bgImgAttachment":"scroll","bgImgRepeat":"no-repeat"}]},"textAlign":{"type":"array","default":["","",""]},"textColor":{"type":"string","default":""},"linkColor":{"type":"string","default":""},"linkHoverColor":{"type":"string","default":""},"topPaddingT":{"type":"number","default":""},"bottomPaddingT":{"type":"number","default":""},"leftPaddingT":{"type":"number","default":""},"rightPaddingT":{"type":"number","default":""},"topMarginT":{"type":"number","default":""},"bottomMarginT":{"type":"number","default":""},"leftMarginT":{"type":"number","default":""},"rightMarginT":{"type":"number","default":""},"displayShadow":{"type":"boolean","default":false},"shadow":{"type":"array","default":[{"color":"#000000","opacity":0.2,"spread":0,"blur":14,"hOffset":0,"vOffset":0,"inset":false}]},"noCustomDefaults":{"type":"boolean","default":false},"vsdesk":{"type":"boolean","default":false},"vstablet":{"type":"boolean","default":false},"vsmobile":{"type":"boolean","default":false},"paddingType":{"type":"string","default":"px"},"marginType":{"type":"string","default":"px"},"bgColorClass":{"type":"string","default":""},"templateLock":{"type":"string"},"direction":{"type":"array","default":["","",""]},"justifyContent":{"type":"array","default":["","",""]},"wrapContent":{"type":"array","default":["","",""]},"gutter":{"type":"array","default":["","",""]},"gutterUnit":{"type":"string","default":"px"},"verticalAlignment":{"type":"string"},"backgroundImgHover":{"type":"array","default":[{"bgImg":"","bgImgID":"","bgImgSize":"cover","bgImgPosition":"center center","bgImgAttachment":"scroll","bgImgRepeat":"no-repeat"}]},"backgroundHover":{"type":"string","default":""},"overlayOpacity":{"type":"number","default":0.3},"overlay":{"type":"string","default":""},"overlayImg":{"type":"array","default":[{"bgImg":"","bgImgID":"","bgImgSize":"cover","bgImgPosition":"center center","bgImgAttachment":"scroll","bgImgRepeat":"no-repeat"}]},"overlayHoverOpacity":{"type":"number","default":""},"overlayHover":{"type":"string","default":""},"overlayImgHover":{"type":"array","default":[{"bgImg":"","bgImgID":"","bgImgSize":"cover","bgImgPosition":"center center","bgImgAttachment":"scroll","bgImgRepeat":"no-repeat"}]},"borderHover":{"type":"string","default":""},"borderHoverWidth":{"type":"array","default":["","","",""]},"tabletBorderHoverWidth":{"type":"array","default":["","","",""]},"mobileBorderHoverWidth":{"type":"array","default":["","","",""]},"borderHoverRadius":{"type":"array","default":["","","",""]},"displayHoverShadow":{"type":"boolean","default":false},"shadowHover":{"type":"array","default":[{"color":"#000000","opacity":0.2,"spread":0,"blur":14,"hOffset":0,"vOffset":0,"inset":false}]},"textColorHover":{"type":"string","default":""},"linkColorHover":{"type":"string","default":""},"linkHoverColorHover":{"type":"string","default":""},"link":{"type":"string","default":""},"linkTitle":{"type":"string","default":""},"linkTarget":{"type":"boolean","default":false},"linkNoFollow":{"type":"boolean","default":false},"linkSponsored":{"type":"boolean","default":false},"maxWidth":{"type":"array","default":["","",""]},"maxWidthUnit":{"type":"string","default":"px"},"height":{"type":"array","default":["","",""]},"heightUnit":{"type":"string","default":"px"},"htmlTag":{"type":"string","default":"div"},"inQueryBlock":{"type":"boolean","default":false},"overlayType":{"type":"string","default":"normal"},"sticky":{"type":"boolean","default":false},"stickyOffset":{"type":"array","default":["","",""]},"stickyOffsetUnit":{"type":"string","default":"px"},"align":{"type":"string","default":""}},"supports":{"anchor":true,"ktanimate":true,"ktanimateadd":true,"ktanimatepreview":true,"ktanimateswipe":true,"ktdynamic":true,"kbcss":true,"editorsKitBlockNavigator":true},"editorStyle":"kadence-blocks-column","style":"kadence-blocks-column"}');

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
/******/ 			"blocks-column": 0,
/******/ 			"./style-blocks-column": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-blocks-column"], () => (__webpack_require__("./src/blocks/column/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	(this.kadence = this.kadence || {})["blocks-column"] = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=blocks-column.js.map