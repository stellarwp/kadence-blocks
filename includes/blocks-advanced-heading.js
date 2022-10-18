/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/advanced-heading/editor.scss":
/*!*************************************************!*\
  !*** ./src/blocks/advanced-heading/editor.scss ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/advanced-heading/style.scss":
/*!************************************************!*\
  !*** ./src/blocks/advanced-heading/style.scss ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/advanced-heading/block.js":
/*!**********************************************!*\
  !*** ./src/blocks/advanced-heading/block.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/advanced-heading/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/advanced-heading/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/blocks/advanced-heading/block.json");
/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./deprecated */ "./src/blocks/advanced-heading/deprecated.js");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__);


/**
 * BLOCK: Kadence Advanced Heading
 *
 * Registering a block with Gutenberg.
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
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__.registerBlockType)('kadence/advancedheading', { ..._block_json__WEBPACK_IMPORTED_MODULE_5__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Advanced Text', 'kadence-blocks'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Create a heading or paragraph and define sizes for desktop, tablet and mobile along with font family, colors, etc.', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('title', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('heading', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('text', 'kadence-blocks'), 'KB'],
  icon: {
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.advancedHeadingIcon
  },
  transforms: {
    from: [{
      type: 'block',
      blocks: ['core/paragraph'],
      transform: _ref => {
        let {
          content
        } = _ref;
        return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__.createBlock)('kadence/advancedheading', {
          content
        });
      }
    }, {
      type: 'block',
      blocks: ['core/heading'],
      transform: _ref2 => {
        let {
          content,
          level
        } = _ref2;
        return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__.createBlock)('kadence/advancedheading', {
          content: content,
          level: level
        });
      }
    }],
    to: [{
      type: 'block',
      blocks: ['core/paragraph'],
      transform: _ref3 => {
        let {
          content
        } = _ref3;
        return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__.createBlock)('core/paragraph', {
          content
        });
      }
    }, {
      type: 'block',
      blocks: ['core/heading'],
      transform: _ref4 => {
        let {
          content,
          level
        } = _ref4;
        return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__.createBlock)('core/heading', {
          content: content,
          level: level
        });
      }
    }]
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: props => {
    const {
      attributes: {
        anchor,
        level,
        content,
        colorClass,
        color,
        textShadow,
        letterSpacing,
        topMargin,
        bottomMargin,
        marginType,
        align,
        uniqueID,
        className,
        kadenceAnimation,
        kadenceAOSOptions,
        htmlTag,
        link,
        linkNoFollow,
        linkSponsored,
        linkTarget,
        backgroundColorClass,
        linkStyle
      }
    } = props;
    const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
    const textColorClass = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.getColorClassName)('color', colorClass);
    const textBackgroundColorClass = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.getColorClassName)('background-color', backgroundColorClass);
    const revealAnimation = kadenceAnimation && ('reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation) ? true : false;
    const wrapper = revealAnimation ? true : false;
    const classes = classnames__WEBPACK_IMPORTED_MODULE_2___default()({
      [`kt-adv-heading${uniqueID}`]: uniqueID,
      [className]: !wrapper && !link && className,
      [(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__.getBlockDefaultClassName)('kadence/advancedheading')]: (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__.getBlockDefaultClassName)('kadence/advancedheading'),
      [textColorClass]: textColorClass,
      'has-text-color': textColorClass,
      [textBackgroundColorClass]: textBackgroundColorClass,
      'has-background': textBackgroundColorClass,
      [`hls-${linkStyle}`]: !link && linkStyle
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
    } //const readyContent = ( link ? `<a href="${link}" class="kb-advanced-heading-link"${ linkTarget ? ' target="_blank"' : '' }${ relAttr ? ` rel="${relAttr}"` : '' }>${content}</a>` : content );


    const htmlItem = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.RichText.Content, {
      tagName: tagName,
      id: anchor ? anchor : undefined,
      className: classes,
      "data-kb-block": `kb-adv-heading${uniqueID}`,
      "data-aos": kadenceAnimation ? kadenceAnimation : undefined,
      "data-aos-offset": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].offset ? kadenceAOSOptions[0].offset : undefined,
      "data-aos-duration": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration ? kadenceAOSOptions[0].duration : undefined,
      "data-aos-delay": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].delay ? kadenceAOSOptions[0].delay : undefined,
      "data-aos-easing": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing ? kadenceAOSOptions[0].easing : undefined,
      "data-aos-once": kadenceAOSOptions && kadenceAOSOptions[0] && undefined !== kadenceAOSOptions[0].once && '' !== kadenceAOSOptions[0].once ? kadenceAOSOptions[0].once : undefined,
      value: content
    });
    const linkHTMLItem = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: link,
      className: `kb-advanced-heading-link kt-adv-heading-link${uniqueID}${!wrapper && className ? ' ' + className : ''}${linkStyle ? ' hls-' + linkStyle : ''}`,
      target: linkTarget ? '_blank' : undefined,
      rel: relAttr ? relAttr : undefined
    }, htmlItem);
    const readyContent = link ? linkHTMLItem : htmlItem;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.useBlockProps.save({});
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, blockProps, wrapper && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kb-adv-heading-wrap${uniqueID} kadence-advanced-heading-wrapper${revealAnimation ? ' kadence-heading-clip-animation' : ''}${className ? ' ' + className : ''}`
    }, readyContent), !wrapper && readyContent);
  },
  deprecated: _deprecated__WEBPACK_IMPORTED_MODULE_6__["default"]
});

/***/ }),

/***/ "./src/blocks/advanced-heading/copy-paste-style.js":
/*!*********************************************************!*\
  !*** ./src/blocks/advanced-heading/copy-paste-style.js ***!
  \*********************************************************/
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

class HeadingStyleCopyPaste extends _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component {
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
    const headingCopiedStyles = JSON.parse(localStorage.getItem('kadenceHeadingStyle'));

    const copyAction = () => {
      const copyStyles = {};

      if (blockAttributes.level) {
        copyStyles.level = blockAttributes.level;
      }

      if (blockAttributes.align) {
        copyStyles.align = blockAttributes.align;
      }

      if (blockAttributes.color) {
        copyStyles.color = blockAttributes.color;
      }

      if (blockAttributes.size) {
        copyStyles.size = blockAttributes.size;
      }

      if (blockAttributes.sizeType) {
        copyStyles.sizeType = blockAttributes.sizeType;
      }

      if (blockAttributes.lineHeight) {
        copyStyles.lineHeight = blockAttributes.lineHeight;
      }

      if (blockAttributes.lineType) {
        copyStyles.lineType = blockAttributes.lineType;
      }

      if (blockAttributes.tabSize) {
        copyStyles.tabSize = blockAttributes.tabSize;
      }

      if (blockAttributes.tabLineHeight) {
        copyStyles.tabLineHeight = blockAttributes.tabLineHeight;
      }

      if (blockAttributes.mobileSize) {
        copyStyles.mobileSize = blockAttributes.mobileSize;
      }

      if (blockAttributes.mobileLineHeight) {
        copyStyles.mobileLineHeight = blockAttributes.mobileLineHeight;
      }

      if (blockAttributes.letterSpacing) {
        copyStyles.letterSpacing = blockAttributes.letterSpacing;
      }

      if (blockAttributes.typography) {
        copyStyles.typography = blockAttributes.typography;
      }

      if (blockAttributes.googleFont) {
        copyStyles.googleFont = blockAttributes.googleFont;
      }

      if (blockAttributes.loadGoogleFont) {
        copyStyles.loadGoogleFont = blockAttributes.loadGoogleFont;
      }

      if (blockAttributes.fontSubset) {
        copyStyles.fontSubset = blockAttributes.fontSubset;
      }

      if (blockAttributes.fontVariant) {
        copyStyles.fontVariant = blockAttributes.fontVariant;
      }

      if (blockAttributes.fontWeight) {
        copyStyles.fontWeight = blockAttributes.fontWeight;
      }

      if (blockAttributes.fontStyle) {
        copyStyles.fontStyle = blockAttributes.fontStyle;
      }

      if (undefined !== blockAttributes.topMargin && '' !== blockAttributes.topMargin) {
        copyStyles.topMargin = blockAttributes.topMargin;
      }

      if (undefined !== blockAttributes.bottomMargin && '' !== blockAttributes.bottomMargin) {
        copyStyles.bottomMargin = blockAttributes.bottomMargin;
      }

      if (undefined !== blockAttributes.leftMargin && '' !== blockAttributes.leftMargin) {
        copyStyles.leftMargin = blockAttributes.leftMargin;
      }

      if (undefined !== blockAttributes.rightMargin && '' !== blockAttributes.rightMargin) {
        copyStyles.rightMargin = blockAttributes.rightMargin;
      }

      if (blockAttributes.tabletMargin) {
        copyStyles.tabletMargin = blockAttributes.tabletMargin;
      }

      if (blockAttributes.mobileMargin) {
        copyStyles.mobileMargin = blockAttributes.mobileMargin;
      }

      if (blockAttributes.tabletMarginType) {
        copyStyles.tabletMarginType = blockAttributes.tabletMarginType;
      }

      if (blockAttributes.mobileMarginType) {
        copyStyles.mobileMarginType = blockAttributes.mobileMarginType;
      }

      if (blockAttributes.marginType) {
        copyStyles.marginType = blockAttributes.marginType;
      }

      if (blockAttributes.paddingType) {
        copyStyles.paddingType = blockAttributes.paddingType;
      }

      if (blockAttributes.padding) {
        copyStyles.padding = blockAttributes.padding;
      }

      if (blockAttributes.tabletPadding) {
        copyStyles.tabletPadding = blockAttributes.tabletPadding;
      }

      if (blockAttributes.mobilePadding) {
        copyStyles.mobilePadding = blockAttributes.mobilePadding;
      }

      if (blockAttributes.markSize) {
        copyStyles.markSize = blockAttributes.markSize;
      }

      if (blockAttributes.markSizeType) {
        copyStyles.markSizeType = blockAttributes.markSizeType;
      }

      if (blockAttributes.markLineHeight) {
        copyStyles.markLineHeight = blockAttributes.markLineHeight;
      }

      if (blockAttributes.markLineType) {
        copyStyles.markLineType = blockAttributes.markLineType;
      }

      if (blockAttributes.marginType) {
        copyStyles.marginType = blockAttributes.marginType;
      }

      if (blockAttributes.markLetterSpacing) {
        copyStyles.markLetterSpacing = blockAttributes.markLetterSpacing;
      }

      if (blockAttributes.markTypography) {
        copyStyles.markTypography = blockAttributes.markTypography;
      }

      if (blockAttributes.markGoogleFont) {
        copyStyles.markGoogleFont = blockAttributes.markGoogleFont;
      }

      if (blockAttributes.markLoadGoogleFont) {
        copyStyles.markLoadGoogleFont = blockAttributes.markLoadGoogleFont;
      }

      if (blockAttributes.markFontSubset) {
        copyStyles.markFontSubset = blockAttributes.markFontSubset;
      }

      if (blockAttributes.markFontVariant) {
        copyStyles.markFontVariant = blockAttributes.markFontVariant;
      }

      if (blockAttributes.markFontWeight) {
        copyStyles.markFontWeight = blockAttributes.markFontWeight;
      }

      if (blockAttributes.markFontStyle) {
        copyStyles.markFontStyle = blockAttributes.markFontStyle;
      }

      if (blockAttributes.markColor) {
        copyStyles.markColor = blockAttributes.markColor;
      }

      if (blockAttributes.markBG) {
        copyStyles.markBG = blockAttributes.markBG;
      }

      if (blockAttributes.markBGOpacity) {
        copyStyles.markBGOpacity = blockAttributes.markBGOpacity;
      }

      if (blockAttributes.markPadding) {
        copyStyles.markPadding = blockAttributes.markPadding;
      }

      if (blockAttributes.markPaddingControl) {
        copyStyles.markPaddingControl = blockAttributes.markPaddingControl;
      }

      if (blockAttributes.markBorder) {
        copyStyles.markBorder = blockAttributes.markBorder;
      }

      if (blockAttributes.markBorderOpacity) {
        copyStyles.markBorderOpacity = blockAttributes.markBorderOpacity;
      }

      if (blockAttributes.markBorderWidth) {
        copyStyles.markBorderWidth = blockAttributes.markBorderWidth;
      }

      if (blockAttributes.markBorderStyle) {
        copyStyles.markBorderStyle = blockAttributes.markBorderStyle;
      }

      if (blockAttributes.textTransform) {
        copyStyles.textTransform = blockAttributes.textTransform;
      }

      if (blockAttributes.markTextTransform) {
        copyStyles.markTextTransform = blockAttributes.markTextTransform;
      }

      if (blockAttributes.anchor) {
        copyStyles.anchor = blockAttributes.anchor;
      }

      if (blockAttributes.colorClass) {
        copyStyles.colorClass = blockAttributes.colorClass;
      }

      if (blockAttributes.tabletAlign) {
        copyStyles.tabletAlign = blockAttributes.tabletAlign;
      }

      if (blockAttributes.mobileAlign) {
        copyStyles.mobileAlign = blockAttributes.mobileAlign;
      }

      if (blockAttributes.textShadow) {
        copyStyles.textShadow = blockAttributes.textShadow;
      }

      if (blockAttributes.background) {
        copyStyles.background = blockAttributes.background;
      }

      if (blockAttributes.backgroundColorClass) {
        copyStyles.backgroundColorClass = blockAttributes.backgroundColorClass;
      }

      localStorage.setItem('kadenceHeadingStyle', JSON.stringify(copyStyles));
    };

    const pasteAction = () => {
      const pasteItem = JSON.parse(localStorage.getItem('kadenceHeadingStyle'));

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
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.MenuGroup, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.MenuItem, {
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HeadingStyleCopyPaste);

/***/ }),

