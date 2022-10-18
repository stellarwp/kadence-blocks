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
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var progressbar_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! progressbar.js */ "./node_modules/progressbar.js/src/main.js");
/* harmony import */ var progressbar_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(progressbar_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_11__);


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

  /*These are all the variables we have defined in block.json*/
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
    borderColor,
    borderOpacity,
    barType,
    containerMaxWidth,
    tabletContainerMaxWidth,
    mobileContainerMaxWidth,
    containerMaxWidthUnits,
    displayLabel,
    labelFont,
    labelMinHeight,
    label,
    labelAlign,
    labelPosition,
    progressAmount,
    duration,
    progressWidth,
    progressWidthTablet,
    progressWidthMobile,
    progressWidthType
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
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useSelect)(select => {
    return {
      isUniqueID: value => select('kadenceblocks/data').isUniqueID(value),
      isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
      previewDevice: select('kadenceblocks/data').getPreviewDeviceType()
    };
  }, [clientId]);
  /*These const are for the responsive settings, so that we give the correct rpview based on the display type*/

  const previewMarginTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== marginDesktop ? marginDesktop[0] : '', undefined !== marginTablet ? marginTablet[0] : '', undefined !== marginMobile ? marginMobile[0] : '');
  const previewMarginRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== marginDesktop ? marginDesktop[1] : '', undefined !== marginTablet ? marginTablet[1] : '', undefined !== marginMobile ? marginMobile[1] : '');
  const previewMarginBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== marginDesktop ? marginDesktop[2] : '', undefined !== marginTablet ? marginTablet[2] : '', undefined !== marginMobile ? marginMobile[2] : '');
  const previewMarginLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== marginDesktop ? marginDesktop[3] : '', undefined !== marginTablet ? marginTablet[3] : '', undefined !== marginMobile ? marginMobile[3] : '');
  const previewPaddingTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== paddingDesktop ? paddingDesktop[0] : '', undefined !== paddingTablet ? paddingTablet[0] : '', undefined !== paddingMobile ? paddingMobile[0] : '');
  const previewPaddingRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== paddingDesktop ? paddingDesktop[1] : '', undefined !== paddingTablet ? paddingTablet[1] : '', undefined !== paddingMobile ? paddingMobile[1] : '');
  const previewPaddingBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== paddingDesktop ? paddingDesktop[2] : '', undefined !== paddingTablet ? paddingTablet[2] : '', undefined !== paddingMobile ? paddingMobile[2] : '');
  const previewPaddingLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== paddingDesktop ? paddingDesktop[3] : '', undefined !== paddingTablet ? paddingTablet[3] : '', undefined !== paddingMobile ? paddingMobile[3] : '');
  const previewProgressWidth = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== progressWidth ? progressWidth : '', undefined !== progressWidthTablet ? progressWidthTablet : '', undefined !== progressWidthMobile ? progressWidthMobile : '');
  const previewContainerMaxWidth = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== containerMaxWidth ? containerMaxWidth : '', undefined !== tabletContainerMaxWidth ? tabletContainerMaxWidth : '', undefined !== mobileContainerMaxWidth ? mobileContainerMaxWidth : '');
  const previewLabelFont = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== labelFont.size && undefined !== labelFont.size[0] && '' !== labelFont.size[0] ? labelFont.size[0] : '', undefined !== labelFont.size && undefined !== labelFont.size[1] && '' !== labelFont.size[1] ? labelFont.size[1] : '', undefined !== labelFont.size && undefined !== labelFont.size[2] && '' !== labelFont.size[2] ? labelFont.size[2] : '');
  const previewLabelLineHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== labelFont.lineHeight && undefined !== labelFont.lineHeight[0] && '' !== labelFont.lineHeight[0] ? labelFont.lineHeight[0] : '', undefined !== labelFont.lineHeight && undefined !== labelFont.lineHeight[1] && '' !== labelFont.lineHeight[1] ? labelFont.lineHeight[1] : '', undefined !== labelFont.lineHeight && undefined !== labelFont.lineHeight[2] && '' !== labelFont.lineHeight[2] ? labelFont.lineHeight[2] : '');
  const previewLabelMinHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== labelMinHeight && undefined !== labelMinHeight[0] ? labelMinHeight[0] : '', undefined !== labelMinHeight && undefined !== labelMinHeight[1] ? labelMinHeight[1] : '', undefined !== labelMinHeight && undefined !== labelMinHeight[2] ? labelMinHeight[2] : '');
  const previewLabelAlign = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.getPreviewSize)(previewDevice, undefined !== labelAlign[0] ? labelAlign[0] : '', undefined !== labelAlign[1] ? labelAlign[1] : '', undefined !== labelAlign[2] ? labelAlign[2] : '');
  const [marginControl, setMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('individual');
  const [paddingControl, setPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('individual');
  const [borderControl, setBorderControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('individual');
  const classes = classnames__WEBPACK_IMPORTED_MODULE_11___default()(className, {
    [`kt-block-template${uniqueID}`]: uniqueID
  });
  const containerClasses = classnames__WEBPACK_IMPORTED_MODULE_11___default()({
    'kb-block-progress-container': true,
    [`kb-block-progress-container${uniqueID}`]: true
  });
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__.useBlockProps)({
    className: classes
  });
  const layoutPresetOptions = [{
    key: 'line',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Line', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_4__.lineBar
  }, {
    key: 'circle',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Circle', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_4__.circleBar
  }, {
    key: 'semicircle',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Semicircle', 'kadence-blocks'),
    icon: _kadence_icons__WEBPACK_IMPORTED_MODULE_4__.semiCircleBar
  }];
  const [animate, setAnimate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0.0);
  const container = document.createElement('div');

  const ProgressLine = _ref2 => {
    let {
      animate
    } = _ref2;
    const line = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => new progressbar_js__WEBPACK_IMPORTED_MODULE_10__.Line(container, {
      color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(borderColor, borderOpacity),
      strokeWidth: previewProgressWidth,
      duration: duration * 1000,
      trailWidth: 3,
      trailColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(barBackground, barBackgroundOpacity)
    }), []);
    const node = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(node => {
      if (node) {
        node.appendChild(container);
      }
    }, []);
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
      line.animate(animate);
    }, [animate, line]);
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ref: node
    });
  };

  const ProgressCircle = _ref3 => {
    let {
      animate
    } = _ref3;
    const circle = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => new progressbar_js__WEBPACK_IMPORTED_MODULE_10__.Circle(container, {
      color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(borderColor, borderOpacity),
      strokeWidth: previewProgressWidth,
      duration: duration * 1000,
      trailWidth: 3,
      trailColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(barBackground, barBackgroundOpacity)
    }), []);
    const node = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(node => {
      if (node) {
        node.appendChild(container);
      }
    }, []);
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
      circle.animate(animate);
    }, [animate, circle]);
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ref: node
    });
  };

  const ProgressSemicircle = _ref4 => {
    let {
      animate
    } = _ref4;
    const semicircle = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => new progressbar_js__WEBPACK_IMPORTED_MODULE_10__.SemiCircle(container, {
      color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(borderColor, borderOpacity),
      strokeWidth: previewProgressWidth,
      duration: 1200,
      trailWidth: 3,
      trailColor: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(barBackground, barBackgroundOpacity)
    }), []);
    const node = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(node => {
      if (node) {
        node.appendChild(container);
      }
    }, []);
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
      semicircle.animate(animate);
    }, [animate, semicircle]);
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ref: node
    });
  };

  const saveLabelFont = value => {
    setAttributes({
      labelFont: { ...labelFont,
        ...value
      }
    });
  };

  const [labelPaddingControl, setLabelPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('linked');
  const [labelMarginControl, setLabelMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('individual');

  const ProgressBarLabel = () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kt-progress-label-wrap",
      style: {
        minHeight: previewLabelMinHeight ? previewLabelMinHeight + 'px' : undefined
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__.RichText, {
      tagName: 'h' + labelFont.level,
      value: label,
      onChange: value => {
        setAttributes({
          label: value
        });
      },
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Progress', 'kadence-blocks'),
      style: {
        textAlign: previewLabelAlign,
        fontWeight: labelFont.weight,
        fontStyle: labelFont.style,
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_3__.KadenceColorOutput)(labelFont.color),
        fontSize: previewLabelFont ? previewLabelFont + labelFont.sizeType : undefined,
        lineHeight: previewLabelLineHeight ? previewLabelLineHeight + labelFont.lineType : undefined,
        letterSpacing: labelFont.letterSpacing + 'px',
        textTransform: labelFont.textTransform ? labelFont.textTransform : undefined,
        fontFamily: labelFont.family ? labelFont.family : '',
        padding: labelFont.padding ? labelFont.padding[0] + 'px ' + labelFont.padding[1] + 'px ' + labelFont.padding[2] + 'px ' + labelFont.padding[3] + 'px' : '',
        margin: labelFont.margin ? labelFont.margin[0] + 'px ' + labelFont.margin[1] + 'px ' + labelFont.margin[2] + 'px ' + labelFont.margin[3] + 'px' : ''
      },
      className: 'kt-progress-label'
    }));
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__.BlockControls, {
    group: "block"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__.BlockAlignmentControl, {
    value: align,
    onChange: value => setAttributes({
      align: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Progress Bar Layout', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.ButtonGroup, {
    className: "kt-style-btn-group kb-info-layouts",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Progress Bar Layout', 'kadence-blocks')
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_8__.map)(layoutPresetOptions, _ref5 => {
    let {
      name,
      key,
      icon
    } = _ref5;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
      key: key,
      className: "kt-style-btn",
      isSmall: true,
      isPrimary: false,
      "aria-pressed": false,
      onClick: () => setAttributes({
        barType: key
      })
    }, icon);
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Size Controls', 'kadence-blocks'),
    initialOpen: false
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_2__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Padding', 'kadence-blocks'),
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
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Margin', 'kadence-blocks'),
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
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_2__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Max-width', 'kadence-blocks'),
    value: containerMaxWidth,
    onChange: value => setAttributes({
      containerMaxWidth: value
    }),
    tabletValue: tabletContainerMaxWidth ? tabletContainerMaxWidth : '',
    onChangeTablet: value => setAttributes({
      tabletContainerMaxWidth: value
    }),
    mobileValue: mobileContainerMaxWidth ? mobileContainerMaxWidth : '',
    onChangeMobile: value => setAttributes({
      mobileContainerMaxWidth: value
    }),
    min: 0,
    max: containerMaxWidthUnits == 'px' ? 3000 : 100,
    step: 1,
    unit: containerMaxWidthUnits,
    onUnit: value => setAttributes({
      containerMaxWidthUnits: value
    }),
    reset: () => setAttributes({
      containerMaxWidth: 200,
      tabletContainerMaxWidth: '',
      mobileContainerMaxWidth: ''
    }),
    units: ['px', 'vh', '%']
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Progress Bar Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonials-bar-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_2__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Progress Background', 'kadence-blocks'),
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
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Progress Color', 'kadence-blocks'),
    colorValue: borderColor ? borderColor : '#4A5568',
    colorDefault: '#4A5568',
    opacityValue: borderOpacity,
    onColorChange: value => setAttributes({
      borderColor: value
    }),
    onOpacityChange: value => setAttributes({
      borderOpacity: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_2__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Progress Width', 'kadence-blocks'),
    value: progressWidth,
    tabletValue: progressWidthTablet,
    mobileValue: progressWidthMobile,
    onChange: value => {
      setAttributes({
        progressWidth: value
      });
    },
    onChangeTablet: value => {
      setAttributes({
        progressWidthTablet: value
      });
    },
    onChangeMobile: value => {
      setAttributes({
        progressWidthMobile: value
      });
    },
    allowEmpty: true,
    min: 0,
    max: 50,
    step: 1,
    unit: progressWidthType,
    units: ['%'],
    onUnit: value => setAttributes({
      progressWidthType: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Progress Range', 'kadence-blocks'),
    value: progressAmount,
    onChange: value => setAttributes({
      progressAmount: value
    }),
    min: 1,
    max: 100,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Animation Duration', 'kadence-blocks'),
    value: duration,
    onChange: value => setAttributes({
      duration: value
    }),
    min: 0.1,
    max: 25,
    step: 0.1
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Label Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-testimonials-title-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Show Label', 'kadence-blocks'),
    checked: displayLabel,
    onChange: value => setAttributes({
      displayLabel: value
    })
  }), displayLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_9__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Label Position', 'kadence-blocks'),
    options: [{
      value: 'above',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Above', 'kadence-blocks')
    }, {
      value: 'below',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Below', 'kadence-blocks')
    }],
    value: labelPosition,
    onChange: value => setAttributes({
      labelPosition: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_2__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Color Settings', 'kadence-blocks'),
    value: labelFont.color ? labelFont.color : '',
    default: '',
    onChange: value => saveLabelFont({
      color: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_2__.ResponsiveAlignControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Text Alignment', 'kadence-blocks'),
    value: labelAlign && labelAlign[0] ? labelAlign[0] : '',
    mobileValue: labelAlign && labelAlign[2] ? labelAlign[2] : '',
    tabletValue: labelAlign && labelAlign[1] ? labelAlign[1] : '',
    onChange: nextAlign => setAttributes({
      labelAlign: [nextAlign, labelAlign && labelAlign[1] ? labelAlign[1] : '', labelAlign && labelAlign[2] ? labelAlign[2] : '']
    }),
    onChangeTablet: nextAlign => setAttributes({
      labelAlign: [labelAlign && labelAlign[0] ? labelAlign[0] : '', nextAlign, labelAlign && labelAlign[2] ? labelAlign[2] : '']
    }),
    onChangeMobile: nextAlign => setAttributes({
      labelAlign: [labelAlign && labelAlign[0] ? labelAlign[0] : '', labelAlign && labelAlign[1] ? labelAlign[1] : '', nextAlign]
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_2__.TypographyControls, {
    fontGroup: 'heading',
    tagLevel: labelFont.level,
    tagLowLevel: 2,
    onTagLevel: value => saveLabelFont({
      level: value
    }),
    fontSize: labelFont.size,
    onFontSize: value => saveLabelFont({
      size: value
    }),
    fontSizeType: labelFont.sizeType,
    onFontSizeType: value => saveLabelFont({
      sizeType: value
    }),
    lineHeight: labelFont.lineHeight,
    onLineHeight: value => saveLabelFont({
      lineHeight: value
    }),
    lineHeightType: labelFont.lineType,
    onLineHeightType: value => saveLabelFont({
      lineType: value
    }),
    letterSpacing: labelFont.letterSpacing,
    onLetterSpacing: value => saveLabelFont({
      letterSpacing: value
    }),
    textTransform: labelFont.textTransform,
    onTextTransform: value => saveLabelFont({
      textTransform: value
    }),
    fontFamily: labelFont.family,
    onFontFamily: value => saveLabelFont({
      family: value
    }),
    onFontChange: select => {
      saveLabelFont({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => saveLabelFont(values),
    googleFont: labelFont.google,
    onGoogleFont: value => saveLabelFont({
      google: value
    }),
    loadGoogleFont: labelFont.loadGoogle,
    onLoadGoogleFont: value => saveLabelFont({
      loadGoogle: value
    }),
    fontVariant: labelFont.variant,
    onFontVariant: value => saveLabelFont({
      variant: value
    }),
    fontWeight: labelFont.weight,
    onFontWeight: value => saveLabelFont({
      weight: value
    }),
    fontStyle: labelFont.style,
    onFontStyle: value => saveLabelFont({
      style: value
    }),
    fontSubset: labelFont.subset,
    onFontSubset: value => saveLabelFont({
      subset: value
    }),
    padding: labelFont.padding,
    onPadding: value => saveLabelFont({
      padding: value
    }),
    paddingControl: labelPaddingControl,
    onPaddingControl: value => setLabelPaddingControl(value),
    margin: labelFont.margin,
    onMargin: value => saveLabelFont({
      margin: value
    }),
    marginControl: labelMarginControl,
    onMarginControl: value => setLabelMarginControl(value)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_2__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Label Min Height', 'kadence-blocks'),
    value: labelMinHeight && undefined !== labelMinHeight[0] ? labelMinHeight[0] : '',
    onChange: value => setAttributes({
      labelMinHeight: [value, labelMinHeight && undefined !== labelMinHeight[1] ? labelMinHeight[1] : '', labelMinHeight && undefined !== labelMinHeight[2] ? labelMinHeight[2] : '']
    }),
    tabletValue: labelMinHeight && undefined !== labelMinHeight[1] ? labelMinHeight[1] : '',
    onChangeTablet: value => setAttributes({
      labelMinHeight: [labelMinHeight && undefined !== labelMinHeight[0] ? labelMinHeight[0] : '', value, labelMinHeight && undefined !== labelMinHeight[2] ? labelMinHeight[2] : '']
    }),
    mobileValue: labelMinHeight && undefined !== labelMinHeight[2] ? labelMinHeight[2] : '',
    onChangeMobile: value => setAttributes({
      labelMinHeight: [labelMinHeight && undefined !== labelMinHeight[0] ? labelMinHeight[0] : '', labelMinHeight && undefined !== labelMinHeight[1] ? labelMinHeight[1] : '', value]
    }),
    min: 0,
    max: 200,
    step: 1,
    unit: 'px',
    showUnit: true,
    units: ['px']
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: containerClasses,
    style: {
      marginTop: '' !== previewMarginTop ? previewMarginTop + marginUnit : undefined,
      marginRight: '' !== previewMarginRight ? previewMarginRight + marginUnit : undefined,
      marginBottom: '' !== previewMarginBottom ? previewMarginBottom + marginUnit : undefined,
      marginLeft: '' !== previewMarginLeft ? previewMarginLeft + marginUnit : undefined,
      paddingTop: '' !== previewPaddingTop ? previewPaddingTop + paddingUnit : undefined,
      paddingRight: '' !== previewPaddingRight ? previewPaddingRight + paddingUnit : undefined,
      paddingBottom: '' !== previewPaddingBottom ? previewPaddingBottom + paddingUnit : undefined,
      paddingLeft: '' !== previewPaddingLeft ? previewPaddingLeft + paddingUnit : undefined,
      maxWidth: '' !== previewContainerMaxWidth ? previewContainerMaxWidth + containerMaxWidthUnits : undefined
    }
  }, displayLabel && labelPosition === 'above' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ProgressBarLabel, null), barType === "line" && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "line-bars"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ProgressLine, {
    animate: progressAmount / 100
  })), barType === "circle" && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "circle-bars"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ProgressCircle, {
    animate: progressAmount / 100
  })), barType === "semicircle" && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "semicircle-bars"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ProgressSemicircle, {
    animate: progressAmount / 100
  })), displayLabel && labelPosition === 'below' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ProgressBarLabel, null)));
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

/***/ "./node_modules/progressbar.js/src/circle.js":
/*!***************************************************!*\
  !*** ./node_modules/progressbar.js/src/circle.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Circle shaped progress bar

var Shape = __webpack_require__(/*! ./shape */ "./node_modules/progressbar.js/src/shape.js");
var utils = __webpack_require__(/*! ./utils */ "./node_modules/progressbar.js/src/utils.js");

var Circle = function Circle(container, options) {
    // Use two arcs to form a circle
    // See this answer http://stackoverflow.com/a/10477334/1446092
    this._pathTemplate =
        'M 50,50 m 0,-{radius}' +
        ' a {radius},{radius} 0 1 1 0,{2radius}' +
        ' a {radius},{radius} 0 1 1 0,-{2radius}';

    this.containerAspectRatio = 1;

    Shape.apply(this, arguments);
};

Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;

Circle.prototype._pathString = function _pathString(opts) {
    var widthOfWider = opts.strokeWidth;
    if (opts.trailWidth && opts.trailWidth > opts.strokeWidth) {
        widthOfWider = opts.trailWidth;
    }

    var r = 50 - widthOfWider / 2;

    return utils.render(this._pathTemplate, {
        radius: r,
        '2radius': r * 2
    });
};

Circle.prototype._trailString = function _trailString(opts) {
    return this._pathString(opts);
};

module.exports = Circle;


/***/ }),

/***/ "./node_modules/progressbar.js/src/line.js":
/*!*************************************************!*\
  !*** ./node_modules/progressbar.js/src/line.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Line shaped progress bar

var Shape = __webpack_require__(/*! ./shape */ "./node_modules/progressbar.js/src/shape.js");
var utils = __webpack_require__(/*! ./utils */ "./node_modules/progressbar.js/src/utils.js");

