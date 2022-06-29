/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/tabs/editor.scss":
/*!*************************************!*\
  !*** ./src/blocks/tabs/editor.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/tabs/style.scss":
/*!************************************!*\
  !*** ./src/blocks/tabs/style.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/tabs/block.js":
/*!**********************************!*\
  !*** ./src/blocks/tabs/block.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tab_block_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tab/block.js */ "./src/blocks/tabs/tab/block.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/tabs/style.scss");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/blocks/tabs/block.json");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./edit */ "./src/blocks/tabs/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./save */ "./src/blocks/tabs/save.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_12__);


/**
 * BLOCK: Kadence Tabs
 */

/**
 * Register sub blocks.
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
 * Import save
 */


/**
 * Import Css
 */
// import './style.scss';
// import './editor.scss';

/**
 * Internal block libraries
 */




function kt_stripStringRender(string) {
  return string.toLowerCase().replace(/[^0-9a-z-]/g, '');
}
/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */


(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_12__.registerBlockType)('kadence/tabs', { ..._block_json__WEBPACK_IMPORTED_MODULE_4__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tabs', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('tabs', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('tab', 'kadence-blocks'), 'KB'],
  icon: {
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.blockTabsIcon
  },

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

  edit: _edit__WEBPACK_IMPORTED_MODULE_9__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_10__["default"],
  deprecated: [{
    attributes: {
      uniqueID: {
        type: 'string',
        default: ''
      },
      tabCount: {
        type: 'number',
        default: 3
      },
      layout: {
        type: 'string',
        default: 'tabs'
      },
      mobileLayout: {
        type: 'string',
        default: 'inherit'
      },
      tabletLayout: {
        type: 'string',
        default: 'inherit'
      },
      currentTab: {
        type: 'number',
        default: 1
      },
      minHeight: {
        type: 'number',
        default: ''
      },
      maxWidth: {
        type: 'number',
        default: ''
      },
      contentBgColor: {
        type: 'string',
        default: ''
      },
      contentBorderColor: {
        type: 'string',
        default: ''
      },
      contentBorder: {
        type: 'array',
        default: [1, 1, 1, 1]
      },
      contentBorderControl: {
        type: 'string',
        default: 'linked'
      },
      innerPadding: {
        type: 'array',
        default: [20, 20, 20, 20]
      },
      innerPaddingControl: {
        type: 'string',
        default: 'linked'
      },
      innerPaddingM: {
        type: 'array'
      },
      tabAlignment: {
        type: 'string',
        default: 'left'
      },
      blockAlignment: {
        type: 'string',
        default: 'none'
      },
      titles: {
        type: 'array',
        default: [{
          text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab 1', 'kadence-blocks'),
          icon: '',
          iconSide: 'right',
          onlyIcon: false,
          subText: '',
          anchor: ''
        }, {
          text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab 2', 'kadence-blocks'),
          icon: '',
          iconSide: 'right',
          onlyIcon: false,
          subText: '',
          anchor: ''
        }, {
          text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab 3', 'kadence-blocks'),
          icon: '',
          iconSide: 'right',
          onlyIcon: false,
          subText: '',
          anchor: ''
        }]
      },
      iSize: {
        type: 'number',
        default: 14
      },
      titleColor: {
        type: 'string'
      },
      titleColorHover: {
        type: 'string'
      },
      titleColorActive: {
        type: 'string'
      },
      titleBg: {
        type: 'string'
      },
      titleBgHover: {
        type: 'string'
      },
      titleBgActive: {
        type: 'string',
        default: '#ffffff'
      },
      titleBorder: {
        type: 'string'
      },
      titleBorderHover: {
        type: 'string'
      },
      titleBorderActive: {
        type: 'string'
      },
      titleBorderWidth: {
        type: 'array'
      },
      titleBorderControl: {
        type: 'string',
        default: 'individual'
      },
      titleBorderRadius: {
        type: 'array'
      },
      titleBorderRadiusControl: {
        type: 'string',
        default: 'individual'
      },
      titlePadding: {
        type: 'array'
      },
      titlePaddingControl: {
        type: 'string',
        default: 'individual'
      },
      titleMargin: {
        type: 'array'
      },
      titleMarginControl: {
        type: 'string',
        default: 'individual'
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
      textTransform: {
        type: 'string'
      },
      fontStyle: {
        type: 'string',
        default: 'normal'
      },
      startTab: {
        type: 'number',
        default: ''
      },
      showPresets: {
        type: 'bool',
        default: true
      },
      subtitleFont: {
        type: 'array',
        default: [{
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
          paddingControl: 'linked',
          margin: [0, 0, 0, 0],
          marginControl: 'linked'
        }]
      },
      enableSubtitle: {
        type: 'bool',
        default: false
      },
      widthType: {
        type: 'string',
        default: 'normal'
      },
      tabWidth: {
        type: 'array',
        default: [4, '', '']
      },
      gutter: {
        type: 'array',
        default: [10, '', '']
      }
    },
    save: props => {
      const {
        attributes: {
          tabCount,
          blockAlignment,
          currentTab,
          mobileLayout,
          layout,
          tabletLayout,
          uniqueID,
          titles,
          iSize,
          maxWidth,
          tabAlignment,
          startTab,
          enableSubtitle,
          widthType,
          tabWidth
        }
      } = props;
      const layoutClass = !layout ? 'tabs' : layout;
      const tabLayoutClass = !tabletLayout ? 'inherit' : tabletLayout;
      const mobileLayoutClass = !mobileLayout ? 'inherit' : mobileLayout;
      const accordionClass = mobileLayout && 'accordion' === mobileLayout || tabletLayout && 'accordion' === tabletLayout ? 'kt-create-accordion' : '';
      const classId = !uniqueID ? 'notset' : uniqueID;
      const theTabAlignment = tabAlignment ? tabAlignment : 'left';
      const classes = classnames__WEBPACK_IMPORTED_MODULE_5___default()(`align${blockAlignment}`);
      const activeTab = startTab ? startTab : currentTab;
      const innerClasses = classnames__WEBPACK_IMPORTED_MODULE_5___default()(`kt-tabs-wrap kt-tabs-id${classId} kt-tabs-has-${tabCount}-tabs kt-active-tab-${activeTab} kt-tabs-layout-${layoutClass} kt-tabs-tablet-layout-${tabLayoutClass} kt-tabs-mobile-layout-${mobileLayoutClass} kt-tab-alignment-${theTabAlignment} ${accordionClass}`);

      const renderTitles = index => {
        const backupAnchor = `tab-${titles[index] && titles[index].text ? kt_stripStringRender(titles[index].text.toString()) : kt_stripStringRender((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab') + (1 + index))}`;
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
          id: titles[index] && titles[index].anchor ? titles[index].anchor : backupAnchor,
          className: `kt-title-item kt-title-item-${1 + index} kt-tabs-svg-show-${titles[index] && titles[index].onlyIcon ? 'only' : 'always'} kt-tabs-icon-side-${titles[index] && titles[index].iconSide ? titles[index].iconSide : 'right'} kt-tab-title-${1 + index === activeTab ? 'active' : 'inactive'}${enableSubtitle ? ' kb-tabs-have-subtitle' : ''}`
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: `#${titles[index] && titles[index].anchor ? titles[index].anchor : backupAnchor}`,
          "data-tab": 1 + index,
          className: `kt-tab-title kt-tab-title-${1 + index} `
        }, titles[index] && titles[index].icon && 'right' !== titles[index].iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_7__.IconRender, {
          className: `kt-tab-svg-icon kt-tab-svg-icon-${titles[index].icon} kt-title-svg-side-${titles[index].iconSide}`,
          name: titles[index].icon,
          size: !iSize ? '14' : iSize,
          htmltag: "span"
        }), (!enableSubtitle || undefined !== titles[index] && undefined === titles[index].subText || undefined !== titles[index] && undefined !== titles[index].subText && '' === titles[index].subText) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.RichText.Content, {
          tagName: "span",
          value: titles[index] && titles[index].text ? titles[index].text : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab %d'), 1 + index),
          className: 'kt-title-text'
        }), enableSubtitle && titles[index] && undefined !== titles[index].subText && '' !== titles[index].subText && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "kb-tab-titles-wrap"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.RichText.Content, {
          tagName: "span",
          value: titles[index] && titles[index].text ? titles[index].text : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab %d'), 1 + index),
          className: 'kt-title-text'
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.RichText.Content, {
          tagName: "span",
          value: titles[index].subText,
          className: 'kt-title-sub-text'
        })), titles[index] && titles[index].icon && 'right' === titles[index].iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_7__.IconRender, {
          className: `kt-tab-svg-icon kt-tab-svg-icon-${titles[index].icon} kt-title-svg-side-${titles[index].iconSide}`,
          name: titles[index].icon,
          size: !iSize ? '14' : iSize,
          htmltag: "span"
        }))));
      };

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: classes
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: innerClasses,
        style: {
          maxWidth: maxWidth ? maxWidth + 'px' : 'none'
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
        className: `kt-tabs-title-list${'tabs' === layout && widthType === 'percent' ? ' kb-tabs-list-columns kb-tab-title-columns-' + tabWidth[0] : ''}`
      }, (0,lodash__WEBPACK_IMPORTED_MODULE_6__.times)(tabCount, n => renderTitles(n))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-tabs-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.InnerBlocks.Content, null))));
    }
  }, {
    attributes: {
      uniqueID: {
        type: 'string',
        default: ''
      },
      tabCount: {
        type: 'number',
        default: 3
      },
      layout: {
        type: 'string',
        default: 'tabs'
      },
      mobileLayout: {
        type: 'string',
        default: 'inherit'
      },
      tabletLayout: {
        type: 'string',
        default: 'inherit'
      },
      currentTab: {
        type: 'number',
        default: 1
      },
      minHeight: {
        type: 'number',
        default: ''
      },
      maxWidth: {
        type: 'number',
        default: ''
      },
      contentBgColor: {
        type: 'string',
        default: ''
      },
      contentBorderColor: {
        type: 'string',
        default: ''
      },
      contentBorder: {
        type: 'array',
        default: [1, 1, 1, 1]
      },
      contentBorderControl: {
        type: 'string',
        default: 'linked'
      },
      innerPadding: {
        type: 'array',
        default: [20, 20, 20, 20]
      },
      innerPaddingControl: {
        type: 'string',
        default: 'linked'
      },
      innerPaddingM: {
        type: 'array'
      },
      tabAlignment: {
        type: 'string',
        default: 'left'
      },
      blockAlignment: {
        type: 'string',
        default: 'none'
      },
      titles: {
        type: 'array',
        default: [{
          text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab 1'),
          icon: '',
          iconSide: 'right',
          onlyIcon: false
        }, {
          text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab 2'),
          icon: '',
          iconSide: 'right',
          onlyIcon: false
        }, {
          text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab 3'),
          icon: '',
          iconSide: 'right',
          onlyIcon: false
        }]
      },
      iSize: {
        type: 'number',
        default: 14
      },
      titleColor: {
        type: 'string'
      },
      titleColorHover: {
        type: 'string'
      },
      titleColorActive: {
        type: 'string'
      },
      titleBg: {
        type: 'string'
      },
      titleBgHover: {
        type: 'string'
      },
      titleBgActive: {
        type: 'string',
        default: '#ffffff'
      },
      titleBorder: {
        type: 'string'
      },
      titleBorderHover: {
        type: 'string'
      },
      titleBorderActive: {
        type: 'string'
      },
      titleBorderWidth: {
        type: 'array'
      },
      titleBorderControl: {
        type: 'string',
        default: 'individual'
      },
      titleBorderRadius: {
        type: 'array'
      },
      titleBorderRadiusControl: {
        type: 'string',
        default: 'individual'
      },
      titlePadding: {
        type: 'array'
      },
      titlePaddingControl: {
        type: 'string',
        default: 'individual'
      },
      titleMargin: {
        type: 'array'
      },
      titleMarginControl: {
        type: 'string',
        default: 'individual'
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
    save: _ref2 => {
      let {
        attributes
      } = _ref2;
      const {
        tabCount,
        blockAlignment,
        currentTab,
        mobileLayout,
        layout,
        tabletLayout,
        uniqueID,
        titles,
        iSize,
        maxWidth,
        tabAlignment
      } = attributes;
      const layoutClass = !layout ? 'tabs' : layout;
      const tabLayoutClass = !tabletLayout ? 'inherit' : tabletLayout;
      const mobileLayoutClass = !mobileLayout ? 'inherit' : mobileLayout;
      const accordionClass = mobileLayout && 'accordion' === mobileLayout || tabletLayout && 'accordion' === tabletLayout ? 'kt-create-accordion' : '';
      const classId = !uniqueID ? 'notset' : uniqueID;
      const classes = classnames__WEBPACK_IMPORTED_MODULE_5___default()(`align${blockAlignment}`);
      const innerClasses = classnames__WEBPACK_IMPORTED_MODULE_5___default()(`kt-tabs-wrap kt-tabs-id${classId} kt-tabs-has-${tabCount}-tabs kt-active-tab-${currentTab} kt-tabs-layout-${layoutClass} kt-tabs-tablet-layout-${tabLayoutClass} kt-tabs-mobile-layout-${mobileLayoutClass} kt-tab-alignment-${tabAlignment} ${accordionClass}`);

      const renderTitles = index => {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
          id: `tab-${titles[index] && titles[index].text ? kt_stripStringRender(titles[index].text.toString()) : kt_stripStringRender((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab') + (1 + index))}`,
          className: `kt-title-item kt-title-item-${1 + index} kt-tabs-svg-show-${titles[index] && titles[index].onlyIcon ? 'only' : 'always'} kt-tabs-icon-side-${titles[index] && titles[index].iconSide ? titles[index].iconSide : 'right'} kt-tab-title-${1 + index === currentTab ? 'active' : 'inactive'}`
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: `#tab-${titles[index] && titles[index].text ? kt_stripStringRender(titles[index].text.toString()) : kt_stripStringRender((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab') + (1 + index))}`,
          "data-tab": 1 + index,
          className: `kt-tab-title kt-tab-title-${1 + index} `
        }, titles[index] && titles[index].icon && 'right' !== titles[index].iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_7__.IconRender, {
          className: `kt-tab-svg-icon kt-tab-svg-icon-${titles[index].icon} kt-title-svg-side-${titles[index].iconSide}`,
          name: titles[index].icon,
          size: !iSize ? '14' : iSize
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.RichText.Content, {
          tagName: "span",
          value: titles[index] && titles[index].text ? titles[index].text : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab %d'), 1 + index),
          className: 'kt-title-text'
        }), titles[index] && titles[index].icon && 'right' === titles[index].iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_7__.IconRender, {
          className: `kt-tab-svg-icon kt-tab-svg-icon-${titles[index].icon} kt-title-svg-side-${titles[index].iconSide}`,
          name: titles[index].icon,
          size: !iSize ? '14' : iSize
        }))));
      };

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: classes
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: innerClasses,
        style: {
          maxWidth: maxWidth ? maxWidth + 'px' : 'none'
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
        className: "kt-tabs-title-list"
      }, (0,lodash__WEBPACK_IMPORTED_MODULE_6__.times)(tabCount, n => renderTitles(n))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kt-tabs-content-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_8__.InnerBlocks.Content, null))));
    }
  }]
});

