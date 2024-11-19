/**
 * BLOCK: Kadence Advanced Btn
 *
 * Editor for Advanced Btn
 */
import {
	KadenceColorOutput,
	getPreviewSize,
	showSettings,
	getSpacingOptionOutput,
	mouseOverVisualizer,
} from '@kadence/helpers';

import {
	PopColorControl,
	TypographyControls,
	ResponsiveMeasurementControls,
	SmallResponsiveControl,
	ResponsiveRangeControls,
	IconRender,
	KadenceIconPicker,
	KadencePanelBody,
	URLInputControl,
	URLInputInline,
	ResponsiveAlignControls,
	WebfontLoader,
	BoxShadowControl,
	DynamicTextControl,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
} from '@kadence/components';
import classnames from 'classnames';
import ButtonStyleCopyPaste from './copy-paste-style';
import { times, filter, map } from 'lodash';

const defaultBtns = [
	{
		text: '',
		link: '',
		target: '_self',
		size: '',
		paddingBT: '',
		paddingLR: '',
		color: '#555555',
		background: '',
		border: '#555555',
		backgroundOpacity: 1,
		borderOpacity: 1,
		borderRadius: '',
		borderWidth: '',
		colorHover: '#ffffff',
		backgroundHover: '#444444',
		borderHover: '#444444',
		backgroundHoverOpacity: 1,
		borderHoverOpacity: 1,
		icon: '',
		iconSide: 'right',
		iconHover: false,
		cssClass: '',
		noFollow: false,
		gap: 5,
		responsiveSize: ['', ''],
		gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
		gradientHover: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
		btnStyle: 'basic',
		btnSize: 'standard',
		backgroundType: 'solid',
		backgroundHoverType: 'solid',
		width: ['', '', ''],
		responsivePaddingBT: ['', ''],
		responsivePaddingLR: ['', ''],
		boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
		boxShadowHover: [false, '#000000', 0.4, 2, 2, 3, 0, false],
		sponsored: false,
		download: false,
		tabletGap: '',
		mobileGap: '',
		inheritStyles: '',
		iconSize: ['', '', ''],
		iconPadding: ['', '', '', ''],
		iconTabletPadding: ['', '', '', ''],
		iconMobilePadding: ['', '', '', ''],
		onlyIcon: [false, '', ''],
		iconColor: '',
		iconColorHover: '',
		sizeType: 'px',
		iconSizeType: 'px',
		label: '',
		marginUnit: 'px',
		margin: ['', '', '', ''],
		tabletMargin: ['', '', '', ''],
		mobileMargin: ['', '', '', ''],
		anchor: '',
		borderStyle: '',
	},
];

const POPOVER_PROPS = {
	className: 'block-editor-block-settings-menu__popover',
	position: 'bottom right',
};
/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;
/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';