var Line = function Line(container, options) {
    this._pathTemplate = 'M 0,{center} L 100,{center}';
    Shape.apply(this, arguments);
};

Line.prototype = new Shape();
Line.prototype.constructor = Line;

Line.prototype._initializeSvg = function _initializeSvg(svg, opts) {
    svg.setAttribute('viewBox', '0 0 100 ' + opts.strokeWidth);
    svg.setAttribute('preserveAspectRatio', 'none');
};

Line.prototype._pathString = function _pathString(opts) {
    return utils.render(this._pathTemplate, {
        center: opts.strokeWidth / 2
    });
};

Line.prototype._trailString = function _trailString(opts) {
    return this._pathString(opts);
};

module.exports = Line;


/***/ }),

/***/ "./node_modules/progressbar.js/src/main.js":
/*!*************************************************!*\
  !*** ./node_modules/progressbar.js/src/main.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
    // Higher level API, different shaped progress bars
    Line: __webpack_require__(/*! ./line */ "./node_modules/progressbar.js/src/line.js"),
    Circle: __webpack_require__(/*! ./circle */ "./node_modules/progressbar.js/src/circle.js"),
    SemiCircle: __webpack_require__(/*! ./semicircle */ "./node_modules/progressbar.js/src/semicircle.js"),
    Square: __webpack_require__(/*! ./square */ "./node_modules/progressbar.js/src/square.js"),

    // Lower level API to use any SVG path
    Path: __webpack_require__(/*! ./path */ "./node_modules/progressbar.js/src/path.js"),

    // Base-class for creating new custom shapes
    // to be in line with the API of built-in shapes
    // Undocumented.
    Shape: __webpack_require__(/*! ./shape */ "./node_modules/progressbar.js/src/shape.js"),

    // Internal utils, undocumented.
    utils: __webpack_require__(/*! ./utils */ "./node_modules/progressbar.js/src/utils.js")
};


