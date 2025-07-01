/**
 * BLOCK: Kadence Row / Layout
 */

/**
 * Import Icons
 */
import {
	rowIcon,
	twoColIcon,
	threeColIcon,
	twoLeftGoldenIcon,
	twoRightGoldenIcon,
	leftHalfIcon,
	rightHalfIcon,
	centerHalfIcon,
	wideCenterIcon,
	exWideCenterIcon,
	fourColIcon,
	lFourFortyIcon,
	rFourFortyIcon,
	fiveColIcon,
	sixColIcon,
} from '@kadence/icons';

/**
 * Import External
 */
import Select from 'react-select';
import { times, dropRight, debounce, map } from 'lodash';
import classnames from 'classnames';
/**
 * Import Kadence Components
 */
import {
	RangeControl,
	ResponsiveMeasureRangeControl,
	ResponsiveRangeControls,
	KadencePanelBody,
	InspectorControlTabs,
	KadenceBlockDefaults,
	SpacingVisualizer,
	CopyPasteAttributes,
	ColumnDragResizer,
} from '@kadence/components';

import {
	KadenceColorOutput,
	getPreviewSize,
	showSettings,
	mouseOverVisualizer,
	setBlockDefaults,
	getUniqueId,
	getInQueryBlock,
	setDynamicState,
	getPostOrFseId,
	hasKadenceCustomCss,
} from '@kadence/helpers';

/**
 * Import Block Specific Components
 */
import PrebuiltModal from '../../plugins/prebuilt-library/prebuilt-library';
import Overlay from './row-overlay';
import RowBackground from './row-background';
import ContentWidthIcon from './content-width-icons';
import LayoutControls from './layout-controls';
import StyleControls from './style-controls';
import PaddingResizer from './padding-resizer';
import renderSVGDivider from './render-svg-divider';
import GridVisualizer from './gridvisualizer';
import { getGutterTotal, getPreviewGutterSize, getSpacingOptionOutput } from './utils';
import { SPACING_SIZES_MAP, COLUMN_WIDTH_MAP } from './constants';
/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';
/**
 * Import WordPress Internals
 */
