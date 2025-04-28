/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Controls
 */
import classnames from 'classnames';
import { debounce } from 'lodash';

/**
 * Kadence Components.
 */
import {
	PopColorControl,
	ResponsiveMeasurementControls,
	SmallResponsiveControl,
	RangeControl,
	ResponsiveRangeControls,
	KadencePanelBody,
	URLInputControl,
	ResponsiveRadioRangeControls,
	ResponsiveAlignControls,
	BoxShadowControl,
	KadenceFormConditionals,
	BackgroundControl as KadenceBackgroundControl,
	ResponsiveBorderControl,
	BackgroundTypeControl,
	GradientControl,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	ColorGroup,
	HoverToggleControl,
	CopyPasteAttributes,
	DynamicTextInputControl,
} from '@kadence/components';

/**
 * Kadence Helpers.
 */
import {
	KadenceColorOutput,
	getPreviewSize,
	showSettings,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	getBorderStyle,
	setBlockDefaults,
	getUniqueId,
	getInQueryBlock,
	setDynamicState,
	getPostOrFseId,
	hasKadenceCustomCss,
} from '@kadence/helpers';

import './editor.scss';
import metadata from './block.json';
import { getPreviewGutterSize } from './utils';
//import ResizeGridSection from './resize-grid-section';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import {
	BlockAlignmentToolbar,
	BlockVerticalAlignmentToolbar,
	BlockControls,
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { ToggleControl, SelectControl, ToolbarGroup, ExternalLink } from '@wordpress/components';
const FORM_ALLOWED_BLOCKS = [
	'core/paragraph',
	'kadence/advancedheading',
	'kadence/spacer',
	'kadence/rowlayout',
	'kadence/column',
	'kadence/advanced-form-text',
	'kadence/advanced-form-textarea',
	'kadence/advanced-form-select',
	'kadence/advanced-form-submit',
	'kadence/advanced-form-radio',
	'kadence/advanced-form-file',
	'kadence/advanced-form-time',
	'kadence/advanced-form-date',
	'kadence/advanced-form-telephone',
	'kadence/advanced-form-checkbox',
	'kadence/advanced-form-email',
	'kadence/advanced-form-accept',
	'kadence/advanced-form-number',
	'kadence/advanced-form-hidden',
	'kadence/advanced-form-captcha',
];
import { BLEND_OPTIONS } from '../rowlayout/constants';
import { applyFilters } from '@wordpress/hooks';
/**
 * Build the section edit.
 */