/***/ }),

/***/ "./node_modules/progressbar.js/src/path.js":
/*!*************************************************!*\
  !*** ./node_modules/progressbar.js/src/path.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Lower level API to animate any kind of svg path

var shifty = __webpack_require__(/*! shifty */ "./node_modules/shifty/dist/shifty.js");
var utils = __webpack_require__(/*! ./utils */ "./node_modules/progressbar.js/src/utils.js");

var Tweenable = shifty.Tweenable;

var EASING_ALIASES = {
    easeIn: 'easeInCubic',
    easeOut: 'easeOutCubic',
    easeInOut: 'easeInOutCubic'
};

var Path = function Path(path, opts) {
    // Throw a better error if not initialized with `new` keyword
    if (!(this instanceof Path)) {
        throw new Error('Constructor was called without new keyword');
    }

    // Default parameters for animation
    opts = utils.extend({
        delay: 0,
        duration: 800,
        easing: 'linear',
        from: {},
        to: {},
        step: function() {}
    }, opts);

    var element;
    if (utils.isString(path)) {
        element = document.querySelector(path);
    } else {
        element = path;
    }

    // Reveal .path as public attribute
    this.path = element;
    this._opts = opts;
    this._tweenable = null;

    // Set up the starting positions
    var length = this.path.getTotalLength();
    this.path.style.strokeDasharray = length + ' ' + length;
    this.set(0);
};

Path.prototype.value = function value() {
    var offset = this._getComputedDashOffset();
    var length = this.path.getTotalLength();

    var progress = 1 - offset / length;
    // Round number to prevent returning very small number like 1e-30, which
    // is practically 0
    return parseFloat(progress.toFixed(6), 10);
};