/***/ }),

/***/ "./src/blocks/tabs/edit.js":
/*!*********************************!*\
  !*** ./src/blocks/tabs/edit.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var memize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! memize */ "./node_modules/memize/index.js");
/* harmony import */ var memize__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(memize__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/tabs/editor.scss");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__);


/**
 * BLOCK: Kadence Tabs
 */

/**
 * Import Icons
 */

/**
 * Import External
 */






/**
 * Import Css
 */


const {
  createBlock
} = wp.blocks;


const {
  Component,
  Fragment
} = wp.element;
const {
  InnerBlocks,
  InspectorControls,
  RichText,
  BlockControls,
  AlignmentToolbar,
  BlockAlignmentToolbar
} = wp.blockEditor;

const {
  applyFilters
} = wp.hooks;
/**
 * Internal block libraries
 */


const ALLOWED_BLOCKS = ['kadence/tab'];
/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */

const ANCHOR_REGEX = /[\s#]/g;
/**
 * Returns the layouts configuration for a given number of panes.
 *
 * @param {number} panes Number of panes.
 *
 * @return {Object[]} Panes layout configuration.
 */

const getPanesTemplate = memize__WEBPACK_IMPORTED_MODULE_3___default()(panes => {
  return (0,lodash__WEBPACK_IMPORTED_MODULE_4__.times)(panes, n => ['kadence/tab', {
    id: n + 1
  }]);
});
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */

const kttabsUniqueIDs = [];
/**
 * Build the row edit
 */

class KadenceTabs extends Component {
  constructor() {
    super(...arguments);
    this.showSettings = this.showSettings.bind(this);
    this.onMoveForward = this.onMoveForward.bind(this);
    this.onMoveBack = this.onMoveBack.bind(this);
    this.state = {
      hovered: 'false',
      showPreset: false,
      user: kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin',
      settings: {}
    };
  }

  componentDidMount() {
    if (!this.props.attributes.uniqueID) {
      const oldBlockConfig = kadence_blocks_params.config['kadence/tabs'];
      const blockConfigObject = kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : [];

      if (blockConfigObject['kadence/tabs'] !== undefined && typeof blockConfigObject['kadence/tabs'] === 'object') {
        Object.keys(blockConfigObject['kadence/tabs']).map(attribute => {
          this.props.attributes[attribute] = blockConfigObject['kadence/tabs'][attribute];
        });
      } else if (oldBlockConfig !== undefined && typeof oldBlockConfig === 'object') {
        Object.keys(oldBlockConfig).map(attribute => {
          this.props.attributes[attribute] = oldBlockConfig[attribute];
        });
      }

      if (this.props.attributes.showPresets) {
        this.setState({
          showPreset: true
        });
      }

      this.props.setAttributes({
        uniqueID: '_' + this.props.clientId.substr(2, 9)
      });
      kttabsUniqueIDs.push('_' + this.props.clientId.substr(2, 9));
    } else if (kttabsUniqueIDs.includes(this.props.attributes.uniqueID)) {
      this.props.attributes.uniqueID = '_' + this.props.clientId.substr(2, 9);
      kttabsUniqueIDs.push('_' + this.props.clientId.substr(2, 9));
    } else {
      kttabsUniqueIDs.push(this.props.attributes.uniqueID);
    }
  }

  showSettings(key) {
    if (undefined === this.state.settings[key] || 'all' === this.state.settings[key]) {
      return true;
    } else if ('contributor' === this.state.settings[key] && ('contributor' === this.state.user || 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user)) {
      return true;
    } else if ('author' === this.state.settings[key] && ('author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user)) {
      return true;
    } else if ('editor' === this.state.settings[key] && ('editor' === this.state.user || 'admin' === this.state.user)) {
      return true;
    } else if ('admin' === this.state.settings[key] && 'admin' === this.state.user) {
      return true;
    }

    return false;
  }

  saveArrayUpdate(value, index) {
    const {
      attributes,
      setAttributes
    } = this.props;
    const {
      titles
    } = attributes;
    const newItems = titles.map((item, thisIndex) => {
      if (index === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      titles: newItems
    });
  }

  onMove(oldIndex, newIndex) {
    const titles = [...this.props.attributes.titles];
    titles.splice(newIndex, 1, this.props.attributes.titles[oldIndex]);
    titles.splice(oldIndex, 1, this.props.attributes.titles[newIndex]);
    this.props.setAttributes({
      titles: titles,
      currentTab: parseInt(newIndex + 1)
    });

    if (this.props.attributes.startTab === oldIndex + 1) {
      this.props.setAttributes({
        startTab: newIndex + 1
      });
    } else if (this.props.attributes.startTab === newIndex + 1) {
      this.props.setAttributes({
        startTab: oldIndex + 1
      });
    } //this.props.moveTab( this.props.tabsBlock.innerBlocks[ oldIndex ].clientId, newIndex );


    this.props.moveTab(oldIndex, newIndex);
    this.props.resetOrder();
    this.props.setAttributes({
      currentTab: parseInt(newIndex + 1)
    });
  }

  onMoveForward(oldIndex) {
    return () => {
      if (oldIndex === this.props.realTabsCount - 1) {
        return;
      }

      this.onMove(oldIndex, oldIndex + 1);
    };
  }

  onMoveBack(oldIndex) {
    return () => {
      if (oldIndex === 0) {
        return;
      }

      this.onMove(oldIndex, oldIndex - 1);
    };
  }

  render() {
    const {
      attributes: {
        uniqueID,
        tabCount,
        blockAlignment,
        mobileLayout,
        currentTab,
        tabletLayout,
        layout,
        innerPadding,
        minHeight,
        maxWidth,
        titles,
        titleColor,
        titleColorHover,
        titleColorActive,
        titleBg,
        titleBgHover,
        titleBgActive,
        size,
        sizeType,
        lineType,
        lineHeight,
        tabLineHeight,
        tabSize,
        mobileSize,
        mobileLineHeight,
        letterSpacing,
        borderRadius,
        titleBorderWidth,
        titleBorderControl,
        titleBorder,
        titleBorderHover,
        titleBorderActive,
        typography,
        fontVariant,
        fontWeight,
        fontStyle,
        fontSubset,
        googleFont,
        loadGoogleFont,
        innerPaddingControl,
        contentBorder,
        contentBorderControl,
        contentBorderColor,
        titlePadding,
        titlePaddingControl,
        titleMargin,
        titleMarginControl,
        contentBgColor,
        tabAlignment,
        titleBorderRadiusControl,
        titleBorderRadius,
        iSize,
        startTab,
        enableSubtitle,
        subtitleFont,
        tabWidth,
        gutter,
        widthType,
        textTransform
      },
      clientId,
      className,
      setAttributes
    } = this.props;
    const layoutClass = !layout ? 'tabs' : layout;
    const sizeTypes = [{
      key: 'px',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('px')
    }, {
      key: 'em',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('em')
    }];
    const gconfig = {
      google: {
        families: [typography + (fontVariant ? ':' + fontVariant : '')]
      }
    };
    const sgconfig = {
      google: {
        families: [(subtitleFont && subtitleFont[0] && subtitleFont[0].family ? subtitleFont[0].family : '') + (subtitleFont && subtitleFont[0] && subtitleFont[0].variant ? ':' + subtitleFont[0].variant : '')]
      }
    };
    const sconfig = subtitleFont && subtitleFont[0] && subtitleFont[0].google ? sgconfig : '';

    const saveSubtitleFont = value => {
      let tempSubFont;

      if (undefined === subtitleFont || undefined !== subtitleFont && undefined === subtitleFont[0]) {
        tempSubFont = [{
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
          paddingControl: 'linked',
          margin: [0, 0, 0, 0],
          marginControl: 'linked'
        }];
      } else {
        tempSubFont = subtitleFont;
      }

      const newUpdate = tempSubFont.map((item, index) => {
        if (0 === index) {
          item = { ...item,
            ...value
          };
        }

        return item;
      });
      setAttributes({
        subtitleFont: newUpdate
      });
    };

    const startlayoutOptions = [{
      key: 'skip',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Skip'),
      icon: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Skip')
    }, {
      key: 'simple',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Simple'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.tabsSimpleIcon
    }, {
      key: 'boldbg',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Boldbg'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.tabsBoldIcon
    }, {
      key: 'center',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Center'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.tabsCenterIcon
    }, {
      key: 'vertical',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Vertical'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.tabsVerticalIcon
    }];

    const setInitalLayout = key => {
      if ('skip' === key) {} else if ('simple' === key) {
        setAttributes({
          layout: 'tabs',
          tabAlignment: 'left',
          size: 1.1,
          sizeType: 'em',
          lineHeight: 1.4,
          lineType: 'em',
          titleBorderWidth: [1, 1, 0, 1],
          titleBorderControl: 'individual',
          titleBorderRadius: [4, 4, 0, 0],
          titleBorderRadiusControl: 'individual',
          titlePadding: [8, 20, 8, 20],
          titlePaddingControl: 'individual',
          titleMargin: [0, 8, -1, 0],
          titleMarginControl: 'individual',
          titleColor: '#444444',
          titleColorHover: '#444444',
          titleColorActive: '#444444',
          titleBg: '#ffffff',
          titleBgHover: '#ffffff',
          titleBgActive: '#ffffff',
          titleBorder: '#eeeeee',
          titleBorderHover: '#e2e2e2',
          titleBorderActive: '#bcbcbc',
          contentBgColor: '#ffffff',
          contentBorderColor: '#bcbcbc',
          contentBorder: [1, 1, 1, 1],
          contentBorderControl: 'linked'
        });
      } else if ('boldbg' === key) {
        setAttributes({
          layout: 'tabs',
          tabAlignment: 'left',
          size: 1.1,
          sizeType: 'em',
          lineHeight: 1.4,
          lineType: 'em',
          titleBorderWidth: [0, 0, 0, 0],
          titleBorderControl: 'linked',
          titleBorderRadius: [4, 4, 0, 0],
          titleBorderRadiusControl: 'individual',
          titlePadding: [8, 20, 8, 20],
          titlePaddingControl: 'individual',
          titleMargin: [0, 8, 0, 0],
          titleMarginControl: 'individual',
          titleColor: '#222222',
          titleColorHover: '#222222',
          titleColorActive: '#ffffff',
          titleBg: '#eeeeee',
          titleBgHover: '#e2e2e2',
          titleBgActive: '#0a6689',
          titleBorder: '#eeeeee',
          titleBorderHover: '#eeeeee',
          titleBorderActive: '#eeeeee',
          contentBgColor: '#ffffff',
          contentBorderColor: '#0a6689',
          contentBorder: [3, 0, 0, 0],
          contentBorderControl: 'individual'
        });
      } else if ('center' === key) {
        setAttributes({
          layout: 'tabs',
          tabAlignment: 'center',
          size: 1.1,
          sizeType: 'em',
          lineHeight: 1.4,
          lineType: 'em',
          titleBorderWidth: [0, 0, 4, 0],
          titleBorderControl: 'individual',
          titleBorderRadius: [4, 4, 0, 0],
          titleBorderRadiusControl: 'individual',
          titlePadding: [8, 20, 8, 20],
          titlePaddingControl: 'individual',
          titleMargin: [0, 8, 0, 0],
          titleMarginControl: 'individual',
          titleColor: '#555555',
          titleColorHover: '#555555',
          titleColorActive: '#0a6689',
          titleBg: '#ffffff',
          titleBgHover: '#ffffff',
          titleBgActive: '#ffffff',
          titleBorder: '#ffffff',
          titleBorderHover: '#eeeeee',
          titleBorderActive: '#0a6689',
          contentBgColor: '#ffffff',
          contentBorderColor: '#eeeeee',
          contentBorder: [1, 0, 0, 0],
          contentBorderControl: 'individual'
        });
      } else if ('vertical' === key) {
        setAttributes({
          layout: 'vtabs',
          mobileLayout: 'accordion',
          tabAlignment: 'left',
          size: 1.1,
          sizeType: 'em',
          lineHeight: 1.4,
          lineType: 'em',
          titleBorderWidth: [4, 0, 4, 4],
          titleBorderControl: 'individual',
          titleBorderRadius: [10, 0, 0, 10],
          titleBorderRadiusControl: 'individual',
          titlePadding: [12, 8, 12, 20],
          titlePaddingControl: 'individual',
          titleMargin: [0, -4, 10, 0],
          titleMarginControl: 'individual',
          titleColor: '#444444',
          titleColorHover: '#444444',
          titleColorActive: '#444444',
          titleBg: '#eeeeee',
          titleBgHover: '#e9e9e9',
          titleBgActive: '#ffffff',
          titleBorder: '#eeeeee',
          titleBorderHover: '#e9e9e9',
          titleBorderActive: '#eeeeee',
          contentBgColor: '#ffffff',
          contentBorderColor: '#eeeeee',
          contentBorder: [4, 4, 4, 4],
          contentBorderControl: 'linked',
          minHeight: 400
        });
      }
    };

    const config = googleFont ? gconfig : '';
    const fontMin = sizeType === 'em' ? 0.2 : 5;
    const fontMax = sizeType === 'em' ? 12 : 200;
    const fontStep = sizeType === 'em' ? 0.1 : 1;
    const lineMin = lineType === 'px' ? 5 : 0.2;
    const lineMax = lineType === 'px' ? 200 : 12;
    const lineStep = lineType === 'px' ? 1 : 0.1;
    const tabLayoutClass = !tabletLayout ? 'inherit' : tabletLayout;
    const mobileLayoutClass = !mobileLayout ? 'inherit' : mobileLayout;
    const classes = classnames__WEBPACK_IMPORTED_MODULE_2___default()(className, `kt-tabs-wrap kt-tabs-id${uniqueID} kt-tabs-has-${tabCount}-tabs kt-active-tab-${currentTab} kt-tabs-layout-${layoutClass} kt-tabs-block kt-tabs-tablet-layout-${tabLayoutClass} kt-tabs-mobile-layout-${mobileLayoutClass} kt-tab-alignment-${tabAlignment}`);
    const mLayoutOptions = [{
      key: 'tabs',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tabs'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.tabsIcon
    }, {
      key: 'vtabs',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Vertical Tabs'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.vTabsIcon
    }, {
      key: 'accordion',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Accordion'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.accordionIcon
    }];
    const layoutOptions = [{
      key: 'tabs',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tabs'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.tabsIcon
    }, {
      key: 'vtabs',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Vertical Tabs'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.vTabsIcon
    }];
    const mobileControls = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      panelName: 'kb-tabs-mobile-controls'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "components-base-control__label"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Mobile Layout')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Mobile Layout')
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(mLayoutOptions, _ref => {
      let {
        name,
        key,
        icon
      } = _ref;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Tooltip, {
        text: name
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
        key: key,
        className: "kt-layout-btn kt-tablayout",
        isSmall: true,
        isPrimary: mobileLayout === key,
        "aria-pressed": mobileLayout === key,
        onClick: () => setAttributes({
          mobileLayout: key
        })
      }, icon));
    }))));
    const tabletControls = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      panelName: 'kb-tabs-tablet-controls'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "components-base-control__label"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tablet Layout')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tablet Layout')
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(mLayoutOptions, _ref2 => {
      let {
        name,
        key,
        icon
      } = _ref2;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Tooltip, {
        text: name
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
        key: key,
        className: "kt-layout-btn kt-tablayout",
        isSmall: true,
        isPrimary: tabletLayout === key,
        "aria-pressed": tabletLayout === key,
        onClick: () => setAttributes({
          tabletLayout: key
        })
      }, icon));
    })));
    const deskControls = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      panelName: 'kb-tabs-desktop-controls'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "components-base-control__label"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Layout')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Layout')
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(layoutOptions, _ref3 => {
      let {
        name,
        key,
        icon
      } = _ref3;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Tooltip, {
        text: name
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
        key: key,
        className: "kt-layout-btn kt-tablayout",
        isSmall: true,
        isPrimary: layout === key,
        "aria-pressed": layout === key,
        onClick: () => {
          setAttributes({
            layout: key
          });
        }
      }, icon));
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Set initial Open Tab')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('initial Open Tab')
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.times)(tabCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
      key: n + 1,
      className: "kt-init-open-tab",
      isSmall: true,
      isPrimary: startTab === n + 1,
      "aria-pressed": startTab === n + 1,
      onClick: () => setAttributes({
        startTab: n + 1
      })
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab') + ' ' + (n + 1))))));
    const tabControls = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.TabPanel, {
      className: "kt-inspect-tabs",
      activeClass: "active-tab",
      tabs: [{
        name: 'desk',
        title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Dashicon, {
          icon: "desktop"
        }),
        className: 'kt-desk-tab'
      }, {
        name: 'tablet',
        title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Dashicon, {
          icon: "tablet"
        }),
        className: 'kt-tablet-tab'
      }, {
        name: 'mobile',
        title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Dashicon, {
          icon: "smartphone"
        }),
        className: 'kt-mobile-tab'
      }]
    }, tab => {
      let tabout;

      if (tab.name) {
        if ('mobile' === tab.name) {
          tabout = mobileControls;
        } else if ('tablet' === tab.name) {
          tabout = tabletControls;
        } else {
          tabout = deskControls;
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: tab.className,
        key: tab.className
      }, tabout);
    });

    const renderTitles = index => {
      const subFont = subtitleFont && subtitleFont[0] && undefined !== subtitleFont[0].sizeType ? subtitleFont : [{
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
        paddingControl: 'linked',
        margin: [0, 0, 0, 0],
        marginControl: 'linked'
      }];
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
        className: `kt-title-item kt-title-item-${index} kt-tabs-svg-show-${titles[index] && titles[index].onlyIcon ? 'only' : 'always'} kt-tabs-icon-side-${titles[index] && titles[index].iconSide ? titles[index].iconSide : 'right'} kt-tabs-has-icon-${titles[index] && titles[index].icon ? 'true' : 'false'} kt-tab-title-${1 + index === currentTab ? 'active' : 'inactive'}${enableSubtitle ? ' kb-tabs-have-subtitle' : ''}`,
        style: {
          margin: titleMargin ? titleMargin[0] + 'px ' + ('tabs' === layout && widthType === 'percent' ? '0px ' : titleMargin[1] + 'px ') + titleMargin[2] + 'px ' + ('tabs' === layout && widthType === 'percent' ? '0px ' : titleMargin[3] + 'px ') : ''
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-tab-title kt-tab-title-${1 + index}`,
        style: {
          backgroundColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(titleBg),
          color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(titleColor),
          fontSize: size + sizeType,
          lineHeight: lineHeight + lineType,
          fontWeight: fontWeight,
          fontStyle: fontStyle,
          letterSpacing: letterSpacing + 'px',
          textTransform: textTransform ? textTransform : undefined,
          fontFamily: typography ? typography : '',
          borderTopLeftRadius: borderRadius + 'px',
          borderTopRightRadius: borderRadius + 'px',
          borderWidth: titleBorderWidth ? titleBorderWidth[0] + 'px ' + titleBorderWidth[1] + 'px ' + titleBorderWidth[2] + 'px ' + titleBorderWidth[3] + 'px' : '',
          borderRadius: titleBorderRadius ? titleBorderRadius[0] + 'px ' + titleBorderRadius[1] + 'px ' + titleBorderRadius[2] + 'px ' + titleBorderRadius[3] + 'px' : '',
          padding: titlePadding ? titlePadding[0] + 'px ' + titlePadding[1] + 'px ' + titlePadding[2] + 'px ' + titlePadding[3] + 'px' : '',
          borderColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(titleBorder),
          marginRight: 'tabs' === layout && widthType === 'percent' ? gutter[0] + 'px' : undefined
        },
        onClick: () => setAttributes({
          currentTab: 1 + index
        }),
        onKeyPress: () => setAttributes({
          currentTab: 1 + index
        }),
        tabIndex: "0",
        role: "button"
      }, titles[index] && titles[index].icon && 'right' !== titles[index].iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.IconRender, {
        className: `kt-tab-svg-icon kt-tab-svg-icon-${titles[index].icon} kt-title-svg-side-${titles[index].iconSide}`,
        name: titles[index].icon,
        size: !iSize ? '14' : iSize,
        htmltag: "span"
      }), (undefined === enableSubtitle || !enableSubtitle) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(RichText, {
        tagName: "div",
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab Title', 'kadence-blocks'),
        value: titles[index] && titles[index].text ? titles[index].text : '',
        unstableOnFocus: () => setAttributes({
          currentTab: 1 + index
        }),
        onChange: value => {
          this.saveArrayUpdate({
            text: value
          }, index);
        },
        allowedFormats: applyFilters('kadence.whitelist_richtext_formats', ['kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field']),
        className: 'kt-title-text',
        style: {
          lineHeight: lineHeight + lineType
        },
        keepPlaceholderOnFocus: true
      }), enableSubtitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kb-tab-titles-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(RichText, {
        tagName: "div",
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab Title', 'kadence-blocks'),
        value: titles[index] && titles[index].text ? titles[index].text : '',
        unstableOnFocus: () => setAttributes({
          currentTab: 1 + index
        }),
        onChange: value => {
          this.saveArrayUpdate({
            text: value
          }, index);
        },
        allowedFormats: applyFilters('kadence.whitelist_richtext_formats', ['kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field']),
        className: 'kt-title-text',
        style: {
          lineHeight: lineHeight + lineType
        },
        keepPlaceholderOnFocus: true
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(RichText, {
        tagName: "div",
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab subtitle', 'kadence-blocks'),
        value: undefined !== titles[index] && undefined !== titles[index].subText ? titles[index].subText : '',
        unstableOnFocus: () => setAttributes({
          currentTab: 1 + index
        }),
        onChange: value => {
          this.saveArrayUpdate({
            subText: value
          }, index);
        },
        allowedFormats: applyFilters('kadence.whitelist_richtext_formats', ['kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field']),
        className: 'kt-title-sub-text',
        style: {
          fontWeight: subFont[0].weight,
          fontStyle: subFont[0].style,
          fontSize: subFont[0].size[0] + subFont[0].sizeType,
          lineHeight: subFont[0].lineHeight && subFont[0].lineHeight[0] ? subFont[0].lineHeight[0] + subFont[0].lineType : undefined,
          textTransform: subFont[0].textTransform ? subFont[0].textTransform : undefined,
          letterSpacing: subFont[0].letterSpacing + 'px',
          fontFamily: subFont[0].family ? subFont[0].family : '',
          padding: subFont[0].padding ? subFont[0].padding[0] + 'px ' + subFont[0].padding[1] + 'px ' + subFont[0].padding[2] + 'px ' + subFont[0].padding[3] + 'px' : '',
          margin: subFont[0].margin ? subFont[0].margin[0] + 'px ' + subFont[0].margin[1] + 'px ' + subFont[0].margin[2] + 'px ' + subFont[0].margin[3] + 'px' : ''
        },
        keepPlaceholderOnFocus: true
      })), titles[index] && titles[index].icon && 'right' === titles[index].iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.IconRender, {
        className: `kt-tab-svg-icon kt-tab-svg-icon-${titles[index].icon} kt-title-svg-side-${titles[index].iconSide}`,
        name: titles[index].icon,
        size: !iSize ? '14' : iSize,
        htmltag: "span"
      })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kadence-blocks-tab-item__control-menu"
      }, index !== 0 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
        icon: 'vtabs' === layout ? 'arrow-up' : 'arrow-left',
        onClick: index === 0 ? undefined : this.onMoveBack(index),
        className: "kadence-blocks-tab-item__move-back",
        label: 'vtabs' === layout ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Move Item Up', 'kadence-blocks') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Move Item Back', 'kadence-blocks'),
        "aria-disabled": index === 0,
        disabled: index === 0
      }), index + 1 !== tabCount && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
        icon: 'vtabs' === layout ? 'arrow-down' : 'arrow-right',
        onClick: index + 1 === tabCount ? undefined : this.onMoveForward(index),
        className: "kadence-blocks-tab-item__move-forward",
        label: 'vtabs' === layout ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Move Item Down', 'kadence-blocks') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Move Item Forward', 'kadence-blocks'),
        "aria-disabled": index + 1 === tabCount,
        disabled: index + 1 === tabCount
      }), tabCount > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
        icon: "no-alt",
        onClick: () => {
          const removeClientId = this.props.tabsBlock.innerBlocks[index].clientId;
          const currentItems = (0,lodash__WEBPACK_IMPORTED_MODULE_4__.filter)(this.props.attributes.titles, (item, i) => index !== i);
          const newCount = tabCount - 1;
          let newStartTab;

          if (startTab === index + 1) {
            newStartTab = '';
          } else if (startTab > index + 1) {
            newStartTab = startTab - 1;
          } else {
            newStartTab = startTab;
          }

          this.props.removeTab(index);
          setAttributes({
            titles: currentItems,
            tabCount: newCount,
            currentTab: index === 0 ? 1 : index,
            startTab: newStartTab
          });
          this.props.resetOrder();
        },
        className: "kadence-blocks-tab-item__remove",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Remove Item', 'kadence-blocks'),
        disabled: !currentTab === index + 1
      }))));
    };

    const renderPreviewArray = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.times)(tabCount, n => renderTitles(n)));

    const renderAnchorSettings = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab', 'kadence-blocks') + ' ' + (index + 1) + ' ' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Anchor', 'kadence-blocks'),
        initialOpen: false,
        panelName: 'kb-tab-anchor-' + index
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('HTML Anchor', 'kadence-blocks'),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Anchors lets you link directly to a tab.', 'kadence-blocks'),
        value: titles[index] && titles[index].anchor ? titles[index].anchor : '',
        onChange: nextValue => {
          nextValue = nextValue.replace(ANCHOR_REGEX, '-');
          this.saveArrayUpdate({
            anchor: nextValue
          }, index);
        }
      }));
    };

    const renderTitleSettings = index => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab', 'kadence-blocks') + ' ' + (index + 1) + ' ' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Icon', 'kadence-blocks'),
        initialOpen: false,
        panelName: 'kb-tab-icon-' + index
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.IconControl, {
        value: titles[index] && titles[index].icon ? titles[index].icon : '',
        onChange: value => {
          this.saveArrayUpdate({
            icon: value
          }, index);
        }
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Icon Location', 'kadence-blocks'),
        value: titles[index] && titles[index].iconSide ? titles[index].iconSide : 'right',
        options: [{
          value: 'right',
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Right', 'kadence-blocks')
        }, {
          value: 'left',
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Left', 'kadence-blocks')
        }, {
          value: 'top',
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Top', 'kadence-blocks')
        }],
        onChange: value => {
          this.saveArrayUpdate({
            iconSide: value
          }, index);
        }
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Show Only Icon?', 'kadence-blocks'),
        checked: titles[index] && titles[index].onlyIcon ? titles[index].onlyIcon : false,
        onChange: value => {
          this.saveArrayUpdate({
            onlyIcon: value
          }, index);
        }
      }));
    };

    const normalSettings = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Title Color', 'kadence-blocks'),
      value: titleColor ? titleColor : '',
      default: '#444444',
      onChange: value => setAttributes({
        titleColor: value
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Title Background', 'kadence-blocks'),
      value: titleBg ? titleBg : '',
      default: '',
      onChange: value => setAttributes({
        titleBg: value
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Title Border Color', 'kadence-blocks'),
      value: titleBorder ? titleBorder : '',
      default: '',
      onChange: value => setAttributes({
        titleBorder: value
      })
    }));
    const hoverSettings = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Hover Color', 'kadence-blocks'),
      value: titleColorHover ? titleColorHover : '',
      default: '#222222',
      onChange: value => setAttributes({
        titleColorHover: value
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Hover Background', 'kadence-blocks'),
      value: titleBgHover ? titleBgHover : '',
      default: '#e2e2e2',
      onChange: value => setAttributes({
        titleBgHover: value
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Hover Border Color', 'kadence-blocks'),
      value: titleBorderHover ? titleBorderHover : '',
      default: '#eeeeee',
      onChange: value => setAttributes({
        titleBorderHover: value
      })
    }));
    const activeSettings = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Active Color', 'kadence-blocks'),
      value: titleColorActive ? titleColorActive : '',
      default: '#222222',
      onChange: value => setAttributes({
        titleColorActive: value
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Active Background', 'kadence-blocks'),
      value: titleBgActive ? titleBgActive : '',
      default: '#eeeeee',
      onChange: value => setAttributes({
        titleBgActive: value
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Active Border Color', 'kadence-blocks'),
      value: titleBorderActive ? titleBorderActive : '',
      default: '#eeeeee',
      onChange: value => setAttributes({
        titleBorderActive: value
      })
    }));
    const sizeDeskControls = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      panelName: 'kb-tab-size-desktop-controls'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
      className: "kt-size-type-options",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Size Type', 'kadence-blocks')
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(sizeTypes, _ref4 => {
      let {
        name,
        key
      } = _ref4;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
        key: key,
        className: "kt-size-btn",
        isSmall: true,
        isPrimary: sizeType === key,
        "aria-pressed": sizeType === key,
        onClick: () => setAttributes({
          sizeType: key
        })
      }, name);
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Font Size', 'kadence-blocks'),
      value: size ? size : '',
      onChange: value => setAttributes({
        size: value
      }),
      min: fontMin,
      max: fontMax,
      step: fontStep
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
      className: "kt-size-type-options",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Size Type', 'kadence-blocks')
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(sizeTypes, _ref5 => {
      let {
        name,
        key
      } = _ref5;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
        key: key,
        className: "kt-size-btn",
        isSmall: true,
        isPrimary: lineType === key,
        "aria-pressed": lineType === key,
        onClick: () => setAttributes({
          lineType: key
        })
      }, name);
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Line Height', 'kadence-blocks'),
      value: lineHeight ? lineHeight : '',
      onChange: value => setAttributes({
        lineHeight: value
      }),
      min: lineMin,
      max: lineMax,
      step: lineStep
    }));
    const sizeTabletControls = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      panelName: 'kb-tabs-size-tablet-controls'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
      className: "kt-size-type-options",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Size Type', 'kadence-blocks')
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(sizeTypes, _ref6 => {
      let {
        name,
        key
      } = _ref6;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
        key: key,
        className: "kt-size-btn",
        isSmall: true,
        isPrimary: sizeType === key,
        "aria-pressed": sizeType === key,
        onClick: () => setAttributes({
          sizeType: key
        })
      }, name);
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tablet Font Size', 'kadence-blocks'),
      value: tabSize ? tabSize : '',
      onChange: value => setAttributes({
        tabSize: value
      }),
      min: fontMin,
      max: fontMax,
      step: fontStep
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
      className: "kt-size-type-options",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Size Type', 'kadence-blocks')
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(sizeTypes, _ref7 => {
      let {
        name,
        key
      } = _ref7;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
        key: key,
        className: "kt-size-btn",
        isSmall: true,
        isPrimary: lineType === key,
        "aria-pressed": lineType === key,
        onClick: () => setAttributes({
          lineType: key
        })
      }, name);
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tablet Line Height', 'kadence-blocks'),
      value: tabLineHeight ? tabLineHeight : '',
      onChange: value => setAttributes({
        tabLineHeight: value
      }),
      min: lineMin,
      max: lineMax,
      step: lineStep
    }));
    const sizeMobileControls = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      panelName: 'kb-tabs-size-mobile-controls'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
      className: "kt-size-type-options",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Size Type', 'kadence-blocks')
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(sizeTypes, _ref8 => {
      let {
        name,
        key
      } = _ref8;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
        key: key,
        className: "kt-size-btn",
        isSmall: true,
        isPrimary: sizeType === key,
        "aria-pressed": sizeType === key,
        onClick: () => setAttributes({
          sizeType: key
        })
      }, name);
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Mobile Font Size', 'kadence-blocks'),
      value: mobileSize ? mobileSize : '',
      onChange: value => setAttributes({
        mobileSize: value
      }),
      min: fontMin,
      max: fontMax,
      step: fontStep
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
      className: "kt-size-type-options",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Size Type', 'kadence-blocks')
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(sizeTypes, _ref9 => {
      let {
        name,
        key
      } = _ref9;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
        key: key,
        className: "kt-size-btn",
        isSmall: true,
        isPrimary: lineType === key,
        "aria-pressed": lineType === key,
        onClick: () => setAttributes({
          lineType: key
        })
      }, name);
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Mobile Line Height', 'kadence-blocks'),
      value: mobileLineHeight ? mobileLineHeight : '',
      onChange: value => setAttributes({
        mobileLineHeight: value
      }),
      min: lineMin,
      max: lineMax,
      step: lineStep
    }));
    const sizeTabControls = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.TabPanel, {
      className: "kt-size-tabs",
      activeClass: "active-tab",
      tabs: [{
        name: 'desk',
        title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Dashicon, {
          icon: "desktop"
        }),
        className: 'kt-desk-tab'
      }, {
        name: 'tablet',
        title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Dashicon, {
          icon: "tablet"
        }),
        className: 'kt-tablet-tab'
      }, {
        name: 'mobile',
        title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Dashicon, {
          icon: "smartphone"
        }),
        className: 'kt-mobile-tab'
      }]
    }, tab => {
      let tabout;

      if (tab.name) {
        // check which size tab to show.
        if ('mobile' === tab.name) {
          tabout = sizeMobileControls;
        } else if ('tablet' === tab.name) {
          tabout = sizeTabletControls;
        } else {
          tabout = sizeDeskControls;
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: tab.className,
        key: tab.className
      }, tabout);
    });
    const renderCSS = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", null, `.kt-tabs-id${uniqueID} .kt-title-item:hover .kt-tab-title {
					color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(titleColorHover)} !important;
					border-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(titleBorderHover)} !important;
					background-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(titleBgHover)} !important;
				}
				.kt-tabs-id${uniqueID} .kt-title-item.kt-tab-title-active .kt-tab-title, .kt-tabs-id${uniqueID} .kt-title-item.kt-tab-title-active:hover .kt-tab-title {
					color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(titleColorActive)} !important;
					border-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(titleBorderActive)} !important;
					background-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(titleBgActive)} !important;
				}`);
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, renderCSS, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(BlockControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(BlockAlignmentToolbar, {
      value: blockAlignment,
      controls: ['center', 'wide', 'full'],
      onChange: value => setAttributes({
        blockAlignment: value
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(AlignmentToolbar, {
      value: tabAlignment,
      onChange: nextAlign => {
        setAttributes({
          tabAlignment: nextAlign
        });
      }
    })), this.showSettings('allSettings') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(InspectorControls, null, this.showSettings('tabLayout') && tabControls, !this.showSettings('tabLayout') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      panelName: 'kb-tab-layout'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Set Initial Open Tab', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Initial Open Tab', 'kadence-blocks')
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.times)(tabCount, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
      key: n + 1,
      className: "kt-init-open-tab",
      isSmall: true,
      isPrimary: startTab === n + 1,
      "aria-pressed": startTab === n + 1,
      onClick: () => setAttributes({
        startTab: n + 1
      })
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab') + ' ' + (n + 1))))), this.showSettings('tabContent') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Content Settings', 'kadence-blocks'),
      initialOpen: false,
      panelName: 'kb-tab-content-settings'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Content Background', 'kadence-blocks'),
      value: contentBgColor ? contentBgColor : '',
      default: '',
      onChange: value => setAttributes({
        contentBgColor: value
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Inner Content Padding (px)', 'kadence-blocks'),
      measurement: innerPadding,
      control: innerPaddingControl,
      onChange: value => setAttributes({
        innerPadding: value
      }),
      onControl: value => setAttributes({
        innerPaddingControl: value
      }),
      min: 0,
      max: 100,
      step: 1
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.PopColorControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Border Color', 'kadence-blocks'),
      value: contentBorderColor ? contentBorderColor : '',
      default: '',
      onChange: value => setAttributes({
        contentBorderColor: value
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Content Border Width (px)', 'kadence-blocks'),
      measurement: contentBorder,
      control: contentBorderControl,
      onChange: value => setAttributes({
        contentBorder: value
      }),
      onControl: value => setAttributes({
        contentBorderControl: value
      }),
      min: 0,
      max: 100,
      step: 1
    })), this.showSettings('titleColor') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab Title Color Settings', 'kadence-blocks'),
      initialOpen: false,
      panelName: 'kb-tab-title-color'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.TabPanel, {
      className: "kt-inspect-tabs kt-no-ho-ac-tabs kt-hover-tabs",
      activeClass: "active-tab",
      tabs: [{
        name: 'normal',
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Normal'),
        className: 'kt-normal-tab'
      }, {
        name: 'hover',
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Hover'),
        className: 'kt-hover-tab'
      }, {
        name: 'active',
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Active'),
        className: 'kt-active-tab'
      }]
    }, tab => {
      let tabout;

      if (tab.name) {
        if ('hover' === tab.name) {
          tabout = hoverSettings;
        } else if ('active' === tab.name) {
          tabout = activeSettings;
        } else {
          tabout = normalSettings;
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: tab.className,
        key: tab.className
      }, tabout);
    })), this.showSettings('titleSpacing') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab Title Width/Spacing/Border', 'kadence-blocks'),
      initialOpen: false,
      panelName: 'kb-tab-title-spacing'
    }, 'tabs' === layout && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab Title Width', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.TabPanel, {
      className: "kt-inspect-tabs kt-hover-tabs",
      activeClass: "active-tab",
      initialTabName: widthType,
      onSelect: value => setAttributes({
        widthType: value
      }),
      tabs: [{
        name: 'normal',
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Normal'),
        className: 'kt-normal-tab'
      }, {
        name: 'percent',
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('% Width'),
        className: 'kt-hover-tab'
      }]
    }, tab => {
      let tabout;

      if (tab.name) {
        if ('percent' === tab.name) {
          tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.TabPanel, {
            className: "kt-size-tabs kb-device-choice",
            activeClass: "active-tab",
            tabs: [{
              name: 'desk',
              title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Dashicon, {
                icon: "desktop"
              }),
              className: 'kt-desk-tab'
            }, {
              name: 'tablet',
              title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Dashicon, {
                icon: "tablet"
              }),
              className: 'kt-tablet-tab'
            }, {
              name: 'mobile',
              title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Dashicon, {
                icon: "smartphone"
              }),
              className: 'kt-mobile-tab'
            }]
          }, innerTab => {
            let tabContentOut;

            if (innerTab.name) {
              if ('mobile' === innerTab.name) {
                tabContentOut = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Mobile Columns', 'kadence-blocks'),
                  value: tabWidth && undefined !== tabWidth[2] ? tabWidth[2] : '',
                  onChange: value => setAttributes({
                    tabWidth: [tabWidth[0], tabWidth[1], value]
                  }),
                  min: 1,
                  max: 8,
                  step: 1
                }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Mobile Gutter', 'kadence-blocks'),
                  value: gutter && undefined !== gutter[2] ? gutter[2] : '',
                  onChange: value => setAttributes({
                    gutter: [gutter[0], gutter[1], value]
                  }),
                  min: 0,
                  max: 50,
                  step: 1
                }));
              } else if ('tablet' === innerTab.name) {
                tabContentOut = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tablet Columns', 'kadence-blocks'),
                  value: tabWidth && undefined !== tabWidth[1] ? tabWidth[1] : '',
                  onChange: value => setAttributes({
                    tabWidth: [tabWidth[0], value, tabWidth[2]]
                  }),
                  min: 1,
                  max: 8,
                  step: 1
                }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tablet Gutter', 'kadence-blocks'),
                  value: gutter && undefined !== gutter[1] ? gutter[1] : '',
                  onChange: value => setAttributes({
                    gutter: [gutter[0], value, gutter[2]]
                  }),
                  min: 0,
                  max: 50,
                  step: 1
                }));
              } else {
                tabContentOut = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Columns', 'kadence-blocks'),
                  value: tabWidth && undefined !== tabWidth[0] ? tabWidth[0] : '',
                  onChange: value => setAttributes({
                    tabWidth: [value, tabWidth[1], tabWidth[2]]
                  }),
                  min: 1,
                  max: 8,
                  step: 1
                }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Gutter', 'kadence-blocks'),
                  value: gutter && undefined !== gutter[0] ? gutter[0] : '',
                  onChange: value => setAttributes({
                    gutter: [value, gutter[1], gutter[2]]
                  }),
                  min: 0,
                  max: 50,
                  step: 1
                }));
              }
            }

            return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, tabContentOut);
          }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Title Padding (px)', 'kadence-blocks'),
            measurement: titlePadding,
            control: titlePaddingControl,
            onChange: value => setAttributes({
              titlePadding: value
            }),
            onControl: value => setAttributes({
              titlePaddingControl: value
            }),
            min: 0,
            max: 50,
            step: 1
          }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Top Margin (px)', 'kadence-blocks'),
            value: titleMargin && undefined !== titleMargin[0] ? titleMargin[0] : '',
            onChange: value => setAttributes({
              titleMargin: [value, titleMargin[1], titleMargin[2], titleMargin[3]]
            }),
            min: -25,
            max: 25,
            step: 1
          }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Bottom Margin (px)', 'kadence-blocks'),
            value: titleMargin && undefined !== titleMargin[2] ? titleMargin[2] : '',
            onChange: value => setAttributes({
              titleMargin: [titleMargin[0], titleMargin[1], value, titleMargin[3]]
            }),
            min: -25,
            max: 25,
            step: 1
          }));
        } else {
          tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Title Padding (px)', 'kadence-blocks'),
            measurement: titlePadding,
            control: titlePaddingControl,
            onChange: value => setAttributes({
              titlePadding: value
            }),
            onControl: value => setAttributes({
              titlePaddingControl: value
            }),
            min: 0,
            max: 50,
            step: 1
          }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Title Margin (px)', 'kadence-blocks'),
            measurement: titleMargin,
            control: titleMarginControl,
            onChange: value => setAttributes({
              titleMargin: value
            }),
            onControl: value => setAttributes({
              titleMarginControl: value
            }),
            min: -25,
            max: 25,
            step: 1
          }));
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: tab.className,
        key: tab.className
      }, tabout);
    })), 'tabs' !== layout && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Title Padding (px)', 'kadence-blocks'),
      measurement: titlePadding,
      control: titlePaddingControl,
      onChange: value => setAttributes({
        titlePadding: value
      }),
      onControl: value => setAttributes({
        titlePaddingControl: value
      }),
      min: 0,
      max: 50,
      step: 1
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Title Margin (px)', 'kadence-blocks'),
      measurement: titleMargin,
      control: titleMarginControl,
      onChange: value => setAttributes({
        titleMargin: value
      }),
      onControl: value => setAttributes({
        titleMarginControl: value
      }),
      min: -25,
      max: 25,
      step: 1
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Title Border Width (px)', 'kadence-blocks'),
      measurement: titleBorderWidth,
      control: titleBorderControl,
      onChange: value => setAttributes({
        titleBorderWidth: value
      }),
      onControl: value => setAttributes({
        titleBorderControl: value
      }),
      min: 0,
      max: 20,
      step: 1
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.MeasurementControls, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Title Border Radius (px)', 'kadence-blocks'),
      measurement: titleBorderRadius,
      control: titleBorderRadiusControl,
      onChange: value => setAttributes({
        titleBorderRadius: value
      }),
      onControl: value => setAttributes({
        titleBorderRadiusControl: value
      }),
      min: 0,
      max: 50,
      step: 1,
      controlTypes: [{
        key: 'linked',
        name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Linked', 'kadence-blocks'),
        icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.radiusLinkedIcon
      }, {
        key: 'individual',
        name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Individual', 'kadence-blocks'),
        icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.radiusIndividualIcon
      }],
      firstIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.topLeftIcon,
      secondIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.topRightIcon,
      thirdIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.bottomRightIcon,
      fourthIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.bottomLeftIcon
    })), this.showSettings('titleFont') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab Title Font Settings', 'kadence-blocks'),
      initialOpen: false,
      panelName: 'kb-tab-title-font'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.TypographyControls, {
      fontFamily: typography,
      onFontFamily: value => setAttributes({
        typography: value
      }),
      googleFont: googleFont,
      onFontChange: select => {
        setAttributes({
          typography: select.value,
          googleFont: select.google
        });
      },
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
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "kt-heading-size-title"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Size Controls', 'kadence-blocks')), sizeTabControls, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Letter Spacing', 'kadence-blocks'),
      value: letterSpacing ? letterSpacing : '',
      onChange: value => setAttributes({
        letterSpacing: value
      }),
      min: -5,
      max: 15,
      step: 0.1
    })), this.showSettings('titleIcon') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab Title Icon Settings', 'kadence-blocks'),
      initialOpen: false,
      panelName: 'kb-tab-title-icon'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Icon Size', 'kadence-blocks'),
      value: iSize ? iSize : '',
      onChange: value => setAttributes({
        iSize: value
      }),
      min: 2,
      max: 120,
      step: 1
    }), (0,lodash__WEBPACK_IMPORTED_MODULE_4__.times)(tabCount, n => renderTitleSettings(n))), this.showSettings('subtitle') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab Subtitle Settings', 'kadence-blocks'),
      initialOpen: false,
      panelName: 'kb-tab-subtitle-settings'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Show Subtitles?', 'kadence-blocks'),
      checked: undefined !== enableSubtitle ? enableSubtitle : false,
      onChange: value => {
        setAttributes({
          enableSubtitle: value
        });
      }
    }), enableSubtitle && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.TypographyControls, {
      fontSize: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].size ? subtitleFont[0].size : ['', '', ''],
      onFontSize: value => saveSubtitleFont({
        size: value
      }),
      fontSizeType: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].sizeType ? subtitleFont[0].sizeType : 'px',
      onFontSizeType: value => saveSubtitleFont({
        sizeType: value
      }),
      lineHeight: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].lineHeight ? subtitleFont[0].lineHeight : ['', '', ''],
      onLineHeight: value => saveSubtitleFont({
        lineHeight: value
      }),
      lineHeightType: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].lineType ? subtitleFont[0].lineType : 'px',
      onLineHeightType: value => saveSubtitleFont({
        lineType: value
      }),
      letterSpacing: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].letterSpacing ? subtitleFont[0].letterSpacing : '',
      onLetterSpacing: value => saveSubtitleFont({
        letterSpacing: value
      }),
      fontFamily: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].family ? subtitleFont[0].family : '',
      onFontFamily: value => saveSubtitleFont({
        family: value
      }),
      onFontChange: select => {
        saveSubtitleFont({
          family: select.value,
          google: select.google
        });
      },
      onFontArrayChange: values => saveSubtitleFont(values),
      googleFont: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].google ? subtitleFont[0].google : false,
      onGoogleFont: value => saveSubtitleFont({
        google: value
      }),
      loadGoogleFont: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].loadGoogle ? subtitleFont[0].loadGoogle : true,
      onLoadGoogleFont: value => saveSubtitleFont({
        loadGoogle: value
      }),
      fontVariant: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].variant ? subtitleFont[0].variant : '',
      onFontVariant: value => saveSubtitleFont({
        variant: value
      }),
      fontWeight: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].weight ? subtitleFont[0].weight : '',
      onFontWeight: value => saveSubtitleFont({
        weight: value
      }),
      fontStyle: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].style ? subtitleFont[0].style : '',
      onFontStyle: value => saveSubtitleFont({
        style: value
      }),
      fontSubset: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].subset ? subtitleFont[0].subset : '',
      onFontSubset: value => saveSubtitleFont({
        subset: value
      }),
      textTransform: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].textTransform ? subtitleFont[0].textTransform : '',
      onTextTransform: value => saveSubtitleFont({
        textTransform: value
      }),
      padding: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].padding ? subtitleFont[0].padding : [0, 0, 0, 0],
      onPadding: value => saveSubtitleFont({
        padding: value
      }),
      paddingControl: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].paddingControl ? subtitleFont[0].paddingControl : 'linked',
      onPaddingControl: value => saveSubtitleFont({
        paddingControl: value
      }),
      margin: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].margin ? subtitleFont[0].margin : [0, 0, 0, 0],
      onMargin: value => saveSubtitleFont({
        margin: value
      }),
      marginControl: subtitleFont && undefined !== subtitleFont[0] && undefined !== subtitleFont[0].marginControl ? subtitleFont[0].marginControl : 'linked',
      onMarginControl: value => saveSubtitleFont({
        marginControl: value
      })
    })), this.showSettings('titleAnchor') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab Anchor Settings', 'kadence-blocks'),
      initialOpen: false,
      panelName: 'kb-tab-anchor-settings'
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.times)(tabCount, n => renderAnchorSettings(n))), this.showSettings('structure') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.KadencePanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Structure Settings', 'kadence-blocks'),
      initialOpen: false,
      panelName: 'kb-tab-structure-settings'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Content Minimum Height', 'kadence-blocks'),
      value: minHeight,
      onChange: value => {
        setAttributes({
          minHeight: value
        });
      },
      min: 0,
      max: 1000
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Max Width', 'kadence-blocks'),
      value: maxWidth,
      onChange: value => {
        setAttributes({
          maxWidth: value
        });
      },
      min: 0,
      max: 2000
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classes
    }, this.state.showPreset && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-select-starter-style-tabs"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-select-starter-style-tabs-title"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Select Initial Style')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
      className: "kt-init-tabs-btn-group",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Initial Style', 'kadence-blocks')
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(startlayoutOptions, _ref10 => {
      let {
        name,
        key,
        icon
      } = _ref10;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
        key: key,
        className: "kt-inital-tabs-style-btn",
        isSmall: true,
        onClick: () => {
          setInitalLayout(key);
          this.setState({
            showPreset: false
          });
        }
      }, icon);
    }))), !this.state.showPreset && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-tabs-wrap",
      style: {
        maxWidth: maxWidth + 'px'
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kb-add-new-tab-contain"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
      className: "kt-tab-add",
      isPrimary: true,
      onClick: () => {
        const newBlock = createBlock('kadence/tab', {
          id: tabCount + 1
        });
        setAttributes({
          tabCount: tabCount + 1
        });
        this.props.insertTab(newBlock); //wp.data.dispatch( 'core/block-editor' ).insertBlock( newBlock, clientId );

        const newtabs = titles;
        newtabs.push({
          text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Tab %d', 'kadence-blocks'), tabCount + 1),
          icon: titles[0].icon,
          iconSide: titles[0].iconSide,
          onlyIcon: titles[0].onlyIcon,
          subText: ''
        });
        setAttributes({
          titles: newtabs
        });
        this.saveArrayUpdate({
          iconSide: titles[0].iconSide
        }, 0);
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Dashicon, {
      icon: "plus"
    }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_11__.__)('Add Tab', 'kadence-blocks'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
      className: `kt-tabs-title-list${'tabs' === layout && widthType === 'percent' ? ' kb-tabs-list-columns kb-tab-title-columns-' + tabWidth[0] : ''}`
    }, renderPreviewArray), googleFont && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.WebfontLoader, {
      config: config
    }), enableSubtitle && subtitleFont && subtitleFont[0] && subtitleFont[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_6__.WebfontLoader, {
      config: sconfig
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-tabs-content-wrap",
      style: {
        padding: innerPadding ? innerPadding[0] + 'px ' + innerPadding[1] + 'px ' + innerPadding[2] + 'px ' + innerPadding[3] + 'px' : '',
        borderWidth: contentBorder ? contentBorder[0] + 'px ' + contentBorder[1] + 'px ' + contentBorder[2] + 'px ' + contentBorder[3] + 'px' : '',
        minHeight: minHeight + 'px',
        backgroundColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(contentBgColor),
        borderColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_5__.KadenceColorOutput)(contentBorderColor)
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(InnerBlocks, {
      template: getPanesTemplate(tabCount),
      templateLock: "all",
      allowedBlocks: ALLOWED_BLOCKS
    })))));
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_9__.compose)([(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_8__.withSelect)((select, ownProps) => {
  const {
    clientId
  } = ownProps;
  const {
    getBlock,
    getBlockOrder
  } = select('core/block-editor');
  const block = getBlock(clientId);
  return {
    tabsBlock: block,
    realTabsCount: block.innerBlocks.length,
    tabsInner: getBlockOrder(clientId)
  };
}), (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_8__.withDispatch)((dispatch, _ref11, _ref12) => {
  let {
    clientId
  } = _ref11;
  let {
    select
  } = _ref12;
  const {
    getBlock,
    getBlocks
  } = select('core/block-editor');
  const {
    moveBlockToPosition,
    updateBlockAttributes,
    insertBlock,
    replaceInnerBlocks
  } = dispatch('core/block-editor');
  const block = getBlock(clientId);
  const innerBlocks = getBlocks(clientId);
  return {
    resetOrder() {
      (0,lodash__WEBPACK_IMPORTED_MODULE_4__.times)(block.innerBlocks.length, n => {
        updateBlockAttributes(block.innerBlocks[n].clientId, {
          id: n + 1
        });
      });
    },

    moveTab(tabId, newIndex) {
      innerBlocks.splice(newIndex, 0, innerBlocks.splice(tabId, 1)[0]);
      replaceInnerBlocks(clientId, innerBlocks);
    },

    insertTab(newBlock) {
      insertBlock(newBlock, parseInt(block.innerBlocks.length), clientId);
    },

    removeTab(tabId) {
      innerBlocks.splice(tabId, 1);
      replaceInnerBlocks(clientId, innerBlocks);
    }

  };
})])(KadenceTabs));

/***/ }),

/***/ "./src/blocks/tabs/save.js":
/*!*********************************!*\
  !*** ./src/blocks/tabs/save.js ***!
  \*********************************/
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
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);


/**
 * BLOCK: Kadence Tabs
 */



const {
  Component,
  Fragment
} = wp.element;
const {
  InnerBlocks,
  RichText
} = wp.blockEditor;
/**
 * Internal block libraries
 */



class KadenceTabsSave extends Component {
  stripStringRender(string) {
    return string.toLowerCase().replace(/[^0-9a-z-]/g, '');
  }

  render() {
    const {
      attributes: {
        tabCount,
        blockAlignment,
        currentTab,
        mobileLayout,
        layout,
        tabletLayout,
        uniqueID,
        titles,
        iSize,
        maxWidth,
        tabAlignment,
        startTab,
        enableSubtitle,
        widthType,
        tabWidth
      }
    } = this.props;
    const layoutClass = !layout ? 'tabs' : layout;
    const tabLayoutClass = !tabletLayout ? 'inherit' : tabletLayout;
    const mobileLayoutClass = !mobileLayout ? 'inherit' : mobileLayout;
    const accordionClass = mobileLayout && 'accordion' === mobileLayout || tabletLayout && 'accordion' === tabletLayout ? 'kt-create-accordion' : '';
    const classId = !uniqueID ? 'notset' : uniqueID;
    const theTabAlignment = tabAlignment ? tabAlignment : 'left';
    const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(`align${blockAlignment}`);
    const activeTab = startTab ? startTab : currentTab;
    const innerClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(`kt-tabs-wrap kt-tabs-id${classId} kt-tabs-has-${tabCount}-tabs kt-active-tab-${activeTab} kt-tabs-layout-${layoutClass} kt-tabs-tablet-layout-${tabLayoutClass} kt-tabs-mobile-layout-${mobileLayoutClass} kt-tab-alignment-${theTabAlignment} ${accordionClass}`);

    const renderTitles = index => {
      const backupAnchor = `tab-${titles[index] && titles[index].text ? this.stripStringRender(titles[index].text.toString()) : this.stripStringRender((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Tab') + (1 + index))}`;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
        id: titles[index] && titles[index].anchor ? titles[index].anchor : backupAnchor,
        className: `kt-title-item kt-title-item-${1 + index} kt-tabs-svg-show-${titles[index] && titles[index].onlyIcon ? 'only' : 'always'} kt-tabs-icon-side-${titles[index] && titles[index].iconSide ? titles[index].iconSide : 'right'} kt-tab-title-${1 + index === activeTab ? 'active' : 'inactive'}${enableSubtitle ? ' kb-tabs-have-subtitle' : ''}`
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: `#${titles[index] && titles[index].anchor ? titles[index].anchor : backupAnchor}`,
        "data-tab": 1 + index,
        className: `kt-tab-title kt-tab-title-${1 + index} `
      }, titles[index] && titles[index].icon && 'right' !== titles[index].iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconSpanTag, {
        className: `kt-tab-svg-icon kt-tab-svg-icon-${titles[index].icon} kt-title-svg-side-${titles[index].iconSide}`,
        name: titles[index].icon,
        size: !iSize ? '14' : iSize
      }), (!enableSubtitle || undefined !== titles[index] && undefined === titles[index].subText || undefined !== titles[index] && undefined !== titles[index].subText && '' === titles[index].subText) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(RichText.Content, {
        tagName: "span",
        value: titles[index] && titles[index].text ? titles[index].text : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Tab %d'), 1 + index),
        className: 'kt-title-text'
      }), enableSubtitle && titles[index] && undefined !== titles[index].subText && '' !== titles[index].subText && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kb-tab-titles-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(RichText.Content, {
        tagName: "span",
        value: titles[index] && titles[index].text ? titles[index].text : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Tab %d'), 1 + index),
        className: 'kt-title-text'
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(RichText.Content, {
        tagName: "span",
        value: titles[index].subText,
        className: 'kt-title-sub-text'
      })), titles[index] && titles[index].icon && 'right' === titles[index].iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconSpanTag, {
        className: `kt-tab-svg-icon kt-tab-svg-icon-${titles[index].icon} kt-title-svg-side-${titles[index].iconSide}`,
        name: titles[index].icon,
        size: !iSize ? '14' : iSize
      }))));
    };

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: classes
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: innerClasses,
      style: {
        maxWidth: maxWidth ? maxWidth + 'px' : 'none'
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
      className: `kt-tabs-title-list${'tabs' === layout && widthType === 'percent' ? ' kb-tabs-list-columns kb-tab-title-columns-' + tabWidth[0] : ''}`
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_2__.times)(tabCount, n => renderTitles(n))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-tabs-content-wrap"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(InnerBlocks.Content, null))));
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KadenceTabsSave);