function SectionEdit(props) {
	const { attributes, setAttributes, isSelected, clientId, context, className } = props;
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
		verticalAlignmentTablet,
		verticalAlignmentMobile,
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
		maxWidthTabletUnit,
		maxWidthMobileUnit,
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
		align,
		padding,
		tabletPadding,
		mobilePadding,
		margin,
		tabletMargin,
		mobileMargin,
		backgroundType,
		backgroundHoverType,
		gradient,
		gradientHover,
		overlayType,
		overlayHoverType,
		overlayGradient,
		overlayGradientHover,
		borderRadiusUnit,
		borderHoverRadiusUnit,
		tabletBorderRadius,
		mobileBorderRadius,
		borderStyle,
		mobileBorderStyle,
		tabletBorderStyle,
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		tabletBorderHoverRadius,
		mobileBorderHoverRadius,
		inQueryBlock,
		hoverOverlayBlendMode,
		overlayBlendMode,
		rowGapUnit,
		rowGap,
		flexBasis,
		flexBasisUnit,
		rowGapVariable,
		gutterVariable,
		kbVersion,
		flexGrow,
		backdropFilterType,
		backdropFilterSize,
		backdropFilterString,
	} = attributes;
	const [activeTab, setActiveTab] = useState('general');
	const [dynamicBackgroundImg, setDynamicBackgroundImg] = useState('');

	const debouncedSetDynamicState = debounce(setDynamicState, 200);

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, previewDevice, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				parentData: {
					rootBlock: select('core/block-editor').getBlock(
						select('core/block-editor').getBlockHierarchyRootClientId(clientId)
					),
					postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
					reusableParent: select('core/block-editor').getBlockAttributes(
						select('core/block-editor').getBlockParentsByBlockName(clientId, 'core/block').slice(-1)[0]
					),
					editedPostId: select('core/edit-site') ? select('core/edit-site').getEditedPostId() : false,
				},
			};
		},
		[clientId]
	);

	useEffect(() => {
		setBlockDefaults('kadence/column', attributes);

		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}

		const isInQueryBlock = getInQueryBlock(context, inQueryBlock);
		if (attributes.inQueryBlock !== isInQueryBlock) {
			attributes.inQueryBlock = isInQueryBlock;
			setAttributes({ inQueryBlock: isInQueryBlock });
		}

		// Update Old Styles
		if ('' !== topPadding || '' !== rightPadding || '' !== bottomPadding || '' !== leftPadding) {
			setAttributes({
				padding: [topPadding, rightPadding, bottomPadding, leftPadding],
				topPadding: '',
				rightPadding: '',
				bottomPadding: '',
				leftPadding: '',
			});
		}
		if ('' !== topPaddingT || '' !== rightPaddingT || '' !== bottomPaddingT || '' !== leftPaddingT) {
			setAttributes({
				tabletPadding: [topPaddingT, rightPaddingT, bottomPaddingT, leftPaddingT],
				topPaddingT: '',
				rightPaddingT: '',
				bottomPaddingT: '',
				leftPaddingT: '',
			});
		}
		if ('' !== topPaddingM || '' !== rightPaddingM || '' !== bottomPaddingM || '' !== leftPaddingM) {
			setAttributes({
				mobilePadding: [topPaddingM, rightPaddingM, bottomPaddingM, leftPaddingM],
				topPaddingM: '',
				rightPaddingM: '',
				bottomPaddingM: '',
				leftPaddingM: '',
			});
		}
		if ('' !== topMargin || '' !== rightMargin || '' !== bottomMargin || '' !== leftMargin) {
			setAttributes({
				margin: [topMargin, rightMargin, bottomMargin, leftMargin],
				topMargin: '',
				rightMargin: '',
				bottomMargin: '',
				leftMargin: '',
			});
		}
		if ('' !== topMarginT || '' !== rightMarginT || '' !== bottomMarginT || '' !== leftMarginT) {
			setAttributes({
				tabletMargin: [topMarginT, rightMarginT, bottomMarginT, leftMarginT],
				topMarginT: '',
				rightMarginT: '',
				bottomMarginT: '',
				leftMarginT: '',
			});
		}
		if ('' !== topMarginM || '' !== rightMarginM || '' !== bottomMarginM || '' !== leftMarginM) {
			setAttributes({
				mobileMargin: [topMarginM, rightMarginM, bottomMarginM, leftMarginM],
				topMarginM: '',
				rightMarginM: '',
				bottomMarginM: '',
				leftMarginM: '',
			});
		}
		// Update from old border settings.
		const tempBorderStyle = JSON.parse(
			JSON.stringify(
				attributes.borderStyle
					? attributes.borderStyle
					: [
							{
								top: ['', '', ''],
								right: ['', '', ''],
								bottom: ['', '', ''],
								left: ['', '', ''],
								unit: 'px',
							},
					  ]
			)
		);
		let updateBorderStyle = false;
		if ('' !== border) {
			tempBorderStyle[0].top[0] = border;
			tempBorderStyle[0].right[0] = border;
			tempBorderStyle[0].bottom[0] = border;
			tempBorderStyle[0].left[0] = border;
			updateBorderStyle = true;
			setAttributes({ border: '' });
		}
		if ('' !== borderWidth?.[0] || '' !== borderWidth?.[1] || '' !== borderWidth?.[2] || '' !== borderWidth?.[3]) {
			tempBorderStyle[0].top[2] = borderWidth?.[0] || '';
			tempBorderStyle[0].right[2] = borderWidth?.[1] || '';
			tempBorderStyle[0].bottom[2] = borderWidth?.[2] || '';
			tempBorderStyle[0].left[2] = borderWidth?.[3] || '';
			updateBorderStyle = true;
			setAttributes({ borderWidth: ['', '', '', ''] });
		}
		if (updateBorderStyle) {
			setAttributes({ borderStyle: tempBorderStyle });
		}
		const tempBorderHoverStyle = JSON.parse(
			JSON.stringify(
				attributes.borderHoverStyle
					? attributes.borderHoverStyle
					: [
							{
								top: ['', '', ''],
								right: ['', '', ''],
								bottom: ['', '', ''],
								left: ['', '', ''],
								unit: 'px',
							},
					  ]
			)
		);
		let updateBorderHoverStyle = false;
		if ('' !== borderHover) {
			tempBorderHoverStyle[0].top[0] = borderHover;
			tempBorderHoverStyle[0].right[0] = borderHover;
			tempBorderHoverStyle[0].bottom[0] = borderHover;
			tempBorderHoverStyle[0].left[0] = borderHover;
			updateBorderHoverStyle = true;
			setAttributes({ borderHover: '' });
		}
		if (
			'' !== borderHoverWidth?.[0] ||
			'' !== borderHoverWidth?.[1] ||
			'' !== borderHoverWidth?.[2] ||
			'' !== borderHoverWidth?.[3]
		) {
			tempBorderHoverStyle[0].top[2] = borderHoverWidth?.[0] || '';
			tempBorderHoverStyle[0].right[2] = borderHoverWidth?.[1] || '';
			tempBorderHoverStyle[0].bottom[2] = borderHoverWidth?.[2] || '';
			tempBorderHoverStyle[0].left[2] = borderHoverWidth?.[3] || '';
			updateBorderHoverStyle = true;
			setAttributes({ borderHoverWidth: ['', '', '', ''] });
		}
		if (updateBorderHoverStyle) {
			setAttributes({ borderHoverStyle: tempBorderHoverStyle });
		}
		const tempTabBorderStyle = JSON.parse(
			JSON.stringify(
				attributes.tabletBorderStyle
					? attributes.tabletBorderStyle
					: [
							{
								top: ['', '', ''],
								right: ['', '', ''],
								bottom: ['', '', ''],
								left: ['', '', ''],
								unit: 'px',
							},
					  ]
			)
		);
		if (
			'' !== tabletBorderWidth?.[0] ||
			'' !== tabletBorderWidth?.[1] ||
			'' !== tabletBorderWidth?.[2] ||
			'' !== tabletBorderWidth?.[3]
		) {
			tempTabBorderStyle[0].top[2] = tabletBorderWidth?.[0] || '';
			tempTabBorderStyle[0].right[2] = tabletBorderWidth?.[1] || '';
			tempTabBorderStyle[0].bottom[2] = tabletBorderWidth?.[2] || '';
			tempTabBorderStyle[0].left[2] = tabletBorderWidth?.[3] || '';
			const tempTabBorderWidth = JSON.parse(JSON.stringify(tempTabBorderStyle));
			setAttributes({ tabletBorderStyle: tempTabBorderWidth, tabletBorderWidth: ['', '', '', ''] });
		}
		const tempTabBorderHoverStyle = JSON.parse(
			JSON.stringify(
				attributes.tabletBorderHoverStyle
					? attributes.tabletBorderHoverStyle
					: [
							{
								top: ['', '', ''],
								right: ['', '', ''],
								bottom: ['', '', ''],
								left: ['', '', ''],
								unit: 'px',
							},
					  ]
			)
		);
		if (
			'' !== tabletBorderHoverWidth?.[0] ||
			'' !== tabletBorderHoverWidth?.[1] ||
			'' !== tabletBorderHoverWidth?.[2] ||
			'' !== tabletBorderHoverWidth?.[3]
		) {
			tempTabBorderHoverStyle[0].top[2] = tabletBorderHoverWidth?.[0] || '';
			tempTabBorderHoverStyle[0].right[2] = tabletBorderHoverWidth?.[1] || '';
			tempTabBorderHoverStyle[0].bottom[2] = tabletBorderHoverWidth?.[2] || '';
			tempTabBorderHoverStyle[0].left[2] = tabletBorderHoverWidth?.[3] || '';
			const tempTabBorderHoverWidth = JSON.parse(JSON.stringify(tempTabBorderHoverStyle));
			setAttributes({
				tabletBorderHoverStyle: tempTabBorderHoverWidth,
				tabletBorderHoverWidth: ['', '', '', ''],
			});
		}
		const tempMobileBorderStyle = JSON.parse(
			JSON.stringify(
				attributes.mobileBorderStyle
					? attributes.mobileBorderStyle
					: [
							{
								top: ['', '', ''],
								right: ['', '', ''],
								bottom: ['', '', ''],
								left: ['', '', ''],
								unit: 'px',
							},
					  ]
			)
		);
		if (
			'' !== mobileBorderWidth?.[0] ||
			'' !== mobileBorderWidth?.[1] ||
			'' !== mobileBorderWidth?.[2] ||
			'' !== mobileBorderWidth?.[3]
		) {
			tempMobileBorderStyle[0].top[2] = mobileBorderWidth?.[0] || '';
			tempMobileBorderStyle[0].right[2] = mobileBorderWidth?.[1] || '';
			tempMobileBorderStyle[0].bottom[2] = mobileBorderWidth?.[2] || '';
			tempMobileBorderStyle[0].left[2] = mobileBorderWidth?.[3] || '';
			setAttributes({ mobileBorderStyle: tempMobileBorderStyle, mobileBorderWidth: ['', '', '', ''] });
		}
		const tempMobileBorderHoverStyle = JSON.parse(
			JSON.stringify(
				attributes.mobileBorderHoverStyle
					? attributes.mobileBorderHoverStyle
					: [
							{
								top: ['', '', ''],
								right: ['', '', ''],
								bottom: ['', '', ''],
								left: ['', '', ''],
								unit: 'px',
							},
					  ]
			)
		);
		if (
			'' !== mobileBorderHoverWidth?.[0] ||
			'' !== mobileBorderHoverWidth?.[1] ||
			'' !== mobileBorderHoverWidth?.[2] ||
			'' !== mobileBorderHoverWidth?.[3]
		) {
			tempMobileBorderHoverStyle[0].top[2] = mobileBorderHoverWidth?.[0] || '';
			tempMobileBorderHoverStyle[0].right[2] = mobileBorderHoverWidth?.[1] || '';
			tempMobileBorderHoverStyle[0].bottom[2] = mobileBorderHoverWidth?.[2] || '';
			tempMobileBorderHoverStyle[0].left[2] = mobileBorderHoverWidth?.[3] || '';
			const tempMobileBorderHoverWidth = JSON.parse(JSON.stringify(tempMobileBorderHoverStyle));
			setAttributes({ mobileBorderHoverStyle: tempMobileBorderHoverWidth, mobileBorderWidth: ['', '', '', ''] });
		}
		if (!kbVersion || kbVersion < 2) {
			// Update Align and Text Align settings for 3.2.0
			let deskJustifyAlign = justifyContent?.[0] ? justifyContent[0] : '';
			let tabletJustifyAlign = justifyContent?.[1] ? justifyContent[1] : '';
			let mobileJustifyAlign = justifyContent?.[2] ? justifyContent[2] : '';
			const deskDirection = direction?.[0] ? direction[0] : '';
			const tabletDirection = direction?.[1] ? direction[1] : '';
			const mobileDirection = direction?.[2] ? direction[2] : '';
			let updateJustify = false;
			if ('' !== textAlign?.[0] && deskDirection === 'horizontal' && deskJustifyAlign === '') {
				switch (textAlign[0]) {
					case 'center':
						deskJustifyAlign = 'center';
						break;
					case 'left':
						deskJustifyAlign = 'flex-start';
						break;
					case 'right':
						deskJustifyAlign = 'flex-end';
						break;
				}
				updateJustify = true;
			}
			if (
				'' !== textAlign?.[1] &&
				(tabletDirection === 'horizontal' || (tabletDirection === '' && deskDirection === 'horizontal')) &&
				deskJustifyAlign === ''
			) {
				switch (textAlign[1]) {
					case 'center':
						tabletJustifyAlign = 'center';
						break;
					case 'left':
						tabletJustifyAlign = 'flex-start';
						break;
					case 'right':
						tabletJustifyAlign = 'flex-end';
						break;
				}
				updateJustify = true;
			}
			if (
				'' !== textAlign?.[2] &&
				(mobileDirection === 'horizontal' ||
					(mobileDirection === '' && tabletDirection === 'horizontal') ||
					(mobileDirection === '' && tabletDirection === '' && deskDirection === 'horizontal')) &&
				deskJustifyAlign === ''
			) {
				switch (textAlign[2]) {
					case 'center':
						mobileJustifyAlign = 'center';
						break;
					case 'left':
						mobileJustifyAlign = 'flex-start';
						break;
					case 'right':
						mobileJustifyAlign = 'flex-end';
						break;
				}
				updateJustify = true;
			}
			if (deskDirection === 'vertical' && deskJustifyAlign !== '') {
				deskJustifyAlign = '';
				updateJustify = true;
			}
			if (
				(tabletDirection === 'vertical' || (tabletDirection === '' && deskDirection === 'vertical')) &&
				tabletJustifyAlign !== ''
			) {
				tabletJustifyAlign = '';
				updateJustify = true;
			}
			if (
				(mobileDirection === 'vertical' ||
					(mobileDirection === '' && tabletDirection === 'vertical') ||
					(mobileDirection === '' && tabletDirection === '' && deskDirection === 'vertical')) &&
				mobileJustifyAlign !== ''
			) {
				mobileJustifyAlign = '';
				updateJustify = true;
			}
			if (updateJustify) {
				setAttributes({ justifyContent: [deskJustifyAlign, tabletJustifyAlign, mobileJustifyAlign] });
			}
			// Update Gutter settings for 3.2.0.
			if ('' !== gutter?.[0] || '' !== gutter?.[1] || '' !== gutter?.[2]) {
				setAttributes({
					gutterVariable: [
						'' !== gutter?.[0] ? 'custom' : '',
						'' !== gutter?.[1] ? 'custom' : '',
						'' !== gutter?.[2] ? 'custom' : '',
					],
				});
			}
			if ('' !== rowGap?.[0] || '' !== rowGap?.[1] || '' !== rowGap?.[2]) {
				setAttributes({
					rowGapVariable: [
						'' !== rowGap?.[0] ? 'custom' : '',
						'' !== rowGap?.[1] ? 'custom' : '',
						'' !== rowGap?.[2] ? 'custom' : '',
					],
				});
			}
			// Update row gap to match gutter if layout is horizontal.
			if (
				undefined !== rowGap &&
				(deskDirection === 'horizontal' || tabletDirection === 'horizontal' || mobileDirection === 'horizontal')
			) {
				const tempRowGap = JSON.parse(JSON.stringify(rowGap));
				const tempRowGapVariable = ['', '', ''];
				if (deskDirection === 'horizontal') {
					tempRowGap[0] = '' !== gutter?.[0] ? gutter[0] : 10;
					tempRowGapVariable[0] = '' !== gutter?.[0] ? 'custom' : '';
				}
				if (
					((tabletDirection === '' && deskDirection === 'horizontal') || tabletDirection === 'horizontal') &&
					'' !== gutter?.[1]
				) {
					tempRowGap[1] = gutter?.[1];
					tempRowGapVariable[1] = '' !== gutter?.[1] ? 'custom' : '';
				}
				if (
					((mobileDirection === '' && tabletDirection === 'horizontal') ||
						(mobileDirection === '' && tabletDirection === '' && deskDirection === 'horizontal') ||
						mobileDirection === 'horizontal') &&
					'' !== gutter?.[2]
				) {
					tempRowGap[2] = gutter?.[2];
					tempRowGapVariable[2] = '' !== gutter?.[2] ? 'custom' : '';
				}

				setAttributes({
					rowGapVariable: tempRowGapVariable,
					rowGap: tempRowGap,
					rowGapUnit: gutterUnit ? gutterUnit : 'px',
				});
			}
			setAttributes({ kbVersion: 2 });
		}

		if (inRowBlock && align !== '') {
			setAttributes({ align: '' });
		}
	}, []);

	//set the dynamic image state
	useEffect(() => {
		debouncedSetDynamicState(
			'kadence.dynamicBackground',
			'',
			attributes,
			'backgroundImg:0:bgImg',
			setAttributes,
			context,
			setDynamicBackgroundImg,
			backgroundImg ? false : true
		);
	}, [backgroundImg, context]);

	const { hasInnerBlocks, inRowBlock, inFormBlock } = useSelect(
		(select) => {
			const { getBlock, getBlockRootClientId, getBlockParentsByBlockName, getBlocksByClientId } =
				select(blockEditorStore);
			const block = getBlock(clientId);
			const rootID = getBlockRootClientId(clientId);
			let inRowBlock = false;
			let inFormBlock = false;
			if (rootID) {
				const hasForm = getBlockParentsByBlockName(clientId, 'kadence/advanced-form');
				const parentBlock = getBlocksByClientId(rootID);
				inFormBlock = undefined !== hasForm && hasForm.length ? true : false;
				inRowBlock =
					undefined !== parentBlock &&
					undefined !== parentBlock[0] &&
					undefined !== parentBlock[0].name &&
					parentBlock[0].name === 'kadence/rowlayout'
						? true
						: false;
			}
			return {
				inRowBlock,
				hasInnerBlocks: !!(block && block.innerBlocks.length),
				inFormBlock,
			};
		},
		[clientId]
	);
	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();
	const saveShadow = (value) => {
		const newUpdate = shadow.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			shadow: newUpdate,
		});
	};
	const saveShadowHover = (value) => {
		const newItems = shadowHover.map((item, thisIndex) => {
			if (0 === thisIndex) {
				item = { ...item, ...value };
			}

			return item;
		});
		setAttributes({
			shadowHover: newItems,
		});
	};
	const saveBackgroundImage = (value) => {
		const newUpdate = backgroundImg.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			backgroundImg: newUpdate,
		});
	};
	const saveHoverBackgroundImage = (value) => {
		const newUpdate = backgroundImgHover.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			backgroundImgHover: newUpdate,
		});
	};
	const onRemoveBGImage = () => {
		saveBackgroundImage({
			bgImgID: '',
			bgImg: '',
		});
	};
	const onRemoveHoverBGImage = () => {
		saveHoverBackgroundImage({
			bgImgID: '',
			bgImg: '',
		});
	};
	const saveOverlayImage = (value) => {
		const newUpdate = overlayImg.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			overlayImg: newUpdate,
		});
	};
	const saveHoverOverlayImage = (value) => {
		const newUpdate = overlayImgHover.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			overlayImgHover: newUpdate,
		});
	};
	const onRemoveOverlayImage = () => {
		saveOverlayImage({
			bgImgID: '',
			bgImg: '',
		});
	};
	const onRemoveHoverOverlayImage = () => {
		saveHoverOverlayImage({
			bgImgID: '',
			bgImg: '',
		});
	};
	const previewPaddingType = undefined !== paddingType ? paddingType : 'px';
	const previewMarginType = undefined !== marginType ? marginType : 'px';
	// Margin
	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[0] : '',
		undefined !== tabletMargin ? tabletMargin[0] : '',
		undefined !== mobileMargin ? mobileMargin[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== margin && undefined !== margin[1] && '' !== margin[1] ? margin[1] : '',
		undefined !== tabletMargin ? tabletMargin[1] : '',
		undefined !== mobileMargin ? mobileMargin[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[2] : '',
		undefined !== tabletMargin ? tabletMargin[2] : '',
		undefined !== mobileMargin ? mobileMargin[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== margin && undefined !== margin[3] && '' !== margin[3] ? margin[3] : '',
		undefined !== tabletMargin ? tabletMargin[3] : '',
		undefined !== mobileMargin ? mobileMargin[3] : ''
	);

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[0] : '',
		undefined !== tabletPadding ? tabletPadding[0] : '',
		undefined !== mobilePadding ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding && undefined !== padding[1] && '' !== padding[1] ? padding[1] : '',
		undefined !== tabletPadding ? tabletPadding[1] : '',
		undefined !== mobilePadding ? mobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[2] : '',
		undefined !== tabletPadding ? tabletPadding[2] : '',
		undefined !== mobilePadding ? mobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding && undefined !== padding[3] && '' !== padding[3] ? padding[3] : '',
		undefined !== tabletPadding ? tabletPadding[3] : '',
		undefined !== mobilePadding ? mobilePadding[3] : ''
	);
	// Border.
	const previewBorderTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[0] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[0] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[0] : ''
	);
	const previewRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[1] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[1] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[1] : ''
	);
	const previewRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[2] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[2] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[2] : ''
	);
	const previewRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[3] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[3] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[3] : ''
	);
	// Hover Border
	const previewBorderHoverTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle
	);
	const previewBorderHoverRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle
	);
	const previewBorderHoverBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle
	);
	const previewBorderHoverLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle
	);
	const previewHoverRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== borderHoverRadius ? borderHoverRadius[0] : '',
		undefined !== tabletBorderHoverRadius ? tabletBorderHoverRadius[0] : '',
		undefined !== mobileBorderHoverRadius ? mobileBorderHoverRadius[0] : ''
	);
	const previewHoverRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== borderHoverRadius ? borderHoverRadius[1] : '',
		undefined !== tabletBorderHoverRadius ? tabletBorderHoverRadius[1] : '',
		undefined !== mobileBorderHoverRadius ? mobileBorderHoverRadius[1] : ''
	);
	const previewHoverRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== borderHoverRadius ? borderHoverRadius[2] : '',
		undefined !== tabletBorderHoverRadius ? tabletBorderHoverRadius[2] : '',
		undefined !== mobileBorderHoverRadius ? mobileBorderHoverRadius[2] : ''
	);
	const previewHoverRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== borderHoverRadius ? borderHoverRadius[3] : '',
		undefined !== tabletBorderHoverRadius ? tabletBorderHoverRadius[3] : '',
		undefined !== mobileBorderHoverRadius ? mobileBorderHoverRadius[3] : ''
	);

	const previewAlign = getPreviewSize(
		previewDevice,
		textAlign && textAlign[0] ? textAlign[0] : '',
		textAlign && textAlign[1] ? textAlign[1] : '',
		textAlign && textAlign[2] ? textAlign[2] : ''
	);
	const previewVerticalAlign = getPreviewSize(
		previewDevice,
		verticalAlignment ? verticalAlignment : '',
		verticalAlignmentTablet ? verticalAlignmentTablet : '',
		verticalAlignmentMobile ? verticalAlignmentMobile : ''
	);
	let previewVerticalAlignCSS = previewVerticalAlign;
	if (previewVerticalAlign && 'top' === previewVerticalAlign) {
		previewVerticalAlignCSS = 'flex-start';
	} else if (previewVerticalAlign && 'middle' === previewVerticalAlign) {
		previewVerticalAlignCSS = 'center';
	} else if (previewVerticalAlign && 'bottom' === previewVerticalAlign) {
		previewVerticalAlignCSS = 'flex-end';
	}
	const previewGutter = getPreviewSize(
		previewDevice,
		gutter && '' !== gutter[0] ? gutter[0] : '10',
		gutter && '' !== gutter[1] ? gutter[1] : '',
		gutter && '' !== gutter[2] ? gutter[2] : ''
	);
	const previewGutterVariable = getPreviewSize(
		previewDevice,
		gutterVariable && '' !== gutterVariable[0] ? gutterVariable[0] : 'sm',
		gutterVariable && '' !== gutterVariable[1] ? gutterVariable[1] : '',
		gutterVariable && '' !== gutterVariable[2] ? gutterVariable[2] : ''
	);
	const horizontalGap = getPreviewGutterSize(previewDevice, previewGutterVariable, gutter, gutterUnit);

	const previewRowGap = getPreviewSize(
		previewDevice,
		rowGap && '' !== rowGap[0] ? rowGap[0] : '',
		rowGap && '' !== rowGap[1] ? rowGap[1] : '',
		rowGap && '' !== rowGap[2] ? rowGap[2] : ''
	);
	const previewRowGapVariable = getPreviewSize(
		previewDevice,
		rowGapVariable && '' !== rowGapVariable[0] ? rowGapVariable[0] : 'none',
		rowGapVariable && '' !== rowGapVariable[1] ? rowGapVariable[1] : '',
		rowGapVariable && '' !== rowGapVariable[2] ? rowGapVariable[2] : ''
	);
	const flexRowGapVariable = getPreviewSize(
		previewDevice,
		rowGapVariable && '' !== rowGapVariable[0] ? rowGapVariable[0] : '',
		rowGapVariable && '' !== rowGapVariable[1] ? rowGapVariable[1] : '',
		rowGapVariable && '' !== rowGapVariable[2] ? rowGapVariable[2] : ''
	);

	const verticalGap = getPreviewGutterSize(previewDevice, previewRowGapVariable, rowGap, rowGapUnit);
	const previewDirection = getPreviewSize(
		previewDevice,
		direction && '' !== direction[0] ? direction[0] : 'vertical',
		direction && '' !== direction[1] ? direction[1] : '',
		direction && '' !== direction[2] ? direction[2] : ''
	);

	const previewJustify = getPreviewSize(
		previewDevice,
		undefined !== justifyContent?.[0] && '' !== justifyContent?.[0] ? justifyContent[0] : '',
		undefined !== justifyContent?.[1] && '' !== justifyContent?.[1]
			? justifyContent[1]
			: 'horizontal' == direction?.[0] && 'vertical' == direction?.[1]
			? 'stretch'
			: '',
		undefined !== justifyContent?.[2] && '' !== justifyContent?.[2]
			? justifyContent[2]
			: 'horizontal' == direction?.[1] && 'vertical' == direction?.[2]
			? 'stretch'
			: ''
	);

	const previewWrap = getPreviewSize(
		previewDevice,
		wrapContent && '' !== wrapContent[0] ? wrapContent[0] : '',
		wrapContent && '' !== wrapContent[1] ? wrapContent[1] : '',
		wrapContent && '' !== wrapContent[2] ? wrapContent[2] : ''
	);
	const backgroundString = background ? KadenceColorOutput(background, backgroundOpacity) : undefined;
	const previewFlexBasis = getPreviewSize(
		previewDevice,
		(previewDirection === 'horizontal' || previewDirection === 'horizontal-reverse') &&
			flexBasis &&
			'' !== flexBasis[0]
			? flexBasis[0]
			: '',
		(previewDirection === 'horizontal' || previewDirection === 'horizontal-reverse') &&
			flexBasis &&
			'' !== flexBasis[1]
			? flexBasis[1]
			: '',
		(previewDirection === 'horizontal' || previewDirection === 'horizontal-reverse') &&
			flexBasis &&
			'' !== flexBasis[2]
			? flexBasis[2]
			: ''
	);

	const previewMaxWidth = getPreviewSize(
		previewDevice,
		maxWidth && maxWidth[0] ? maxWidth[0] : '',
		maxWidth && maxWidth[1] ? maxWidth[1] : '',
		maxWidth && maxWidth[2] ? maxWidth[2] : ''
	);

	// Check for falsey to support how units worked before
	const previewMaxWidthUnit = getPreviewSize(
		previewDevice,
		maxWidthUnit ? maxWidthUnit : 'px',
		maxWidthTabletUnit ? maxWidthTabletUnit : '',
		maxWidthMobileUnit ? maxWidthMobileUnit : ''
	);
	const previewMinHeight = getPreviewSize(
		previewDevice,
		height && '' !== height[0] ? height[0] : '',
		height && '' !== height[1] ? height[1] : '',
		height && '' !== height[2] ? height[2] : ''
	);
	const previewStickyOffset = getPreviewSize(
		previewDevice,
		stickyOffset && stickyOffset[0] ? stickyOffset[0] : '',
		stickyOffset && stickyOffset[1] ? stickyOffset[1] : '',
		stickyOffset && stickyOffset[2] ? stickyOffset[2] : ''
	);
	const previewFlexGrow = getPreviewSize(
		previewDevice,
		flexGrow && flexGrow[0] ? flexGrow[0] : '',
		flexGrow && flexGrow[1] ? flexGrow[1] : '',
		flexGrow && flexGrow[2] ? flexGrow[2] : ''
	);
	const previewMinHeightUnit = heightUnit ? heightUnit : 'px';
	const previewStickyOffsetUnit = stickyOffsetUnit ? stickyOffsetUnit : 'px';
	const hasCustomCss = hasKadenceCustomCss(kadenceBlockCSS);
	const classes = classnames({
		[className]: className,
		'kadence-column': true,
		[`inner-column-${id}`]: id,
		[`kadence-column-${uniqueID}`]: uniqueID,
		[`kadence-section-sticky`]: sticky !== undefined ? sticky : false,
		'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
		'kvs-md-false': vstablet !== 'undefined' && vstablet,
		'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
		'kadence-has-custom-css': hasCustomCss,
	});
	const previewBackgroundImg = dynamicBackgroundImg ? dynamicBackgroundImg : backgroundImg;
	const hasBackgroundImage =
		previewBackgroundImg && previewBackgroundImg[0] && previewBackgroundImg[0].bgImg ? true : false;
	const previewBackgroundImgCSS = hasBackgroundImage ? `url( ${previewBackgroundImg[0].bgImg} )` : '';
	const previewBackground = backgroundType === 'gradient' ? gradient : previewBackgroundImgCSS;
	const hasHoverBackgroundImage =
		backgroundImgHover && backgroundImgHover[0] && backgroundImgHover[0].bgImg ? true : false;
	const previewHoverBackgroundImg = hasHoverBackgroundImage ? `url( ${backgroundImgHover[0].bgImg} )` : '';
	const previewHoverBackground = backgroundHoverType === 'gradient' ? gradientHover : previewHoverBackgroundImg;
	const hasOverlayImage = overlayImg && overlayImg[0] && overlayImg[0].bgImg ? true : false;
	const previewOverlayImg = hasOverlayImage ? `url( ${overlayImg[0].bgImg} )` : '';
	const previewOverlay = overlayType === 'gradient' ? overlayGradient : previewOverlayImg;
	const hasHoverOverlayImage = overlayImgHover && overlayImgHover[0] && overlayImgHover[0].bgImg ? true : false;
	const previewHoverOverlayImg = hasHoverOverlayImage ? `url( ${overlayImgHover[0].bgImg} )` : '';
	const previewHoverOverlay = overlayHoverType === 'gradient' ? overlayGradientHover : previewHoverOverlayImg;
	const nonTransAttrs = ['images', 'imagesDynamic'];
	const innerClasses = classnames({
		'kadence-inner-column-inner': true,
		'aos-animate': true,
		'kt-animation-wrap': true,
		'kb-section-only-appender': !hasInnerBlocks,
		[`kadence-inner-column-direction-${previewDirection ? previewDirection : 'vertical'}`]: true,
		[`kadence-inner-column-text-align-${previewAlign ? previewAlign : 'normal'}`]: true,
		[`kadence-inner-column-vertical-align-${previewVerticalAlign ? previewVerticalAlign : 'inherit'}`]: true,
		'section-is-flex':
			previewDirection === 'horizontal' ||
			previewDirection === 'horizontal-reverse' ||
			previewDirection === 'vertical-reverse' ||
			previewJustify ||
			previewFlexBasis ||
			flexRowGapVariable ||
			previewVerticalAlign,
	});
	const blockProps = useBlockProps({
		className: classes,
		style: {
			top:
				sticky && undefined !== previewStickyOffset ? previewStickyOffset + previewStickyOffsetUnit : undefined,
		},
		'data-align': !inRowBlock && ('full' === align || 'wide' === align) ? align : undefined,
		'data-vertical-align':
			'top' === previewVerticalAlign || 'middle' === previewVerticalAlign || 'bottom' === previewVerticalAlign
				? previewVerticalAlign
				: undefined,
	});
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: innerClasses,
		},
		{
			orientation:
				previewDirection === 'horizontal' || previewDirection === 'horizontal-reverse'
					? 'horizontal'
					: 'vertical',
			templateLock,
			renderAppender: hasInnerBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
			allowedBlocks: inFormBlock ? FORM_ALLOWED_BLOCKS : undefined,
		}
	);
	const actualVerticalAlign = previewVerticalAlign
		? previewVerticalAlign
		: previewDirection === 'horizontal' || previewDirection === 'horizontal-reverse'
		? 'middle'
		: 'top';

	const styleControlsBackdropFilter = (
		<KadencePanelBody
			title={__('Backdrop Filter', 'kadence-blocks')}
			initialOpen={false}
			panelName={'backdrop-filter-settings'}
			proTag={true}
		>
			<div className="kb-pro-notice">
				<h2>{__('Backdrop Filter', 'kadence-blocks')} </h2>
				<p>{__('Add a backdrop filter with Kadence Blocks Pro!', 'kadence-blocks')} </p>
				<ExternalLink
					href={
						'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=navigation-link'
					}
				>
					{__('Upgrade to Pro', 'kadence-blocks')}
				</ExternalLink>
			</div>
		</KadencePanelBody>
	);
	return (
		<div {...blockProps}>
			<style>
				{'' !== previewFlexGrow
					? `.kadence-column-${uniqueID}, .wp-block-kadence-column > .kadence-inner-column-direction-horizontal > .kadence-column-${uniqueID} { flex-grow: ${previewFlexGrow} }.kadence-column-${uniqueID} > .kadence-inner-column-inner{height:100%;}`
					: ''}
				{overlayOpacity !== undefined && overlayOpacity !== ''
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { opacity: ${overlayOpacity} }`
					: ''}
				{overlay
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { background-color: ${KadenceColorOutput(
							overlay
					  )}; }`
					: ''}
				{overlayBlendMode
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { mix-blend-mode: ${overlayBlendMode}; }`
					: ''}
				{previewOverlay
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { background-image:${previewOverlay}; }`
					: ''}
				{hasOverlayImage && overlayImg[0].bgImgPosition
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { background-position:${overlayImg[0].bgImgPosition}; }`
					: ''}
				{hasOverlayImage && overlayImg[0].bgImgSize
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { background-size:${overlayImg[0].bgImgSize}; }`
					: ''}
				{hasOverlayImage && overlayImg[0].bgImgRepeat
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { background-repeat:${overlayImg[0].bgImgRepeat}; }`
					: ''}
				{hasOverlayImage && overlayImg[0].bgImgAttachment
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { background-attachment:${overlayImg[0].bgImgAttachment}; }`
					: ''}

				{previewRadiusTop
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { border-top-left-radius:${
							previewRadiusTop + (borderRadiusUnit ? borderRadiusUnit : 'px')
					  }; }`
					: ''}
				{previewRadiusRight
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { border-top-right-radius:${
							previewRadiusRight + (borderRadiusUnit ? borderRadiusUnit : 'px')
					  }; }`
					: ''}
				{previewRadiusBottom
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { border-bottom-right-radius:${
							previewRadiusBottom + (borderRadiusUnit ? borderRadiusUnit : 'px')
					  }; }`
					: ''}
				{previewRadiusLeft
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:before { border-bottom-left-radius:${
							previewRadiusLeft + (borderRadiusUnit ? borderRadiusUnit : 'px')
					  }; }`
					: ''}

				{overlayHoverOpacity !== undefined && overlayHoverOpacity !== ''
					? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { opacity: ${overlayHoverOpacity} }`
					: ''}
				{overlayHover
					? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { background-color: ${KadenceColorOutput(
							overlayHover
					  )}; ; }`
					: ''}
				{hoverOverlayBlendMode
					? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { mix-blend-mode: ${hoverOverlayBlendMode} !important; }`
					: ''}
				{previewHoverOverlay
					? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { background-image:${previewHoverOverlay}; }`
					: ''}
				{!previewHoverOverlay && overlayHover
					? `.kadence-column-${uniqueID}:hover .kadence-inner-column-inner:before { background-image:none; }`
					: ''}
				{hasHoverOverlayImage && overlayImgHover[0].bgImgPosition
					? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { background-position:${overlayImgHover[0].bgImgPosition}; }`
					: ''}
				{hasHoverOverlayImage && overlayImgHover[0].bgImgSize
					? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { background-size:${overlayImgHover[0].bgImgSize}; }`
					: ''}
				{hasHoverOverlayImage && overlayImgHover[0].bgImgRepeat
					? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { background-repeat:${overlayImgHover[0].bgImgRepeat}; }`
					: ''}
				{hasHoverOverlayImage && overlayImgHover[0].bgImgAttachment
					? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { background-attachment:${overlayImgHover[0].bgImgAttachment}; }`
					: ''}

				{previewHoverRadiusTop
					? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { border-top-left-radius:${
							previewHoverRadiusTop + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
					  } !important; }`
					: ''}
				{previewHoverRadiusRight
					? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { border-top-right-radius:${
							previewHoverRadiusRight + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
					  } !important; }`
					: ''}
				{previewHoverRadiusBottom
					? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { border-bottom-right-radius:${
							previewHoverRadiusBottom + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
					  } !important; }`
					: ''}
				{previewHoverRadiusLeft
					? `.kadence-column-${uniqueID}:hover > .kadence-inner-column-inner:before { border-bottom-left-radius:${
							previewHoverRadiusLeft + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
					  } !important; }`
					: ''}

				{previewMaxWidth
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner { max-width:${
							previewMaxWidth + previewMaxWidthUnit
					  }; margin-left: auto; margin-right:auto; }`
					: ''}
				{previewMaxWidth
					? `.wp-block-kadence-column > .kadence-inner-column-direction-horizontal > .wp-block-kadence-column.kadence-column-${uniqueID} > .kadence-inner-column-inner, .wp-block-kadence-column > .kadence-inner-column-direction-horizontal-reverse > .wp-block-kadence-column.kadence-column-${uniqueID} > .kadence-inner-column-inner { max-width:100%; margin-left: unset; margin-right:unset; }`
					: ''}
				{previewMaxWidth
					? `.wp-block-kadence-column > .kadence-inner-column-direction-horizontal > .wp-block-kadence-column.kadence-column-${uniqueID}, .wp-block-kadence-column > .kadence-inner-column-direction-horizontal-reverse > .wp-block-kadence-column.kadence-column-${uniqueID} { flex: 0 1 ${
							previewMaxWidth + previewMaxWidthUnit
					  }; }`
					: ''}
				{undefined !== zIndex && '' !== zIndex ? `.kadence-column-${uniqueID} { z-index: ${zIndex}; }` : ''}
				{textColor
					? `.kadence-column-${uniqueID}, .kadence-column-${uniqueID} .kt-svg-icon-list-item-wrap, .kadence-column-${uniqueID} p, .kadence-column-${uniqueID} h1, .kadence-column-${uniqueID} h1.kadence-advancedheading-text, .kadence-column-${uniqueID} h2, .kadence-column-${uniqueID} h2.kadence-advancedheading-text, .kadence-column-${uniqueID} h3, .kadence-column-${uniqueID} h3.kadence-advancedheading-text, .kadence-column-${uniqueID} h4, .kadence-column-${uniqueID} h4.kadence-advancedheading-text, .kadence-column-${uniqueID} h5, .kadence-column-${uniqueID} h5.kadence-advancedheading-text, .kadence-column-${uniqueID} h6, .kadence-column-${uniqueID} h6.kadence-advancedheading-text { color: ${KadenceColorOutput(
							textColor
					  )}; }`
					: ''}
				{linkColor ? `.kadence-column-${uniqueID} a { color: ${KadenceColorOutput(linkColor)}; }` : ''}
				{linkHoverColor
					? `.kadence-column-${uniqueID} a:hover { color: ${KadenceColorOutput(linkHoverColor)}; }`
					: ''}
				{'' !== horizontalGap
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner { column-gap: ${horizontalGap}; }`
					: ''}
				{'' !== previewFlexBasis && null !== previewFlexBasis
					? `.wp-block-kadence-column.kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal > *, .wp-block-kadence-column.kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal-reverse > * { flex-basis: ${
							previewFlexBasis + (flexBasisUnit ? flexBasisUnit : 'px')
					  }; }.kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal > .wp-block-kadence-infobox, .kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal-reverse > .wp-block-kadence-infobox { width:0px; }`
					: ''}
				{'' !== previewFlexBasis
					? `.kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal > .wp-block-kadence-image:not(:last-child), .kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal-reverse > .wp-block-kadence-image:not(:last-child) { margin-bottom: unset; }`
					: ''}
				{'' == previewFlexBasis
					? `.kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal > .kb-image-is-ratio-size:not(.kb-image-max-width-set), .kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal-reverse > .kb-image-is-ratio-size:not(.kb-image-max-width-set) { flex-grow: 1; }`
					: ''}
				{'' == previewFlexBasis
					? `.kadence-column-${uniqueID} > .kadence-inner-column-direction-vertical > .kb-image-is-ratio-size:not(.kb-image-max-width-set), .kadence-column-${uniqueID} > .kadence-inner-column-direction-vertical-reverse > .kb-image-is-ratio-size:not(.kb-image-max-width-set) { align-self: stretch; }`
					: ''}
				{'' == previewFlexBasis
					? `.kadence-column-${uniqueID} > .kadence-inner-column-direction-vertical > .kb-image-is-ratio-size:not(.kb-image-max-width-set), .kadence-column-${uniqueID} > .kadence-inner-column-direction-vertical-reverse > .kb-image-is-ratio-size:not(.kb-image-max-width-set) { align-self: stretch; }`
					: ''}

				{'' !== verticalGap
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner { row-gap: ${verticalGap}; }`
					: ''}

				{previewJustify
					? `.kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal, .kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal-reverse { justify-content: ${previewJustify}; }`
					: ''}
				{previewJustify
					? `.kadence-column-${uniqueID} > .kadence-inner-column-direction-vertical, .kadence-column-${uniqueID} > .kadence-inner-column-direction-vertical-reverse { align-items: ${previewJustify}; }`
					: ''}

				{previewJustify
					? `.kadence-column-${uniqueID}.wp-block-kadence-column > .kadence-inner-column-direction-vertical > *, .kadence-column-${uniqueID}.wp-block-kadence-column > .kadence-inner-column-direction-vertical-reverse > * { max-width: 100%; }`
					: ''}

				{previewJustify
					? `.kadence-column-${uniqueID}.wp-block-kadence-column > .kadence-inner-column-direction-vertical > .block-editor-block-list__block.wp-block.kb-gallery-container.wp-block-kadence-advancedgallery, .kadence-column-${uniqueID}.wp-block-kadence-column > .kadence-inner-column-direction-vertical-reverse > .block-editor-block-list__block.wp-block.kb-gallery-container.wp-block-kadence-advancedgallery { align-self:stretch; }`
					: ''}

				{previewVerticalAlignCSS
					? `.kadence-column-${uniqueID} > .kadence-inner-column-direction-vertical, .kadence-column-${uniqueID} > .kadence-inner-column-direction-vertical-reverse { justify-content: ${previewVerticalAlignCSS}; }`
					: ''}
				{previewVerticalAlignCSS
					? `.kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal, .kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal-reverse { align-items: ${previewVerticalAlignCSS}; }`
					: ''}

				{previewWrap
					? `.kadence-column-${uniqueID} > .kadence-inner-column-direction-horizontal { flex-wrap: ${previewWrap}; }`
					: ''}
				{textColorHover
					? `.kadence-column-${uniqueID}:hover, .kadence-column-${uniqueID}:hover .kt-svg-icon-list-item-wrap, .kadence-column-${uniqueID}:hover p, .kadence-column-${uniqueID}:hover h1, .kadence-column-${uniqueID}:hover h2, .kadence-column-${uniqueID}:hover h3, .kadence-column-${uniqueID}:hover h4, .kadence-column-${uniqueID}:hover h5, .kadence-column-${uniqueID}:hover h6 { color: ${KadenceColorOutput(
							textColorHover
					  )}; }`
					: ''}
				{linkColorHover
					? `.kadence-column-${uniqueID}:hover a { color: ${KadenceColorOutput(linkColorHover)}; }`
					: ''}
				{linkHoverColorHover
					? `.kadence-column-${uniqueID}:hover a:hover { color: ${KadenceColorOutput(linkHoverColorHover)}; }`
					: ''}
				{backgroundHover
					? `.kadence-column-${uniqueID}:hover .kadence-inner-column-inner { background-color: ${KadenceColorOutput(
							backgroundHover
					  )}!important; }`
					: ''}
				{previewHoverBackground
					? `.kadence-column-${uniqueID}:hover .kadence-inner-column-inner { background-image:${previewHoverBackground} !important; }`
					: ''}
				{!previewHoverBackground && backgroundHover
					? `.kadence-column-${uniqueID}:hover .kadence-inner-column-inner { background-image:none!important; }`
					: ''}
				{hasHoverBackgroundImage && backgroundImgHover[0].bgImgPosition
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { background-position:${backgroundImgHover[0].bgImgPosition} !important; }`
					: ''}
				{hasHoverBackgroundImage && backgroundImgHover[0].bgImgSize
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { background-size:${backgroundImgHover[0].bgImgSize} !important; }`
					: ''}
				{hasHoverBackgroundImage && backgroundImgHover[0].bgImgRepeat
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { background-repeat:${backgroundImgHover[0].bgImgRepeat} !important; }`
					: ''}
				{hasHoverBackgroundImage && backgroundImgHover[0].bgImgAttachment
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { background-attachment:${backgroundImgHover[0].bgImgAttachment} !important; }`
					: ''}
				{previewBorderHoverTopStyle
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-top:${previewBorderHoverTopStyle} !important; }`
					: ''}
				{previewBorderHoverRightStyle
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-right:${previewBorderHoverRightStyle} !important; }`
					: ''}
				{previewBorderHoverBottomStyle
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-bottom:${previewBorderHoverBottomStyle} !important; }`
					: ''}
				{previewBorderHoverLeftStyle
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-left:${previewBorderHoverLeftStyle} !important; }`
					: ''}

				{previewHoverRadiusTop
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-top-left-radius:${
							previewHoverRadiusTop + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
					  } !important; }`
					: ''}
				{previewHoverRadiusRight
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-top-right-radius:${
							previewHoverRadiusRight + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
					  } !important; }`
					: ''}
				{previewHoverRadiusBottom
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-bottom-right-radius:${
							previewHoverRadiusBottom + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
					  } !important; }`
					: ''}
				{previewHoverRadiusLeft
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { border-bottom-left-radius:${
							previewHoverRadiusLeft + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
					  } !important; }`
					: ''}
				{collapseOrder && previewDevice === 'Tablet'
					? `.kt-row-layout-row > .innerblocks-wrap > .kadence-column-${uniqueID} { order:${collapseOrder}; }`
					: ''}
				{collapseOrder && previewDevice === 'Mobile'
					? `.kadence-column-${uniqueID} { order:${collapseOrder}; }`
					: ''}

				{displayHoverShadow &&
				undefined !== shadowHover &&
				undefined !== shadowHover[0] &&
				undefined !== shadowHover[0].color
					? `.kadence-column-${uniqueID} > .kadence-inner-column-inner:hover { box-shadow:${
							(undefined !== shadowHover[0].inset && shadowHover[0].inset ? 'inset ' : '') +
							(undefined !== shadowHover[0].hOffset ? shadowHover[0].hOffset : 0) +
							'px ' +
							(undefined !== shadowHover[0].vOffset ? shadowHover[0].vOffset : 0) +
							'px ' +
							(undefined !== shadowHover[0].blur ? shadowHover[0].blur : 14) +
							'px ' +
							(undefined !== shadowHover[0].spread ? shadowHover[0].spread : 0) +
							'px ' +
							KadenceColorOutput(
								undefined !== shadowHover[0].color ? shadowHover[0].color : '#000000',
								undefined !== shadowHover[0].opacity ? shadowHover[0].opacity : 1
							)
					  } !important; }`
					: ''}
				{kadenceBlockCSS && <>{kadenceBlockCSS.replace(/selector/g, `.kadence-column-${uniqueID}`)}</>}
			</style>
			{showSettings('allSettings', 'kadence/column') && (
				<>
					<BlockControls>
						{!inRowBlock && (
							<BlockAlignmentToolbar
								value={align}
								controls={['wide', 'full']}
								onChange={(value) => setAttributes({ align: value })}
							/>
						)}
						<BlockVerticalAlignmentToolbar
							value={actualVerticalAlign === 'middle' ? 'center' : actualVerticalAlign}
							controls={['top', 'center', 'bottom', 'stretch']}
							onChange={(value) => {
								if (value === 'center') {
									setAttributes({ verticalAlignment: 'middle' });
								} else if (value === 'bottom') {
									setAttributes({ verticalAlignment: 'bottom' });
								} else if (value === 'top') {
									setAttributes({ verticalAlignment: 'top' });
								} else if (value === 'stretch') {
									setAttributes({ verticalAlignment: 'stretch' });
								} else {
									setAttributes({ verticalAlignment: '' });
								}
							}}
						/>
						<CopyPasteAttributes
							attributes={attributes}
							excludedAttrs={nonTransAttrs}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
							onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
						/>
					</BlockControls>
					<InspectorControls>
						<InspectorControlTabs panelName={'column'} setActiveTab={setActiveTab} activeTab={activeTab} />
						{activeTab === 'general' && (
							<>
								{showSettings('textAlign', 'kadence/column') && (
									<KadencePanelBody
										title={__('Flex Settings', 'kadence-blocks')}
										panelName={'kb-col-flex-settings'}
									>
										<ResponsiveAlignControls
											label={__('Direction', 'kadence-blocks')}
											value={direction && direction[0] ? direction[0] : 'vertical'}
											tabletValue={direction && direction[1] ? direction[1] : ''}
											mobileValue={direction && direction[2] ? direction[2] : ''}
											onChange={(value) => {
												if (value) {
													setAttributes({
														direction: [
															value,
															undefined !== direction?.[1] ? direction[1] : '',
															undefined !== direction?.[2] ? direction[2] : '',
														],
													});
												}
											}}
											onChangeTablet={(value) => {
												let tempValue = value;
												if (direction && direction[1] && tempValue === direction[1]) {
													tempValue = '';
												}
												setAttributes({
													direction: [
														undefined !== direction?.[0] ? direction[0] : '',
														tempValue,
														undefined !== direction?.[2] ? direction[2] : '',
													],
												});
											}}
											onChangeMobile={(value) => {
												let tempValue = value;
												if (direction && direction[2] && tempValue === direction[2]) {
													tempValue = '';
												}
												setAttributes({
													direction: [
														undefined !== direction?.[0] ? direction[0] : '',
														undefined !== direction?.[1] ? direction[1] : '',
														tempValue,
													],
												});
											}}
											type={'orientation-column'}
										/>
										{(previewDirection === 'horizontal-reverse' ||
											previewDirection === 'horizontal') && (
											<ResponsiveAlignControls
												label={__('Alignment', 'kadence-blocks')}
												value={justifyContent && justifyContent?.[0] ? justifyContent[0] : ''}
												tabletValue={
													justifyContent && justifyContent?.[1] ? justifyContent[1] : ''
												}
												mobileValue={
													justifyContent && justifyContent?.[2] ? justifyContent[2] : ''
												}
												onChange={(value) => {
													let tempValue = value;
													if (
														(justifyContent && justifyContent?.[0]
															? justifyContent[0]
															: '') === value
													) {
														tempValue = '';
													}
													setAttributes({
														justifyContent: [
															tempValue,
															justifyContent && justifyContent[1]
																? justifyContent[1]
																: '',
															justifyContent && justifyContent[2]
																? justifyContent[2]
																: '',
														],
													});
												}}
												onChangeTablet={(value) => {
													let tempValue = value;
													if (
														(justifyContent && justifyContent?.[1]
															? justifyContent[1]
															: '') === value
													) {
														tempValue = '';
													}
													setAttributes({
														justifyContent: [
															justifyContent && justifyContent?.[0]
																? justifyContent[0]
																: '',
															tempValue,
															justifyContent && justifyContent[2]
																? justifyContent[2]
																: '',
														],
													});
												}}
												onChangeMobile={(value) => {
													let tempValue = value;
													if (
														(justifyContent && justifyContent?.[2]
															? justifyContent[2]
															: '') === value
													) {
														tempValue = '';
													}
													setAttributes({
														justifyContent: [
															justifyContent && justifyContent?.[0]
																? justifyContent[0]
																: '',
															justifyContent && justifyContent[1]
																? justifyContent[1]
																: '',
															tempValue,
														],
													});
												}}
												type={'justify-column'}
												reverse={previewDirection === 'horizontal-reverse' ? true : false}
											/>
										)}
										{(previewDirection === 'vertical-reverse' ||
											previewDirection === 'vertical') && (
											<ResponsiveAlignControls
												label={__('Alignment', 'kadence-blocks')}
												value={justifyContent && justifyContent?.[0] ? justifyContent[0] : ''}
												tabletValue={
													justifyContent && justifyContent?.[1] ? justifyContent[1] : ''
												}
												mobileValue={
													justifyContent && justifyContent?.[2] ? justifyContent[2] : ''
												}
												onChange={(value) => {
													let tempValue = value;
													if (
														(justifyContent && justifyContent?.[0]
															? justifyContent[0]
															: '') === value
													) {
														tempValue = '';
													}
													setAttributes({
														justifyContent: [
															tempValue,
															justifyContent && justifyContent[1]
																? justifyContent[1]
																: '',
															justifyContent && justifyContent[2]
																? justifyContent[2]
																: '',
														],
													});
												}}
												onChangeTablet={(value) => {
													let tempValue = value;
													if (
														(justifyContent && justifyContent?.[1]
															? justifyContent[1]
															: '') === value
													) {
														tempValue = '';
													}
													setAttributes({
														justifyContent: [
															justifyContent && justifyContent?.[0]
																? justifyContent[0]
																: '',
															tempValue,
															justifyContent && justifyContent[2]
																? justifyContent[2]
																: '',
														],
													});
												}}
												onChangeMobile={(value) => {
													let tempValue = value;
													if (
														(justifyContent && justifyContent?.[2]
															? justifyContent[2]
															: '') === value
													) {
														tempValue = '';
													}
													setAttributes({
														justifyContent: [
															justifyContent && justifyContent?.[0]
																? justifyContent[0]
																: '',
															justifyContent && justifyContent[1]
																? justifyContent[1]
																: '',
															tempValue,
														],
													});
												}}
												type={'justify-align'}
											/>
										)}
										{(previewDirection === 'horizontal-reverse' ||
											previewDirection === 'horizontal') && (
											<ResponsiveAlignControls
												label={__('Vertical Alignment', 'kadence-blocks')}
												value={verticalAlignment ? verticalAlignment : ''}
												tabletValue={verticalAlignmentTablet ? verticalAlignmentTablet : ''}
												mobileValue={verticalAlignmentMobile ? verticalAlignmentMobile : ''}
												onChange={(value) => {
													let tempValue = value;
													if ((verticalAlignment ? verticalAlignment : '') === value) {
														tempValue = '';
													}
													setAttributes({ verticalAlignment: tempValue });
												}}
												onChangeTablet={(value) => {
													let tempValue = value;
													if (
														(verticalAlignmentTablet ? verticalAlignmentTablet : '') ===
														value
													) {
														tempValue = '';
													}
													setAttributes({ verticalAlignmentTablet: tempValue });
												}}
												onChangeMobile={(value) => {
													let tempValue = value;
													if (
														(verticalAlignmentMobile ? verticalAlignmentMobile : '') ===
														value
													) {
														tempValue = '';
													}
													setAttributes({ verticalAlignmentMobile: tempValue });
												}}
												type={'vertical-column'}
											/>
										)}
										{(previewDirection === 'vertical-reverse' ||
											previewDirection === 'vertical') && (
											<ResponsiveAlignControls
												label={__('Vertical Alignment', 'kadence-blocks')}
												value={verticalAlignment ? verticalAlignment : ''}
												tabletValue={verticalAlignmentTablet ? verticalAlignmentTablet : ''}
												mobileValue={verticalAlignmentMobile ? verticalAlignmentMobile : ''}
												onChange={(value) => {
													let tempValue = value;
													if ((verticalAlignment ? verticalAlignment : '') === value) {
														tempValue = '';
													}
													setAttributes({ verticalAlignment: tempValue });
												}}
												onChangeTablet={(value) => {
													let tempValue = value;
													if (
														(verticalAlignmentTablet ? verticalAlignmentTablet : '') ===
														value
													) {
														tempValue = '';
													}
													setAttributes({ verticalAlignmentTablet: tempValue });
												}}
												onChangeMobile={(value) => {
													let tempValue = value;
													if (
														(verticalAlignmentMobile ? verticalAlignmentMobile : '') ===
														value
													) {
														tempValue = '';
													}
													setAttributes({ verticalAlignmentMobile: tempValue });
												}}
												type={'justify-vertical'}
												reverse={previewDirection === 'vertical-reverse' ? true : false}
											/>
										)}
										{previewDirection === 'horizontal-reverse' ||
										previewDirection === 'horizontal' ? (
											<>
												<ResponsiveRadioRangeControls
													label={__('Horizontal Gap', 'kadence-blocks')}
													options={[
														{ value: 'none', size: 0, label: __('None', 'kadence-blocks') },
														{ value: 'sm', size: 16, label: __('Sm', 'kadence-blocks') },
														{ value: 'md', size: 32, label: __('Md', 'kadence-blocks') },
														{ value: 'lg', size: 64, label: __('Lg', 'kadence-blocks') },
													]}
													value={{
														value:
															undefined !== gutterVariable?.[0] &&
															'' !== gutterVariable?.[0]
																? gutterVariable[0]
																: 'sm',
														size:
															gutter &&
															undefined !== gutter?.[0] &&
															null !== gutter?.[0] &&
															'' !== gutter?.[0]
																? gutter[0]
																: '',
													}}
													onChange={(value, size) => {
														setAttributes({
															gutterVariable: [
																value,
																gutterVariable?.[1] ? gutterVariable[1] : '',
																gutterVariable?.[2] ? gutterVariable[2] : '',
															],
															gutter: [
																size,
																gutter?.[1] ? gutter[1] : '',
																gutter?.[2] ? gutter[2] : '',
															],
														});
													}}
													tabletValue={{
														value:
															undefined !== gutterVariable?.[1] ? gutterVariable[1] : '',
														size:
															gutter &&
															undefined !== gutter?.[1] &&
															null !== gutter?.[1] &&
															'' !== gutter?.[1]
																? gutter[1]
																: '',
													}}
													onChangeTablet={(value, size) => {
														setAttributes({
															gutterVariable: [
																gutterVariable?.[0] ? gutterVariable[0] : '',
																value,
																gutterVariable?.[2] ? gutterVariable[2] : '',
															],
															gutter: [
																gutter?.[0] ? gutter[0] : '',
																size,
																gutter?.[2] ? gutter[2] : '',
															],
														});
													}}
													mobileValue={{
														value:
															undefined !== gutterVariable?.[2] ? gutterVariable[2] : '',
														size:
															gutter &&
															undefined !== gutter?.[2] &&
															null !== gutter?.[2] &&
															'' !== gutter?.[2]
																? gutter[2]
																: '',
													}}
													onChangeMobile={(value, size) => {
														setAttributes({
															gutterVariable: [
																gutterVariable?.[0] ? gutterVariable[0] : '',
																gutterVariable?.[1] ? gutterVariable[1] : '',
																value,
															],
															gutter: [
																gutter?.[0] ? gutter[0] : '',
																gutter?.[1] ? gutter[1] : '',
																size,
															],
														});
													}}
													min={0}
													max={gutterUnit !== 'px' ? 12 : 200}
													step={gutterUnit !== 'px' ? 0.1 : 1}
													unit={gutterUnit ? gutterUnit : 'px'}
													onUnit={(value) => {
														setAttributes({ gutterUnit: value });
													}}
													units={['px', 'em', 'rem', '%', 'vh']}
													defaultValue={'sm'}
													reset={true}
												/>
												<ResponsiveRadioRangeControls
													label={__('Vertical Gap', 'kadence-blocks')}
													options={[
														{ value: 'none', size: 0, label: __('None', 'kadence-blocks') },
														{ value: 'sm', size: 16, label: __('Sm', 'kadence-blocks') },
														{ value: 'md', size: 32, label: __('Md', 'kadence-blocks') },
														{ value: 'lg', size: 64, label: __('Lg', 'kadence-blocks') },
													]}
													value={{
														value:
															undefined !== rowGapVariable?.[0]
																? rowGapVariable[0]
																: 'none',
														size: undefined !== rowGap?.[0] ? rowGap[0] : 0,
													}}
													onChange={(value, size) => {
														setAttributes({
															rowGapVariable: [
																value,
																undefined !== rowGapVariable?.[1]
																	? rowGapVariable[1]
																	: '',
																undefined !== rowGapVariable?.[2]
																	? rowGapVariable[2]
																	: '',
															],
															rowGap: [
																size,
																rowGap?.[1] ? rowGap[1] : '',
																rowGap?.[2] ? rowGap[2] : '',
															],
														});
													}}
													tabletValue={{
														value:
															undefined !== rowGapVariable?.[1] ? rowGapVariable[1] : '',
														size: undefined !== rowGap?.[1] ? rowGap[1] : '',
													}}
													onChangeTablet={(value, size) => {
														setAttributes({
															rowGapVariable: [
																undefined !== rowGapVariable?.[0]
																	? rowGapVariable[0]
																	: '',
																value,
																undefined !== rowGapVariable?.[2]
																	? rowGapVariable[2]
																	: '',
															],
															rowGap: [
																rowGap?.[0] ? rowGap[0] : 10,
																size,
																rowGap?.[2] ? rowGap[2] : '',
															],
														});
													}}
													mobileValue={{
														value:
															undefined !== rowGapVariable?.[2] ? rowGapVariable[2] : '',
														size: undefined !== rowGap?.[2] ? rowGap[2] : '',
													}}
													onChangeMobile={(value, size) => {
														setAttributes({
															rowGapVariable: [
																undefined !== rowGapVariable?.[0]
																	? rowGapVariable[0]
																	: '',
																undefined !== rowGapVariable?.[1]
																	? rowGapVariable[1]
																	: '',
																value,
															],
															rowGap: [
																rowGap?.[0] ? rowGap[0] : 10,
																rowGap?.[2] ? rowGap[2] : '',
																size,
															],
														});
													}}
													min={0}
													max={rowGapUnit !== 'px' ? 12 : 200}
													step={rowGapUnit !== 'px' ? 0.1 : 1}
													unit={rowGapUnit ? rowGapUnit : 'px'}
													onUnit={(value) => {
														setAttributes({ rowGapUnit: value });
													}}
													units={['px', 'em', 'rem', '%', 'vh']}
													defaultValue={metadata.attributes.rowGapVariable.default[0]}
													reset={true}
												/>
												<SmallResponsiveControl
													label={__('Wrap Content', 'kadence-blocks')}
													desktopChildren={
														<SelectControl
															value={wrapContent && wrapContent[0] ? wrapContent[0] : ''}
															options={[
																{ value: '', label: __('Inherit', 'kadence-blocks') },
																{
																	value: 'nowrap',
																	label: __('No Wrap', 'kadence-blocks'),
																},
																{ value: 'wrap', label: __('Wrap', 'kadence-blocks') },
																{
																	value: 'wrap-reverse',
																	label: __('Wrap Reverse', 'kadence-blocks'),
																},
															]}
															onChange={(value) =>
																setAttributes({
																	wrapContent: [
																		value,
																		wrapContent && wrapContent[1]
																			? wrapContent[1]
																			: '',
																		wrapContent && wrapContent[2]
																			? wrapContent[2]
																			: '',
																	],
																})
															}
														/>
													}
													tabletChildren={
														<SelectControl
															value={wrapContent && wrapContent[1] ? wrapContent[1] : ''}
															options={[
																{ value: '', label: __('Inherit', 'kadence-blocks') },
																{
																	value: 'nowrap',
																	label: __('No Wrap', 'kadence-blocks'),
																},
																{ value: 'wrap', label: __('Wrap', 'kadence-blocks') },
																{
																	value: 'wrap-reverse',
																	label: __('Wrap Reverse', 'kadence-blocks'),
																},
															]}
															onChange={(value) =>
																setAttributes({
																	wrapContent: [
																		wrapContent && wrapContent[0]
																			? wrapContent[0]
																			: '',
																		value,
																		wrapContent && wrapContent[2]
																			? wrapContent[2]
																			: '',
																	],
																})
															}
														/>
													}
													mobileChildren={
														<SelectControl
															value={wrapContent && wrapContent[2] ? wrapContent[2] : ''}
															options={[
																{ value: '', label: __('Inherit', 'kadence-blocks') },
																{
																	value: 'nowrap',
																	label: __('No Wrap', 'kadence-blocks'),
																},
																{ value: 'wrap', label: __('Wrap', 'kadence-blocks') },
																{
																	value: 'wrap-reverse',
																	label: __('Wrap Reverse', 'kadence-blocks'),
																},
															]}
															onChange={(value) =>
																setAttributes({
																	wrapContent: [
																		wrapContent && wrapContent[0]
																			? wrapContent[0]
																			: '',
																		wrapContent && wrapContent[1]
																			? wrapContent[1]
																			: '',
																		value,
																	],
																})
															}
														/>
													}
												/>

												{wrapContent !== 'nowrap' && wrapContent !== '' && (
													<ResponsiveRangeControls
														label={__('Flex Basis', 'kadence-blocks')}
														value={flexBasis && '' !== flexBasis[0] ? flexBasis[0] : ''}
														onChange={(value) =>
															setAttributes({
																flexBasis: [
																	value,
																	flexBasis && flexBasis[1] ? flexBasis[1] : '',
																	flexBasis && flexBasis[2] ? flexBasis[2] : '',
																],
															})
														}
														tabletValue={
															flexBasis && '' !== flexBasis[1] ? flexBasis[1] : ''
														}
														onChangeTablet={(value) =>
															setAttributes({
																flexBasis: [
																	flexBasis && flexBasis[0] ? flexBasis[0] : 10,
																	value,
																	flexBasis && flexBasis[2] ? flexBasis[2] : '',
																],
															})
														}
														mobileValue={
															flexBasis && '' !== flexBasis[2] ? flexBasis[2] : ''
														}
														onChangeMobile={(value) =>
															setAttributes({
																flexBasis: [
																	flexBasis && flexBasis[0] ? flexBasis[0] : 10,
																	flexBasis && flexBasis[2] ? flexBasis[2] : '',
																	value,
																],
															})
														}
														min={0}
														max={flexBasisUnit === '%' ? 100 : 1000}
														step={flexBasisUnit === '%' ? 0.1 : 1}
														unit={flexBasisUnit}
														onUnit={(value) => setAttributes({ flexBasisUnit: value })}
														units={['%', 'px']}
													/>
												)}
											</>
										) : (
											<>
												<ResponsiveRadioRangeControls
													label={__('Vertical Gap', 'kadence-blocks')}
													options={[
														{ value: 'none', size: 0, label: __('None', 'kadence-blocks') },
														{ value: 'sm', size: 16, label: __('Sm', 'kadence-blocks') },
														{ value: 'md', size: 32, label: __('Md', 'kadence-blocks') },
														{ value: 'lg', size: 64, label: __('Lg', 'kadence-blocks') },
													]}
													value={{
														value:
															undefined !== rowGapVariable?.[0]
																? rowGapVariable[0]
																: 'none',
														size: undefined !== rowGap?.[0] ? rowGap[0] : 0,
													}}
													onChange={(value, size) => {
														setAttributes({
															rowGapVariable: [
																value,
																undefined !== rowGapVariable?.[1]
																	? rowGapVariable[1]
																	: '',
																undefined !== rowGapVariable?.[2]
																	? rowGapVariable[2]
																	: '',
															],
															rowGap: [
																size,
																rowGap?.[1] ? rowGap[1] : '',
																rowGap?.[2] ? rowGap[2] : '',
															],
														});
													}}
													tabletValue={{
														value:
															undefined !== rowGapVariable?.[1] ? rowGapVariable[1] : '',
														size: undefined !== rowGap?.[1] ? rowGap[1] : '',
													}}
													onChangeTablet={(value, size) => {
														setAttributes({
															rowGapVariable: [
																undefined !== rowGapVariable?.[0]
																	? rowGapVariable[0]
																	: '',
																value,
																undefined !== rowGapVariable?.[2]
																	? rowGapVariable[2]
																	: '',
															],
															rowGap: [
																rowGap?.[0] ? rowGap[0] : 10,
																size,
																rowGap?.[2] ? rowGap[2] : '',
															],
														});
													}}
													mobileValue={{
														value:
															undefined !== rowGapVariable?.[2] ? rowGapVariable[2] : '',
														size: undefined !== rowGap?.[2] ? rowGap[2] : '',
													}}
													onChangeMobile={(value, size) => {
														setAttributes({
															rowGapVariable: [
																undefined !== rowGapVariable?.[0]
																	? rowGapVariable[0]
																	: '',
																undefined !== rowGapVariable?.[1]
																	? rowGapVariable[1]
																	: '',
																value,
															],
															rowGap: [
																rowGap?.[0] ? rowGap[0] : 10,
																rowGap?.[2] ? rowGap[2] : '',
																size,
															],
														});
													}}
													min={0}
													max={rowGapUnit !== 'px' ? 12 : 200}
													step={rowGapUnit !== 'px' ? 0.1 : 1}
													unit={rowGapUnit ? rowGapUnit : 'px'}
													onUnit={(value) => {
														setAttributes({ rowGapUnit: value });
													}}
													units={['px', 'em', 'rem', '%', 'vh']}
													defaultValue={metadata.attributes.rowGapVariable.default[0]}
													reset={true}
												/>
											</>
										)}
										<ResponsiveAlignControls
											label={__('Text Alignment', 'kadence-blocks')}
											value={textAlign && textAlign[0] ? textAlign[0] : ''}
											mobileValue={textAlign && textAlign[2] ? textAlign[2] : ''}
											tabletValue={textAlign && textAlign[1] ? textAlign[1] : ''}
											onChange={(nextAlign) =>
												setAttributes({
													textAlign: [
														nextAlign,
														textAlign && textAlign[1] ? textAlign[1] : '',
														textAlign && textAlign[2] ? textAlign[2] : '',
													],
												})
											}
											onChangeTablet={(nextAlign) =>
												setAttributes({
													textAlign: [
														textAlign && textAlign[0] ? textAlign[0] : '',
														nextAlign,
														textAlign && textAlign[2] ? textAlign[2] : '',
													],
												})
											}
											onChangeMobile={(nextAlign) =>
												setAttributes({
													textAlign: [
														textAlign && textAlign[0] ? textAlign[0] : '',
														textAlign && textAlign[1] ? textAlign[1] : '',
														nextAlign,
													],
												})
											}
										/>
									</KadencePanelBody>
								)}
								{!inRowBlock && showSettings('container', 'kadence/column') && (
									<KadencePanelBody
										title={__('Content Max Width', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-col-width-style-settings'}
									>
										<ResponsiveRangeControls
											label={__('Max Width', 'kadence-blocks')}
											value={
												undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : ''
											}
											onChange={(value) => {
												setAttributes({
													maxWidth: [
														value,
														undefined !== maxWidth && undefined !== maxWidth[1]
															? maxWidth[1]
															: '',
														undefined !== maxWidth && undefined !== maxWidth[2]
															? maxWidth[2]
															: '',
													],
												});
											}}
											tabletValue={
												undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : ''
											}
											onChangeTablet={(value) => {
												setAttributes({
													maxWidth: [
														undefined !== maxWidth && undefined !== maxWidth[0]
															? maxWidth[0]
															: '',
														value,
														undefined !== maxWidth && undefined !== maxWidth[2]
															? maxWidth[2]
															: '',
													],
												});
											}}
											mobileValue={
												undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : ''
											}
											onChangeMobile={(value) => {
												setAttributes({
													maxWidth: [
														undefined !== maxWidth && undefined !== maxWidth[0]
															? maxWidth[0]
															: '',
														undefined !== maxWidth && undefined !== maxWidth[1]
															? maxWidth[1]
															: '',
														value,
													],
												});
											}}
											min={0}
											max={previewMaxWidthUnit === 'px' ? 2000 : 100}
											step={1}
											unit={previewMaxWidthUnit}
											allowResponsiveUnitChange={true}
											onUnit={(value) => {
												const device = 'Desktop' === previewDevice ? '' : previewDevice;
												setAttributes({ ['maxWidth' + device + 'Unit']: value });
											}}
											units={['px', '%', 'vw']}
											reset={() => {
												setAttributes({
													maxWidth: ['', '', ''],
												});
											}}
										/>
									</KadencePanelBody>
								)}

								{showSettings('overlayLink', 'kadence/column') && (
									<KadencePanelBody
										title={__('Overlay Link', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-col-overlay-link'}
									>
										<p className="kadence-sidebar-notice">
											{__(
												'Please note, If a link is added nothing else inside of the section will be selectable.',
												'kadence-blocks'
											)}
										</p>
										<URLInputControl
											label={__('Link entire section', 'kadence-blocks')}
											url={link}
											onChangeUrl={(value) => setAttributes({ link: value })}
											additionalControls={true}
											opensInNewTab={undefined !== linkTarget ? linkTarget : false}
											onChangeTarget={(value) => setAttributes({ linkTarget: value })}
											linkNoFollow={undefined !== linkNoFollow ? linkNoFollow : false}
											onChangeFollow={(value) => setAttributes({ linkNoFollow: value })}
											linkSponsored={undefined !== linkSponsored ? linkSponsored : false}
											onChangeSponsored={(value) => setAttributes({ linkSponsored: value })}
											dynamicAttribute={'link'}
											allowClear={true}
											isSelected={isSelected}
											attributes={attributes}
											setAttributes={setAttributes}
											name={'kadence/column'}
											clientId={clientId}
											context={context}
										/>
										<DynamicTextInputControl
											label={__('Link Title', 'kadence-blocks')}
											value={linkTitle}
											onChange={(value) => setAttributes({ linkTitle: value })}
											dynamicAttribute={'linkTitle'}
											allowClear={true}
											isSelected={isSelected}
											attributes={attributes}
											setAttributes={setAttributes}
											name={'kadence/column'}
											clientId={clientId}
											context={context}
										/>
									</KadencePanelBody>
								)}
							</>
						)}

						{activeTab === 'advanced' && (
							<>
								{showSettings('paddingMargin', 'kadence/column') && (
									<KadencePanelBody panelName={'kb-column-padding'}>
										<ResponsiveMeasureRangeControl
											label={__('Padding', 'kadence-blocks')}
											value={padding}
											tabletValue={tabletPadding}
											mobileValue={mobilePadding}
											onChange={(value) => {
												setAttributes({ padding: value });
											}}
											onChangeTablet={(value) => {
												setAttributes({ tabletPadding: value });
											}}
											onChangeMobile={(value) => {
												setAttributes({ mobilePadding: value });
											}}
											min={0}
											max={paddingType === 'em' || paddingType === 'rem' ? 24 : 999}
											step={paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1}
											unit={paddingType}
											units={['px', 'em', 'rem', '%', 'vh', 'vw']}
											onUnit={(value) => setAttributes({ paddingType: value })}
											onMouseOver={paddingMouseOver.onMouseOver}
											onMouseOut={paddingMouseOver.onMouseOut}
										/>
										<ResponsiveMeasureRangeControl
											label={__('Margin', 'kadence-blocks')}
											value={margin}
											tabletValue={tabletMargin}
											mobileValue={mobileMargin}
											onChange={(value) => {
												setAttributes({ margin: value });
											}}
											onChangeTablet={(value) => {
												setAttributes({ tabletMargin: value });
											}}
											onChangeMobile={(value) => {
												setAttributes({ mobileMargin: value });
											}}
											min={marginType === 'em' || marginType === 'rem' ? -24 : -999}
											max={marginType === 'em' || marginType === 'rem' ? 24 : 999}
											step={marginType === 'em' || marginType === 'rem' ? 0.1 : 1}
											unit={marginType}
											units={['px', 'em', 'rem', '%', 'vh', 'vw']}
											onUnit={(value) => setAttributes({ marginType: value })}
											onMouseOver={marginMouseOver.onMouseOver}
											onMouseOut={marginMouseOver.onMouseOut}
											allowAuto={true}
										/>
									</KadencePanelBody>
								)}
								<div className="kt-sidebar-settings-spacer"></div>
								{showSettings('container', 'kadence/column') && (
									<KadencePanelBody
										title={__('Structure Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-col-container-style-settings'}
									>
										<SelectControl
											label={__('Container HTML tag', 'kadence-blocks')}
											value={htmlTag}
											options={[
												{ value: 'div', label: 'div' },
												{ value: 'header', label: 'header' },
												{ value: 'section', label: 'section' },
												{ value: 'article', label: 'article' },
												{ value: 'main', label: 'main' },
												{ value: 'aside', label: 'aside' },
												{ value: 'footer', label: 'footer' },
											]}
											onChange={(value) => setAttributes({ htmlTag: value })}
										/>
										<ResponsiveRangeControls
											label={__('Min Height', 'kadence-blocks')}
											value={undefined !== height && undefined !== height[0] ? height[0] : ''}
											onChange={(value) => {
												setAttributes({
													height: [
														value,
														undefined !== height && undefined !== height[1]
															? height[1]
															: '',
														undefined !== height && undefined !== height[2]
															? height[2]
															: '',
													],
												});
											}}
											tabletValue={
												undefined !== height && undefined !== height[1] ? height[1] : ''
											}
											onChangeTablet={(value) => {
												setAttributes({
													height: [
														undefined !== height && undefined !== height[0]
															? height[0]
															: '',
														value,
														undefined !== height && undefined !== height[2]
															? height[2]
															: '',
													],
												});
											}}
											mobileValue={
												undefined !== height && undefined !== height[2] ? height[2] : ''
											}
											onChangeMobile={(value) => {
												setAttributes({
													height: [
														undefined !== height && undefined !== height[0]
															? height[0]
															: '',
														undefined !== height && undefined !== height[1]
															? height[1]
															: '',
														value,
													],
												});
											}}
											min={0}
											max={heightUnit === 'px' ? 2000 : 200}
											step={1}
											unit={heightUnit ? heightUnit : 'px'}
											onUnit={(value) => {
												setAttributes({ heightUnit: value });
											}}
											units={['px', 'vw', 'vh']}
											reset={true}
										/>
										<ResponsiveRangeControls
											label={__('Flex Grow', 'kadence-blocks')}
											value={
												undefined !== flexGrow && undefined !== flexGrow[0] ? flexGrow[0] : ''
											}
											onChange={(value) => {
												setAttributes({
													flexGrow: [
														value,
														undefined !== flexGrow && undefined !== flexGrow[1]
															? flexGrow[1]
															: '',
														undefined !== flexGrow && undefined !== flexGrow[2]
															? flexGrow[2]
															: '',
													],
												});
											}}
											tabletValue={
												undefined !== flexGrow && undefined !== flexGrow[1] ? flexGrow[1] : ''
											}
											onChangeTablet={(value) => {
												setAttributes({
													flexGrow: [
														undefined !== flexGrow && undefined !== flexGrow[0]
															? flexGrow[0]
															: '',
														value,
														undefined !== flexGrow && undefined !== flexGrow[2]
															? flexGrow[2]
															: '',
													],
												});
											}}
											mobileValue={
												undefined !== flexGrow && undefined !== flexGrow[2] ? flexGrow[2] : ''
											}
											onChangeMobile={(value) => {
												setAttributes({
													flexGrow: [
														undefined !== flexGrow && undefined !== flexGrow[0]
															? flexGrow[0]
															: '',
														undefined !== flexGrow && undefined !== flexGrow[1]
															? flexGrow[1]
															: '',
														value,
													],
												});
											}}
											min={0}
											max={200}
											step={1}
											showUnits={false}
											reset={true}
										/>
										<RangeControl
											label={__('Z Index Control', 'kadence-blocks')}
											value={zIndex}
											onChange={(value) => {
												setAttributes({
													zIndex: value,
												});
											}}
											min={-200}
											max={200}
											reset={true}
										/>
										{inRowBlock && (
											<RangeControl
												label={__('Mobile Collapse Order', 'kadence-blocks')}
												value={collapseOrder}
												onChange={(value) => {
													setAttributes({
														collapseOrder: value,
													});
												}}
												min={-10}
												max={10}
												reset={true}
											/>
										)}
									</KadencePanelBody>
								)}
								<KadencePanelBody
									title={__('Sticky Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-col-sticky-settings'}
								>
									<ToggleControl
										label={__('Make sticky', 'kadence-blocks')}
										help={__(
											'This will stick the section to viewport for the height of outer container.',
											'kadence-blocks'
										)}
										checked={undefined !== sticky ? sticky : false}
										onChange={(value) => setAttributes({ sticky: value })}
									/>
									{sticky && (
										<ResponsiveRangeControls
											label={__('Sticky Header Offset', 'kadence-blocks')}
											value={
												undefined !== stickyOffset && undefined !== stickyOffset[0]
													? stickyOffset[0]
													: ''
											}
											onChange={(value) => {
												setAttributes({
													stickyOffset: [
														value,
														undefined !== stickyOffset && undefined !== stickyOffset[1]
															? stickyOffset[1]
															: '',
														undefined !== stickyOffset && undefined !== stickyOffset[2]
															? stickyOffset[2]
															: '',
													],
												});
											}}
											tabletValue={
												undefined !== stickyOffset && undefined !== stickyOffset[1]
													? stickyOffset[1]
													: ''
											}
											onChangeTablet={(value) => {
												setAttributes({
													stickyOffset: [
														undefined !== stickyOffset && undefined !== stickyOffset[0]
															? stickyOffset[0]
															: '',
														value,
														undefined !== stickyOffset && undefined !== stickyOffset[2]
															? stickyOffset[2]
															: '',
													],
												});
											}}
											mobileValue={
												undefined !== stickyOffset && undefined !== stickyOffset[2]
													? stickyOffset[2]
													: ''
											}
											onChangeMobile={(value) => {
												setAttributes({
													stickyOffset: [
														undefined !== stickyOffset && undefined !== stickyOffset[0]
															? stickyOffset[0]
															: '',
														undefined !== stickyOffset && undefined !== stickyOffset[1]
															? stickyOffset[1]
															: '',
														value,
													],
												});
											}}
											min={0}
											max={stickyOffsetUnit === 'px' ? 2000 : 100}
											step={1}
											unit={stickyOffsetUnit ? stickyOffsetUnit : 'px'}
											onUnit={(value) => {
												setAttributes({ stickyOffsetUnit: value });
											}}
											units={['px', 'rem', 'vh']}
											defaultValue={1}
											reset={true}
										/>
									)}
								</KadencePanelBody>
								<KadencePanelBody
									title={__('Visibility Settings', 'kadence-blocks')}
									panelName={'kb-col-visibility-settings'}
									initialOpen={false}
								>
									<ToggleControl
										label={__('Hide on Desktop', 'kadence-blocks')}
										checked={undefined !== vsdesk ? vsdesk : false}
										onChange={(value) => setAttributes({ vsdesk: value })}
									/>
									<ToggleControl
										label={__('Hide on Tablet', 'kadence-blocks')}
										checked={undefined !== vstablet ? vstablet : false}
										onChange={(value) => setAttributes({ vstablet: value })}
									/>
									<ToggleControl
										label={__('Hide on Mobile', 'kadence-blocks')}
										checked={undefined !== vsmobile ? vsmobile : false}
										onChange={(value) => setAttributes({ vsmobile: value })}
									/>
								</KadencePanelBody>
								{inFormBlock && <KadenceFormConditionals {...props} />}
								<KadenceBlockDefaults
									attributes={attributes}
									defaultAttributes={metadata.attributes}
									blockSlug={metadata.name}
									excludedAttrs={nonTransAttrs}
								/>
							</>
						)}

						{activeTab === 'style' && (
							<>
								<KadencePanelBody
									title={__('Background', 'kadence-blocks')}
									initialOpen={true}
									panelName={'kb-col-bg-settings'}
								>
									<HoverToggleControl
										hover={
											<>
												<BackgroundTypeControl
													label={__('Hover Type', 'kadence-blocks')}
													type={backgroundHoverType ? backgroundHoverType : 'normal'}
													onChange={(value) => setAttributes({ backgroundHoverType: value })}
													allowedTypes={['normal', 'gradient']}
												/>
												{'gradient' === backgroundHoverType && (
													<GradientControl
														value={gradientHover}
														onChange={(value) => setAttributes({ gradientHover: value })}
														gradients={[]}
													/>
												)}
												{'gradient' !== backgroundHoverType && (
													<>
														<PopColorControl
															label={__('Background Color', 'kadence-blocks')}
															value={backgroundHover ? backgroundHover : ''}
															default={''}
															onChange={(value) =>
																setAttributes({ backgroundHover: value })
															}
														/>
														<KadenceBackgroundControl
															label={__('Background Image', 'kadence-blocks')}
															hasImage={hasHoverBackgroundImage}
															imageURL={
																backgroundImgHover &&
																backgroundImgHover[0] &&
																backgroundImgHover[0].bgImg
																	? backgroundImgHover[0].bgImg
																	: ''
															}
															imageID={
																backgroundImgHover &&
																backgroundImgHover[0] &&
																backgroundImgHover[0].bgImgID
																	? backgroundImgHover[0].bgImgID
																	: ''
															}
															imagePosition={
																backgroundImgHover &&
																backgroundImgHover[0] &&
																backgroundImgHover[0].bgImgPosition
																	? backgroundImgHover[0].bgImgPosition
																	: 'center center'
															}
															imageSize={
																backgroundImgHover &&
																backgroundImgHover[0] &&
																backgroundImgHover[0].bgImgSize
																	? backgroundImgHover[0].bgImgSize
																	: 'cover'
															}
															imageRepeat={
																backgroundImgHover &&
																backgroundImgHover[0] &&
																backgroundImgHover[0].bgImgRepeat
																	? backgroundImgHover[0].bgImgRepeat
																	: 'no-repeat'
															}
															imageAttachment={
																backgroundImgHover &&
																backgroundImgHover[0] &&
																backgroundImgHover[0].bgImgAttachment
																	? backgroundImgHover[0].bgImgAttachment
																	: 'scroll'
															}
															onRemoveImage={onRemoveHoverBGImage}
															onSaveImage={(img) => {
																saveHoverBackgroundImage({
																	bgImgID: img.id,
																	bgImg: img.url,
																});
															}}
															onSaveURL={(newURL) => {
																if (
																	newURL !==
																	(backgroundImgHover &&
																	backgroundImgHover[0] &&
																	backgroundImgHover[0].bgImg
																		? backgroundImgHover[0].bgImg
																		: '')
																) {
																	saveHoverBackgroundImage({
																		bgImgID: undefined,
																		bgImg: newURL,
																	});
																}
															}}
															onSavePosition={(value) =>
																saveHoverBackgroundImage({ bgImgPosition: value })
															}
															onSaveSize={(value) =>
																saveHoverBackgroundImage({ bgImgSize: value })
															}
															onSaveRepeat={(value) =>
																saveHoverBackgroundImage({ bgImgRepeat: value })
															}
															onSaveAttachment={(value) =>
																saveHoverBackgroundImage({ bgImgAttachment: value })
															}
															disableMediaButtons={
																backgroundImgHover &&
																backgroundImgHover[0] &&
																backgroundImgHover[0].bgImg
																	? backgroundImgHover[0].bgImg
																	: ''
															}
															dynamicAttribute="backgroundImgHover:0:bgImg"
															isSelected={isSelected}
															attributes={attributes}
															setAttributes={setAttributes}
															name={'kadence/column'}
															clientId={clientId}
															context={context}
														/>
													</>
												)}
											</>
										}
										normal={
											<>
												<BackgroundTypeControl
													label={__('Type', 'kadence-blocks')}
													type={backgroundType ? backgroundType : 'normal'}
													onChange={(value) => setAttributes({ backgroundType: value })}
													allowedTypes={['normal', 'gradient']}
												/>
												{'gradient' === backgroundType && (
													<GradientControl
														value={gradient}
														onChange={(value) => setAttributes({ gradient: value })}
														gradients={[]}
													/>
												)}
												{'gradient' !== backgroundType && (
													<>
														<PopColorControl
															label={__('Background Color', 'kadence-blocks')}
															value={background ? background : ''}
															default={''}
															opacityValue={backgroundOpacity}
															onChange={(value) => setAttributes({ background: value })}
															onOpacityChange={(value) =>
																setAttributes({ backgroundOpacity: value })
															}
														/>
														<KadenceBackgroundControl
															label={__('Background Image', 'kadence-blocks')}
															hasImage={hasBackgroundImage}
															imageURL={
																backgroundImg &&
																backgroundImg[0] &&
																backgroundImg[0].bgImg
																	? backgroundImg[0].bgImg
																	: ''
															}
															imageID={
																backgroundImg &&
																backgroundImg[0] &&
																backgroundImg[0].bgImgID
																	? backgroundImg[0].bgImgID
																	: ''
															}
															imagePosition={
																backgroundImg &&
																backgroundImg[0] &&
																backgroundImg[0].bgImgPosition
																	? backgroundImg[0].bgImgPosition
																	: 'center center'
															}
															imageSize={
																backgroundImg &&
																backgroundImg[0] &&
																backgroundImg[0].bgImgSize
																	? backgroundImg[0].bgImgSize
																	: 'cover'
															}
															imageRepeat={
																backgroundImg &&
																backgroundImg[0] &&
																backgroundImg[0].bgImgRepeat
																	? backgroundImg[0].bgImgRepeat
																	: 'no-repeat'
															}
															imageAttachment={
																backgroundImg &&
																backgroundImg[0] &&
																backgroundImg[0].bgImgAttachment
																	? backgroundImg[0].bgImgAttachment
																	: 'scroll'
															}
															onRemoveImage={onRemoveBGImage}
															onSaveImage={(img) => {
																saveBackgroundImage({
																	bgImgID: img.id,
																	bgImg: img.url,
																});
															}}
															onSaveURL={(newURL) => {
																if (
																	newURL !==
																	(backgroundImg &&
																	backgroundImg[0] &&
																	backgroundImg[0].bgImg
																		? backgroundImg[0].bgImg
																		: '')
																) {
																	saveBackgroundImage({
																		bgImgID: undefined,
																		bgImg: newURL,
																	});
																}
															}}
															onSavePosition={(value) =>
																saveBackgroundImage({ bgImgPosition: value })
															}
															onSaveSize={(value) =>
																saveBackgroundImage({ bgImgSize: value })
															}
															onSaveRepeat={(value) =>
																saveBackgroundImage({ bgImgRepeat: value })
															}
															onSaveAttachment={(value) =>
																saveBackgroundImage({ bgImgAttachment: value })
															}
															disableMediaButtons={
																backgroundImg &&
																backgroundImg[0] &&
																backgroundImg[0].bgImg
																	? backgroundImg[0].bgImg
																	: ''
															}
															dynamicAttribute="backgroundImg:0:bgImg"
															isSelected={isSelected}
															attributes={attributes}
															setAttributes={setAttributes}
															name={'kadence/column'}
															clientId={clientId}
															context={context}
														/>
													</>
												)}
											</>
										}
									/>
								</KadencePanelBody>

								<>
									{applyFilters(
										'kadence.styleControlsBackdropFilter',
										styleControlsBackdropFilter,
										props
									)}
								</>

								<KadencePanelBody
									title={__('Background Overlay', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-col-bg-overlay-settings'}
								>
									<HoverToggleControl
										hover={
											<>
												<BackgroundTypeControl
													label={__('Hover Type', 'kadence-blocks')}
													type={overlayHoverType ? overlayHoverType : 'normal'}
													onChange={(value) => setAttributes({ overlayHoverType: value })}
													allowedTypes={['normal', 'gradient']}
												/>
												<RangeControl
													label={__('Overlay Opacity', 'kadence-blocks')}
													value={overlayHoverOpacity}
													onChange={(value) => {
														setAttributes({
															overlayHoverOpacity: value,
														});
													}}
													step={0.01}
													min={0}
													max={1}
													reset={true}
												/>
												{'gradient' === overlayHoverType && (
													<GradientControl
														value={overlayGradientHover}
														onChange={(value) =>
															setAttributes({ overlayGradientHover: value })
														}
														gradients={[]}
													/>
												)}
												{'gradient' !== overlayHoverType && (
													<>
														<PopColorControl
															label={__('Background Color', 'kadence-blocks')}
															value={overlayHover ? overlayHover : ''}
															default={''}
															onChange={(value) => setAttributes({ overlayHover: value })}
														/>
														<KadenceBackgroundControl
															label={__('Background Image', 'kadence-blocks')}
															hasImage={hasHoverOverlayImage}
															imageURL={
																overlayImgHover &&
																overlayImgHover[0] &&
																overlayImgHover[0].bgImg
																	? overlayImgHover[0].bgImg
																	: ''
															}
															imageID={
																overlayImgHover &&
																overlayImgHover[0] &&
																overlayImgHover[0].bgImgID
																	? overlayImgHover[0].bgImgID
																	: ''
															}
															imagePosition={
																overlayImgHover &&
																overlayImgHover[0] &&
																overlayImgHover[0].bgImgPosition
																	? overlayImgHover[0].bgImgPosition
																	: 'center center'
															}
															imageSize={
																overlayImgHover &&
																overlayImgHover[0] &&
																overlayImgHover[0].bgImgSize
																	? overlayImgHover[0].bgImgSize
																	: 'cover'
															}
															imageRepeat={
																overlayImgHover &&
																overlayImgHover[0] &&
																overlayImgHover[0].bgImgRepeat
																	? overlayImgHover[0].bgImgRepeat
																	: 'no-repeat'
															}
															imageAttachment={
																overlayImgHover &&
																overlayImgHover[0] &&
																overlayImgHover[0].bgImgAttachment
																	? overlayImgHover[0].bgImgAttachment
																	: 'scroll'
															}
															onRemoveImage={onRemoveHoverOverlayImage}
															onSaveImage={(img) => {
																saveHoverOverlayImage({
																	bgImgID: img.id,
																	bgImg: img.url,
																});
															}}
															onSaveURL={(newURL) => {
																if (
																	newURL !==
																	(overlayImgHover &&
																	overlayImgHover[0] &&
																	overlayImgHover[0].bgImg
																		? overlayImgHover[0].bgImg
																		: '')
																) {
																	saveHoverOverlayImage({
																		bgImgID: undefined,
																		bgImg: newURL,
																	});
																}
															}}
															onSavePosition={(value) =>
																saveHoverOverlayImage({ bgImgPosition: value })
															}
															onSaveSize={(value) =>
																saveHoverOverlayImage({ bgImgSize: value })
															}
															onSaveRepeat={(value) =>
																saveHoverOverlayImage({ bgImgRepeat: value })
															}
															onSaveAttachment={(value) =>
																saveHoverOverlayImage({ bgImgAttachment: value })
															}
															disableMediaButtons={
																overlayImgHover &&
																overlayImgHover[0] &&
																overlayImgHover[0].bgImg
																	? overlayImgHover[0].bgImg
																	: ''
															}
															dynamicAttribute="overlayImgHover:0:bgImg"
															isSelected={isSelected}
															attributes={attributes}
															setAttributes={setAttributes}
															name={'kadence/column'}
															clientId={clientId}
															context={context}
														/>
														<SelectControl
															label={__('Hover Blend Mode', 'kadence-blocks')}
															value={
																hoverOverlayBlendMode ? hoverOverlayBlendMode : 'none'
															}
															options={BLEND_OPTIONS}
															onChange={(value) =>
																setAttributes({ hoverOverlayBlendMode: value })
															}
														/>
														<p>
															{__(
																'Notice: Blend Mode not supported in all browsers',
																'kadence-blocks'
															)}
														</p>
													</>
												)}
											</>
										}
										normal={
											<>
												<BackgroundTypeControl
													label={__('Type', 'kadence-blocks')}
													type={overlayType ? overlayType : 'normal'}
													onChange={(value) => setAttributes({ overlayType: value })}
													allowedTypes={['normal', 'gradient']}
												/>
												<RangeControl
													label={__('Overlay Opacity', 'kadence-blocks')}
													value={overlayOpacity}
													defaultValue={metadata.attributes.overlayOpacity.default}
													onChange={(value) => {
														setAttributes({
															overlayOpacity: value,
														});
													}}
													step={0.01}
													min={0}
													max={1}
													reset={true}
												/>
												{'gradient' === overlayType && (
													<GradientControl
														value={overlayGradient}
														onChange={(value) => setAttributes({ overlayGradient: value })}
														gradients={[]}
													/>
												)}
												{'gradient' !== overlayType && (
													<>
														<PopColorControl
															label={__('Background Color', 'kadence-blocks')}
															value={overlay ? overlay : ''}
															default={''}
															onChange={(value) => setAttributes({ overlay: value })}
														/>
														<KadenceBackgroundControl
															label={__('Background Image', 'kadence-blocks')}
															hasImage={hasOverlayImage}
															imageURL={
																overlayImg && overlayImg[0] && overlayImg[0].bgImg
																	? overlayImg[0].bgImg
																	: ''
															}
															imageID={
																overlayImg && overlayImg[0] && overlayImg[0].bgImgID
																	? overlayImg[0].bgImgID
																	: ''
															}
															imagePosition={
																overlayImg &&
																overlayImg[0] &&
																overlayImg[0].bgImgPosition
																	? overlayImg[0].bgImgPosition
																	: 'center center'
															}
															imageSize={
																overlayImg && overlayImg[0] && overlayImg[0].bgImgSize
																	? overlayImg[0].bgImgSize
																	: 'cover'
															}
															imageRepeat={
																overlayImg && overlayImg[0] && overlayImg[0].bgImgRepeat
																	? overlayImg[0].bgImgRepeat
																	: 'no-repeat'
															}
															imageAttachment={
																overlayImg &&
																overlayImg[0] &&
																overlayImg[0].bgImgAttachment
																	? overlayImg[0].bgImgAttachment
																	: 'scroll'
															}
															onRemoveImage={onRemoveOverlayImage}
															onSaveImage={(img) => {
																saveOverlayImage({
																	bgImgID: img.id,
																	bgImg: img.url,
																});
															}}
															onSaveURL={(newURL) => {
																if (
																	newURL !==
																	(overlayImg && overlayImg[0] && overlayImg[0].bgImg
																		? overlayImg[0].bgImg
																		: '')
																) {
																	saveOverlayImage({
																		bgImgID: undefined,
																		bgImg: newURL,
																	});
																}
															}}
															onSavePosition={(value) =>
																saveOverlayImage({ bgImgPosition: value })
															}
															onSaveSize={(value) =>
																saveOverlayImage({ bgImgSize: value })
															}
															onSaveRepeat={(value) =>
																saveOverlayImage({ bgImgRepeat: value })
															}
															onSaveAttachment={(value) =>
																saveOverlayImage({ bgImgAttachment: value })
															}
															disableMediaButtons={
																overlayImg && overlayImg[0] && overlayImg[0].bgImg
																	? overlayImg[0].bgImg
																	: ''
															}
															dynamicAttribute="overlayImg:0:bgImg"
															isSelected={isSelected}
															attributes={attributes}
															setAttributes={setAttributes}
															name={'kadence/column'}
															clientId={clientId}
															context={context}
														/>
														<SelectControl
															label={__('Blend Mode', 'kadence-blocks')}
															value={overlayBlendMode ? overlayBlendMode : 'none'}
															options={BLEND_OPTIONS}
															onChange={(value) =>
																setAttributes({ overlayBlendMode: value })
															}
														/>
														<p>
															{__(
																'Notice: Blend Mode not supported in all browsers',
																'kadence-blocks'
															)}
														</p>
													</>
												)}
											</>
										}
									/>
								</KadencePanelBody>
								<KadencePanelBody
									title={__('Border Styles', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-col-border-settings'}
								>
									<HoverToggleControl
										hover={
											<>
												<ResponsiveBorderControl
													label={__('Border', 'kadence-blocks')}
													value={borderHoverStyle}
													tabletValue={tabletBorderHoverStyle}
													mobileValue={mobileBorderHoverStyle}
													onChange={(value) => setAttributes({ borderHoverStyle: value })}
													onChangeTablet={(value) =>
														setAttributes({ tabletBorderHoverStyle: value })
													}
													onChangeMobile={(value) =>
														setAttributes({ mobileBorderHoverStyle: value })
													}
												/>
												<ResponsiveMeasurementControls
													label={__('Border Radius', 'kadence-blocks')}
													value={borderHoverRadius}
													tabletValue={tabletBorderHoverRadius}
													mobileValue={mobileBorderHoverRadius}
													onChange={(value) => setAttributes({ borderHoverRadius: value })}
													onChangeTablet={(value) =>
														setAttributes({ tabletBorderHoverRadius: value })
													}
													onChangeMobile={(value) =>
														setAttributes({ mobileBorderHoverRadius: value })
													}
													unit={borderHoverRadiusUnit}
													units={['px', 'em', 'rem', '%']}
													onUnit={(value) => setAttributes({ borderHoverRadiusUnit: value })}
													max={
														borderHoverRadiusUnit === 'em' ||
														borderHoverRadiusUnit === 'rem'
															? 24
															: 500
													}
													step={
														borderHoverRadiusUnit === 'em' ||
														borderHoverRadiusUnit === 'rem'
															? 0.1
															: 1
													}
													min={0}
													isBorderRadius={true}
													allowEmpty={true}
												/>
												<BoxShadowControl
													label={__('Box Shadow', 'kadence-blocks')}
													enable={
														undefined !== displayHoverShadow ? displayHoverShadow : false
													}
													color={
														undefined !== shadowHover &&
														undefined !== shadowHover[0] &&
														undefined !== shadowHover[0].color
															? shadowHover[0].color
															: '#000000'
													}
													colorDefault={'#000000'}
													onArrayChange={(color, opacity) => {
														saveShadowHover({ color, opacity });
													}}
													opacity={
														undefined !== shadowHover &&
														undefined !== shadowHover[0] &&
														undefined !== shadowHover[0].opacity
															? shadowHover[0].opacity
															: 0.2
													}
													hOffset={
														undefined !== shadowHover &&
														undefined !== shadowHover[0] &&
														undefined !== shadowHover[0].hOffset
															? shadowHover[0].hOffset
															: 0
													}
													vOffset={
														undefined !== shadowHover &&
														undefined !== shadowHover[0] &&
														undefined !== shadowHover[0].vOffset
															? shadowHover[0].vOffset
															: 0
													}
													blur={
														undefined !== shadowHover &&
														undefined !== shadowHover[0] &&
														undefined !== shadowHover[0].blur
															? shadowHover[0].blur
															: 14
													}
													spread={
														undefined !== shadowHover &&
														undefined !== shadowHover[0] &&
														undefined !== shadowHover[0].spread
															? shadowHover[0].spread
															: 0
													}
													inset={
														undefined !== shadowHover &&
														undefined !== shadowHover[0] &&
														undefined !== shadowHover[0].inset
															? shadowHover[0].inset
															: false
													}
													onEnableChange={(value) => {
														setAttributes({
															displayHoverShadow: value,
														});
													}}
													onColorChange={(value) => {
														saveShadowHover({ color: value });
													}}
													onOpacityChange={(value) => {
														saveShadowHover({ opacity: value });
													}}
													onHOffsetChange={(value) => {
														saveShadowHover({ hOffset: value });
													}}
													onVOffsetChange={(value) => {
														saveShadowHover({ vOffset: value });
													}}
													onBlurChange={(value) => {
														saveShadowHover({ blur: value });
													}}
													onSpreadChange={(value) => {
														saveShadowHover({ spread: value });
													}}
													onInsetChange={(value) => {
														saveShadowHover({ inset: value });
													}}
												/>
											</>
										}
										normal={
											<>
												<ResponsiveBorderControl
													label={__('Border', 'kadence-blocks')}
													value={borderStyle ? JSON.parse(JSON.stringify(borderStyle)) : ''}
													tabletValue={tabletBorderStyle}
													mobileValue={mobileBorderStyle}
													onChange={(value) => setAttributes({ borderStyle: value })}
													onChangeTablet={(value) =>
														setAttributes({ tabletBorderStyle: value })
													}
													onChangeMobile={(value) =>
														setAttributes({ mobileBorderStyle: value })
													}
												/>
												<ResponsiveMeasurementControls
													label={__('Border Radius', 'kadence-blocks')}
													value={borderRadius}
													tabletValue={tabletBorderRadius}
													mobileValue={mobileBorderRadius}
													onChange={(value) => setAttributes({ borderRadius: value })}
													onChangeTablet={(value) =>
														setAttributes({ tabletBorderRadius: value })
													}
													onChangeMobile={(value) =>
														setAttributes({ mobileBorderRadius: value })
													}
													unit={borderRadiusUnit}
													units={['px', 'em', 'rem', '%']}
													onUnit={(value) => setAttributes({ borderRadiusUnit: value })}
													max={
														borderRadiusUnit === 'em' || borderRadiusUnit === 'rem'
															? 24
															: 500
													}
													step={
														borderRadiusUnit === 'em' || borderRadiusUnit === 'rem'
															? 0.1
															: 1
													}
													min={0}
													isBorderRadius={true}
													allowEmpty={true}
												/>
												<BoxShadowControl
													label={__('Box Shadow', 'kadence-blocks')}
													enable={undefined !== displayShadow ? displayShadow : false}
													color={
														undefined !== shadow &&
														undefined !== shadow[0] &&
														undefined !== shadow[0].color
															? shadow[0].color
															: '#000000'
													}
													colorDefault={'#000000'}
													onArrayChange={(color, opacity) => {
														saveShadow({ color, opacity });
													}}
													opacity={
														undefined !== shadow &&
														undefined !== shadow[0] &&
														undefined !== shadow[0].opacity
															? shadow[0].opacity
															: 0.2
													}
													hOffset={
														undefined !== shadow &&
														undefined !== shadow[0] &&
														undefined !== shadow[0].hOffset
															? shadow[0].hOffset
															: 0
													}
													vOffset={
														undefined !== shadow &&
														undefined !== shadow[0] &&
														undefined !== shadow[0].vOffset
															? shadow[0].vOffset
															: 0
													}
													blur={
														undefined !== shadow &&
														undefined !== shadow[0] &&
														undefined !== shadow[0].blur
															? shadow[0].blur
															: 14
													}
													spread={
														undefined !== shadow &&
														undefined !== shadow[0] &&
														undefined !== shadow[0].spread
															? shadow[0].spread
															: 0
													}
													inset={
														undefined !== shadow &&
														undefined !== shadow[0] &&
														undefined !== shadow[0].inset
															? shadow[0].inset
															: false
													}
													onEnableChange={(value) => {
														setAttributes({
															displayShadow: value,
														});
													}}
													onColorChange={(value) => {
														saveShadow({ color: value });
													}}
													onOpacityChange={(value) => {
														saveShadow({ opacity: value });
													}}
													onHOffsetChange={(value) => {
														saveShadow({ hOffset: value });
													}}
													onVOffsetChange={(value) => {
														saveShadow({ vOffset: value });
													}}
													onBlurChange={(value) => {
														saveShadow({ blur: value });
													}}
													onSpreadChange={(value) => {
														saveShadow({ spread: value });
													}}
													onInsetChange={(value) => {
														saveShadow({ inset: value });
													}}
												/>
											</>
										}
									/>
								</KadencePanelBody>
								<div className="kt-sidebar-settings-spacer"></div>
								{showSettings('textColor', 'kadence/column') && (
									<KadencePanelBody
										title={__('Text Color Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-col-text-color-settings'}
									>
										<HoverToggleControl
											hover={
												<ColorGroup>
													<PopColorControl
														label={__('Text Color', 'kadence-blocks')}
														value={textColorHover ? textColorHover : ''}
														default={''}
														onChange={(value) => setAttributes({ textColorHover: value })}
													/>
													<PopColorControl
														label={__('Text Link Color', 'kadence-blocks')}
														value={linkColorHover ? linkColorHover : ''}
														default={''}
														onChange={(value) => setAttributes({ linkColorHover: value })}
													/>
													<PopColorControl
														label={__('Text Link Hover Color', 'kadence-blocks')}
														value={linkHoverColorHover ? linkHoverColorHover : ''}
														default={''}
														onChange={(value) =>
															setAttributes({ linkHoverColorHover: value })
														}
													/>
												</ColorGroup>
											}
											normal={
												<ColorGroup>
													<PopColorControl
														label={__('Text Color', 'kadence-blocks')}
														value={textColor ? textColor : ''}
														default={''}
														onChange={(value) => setAttributes({ textColor: value })}
													/>
													<PopColorControl
														label={__('Text Link Color', 'kadence-blocks')}
														value={linkColor ? linkColor : ''}
														default={''}
														onChange={(value) => setAttributes({ linkColor: value })}
													/>
													<PopColorControl
														label={__('Text Link Hover Color', 'kadence-blocks')}
														value={linkHoverColor ? linkHoverColor : ''}
														default={''}
														onChange={(value) => setAttributes({ linkHoverColor: value })}
													/>
												</ColorGroup>
											}
										/>
									</KadencePanelBody>
								)}
							</>
						)}
					</InspectorControls>
				</>
			)}
			<div
				id={`animate-id${uniqueID}`}
				data-aos={kadenceAnimation ? kadenceAnimation : undefined}
				data-aos-duration={
					kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration
						? kadenceAOSOptions[0].duration
						: undefined
				}
				data-aos-easing={
					kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing
						? kadenceAOSOptions[0].easing
						: undefined
				}
				style={{
					minHeight: undefined !== previewMinHeight ? previewMinHeight + previewMinHeightUnit : undefined,
					paddingLeft:
						undefined !== previewPaddingLeft
							? getSpacingOptionOutput(previewPaddingLeft, previewPaddingType)
							: undefined,
					paddingRight:
						undefined !== previewPaddingRight
							? getSpacingOptionOutput(previewPaddingRight, previewPaddingType)
							: undefined,
					paddingTop:
						undefined !== previewPaddingTop
							? getSpacingOptionOutput(previewPaddingTop, previewPaddingType)
							: undefined,
					paddingBottom:
						undefined !== previewPaddingBottom
							? getSpacingOptionOutput(previewPaddingBottom, previewPaddingType)
							: undefined,
					marginLeft:
						undefined !== previewMarginLeft
							? getSpacingOptionOutput(previewMarginLeft, previewMarginType)
							: undefined,
					marginRight:
						undefined !== previewMarginRight
							? getSpacingOptionOutput(previewMarginRight, previewMarginType)
							: undefined,
					marginTop:
						undefined !== previewMarginTop
							? getSpacingOptionOutput(previewMarginTop, previewMarginType)
							: undefined,
					marginBottom:
						undefined !== previewMarginBottom
							? getSpacingOptionOutput(previewMarginBottom, previewMarginType)
							: undefined,
					textAlign: previewAlign ? previewAlign : undefined,
					backgroundColor: backgroundString,
					backgroundImage: previewBackground ? previewBackground : undefined,
					backgroundSize:
						previewBackgroundImg && previewBackgroundImg[0] && previewBackgroundImg[0].bgImgSize
							? previewBackgroundImg[0].bgImgSize
							: undefined,
					backgroundPosition:
						previewBackgroundImg && previewBackgroundImg[0] && previewBackgroundImg[0].bgImgPosition
							? previewBackgroundImg[0].bgImgPosition
							: undefined,
					backgroundRepeat:
						previewBackgroundImg && previewBackgroundImg[0] && previewBackgroundImg[0].bgImgRepeat
							? previewBackgroundImg[0].bgImgRepeat
							: undefined,
					backgroundAttachment:
						previewBackgroundImg && previewBackgroundImg[0] && previewBackgroundImg[0].bgImgAttachment
							? previewBackgroundImg[0].bgImgAttachment
							: undefined,
					borderTop: previewBorderTopStyle ? previewBorderTopStyle : undefined,
					borderRight: previewBorderRightStyle ? previewBorderRightStyle : undefined,
					borderBottom: previewBorderBottomStyle ? previewBorderBottomStyle : undefined,
					borderLeft: previewBorderLeftStyle ? previewBorderLeftStyle : undefined,
					borderTopLeftRadius: previewRadiusTop
						? previewRadiusTop + (borderRadiusUnit ? borderRadiusUnit : 'px')
						: undefined,
					borderTopRightRadius: previewRadiusRight
						? previewRadiusRight + (borderRadiusUnit ? borderRadiusUnit : 'px')
						: undefined,
					borderBottomRightRadius: previewRadiusBottom
						? previewRadiusBottom + (borderRadiusUnit ? borderRadiusUnit : 'px')
						: undefined,
					borderBottomLeftRadius: previewRadiusLeft
						? previewRadiusLeft + (borderRadiusUnit ? borderRadiusUnit : 'px')
						: undefined,
					boxShadow:
						undefined !== displayShadow &&
						displayShadow &&
						undefined !== shadow &&
						undefined !== shadow[0] &&
						undefined !== shadow[0].color
							? (undefined !== shadow[0].inset && shadow[0].inset ? 'inset ' : '') +
							  (undefined !== shadow[0].hOffset ? shadow[0].hOffset : 0) +
							  'px ' +
							  (undefined !== shadow[0].vOffset ? shadow[0].vOffset : 0) +
							  'px ' +
							  (undefined !== shadow[0].blur ? shadow[0].blur : 14) +
							  'px ' +
							  (undefined !== shadow[0].spread ? shadow[0].spread : 0) +
							  'px ' +
							  KadenceColorOutput(
									undefined !== shadow[0].color ? shadow[0].color : '#000000',
									undefined !== shadow[0].opacity ? shadow[0].opacity : 1
							  )
							: undefined,
					'-webkit-backdrop-filter': backdropFilterString !== undefined ? backdropFilterString : undefined,
					'backdrop-filter': backdropFilterString !== undefined ? backdropFilterString : undefined,
				}}
				{...innerBlocksProps}
			></div>
			<SpacingVisualizer
				style={{
					marginLeft:
						undefined !== previewMarginLeft
							? getSpacingOptionOutput(previewMarginLeft, previewMarginType)
							: undefined,
					marginRight:
						undefined !== previewMarginRight
							? getSpacingOptionOutput(previewMarginRight, previewMarginType)
							: undefined,
					marginTop:
						undefined !== previewMarginTop
							? getSpacingOptionOutput(previewMarginTop, previewMarginType)
							: undefined,
					marginBottom:
						undefined !== previewMarginBottom
							? getSpacingOptionOutput(previewMarginBottom, previewMarginType)
							: undefined,
				}}
				type="inside"
				forceShow={paddingMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewPaddingTop, previewPaddingType),
					getSpacingOptionOutput(previewPaddingRight, previewPaddingType),
					getSpacingOptionOutput(previewPaddingBottom, previewPaddingType),
					getSpacingOptionOutput(previewPaddingLeft, previewPaddingType),
				]}
			/>
			<SpacingVisualizer
				type="outsideVertical"
				forceShow={marginMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewMarginTop, previewMarginType),
					getSpacingOptionOutput(previewMarginRight, previewMarginType),
					getSpacingOptionOutput(previewMarginBottom, previewMarginType),
					getSpacingOptionOutput(previewMarginLeft, previewMarginType),
				]}
			/>
		</div>
	);
}
export default SectionEdit;