/***/ "./src/blocks/advanced-heading/deprecated.js":
/*!***************************************************!*\
  !*** ./src/blocks/advanced-heading/deprecated.js ***!
  \***************************************************/
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
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__);


/**
 * BLOCK: Kadence Advanced Heading
 *
 * Depreciated.
 */





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([{
  attributes: {
    content: {
      type: 'string',
      source: 'html',
      selector: 'h1,h2,h3,h4,h5,h6,p'
    },
    level: {
      type: 'number',
      default: 2
    },
    uniqueID: {
      type: 'string'
    },
    align: {
      type: 'string'
    },
    color: {
      type: 'string'
    },
    size: {
      type: 'number'
    },
    sizeType: {
      type: 'string',
      default: 'px'
    },
    lineHeight: {
      type: 'number'
    },
    lineType: {
      type: 'string',
      default: 'px'
    },
    tabSize: {
      type: 'number'
    },
    tabLineHeight: {
      type: 'number'
    },
    mobileSize: {
      type: 'number'
    },
    mobileLineHeight: {
      type: 'number'
    },
    letterSpacing: {
      type: 'number'
    },
    typography: {
      type: 'string',
      default: ''
    },
    googleFont: {
      type: 'boolean',
      default: false
    },
    loadGoogleFont: {
      type: 'boolean',
      default: true
    },
    fontSubset: {
      type: 'string',
      default: ''
    },
    fontVariant: {
      type: 'string',
      default: ''
    },
    fontWeight: {
      type: 'string',
      default: ''
    },
    fontStyle: {
      type: 'string',
      default: 'normal'
    },
    topMargin: {
      type: 'number',
      default: ''
    },
    bottomMargin: {
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
    marginType: {
      type: 'string',
      default: 'px'
    },
    tabletMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    mobileMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    tabletMarginType: {
      type: 'string',
      default: 'px'
    },
    mobileMarginType: {
      type: 'string',
      default: 'px'
    },
    paddingType: {
      type: 'string',
      default: 'px'
    },
    padding: {
      type: 'array',
      default: ['', '', '', '']
    },
    tabletPadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    mobilePadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    markSize: {
      type: 'array',
      default: ['', '', '']
    },
    markSizeType: {
      type: 'string',
      default: 'px'
    },
    markLineHeight: {
      type: 'array',
      default: ['', '', '']
    },
    markLineType: {
      type: 'string',
      default: 'px'
    },
    markLetterSpacing: {
      type: 'number'
    },
    markTypography: {
      type: 'string',
      default: ''
    },
    markGoogleFont: {
      type: 'boolean',
      default: false
    },
    markLoadGoogleFont: {
      type: 'boolean',
      default: true
    },
    markFontSubset: {
      type: 'string',
      default: ''
    },
    markFontVariant: {
      type: 'string',
      default: ''
    },
    markFontWeight: {
      type: 'string',
      default: ''
    },
    markFontStyle: {
      type: 'string',
      default: 'normal'
    },
    markColor: {
      type: 'string',
      default: '#f76a0c'
    },
    markBG: {
      type: 'string'
    },
    markBGOpacity: {
      type: 'number',
      default: 1
    },
    markPadding: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    markTabPadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    markMobilePadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    markPaddingControl: {
      type: 'string',
      default: 'linked'
    },
    markBorder: {
      type: 'string'
    },
    markBorderOpacity: {
      type: 'number',
      default: 1
    },
    markBorderWidth: {
      type: 'number',
      default: 0
    },
    markBorderStyle: {
      type: 'string',
      default: 'solid'
    },
    textTransform: {
      type: 'string',
      default: ''
    },
    markTextTransform: {
      type: 'string',
      default: ''
    },
    anchor: {
      type: 'string'
    },
    colorClass: {
      type: 'string'
    },
    tabletAlign: {
      type: 'string'
    },
    mobileAlign: {
      type: 'string'
    },
    textShadow: {
      type: 'array',
      default: [{
        enable: false,
        color: 'rgba(0, 0, 0, 0.2)',
        blur: 1,
        hOffset: 1,
        vOffset: 1
      }]
    },
    htmlTag: {
      type: 'string',
      default: 'heading'
    },
    loadItalic: {
      type: 'boolean',
      default: false
    },
    link: {
      type: 'string'
    },
    linkTarget: {
      type: 'boolean',
      default: false
    },
    linkNoFollow: {
      type: 'boolean',
      default: false
    },
    linkSponsored: {
      type: 'boolean',
      default: false
    },
    background: {
      type: 'string'
    },
    backgroundColorClass: {
      type: 'string'
    },
    linkStyle: {
      type: 'string'
    },
    linkColor: {
      type: 'string'
    },
    linkHoverColor: {
      type: 'string'
    },
    inQueryBlock: {
      type: 'bool',
      default: false
    }
  },
  save: _ref => {
    let {
      attributes
    } = _ref;
    const {
      anchor,
      level,
      content,
      colorClass,
      color,
      textShadow,
      letterSpacing,
      topMargin,
      bottomMargin,
      marginType,
      align,
      uniqueID,
      className,
      kadenceAnimation,
      kadenceAOSOptions,
      htmlTag,
      link,
      linkNoFollow,
      linkSponsored,
      linkTarget,
      backgroundColorClass,
      linkStyle
    } = attributes;
    const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
    const mType = marginType ? marginType : 'px';
    const textColorClass = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', colorClass);
    const textBackgroundColorClass = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', backgroundColorClass);
    const revealAnimation = kadenceAnimation && ('reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation) ? true : false;
    const wrapper = revealAnimation ? true : false;
    const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      [`kt-adv-heading${uniqueID}`]: uniqueID,
      [className]: !wrapper && !link && className,
      [(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading')]: (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading'),
      [textColorClass]: textColorClass,
      'has-text-color': textColorClass,
      [textBackgroundColorClass]: textBackgroundColorClass,
      'has-background': textBackgroundColorClass,
      [`hls-${linkStyle}`]: !link && linkStyle
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
    } //const readyContent = ( link ? `<a href="${link}" class="kb-advanced-heading-link"${ linkTarget ? ' target="_blank"' : '' }${ relAttr ? ` rel="${relAttr}"` : '' }>${content}</a>` : content );


    const htmlItem = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.Content, {
      tagName: tagName,
      id: anchor ? anchor : undefined,
      className: classes,
      "data-kb-block": `kb-adv-heading${uniqueID}`,
      "data-aos": kadenceAnimation ? kadenceAnimation : undefined,
      "data-aos-offset": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].offset ? kadenceAOSOptions[0].offset : undefined,
      "data-aos-duration": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration ? kadenceAOSOptions[0].duration : undefined,
      "data-aos-delay": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].delay ? kadenceAOSOptions[0].delay : undefined,
      "data-aos-easing": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing ? kadenceAOSOptions[0].easing : undefined,
      "data-aos-once": kadenceAOSOptions && kadenceAOSOptions[0] && undefined !== kadenceAOSOptions[0].once && '' !== kadenceAOSOptions[0].once ? kadenceAOSOptions[0].once : undefined,
      value: content
    });
    const linkHTMLItem = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: link,
      className: `kb-advanced-heading-link kt-adv-heading-link${uniqueID}${!wrapper && className ? ' ' + className : ''}${linkStyle ? ' hls-' + linkStyle : ''}`,
      target: linkTarget ? '_blank' : undefined,
      relAttr: relAttr ? relAttr : undefined
    }, htmlItem);
    const readyContent = link ? linkHTMLItem : htmlItem;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, wrapper && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kb-adv-heading-wrap${uniqueID} kadence-advanced-heading-wrapper${revealAnimation ? ' kadence-heading-clip-animation' : ''}${className ? ' ' + className : ''}`
    }, readyContent), !wrapper && readyContent);
  }
}, {
  attributes: {
    content: {
      type: 'string',
      source: 'html',
      selector: 'h1,h2,h3,h4,h5,h6,p'
    },
    level: {
      type: 'number',
      default: 2
    },
    uniqueID: {
      type: 'string'
    },
    align: {
      type: 'string'
    },
    color: {
      type: 'string'
    },
    size: {
      type: 'number'
    },
    sizeType: {
      type: 'string',
      default: 'px'
    },
    lineHeight: {
      type: 'number'
    },
    lineType: {
      type: 'string',
      default: 'px'
    },
    tabSize: {
      type: 'number'
    },
    tabLineHeight: {
      type: 'number'
    },
    mobileSize: {
      type: 'number'
    },
    mobileLineHeight: {
      type: 'number'
    },
    letterSpacing: {
      type: 'number'
    },
    typography: {
      type: 'string',
      default: ''
    },
    googleFont: {
      type: 'boolean',
      default: false
    },
    loadGoogleFont: {
      type: 'boolean',
      default: true
    },
    fontSubset: {
      type: 'string',
      default: ''
    },
    fontVariant: {
      type: 'string',
      default: ''
    },
    fontWeight: {
      type: 'string',
      default: 'regular'
    },
    fontStyle: {
      type: 'string',
      default: 'normal'
    },
    topMargin: {
      type: 'number',
      default: ''
    },
    bottomMargin: {
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
    marginType: {
      type: 'string',
      default: 'px'
    },
    tabletMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    mobileMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    tabletMarginType: {
      type: 'string',
      default: 'px'
    },
    mobileMarginType: {
      type: 'string',
      default: 'px'
    },
    paddingType: {
      type: 'string',
      default: 'px'
    },
    padding: {
      type: 'array',
      default: ['', '', '', '']
    },
    tabletPadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    mobilePadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    markSize: {
      type: 'array',
      default: ['', '', '']
    },
    markSizeType: {
      type: 'string',
      default: 'px'
    },
    markLineHeight: {
      type: 'array',
      default: ['', '', '']
    },
    markLineType: {
      type: 'string',
      default: 'px'
    },
    markLetterSpacing: {
      type: 'number'
    },
    markTypography: {
      type: 'string',
      default: ''
    },
    markGoogleFont: {
      type: 'boolean',
      default: false
    },
    markLoadGoogleFont: {
      type: 'boolean',
      default: true
    },
    markFontSubset: {
      type: 'string',
      default: ''
    },
    markFontVariant: {
      type: 'string',
      default: ''
    },
    markFontWeight: {
      type: 'string',
      default: 'regular'
    },
    markFontStyle: {
      type: 'string',
      default: 'normal'
    },
    markColor: {
      type: 'string',
      default: '#f76a0c'
    },
    markBG: {
      type: 'string'
    },
    markBGOpacity: {
      type: 'number',
      default: 1
    },
    markPadding: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    markTabPadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    markMobilePadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    markPaddingControl: {
      type: 'string',
      default: 'linked'
    },
    markBorder: {
      type: 'string'
    },
    markBorderOpacity: {
      type: 'number',
      default: 1
    },
    markBorderWidth: {
      type: 'number',
      default: 0
    },
    markBorderStyle: {
      type: 'string',
      default: 'solid'
    },
    textTransform: {
      type: 'string',
      default: ''
    },
    markTextTransform: {
      type: 'string',
      default: ''
    },
    anchor: {
      type: 'string'
    },
    colorClass: {
      type: 'string'
    },
    tabletAlign: {
      type: 'string'
    },
    mobileAlign: {
      type: 'string'
    },
    textShadow: {
      type: 'array',
      default: [{
        enable: false,
        color: 'rgba(0, 0, 0, 0.2)',
        blur: 1,
        hOffset: 1,
        vOffset: 1
      }]
    },
    htmlTag: {
      type: 'string',
      default: 'heading'
    },
    loadItalic: {
      type: 'boolean',
      default: false
    },
    link: {
      type: 'string'
    },
    linkTarget: {
      type: 'boolean',
      default: false
    },
    linkNoFollow: {
      type: 'boolean',
      default: false
    },
    linkSponsored: {
      type: 'boolean',
      default: false
    },
    background: {
      type: 'string'
    },
    backgroundColorClass: {
      type: 'string'
    }
  },
  save: _ref2 => {
    let {
      attributes
    } = _ref2;
    const {
      anchor,
      level,
      content,
      colorClass,
      color,
      textShadow,
      letterSpacing,
      topMargin,
      bottomMargin,
      marginType,
      align,
      uniqueID,
      className,
      kadenceAnimation,
      kadenceAOSOptions,
      htmlTag,
      link,
      linkNoFollow,
      linkSponsored,
      linkTarget,
      backgroundColorClass,
      linkStyle
    } = attributes;
    const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
    const mType = marginType ? marginType : 'px';
    const textColorClass = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', colorClass);
    const textBackgroundColorClass = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', backgroundColorClass);
    const revealAnimation = kadenceAnimation && ('reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation) ? true : false;
    const wrapper = revealAnimation ? true : false;
    const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      [`kt-adv-heading${uniqueID}`]: uniqueID,
      [className]: !wrapper && !link && className,
      [(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading')]: (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading'),
      [textColorClass]: textColorClass,
      'has-text-color': textColorClass,
      [textBackgroundColorClass]: textBackgroundColorClass,
      'has-background': textBackgroundColorClass
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
    } //const readyContent = ( link ? `<a href="${link}" class="kb-advanced-heading-link"${ linkTarget ? ' target="_blank"' : '' }${ relAttr ? ` rel="${relAttr}"` : '' }>${content}</a>` : content );


    const htmlItem = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.Content, {
      tagName: tagName,
      id: anchor ? anchor : undefined,
      className: classes,
      "data-kb-block": `kb-adv-heading${uniqueID}`,
      "data-aos": kadenceAnimation ? kadenceAnimation : undefined,
      "data-aos-offset": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].offset ? kadenceAOSOptions[0].offset : undefined,
      "data-aos-duration": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration ? kadenceAOSOptions[0].duration : undefined,
      "data-aos-delay": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].delay ? kadenceAOSOptions[0].delay : undefined,
      "data-aos-easing": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing ? kadenceAOSOptions[0].easing : undefined,
      "data-aos-once": kadenceAOSOptions && kadenceAOSOptions[0] && undefined !== kadenceAOSOptions[0].once && '' !== kadenceAOSOptions[0].once ? kadenceAOSOptions[0].once : undefined,
      value: content
    });
    const linkHTMLItem = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: link,
      className: 'kb-advanced-heading-link',
      target: linkTarget ? '_blank' : undefined,
      relAttr: relAttr ? relAttr : undefined
    }, htmlItem);
    const readyContent = link ? linkHTMLItem : htmlItem;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, wrapper && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kb-adv-heading-wrap${uniqueID} kadence-advanced-heading-wrapper${revealAnimation ? ' kadence-heading-clip-animation' : ''}${className ? ' ' + className : ''}`
    }, readyContent), !wrapper && readyContent);
  }
}, {
  attributes: {
    content: {
      type: 'string',
      source: 'html',
      selector: 'h1,h2,h3,h4,h5,h6,p'
    },
    level: {
      type: 'number',
      default: 2
    },
    uniqueID: {
      type: 'string'
    },
    align: {
      type: 'string'
    },
    color: {
      type: 'string'
    },
    size: {
      type: 'number'
    },
    sizeType: {
      type: 'string',
      default: 'px'
    },
    lineHeight: {
      type: 'number'
    },
    lineType: {
      type: 'string',
      default: 'px'
    },
    tabSize: {
      type: 'number'
    },
    tabLineHeight: {
      type: 'number'
    },
    mobileSize: {
      type: 'number'
    },
    mobileLineHeight: {
      type: 'number'
    },
    letterSpacing: {
      type: 'number'
    },
    typography: {
      type: 'string',
      default: ''
    },
    googleFont: {
      type: 'boolean',
      default: false
    },
    loadGoogleFont: {
      type: 'boolean',
      default: true
    },
    fontSubset: {
      type: 'string',
      default: ''
    },
    fontVariant: {
      type: 'string',
      default: ''
    },
    fontWeight: {
      type: 'string',
      default: 'regular'
    },
    fontStyle: {
      type: 'string',
      default: 'normal'
    },
    topMargin: {
      type: 'number',
      default: ''
    },
    bottomMargin: {
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
    marginType: {
      type: 'string',
      default: 'px'
    },
    tabletMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    mobileMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    tabletMarginType: {
      type: 'string',
      default: 'px'
    },
    mobileMarginType: {
      type: 'string',
      default: 'px'
    },
    paddingType: {
      type: 'string',
      default: 'px'
    },
    padding: {
      type: 'array',
      default: ['', '', '', '']
    },
    tabletPadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    mobilePadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    markSize: {
      type: 'array',
      default: ['', '', '']
    },
    markSizeType: {
      type: 'string',
      default: 'px'
    },
    markLineHeight: {
      type: 'array',
      default: ['', '', '']
    },
    markLineType: {
      type: 'string',
      default: 'px'
    },
    markLetterSpacing: {
      type: 'number'
    },
    markTypography: {
      type: 'string',
      default: ''
    },
    markGoogleFont: {
      type: 'boolean',
      default: false
    },
    markLoadGoogleFont: {
      type: 'boolean',
      default: true
    },
    markFontSubset: {
      type: 'string',
      default: ''
    },
    markFontVariant: {
      type: 'string',
      default: ''
    },
    markFontWeight: {
      type: 'string',
      default: 'regular'
    },
    markFontStyle: {
      type: 'string',
      default: 'normal'
    },
    markColor: {
      type: 'string',
      default: '#f76a0c'
    },
    markBG: {
      type: 'string'
    },
    markBGOpacity: {
      type: 'number',
      default: 1
    },
    markPadding: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    markTabPadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    markMobilePadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    markPaddingControl: {
      type: 'string',
      default: 'linked'
    },
    markBorder: {
      type: 'string'
    },
    markBorderOpacity: {
      type: 'number',
      default: 1
    },
    markBorderWidth: {
      type: 'number',
      default: 0
    },
    markBorderStyle: {
      type: 'string',
      default: 'solid'
    },
    textTransform: {
      type: 'string',
      default: ''
    },
    markTextTransform: {
      type: 'string',
      default: ''
    },
    anchor: {
      type: 'string'
    },
    colorClass: {
      type: 'string'
    },
    tabletAlign: {
      type: 'string'
    },
    mobileAlign: {
      type: 'string'
    },
    textShadow: {
      type: 'array',
      default: [{
        enable: false,
        color: 'rgba(0, 0, 0, 0.2)',
        blur: 1,
        hOffset: 1,
        vOffset: 1
      }]
    },
    htmlTag: {
      type: 'string',
      default: 'heading'
    },
    loadItalic: {
      type: 'boolean',
      default: false
    },
    link: {
      type: 'string'
    },
    linkTarget: {
      type: 'boolean',
      default: false
    },
    linkNoFollow: {
      type: 'boolean',
      default: false
    },
    linkSponsored: {
      type: 'boolean',
      default: false
    },
    background: {
      type: 'string'
    },
    backgroundColorClass: {
      type: 'string'
    }
  },
  save: _ref3 => {
    let {
      attributes
    } = _ref3;
    const {
      anchor,
      level,
      content,
      colorClass,
      color,
      textShadow,
      letterSpacing,
      topMargin,
      bottomMargin,
      marginType,
      align,
      uniqueID,
      className,
      kadenceAnimation,
      kadenceAOSOptions,
      htmlTag,
      link,
      linkNoFollow,
      linkSponsored,
      linkTarget,
      backgroundColorClass
    } = attributes;
    const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
    const mType = marginType ? marginType : 'px';
    const textColorClass = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', colorClass);
    const textBackgroundColorClass = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('background-color', backgroundColorClass);
    const revealAnimation = kadenceAnimation && ('reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation) ? true : false;
    const wrapper = revealAnimation ? true : false;
    const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      [`kt-adv-heading${uniqueID}`]: uniqueID,
      [className]: !wrapper && className,
      [(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading')]: (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading'),
      [textColorClass]: textColorClass,
      'has-text-color': textColorClass,
      [textBackgroundColorClass]: textBackgroundColorClass,
      'has-background': textBackgroundColorClass
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

    const htmlItem = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.Content, {
      tagName: tagName,
      id: anchor ? anchor : undefined,
      className: classes,
      "data-kb-block": `kb-adv-heading${uniqueID}`,
      "data-aos": kadenceAnimation ? kadenceAnimation : undefined,
      "data-aos-offset": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].offset ? kadenceAOSOptions[0].offset : undefined,
      "data-aos-duration": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration ? kadenceAOSOptions[0].duration : undefined,
      "data-aos-delay": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].delay ? kadenceAOSOptions[0].delay : undefined,
      "data-aos-easing": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing ? kadenceAOSOptions[0].easing : undefined,
      "data-aos-once": kadenceAOSOptions && kadenceAOSOptions[0] && undefined !== kadenceAOSOptions[0].once && '' !== kadenceAOSOptions[0].once ? kadenceAOSOptions[0].once : undefined,
      value: content
    });
    const linkHTMLItem = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: link,
      className: 'kb-advanced-heading-link',
      target: linkTarget ? '_blank' : undefined,
      relAttr: relAttr ? relAttr : undefined
    }, htmlItem);
    const readyContent = link ? linkHTMLItem : htmlItem;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, wrapper && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kb-adv-heading-wrap${uniqueID} kadence-advanced-heading-wrapper${revealAnimation ? ' kadence-heading-clip-animation' : ''}${className ? ' ' + className : ''}`
    }, readyContent), !wrapper && readyContent);
  }
}, {
  attributes: {
    content: {
      type: 'string',
      source: 'html',
      selector: 'h1,h2,h3,h4,h5,h6,p'
    },
    level: {
      type: 'number',
      default: 2
    },
    uniqueID: {
      type: 'string'
    },
    align: {
      type: 'string'
    },
    color: {
      type: 'string'
    },
    size: {
      type: 'number'
    },
    sizeType: {
      type: 'string',
      default: 'px'
    },
    lineHeight: {
      type: 'number'
    },
    lineType: {
      type: 'string',
      default: 'px'
    },
    tabSize: {
      type: 'number'
    },
    tabLineHeight: {
      type: 'number'
    },
    mobileSize: {
      type: 'number'
    },
    mobileLineHeight: {
      type: 'number'
    },
    letterSpacing: {
      type: 'number'
    },
    typography: {
      type: 'string',
      default: ''
    },
    googleFont: {
      type: 'boolean',
      default: false
    },
    loadGoogleFont: {
      type: 'boolean',
      default: true
    },
    fontSubset: {
      type: 'string',
      default: ''
    },
    fontVariant: {
      type: 'string',
      default: ''
    },
    fontWeight: {
      type: 'string',
      default: 'regular'
    },
    fontStyle: {
      type: 'string',
      default: 'normal'
    },
    topMargin: {
      type: 'number',
      default: ''
    },
    bottomMargin: {
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
    marginType: {
      type: 'string',
      default: 'px'
    },
    tabletMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    mobileMargin: {
      type: 'array',
      default: ['', '', '', '']
    },
    tabletMarginType: {
      type: 'string',
      default: 'px'
    },
    mobileMarginType: {
      type: 'string',
      default: 'px'
    },
    paddingType: {
      type: 'string',
      default: 'px'
    },
    padding: {
      type: 'array',
      default: ['', '', '', '']
    },
    tabletPadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    mobilePadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    markSize: {
      type: 'array',
      default: ['', '', '']
    },
    markSizeType: {
      type: 'string',
      default: 'px'
    },
    markLineHeight: {
      type: 'array',
      default: ['', '', '']
    },
    markLineType: {
      type: 'string',
      default: 'px'
    },
    markLetterSpacing: {
      type: 'number'
    },
    markTypography: {
      type: 'string',
      default: ''
    },
    markGoogleFont: {
      type: 'boolean',
      default: false
    },
    markLoadGoogleFont: {
      type: 'boolean',
      default: true
    },
    markFontSubset: {
      type: 'string',
      default: ''
    },
    markFontVariant: {
      type: 'string',
      default: ''
    },
    markFontWeight: {
      type: 'string',
      default: 'regular'
    },
    markFontStyle: {
      type: 'string',
      default: 'normal'
    },
    markColor: {
      type: 'string',
      default: '#f76a0c'
    },
    markBG: {
      type: 'string'
    },
    markBGOpacity: {
      type: 'number',
      default: 1
    },
    markPadding: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    markTabPadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    markMobilePadding: {
      type: 'array',
      default: ['', '', '', '']
    },
    markPaddingControl: {
      type: 'string',
      default: 'linked'
    },
    markBorder: {
      type: 'string'
    },
    markBorderOpacity: {
      type: 'number',
      default: 1
    },
    markBorderWidth: {
      type: 'number',
      default: 0
    },
    markBorderStyle: {
      type: 'string',
      default: 'solid'
    },
    textTransform: {
      type: 'string',
      default: ''
    },
    markTextTransform: {
      type: 'string',
      default: ''
    },
    anchor: {
      type: 'string'
    },
    colorClass: {
      type: 'string'
    },
    tabletAlign: {
      type: 'string'
    },
    mobileAlign: {
      type: 'string'
    },
    textShadow: {
      type: 'array',
      default: [{
        enable: false,
        color: 'rgba(0, 0, 0, 0.2)',
        blur: 1,
        hOffset: 1,
        vOffset: 1
      }]
    },
    htmlTag: {
      type: 'string',
      default: 'heading'
    },
    loadItalic: {
      type: 'boolean',
      default: false
    }
  },
  save: _ref4 => {
    let {
      attributes
    } = _ref4;
    const {
      anchor,
      level,
      content,
      colorClass,
      color,
      textShadow,
      letterSpacing,
      topMargin,
      bottomMargin,
      marginType,
      align,
      uniqueID,
      className,
      kadenceAnimation,
      kadenceAOSOptions,
      htmlTag
    } = attributes;
    const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
    const mType = marginType ? marginType : 'px';
    const textColorClass = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', colorClass);
    const revealAnimation = kadenceAnimation && ('reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation) ? true : false;
    const wrapper = revealAnimation ? true : false;
    const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      [`kt-adv-heading${uniqueID}`]: uniqueID,
      [className]: !wrapper && className,
      [(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading')]: (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading'),
      [textColorClass]: textColorClass
    });
    const htmlItem = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.Content, {
      tagName: tagName,
      id: anchor ? anchor : undefined,
      className: classes,
      "data-kb-block": `kb-adv-heading${uniqueID}`,
      "data-aos": kadenceAnimation ? kadenceAnimation : undefined,
      "data-aos-offset": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].offset ? kadenceAOSOptions[0].offset : undefined,
      "data-aos-duration": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration ? kadenceAOSOptions[0].duration : undefined,
      "data-aos-delay": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].delay ? kadenceAOSOptions[0].delay : undefined,
      "data-aos-easing": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing ? kadenceAOSOptions[0].easing : undefined,
      "data-aos-once": kadenceAOSOptions && kadenceAOSOptions[0] && undefined !== kadenceAOSOptions[0].once && '' !== kadenceAOSOptions[0].once ? kadenceAOSOptions[0].once : undefined,
      value: content
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, wrapper && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kb-adv-heading-wrap${uniqueID} kadence-advanced-heading-wrapper${revealAnimation ? ' kadence-heading-clip-animation' : ''}${className ? ' ' + className : ''}`
    }, htmlItem), !wrapper && htmlItem);
  }
}, {
  attributes: {
    content: {
      type: 'string',
      source: 'html',
      selector: 'h1,h2,h3,h4,h5,h6,p'
    },
    level: {
      type: 'number',
      default: 2
    },
    uniqueID: {
      type: 'string'
    },
    align: {
      type: 'string'
    },
    color: {
      type: 'string'
    },
    size: {
      type: 'number'
    },
    sizeType: {
      type: 'string',
      default: 'px'
    },
    lineHeight: {
      type: 'number'
    },
    lineType: {
      type: 'string',
      default: 'px'
    },
    tabSize: {
      type: 'number'
    },
    tabLineHeight: {
      type: 'number'
    },
    mobileSize: {
      type: 'number'
    },
    mobileLineHeight: {
      type: 'number'
    },
    letterSpacing: {
      type: 'number'
    },
    typography: {
      type: 'string',
      default: ''
    },
    googleFont: {
      type: 'boolean',
      default: false
    },
    loadGoogleFont: {
      type: 'boolean',
      default: true
    },
    fontSubset: {
      type: 'string',
      default: ''
    },
    fontVariant: {
      type: 'string',
      default: ''
    },
    fontWeight: {
      type: 'string',
      default: 'regular'
    },
    fontStyle: {
      type: 'string',
      default: 'normal'
    },
    topMargin: {
      type: 'number',
      default: ''
    },
    bottomMargin: {
      type: 'number',
      default: ''
    },
    marginType: {
      type: 'string',
      default: 'px'
    },
    markSize: {
      type: 'array',
      default: ['', '', '']
    },
    markSizeType: {
      type: 'string',
      default: 'px'
    },
    markLineHeight: {
      type: 'array',
      default: ['', '', '']
    },
    markLineType: {
      type: 'string',
      default: 'px'
    },
    markLetterSpacing: {
      type: 'number'
    },
    markTypography: {
      type: 'string',
      default: ''
    },
    markGoogleFont: {
      type: 'boolean',
      default: false
    },
    markLoadGoogleFont: {
      type: 'boolean',
      default: true
    },
    markFontSubset: {
      type: 'string',
      default: ''
    },
    markFontVariant: {
      type: 'string',
      default: ''
    },
    markFontWeight: {
      type: 'string',
      default: 'regular'
    },
    markFontStyle: {
      type: 'string',
      default: 'normal'
    },
    markColor: {
      type: 'string',
      default: '#f76a0c'
    },
    markBG: {
      type: 'string'
    },
    markBGOpacity: {
      type: 'number',
      default: 1
    },
    markPadding: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    markPaddingControl: {
      type: 'string',
      default: 'linked'
    },
    markBorder: {
      type: 'string'
    },
    markBorderOpacity: {
      type: 'number',
      default: 1
    },
    markBorderWidth: {
      type: 'number',
      default: 0
    },
    markBorderStyle: {
      type: 'string',
      default: 'solid'
    },
    textTransform: {
      type: 'string',
      default: ''
    },
    markTextTransform: {
      type: 'string',
      default: ''
    },
    anchor: {
      type: 'string'
    },
    colorClass: {
      type: 'string'
    },
    textShadow: {
      type: 'array',
      default: [{
        enable: false,
        color: 'rgba(0, 0, 0, 0.2)',
        blur: 1,
        hOffset: 1,
        vOffset: 1
      }]
    },
    htmlTag: {
      type: 'string',
      default: 'heading'
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
    }
  },
  save: _ref5 => {
    let {
      attributes
    } = _ref5;
    const {
      anchor,
      align,
      level,
      content,
      color,
      colorClass,
      textShadow,
      uniqueID,
      letterSpacing,
      topMargin,
      bottomMargin,
      marginType,
      className,
      kadenceAnimation,
      kadenceAOSOptions,
      htmlTag
    } = attributes; //const tagName = 'h' + level;

    const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
    const textColorClass = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.getColorClassName)('color', colorClass);
    const mType = marginType ? marginType : 'px';
    let tagId = anchor ? anchor : `kt-adv-heading${uniqueID}`;
    const revealAnimation = kadenceAnimation && ('reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation) ? true : false;
    const wrapper = anchor || revealAnimation ? true : false;
    tagId = revealAnimation && !anchor ? `kt-adv-inner-heading${uniqueID}` : tagId; //const classes = ( ! wrapper && className ? `${ className } ${ getBlockDefaultClassName( 'kadence/advancedheading' ) }` : getBlockDefaultClassName( 'kadence/advancedheading' ) );

    const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      [`kt-adv-heading${uniqueID}`]: uniqueID,
      [className]: !wrapper && className,
      [(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading')]: (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading'),
      [textColorClass]: textColorClass
    });
    const htmlItem = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.Content, {
      tagName: tagName,
      id: tagId,
      className: classes,
      "data-aos": kadenceAnimation ? kadenceAnimation : undefined,
      "data-aos-offset": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].offset ? kadenceAOSOptions[0].offset : undefined,
      "data-aos-duration": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration ? kadenceAOSOptions[0].duration : undefined,
      "data-aos-delay": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].delay ? kadenceAOSOptions[0].delay : undefined,
      "data-aos-easing": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing ? kadenceAOSOptions[0].easing : undefined,
      "data-aos-once": kadenceAOSOptions && kadenceAOSOptions[0] && undefined !== kadenceAOSOptions[0].once && '' !== kadenceAOSOptions[0].once ? kadenceAOSOptions[0].once : undefined,
      style: {
        textAlign: align,
        color: !textColorClass && color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(color) : undefined,
        letterSpacing: letterSpacing ? letterSpacing + 'px' : undefined,
        marginTop: undefined !== topMargin && '' !== topMargin ? topMargin + mType : undefined,
        marginBottom: undefined !== bottomMargin && '' !== bottomMargin ? bottomMargin + mType : undefined,
        textShadow: undefined !== textShadow && undefined !== textShadow[0] && undefined !== textShadow[0].enable && textShadow[0].enable ? (undefined !== textShadow[0].hOffset ? textShadow[0].hOffset : 1) + 'px ' + (undefined !== textShadow[0].vOffset ? textShadow[0].vOffset : 1) + 'px ' + (undefined !== textShadow[0].blur ? textShadow[0].blur : 1) + 'px ' + (undefined !== textShadow[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_2__.KadenceColorOutput)(textShadow[0].color) : 'rgba(0,0,0,0.2)') : undefined
      },
      value: content
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, wrapper && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      id: `kt-adv-heading${uniqueID}`,
      className: `kadence-advanced-heading-wrapper${revealAnimation ? ' kadence-heading-clip-animation' : ''}${className ? ' ' + className : ''}`
    }, htmlItem), !wrapper && htmlItem);
  }
}, {
  attributes: {
    content: {
      type: 'string',
      source: 'html',
      selector: 'h1,h2,h3,h4,h5,h6'
    },
    level: {
      type: 'number',
      default: 2
    },
    uniqueID: {
      type: 'string'
    },
    align: {
      type: 'string'
    },
    color: {
      type: 'string'
    },
    size: {
      type: 'number'
    },
    sizeType: {
      type: 'string',
      default: 'px'
    },
    lineHeight: {
      type: 'number'
    },
    lineType: {
      type: 'string',
      default: 'px'
    },
    tabSize: {
      type: 'number'
    },
    tabLineHeight: {
      type: 'number'
    },
    mobileSize: {
      type: 'number'
    },
    mobileLineHeight: {
      type: 'number'
    },
    letterSpacing: {
      type: 'number'
    },
    typography: {
      type: 'string',
      default: ''
    },
    googleFont: {
      type: 'boolean',
      default: false
    },
    loadGoogleFont: {
      type: 'boolean',
      default: true
    },
    fontSubset: {
      type: 'string',
      default: ''
    },
    fontVariant: {
      type: 'string',
      default: ''
    },
    fontWeight: {
      type: 'string',
      default: 'regular'
    },
    fontStyle: {
      type: 'string',
      default: 'normal'
    },
    topMargin: {
      type: 'number',
      default: ''
    },
    bottomMargin: {
      type: 'number',
      default: ''
    },
    marginType: {
      type: 'string',
      default: 'px'
    },
    markSize: {
      type: 'array',
      default: ['', '', '']
    },
    markSizeType: {
      type: 'string',
      default: 'px'
    },
    markLineHeight: {
      type: 'array',
      default: ['', '', '']
    },
    markLineType: {
      type: 'string',
      default: 'px'
    },
    markLetterSpacing: {
      type: 'number'
    },
    markTypography: {
      type: 'string',
      default: ''
    },
    markGoogleFont: {
      type: 'boolean',
      default: false
    },
    markLoadGoogleFont: {
      type: 'boolean',
      default: true
    },
    markFontSubset: {
      type: 'string',
      default: ''
    },
    markFontVariant: {
      type: 'string',
      default: ''
    },
    markFontWeight: {
      type: 'string',
      default: 'regular'
    },
    markFontStyle: {
      type: 'string',
      default: 'normal'
    },
    markColor: {
      type: 'string',
      default: '#f76a0c'
    },
    markBG: {
      type: 'string'
    },
    markBGOpacity: {
      type: 'number',
      default: 1
    },
    markPadding: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    markPaddingControl: {
      type: 'string',
      default: 'linked'
    },
    markBorder: {
      type: 'string'
    },
    markBorderOpacity: {
      type: 'number',
      default: 1
    },
    markBorderWidth: {
      type: 'number',
      default: 0
    },
    markBorderStyle: {
      type: 'string',
      default: 'solid'
    },
    textTransform: {
      type: 'string',
      default: ''
    },
    markTextTransform: {
      type: 'string',
      default: ''
    },
    anchor: {
      type: 'string'
    }
  },
  save: _ref6 => {
    let {
      attributes
    } = _ref6;
    const {
      anchor,
      align,
      level,
      content,
      color,
      uniqueID,
      letterSpacing,
      topMargin,
      bottomMargin,
      marginType,
      className,
      kadenceAnimation,
      kadenceAOSOptions
    } = attributes;
    const tagName = 'h' + level;
    const mType = marginType ? marginType : 'px';
    let tagId = anchor ? anchor : `kt-adv-heading${uniqueID}`;
    const revealAnimation = kadenceAnimation && ('reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation) ? true : false;
    const wrapper = anchor || revealAnimation ? true : false;
    tagId = revealAnimation && !anchor ? `kt-adv-inner-heading${uniqueID}` : tagId;
    const classes = className ? `${className} ${(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading')}` : (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading');
    const htmlItem = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.Content, {
      tagName: tagName,
      id: tagId,
      className: `kt-adv-heading${uniqueID} ${classes}`,
      "data-aos": kadenceAnimation ? kadenceAnimation : undefined,
      "data-aos-offset": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].offset ? kadenceAOSOptions[0].offset : undefined,
      "data-aos-duration": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration ? kadenceAOSOptions[0].duration : undefined,
      "data-aos-delay": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].delay ? kadenceAOSOptions[0].delay : undefined,
      "data-aos-easing": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing ? kadenceAOSOptions[0].easing : undefined,
      "data-aos-once": kadenceAOSOptions && kadenceAOSOptions[0] && undefined !== kadenceAOSOptions[0].once && '' !== kadenceAOSOptions[0].once ? kadenceAOSOptions[0].once : undefined,
      style: {
        textAlign: align,
        color: color,
        letterSpacing: letterSpacing ? letterSpacing + 'px' : undefined,
        marginTop: undefined !== topMargin && '' !== topMargin ? topMargin + mType : undefined,
        marginBottom: undefined !== bottomMargin && '' !== bottomMargin ? bottomMargin + mType : undefined
      },
      value: content
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, wrapper && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      id: `kt-adv-heading${uniqueID}`,
      className: `kadence-advanced-heading-wrapper${revealAnimation ? ' kadence-heading-clip-animation' : ''}`
    }, htmlItem), !wrapper && htmlItem);
  }
}, {
  attributes: {
    content: {
      type: 'string',
      source: 'html',
      selector: 'h1,h2,h3,h4,h5,h6'
    },
    level: {
      type: 'number',
      default: 2
    },
    uniqueID: {
      type: 'string'
    },
    align: {
      type: 'string'
    },
    color: {
      type: 'string'
    },
    size: {
      type: 'number'
    },
    sizeType: {
      type: 'string',
      default: 'px'
    },
    lineHeight: {
      type: 'number'
    },
    lineType: {
      type: 'string',
      default: 'px'
    },
    tabSize: {
      type: 'number'
    },
    tabLineHeight: {
      type: 'number'
    },
    mobileSize: {
      type: 'number'
    },
    mobileLineHeight: {
      type: 'number'
    },
    letterSpacing: {
      type: 'number'
    },
    typography: {
      type: 'string',
      default: ''
    },
    googleFont: {
      type: 'boolean',
      default: false
    },
    loadGoogleFont: {
      type: 'boolean',
      default: true
    },
    fontSubset: {
      type: 'string',
      default: ''
    },
    fontVariant: {
      type: 'string',
      default: ''
    },
    fontWeight: {
      type: 'string',
      default: 'regular'
    },
    fontStyle: {
      type: 'string',
      default: 'normal'
    },
    topMargin: {
      type: 'number',
      default: ''
    },
    bottomMargin: {
      type: 'number',
      default: ''
    },
    marginType: {
      type: 'string',
      default: 'px'
    },
    markSize: {
      type: 'array',
      default: ['', '', '']
    },
    markSizeType: {
      type: 'string',
      default: 'px'
    },
    markLineHeight: {
      type: 'array',
      default: ['', '', '']
    },
    markLineType: {
      type: 'string',
      default: 'px'
    },
    markLetterSpacing: {
      type: 'number'
    },
    markTypography: {
      type: 'string',
      default: ''
    },
    markGoogleFont: {
      type: 'boolean',
      default: false
    },
    markLoadGoogleFont: {
      type: 'boolean',
      default: true
    },
    markFontSubset: {
      type: 'string',
      default: ''
    },
    markFontVariant: {
      type: 'string',
      default: ''
    },
    markFontWeight: {
      type: 'string',
      default: 'regular'
    },
    markFontStyle: {
      type: 'string',
      default: 'normal'
    },
    markColor: {
      type: 'string',
      default: '#f76a0c'
    },
    markBG: {
      type: 'string'
    },
    markBGOpacity: {
      type: 'number',
      default: 1
    },
    markPadding: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    markPaddingControl: {
      type: 'string',
      default: 'linked'
    },
    markBorder: {
      type: 'string'
    },
    markBorderOpacity: {
      type: 'number',
      default: 1
    },
    markBorderWidth: {
      type: 'number',
      default: 0
    },
    markBorderStyle: {
      type: 'string',
      default: 'solid'
    },
    textTransform: {
      type: 'string',
      default: ''
    },
    markTextTransform: {
      type: 'string',
      default: ''
    },
    anchor: {
      type: 'string'
    }
  },
  save: _ref7 => {
    let {
      attributes
    } = _ref7;
    const {
      anchor,
      align,
      level,
      content,
      color,
      uniqueID,
      letterSpacing,
      topMargin,
      bottomMargin,
      marginType,
      className,
      kadenceAnimation,
      kadenceAOSOptions
    } = attributes;
    const tagName = 'h' + level;
    const mType = marginType ? marginType : 'px';
    let tagId = anchor ? anchor : `kt-adv-heading${uniqueID}`;
    const revealAnimation = kadenceAnimation && ('reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation) ? true : false;
    const wrapper = anchor || revealAnimation ? true : false;
    tagId = revealAnimation && !anchor ? `kt-adv-inner-heading${uniqueID}` : tagId;
    const classes = className ? `${className} ${(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading')}` : (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading');
    const htmlItem = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.Content, {
      tagName: tagName,
      id: tagId,
      className: `kt-adv-heading${uniqueID} ${classes}`,
      "data-aos": kadenceAnimation ? kadenceAnimation : undefined,
      "data-aos-offset": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].offset ? kadenceAOSOptions[0].offset : undefined,
      "data-aos-duration": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration ? kadenceAOSOptions[0].duration : undefined,
      "data-aos-delay": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].delay ? kadenceAOSOptions[0].delay : undefined,
      "data-aos-easing": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing ? kadenceAOSOptions[0].easing : undefined,
      "data-aos-once": kadenceAOSOptions && kadenceAOSOptions[0] && undefined !== kadenceAOSOptions[0].once && '' !== kadenceAOSOptions[0].once ? kadenceAOSOptions[0].once : undefined,
      style: {
        textAlign: align,
        color: color,
        letterSpacing: letterSpacing ? letterSpacing + 'px' : undefined,
        marginTop: topMargin ? topMargin + mType : undefined,
        marginBottom: bottomMargin ? bottomMargin + mType : undefined
      },
      value: content
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, wrapper && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      id: `kt-adv-heading${uniqueID}`,
      className: `kadence-advanced-heading-wrapper${revealAnimation ? ' kadence-heading-clip-animation' : ''}`
    }, htmlItem), !wrapper && htmlItem);
  }
}, {
  attributes: {
    content: {
      type: 'array',
      source: 'children',
      selector: 'h1,h2,h3,h4,h5,h6'
    },
    level: {
      type: 'number',
      default: 2
    },
    uniqueID: {
      type: 'string'
    },
    align: {
      type: 'string'
    },
    color: {
      type: 'string'
    },
    size: {
      type: 'number'
    },
    sizeType: {
      type: 'string',
      default: 'px'
    },
    lineHeight: {
      type: 'number'
    },
    lineType: {
      type: 'string',
      default: 'px'
    },
    tabSize: {
      type: 'number'
    },
    tabLineHeight: {
      type: 'number'
    },
    mobileSize: {
      type: 'number'
    },
    mobileLineHeight: {
      type: 'number'
    },
    letterSpacing: {
      type: 'number'
    },
    typography: {
      type: 'string',
      default: ''
    },
    googleFont: {
      type: 'boolean',
      default: false
    },
    loadGoogleFont: {
      type: 'boolean',
      default: true
    },
    fontSubset: {
      type: 'string',
      default: ''
    },
    fontVariant: {
      type: 'string',
      default: ''
    },
    fontWeight: {
      type: 'string',
      default: 'regular'
    },
    fontStyle: {
      type: 'string',
      default: 'normal'
    },
    topMargin: {
      type: 'number',
      default: ''
    },
    bottomMargin: {
      type: 'number',
      default: ''
    },
    marginType: {
      type: 'string',
      default: 'px'
    },
    markSize: {
      type: 'array',
      default: ['', '', '']
    },
    markSizeType: {
      type: 'string',
      default: 'px'
    },
    markLineHeight: {
      type: 'array',
      default: ['', '', '']
    },
    markLineType: {
      type: 'string',
      default: 'px'
    },
    markLetterSpacing: {
      type: 'number'
    },
    markTypography: {
      type: 'string',
      default: ''
    },
    markGoogleFont: {
      type: 'boolean',
      default: false
    },
    markLoadGoogleFont: {
      type: 'boolean',
      default: true
    },
    markFontSubset: {
      type: 'string',
      default: ''
    },
    markFontVariant: {
      type: 'string',
      default: ''
    },
    markFontWeight: {
      type: 'string',
      default: 'regular'
    },
    markFontStyle: {
      type: 'string',
      default: 'normal'
    },
    markColor: {
      type: 'string',
      default: '#f76a0c'
    },
    markBG: {
      type: 'string'
    },
    markBGOpacity: {
      type: 'number',
      default: 1
    },
    markPadding: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    markPaddingControl: {
      type: 'string',
      default: 'linked'
    },
    markBorder: {
      type: 'string'
    },
    markBorderOpacity: {
      type: 'number',
      default: 1
    },
    markBorderWidth: {
      type: 'number',
      default: 0
    },
    markBorderStyle: {
      type: 'string',
      default: 'solid'
    },
    anchor: {
      type: 'string'
    }
  },
  save: _ref8 => {
    let {
      attributes
    } = _ref8;
    const {
      anchor,
      align,
      level,
      content,
      color,
      uniqueID,
      letterSpacing,
      topMargin,
      bottomMargin,
      marginType,
      className,
      kadenceAnimation,
      kadenceAOSOptions
    } = attributes;
    const tagName = 'h' + level;
    const mType = marginType ? marginType : 'px';
    let tagId = anchor ? anchor : `kt-adv-heading${uniqueID}`;
    const revealAnimation = kadenceAnimation && ('reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation) ? true : false;
    const wrapper = anchor || revealAnimation ? true : false;
    tagId = revealAnimation && !anchor ? `kt-adv-inner-heading${uniqueID}` : `kt-adv-heading${uniqueID}`;
    const classes = className ? `${className} ${(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading')}` : (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.getBlockDefaultClassName)('kadence/advancedheading');
    const htmlItem = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.Content, {
      tagName: tagName,
      id: tagId,
      className: `kt-adv-heading${uniqueID} ${classes}`,
      "data-aos": kadenceAnimation ? kadenceAnimation : undefined,
      "data-aos-offset": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].offset ? kadenceAOSOptions[0].offset : undefined,
      "data-aos-duration": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration ? kadenceAOSOptions[0].duration : undefined,
      "data-aos-delay": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].delay ? kadenceAOSOptions[0].delay : undefined,
      "data-aos-easing": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing ? kadenceAOSOptions[0].easing : undefined,
      "data-aos-once": kadenceAOSOptions && kadenceAOSOptions[0] && undefined !== kadenceAOSOptions[0].once && '' !== kadenceAOSOptions[0].once ? kadenceAOSOptions[0].once : undefined,
      style: {
        textAlign: align,
        color: color,
        letterSpacing: letterSpacing ? letterSpacing + 'px' : undefined,
        marginTop: topMargin ? topMargin + mType : undefined,
        marginBottom: bottomMargin ? bottomMargin + mType : undefined
      },
      value: content
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, wrapper && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      id: `kt-adv-heading${uniqueID}`,
      className: `kadence-advanced-heading-wrapper${revealAnimation ? ' kadence-heading-clip-animation' : ''}`
    }, htmlItem), !wrapper && htmlItem);
  }
}, {
  attributes: {
    content: {
      type: 'array',
      source: 'children',
      selector: 'h1,h2,h3,h4,h5,h6'
    },
    level: {
      type: 'number',
      default: 2
    },
    uniqueID: {
      type: 'string'
    },
    align: {
      type: 'string'
    },
    color: {
      type: 'string'
    },
    size: {
      type: 'number'
    },
    sizeType: {
      type: 'string',
      default: 'px'
    },
    lineHeight: {
      type: 'number'
    },
    lineType: {
      type: 'string',
      default: 'px'
    },
    tabSize: {
      type: 'number'
    },
    tabLineHeight: {
      type: 'number'
    },
    mobileSize: {
      type: 'number'
    },
    mobileLineHeight: {
      type: 'number'
    },
    letterSpacing: {
      type: 'number'
    },
    typography: {
      type: 'string',
      default: ''
    },
    googleFont: {
      type: 'boolean',
      default: false
    },
    loadGoogleFont: {
      type: 'boolean',
      default: true
    },
    fontSubset: {
      type: 'string',
      default: ''
    },
    fontVariant: {
      type: 'string',
      default: ''
    },
    fontWeight: {
      type: 'string',
      default: 'regular'
    },
    fontStyle: {
      type: 'string',
      default: 'normal'
    },
    topMargin: {
      type: 'number',
      default: ''
    },
    bottomMargin: {
      type: 'number',
      default: ''
    },
    marginType: {
      type: 'string',
      default: 'px'
    },
    markSize: {
      type: 'array',
      default: ['', '', '']
    },
    markSizeType: {
      type: 'string',
      default: 'px'
    },
    markLineHeight: {
      type: 'array',
      default: ['', '', '']
    },
    markLineType: {
      type: 'string',
      default: 'px'
    },
    markLetterSpacing: {
      type: 'number'
    },
    markTypography: {
      type: 'string',
      default: ''
    },
    markGoogleFont: {
      type: 'boolean',
      default: false
    },
    markLoadGoogleFont: {
      type: 'boolean',
      default: true
    },
    markFontSubset: {
      type: 'string',
      default: ''
    },
    markFontVariant: {
      type: 'string',
      default: ''
    },
    markFontWeight: {
      type: 'string',
      default: 'regular'
    },
    markFontStyle: {
      type: 'string',
      default: 'normal'
    },
    markColor: {
      type: 'string',
      default: '#f76a0c'
    },
    markBG: {
      type: 'string'
    },
    markBGOpacity: {
      type: 'number',
      default: 1
    },
    markPadding: {
      type: 'array',
      default: [0, 0, 0, 0]
    },
    markPaddingControl: {
      type: 'string',
      default: 'linked'
    },
    markBorder: {
      type: 'string'
    },
    markBorderOpacity: {
      type: 'number',
      default: 1
    },
    markBorderWidth: {
      type: 'number',
      default: 0
    },
    markBorderStyle: {
      type: 'string',
      default: 'solid'
    }
  },
  save: _ref9 => {
    let {
      attributes
    } = _ref9;
    const {
      align,
      level,
      content,
      color,
      uniqueID,
      letterSpacing,
      topMargin,
      bottomMargin,
      marginType
    } = attributes;
    const tagName = 'h' + level;
    const mType = marginType ? marginType : 'px';
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.Content, {
      tagName: tagName,
      id: `kt-adv-heading${uniqueID}`,
      style: {
        textAlign: align,
        color: color,
        letterSpacing: letterSpacing ? letterSpacing + 'px' : undefined,
        marginTop: topMargin ? topMargin + mType : undefined,
        marginBottom: bottomMargin ? bottomMargin + mType : undefined
      },
      value: content
    });
  }
}, {
  attributes: {
    content: {
      type: 'array',
      source: 'children',
      selector: 'h1,h2,h3,h4,h5,h6'
    },
    level: {
      type: 'number',
      default: 2
    },
    uniqueID: {
      type: 'string'
    },
    align: {
      type: 'string'
    },
    color: {
      type: 'string'
    },
    size: {
      type: 'number'
    },
    sizeType: {
      type: 'string',
      default: 'px'
    },
    lineHeight: {
      type: 'number'
    },
    lineType: {
      type: 'string',
      default: 'px'
    },
    tabSize: {
      type: 'number'
    },
    tabLineHeight: {
      type: 'number'
    },
    mobileSize: {
      type: 'number'
    },
    mobileLineHeight: {
      type: 'number'
    },
    letterSpacing: {
      type: 'number'
    },
    typography: {
      type: 'string',
      default: ''
    },
    googleFont: {
      type: 'boolean',
      default: false
    },
    loadGoogleFont: {
      type: 'boolean',
      default: true
    },
    fontSubset: {
      type: 'string',
      default: ''
    },
    fontVariant: {
      type: 'string',
      default: ''
    },
    fontWeight: {
      type: 'string',
      default: 'regular'
    },
    fontStyle: {
      type: 'string',
      default: 'normal'
    }
  },
  save: _ref10 => {
    let {
      attributes
    } = _ref10;
    const {
      align,
      level,
      content,
      color,
      uniqueID,
      letterSpacing
    } = attributes;
    const tagName = 'h' + level;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.Content, {
      tagName: tagName,
      id: `kt-adv-heading${uniqueID}`,
      style: {
        textAlign: align,
        color: color,
        letterSpacing: letterSpacing ? letterSpacing + 'px' : undefined
      },
      value: content
    });
  }
}]);