import { DELETE } from '@wordpress/keycodes';
import { cog, pages, chevronRight, chevronLeft, plus, close, code } from '@wordpress/icons';
import { Fragment, useEffect, useState } from '@wordpress/element';
import {
	RichText,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Dashicon,
	TabPanel,
	Button,
	PanelRow,
	RangeControl,
	TextControl,
	ButtonGroup,
	SelectControl,
	ToggleControl,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Icon,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { applyFilters } from '@wordpress/hooks';

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktadvancedbuttonUniqueIDs = [];

function KadenceAdvancedButton(props) {
	const { attributes, setAttributes, getPreviewDevice, className, isSelected, context, clientId } = props;
	const {
		uniqueID,
		btnCount,
		btns,
		hAlign,
		letterSpacing,
		fontStyle,
		fontWeight,
		typography,
		googleFont,
		loadGoogleFont,
		fontSubset,
		fontVariant,
		forceFullwidth,
		thAlign,
		mhAlign,
		widthType,
		widthUnit,
		textTransform,
		margin,
		marginUnit,
		kadenceAOSOptions,
		kadenceAnimation,
		collapseFullwidth,
		lockBtnCount,
		hideLink,
		inQueryBlock,
	} = attributes;

	const [btnFocused, setBtnFocused] = useState('false');
	const [selectedButton, setSelectedButton] = useState(null);
	const [buttonMarginControl, setButtonMarginControl] = useState('individual');
	const [iconPaddingControl, setIconPaddingControl] = useState('individual');
	const [activeTab, setActiveTab] = useState('general');

	useEffect(() => {
		if (!uniqueID) {
			const oldBlockConfig = kadence_blocks_params.config['kadence/advancedbtn'];
			const blockConfigObject = kadence_blocks_params.configuration
				? JSON.parse(kadence_blocks_params.configuration)
				: [];
			if (
				blockConfigObject['kadence/advancedbtn'] !== undefined &&
				typeof blockConfigObject['kadence/advancedbtn'] === 'object'
			) {
				Object.keys(blockConfigObject['kadence/advancedbtn']).map((attribute) => {
					if (attribute === 'btns') {
						attributes[attribute][0] = {
							...attributes[attribute][0],
							...blockConfigObject['kadence/advancedbtn'][attribute][0],
						};
					} else {
						attributes[attribute] = blockConfigObject['kadence/advancedbtn'][attribute];
					}
				});
			} else if (oldBlockConfig !== undefined && typeof oldBlockConfig === 'object') {
				Object.keys(oldBlockConfig).map((attribute) => {
					attributes[attribute] = oldBlockConfig[attribute];
				});
			}
			setAttributes({
				uniqueID: '_' + clientId.substr(2, 9),
			});
			ktadvancedbuttonUniqueIDs.push('_' + clientId.substr(2, 9));
		} else if (ktadvancedbuttonUniqueIDs.includes(uniqueID)) {
			if (uniqueID !== '_' + clientId.substr(2, 9)) {
				setAttributes({ uniqueID: '_' + clientId.substr(2, 9) });
				ktadvancedbuttonUniqueIDs.push('_' + clientId.substr(2, 9));
			}
		} else {
			ktadvancedbuttonUniqueIDs.push(uniqueID);
		}
		const blockSettings = kadence_blocks_params.settings ? JSON.parse(kadence_blocks_params.settings) : {};

		if (btns && btns[0] && undefined === btns[0].btnSize) {
			saveArrayUpdate({ btnSize: 'custom' }, 0);
		}
		if (btns && btns[1] && undefined === btns[1].btnSize) {
			saveArrayUpdate({ btnSize: 'custom' }, 1);
		}
		if (btns && btns[2] && undefined === btns[2].btnSize) {
			saveArrayUpdate({ btnSize: 'custom' }, 2);
		}
		if (btns && btns[3] && undefined === btns[3].btnSize) {
			saveArrayUpdate({ btnSize: 'custom' }, 3);
		}
		if (btns && btns[4] && undefined === btns[4].btnSize) {
			saveArrayUpdate({ btnSize: 'custom' }, 4);
		}
		if (undefined === widthType) {
			if (forceFullwidth) {
				setAttributes({ widthType: 'full' });
			}
		}

		if (context && context.queryId && context.postId) {
			if (!inQueryBlock) {
				setAttributes({
					inQueryBlock: true,
				});
			}
		} else if (inQueryBlock) {
			setAttributes({
				inQueryBlock: false,
			});
		}
	}, []);

	useEffect(() => {
		if (!isSelected && btnFocused) {
			setBtnFocused('false');
		}
		if (!isSelected && selectedButton) {
			setSelectedButton(null);
		}
	}, [isSelected]);

	const onSelectButton = (index) => {
		if (selectedButton !== index) {
			setSelectedButton(index);
		}
	};

	const onMove = (oldIndex, newIndex) => {
		const newBtns = [...btns];
		newBtns.splice(newIndex, 1, btns[oldIndex]);
		newBtns.splice(oldIndex, 1, btns[newIndex]);

		setSelectedButton(newIndex);
		setAttributes({
			btns: newBtns,
		});
	};

	const onMoveForward = (oldIndex) => {
		if (oldIndex === btns.length - 1) {
			return;
		}
		onMove(oldIndex, oldIndex + 1);
	};

	const onMoveBackward = (oldIndex) => {
		if (oldIndex === 0) {
			return;
		}
		onMove(oldIndex, oldIndex - 1);
	};

	const onRemoveButton = (index) => {
		const newcount = Math.abs(btnCount - 1);
		const newBtns = filter(btns, (item, i) => index !== i);

		setSelectedButton(null);
		setAttributes({
			btns: newBtns,
			btnCount: newcount,
		});
	};
	const onKeyRemoveButton = (index) => {
		const newcount = Math.abs(btnCount - 1);
		const newBtns = filter(btns, (item, i) => index !== i);

		setSelectedButton(null);
		setAttributes({
			btns: newBtns,
			btnCount: newcount,
		});
	};
	const onDuplicateButton = (index) => {
		const newcount = Math.abs(btnCount + 1);
		const duplicate = btns[index];
		btns.splice(index + 1, 0, duplicate);

		setSelectedButton(index + 1);
		setAttributes({
			btns,
			btnCount: newcount,
		});
		saveArrayUpdate({ iconSide: btns[0].iconSide }, 0);
	};

	const saveArrayUpdate = (value, index) => {
		const newItems = btns.map((item, thisIndex) => {
			if (index === thisIndex) {
				item = { ...item, ...value };
			}

			return item;
		});
		setAttributes({
			btns: newItems,
		});
	};

	const gconfig = {
		google: {
			families: [typography + (fontVariant ? ':' + fontVariant : '')],
		},
	};
	const saveMargin = (value) => {
		const newUpdate = margin.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			margin: newUpdate,
		});
	};
	const defaultBtnAttributes = defaultBtns;
	const blockConfigObject = kadence_blocks_params.configuration
		? JSON.parse(kadence_blocks_params.configuration)
		: [];
	if (
		blockConfigObject['kadence/advancedbtn'] !== undefined &&
		typeof blockConfigObject['kadence/advancedbtn'] === 'object' &&
		undefined !== blockConfigObject['kadence/advancedbtn'].btns
	) {
		defaultBtnAttributes[0] = { ...defaultBtns[0], ...blockConfigObject['kadence/advancedbtn'].btns[0] };
	}
	const marginMouseOver = mouseOverVisualizer();
	const buttonMarginMouseOver = mouseOverVisualizer();
	const previewMarginTop = getPreviewSize(
		getPreviewDevice,
		undefined !== margin && undefined !== margin[0] && undefined !== margin[0].desk && '' !== margin[0].desk[0]
			? margin[0].desk[0]
			: '',
		undefined !== margin && undefined !== margin[0] && undefined !== margin[0].tablet && '' !== margin[0].tablet[0]
			? margin[0].tablet[0]
			: '',
		undefined !== margin && undefined !== margin[0] && undefined !== margin[0].mobile && '' !== margin[0].mobile[0]
			? margin[0].mobile[0]
			: ''
	);
	const previewMarginRight = getPreviewSize(
		getPreviewDevice,
		undefined !== margin && undefined !== margin[0] && undefined !== margin[0].desk && '' !== margin[0].desk[1]
			? margin[0].desk[1]
			: '',
		undefined !== margin && undefined !== margin[0] && undefined !== margin[0].tablet && '' !== margin[0].tablet[1]
			? margin[0].tablet[1]
			: '',
		undefined !== margin && undefined !== margin[0] && undefined !== margin[0].mobile && '' !== margin[0].mobile[1]
			? margin[0].mobile[1]
			: ''
	);
	const previewMarginBottom = getPreviewSize(
		getPreviewDevice,
		undefined !== margin && undefined !== margin[0] && undefined !== margin[0].desk && '' !== margin[0].desk[2]
			? margin[0].desk[2]
			: '',
		undefined !== margin && undefined !== margin[0] && undefined !== margin[0].tablet && '' !== margin[0].tablet[2]
			? margin[0].tablet[2]
			: '',
		undefined !== margin && undefined !== margin[0] && undefined !== margin[0].mobile && '' !== margin[0].mobile[2]
			? margin[0].mobile[2]
			: ''
	);
	const previewMarginLeft = getPreviewSize(
		getPreviewDevice,
		undefined !== margin && undefined !== margin[0] && undefined !== margin[0].desk && '' !== margin[0].desk[3]
			? margin[0].desk[3]
			: '',
		undefined !== margin && undefined !== margin[0] && undefined !== margin[0].tablet && '' !== margin[0].tablet[3]
			? margin[0].tablet[3]
			: '',
		undefined !== margin && undefined !== margin[0] && undefined !== margin[0].mobile && '' !== margin[0].mobile[3]
			? margin[0].mobile[3]
			: ''
	);
	const marginMin = marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200;
	const marginMax = marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200;
	const marginStep = marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1;
	const btnSizes = [
		{ key: 'small', name: __('S', 'kadence-blocks') },
		{ key: 'standard', name: __('M', 'kadence-blocks') },
		{ key: 'large', name: __('L', 'kadence-blocks') },
		{ key: 'custom', name: <Icon icon={cog} /> },
	];
	const btnWidths = [
		{ key: 'auto', name: __('Auto', 'kadence-blocks') },
		{ key: 'fixed', name: __('Fixed', 'kadence-blocks') },
		{ key: 'full', name: __('Full', 'kadence-blocks') },
	];
	const gradTypes = [
		{ key: 'linear', name: __('Linear', 'kadence-blocks') },
		{ key: 'radial', name: __('Radial', 'kadence-blocks') },
	];
	const bgType = [
		{ key: 'solid', name: __('Solid', 'kadence-blocks') },
		{ key: 'gradient', name: __('Gradient', 'kadence-blocks') },
	];
	const config = googleFont ? gconfig : '';
	const renderBtns = (index) => {
		const isButtonSelected = isSelected && selectedButton === index;
		const fieldClassName = classnames({
			'btn-area-wrap': true,
			'is-selected': isButtonSelected,
			[`kt-btn-${index}-area`]: true,
		});
		let btnSize;
		if (undefined !== btns[index].paddingLR || undefined !== btns[index].paddingBT) {
			btnSize = 'custom';
		} else {
			btnSize = 'standard';
		}
		let btnbg;
		let btnGrad;
		let btnGrad2;
		if (undefined !== btns[index].backgroundType && 'gradient' === btns[index].backgroundType) {
			btnGrad =
				'transparent' === btns[index].background || undefined === btns[index].background
					? 'rgba(255,255,255,0)'
					: KadenceColorOutput(
							btns[index].background,
							btns[index].backgroundOpacity !== undefined ? btns[index].backgroundOpacity : 1
					  );
			btnGrad2 =
				undefined !== btns[index].gradient &&
				undefined !== btns[index].gradient[0] &&
				'' !== btns[index].gradient[0]
					? KadenceColorOutput(
							btns[index].gradient[0],
							undefined !== btns[index].gradient && btns[index].gradient[1] !== undefined
								? btns[index].gradient[1]
								: 1
					  )
					: KadenceColorOutput(
							'#999999',
							undefined !== btns[index].gradient && btns[index].gradient[1] !== undefined
								? btns[index].gradient[1]
								: 1
					  );
			if (undefined !== btns[index].gradient && 'radial' === btns[index].gradient[4]) {
				btnbg = `radial-gradient(at ${
					undefined === btns[index].gradient[6] ? 'center center' : btns[index].gradient[6]
				}, ${btnGrad} ${undefined === btns[index].gradient[2] ? '0' : btns[index].gradient[2]}%, ${btnGrad2} ${
					undefined === btns[index].gradient[3] ? '100' : btns[index].gradient[3]
				}%)`;
			} else if (undefined === btns[index].gradient || 'radial' !== btns[index].gradient[4]) {
				btnbg = `linear-gradient(${
					undefined !== btns[index].gradient && undefined !== btns[index].gradient[5]
						? btns[index].gradient[5]
						: '180'
				}deg, ${btnGrad} ${
					undefined !== btns[index].gradient && undefined !== btns[index].gradient[2]
						? btns[index].gradient[2]
						: '0'
				}%, ${btnGrad2} ${
					undefined !== btns[index].gradient && undefined !== btns[index].gradient[3]
						? btns[index].gradient[3]
						: '100'
				}%)`;
			}
		} else {
			btnbg =
				'transparent' === btns[index].background || undefined === btns[index].background
					? undefined
					: KadenceColorOutput(
							btns[index].background,
							btns[index].backgroundOpacity !== undefined ? btns[index].backgroundOpacity : 1
					  );
		}
		//const ariaLabel = sprintf( __( 'Button %1$d of %2$d', 'kadence-blocks' ), ( index + 1 ), btns.length );
		const ariaLabel = __('Button', 'kadence-blocks') + ' ' + (index + 1) + ' ' + __('Settings', 'kadence-blocks');
		const moveable = index === 0 && index + 1 === btns.length ? false : true;
		const btnClassName = classnames({
			'kt-button': true,
			[`kt-button-${index}`]: true,
			[`kt-btn-size-${btns[index].btnSize ? btns[index].btnSize : btnSize}`]: true,
			[`kt-btn-style-${btns[index].btnStyle ? btns[index].btnStyle : 'basic'}`]: true,
			[`kb-btn-global-${btns[index].inheritStyles}`]: btns[index].inheritStyles,
			'wp-block-button__link': btns[index].inheritStyles && 'inherit' === btns[index].inheritStyles,
			[`kb-btn-has-icon`]: btns[index].icon,
			[`kb-btn-only-icon`]: btns[index].icon && btns[index].onlyIcon && btns[index].onlyIcon[0],
			[`kb-btn-tablet-only-icon`]: btns[index].icon && btns[index].onlyIcon && btns[index].onlyIcon[1],
			[`kb-btn-mobile-only-icon`]: btns[index].icon && btns[index].onlyIcon && btns[index].onlyIcon[2],
		});

		const iconFontSize =
			getPreviewSize(
				getPreviewDevice,
				undefined !== btns[index].iconSize && undefined !== btns[index].iconSize[0]
					? btns[index].iconSize[0]
					: '',
				undefined !== btns[index].iconSize && undefined !== btns[index].iconSize[1]
					? btns[index].iconSize[1]
					: '',
				undefined !== btns[index].iconSize && undefined !== btns[index].iconSize[2]
					? btns[index].iconSize[2]
					: ''
			) + (undefined !== btns[index].iconSizeType ? btns[index].iconSizeType : 'px');
		const topIconPadding = getPreviewSize(
			getPreviewDevice,
			undefined !== btns[index].iconPadding &&
				undefined !== btns[index].iconPadding[0] &&
				'' !== btns[index].iconPadding[0]
				? btns[index].iconPadding[0]
				: '',
			undefined !== btns[index].iconTabletPadding &&
				undefined !== btns[index].iconTabletPadding[0] &&
				'' !== btns[index].iconTabletPadding[0]
				? btns[index].iconTabletPadding[0]
				: '',
			undefined !== btns[index].iconMobilePadding &&
				undefined !== btns[index].iconMobilePadding[0] &&
				'' !== btns[index].iconMobilePadding[0]
				? btns[index].iconMobilePadding[0]
				: ''
		);
		const rightIconPadding = getPreviewSize(
			getPreviewDevice,
			undefined !== btns[index].iconPadding &&
				undefined !== btns[index].iconPadding[1] &&
				'' !== btns[index].iconPadding[1]
				? btns[index].iconPadding[1]
				: '',
			undefined !== btns[index].iconTabletPadding &&
				undefined !== btns[index].iconTabletPadding[1] &&
				'' !== btns[index].iconTabletPadding[1]
				? btns[index].iconTabletPadding[1]
				: '',
			undefined !== btns[index].iconMobilePadding &&
				undefined !== btns[index].iconMobilePadding[1] &&
				'' !== btns[index].iconMobilePadding[1]
				? btns[index].iconMobilePadding[1]
				: ''
		);
		const bottomIconPadding = getPreviewSize(
			getPreviewDevice,
			undefined !== btns[index].iconPadding &&
				undefined !== btns[index].iconPadding[2] &&
				'' !== btns[index].iconPadding[2]
				? btns[index].iconPadding[2]
				: '',
			undefined !== btns[index].iconTabletPadding &&
				undefined !== btns[index].iconTabletPadding[2] &&
				'' !== btns[index].iconTabletPadding[2]
				? btns[index].iconTabletPadding[2]
				: '',
			undefined !== btns[index].iconMobilePadding &&
				undefined !== btns[index].iconMobilePadding[2] &&
				'' !== btns[index].iconMobilePadding[2]
				? btns[index].iconMobilePadding[2]
				: ''
		);
		const leftIconPadding = getPreviewSize(
			getPreviewDevice,
			undefined !== btns[index].iconPadding &&
				undefined !== btns[index].iconPadding[3] &&
				'' !== btns[index].iconPadding[3]
				? btns[index].iconPadding[3]
				: '',
			undefined !== btns[index].iconTabletPadding &&
				undefined !== btns[index].iconTabletPadding[3] &&
				'' !== btns[index].iconTabletPadding[3]
				? btns[index].iconTabletPadding[3]
				: '',
			undefined !== btns[index].iconMobilePadding &&
				undefined !== btns[index].iconMobilePadding[3] &&
				'' !== btns[index].iconMobilePadding[3]
				? btns[index].iconMobilePadding[3]
				: ''
		);
		const topBtnMargin = getPreviewSize(
			getPreviewDevice,
			undefined !== btns[index].margin && undefined !== btns[index].margin[0] && '' !== btns[index].margin[0]
				? btns[index].margin[0]
				: '',
			undefined !== btns[index].tabletMargin &&
				undefined !== btns[index].tabletMargin[0] &&
				'' !== btns[index].tabletMargin[0]
				? btns[index].tabletMargin[0]
				: '',
			undefined !== btns[index].mobileMargin &&
				undefined !== btns[index].mobileMargin[0] &&
				'' !== btns[index].mobileMargin[0]
				? btns[index].mobileMargin[0]
				: ''
		);
		const rightBtnMargin = getPreviewSize(
			getPreviewDevice,
			undefined !== btns[index].margin && undefined !== btns[index].margin[1] && '' !== btns[index].margin[1]
				? btns[index].margin[1]
				: '',
			undefined !== btns[index].tabletMargin &&
				undefined !== btns[index].tabletMargin[1] &&
				'' !== btns[index].tabletMargin[1]
				? btns[index].tabletMargin[1]
				: '',
			undefined !== btns[index].mobileMargin &&
				undefined !== btns[index].mobileMargin[1] &&
				'' !== btns[index].mobileMargin[1]
				? btns[index].mobileMargin[1]
				: ''
		);
		const bottomBtnMargin = getPreviewSize(
			getPreviewDevice,
			undefined !== btns[index].margin && undefined !== btns[index].margin[2] && '' !== btns[index].margin[2]
				? btns[index].margin[2]
				: '',
			undefined !== btns[index].tabletMargin &&
				undefined !== btns[index].tabletMargin[2] &&
				'' !== btns[index].tabletMargin[2]
				? btns[index].tabletMargin[2]
				: '',
			undefined !== btns[index].mobileMargin &&
				undefined !== btns[index].mobileMargin[2] &&
				'' !== btns[index].mobileMargin[2]
				? btns[index].mobileMargin[2]
				: ''
		);
		const leftBtnMargin = getPreviewSize(
			getPreviewDevice,
			undefined !== btns[index].margin && undefined !== btns[index].margin[3] && '' !== btns[index].margin[3]
				? btns[index].margin[3]
				: '',
			undefined !== btns[index].tabletMargin &&
				undefined !== btns[index].tabletMargin[3] &&
				'' !== btns[index].tabletMargin[3]
				? btns[index].tabletMargin[3]
				: '',
			undefined !== btns[index].mobileMargin &&
				undefined !== btns[index].mobileMargin[3] &&
				'' !== btns[index].mobileMargin[3]
				? btns[index].mobileMargin[3]
				: ''
		);
		const previewFixedWidth = getPreviewSize(
			getPreviewDevice,
			btns[index].width && undefined !== btns[index].width[0] ? btns[index].width[0] : undefined,
			btns[index].width && undefined !== btns[index].width[1] ? btns[index].width[1] : undefined,
			btns[index].width && undefined !== btns[index].width[2] ? btns[index].width[2] : undefined
		);

		return (
			<div
				className={fieldClassName}
				style={{
					marginRight: btns[index].gap + 'px',
				}}
				tabIndex="0"
				aria-label={ariaLabel}
				role="button"
				onClick={() => onSelectButton(index)}
				unstableOnFocus={() => onSelectButton(index)}
				onKeyDown={(event) => {
					const { keyCode } = event;
					if (keyCode === DELETE) {
						//onKeyRemoveButton( index );
					}
				}}
			>
				<span
					className={`kt-button-wrap kt-btn-${index}-action kt-btn-svg-show-${
						!btns[index].iconHover ? 'always' : 'hover'
					}`}
				>
					<span
						className={btnClassName}
						style={{
							background: undefined !== btnbg ? btnbg : undefined,
							color: undefined !== btns[index].color ? KadenceColorOutput(btns[index].color) : undefined,
							fontSize:
								getPreviewSize(
									getPreviewDevice,
									undefined !== btns[index].size ? btns[index].size : undefined,
									undefined !== btns[index].responsiveSize &&
										undefined !== btns[index].responsiveSize[0]
										? btns[index].responsiveSize[0]
										: '',
									undefined !== btns[index].responsiveSize &&
										undefined !== btns[index].responsiveSize[1]
										? btns[index].responsiveSize[1]
										: ''
								) + (undefined !== btns[index].sizeType ? btns[index].sizeType : 'px'),
							fontWeight,
							fontStyle,
							letterSpacing: letterSpacing + 'px',
							textTransform: textTransform ? textTransform : undefined,
							fontFamily: typography ? typography : '',
							borderRadius:
								undefined !== btns[index].borderRadius ? btns[index].borderRadius + 'px' : undefined,
							borderWidth:
								undefined !== btns[index].borderWidth && '' !== btns[index].borderWidth
									? btns[index].borderWidth + 'px'
									: undefined,
							borderStyle:
								undefined !== btns[index].borderStyle && '' !== btns[index].borderStyle
									? btns[index].borderStyle
									: undefined,
							borderColor:
								undefined === btns[index].border
									? '#555555'
									: KadenceColorOutput(
											btns[index].border,
											btns[index].borderOpacity !== undefined ? btns[index].borderOpacity : 1
									  ),
							paddingLeft:
								undefined !== btns[index].paddingLR && 'custom' === btns[index].btnSize
									? btns[index].paddingLR + 'px'
									: undefined,
							paddingRight:
								undefined !== btns[index].paddingLR && 'custom' === btns[index].btnSize
									? btns[index].paddingLR + 'px'
									: undefined,
							paddingTop:
								undefined !== btns[index].paddingBT && 'custom' === btns[index].btnSize
									? btns[index].paddingBT + 'px'
									: undefined,
							paddingBottom:
								undefined !== btns[index].paddingBT && 'custom' === btns[index].btnSize
									? btns[index].paddingBT + 'px'
									: undefined,
							marginTop:
								'' !== topBtnMargin
									? getSpacingOptionOutput(
											topBtnMargin,
											undefined !== btns[index].marginUnit ? btns[index].marginUnit : 'px'
									  )
									: undefined,
							marginRight:
								'' !== rightBtnMargin
									? getSpacingOptionOutput(
											rightBtnMargin,
											undefined !== btns[index].marginUnit ? btns[index].marginUnit : 'px'
									  )
									: undefined,
							marginBottom:
								'' !== bottomBtnMargin
									? getSpacingOptionOutput(
											bottomBtnMargin,
											undefined !== btns[index].marginUnit ? btns[index].marginUnit : 'px'
									  )
									: undefined,
							marginLeft:
								'' !== leftBtnMargin
									? getSpacingOptionOutput(
											leftBtnMargin,
											undefined !== btns[index].marginUnit ? btns[index].marginUnit : 'px'
									  )
									: undefined,
							width:
								undefined !== widthType && 'fixed' === widthType && undefined !== previewFixedWidth
									? previewFixedWidth + (undefined !== widthUnit ? widthUnit : 'px')
									: undefined,
							boxShadow:
								undefined !== btns[index].boxShadow &&
								undefined !== btns[index].boxShadow[0] &&
								btns[index].boxShadow[0]
									? (undefined !== btns[index].boxShadow[7] && btns[index].boxShadow[7]
											? 'inset '
											: '') +
									  (undefined !== btns[index].boxShadow[3] ? btns[index].boxShadow[3] : 1) +
									  'px ' +
									  (undefined !== btns[index].boxShadow[4] ? btns[index].boxShadow[4] : 1) +
									  'px ' +
									  (undefined !== btns[index].boxShadow[5] ? btns[index].boxShadow[5] : 2) +
									  'px ' +
									  (undefined !== btns[index].boxShadow[6] ? btns[index].boxShadow[6] : 0) +
									  'px ' +
									  KadenceColorOutput(
											undefined !== btns[index].boxShadow[1]
												? btns[index].boxShadow[1]
												: '#000000',
											undefined !== btns[index].boxShadow[2] ? btns[index].boxShadow[2] : 1
									  )
									: undefined,
						}}
					>
						{btns[index].icon && 'left' === btns[index].iconSide && (
							<IconRender
								className={`kt-btn-svg-icon kt-btn-svg-icon-${btns[index].icon} kt-btn-side-${btns[index].iconSide}`}
								name={btns[index].icon}
								size={'1em'}
								style={{
									fontSize: iconFontSize,
									color:
										undefined !== btns[index].iconColor
											? KadenceColorOutput(btns[index].iconColor)
											: undefined,
									paddingTop: topIconPadding ? topIconPadding + 'px' : undefined,
									paddingRight: rightIconPadding ? rightIconPadding + 'px' : undefined,
									paddingBottom: bottomIconPadding ? bottomIconPadding + 'px' : undefined,
									paddingLeft: leftIconPadding ? leftIconPadding + 'px' : undefined,
								}}
							/>
						)}
						{/* { applyFilters( 'kadence.dynamicContent', <RichText
								tagName="div"
								placeholder={ __( 'Button…', 'kadence-blocks' ) }
								value={ btns[ index ].text }
								unstableOnFocus={ () => {
									if ( 1 === index ) {
										onFocusBtn1();
									} else if ( 2 === index ) {
										onFocusBtn2();
									} else if ( 3 === index ) {
										onFocusBtn3();
									} else if ( 4 === index ) {
										onFocusBtn4();
									} else {
										onFocusBtn();
									}
								} }
								onChange={ value => {
									saveArrayUpdate( { text: value }, index );
								} }
								allowedFormats={ applyFilters( 'kadence.whitelist_richtext_formats', [ 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ], 'kadence/advancedbtn' ) }
								className={ 'kt-button-text' }
								keepPlaceholderOnFocus
							/>, attributes, 'btns:' + index + ':text' ) } */}
						<RichText
							tagName="div"
							placeholder={__('Button…', 'kadence-blocks')}
							value={btns[index].text}
							unstableOnFocus={() => {
								if (1 === index) {
									onFocusBtn1();
								} else if (2 === index) {
									onFocusBtn2();
								} else if (3 === index) {
									onFocusBtn3();
								} else if (4 === index) {
									onFocusBtn4();
								} else {
									onFocusBtn();
								}
							}}
							onChange={(value) => {
								saveArrayUpdate({ text: value }, index);
							}}
							allowedFormats={applyFilters(
								'kadence.whitelist_richtext_formats',
								[
									'kadence/insert-dynamic',
									'core/bold',
									'core/italic',
									'core/strikethrough',
									'toolset/inline-field',
								],
								'kadence/advancedbtn'
							)}
							className={'kt-button-text'}
							keepPlaceholderOnFocus
						/>
						{btns[index].icon && 'left' !== btns[index].iconSide && (
							<IconRender
								className={`kt-btn-svg-icon kt-btn-svg-icon-${btns[index].icon} kt-btn-side-${btns[index].iconSide}`}
								name={btns[index].icon}
								size={'1em'}
								style={{
									fontSize: iconFontSize,
									color:
										undefined !== btns[index].iconColor
											? KadenceColorOutput(btns[index].iconColor)
											: undefined,
									paddingTop: topIconPadding ? topIconPadding + 'px' : undefined,
									paddingRight: rightIconPadding ? rightIconPadding + 'px' : undefined,
									paddingBottom: bottomIconPadding ? bottomIconPadding + 'px' : undefined,
									paddingLeft: leftIconPadding ? leftIconPadding + 'px' : undefined,
								}}
							/>
						)}
					</span>
				</span>
				{isButtonSelected && !hideLink && (
					<URLInputInline
						url={btns[index].link}
						onChangeUrl={(value) => {
							saveArrayUpdate({ link: value }, index);
						}}
						additionalControls={true}
						changeTargetType={true}
						opensInNewTab={undefined !== btns[index].target ? btns[index].target : ''}
						onChangeTarget={(value) => {
							saveArrayUpdate({ target: value }, index);
						}}
						linkNoFollow={undefined !== btns[index].noFollow ? btns[index].noFollow : false}
						onChangeFollow={(value) => {
							saveArrayUpdate({ noFollow: value }, index);
						}}
						linkSponsored={undefined !== btns[index].sponsored ? btns[index].sponsored : false}
						onChangeSponsored={(value) => {
							saveArrayUpdate({ sponsored: value }, index);
						}}
						linkDownload={undefined !== btns[index].download ? btns[index].download : false}
						onChangeDownload={(value) => {
							saveArrayUpdate({ download: value }, index);
						}}
						dynamicAttribute={'btns:' + index + ':link'}
						allowClear={true}
						{...props}
					/>
				)}
				{isButtonSelected && (
					<Fragment>
						<div className="kadence-blocks-button-item-controls kadence-blocks-button-item__move-menu">
							<ButtonStyleCopyPaste
								onPasteWrap={(value) => setAttributes(value)}
								onPasteButton={(value) => saveArrayUpdate(value, index)}
								blockAttributes={attributes}
								buttonIndex={index}
							/>
							{moveable && !lockBtnCount && (
								<DropdownMenu
									className="block-editor-block-settings-menu kadence-blocks-button-item__move-menu_item"
									icon={code}
									label={__('Move Button', 'kadence-blocks')}
									popoverProps={POPOVER_PROPS}
								>
									{({ onClose }) => (
										<Fragment>
											<MenuGroup>
												<MenuItem
													icon={chevronLeft}
													onClick={() => {
														onClose;
														onMoveBackward(index);
													}}
													disabled={index === 0}
													label={__('Move Left', 'kadence-blocks')}
												>
													{__('Move Left', 'kadence-blocks')}
												</MenuItem>
												<MenuItem
													icon={chevronRight}
													onClick={() => {
														onClose;
														onMoveForward(index);
													}}
													disabled={index + 1 === btns.length}
													label={__('Move Right', 'kadence-blocks')}
												>
													{__('Move Right', 'kadence-blocks')}
												</MenuItem>
											</MenuGroup>
										</Fragment>
									)}
								</DropdownMenu>
							)}
						</div>
						{!lockBtnCount && (
							<div className="kadence-blocks-button-item-controls kadence-blocks-button-item__inline-menu">
								<Button
									icon={pages}
									onClick={() => onDuplicateButton(index)}
									className="kadence-blocks-button-item__duplicate"
									label={__('Duplicate Button', 'kadence-blocks')}
									disabled={!isButtonSelected}
								/>
								<Button
									icon={close}
									onClick={() => onRemoveButton(index)}
									className="kadence-blocks-button-item__remove"
									label={__('Remove Button', 'kadence-blocks')}
									disabled={!isButtonSelected || 1 === btns.length}
								/>
							</div>
						)}
					</Fragment>
				)}

				<SpacingVisualizer
					type="inside"
					forceShow={marginMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(topBtnMargin, btns[index].marginUnit),
						getSpacingOptionOutput(rightBtnMargin, btns[index].marginUnit),
						getSpacingOptionOutput(bottomBtnMargin, btns[index].marginUnit),
						getSpacingOptionOutput(leftBtnMargin, btns[index].marginUnit),
					]}
				/>
			</div>
		);
	};
	const onFocusBtn = () => {
		if ('btn0' !== btnFocused) {
			setBtnFocused('btn0');
		}
	};
	const onFocusBtn1 = () => {
		if ('btn1' !== btnFocused) {
			setBtnFocused('btn1');
		}
	};
	const onFocusBtn2 = () => {
		if ('btn2' !== btnFocused) {
			setBtnFocused('btn2');
		}
	};
	const onFocusBtn3 = () => {
		if ('btn3' !== btnFocused) {
			setBtnFocused('btn3');
		}
	};
	const onFocusBtn4 = () => {
		if ('btn4' !== btnFocused) {
			setBtnFocused('btn4');
		}
	};
	const defineWidthType = (type) => {
		if ('full' === type) {
			setAttributes({ forceFullwidth: true });
			setAttributes({ widthType: type });
		} else {
			setAttributes({ forceFullwidth: false });
			setAttributes({ widthType: type });
		}
	};
	const defineWidthTypeToggle = (value) => {
		if (value) {
			setAttributes({ forceFullwidth: true });
			setAttributes({ widthType: 'full' });
		} else {
			setAttributes({ forceFullwidth: false });
			setAttributes({ widthType: 'full' });
		}
	};
	const buttonStyleOptions = [
		{ key: '', name: __('Default', 'kadence-blocks') },
		{ key: 'inherit', name: __('Theme', 'kadence-blocks') },
		// { key: 'leftabove', name: __( 'Left Above' ), icon: infoLeftAboveIcon },
		// { key: 'left', name: __( 'Left' ), icon: infoLeftIcon },
		// { key: 'overlay', name: __( 'Overlay' ), icon: infoTopOverlayIcons },
		// { key: 'overlayleft', name: __( 'Overlay Left' ), icon: infoLeftOverlayIcons },
	];
	const blockToolControls = (index) => {
		const isButtonSelected = isSelected && selectedButton === index && kadence_blocks_params.dynamic_enabled;
		if (!isButtonSelected) {
			return;
		}
		return <DynamicTextControl dynamicAttribute={'btns:' + index + ':text'} {...props} />;
	};
	const tabControls = (index) => {
		const isButtonSelected = isSelected && selectedButton === index;
		return (
			<KadencePanelBody
				title={__('Button', 'kadence-blocks') + ' ' + (index + 1) + ' ' + __('Settings', 'kadence-blocks')}
				initialOpen={false}
				opened={true === isButtonSelected ? true : undefined}
				panelName={'kb-adv-btn-' + index}
			>
				<Fragment>
					<h2 className="side-h2-label">{__('Button Inherit Styles', 'kadence-blocks')}</h2>
					<ButtonGroup
						className="kt-style-btn-group kb-button-global-styles"
						aria-label={__('Button Global Styles', 'kadence-blocks')}
					>
						{map(buttonStyleOptions, ({ name, key }) => (
							<Button
								key={key}
								className="kt-style-btn"
								isSmall
								isPrimary={
									undefined !== btns[index].inheritStyles && btns[index].inheritStyles === key
										? true
										: false
								}
								aria-pressed={
									undefined !== btns[index].inheritStyles && btns[index].inheritStyles === key
										? true
										: false
								}
								onClick={() => {
									//saveArrayUpdate( { inheritStyles: key }, index );
									if (key === 'inherit') {
										saveArrayUpdate(
											{
												color: '',
												background: '',
												backgroundType: 'solid',
												border: '',
												colorHover: '',
												backgroundHover: '',
												backgroundHoverType: 'solid',
												borderHover: '',
												inheritStyles: key,
											},
											index
										);
									} else {
										saveArrayUpdate(
											{
												color: defaultBtnAttributes[0].color,
												background: defaultBtnAttributes[0].background,
												backgroundType: defaultBtnAttributes[0].backgroundType,
												border: defaultBtnAttributes[0].border,
												colorHover: defaultBtnAttributes[0].colorHover,
												backgroundHover: defaultBtnAttributes[0].backgroundHover,
												backgroundHoverType: defaultBtnAttributes[0].backgroundHoverType,
												borderHover: defaultBtnAttributes[0].borderHover,
												inheritStyles: key,
											},
											index
										);
									}
								}}
							>
								{name}
							</Button>
						))}
					</ButtonGroup>
				</Fragment>
				{!hideLink && (
					<URLInputControl
						label={__('Button Link', 'kadence-blocks')}
						url={btns[index].link}
						onChangeUrl={(value) => {
							saveArrayUpdate({ link: value }, index);
						}}
						additionalControls={true}
						changeTargetType={true}
						opensInNewTab={undefined !== btns[index].target ? btns[index].target : ''}
						onChangeTarget={(value) => {
							saveArrayUpdate({ target: value }, index);
						}}
						linkNoFollow={undefined !== btns[index].noFollow ? btns[index].noFollow : false}
						onChangeFollow={(value) => {
							saveArrayUpdate({ noFollow: value }, index);
						}}
						linkSponsored={undefined !== btns[index].sponsored ? btns[index].sponsored : false}
						onChangeSponsored={(value) => {
							saveArrayUpdate({ sponsored: value }, index);
						}}
						linkDownload={undefined !== btns[index].download ? btns[index].download : false}
						onChangeDownload={(value) => {
							saveArrayUpdate({ download: value }, index);
						}}
						dynamicAttribute={'btns:' + index + ':link'}
						allowClear={true}
						{...props}
					/>
				)}
				{showSettings('sizeSettings', 'kadence/advancedbtn') && (
					<Fragment>
						<ResponsiveRangeControls
							label={__('Font Size', 'kadence-blocks')}
							value={btns[index].size ? btns[index].size : ''}
							onChange={(value) => {
								saveArrayUpdate({ size: value }, index);
							}}
							tabletValue={
								undefined !== btns[index].responsiveSize && undefined !== btns[index].responsiveSize[0]
									? btns[index].responsiveSize[0]
									: ''
							}
							onChangeTablet={(value) => {
								saveArrayUpdate(
									{
										responsiveSize: [
											value,
											undefined !== btns[index].responsiveSize &&
											undefined !== btns[index].responsiveSize[1]
												? btns[index].responsiveSize[1]
												: '',
										],
									},
									index
								);
							}}
							mobileValue={
								undefined !== btns[index].responsiveSize && undefined !== btns[index].responsiveSize[1]
									? btns[index].responsiveSize[1]
									: ''
							}
							onChangeMobile={(value) => {
								saveArrayUpdate(
									{
										responsiveSize: [
											undefined !== btns[index].responsiveSize &&
											undefined !== btns[index].responsiveSize[0]
												? btns[index].responsiveSize[0]
												: '',
											value,
										],
									},
									index
								);
							}}
							min={0}
							max={(btns[index].sizeType ? btns[index].sizeType : 'px') !== 'px' ? 12 : 200}
							step={(btns[index].sizeType ? btns[index].sizeType : 'px') !== 'px' ? 0.1 : 1}
							unit={btns[index].sizeType ? btns[index].sizeType : 'px'}
							onUnit={(value) => {
								saveArrayUpdate({ sizeType: value }, index);
							}}
							units={['px', 'em', 'rem']}
						/>
						<div className="kt-btn-size-settings-container">
							<h2 className="kt-beside-btn-group">{__('Button Size', 'kadence-blocks')}</h2>
							<ButtonGroup
								className="kt-button-size-type-options"
								aria-label={__('Button Size', 'kadence-blocks')}
							>
								{map(btnSizes, ({ name, key }) => (
									<Button
										key={key}
										className="kt-btn-size-btn"
										isSmall
										isPrimary={btns[index].btnSize === key}
										aria-pressed={btns[index].btnSize === key}
										onClick={() => saveArrayUpdate({ btnSize: key }, index)}
									>
										{name}
									</Button>
								))}
							</ButtonGroup>
						</div>
						{'custom' === btns[index].btnSize && (
							<div className="kt-inner-sub-section">
								<h2 className="kt-heading-size-title kt-secondary-color-size">
									{__('Padding', 'kadence-blocks')}
								</h2>
								<TabPanel
									className="kt-size-tabs"
									activeClass="active-tab"
									tabs={[
										{
											name: 'desk',
											title: <Dashicon icon="desktop" />,
											className: 'kt-desk-tab',
										},
										{
											name: 'tablet',
											title: <Dashicon icon="tablet" />,
											className: 'kt-tablet-tab',
										},
										{
											name: 'mobile',
											title: <Dashicon icon="smartphone" />,
											className: 'kt-mobile-tab',
										},
									]}
								>
									{(tab) => {
										let tabout;
										if (tab.name) {
											if ('mobile' === tab.name) {
												tabout = (
													<Fragment>
														<RangeControl
															label={__('Top and Bottom Padding', 'kadence-blocks')}
															value={
																undefined !== btns[index].responsivePaddingBT &&
																undefined !== btns[index].responsivePaddingBT[1]
																	? btns[index].responsivePaddingBT[1]
																	: ''
															}
															onChange={(value) => {
																saveArrayUpdate(
																	{
																		responsivePaddingBT: [
																			undefined !==
																				btns[index].responsivePaddingBT &&
																			undefined !==
																				btns[index].responsivePaddingBT[0]
																				? btns[index].responsivePaddingBT[0]
																				: '',
																			value,
																		],
																	},
																	index
																);
															}}
															min={0}
															max={100}
														/>
														<RangeControl
															label={__('Left and Right Padding', 'kadence-blocks')}
															value={
																undefined !== btns[index].responsivePaddingLR &&
																undefined !== btns[index].responsivePaddingLR[1]
																	? btns[index].responsivePaddingLR[1]
																	: ''
															}
															onChange={(value) => {
																saveArrayUpdate(
																	{
																		responsivePaddingLR: [
																			undefined !==
																				btns[index].responsivePaddingLR &&
																			undefined !==
																				btns[index].responsivePaddingLR[0]
																				? btns[index].responsivePaddingLR[0]
																				: '',
																			value,
																		],
																	},
																	index
																);
															}}
															min={0}
															max={100}
														/>
													</Fragment>
												);
											} else if ('tablet' === tab.name) {
												tabout = (
													<Fragment>
														<RangeControl
															label={__('Top and Bottom Padding', 'kadence-blocks')}
															value={
																undefined !== btns[index].responsivePaddingBT &&
																undefined !== btns[index].responsivePaddingBT[0]
																	? btns[index].responsivePaddingBT[0]
																	: ''
															}
															onChange={(value) => {
																saveArrayUpdate(
																	{
																		responsivePaddingBT: [
																			value,
																			undefined !==
																				btns[index].responsivePaddingBT &&
																			undefined !==
																				btns[index].responsivePaddingBT[1]
																				? btns[index].responsivePaddingBT[1]
																				: '',
																		],
																	},
																	index
																);
															}}
															min={0}
															max={100}
														/>
														<RangeControl
															label={__('Left and Right Padding', 'kadence-blocks')}
															value={
																undefined !== btns[index].responsivePaddingLR &&
																undefined !== btns[index].responsivePaddingLR[0]
																	? btns[index].responsivePaddingLR[0]
																	: ''
															}
															onChange={(value) => {
																saveArrayUpdate(
																	{
																		responsivePaddingLR: [
																			value,
																			undefined !==
																				btns[index].responsivePaddingLR &&
																			undefined !==
																				btns[index].responsivePaddingLR[1]
																				? btns[index].responsivePaddingLR[1]
																				: '',
																		],
																	},
																	index
																);
															}}
															min={0}
															max={100}
														/>
													</Fragment>
												);
											} else {
												tabout = (
													<Fragment>
														<RangeControl
															label={__('Top and Bottom Padding', 'kadence-blocks')}
															value={btns[index].paddingBT}
															onChange={(value) => {
																saveArrayUpdate({ paddingBT: value }, index);
															}}
															min={0}
															max={100}
														/>
														<RangeControl
															label={__('Left and Right Padding', 'kadence-blocks')}
															value={btns[index].paddingLR}
															onChange={(value) => {
																saveArrayUpdate({ paddingLR: value }, index);
															}}
															min={0}
															max={100}
														/>
													</Fragment>
												);
											}
										}
										return (
											<div className={tab.className} key={tab.className}>
												{tabout}
											</div>
										);
									}}
								</TabPanel>
							</div>
						)}
						<div className="kt-btn-size-settings-container">
							<h2 className="kt-beside-btn-group">{__('Button Width', 'kadence-blocks')}</h2>
							<ButtonGroup
								className="kt-button-size-type-options"
								aria-label={__('Button Width', 'kadence-blocks')}
							>
								{map(btnWidths, ({ name, key }) => (
									<Button
										key={key}
										className="kt-btn-size-btn"
										isSmall
										isPrimary={widthType === key}
										aria-pressed={widthType === key}
										onClick={() => defineWidthType(key)}
									>
										{name}
									</Button>
								))}
							</ButtonGroup>
						</div>
						{'full' === widthType && (
							<ToggleControl
								label={__('Collapse on mobile', 'kadence-blocks')}
								checked={undefined !== collapseFullwidth ? collapseFullwidth : false}
								onChange={(value) => setAttributes({ collapseFullwidth: value })}
							/>
						)}
						{'fixed' === widthType && (
							<div className="kt-inner-sub-section">
								<ResponsiveRangeControls
									label={__('Fixed Width', 'kadence-blocks')}
									value={
										btns[index].width && undefined !== btns[index].width[0]
											? btns[index].width[0]
											: undefined
									}
									onChange={(value) => {
										saveArrayUpdate(
											{
												width: [
													value,
													undefined !== btns[index].width &&
													undefined !== btns[index].width[1]
														? btns[index].width[1]
														: '',
													undefined !== btns[index].width &&
													undefined !== btns[index].width[2]
														? btns[index].width[2]
														: '',
												],
											},
											index
										);
									}}
									tabletValue={
										btns[index].width && undefined !== btns[index].width[1]
											? btns[index].width[1]
											: undefined
									}
									onChangeTablet={(value) => {
										saveArrayUpdate(
											{
												width: [
													undefined !== btns[index].width &&
													undefined !== btns[index].width[0]
														? btns[index].width[0]
														: '',
													value,
													undefined !== btns[index].width &&
													undefined !== btns[index].width[2]
														? btns[index].width[2]
														: '',
												],
											},
											index
										);
									}}
									mobileValue={
										btns[index].width && undefined !== btns[index].width[2]
											? btns[index].width[2]
											: undefined
									}
									onChangeMobile={(value) => {
										saveArrayUpdate(
											{
												width: [
													undefined !== btns[index].width &&
													undefined !== btns[index].width[0]
														? btns[index].width[0]
														: '',
													undefined !== btns[index].width &&
													undefined !== btns[index].width[1]
														? btns[index].width[1]
														: '',
													value,
												],
											},
											index
										);
									}}
									min={10}
									max={(widthUnit ? widthUnit : 'px') !== 'px' ? 100 : 600}
									step={1}
									unit={widthUnit ? widthUnit : 'px'}
									onUnit={(value) => {
										setAttributes({ widthUnit: value });
									}}
									units={['px', '%']}
								/>
							</div>
						)}
					</Fragment>
				)}
				{showSettings('colorSettings', 'kadence/advancedbtn') && (
					<Fragment>
						<h2 className="kt-tab-wrap-title kt-color-settings-title" style={{ marginBottom: '10px' }}>
							{__('Color Settings', 'kadence-blocks')}
						</h2>
						<TabPanel
							className="kt-inspect-tabs kt-hover-tabs"
							activeClass="active-tab"
							tabs={[
								{
									name: 'normal' + index,
									title: __('Normal', 'kadence-blocks'),
									className: 'kt-normal-tab',
								},
								{
									name: 'hover' + index,
									title: __('Hover', 'kadence-blocks'),
									className: 'kt-hover-tab',
								},
							]}
						>
							{(tab) => {
								let tabout;
								if (tab.name) {
									if ('hover' + index === tab.name) {
										tabout = hoverSettings(index);
									} else {
										tabout = buttonSettings(index);
									}
								}
								return (
									<div className={tab.className} key={tab.className}>
										{tabout}
									</div>
								);
							}}
						</TabPanel>
						<h2>{__('Border Settings', 'kadence-blocks')}</h2>
						<RangeControl
							label={__('Border Width', 'kadence-blocks')}
							value={btns[index].borderWidth}
							onChange={(value) => {
								saveArrayUpdate({ borderWidth: value }, index);
							}}
							min={0}
							max={20}
						/>
						<SelectControl
							label={__('Border Style', 'kadence-blocks')}
							value={
								undefined !== btns[index].borderStyle && btns[index].borderStyle
									? btns[index].borderStyle
									: ''
							}
							options={[
								{ value: '', label: __('Default', 'kadence-blocks') },
								{ value: 'solid', label: __('Solid', 'kadence-blocks') },
								{ value: 'dashed', label: __('Dashed', 'kadence-blocks') },
								{ value: 'dotted', label: __('Dotted', 'kadence-blocks') },
								{ value: 'double', label: __('Double', 'kadence-blocks') },
								{ value: 'groove', label: __('Groove', 'kadence-blocks') },
								{ value: 'ridge', label: __('Ridge', 'kadence-blocks') },
							]}
							onChange={(value) => {
								saveArrayUpdate({ borderStyle: value }, index);
							}}
						/>
						<RangeControl
							label={__('Border Radius', 'kadence-blocks')}
							value={btns[index].borderRadius}
							onChange={(value) => {
								saveArrayUpdate({ borderRadius: value }, index);
							}}
							min={0}
							max={50}
						/>
						<ResponsiveMeasureRangeControl
							label={__('Button Margin', 'kadence-blocks')}
							value={undefined !== btns[index].margin ? btns[index].margin : ['', '', '', '']}
							tabletValue={
								undefined !== btns[index].tabletMargin ? btns[index].tabletMargin : ['', '', '', '']
							}
							mobileValue={
								undefined !== btns[index].mobileMargin ? btns[index].mobileMargin : ['', '', '', '']
							}
							onChange={(value) => {
								saveArrayUpdate({ margin: value }, index);
							}}
							onChangeTablet={(value) => {
								saveArrayUpdate({ tabletMargin: value }, index);
							}}
							onChangeMobile={(value) => {
								saveArrayUpdate({ mobileMargin: value }, index);
							}}
							min={0}
							max={
								(undefined !== btns[index].marginUnit ? btns[index].marginUnit : 'px') !== 'px'
									? 12
									: 200
							}
							step={
								(undefined !== btns[index].marginUnit ? btns[index].marginUnit : 'px') !== 'px'
									? 0.1
									: 1
							}
							unit={undefined !== btns[index].marginUnit ? btns[index].marginUnit : 'px'}
							units={['px', 'em', 'rem']}
							onUnit={(value) => saveArrayUpdate({ marginUnit: value }, index)}
							onMouseOver={buttonMarginMouseOver.onMouseOver}
							onMouseOut={buttonMarginMouseOver.onMouseOut}
						/>
					</Fragment>
				)}
				{showSettings('iconSettings', 'kadence/advancedbtn') && (
					<Fragment>
						<h2 className="kt-tool">{__('Icon Settings', 'kadence-blocks')}</h2>
						<div className="kt-select-icon-container">
							<KadenceIconPicker
								value={btns[index].icon}
								onChange={(value) => {
									saveArrayUpdate({ icon: value }, index);
								}}
							/>
						</div>
						<ResponsiveRangeControls
							label={__('Icon Size', 'kadence-blocks')}
							value={
								btns[index].iconSize && undefined !== btns[index].iconSize[0] && btns[index].iconSize[0]
									? btns[index].iconSize[0]
									: ''
							}
							onChange={(value) => {
								saveArrayUpdate(
									{
										iconSize: [
											value,
											btns[index].iconSize &&
											undefined !== btns[index].iconSize[1] &&
											btns[index].iconSize[1]
												? btns[index].iconSize[1]
												: '',
											btns[index].iconSize &&
											undefined !== btns[index].iconSize[2] &&
											btns[index].iconSize[2]
												? btns[index].iconSize[2]
												: '',
										],
									},
									index
								);
							}}
							tabletValue={
								btns[index].iconSize && undefined !== btns[index].iconSize[1] && btns[index].iconSize[1]
									? btns[index].iconSize[1]
									: ''
							}
							onChangeTablet={(value) => {
								saveArrayUpdate(
									{
										iconSize: [
											btns[index].iconSize &&
											undefined !== btns[index].iconSize[0] &&
											btns[index].iconSize[0]
												? btns[index].iconSize[0]
												: '',
											value,
											btns[index].iconSize &&
											undefined !== btns[index].iconSize[2] &&
											btns[index].iconSize[2]
												? btns[index].iconSize[2]
												: '',
										],
									},
									index
								);
							}}
							mobileValue={
								btns[index].iconSize && undefined !== btns[index].iconSize[2] && btns[index].iconSize[2]
									? btns[index].iconSize[2]
									: ''
							}
							onChangeMobile={(value) => {
								saveArrayUpdate(
									{
										iconSize: [
											btns[index].iconSize &&
											undefined !== btns[index].iconSize[0] &&
											btns[index].iconSize[0]
												? btns[index].iconSize[0]
												: '',
											btns[index].iconSize &&
											undefined !== btns[index].iconSize[1] &&
											btns[index].iconSize[1]
												? btns[index].iconSize[1]
												: '',
											value,
										],
									},
									index
								);
							}}
							min={0}
							max={(btns[index].iconSizeType ? btns[index].iconSizeType : 'px') !== 'px' ? 12 : 200}
							step={(btns[index].iconSizeType ? btns[index].iconSizeType : 'px') !== 'px' ? 0.1 : 1}
							unit={btns[index].iconSizeType ? btns[index].iconSizeType : 'px'}
							onUnit={(value) => {
								saveArrayUpdate({ iconSizeType: value }, index);
							}}
							units={['px', 'em', 'rem']}
						/>
						<TabPanel
							className="kt-inspect-tabs kt-hover-tabs"
							activeClass="active-tab"
							tabs={[
								{
									name: 'normal' + index,
									title: __('Normal', 'kadence-blocks'),
									className: 'kt-normal-tab',
								},
								{
									name: 'hover' + index,
									title: __('Hover', 'kadence-blocks'),
									className: 'kt-hover-tab',
								},
							]}
						>
							{(tab) => {
								let tabout;
								if (tab.name) {
									if ('hover' + index === tab.name) {
										tabout = (
											<PopColorControl
												label={__('Hover Icon Color', 'kadence-blocks')}
												value={btns[index].iconColorHover ? btns[index].iconColorHover : ''}
												default={''}
												onChange={(value) => {
													saveArrayUpdate({ iconColorHover: value }, index);
												}}
											/>
										);
									} else {
										tabout = (
											<PopColorControl
												label={__('Icon Color', 'kadence-blocks')}
												value={btns[index].iconColor ? btns[index].iconColor : ''}
												default={''}
												onChange={(value) => {
													saveArrayUpdate({ iconColor: value }, index);
												}}
											/>
										);
									}
								}
								return (
									<div className={tab.className} key={tab.className}>
										{tabout}
									</div>
								);
							}}
						</TabPanel>
						<SmallResponsiveControl
							label={__('Show Only Icon', 'kadence-blocks')}
							desktopChildren={
								<ToggleControl
									label={__('Show only Icon', 'kadence-blocks')}
									checked={
										undefined !== btns[index].onlyIcon && undefined !== btns[index].onlyIcon[0]
											? btns[index].onlyIcon[0]
											: false
									}
									onChange={(value) =>
										saveArrayUpdate(
											{
												onlyIcon: [
													value,
													undefined !== btns[index].onlyIcon &&
													undefined !== btns[index].onlyIcon[1]
														? btns[index].onlyIcon[1]
														: '',
													undefined !== btns[index].onlyIcon &&
													undefined !== btns[index].onlyIcon[2]
														? btns[index].onlyIcon[2]
														: '',
												],
											},
											index
										)
									}
								/>
							}
							tabletChildren={
								<ToggleControl
									label={__('Show only Icon', 'kadence-blocks')}
									disabled={
										undefined !== btns[index].onlyIcon && undefined !== btns[index].onlyIcon[0]
											? btns[index].onlyIcon[0]
											: false
									}
									checked={
										undefined !== btns[index].onlyIcon && undefined !== btns[index].onlyIcon[1]
											? btns[index].onlyIcon[1]
											: undefined !== btns[index].onlyIcon &&
											  undefined !== btns[index].onlyIcon[0]
											? btns[index].onlyIcon[0]
											: false
									}
									onChange={(value) =>
										saveArrayUpdate(
											{
												onlyIcon: [
													undefined !== btns[index].onlyIcon &&
													undefined !== btns[index].onlyIcon[0]
														? btns[index].onlyIcon[0]
														: false,
													value,
													undefined !== btns[index].onlyIcon &&
													undefined !== btns[index].onlyIcon[2]
														? btns[index].onlyIcon[2]
														: '',
												],
											},
											index
										)
									}
								/>
							}
							mobileChildren={
								<ToggleControl
									label={__('Show only Icon', 'kadence-blocks')}
									disabled={
										undefined !== btns[index].onlyIcon &&
										undefined !== btns[index].onlyIcon[1] &&
										'' !== btns[index].onlyIcon[1]
											? btns[index].onlyIcon[1]
											: undefined !== btns[index].onlyIcon &&
											  undefined !== btns[index].onlyIcon[0]
											? btns[index].onlyIcon[0]
											: false
									}
									checked={
										undefined !== btns[index].onlyIcon &&
										undefined !== btns[index].onlyIcon[2] &&
										'' !== btns[index].onlyIcon[2]
											? btns[index].onlyIcon[2]
											: undefined !== btns[index].onlyIcon &&
											  undefined !== btns[index].onlyIcon[1]
											? btns[index].onlyIcon[1]
											: undefined !== btns[index].onlyIcon &&
											  undefined !== btns[index].onlyIcon[0]
											? btns[index].onlyIcon[0]
											: false
									}
									onChange={(value) =>
										saveArrayUpdate(
											{
												onlyIcon: [
													undefined !== btns[index].onlyIcon &&
													undefined !== btns[index].onlyIcon[0]
														? btns[index].onlyIcon[0]
														: false,
													undefined !== btns[index].onlyIcon &&
													undefined !== btns[index].onlyIcon[1]
														? btns[index].onlyIcon[1]
														: '',
													value,
												],
											},
											index
										)
									}
								/>
							}
						/>
						<ResponsiveMeasurementControls
							label={__('Icon Padding', 'kadence-blocks')}
							value={undefined !== btns[index].iconPadding ? btns[index].iconPadding : ['', '', '', '']}
							control={iconPaddingControl}
							tabletValue={
								undefined !== btns[index].iconTabletPadding
									? btns[index].iconTabletPadding
									: ['', '', '', '']
							}
							mobileValue={
								undefined !== btns[index].iconMobilePadding
									? btns[index].iconMobilePadding
									: ['', '', '', '']
							}
							onChange={(value) => saveArrayUpdate({ iconPadding: value }, index)}
							onChangeTablet={(value) => saveArrayUpdate({ iconTabletPadding: value }, index)}
							onChangeMobile={(value) => saveArrayUpdate({ iconMobilePadding: value }, index)}
							onChangeControl={(value) => setIconPaddingControl(value)}
							min={0}
							max={200}
							step={1}
							unit={'px'}
							units={['px']}
						/>
						<SelectControl
							label={__('Icon Location', 'kadence-blocks')}
							value={btns[index].iconSide}
							options={[
								{ value: 'right', label: __('Right', 'kadence-blocks') },
								{ value: 'left', label: __('Left', 'kadence-blocks') },
							]}
							onChange={(value) => {
								saveArrayUpdate({ iconSide: value }, index);
							}}
						/>
					</Fragment>
				)}
				<TextControl
					label={__('Add Custom CSS Class', 'kadence-blocks')}
					value={btns[index].cssClass ? btns[index].cssClass : ''}
					onChange={(value) => saveArrayUpdate({ cssClass: value }, index)}
				/>
				<TextControl
					label={__('Add HTML ID', 'kadence-blocks')}
					value={btns[index].anchor ? btns[index].anchor : ''}
					onChange={(nextValue) => {
						nextValue = nextValue.replace(ANCHOR_REGEX, '-');
						saveArrayUpdate({ anchor: nextValue }, index);
					}}
				/>
				<h2 className="kt-heading-size-title kt-secondary-color-size">
					{__('Gap Between Next', 'kadence-blocks')}
				</h2>
				<TabPanel
					className="kt-size-tabs"
					activeClass="active-tab"
					tabs={[
						{
							name: 'desk',
							title: <Dashicon icon="desktop" />,
							className: 'kt-desk-tab',
						},
						{
							name: 'tablet',
							title: <Dashicon icon="tablet" />,
							className: 'kt-tablet-tab',
						},
						{
							name: 'mobile',
							title: <Dashicon icon="smartphone" />,
							className: 'kt-mobile-tab',
						},
					]}
				>
					{(tab) => {
						let tabout;
						if (tab.name) {
							if ('mobile' === tab.name) {
								tabout = (
									<Fragment>
										<RangeControl
											value={btns[index].mobileGap}
											onChange={(value) => {
												saveArrayUpdate({ mobileGap: value }, index);
											}}
											min={0}
											max={50}
										/>
									</Fragment>
								);
							} else if ('tablet' === tab.name) {
								tabout = (
									<Fragment>
										<RangeControl
											value={btns[index].tabletGap}
											onChange={(value) => {
												saveArrayUpdate({ tabletGap: value }, index);
											}}
											min={0}
											max={50}
										/>
									</Fragment>
								);
							} else {
								tabout = (
									<Fragment>
										<RangeControl
											value={btns[index].gap}
											onChange={(value) => {
												saveArrayUpdate({ gap: value }, index);
											}}
											min={0}
											max={50}
										/>
									</Fragment>
								);
							}
						}
						return (
							<div className={tab.className} key={tab.className}>
								{tabout}
							</div>
						);
					}}
				</TabPanel>
				<TextControl
					label={__('Add Aria Label', 'kadence-blocks')}
					value={btns[index].label ? btns[index].label : ''}
					onChange={(value) => saveArrayUpdate({ label: value }, index)}
				/>
			</KadencePanelBody>
		);
	};
	const hoverSettings = (index) => {
		return (
			<div>
				<PopColorControl
					label={__('Hover Text Color', 'kadence-blocks')}
					value={btns[index].colorHover ? btns[index].colorHover : '#ffffff'}
					default={'#ffffff'}
					onChange={(value) => {
						saveArrayUpdate({ colorHover: value }, index);
					}}
				/>
				<div className="kt-btn-size-settings-container">
					<h2 className="kt-beside-btn-group">{__('Background Type', 'kadence-blocks')}</h2>
					<ButtonGroup
						className="kt-button-size-type-options"
						aria-label={__('Background Type', 'kadence-blocks')}
					>
						{map(bgType, ({ name, key }) => (
							<Button
								key={key}
								className="kt-btn-size-btn"
								isSmall
								isPrimary={
									(undefined !== btns[index].backgroundHoverType
										? btns[index].backgroundHoverType
										: 'solid') === key
								}
								aria-pressed={
									(undefined !== btns[index].backgroundHoverType
										? btns[index].backgroundHoverType
										: 'solid') === key
								}
								onClick={() => saveArrayUpdate({ backgroundHoverType: key }, index)}
							>
								{name}
							</Button>
						))}
					</ButtonGroup>
				</div>
				{'gradient' !== btns[index].backgroundHoverType && (
					<div className="kt-inner-sub-section">
						<PopColorControl
							label={__('Background Color', 'kadence-blocks')}
							value={btns[index].backgroundHover ? btns[index].backgroundHover : ''}
							default={''}
							opacityValue={btns[index].backgroundHoverOpacity}
							onChange={(value) => {
								saveArrayUpdate({ backgroundHover: value }, index);
							}}
							onOpacityChange={(value) => {
								saveArrayUpdate({ backgroundHoverOpacity: value }, index);
							}}
							onArrayChange={(color, opacity) =>
								saveArrayUpdate({ backgroundHover: color, backgroundHoverOpacity: opacity }, index)
							}
						/>
					</div>
				)}
				{'gradient' === btns[index].backgroundHoverType && (
					<div className="kt-inner-sub-section">
						<PopColorControl
							label={__('Gradient Color 1', 'kadence-blocks')}
							value={btns[index].backgroundHover ? btns[index].backgroundHover : ''}
							default={''}
							opacityValue={btns[index].backgroundHoverOpacity}
							onChange={(value) => {
								saveArrayUpdate({ backgroundHover: value }, index);
							}}
							onOpacityChange={(value) => {
								saveArrayUpdate({ backgroundHoverOpacity: value }, index);
							}}
							onArrayChange={(color, opacity) =>
								saveArrayUpdate({ backgroundHover: color, backgroundHoverOpacity: opacity }, index)
							}
						/>
						<RangeControl
							label={__('Location', 'kadence-blocks')}
							value={
								btns[index].gradientHover && undefined !== btns[index].gradientHover[2]
									? btns[index].gradientHover[2]
									: 0
							}
							onChange={(value) => {
								saveArrayUpdate(
									{
										gradientHover: [
											btns[index].gradientHover && undefined !== btns[index].gradientHover[0]
												? btns[index].gradientHover[0]
												: '#777777',
											btns[index].gradientHover && undefined !== btns[index].gradientHover[1]
												? btns[index].gradientHover[1]
												: 1,
											value,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[3]
												? btns[index].gradientHover[3]
												: 100,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[4]
												? btns[index].gradientHover[4]
												: 'linear',
											btns[index].gradientHover && undefined !== btns[index].gradientHover[5]
												? btns[index].gradientHover[5]
												: 180,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[6]
												? btns[index].gradientHover[6]
												: 'center center',
										],
									},
									index
								);
							}}
							min={0}
							max={100}
						/>
						<PopColorControl
							label={__('Gradient Color 2', 'kadence-blocks')}
							value={
								btns[index].gradientHover && undefined !== btns[index].gradientHover[0]
									? btns[index].gradientHover[0]
									: '#777777'
							}
							default={'#777777'}
							opacityValue={
								btns[index].gradientHover && undefined !== btns[index].gradientHover[1]
									? btns[index].gradientHover[1]
									: 1
							}
							onChange={(value) => {
								saveArrayUpdate(
									{
										gradientHover: [
											value,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[1]
												? btns[index].gradientHover[1]
												: 1,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[2]
												? btns[index].gradientHover[2]
												: 0,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[3]
												? btns[index].gradientHover[3]
												: 100,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[4]
												? btns[index].gradientHover[4]
												: 'linear',
											btns[index].gradientHover && undefined !== btns[index].gradientHover[5]
												? btns[index].gradientHover[5]
												: 180,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[6]
												? btns[index].gradientHover[6]
												: 'center center',
										],
									},
									index
								);
							}}
							onOpacityChange={(value) => {
								saveArrayUpdate(
									{
										gradientHover: [
											btns[index].gradientHover && undefined !== btns[index].gradientHover[0]
												? btns[index].gradientHover[0]
												: '#777777',
											value,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[2]
												? btns[index].gradientHover[2]
												: 0,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[3]
												? btns[index].gradientHover[3]
												: 100,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[4]
												? btns[index].gradientHover[4]
												: 'linear',
											btns[index].gradientHover && undefined !== btns[index].gradientHover[5]
												? btns[index].gradientHover[5]
												: 180,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[6]
												? btns[index].gradientHover[6]
												: 'center center',
										],
									},
									index
								);
							}}
						/>
						<RangeControl
							label={__('Location', 'kadence-blocks')}
							value={
								btns[index].gradientHover && undefined !== btns[index].gradientHover[3]
									? btns[index].gradientHover[3]
									: 100
							}
							onChange={(value) => {
								saveArrayUpdate(
									{
										gradientHover: [
											btns[index].gradientHover && undefined !== btns[index].gradientHover[0]
												? btns[index].gradientHover[0]
												: '#777777',
											btns[index].gradientHover && undefined !== btns[index].gradientHover[1]
												? btns[index].gradientHover[1]
												: 1,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[2]
												? btns[index].gradientHover[2]
												: 0,
											value,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[4]
												? btns[index].gradientHover[4]
												: 'linear',
											btns[index].gradientHover && undefined !== btns[index].gradientHover[5]
												? btns[index].gradientHover[5]
												: 180,
											btns[index].gradientHover && undefined !== btns[index].gradientHover[6]
												? btns[index].gradientHover[6]
												: 'center center',
										],
									},
									index
								);
							}}
							min={0}
							max={100}
						/>
						<div className="kt-btn-size-settings-container">
							<h2 className="kt-beside-btn-group">{__('Gradient Type', 'kadence-blocks')}</h2>
							<ButtonGroup
								className="kt-button-size-type-options"
								aria-label={__('Gradient Type', 'kadence-blocks')}
							>
								{map(gradTypes, ({ name, key }) => (
									<Button
										key={key}
										className="kt-btn-size-btn"
										isSmall
										isPrimary={
											(btns[index].gradientHover && undefined !== btns[index].gradientHover[4]
												? btns[index].gradientHover[4]
												: 'linear') === key
										}
										aria-pressed={
											(btns[index].gradientHover && undefined !== btns[index].gradientHover[4]
												? btns[index].gradientHover[4]
												: 'linear') === key
										}
										onClick={() => {
											saveArrayUpdate(
												{
													gradientHover: [
														btns[index].gradientHover &&
														undefined !== btns[index].gradientHover[0]
															? btns[index].gradientHover[0]
															: '#777777',
														btns[index].gradientHover &&
														undefined !== btns[index].gradientHover[1]
															? btns[index].gradientHover[1]
															: 1,
														btns[index].gradientHover &&
														undefined !== btns[index].gradientHover[2]
															? btns[index].gradientHover[2]
															: 0,
														btns[index].gradientHover &&
														undefined !== btns[index].gradientHover[3]
															? btns[index].gradientHover[3]
															: 100,
														key,
														btns[index].gradientHover &&
														undefined !== btns[index].gradientHover[5]
															? btns[index].gradientHover[5]
															: 180,
														btns[index].gradientHover &&
														undefined !== btns[index].gradientHover[6]
															? btns[index].gradientHover[6]
															: 'center center',
													],
												},
												index
											);
										}}
									>
										{name}
									</Button>
								))}
							</ButtonGroup>
						</div>
						{'radial' !==
							(btns[index].gradientHover && undefined !== btns[index].gradientHover[4]
								? btns[index].gradientHover[4]
								: 'linear') && (
							<RangeControl
								label={__('Gradient Angle', 'kadence-blocks')}
								value={
									btns[index].gradientHover && undefined !== btns[index].gradientHover[5]
										? btns[index].gradientHover[5]
										: 180
								}
								onChange={(value) => {
									saveArrayUpdate(
										{
											gradientHover: [
												btns[index].gradientHover && undefined !== btns[index].gradientHover[0]
													? btns[index].gradientHover[0]
													: '#777777',
												btns[index].gradientHover && undefined !== btns[index].gradientHover[1]
													? btns[index].gradientHover[1]
													: 1,
												btns[index].gradientHover && undefined !== btns[index].gradientHover[2]
													? btns[index].gradientHover[2]
													: 0,
												btns[index].gradientHover && undefined !== btns[index].gradientHover[3]
													? btns[index].gradientHover[3]
													: 100,
												btns[index].gradientHover && undefined !== btns[index].gradientHover[4]
													? btns[index].gradientHover[4]
													: 'linear',
												value,
												btns[index].gradientHover && undefined !== btns[index].gradientHover[6]
													? btns[index].gradientHover[6]
													: 'center center',
											],
										},
										index
									);
								}}
								min={0}
								max={360}
							/>
						)}
						{'radial' ===
							(btns[index].gradientHover && undefined !== btns[index].gradientHover[4]
								? btns[index].gradientHover[4]
								: 'linear') && (
							<SelectControl
								label={__('Gradient Position', 'kadence-blocks')}
								value={
									btns[index].gradientHover && undefined !== btns[index].gradientHover[6]
										? btns[index].gradientHover[6]
										: 'center center'
								}
								options={[
									{ value: 'center top', label: __('Center Top', 'kadence-blocks') },
									{ value: 'center center', label: __('Center Center', 'kadence-blocks') },
									{ value: 'center bottom', label: __('Center Bottom', 'kadence-blocks') },
									{ value: 'left top', label: __('Left Top', 'kadence-blocks') },
									{ value: 'left center', label: __('Left Center', 'kadence-blocks') },
									{ value: 'left bottom', label: __('Left Bottom', 'kadence-blocks') },
									{ value: 'right top', label: __('Right Top', 'kadence-blocks') },
									{ value: 'right center', label: __('Right Center', 'kadence-blocks') },
									{ value: 'right bottom', label: __('Right Bottom', 'kadence-blocks') },
								]}
								onChange={(value) => {
									saveArrayUpdate(
										{
											gradientHover: [
												btns[index].gradientHover && undefined !== btns[index].gradientHover[0]
													? btns[index].gradientHover[0]
													: '#777777',
												btns[index].gradientHover && undefined !== btns[index].gradientHover[1]
													? btns[index].gradientHover[1]
													: 1,
												btns[index].gradientHover && undefined !== btns[index].gradientHover[2]
													? btns[index].gradientHover[2]
													: 0,
												btns[index].gradientHover && undefined !== btns[index].gradientHover[3]
													? btns[index].gradientHover[3]
													: 100,
												btns[index].gradientHover && undefined !== btns[index].gradientHover[4]
													? btns[index].gradientHover[4]
													: 'linear',
												btns[index].gradientHover && undefined !== btns[index].gradientHover[5]
													? btns[index].gradientHover[5]
													: 180,
												value,
											],
										},
										index
									);
								}}
							/>
						)}
					</div>
				)}
				<PopColorControl
					label={__('Hover Border Color', 'kadence-blocks')}
					value={btns[index].borderHover ? btns[index].borderHover : ''}
					default={''}
					opacityValue={btns[index].borderHoverOpacity}
					onChange={(value) => {
						saveArrayUpdate({ borderHover: value }, index);
					}}
					onOpacityChange={(value) => {
						saveArrayUpdate({ borderHoverOpacity: value }, index);
					}}
					onArrayChange={(color, opacity) =>
						saveArrayUpdate({ borderHover: color, borderHoverOpacity: opacity }, index)
					}
				/>
				<BoxShadowControl
					label={__('Hover Box Shadow', 'kadence-blocks')}
					enable={
						undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0]
							? btns[index].boxShadowHover[0]
							: false
					}
					color={
						undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1]
							? btns[index].boxShadowHover[1]
							: '#000000'
					}
					default={'#000000'}
					onArrayChange={(color, opacity) => {
						saveArrayUpdate(
							{
								boxShadowHover: [
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0]
										? btns[index].boxShadowHover[0]
										: false,
									color,
									opacity,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3]
										? btns[index].boxShadowHover[3]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4]
										? btns[index].boxShadowHover[4]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5]
										? btns[index].boxShadowHover[5]
										: 3,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6]
										? btns[index].boxShadowHover[6]
										: 0,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7]
										? btns[index].boxShadowHover[7]
										: false,
								],
							},
							index
						);
					}}
					opacity={
						undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2]
							? btns[index].boxShadowHover[2]
							: 0.4
					}
					hOffset={
						undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3]
							? btns[index].boxShadowHover[3]
							: 2
					}
					vOffset={
						undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4]
							? btns[index].boxShadowHover[4]
							: 2
					}
					blur={
						undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5]
							? btns[index].boxShadowHover[5]
							: 3
					}
					spread={
						undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6]
							? btns[index].boxShadowHover[6]
							: 0
					}
					inset={
						undefined !== btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7]
							? btns[index].boxShadowHover[7]
							: false
					}
					onEnableChange={(value) => {
						saveArrayUpdate(
							{
								boxShadowHover: [
									value,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1]
										? btns[index].boxShadowHover[1]
										: '#000000',
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2]
										? btns[index].boxShadowHover[2]
										: 0.4,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3]
										? btns[index].boxShadowHover[3]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4]
										? btns[index].boxShadowHover[4]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5]
										? btns[index].boxShadowHover[5]
										: 3,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6]
										? btns[index].boxShadowHover[6]
										: 0,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7]
										? btns[index].boxShadowHover[7]
										: false,
								],
							},
							index
						);
					}}
					onColorChange={(value) => {
						saveArrayUpdate(
							{
								boxShadowHover: [
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0]
										? btns[index].boxShadowHover[0]
										: false,
									value,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2]
										? btns[index].boxShadowHover[2]
										: 0.4,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3]
										? btns[index].boxShadowHover[3]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4]
										? btns[index].boxShadowHover[4]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5]
										? btns[index].boxShadowHover[5]
										: 3,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6]
										? btns[index].boxShadowHover[6]
										: 0,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7]
										? btns[index].boxShadowHover[7]
										: false,
								],
							},
							index
						);
					}}
					onOpacityChange={(value) => {
						saveArrayUpdate(
							{
								boxShadowHover: [
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0]
										? btns[index].boxShadowHover[0]
										: false,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1]
										? btns[index].boxShadowHover[1]
										: '#000000',
									value,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3]
										? btns[index].boxShadowHover[3]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4]
										? btns[index].boxShadowHover[4]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5]
										? btns[index].boxShadowHover[5]
										: 3,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6]
										? btns[index].boxShadowHover[6]
										: 0,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7]
										? btns[index].boxShadowHover[7]
										: false,
								],
							},
							index
						);
					}}
					onHOffsetChange={(value) => {
						saveArrayUpdate(
							{
								boxShadowHover: [
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0]
										? btns[index].boxShadowHover[0]
										: false,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1]
										? btns[index].boxShadowHover[1]
										: '#000000',
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2]
										? btns[index].boxShadowHover[2]
										: 0.4,
									value,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4]
										? btns[index].boxShadowHover[4]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5]
										? btns[index].boxShadowHover[5]
										: 3,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6]
										? btns[index].boxShadowHover[6]
										: 0,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7]
										? btns[index].boxShadowHover[7]
										: false,
								],
							},
							index
						);
					}}
					onVOffsetChange={(value) => {
						saveArrayUpdate(
							{
								boxShadowHover: [
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0]
										? btns[index].boxShadowHover[0]
										: false,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1]
										? btns[index].boxShadowHover[1]
										: '#000000',
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2]
										? btns[index].boxShadowHover[2]
										: 0.4,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3]
										? btns[index].boxShadowHover[3]
										: 2,
									value,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5]
										? btns[index].boxShadowHover[5]
										: 3,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6]
										? btns[index].boxShadowHover[6]
										: 0,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7]
										? btns[index].boxShadowHover[7]
										: false,
								],
							},
							index
						);
					}}
					onBlurChange={(value) => {
						saveArrayUpdate(
							{
								boxShadowHover: [
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0]
										? btns[index].boxShadowHover[0]
										: false,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1]
										? btns[index].boxShadowHover[1]
										: '#000000',
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2]
										? btns[index].boxShadowHover[2]
										: 0.4,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3]
										? btns[index].boxShadowHover[3]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4]
										? btns[index].boxShadowHover[4]
										: 2,
									value,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6]
										? btns[index].boxShadowHover[6]
										: 0,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7]
										? btns[index].boxShadowHover[7]
										: false,
								],
							},
							index
						);
					}}
					onSpreadChange={(value) => {
						saveArrayUpdate(
							{
								boxShadowHover: [
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0]
										? btns[index].boxShadowHover[0]
										: false,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1]
										? btns[index].boxShadowHover[1]
										: '#000000',
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2]
										? btns[index].boxShadowHover[2]
										: 0.4,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3]
										? btns[index].boxShadowHover[3]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4]
										? btns[index].boxShadowHover[4]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5]
										? btns[index].boxShadowHover[5]
										: 3,
									value,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[7]
										? btns[index].boxShadowHover[7]
										: false,
								],
							},
							index
						);
					}}
					onInsetChange={(value) => {
						saveArrayUpdate(
							{
								boxShadowHover: [
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[0]
										? btns[index].boxShadowHover[0]
										: false,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[1]
										? btns[index].boxShadowHover[1]
										: '#000000',
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[2]
										? btns[index].boxShadowHover[2]
										: 0.4,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[3]
										? btns[index].boxShadowHover[3]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[4]
										? btns[index].boxShadowHover[4]
										: 2,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[5]
										? btns[index].boxShadowHover[5]
										: 3,
									btns[index].boxShadowHover && undefined !== btns[index].boxShadowHover[6]
										? btns[index].boxShadowHover[6]
										: 0,
									value,
								],
							},
							index
						);
					}}
				/>
			</div>
		);
	};

	const buttonSettings = (index) => {
		return (
			<div>
				<PopColorControl
					label={__('Text Color', 'kadence-blocks')}
					value={btns[index].color}
					default={''}
					onChange={(value) => {
						saveArrayUpdate({ color: value }, index);
					}}
				/>
				<div className="kt-btn-size-settings-container">
					<h2 className="kt-beside-btn-group">{__('Background Type', 'kadence-blocks')}</h2>
					<ButtonGroup
						className="kt-button-size-type-options"
						aria-label={__('Background Type', 'kadence-blocks')}
					>
						{map(bgType, ({ name, key }) => (
							<Button
								key={key}
								className="kt-btn-size-btn"
								isSmall
								isPrimary={
									(undefined !== btns[index].backgroundType
										? btns[index].backgroundType
										: 'solid') === key
								}
								aria-pressed={
									(undefined !== btns[index].backgroundType
										? btns[index].backgroundType
										: 'solid') === key
								}
								onClick={() => saveArrayUpdate({ backgroundType: key }, index)}
							>
								{name}
							</Button>
						))}
					</ButtonGroup>
				</div>
				{'gradient' !== btns[index].backgroundType && (
					<div className="kt-inner-sub-section">
						<PopColorControl
							label={__('Background Color', 'kadence-blocks')}
							value={btns[index].background}
							default={''}
							opacityValue={btns[index].backgroundOpacity}
							onChange={(value) => {
								saveArrayUpdate({ background: value }, index);
							}}
							onOpacityChange={(value) => {
								saveArrayUpdate({ backgroundOpacity: value }, index);
							}}
							onArrayChange={(color, opacity) =>
								saveArrayUpdate({ background: color, backgroundOpacity: opacity }, index)
							}
						/>
					</div>
				)}
				{'gradient' === btns[index].backgroundType && (
					<div className="kt-inner-sub-section">
						<PopColorControl
							label={__('Gradient Color 1', 'kadence-blocks')}
							value={btns[index].background}
							default={''}
							opacityValue={btns[index].backgroundOpacity}
							onChange={(value) => {
								saveArrayUpdate({ background: value }, index);
							}}
							onOpacityChange={(value) => {
								saveArrayUpdate({ backgroundOpacity: value }, index);
							}}
							onArrayChange={(color, opacity) =>
								saveArrayUpdate({ background: color, backgroundOpacity: opacity }, index)
							}
						/>
						<RangeControl
							label={__('Location', 'kadence-blocks')}
							value={
								btns[index].gradient && undefined !== btns[index].gradient[2]
									? btns[index].gradient[2]
									: 0
							}
							onChange={(value) => {
								saveArrayUpdate(
									{
										gradient: [
											btns[index].gradient && undefined !== btns[index].gradient[0]
												? btns[index].gradient[0]
												: '#999999',
											btns[index].gradient && undefined !== btns[index].gradient[1]
												? btns[index].gradient[1]
												: 1,
											value,
											btns[index].gradient && undefined !== btns[index].gradient[3]
												? btns[index].gradient[3]
												: 100,
											btns[index].gradient && undefined !== btns[index].gradient[4]
												? btns[index].gradient[4]
												: 'linear',
											btns[index].gradient && undefined !== btns[index].gradient[5]
												? btns[index].gradient[5]
												: 180,
											btns[index].gradient && undefined !== btns[index].gradient[6]
												? btns[index].gradient[6]
												: 'center center',
										],
									},
									index
								);
							}}
							min={0}
							max={100}
						/>
						<PopColorControl
							label={__('Gradient Color 2', 'kadence-blocks')}
							value={
								btns[index].gradient && undefined !== btns[index].gradient[0]
									? btns[index].gradient[0]
									: '#999999'
							}
							default={'#999999'}
							opacityValue={
								btns[index].gradient && undefined !== btns[index].gradient[1]
									? btns[index].gradient[1]
									: 1
							}
							onChange={(value) => {
								saveArrayUpdate(
									{
										gradient: [
											value,
											btns[index].gradient && undefined !== btns[index].gradient[1]
												? btns[index].gradient[1]
												: 1,
											btns[index].gradient && undefined !== btns[index].gradient[2]
												? btns[index].gradient[2]
												: 0,
											btns[index].gradient && undefined !== btns[index].gradient[3]
												? btns[index].gradient[3]
												: 100,
											btns[index].gradient && undefined !== btns[index].gradient[4]
												? btns[index].gradient[4]
												: 'linear',
											btns[index].gradient && undefined !== btns[index].gradient[5]
												? btns[index].gradient[5]
												: 180,
											btns[index].gradient && undefined !== btns[index].gradient[6]
												? btns[index].gradient[6]
												: 'center center',
										],
									},
									index
								);
							}}
							onOpacityChange={(value) => {
								saveArrayUpdate(
									{
										gradient: [
											btns[index].gradient && undefined !== btns[index].gradient[0]
												? btns[index].gradient[0]
												: '#999999',
											value,
											btns[index].gradient && undefined !== btns[index].gradient[2]
												? btns[index].gradient[2]
												: 0,
											btns[index].gradient && undefined !== btns[index].gradient[3]
												? btns[index].gradient[3]
												: 100,
											btns[index].gradient && undefined !== btns[index].gradient[4]
												? btns[index].gradient[4]
												: 'linear',
											btns[index].gradient && undefined !== btns[index].gradient[5]
												? btns[index].gradient[5]
												: 180,
											btns[index].gradient && undefined !== btns[index].gradient[6]
												? btns[index].gradient[6]
												: 'center center',
										],
									},
									index
								);
							}}
						/>
						<RangeControl
							label={__('Location', 'kadence-blocks')}
							value={
								btns[index].gradient && undefined !== btns[index].gradient[3]
									? btns[index].gradient[3]
									: 100
							}
							onChange={(value) => {
								saveArrayUpdate(
									{
										gradient: [
											btns[index].gradient && undefined !== btns[index].gradient[0]
												? btns[index].gradient[0]
												: '#999999',
											btns[index].gradient && undefined !== btns[index].gradient[1]
												? btns[index].gradient[1]
												: 1,
											btns[index].gradient && undefined !== btns[index].gradient[2]
												? btns[index].gradient[2]
												: 0,
											value,
											btns[index].gradient && undefined !== btns[index].gradient[4]
												? btns[index].gradient[4]
												: 'linear',
											btns[index].gradient && undefined !== btns[index].gradient[5]
												? btns[index].gradient[5]
												: 180,
											btns[index].gradient && undefined !== btns[index].gradient[6]
												? btns[index].gradient[6]
												: 'center center',
										],
									},
									index
								);
							}}
							min={0}
							max={100}
						/>
						<div className="kt-btn-size-settings-container">
							<h2 className="kt-beside-btn-group">{__('Gradient Type', 'kadence-blocks')}</h2>
							<ButtonGroup
								className="kt-button-size-type-options"
								aria-label={__('Gradient Type', 'kadence-blocks')}
							>
								{map(gradTypes, ({ name, key }) => (
									<Button
										key={key}
										className="kt-btn-size-btn"
										isSmall
										isPrimary={
											(btns[index].gradient && undefined !== btns[index].gradient[4]
												? btns[index].gradient[4]
												: 'linear') === key
										}
										aria-pressed={
											(btns[index].gradient && undefined !== btns[index].gradient[4]
												? btns[index].gradient[4]
												: 'linear') === key
										}
										onClick={() => {
											saveArrayUpdate(
												{
													gradient: [
														btns[index].gradient && undefined !== btns[index].gradient[0]
															? btns[index].gradient[0]
															: '#999999',
														btns[index].gradient && undefined !== btns[index].gradient[1]
															? btns[index].gradient[1]
															: 1,
														btns[index].gradient && undefined !== btns[index].gradient[2]
															? btns[index].gradient[2]
															: 0,
														btns[index].gradient && undefined !== btns[index].gradient[3]
															? btns[index].gradient[3]
															: 100,
														key,
														btns[index].gradient && undefined !== btns[index].gradient[5]
															? btns[index].gradient[5]
															: 180,
														btns[index].gradient && undefined !== btns[index].gradient[6]
															? btns[index].gradient[6]
															: 'center center',
													],
												},
												index
											);
										}}
									>
										{name}
									</Button>
								))}
							</ButtonGroup>
						</div>
						{'radial' !==
							(btns[index].gradient && undefined !== btns[index].gradient[4]
								? btns[index].gradient[4]
								: 'linear') && (
							<RangeControl
								label={__('Gradient Angle', 'kadence-blocks')}
								value={
									btns[index].gradient && undefined !== btns[index].gradient[5]
										? btns[index].gradient[5]
										: 180
								}
								onChange={(value) => {
									saveArrayUpdate(
										{
											gradient: [
												btns[index].gradient && undefined !== btns[index].gradient[0]
													? btns[index].gradient[0]
													: '#999999',
												btns[index].gradient && undefined !== btns[index].gradient[1]
													? btns[index].gradient[1]
													: 1,
												btns[index].gradient && undefined !== btns[index].gradient[2]
													? btns[index].gradient[2]
													: 0,
												btns[index].gradient && undefined !== btns[index].gradient[3]
													? btns[index].gradient[3]
													: 100,
												btns[index].gradient && undefined !== btns[index].gradient[4]
													? btns[index].gradient[4]
													: 'linear',
												value,
												btns[index].gradient && undefined !== btns[index].gradient[6]
													? btns[index].gradient[6]
													: 'center center',
											],
										},
										index
									);
								}}
								min={0}
								max={360}
							/>
						)}
						{'radial' ===
							(btns[index].gradient && undefined !== btns[index].gradient[4]
								? btns[index].gradient[4]
								: 'linear') && (
							<SelectControl
								label={__('Gradient Position', 'kadence-blocks')}
								value={
									btns[index].gradient && undefined !== btns[index].gradient[6]
										? btns[index].gradient[6]
										: 'center center'
								}
								options={[
									{ value: 'center top', label: __('Center Top', 'kadence-blocks') },
									{ value: 'center center', label: __('Center Center', 'kadence-blocks') },
									{ value: 'center bottom', label: __('Center Bottom', 'kadence-blocks') },
									{ value: 'left top', label: __('Left Top', 'kadence-blocks') },
									{ value: 'left center', label: __('Left Center', 'kadence-blocks') },
									{ value: 'left bottom', label: __('Left Bottom', 'kadence-blocks') },
									{ value: 'right top', label: __('Right Top', 'kadence-blocks') },
									{ value: 'right center', label: __('Right Center', 'kadence-blocks') },
									{ value: 'right bottom', label: __('Right Bottom', 'kadence-blocks') },
								]}
								onChange={(value) => {
									saveArrayUpdate(
										{
											gradient: [
												btns[index].gradient && undefined !== btns[index].gradient[0]
													? btns[index].gradient[0]
													: '#999999',
												btns[index].gradient && undefined !== btns[index].gradient[1]
													? btns[index].gradient[1]
													: 1,
												btns[index].gradient && undefined !== btns[index].gradient[2]
													? btns[index].gradient[2]
													: 0,
												btns[index].gradient && undefined !== btns[index].gradient[3]
													? btns[index].gradient[3]
													: 100,
												btns[index].gradient && undefined !== btns[index].gradient[4]
													? btns[index].gradient[4]
													: 'linear',
												btns[index].gradient && undefined !== btns[index].gradient[5]
													? btns[index].gradient[5]
													: 180,
												value,
											],
										},
										index
									);
								}}
							/>
						)}
					</div>
				)}
				<PopColorControl
					label={__('Border Color', 'kadence-blocks')}
					value={btns[index].border ? btns[index].border : '#555555'}
					default={''}
					opacityValue={btns[index].borderOpacity}
					onChange={(value) => {
						saveArrayUpdate({ border: value }, index);
					}}
					onOpacityChange={(value) => {
						saveArrayUpdate({ borderOpacity: value }, index);
					}}
					onArrayChange={(color, opacity) =>
						saveArrayUpdate({ border: color, borderOpacity: opacity }, index)
					}
				/>
				<BoxShadowControl
					label={__('Box Shadow', 'kadence-blocks')}
					enable={
						undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[0]
							? btns[index].boxShadow[0]
							: false
					}
					color={
						undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[1]
							? btns[index].boxShadow[1]
							: '#000000'
					}
					default={'#000000'}
					onArrayChange={(color, opacity) => {
						saveArrayUpdate(
							{
								boxShadow: [
									btns[index].boxShadow && undefined !== btns[index].boxShadow[0]
										? btns[index].boxShadow[0]
										: false,
									color,
									opacity,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[3]
										? btns[index].boxShadow[3]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[4]
										? btns[index].boxShadow[4]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[5]
										? btns[index].boxShadow[5]
										: 2,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[6]
										? btns[index].boxShadow[6]
										: 0,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[7]
										? btns[index].boxShadow[7]
										: false,
								],
							},
							index
						);
					}}
					opacity={
						undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[2]
							? btns[index].boxShadow[2]
							: 0.2
					}
					hOffset={
						undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[3]
							? btns[index].boxShadow[3]
							: 1
					}
					vOffset={
						undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[4]
							? btns[index].boxShadow[4]
							: 1
					}
					blur={
						undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[5]
							? btns[index].boxShadow[5]
							: 2
					}
					spread={
						undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[6]
							? btns[index].boxShadow[6]
							: 0
					}
					inset={
						undefined !== btns[index].boxShadow && undefined !== btns[index].boxShadow[7]
							? btns[index].boxShadow[7]
							: false
					}
					onEnableChange={(value) => {
						saveArrayUpdate(
							{
								boxShadow: [
									value,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[1]
										? btns[index].boxShadow[1]
										: '#000000',
									btns[index].boxShadow && undefined !== btns[index].boxShadow[2]
										? btns[index].boxShadow[2]
										: 0.2,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[3]
										? btns[index].boxShadow[3]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[4]
										? btns[index].boxShadow[4]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[5]
										? btns[index].boxShadow[5]
										: 2,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[6]
										? btns[index].boxShadow[6]
										: 0,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[7]
										? btns[index].boxShadow[7]
										: false,
								],
							},
							index
						);
					}}
					onColorChange={(value) => {
						saveArrayUpdate(
							{
								boxShadow: [
									btns[index].boxShadow && undefined !== btns[index].boxShadow[0]
										? btns[index].boxShadow[0]
										: false,
									value,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[2]
										? btns[index].boxShadow[2]
										: 0.2,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[3]
										? btns[index].boxShadow[3]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[4]
										? btns[index].boxShadow[4]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[5]
										? btns[index].boxShadow[5]
										: 2,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[6]
										? btns[index].boxShadow[6]
										: 0,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[7]
										? btns[index].boxShadow[7]
										: false,
								],
							},
							index
						);
					}}
					onOpacityChange={(value) => {
						saveArrayUpdate(
							{
								boxShadow: [
									btns[index].boxShadow && undefined !== btns[index].boxShadow[0]
										? btns[index].boxShadow[0]
										: false,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[1]
										? btns[index].boxShadow[1]
										: '#000000',
									value,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[3]
										? btns[index].boxShadow[3]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[4]
										? btns[index].boxShadow[4]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[5]
										? btns[index].boxShadow[5]
										: 2,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[6]
										? btns[index].boxShadow[6]
										: 0,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[7]
										? btns[index].boxShadow[7]
										: false,
								],
							},
							index
						);
					}}
					onHOffsetChange={(value) => {
						saveArrayUpdate(
							{
								boxShadow: [
									btns[index].boxShadow && undefined !== btns[index].boxShadow[0]
										? btns[index].boxShadow[0]
										: false,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[1]
										? btns[index].boxShadow[1]
										: '#000000',
									btns[index].boxShadow && undefined !== btns[index].boxShadow[2]
										? btns[index].boxShadow[2]
										: 0.2,
									value,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[4]
										? btns[index].boxShadow[4]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[5]
										? btns[index].boxShadow[5]
										: 2,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[6]
										? btns[index].boxShadow[6]
										: 0,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[7]
										? btns[index].boxShadow[7]
										: false,
								],
							},
							index
						);
					}}
					onVOffsetChange={(value) => {
						saveArrayUpdate(
							{
								boxShadow: [
									btns[index].boxShadow && undefined !== btns[index].boxShadow[0]
										? btns[index].boxShadow[0]
										: false,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[1]
										? btns[index].boxShadow[1]
										: '#000000',
									btns[index].boxShadow && undefined !== btns[index].boxShadow[2]
										? btns[index].boxShadow[2]
										: 0.2,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[3]
										? btns[index].boxShadow[3]
										: 1,
									value,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[5]
										? btns[index].boxShadow[5]
										: 2,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[6]
										? btns[index].boxShadow[6]
										: 0,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[7]
										? btns[index].boxShadow[7]
										: false,
								],
							},
							index
						);
					}}
					onBlurChange={(value) => {
						saveArrayUpdate(
							{
								boxShadow: [
									btns[index].boxShadow && undefined !== btns[index].boxShadow[0]
										? btns[index].boxShadow[0]
										: false,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[1]
										? btns[index].boxShadow[1]
										: '#000000',
									btns[index].boxShadow && undefined !== btns[index].boxShadow[2]
										? btns[index].boxShadow[2]
										: 0.2,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[3]
										? btns[index].boxShadow[3]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[4]
										? btns[index].boxShadow[4]
										: 1,
									value,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[6]
										? btns[index].boxShadow[6]
										: 0,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[7]
										? btns[index].boxShadow[7]
										: false,
								],
							},
							index
						);
					}}
					onSpreadChange={(value) => {
						saveArrayUpdate(
							{
								boxShadow: [
									btns[index].boxShadow && undefined !== btns[index].boxShadow[0]
										? btns[index].boxShadow[0]
										: false,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[1]
										? btns[index].boxShadow[1]
										: '#000000',
									btns[index].boxShadow && undefined !== btns[index].boxShadow[2]
										? btns[index].boxShadow[2]
										: 0.2,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[3]
										? btns[index].boxShadow[3]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[4]
										? btns[index].boxShadow[4]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[5]
										? btns[index].boxShadow[5]
										: 2,
									value,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[7]
										? btns[index].boxShadow[7]
										: false,
								],
							},
							index
						);
					}}
					onInsetChange={(value) => {
						saveArrayUpdate(
							{
								boxShadow: [
									btns[index].boxShadow && undefined !== btns[index].boxShadow[0]
										? btns[index].boxShadow[0]
										: false,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[1]
										? btns[index].boxShadow[1]
										: '#000000',
									btns[index].boxShadow && undefined !== btns[index].boxShadow[2]
										? btns[index].boxShadow[2]
										: 0.2,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[3]
										? btns[index].boxShadow[3]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[4]
										? btns[index].boxShadow[4]
										: 1,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[5]
										? btns[index].boxShadow[5]
										: 2,
									btns[index].boxShadow && undefined !== btns[index].boxShadow[6]
										? btns[index].boxShadow[6]
										: 0,
									value,
								],
							},
							index
						);
					}}
				/>
			</div>
		);
	};
	const renderArray = <>{times(btnCount, (n) => tabControls(n))}</>;
	const renderControlsArray = <>{times(btnCount, (n) => blockToolControls(n))}</>;
	const renderPreviewArray = <>{times(btnCount, (n) => renderBtns(n))}</>;
	const renderBtnCSS = (index) => {
		let btnbg;
		let btnGrad;
		let btnGrad2;
		let btnRad = '0';
		let btnBox = '';
		let btnBox2 = '';
		if (
			undefined !== btns[index].backgroundHoverType &&
			'gradient' === btns[index].backgroundHoverType &&
			undefined !== btns[index].gradientHover
		) {
			btnGrad =
				undefined === btns[index].backgroundHover
					? KadenceColorOutput(
							'#444444',
							btns[index].backgroundHoverOpacity !== undefined ? btns[index].backgroundHoverOpacity : 1
					  )
					: KadenceColorOutput(
							btns[index].backgroundHover,
							btns[index].backgroundHoverOpacity !== undefined ? btns[index].backgroundHoverOpacity : 1
					  );
			btnGrad2 =
				undefined === btns[index].gradientHover[0]
					? KadenceColorOutput(
							'#777777',
							btns[index].gradientHover[1] !== undefined ? btns[index].gradientHover[1] : 1
					  )
					: KadenceColorOutput(
							btns[index].gradientHover[0],
							btns[index].gradientHover[1] !== undefined ? btns[index].gradientHover[1] : 1
					  );
			if (undefined !== btns[index].gradientHover && 'radial' === btns[index].gradientHover[4]) {
				btnbg = `radial-gradient(at ${
					undefined === btns[index].gradientHover[6] ? 'center center' : btns[index].gradientHover[6]
				}, ${btnGrad} ${
					undefined === btns[index].gradientHover[2] ? '0' : btns[index].gradientHover[2]
				}%, ${btnGrad2} ${undefined === btns[index].gradientHover[3] ? '100' : btns[index].gradientHover[3]}%)`;
			} else if (
				undefined !== btns[index].backgroundType &&
				'gradient' === btns[index].backgroundType &&
				undefined !== btns[index].gradientHover &&
				'linear' === btns[index].gradientHover[4]
			) {
				btnbg = `linear-gradient(${
					undefined === btns[index].gradientHover[5] ? '180' : btns[index].gradientHover[5]
				}deg, ${btnGrad} ${
					undefined === btns[index].gradientHover[2] ? '0' : btns[index].gradientHover[2]
				}%, ${btnGrad2} ${undefined === btns[index].gradientHover[3] ? '100' : btns[index].gradientHover[3]}%)`;
			}
		} else if (
			undefined !== btns[index].backgroundHoverType &&
			'gradient' === btns[index].backgroundHoverType &&
			undefined === btns[index].gradientHover
		) {
			btnGrad =
				undefined === btns[index].backgroundHover
					? KadenceColorOutput(
							'#444444',
							btns[index].backgroundHoverOpacity !== undefined ? btns[index].backgroundHoverOpacity : 1
					  )
					: KadenceColorOutput(
							btns[index].backgroundHover,
							btns[index].backgroundHoverOpacity !== undefined ? btns[index].backgroundHoverOpacity : 1
					  );
			btnbg = `linear-gradient(180deg, ${btnGrad} 0%, #777777 100%)`;
		} else {
			btnbg = KadenceColorOutput(
				undefined === btns[index].backgroundHover ? '#444444' : btns[index].backgroundHover,
				btns[index].backgroundHoverOpacity !== undefined ? btns[index].backgroundHoverOpacity : 1
			);
		}
		if (
			undefined !== btns[index].boxShadowHover &&
			undefined !== btns[index].boxShadowHover[0] &&
			btns[index].boxShadowHover[0] &&
			false === btns[index].boxShadowHover[7]
		) {
			btnBox = `${
				undefined !== btns[index].boxShadowHover &&
				undefined !== btns[index].boxShadowHover[0] &&
				btns[index].boxShadowHover[0]
					? (undefined !== btns[index].boxShadowHover[7] && btns[index].boxShadowHover[7] ? 'inset ' : '') +
					  (undefined !== btns[index].boxShadowHover[3] ? btns[index].boxShadowHover[3] : 1) +
					  'px ' +
					  (undefined !== btns[index].boxShadowHover[4] ? btns[index].boxShadowHover[4] : 1) +
					  'px ' +
					  (undefined !== btns[index].boxShadowHover[5] ? btns[index].boxShadowHover[5] : 2) +
					  'px ' +
					  (undefined !== btns[index].boxShadowHover[6] ? btns[index].boxShadowHover[6] : 0) +
					  'px ' +
					  KadenceColorOutput(
							undefined !== btns[index].boxShadowHover[1] ? btns[index].boxShadowHover[1] : '#000000',
							undefined !== btns[index].boxShadowHover[2] ? btns[index].boxShadowHover[2] : 1
					  )
					: undefined
			}`;
			btnBox2 = 'none';
			btnRad = '0';
		}
		if (
			undefined !== btns[index].boxShadowHover &&
			undefined !== btns[index].boxShadowHover[0] &&
			btns[index].boxShadowHover[0] &&
			true === btns[index].boxShadowHover[7]
		) {
			btnBox2 = `${
				undefined !== btns[index].boxShadowHover &&
				undefined !== btns[index].boxShadowHover[0] &&
				btns[index].boxShadowHover[0]
					? (undefined !== btns[index].boxShadowHover[7] && btns[index].boxShadowHover[7] ? 'inset ' : '') +
					  (undefined !== btns[index].boxShadowHover[3] ? btns[index].boxShadowHover[3] : 1) +
					  'px ' +
					  (undefined !== btns[index].boxShadowHover[4] ? btns[index].boxShadowHover[4] : 1) +
					  'px ' +
					  (undefined !== btns[index].boxShadowHover[5] ? btns[index].boxShadowHover[5] : 2) +
					  'px ' +
					  (undefined !== btns[index].boxShadowHover[6] ? btns[index].boxShadowHover[6] : 0) +
					  'px ' +
					  KadenceColorOutput(
							undefined !== btns[index].boxShadowHover[1] ? btns[index].boxShadowHover[1] : '#000000',
							undefined !== btns[index].boxShadowHover[2] ? btns[index].boxShadowHover[2] : 1
					  )
					: undefined
			}`;
			btnRad = undefined !== btns[index].borderRadius ? btns[index].borderRadius : '3';
			btnBox = 'none';
		}
		return `#kt-btns_${uniqueID} .kt-button-${index}:hover {
					${btns[index].colorHover ? 'color:' + KadenceColorOutput(btns[index].colorHover) + '!important;' : ''}
					${
						btns[index].borderHover ||
						(btns[index].borderHoverOpacity && 1 !== btns[index].borderHoverOpacity)
							? 'border-color:' +
							  KadenceColorOutput(
									undefined === btns[index].borderHover ? '#444444' : btns[index].borderHover,
									btns[index].borderHoverOpacity !== undefined ? btns[index].borderHoverOpacity : 1
							  ) +
							  '!important;'
							: ''
					}
					${btnBox ? 'box-shadow:' + btnBox + '!important;' : ''}
				}
				${
					btns[index].iconColorHover
						? `#kt-btns_${uniqueID} .kt-button-${index}:hover .kt-btn-svg-icon { color:${KadenceColorOutput(
								btns[index].iconColorHover
						  )} !important;}`
						: ''
				}
				#kt-btns_${uniqueID} .kt-button-${index}::before {
					${btnbg ? 'background:' + btnbg + ';' : ''}
					${btnBox2 ? 'box-shadow:' + btnBox2 + ';' : ''}
					${btnRad ? 'border-radius:' + btnRad + 'px;' : ''}
				}`;
	};
	const renderCSS = <style>{times(btnCount, (n) => renderBtnCSS(n))}</style>;

	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			{renderCSS}
			<div
				id={`kt-btns_${uniqueID}`}
				className={`${className} kt-btn-align-${hAlign}${thAlign ? ` kt-btn-tab-align-${thAlign}` : ''}${
					mhAlign ? ` kt-btn-mobile-align-${mhAlign}` : ''
				}${forceFullwidth ? ' kt-force-btn-fullwidth' : ''}`}
			>
				<BlockControls>
					<AlignmentToolbar value={hAlign} onChange={(value) => setAttributes({ hAlign: value })} />
				</BlockControls>
				{showSettings('allSettings', 'kadence/advancedbtn') && (
					<Fragment>
						<InspectorControls>
							<InspectorControlTabs
								panelName={'advancedbtn'}
								setActiveTab={(value) => setActiveTab(value)}
								activeTab={activeTab}
							/>

							{activeTab === 'general' && (
								<>
									{showSettings('countSettings', 'kadence/advancedbtn') && (
										<KadencePanelBody
											title={__('Button Count', 'kadence-blocks')}
											initialOpen={true}
											panelName={'kb-adv-btn-count'}
										>
											{!lockBtnCount && (
												<PanelRow>
													<Button
														className="kb-add-field"
														isPrimary={true}
														icon={plus}
														onClick={() => {
															const newbtns = btns;
															const newcount = Math.abs(btnCount + 1);
															newbtns.push({
																text: newbtns[0].text,
																link: newbtns[0].link,
																target: newbtns[0].target,
																size: newbtns[0].size,
																paddingBT: newbtns[0].paddingBT,
																paddingLR: newbtns[0].paddingLR,
																color: newbtns[0].color,
																background: newbtns[0].background,
																border: newbtns[0].border,
																backgroundOpacity: newbtns[0].backgroundOpacity,
																borderOpacity: newbtns[0].borderOpacity,
																borderRadius: newbtns[0].borderRadius,
																borderWidth: newbtns[0].borderWidth,
																colorHover: newbtns[0].colorHover,
																backgroundHover: newbtns[0].backgroundHover,
																borderHover: newbtns[0].borderHover,
																backgroundHoverOpacity:
																	newbtns[0].backgroundHoverOpacity,
																borderHoverOpacity: newbtns[0].borderHoverOpacity,
																icon: newbtns[0].icon,
																iconSide: newbtns[0].iconSide,
																iconHover: newbtns[0].iconHover,
																cssClass: newbtns[0].cssClass
																	? newbtns[0].cssClass
																	: '',
																noFollow: newbtns[0].noFollow
																	? newbtns[0].noFollow
																	: false,
																gap: newbtns[0].gap ? newbtns[0].gap : 5,
																responsiveSize: newbtns[0].responsiveSize
																	? newbtns[0].responsiveSize
																	: ['', ''],
																gradient: newbtns[0].gradient
																	? newbtns[0].gradient
																	: [
																			'#999999',
																			1,
																			0,
																			100,
																			'linear',
																			180,
																			'center center',
																	  ],
																gradientHover: newbtns[0].gradientHover
																	? newbtns[0].gradientHover
																	: [
																			'#777777',
																			1,
																			0,
																			100,
																			'linear',
																			180,
																			'center center',
																	  ],
																btnStyle: newbtns[0].btnStyle
																	? newbtns[0].btnStyle
																	: 'basic',
																btnSize: newbtns[0].btnSize
																	? newbtns[0].btnSize
																	: 'standard',
																backgroundType: newbtns[0].backgroundType
																	? newbtns[0].backgroundType
																	: 'solid',
																backgroundHoverType: newbtns[0].backgroundHoverType
																	? newbtns[0].backgroundHoverType
																	: 'solid',
																width: newbtns[0].width
																	? newbtns[0].width
																	: ['', '', ''],
																responsivePaddingBT: newbtns[0].responsivePaddingBT
																	? newbtns[0].responsivePaddingBT
																	: ['', ''],
																responsivePaddingLR: newbtns[0].responsivePaddingLR
																	? newbtns[0].responsivePaddingLR
																	: ['', ''],
																boxShadow: newbtns[0].boxShadow
																	? newbtns[0].boxShadow
																	: [false, '#000000', 0.2, 1, 1, 2, 0, false],
																boxShadowHover: newbtns[0].boxShadowHover
																	? newbtns[0].boxShadowHover
																	: [false, '#000000', 0.4, 2, 2, 3, 0, false],
																sponsored: newbtns[0].sponsored
																	? newbtns[0].sponsored
																	: false,
																download: false,
																tabletGap: newbtns[0].tabletGap
																	? newbtns[0].tabletGap
																	: '',
																mobileGap: newbtns[0].mobileGap
																	? newbtns[0].mobileGap
																	: '',
																inheritStyles: newbtns[0].inheritStyles
																	? newbtns[0].inheritStyles
																	: '',
																iconSize: newbtns[0].iconSize
																	? newbtns[0].iconSize
																	: ['', '', ''],
																iconPadding: newbtns[0].iconPadding
																	? newbtns[0].iconPadding
																	: ['', '', '', ''],
																iconTabletPadding: newbtns[0].iconTabletPadding
																	? newbtns[0].iconTabletPadding
																	: ['', '', '', ''],
																iconMobilePadding: newbtns[0].iconMobilePadding
																	? newbtns[0].iconMobilePadding
																	: ['', '', '', ''],
																onlyIcon: newbtns[0].onlyIcon
																	? newbtns[0].onlyIcon
																	: [false, '', ''],
																iconColor: newbtns[0].iconColor
																	? newbtns[0].iconColor
																	: '',
																iconColorHover: newbtns[0].iconColorHover
																	? newbtns[0].iconColorHover
																	: '',
																sizeType: newbtns[0].sizeType
																	? newbtns[0].sizeType
																	: 'px',
																iconSizeType: newbtns[0].iconSizeType
																	? newbtns[0].iconSizeType
																	: 'px',
																label: newbtns[0].label ? newbtns[0].label : '',
																marginUnit: newbtns[0].marginUnit
																	? newbtns[0].marginUnit
																	: 'px',
																margin: newbtns[0].margin
																	? newbtns[0].margin
																	: ['', '', '', ''],
																tabletMargin: newbtns[0].tabletMargin
																	? newbtns[0].tabletMargin
																	: ['', '', '', ''],
																mobileMargin: newbtns[0].mobileMargin
																	? newbtns[0].mobileMargin
																	: ['', '', '', ''],
																anchor: newbtns[0].anchor ? newbtns[0].anchor : '',
																borderStyle: newbtns[0].borderStyle
																	? newbtns[0].borderStyle
																	: '',
															});
															setAttributes({ btns: newbtns });
															saveArrayUpdate({ iconSide: btns[0].iconSide }, 0);
															setAttributes({ btnCount: newcount });
														}}
													>
														{__('Add Button', 'kadence-blocks')}
													</Button>
												</PanelRow>
											)}

											<ResponsiveAlignControls
												label={__('Button Alignment', 'kadence-blocks')}
												value={hAlign ? hAlign : ''}
												mobileValue={mhAlign ? mhAlign : ''}
												tabletValue={thAlign ? thAlign : ''}
												onChange={(nextAlign) => setAttributes({ hAlign: nextAlign })}
												onChangeTablet={(nextAlign) => setAttributes({ thAlign: nextAlign })}
												onChangeMobile={(nextAlign) => setAttributes({ mhAlign: nextAlign })}
											/>
										</KadencePanelBody>
									)}
									{renderArray}
								</>
							)}

							{activeTab === 'style' && (
								<>
									{showSettings('fontSettings', 'kadence/advancedbtn') && (
										<KadencePanelBody
											title={__('Font Family', 'kadence-blocks')}
											className="kt-font-family-area"
											panelName={'kb-adv-btn-font-family'}
										>
											<TypographyControls
												fontGroup={'button'}
												letterSpacing={letterSpacing}
												onLetterSpacing={(value) => setAttributes({ letterSpacing: value })}
												textTransform={textTransform}
												onTextTransform={(value) => setAttributes({ textTransform: value })}
												fontFamily={typography}
												onFontFamily={(value) => setAttributes({ typography: value })}
												onFontChange={(select) => {
													setAttributes({
														typography: select.value,
														googleFont: select.google,
													});
												}}
												googleFont={googleFont}
												onGoogleFont={(value) => setAttributes({ googleFont: value })}
												loadGoogleFont={loadGoogleFont}
												onLoadGoogleFont={(value) => setAttributes({ loadGoogleFont: value })}
												fontVariant={fontVariant}
												onFontVariant={(value) => setAttributes({ fontVariant: value })}
												fontWeight={fontWeight}
												onFontWeight={(value) => setAttributes({ fontWeight: value })}
												fontStyle={fontStyle}
												onFontStyle={(value) => setAttributes({ fontStyle: value })}
												fontSubset={fontSubset}
												onFontSubset={(value) => setAttributes({ fontSubset: value })}
											/>
										</KadencePanelBody>
									)}
								</>
							)}

							{activeTab === 'advanced' && (
								<>
									{showSettings('marginSettings', 'kadence/advancedbtn') && (
										<>
											<KadencePanelBody panelName={'kb-adv-button-margin-settings'}>
												<ResponsiveMeasureRangeControl
													label={__('Container Margin', 'kadence-blocks')}
													value={
														undefined !== margin &&
														undefined !== margin[0] &&
														undefined !== margin[0].desk
															? margin[0].desk
															: ['', '', '', '']
													}
													tabletValue={
														undefined !== margin &&
														undefined !== margin[0] &&
														undefined !== margin[0].tablet
															? margin[0].tablet
															: ['', '', '', '']
													}
													mobileValue={
														undefined !== margin &&
														undefined !== margin[0] &&
														undefined !== margin[0].mobile
															? margin[0].mobile
															: ['', '', '', '']
													}
													onChange={(value) => {
														saveMargin({ desk: value });
													}}
													onChangeTablet={(value) => {
														saveMargin({ tablet: value });
													}}
													onChangeMobile={(value) => {
														saveMargin({ mobile: value });
													}}
													min={marginMin}
													max={marginMax}
													step={marginStep}
													unit={marginUnit}
													units={['px', 'em', 'rem', '%', 'vh']}
													onUnit={(value) => setAttributes({ marginUnit: value })}
													onMouseOver={marginMouseOver.onMouseOver}
													onMouseOut={marginMouseOver.onMouseOut}
												/>
											</KadencePanelBody>

											<div className="kt-sidebar-settings-spacer"></div>
										</>
									)}

									<KadenceBlockDefaults
										attributes={attributes}
										defaultAttributes={metadata.attributes}
										blockSlug={'kadence/advancedbtn'}
										excludedAttrs={['btnCount', 'lockBtnCount', 'hideLink']}
										preventMultiple={['btns']}
									/>
								</>
							)}
						</InspectorControls>
						<InspectorAdvancedControls>
							<ToggleControl
								label={__('Force Button Fullwidth', 'kadence-blocks')}
								checked={undefined !== forceFullwidth ? forceFullwidth : false}
								onChange={(value) => defineWidthTypeToggle(value)}
							/>
							{undefined !== forceFullwidth && forceFullwidth && (
								<ToggleControl
									label={__('Collapse on mobile', 'kadence-blocks')}
									checked={undefined !== collapseFullwidth ? collapseFullwidth : false}
									onChange={(value) => setAttributes({ collapseFullwidth: value })}
								/>
							)}
						</InspectorAdvancedControls>
					</Fragment>
				)}
				<div
					id={`animate-id${uniqueID}`}
					className={'btn-inner-wrap aos-animate kt-animation-wrap'}
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
						marginTop:
							undefined !== previewMarginTop
								? getSpacingOptionOutput(previewMarginTop, marginUnit)
								: undefined,
						marginRight:
							undefined !== previewMarginRight
								? getSpacingOptionOutput(previewMarginRight, marginUnit)
								: undefined,
						marginBottom:
							undefined !== previewMarginBottom
								? getSpacingOptionOutput(previewMarginBottom, marginUnit)
								: undefined,
						marginLeft:
							undefined !== previewMarginLeft
								? getSpacingOptionOutput(previewMarginLeft, marginUnit)
								: undefined,
					}}
				>
					{renderPreviewArray}
					{googleFont && <WebfontLoader config={config}></WebfontLoader>}
					<SpacingVisualizer
						style={{
							marginLeft:
								undefined !== previewMarginLeft
									? getSpacingOptionOutput(previewMarginLeft, marginUnit)
									: undefined,
							marginRight:
								undefined !== previewMarginRight
									? getSpacingOptionOutput(previewMarginRight, marginUnit)
									: undefined,
							marginTop:
								undefined !== previewMarginTop
									? getSpacingOptionOutput(previewMarginTop, marginUnit)
									: undefined,
							marginBottom:
								undefined !== previewMarginBottom
									? getSpacingOptionOutput(previewMarginBottom, marginUnit)
									: undefined,
						}}
						type="outside"
						forceShow={marginMouseOver.isMouseOver}
						spacing={[
							getSpacingOptionOutput(previewMarginTop, marginUnit),
							getSpacingOptionOutput(previewMarginRight, marginUnit),
							getSpacingOptionOutput(previewMarginBottom, marginUnit),
							getSpacingOptionOutput(previewMarginLeft, marginUnit),
						]}
					/>
				</div>
			</div>
		</div>
	);
}

export default compose([
	withSelect((select, ownProps) => {
		return {
			getPreviewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
		};
	}),
])(KadenceAdvancedButton);