Path.prototype.set = function set(progress) {
    this.stop();

    this.path.style.strokeDashoffset = this._progressToOffset(progress);

    var step = this._opts.step;
    if (utils.isFunction(step)) {
        var easing = this._easing(this._opts.easing);
        var values = this._calculateTo(progress, easing);
        var reference = this._opts.shape || this;
        step(values, reference, this._opts.attachment);
    }
};

Path.prototype.stop = function stop() {
    this._stopTween();
    this.path.style.strokeDashoffset = this._getComputedDashOffset();
};

// Method introduced here:
// http://jakearchibald.com/2013/animated-line-drawing-svg/
Path.prototype.animate = function animate(progress, opts, cb) {
    opts = opts || {};

    if (utils.isFunction(opts)) {
        cb = opts;
        opts = {};
    }

    var passedOpts = utils.extend({}, opts);

    // Copy default opts to new object so defaults are not modified
    var defaultOpts = utils.extend({}, this._opts);
    opts = utils.extend(defaultOpts, opts);

    var shiftyEasing = this._easing(opts.easing);
    var values = this._resolveFromAndTo(progress, shiftyEasing, passedOpts);

    this.stop();

    // Trigger a layout so styles are calculated & the browser
    // picks up the starting position before animating
    this.path.getBoundingClientRect();

    var offset = this._getComputedDashOffset();
    var newOffset = this._progressToOffset(progress);

    var self = this;
    this._tweenable = new Tweenable();
    this._tweenable.tween({
        from: utils.extend({ offset: offset }, values.from),
        to: utils.extend({ offset: newOffset }, values.to),
        duration: opts.duration,
        delay: opts.delay,
        easing: shiftyEasing,
        step: function(state) {
            self.path.style.strokeDashoffset = state.offset;
            var reference = opts.shape || self;
            opts.step(state, reference, opts.attachment);
        }
    }).then(function(state) {
        if (utils.isFunction(cb)) {
            cb();
        }
    });
};

Path.prototype._getComputedDashOffset = function _getComputedDashOffset() {
    var computedStyle = window.getComputedStyle(this.path, null);
    return parseFloat(computedStyle.getPropertyValue('stroke-dashoffset'), 10);
};

Path.prototype._progressToOffset = function _progressToOffset(progress) {
    var length = this.path.getTotalLength();
    return length - progress * length;
};

// Resolves from and to values for animation.
Path.prototype._resolveFromAndTo = function _resolveFromAndTo(progress, easing, opts) {
    if (opts.from && opts.to) {
        return {
            from: opts.from,
            to: opts.to
        };
    }

    return {
        from: this._calculateFrom(easing),
        to: this._calculateTo(progress, easing)
    };
};

// Calculate `from` values from options passed at initialization
Path.prototype._calculateFrom = function _calculateFrom(easing) {
    return shifty.interpolate(this._opts.from, this._opts.to, this.value(), easing);
};

// Calculate `to` values from options passed at initialization
Path.prototype._calculateTo = function _calculateTo(progress, easing) {
    return shifty.interpolate(this._opts.from, this._opts.to, progress, easing);
};

Path.prototype._stopTween = function _stopTween() {
    if (this._tweenable !== null) {
        this._tweenable.stop();
        this._tweenable = null;
    }
};

Path.prototype._easing = function _easing(easing) {
    if (EASING_ALIASES.hasOwnProperty(easing)) {
        return EASING_ALIASES[easing];
    }

    return easing;
};

module.exports = Path;


/***/ }),

/***/ "./node_modules/progressbar.js/src/semicircle.js":
/*!*******************************************************!*\
  !*** ./node_modules/progressbar.js/src/semicircle.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Semi-SemiCircle shaped progress bar

var Shape = __webpack_require__(/*! ./shape */ "./node_modules/progressbar.js/src/shape.js");
var Circle = __webpack_require__(/*! ./circle */ "./node_modules/progressbar.js/src/circle.js");
var utils = __webpack_require__(/*! ./utils */ "./node_modules/progressbar.js/src/utils.js");

var SemiCircle = function SemiCircle(container, options) {
    // Use one arc to form a SemiCircle
    // See this answer http://stackoverflow.com/a/10477334/1446092
    this._pathTemplate =
        'M 50,50 m -{radius},0' +
        ' a {radius},{radius} 0 1 1 {2radius},0';

    this.containerAspectRatio = 2;

    Shape.apply(this, arguments);
};

SemiCircle.prototype = new Shape();
SemiCircle.prototype.constructor = SemiCircle;

SemiCircle.prototype._initializeSvg = function _initializeSvg(svg, opts) {
    svg.setAttribute('viewBox', '0 0 100 50');
};

SemiCircle.prototype._initializeTextContainer = function _initializeTextContainer(
    opts,
    container,
    textContainer
) {
    if (opts.text.style) {
        // Reset top style
        textContainer.style.top = 'auto';
        textContainer.style.bottom = '0';

        if (opts.text.alignToBottom) {
            utils.setStyle(textContainer, 'transform', 'translate(-50%, 0)');
        } else {
            utils.setStyle(textContainer, 'transform', 'translate(-50%, 50%)');
        }
    }
};

// Share functionality with Circle, just have different path
SemiCircle.prototype._pathString = Circle.prototype._pathString;
SemiCircle.prototype._trailString = Circle.prototype._trailString;

module.exports = SemiCircle;


/***/ }),

/***/ "./node_modules/progressbar.js/src/shape.js":
/*!**************************************************!*\
  !*** ./node_modules/progressbar.js/src/shape.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Base object for different progress bar shapes

var Path = __webpack_require__(/*! ./path */ "./node_modules/progressbar.js/src/path.js");
var utils = __webpack_require__(/*! ./utils */ "./node_modules/progressbar.js/src/utils.js");

var DESTROYED_ERROR = 'Object is destroyed';

var Shape = function Shape(container, opts) {
    // Throw a better error if progress bars are not initialized with `new`
    // keyword
    if (!(this instanceof Shape)) {
        throw new Error('Constructor was called without new keyword');
    }

    // Prevent calling constructor without parameters so inheritance
    // works correctly. To understand, this is how Shape is inherited:
    //
    //   Line.prototype = new Shape();
    //
    // We just want to set the prototype for Line.
    if (arguments.length === 0) {
        return;
    }

    // Default parameters for progress bar creation
    this._opts = utils.extend({
        color: '#555',
        strokeWidth: 1.0,
        trailColor: null,
        trailWidth: null,
        fill: null,
        text: {
            style: {
                color: null,
                position: 'absolute',
                left: '50%',
                top: '50%',
                padding: 0,
                margin: 0,
                transform: {
                    prefix: true,
                    value: 'translate(-50%, -50%)'
                }
            },
            autoStyleContainer: true,
            alignToBottom: true,
            value: null,
            className: 'progressbar-text'
        },
        svgStyle: {
            display: 'block',
            width: '100%'
        },
        warnings: false
    }, opts, true);  // Use recursive extend

    // If user specifies e.g. svgStyle or text style, the whole object
    // should replace the defaults to make working with styles easier
    if (utils.isObject(opts) && opts.svgStyle !== undefined) {
        this._opts.svgStyle = opts.svgStyle;
    }
    if (utils.isObject(opts) && utils.isObject(opts.text) && opts.text.style !== undefined) {
        this._opts.text.style = opts.text.style;
    }

    var svgView = this._createSvgView(this._opts);

    var element;
    if (utils.isString(container)) {
        element = document.querySelector(container);
    } else {
        element = container;
    }

    if (!element) {
        throw new Error('Container does not exist: ' + container);
    }

    this._container = element;
    this._container.appendChild(svgView.svg);
    if (this._opts.warnings) {
        this._warnContainerAspectRatio(this._container);
    }

    if (this._opts.svgStyle) {
        utils.setStyles(svgView.svg, this._opts.svgStyle);
    }

    // Expose public attributes before Path initialization
    this.svg = svgView.svg;
    this.path = svgView.path;
    this.trail = svgView.trail;
    this.text = null;

    var newOpts = utils.extend({
        attachment: undefined,
        shape: this
    }, this._opts);
    this._progressPath = new Path(svgView.path, newOpts);

    if (utils.isObject(this._opts.text) && this._opts.text.value !== null) {
        this.setText(this._opts.text.value);
    }
};