/***/ }),

/***/ "./src/blocks/advanced-heading/edit.js":
/*!*********************************************!*\
  !*** ./src/blocks/advanced-heading/edit.js ***!
  \*********************************************/
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
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _copy_paste_style__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./copy-paste-style */ "./src/blocks/advanced-heading/copy-paste-style.js");
/* harmony import */ var _markformat__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./markformat */ "./src/blocks/advanced-heading/markformat.js");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/advanced-heading/editor.scss");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_14__);



/**
 * BLOCK: Kadence Advanced Heading
 *
 */

/* global kadence_blocks_params */

/**
 * Internal dependencies
 */



/**
 * Block dependencies
 */



/**
 * Import Css
 */


/**
 * Internal block libraries
 */









/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */

const ANCHOR_REGEX = /[\s#]/g;

function KadenceAdvancedHeading(props) {
  const {
    attributes,
    className,
    setAttributes,
    mergeBlocks,
    onReplace,
    clientId,
    getPreviewDevice,
    addUniqueID,
    isUniqueID,
    isUniqueBlock,
    context
  } = props;
  const {
    inQueryBlock,
    uniqueID,
    align,
    level,
    content,
    color,
    colorClass,
    textShadow,
    mobileAlign,
    tabletAlign,
    size,
    sizeType,
    lineType,
    lineHeight,
    tabLineHeight,
    tabSize,
    mobileSize,
    mobileLineHeight,
    letterSpacing,
    typography,
    fontVariant,
    fontWeight,
    fontStyle,
    fontSubset,
    googleFont,
    loadGoogleFont,
    marginType,
    topMargin,
    bottomMargin,
    markSize,
    markSizeType,
    markLineHeight,
    markLineType,
    markLetterSpacing,
    markTypography,
    markGoogleFont,
    markLoadGoogleFont,
    markFontSubset,
    markFontVariant,
    markFontWeight,
    markFontStyle,
    markPadding,
    markPaddingControl,
    markColor,
    markBG,
    markBGOpacity,
    markBorder,
    markBorderWidth,
    markBorderOpacity,
    markBorderStyle,
    anchor,
    textTransform,
    markTextTransform,
    kadenceAnimation,
    kadenceAOSOptions,
    htmlTag,
    leftMargin,
    rightMargin,
    tabletMargin,
    mobileMargin,
    padding,
    tabletPadding,
    mobilePadding,
    paddingType,
    markMobilePadding,
    markTabPadding,
    loadItalic,
    kadenceDynamic,
    link,
    linkTarget,
    linkNoFollow,
    linkSponsored,
    background,
    backgroundColorClass,
    linkStyle,
    linkColor,
    linkHoverColor
  } = attributes;
  const [marginControl, setMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [paddingControl, setPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [markPaddingControls, setMarkPaddingControls] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('general');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    let smallID = '_' + clientId.substr(2, 9);

    if (!uniqueID) {
      const blockConfigObject = kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : [];

      if (blockConfigObject['kadence/advancedheading'] !== undefined && typeof blockConfigObject['kadence/advancedheading'] === 'object') {
        Object.keys(blockConfigObject['kadence/advancedheading']).map(attribute => {
          attributes[attribute] = blockConfigObject['kadence/advancedheading'][attribute];
        });
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
      addUniqueID(uniqueID);
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

  const saveShadow = value => {
    const newItems = textShadow.map((item, thisIndex) => {
      if (0 === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      textShadow: newItems
    });
  };

  const renderTypography = typography && !typography.includes(',') ? '\'' + typography + '\'' : typography;
  const markBGString = markBG ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(markBG, markBGOpacity) : '';
  const markBorderString = markBorder ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(markBorder, markBorderOpacity) : '';
  const gconfig = {
    google: {
      families: [typography + (fontVariant ? ':' + fontVariant : '')]
    }
  };
  const sgconfig = {
    google: {
      families: [markTypography + (markFontVariant ? ':' + markFontVariant : '')]
    }
  };
  const textColorClass = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.getColorClassName)('color', colorClass);
  const textBackgroundColorClass = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.getColorClassName)('background-color', backgroundColorClass);
  const config = googleFont ? gconfig : '';
  const sconfig = markGoogleFont ? sgconfig : '';
  const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
  const TagHTML = tagName;
  const fontMin = sizeType !== 'px' ? 0.2 : 5;
  const marginMin = marginType === 'em' || marginType === 'rem' ? -2 : -200;
  const marginMax = marginType === 'em' || marginType === 'rem' ? 12 : 200;
  const marginStep = marginType === 'em' || marginType === 'rem' ? 0.1 : 1;
  const paddingMin = paddingType === 'em' || paddingType === 'rem' ? 0 : 0;
  const paddingMax = paddingType === 'em' || paddingType === 'rem' ? 12 : 200;
  const paddingStep = paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1;
  const fontMax = sizeType !== 'px' ? 12 : 200;
  const fontStep = sizeType !== 'px' ? 0.1 : 1;
  const lineMin = lineType !== 'px' ? 0.2 : 5;
  const lineMax = lineType !== 'px' ? 12 : 200;
  const lineStep = lineType !== 'px' ? 0.1 : 1;
  const previewMarginTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== topMargin ? topMargin : '', undefined !== tabletMargin ? tabletMargin[0] : '', undefined !== mobileMargin ? mobileMargin[0] : '');
  const previewMarginRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== rightMargin ? rightMargin : '', undefined !== tabletMargin ? tabletMargin[1] : '', undefined !== mobileMargin ? mobileMargin[1] : '');
  const previewMarginBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== bottomMargin ? bottomMargin : '', undefined !== tabletMargin ? tabletMargin[2] : '', undefined !== mobileMargin ? mobileMargin[2] : '');
  const previewMarginLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== leftMargin ? leftMargin : '', undefined !== tabletMargin ? tabletMargin[3] : '', undefined !== mobileMargin ? mobileMargin[3] : '');
  const previewPaddingTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== padding ? padding[0] : '', undefined !== tabletPadding ? tabletPadding[0] : '', undefined !== mobilePadding ? mobilePadding[0] : '');
  const previewPaddingRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== padding ? padding[1] : '', undefined !== tabletPadding ? tabletPadding[1] : '', undefined !== mobilePadding ? mobilePadding[1] : '');
  const previewPaddingBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== padding ? padding[2] : '', undefined !== tabletPadding ? tabletPadding[2] : '', undefined !== mobilePadding ? mobilePadding[2] : '');
  const previewPaddingLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== padding ? padding[3] : '', undefined !== tabletPadding ? tabletPadding[3] : '', undefined !== mobilePadding ? mobilePadding[3] : '');
  const previewFontSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== size ? size : '', undefined !== tabSize ? tabSize : '', undefined !== mobileSize ? mobileSize : '');
  const previewLineHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== lineHeight ? lineHeight : '', undefined !== tabLineHeight ? tabLineHeight : '', undefined !== mobileLineHeight ? mobileLineHeight : '');
  const previewAlign = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== align ? align : '', undefined !== tabletAlign ? tabletAlign : '', undefined !== mobileAlign ? mobileAlign : '');
  const previewMarkPaddingTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== markPadding ? markPadding[0] : 0, undefined !== markTabPadding ? markTabPadding[0] : '', undefined !== markMobilePadding ? markMobilePadding[0] : '');
  const previewMarkPaddingRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== markPadding ? markPadding[1] : 0, undefined !== markTabPadding ? markTabPadding[1] : '', undefined !== markMobilePadding ? markMobilePadding[1] : '');
  const previewMarkPaddingBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== markPadding ? markPadding[2] : 0, undefined !== markTabPadding ? markTabPadding[2] : '', undefined !== markMobilePadding ? markMobilePadding[2] : '');
  const previewMarkPaddingLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== markPadding ? markPadding[3] : 0, undefined !== markTabPadding ? markTabPadding[3] : '', undefined !== markMobilePadding ? markMobilePadding[3] : '');
  const previewMarkSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== markSize ? markSize[0] : '', undefined !== markSize ? markSize[1] : '', undefined !== markSize ? markSize[2] : '');
  const previewMarkLineHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.getPreviewSize)(getPreviewDevice, undefined !== markLineHeight ? markLineHeight[0] : '', undefined !== markLineHeight ? markLineHeight[1] : '', undefined !== markLineHeight ? markLineHeight[2] : '');
  const headingOptions = [[{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.HeadingLevelIcon, {
      level: 1,
      isPressed: 1 === level && htmlTag && htmlTag === 'heading' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Heading 1', 'kadence-blocks'),
    isActive: 1 === level && htmlTag && htmlTag === 'heading' ? true : false,
    onClick: () => setAttributes({
      level: 1,
      htmlTag: 'heading'
    })
  }], [{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.HeadingLevelIcon, {
      level: 2,
      isPressed: 2 === level && htmlTag && htmlTag === 'heading' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Heading 2', 'kadence-blocks'),
    isActive: 2 === level && htmlTag && htmlTag === 'heading' ? true : false,
    onClick: () => setAttributes({
      level: 2,
      htmlTag: 'heading'
    })
  }], [{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.HeadingLevelIcon, {
      level: 3,
      isPressed: 3 === level && htmlTag && htmlTag === 'heading' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Heading 3', 'kadence-blocks'),
    isActive: 3 === level && htmlTag && htmlTag === 'heading' ? true : false,
    onClick: () => setAttributes({
      level: 3,
      htmlTag: 'heading'
    })
  }], [{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.HeadingLevelIcon, {
      level: 4,
      isPressed: 4 === level && htmlTag && htmlTag === 'heading' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Heading 4', 'kadence-blocks'),
    isActive: 4 === level && htmlTag && htmlTag === 'heading' ? true : false,
    onClick: () => setAttributes({
      level: 4,
      htmlTag: 'heading'
    })
  }], [{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.HeadingLevelIcon, {
      level: 5,
      isPressed: 5 === level && htmlTag && htmlTag === 'heading' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Heading 5', 'kadence-blocks'),
    isActive: 5 === level && htmlTag && htmlTag === 'heading' ? true : false,
    onClick: () => setAttributes({
      level: 5,
      htmlTag: 'heading'
    })
  }], [{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.HeadingLevelIcon, {
      level: 6,
      isPressed: 6 === level && htmlTag && htmlTag === 'heading' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Heading 6', 'kadence-blocks'),
    isActive: 6 === level && htmlTag && htmlTag === 'heading' ? true : false,
    onClick: () => setAttributes({
      level: 6,
      htmlTag: 'heading'
    })
  }], [{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.HeadingLevelIcon, {
      level: 'p',
      isPressed: htmlTag && htmlTag === 'p' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Paragraph', 'kadence-blocks'),
    isActive: htmlTag && htmlTag === 'p' ? true : false,
    onClick: () => setAttributes({
      htmlTag: 'p'
    })
  }], [{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.HeadingLevelIcon, {
      level: 'span',
      isPressed: htmlTag && htmlTag === 'span' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Span', 'kadence-blocks'),
    isActive: htmlTag && htmlTag === 'span' ? true : false,
    onClick: () => setAttributes({
      htmlTag: 'span'
    })
  }], [{
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.HeadingLevelIcon, {
      level: 'div',
      isPressed: htmlTag && htmlTag === 'div' ? true : false
    }),
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('div', 'kadence-blocks'),
    isActive: htmlTag && htmlTag === 'div' ? true : false,
    onClick: () => setAttributes({
      htmlTag: 'div'
    })
  }]];
  const classes = classnames__WEBPACK_IMPORTED_MODULE_2___default()({
    [`kt-adv-heading${uniqueID}`]: uniqueID,
    [className]: className,
    'kb-content-is-dynamic': undefined !== kadenceDynamic && undefined !== kadenceDynamic['content'] && undefined !== kadenceDynamic['content'].enable && kadenceDynamic['content'].enable,
    [textColorClass]: textColorClass,
    'has-text-color': textColorClass,
    [textBackgroundColorClass]: textBackgroundColorClass,
    'has-background': textBackgroundColorClass,
    [`hls-${linkStyle}`]: !link && linkStyle
  });
  const dynamicHeadingContent = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(TagHTML, {
    style: {
      textAlign: previewAlign,
      color: color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(color) : undefined,
      backgroundColor: background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(background) : undefined,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      fontSize: previewFontSize ? previewFontSize + sizeType : undefined,
      lineHeight: previewLineHeight ? previewLineHeight + lineType : undefined,
      letterSpacing: undefined !== letterSpacing && '' !== letterSpacing ? letterSpacing + 'px' : undefined,
      textTransform: textTransform ? textTransform : undefined,
      fontFamily: typography ? renderTypography : '',
      paddingTop: '' !== previewPaddingTop ? previewPaddingTop + paddingType : undefined,
      paddingRight: '' !== previewPaddingRight ? previewPaddingRight + paddingType : undefined,
      paddingBottom: '' !== previewPaddingBottom ? previewPaddingBottom + paddingType : undefined,
      paddingLeft: '' !== previewPaddingLeft ? previewPaddingLeft + paddingType : undefined,
      marginTop: '' !== previewMarginTop ? previewMarginTop + marginType : undefined,
      marginRight: '' !== previewMarginRight ? previewMarginRight + marginType : undefined,
      marginBottom: '' !== previewMarginBottom ? previewMarginBottom + marginType : undefined,
      marginLeft: '' !== previewMarginLeft ? previewMarginLeft + marginType : undefined,
      textShadow: undefined !== textShadow && undefined !== textShadow[0] && undefined !== textShadow[0].enable && textShadow[0].enable ? (undefined !== textShadow[0].hOffset ? textShadow[0].hOffset : 1) + 'px ' + (undefined !== textShadow[0].vOffset ? textShadow[0].vOffset : 1) + 'px ' + (undefined !== textShadow[0].blur ? textShadow[0].blur : 1) + 'px ' + (undefined !== textShadow[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(textShadow[0].color) : 'rgba(0,0,0,0.2)') : undefined
    },
    className: classes
  }, (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_14__.applyFilters)('kadence.dynamicContent', (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Spinner, null), attributes, 'content'));
  const headingContent = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.RichText, {
    tagName: tagName,
    allowedFormats: link ? (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_14__.applyFilters)('kadence.whitelist_richtext_formats', ['core/bold', 'core/italic', 'kadence/insert-dynamic', 'kadence/mark', 'core/strikethrough', 'core/superscript', 'core/superscript', 'toolset/inline-field'], 'kadence/advancedheading') : undefined,
    value: content,
    onChange: value => setAttributes({
      content: value
    }),
    onMerge: mergeBlocks,
    onSplit: value => {
      if (!value) {
        return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_11__.createBlock)('core/paragraph');
      }

      return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_11__.createBlock)('kadence/advancedheading', { ...attributes,
        content: value
      });
    },
    onReplace: onReplace,
    onRemove: () => onReplace([]),
    style: {
      textAlign: previewAlign,
      color: color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(color) : undefined,
      backgroundColor: background ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(background) : undefined,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      fontSize: previewFontSize ? previewFontSize + sizeType : undefined,
      lineHeight: previewLineHeight ? previewLineHeight + lineType : undefined,
      letterSpacing: undefined !== letterSpacing && '' !== letterSpacing ? letterSpacing + 'px' : undefined,
      textTransform: textTransform ? textTransform : undefined,
      fontFamily: typography ? renderTypography : '',
      paddingTop: '' !== previewPaddingTop ? previewPaddingTop + paddingType : undefined,
      paddingRight: '' !== previewPaddingRight ? previewPaddingRight + paddingType : undefined,
      paddingBottom: '' !== previewPaddingBottom ? previewPaddingBottom + paddingType : undefined,
      paddingLeft: '' !== previewPaddingLeft ? previewPaddingLeft + paddingType : undefined,
      marginTop: '' !== previewMarginTop ? previewMarginTop + marginType : undefined,
      marginRight: '' !== previewMarginRight ? previewMarginRight + marginType : undefined,
      marginBottom: '' !== previewMarginBottom ? previewMarginBottom + marginType : undefined,
      marginLeft: '' !== previewMarginLeft ? previewMarginLeft + marginType : undefined,
      textShadow: undefined !== textShadow && undefined !== textShadow[0] && undefined !== textShadow[0].enable && textShadow[0].enable ? (undefined !== textShadow[0].hOffset ? textShadow[0].hOffset : 1) + 'px ' + (undefined !== textShadow[0].vOffset ? textShadow[0].vOffset : 1) + 'px ' + (undefined !== textShadow[0].blur ? textShadow[0].blur : 1) + 'px ' + (undefined !== textShadow[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(textShadow[0].color) : 'rgba(0,0,0,0.2)') : undefined
    },
    className: classes,
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Write something…', 'kadence-blocks')
  });
  const headingLinkContent = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("a", {
    href: link,
    className: `kb-advanced-heading-link${linkStyle ? ' hls-' + linkStyle : ''}`,
    onClick: event => {
      event.preventDefault();
    }
  }, undefined !== kadenceDynamic && undefined !== kadenceDynamic['content'] && undefined !== kadenceDynamic['content'].enable && kadenceDynamic['content'].enable ? dynamicHeadingContent : headingContent);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.useBlockProps)({});
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("style", null, `.kt-adv-heading${uniqueID} mark, .kt-adv-heading${uniqueID}.rich-text:focus mark[data-rich-text-format-boundary] {
						color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(markColor)};
						background: ${markBG ? markBGString : 'transparent'};
						font-weight: ${markFontWeight ? markFontWeight : 'inherit'};
						font-style: ${markFontStyle ? markFontStyle : 'inherit'};
						font-size: ${previewMarkSize ? previewMarkSize + markSizeType : 'inherit'};
						line-height: ${previewMarkLineHeight ? previewMarkLineHeight + markLineType : 'inherit'};
						letter-spacing: ${markLetterSpacing ? markLetterSpacing + 'px' : 'inherit'};
						text-transform: ${markTextTransform ? markTextTransform : 'inherit'};
						font-family: ${markTypography ? markTypography : 'inherit'};
						border-color: ${markBorder ? markBorderString : 'transparent'};
						border-width: ${markBorderWidth ? markBorderWidth + 'px' : '0'};
						border-style: ${markBorderStyle ? markBorderStyle : 'solid'};
						padding-top: ${previewMarkPaddingTop ? previewMarkPaddingTop + 'px ' : '0'};
						padding-right: ${previewMarkPaddingRight ? previewMarkPaddingRight + 'px ' : '0'};
						padding-bottom: ${previewMarkPaddingBottom ? previewMarkPaddingBottom + 'px ' : '0'};
						padding-left: ${previewMarkPaddingLeft ? previewMarkPaddingLeft + 'px ' : '0'};
					}`, linkColor && `.kt-adv-heading${uniqueID} a, #block-${clientId} a.kb-advanced-heading-link, #block-${clientId} a.kb-advanced-heading-link > .wp-block-kadence-advancedheading {
							color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(linkColor)} !important;
						}`, linkHoverColor && `.kt-adv-heading${uniqueID} a:hover, #block-${clientId} a.kb-advanced-heading-link:hover, #block-${clientId} a.kb-advanced-heading-link:hover > .wp-block-kadence-advancedheading {
							color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.KadenceColorOutput)(linkHoverColor)}!important;
						}`), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.BlockControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToolbarGroup, {
    isCollapsed: true,
    icon: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.HeadingLevelIcon, {
      level: htmlTag !== 'heading' ? htmlTag : level
    }),
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Change heading tag', 'kadence-blocks'),
    controls: headingOptions
  }), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('allSettings', 'kadence/advancedheading') && (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('toolbarTypography', 'kadence/advancedheading') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.InlineTypographyControls, {
    uniqueID: uniqueID,
    fontGroup: 'heading',
    letterSpacing: letterSpacing,
    onLetterSpacing: value => setAttributes({
      letterSpacing: value
    }),
    fontFamily: typography,
    onFontFamily: value => setAttributes({
      typography: value
    }),
    onFontChange: select => {
      setAttributes({
        typography: select.value,
        googleFont: select.google
      });
    },
    googleFont: googleFont,
    onGoogleFont: value => setAttributes({
      googleFont: value
    }),
    loadGoogleFont: loadGoogleFont,
    onLoadGoogleFont: value => setAttributes({
      loadGoogleFont: value
    }),
    fontVariant: fontVariant,
    onFontVariant: value => setAttributes({
      fontVariant: value
    }),
    fontWeight: fontWeight,
    onFontWeight: value => setAttributes({
      fontWeight: value
    }),
    fontStyle: fontStyle,
    onFontStyle: value => setAttributes({
      fontStyle: value
    }),
    fontSubset: fontSubset,
    onFontSubset: value => setAttributes({
      fontSubset: value
    }),
    textTransform: textTransform,
    onTextTransform: value => setAttributes({
      textTransform: value
    }),
    fontSizeArray: false,
    fontSize: size,
    onFontSize: value => setAttributes({
      size: value
    }),
    fontSizeType: sizeType,
    onFontSizeType: value => setAttributes({
      sizeType: value
    }),
    lineHeight: lineHeight,
    onLineHeight: value => setAttributes({
      lineHeight: value
    }),
    lineHeightType: lineType,
    onLineHeightType: value => setAttributes({
      lineType: value
    }),
    tabSize: tabSize,
    onTabSize: value => setAttributes({
      tabSize: value
    }),
    tabLineHeight: tabLineHeight,
    onTabLineHeight: value => setAttributes({
      tabLineHeight: value
    }),
    mobileSize: mobileSize,
    onMobileSize: value => setAttributes({
      mobileSize: value
    }),
    mobileLineHeight: mobileLineHeight,
    onMobileLineHeight: value => setAttributes({
      mobileLineHeight: value
    })
  }), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('allSettings', 'kadence/advancedheading') && (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('toolbarColor', 'kadence/advancedheading') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.InlinePopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Color', 'kadence-blocks'),
    value: color ? color : '',
    default: '',
    onChange: value => setAttributes({
      color: value
    }),
    onClassChange: value => setAttributes({
      colorClass: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.AlignmentToolbar, {
    value: align,
    onChange: nextAlign => {
      setAttributes({
        align: nextAlign
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_copy_paste_style__WEBPACK_IMPORTED_MODULE_5__["default"], {
    onPaste: value => setAttributes(value),
    blockAttributes: attributes
  })), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('allSettings', 'kadence/advancedheading') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.InspectorControlTabs, {
    panelName: 'advanced-heading',
    setActiveTab: value => setActiveTab(value),
    activeTab: activeTab
  }), activeTab === 'general' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Settings', 'kadence-blocks'),
    panelName: 'kb-adv-heading-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kb-tag-level-control components-base-control"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
    className: "kb-component-label"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('HTML Tag', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToolbarGroup, {
    isCollapsed: false,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Change HTML Tag', 'kadence-blocks'),
    controls: headingOptions
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.ResponsiveAlignControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Text Alignment', 'kadence-blocks'),
    value: align ? align : '',
    mobileValue: mobileAlign ? mobileAlign : '',
    tabletValue: tabletAlign ? tabletAlign : '',
    onChange: nextAlign => setAttributes({
      align: nextAlign
    }),
    onChangeTablet: nextAlign => setAttributes({
      tabletAlign: nextAlign
    }),
    onChangeMobile: nextAlign => setAttributes({
      mobileAlign: nextAlign
    })
  }), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('colorSettings', 'kadence/advancedheading') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Color', 'kadence-blocks'),
    value: color ? color : '',
    default: '',
    onChange: value => setAttributes({
      color: value
    }),
    onClassChange: value => setAttributes({
      colorClass: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Background Color', 'kadence-blocks'),
    value: background ? background : '',
    default: '',
    onChange: value => setAttributes({
      background: value
    }),
    onClassChange: value => setAttributes({
      backgroundColorClass: value
    })
  })), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('sizeSettings', 'kadence/advancedheading') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Font Size', 'kadence-blocks'),
    value: size ? size : '',
    onChange: value => setAttributes({
      size: value
    }),
    tabletValue: tabSize ? tabSize : '',
    onChangeTablet: value => setAttributes({
      tabSize: value
    }),
    mobileValue: mobileSize ? mobileSize : '',
    onChangeMobile: value => setAttributes({
      mobileSize: value
    }),
    min: fontMin,
    max: fontMax,
    step: fontStep,
    unit: sizeType,
    onUnit: value => setAttributes({
      sizeType: value
    }),
    units: ['px', 'em', 'rem', 'vw']
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Line Height', 'kadence-blocks'),
    value: lineHeight ? lineHeight : '',
    onChange: value => setAttributes({
      lineHeight: value
    }),
    tabletValue: tabLineHeight ? tabLineHeight : '',
    onChangeTablet: value => setAttributes({
      tabLineHeight: value
    }),
    mobileValue: mobileLineHeight ? mobileLineHeight : '',
    onChangeMobile: value => setAttributes({
      mobileLineHeight: value
    }),
    min: lineMin,
    max: lineMax,
    step: lineStep,
    unit: lineType,
    onUnit: value => setAttributes({
      lineType: value
    }),
    units: ['px', 'em', 'rem']
  }))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('advancedSettings', 'kadence/advancedheading') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Advanced Typography Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-adv-heading-typography-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.TypographyControls, {
    fontGroup: 'heading',
    letterSpacing: letterSpacing,
    onLetterSpacing: value => setAttributes({
      letterSpacing: value
    }),
    fontFamily: typography,
    onFontFamily: value => setAttributes({
      typography: value
    }),
    onFontChange: select => {
      setAttributes({
        typography: select.value,
        googleFont: select.google
      });
    },
    googleFont: googleFont,
    onGoogleFont: value => setAttributes({
      googleFont: value
    }),
    loadGoogleFont: loadGoogleFont,
    onLoadGoogleFont: value => setAttributes({
      loadGoogleFont: value
    }),
    fontVariant: fontVariant,
    onFontVariant: value => setAttributes({
      fontVariant: value
    }),
    fontWeight: fontWeight,
    onFontWeight: value => setAttributes({
      fontWeight: value
    }),
    fontStyle: fontStyle,
    onFontStyle: value => setAttributes({
      fontStyle: value
    }),
    fontSubset: fontSubset,
    onFontSubset: value => setAttributes({
      fontSubset: value
    }),
    textTransform: textTransform,
    onTextTransform: value => setAttributes({
      textTransform: value
    }),
    loadItalic: loadItalic,
    onLoadItalic: value => setAttributes({
      loadItalic: value
    })
  })), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('highlightSettings', 'kadence/advancedheading') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Highlight Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-adv-heading-highlight-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Highlight Color', 'kadence-blocks'),
    value: markColor ? markColor : '',
    default: '',
    onChange: value => setAttributes({
      markColor: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Highlight Background', 'kadence-blocks'),
    value: markBG ? markBG : '',
    default: '',
    onChange: value => setAttributes({
      markBG: value
    }),
    opacityValue: markBGOpacity,
    onOpacityChange: value => setAttributes({
      markBGOpacity: value
    }),
    onArrayChange: (color, opacity) => setAttributes({
      markBG: color,
      markBGOpacity: opacity
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Highlight Border Color', 'kadence-blocks'),
    value: markBorder ? markBorder : '',
    default: '',
    onChange: value => setAttributes({
      markBorder: value
    }),
    opacityValue: markBorderOpacity,
    onOpacityChange: value => setAttributes({
      markBorderOpacity: value
    }),
    onArrayChange: (color, opacity) => setAttributes({
      markBorder: color,
      markBorderOpacity: opacity
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Highlight Border Style', 'kadence-blocks'),
    value: markBorderStyle,
    options: [{
      value: 'solid',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Solid', 'kadence-blocks')
    }, {
      value: 'dashed',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Dashed', 'kadence-blocks')
    }, {
      value: 'dotted',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Dotted', 'kadence-blocks')
    }],
    onChange: value => setAttributes({
      markBorderStyle: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Highlight Border Width', 'kadence-blocks'),
    value: markBorderWidth,
    onChange: value => setAttributes({
      markBorderWidth: value
    }),
    min: 0,
    max: 20,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.TypographyControls, {
    fontGroup: 'heading',
    fontSize: markSize,
    onFontSize: value => setAttributes({
      markSize: value
    }),
    fontSizeType: markSizeType,
    onFontSizeType: value => setAttributes({
      markSizeType: value
    }),
    lineHeight: markLineHeight,
    onLineHeight: value => setAttributes({
      markLineHeight: value
    }),
    lineHeightType: markLineType,
    onLineHeightType: value => setAttributes({
      markLineType: value
    }),
    letterSpacing: markLetterSpacing,
    onLetterSpacing: value => setAttributes({
      markLetterSpacing: value
    }),
    fontFamily: markTypography,
    onFontFamily: value => setAttributes({
      markTypography: value
    }),
    onFontChange: select => {
      setAttributes({
        markTypography: select.value,
        markGoogleFont: select.google
      });
    },
    googleFont: markGoogleFont,
    onGoogleFont: value => setAttributes({
      markGoogleFont: value
    }),
    loadGoogleFont: markLoadGoogleFont,
    onLoadGoogleFont: value => setAttributes({
      markLoadGoogleFont: value
    }),
    fontVariant: markFontVariant,
    onFontVariant: value => setAttributes({
      markFontVariant: value
    }),
    fontWeight: markFontWeight,
    onFontWeight: value => setAttributes({
      markFontWeight: value
    }),
    fontStyle: markFontStyle,
    onFontStyle: value => setAttributes({
      markFontStyle: value
    }),
    fontSubset: markFontSubset,
    onFontSubset: value => setAttributes({
      markFontSubset: value
    }),
    textTransform: markTextTransform,
    onTextTransform: value => setAttributes({
      markTextTransform: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Padding', 'kadence-blocks'),
    value: markPadding,
    control: markPaddingControls,
    tabletValue: markTabPadding,
    mobileValue: markMobilePadding,
    onChange: value => setAttributes({
      markPadding: value
    }),
    onChangeTablet: value => setAttributes({
      markTabPadding: value
    }),
    onChangeMobile: value => setAttributes({
      markMobilePadding: value
    }),
    onChangeControl: value => setMarkPaddingControls(value),
    min: 0,
    max: 100,
    step: 1,
    unit: 'px',
    units: ['px'],
    showUnit: true
  })), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('linkSettings', 'kadence/advancedheading') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Link Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-adv-heading-link-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Link Color', 'kadence-blocks'),
    swatchLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Link Color', 'kadence-blocks'),
    value: linkColor ? linkColor : '',
    default: '',
    onChange: value => setAttributes({
      linkColor: value
    }),
    swatchLabel2: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Hover Color', 'kadence-blocks'),
    value2: linkHoverColor ? linkHoverColor : '',
    default2: '',
    onChange2: value => setAttributes({
      linkHoverColor: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Link Style', 'kadence-blocks'),
    value: linkStyle,
    options: [{
      value: '',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Unset', 'kadence-blocks')
    }, {
      value: 'none',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('None', 'kadence-blocks')
    }, {
      value: 'underline',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Underline', 'kadence-blocks')
    }, {
      value: 'hover_underline',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Underline on Hover', 'kadence-blocks')
    }],
    onChange: value => setAttributes({
      linkStyle: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.URLInputControl, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Heading Wrap Link', 'kadence-blocks'),
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
    dynamicAttribute: 'link',
    allowClear: true
  }, props)))), activeTab === 'style' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_4__.showSettings)('marginSettings', 'kadence/advancedheading') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Spacing Settings', 'kadence-blocks'),
    panelName: 'kb-adv-heading-spacing-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Padding', 'kadence-blocks'),
    value: padding,
    control: paddingControl,
    tabletValue: tabletPadding,
    mobileValue: mobilePadding,
    onChange: value => setAttributes({
      padding: value
    }),
    onChangeTablet: value => setAttributes({
      tabletPadding: value
    }),
    onChangeMobile: value => setAttributes({
      mobilePadding: value
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
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Margin', 'kadence-blocks'),
    value: [undefined !== topMargin ? topMargin : '', undefined !== rightMargin ? rightMargin : '', undefined !== bottomMargin ? bottomMargin : '', undefined !== leftMargin ? leftMargin : ''],
    control: marginControl,
    tabletValue: tabletMargin,
    mobileValue: mobileMargin,
    onChange: value => {
      setAttributes({
        topMargin: value[0],
        rightMargin: value[1],
        bottomMargin: value[2],
        leftMargin: value[3]
      });
    },
    onChangeTablet: value => setAttributes({
      tabletMargin: value
    }),
    onChangeMobile: value => setAttributes({
      mobileMargin: value
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
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Text Shadow Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-adv-heading-text-shadow'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.TextShadowControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Text Shadow', 'kadence-blocks'),
    enable: undefined !== textShadow && undefined !== textShadow[0] && undefined !== textShadow[0].enable ? textShadow[0].enable : false,
    color: undefined !== textShadow && undefined !== textShadow[0] && undefined !== textShadow[0].color ? textShadow[0].color : 'rgba(0, 0, 0, 0.2)',
    colorDefault: 'rgba(0, 0, 0, 0.2)',
    hOffset: undefined !== textShadow && undefined !== textShadow[0] && undefined !== textShadow[0].hOffset ? textShadow[0].hOffset : 1,
    vOffset: undefined !== textShadow && undefined !== textShadow[0] && undefined !== textShadow[0].vOffset ? textShadow[0].vOffset : 1,
    blur: undefined !== textShadow && undefined !== textShadow[0] && undefined !== textShadow[0].blur ? textShadow[0].blur : 1,
    onEnableChange: value => {
      saveShadow({
        enable: value
      });
    },
    onColorChange: value => {
      saveShadow({
        color: value
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
    }
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.InspectorAdvancedControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('HTML Anchor', 'kadence-blocks'),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Anchors lets you link directly to a section on a page.', 'kadence-blocks'),
    value: anchor || '',
    onChange: nextValue => {
      nextValue = nextValue.replace(ANCHOR_REGEX, '-');
      setAttributes({
        anchor: nextValue
      });
    }
  })), kadenceAnimation && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: `kt-animation-wrap-${kadenceAnimation}`
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    id: `animate-id${uniqueID}`,
    className: 'aos-animate kt-animation-wrap',
    "data-aos": kadenceAnimation ? kadenceAnimation : undefined,
    "data-aos-duration": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration ? kadenceAOSOptions[0].duration : undefined,
    "data-aos-easing": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing ? kadenceAOSOptions[0].easing : undefined
  }, link ? headingLinkContent : headingContent)), !kadenceAnimation && (link ? headingLinkContent : headingContent), googleFont && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.WebfontLoader, {
    config: config
  }), markGoogleFont && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.WebfontLoader, {
    config: sconfig
  }));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_10__.compose)([(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_9__.withSelect)(select => {
  return {
    getPreviewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
    isUniqueID: value => select('kadenceblocks/data').isUniqueID(value),
    isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId)
  };
}), (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_9__.withDispatch)(dispatch => ({
  addUniqueID: (value, clientId) => dispatch('kadenceblocks/data').addUniqueID(value, clientId)
}))])(KadenceAdvancedHeading));