import { useEffect, useState, useRef } from '@wordpress/element';
import {
	InspectorControls,
	BlockControls,
	BlockAlignmentToolbar,
	InspectorAdvancedControls,
	useInnerBlocksProps,
	BlockVerticalAlignmentControl,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	Button,
	ButtonGroup,
	Popover,
	ToolbarGroup,
	ToolbarButton,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import { withDispatch, useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { blockDefault, brush, settings, plusCircle } from '@wordpress/icons';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = ['kadence/column'];

/**
 * Build the row edit
 */
function RowLayoutEditContainer(props) {
	const {
		attributes,
		setAttributes,
		updateAlignment,
		insertSection,
		context,
		updateColumns,
		toggleSelection,
		isSelected,
		clientId,
		name,
	} = props;
	const {
		uniqueID,
		columns,
		mobileLayout,
		currentTab,
		colLayout,
		tabletLayout,
		columnGutter,
		collapseGutter,
		collapseOrder,
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
		bgColor,
		bgImg,
		bgImgAttachment,
		bgImgSize,
		bgImgPosition,
		bgImgRepeat,
		bgImgID,
		verticalAlignment,
		overlayOpacity,
		overlayBgImg,
		overlayBgImgAttachment,
		overlayBgImgID,
		overlayBgImgPosition,
		overlayBgImgRepeat,
		overlayBgImgSize,
		currentOverlayTab,
		overlayBlendMode,
		overlayGradAngle,
		overlayGradLoc,
		overlayGradLocSecond,
		overlayGradType,
		overlay,
		overlaySecond,
		htmlTag,
		minHeight,
		maxWidth,
		bottomSep,
		bottomSepColor,
		bottomSepHeight,
		bottomSepHeightMobile,
		bottomSepHeightTab,
		bottomSepWidth,
		bottomSepWidthMobile,
		bottomSepWidthTab,
		topSep,
		topSepColor,
		topSepHeight,
		topSepHeightMobile,
		topSepHeightTab,
		topSepWidth,
		topSepWidthMobile,
		topSepWidthTab,
		firstColumnWidth,
		firstColumnWidthTablet,
		firstColumnWidthMobile,
		textColor,
		linkColor,
		linkHoverColor,
		tabletPadding,
		topMarginT,
		bottomMarginT,
		minHeightUnit,
		maxWidthUnit,
		marginUnit,
		columnsUnlocked,
		tabletBackground,
		tabletOverlay,
		mobileBackground,
		mobileOverlay,
		columnsInnerHeight,
		zIndex,
		backgroundInline,
		backgroundSettingTab,
		backgroundSliderCount,
		backgroundSlider,
		inheritMaxWidth,
		backgroundSliderSettings,
		backgroundVideo,
		backgroundVideoType,
		overlaySecondOpacity,
		overlayFirstOpacity,
		paddingUnit,
		align,
		minHeightTablet,
		minHeightMobile,
		bgColorClass,
		gradient,
		overlayGradient,
		vsdesk,
		vstablet,
		vsmobile,
		loggedInUser,
		loggedIn,
		loggedOut,
		loggedInShow,
		rcpAccess,
		rcpMembership,
		rcpMembershipLevel,
		borderWidth,
		tabletBorderWidth,
		mobileBorderWidth,
		borderRadius,
		tabletBorderRadius,
		mobileBorderRadius,
		border,
		tabletBorder,
		mobileBorder,
		isPrebuiltModal,
		responsiveMaxWidth,
		kadenceBlockCSS,
		customGutter,
		gutterType,
		padding,
		mobilePadding,
		margin,
		tabletMargin,
		mobileMargin,
		customRowGutter,
		rowType,
		tabletGutter,
		mobileGutter,
		mobileRowGutter,
		tabletRowGutter,
		templateLock,
		kbVersion,
		borderStyle,
		mobileBorderStyle,
		tabletBorderStyle,
		inQueryBlock,
		breakoutLeft,
		breakoutRight,
		topSepHeightUnit,
		bottomSepHeightUnit,
		borderRadiusOverflow,
	} = attributes;
	const { isPreviewMode } = useSelect((_select) => {
		const { __unstableIsPreviewMode } = _select(blockEditorStore).getSettings();
		return {
			isPreviewMode: __unstableIsPreviewMode,
		};
	}, []);

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, previewDevice, innerItemCount, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				innerItemCount: select(blockEditorStore).getBlockCount(clientId),
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
		setBlockDefaults('kadence/rowlayout', attributes);
		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueId, clientId);
		}
		const isInQueryBlock = getInQueryBlock(context, inQueryBlock);
		if (attributes.inQueryBlock !== isInQueryBlock) {
			attributes.inQueryBlock = isInQueryBlock;
			setAttributes({ inQueryBlock: isInQueryBlock });
		}
		// Update from old gutter settings.
		if (columnGutter == 'wide') {
			setAttributes({
				columnGutter: 'custom',
				customGutter: [
					40,
					customGutter && customGutter[1] ? customGutter[1] : '',
					customGutter && customGutter[2] ? customGutter[2] : '',
				],
			});
		} else if (columnGutter == 'narrow') {
			setAttributes({
				columnGutter: 'custom',
				customGutter: [
					20,
					customGutter && customGutter[1] ? customGutter[1] : '',
					customGutter && customGutter[2] ? customGutter[2] : '',
				],
			});
		} else if (columnGutter == 'widest') {
			setAttributes({
				columnGutter: 'custom',
				customGutter: [
					80,
					customGutter && customGutter[1] ? customGutter[1] : '',
					customGutter && customGutter[2] ? customGutter[2] : '',
				],
			});
		}

		// Update from old padding settings.
		if ('' !== topPadding || '' !== rightPadding || '' !== bottomPadding || '' !== leftPadding) {
			setAttributes({
				padding: [
					'' !== topPadding ? topPadding : 25,
					rightPadding,
					'' !== bottomPadding ? bottomPadding : 25,
					leftPadding,
				],
				topPadding: '',
				rightPadding: '',
				bottomPadding: '',
				leftPadding: '',
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
		// Update from old margin settings.
		if ('' !== topMargin || '' !== bottomMargin) {
			setAttributes({
				margin: ['' !== topMargin ? topMargin : '', '', '' !== bottomMargin ? bottomMargin : '', ''],
				topMargin: '',
				bottomMargin: '',
			});
		}
		if ('' !== topMarginT || '' !== bottomMarginT) {
			setAttributes({
				tabletMargin: ['' !== topMarginT ? topMarginT : '', '', '' !== bottomMarginT ? bottomMarginT : '', ''],
				topMarginT: '',
				bottomMarginT: '',
			});
		}
		if ('' !== topMarginM || '' !== bottomMarginM) {
			setAttributes({
				mobileMargin: ['' !== topMarginM ? topMarginM : '', '', '' !== bottomMarginM ? bottomMarginM : '', ''],
				topMarginM: '',
				bottomMarginM: '',
			});
		}
		// Update from old gradient settings.
		if (currentOverlayTab == 'grad') {
			const newDeskGradient =
				'radial' === overlayGradType
					? `radial-gradient(ellipse at ${overlayBgImgPosition}, ${
							overlay
								? KadenceColorOutput(
										overlay,
										undefined !== overlayFirstOpacity && '' !== overlayFirstOpacity
											? overlayFirstOpacity
											: 1
									)
								: ''
						} ${overlayGradLoc}%, ${
							overlaySecond
								? KadenceColorOutput(
										overlaySecond,
										undefined !== overlaySecondOpacity && '' !== overlaySecondOpacity
											? overlaySecondOpacity
											: 1
									)
								: ''
						} ${overlayGradLocSecond}%)`
					: `linear-gradient(${overlayGradAngle}deg, ${
							overlay
								? KadenceColorOutput(
										overlay,
										undefined !== overlayFirstOpacity && '' !== overlayFirstOpacity
											? overlayFirstOpacity
											: 1
									)
								: ''
						} ${overlayGradLoc}%, ${
							overlaySecond
								? KadenceColorOutput(
										overlaySecond,
										undefined !== overlaySecondOpacity && '' !== overlaySecondOpacity
											? overlaySecondOpacity
											: 1
									)
								: ''
						} ${overlayGradLocSecond}%)`;
			setAttributes({ overlayGradient: newDeskGradient, currentOverlayTab: 'gradient' });
		}
		if (
			tabletOverlay &&
			tabletOverlay[0] &&
			tabletOverlay[0].currentOverlayTab &&
			'grad' === tabletOverlay[0].currentOverlayTab
		) {
			const saveTabletOverlay = (value) => {
				const newUpdate = tabletOverlay.map((item, index) => {
					if (0 === index) {
						item = { ...item, ...value };
					}
					return item;
				});
				setAttributes({
					tabletOverlay: newUpdate,
				});
			};
			const newTabGradient =
				'radial' === tabletOverlay[0].overlayGradType
					? `radial-gradient(ellipse at ${tabletOverlay[0].overlayBgImgPosition}, ${
							tabletOverlay[0].overlay
								? KadenceColorOutput(
										tabletOverlay[0].overlay,
										undefined !== tabletOverlay[0].overlayFirstOpacity &&
											'' !== tabletOverlay[0].overlayFirstOpacity
											? overlayFirstOpacity
											: 1
									)
								: ''
						} ${tabletOverlay[0].overlayGradLoc}%, ${
							tabletOverlay[0].overlaySecond
								? KadenceColorOutput(
										tabletOverlay[0].overlaySecond,
										undefined !== tabletOverlay[0].overlaySecondOpacity &&
											'' !== tabletOverlay[0].overlaySecondOpacity
											? tabletOverlay[0].overlaySecondOpacity
											: 1
									)
								: ''
						} ${tabletOverlay[0].overlayGradLocSecond}%)`
					: `linear-gradient(${tabletOverlay[0].overlayGradAngle}deg, ${
							tabletOverlay[0].overlay
								? KadenceColorOutput(
										tabletOverlay[0].overlay,
										undefined !== overlayFirstOpacity && '' !== tabletOverlay[0].overlayFirstOpacity
											? tabletOverlay[0].overlayFirstOpacity
											: 1
									)
								: ''
						} ${tabletOverlay[0].overlayGradLoc}%, ${
							tabletOverlay[0].overlaySecond
								? KadenceColorOutput(
										tabletOverlay[0].overlaySecond,
										undefined !== tabletOverlay[0].overlaySecondOpacity &&
											'' !== tabletOverlay[0].tabletOverlay[0].overlaySecondOpacity
											? tabletOverlay[0].overlaySecondOpacity
											: 1
									)
								: ''
						} ${tabletOverlay[0].overlayGradLocSecond}%)`;
			saveTabletOverlay({ gradient: newTabGradient, currentOverlayTab: 'gradient' });
		}
		if (
			mobileOverlay &&
			mobileOverlay[0] &&
			mobileOverlay[0].currentOverlayTab &&
			'grad' === mobileOverlay[0].currentOverlayTab
		) {
			const saveMobileOverlay = (value) => {
				const newUpdate = mobileOverlay.map((item, index) => {
					if (0 === index) {
						item = { ...item, ...value };
					}
					return item;
				});
				setAttributes({
					mobileOverlay: newUpdate,
				});
			};
			const newMobileGradient =
				'radial' === mobileOverlay[0].overlayGradType
					? `radial-gradient(ellipse at ${mobileOverlay[0].overlayBgImgPosition}, ${
							mobileOverlay[0].overlay
								? KadenceColorOutput(
										mobileOverlay[0].overlay,
										undefined !== mobileOverlay[0].overlayFirstOpacity &&
											'' !== mobileOverlay[0].overlayFirstOpacity
											? overlayFirstOpacity
											: 1
									)
								: ''
						} ${mobileOverlay[0].overlayGradLoc}%, ${
							mobileOverlay[0].overlaySecond
								? KadenceColorOutput(
										mobileOverlay[0].overlaySecond,
										undefined !== mobileOverlay[0].overlaySecondOpacity &&
											'' !== mobileOverlay[0].overlaySecondOpacity
											? mobileOverlay[0].overlaySecondOpacity
											: 1
									)
								: ''
						} ${mobileOverlay[0].overlayGradLocSecond}%)`
					: `linear-gradient(${mobileOverlay[0].overlayGradAngle}deg, ${
							mobileOverlay[0].overlay
								? KadenceColorOutput(
										mobileOverlay[0].overlay,
										undefined !== overlayFirstOpacity && '' !== mobileOverlay[0].overlayFirstOpacity
											? mobileOverlay[0].overlayFirstOpacity
											: 1
									)
								: ''
						} ${mobileOverlay[0].overlayGradLoc}%, ${
							mobileOverlay[0].overlaySecond
								? KadenceColorOutput(
										mobileOverlay[0].overlaySecond,
										undefined !== mobileOverlay[0].overlaySecondOpacity &&
											'' !== mobileOverlay[0].mobileOverlay[0].overlaySecondOpacity
											? mobileOverlay[0].overlaySecondOpacity
											: 1
									)
								: ''
						} ${mobileOverlay[0].overlayGradLocSecond}%)`;
			saveMobileOverlay({ gradient: newMobileGradient, currentOverlayTab: 'gradient' });
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
		// Update from old border settings.
		const tempTabletBorderStyle = JSON.parse(
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
		let updateTabletBorderStyle = false;
		if ('' !== tabletBorder) {
			tempTabletBorderStyle[0].top[0] = tabletBorder;
			tempTabletBorderStyle[0].right[0] = tabletBorder;
			tempTabletBorderStyle[0].bottom[0] = tabletBorder;
			tempTabletBorderStyle[0].left[0] = tabletBorder;
			updateTabletBorderStyle = true;
			setAttributes({ tabletBorder: '' });
		}
		if (
			'' !== tabletBorderWidth?.[0] ||
			'' !== tabletBorderWidth?.[1] ||
			'' !== tabletBorderWidth?.[2] ||
			'' !== tabletBorderWidth?.[3]
		) {
			tempTabletBorderStyle[0].top[2] = tabletBorderWidth?.[0] || '';
			tempTabletBorderStyle[0].right[2] = tabletBorderWidth?.[1] || '';
			tempTabletBorderStyle[0].bottom[2] = tabletBorderWidth?.[2] || '';
			tempTabletBorderStyle[0].left[2] = tabletBorderWidth?.[3] || '';
			updateTabletBorderStyle = true;
			setAttributes({ tabletBorderWidth: ['', '', '', ''] });
		}
		if (updateTabletBorderStyle) {
			setAttributes({ tabletBorderStyle: tempTabletBorderStyle });
		}
		// Update from old border settings.
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
		let updateMobileBorderStyle = false;
		if ('' !== mobileBorder) {
			tempMobileBorderStyle[0].top[0] = mobileBorder;
			tempMobileBorderStyle[0].right[0] = mobileBorder;
			tempMobileBorderStyle[0].bottom[0] = mobileBorder;
			tempMobileBorderStyle[0].left[0] = mobileBorder;
			updateMobileBorderStyle = true;
			setAttributes({ mobileBorder: '' });
		}
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
			updateMobileBorderStyle = true;
			setAttributes({ mobileBorderWidth: ['', '', '', ''] });
		}
		if (updateMobileBorderStyle) {
			setAttributes({ mobileBorderStyle: tempMobileBorderStyle });
		}
		if (!kbVersion || kbVersion < 2) {
			setAttributes({ kbVersion: 2 });
		}
	}, []);
	useEffect(() => {
		if (innerItemCount < columns && uniqueID) {
			updateColumns(innerItemCount, columns);
		} else if (innerItemCount < columns && !uniqueID) {
			const defaults = setBlockDefaults('kadence/rowlayout', attributes);
			updateColumns(innerItemCount, defaults.columns);
		}
	}, [innerItemCount, columns]);

	useEffect(() => {
		debouncedSetDynamicState(
			'kadence.dynamicBackground',
			'',
			attributes,
			'bgImg',
			setAttributes,
			context,
			setDynamicBackgroundImg,
			bgImg ? false : true
		);
	}, [bgImg, context]);

	const [contentWidthPop, setContentWidthPop] = useState(false);
	const [resizingVisually, setResizingVisually] = useState(false);
	const [resizeColumnWidthNumbers, setResizeColumnWidthNumbers] = useState(null);
	const timeoutRef = useRef();
	const clearTimer = () => {
		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current);
		}
	};
	const [activeTab, setActiveTab] = useState('general');
	const [dynamicBackgroundImg, setDynamicBackgroundImg] = useState('');
	const debouncedSetDynamicState = debounce(setDynamicState, 200);
	const previewFirstColumnWidth = getPreviewSize(
		previewDevice,
		firstColumnWidth,
		firstColumnWidthTablet,
		firstColumnWidthMobile
	);

	const editorDocument = document.querySelector('iframe[name="editor-canvas"]')?.contentWindow.document || document;
	const hasBG = bgColor || bgImg || gradient || overlay || overlayGradient || overlayBgImg ? 'kt-row-has-bg' : '';
	const isKadenceT = typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.isKadenceT ? true : false;
	const paddingSidesTheme = isKadenceT && true === inheritMaxWidth ? 'var(--global-content-edge-padding)' : '0px';
	const paddingSidesDefault = hasBG && !(isKadenceT && true === inheritMaxWidth) ? '' : '';
	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding?.[0] ? padding[0] : '',
		undefined !== tabletPadding ? tabletPadding[0] : '',
		undefined !== mobilePadding ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding?.[1] && '' !== padding[1] ? padding[1] : paddingSidesDefault,
		undefined !== tabletPadding ? tabletPadding[1] : '',
		undefined !== mobilePadding ? mobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding?.[2] ? padding[2] : '',
		undefined !== tabletPadding ? tabletPadding[2] : '',
		undefined !== mobilePadding ? mobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding?.[3] && '' !== padding[3] ? padding[3] : paddingSidesDefault,
		undefined !== tabletPadding ? tabletPadding[3] : '',
		undefined !== mobilePadding ? mobilePadding[3] : ''
	);
	const previewMaxWidth = getPreviewSize(
		previewDevice,
		undefined !== maxWidth ? maxWidth : '',
		undefined !== responsiveMaxWidth && responsiveMaxWidth[0] ? responsiveMaxWidth[0] : '',
		undefined !== responsiveMaxWidth && responsiveMaxWidth[1] ? responsiveMaxWidth[1] : ''
	);
	const previewMinHeight = getPreviewSize(
		previewDevice,
		undefined !== minHeight ? minHeight : '',
		undefined !== minHeightTablet ? minHeightTablet : '',
		undefined !== minHeightMobile ? minHeightMobile : ''
	);
	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== margin && undefined !== margin[0] ? margin[0] : '',
		undefined !== tabletMargin && undefined !== tabletMargin[0] ? tabletMargin[0] : '',
		undefined !== mobileMargin && undefined !== mobileMargin[0] ? mobileMargin[0] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== margin && undefined !== margin[2] ? margin[2] : '',
		undefined !== tabletMargin && undefined !== tabletMargin[2] ? tabletMargin[2] : '',
		undefined !== mobileMargin && undefined !== mobileMargin[2] ? mobileMargin[2] : ''
	);
	const previewTopSepHeight = getPreviewSize(
		previewDevice,
		undefined !== topSepHeight ? topSepHeight : '',
		undefined !== topSepHeightTab ? topSepHeightTab : '',
		undefined !== topSepHeightMobile ? topSepHeightMobile : ''
	);
	const previewTopSepWidth = getPreviewSize(
		previewDevice,
		undefined !== topSepWidth ? topSepWidth : '',
		undefined !== topSepWidthTab ? topSepWidthTab : '',
		undefined !== topSepWidthMobile ? topSepWidthMobile : ''
	);
	const previewBottomSepHeight = getPreviewSize(
		previewDevice,
		undefined !== bottomSepHeight ? bottomSepHeight : '',
		undefined !== bottomSepHeightTab ? bottomSepHeightTab : '',
		undefined !== bottomSepHeightMobile ? bottomSepHeightMobile : ''
	);
	const previewBottomSepWidth = getPreviewSize(
		previewDevice,
		undefined !== bottomSepWidth ? bottomSepWidth : '',
		undefined !== bottomSepWidthTab ? bottomSepWidthTab : '',
		undefined !== bottomSepWidthMobile ? bottomSepWidthMobile : ''
	);
	const paddingRightBreakout =
		'' !== previewPaddingRight
			? getSpacingOptionOutput(previewPaddingRight, paddingUnit ? paddingUnit : 'px')
			: paddingSidesTheme;
	const paddingLeftBreakout = previewPaddingLeft
		? getSpacingOptionOutput(previewPaddingLeft, paddingUnit ? paddingUnit : 'px')
		: paddingSidesTheme;
	const previewLayout = getPreviewSize(
		previewDevice,
		!colLayout ? 'equal' : colLayout,
		!tabletLayout ? '' : tabletLayout,
		!mobileLayout ? '' : mobileLayout
	);
	const previewColLayout = getPreviewSize(
		previewDevice,
		!colLayout ? 'equal' : colLayout,
		!tabletLayout || 'inherit' === tabletLayout ? '' : tabletLayout,
		!mobileLayout ? '' : mobileLayout
	);
	const hasBorderRadius =
		(borderRadius?.[0] || borderRadius?.[1] || borderRadius?.[2] || borderRadius?.[3]) &&
		borderRadiusOverflow !== false
			? true
			: false;

	const multiRowColLayouts = ['row', 'last-row', 'first-row', 'grid-layout', 'two-grid', 'three-grid'];
	const columnAttributes = [
		'firstColumnWidth',
		'secondColumnWidth',
		'thirdColumnWidth',
		'fourthColumnWidth',
		'fifthColumnWidth',
		'sixthColumnWidth',
	];

	//An array that has the number (in percent) of each column
	const columnWidthNumbers = [];
	//An array that has a string representing the layout (or width) of each column
	const widthStrings = [];
	for (let column = 0; column < columnAttributes.length; column++) {
		const deviceSuffix = previewDevice == 'Desktop' ? '' : previewDevice;

		//this needs to inherit if the layout does, but should be the sized custom value otherwise
		const attributeColumnWidth = attributes[columnAttributes[column]];
		const attributeColumnWidthTablet = attributes[columnAttributes[column] + 'Tablet'];
		const attributeColumnWidthMobile = attributes[columnAttributes[column] + 'Mobile'];
		const previewAttributeColumnWidth = getPreviewSize(
			previewDevice,
			attributeColumnWidth,
			attributeColumnWidthTablet,
			attributeColumnWidthMobile,
			true
		);
		const attributeColumnWidthToUse =
			previewLayout == 'inherit'
				? previewAttributeColumnWidth
				: attributes[columnAttributes[column] + deviceSuffix];

		const mappedWidth = COLUMN_WIDTH_MAP?.[columns]?.[previewColLayout]?.[column];
		const widthString = attributeColumnWidthToUse || previewColLayout;

		columnWidthNumbers.push(
			Math.abs(widthString) === parseFloat(widthString) ? attributeColumnWidthToUse : (mappedWidth ?? 0)
		);
		widthStrings.push(`${widthString}`);
	}
	const areColumnsCustom =
		(previewFirstColumnWidth && widthStrings[0] != previewLayout) || resizeColumnWidthNumbers ? true : false;

	const previewColumnGutter = getPreviewSize(previewDevice, columnGutter, tabletGutter, mobileGutter);
	const columnGap = getPreviewGutterSize(previewDevice, previewColumnGutter, customGutter, gutterType);
	const previewRowGutter = getPreviewSize(previewDevice, collapseGutter, tabletRowGutter, mobileRowGutter);
	const rowGap = getPreviewGutterSize(previewDevice, previewRowGutter, customRowGutter, rowType);
	const gapTotal = getGutterTotal(columnGap, columns);
	const hasCustomCss = hasKadenceCustomCss(kadenceBlockCSS);
	const classes = classnames({
		'kt-row-column-wrap': true,
		[`align${align}`]: align,
		[`kb-row-id-${uniqueID}`]: uniqueID,
		[`kt-has-${columns}-columns`]: columns,
		[`kt-row-layout-${previewColLayout}`]: previewColLayout,
		[`kt-row-valign-${verticalAlignment}`]: verticalAlignment,
		// [ `kt-tab-layout-${ tabLayoutClass }` ]: tabLayoutClass,
		// [ `kt-mobile-layout-${ mobileLayoutClass }` ]: mobileLayoutClass,
		[`current-tab-${currentTab}`]: currentTab,
		[`kt-v-gutter-${collapseGutter}`]: collapseGutter,
		[`kt-m-colapse-${collapseOrder}`]: previewDevice !== 'Desktop' ? collapseOrder : false,
		[hasBG]: hasBG,
		'has-border-radius': hasBorderRadius,
		'kt-inner-column-height-full': columnsInnerHeight,
		'kvs-false': getPreviewSize(previewDevice, vsdesk, vstablet, vsmobile),
		'kadence-has-rcp-display': rcpMembership && kadence_blocks_params && kadence_blocks_params.rcp_access,
		'kadence-has-custom-css': hasCustomCss,
	});
	const startlayoutOptions = [
		{ key: 'equal', col: 1, name: __('Row', 'kadence-blocks'), icon: rowIcon },
		{ key: 'equal', col: 2, name: __('Two: Equal', 'kadence-blocks'), icon: twoColIcon },
		{ key: 'left-golden', col: 2, name: __('Two: Left Heavy 66/33', 'kadence-blocks'), icon: twoLeftGoldenIcon },
		{
			key: 'right-golden',
			col: 2,
			name: __('Two: Right Heavy 33/66', 'kadence-blocks'),
			icon: twoRightGoldenIcon,
		},
		{ key: 'equal', col: 3, name: __('Three: Equal', 'kadence-blocks'), icon: threeColIcon },
		{ key: 'left-half', col: 3, name: __('Three: Left Heavy 50/25/25', 'kadence-blocks'), icon: leftHalfIcon },
		{ key: 'right-half', col: 3, name: __('Three: Right Heavy 25/25/50', 'kadence-blocks'), icon: rightHalfIcon },
		{
			key: 'center-half',
			col: 3,
			name: __('Three: Center Heavy 25/50/25', 'kadence-blocks'),
			icon: centerHalfIcon,
		},
		{
			key: 'center-wide',
			col: 3,
			name: __('Three: Wide Center 20/60/20', 'kadence-blocks'),
			icon: wideCenterIcon,
		},
		{
			key: 'center-exwide',
			col: 3,
			name: __('Three: Wider Center 15/70/15', 'kadence-blocks'),
			icon: exWideCenterIcon,
		},
		{ key: 'equal', col: 4, name: __('Four: Equal', 'kadence-blocks'), icon: fourColIcon },
		{
			key: 'left-forty',
			col: 4,
			name: __('Four: Left Heavy 40/20/20/20', 'kadence-blocks'),
			icon: lFourFortyIcon,
		},
		{
			key: 'right-forty',
			col: 4,
			name: __('Four: Right Heavy 20/20/20/40', 'kadence-blocks'),
			icon: rFourFortyIcon,
		},
		{ key: 'equal', col: 5, name: __('Five: Equal', 'kadence-blocks'), icon: fiveColIcon },
		{ key: 'equal', col: 6, name: __('Six: Equal', 'kadence-blocks'), icon: sixColIcon },
		//{ key: 'grid-layout', col: 1, name: __( 'Grid Layout', 'kadence-blocks' ), icon: sixColIcon },
	];

	let columnsString = '';
	for (let column = 0; column < columns; column++) {
		const columnWidthToUse = resizeColumnWidthNumbers
			? resizeColumnWidthNumbers[column]
			: columnWidthNumbers[column];
		const columnString = ` minmax(0, calc( ${parseFloat(columnWidthToUse)}%${
			gapTotal ? ' - (' + gapTotal + ' / ' + columns + ')' : ''
		} ) )`;
		columnsString += columnString;
	}

	const innerClasses = classnames({
		'innerblocks-wrap': true,
		'kb-theme-content-width': inheritMaxWidth,
		[`kt-layout-inner-wrap-id${uniqueID}`]: uniqueID,
		[`kb-grid-columns-${columns}`]: columns,
	});
	const containerRef = useRef(null);

	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		{
			ref: containerRef,
			className: innerClasses,
			style: {
				maxWidth: !inheritMaxWidth && previewMaxWidth ? previewMaxWidth + maxWidthUnit : undefined,
				minHeight:
					previewMinHeight && paddingUnit && '%' !== paddingUnit
						? 'calc(' +
							previewMinHeight +
							minHeightUnit +
							' - (' +
							('' !== previewPaddingTop
								? getSpacingOptionOutput(previewPaddingTop, paddingUnit ? paddingUnit : 'px')
								: '0px') +
							' + ' +
							('' !== previewPaddingBottom
								? getSpacingOptionOutput(previewPaddingBottom, paddingUnit ? paddingUnit : 'px')
								: '0px') +
							')'
						: undefined,
				paddingLeft:
					'' !== previewPaddingLeft
						? getSpacingOptionOutput(previewPaddingLeft, paddingUnit ? paddingUnit : 'px')
						: undefined,
				paddingRight:
					'' !== previewPaddingRight
						? getSpacingOptionOutput(previewPaddingRight, paddingUnit ? paddingUnit : 'px')
						: undefined,
			},
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			orientation: 'horizontal',
			renderAppender: false,
			templateLock,
		}
	);
	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();
	return (
		<>
			{'contentOnly' !== templateLock && !isPreviewMode && showSettings('allSettings', 'kadence/rowlayout') && (
				<BlockControls>
					<BlockAlignmentToolbar
						value={align}
						controls={['center', 'wide', 'full']}
						onChange={(value) => setAttributes({ align: value })}
					/>
					<ToolbarGroup group="content-width">
						<ToolbarButton
							className="kb-content-width"
							icon={
								inheritMaxWidth ? (
									<ContentWidthIcon value="theme" />
								) : (
									<ContentWidthIcon value="normal" />
								)
							}
							onClick={() => {
								if (!contentWidthPop) {
									setContentWidthPop(true);
								}
							}}
							isPressed={contentWidthPop ? true : false}
							aria-haspopup="true"
							aria-expanded={contentWidthPop}
							label={__('Inner Content Width', 'kadence-blocks')}
							showTooltip={true}
						/>
						{contentWidthPop && (
							<Popover
								className="kb-content-width-popover"
								position="bottom center"
								onClick={() => {}}
								expandOnMobile={true}
								onClose={() => {
									setContentWidthPop(false);
								}}
							>
								<div className="kb-content-width-popover-inner-wrap">
									<ToggleControl
										label={__('Use Theme Content Inner Width?', 'kadence-blocks')}
										checked={undefined !== inheritMaxWidth ? inheritMaxWidth : false}
										onChange={(value) => setAttributes({ inheritMaxWidth: value })}
									/>
									{inheritMaxWidth !== true && (
										<>
											<ResponsiveRangeControls
												label={__('Custom Content Max Width', 'kadence-blocks')}
												value={maxWidth ? maxWidth : ''}
												onChange={(value) => {
													setAttributes({ maxWidth: value });
												}}
												tabletValue={
													undefined !== responsiveMaxWidth &&
													undefined !== responsiveMaxWidth[0]
														? responsiveMaxWidth[0]
														: ''
												}
												onChangeTablet={(value) => {
													setAttributes({
														responsiveMaxWidth: [
															value,
															undefined !== responsiveMaxWidth &&
															undefined !== responsiveMaxWidth[1]
																? responsiveMaxWidth[1]
																: '',
														],
													});
												}}
												mobileValue={
													undefined !== responsiveMaxWidth &&
													undefined !== responsiveMaxWidth[1]
														? responsiveMaxWidth[1]
														: ''
												}
												onChangeMobile={(value) => {
													setAttributes({
														responsiveMaxWidth: [
															undefined !== responsiveMaxWidth &&
															undefined !== responsiveMaxWidth[0]
																? responsiveMaxWidth[0]
																: '',
															value,
														],
													});
												}}
												min={0}
												max={maxWidthUnit === 'px' ? 2000 : 100}
												step={1}
												unit={maxWidthUnit ? maxWidthUnit : 'px'}
												onUnit={(value) => {
													setAttributes({ maxWidthUnit: value });
												}}
												units={['px', '%', 'vw', 'rem']}
											/>
										</>
									)}
								</div>
							</Popover>
						)}
					</ToolbarGroup>
					<ToolbarGroup group="align">
						<BlockVerticalAlignmentControl
							value={verticalAlignment === 'middle' ? 'center' : verticalAlignment}
							onChange={(value) => {
								if (value === 'center') {
									setAttributes({ verticalAlignment: 'middle' });
								} else if (value === 'bottom') {
									setAttributes({ verticalAlignment: 'bottom' });
								} else {
									setAttributes({ verticalAlignment: 'top' });
								}
							}}
						/>
					</ToolbarGroup>
					<ToolbarGroup group="add-block">
						<ToolbarButton
							className="kb-row-add-section"
							icon={plusCircle}
							onClick={() => {
								const newBlock = createBlock('kadence/column', {});
								insertSection(newBlock);
							}}
							label={__('Add Another Section', 'kadence-blocks')}
							showTooltip={true}
						/>
					</ToolbarGroup>
					<CopyPasteAttributes
						attributes={attributes}
						defaultAttributes={metadata.attributes}
						blockSlug={metadata.name}
						onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
					/>
				</BlockControls>
			)}
			{!isPreviewMode && showSettings('allSettings', 'kadence/rowlayout') && (
				<>
					<InspectorControls>
						<InspectorControlTabs
							panelName={'rowlayout'}
							setActiveTab={setActiveTab}
							activeTab={activeTab}
							tabs={[
								{
									key: 'general',
									title: __('Layout', 'kadence-blocks'),
									icon: blockDefault,
								},
								{
									key: 'style',
									title: __('Style', 'kadence-blocks'),
									icon: brush,
								},
								{
									key: 'advanced',
									title: __('Advanced', 'kadence-blocks'),
									icon: settings,
								},
							]}
						/>
						{activeTab === 'general' && (
							<>
								<LayoutControls
									clientId={clientId}
									attributes={attributes}
									setAttributes={setAttributes}
									updateColumns={updateColumns}
									innerItemCount={innerItemCount}
									widthString={widthStrings[0]}
									previewDevice={previewDevice}
								/>
							</>
						)}
						{activeTab === 'style' && (
							<StyleControls
								clientId={clientId}
								attributes={attributes}
								setAttributes={setAttributes}
								isSelected={isSelected}
								context={context}
								name={name}
							/>
						)}
						{activeTab === 'advanced' && (
							<>
								{showSettings('paddingMargin', 'kadence/rowlayout') && (
									<KadencePanelBody panelName={'kb-row-padding'}>
										<div
											className={
												hasBG && padding[1] === '' && padding[3] !== ''
													? 'padding-right-measure-range-control'
													: hasBG && padding[1] !== '' && padding[3] === ''
														? 'padding-left-measure-range-control'
														: hasBG && padding[1] === '' && padding[3] === ''
															? 'padding-right-measure-range-control padding-left-measure-range-control'
															: ''
											}
										>
											<ResponsiveMeasureRangeControl
												label={__('Padding', 'kadence-blocks')}
												value={
													hasBG &&
													undefined !== padding &&
													undefined !== padding[0] &&
													padding[1] === '' &&
													padding[3] === ''
														? [padding[0], '', padding[2], '']
														: undefined !== padding && undefined !== padding[0]
															? padding
															: ['sm', '', 'sm', '']
												}
												tabletValue={tabletPadding}
												mobileValue={
													undefined !== mobilePadding && undefined !== mobilePadding[0]
														? mobilePadding
														: ['', '', '', '']
												}
												onChange={(value) => setAttributes({ padding: value })}
												onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
												onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
												min={0}
												max={paddingUnit === 'em' || paddingUnit === 'rem' ? 25 : 999}
												step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
												deskDefault={['sm', '', 'sm', '']}
												unit={paddingUnit}
												options={SPACING_SIZES_MAP}
												units={['px', 'em', 'rem', '%', 'vh', 'vw']}
												onUnit={(value) => setAttributes({ paddingUnit: value })}
												onMouseOver={paddingMouseOver.onMouseOver}
												onMouseOut={paddingMouseOver.onMouseOut}
											/>
										</div>

										<ResponsiveMeasureRangeControl
											label={__('Margin', 'kadence-blocks')}
											value={[
												undefined !== margin && undefined !== margin[0] ? margin[0] : '',
												'auto',
												undefined !== margin && undefined !== margin[2] ? margin[2] : '',
												'auto',
											]}
											tabletValue={[
												undefined !== tabletMargin && undefined !== tabletMargin[0]
													? tabletMargin[0]
													: '',
												'auto',
												undefined !== tabletMargin && undefined !== tabletMargin[2]
													? tabletMargin[2]
													: '',
												'auto',
											]}
											mobileValue={[
												undefined !== mobileMargin && undefined !== mobileMargin[0]
													? mobileMargin[0]
													: '',
												'auto',
												undefined !== mobileMargin && undefined !== mobileMargin[2]
													? mobileMargin[2]
													: '',
												'auto',
											]}
											onChange={(value) => {
												setAttributes({ margin: [value[0], '', value[2], ''] });
											}}
											onChangeTablet={(value) => {
												setAttributes({ tabletMargin: [value[0], '', value[2], ''] });
											}}
											onChangeMobile={(value) => {
												setAttributes({ mobileMargin: [value[0], '', value[2], ''] });
											}}
											min={marginUnit === 'em' || marginUnit === 'rem' ? -25 : -999}
											max={marginUnit === 'em' || marginUnit === 'rem' ? 25 : 999}
											step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
											unit={marginUnit}
											allowEmpty={true}
											options={SPACING_SIZES_MAP}
											units={['px', 'em', 'rem', '%', 'vh']}
											onUnit={(value) => setAttributes({ marginUnit: value })}
											onMouseOver={marginMouseOver.onMouseOver}
											onMouseOut={marginMouseOver.onMouseOut}
											allowAuto={true}
										/>
									</KadencePanelBody>
								)}
								<div className="kt-sidebar-settings-spacer"></div>
								{showSettings('structure', 'kadence/rowlayout') && (
									<>
										<KadencePanelBody
											title={__('Structure Settings', 'kadence-blocks')}
											initialOpen={false}
											panelName={'kb-row-structure-settings'}
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
												label={__('Minimum Height', 'kadence-blocks')}
												value={minHeight ? minHeight : ''}
												onChange={(value) => {
													setAttributes({ minHeight: value });
												}}
												tabletValue={undefined !== minHeightTablet ? minHeightTablet : ''}
												onChangeTablet={(value) => {
													setAttributes({ minHeightTablet: value });
												}}
												mobileValue={undefined !== minHeightMobile ? minHeightMobile : ''}
												onChangeMobile={(value) => {
													setAttributes({ minHeightMobile: value });
												}}
												min={0}
												max={minHeightUnit === 'px' ? 2000 : 200}
												step={1}
												unit={minHeightUnit ? minHeightUnit : 'px'}
												onUnit={(value) => {
													setAttributes({ minHeightUnit: value });
												}}
												units={['px', 'vw', 'vh']}
												reset={true}
											/>
											<ToggleControl
												label={__('Inner Column Height 100%', 'kadence-blocks')}
												checked={undefined !== columnsInnerHeight ? columnsInnerHeight : false}
												onChange={(value) => setAttributes({ columnsInnerHeight: value })}
											/>
											<RangeControl
												label={__('Z-Index Control', 'kadence-blocks')}
												value={zIndex}
												onChange={(value) => {
													setAttributes({
														zIndex: value,
													});
												}}
												min={-200}
												max={2000}
												reset={true}
											/>
										</KadencePanelBody>
										<KadencePanelBody
											title={__('Visibility Settings', 'kadence-blocks')}
											initialOpen={false}
											panelName={'kb-row-visibility-settings'}
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
											<h2>{__('User Visibility Settings', 'kadence-blocks')}</h2>
											<ToggleControl
												label={__('Hide from Logged in Users', 'kadence-blocks')}
												checked={undefined !== loggedIn ? loggedIn : false}
												onChange={(value) => setAttributes({ loggedIn: value })}
											/>
											{loggedIn && (
												<>
													<div className="components-base-control">
														<span className="kadence-sidebar-label">
															{__(
																'Optional: Hide from Specific User Roles',
																'kadence-blocks'
															)}
														</span>
														<div className="kt-meta-select-wrap">
															<Select
																options={
																	kadence_blocks_user_params &&
																	kadence_blocks_user_params.userVisibility
																		? kadence_blocks_user_params.userVisibility
																		: []
																}
																value={loggedInUser}
																isMulti={true}
																maxMenuHeight={200}
																isClearable={true}
																placeholder={''}
																onChange={(value) =>
																	setAttributes({ loggedInUser: value })
																}
															/>
														</div>
													</div>
													<div className="components-base-control">
														<span className="kadence-sidebar-label">
															{__(
																'Optional: Show Only to Specific User Roles',
																'kadence-blocks'
															)}
														</span>
														<div className="kt-meta-select-wrap">
															<Select
																options={
																	kadence_blocks_user_params &&
																	kadence_blocks_user_params.userVisibility
																		? kadence_blocks_user_params.userVisibility
																		: []
																}
																value={loggedInShow}
																isMulti={true}
																maxMenuHeight={200}
																isClearable={true}
																placeholder={''}
																onChange={(value) =>
																	setAttributes({ loggedInShow: value })
																}
															/>
														</div>
													</div>
												</>
											)}
											<ToggleControl
												label={__('Hide from Logged out Users', 'kadence-blocks')}
												checked={undefined !== loggedOut ? loggedOut : false}
												onChange={(value) => setAttributes({ loggedOut: value })}
											/>
											{kadence_blocks_params && kadence_blocks_params.rcp_access && (
												<>
													<ToggleControl
														label={__('Restrict based on Membership', 'kadence-blocks')}
														checked={undefined !== rcpMembership ? rcpMembership : false}
														onChange={(value) => setAttributes({ rcpMembership: value })}
													/>
													{rcpMembership && (
														<>
															<SelectControl
																label={__('Minimum Access Level', 'kadence-blocks')}
																value={rcpAccess}
																options={
																	kadence_blocks_params &&
																	kadence_blocks_params.rcp_access
																		? kadence_blocks_params.rcp_access
																		: []
																}
																onChange={(value) =>
																	setAttributes({ rcpAccess: value })
																}
															/>
															<div className="components-base-control">
																<span className="kadence-sidebar-label">
																	{__('Specific Memberships', 'kadence-blocks')}
																</span>
																<div className="kt-meta-select-wrap">
																	<Select
																		options={
																			kadence_blocks_params &&
																			kadence_blocks_params.rcp_levels
																				? kadence_blocks_params.rcp_levels
																				: []
																		}
																		value={rcpMembershipLevel}
																		isMulti={true}
																		maxMenuHeight={200}
																		isClearable={true}
																		placeholder={'Any Membership'}
																		onChange={(value) =>
																			setAttributes({
																				rcpMembershipLevel: value,
																			})
																		}
																	/>
																</div>
															</div>
														</>
													)}
												</>
											)}
										</KadencePanelBody>
									</>
								)}

								<KadenceBlockDefaults
									attributes={attributes}
									defaultAttributes={metadata.attributes}
									blockSlug={metadata.name}
								/>
							</>
						)}
					</InspectorControls>
					<InspectorAdvancedControls>
						<ToggleControl
							label={__('Row Content Only Editing', 'kadence-blocks')}
							checked={'contentOnly' === templateLock ? true : false}
							onChange={(value) => setAttributes({ templateLock: 'contentOnly' })}
						/>
					</InspectorAdvancedControls>
				</>
			)}
			<RowBackground
				backgroundClasses={classes}
				attributes={attributes}
				previewDevice={previewDevice}
				dynamicBackgroundImg={dynamicBackgroundImg}
			>
				<style>
					{textColor
						? `.kb-row-id-${uniqueID}, .kb-row-id-${uniqueID} p:not(.use-for-specificity), .kb-row-id-${uniqueID} h1:not(.use-for-specificity), .kb-row-id-${uniqueID} h2:not(.use-for-specificity), .kb-row-id-${uniqueID} h3:not(.use-for-specificity), .kb-row-id-${uniqueID} h4:not(.use-for-specificity), .kb-row-id-${uniqueID} h5:not(.use-for-specificity), .kb-row-id-${uniqueID} h6:not(.use-for-specificity) { color: ${KadenceColorOutput(
								textColor
							)}; }`
						: ''}
					{columns &&
						columns === 2 &&
						inheritMaxWidth &&
						(breakoutLeft || breakoutRight) &&
						'row' !== previewLayout &&
						'full' === align &&
						'Desktop' === previewDevice && (
							<>
								{breakoutRight
									? `@media (min-width: 1290px) {
											.wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .innerblocks-wrap.kb-grid-columns-2.kt-layout-inner-wrap-id${uniqueID} > .wp-block-kadence-column:nth-child(${
												isSelected ? 3 : 2
											}) > .kadence-inner-column-inner {
												margin-inline-end: calc( ( ( ( var( --global-kb-editor-full-width ) - ( var( --kb-global-content-width ) - ( ${paddingRightBreakout} *2 ) ) ) /2 ) *-1) ) !important;
										}}
										@media (max-width: 1289px) {
											.wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .innerblocks-wrap.kb-grid-columns-2.kt-layout-inner-wrap-id${uniqueID} > .wp-block-kadence-column:nth-child(${
												isSelected ? 3 : 2
											}) > .kadence-inner-column-inner {
												margin-inline-end: calc( ${paddingRightBreakout} * -1 ) !important;
										}}`
									: ''}
								{breakoutLeft
									? `@media (min-width: 1290px) {
											.wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .innerblocks-wrap.kb-grid-columns-2.kt-layout-inner-wrap-id${uniqueID} .wp-block-kadence-column:nth-child(${
												isSelected ? 2 : 1
											}) > .kadence-inner-column-inner {
												margin-inline-start: calc( ( ( ( var( --global-kb-editor-full-width ) - ( var( --kb-global-content-width ) - ( ${paddingLeftBreakout} *2 ) ) ) /2 ) *-1) ) !important;
										}}
										@media (max-width: 1289px) {
											.wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .innerblocks-wrap.kb-grid-columns-2.kt-layout-inner-wrap-id${uniqueID} .wp-block-kadence-column:nth-child(${
												isSelected ? 2 : 1
											}) > .kadence-inner-column-inner {
												margin-inline-start: calc( ${paddingRightBreakout} * -1 ) !important;
										}}`
									: ''}
							</>
						)}
					{columns &&
						columns === 2 &&
						inheritMaxWidth &&
						(breakoutLeft || breakoutRight) &&
						'row' !== previewLayout &&
						'full' === align &&
						'Tablet' === previewDevice && (
							<>
								{/*{breakoutRight*/}
								{/*	? `.wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .innerblocks-wrap.kb-grid-columns-2.kt-layout-inner-wrap-id${uniqueID} > .wp-block-kadence-column:nth-child(2) > .kadence-inner-column-inner { margin-inline-end: calc( ${paddingRightBreakout} *-1 ) !important; }`*/}
								{/*	: ''}*/}
								{/*{breakoutLeft*/}
								{/*	? `.wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .innerblocks-wrap.kb-grid-columns-2.kt-layout-inner-wrap-id${uniqueID} > .wp-block-kadence-column:nth-child(1) > .kadence-inner-column-inner { margin-inline-start: calc( ${paddingLeftBreakout} *-1 ) !important; }`*/}
								{/*	: ''}*/}
							</>
						)}
					{linkColor
						? `.kb-row-id-${uniqueID} a:not(.use-for-specificity) { color: ${KadenceColorOutput(
								linkColor
							)}; }`
						: ''}
					{linkHoverColor
						? `.kb-row-id-${uniqueID} a:not(.use-for-specificity):hover { color: ${KadenceColorOutput(
								linkHoverColor
							)}; }`
						: ''}
					<>
						{undefined !== columnGap
							? `.wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .innerblocks-wrap.kt-layout-inner-wrap-id${uniqueID}, .wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .kb-grid-align-display-wrap > .kb-grid-align-display { column-gap:${columnGap} }`
							: ''}
					</>
					{undefined !== rowGap
						? `.wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .innerblocks-wrap.kt-layout-inner-wrap-id${uniqueID}, .wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .kb-grid-align-display-wrap > .kb-grid-align-display { row-gap:${rowGap} }`
						: ''}

					{columns && !multiRowColLayouts.includes(previewColLayout) && (
						<>
							{`.wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .innerblocks-wrap.kt-layout-inner-wrap-id${uniqueID} { grid-template-columns: ${columnsString} }`}
						</>
					)}
					{'Desktop' !== previewDevice &&
						'right-to-left' === collapseOrder &&
						('grid-layout' === previewLayout ||
							'row' === previewLayout ||
							'last-row' === previewLayout ||
							'first-row' === previewLayout) && (
							<>
								{times(columns, (n) => {
									const item = n + 1;
									return `.wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .innerblocks-wrap >  .wp-block-kadence-column:nth-child(${item}) { order: ${
										columns - item
									} }`;
								})}
								{times(columns, (n) => {
									const item = n + 1 + columns;
									return `.wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .innerblocks-wrap >  .wp-block-kadence-column:nth-child(${item}) { order: ${
										10 + (columns - (n + 1))
									} }`;
								})}
								{times(columns, (n) => {
									const item = n + 1 + columns + columns;
									return `.wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .innerblocks-wrap >  .wp-block-kadence-column:nth-child(${item}) { order: ${
										20 + (columns - (n + 1))
									} }`;
								})}
								{times(columns, (n) => {
									const item = n + 1 + columns + columns + columns;
									return `.wp-block-kadence-rowlayout.kb-row-id-${uniqueID} > .innerblocks-wrap >  .wp-block-kadence-column:nth-child(${item}) { order: ${
										30 + (columns - (n + 1))
									} }`;
								})}
							</>
						)}
					{zIndex && zIndex > 30 && (
						<>
							{`.components-popover.block-editor-block-list__block-popover { z-index: ${zIndex + 1000} }`}
							;
						</>
					)}
					{kadenceBlockCSS && <>{kadenceBlockCSS.replace(/selector/g, `.kb-row-id-${uniqueID}`)}</>}
					{isSelected &&
						colLayout &&
						'contentOnly' !== templateLock &&
						'row' !== colLayout &&
						columns &&
						1 !== columns &&
						'Desktop' === previewDevice &&
						showSettings('columnResize', 'kadence/rowlayout') && (
							<>
								{`.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-horizontal.is-with-inserter { display: none }`}
								;
							</>
						)}
				</style>
				<Overlay attributes={attributes} previewDevice={previewDevice} />
				{colLayout && 'grid-layout' === colLayout && (
					<GridVisualizer attributes={attributes} setAttributes={setAttributes} />
				)}
				{!colLayout && (
					<div className="kt-select-layout">
						<div className="kt-select-layout-title">{__('Select Your Layout', 'kadence-blocks')}</div>
						<ButtonGroup aria-label={__('Column Layout', 'kadence-blocks')}>
							{map(startlayoutOptions, ({ name, key, icon, col }) => (
								<Button
									key={key}
									className="kt-layout-btn"
									isSmall
									label={name}
									icon={icon}
									onClick={() => {
										updateColumns(columns, col);
										setAttributes({
											colLayout: key,
											columns: col,
											firstColumnWidth: 0,
											secondColumnWidth: 0,
											thirdColumnWidth: 0,
											fourthColumnWidth: 0,
											fifthColumnWidth: 0,
											sixthColumnWidth: 0,
										});
									}}
								/>
							))}
						</ButtonGroup>
						{showSettings('show', 'kadence/designlibrary') && kadence_blocks_params.showDesignLibrary && (
							<Button className="kt-prebuilt" onClick={() => setAttributes({ isPrebuiltModal: true })}>
								{__('Design Library', 'kadence-blocks')}
							</Button>
						)}
					</div>
				)}
				{colLayout && 'none' !== topSep && '' !== topSep && (
					<div
						className={`kt-row-layout-top-sep kt-row-sep-type-${topSep}`}
						style={{
							height: previewTopSepHeight + topSepHeightUnit,
							color: KadenceColorOutput(topSepColor),
						}}
					>
						{renderSVGDivider(topSep, 'top', previewTopSepWidth + '%')}
					</div>
				)}
				{colLayout && (
					<PaddingResizer
						previewDevice={previewDevice}
						edge={'top'}
						isPreviewMode={isPreviewMode}
						attributes={attributes}
						setAttributes={setAttributes}
						toggleSelection={toggleSelection}
						finishedResizing={() => {
							setResizingVisually(true);
							clearTimer();
							timeoutRef.current = setTimeout(() => {
								setResizingVisually(false);
							}, 100);
						}}
					/>
				)}
				{colLayout && (
					<div {...innerBlocksProps}>
						{isSelected &&
							colLayout &&
							'contentOnly' !== templateLock &&
							!multiRowColLayouts.includes(previewColLayout) &&
							columns &&
							showSettings('allSettings', 'kadence/rowlayout') &&
							showSettings('columnResize', 'kadence/rowlayout') && (
								<ColumnDragResizer
									attributes={attributes}
									setAttributes={setAttributes}
									previewDevice={previewDevice}
									columns={columns}
									columnWidths={
										resizeColumnWidthNumbers ? resizeColumnWidthNumbers : columnWidthNumbers
									}
									columnGap={columnGap}
									columnsUnlocked={columnsUnlocked}
									onColumnsUnlocked={(value) => setAttributes({ columnsUnlocked: value })}
									onResize={(newColumnWidths) => {
										//for performance reasons, we set a temporary state for the widths during resize
										setResizeColumnWidthNumbers(newColumnWidths);
									}}
									onResizeTablet={(newColumnWidths) => {
										setResizeColumnWidthNumbers(newColumnWidths);
									}}
									onResizeMobile={(newColumnWidths) => {
										setResizeColumnWidthNumbers(newColumnWidths);
									}}
									onResizeStop={(newColumnWidths) => {
										setAttributes({
											firstColumnWidth: newColumnWidths?.[0],
											secondColumnWidth: newColumnWidths?.[1],
											thirdColumnWidth: newColumnWidths?.[2],
											fourthColumnWidth: newColumnWidths?.[3],
											fifthColumnWidth: newColumnWidths?.[4],
											sixthColumnWidth: newColumnWidths?.[5],
										});
										setResizeColumnWidthNumbers(null);
									}}
									onResizeStopTablet={(newColumnWidths) => {
										setAttributes({
											firstColumnWidthTablet: newColumnWidths?.[0],
											secondColumnWidthTablet: newColumnWidths?.[1],
											thirdColumnWidthTablet: newColumnWidths?.[2],
											fourthColumnWidthTablet: newColumnWidths?.[3],
											fifthColumnWidthTablet: newColumnWidths?.[4],
											sixthColumnWidthTablet: newColumnWidths?.[5],
										});
										setResizeColumnWidthNumbers(null);
									}}
									onResizeStopMobile={(newColumnWidths) => {
										setAttributes({
											firstColumnWidthMobile: newColumnWidths?.[0],
											secondColumnWidthMobile: newColumnWidths?.[1],
											thirdColumnWidthMobile: newColumnWidths?.[2],
											fourthColumnWidthMobile: newColumnWidths?.[3],
											fifthColumnWidthMobile: newColumnWidths?.[4],
											sixthColumnWidthMobile: newColumnWidths?.[5],
										});
										setResizeColumnWidthNumbers(null);
									}}
									active={areColumnsCustom}
									tempDuringResize={true}
								/>
							)}
						{children}
					</div>
				)}
				{colLayout && (
					<PaddingResizer
						previewDevice={previewDevice}
						edge={'bottom'}
						isPreviewMode={isPreviewMode}
						attributes={attributes}
						setAttributes={setAttributes}
						toggleSelection={toggleSelection}
						finishedResizing={() => {
							setResizingVisually(true);
							clearTimer();
							timeoutRef.current = setTimeout(() => {
								setResizingVisually(false);
							}, 100);
						}}
					/>
				)}
				{colLayout && 'none' !== bottomSep && '' !== bottomSep && (
					<div
						className={`kt-row-layout-bottom-sep kt-row-sep-type-${bottomSep}`}
						style={{
							height: previewBottomSepHeight + bottomSepHeightUnit,
							color: KadenceColorOutput(bottomSepColor),
						}}
					>
						{renderSVGDivider(bottomSep, 'bottom', previewBottomSepWidth + '%')}
					</div>
				)}
				<SpacingVisualizer
					style={{
						maxWidth: !inheritMaxWidth && previewMaxWidth ? previewMaxWidth + maxWidthUnit : undefined,
					}}
					type="inside"
					forceHide={resizingVisually}
					forceShow={paddingMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewPaddingTop, paddingUnit ? paddingUnit : 'px'),
						getSpacingOptionOutput(previewPaddingRight, paddingUnit ? paddingUnit : 'px'),
						getSpacingOptionOutput(previewPaddingBottom, paddingUnit ? paddingUnit : 'px'),
						getSpacingOptionOutput(previewPaddingLeft, paddingUnit ? paddingUnit : 'px'),
					]}
				/>
				<SpacingVisualizer
					type="outside"
					forceShow={marginMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewMarginTop, marginUnit ? marginUnit : 'px'),
						0,
						getSpacingOptionOutput(previewMarginBottom, marginUnit ? marginUnit : 'px'),
						0,
					]}
				/>
			</RowBackground>
		</>
	);
}