/***/ }),

/***/ "./src/blocks/tabs/tab/block.js":
/*!**************************************!*\
  !*** ./src/blocks/tabs/tab/block.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block.json */ "./src/blocks/tabs/tab/block.json");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/tabs/tab/edit.js");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__);


/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */


/**
 * Import Icons
 */


/**
 * Import edit
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

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__.registerBlockType)('kadence/tab', { ..._block_json__WEBPACK_IMPORTED_MODULE_1__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Tab', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('tabs', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('tab', 'kadence-blocks'), 'KB'],
  icon: {
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_3__.tabsBlockIcon
  },

  getEditWrapperProps(attributes) {
    return {
      'data-tab': attributes.id
    };
  },

  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],

  save(_ref) {
    let {
      attributes
    } = _ref;
    const {
      id,
      uniqueID
    } = attributes;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-tab-inner-content kt-inner-tab-${id} kt-inner-tab${uniqueID}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-tab-inner-content-inner'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null)));
  },

  deprecated: [{
    attributes: {
      id: {
        type: 'number',
        default: 1
      }
    },
    save: _ref2 => {
      let {
        attributes
      } = _ref2;
      const {
        id
      } = attributes;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kt-tab-inner-content kt-inner-tab-${id}`
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: 'kt-tab-inner-content-inner'
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null)));
    }
  }]
});

/***/ }),