Shape.prototype.animate = function animate(progress, opts, cb) {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    this._progressPath.animate(progress, opts, cb);
};

Shape.prototype.stop = function stop() {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    // Don't crash if stop is called inside step function
    if (this._progressPath === undefined) {
        return;
    }

    this._progressPath.stop();
};

Shape.prototype.pause = function pause() {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    if (this._progressPath === undefined) {
        return;
    }

    if (!this._progressPath._tweenable) {
        // It seems that we can't pause this
        return;
    }

    this._progressPath._tweenable.pause();
};

Shape.prototype.resume = function resume() {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    if (this._progressPath === undefined) {
        return;
    }

    if (!this._progressPath._tweenable) {
        // It seems that we can't resume this
        return;
    }

    this._progressPath._tweenable.resume();
};

Shape.prototype.destroy = function destroy() {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    this.stop();
    this.svg.parentNode.removeChild(this.svg);
    this.svg = null;
    this.path = null;
    this.trail = null;
    this._progressPath = null;

    if (this.text !== null) {
        this.text.parentNode.removeChild(this.text);
        this.text = null;
    }
};

Shape.prototype.set = function set(progress) {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    this._progressPath.set(progress);
};

Shape.prototype.value = function value() {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    if (this._progressPath === undefined) {
        return 0;
    }

    return this._progressPath.value();
};

Shape.prototype.setText = function setText(newText) {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    if (this.text === null) {
        // Create new text node
        this.text = this._createTextContainer(this._opts, this._container);
        this._container.appendChild(this.text);
    }

    // Remove previous text and add new
    if (utils.isObject(newText)) {
        utils.removeChildren(this.text);
        this.text.appendChild(newText);
    } else {
        this.text.innerHTML = newText;
    }
};

Shape.prototype._createSvgView = function _createSvgView(opts) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._initializeSvg(svg, opts);

    var trailPath = null;
    // Each option listed in the if condition are 'triggers' for creating
    // the trail path
    if (opts.trailColor || opts.trailWidth) {
        trailPath = this._createTrail(opts);
        svg.appendChild(trailPath);
    }

    var path = this._createPath(opts);
    svg.appendChild(path);

    return {
        svg: svg,
        path: path,
        trail: trailPath
    };
};

Shape.prototype._initializeSvg = function _initializeSvg(svg, opts) {
    svg.setAttribute('viewBox', '0 0 100 100');
};

Shape.prototype._createPath = function _createPath(opts) {
    var pathString = this._pathString(opts);
    return this._createPathElement(pathString, opts);
};

Shape.prototype._createTrail = function _createTrail(opts) {
    // Create path string with original passed options
    var pathString = this._trailString(opts);

    // Prevent modifying original
    var newOpts = utils.extend({}, opts);

    // Defaults for parameters which modify trail path
    if (!newOpts.trailColor) {
        newOpts.trailColor = '#eee';
    }
    if (!newOpts.trailWidth) {
        newOpts.trailWidth = newOpts.strokeWidth;
    }

    newOpts.color = newOpts.trailColor;
    newOpts.strokeWidth = newOpts.trailWidth;

    // When trail path is set, fill must be set for it instead of the
    // actual path to prevent trail stroke from clipping
    newOpts.fill = null;

    return this._createPathElement(pathString, newOpts);
};

Shape.prototype._createPathElement = function _createPathElement(pathString, opts) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathString);
    path.setAttribute('stroke', opts.color);
    path.setAttribute('stroke-width', opts.strokeWidth);

    if (opts.fill) {
        path.setAttribute('fill', opts.fill);
    } else {
        path.setAttribute('fill-opacity', '0');
    }

    return path;
};

Shape.prototype._createTextContainer = function _createTextContainer(opts, container) {
    var textContainer = document.createElement('div');
    textContainer.className = opts.text.className;

    var textStyle = opts.text.style;
    if (textStyle) {
        if (opts.text.autoStyleContainer) {
            container.style.position = 'relative';
        }

        utils.setStyles(textContainer, textStyle);
        // Default text color to progress bar's color
        if (!textStyle.color) {
            textContainer.style.color = opts.color;
        }
    }

    this._initializeTextContainer(opts, container, textContainer);
    return textContainer;
};

// Give custom shapes possibility to modify text element
Shape.prototype._initializeTextContainer = function(opts, container, element) {
    // By default, no-op
    // Custom shapes should respect API options, such as text.style
};

Shape.prototype._pathString = function _pathString(opts) {
    throw new Error('Override this function for each progress bar');
};

Shape.prototype._trailString = function _trailString(opts) {
    throw new Error('Override this function for each progress bar');
};

Shape.prototype._warnContainerAspectRatio = function _warnContainerAspectRatio(container) {
    if (!this.containerAspectRatio) {
        return;
    }

    var computedStyle = window.getComputedStyle(container, null);
    var width = parseFloat(computedStyle.getPropertyValue('width'), 10);
    var height = parseFloat(computedStyle.getPropertyValue('height'), 10);
    if (!utils.floatEquals(this.containerAspectRatio, width / height)) {
        console.warn(
            'Incorrect aspect ratio of container',
            '#' + container.id,
            'detected:',
            computedStyle.getPropertyValue('width') + '(width)',
            '/',
            computedStyle.getPropertyValue('height') + '(height)',
            '=',
            width / height
        );

        console.warn(
            'Aspect ratio of should be',
            this.containerAspectRatio
        );
    }
};

module.exports = Shape;


/***/ }),

/***/ "./node_modules/progressbar.js/src/square.js":
/*!***************************************************!*\
  !*** ./node_modules/progressbar.js/src/square.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Square shaped progress bar
// Note: Square is not core part of API anymore. It's left here
//       for reference. square is not included to the progressbar
//       build anymore

var Shape = __webpack_require__(/*! ./shape */ "./node_modules/progressbar.js/src/shape.js");
var utils = __webpack_require__(/*! ./utils */ "./node_modules/progressbar.js/src/utils.js");

var Square = function Square(container, options) {
    this._pathTemplate =
        'M 0,{halfOfStrokeWidth}' +
        ' L {width},{halfOfStrokeWidth}' +
        ' L {width},{width}' +
        ' L {halfOfStrokeWidth},{width}' +
        ' L {halfOfStrokeWidth},{strokeWidth}';

    this._trailTemplate =
        'M {startMargin},{halfOfStrokeWidth}' +
        ' L {width},{halfOfStrokeWidth}' +
        ' L {width},{width}' +
        ' L {halfOfStrokeWidth},{width}' +
        ' L {halfOfStrokeWidth},{halfOfStrokeWidth}';

    Shape.apply(this, arguments);
};

Square.prototype = new Shape();
Square.prototype.constructor = Square;

Square.prototype._pathString = function _pathString(opts) {
    var w = 100 - opts.strokeWidth / 2;

    return utils.render(this._pathTemplate, {
        width: w,
        strokeWidth: opts.strokeWidth,
        halfOfStrokeWidth: opts.strokeWidth / 2
    });
};

Square.prototype._trailString = function _trailString(opts) {
    var w = 100 - opts.strokeWidth / 2;

    return utils.render(this._trailTemplate, {
        width: w,
        strokeWidth: opts.strokeWidth,
        halfOfStrokeWidth: opts.strokeWidth / 2,
        startMargin: opts.strokeWidth / 2 - opts.trailWidth / 2
    });
};

module.exports = Square;


/***/ }),

/***/ "./node_modules/progressbar.js/src/utils.js":
/*!**************************************************!*\
  !*** ./node_modules/progressbar.js/src/utils.js ***!
  \**************************************************/