/***/ }),

/***/ "./src/blocks/advanced-heading/markformat.js":
/*!***************************************************!*\
  !*** ./src/blocks/advanced-heading/markformat.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);


const {
  Fragment
} = wp.element;
const {
  toggleFormat,
  registerFormatType
} = wp.richText;
const {
  RichTextToolbarButton,
  RichTextShortcut
} = wp.blockEditor;
const icon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  viewBox: "0 0 20 20",
  xmlns: "http://www.w3.org/2000/svg",
  fillRule: "evenodd",
  clipRule: "evenodd",
  strokeLinejoin: "round",
  strokeMiterlimit: "1.414"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M4.331,15.598l2.193,1.693c0,0 -0.813,1.215 -0.992,1.215c-1.129,0.003 -1.424,0.008 -2.603,-0.001c-0.741,-0.006 -0.04,-0.955 0.187,-1.269c0.502,-0.694 1.215,-1.638 1.215,-1.638Zm7.632,-14.107c0.364,-0.061 5.412,3.896 5.439,4.272c0.031,0.438 -4.887,8.469 -5.635,9.648c-0.251,0.397 -1.185,0.206 -2.064,0.472c-0.801,0.243 -1.89,1.336 -2.193,1.105c-1.047,-0.796 -2.217,-1.646 -3.117,-2.49c-0.367,-0.343 0.388,-1.241 0.405,-2.188c0.015,-0.811 -0.644,-2.029 -0.196,-2.575c0.836,-1.019 6.931,-8.172 7.361,-8.244Zm0.144,1.454l3.95,3.105l-4.972,8.1l-5.197,-4.053l6.219,-7.152Z"
}));
const name = 'kadence/mark';
const kadenceMarkHighlight = {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Highlight'),
  tagName: 'mark',
  className: 'kt-highlight',

  edit(_ref) {
    let {
      isActive,
      value,
      onChange
    } = _ref;

    const onToggle = () => onChange(toggleFormat(value, {
      type: name
    }));

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(RichTextShortcut, {
      type: "primary",
      character: "m",
      onUse: onToggle
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(RichTextToolbarButton, {
      icon: icon,
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Highlight'),
      onClick: onToggle,
      isActive: isActive,
      shortcutType: "access",
      shortcutCharacter: "m",
      className: `toolbar-button-with-text toolbar-button__${name}`
    }));
  }

};
registerFormatType(name, kadenceMarkHighlight);

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

/***/ "./src/blocks/advanced-heading/block.json":
/*!************************************************!*\
  !*** ./src/blocks/advanced-heading/block.json ***!
  \************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Advanced Text","name":"kadence/advancedheading","category":"kadence-blocks","attributes":{"content":{"type":"string","source":"html","selector":"h1,h2,h3,h4,h5,h6,p,span,div"},"level":{"type":"number","default":2},"uniqueID":{"type":"string"},"align":{"type":"string"},"color":{"type":"string"},"size":{"type":"number"},"sizeType":{"type":"string","default":"px"},"lineHeight":{"type":"number"},"lineType":{"type":"string","default":"px"},"tabSize":{"type":"number"},"tabLineHeight":{"type":"number"},"mobileSize":{"type":"number"},"mobileLineHeight":{"type":"number"},"letterSpacing":{"type":"number"},"typography":{"type":"string","default":""},"googleFont":{"type":"boolean","default":false},"loadGoogleFont":{"type":"boolean","default":true},"fontSubset":{"type":"string","default":""},"fontVariant":{"type":"string","default":""},"fontWeight":{"type":"string","default":""},"fontStyle":{"type":"string","default":"normal"},"topMargin":{"type":"number","default":""},"bottomMargin":{"type":"number","default":""},"leftMargin":{"type":"number","default":""},"rightMargin":{"type":"number","default":""},"marginType":{"type":"string","default":"px"},"tabletMargin":{"type":"array","default":["","","",""]},"mobileMargin":{"type":"array","default":["","","",""]},"tabletMarginType":{"type":"string","default":"px"},"mobileMarginType":{"type":"string","default":"px"},"paddingType":{"type":"string","default":"px"},"padding":{"type":"array","default":["","","",""]},"tabletPadding":{"type":"array","default":["","","",""]},"mobilePadding":{"type":"array","default":["","","",""]},"markSize":{"type":"array","default":["","",""]},"markSizeType":{"type":"string","default":"px"},"markLineHeight":{"type":"array","default":["","",""]},"markLineType":{"type":"string","default":"px"},"markLetterSpacing":{"type":"number"},"markTypography":{"type":"string","default":""},"markGoogleFont":{"type":"boolean","default":false},"markLoadGoogleFont":{"type":"boolean","default":true},"markFontSubset":{"type":"string","default":""},"markFontVariant":{"type":"string","default":""},"markFontWeight":{"type":"string","default":""},"markFontStyle":{"type":"string","default":"normal"},"markColor":{"type":"string","default":"#f76a0c"},"markBG":{"type":"string"},"markBGOpacity":{"type":"number","default":1},"markPadding":{"type":"array","default":[0,0,0,0]},"markTabPadding":{"type":"array","default":["","","",""]},"markMobilePadding":{"type":"array","default":["","","",""]},"markPaddingControl":{"type":"string","default":"linked"},"markBorder":{"type":"string"},"markBorderOpacity":{"type":"number","default":1},"markBorderWidth":{"type":"number","default":0},"markBorderStyle":{"type":"string","default":"solid"},"textTransform":{"type":"string","default":""},"markTextTransform":{"type":"string","default":""},"anchor":{"type":"string"},"colorClass":{"type":"string"},"tabletAlign":{"type":"string"},"mobileAlign":{"type":"string"},"textShadow":{"type":"array","default":[{"enable":false,"color":"rgba(0, 0, 0, 0.2)","blur":1,"hOffset":1,"vOffset":1}]},"htmlTag":{"type":"string","default":"heading"},"loadItalic":{"type":"boolean","default":false},"link":{"type":"string"},"linkTarget":{"type":"boolean","default":false},"linkNoFollow":{"type":"boolean","default":false},"linkSponsored":{"type":"boolean","default":false},"background":{"type":"string"},"backgroundColorClass":{"type":"string"},"linkStyle":{"type":"string"},"linkColor":{"type":"string"},"linkHoverColor":{"type":"string"},"inQueryBlock":{"type":"bool","default":false}},"usesContext":["postId","queryId"],"supports":{"ktanimate":true,"ktanimatereveal":true,"ktanimatepreview":true,"ktdynamic":true}}');

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
/******/ 			"blocks-advanced-heading": 0,
/******/ 			"./style-blocks-advanced-heading": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-blocks-advanced-heading"], () => (__webpack_require__("./src/blocks/advanced-heading/block.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	(this.kadence = this.kadence || {})["blocks-advanced-heading"] = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=blocks-advanced-heading.js.map