/***/ "./src/blocks/tabs/tab/edit.js":
/*!*************************************!*\
  !*** ./src/blocks/tabs/tab/edit.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);


/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */
const {
  InnerBlocks
} = wp.blockEditor;
const {
  Fragment
} = wp.element;
const {
  Component
} = wp.element;
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */

const kttabUniqueIDs = [];
/**
 * Build the spacer edit
 */

class KadenceTab extends Component {
  componentDidMount() {
    if (!this.props.attributes.uniqueID) {
      this.props.setAttributes({
        uniqueID: '_' + this.props.clientId.substr(2, 9)
      });
      kttabUniqueIDs.push('_' + this.props.clientId.substr(2, 9));
    } else if (kttabUniqueIDs.includes(this.props.attributes.uniqueID)) {
      this.props.attributes.uniqueID = '_' + this.props.clientId.substr(2, 9);
      kttabUniqueIDs.push('_' + this.props.clientId.substr(2, 9));
    } else {
      kttabUniqueIDs.push(this.props.attributes.uniqueID);
    }
  }

  render() {
    const {
      attributes: {
        id,
        uniqueID
      },
      clientId
    } = this.props;
    const hasChildBlocks = wp.data.select('core/block-editor').getBlockOrder(clientId).length > 0;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-tab-inner-content kt-inner-tab-${id} kt-inner-tab${uniqueID}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(InnerBlocks, {
      templateLock: false,
      renderAppender: hasChildBlocks ? undefined : () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(InnerBlocks.ButtonBlockAppender, null)
    })));
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KadenceTab);

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