/***/ ((module) => {

// Utility functions

var PREFIXES = 'Webkit Moz O ms'.split(' ');
var FLOAT_COMPARISON_EPSILON = 0.001;

// Copy all attributes from source object to destination object.
// destination object is mutated.
function extend(destination, source, recursive) {
    destination = destination || {};
    source = source || {};
    recursive = recursive || false;

    for (var attrName in source) {
        if (source.hasOwnProperty(attrName)) {
            var destVal = destination[attrName];
            var sourceVal = source[attrName];
            if (recursive && isObject(destVal) && isObject(sourceVal)) {
                destination[attrName] = extend(destVal, sourceVal, recursive);
            } else {
                destination[attrName] = sourceVal;
            }
        }
    }

    return destination;
}

// Renders templates with given variables. Variables must be surrounded with
// braces without any spaces, e.g. {variable}
// All instances of variable placeholders will be replaced with given content
// Example:
// render('Hello, {message}!', {message: 'world'})
function render(template, vars) {
    var rendered = template;

    for (var key in vars) {
        if (vars.hasOwnProperty(key)) {
            var val = vars[key];
            var regExpString = '\\{' + key + '\\}';
            var regExp = new RegExp(regExpString, 'g');

            rendered = rendered.replace(regExp, val);
        }
    }

    return rendered;
}

function setStyle(element, style, value) {
    var elStyle = element.style;  // cache for performance

    for (var i = 0; i < PREFIXES.length; ++i) {
        var prefix = PREFIXES[i];
        elStyle[prefix + capitalize(style)] = value;
    }

    elStyle[style] = value;
}

function setStyles(element, styles) {
    forEachObject(styles, function(styleValue, styleName) {
        // Allow disabling some individual styles by setting them
        // to null or undefined
        if (styleValue === null || styleValue === undefined) {
            return;
        }

        // If style's value is {prefix: true, value: '50%'},
        // Set also browser prefixed styles
        if (isObject(styleValue) && styleValue.prefix === true) {
            setStyle(element, styleName, styleValue.value);
        } else {
            element.style[styleName] = styleValue;
        }
    });
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function isString(obj) {
    return typeof obj === 'string' || obj instanceof String;
}

function isFunction(obj) {
    return typeof obj === 'function';
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

// Returns true if `obj` is object as in {a: 1, b: 2}, not if it's function or
// array
function isObject(obj) {
    if (isArray(obj)) {
        return false;
    }

    var type = typeof obj;
    return type === 'object' && !!obj;
}

function forEachObject(object, callback) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            var val = object[key];
            callback(val, key);
        }
    }
}

function floatEquals(a, b) {
    return Math.abs(a - b) < FLOAT_COMPARISON_EPSILON;
}

// https://coderwall.com/p/nygghw/don-t-use-innerhtml-to-empty-dom-elements
function removeChildren(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

module.exports = {
    extend: extend,
    render: render,
    setStyle: setStyle,
    setStyles: setStyles,
    capitalize: capitalize,
    isString: isString,
    isFunction: isFunction,
    isObject: isObject,
    forEachObject: forEachObject,
    floatEquals: floatEquals,
    removeChildren: removeChildren
};


/***/ }),

/***/ "./node_modules/shifty/dist/shifty.js":
/*!********************************************!*\
  !*** ./node_modules/shifty/dist/shifty.js ***!
  \********************************************/
