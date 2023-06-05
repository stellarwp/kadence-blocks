/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/accordion/editor.scss":
/*!******************************************!*\
  !*** ./src/blocks/accordion/editor.scss ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/accordion/style.scss":
/*!*****************************************!*\
  !*** ./src/blocks/accordion/style.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/accordion/block.js":
/*!***************************************!*\
  !*** ./src/blocks/accordion/block.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pane_block_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pane/block.js */ "./src/blocks/accordion/pane/block.js");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./block.json */ "./src/blocks/accordion/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./src/blocks/accordion/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./src/blocks/accordion/save.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/accordion/style.scss");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__);
/**
 * BLOCK: Kadence Accordion.
 */

/**
 * Register sub blocks.
 */

/**
 * Import Icons
 */


/**
 * Import block.json
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

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.registerBlockType)('kadence/accordion', { ..._block_json__WEBPACK_IMPORTED_MODULE_2__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Accordion', 'kadence-blocks'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('Create beautiful accordions! Each pane can contain any other block, customize title styles, content background, and borders.', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('accordion', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_7__.__)('pane', 'kadence-blocks'), 'KB'],

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

  icon: {
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.accordionBlockIcon
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
});

/***/ }),

/***/ "./src/blocks/accordion/edit.js":
/*!**************************************!*\
  !*** ./src/blocks/accordion/edit.js ***!
  \**************************************/
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
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/accordion/editor.scss");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__);


/**
 * BLOCK: Kadence Tabs
 */

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktaccordUniqueIDs = [];
/**
 * Import Icons
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


const ALLOWED_BLOCKS = ['kadence/pane'];
/**
 * Returns the layouts configuration for a given number of panes.
 *
 * @param {number} panes Number of panes.
 *
 * @return {Object[]} Panes layout configuration.
 */

const getPanesTemplate = memize__WEBPACK_IMPORTED_MODULE_3___default()(panes => {
  return (0,lodash__WEBPACK_IMPORTED_MODULE_4__.times)(panes, n => ['kadence/pane', {
    id: n + 1
  }]);
});
/**
 * Build the row edit
 */