const RowLayoutEditContainerWrapper = withDispatch((dispatch, ownProps, registry) => ({
	/**
	 * Update all child Column blocks with a new vertical alignment setting
	 * based on whatever alignment is passed in. This allows change to parent
	 * to overide anything set on a individual column basis.
	 *
	 * @param {string} verticalAlignment the vertical alignment setting
	 */
	updateAlignment(verticalAlignment) {
		const { clientId, setAttributes } = ownProps;
		const { updateBlockAttributes } = dispatch(blockEditorStore);
		const { getBlockOrder } = registry.select(blockEditorStore);

		// Update own alignment.
		setAttributes({ verticalAlignment });

		// Update all child Column Blocks to match.
		const innerBlockClientIds = getBlockOrder(clientId);
		innerBlockClientIds.forEach((innerBlockClientId) => {
			updateBlockAttributes(innerBlockClientId, {
				verticalAlignment,
			});
		});
	},
	/**
	 * Updates the column count, including necessary revisions to child Column
	 * blocks to grant required or redistribute available space.
	 *
	 * @param {number} previousColumns Previous column count.
	 * @param {number} newColumns      New column count.
	 */
	updateColumns(previousColumns, newColumns) {
		const { clientId } = ownProps;
		const { replaceInnerBlocks } = dispatch(blockEditorStore);
		const { getBlocks } = registry.select(blockEditorStore);

		let innerBlocks = getBlocks(clientId);
		const isAddingColumn = newColumns > previousColumns;

		if (isAddingColumn) {
			const arrayLength = innerBlocks.length;
			for (let i = 0; i < arrayLength; i++) {
				innerBlocks[i].attributes.id = i + 1;
			}
			innerBlocks = [
				...innerBlocks,
				...times(newColumns - previousColumns, (n) => {
					return createBlock('kadence/column', {
						id: previousColumns + n + 1,
					});
				}),
			];
		} else if (1 === previousColumns - newColumns) {
			const lastItem = innerBlocks.length - 1;
			if (!innerBlocks[lastItem].innerBlocks.length) {
				innerBlocks = dropRight(innerBlocks, previousColumns - newColumns);
			}
		}

		replaceInnerBlocks(clientId, innerBlocks);
	},
	insertSection(newBlock) {
		const { clientId } = ownProps;
		const { insertBlock } = dispatch(blockEditorStore);
		const { getBlock } = registry.select(blockEditorStore);
		const block = getBlock(clientId);
		insertBlock(newBlock, parseInt(block.innerBlocks.length), clientId);
	},
}))(RowLayoutEditContainer);
const KadenceRowLayout = (props) => {
	const { clientId, attributes } = props;
	const { isPrebuiltModal } = attributes;
	// Cut everything short if we are just accessing the modal.
	if (isPrebuiltModal) {
		return (
			<PrebuiltModal
				clientId={clientId}
				open={isPrebuiltModal ? true : false}
				onlyModal={isPrebuiltModal ? true : false}
			/>
		);
	}
	const { rowBlock, realColumnCount } = useSelect(
		(select) => {
			const { getBlock } = select('core/block-editor');
			const block = getBlock(clientId);
			return {
				rowBlock: block,
				isUniqueBlock: block.innerBlocks.length,
			};
		},
		[clientId]
	);
	return <RowLayoutEditContainerWrapper realColumnCount={realColumnCount} rowBlock={rowBlock} {...props} />;
};
export default KadenceRowLayout;