/***/ ((module) => {

/*! For license information please see shifty.js.LICENSE.txt */
!function(t,n){ true?module.exports=n():0}(self,(function(){return function(){"use strict";var t={720:function(t,n,e){e.r(n),e.d(n,{Scene:function(){return Xt},Tweenable:function(){return _t},interpolate:function(){return Wt},processTweens:function(){return ft},setBezierFunction:function(){return Yt},tween:function(){return yt},unsetBezierFunction:function(){return Zt}});var r={};e.r(r),e.d(r,{bounce:function(){return D},bouncePast:function(){return q},easeFrom:function(){return B},easeFromTo:function(){return Q},easeInBack:function(){return E},easeInCirc:function(){return j},easeInCubic:function(){return c},easeInExpo:function(){return b},easeInOutBack:function(){return F},easeInOutCirc:function(){return P},easeInOutCubic:function(){return l},easeInOutExpo:function(){return S},easeInOutQuad:function(){return s},easeInOutQuart:function(){return v},easeInOutQuint:function(){return d},easeInOutSine:function(){return w},easeInQuad:function(){return o},easeInQuart:function(){return h},easeInQuint:function(){return _},easeInSine:function(){return g},easeOutBack:function(){return T},easeOutBounce:function(){return M},easeOutCirc:function(){return k},easeOutCubic:function(){return f},easeOutExpo:function(){return O},easeOutQuad:function(){return a},easeOutQuart:function(){return p},easeOutQuint:function(){return y},easeOutSine:function(){return m},easeTo:function(){return N},elastic:function(){return I},linear:function(){return u},swingFrom:function(){return A},swingFromTo:function(){return x},swingTo:function(){return C}});var i={};e.r(i),e.d(i,{afterTween:function(){return Nt},beforeTween:function(){return Bt},doesApply:function(){return qt},tweenCreated:function(){return Qt}});var u=function(t){return t},o=function(t){return Math.pow(t,2)},a=function(t){return-(Math.pow(t-1,2)-1)},s=function(t){return(t/=.5)<1?.5*Math.pow(t,2):-.5*((t-=2)*t-2)},c=function(t){return Math.pow(t,3)},f=function(t){return Math.pow(t-1,3)+1},l=function(t){return(t/=.5)<1?.5*Math.pow(t,3):.5*(Math.pow(t-2,3)+2)},h=function(t){return Math.pow(t,4)},p=function(t){return-(Math.pow(t-1,4)-1)},v=function(t){return(t/=.5)<1?.5*Math.pow(t,4):-.5*((t-=2)*Math.pow(t,3)-2)},_=function(t){return Math.pow(t,5)},y=function(t){return Math.pow(t-1,5)+1},d=function(t){return(t/=.5)<1?.5*Math.pow(t,5):.5*(Math.pow(t-2,5)+2)},g=function(t){return 1-Math.cos(t*(Math.PI/2))},m=function(t){return Math.sin(t*(Math.PI/2))},w=function(t){return-.5*(Math.cos(Math.PI*t)-1)},b=function(t){return 0===t?0:Math.pow(2,10*(t-1))},O=function(t){return 1===t?1:1-Math.pow(2,-10*t)},S=function(t){return 0===t?0:1===t?1:(t/=.5)<1?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*--t))},j=function(t){return-(Math.sqrt(1-t*t)-1)},k=function(t){return Math.sqrt(1-Math.pow(t-1,2))},P=function(t){return(t/=.5)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},M=function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},E=function(t){var n=1.70158;return t*t*((n+1)*t-n)},T=function(t){var n=1.70158;return(t-=1)*t*((n+1)*t+n)+1},F=function(t){var n=1.70158;return(t/=.5)<1?t*t*((1+(n*=1.525))*t-n)*.5:.5*((t-=2)*t*((1+(n*=1.525))*t+n)+2)},I=function(t){return-1*Math.pow(4,-8*t)*Math.sin((6*t-1)*(2*Math.PI)/2)+1},x=function(t){var n=1.70158;return(t/=.5)<1?t*t*((1+(n*=1.525))*t-n)*.5:.5*((t-=2)*t*((1+(n*=1.525))*t+n)+2)},A=function(t){var n=1.70158;return t*t*((n+1)*t-n)},C=function(t){var n=1.70158;return(t-=1)*t*((n+1)*t+n)+1},D=function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},q=function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?2-(7.5625*(t-=1.5/2.75)*t+.75):t<2.5/2.75?2-(7.5625*(t-=2.25/2.75)*t+.9375):2-(7.5625*(t-=2.625/2.75)*t+.984375)},Q=function(t){return(t/=.5)<1?.5*Math.pow(t,4):-.5*((t-=2)*Math.pow(t,3)-2)},B=function(t){return Math.pow(t,4)},N=function(t){return Math.pow(t,.25)};function R(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function z(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function L(t){return(L="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function U(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable}))),e.push.apply(e,r)}return e}function V(t){for(var n=1;n<arguments.length;n++){var e=null!=arguments[n]?arguments[n]:{};n%2?U(Object(e),!0).forEach((function(n){W(t,n,e[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):U(Object(e)).forEach((function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}))}return t}function W(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}var $,G,H,J="linear",K="undefined"!=typeof window?window:e.g,X="afterTween",Y="afterTweenEnd",Z="beforeTween",tt="tweenCreated",nt="function",et="string",rt=K.requestAnimationFrame||K.webkitRequestAnimationFrame||K.oRequestAnimationFrame||K.msRequestAnimationFrame||K.mozCancelRequestAnimationFrame&&K.mozRequestAnimationFrame||setTimeout,it=function(){},ut=null,ot=null,at=V({},r),st=function(t,n,e,r,i,u,o){var a,s,c,f=t<u?0:(t-u)/i,l=!1;for(var h in o&&o.call&&(l=!0,a=o(f)),n)l||(a=((s=o[h]).call?s:at[s])(f)),c=e[h],n[h]=c+(r[h]-c)*a;return n},ct=function(t,n){var e=t._timestamp,r=t._currentState,i=t._delay;if(!(n<e+i)){var u=t._duration,o=t._targetState,a=e+i+u,s=n>a?a:n;t._hasEnded=s>=a;var c=u-(a-s),f=t._filters.length>0;if(t._hasEnded)return t._render(o,t._data,c),t.stop(!0);f&&t._applyFilter(Z),s<e+i?e=u=s=1:e+=i,st(s,r,t._originalState,o,u,e,t._easing),f&&t._applyFilter(X),t._render(r,t._data,c)}},ft=function(){for(var t,n=_t.now(),e=ut;e;)t=e._next,ct(e,n),e=t},lt=Date.now||function(){return+new Date},ht=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:J,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=L(n);if(at[n])return at[n];if(r===et||r===nt)for(var i in t)e[i]=n;else for(var u in t)e[u]=n[u]||J;return e},pt=function(t){t===ut?(ut=t._next)?ut._previous=null:ot=null:t===ot?(ot=t._previous)?ot._next=null:ut=null:(G=t._previous,H=t._next,G._next=H,H._previous=G),t._previous=t._next=null},vt="function"==typeof Promise?Promise:null,_t=function(){function t(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;R(this,t),this._config={},this._data={},this._delay=0,this._filters=[],this._next=null,this._previous=null,this._timestamp=null,this._hasEnded=!1,this._resolve=null,this._reject=null,this._currentState=n||{},this._originalState={},this._targetState={},this._start=it,this._render=it,this._promiseCtor=vt,e&&this.setConfig(e)}var n,e;return n=t,(e=[{key:"_applyFilter",value:function(t){for(var n=this._filters.length;n>0;n--){var e=this._filters[n-n][t];e&&e(this)}}},{key:"tween",value:function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return this._isPlaying&&this.stop(),!n&&this._config||this.setConfig(n),this._pausedAtTime=null,this._timestamp=t.now(),this._start(this.get(),this._data),this._delay&&this._render(this._currentState,this._data,0),this._resume(this._timestamp)}},{key:"setConfig",value:function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=this._config;for(var r in n)e[r]=n[r];var i=e.promise,u=void 0===i?this._promiseCtor:i,o=e.start,a=void 0===o?it:o,s=e.finish,c=e.render,f=void 0===c?this._config.step||it:c,l=e.step,h=void 0===l?it:l;this._data=e.data||e.attachment||this._data,this._isPlaying=!1,this._pausedAtTime=null,this._scheduleId=null,this._delay=n.delay||0,this._start=a,this._render=f||h,this._duration=e.duration||500,this._promiseCtor=u,s&&(this._resolve=s);var p=n.from,v=n.to,_=void 0===v?{}:v,y=this._currentState,d=this._originalState,g=this._targetState;for(var m in p)y[m]=p[m];var w=!1;for(var b in y){var O=y[b];w||L(O)!==et||(w=!0),d[b]=O,g[b]=_.hasOwnProperty(b)?_[b]:O}if(this._easing=ht(this._currentState,e.easing,this._easing),this._filters.length=0,w){for(var S in t.filters)t.filters[S].doesApply(this)&&this._filters.push(t.filters[S]);this._applyFilter(tt)}return this}},{key:"then",value:function(t,n){var e=this;return this._promise=new this._promiseCtor((function(t,n){e._resolve=t,e._reject=n})),this._promise.then(t,n)}},{key:"catch",value:function(t){return this.then().catch(t)}},{key:"get",value:function(){return V({},this._currentState)}},{key:"set",value:function(t){this._currentState=t}},{key:"pause",value:function(){if(this._isPlaying)return this._pausedAtTime=t.now(),this._isPlaying=!1,pt(this),this}},{key:"resume",value:function(){return this._resume()}},{key:"_resume",value:function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:t.now();return null===this._timestamp?this.tween():this._isPlaying?this._promise:(this._pausedAtTime&&(this._timestamp+=n-this._pausedAtTime,this._pausedAtTime=null),this._isPlaying=!0,null===ut?(ut=this,ot=this):(this._previous=ot,ot._next=this,ot=this),this)}},{key:"seek",value:function(n){n=Math.max(n,0);var e=t.now();return this._timestamp+n===0||(this._timestamp=e-n,ct(this,e)),this}},{key:"stop",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(!this._isPlaying)return this;this._isPlaying=!1,pt(this);var n=this._filters.length>0;return t&&(n&&this._applyFilter(Z),st(1,this._currentState,this._originalState,this._targetState,1,0,this._easing),n&&(this._applyFilter(X),this._applyFilter(Y))),this._resolve&&this._resolve({data:this._data,state:this._currentState,tweenable:this}),this._resolve=null,this._reject=null,this}},{key:"cancel",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=this._currentState,e=this._data,r=this._isPlaying;return r?(this._reject&&this._reject({data:e,state:n,tweenable:this}),this._resolve=null,this._reject=null,this.stop(t)):this}},{key:"isPlaying",value:function(){return this._isPlaying}},{key:"hasEnded",value:function(){return this._hasEnded}},{key:"setScheduleFunction",value:function(n){t.setScheduleFunction(n)}},{key:"data",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return t&&(this._data=V({},t)),this._data}},{key:"dispose",value:function(){for(var t in this)delete this[t]}}])&&z(n.prototype,e),t}();function yt(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=new _t;return n.tween(t),n.tweenable=n,n}W(_t,"now",(function(){return $})),_t.setScheduleFunction=function(t){return rt=t},_t.formulas=at,_t.filters={},function t(){$=lt(),rt.call(K,t,16.666666666666668),ft()}();var dt,gt,mt=/(\d|-|\.)/,wt=/([^\-0-9.]+)/g,bt=/[0-9.-]+/g,Ot=(dt=bt.source,gt=/,\s*/.source,new RegExp("rgba?\\(".concat(dt).concat(gt).concat(dt).concat(gt).concat(dt,"(").concat(gt).concat(dt,")?\\)"),"g")),St=/^.*\(/,jt=/#([0-9]|[a-f]){3,6}/gi,kt="VAL",Pt=function(t,n){return t.map((function(t,e){return"_".concat(n,"_").concat(e)}))};function Mt(t){return parseInt(t,16)}var Et=function(t){return"rgb(".concat((n=t,3===(n=n.replace(/#/,"")).length&&(n=(n=n.split(""))[0]+n[0]+n[1]+n[1]+n[2]+n[2]),[Mt(n.substr(0,2)),Mt(n.substr(2,2)),Mt(n.substr(4,2))]).join(","),")");var n},Tt=function(t,n,e){var r=n.match(t),i=n.replace(t,kt);return r&&r.forEach((function(t){return i=i.replace(kt,e(t))})),i},Ft=function(t){for(var n in t){var e=t[n];"string"==typeof e&&e.match(jt)&&(t[n]=Tt(jt,e,Et))}},It=function(t){var n=t.match(bt),e=n.slice(0,3).map(Math.floor),r=t.match(St)[0];if(3===n.length)return"".concat(r).concat(e.join(","),")");if(4===n.length)return"".concat(r).concat(e.join(","),",").concat(n[3],")");throw new Error("Invalid rgbChunk: ".concat(t))},xt=function(t){return t.match(bt)},At=function(t,n){var e={};return n.forEach((function(n){e[n]=t[n],delete t[n]})),e},Ct=function(t,n){return n.map((function(n){return t[n]}))},Dt=function(t,n){return n.forEach((function(n){return t=t.replace(kt,+n.toFixed(4))})),t},qt=function(t){for(var n in t._currentState)if("string"==typeof t._currentState[n])return!0;return!1};function Qt(t){var n=t._currentState;[n,t._originalState,t._targetState].forEach(Ft),t._tokenData=function(t){var n,e,r={};for(var i in t){var u=t[i];"string"==typeof u&&(r[i]={formatString:(n=u,e=void 0,e=n.match(wt),e?(1===e.length||n.charAt(0).match(mt))&&e.unshift(""):e=["",""],e.join(kt)),chunkNames:Pt(xt(u),i)})}return r}(n)}function Bt(t){var n=t._currentState,e=t._originalState,r=t._targetState,i=t._easing,u=t._tokenData;!function(t,n){var e=function(e){var r=n[e].chunkNames,i=t[e];if("string"==typeof i){var u=i.split(" "),o=u[u.length-1];r.forEach((function(n,e){return t[n]=u[e]||o}))}else r.forEach((function(n){return t[n]=i}));delete t[e]};for(var r in n)e(r)}(i,u),[n,e,r].forEach((function(t){return function(t,n){var e=function(e){xt(t[e]).forEach((function(r,i){return t[n[e].chunkNames[i]]=+r})),delete t[e]};for(var r in n)e(r)}(t,u)}))}function Nt(t){var n=t._currentState,e=t._originalState,r=t._targetState,i=t._easing,u=t._tokenData;[n,e,r].forEach((function(t){return function(t,n){for(var e in n){var r=n[e],i=r.chunkNames,u=r.formatString,o=Dt(u,Ct(At(t,i),i));t[e]=Tt(Ot,o,It)}}(t,u)})),function(t,n){for(var e in n){var r=n[e].chunkNames,i=t[r[0]];t[e]="string"==typeof i?r.map((function(n){var e=t[n];return delete t[n],e})).join(" "):i}}(i,u)}function Rt(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable}))),e.push.apply(e,r)}return e}function zt(t){for(var n=1;n<arguments.length;n++){var e=null!=arguments[n]?arguments[n]:{};n%2?Rt(Object(e),!0).forEach((function(n){Lt(t,n,e[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):Rt(Object(e)).forEach((function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}))}return t}function Lt(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}var Ut=new _t,Vt=_t.filters,Wt=function(t,n,e,r){var i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,u=zt({},t),o=ht(t,r);for(var a in Ut._filters.length=0,Ut.set({}),Ut._currentState=u,Ut._originalState=t,Ut._targetState=n,Ut._easing=o,Vt)Vt[a].doesApply(Ut)&&Ut._filters.push(Vt[a]);Ut._applyFilter("tweenCreated"),Ut._applyFilter("beforeTween");var s=st(e,u,t,n,1,i,o);return Ut._applyFilter("afterTween"),s};function $t(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);e<n;e++)r[e]=t[e];return r}function Gt(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function Ht(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Jt(t,n){var e=n.get(t);if(!e)throw new TypeError("attempted to get private field on non-instance");return e.get?e.get.call(t):e.value}var Kt=new WeakMap,Xt=function(){function t(){Gt(this,t),Kt.set(this,{writable:!0,value:[]});for(var n=arguments.length,e=new Array(n),r=0;r<n;r++)e[r]=arguments[r];e.forEach(this.add.bind(this))}var n,e;return n=t,(e=[{key:"add",value:function(t){return Jt(this,Kt).push(t),t}},{key:"remove",value:function(t){var n=Jt(this,Kt).indexOf(t);return~n&&Jt(this,Kt).splice(n,1),t}},{key:"empty",value:function(){return this.tweenables.map(this.remove.bind(this))}},{key:"isPlaying",value:function(){return Jt(this,Kt).some((function(t){return t.isPlaying()}))}},{key:"play",value:function(){return Jt(this,Kt).forEach((function(t){return t.tween()})),this}},{key:"pause",value:function(){return Jt(this,Kt).forEach((function(t){return t.pause()})),this}},{key:"resume",value:function(){return Jt(this,Kt).forEach((function(t){return t.resume()})),this}},{key:"stop",value:function(t){return Jt(this,Kt).forEach((function(n){return n.stop(t)})),this}},{key:"tweenables",get:function(){return function(t){if(Array.isArray(t))return $t(t)}(t=Jt(this,Kt))||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,n){if(t){if("string"==typeof t)return $t(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?$t(t,n):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}();var t}},{key:"promises",get:function(){return Jt(this,Kt).map((function(t){return t.then()}))}}])&&Ht(n.prototype,e),t}();var Yt=function(t,n,e,r,i){var u=function(t,n,e,r){return function(i){return f=0,l=0,h=0,p=function(t){return((f*t+l)*t+h)*t},v=function(t){return(3*f*t+2*l)*t+h},_=function(t){return t>=0?t:0-t},f=1-(h=3*(u=t))-(l=3*(e-u)-h),a=1-(c=3*(o=n))-(s=3*(r-o)-c),function(t){return((a*t+s)*t+c)*t}(function(t,n){var e,r,i,u,o,a;for(i=t,a=0;a<8;a++){if(u=p(i)-t,_(u)<n)return i;if(o=v(i),_(o)<1e-6)break;i-=u/o}if((i=t)<(e=0))return e;if(i>(r=1))return r;for(;e<r;){if(u=p(i),_(u-t)<n)return i;t>u?e=i:r=i,i=.5*(r-e)+e}return i}(i,function(t){return 1/(200*t)}(1)));var u,o,a,s,c,f,l,h,p,v,_}}(n,e,r,i);return u.displayName=t,u.x1=n,u.y1=e,u.x2=r,u.y2=i,_t.formulas[t]=u},Zt=function(t){return delete _t.formulas[t]};_t.filters.token=i}},n={};function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{}};return t[r](i,i.exports,e),i.exports}return e.d=function(t,n){for(var r in n)e.o(n,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:n[r]})},e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e(720)}()}));
//# sourceMappingURL=shifty.js.map

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
module.exports = JSON.parse('{"apiVersion":2,"name":"kadence/progress-bar","title":"Progress Bar","category":"kadence-blocks","description":"Kadence progress bar","textdomain":"kadence-blocks","keywords":["kb","progress bar"],"attributes":{"align":{"type":"string"},"id":{"type":"number"},"width":{"type":"number","default":"0"},"uniqueID":{"type":"string"},"marginDesktop":{"type":"array","default":["","","",""]},"marginTablet":{"type":"array","default":["","","",""]},"marginMobile":{"type":"array","default":["","","",""]},"marginUnit":{"type":"string","default":"px"},"paddingDesktop":{"type":"array","default":["","","",""]},"paddingTablet":{"type":"array","default":["","","",""]},"paddingMobile":{"type":"array","default":["","","",""]},"paddingUnit":{"type":"string","default":"px"},"barBackground":{"type":"string","default":"#4A5568"},"barBackgroundOpacity":{"type":"number","default":1},"progressWidth":{"type":"string","default":"3"},"progressWidthTablet":{"type":"string","default":""},"progressWidthMobile":{"type":"string","default":""},"progressWidthType":{"type":"string","default":"px"},"borderColor":{"type":"string","default":"#4A5568"},"borderOpacity":{"type":"number","default":1},"barType":{"enum":["line","circle"],"default":"line"},"containerMaxWidth":{"type":"number","default":200},"tabletContainerMaxWidth":{"type":"number"},"mobileContainerMaxWidth":{"type":"number"},"containerMaxWidthUnits":{"type":"string","default":"px"},"displayLabel":{"type":"boolean","default":true},"labelFont":{"type":"object","default":{"color":"","level":6,"size":["","",""],"sizeType":"px","lineHeight":["","",""],"linetype":"px","letterSpacing":"","textTransform":"","family":"","google":false,"style":"","weight":"","variant":"","subset":"","loadGoogle":true,"padding":[0,0,0,0],"margin":[0,0,15,0]}},"labelAlign":{"type":"array","default":["","",""]},"labelMinHeight":{"type":"array","default":["","",""]},"label":{"type":"string","default":""},"labelPosition":{"enum":["above","below"],"default":"below"},"progressAmount":{"type":"integer","default":50},"duration":{"type":"number","default":2.5}},"editorScript":"file:editor.js"}');

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
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_0__.progressIcon
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