function KadenceAccordionComponent(_ref) {
  let {
    attributes,
    className,
    setAttributes,
    clientId,
    realPaneCount,
    accordionBlock,
    removePane,
    updatePaneTag,
    updateFaqSchema,
    insertPane
  } = _ref;
  const {
    uniqueID,
    paneCount,
    blockAlignment,
    openPane,
    titleStyles,
    contentPadding,
    contentTabletPadding,
    contentMobilePadding,
    contentPaddingType,
    minHeight,
    maxWidth,
    contentBorder,
    contentBorderColor,
    contentBorderRadius,
    contentBgColor,
    titleAlignment,
    startCollapsed,
    faqSchema,
    linkPaneCollapse,
    showIcon,
    iconStyle,
    iconSide,
    iconColor,
    showPresets
  } = attributes;
  const [contentPaddingControl, setContentPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('linked');
  const [contentBorderRadiusControl, setContentBorderRadiusControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('linked');
  const [contentBorderControl, setContentBorderControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('linked');
  const [titleBorderControl, setTitleBorderControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('linked');
  const [titlePaddingControl, setTitlePaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('individual');
  const [titleBorderRadiusControl, setTitleBorderRadiusControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('linked');
  const [titleBorderColorControl, setTitleBorderColorControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('linked');
  const [titleBorderHoverColorControl, setTitleBorderHoverColorControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('linked');
  const [titleBorderActiveColorControl, setTitleBorderActiveColorControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('linked');
  const [titleTag, setTitleTag] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('div');
  const [showPreset, setShowPreset] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('general');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // This runs when we switch from desktop to tablet.
    if (!uniqueID) {
      const blockConfigObject = kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : [];

      if (blockConfigObject['kadence/accordion'] !== undefined && typeof blockConfigObject['kadence/accordion'] === 'object') {
        Object.keys(blockConfigObject['kadence/accordion']).map(attribute => {
          if ('titleTag' === attribute) {
            const accordionBlock = wp.data.select('core/block-editor').getBlocksByClientId(clientId);
            const realPaneCount = accordionBlock[0] ? accordionBlock[0].innerBlocks.length : accordionBlock.innerBlocks.length;

            if (accordionBlock[0]) {
              (0,lodash__WEBPACK_IMPORTED_MODULE_4__.times)(realPaneCount, n => {
                wp.data.dispatch('core/block-editor').updateBlockAttributes(accordionBlock[0].innerBlocks[n].clientId, {
                  titleTag: blockConfigObject['kadence/accordion'][attribute]
                });
              });
            } else {
              (0,lodash__WEBPACK_IMPORTED_MODULE_4__.times)(realPaneCount, n => {
                wp.data.dispatch('core/block-editor').updateBlockAttributes(accordionBlock.innerBlocks[n].clientId, {
                  titleTag: blockConfigObject['kadence/accordion'][attribute]
                });
              });
            }

            setTitleTag(blockConfigObject['kadence/accordion'][attribute]);
          } else {
            attributes[attribute] = blockConfigObject['kadence/accordion'][attribute];
          }
        });
      }

      if (blockConfigObject['kadence/pane'] !== undefined && typeof blockConfigObject['kadence/pane'] === 'object') {
        if (blockConfigObject['kadence/pane'].titleTag !== undefined) {
          setTitleTag(blockConfigObject['kadence/pane'].titleTag);
        }
      }

      if (showPresets) {
        setShowPreset(true);
      }

      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      ktaccordUniqueIDs.push('_' + clientId.substr(2, 9));
    } else if (ktaccordUniqueIDs.includes(uniqueID)) {
      // This will force a rebuild of the unique ID when preview changes.
      setAttributes({
        uniqueID: '_' + clientId.substr(2, 9)
      });
      ktaccordUniqueIDs.push('_' + clientId.substr(2, 9));
    } else {
      ktaccordUniqueIDs.push(uniqueID);
    }

    if (titleStyles[0].padding[0] === titleStyles[0].padding[1] && titleStyles[0].padding[0] === titleStyles[0].padding[2] && titleStyles[0].padding[0] === titleStyles[0].padding[3]) {
      setTitlePaddingControl('linked');
    } else {
      setTitlePaddingControl('individual');
    }

    if (titleStyles[0].borderWidth[0] === titleStyles[0].borderWidth[1] && titleStyles[0].borderWidth[0] === titleStyles[0].borderWidth[2] && titleStyles[0].borderWidth[0] === titleStyles[0].borderWidth[3]) {
      setTitleBorderControl('linked');
    } else {
      setTitleBorderControl('individual');
    }

    if (titleStyles[0].borderRadius[0] === titleStyles[0].borderRadius[1] && titleStyles[0].borderRadius[0] === titleStyles[0].borderRadius[2] && titleStyles[0].borderRadius[0] === titleStyles[0].borderRadius[3]) {
      setTitleBorderRadiusControl('linked');
    } else {
      setTitleBorderRadiusControl('individual');
    }

    if (contentBorder[0] === contentBorder[1] && contentBorder[0] === contentBorder[2] && contentBorder[0] === contentBorder[3]) {
      setContentBorderControl('linked');
    } else {
      setContentBorderControl('individual');
    }

    if (contentBorderRadius[0] === contentBorderRadius[1] && contentBorderRadius[0] === contentBorderRadius[2] && contentBorderRadius[0] === contentBorderRadius[3]) {
      setContentBorderRadiusControl('linked');
    } else {
      setContentBorderRadiusControl('individual');
    }

    if (contentPadding[0] === contentPadding[1] && contentPadding[0] === contentPadding[2] && contentPadding[0] === contentPadding[3]) {
      setContentPaddingControl('linked');
    } else {
      setContentPaddingControl('individual');
    }

    if (titleStyles[0].border[0] === titleStyles[0].border[1] && titleStyles[0].border[0] === titleStyles[0].border[2] && titleStyles[0].border[0] === titleStyles[0].border[3]) {
      setTitleBorderColorControl('linked');
    } else {
      setTitleBorderColorControl('individual');
    }

    if (titleStyles[0].borderHover[0] === titleStyles[0].borderHover[1] && titleStyles[0].borderHover[0] === titleStyles[0].borderHover[2] && titleStyles[0].borderHover[0] === titleStyles[0].borderHover[3]) {
      setTitleBorderHoverColorControl('linked');
    } else {
      setTitleBorderHoverColorControl('individual');
    }

    if (titleStyles[0].borderActive[0] === titleStyles[0].borderActive[1] && titleStyles[0].borderActive[0] === titleStyles[0].borderActive[2] && titleStyles[0].borderActive[0] === titleStyles[0].borderActive[3]) {
      setTitleBorderActiveColorControl('linked');
    } else {
      setTitleBorderActiveColorControl('individual');
    }

    if (accordionBlock && accordionBlock[0] && accordionBlock[0].innerBlocks[0] && accordionBlock[0].innerBlocks[0].attributes && accordionBlock[0].innerBlocks[0].attributes.titleTag) {
      setTitleTag(accordionBlock[0].innerBlocks[0].attributes.titleTag);
    }

    if (accordionBlock && accordionBlock.innerBlocks[0] && accordionBlock.innerBlocks[0].attributes && accordionBlock.innerBlocks[0].attributes.titleTag) {
      setTitleTag(accordionBlock.innerBlocks[0].attributes.titleTag);
    }
  }, []);
  const startlayoutOptions = [{
    key: 'skip',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Skip'),
    icon: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Skip')
  }, {
    key: 'base',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Base'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.accord1Icon
  }, {
    key: 'highlight',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Highlight'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.accord2Icon
  }, {
    key: 'subtle',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Subtle'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.accord3Icon
  }, {
    key: 'bottom',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Bottom Border'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.accord4Icon
  }];
  const previewPaddingType = undefined !== contentPaddingType ? contentPaddingType : 'px';
  const paddingMin = previewPaddingType === 'em' || previewPaddingType === 'rem' ? 0 : 0;
  const paddingMax = previewPaddingType === 'em' || previewPaddingType === 'rem' ? 12 : 200;
  const paddingStep = previewPaddingType === 'em' || previewPaddingType === 'rem' ? 0.1 : 1;
  const previewContentPaddingTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewDevice, undefined !== contentPadding && undefined !== contentPadding[0] ? contentPadding[0] : '', undefined !== contentTabletPadding && undefined !== contentTabletPadding[0] ? contentTabletPadding[0] : '', undefined !== contentMobilePadding && undefined !== contentMobilePadding[0] ? contentMobilePadding[0] : '');
  const previewContentPaddingRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewDevice, undefined !== contentPadding && undefined !== contentPadding[1] ? contentPadding[1] : '', undefined !== contentTabletPadding && undefined !== contentTabletPadding[1] ? contentTabletPadding[1] : '', undefined !== contentMobilePadding && undefined !== contentMobilePadding[1] ? contentMobilePadding[1] : '');
  const previewContentPaddingBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewDevice, undefined !== contentPadding && undefined !== contentPadding[2] ? contentPadding[2] : '', undefined !== contentTabletPadding && undefined !== contentTabletPadding[2] ? contentTabletPadding[2] : '', undefined !== contentMobilePadding && undefined !== contentMobilePadding[2] ? contentMobilePadding[2] : '');
  const previewContentPaddingLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewDevice, undefined !== contentPadding && undefined !== contentPadding[3] ? contentPadding[3] : '', undefined !== contentTabletPadding && undefined !== contentTabletPadding[3] ? contentTabletPadding[3] : '', undefined !== contentMobilePadding && undefined !== contentMobilePadding[3] ? contentMobilePadding[3] : '');
  const previewTitlePaddingType = undefined !== titleStyles[0].paddingType && '' !== titleStyles[0].paddingType ? titleStyles[0].paddingType : 'px';
  const titlePaddingMin = previewTitlePaddingType === 'em' || previewTitlePaddingType === 'rem' ? 0 : 0;
  const titlePaddingMax = previewTitlePaddingType === 'em' || previewTitlePaddingType === 'rem' ? 12 : 200;
  const titlePaddingStep = previewTitlePaddingType === 'em' || previewTitlePaddingType === 'rem' ? 0.1 : 1;
  const previewTitlePaddingTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewDevice, undefined !== titleStyles[0].padding && undefined !== titleStyles[0].padding[0] ? titleStyles[0].padding[0] : '', undefined !== titleStyles[0].paddingTablet && undefined !== titleStyles[0].paddingTablet[0] ? titleStyles[0].paddingTablet[0] : '', undefined !== titleStyles[0].paddingMobile && undefined !== titleStyles[0].paddingMobile[0] ? titleStyles[0].paddingMobile[0] : '');
  const previewTitlePaddingRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewDevice, undefined !== titleStyles[0].padding && undefined !== titleStyles[0].padding[1] ? titleStyles[0].padding[1] : '', undefined !== titleStyles[0].paddingTablet && undefined !== titleStyles[0].paddingTablet[1] ? titleStyles[0].paddingTablet[1] : '', undefined !== titleStyles[0].paddingMobile && undefined !== titleStyles[0].paddingMobile[1] ? titleStyles[0].paddingMobile[1] : '');
  const previewTitlePaddingBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewDevice, undefined !== titleStyles[0].padding && undefined !== titleStyles[0].padding[2] ? titleStyles[0].padding[2] : '', undefined !== titleStyles[0].paddingTablet && undefined !== titleStyles[0].paddingTablet[2] ? titleStyles[0].paddingTablet[2] : '', undefined !== titleStyles[0].paddingMobile && undefined !== titleStyles[0].paddingMobile[2] ? titleStyles[0].paddingMobile[2] : '');
  const previewTitlePaddingLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewSize)(_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.getPreviewDevice, undefined !== titleStyles[0].padding && undefined !== titleStyles[0].padding[3] ? titleStyles[0].padding[3] : '', undefined !== titleStyles[0].paddingTablet && undefined !== titleStyles[0].paddingTablet[3] ? titleStyles[0].paddingTablet[3] : '', undefined !== titleStyles[0].paddingMobile && undefined !== titleStyles[0].paddingMobile[3] ? titleStyles[0].paddingMobile[3] : '');

  const setInitalLayout = key => {
    if ('skip' === key) {} else if ('base' === key) {
      setAttributes({
        contentBorder: [0, 0, 0, 0],
        titleAlignment: 'left',
        showIcon: true,
        iconStyle: 'basic',
        iconSide: 'right',
        titleStyles: [{
          size: titleStyles[0].size,
          sizeType: titleStyles[0].sizeType,
          lineHeight: titleStyles[0].lineHeight,
          lineType: titleStyles[0].lineType,
          letterSpacing: titleStyles[0].letterSpacing,
          family: titleStyles[0].family,
          google: titleStyles[0].google,
          style: titleStyles[0].style,
          weight: titleStyles[0].weight,
          variant: titleStyles[0].variant,
          subset: titleStyles[0].subset,
          loadGoogle: titleStyles[0].loadGoogle,
          padding: [10, 14, 10, 14],
          marginTop: 0,
          color: '#555555',
          background: '#f2f2f2',
          border: ['#555555', '#555555', '#555555', '#555555'],
          borderRadius: [0, 0, 0, 0],
          borderWidth: [0, 0, 0, 0],
          colorHover: '#444444',
          backgroundHover: '#eeeeee',
          borderHover: ['#eeeeee', '#eeeeee', '#eeeeee', '#eeeeee'],
          colorActive: '#ffffff',
          backgroundActive: '#444444',
          borderActive: ['#444444', '#444444', '#444444', '#444444'],
          textTransform: titleStyles[0].textTransform
        }]
      });
    } else if ('highlight' === key) {
      setAttributes({
        contentBorder: [0, 0, 0, 0],
        contentBgColor: '#ffffff',
        titleAlignment: 'left',
        showIcon: true,
        iconStyle: 'basic',
        iconSide: 'right',
        titleStyles: [{
          size: titleStyles[0].size,
          sizeType: titleStyles[0].sizeType,
          lineHeight: titleStyles[0].lineHeight,
          lineType: titleStyles[0].lineType,
          letterSpacing: titleStyles[0].letterSpacing,
          family: titleStyles[0].family,
          google: titleStyles[0].google,
          style: titleStyles[0].style,
          weight: titleStyles[0].weight,
          variant: titleStyles[0].variant,
          subset: titleStyles[0].subset,
          loadGoogle: titleStyles[0].loadGoogle,
          padding: [14, 16, 14, 16],
          marginTop: 10,
          color: '#555555',
          background: '#f2f2f2',
          border: ['#555555', '#555555', '#555555', '#555555'],
          borderRadius: [6, 6, 6, 6],
          borderWidth: [0, 0, 0, 0],
          colorHover: '#444444',
          backgroundHover: '#eeeeee',
          borderHover: ['#eeeeee', '#eeeeee', '#eeeeee', '#eeeeee'],
          colorActive: '#ffffff',
          backgroundActive: '#f3690e',
          borderActive: ['#f3690e', '#f3690e', '#f3690e', '#f3690e'],
          textTransform: titleStyles[0].textTransform
        }]
      });
    } else if ('subtle' === key) {
      setAttributes({
        contentBorder: [0, 1, 1, 1],
        contentBgColor: '#ffffff',
        titleAlignment: 'left',
        showIcon: true,
        iconStyle: 'arrow',
        iconSide: 'right',
        titleStyles: [{
          size: titleStyles[0].size,
          sizeType: titleStyles[0].sizeType,
          lineHeight: titleStyles[0].lineHeight,
          lineType: titleStyles[0].lineType,
          letterSpacing: titleStyles[0].letterSpacing,
          family: titleStyles[0].family,
          google: titleStyles[0].google,
          style: titleStyles[0].style,
          weight: titleStyles[0].weight,
          variant: titleStyles[0].variant,
          subset: titleStyles[0].subset,
          loadGoogle: titleStyles[0].loadGoogle,
          padding: [14, 16, 14, 16],
          marginTop: 10,
          color: '#444444',
          background: '#ffffff',
          border: ['#eeeeee', '#eeeeee', '#eeeeee', '#eeeeee'],
          borderRadius: [0, 0, 0, 0],
          borderWidth: [1, 1, 1, 2],
          colorHover: '#444444',
          backgroundHover: '#ffffff',
          borderHover: ['#d4d4d4', '#d4d4d4', '#d4d4d4', '#d4d4d4'],
          colorActive: '#444444',
          backgroundActive: '#ffffff',
          borderActive: ['#eeeeee', '#eeeeee', '#eeeeee', '#0e9cd1'],
          textTransform: titleStyles[0].textTransform
        }]
      });
    } else if ('bottom' === key) {
      setAttributes({
        contentBorder: [0, 0, 0, 0],
        contentBgColor: '#ffffff',
        titleAlignment: 'left',
        showIcon: false,
        iconStyle: 'arrow',
        iconSide: 'right',
        titleStyles: [{
          size: titleStyles[0].size,
          sizeType: titleStyles[0].sizeType,
          lineHeight: titleStyles[0].lineHeight,
          lineType: titleStyles[0].lineType,
          letterSpacing: titleStyles[0].letterSpacing,
          family: titleStyles[0].family,
          google: titleStyles[0].google,
          style: titleStyles[0].style,
          weight: titleStyles[0].weight,
          variant: titleStyles[0].variant,
          subset: titleStyles[0].subset,
          loadGoogle: titleStyles[0].loadGoogle,
          padding: [14, 10, 6, 16],
          marginTop: 8,
          color: '#444444',
          background: '#ffffff',
          border: ['#f2f2f2', '#f2f2f2', '#f2f2f2', '#f2f2f2'],
          borderRadius: [0, 0, 0, 0],
          borderWidth: [0, 0, 4, 0],
          colorHover: '#444444',
          backgroundHover: '#ffffff',
          borderHover: ['#eeeeee', '#eeeeee', '#eeeeee', '#eeeeee'],
          colorActive: '#333333',
          backgroundActive: '#ffffff',
          borderActive: ['#0e9cd1', '#0e9cd1', '#0e9cd1', '#0e9cd1'],
          textTransform: titleStyles[0].textTransform
        }]
      });
    }
  };

  const saveTitleStyles = value => {
    const newUpdate = titleStyles.map((item, index) => {
      if (0 === index) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      titleStyles: newUpdate
    });
  };

  const lgconfig = {
    google: {
      families: [titleStyles[0].family + (titleStyles[0].variant ? ':' + titleStyles[0].variant : '')]
    }
  };
  const config = titleStyles[0].google ? lgconfig : '';
  const classes = classnames__WEBPACK_IMPORTED_MODULE_2___default()(className, `kt-accordion-wrap kt-accordion-id${uniqueID} kt-accordion-has-${paneCount}-panes kt-accordion-block kt-pane-header-alignment-${titleAlignment}`);
  const normalSettings = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Title Color', 'kadence-blocks'),
    value: titleStyles[0].color ? titleStyles[0].color : '',
    default: '',
    onChange: value => saveTitleStyles({
      color: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Title Background', 'kadence-blocks'),
    value: titleStyles[0].background ? titleStyles[0].background : '',
    default: '',
    onChange: value => saveTitleStyles({
      background: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.BorderColorControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Title Border Color'),
    values: titleStyles[0].border,
    control: titleBorderColorControl,
    onChange: value => saveTitleStyles({
      border: value
    }),
    onControl: value => setTitleBorderColorControl(value)
  }));
  const hoverSettings = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Hover Color', 'kadence-blocks'),
    value: titleStyles[0].colorHover ? titleStyles[0].colorHover : '',
    default: '',
    onChange: value => saveTitleStyles({
      colorHover: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Hover Background', 'kadence-blocks'),
    value: titleStyles[0].backgroundHover ? titleStyles[0].backgroundHover : '',
    default: '',
    onChange: value => saveTitleStyles({
      backgroundHover: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.BorderColorControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Hover Border Color'),
    values: titleStyles[0].borderHover,
    control: titleBorderHoverColorControl,
    onChange: value => saveTitleStyles({
      borderHover: value
    }),
    onControl: value => setTitleBorderHoverColorControl(value)
  }));
  const activeSettings = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Active Color', 'kadence-blocks'),
    value: titleStyles[0].colorActive ? titleStyles[0].colorActive : '',
    default: '',
    onChange: value => saveTitleStyles({
      colorActive: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Active Background', 'kadence-blocks'),
    value: titleStyles[0].backgroundActive ? titleStyles[0].backgroundActive : '',
    default: '',
    onChange: value => saveTitleStyles({
      backgroundActive: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.BorderColorControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Active Border Color'),
    colorDefault: titleStyles[0].border && titleStyles[0].border[0] ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].border[0]) : '#444444',
    values: titleStyles[0].borderActive,
    control: titleBorderActiveColorControl,
    onChange: value => saveTitleStyles({
      borderActive: value
    }),
    onControl: value => setTitleBorderActiveColorControl(value)
  }));
  const accordionIconSet = [];
  accordionIconSet.basic = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    x: "77.002",
    y: "12.507",
    width: "13.982",
    height: "74.986",
    fill: "#444"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z",
    fill: "#444"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z",
    fill: "#444"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z",
    fill: "#444"
  }));
  accordionIconSet.basiccircle = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "83.723",
    cy: "50",
    r: "50",
    fill: "#444"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "322.768",
    cy: "50",
    r: "50",
    fill: "#444"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    x: "77.002",
    y: "12.507",
    width: "13.982",
    height: "74.986",
    fill: "#fff"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z",
    fill: "#fff"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z",
    fill: "#fff"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z",
    fill: "#fff"
  }));
  accordionIconSet.xclose = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    x: "77.002",
    y: "12.507",
    width: "13.982",
    height: "74.986",
    fill: "#444"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M353.5,28.432l-9.887,-9.887l-53.023,53.023l9.887,9.887l53.023,-53.023Z",
    fill: "#444"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z",
    fill: "#444"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z",
    fill: "#444"
  }));
  accordionIconSet.xclosecircle = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "83.723",
    cy: "50",
    r: "50",
    fill: "#444"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "322.768",
    cy: "50",
    r: "50",
    fill: "#444"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    x: "77.002",
    y: "12.507",
    width: "13.982",
    height: "74.986",
    fill: "#fff"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z",
    fill: "#fff"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z",
    fill: "#fff"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M290.59,71.568l9.887,9.887l53.023,-53.023l-9.887,-9.887l-53.023,53.023Z",
    fill: "#fff"
  }));
  accordionIconSet.arrow = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    fill: "#444"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    fill: "#444"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z"
  })));
  accordionIconSet.arrowcircle = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "83.723",
    cy: "50",
    r: "50",
    fill: "#444"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
    cx: "322.768",
    cy: "50",
    r: "50",
    fill: "#444"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    fill: "#fff"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    fill: "#fff"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z"
  })));

  const renderIconSet = svg => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    className: "accord-icon",
    viewBox: "0 0 400 100",
    xmlns: "http://www.w3.org/2000/svg",
    preserveAspectRatio: "none",
    fillRule: "evenodd",
    clipRule: "evenodd",
    strokeLinejoin: "round",
    strokeMiterlimit: "1.414",
    style: {
      fill: '#000000'
    }
  }, "  ");

  const renderCSS = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", null, `
				.kt-accordion-${uniqueID} .kt-blocks-accordion-header {
					color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].color)};
					border-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].border[0])} ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].border[1])} ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].border[2])} ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].border[3])};
					background-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].background)};
					${'' !== previewTitlePaddingTop ? `padding-top:${previewTitlePaddingTop + previewTitlePaddingType};` : ''}
					${'' !== previewTitlePaddingRight ? `padding-right:${previewTitlePaddingRight + previewTitlePaddingType};` : ''}
					${'' !== previewTitlePaddingBottom ? `padding-bottom:${previewTitlePaddingBottom + previewTitlePaddingType};` : ''}
					${'' !== previewTitlePaddingLeft ? `padding-left:${previewTitlePaddingLeft + previewTitlePaddingType};` : ''}
					margin-top:${titleStyles[0].marginTop > 32 ? titleStyles[0].marginTop : 0}px;
					border-width:${titleStyles[0].borderWidth[0]}px ${titleStyles[0].borderWidth[1]}px ${titleStyles[0].borderWidth[2]}px ${titleStyles[0].borderWidth[3]}px;
					border-radius:${titleStyles[0].borderRadius[0]}px ${titleStyles[0].borderRadius[1]}px ${titleStyles[0].borderRadius[2]}px ${titleStyles[0].borderRadius[3]}px;
					font-size:${titleStyles[0].size[0]}${titleStyles[0].sizeType};
					line-height:${titleStyles[0].lineHeight[0]}${titleStyles[0].lineType};
					letter-spacing:${titleStyles[0].letterSpacing}px;
					text-transform:${titleStyles[0].textTransform};
					font-family:${titleStyles[0].family};
					font-style:${titleStyles[0].style};
					font-weight:${titleStyles[0].weight};
				}
				.kt-accordion-${uniqueID} .kt-blocks-accordion-header .kt-blocks-accordion-title {
					line-height:${titleStyles[0].lineHeight[0]}${titleStyles[0].lineType};
				}
				.kt-accordion-${uniqueID} .kt-blocks-accordion-header .kt-btn-svg-icon svg {
					width:${titleStyles[0].size[0]}${titleStyles[0].sizeType};
					height:${titleStyles[0].size[0]}${titleStyles[0].sizeType};
				}
				.kt-accordion-${uniqueID} .kt-accordion-panel-inner {
					${'' !== previewContentPaddingTop ? `padding-top:${previewContentPaddingTop + previewPaddingType};` : ''}
					${'' !== previewContentPaddingRight ? `padding-right:${previewContentPaddingRight + previewPaddingType};` : ''}
					${'' !== previewContentPaddingBottom ? `padding-bottom:${previewContentPaddingBottom + previewPaddingType};` : ''}
					${'' !== previewContentPaddingLeft ? `padding-left:${previewContentPaddingLeft + previewPaddingType};` : ''}
					background-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(contentBgColor)};
					border-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(contentBorderColor)};
					border-width:${contentBorder[0]}px ${contentBorder[1]}px ${contentBorder[2]}px ${contentBorder[3]}px;
					border-radius:${contentBorderRadius[0]}px ${contentBorderRadius[1]}px ${contentBorderRadius[2]}px ${contentBorderRadius[3]}px;
					min-height:${minHeight ? minHeight + 'px' : '0'};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:after {
					background-color: ${'' !== iconColor.standard ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(iconColor.standard) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].color)};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:after {
					background-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].background)};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger {
					background-color: ${'' !== iconColor.standard ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(iconColor.standard) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].color)};
				}
				.kt-accordion-${uniqueID} .kt-blocks-accordion-header:hover {
					color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].colorHover)};
					border-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].borderHover[0])} ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].borderHover[1])} ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].borderHover[2])} ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].borderHover[3])};
					background-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].backgroundHover)};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after {
					background-color: ${'' !== iconColor.hover ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(iconColor.hover) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].colorHover)};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after {
					background-color: ${'' !== iconColor.hover ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(iconColor.hover) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].backgroundHover)};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger {
					background-color: ${'' !== iconColor.hover ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(iconColor.hover) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].colorHover)};
				}
				.kt-accordion-${uniqueID}.kt-start-active-pane-${openPane + 1} .kt-accordion-pane-${openPane + 1} .kt-blocks-accordion-header {
					color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].colorActive)};
					border-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].borderActive[0])} ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].borderActive[1])} ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].borderActive[2])} ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].borderActive[3])};
					background-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].backgroundActive)};
				}
				.kt-accordion-${uniqueID}.kt-start-active-pane-${openPane + 1}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-accordion-pane-${openPane + 1} .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${uniqueID}.kt-start-active-pane-${openPane + 1}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-accordion-pane-${openPane + 1} .kt-blocks-accordion-icon-trigger:after {
					background-color: ${'' !== iconColor.active ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(iconColor.active) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].colorActive)};
				}
				.kt-accordion-${uniqueID}.kt-start-active-pane-${openPane + 1}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-pane-${openPane + 1} .kt-blocks-accordion-icon-trigger:before, .kt-accordion-${uniqueID}.kt-start-active-pane-${openPane + 1}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-pane-${openPane + 1} .kt-blocks-accordion-icon-trigger:after {
					background-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].backgroundActive)};
				}
				.kt-accordion-${uniqueID}.kt-start-active-pane-${openPane + 1}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-pane-${openPane + 1} .kt-blocks-accordion-icon-trigger {
					background-color: ${(0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.KadenceColorOutput)(titleStyles[0].colorActive)};
				}
				`);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.useBlockProps)({});
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, renderCSS, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.BlockControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.BlockAlignmentToolbar, {
    value: blockAlignment,
    controls: ['center', 'wide', 'full'],
    onChange: value => setAttributes({
      blockAlignment: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.AlignmentToolbar, {
    value: titleAlignment,
    onChange: nextAlign => {
      setAttributes({
        titleAlignment: nextAlign
      });
    }
  })), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('allSettings', 'kadence/accordion') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.InspectorControlTabs, {
    panelName: 'accordion',
    setActiveTab: value => setActiveTab(value),
    activeTab: activeTab
  }), activeTab === 'general' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    panelName: 'kb-accordion-all'
  }, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('paneControl', 'kadence/accordion') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Panes close when another opens', 'kadence-blocks'),
    checked: linkPaneCollapse,
    onChange: value => setAttributes({
      linkPaneCollapse: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Start with all panes collapsed', 'kadence-blocks'),
    checked: startCollapsed,
    onChange: value => setAttributes({
      startCollapsed: value
    })
  }), !startCollapsed && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Initial Open Accordion', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Initial Open Accordion', 'kadence-blocks')
  }, accordionBlock && accordionBlock[0] && accordionBlock[0].innerBlocks && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(accordionBlock[0].innerBlocks, _ref2 => {
    let {
      attributes
    } = _ref2;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
      key: attributes.id - 1,
      className: "kt-init-open-pane",
      isSmall: true,
      isPrimary: openPane === attributes.id - 1,
      "aria-pressed": openPane === attributes.id - 1,
      onClick: () => setAttributes({
        openPane: attributes.id - 1
      })
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Accordion Pane', 'kadence-blocks') + ' ' + attributes.id);
  })), accordionBlock && accordionBlock.innerBlocks && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(accordionBlock.innerBlocks, _ref3 => {
    let {
      attributes
    } = _ref3;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
      key: attributes.id - 1,
      className: "kt-init-open-pane",
      isSmall: true,
      isPrimary: openPane === attributes.id - 1,
      "aria-pressed": openPane === attributes.id - 1,
      onClick: () => setAttributes({
        openPane: attributes.id - 1
      })
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Accordion Pane', 'kadence-blocks') + ' ' + attributes.id);
  })))))), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('titleColors', 'kadence/accordion') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Pane Title Color Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-accordion-pane-title-color-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.TabPanel, {
    className: "kt-inspect-tabs kt-no-ho-ac-tabs kt-hover-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'normal',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Normal'),
      className: 'kt-normal-tab'
    }, {
      name: 'hover',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Hover'),
      className: 'kt-hover-tab'
    }, {
      name: 'active',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Active'),
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
  })), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('titleIcon', 'kadence/accordion') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Pane Title Trigger Icon', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-acordion-panel-title-trigger-icon'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Show Icon', 'kadence-blocks'),
    checked: showIcon,
    onChange: value => setAttributes({
      showIcon: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Icon Style', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.IconPicker, {
    icons: ['basic', 'basiccircle', 'xclose', 'xclosecircle', 'arrow', 'arrowcircle'],
    value: iconStyle,
    onChange: value => setAttributes({
      iconStyle: value
    }),
    appendTo: "body",
    renderFunc: renderIconSet,
    theme: "accordion",
    showSearch: false,
    noSelectedPlaceholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Select Icon Set', 'kadence-blocks'),
    isMulti: false
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Icon Side', 'kadence-blocks'),
    value: iconSide,
    options: [{
      value: 'right',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Right')
    }, {
      value: 'left',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Left')
    }],
    onChange: value => setAttributes({
      iconSide: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.TabPanel, {
    className: "kt-inspect-tabs kt-no-ho-ac-tabs kt-hover-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'normal',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Normal'),
      className: 'kt-normal-tab'
    }, {
      name: 'hover',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Hover'),
      className: 'kt-hover-tab'
    }, {
      name: 'active',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Active'),
      className: 'kt-active-tab'
    }]
  }, tab => {
    if (tab.name) {
      if ('hover' === tab.name) {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: tab.className,
          key: tab.className
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Hover Icon Color', 'kadence-blocks'),
          value: iconColor.hover ? iconColor.hover : '',
          default: '',
          onChange: value => setAttributes({
            iconColor: { ...iconColor,
              hover: value
            }
          })
        }));
      } else if ('active' === tab.name) {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: tab.className,
          key: tab.className
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Active Icon Color', 'kadence-blocks'),
          value: iconColor.active ? iconColor.active : '',
          default: '',
          onChange: value => setAttributes({
            iconColor: { ...iconColor,
              active: value
            }
          })
        }));
      } else {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: tab.className,
          key: tab.className
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Icon Color', 'kadence-blocks'),
          value: iconColor.standard ? iconColor.standard : '',
          default: '',
          onChange: value => setAttributes({
            iconColor: { ...iconColor,
              standard: value
            }
          })
        }));
      }
    }
  }))), activeTab === 'style' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('titleSpacing', 'kadence/accordion') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Pane Title Spacing', 'kadence-blocks'),
    panelName: 'kb-accordion-pane-title-spacing'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Pane Title Padding', 'kadence-blocks'),
    control: titlePaddingControl,
    tabletControl: titlePaddingControl,
    mobileControl: titlePaddingControl,
    value: titleStyles[0].padding,
    tabletValue: undefined !== titleStyles[0].paddingTablet ? titleStyles[0].paddingTablet : ['', '', '', ''],
    mobileValue: undefined !== titleStyles[0].paddingMobile ? titleStyles[0].paddingMobile : ['', '', '', ''],
    onChange: value => {
      saveTitleStyles({
        padding: value
      });
    },
    onChangeTablet: value => {
      saveTitleStyles({
        paddingTablet: value
      });
    },
    onChangeMobile: value => {
      saveTitleStyles({
        paddingMobile: value
      });
    },
    onChangeControl: value => setTitlePaddingControl(value),
    onChangeTabletControl: value => setTitlePaddingControl(value),
    onChangeMobileControl: value => setTitlePaddingControl(value),
    allowEmpty: true,
    min: titlePaddingMin,
    max: titlePaddingMax,
    step: titlePaddingStep,
    unit: undefined !== titleStyles[0].paddingType ? titleStyles[0].paddingType : 'px',
    units: ['px', 'em', 'rem', '%'],
    onUnit: value => {
      saveTitleStyles({
        paddingType: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Pane Spacer Between', 'kadence-blocks'),
    value: titleStyles[0].marginTop,
    onChange: value => saveTitleStyles({
      marginTop: value
    }),
    min: 1,
    max: 120
  })), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('titleBorder', 'kadence/accordion') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Pane Title Border', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-accordion-pane-title-border'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Pane Title Border Width (px)', 'kadence-blocks'),
    measurement: titleStyles[0].borderWidth,
    control: titleBorderControl,
    onChange: value => saveTitleStyles({
      borderWidth: value
    }),
    onControl: value => setTitleBorderControl(value),
    min: 0,
    max: 100,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Pane Title Border Radius (px)', 'kadence-blocks'),
    measurement: titleStyles[0].borderRadius,
    control: titleBorderRadiusControl,
    onChange: value => saveTitleStyles({
      borderRadius: value
    }),
    onControl: value => setTitleBorderRadiusControl(value),
    min: 0,
    max: 100,
    step: 1,
    controlTypes: [{
      key: 'linked',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Linked'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.radiusLinkedIcon
    }, {
      key: 'individual',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Individual'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.radiusIndividualIcon
    }],
    firstIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.topLeftIcon,
    secondIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.topRightIcon,
    thirdIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.bottomRightIcon,
    fourthIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.bottomLeftIcon
  })), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('titleFont', 'kadence/accordion') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Pane Title Font Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-accordion-pane-title-font-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.TypographyControls, {
    fontSize: titleStyles[0].size,
    onFontSize: value => saveTitleStyles({
      size: value
    }),
    fontSizeType: titleStyles[0].sizeType,
    onFontSizeType: value => saveTitleStyles({
      sizeType: value
    }),
    lineHeight: titleStyles[0].lineHeight,
    onLineHeight: value => saveTitleStyles({
      lineHeight: value
    }),
    lineHeightType: titleStyles[0].lineType,
    onLineHeightType: value => saveTitleStyles({
      lineType: value
    }),
    letterSpacing: titleStyles[0].letterSpacing,
    onLetterSpacing: value => saveTitleStyles({
      letterSpacing: value
    }),
    textTransform: titleStyles[0].textTransform,
    onTextTransform: value => saveTitleStyles({
      textTransform: value
    }),
    fontFamily: titleStyles[0].family,
    onFontFamily: value => saveTitleStyles({
      family: value
    }),
    onFontChange: select => {
      saveTitleStyles({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => saveTitleStyles(values),
    googleFont: titleStyles[0].google,
    onGoogleFont: value => saveTitleStyles({
      google: value
    }),
    loadGoogleFont: titleStyles[0].loadGoogle,
    onLoadGoogleFont: value => saveTitleStyles({
      loadGoogle: value
    }),
    fontVariant: titleStyles[0].variant,
    onFontVariant: value => saveTitleStyles({
      variant: value
    }),
    fontWeight: titleStyles[0].weight,
    onFontWeight: value => saveTitleStyles({
      weight: value
    }),
    fontStyle: titleStyles[0].style,
    onFontStyle: value => saveTitleStyles({
      style: value
    }),
    fontSubset: titleStyles[0].subset,
    onFontSubset: value => saveTitleStyles({
      subset: value
    })
  })), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('paneContent', 'kadence/accordion') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Inner Content Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-accordion-inner-content-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Inner Content Padding', 'kadence-blocks'),
    control: contentPaddingControl,
    tabletControl: contentPaddingControl,
    mobileControl: contentPaddingControl,
    value: contentPadding,
    tabletValue: contentTabletPadding,
    mobileValue: contentMobilePadding,
    onChange: value => {
      setAttributes({
        contentPadding: value
      });
    },
    onChangeTablet: value => {
      setAttributes({
        contentTabletPadding: value
      });
    },
    onChangeMobile: value => {
      setAttributes({
        contentMobilePadding: value
      });
    },
    onChangeControl: value => setContentPaddingControl(value),
    onChangeTabletControl: value => setContentPaddingControl(value),
    onChangeMobileControl: value => setContentPaddingControl(value),
    allowEmpty: true,
    min: paddingMin,
    max: paddingMax,
    step: paddingStep,
    unit: contentPaddingType,
    units: ['px', 'em', 'rem', '%'],
    onUnit: value => setAttributes({
      contentPaddingType: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Inner Content Background', 'kadence-blocks'),
    value: contentBgColor ? contentBgColor : '',
    default: '',
    onChange: value => setAttributes({
      contentBgColor: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Inner Content Border Color', 'kadence-blocks'),
    value: contentBorderColor ? contentBorderColor : '',
    default: '',
    onChange: value => setAttributes({
      contentBorderColor: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Inner Content Border Width (px)', 'kadence-blocks'),
    measurement: contentBorder,
    control: contentBorderControl,
    onChange: value => setAttributes({
      contentBorder: value
    }),
    onControl: value => setContentBorderControl(value),
    min: 0,
    max: 40,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Inner Content Border Radius (px)', 'kadence-blocks'),
    measurement: contentBorderRadius,
    control: contentBorderRadiusControl,
    onChange: value => setAttributes({
      contentBorderRadius: value
    }),
    onControl: value => setContentBorderRadiusControl(value),
    min: 0,
    max: 100,
    step: 1,
    controlTypes: [{
      key: 'linked',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Linked', 'kadence-blocks'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.radiusLinkedIcon
    }, {
      key: 'individual',
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Individual', 'kadence-blocks'),
      icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.radiusIndividualIcon
    }],
    firstIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.topLeftIcon,
    secondIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.topRightIcon,
    thirdIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.bottomRightIcon,
    fourthIcon: _kadence_icons__WEBPACK_IMPORTED_MODULE_1__.bottomLeftIcon
  }))), activeTab === 'advanced' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('titleTag', 'kadence/accordion') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Title Tag Settings', 'kadence-blocks'),
    panelName: 'kb-accordion-title-tag-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Title Tag', 'kadence-blocks'),
    value: titleTag,
    options: [{
      value: 'div',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('div')
    }, {
      value: 'h2',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('h2')
    }, {
      value: 'h3',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('h3')
    }, {
      value: 'h4',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('h4')
    }, {
      value: 'h5',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('h5')
    }, {
      value: 'h6',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('h6')
    }],
    onChange: value => {
      updatePaneTag(value);
      setTitleTag(value);
    }
  })), (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_6__.showSettings)('structure', 'kadence/accordion') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Structure Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-accordion-structure-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Content Minimum Height', 'kadence-blocks'),
    value: minHeight,
    onChange: value => {
      setAttributes({
        minHeight: value
      });
    },
    min: 0,
    max: 1000
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Max Width', 'kadence-blocks'),
    value: maxWidth,
    onChange: value => {
      setAttributes({
        maxWidth: value
      });
    },
    min: 0,
    max: 2000
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Enable FAQ Schema', 'kadence-blocks'),
    checked: faqSchema,
    onChange: value => {
      updateFaqSchema(value);
      setAttributes({
        faqSchema: value
      });
    }
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: classes
  }, showPreset && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "kt-select-starter-style-tabs"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "kt-select-starter-style-tabs-title"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Select Initial Style')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ButtonGroup, {
    className: "kt-init-tabs-btn-group",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Initial Style', 'kadence-blocks')
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_4__.map)(startlayoutOptions, _ref4 => {
    let {
      name,
      key,
      icon
    } = _ref4;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
      key: key,
      className: "kt-inital-tabs-style-btn",
      isSmall: true,
      onClick: () => {
        setInitalLayout(key);
        setShowPreset(false);
      }
    }, icon);
  }))), !showPreset && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "kt-accordion-selecter"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Accordion', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "kt-accordion-wrap",
    style: {
      maxWidth: maxWidth + 'px'
    }
  }, titleStyles[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_5__.WebfontLoader, {
    config: config
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `kt-accordion-inner-wrap kt-accordion-${uniqueID} kt-start-active-pane-${openPane + 1} kt-accodion-icon-style-${iconStyle && showIcon ? iconStyle : 'none'} kt-accodion-icon-side-${iconSide ? iconSide : 'right'}`
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_9__.InnerBlocks, {
    template: getPanesTemplate(0 === realPaneCount ? paneCount : realPaneCount),
    templateLock: false,
    allowedBlocks: ALLOWED_BLOCKS
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "kt-accordion-add-selecter"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
    className: "kt-accordion-add",
    isPrimary: true,
    icon: "plus",
    iconPosition: "left",
    iconSize: 16,
    onClick: () => {
      const newBlock = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_8__.createBlock)('kadence/pane', {
        id: paneCount + 1,
        titleTag: titleTag
      });
      setAttributes({
        paneCount: paneCount + 1
      });
      insertPane(newBlock);
    }
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Add Accordion Item', 'kadence-blocks')), realPaneCount > 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Button, {
    className: "kt-accordion-remove",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__.__)('Remove Accordion Item', 'kadence-blocks'),
    icon: "minus",
    onClick: () => {
      const removeClientId = accordionBlock[0] ? accordionBlock[0].innerBlocks[realPaneCount - 1].clientId : accordionBlock.innerBlocks[realPaneCount - 1].clientId;
      removePane(removeClientId);
    }
  })))));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_12__.compose)([(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_11__.withSelect)((select, ownProps) => {
  const {
    clientId
  } = ownProps;
  const {
    getBlock
  } = select('core/block-editor');
  const block = getBlock(clientId);
  return {
    accordionBlock: block,
    realPaneCount: block.innerBlocks.length,
    getPreviewDevice: select('kadenceblocks/data').getPreviewDeviceType()
  };
}), (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_11__.withDispatch)((dispatch, _ref5, _ref6) => {
  let {
    clientId
  } = _ref5;
  let {
    select
  } = _ref6;
  const {
    getBlock
  } = select('core/block-editor');
  const {
    removeBlock,
    updateBlockAttributes,
    insertBlock
  } = dispatch('core/block-editor');
  const block = getBlock(clientId);
  return {
    updatePaneTag(value) {
      (0,lodash__WEBPACK_IMPORTED_MODULE_4__.times)(block.innerBlocks.length, n => {
        updateBlockAttributes(block.innerBlocks[n].clientId, {
          titleTag: value
        });
      });
    },

    updateFaqSchema(value) {
      (0,lodash__WEBPACK_IMPORTED_MODULE_4__.times)(block.innerBlocks.length, n => {
        updateBlockAttributes(block.innerBlocks[n].clientId, {
          faqSchema: value
        });
      });
    },

    insertPane(newBlock) {
      insertBlock(newBlock, parseInt(block.innerBlocks.length), clientId);
    },

    removePane(paneId) {
      removeBlock(paneId);
    }

  };
})])(KadenceAccordionComponent));

/***/ }),

/***/ "./src/blocks/accordion/pane/attributes.js":
/*!*************************************************!*\
  !*** ./src/blocks/accordion/pane/attributes.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * BLOCK: Kadence Accordion Attributes
 */
const attributes = {
  id: {
    type: 'number',
    default: 1
  },
  title: {
    type: 'array',
    source: 'children',
    selector: '.kt-blocks-accordion-title',
    default: ''
  },
  titleTag: {
    type: 'string',
    default: 'div'
  },
  hideLabel: {
    type: 'bool',
    default: false
  },
  icon: {
    type: 'string',
    default: ''
  },
  iconSide: {
    type: 'string',
    default: 'right'
  },
  uniqueID: {
    type: 'string',
    default: ''
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (attributes);

/***/ }),

/***/ "./src/blocks/accordion/pane/block.js":
/*!********************************************!*\
  !*** ./src/blocks/accordion/pane/block.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/accordion/pane/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/blocks/accordion/pane/block.json");
/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./deprecated */ "./src/blocks/accordion/pane/deprecated.js");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__);


/**
 * BLOCK: Kadence Pane
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

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__.registerBlockType)('kadence/pane', { ..._block_json__WEBPACK_IMPORTED_MODULE_5__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Pane', 'kadence-blocks'),
  icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.accordionBlockIcon,

  getEditWrapperProps(attributes) {
    return {
      'data-pane': attributes.id
    };
  },

  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],

  save(_ref) {
    let {
      attributes
    } = _ref;
    const {
      id,
      uniqueID,
      title,
      icon,
      iconSide,
      hideLabel,
      titleTag,
      ariaLabel
    } = attributes;
    const HtmlTagOut = !titleTag ? 'div' : titleTag;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: `kt-accordion-pane kt-accordion-pane-${id} kt-pane${uniqueID}`
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTagOut, {
      className: 'kt-accordion-header-wrap'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      className: `kt-blocks-accordion-header kt-acccordion-button-label-${hideLabel ? 'hide' : 'show'}`,
      "aria-label": ariaLabel ? ariaLabel : undefined
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "kt-blocks-accordion-title-wrap"
    }, icon && 'left' === iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconSpanTag, {
      className: `kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`,
      name: icon
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      className: 'kt-blocks-accordion-title',
      tagName: 'span',
      value: title
    }), icon && 'right' === iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_3__.IconSpanTag, {
      className: `kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`,
      name: icon
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "kt-blocks-accordion-icon-trigger"
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-accordion-panel'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-accordion-panel-inner'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null))));
  },

  deprecated: _deprecated__WEBPACK_IMPORTED_MODULE_6__["default"]
});

/***/ }),

/***/ "./src/blocks/accordion/pane/deprecated.js":
/*!*************************************************!*\
  !*** ./src/blocks/accordion/pane/deprecated.js ***!
  \*************************************************/
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
/* harmony import */ var _attributes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./attributes */ "./src/blocks/accordion/pane/attributes.js");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);


/**
 * BLOCK: Kadence Testimonial
 */

/**
 * Import Icons
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
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _ref => {
    let {
      attributes
    } = _ref;
    const {
      id,
      uniqueID,
      title,
      icon,
      iconSide,
      hideLabel,
      titleTag,
      ariaLabel
    } = attributes;
    const HtmlTagOut = !titleTag ? 'div' : titleTag;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-accordion-pane kt-accordion-pane-${id} kt-pane${uniqueID}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTagOut, {
      className: 'kt-accordion-header-wrap'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      className: `kt-blocks-accordion-header kt-acccordion-button-label-${hideLabel ? 'hide' : 'show'}`,
      "aria-label": ariaLabel ? ariaLabel : undefined
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "kt-blocks-accordion-title-wrap"
    }, icon && 'left' === iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.IconRender, {
      className: `kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`,
      name: icon
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.Content, {
      className: 'kt-blocks-accordion-title',
      tagName: 'span',
      value: title
    }), icon && 'right' === iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.IconRender, {
      className: `kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`,
      name: icon
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "kt-blocks-accordion-icon-trigger"
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-accordion-panel'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-accordion-panel-inner'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null))));
  }
}, {
  attributes: _attributes__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _ref2 => {
    let {
      attributes
    } = _ref2;
    const {
      id,
      uniqueID,
      title,
      icon,
      iconSide,
      hideLabel,
      titleTag
    } = attributes;
    const HtmlTagOut = !titleTag ? 'div' : titleTag;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `kt-accordion-pane kt-accordion-pane-${id} kt-pane${uniqueID}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTagOut, {
      className: 'kt-accordion-header-wrap'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      className: `kt-blocks-accordion-header kt-acccordion-button-label-${hideLabel ? 'hide' : 'show'}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-accordion-title-wrap"
    }, icon && 'left' === iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.IconRender, {
      className: `kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`,
      name: icon
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.Content, {
      className: 'kt-blocks-accordion-title',
      tagName: 'span',
      value: title
    }), icon && 'right' === iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.IconRender, {
      className: `kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`,
      name: icon
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-blocks-accordion-icon-trigger"
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-accordion-panel'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: 'kt-accordion-panel-inner'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.Content, null))));
  }
}]);

/***/ }),

/***/ "./src/blocks/accordion/pane/edit.js":
/*!*******************************************!*\
  !*** ./src/blocks/accordion/pane/edit.js ***!
  \*******************************************/
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
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);


/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */






/**
 * Build the Pane edit.
 */

function PaneEdit(_ref) {
  let {
    attributes,
    setAttributes,
    isSelected,
    clientId,
    className
  } = _ref;
  const {
    id,
    uniqueID,
    title,
    icon,
    iconSide,
    hideLabel,
    titleTag,
    ariaLabel
  } = attributes;
  const HtmlTagOut = !titleTag ? 'div' : titleTag;
  const {
    addUniqueID,
    addUniquePane
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useDispatch)('kadenceblocks/data');
  const {
    isUniqueID,
    isUniqueBlock,
    isUniquePane,
    isUniquePaneBlock,
    previewDevice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useSelect)(select => {
    return {
      isUniqueID: value => select('kadenceblocks/data').isUniqueID(value),
      isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
      isUniquePane: (value, rootID) => select('kadenceblocks/data').isUniquePane(value, rootID),
      isUniquePaneBlock: (value, clientId, rootID) => select('kadenceblocks/data').isUniquePaneBlock(value, clientId, rootID)
    };
  }, [clientId]);
  const {
    accordionBlock,
    rootID
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useSelect)(select => {
    const {
      getBlockRootClientId,
      getBlocksByClientId
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.store);
    const rootID = getBlockRootClientId(clientId);
    const accordionBlock = getBlocksByClientId(rootID);
    return {
      accordionBlock: undefined !== accordionBlock ? accordionBlock : '',
      rootID: undefined !== rootID ? rootID : ''
    };
  }, [clientId]);
  const {
    updateBlockAttributes
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.store);

  const updatePaneCount = value => {
    updateBlockAttributes(rootID, {
      paneCount: value
    });
  };

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
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

    if (!id) {
      const newPaneCount = accordionBlock[0].attributes.paneCount + 1;
      setAttributes({
        id: newPaneCount
      });

      if (!isUniquePane(newPaneCount, rootID)) {
        addUniquePane(newPaneCount, clientId, rootID);
      }

      updatePaneCount(newPaneCount);
    } else if (!isUniquePane(id, rootID)) {
      // This checks if we are just switching views, client ID the same means we don't need to update.
      if (!isUniquePaneBlock(id, clientId, rootID)) {
        const newPaneCount = accordionBlock[0].attributes.paneCount + 1;
        setAttributes({
          id: newPaneCount
        });
        addUniquePane(newPaneCount, clientId, rootID);
        updatePaneCount(newPaneCount);
      }
    } else {
      addUniquePane(id, clientId, rootID);
    }
  }, []);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.useBlockProps)({
    className: `kt-accordion-pane kt-accordion-pane-${id} kt-pane${uniqueID}`
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Title Icon Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-pane-title-icon'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.IconControl, {
    value: icon,
    onChange: value => setAttributes({
      icon: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Icon Side', 'kadence-blocks'),
    value: iconSide,
    options: [{
      value: 'right',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Right', 'kadence-blocks')
    }, {
      value: 'left',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Left', 'kadence-blocks')
    }],
    onChange: value => setAttributes({
      iconSide: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Show only Icon', 'kadence-blocks'),
    checked: hideLabel,
    onChange: value => setAttributes({
      hideLabel: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Button Label Attribute for Accessibility', 'kadence-blocks'),
    value: ariaLabel,
    onChange: value => setAttributes({
      ariaLabel: value
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(HtmlTagOut, {
    className: 'kt-accordion-header-wrap'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `kt-blocks-accordion-header kt-acccordion-button-label-${hideLabel ? 'hide' : 'show'}`
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "kt-blocks-accordion-title-wrap"
  }, icon && 'left' === iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.IconRender, {
    className: `kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`,
    name: icon
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.RichText, {
    className: "kt-blocks-accordion-title",
    tagName: 'div',
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add Title', 'kadence-blocks'),
    onChange: value => setAttributes({
      title: value
    }),
    value: title,
    keepPlaceholderOnFocus: true
  }), icon && 'right' === iconSide && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.IconRender, {
    className: `kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`,
    name: icon
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "kt-blocks-accordion-icon-trigger"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: 'kt-accordion-panel'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: 'kt-accordion-panel-inner'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.InnerBlocks, {
    templateLock: false
  }))));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PaneEdit);

/***/ }),

/***/ "./src/blocks/accordion/save.js":
/*!**************************************!*\
  !*** ./src/blocks/accordion/save.js ***!
  \**************************************/
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
 * BLOCK: Kadence Accordion
 */



function KadenceAccordionSave(_ref) {
  let {
    attributes
  } = _ref;
  const {
    uniqueID,
    paneCount,
    blockAlignment,
    maxWidth,
    titleAlignment,
    startCollapsed,
    linkPaneCollapse,
    showIcon,
    iconStyle,
    iconSide,
    openPane
  } = attributes;
  const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(`align${blockAlignment ? blockAlignment : 'none'}`);
  const innerClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(`kt-accordion-wrap kt-accordion-wrap kt-accordion-id${uniqueID} kt-accordion-has-${paneCount}-panes kt-active-pane-${openPane} kt-accordion-block kt-pane-header-alignment-${titleAlignment} kt-accodion-icon-style-${iconStyle && showIcon ? iconStyle : 'none'} kt-accodion-icon-side-${iconSide ? iconSide : 'right'}`);
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: classes
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: innerClasses,
    style: {
      maxWidth: maxWidth ? maxWidth + 'px' : 'none'
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "kt-accordion-inner-wrap",
    "data-allow-multiple-open": !linkPaneCollapse ? 'true' : 'false',
    "data-start-open": !startCollapsed ? openPane : 'none'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null))));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KadenceAccordionSave);

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

/***/ "./src/blocks/accordion/block.json":
/*!*****************************************!*\
  !*** ./src/blocks/accordion/block.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Accordion","name":"kadence/accordion","category":"kadence-blocks","attributes":{"uniqueID":{"type":"string","default":""},"paneCount":{"type":"number","default":2},"showPresets":{"type":"bool","default":true},"openPane":{"type":"number","default":0},"startCollapsed":{"type":"bool","default":false},"linkPaneCollapse":{"type":"bool","default":true},"minHeight":{"type":"number","default":""},"maxWidth":{"type":"number","default":""},"contentBgColor":{"type":"string","default":""},"contentBorderColor":{"type":"string","default":"#eeeeee"},"contentBorder":{"type":"array","default":[0,1,1,1]},"contentBorderRadius":{"type":"array","default":[0,0,0,0]},"contentPadding":{"type":"array","default":[20,20,20,20]},"contentTabletPadding":{"type":"array","default":["","","",""]},"contentMobilePadding":{"type":"array","default":["","","",""]},"contentPaddingType":{"type":"string","default":"px"},"titleAlignment":{"type":"string","default":"left"},"blockAlignment":{"type":"string","default":"none"},"titleStyles":{"type":"array","default":[{"size":[18,"",""],"sizeType":"px","lineHeight":[24,"",""],"lineType":"px","letterSpacing":"","family":"","google":"","style":"","weight":"","variant":"","subset":"","loadGoogle":true,"padding":[10,14,10,14],"marginTop":8,"color":"#555555","background":"#f2f2f2","border":["#555555","#555555","#555555","#555555"],"borderRadius":[0,0,0,0],"borderWidth":[0,0,0,0],"colorHover":"#444444","backgroundHover":"#eeeeee","borderHover":["#eeeeee","#eeeeee","#eeeeee","#eeeeee"],"colorActive":"#ffffff","backgroundActive":"#444444","borderActive":["#444444","#444444","#444444","#444444"],"textTransform":"","paddingTablet":["","","",""],"paddingMobile":["","","",""],"paddingType":"px"}]},"showIcon":{"type":"bool","default":true},"iconStyle":{"type":"string","default":"basic"},"iconColor":{"type":"object","default":{"standard":"","active":"","hover":""}},"iconSide":{"type":"string","default":"right"},"faqSchema":{"type":"bool","default":false}},"supports":{"anchor":true},"providesContext":{"kadence/accordion-icon-color":"iconColor"}}');

/***/ }),

/***/ "./src/blocks/accordion/pane/block.json":
/*!**********************************************!*\
  !*** ./src/blocks/accordion/pane/block.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Pane","category":"kadence-blocks","parent":["kadence/accordion"],"attributes":{"id":{"type":"number","default":1},"title":{"type":"array","source":"children","selector":".kt-blocks-accordion-title","default":""},"titleTag":{"type":"string","default":"div"},"hideLabel":{"type":"bool","default":false},"ariaLabel":{"type":"string","default":""},"icon":{"type":"string","default":""},"iconSide":{"type":"string","default":"right"},"uniqueID":{"type":"string","default":""},"faqSchema":{"type":"bool","default":false}},"supports":{"inserter":false,"reusable":false,"html":false,"anchor":true,"lock":false}}');

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
/******/ 			"blocks-accordion": 0,
/******/ 			"./style-blocks-accordion": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-blocks-accordion"], () => (__webpack_require__("./src/blocks/accordion/block.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	(this.kadence = this.kadence || {})["blocks-accordion"] = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=blocks-accordion.js.map