/***/ "./node_modules/memize/index.js":
/*!**************************************!*\
  !*** ./node_modules/memize/index.js ***!
  \**************************************/
/***/ ((module) => {

/**
 * Memize options object.
 *
 * @typedef MemizeOptions
 *
 * @property {number} [maxSize] Maximum size of the cache.
 */

/**
 * Internal cache entry.
 *
 * @typedef MemizeCacheNode
 *
 * @property {?MemizeCacheNode|undefined} [prev] Previous node.
 * @property {?MemizeCacheNode|undefined} [next] Next node.
 * @property {Array<*>}                   args   Function arguments for cache
 *                                               entry.
 * @property {*}                          val    Function result.
 */

/**
 * Properties of the enhanced function for controlling cache.
 *
 * @typedef MemizeMemoizedFunction
 *
 * @property {()=>void} clear Clear the cache.
 */

/**
 * Accepts a function to be memoized, and returns a new memoized function, with
 * optional options.
 *
 * @template {Function} F
 *
 * @param {F}             fn        Function to memoize.
 * @param {MemizeOptions} [options] Options object.
 *
 * @return {F & MemizeMemoizedFunction} Memoized function.
 */
function memize( fn, options ) {
	var size = 0;

	/** @type {?MemizeCacheNode|undefined} */
	var head;

	/** @type {?MemizeCacheNode|undefined} */
	var tail;

	options = options || {};

	function memoized( /* ...args */ ) {
		var node = head,
			len = arguments.length,
			args, i;

		searchCache: while ( node ) {
			// Perform a shallow equality test to confirm that whether the node
			// under test is a candidate for the arguments passed. Two arrays
			// are shallowly equal if their length matches and each entry is
			// strictly equal between the two sets. Avoid abstracting to a
			// function which could incur an arguments leaking deoptimization.

			// Check whether node arguments match arguments length
			if ( node.args.length !== arguments.length ) {
				node = node.next;
				continue;
			}

			// Check whether node arguments match arguments values
			for ( i = 0; i < len; i++ ) {
				if ( node.args[ i ] !== arguments[ i ] ) {
					node = node.next;
					continue searchCache;
				}
			}

			// At this point we can assume we've found a match

			// Surface matched node to head if not already
			if ( node !== head ) {
				// As tail, shift to previous. Must only shift if not also
				// head, since if both head and tail, there is no previous.
				if ( node === tail ) {
					tail = node.prev;
				}

				// Adjust siblings to point to each other. If node was tail,
				// this also handles new tail's empty `next` assignment.
				/** @type {MemizeCacheNode} */ ( node.prev ).next = node.next;
				if ( node.next ) {
					node.next.prev = node.prev;
				}

				node.next = head;
				node.prev = null;
				/** @type {MemizeCacheNode} */ ( head ).prev = node;
				head = node;
			}

			// Return immediately
			return node.val;
		}

		// No cached value found. Continue to insertion phase:

		// Create a copy of arguments (avoid leaking deoptimization)
		args = new Array( len );
		for ( i = 0; i < len; i++ ) {
			args[ i ] = arguments[ i ];
		}

		node = {
			args: args,

			// Generate the result from original function
			val: fn.apply( null, args ),
		};

		// Don't need to check whether node is already head, since it would
		// have been returned above already if it was

		// Shift existing head down list
		if ( head ) {
			head.prev = node;
			node.next = head;
		} else {
			// If no head, follows that there's no tail (at initial or reset)
			tail = node;
		}

		// Trim tail if we're reached max size and are pending cache insertion
		if ( size === /** @type {MemizeOptions} */ ( options ).maxSize ) {
			tail = /** @type {MemizeCacheNode} */ ( tail ).prev;
			/** @type {MemizeCacheNode} */ ( tail ).next = null;
		} else {
			size++;
		}

		head = node;

		return node.val;
	}

	memoized.clear = function() {
		head = null;
		tail = null;
		size = 0;
	};

	if ( false ) {}

	// Ignore reason: There's not a clear solution to create an intersection of
	// the function with additional properties, where the goal is to retain the
	// function signature of the incoming argument and add control properties
	// on the return value.

	// @ts-ignore
	return memoized;
}

module.exports = memize;


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

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./src/blocks/tabs/block.json":
/*!************************************!*\
  !*** ./src/blocks/tabs/block.json ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Tabs","name":"kadence/tabs","category":"kadence-blocks","attributes":{"uniqueID":{"type":"string","default":""},"tabCount":{"type":"number","default":3},"layout":{"type":"string","default":"tabs"},"mobileLayout":{"type":"string","default":"inherit"},"tabletLayout":{"type":"string","default":"inherit"},"currentTab":{"type":"number","default":1},"minHeight":{"type":"number","default":""},"maxWidth":{"type":"number","default":""},"contentBgColor":{"type":"string","default":""},"contentBorderColor":{"type":"string","default":""},"contentBorder":{"type":"array","default":[1,1,1,1]},"contentBorderControl":{"type":"string","default":"linked"},"innerPadding":{"type":"array","default":[20,20,20,20]},"innerPaddingControl":{"type":"string","default":"linked"},"innerPaddingM":{"type":"array"},"tabAlignment":{"type":"string","default":"left"},"blockAlignment":{"type":"string","default":"none"},"titles":{"type":"array","default":[{"text":"Tab 1","icon":"","iconSide":"right","onlyIcon":false,"subText":"","anchor":""},{"text":"Tab 2","icon":"","iconSide":"right","onlyIcon":false,"subText":"","anchor":""},{"text":"Tab 3","icon":"","iconSide":"right","onlyIcon":false,"subText":"","anchor":""}]},"iSize":{"type":"number","default":14},"titleColor":{"type":"string"},"titleColorHover":{"type":"string"},"titleColorActive":{"type":"string"},"titleBg":{"type":"string"},"titleBgHover":{"type":"string"},"titleBgActive":{"type":"string","default":"#ffffff"},"titleBorder":{"type":"string"},"titleBorderHover":{"type":"string"},"titleBorderActive":{"type":"string"},"titleBorderWidth":{"type":"array"},"titleBorderControl":{"type":"string","default":"individual"},"titleBorderRadius":{"type":"array"},"titleBorderRadiusControl":{"type":"string","default":"individual"},"titlePadding":{"type":"array"},"titlePaddingControl":{"type":"string","default":"individual"},"titleMargin":{"type":"array"},"titleMarginControl":{"type":"string","default":"individual"},"size":{"type":"number"},"sizeType":{"type":"string","default":"px"},"lineHeight":{"type":"number"},"lineType":{"type":"string","default":"px"},"tabSize":{"type":"number"},"tabLineHeight":{"type":"number"},"mobileSize":{"type":"number"},"mobileLineHeight":{"type":"number"},"letterSpacing":{"type":"number"},"typography":{"type":"string","default":""},"googleFont":{"type":"boolean","default":false},"loadGoogleFont":{"type":"boolean","default":true},"fontSubset":{"type":"string","default":""},"fontVariant":{"type":"string","default":""},"fontWeight":{"type":"string","default":"regular"},"textTransform":{"type":"string"},"fontStyle":{"type":"string","default":"normal"},"startTab":{"type":"number","default":""},"showPresets":{"type":"bool","default":true},"subtitleFont":{"type":"array","default":[{"size":["","",""],"sizeType":"px","lineHeight":["","",""],"lineType":"px","letterSpacing":"","textTransform":"","family":"","google":false,"style":"","weight":"","variant":"","subset":"","loadGoogle":true,"padding":[0,0,0,0],"paddingControl":"linked","margin":[0,0,0,0],"marginControl":"linked"}]},"enableSubtitle":{"type":"bool","default":false},"widthType":{"type":"string","default":"normal"},"tabWidth":{"type":"array","default":[4,"",""]},"gutter":{"type":"array","default":[10,"",""]}},"supports":{"anchor":true}}');

/***/ }),

/***/ "./src/blocks/tabs/tab/block.json":
/*!****************************************!*\
  !*** ./src/blocks/tabs/tab/block.json ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Tab","name":"kadence/tab","category":"kadence-blocks","parent":["kadence/tabs"],"attributes":{"id":{"type":"number","default":1},"uniqueID":{"type":"string","default":""}},"supports":{"inserter":false,"reusable":false,"html":false,"lock":false},"editorScript":"file:editor.js"}');

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
/******/ 			"blocks-tabs": 0,
/******/ 			"./style-blocks-tabs": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-blocks-tabs"], () => (__webpack_require__("./src/blocks/tabs/block.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	(this.kadence = this.kadence || {})["blocks-tabs"] = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=blocks-tabs.js.map