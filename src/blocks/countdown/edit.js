/**
 * BLOCK: Kadence Countdown
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * External dependencies
 */
import classnames from 'classnames';
import { get } from 'lodash';

/**
 * Import Icons
 */
import {
	bottomLeftIcon,
	bottomRightIcon,
	radiusIndividualIcon,
	radiusLinkedIcon,
	topLeftIcon,
	topRightIcon,
} from '@kadence/icons';

import {
	PopColorControl,
	TypographyControls,
	ResponsiveMeasurementControls,
	RangeControl,
	KadencePanelBody,
	URLInputControl,
	KadenceRadioButtons,
	ResponsiveAlignControls,
	WebfontLoader,
	InspectorControlTabs,
	MeasurementControls,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
} from '@kadence/components';
import {
	KadenceColorOutput,
	showSettings,
	getPreviewSize,
	getSpacingOptionOutput,
	mouseOverVisualizer,
	getFontSizeOptionOutput,
	uniqueIdHelper,
} from '@kadence/helpers';

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { getSettings as getDateSettings } from '@wordpress/date';

import { applyFilters } from '@wordpress/hooks';

import { useSelect, useDispatch } from '@wordpress/data';

import { useEffect, useState } from '@wordpress/element';

import {
	InnerBlocks,
	BlockControls,
	AlignmentToolbar,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Panel,
	ToggleControl,
	Button,
	TextControl,
	DateTimePicker,
	SelectControl,
	ToolbarGroup,
} from '@wordpress/components';

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const COUNTDOWN_TEMPLATE = [['kadence/countdown-timer', {}]];
const COUNTDOWN_TEMPLATE_WITH_MESSAGE = [
	['kadence/countdown-timer', {}],
	['kadence/countdown-inner', { location: 'complete' }],
];
const COUNTDOWN_NO_TIMER_WITH_MESSAGE = [
	['kadence/countdown-inner', { location: 'first' }],
	['kadence/countdown-inner', { location: 'complete' }],
];
const COUNTDOWN_NO_TIMER = [['kadence/countdown-inner', { location: 'first' }]];
const typeOptions = [
	{ value: 'date', label: __('Date', 'kadence-blocks'), disabled: false },
	{ value: 'evergreen', label: __('Evergreen (Pro addon)', 'kadence-blocks'), disabled: true },
];
const actionOptions = [
	{ value: 'none', label: __('Show Timer at Zero', 'kadence-blocks'), disabled: false },
	{ value: 'hide', label: __('Hide (Pro addon)', 'kadence-blocks'), disabled: true },
	{ value: 'message', label: __('Replace with Content (Pro addon)', 'kadence-blocks'), disabled: true },
	{ value: 'redirect', label: __('Redirect (Pro addon)', 'kadence-blocks'), disabled: true },
];
const frequencyOptions = [
	{ value: 'daily', label: __('Daily', 'kadence-blocks'), disabled: false },
	{ value: 'weekly', label: __('Weekly', 'kadence-blocks'), disabled: false },
	{ value: 'monthly', label: __('Monthly', 'kadence-blocks'), disabled: false },
	{ value: 'yearly', label: __('Yearly', 'kadence-blocks'), disabled: false },
];
const ANCHOR_REGEX = /[\s#]/g;

/**
 * Build the spacer edit
 */
function KadenceCountdown(props) {
	const { attributes, setAttributes, className, clientId } = props;
	const {
		uniqueID,
		expireAction,
		units,
		enableTimer,
		evergreenHours,
		evergreenMinutes,
		repeat,
		stopRepeating,
		frequency,
		redirectURL,
		timerLayout,
		date,
		endDate,
		timestamp,
		evergreenReset,
		timezone,
		timeOffset,
		preLabel,
		postLabel,
		daysLabel,
		hoursLabel,
		minutesLabel,
		secondsLabel,
		counterAlign,
		campaignID,
		enablePauseButton,
		pauseButtonPosition,
		numberColor,
		numberFont,
		labelColor,
		labelFont,
		preLabelColor,
		preLabelFont,
		postLabelColor,
		postLabelFont,
		border,
		borderRadius,
		borderWidth,
		mobileBorderWidth,
		tabletBorderWidth,
		background,
		vsdesk,
		vstablet,
		vsmobile,
		countdownType,
		paddingType,
		marginType,
		containerMobilePadding,
		containerTabletPadding,
		containerPadding,
		containerMobileMargin,
		containerTabletMargin,
		containerMargin,
		itemBorder,
		itemBorderWidth,
		itemBackground,
		itemTabletBorderWidth,
		itemMobileBorderWidth,
		itemPadding,
		itemTabletPadding,
		itemMobilePadding,
		itemBorderRadius,
		itemPaddingType,
		timeNumbers,
		countdownDivider,
		revealOnLoad,
		evergreenStrict,
	} = attributes;

	const { selectBlock } = useDispatch('core/block-editor');

	const { previewDevice, isNested, parentBlock } = useSelect(
		(select) => {
			const { getBlock, getBlockParentsByBlockName } = select('core/block-editor');
			const parentBlocks = getBlockParentsByBlockName(clientId, 'kadence/countdown');
			const nested = parentBlocks.length && undefined !== parentBlocks[0] && '' !== parentBlocks[0];
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				isNested: nested,
				parentBlock: nested ? getBlock(parentBlocks[0]) : '',
			};
		},
		[clientId]
	);

	useEffect(() => {
		if (
			borderRadius &&
			borderRadius[0] === borderRadius[1] &&
			borderRadius[0] === borderRadius[2] &&
			borderRadius[0] === borderRadius[3]
		) {
			setBorderRadiusControl('linked');
		} else {
			setBorderRadiusControl('individual');
		}

		if (!date) {
			dateSettings = getDateSettings();
			const { timezone } = dateSettings;
			const today = new Date();
			const newDate = new Date();
			newDate.setDate(today.getDate() + 2);
			const theTimeOffset = timezone && timezone.offset ? timezone.offset : 0;
			const theSiteTimezoneTimestamp = getTimestamp(newDate, theTimeOffset);
			setAttributes({
				date: newDate,
				timestamp: theSiteTimezoneTimestamp,
				timezone: timezone && timezone.string ? timezone.string : '',
				timeOffset: theTimeOffset,
			});
		}
	}, []);

	uniqueIdHelper(props);

	const [borderWidthControl, setBorderWidthControl] = useState('individual');
	const [borderRadiusControl, setBorderRadiusControl] = useState('linked');
	const [itemBorderWidthControl, setItemBorderWidthControl] = useState('individual');
	const [itemBorderRadiusControl, setItemBorderRadiusControl] = useState('linked');
	const [itemPaddingControl, setItemPaddingControl] = useState('linked');
	const [previewExpired, setPreviewExpired] = useState(false);
	const [activeTab, setActiveTab] = useState('general');

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	let dateSettings = {};

	const getTimestamp = (value, theTimeOffset) => {
		const userTimezoneOffset = -1 * (new Date().getTimezoneOffset() / 60);
		if (Number(theTimeOffset) === userTimezoneOffset) {
			return new Date(value).getTime();
		}
		return timezoneShifter(value, theTimeOffset);
	};

	const timezoneShifter = (value, theTimeOffset) => {
		// Get the timezone offset of current site user.
		const userTimezoneOffset = -1 * (new Date().getTimezoneOffset() / 60);
		// Get the difference in offset from the sites set timezone.
		const shiftDiff = userTimezoneOffset - theTimeOffset;
		// Get the date in the timezone of the user.
		const currentDate = new Date(value);
		// Shift that date the difference in timezones from the user to the site.
		return new Date(currentDate.getTime() + shiftDiff * 60 * 60 * 1000).getTime();
	};

	const countdownTypes = applyFilters('kadence.countdownTypes', typeOptions);
	const countdownActions = applyFilters('kadence.countdownActions', actionOptions);
	dateSettings = getDateSettings();
	// To know if the current timezone is a 12 hour time with look for "a" in the time format
	// We also make sure this a is not escaped by a "/"
	const is12HourTime = /a(?!\\)/i.test(
		dateSettings.formats.time
			.toLowerCase() // Test only the lower case a
			.replace(/\\\\/g, '') // Replace "//" with empty strings
			.split('')
			.reverse()
			.join('') // Reverse the string and test for "a" not followed by a slash
	);
	const saveUnits = (value) => {
		const newUpdate = units.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			units: newUpdate,
		});
	};

	const saveDate = (value) => {
		const theTimezone = get(dateSettings, ['timezone', 'string'], '');
		const theTimeOffset = get(dateSettings, ['timezone', 'offset'], 0);

		const theSiteTimezoneTimestamp = getTimestamp(value, theTimeOffset);
		setAttributes({
			date: value,
			timestamp: theSiteTimezoneTimestamp,
			timezone: theTimezone,
			timeOffset: theTimeOffset,
		});
	};
	const getEverGreenTimestamp = (value) => {
		const newDate = new Date();
		newDate.setTime(newDate.getTime() + Number(value) * 60 * 60 * 1000);
		newDate.setTime(newDate.getTime() + (evergreenMinutes ? Number(evergreenMinutes) : 0) * 60 * 1000);
		return newDate.getTime();
	};
	const saveEvergreenHours = (value) => {
		const hoursValue = undefined !== value ? value : 0;
		const theEvergreenTimeStamp = getEverGreenTimestamp(hoursValue);
		setAttributes({
			evergreenHours: hoursValue,
			timestamp: theEvergreenTimeStamp,
		});
	};
	const getEverGreenMinTimestamp = (value) => {
		const newDate = new Date();
		newDate.setTime(newDate.getTime() + (evergreenHours ? Number(evergreenHours) : 0) * 60 * 60 * 1000);
		newDate.setTime(newDate.getTime() + Number(value) * 60 * 1000);
		return newDate.getTime();
	};
	const saveEvergreenMinutes = (value) => {
		const minutesValue = undefined !== value ? value : 0;
		const theEvergreenTimeStamp = getEverGreenMinTimestamp(minutesValue);
		setAttributes({
			evergreenMinutes: minutesValue,
			timestamp: theEvergreenTimeStamp,
		});
	};
	const saveNumberFont = (value) => {
		const newUpdate = numberFont.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			numberFont: newUpdate,
		});
	};
	const saveLabelFont = (value) => {
		const newUpdate = labelFont.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			labelFont: newUpdate,
		});
	};
	const savePreFont = (value) => {
		const newUpdate = preLabelFont.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			preLabelFont: newUpdate,
		});
	};
	const savePostFont = (value) => {
		const newUpdate = postLabelFont.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			postLabelFont: newUpdate,
		});
	};
	const numberConfigSettings = {
		google: {
			families: [
				(undefined !== numberFont &&
				undefined !== numberFont[0] &&
				undefined !== numberFont[0].family &&
				'' !== numberFont[0].family &&
				numberFont[0].google
					? numberFont[0].family
					: '') +
					(undefined !== numberFont &&
					undefined !== numberFont[0] &&
					undefined !== numberFont[0].variant &&
					'' !== numberFont[0].variant
						? ':' + numberFont[0].variant
						: ''),
			],
		},
	};
	const labelConfigSettings = {
		google: {
			families: [
				(undefined !== labelFont &&
				undefined !== labelFont[0] &&
				undefined !== labelFont[0].family &&
				'' !== labelFont[0].family &&
				labelFont[0].google
					? labelFont[0].family
					: '') +
					(undefined !== labelFont &&
					undefined !== labelFont[0] &&
					undefined !== labelFont[0].variant &&
					'' !== labelFont[0].variant
						? ':' + labelFont[0].variant
						: ''),
			],
		},
	};
	const preLabelConfigSettings = {
		google: {
			families: [
				(undefined !== preLabelFont &&
				undefined !== preLabelFont[0] &&
				undefined !== preLabelFont[0].family &&
				'' !== preLabelFont[0].family &&
				preLabelFont[0].google
					? preLabelFont[0].family
					: '') +
					(undefined !== preLabelFont &&
					undefined !== preLabelFont[0] &&
					undefined !== preLabelFont[0].variant &&
					'' !== preLabelFont[0].variant
						? ':' + preLabelFont[0].variant
						: ''),
			],
		},
	};
	const postLabelConfigSettings = {
		google: {
			families: [
				(undefined !== postLabelFont &&
				undefined !== postLabelFont[0] &&
				undefined !== postLabelFont[0].family &&
				'' !== postLabelFont[0].family &&
				postLabelFont[0].google
					? postLabelFont[0].family
					: '') +
					(undefined !== postLabelFont &&
					undefined !== postLabelFont[0] &&
					undefined !== postLabelFont[0].variant &&
					'' !== postLabelFont[0].variant
						? ':' + postLabelFont[0].variant
						: ''),
			],
		},
	};
	const numberConfig =
		undefined !== numberFont &&
		undefined !== numberFont[0] &&
		undefined !== numberFont[0].family &&
		'' !== numberFont[0].family &&
		numberFont[0].google
			? numberConfigSettings
			: '';
	const labelConfig =
		undefined !== labelFont &&
		undefined !== labelFont[0] &&
		undefined !== labelFont[0].family &&
		'' !== labelFont[0].family &&
		labelFont[0].google
			? labelConfigSettings
			: '';
	const preLabelConfig =
		undefined !== preLabelFont &&
		undefined !== preLabelFont[0] &&
		undefined !== preLabelFont[0].family &&
		'' !== preLabelFont[0].family &&
		preLabelFont[0].google
			? preLabelConfigSettings
			: '';
	const postLabelConfig =
		undefined !== postLabelFont &&
		undefined !== postLabelFont[0] &&
		undefined !== postLabelFont[0].family &&
		'' !== postLabelFont[0].family &&
		postLabelFont[0].google
			? postLabelConfigSettings
			: '';
	const templateWithTimer = 'message' === expireAction ? COUNTDOWN_TEMPLATE_WITH_MESSAGE : COUNTDOWN_TEMPLATE;
	const templateNoTimer = 'message' === expireAction ? COUNTDOWN_NO_TIMER_WITH_MESSAGE : COUNTDOWN_NO_TIMER;
	const marginMin = marginType === 'em' || marginType === 'rem' ? -25 : -999;
	const marginMax = marginType === 'em' || marginType === 'rem' ? 25 : 999;
	const marginStep = marginType === 'em' || marginType === 'rem' ? 0.1 : 1;
	const paddingMin = paddingType === 'em' || paddingType === 'rem' ? 0 : 0;
	const paddingMax = paddingType === 'em' || paddingType === 'rem' ? 25 : 999;
	const paddingStep = paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1;
	const previewPaddingType = undefined !== paddingType ? paddingType : 'px';
	const itemPaddingMin = itemPaddingType === 'em' || itemPaddingType === 'rem' ? 0 : 0;
	const itemPaddingMax = itemPaddingType === 'em' || itemPaddingType === 'rem' ? 12 : 999;
	const itemPaddingStep = itemPaddingType === 'em' || itemPaddingType === 'rem' ? 0.1 : 1;
	const previewItemPaddingType = undefined !== itemPaddingType ? itemPaddingType : 'px';
	const previewMarginType = undefined !== marginType ? marginType : 'px';
	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== containerMargin && undefined !== containerMargin[0] ? containerMargin[0] : '',
		undefined !== containerTabletMargin && undefined !== containerTabletMargin[0] ? containerTabletMargin[0] : '',
		undefined !== containerMobileMargin && undefined !== containerMobileMargin[0] ? containerMobileMargin[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== containerMargin && undefined !== containerMargin[1] ? containerMargin[1] : '',
		undefined !== containerTabletMargin && undefined !== containerTabletMargin[1] ? containerTabletMargin[1] : '',
		undefined !== containerMobileMargin && undefined !== containerMobileMargin[1] ? containerMobileMargin[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== containerMargin && undefined !== containerMargin[2] ? containerMargin[2] : '',
		undefined !== containerTabletMargin && undefined !== containerTabletMargin[2] ? containerTabletMargin[2] : '',
		undefined !== containerMobileMargin && undefined !== containerMobileMargin[2] ? containerMobileMargin[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== containerMargin && undefined !== containerMargin[3] ? containerMargin[3] : '',
		undefined !== containerTabletMargin && undefined !== containerTabletMargin[3] ? containerTabletMargin[3] : '',
		undefined !== containerMobileMargin && undefined !== containerMobileMargin[3] ? containerMobileMargin[3] : ''
	);
	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== containerPadding && undefined !== containerPadding[0] ? containerPadding[0] : '',
		undefined !== containerTabletPadding && undefined !== containerTabletPadding[0]
			? containerTabletPadding[0]
			: '',
		undefined !== containerMobilePadding && undefined !== containerMobilePadding[0] ? containerMobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== containerPadding && undefined !== containerPadding[1] ? containerPadding[1] : '',
		undefined !== containerTabletPadding && undefined !== containerTabletPadding[1]
			? containerTabletPadding[1]
			: '',
		undefined !== containerMobilePadding && undefined !== containerMobilePadding[1] ? containerMobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== containerPadding && undefined !== containerPadding[2] ? containerPadding[2] : '',
		undefined !== containerTabletPadding && undefined !== containerTabletPadding[2]
			? containerTabletPadding[2]
			: '',
		undefined !== containerMobilePadding && undefined !== containerMobilePadding[2] ? containerMobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== containerPadding && undefined !== containerPadding[3] ? containerPadding[3] : '',
		undefined !== containerTabletPadding && undefined !== containerTabletPadding[3]
			? containerTabletPadding[3]
			: '',
		undefined !== containerMobilePadding && undefined !== containerMobilePadding[3] ? containerMobilePadding[3] : ''
	);
	const previewBorderTop = getPreviewSize(
		previewDevice,
		undefined !== borderWidth ? borderWidth[0] : '',
		undefined !== tabletBorderWidth ? tabletBorderWidth[0] : '',
		undefined !== mobileBorderWidth ? mobileBorderWidth[0] : ''
	);
	const previewBorderRight = getPreviewSize(
		previewDevice,
		undefined !== borderWidth ? borderWidth[1] : '',
		undefined !== tabletBorderWidth ? tabletBorderWidth[1] : '',
		undefined !== mobileBorderWidth ? mobileBorderWidth[1] : ''
	);
	const previewBorderBottom = getPreviewSize(
		previewDevice,
		undefined !== borderWidth ? borderWidth[2] : '',
		undefined !== tabletBorderWidth ? tabletBorderWidth[2] : '',
		undefined !== mobileBorderWidth ? mobileBorderWidth[2] : ''
	);
	const previewBorderLeft = getPreviewSize(
		previewDevice,
		undefined !== borderWidth ? borderWidth[3] : '',
		undefined !== tabletBorderWidth ? tabletBorderWidth[3] : '',
		undefined !== mobileBorderWidth ? mobileBorderWidth[3] : ''
	);

	const previewItemPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== itemPadding && undefined !== itemPadding[0] ? itemPadding[0] : '',
		undefined !== itemTabletPadding && undefined !== itemTabletPadding[0] ? itemTabletPadding[0] : '',
		undefined !== itemMobilePadding && undefined !== itemMobilePadding[0] ? itemMobilePadding[0] : ''
	);
	const previewItemPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== itemPadding && undefined !== itemPadding[1] ? itemPadding[1] : '',
		undefined !== itemTabletPadding && undefined !== itemTabletPadding[1] ? itemTabletPadding[1] : '',
		undefined !== itemMobilePadding && undefined !== itemMobilePadding[1] ? itemMobilePadding[1] : ''
	);
	const previewItemPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== itemPadding && undefined !== itemPadding[2] ? itemPadding[2] : '',
		undefined !== itemTabletPadding && undefined !== itemTabletPadding[2] ? itemTabletPadding[2] : '',
		undefined !== itemMobilePadding && undefined !== itemMobilePadding[2] ? itemMobilePadding[2] : ''
	);
	const previewItemPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== itemPadding && undefined !== itemPadding[3] ? itemPadding[3] : '',
		undefined !== itemTabletPadding && undefined !== itemTabletPadding[3] ? itemTabletPadding[3] : '',
		undefined !== itemMobilePadding && undefined !== itemMobilePadding[3] ? itemMobilePadding[3] : ''
	);
	const previewItemBorderTop = getPreviewSize(
		previewDevice,
		undefined !== itemBorderWidth ? itemBorderWidth[0] : '',
		undefined !== itemTabletBorderWidth ? itemTabletBorderWidth[0] : '',
		undefined !== itemMobileBorderWidth ? itemMobileBorderWidth[0] : ''
	);
	const previewItemBorderRight = getPreviewSize(
		previewDevice,
		undefined !== itemBorderWidth ? itemBorderWidth[1] : '',
		undefined !== itemTabletBorderWidth ? itemTabletBorderWidth[1] : '',
		undefined !== itemMobileBorderWidth ? itemMobileBorderWidth[1] : ''
	);
	const previewItemBorderBottom = getPreviewSize(
		previewDevice,
		undefined !== itemBorderWidth ? itemBorderWidth[2] : '',
		undefined !== itemTabletBorderWidth ? itemTabletBorderWidth[2] : '',
		undefined !== itemMobileBorderWidth ? itemMobileBorderWidth[2] : ''
	);
	const previewItemBorderLeft = getPreviewSize(
		previewDevice,
		undefined !== itemBorderWidth ? itemBorderWidth[3] : '',
		undefined !== itemTabletBorderWidth ? itemTabletBorderWidth[3] : '',
		undefined !== itemMobileBorderWidth ? itemMobileBorderWidth[3] : ''
	);

	const previewNumberSizeType =
		undefined !== numberFont && undefined !== numberFont[0] && '' !== numberFont[0].sizeType
			? numberFont[0].sizeType
			: 'px';
	const previewNumberLineType =
		undefined !== numberFont && undefined !== numberFont[0] && '' !== numberFont[0].lineType
			? numberFont[0].lineType
			: 'px';
	const previewNumberLetterType =
		undefined !== numberFont && undefined !== numberFont[0] && '' !== numberFont[0].letterType
			? numberFont[0].letterType
			: 'px';
	const previewNumberFontSize = getPreviewSize(
		previewDevice,
		undefined !== numberFont &&
			undefined !== numberFont[0] &&
			undefined !== numberFont[0].size &&
			undefined !== numberFont[0].size[0] &&
			'' !== numberFont[0].size[0]
			? numberFont[0].size[0]
			: '',
		undefined !== numberFont &&
			undefined !== numberFont[0] &&
			undefined !== numberFont[0].size &&
			undefined !== numberFont[0].size[1] &&
			'' !== numberFont[0].size[1]
			? numberFont[0].size[1]
			: '',
		undefined !== numberFont &&
			undefined !== numberFont[0] &&
			undefined !== numberFont[0].size &&
			undefined !== numberFont[0].size[2] &&
			'' !== numberFont[0].size[2]
			? numberFont[0].size[2]
			: ''
	);
	const previewNumberLineSize = getPreviewSize(
		previewDevice,
		undefined !== numberFont &&
			undefined !== numberFont[0] &&
			undefined !== numberFont[0].lineHeight &&
			undefined !== numberFont[0].lineHeight[0] &&
			'' !== numberFont[0].lineHeight[0]
			? numberFont[0].lineHeight[0]
			: '',
		undefined !== numberFont &&
			undefined !== numberFont[0] &&
			undefined !== numberFont[0].lineHeight &&
			undefined !== numberFont[0].lineHeight[1] &&
			'' !== numberFont[0].lineHeight[1]
			? numberFont[0].lineHeight[1]
			: '',
		undefined !== numberFont &&
			undefined !== numberFont[0] &&
			undefined !== numberFont[0].lineHeight &&
			undefined !== numberFont[0].lineHeight[2] &&
			'' !== numberFont[0].lineHeight[2]
			? numberFont[0].lineHeight[2]
			: ''
	);
	const previewNumberLetterSize = getPreviewSize(
		previewDevice,
		undefined !== numberFont &&
			undefined !== numberFont[0] &&
			undefined !== numberFont[0].letterSpacing &&
			undefined !== numberFont[0].letterSpacing[0] &&
			'' !== numberFont[0].letterSpacing[0]
			? numberFont[0].letterSpacing[0]
			: '',
		undefined !== numberFont &&
			undefined !== numberFont[0] &&
			undefined !== numberFont[0].letterSpacing &&
			undefined !== numberFont[0].letterSpacing[1] &&
			'' !== numberFont[0].letterSpacing[1]
			? numberFont[0].letterSpacing[1]
			: '',
		undefined !== numberFont &&
			undefined !== numberFont[0] &&
			undefined !== numberFont[0].letterSpacing &&
			undefined !== numberFont[0].letterSpacing[2] &&
			'' !== numberFont[0].letterSpacing[2]
			? numberFont[0].letterSpacing[2]
			: ''
	);
	const previewLabelSizeType =
		undefined !== labelFont && undefined !== labelFont[0] && '' !== labelFont[0].sizeType
			? labelFont[0].sizeType
			: 'px';
	const previewLabelLineType =
		undefined !== labelFont && undefined !== labelFont[0] && '' !== labelFont[0].lineType
			? labelFont[0].lineType
			: 'px';
	const previewLabelLetterType =
		undefined !== labelFont && undefined !== labelFont[0] && '' !== labelFont[0].letterType
			? labelFont[0].letterType
			: 'px';
	const previewLabelFontSize = getPreviewSize(
		previewDevice,
		undefined !== labelFont &&
			undefined !== labelFont[0] &&
			undefined !== labelFont[0].size &&
			undefined !== labelFont[0].size[0] &&
			'' !== labelFont[0].size[0]
			? labelFont[0].size[0]
			: '',
		undefined !== labelFont &&
			undefined !== labelFont[0] &&
			undefined !== labelFont[0].size &&
			undefined !== labelFont[0].size[1] &&
			'' !== labelFont[0].size[1]
			? labelFont[0].size[1]
			: '',
		undefined !== labelFont &&
			undefined !== labelFont[0] &&
			undefined !== labelFont[0].size &&
			undefined !== labelFont[0].size[2] &&
			'' !== labelFont[0].size[2]
			? labelFont[0].size[2]
			: ''
	);
	const previewLabelLineSize = getPreviewSize(
		previewDevice,
		undefined !== labelFont &&
			undefined !== labelFont[0] &&
			undefined !== labelFont[0].lineHeight &&
			undefined !== labelFont[0].lineHeight[0] &&
			'' !== labelFont[0].lineHeight[0]
			? labelFont[0].lineHeight[0]
			: '',
		undefined !== labelFont &&
			undefined !== labelFont[0] &&
			undefined !== labelFont[0].lineHeight &&
			undefined !== labelFont[0].lineHeight[1] &&
			'' !== labelFont[0].lineHeight[1]
			? labelFont[0].lineHeight[1]
			: '',
		undefined !== labelFont &&
			undefined !== labelFont[0] &&
			undefined !== labelFont[0].lineHeight &&
			undefined !== labelFont[0].lineHeight[2] &&
			'' !== labelFont[0].lineHeight[2]
			? labelFont[0].lineHeight[2]
			: ''
	);
	const previewLabelLetterSize = getPreviewSize(
		previewDevice,
		undefined !== labelFont &&
			undefined !== labelFont[0] &&
			undefined !== labelFont[0].letterSpacing &&
			undefined !== labelFont[0].letterSpacing[0] &&
			'' !== labelFont[0].letterSpacing[0]
			? labelFont[0].letterSpacing[0]
			: '',
		undefined !== labelFont &&
			undefined !== labelFont[0] &&
			undefined !== labelFont[0].letterSpacing &&
			undefined !== labelFont[0].letterSpacing[1] &&
			'' !== labelFont[0].letterSpacing[1]
			? labelFont[0].letterSpacing[1]
			: '',
		undefined !== labelFont &&
			undefined !== labelFont[0] &&
			undefined !== labelFont[0].letterSpacing &&
			undefined !== labelFont[0].letterSpacing[2] &&
			'' !== labelFont[0].letterSpacing[2]
			? labelFont[0].letterSpacing[2]
			: ''
	);
	const previewPreLabelSizeType =
		undefined !== preLabelFont && undefined !== preLabelFont[0] && '' !== preLabelFont[0].sizeType
			? preLabelFont[0].sizeType
			: 'px';
	const previewPreLabelLineType =
		undefined !== preLabelFont && undefined !== preLabelFont[0] && '' !== preLabelFont[0].lineType
			? preLabelFont[0].lineType
			: 'px';
	const previewPreLabelLetterType =
		undefined !== preLabelFont && undefined !== preLabelFont[0] && '' !== preLabelFont[0].letterType
			? preLabelFont[0].letterType
			: 'px';
	const previewPreLabelFontSize = getPreviewSize(
		previewDevice,
		undefined !== preLabelFont &&
			undefined !== preLabelFont[0] &&
			undefined !== preLabelFont[0].size &&
			undefined !== preLabelFont[0].size[0] &&
			'' !== preLabelFont[0].size[0]
			? preLabelFont[0].size[0]
			: '',
		undefined !== preLabelFont &&
			undefined !== preLabelFont[0] &&
			undefined !== preLabelFont[0].size &&
			undefined !== preLabelFont[0].size[1] &&
			'' !== preLabelFont[0].size[1]
			? preLabelFont[0].size[1]
			: '',
		undefined !== preLabelFont &&
			undefined !== preLabelFont[0] &&
			undefined !== preLabelFont[0].size &&
			undefined !== preLabelFont[0].size[2] &&
			'' !== preLabelFont[0].size[2]
			? preLabelFont[0].size[2]
			: ''
	);
	const previewPreLabelLineSize = getPreviewSize(
		previewDevice,
		undefined !== preLabelFont &&
			undefined !== preLabelFont[0] &&
			undefined !== preLabelFont[0].lineHeight &&
			undefined !== preLabelFont[0].lineHeight[0] &&
			'' !== preLabelFont[0].lineHeight[0]
			? preLabelFont[0].lineHeight[0]
			: '',
		undefined !== preLabelFont &&
			undefined !== preLabelFont[0] &&
			undefined !== preLabelFont[0].lineHeight &&
			undefined !== preLabelFont[0].lineHeight[1] &&
			'' !== preLabelFont[0].lineHeight[1]
			? preLabelFont[0].lineHeight[1]
			: '',
		undefined !== preLabelFont &&
			undefined !== preLabelFont[0] &&
			undefined !== preLabelFont[0].lineHeight &&
			undefined !== preLabelFont[0].lineHeight[2] &&
			'' !== preLabelFont[0].lineHeight[2]
			? preLabelFont[0].lineHeight[2]
			: ''
	);
	const previewPreLabelLetterSize = getPreviewSize(
		previewDevice,
		undefined !== preLabelFont &&
			undefined !== preLabelFont[0] &&
			undefined !== preLabelFont[0].letterSpacing &&
			undefined !== preLabelFont[0].letterSpacing[0] &&
			'' !== preLabelFont[0].letterSpacing[0]
			? preLabelFont[0].letterSpacing[0]
			: '',
		undefined !== preLabelFont &&
			undefined !== preLabelFont[0] &&
			undefined !== preLabelFont[0].letterSpacing &&
			undefined !== preLabelFont[0].letterSpacing[1] &&
			'' !== preLabelFont[0].letterSpacing[1]
			? preLabelFont[0].letterSpacing[1]
			: '',
		undefined !== preLabelFont &&
			undefined !== preLabelFont[0] &&
			undefined !== preLabelFont[0].letterSpacing &&
			undefined !== preLabelFont[0].letterSpacing[2] &&
			'' !== preLabelFont[0].letterSpacing[2]
			? preLabelFont[0].letterSpacing[2]
			: ''
	);
	const previewPostLabelSizeType =
		undefined !== postLabelFont && undefined !== postLabelFont[0] && '' !== postLabelFont[0].sizeType
			? postLabelFont[0].sizeType
			: 'px';
	const previewPostLabelLineType =
		undefined !== postLabelFont && undefined !== postLabelFont[0] && '' !== postLabelFont[0].lineType
			? postLabelFont[0].lineType
			: 'px';
	const previewPostLabelLetterType =
		undefined !== postLabelFont && undefined !== postLabelFont[0] && '' !== postLabelFont[0].letterType
			? postLabelFont[0].letterType
			: 'px';
	const previewPostLabelFontSize = getPreviewSize(
		previewDevice,
		undefined !== postLabelFont &&
			undefined !== postLabelFont[0] &&
			undefined !== postLabelFont[0].size &&
			undefined !== postLabelFont[0].size[0] &&
			'' !== postLabelFont[0].size[0]
			? postLabelFont[0].size[0]
			: '',
		undefined !== postLabelFont &&
			undefined !== postLabelFont[0] &&
			undefined !== postLabelFont[0].size &&
			undefined !== postLabelFont[0].size[1] &&
			'' !== postLabelFont[0].size[1]
			? postLabelFont[0].size[1]
			: '',
		undefined !== postLabelFont &&
			undefined !== postLabelFont[0] &&
			undefined !== postLabelFont[0].size &&
			undefined !== postLabelFont[0].size[2] &&
			'' !== postLabelFont[0].size[2]
			? postLabelFont[0].size[2]
			: ''
	);
	const previewPostLabelLineSize = getPreviewSize(
		previewDevice,
		undefined !== postLabelFont &&
			undefined !== postLabelFont[0] &&
			undefined !== postLabelFont[0].lineHeight &&
			undefined !== postLabelFont[0].lineHeight[0] &&
			'' !== postLabelFont[0].lineHeight[0]
			? postLabelFont[0].lineHeight[0]
			: '',
		undefined !== postLabelFont &&
			undefined !== postLabelFont[0] &&
			undefined !== postLabelFont[0].lineHeight &&
			undefined !== postLabelFont[0].lineHeight[1] &&
			'' !== postLabelFont[0].lineHeight[1]
			? postLabelFont[0].lineHeight[1]
			: '',
		undefined !== postLabelFont &&
			undefined !== postLabelFont[0] &&
			undefined !== postLabelFont[0].lineHeight &&
			undefined !== postLabelFont[0].lineHeight[2] &&
			'' !== postLabelFont[0].lineHeight[2]
			? postLabelFont[0].lineHeight[2]
			: ''
	);
	const previewPostLabelLetterSize = getPreviewSize(
		previewDevice,
		undefined !== postLabelFont &&
			undefined !== postLabelFont[0] &&
			undefined !== postLabelFont[0].letterSpacing &&
			undefined !== postLabelFont[0].letterSpacing[0] &&
			'' !== postLabelFont[0].letterSpacing[0]
			? postLabelFont[0].letterSpacing[0]
			: '',
		undefined !== postLabelFont &&
			undefined !== postLabelFont[0] &&
			undefined !== postLabelFont[0].letterSpacing &&
			undefined !== postLabelFont[0].letterSpacing[1] &&
			'' !== postLabelFont[0].letterSpacing[1]
			? postLabelFont[0].letterSpacing[1]
			: '',
		undefined !== postLabelFont &&
			undefined !== postLabelFont[0] &&
			undefined !== postLabelFont[0].letterSpacing &&
			undefined !== postLabelFont[0].letterSpacing[2] &&
			'' !== postLabelFont[0].letterSpacing[2]
			? postLabelFont[0].letterSpacing[2]
			: ''
	);
	const classes = classnames({
		'kb-countdown-container': true,
		[`kb-countdown-container-${uniqueID}`]: uniqueID,
		[`kb-countdown-timer-layout-${timerLayout}`]: timerLayout && enableTimer,
		'kb-countdown-enable-dividers': 'inline' !== timerLayout && countdownDivider && enableTimer,
		'kb-countdown-has-timer': enableTimer,
		'kb-countdown-preview-expired': previewExpired,
		[`kb-countdown-align-${counterAlign[0]}`]:
			undefined !== counterAlign && undefined !== counterAlign[0] && enableTimer ? counterAlign[0] : false,
		[`kb-countdown-align-tablet-${counterAlign[1]}`]:
			undefined !== counterAlign && undefined !== counterAlign[1] && enableTimer ? counterAlign[1] : false,
		[`kb-countdown-align-mobile-${counterAlign[2]}`]:
			undefined !== counterAlign && undefined !== counterAlign[2] && enableTimer ? counterAlign[2] : false,
		'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
		'kvs-md-false': vstablet !== 'undefined' && vstablet,
		'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
		[className]: className,
	});
	if (isNested && parentBlock) {
		if (
			undefined !== parentBlock.attributes.countdownType &&
			parentBlock.attributes.countdownType !== countdownType
		) {
			setAttributes({ countdownType: parentBlock.attributes.countdownType });
		}
		if (
			undefined !== parentBlock.attributes.evergreenMinutes &&
			parentBlock.attributes.evergreenMinutes !== evergreenMinutes
		) {
			setAttributes({ evergreenMinutes: parentBlock.attributes.evergreenMinutes });
		}
		if (undefined !== parentBlock.attributes.timeOffset && parentBlock.attributes.timeOffset !== timeOffset) {
			setAttributes({ timeOffset: parentBlock.attributes.timeOffset });
		}
		if (undefined !== parentBlock.attributes.timezone && parentBlock.attributes.timezone !== timezone) {
			setAttributes({ timezone: parentBlock.attributes.timezone });
		}
		if (undefined !== parentBlock.attributes.timestamp && parentBlock.attributes.timestamp !== timestamp) {
			setAttributes({ timestamp: parentBlock.attributes.timestamp });
		}
		if (
			undefined !== parentBlock.attributes.evergreenHours &&
			parentBlock.attributes.evergreenHours !== evergreenHours
		) {
			setAttributes({ evergreenHours: parentBlock.attributes.evergreenHours });
		}
		if (undefined !== parentBlock.attributes.date && parentBlock.attributes.date !== date) {
			setAttributes({ date: parentBlock.attributes.date });
		}
		if (undefined !== parentBlock.attributes.campaignID && parentBlock.attributes.campaignID !== campaignID) {
			setAttributes({ campaignID: parentBlock.attributes.campaignID });
		}
		if (
			undefined !== parentBlock.attributes.evergreenReset &&
			parentBlock.attributes.evergreenReset !== evergreenReset
		) {
			setAttributes({ evergreenReset: parentBlock.attributes.evergreenReset });
		}
		if (
			undefined !== parentBlock.attributes.evergreenStrict &&
			parentBlock.attributes.evergreenStrict !== evergreenStrict
		) {
			setAttributes({ evergreenStrict: parentBlock.attributes.evergreenStrict });
		}
	}

	const nonTransAttrs = ['date', 'timestamp'];

	const blockProps = useBlockProps({
		className: classes,
	});

	return (
		<div
			{...blockProps}
			style={{
				background: background ? KadenceColorOutput(background) : undefined,
				borderColor: border ? KadenceColorOutput(border) : undefined,
				borderTopWidth: previewBorderTop ? previewBorderTop + 'px' : undefined,
				borderRightWidth: previewBorderRight ? previewBorderRight + 'px' : undefined,
				borderBottomWidth: previewBorderBottom ? previewBorderBottom + 'px' : undefined,
				borderLeftWidth: previewBorderLeft ? previewBorderLeft + 'px' : undefined,
				borderTopLeftRadius: borderRadius && borderRadius[0] ? borderRadius[0] + 'px' : undefined,
				borderTopRightRadius: borderRadius && borderRadius[1] ? borderRadius[1] + 'px' : undefined,
				borderBottomRightRadius: borderRadius && borderRadius[2] ? borderRadius[2] + 'px' : undefined,
				borderBottomLeftRadius: borderRadius && borderRadius[3] ? borderRadius[3] + 'px' : undefined,
				paddingTop:
					'' !== previewPaddingTop
						? getSpacingOptionOutput(previewPaddingTop, previewPaddingType)
						: undefined,
				paddingRight:
					'' !== previewPaddingRight
						? getSpacingOptionOutput(previewPaddingRight, previewPaddingType)
						: undefined,
				paddingBottom:
					'' !== previewPaddingBottom
						? getSpacingOptionOutput(previewPaddingBottom, previewPaddingType)
						: undefined,
				paddingLeft:
					'' !== previewPaddingLeft
						? getSpacingOptionOutput(previewPaddingLeft, previewPaddingType)
						: undefined,
				marginTop: previewMarginTop ? getSpacingOptionOutput(previewMarginTop, previewMarginType) : undefined,
				marginRight: previewMarginRight
					? getSpacingOptionOutput(previewMarginRight, previewMarginType)
					: undefined,
				marginBottom: previewMarginBottom
					? getSpacingOptionOutput(previewMarginBottom, previewMarginType)
					: undefined,
				marginLeft: previewMarginLeft
					? getSpacingOptionOutput(previewMarginLeft, previewMarginType)
					: undefined,
			}}
		>
			<style>
				{`.kb-countdown-container #kb-timer-${uniqueID} .kb-countdown-date-item .kb-countdown-number {`}
				{numberColor ? `color: ${KadenceColorOutput(numberColor)};` : ''}
				{numberFont && numberFont[0] && numberFont[0].family ? `font-family: ${numberFont[0].family};` : ''}
				{numberFont && numberFont[0] && numberFont[0].textTransform
					? `text-transform: ${numberFont[0].textTransform};`
					: ''}
				{numberFont && numberFont[0] && numberFont[0].weight ? `font-weight: ${numberFont[0].weight};` : ''}
				{numberFont && numberFont[0] && numberFont[0].style ? `font-style: ${numberFont[0].style};` : ''}
				{previewNumberFontSize
					? `font-size: ${getFontSizeOptionOutput(previewNumberFontSize, previewNumberSizeType)};`
					: ''}
				{previewNumberLineSize ? `line-height: ${previewNumberLineSize + previewNumberLineType};` : ''}
				{previewNumberLetterSize ? `letter-spacing: ${previewNumberLetterSize + previewNumberLetterType};` : ''}
				{'}'}
				{`.kb-countdown-container #kb-timer-${uniqueID} .kb-countdown-date-item  {`}
				{previewNumberFontSize
					? `font-size: ${getFontSizeOptionOutput(previewNumberFontSize, previewNumberSizeType)};`
					: ''}
				{'}'}
				{`#kb-timer-${uniqueID} .kb-countdown-date-item .kb-countdown-label {`}
				{labelColor ? `color: ${KadenceColorOutput(labelColor)};` : ''}
				{labelFont && labelFont[0] && labelFont[0].family ? `font-family: ${labelFont[0].family};` : ''}
				{labelFont && labelFont[0] && labelFont[0].textTransform
					? `text-transform: ${labelFont[0].textTransform};`
					: ''}
				{labelFont && labelFont[0] && labelFont[0].weight ? `font-weight: ${labelFont[0].weight};` : ''}
				{labelFont && labelFont[0] && labelFont[0].style ? `font-style: ${labelFont[0].style};` : ''}
				{previewLabelFontSize
					? `font-size: ${getFontSizeOptionOutput(previewLabelFontSize, previewLabelSizeType)};`
					: ''}
				{previewLabelLineSize ? `line-height: ${previewLabelLineSize + previewLabelLineType};` : ''}
				{previewLabelLetterSize ? `letter-spacing: ${previewLabelLetterSize + previewLabelLetterType};` : ''}
				{'}'}
				{'' !== preLabel && (
					<>
						{`#kb-timer-${uniqueID} .kb-countdown-item.kb-pre-timer {`}
						{preLabelColor ? `color: ${KadenceColorOutput(preLabelColor)};` : ''}
						{preLabelFont && preLabelFont[0] && preLabelFont[0].family
							? `font-family: ${preLabelFont[0].family};`
							: ''}
						{preLabelFont && preLabelFont[0] && preLabelFont[0].textTransform
							? `text-transform: ${preLabelFont[0].textTransform};`
							: ''}
						{preLabelFont && preLabelFont[0] && preLabelFont[0].weight
							? `font-weight: ${preLabelFont[0].weight};`
							: ''}
						{preLabelFont && preLabelFont[0] && preLabelFont[0].style
							? `font-style: ${preLabelFont[0].style};`
							: ''}
						{previewPreLabelFontSize
							? `font-size: ${getFontSizeOptionOutput(previewPreLabelFontSize, previewPreLabelSizeType)};`
							: ''}
						{previewPreLabelLineSize
							? `line-height: ${previewPreLabelLineSize + previewPreLabelLineType};`
							: ''}
						{previewPreLabelLetterSize
							? `letter-spacing: ${previewPreLabelLetterSize + previewPreLabelLetterType};`
							: ''}
						{'}'}
					</>
				)}
				{'' !== postLabel && (
					<>
						{`#kb-timer-${uniqueID} .kb-countdown-item.kb-post-timer {`}
						{postLabelColor ? `color: ${KadenceColorOutput(postLabelColor)};` : ''}
						{postLabelFont && postLabelFont[0] && postLabelFont[0].family
							? `font-family: ${postLabelFont[0].family};`
							: ''}
						{postLabelFont && postLabelFont[0] && postLabelFont[0].textTransform
							? `text-transform: ${postLabelFont[0].textTransform};`
							: ''}
						{postLabelFont && postLabelFont[0] && postLabelFont[0].weight
							? `font-weight: ${postLabelFont[0].weight};`
							: ''}
						{postLabelFont && postLabelFont[0] && postLabelFont[0].style
							? `font-style: ${postLabelFont[0].style};`
							: ''}
						{previewPostLabelFontSize
							? `font-size: ${getFontSizeOptionOutput(
									previewPostLabelFontSize,
									previewPostLabelSizeType
								)};`
							: ''}
						{previewPostLabelLineSize
							? `line-height: ${previewPostLabelLineSize + previewPostLabelLineType};`
							: ''}
						{previewPostLabelLetterSize
							? `letter-spacing: ${previewPostLabelLetterSize + previewPostLabelLetterType};`
							: ''}
						{'}'}
					</>
				)}
				{`.kb-countdown-container #kb-timer-${uniqueID} .kb-countdown-date-item:not( .kb-countdown-divider-item ) {`}
				{itemBackground ? `background: ${KadenceColorOutput(itemBackground)};` : ''}
				{itemBorder ? `border-color: ${KadenceColorOutput(itemBorder)};` : ''}
				{itemBorderRadius && itemBorderRadius[0]
					? `border-top-left-radius: ${itemBorderRadius[0] + 'px'};`
					: ''}
				{itemBorderRadius && itemBorderRadius[1]
					? `border-top-right-radius: ${itemBorderRadius[1] + 'px'};`
					: ''}
				{itemBorderRadius && itemBorderRadius[2]
					? `border-bottom-right-radius: ${itemBorderRadius[2] + 'px'};`
					: ''}
				{itemBorderRadius && itemBorderRadius[3]
					? `border-bottom-left-radius: ${itemBorderRadius[3] + 'px'};`
					: ''}
				{previewItemBorderTop ? `border-top-width: ${previewItemBorderTop + 'px'};` : ''}
				{previewItemBorderRight ? `border-right-width: ${previewItemBorderRight + 'px'};` : ''}
				{previewItemBorderBottom ? `border-bottom-width: ${previewItemBorderBottom + 'px'};` : ''}
				{previewItemBorderLeft ? `border-left-width: ${previewItemBorderLeft + 'px'};` : ''}
				{previewItemPaddingTop ? `padding-top: ${previewItemPaddingTop + previewItemPaddingType};` : ''}
				{previewItemPaddingRight ? `padding-right: ${previewItemPaddingRight + previewItemPaddingType};` : ''}
				{previewItemPaddingBottom
					? `padding-bottom: ${previewItemPaddingBottom + previewItemPaddingType};`
					: ''}
				{previewItemPaddingLeft ? `padding-left: ${previewItemPaddingLeft + previewItemPaddingType};` : ''}
				{'}'}
				{`.kb-countdown-container #kb-timer-${uniqueID} .kb-countdown-date-item.kb-countdown-divider-item {`}
				{previewItemBorderTop ? `border-top-width: ${previewItemBorderTop + 'px'};` : ''}
				{previewItemBorderBottom ? `border-bottom-width: ${previewItemBorderBottom + 'px'};` : ''}
				{previewItemPaddingTop ? `padding-top: ${previewItemPaddingTop + previewItemPaddingType};` : ''}
				{previewItemPaddingBottom
					? `padding-bottom: ${previewItemPaddingBottom + previewItemPaddingType};`
					: ''}
				{'}'}
			</style>

			{showSettings('allSettings', 'kadence/countdown') && (
				<>
					<BlockControls>
						{enableTimer && (
							<AlignmentToolbar
								value={
									undefined !== counterAlign && undefined !== counterAlign[0] ? counterAlign[0] : ''
								}
								onChange={(nextAlign) =>
									setAttributes({
										counterAlign: [
											nextAlign,
											undefined !== counterAlign && undefined !== counterAlign[1]
												? counterAlign[1]
												: '',
											undefined !== counterAlign && undefined !== counterAlign[2]
												? counterAlign[2]
												: '',
										],
									})
								}
							/>
						)}
						{'message' === expireAction && (
							<>
								<ToolbarGroup>
									<Button
										className="components-tab-button"
										isPressed={!previewExpired}
										onClick={() => setPreviewExpired(false)}
									>
										<span>{__('Live', 'kadence-blocks')}</span>
									</Button>
									<Button
										className="components-tab-button"
										isPressed={previewExpired}
										onClick={() => setPreviewExpired(true)}
									>
										<span>{__('Expired', 'kadence-blocks')}</span>
									</Button>
								</ToolbarGroup>
							</>
						)}
						<CopyPasteAttributes
							attributes={attributes}
							excludedAttrs={nonTransAttrs}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
							onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
						/>
					</BlockControls>
					<InspectorControls>
						<InspectorControlTabs
							panelName={'countdown'}
							setActiveTab={(value) => setActiveTab(value)}
							activeTab={activeTab}
						/>

						{activeTab === 'general' && (
							<>
								<Panel className={'components-panel__body is-opened'}>
									{1 === isNested && (
										<>
											<h2>
												{__('Countdown Time Settings Synced to Parent Block', 'kadence-blocks')}
											</h2>
											<Button
												className="kb-select-parent-button"
												isSecondary
												onClick={() => selectBlock(parentBlock.clientId)}
											>
												<span>{__('Edit Settings', 'kadence-blocks')}</span>
											</Button>
										</>
									)}
									{!isNested && (
										<>
											<SelectControl
												label={__('Countdown Type', 'kadence-blocks')}
												options={countdownTypes}
												value={countdownType}
												onChange={(value) => setAttributes({ countdownType: value })}
											/>
											{'date' === countdownType && (
												<div className="components-base-control kb-datepicker-fix">
													<DateTimePicker
														currentDate={!date ? undefined : date}
														onChange={(value) => {
															saveDate(value);
														}}
														is12Hour={is12HourTime}
														help={__(
															'Date set according to your sites timezone',
															'kadence-blocks'
														)}
													/>
												</div>
											)}
											{'evergreen' === countdownType && (
												<>
													<RangeControl
														label={__('Evergreen Hours', 'kadence-blocks')}
														value={evergreenHours}
														onChange={(value) => {
															saveEvergreenHours(value);
														}}
														min={0}
														max={100}
														step={1}
													/>
													<RangeControl
														label={__('Evergreen Minutes', 'kadence-blocks')}
														value={evergreenMinutes}
														onChange={(value) => {
															saveEvergreenMinutes(value);
														}}
														min={0}
														max={59}
														step={1}
													/>
													<TextControl
														label={__('Campaign ID', 'kadence-blocks')}
														help={__(
															'Create a unique ID. To reset the timer for everyone change this id. To link with other timers give them all the same ID.',
															'kadence-blocks'
														)}
														value={campaignID || ''}
														onChange={(nextValue) => {
															nextValue = nextValue.replace(ANCHOR_REGEX, '-');
															setAttributes({
																campaignID: nextValue,
															});
														}}
													/>
													<RangeControl
														label={__(
															'Amount of days to wait until the evergreen is reset for visitors',
															'kadence-blocks'
														)}
														value={evergreenReset}
														onChange={(value) => {
															setAttributes({
																evergreenReset: value,
															});
														}}
														min={0}
														max={100}
														step={1}
													/>
													<ToggleControl
														label={__('Verify by IP Address', 'kadence-blocks')}
														checked={evergreenStrict}
														onChange={(value) => setAttributes({ evergreenStrict: value })}
														help={__(
															'This will add a delay to the rendering of the countdown if no cookie found as it will query the server database to see if the user can be found by their IP address',
															'kadence-blocks'
														)}
													/>
												</>
											)}

											<SelectControl
												label={__('Action on Expire', 'kadence-blocks')}
												options={countdownActions}
												value={expireAction}
												onChange={(value) => setAttributes({ expireAction: value })}
											/>
											<ToggleControl
												label={__('Enable Pause Button', 'kadence-blocks')}
												checked={enablePauseButton || false}
												onChange={(value) => setAttributes({ enablePauseButton: value })}
												help={__(
													'Add a pause button to allow users to pause and resume the countdown timer.',
													'kadence-blocks'
												)}
											/>
											{enablePauseButton && (
												<SelectControl
													label={__('Pause Button Position', 'kadence-blocks')}
													value={pauseButtonPosition || 'top-right'}
													options={[
														{ value: 'top-left', label: __('Top Left', 'kadence-blocks') },
														{
															value: 'top-right',
															label: __('Top Right', 'kadence-blocks'),
														},
														{
															value: 'bottom-left',
															label: __('Bottom Left', 'kadence-blocks'),
														},
														{
															value: 'bottom-right',
															label: __('Bottom Right', 'kadence-blocks'),
														},
													]}
													onChange={(value) => setAttributes({ pauseButtonPosition: value })}
												/>
											)}
											{'redirect' === expireAction && (
												<>
													<URLInputControl
														label={__('Redirect URL', 'kadence-blocks')}
														url={redirectURL}
														onChangeUrl={(value) => setAttributes({ redirectURL: value })}
														additionalControls={false}
													/>
												</>
											)}
											{expireAction && 'none' !== expireAction && (
												<ToggleControl
													label={__('Reveal onLoad', 'kadence-blocks')}
													checked={revealOnLoad}
													onChange={(value) => setAttributes({ revealOnLoad: value })}
												/>
											)}
										</>
									)}
								</Panel>
								{kadence_blocks_params.pro === 'true' && 'evergreen' !== countdownType && (
									<KadencePanelBody
										title={__('Countdown Auto Repeater', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-countdown-repeater'}
									>
										<ToggleControl
											label={__('Repeat Countdown', 'kadence-blocks')}
											checked={repeat}
											onChange={(value) => setAttributes({ repeat: value })}
											help={__(
												'After the coutdown reaches zero, repeat instead of expiring.',
												'kadence-blocks'
											)}
										/>
										{repeat && (
											<>
												<SelectControl
													label={__('Frequency', 'kadence-blocks')}
													options={frequencyOptions}
													value={frequency}
													onChange={(value) => setAttributes({ frequency: value })}
												/>

												<ToggleControl
													label={__('Repeat Until', 'kadence-blocks')}
													checked={stopRepeating}
													onChange={(value) => setAttributes({ stopRepeating: value })}
													help={__(
														'The countdown will stop repeating and expire after the given date.',
														'kadence-blocks'
													)}
												/>

												{stopRepeating && (
													<div className="components-base-control kb-datepicker-fix">
														<DateTimePicker
															currentDate={!endDate ? undefined : endDate}
															onChange={(value) => setAttributes({ endDate: value })}
															is12Hour={is12HourTime}
														/>
													</div>
												)}
											</>
										)}
									</KadencePanelBody>
								)}

								<KadencePanelBody
									title={__('Countdown Layout', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-countdown-layout'}
								>
									{expireAction && 'none' !== expireAction && (
										<ToggleControl
											label={__('Display Countdown', 'kadence-blocks')}
											checked={enableTimer}
											onChange={(value) => setAttributes({ enableTimer: value })}
										/>
									)}
									{enableTimer && (
										<>
											<ResponsiveAlignControls
												label={__('Countdown Alignment', 'kadence-blocks')}
												value={
													undefined !== counterAlign && undefined !== counterAlign[0]
														? counterAlign[0]
														: ''
												}
												tabletValue={
													undefined !== counterAlign && undefined !== counterAlign[1]
														? counterAlign[1]
														: ''
												}
												mobileValue={
													undefined !== counterAlign && undefined !== counterAlign[2]
														? counterAlign[2]
														: ''
												}
												onChange={(nextAlign) =>
													setAttributes({
														counterAlign: [
															nextAlign,
															undefined !== counterAlign && undefined !== counterAlign[1]
																? counterAlign[1]
																: '',
															undefined !== counterAlign && undefined !== counterAlign[2]
																? counterAlign[2]
																: '',
														],
													})
												}
												onChangeTablet={(nextAlign) =>
													setAttributes({
														counterAlign: [
															undefined !== counterAlign && undefined !== counterAlign[0]
																? counterAlign[0]
																: '',
															nextAlign,
															undefined !== counterAlign && undefined !== counterAlign[2]
																? counterAlign[2]
																: '',
														],
													})
												}
												onChangeMobile={(nextAlign) =>
													setAttributes({
														counterAlign: [
															undefined !== counterAlign && undefined !== counterAlign[0]
																? counterAlign[0]
																: '',
															undefined !== counterAlign && undefined !== counterAlign[1]
																? counterAlign[1]
																: '',
															nextAlign,
														],
													})
												}
											/>
											<KadenceRadioButtons
												label={__('Countdown Layout', 'kadence-blocks')}
												value={timerLayout}
												options={[
													{ value: 'block', label: __('Block', 'kadence-blocks') },
													{ value: 'inline', label: __('Inline', 'kadence-blocks') },
												]}
												onChange={(value) => setAttributes({ timerLayout: value })}
											/>
											{'inline' !== timerLayout && (
												<ToggleControl
													label={__('Enable Divider', 'kadence-blocks')}
													checked={countdownDivider}
													onChange={(value) => setAttributes({ countdownDivider: value })}
												/>
											)}
											<ToggleControl
												label={__('Enable 00 Number format', 'kadence-blocks')}
												checked={timeNumbers}
												onChange={(value) => setAttributes({ timeNumbers: value })}
											/>
											<TextControl
												label={__('Countdown Pre Text', 'kadence-blocks')}
												value={preLabel}
												onChange={(value) => setAttributes({ preLabel: value })}
											/>
											<TextControl
												label={__('Countdown Post Text', 'kadence-blocks')}
												value={postLabel}
												onChange={(value) => setAttributes({ postLabel: value })}
											/>
											<ToggleControl
												label={__('Display Days Unit', 'kadence-blocks')}
												checked={
													undefined !== units &&
													undefined !== units[0] &&
													undefined !== units[0].days
														? units[0].days
														: true
												}
												onChange={(value) => saveUnits({ days: value })}
											/>
											{undefined !== units &&
												undefined !== units[0] &&
												undefined !== units[0].days &&
												!units[0].days && (
													<>
														<ToggleControl
															label={__('Hours', 'kadence-blocks')}
															checked={
																undefined !== units &&
																undefined !== units[0] &&
																undefined !== units[0].hours
																	? units[0].hours
																	: true
															}
															onChange={(value) => saveUnits({ hours: value })}
														/>
														{undefined !== units &&
															undefined !== units[0] &&
															undefined !== units[0].hours &&
															!units[0].hours && (
																<>
																	<ToggleControl
																		label={__('Minutes', 'kadence-blocks')}
																		checked={
																			undefined !== units &&
																			undefined !== units[0] &&
																			undefined !== units[0].minutes
																				? units[0].minutes
																				: true
																		}
																		onChange={(value) =>
																			saveUnits({ minutes: value })
																		}
																	/>
																</>
															)}
													</>
												)}
											<h2>{__('Labels', 'kadence-blocks')}</h2>
											<TextControl
												label={__('Days Label', 'kadence-blocks')}
												value={daysLabel}
												onChange={(value) => setAttributes({ daysLabel: value })}
											/>
											<TextControl
												label={__('Hours Label', 'kadence-blocks')}
												value={hoursLabel}
												onChange={(value) => setAttributes({ hoursLabel: value })}
											/>
											<TextControl
												label={__('Minutes Label', 'kadence-blocks')}
												value={minutesLabel}
												onChange={(value) => setAttributes({ minutesLabel: value })}
											/>
											<TextControl
												label={__('Seconds Label', 'kadence-blocks')}
												value={secondsLabel}
												onChange={(value) => setAttributes({ secondsLabel: value })}
											/>
										</>
									)}
								</KadencePanelBody>
							</>
						)}

						{activeTab === 'style' && (
							<>
								{enableTimer && (
									<KadencePanelBody
										title={__('Count Item Settings', 'kadence-blocks')}
										panelName={'itemStyle'}
										blockSlug={'kadence/countdown'}
									>
										<PopColorControl
											label={__('Background Color', 'kadence-blocks')}
											value={itemBackground ? itemBackground : ''}
											default={''}
											onChange={(value) => setAttributes({ itemBackground: value })}
										/>
										<PopColorControl
											label={__('Border Color', 'kadence-blocks')}
											value={itemBorder ? itemBorder : ''}
											default={''}
											onChange={(value) => setAttributes({ itemBorder: value })}
										/>
										<ResponsiveMeasurementControls
											label={__('Border Width', 'kadence-blocks')}
											value={itemBorderWidth}
											control={itemBorderWidthControl}
											tabletValue={itemTabletBorderWidth}
											mobileValue={itemMobileBorderWidth}
											onChange={(value) => setAttributes({ itemBorderWidth: value })}
											onChangeTablet={(value) => setAttributes({ itemTabletBorderWidth: value })}
											onChangeMobile={(value) => setAttributes({ itemMobileBorderWidth: value })}
											onChangeControl={(value) => setItemBorderWidthControl(value)}
											min={0}
											max={40}
											step={1}
											unit={'px'}
											units={['px']}
											showUnit={true}
											preset={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
										/>
										<MeasurementControls
											label={__('Border Radius', 'kadence-blocks')}
											measurement={itemBorderRadius}
											control={itemBorderRadiusControl}
											onChange={(value) => setAttributes({ itemBorderRadius: value })}
											onControl={(value) => setItemBorderRadiusControl(value)}
											min={0}
											max={200}
											step={1}
											controlTypes={[
												{
													key: 'linked',
													name: __('Linked', 'kadence-blocks'),
													icon: radiusLinkedIcon,
												},
												{
													key: 'individual',
													name: __('Individual', 'kadence-blocks'),
													icon: radiusIndividualIcon,
												},
											]}
											firstIcon={topLeftIcon}
											secondIcon={topRightIcon}
											thirdIcon={bottomRightIcon}
											fourthIcon={bottomLeftIcon}
										/>
										<ResponsiveMeasurementControls
											label={__('Padding', 'kadence-blocks')}
											value={itemPadding}
											control={itemPaddingControl}
											tabletValue={itemTabletPadding}
											mobileValue={itemMobilePadding}
											onChange={(value) => setAttributes({ itemPadding: value })}
											onChangeTablet={(value) => setAttributes({ itemTabletPadding: value })}
											onChangeMobile={(value) => setAttributes({ itemMobilePadding: value })}
											onChangeControl={(value) => setItemPaddingControl(value)}
											min={itemPaddingMin}
											max={itemPaddingMax}
											step={itemPaddingStep}
											unit={itemPaddingType}
											units={['px', 'em', 'rem', '%']}
											onUnit={(value) => setAttributes({ itemPaddingType: value })}
										/>
									</KadencePanelBody>
								)}
								{enableTimer && (
									<KadencePanelBody
										title={__('Number Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'numberStyle'}
										blockSlug={'kadence/countdown'}
									>
										<PopColorControl
											label={__('Color', 'kadence-blocks')}
											value={numberColor ? numberColor : ''}
											default={''}
											onChange={(value) => setAttributes({ numberColor: value })}
										/>
										<TypographyControls
											fontGroup={'body'}
											fontSize={numberFont[0].size}
											onFontSize={(value) => saveNumberFont({ size: value })}
											fontSizeType={numberFont[0].sizeType}
											onFontSizeType={(value) => saveNumberFont({ sizeType: value })}
											lineHeight={numberFont[0].lineHeight}
											onLineHeight={(value) => saveNumberFont({ lineHeight: value })}
											lineHeightType={numberFont[0].lineType}
											onLineHeightType={(value) => saveNumberFont({ lineType: value })}
											reLetterSpacing={numberFont[0].letterSpacing}
											onLetterSpacing={(value) => saveNumberFont({ letterSpacing: value })}
											letterSpacingType={numberFont[0].letterType}
											onLetterSpacingType={(value) => saveNumberFont({ letterType: value })}
											textTransform={numberFont[0].textTransform}
											onTextTransform={(value) => saveNumberFont({ textTransform: value })}
											fontFamily={numberFont[0].family}
											onFontFamily={(value) => saveNumberFont({ family: value })}
											onFontChange={(select) => {
												saveNumberFont({
													family: select.value,
													google: select.google,
												});
											}}
											onFontArrayChange={(values) => saveNumberFont(values)}
											googleFont={numberFont[0].google}
											onGoogleFont={(value) => saveNumberFont({ google: value })}
											loadGoogleFont={numberFont[0].loadGoogle}
											onLoadGoogleFont={(value) => saveNumberFont({ loadGoogle: value })}
											fontVariant={numberFont[0].variant}
											onFontVariant={(value) => saveNumberFont({ variant: value })}
											fontWeight={numberFont[0].weight}
											onFontWeight={(value) => saveNumberFont({ weight: value })}
											fontStyle={numberFont[0].style}
											onFontStyle={(value) => saveNumberFont({ style: value })}
											fontSubset={numberFont[0].subset}
											onFontSubset={(value) => saveNumberFont({ subset: value })}
										/>
									</KadencePanelBody>
								)}
								{enableTimer && (
									<KadencePanelBody
										title={__('Label Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'labelStyle'}
										blockSlug={'kadence/countdown'}
									>
										<PopColorControl
											label={__('Color', 'kadence-blocks')}
											value={labelColor ? labelColor : ''}
											default={''}
											onChange={(value) => setAttributes({ labelColor: value })}
										/>
										<TypographyControls
											fontGroup={'body'}
											fontSize={labelFont[0].size}
											onFontSize={(value) => saveLabelFont({ size: value })}
											fontSizeType={labelFont[0].sizeType}
											onFontSizeType={(value) => saveLabelFont({ sizeType: value })}
											lineHeight={labelFont[0].lineHeight}
											onLineHeight={(value) => saveLabelFont({ lineHeight: value })}
											lineHeightType={labelFont[0].lineType}
											onLineHeightType={(value) => saveLabelFont({ lineType: value })}
											reLetterSpacing={labelFont[0].letterSpacing}
											onLetterSpacing={(value) => saveLabelFont({ letterSpacing: value })}
											letterSpacingType={labelFont[0].letterType}
											onLetterSpacingType={(value) => saveLabelFont({ letterType: value })}
											textTransform={labelFont[0].textTransform}
											onTextTransform={(value) => saveLabelFont({ textTransform: value })}
											fontFamily={labelFont[0].family}
											onFontFamily={(value) => saveLabelFont({ family: value })}
											onFontChange={(select) => {
												saveLabelFont({
													family: select.value,
													google: select.google,
												});
											}}
											onFontArrayChange={(values) => saveLabelFont(values)}
											googleFont={labelFont[0].google}
											onGoogleFont={(value) => saveLabelFont({ google: value })}
											loadGoogleFont={labelFont[0].loadGoogle}
											onLoadGoogleFont={(value) => saveLabelFont({ loadGoogle: value })}
											fontVariant={labelFont[0].variant}
											onFontVariant={(value) => saveLabelFont({ variant: value })}
											fontWeight={labelFont[0].weight}
											onFontWeight={(value) => saveLabelFont({ weight: value })}
											fontStyle={labelFont[0].style}
											onFontStyle={(value) => saveLabelFont({ style: value })}
											fontSubset={labelFont[0].subset}
											onFontSubset={(value) => saveLabelFont({ subset: value })}
										/>
									</KadencePanelBody>
								)}
								{enableTimer && '' !== preLabel && (
									<KadencePanelBody
										title={__('Pre Text', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-countdown-pre-text'}
									>
										<PopColorControl
											label={__('Color', 'kadence-blocks')}
											value={preLabelColor ? preLabelColor : ''}
											default={''}
											onChange={(value) => setAttributes({ preLabelColor: value })}
										/>
										<TypographyControls
											fontGroup={'body'}
											fontSize={preLabelFont[0].size}
											onFontSize={(value) => savePreFont({ size: value })}
											fontSizeType={preLabelFont[0].sizeType}
											onFontSizeType={(value) => savePreFont({ sizeType: value })}
											lineHeight={preLabelFont[0].lineHeight}
											onLineHeight={(value) => savePreFont({ lineHeight: value })}
											lineHeightType={preLabelFont[0].lineType}
											onLineHeightType={(value) => savePreFont({ lineType: value })}
											reLetterSpacing={preLabelFont[0].letterSpacing}
											onLetterSpacing={(value) => savePreFont({ letterSpacing: value })}
											letterSpacingType={preLabelFont[0].letterType}
											onLetterSpacingType={(value) => savePreFont({ letterType: value })}
											textTransform={preLabelFont[0].textTransform}
											onTextTransform={(value) => savePreFont({ textTransform: value })}
											fontFamily={preLabelFont[0].family}
											onFontFamily={(value) => savePreFont({ family: value })}
											onFontChange={(select) => {
												savePreFont({
													family: select.value,
													google: select.google,
												});
											}}
											onFontArrayChange={(values) => savePreFont(values)}
											googleFont={preLabelFont[0].google}
											onGoogleFont={(value) => savePreFont({ google: value })}
											loadGoogleFont={preLabelFont[0].loadGoogle}
											onLoadGoogleFont={(value) => savePreFont({ loadGoogle: value })}
											fontVariant={preLabelFont[0].variant}
											onFontVariant={(value) => savePreFont({ variant: value })}
											fontWeight={preLabelFont[0].weight}
											onFontWeight={(value) => savePreFont({ weight: value })}
											fontStyle={preLabelFont[0].style}
											onFontStyle={(value) => savePreFont({ style: value })}
											fontSubset={preLabelFont[0].subset}
											onFontSubset={(value) => savePreFont({ subset: value })}
										/>
									</KadencePanelBody>
								)}
								{enableTimer && '' !== postLabel && (
									<KadencePanelBody
										title={__('Post Text', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-countdown-post-text'}
									>
										<PopColorControl
											label={__('Color', 'kadence-blocks')}
											value={postLabelColor ? postLabelColor : ''}
											default={''}
											onChange={(value) => setAttributes({ postLabelColor: value })}
										/>
										<TypographyControls
											fontGroup={'body'}
											fontSize={postLabelFont[0].size}
											onFontSize={(value) => savePostFont({ size: value })}
											fontSizeType={postLabelFont[0].sizeType}
											onFontSizeType={(value) => savePostFont({ sizeType: value })}
											lineHeight={postLabelFont[0].lineHeight}
											onLineHeight={(value) => savePostFont({ lineHeight: value })}
											lineHeightType={postLabelFont[0].lineType}
											onLineHeightType={(value) => savePostFont({ lineType: value })}
											reLetterSpacing={postLabelFont[0].letterSpacing}
											onLetterSpacing={(value) => savePostFont({ letterSpacing: value })}
											letterSpacingType={postLabelFont[0].letterType}
											onLetterSpacingType={(value) => savePostFont({ letterType: value })}
											textTransform={postLabelFont[0].textTransform}
											onTextTransform={(value) => savePostFont({ textTransform: value })}
											fontFamily={postLabelFont[0].family}
											onFontFamily={(value) => savePostFont({ family: value })}
											onFontChange={(select) => {
												savePostFont({
													family: select.value,
													google: select.google,
												});
											}}
											onFontArrayChange={(values) => savePostFont(values)}
											googleFont={postLabelFont[0].google}
											onGoogleFont={(value) => savePostFont({ google: value })}
											loadGoogleFont={postLabelFont[0].loadGoogle}
											onLoadGoogleFont={(value) => savePostFont({ loadGoogle: value })}
											fontVariant={postLabelFont[0].variant}
											onFontVariant={(value) => savePostFont({ variant: value })}
											fontWeight={postLabelFont[0].weight}
											onFontWeight={(value) => savePostFont({ weight: value })}
											fontStyle={postLabelFont[0].style}
											onFontStyle={(value) => savePostFont({ style: value })}
											fontSubset={postLabelFont[0].subset}
											onFontSubset={(value) => savePostFont({ subset: value })}
										/>
									</KadencePanelBody>
								)}
							</>
						)}

						{activeTab === 'advanced' && (
							<>
								<KadencePanelBody panelName={'kb-countdown-spacing-settings'}>
									<ResponsiveMeasureRangeControl
										label={__('Padding', 'kadence-blocks')}
										value={containerPadding}
										tabletValue={containerTabletPadding}
										mobileValue={containerMobilePadding}
										onChange={(value) => setAttributes({ containerPadding: value })}
										onChangeTablet={(value) => setAttributes({ containerTabletPadding: value })}
										onChangeMobile={(value) => setAttributes({ containerMobilePadding: value })}
										min={paddingMin}
										max={paddingMax}
										step={paddingStep}
										unit={paddingType}
										units={['px', 'em', 'rem', '%']}
										onUnit={(value) => setAttributes({ paddingType: value })}
										onMouseOver={paddingMouseOver.onMouseOver}
										onMouseOut={paddingMouseOver.onMouseOut}
									/>
									<ResponsiveMeasureRangeControl
										label={__('Margin', 'kadence-blocks')}
										value={containerMargin}
										tabletValue={containerTabletMargin}
										mobileValue={containerMobileMargin}
										onChange={(value) => setAttributes({ containerMargin: value })}
										onChangeTablet={(value) => setAttributes({ containerTabletMargin: value })}
										onChangeMobile={(value) => setAttributes({ containerMobileMargin: value })}
										min={marginMin}
										max={marginMax}
										step={marginStep}
										unit={marginType}
										units={['px', 'em', 'rem', '%', 'vh']}
										onUnit={(value) => setAttributes({ marginType: value })}
										onMouseOver={marginMouseOver.onMouseOver}
										onMouseOut={marginMouseOver.onMouseOut}
										allowAuto={true}
									/>
								</KadencePanelBody>

								<div className="kt-sidebar-settings-spacer"></div>

								<KadencePanelBody
									title={__('Container Settings', 'kadence-blocks')}
									panelName={'containerSettings'}
									blockSlug={'kadence/countdown'}
								>
									<PopColorControl
										label={__('Background Color', 'kadence-blocks')}
										value={background ? background : ''}
										default={''}
										onChange={(value) => setAttributes({ background: value })}
									/>
									<PopColorControl
										label={__('Border Color', 'kadence-blocks')}
										value={border ? border : ''}
										default={''}
										onChange={(value) => setAttributes({ border: value })}
									/>
									<ResponsiveMeasurementControls
										label={__('Border Width', 'kadence-blocks')}
										value={borderWidth}
										control={borderWidthControl}
										tabletValue={tabletBorderWidth}
										mobileValue={mobileBorderWidth}
										onChange={(value) => setAttributes({ borderWidth: value })}
										onChangeTablet={(value) => setAttributes({ tabletBorderWidth: value })}
										onChangeMobile={(value) => setAttributes({ mobileBorderWidth: value })}
										onChangeControl={(value) => setBorderWidthControl(value)}
										min={0}
										max={40}
										step={1}
										unit={'px'}
										units={['px']}
										showUnit={true}
										preset={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
									/>
									<MeasurementControls
										label={__('Border Radius', 'kadence-blocks')}
										measurement={borderRadius}
										control={borderRadiusControl}
										onChange={(value) => setAttributes({ borderRadius: value })}
										onControl={(value) => setBorderRadiusControl(value)}
										min={0}
										max={200}
										step={1}
										controlTypes={[
											{
												key: 'linked',
												name: __('Linked', 'kadence-blocks'),
												icon: radiusLinkedIcon,
											},
											{
												key: 'individual',
												name: __('Individual', 'kadence-blocks'),
												icon: radiusIndividualIcon,
											},
										]}
										firstIcon={topLeftIcon}
										secondIcon={topRightIcon}
										thirdIcon={bottomRightIcon}
										fourthIcon={bottomLeftIcon}
									/>
								</KadencePanelBody>

								<KadencePanelBody
									title={__('Visibility Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'visibilitySettings'}
									blockSlug={'kadence/countdown'}
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

								<KadenceBlockDefaults
									attributes={attributes}
									defaultAttributes={metadata.attributes}
									blockSlug={metadata.name}
									excludedAttrs={nonTransAttrs}
								/>
							</>
						)}
					</InspectorControls>
				</>
			)}
			{undefined !== numberFont &&
				undefined !== numberFont[0] &&
				undefined !== numberFont[0].family &&
				'' !== numberFont[0].family &&
				numberFont[0].google && <WebfontLoader config={numberConfig}></WebfontLoader>}
			{undefined !== labelFont &&
				undefined !== labelFont[0] &&
				undefined !== labelFont[0].family &&
				'' !== labelFont[0].family &&
				labelFont[0].google && <WebfontLoader config={labelConfig}></WebfontLoader>}
			{'' !== preLabel &&
				undefined !== preLabelFont &&
				undefined !== preLabelFont[0] &&
				undefined !== preLabelFont[0].family &&
				'' !== preLabelFont[0].family &&
				preLabelFont[0].google && <WebfontLoader config={preLabelConfig}></WebfontLoader>}
			{'' !== postLabel &&
				undefined !== postLabelFont &&
				undefined !== postLabelFont[0] &&
				undefined !== postLabelFont[0].family &&
				'' !== postLabelFont[0].family &&
				postLabelFont[0].google && <WebfontLoader config={postLabelConfig}></WebfontLoader>}
			{enablePauseButton && (
				<button
					type="button"
					className={`kb-countdown-pause-button kb-countdown-pause-button-${pauseButtonPosition || 'top-right'}`}
					aria-label={__('Pause countdown timer', 'kadence-blocks')}
					aria-pressed="false"
					title={__('Pause countdown', 'kadence-blocks')}
					disabled
					style={{
						position: 'absolute',
						top:
							pauseButtonPosition === 'top-left' || pauseButtonPosition === 'top-right'
								? '0.5em'
								: 'auto',
						bottom:
							pauseButtonPosition === 'bottom-left' || pauseButtonPosition === 'bottom-right'
								? '0.5em'
								: 'auto',
						left:
							pauseButtonPosition === 'top-left' || pauseButtonPosition === 'bottom-left'
								? '0.5em'
								: 'auto',
						right:
							pauseButtonPosition === 'top-right' || pauseButtonPosition === 'bottom-right'
								? '0.5em'
								: 'auto',
						transform:
							pauseButtonPosition === 'top-left' || pauseButtonPosition === 'top-right'
								? 'translateY(-.5em)'
								: pauseButtonPosition === 'bottom-left' || pauseButtonPosition === 'bottom-right'
									? 'translateY(.5em)'
									: 'none',
					}}
				>
					<span className="kb-countdown-pause-icon" aria-hidden="true">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
							<rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
						</svg>
					</span>
				</button>
			)}
			<InnerBlocks templateLock="all" template={!enableTimer ? templateNoTimer : templateWithTimer} />
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
				forceShow={marginMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewMarginTop, previewMarginType),
					getSpacingOptionOutput(previewMarginRight, previewMarginType),
					getSpacingOptionOutput(previewMarginBottom, previewMarginType),
					getSpacingOptionOutput(previewMarginLeft, previewMarginType),
				]}
			/>
			<SpacingVisualizer
				type="inside"
				forceShow={paddingMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewPaddingTop, previewPaddingType),
					getSpacingOptionOutput(previewPaddingRight, previewPaddingType),
					getSpacingOptionOutput(previewPaddingBottom, previewPaddingType),
					getSpacingOptionOutput(previewPaddingLeft, previewPaddingType),
				]}
			/>
		</div>
	);
}

export default KadenceCountdown;
