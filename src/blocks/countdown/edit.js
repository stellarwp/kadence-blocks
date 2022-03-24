/**
 * BLOCK: Kadence Countdown
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Import Icons
 */
import icons from '../../icons';
import MeasurementControls from '../../measurement-control';
import WebfontLoader from '../../components/typography/fontloader';
import PopColorControl from '../../components/color/pop-color-control';
import KadenceRadioButtons from '../../kadence-radio-buttons';
import KadenceColorOutput from '../../kadence-color-output';
import ResponsiveMeasurementControls from '../../components/measurement/responsive-measurement-control';
import ResponsiveAlignControls from '../../components/align/responsive-align-control';
import URLInputControl from '../../components/links/link-control';
import TypographyControls from '../../components/typography/typography-control';
import KadenceRange from '../../components/range/range-control';
import KadencePanelBody from '../../components/KadencePanelBody';

/**
 * Import Css
 */
import './editor.scss';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { __experimentalGetSettings as getDateSettings } from '@wordpress/date';

import { applyFilters } from '@wordpress/hooks';

import {
	Component,
	Fragment,
} from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import {
	InnerBlocks,
	BlockControls,
	AlignmentToolbar,
	InspectorControls,
	store as blockEditorStore,
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
const ALLOWED_MEDIA_TYPES = [ 'image' ];
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktcountdownUniqueIDs = [];
const COUNTDOWN_TEMPLATE = [
    [ 'kadence/countdown-timer', {} ],
];
const COUNTDOWN_TEMPLATE_WITH_MESSAGE = [
    [ 'kadence/countdown-timer', {} ],
	[ 'kadence/countdown-inner', { location: 'complete' } ],
];
const COUNTDOWN_NO_TIMER_WITH_MESSAGE = [
	[ 'kadence/countdown-inner', { location: 'first' } ],
	[ 'kadence/countdown-inner', { location: 'complete' } ],
];
const COUNTDOWN_NO_TIMER = [
	[ 'kadence/countdown-inner', { location: 'first' } ],
];
const ALLOWED_BLOCKS = [ 'kadence/countdown-timer', 'kadence/countdown-inner' ];
const typeOptions = [
	{ value: 'date', label: __( 'Date', 'kadence-blocks' ), disabled: false },
	{ value: 'evergreen', label: __( 'Evergreen (Pro addon)', 'kadence-blocks' ), disabled: true },
];
const actionOptions = [
	{ value: 'none', label: __( 'Show Timer at Zero', 'kadence-blocks' ), disabled: false },
	{ value: 'hide', label: __( 'Hide (Pro addon)', 'kadence-blocks' ), disabled: true },
	{ value: 'message', label: __( 'Replace with Content (Pro addon)', 'kadence-blocks' ), disabled: true },
	{ value: 'redirect', label: __( 'Redirect (Pro addon)', 'kadence-blocks' ), disabled: true },
];
const ANCHOR_REGEX = /[\s#]/g;
/**
 * Build the spacer edit
 */
class KadenceCountdown extends Component {
	constructor() {
		super( ...arguments );
		this.showSettings = this.showSettings.bind( this );
		this.getPreviewSize = this.getPreviewSize.bind( this );
		this.timezoneShifter = this.timezoneShifter.bind( this );
		this.getTimestamp = this.getTimestamp.bind( this );
		this.state = {
			borderWidthControl: 'individual',
			borderRadiusControl: 'linked',
			paddingControl: 'individual',
			marginControl: 'individual',
			itemBorderWidthControl: 'individual',
			itemBorderRadiusControl: 'linked',
			itemPaddingControl: 'linked',
			previewExpired: false,
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			// Before applying defaults lets check to see if the user wants it.
			if ( undefined === this.props.attributes.noCustomDefaults || ! this.props.attributes.noCustomDefaults ) {
				if ( blockConfigObject[ 'kadence/countdown' ] !== undefined && typeof blockConfigObject[ 'kadence/countdown' ] === 'object' ) {
					Object.keys( blockConfigObject[ 'kadence/countdown' ] ).map( ( attribute ) => {
						this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/countdown' ][ attribute ];
					} );
				}
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktcountdownUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( ktcountdownUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.attributes.uniqueID = '_' + this.props.clientId.substr( 2, 9 );
			ktcountdownUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			ktcountdownUniqueIDs.push( this.props.attributes.uniqueID );
		}
		if ( this.props.attributes.borderRadius && this.props.attributes.borderRadius[ 0 ] === this.props.attributes.borderRadius[ 1 ] && this.props.attributes.borderRadius[ 0 ] === this.props.attributes.borderRadius[ 2 ] && this.props.attributes.borderRadius[ 0 ] === this.props.attributes.borderRadius[ 3 ] ) {
			this.setState( { borderRadiusControl: 'linked' } );
		} else {
			this.setState( { borderRadiusControl: 'individual' } );
		}
		if ( ! this.props.attributes.date ) {
			const settings = getDateSettings();
			const { timezone } = settings;
            const today = new Date();
            const newDate = new Date();
            newDate.setDate( today.getDate() + 2 );
			const theTimeOffset = ( timezone && timezone.offset ? timezone.offset : 0 );
			const theSiteTimezoneTimestamp = this.getTimestamp( newDate, theTimeOffset );
            this.props.setAttributes( { date: newDate, timestamp: theSiteTimezoneTimestamp, timezone: ( timezone && timezone.string ? timezone.string : '' ), timeOffset: theTimeOffset } );
        }
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/countdown' ] !== undefined && typeof blockSettings[ 'kadence/countdown' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/countdown' ] } );
		}
	}
	showSettings( key ) {
		if ( undefined === this.state.settings[ key ] || 'all' === this.state.settings[ key ] ) {
			return true;
		} else if ( 'contributor' === this.state.settings[ key ] && ( 'contributor' === this.state.user || 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'author' === this.state.settings[ key ] && ( 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'editor' === this.state.settings[ key ] && ( 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'admin' === this.state.settings[ key ] && 'admin' === this.state.user ) {
			return true;
		}
		return false;
	}
	getPreviewSize( device, desktopSize, tabletSize, mobileSize ) {
		if ( device === 'Mobile' ) {
			if ( undefined !== mobileSize && '' !== mobileSize ) {
				return mobileSize;
			} else if ( undefined !== tabletSize && '' !== tabletSize ) {
				return tabletSize;
			}
		} else if ( device === 'Tablet' ) {
			if ( undefined !== tabletSize && '' !== tabletSize ) {
				return tabletSize;
			}
		}
		return desktopSize;
	}
	getTimestamp( value, theTimeOffset ) {
		const userTimezoneOffset = -1 * ( new Date().getTimezoneOffset() / 60 );
		if ( Number( theTimeOffset ) === userTimezoneOffset ) {
			return new Date( value ).getTime();
		}
		return this.timezoneShifter( value, theTimeOffset );
	};
	timezoneShifter( value, theTimeOffset ) {
		// Get the timezone offset of current site user.
		const userTimezoneOffset = -1 * ( new Date().getTimezoneOffset() / 60 );
		// Get the difference in offset from the sites set timezone.
		const shiftDiff = ( userTimezoneOffset - theTimeOffset );
		// Get the date in the timezone of the user.
		const currentDate = new Date( value );
		// Shift that date the difference in timezones from the user to the site.
		return new Date( currentDate.getTime() + ( shiftDiff * 60 * 60 * 1000 ) ).getTime();
	};
	render() {
		const { attributes: { uniqueID, expireAction, units, enableTimer, evergreenHours, evergreenMinutes, redirectURL, timerLayout, date, timestamp, evergreenReset, timezone, timeOffset, preLabel, postLabel, daysLabel, hoursLabel, minutesLabel, secondsLabel, counterAlign, campaignID, numberColor, numberFont, labelColor, labelFont, preLabelColor, preLabelFont, postLabelColor, postLabelFont, border, borderRadius, borderWidth, mobileBorderWidth, tabletBorderWidth, background, vsdesk, vstablet, vsmobile, countdownType, paddingType, marginType, containerMobilePadding, containerTabletPadding, containerPadding, containerMobileMargin, containerTabletMargin, containerMargin, itemBorder, itemBorderWidth, itemBackground, itemTabletBorderWidth, itemMobileBorderWidth, itemPadding, itemTabletPadding, itemMobilePadding, itemBorderRadius, itemPaddingType, timeNumbers, countdownDivider, revealOnLoad, evergreenStrict }, setAttributes, className, clientId } = this.props;
		const { previewExpired, borderWidthControl, borderRadiusControl, paddingControl, marginControl, itemBorderRadiusControl, itemPaddingControl, itemBorderWidthControl } = this.state;
		const countdownTypes = applyFilters( 'kadence.countdownTypes', typeOptions );
		const countdownActions = applyFilters( 'kadence.countdownActions', actionOptions );
		const settings = getDateSettings();
		// To know if the current timezone is a 12 hour time with look for "a" in the time format
		// We also make sure this a is not escaped by a "/"
		const is12HourTime = /a(?!\\)/i.test(
			settings.formats.time
				.toLowerCase() // Test only the lower case a
				.replace( /\\\\/g, '' ) // Replace "//" with empty strings
				.split( '' )
				.reverse()
				.join( '' ) // Reverse the string and test for "a" not followed by a slash
		);
		const saveUnits = ( value ) => {
			const newUpdate = units.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				units: newUpdate,
			} );
		};
		const saveDate = ( value ) => {
			const theTimezone = ( settings.timezone && settings.timezone.string ? settings.timezone.string : '' );
			const theTimeOffset = ( settings.timezone && settings.timezone.offset ? settings.timezone.offset : 0 );
			const theSiteTimezoneTimestamp = this.getTimestamp( value, theTimeOffset );
			setAttributes( {
				date: value,
				timestamp: theSiteTimezoneTimestamp,
				timezone: theTimezone,
				timeOffset: theTimeOffset,
			} );
		};
		const getEverGreenTimestamp = ( value ) => {
            const newDate = new Date();
            newDate.setTime( newDate.getTime() + ( Number( value )*60*60*1000 ) );
			newDate.setTime( newDate.getTime() + ( ( evergreenMinutes ? Number( evergreenMinutes ) : 0 )*60*1000 ) );
			return newDate.getTime();
		}
		const saveEvergreenHours = ( value ) => {
			const theEvergreenTimeStamp = getEverGreenTimestamp( value );
			setAttributes( {
				evergreenHours: value,
				timestamp: theEvergreenTimeStamp,
			} );
		};
		const getEverGreenMinTimestamp = ( value ) => {
			const newDate = new Date();
            newDate.setTime( newDate.getTime() + ( ( evergreenHours ? Number( evergreenHours ) : 0 )*60*60*1000 ) );
			newDate.setTime( newDate.getTime() + ( Number( value )*60*1000 ) );
			return newDate.getTime();
		}
		const saveEvergreenMinutes = ( value ) => {
			const theEvergreenTimeStamp = getEverGreenMinTimestamp( value );
			setAttributes( {
				evergreenMinutes: value,
				timestamp: theEvergreenTimeStamp,
			} );
		};
		const saveNumberFont = ( value ) => {
			const newUpdate = numberFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				numberFont: newUpdate,
			} );
		};
		const saveLabelFont = ( value ) => {
			const newUpdate = labelFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				labelFont: newUpdate,
			} );
		};
		const savePreFont = ( value ) => {
			const newUpdate = preLabelFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				preLabelFont: newUpdate,
			} );
		};
		const savePostFont = ( value ) => {
			const newUpdate = postLabelFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				postLabelFont: newUpdate,
			} );
		};
		const numberConfigSettings = {
			google: {
				families: [ ( undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].family && '' !== numberFont[0].family && numberFont[0].google ? numberFont[0].family : '' ) + ( undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].variant && '' !== numberFont[0].variant ? ':' + numberFont[0].variant : '' ) ],
			},
		};
		const labelConfigSettings = {
			google: {
				families: [ ( undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].family && '' !== labelFont[0].family && labelFont[0].google ? labelFont[0].family : '' ) + ( undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].variant && '' !== labelFont[0].variant ? ':' + labelFont[0].variant : '' ) ],
			},
		};
		const preLabelConfigSettings = {
			google: {
				families: [ ( undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].family && '' !== preLabelFont[0].family && preLabelFont[0].google ? preLabelFont[0].family : '' ) + ( undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].variant && '' !== preLabelFont[0].variant ? ':' + preLabelFont[0].variant : '' ) ],
			},
		};
		const postLabelConfigSettings = {
			google: {
				families: [ ( undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].family && '' !== postLabelFont[0].family && postLabelFont[0].google ? postLabelFont[0].family : '' ) + ( undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].variant && '' !== postLabelFont[0].variant ? ':' + postLabelFont[0].variant : '' ) ],
			},
		};
		const numberConfig = ( undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].family && '' !== numberFont[0].family && numberFont[0].google ? numberConfigSettings : '' );
		const labelConfig = ( undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].family && '' !== labelFont[0].family && labelFont[0].google ? labelConfigSettings : '' );
		const preLabelConfig = ( undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].family && '' !== preLabelFont[0].family && preLabelFont[0].google ? preLabelConfigSettings : '' );
		const postLabelConfig = ( undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].family && '' !== postLabelFont[0].family && postLabelFont[0].google ? postLabelConfigSettings : '' );
		const templateWithTimer = ( 'message' === expireAction ? COUNTDOWN_TEMPLATE_WITH_MESSAGE : COUNTDOWN_TEMPLATE );
		const templateNoTimer = ( 'message' === expireAction ? COUNTDOWN_NO_TIMER_WITH_MESSAGE : COUNTDOWN_NO_TIMER )
		const marginMin = ( marginType === 'em' || marginType === 'rem' ? -2 : -200 );
		const marginMax = ( marginType === 'em' || marginType === 'rem' ? 12 : 200 );
		const marginStep = ( marginType === 'em' || marginType === 'rem' ? 0.1 : 1 );
		const paddingMin = ( paddingType === 'em' || paddingType === 'rem' ? 0 : 0 );
		const paddingMax = ( paddingType === 'em' || paddingType === 'rem' ? 12 : 200 );
		const paddingStep = ( paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1 );
		const previewPaddingType = ( undefined !== paddingType ? paddingType : 'px' );
		const itemPaddingMin = ( itemPaddingType === 'em' || itemPaddingType === 'rem' ? 0 : 0 );
		const itemPaddingMax = ( itemPaddingType === 'em' || itemPaddingType === 'rem' ? 12 : 200 );
		const itemPaddingStep = ( itemPaddingType === 'em' || itemPaddingType === 'rem' ? 0.1 : 1 );
		const previewItemPaddingType = ( undefined !== itemPaddingType ? itemPaddingType : 'px' );
		const previewMarginType = ( undefined !== marginType ? marginType : 'px' );
		const previewMarginTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerMargin && undefined !== containerMargin[0] ? containerMargin[0] : '' ), ( undefined !== containerTabletMargin && undefined !== containerTabletMargin[0] ? containerTabletMargin[0] : '' ), ( undefined !== containerMobileMargin && undefined !== containerMobileMargin[0] ? containerMobileMargin[0] : '' ) );
		const previewMarginRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerMargin && undefined !== containerMargin[1] ? containerMargin[1] : '' ), ( undefined !== containerTabletMargin && undefined !== containerTabletMargin[1] ? containerTabletMargin[1] : '' ), ( undefined !== containerMobileMargin && undefined !== containerMobileMargin[1] ? containerMobileMargin[1] : '' ) );
		const previewMarginBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerMargin && undefined !== containerMargin[2] ? containerMargin[2] : '' ), ( undefined !== containerTabletMargin && undefined !== containerTabletMargin[2] ? containerTabletMargin[2] : '' ), ( undefined !== containerMobileMargin && undefined !== containerMobileMargin[2] ? containerMobileMargin[2] : '' ) );
		const previewMarginLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerMargin && undefined !== containerMargin[3] ? containerMargin[3] : '' ), ( undefined !== containerTabletMargin && undefined !== containerTabletMargin[3] ? containerTabletMargin[3] : '' ), ( undefined !== containerMobileMargin && undefined !== containerMobileMargin[3] ? containerMobileMargin[3] : '' ) );
		const previewPaddingTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerPadding && undefined !== containerPadding[0] ? containerPadding[0] : '' ), ( undefined !== containerTabletPadding && undefined !== containerTabletPadding[0] ? containerTabletPadding[0] : '' ), ( undefined !== containerMobilePadding && undefined !== containerMobilePadding[0] ? containerMobilePadding[0] : '' ) );
		const previewPaddingRight= this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerPadding && undefined !== containerPadding[1] ? containerPadding[1] : '' ), ( undefined !== containerTabletPadding && undefined !== containerTabletPadding[1] ? containerTabletPadding[1] : '' ), ( undefined !== containerMobilePadding && undefined !== containerMobilePadding[1] ? containerMobilePadding[1] : '' ) );
		const previewPaddingBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerPadding && undefined !== containerPadding[2] ? containerPadding[2] : '' ), ( undefined !== containerTabletPadding && undefined !== containerTabletPadding[2] ? containerTabletPadding[2] : '' ), ( undefined !== containerMobilePadding && undefined !== containerMobilePadding[2] ? containerMobilePadding[2] : '' ) );
		const previewPaddingLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerPadding && undefined !== containerPadding[3] ? containerPadding[3] : '' ), ( undefined !== containerTabletPadding && undefined !== containerTabletPadding[3] ? containerTabletPadding[3] : '' ), ( undefined !== containerMobilePadding && undefined !== containerMobilePadding[3] ? containerMobilePadding[3] : '' ) );
		const previewBorderTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== borderWidth ? borderWidth[ 0 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 0 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 0 ] : '' ) );
		const previewBorderRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== borderWidth ? borderWidth[ 1 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 1 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 1 ] : '' ) );
		const previewBorderBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== borderWidth ? borderWidth[ 2 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 2 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 2 ] : '' ) );
		const previewBorderLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== borderWidth ? borderWidth[ 3 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 3 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 3 ] : '' ) );

		const previewItemPaddingTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== itemPadding && undefined !== itemPadding[0] ? itemPadding[0] : '' ), ( undefined !== itemTabletPadding && undefined !== itemTabletPadding[0] ? itemTabletPadding[0] : '' ), ( undefined !== itemMobilePadding && undefined !== itemMobilePadding[0] ? itemMobilePadding[0] : '' ) );
		const previewItemPaddingRight= this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== itemPadding && undefined !== itemPadding[1] ? itemPadding[1] : '' ), ( undefined !== itemTabletPadding && undefined !== itemTabletPadding[1] ? itemTabletPadding[1] : '' ), ( undefined !== itemMobilePadding && undefined !== itemMobilePadding[1] ? itemMobilePadding[1] : '' ) );
		const previewItemPaddingBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== itemPadding && undefined !== itemPadding[2] ? itemPadding[2] : '' ), ( undefined !== itemTabletPadding && undefined !== itemTabletPadding[2] ? itemTabletPadding[2] : '' ), ( undefined !== itemMobilePadding && undefined !== itemMobilePadding[2] ? itemMobilePadding[2] : '' ) );
		const previewItemPaddingLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== itemPadding && undefined !== itemPadding[3] ? itemPadding[3] : '' ), ( undefined !== itemTabletPadding && undefined !== itemTabletPadding[3] ? itemTabletPadding[3] : '' ), ( undefined !== itemMobilePadding && undefined !== itemMobilePadding[3] ? itemMobilePadding[3] : '' ) );
		const previewItemBorderTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== itemBorderWidth ? itemBorderWidth[ 0 ] : '' ), ( undefined !== itemTabletBorderWidth ? itemTabletBorderWidth[ 0 ] : '' ), ( undefined !== itemMobileBorderWidth ? itemMobileBorderWidth[ 0 ] : '' ) );
		const previewItemBorderRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== itemBorderWidth ? itemBorderWidth[ 1 ] : '' ), ( undefined !== itemTabletBorderWidth ?itemTabletBorderWidth[ 1 ] : '' ), ( undefined !== itemMobileBorderWidth ? itemMobileBorderWidth[ 1 ] : '' ) );
		const previewItemBorderBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== itemBorderWidth ? itemBorderWidth[ 2 ] : '' ), ( undefined !== itemTabletBorderWidth ? itemTabletBorderWidth[ 2 ] : '' ), ( undefined !== itemMobileBorderWidth ? itemMobileBorderWidth[ 2 ] : '' ) );
		const previewItemBorderLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== itemBorderWidth ? itemBorderWidth[ 3 ] : '' ), ( undefined !== itemTabletBorderWidth ?itemTabletBorderWidth[ 3 ] : '' ), ( undefined !== itemMobileBorderWidth ? itemMobileBorderWidth[ 3 ] : '' ) );

		const previewNumberSizeType = ( undefined !== numberFont && undefined !== numberFont[0] && '' !== numberFont[0].sizeType ? numberFont[0].sizeType : 'px' );
		const previewNumberLineType = ( undefined !== numberFont && undefined !== numberFont[0] && '' !== numberFont[0].lineType ? numberFont[0].lineType : 'px' );
		const previewNumberLetterType = ( undefined !== numberFont && undefined !== numberFont[0] && '' !== numberFont[0].letterType ? numberFont[0].letterType : 'px' );
		const previewNumberFontSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].size && undefined !== numberFont[0].size[0] && '' !== numberFont[0].size[0] ? numberFont[0].size[0] : '' ), ( undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].size && undefined !== numberFont[0].size[1] && '' !== numberFont[0].size[1] ? numberFont[0].size[1] : '' ), ( undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].size && undefined !== numberFont[0].size[2] && '' !== numberFont[0].size[2] ? numberFont[0].size[2] : '' ) );
		const previewNumberLineSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].lineHeight && undefined !== numberFont[0].lineHeight[0] && '' !== numberFont[0].lineHeight[0] ? numberFont[0].lineHeight[0] : '' ), ( undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].lineHeight && undefined !== numberFont[0].lineHeight[1] && '' !== numberFont[0].lineHeight[1] ? numberFont[0].lineHeight[1] : '' ), ( undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].lineHeight && undefined !== numberFont[0].lineHeight[2] && '' !== numberFont[0].lineHeight[2] ? numberFont[0].lineHeight[2] : '' ) );
		const previewNumberLetterSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].letterSpacing && undefined !== numberFont[0].letterSpacing[0] && '' !== numberFont[0].letterSpacing[0] ? numberFont[0].letterSpacing[0] : '' ), ( undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].letterSpacing && undefined !== numberFont[0].letterSpacing[1] && '' !== numberFont[0].letterSpacing[1] ? numberFont[0].letterSpacing[1] : '' ), ( undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].letterSpacing && undefined !== numberFont[0].letterSpacing[2] && '' !== numberFont[0].letterSpacing[2] ? numberFont[0].letterSpacing[2] : '' ) );
		const previewLabelSizeType = ( undefined !== labelFont && undefined !== labelFont[0] && '' !== labelFont[0].sizeType ? labelFont[0].sizeType : 'px' );
		const previewLabelLineType = ( undefined !== labelFont && undefined !== labelFont[0] && '' !== labelFont[0].lineType ? labelFont[0].lineType : 'px' );
		const previewLabelLetterType = ( undefined !== labelFont && undefined !== labelFont[0] && '' !== labelFont[0].letterType ? labelFont[0].letterType : 'px' );
		const previewLabelFontSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].size && undefined !== labelFont[0].size[0] && '' !== labelFont[0].size[0] ? labelFont[0].size[0] : '' ), ( undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].size && undefined !== labelFont[0].size[1] && '' !== labelFont[0].size[1] ? labelFont[0].size[1] : '' ), ( undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].size && undefined !== labelFont[0].size[2] && '' !== labelFont[0].size[2] ? labelFont[0].size[2] : '' ) );
		const previewLabelLineSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].lineHeight && undefined !== labelFont[0].lineHeight[0] && '' !== labelFont[0].lineHeight[0] ? labelFont[0].lineHeight[0] : '' ), ( undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].lineHeight && undefined !== labelFont[0].lineHeight[1] && '' !== labelFont[0].lineHeight[1] ? labelFont[0].lineHeight[1] : '' ), ( undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].lineHeight && undefined !== labelFont[0].lineHeight[2] && '' !== labelFont[0].lineHeight[2] ? labelFont[0].lineHeight[2] : '' ) );
		const previewLabelLetterSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].letterSpacing && undefined !== labelFont[0].letterSpacing[0] && '' !== labelFont[0].letterSpacing[0] ? labelFont[0].letterSpacing[0] : '' ), ( undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].letterSpacing && undefined !== labelFont[0].letterSpacing[1] && '' !== labelFont[0].letterSpacing[1] ? labelFont[0].letterSpacing[1] : '' ), ( undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].letterSpacing && undefined !== labelFont[0].letterSpacing[2] && '' !== labelFont[0].letterSpacing[2] ? labelFont[0].letterSpacing[2] : '' ) );
		const previewPreLabelSizeType = ( undefined !== preLabelFont && undefined !== preLabelFont[0] && '' !== preLabelFont[0].sizeType ? preLabelFont[0].sizeType : 'px' );
		const previewPreLabelLineType = ( undefined !== preLabelFont && undefined !== preLabelFont[0] && '' !== preLabelFont[0].lineType ? preLabelFont[0].lineType : 'px' );
		const previewPreLabelLetterType = ( undefined !== preLabelFont && undefined !== preLabelFont[0] && '' !== preLabelFont[0].letterType ? preLabelFont[0].letterType : 'px' );
		const previewPreLabelFontSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].size && undefined !== preLabelFont[0].size[0] && '' !== preLabelFont[0].size[0] ? preLabelFont[0].size[0] : '' ), ( undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].size && undefined !== preLabelFont[0].size[1] && '' !== preLabelFont[0].size[1] ? preLabelFont[0].size[1] : '' ), ( undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].size && undefined !== preLabelFont[0].size[2] && '' !== preLabelFont[0].size[2] ? preLabelFont[0].size[2] : '' ) );
		const previewPreLabelLineSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].lineHeight && undefined !== preLabelFont[0].lineHeight[0] && '' !== preLabelFont[0].lineHeight[0] ? preLabelFont[0].lineHeight[0] : '' ), ( undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].lineHeight && undefined !== preLabelFont[0].lineHeight[1] && '' !== preLabelFont[0].lineHeight[1] ? preLabelFont[0].lineHeight[1] : '' ), ( undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].lineHeight && undefined !== preLabelFont[0].lineHeight[2] && '' !== preLabelFont[0].lineHeight[2] ? preLabelFont[0].lineHeight[2] : '' ) );
		const previewPreLabelLetterSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].letterSpacing && undefined !== preLabelFont[0].letterSpacing[0] && '' !== preLabelFont[0].letterSpacing[0] ? preLabelFont[0].letterSpacing[0] : '' ), ( undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].letterSpacing && undefined !== preLabelFont[0].letterSpacing[1] && '' !== preLabelFont[0].letterSpacing[1] ? preLabelFont[0].letterSpacing[1] : '' ), ( undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].letterSpacing && undefined !== preLabelFont[0].letterSpacing[2] && '' !== preLabelFont[0].letterSpacing[2] ? preLabelFont[0].letterSpacing[2] : '' ) );
		const previewPostLabelSizeType = ( undefined !== postLabelFont && undefined !== postLabelFont[0] && '' !== postLabelFont[0].sizeType ? postLabelFont[0].sizeType : 'px' );
		const previewPostLabelLineType = ( undefined !== postLabelFont && undefined !== postLabelFont[0] && '' !== postLabelFont[0].lineType ? postLabelFont[0].lineType : 'px' );
		const previewPostLabelLetterType = ( undefined !== postLabelFont && undefined !== postLabelFont[0] && '' !== postLabelFont[0].letterType ? postLabelFont[0].letterType : 'px' );
		const previewPostLabelFontSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].size && undefined !== postLabelFont[0].size[0] && '' !== postLabelFont[0].size[0] ? postLabelFont[0].size[0] : '' ), ( undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].size && undefined !== postLabelFont[0].size[1] && '' !== postLabelFont[0].size[1] ? postLabelFont[0].size[1] : '' ), ( undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].size && undefined !== postLabelFont[0].size[2] && '' !== postLabelFont[0].size[2] ? postLabelFont[0].size[2] : '' ) );
		const previewPostLabelLineSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].lineHeight && undefined !== postLabelFont[0].lineHeight[0] && '' !== postLabelFont[0].lineHeight[0] ? postLabelFont[0].lineHeight[0] : '' ), ( undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].lineHeight && undefined !== postLabelFont[0].lineHeight[1] && '' !== postLabelFont[0].lineHeight[1] ? postLabelFont[0].lineHeight[1] : '' ), ( undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].lineHeight && undefined !== postLabelFont[0].lineHeight[2] && '' !== postLabelFont[0].lineHeight[2] ? postLabelFont[0].lineHeight[2] : '' ) );
		const previewPostLabelLetterSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].letterSpacing && undefined !== postLabelFont[0].letterSpacing[0] && '' !== postLabelFont[0].letterSpacing[0] ? postLabelFont[0].letterSpacing[0] : '' ), ( undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].letterSpacing && undefined !== postLabelFont[0].letterSpacing[1] && '' !== postLabelFont[0].letterSpacing[1] ? postLabelFont[0].letterSpacing[1] : '' ), ( undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].letterSpacing && undefined !== postLabelFont[0].letterSpacing[2] && '' !== postLabelFont[0].letterSpacing[2] ? postLabelFont[0].letterSpacing[2] : '' ) );
		const classes = classnames( {
			'kb-countdown-container': true,
			[ `kb-countdown-container-${ uniqueID }` ]: uniqueID,
			[ `kb-countdown-timer-layout-${ timerLayout }` ] : timerLayout && enableTimer,
			'kb-countdown-enable-dividers': 'inline' !== timerLayout && countdownDivider && enableTimer,
			'kb-countdown-has-timer' : enableTimer,
			'kb-countdown-preview-expired': previewExpired,
			[ `kb-countdown-align-${ counterAlign[0] }` ]: ( undefined !== counterAlign && undefined !== counterAlign[0] && enableTimer ? counterAlign[0] : false ),
			[ `kb-countdown-align-tablet-${ counterAlign[1] }` ]: ( undefined !== counterAlign && undefined !== counterAlign[1] && enableTimer ? counterAlign[1] : false ),
			[ `kb-countdown-align-mobile-${ counterAlign[2] }` ]: ( undefined !== counterAlign && undefined !== counterAlign[2] && enableTimer ? counterAlign[2] : false ),
			'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
			'kvs-md-false': vstablet !== 'undefined' && vstablet,
			'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
			[ className ]: className,
		} );
		if ( this.props.isNested && this.props.parentBlock ) {
			if ( undefined !== this.props.parentBlock.attributes.countdownType && this.props.parentBlock.attributes.countdownType !== countdownType ) {
				setAttributes( { countdownType: this.props.parentBlock.attributes.countdownType } )
			}
			if ( undefined !== this.props.parentBlock.attributes.evergreenMinutes && this.props.parentBlock.attributes.evergreenMinutes !== evergreenMinutes ) {
				setAttributes( { evergreenMinutes: this.props.parentBlock.attributes.evergreenMinutes } )
			}
			if ( undefined !== this.props.parentBlock.attributes.timeOffset && this.props.parentBlock.attributes.timeOffset !== timeOffset ) {
				setAttributes( { timeOffset: this.props.parentBlock.attributes.timeOffset } )
			}
			if ( undefined !== this.props.parentBlock.attributes.timezone && this.props.parentBlock.attributes.timezone !== timezone ) {
				setAttributes( { timezone: this.props.parentBlock.attributes.timezone } )
			}
			if ( undefined !== this.props.parentBlock.attributes.timestamp && this.props.parentBlock.attributes.timestamp !== timestamp ) {
				setAttributes( { timestamp: this.props.parentBlock.attributes.timestamp } )
			}
			if ( undefined !== this.props.parentBlock.attributes.evergreenHours && this.props.parentBlock.attributes.evergreenHours !== evergreenHours ) {
				setAttributes( { evergreenHours: this.props.parentBlock.attributes.evergreenHours } )
			}
			if ( undefined !== this.props.parentBlock.attributes.date && this.props.parentBlock.attributes.date !== date ) {
				setAttributes( { date: this.props.parentBlock.attributes.date } )
			}
			if ( undefined !== this.props.parentBlock.attributes.campaignID && this.props.parentBlock.attributes.campaignID !== campaignID ) {
				setAttributes( { campaignID: this.props.parentBlock.attributes.campaignID } )
			}
			if ( undefined !== this.props.parentBlock.attributes.evergreenReset && this.props.parentBlock.attributes.evergreenReset !== evergreenReset ) {
				setAttributes( { evergreenReset: this.props.parentBlock.attributes.evergreenReset } )
			}
			if ( undefined !== this.props.parentBlock.attributes.evergreenStrict && this.props.parentBlock.attributes.evergreenStrict !== evergreenStrict ) {
				setAttributes( { evergreenStrict: this.props.parentBlock.attributes.evergreenStrict } )
			}
		}
		return (
			<div className={ classes } style={ {
				background: ( background ? KadenceColorOutput( background ) : undefined ),
				borderColor: ( border ? KadenceColorOutput( border ) : undefined ),
				borderTopWidth: ( previewBorderTop ? previewBorderTop + 'px' : undefined ),
				borderRightWidth: ( previewBorderRight ? previewBorderRight + 'px' : undefined ),
				borderBottomWidth: ( previewBorderBottom ? previewBorderBottom + 'px' : undefined ),
				borderLeftWidth: ( previewBorderLeft ? previewBorderLeft + 'px' : undefined ),
				borderTopLeftRadius: ( borderRadius && borderRadius[0] ? borderRadius[0] + 'px' : undefined ),
				borderTopRightRadius: ( borderRadius && borderRadius[1] ? borderRadius[1] + 'px' : undefined ),
				borderBottomRightRadius: ( borderRadius && borderRadius[2] ? borderRadius[2] + 'px' : undefined ),
				borderBottomLeftRadius: ( borderRadius && borderRadius[3] ? borderRadius[3] + 'px' : undefined ),
				paddingTop: ( '' !== previewPaddingTop ? previewPaddingTop + previewPaddingType : undefined ),
				paddingRight: ( '' !== previewPaddingRight ? previewPaddingRight + previewPaddingType : undefined ),
				paddingBottom: ( '' !== previewPaddingBottom ? previewPaddingBottom + previewPaddingType : undefined ),
				paddingLeft: ( '' !== previewPaddingLeft ? previewPaddingLeft + previewPaddingType : undefined ),
				marginTop: ( previewMarginTop ? previewMarginTop + previewMarginType : undefined ),
				marginRight: ( previewMarginRight ? previewMarginRight + previewMarginType : undefined ),
				marginBottom: ( previewMarginBottom ? previewMarginBottom + previewMarginType : undefined ),
				marginLeft: ( previewMarginLeft ? previewMarginLeft + previewMarginType : undefined ),
			} }>
				<style>
					{ `.kb-countdown-container #kb-timer-${ uniqueID } .kb-countdown-date-item .kb-countdown-number {` }
					{ ( numberColor ? `color: ${ KadenceColorOutput( numberColor ) };` : '' ) }
					{ ( numberFont && numberFont[0] && numberFont[0].family ? `font-family: ${ numberFont[0].family };` : '' ) }
					{ ( numberFont && numberFont[0] && numberFont[0].textTransform ? `text-transform: ${ numberFont[0].textTransform };` : '' ) }
					{ ( numberFont && numberFont[0] && numberFont[0].weight ? `font-weight: ${ numberFont[0].weight };` : '' ) }
					{ ( numberFont && numberFont[0] && numberFont[0].style ? `font-style: ${ numberFont[0].style };` : '' ) }
					{ ( previewNumberFontSize ? `font-size: ${ previewNumberFontSize + previewNumberSizeType };` : '' ) }
					{ ( previewNumberLineSize ? `line-height: ${ previewNumberLineSize + previewNumberLineType };` : '' ) }
					{ ( previewNumberLetterSize ? `letter-spacing: ${  previewNumberLetterSize + previewNumberLetterType };` : '' ) }
					{ '}' }
					{ `.kb-countdown-container #kb-timer-${ uniqueID } .kb-countdown-date-item  {` }
					{ ( previewNumberFontSize ? `font-size: ${ previewNumberFontSize + previewNumberSizeType };` : '' ) }
					{ '}' }
					{ `#kb-timer-${ uniqueID } .kb-countdown-date-item .kb-countdown-label {` }
					{ ( labelColor ? `color: ${ KadenceColorOutput( labelColor ) };` : '' ) }
					{ ( labelFont && labelFont[0] && labelFont[0].family ? `font-family: ${ labelFont[0].family };` : '' ) }
					{ ( labelFont && labelFont[0] && labelFont[0].textTransform ? `text-transform: ${ labelFont[0].textTransform };` : '' ) }
					{ ( labelFont && labelFont[0] && labelFont[0].weight ? `font-weight: ${ labelFont[0].weight };` : '' ) }
					{ ( labelFont && labelFont[0] && labelFont[0].style ? `font-style: ${ labelFont[0].style };` : '' ) }
					{ ( previewLabelFontSize ? `font-size: ${ previewLabelFontSize + previewLabelSizeType };` : '' ) }
					{ ( previewLabelLineSize ? `line-height: ${ previewLabelLineSize + previewLabelLineType };` : '' ) }
					{ ( previewLabelLetterSize ? `letter-spacing: ${  previewLabelLetterSize + previewLabelLetterType };` : '' ) }
					{ '}' }
					{ '' !== preLabel && (
						<Fragment>
							{ `#kb-timer-${ uniqueID } .kb-countdown-item.kb-pre-timer {` }
							{ ( preLabelColor ? `color: ${ KadenceColorOutput( preLabelColor ) };` : '' ) }
							{ ( preLabelFont && preLabelFont[0] && preLabelFont[0].family ? `font-family: ${ preLabelFont[0].family };` : '' ) }
							{ ( preLabelFont && preLabelFont[0] && preLabelFont[0].textTransform ? `text-transform: ${ preLabelFont[0].textTransform };` : '' ) }
							{ ( preLabelFont && preLabelFont[0] && preLabelFont[0].weight ? `font-weight: ${ preLabelFont[0].weight };` : '' ) }
							{ ( preLabelFont && preLabelFont[0] && preLabelFont[0].style ? `font-style: ${ preLabelFont[0].style };` : '' ) }
							{ ( previewPreLabelFontSize ? `font-size: ${ previewPreLabelFontSize + previewPreLabelSizeType };` : '' ) }
							{ ( previewPreLabelLineSize ? `line-height: ${ previewPreLabelLineSize + previewPreLabelLineType };` : '' ) }
							{ ( previewPreLabelLetterSize ? `letter-spacing: ${  previewPreLabelLetterSize + previewPreLabelLetterType };` : '' ) }
							{ '}' }
						</Fragment>
					) }
					{ '' !== postLabel && (
						<Fragment>
							{ `#kb-timer-${ uniqueID } .kb-countdown-item.kb-post-timer {` }
							{ ( postLabelColor ? `color: ${ KadenceColorOutput( postLabelColor ) };` : '' ) }
							{ ( postLabelFont && postLabelFont[0] && postLabelFont[0].family ? `font-family: ${ postLabelFont[0].family };` : '' ) }
							{ ( postLabelFont && postLabelFont[0] && postLabelFont[0].textTransform ? `text-transform: ${ postLabelFont[0].textTransform };` : '' ) }
							{ ( postLabelFont && postLabelFont[0] && postLabelFont[0].weight ? `font-weight: ${ postLabelFont[0].weight };` : '' ) }
							{ ( postLabelFont && postLabelFont[0] && postLabelFont[0].style ? `font-style: ${ postLabelFont[0].style };` : '' ) }
							{ ( previewPostLabelFontSize ? `font-size: ${ previewPostLabelFontSize + previewPostLabelSizeType };` : '' ) }
							{ ( previewPostLabelLineSize ? `line-height: ${ previewPostLabelLineSize + previewPostLabelLineType };` : '' ) }
							{ ( previewPostLabelLetterSize ? `letter-spacing: ${  previewPostLabelLetterSize + previewPostLabelLetterType };` : '' ) }
							{ '}' }
						</Fragment>
					) }
					{ `.kb-countdown-container #kb-timer-${ uniqueID } .kb-countdown-date-item:not( .kb-countdown-divider-item ) {` }
					{ ( itemBackground ? `background: ${ KadenceColorOutput( itemBackground ) };` : '' ) }
					{ ( itemBorder ? `border-color: ${ KadenceColorOutput( itemBorder ) };` : '' ) }
					{ ( itemBorderRadius && itemBorderRadius[0] ? `border-top-left-radius: ${ itemBorderRadius[0] + 'px' };` : '' ) }
					{ ( itemBorderRadius && itemBorderRadius[1] ? `border-top-right-radius: ${ itemBorderRadius[1] + 'px' };` : '' ) }
					{ ( itemBorderRadius && itemBorderRadius[2] ? `border-bottom-right-radius: ${ itemBorderRadius[2] + 'px' };` : '' ) }
					{ ( itemBorderRadius && itemBorderRadius[3] ? `border-bottom-left-radius: ${ itemBorderRadius[3] + 'px' };` : '' ) }
					{ ( previewItemBorderTop ? `border-top-width: ${ previewItemBorderTop + 'px' };` : '' ) }
					{ ( previewItemBorderRight ? `border-right-width: ${ previewItemBorderRight + 'px' };` : '' ) }
					{ ( previewItemBorderBottom ? `border-bottom-width: ${ previewItemBorderBottom + 'px' };` : '' ) }
					{ ( previewItemBorderLeft ? `border-left-width: ${ previewItemBorderLeft + 'px' };` : '' ) }
					{ ( previewItemPaddingTop ? `padding-top: ${ previewItemPaddingTop + previewItemPaddingType };` : '' ) }
					{ ( previewItemPaddingRight ? `padding-right: ${ previewItemPaddingRight + previewItemPaddingType };` : '' ) }
					{ ( previewItemPaddingBottom ? `padding-bottom: ${ previewItemPaddingBottom + previewItemPaddingType };` : '' ) }
					{ ( previewItemPaddingLeft ? `padding-left: ${ previewItemPaddingLeft + previewItemPaddingType };` : '' ) }
					{ '}' }
					{ `.kb-countdown-container #kb-timer-${ uniqueID } .kb-countdown-date-item.kb-countdown-divider-item {` }
					{ ( previewItemBorderTop ? `border-top-width: ${ previewItemBorderTop + 'px' };` : '' ) }
					{ ( previewItemBorderBottom ? `border-bottom-width: ${ previewItemBorderBottom + 'px' };` : '' ) }
					{ ( previewItemPaddingTop ? `padding-top: ${ previewItemPaddingTop + previewItemPaddingType };` : '' ) }
					{ ( previewItemPaddingBottom ? `padding-bottom: ${ previewItemPaddingBottom + previewItemPaddingType };` : '' ) }
					{ '}' }
				</style>
				{ this.showSettings( 'allSettings' ) && (
					<Fragment>
						<BlockControls>
							{ enableTimer && (
								<AlignmentToolbar
									value={ ( undefined !== counterAlign && undefined !== counterAlign[0] ? counterAlign[0] : '' ) }
									onChange={ ( nextAlign ) => setAttributes( { counterAlign: [ nextAlign, ( undefined !== counterAlign && undefined !== counterAlign[1] ? counterAlign[1] : '' ), ( undefined !== counterAlign && undefined !== counterAlign[2] ? counterAlign[2] : '' ) ] } ) }
								/>
							) }
							{ 'message' === expireAction && (
								<Fragment>
									<ToolbarGroup>
										<Button
											className="components-tab-button"
											isPressed={ ! this.state.previewExpired }
											onClick={ () => this.setState( { previewExpired: false } ) }
										>
											<span>{ __( 'Live', 'kadence-blocks' ) }</span>
										</Button>
										<Button
											className="components-tab-button"
											isPressed={ this.state.previewExpired }
											onClick={ () => this.setState( { previewExpired: true } ) }
										>
											<span>{ __( 'Expired', 'kadence-blocks' ) }</span>
										</Button>
									</ToolbarGroup>
								</Fragment>
							) }
						</BlockControls>
						<InspectorControls>
							<Panel
								className={ 'components-panel__body is-opened' }
							>
								{ this.props.isNested && (
									<Fragment>
										<h2>{ __( 'Countdown Time Settings Synced to Parent Block', 'kadence-blocks' ) }</h2>
										<Button
											className="kb-select-parent-button"
											isSecondary
											onClick={ () => this.props.selectBlock( this.props.parentBlock.clientId ) }
										>
											<span>{ __( 'Edit Settings', 'kadence-blocks' ) }</span>
										</Button>
									</Fragment>
								) }
								{ ! this.props.isNested && (
									<Fragment>
										<SelectControl
											label={ __( 'Countdown Type', 'kadence-blocks' ) }
											options={ countdownTypes }
											value={ countdownType }
											onChange={ ( value ) => setAttributes( { countdownType: value } ) }
										/>
										{ 'date' === countdownType && (
											<div className="components-base-control">
												<DateTimePicker
													currentDate={ ( ! date ? undefined : date ) }
													onChange={ value => {
														saveDate( value );
													} }
													is12Hour={ is12HourTime }
													help={ __( 'Date set according to your sites timezone', 'kadence-blocks' ) }
												/>
											</div>
										) }
										{ 'evergreen' === countdownType && (
											<Fragment>
												<KadenceRange
													label={ __( 'Evergreen Hours', 'kadence-blocks' ) }
													value={ evergreenHours }
													onChange={ value => {
														saveEvergreenHours( value );
													} }
													min={ 0 }
													max={ 100 }
													step={ 1 }
												/>
												<KadenceRange
													label={ __( 'Evergreen Minutes', 'kadence-blocks' ) }
													value={ evergreenMinutes }
													onChange={ value => {
														saveEvergreenMinutes( value );
													} }
													min={ 0 }
													max={ 59 }
													step={ 1 }
												/>
												<TextControl
													label={ __( 'Campaign ID' ) }
													help={ __( 'Create a unique ID. To reset the timer for everyone change this id. To link with other timers give them all the same ID.', 'kadence-blocks' ) }
													value={ campaignID || '' }
													onChange={ ( nextValue ) => {
														nextValue = nextValue.replace( ANCHOR_REGEX, '-' );
														setAttributes( {
															campaignID: nextValue,
														} );
													} }
												/>
												<KadenceRange
													label={ __( 'Amount of days to wait until the evergreen is reset for visitors', 'kadence-blocks' ) }
													value={ evergreenReset }
													onChange={ value => {
														setAttributes( {
															evergreenReset: value,
														} );
													} }
													min={ 0 }
													max={ 100 }
													step={ 1 }
												/>
												<ToggleControl
													label={ __( 'Verify by IP Address', 'kadence-blocks' ) }
													checked={ evergreenStrict }
													onChange={ value => setAttributes( { evergreenStrict: value } ) }
													help={ __( 'This will add a delay to the rendering of the countdown if no cookie found as it will query the server database to see if the user can be found by their IP address', 'kadence-blocks' ) }
												/>
											</Fragment>
										) }
										<SelectControl
											label={ __( 'Action on Expire', 'kadence-blocks' ) }
											options={ countdownActions }
											value={ expireAction }
											onChange={ ( value ) => setAttributes( { expireAction: value } ) }
										/>
										{ 'redirect' === expireAction && (
											<Fragment>
												<URLInputControl
													label={ __( 'Redirect URL', 'kadence-blocks' ) }
													url={ redirectURL }
													onChangeUrl={ value => setAttributes( { redirectURL: value } ) }
													additionalControls={false}
													{ ...this.props }
												/>
											</Fragment>
										) }
										{ expireAction && 'none' !== expireAction && (
											<ToggleControl
												label={ __( 'Reveal onLoad', 'kadence-blocks' ) }
												checked={ revealOnLoad }
												onChange={ value => setAttributes( { revealOnLoad: value } ) }
											/>
										) }
									</Fragment>
								) }
							</Panel>
							<KadencePanelBody
								title={ __( 'Countdown Layout', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-countdown-layout' }
							>
								{ expireAction && 'none' !== expireAction && (
									<ToggleControl
										label={ __( 'Display Countdown', 'kadence-blocks' ) }
										checked={ enableTimer }
										onChange={ value => setAttributes( { enableTimer: value } ) }
									/>
								) }
								{ enableTimer && (
									<Fragment>
										<ResponsiveAlignControls
											label={ __( 'Countdown Alignment', 'kadence-blocks' ) }
											value={ ( undefined !== counterAlign && undefined !== counterAlign[0] ? counterAlign[0] : '' ) }
											tabletValue={ ( undefined !== counterAlign && undefined !== counterAlign[1] ? counterAlign[1] : '' ) }
											mobileValue={ ( undefined !== counterAlign && undefined !== counterAlign[2] ? counterAlign[2] : '' ) }
											onChange={ ( nextAlign ) => setAttributes( { counterAlign: [ nextAlign, ( undefined !== counterAlign && undefined !== counterAlign[1] ? counterAlign[1] : '' ), ( undefined !== counterAlign && undefined !== counterAlign[2] ? counterAlign[2] : '' ) ] } ) }
											onChangeTablet={ ( nextAlign ) => setAttributes( { counterAlign: [ ( undefined !== counterAlign && undefined !== counterAlign[0] ? counterAlign[0] : '' ),  nextAlign, ( undefined !== counterAlign && undefined !== counterAlign[2] ? counterAlign[2] : '' ) ] } ) }
											onChangeMobile={ ( nextAlign ) => setAttributes( { counterAlign: [ ( undefined !== counterAlign && undefined !== counterAlign[0] ? counterAlign[0] : '' ), ( undefined !== counterAlign && undefined !== counterAlign[1] ? counterAlign[1] : '' ), nextAlign ] } ) }
										/>
										<KadenceRadioButtons
											label={ __( 'Countdown Layout', 'kadence-blocks' ) }
											value={ timerLayout }
											options={ [
												{ value: 'block', label: __( 'Block', 'kadence-blocks' ) },
												{ value: 'inline', label: __( 'Inline', 'kadence-blocks' ) },
											] }
											onChange={ value => setAttributes( { timerLayout: value } ) }
										/>
										{ 'inline' !== timerLayout && (
											<ToggleControl
												label={ __( 'Enable Divider', 'kadence-blocks' ) }
												checked={ countdownDivider }
												onChange={ value => setAttributes( { countdownDivider: value } ) }
											/>
										) }
										<ToggleControl
											label={ __( 'Enable 00 Number format', 'kadence-blocks' ) }
											checked={ timeNumbers }
											onChange={ value => setAttributes( { timeNumbers: value } ) }
										/>
										<TextControl
											label={ __( 'Countdown Pre Text' ) }
											value={ preLabel }
											onChange={ value => setAttributes( { preLabel: value } ) }
										/>
										<TextControl
											label={ __( 'Countdown Post Text' ) }
											value={ postLabel }
											onChange={ value => setAttributes( { postLabel: value } ) }
										/>
										<ToggleControl
											label={ __( 'Display Days Unit', 'kadence-blocks' ) }
											checked={ undefined !== units && undefined !== units[ 0 ] && undefined !== units[ 0 ].days ? units[ 0 ].days : true }
											onChange={ value => saveUnits( { days: value } ) }
										/>
										{ undefined !== units && undefined !== units[ 0 ] && undefined !== units[ 0 ].days && ! units[ 0 ].days && (
											<Fragment>
												<ToggleControl
													label={ __( 'Hours', 'kadence-blocks' ) }
													checked={ undefined !== units && undefined !== units[ 0 ] && undefined !== units[ 0 ].hours ? units[ 0 ].hours : true }
													onChange={ value => saveUnits( { hours: value } ) }
												/>
												{ undefined !== units && undefined !== units[ 0 ] && undefined !== units[ 0 ].hours && ! units[ 0 ].hours && (
													<Fragment>
														<ToggleControl
															label={ __( 'Minutes', 'kadence-blocks' ) }
															checked={ undefined !== units && undefined !== units[ 0 ] && undefined !== units[ 0 ].minutes ? units[ 0 ].minutes : true }
															onChange={ value => saveUnits( { minutes: value } ) }
														/>
													</Fragment>
												) }
											</Fragment>
										) }
										<h2>{ __( 'Labels', 'kadence-blocks' ) }</h2>
										<TextControl
											label={ __( 'Days Label' ) }
											value={ daysLabel }
											onChange={ value => setAttributes( { daysLabel: value } ) }
										/>
										<TextControl
											label={ __( 'Hours Label' ) }
											value={ hoursLabel }
											onChange={ value => setAttributes( { hoursLabel: value } ) }
										/>
										<TextControl
											label={ __( 'Minutes Label' ) }
											value={ minutesLabel }
											onChange={ value => setAttributes( { minutesLabel: value } ) }
										/>
										<TextControl
											label={ __( 'Seconds Label' ) }
											value={ secondsLabel }
											onChange={ value => setAttributes( { secondsLabel: value } ) }
										/>
									</Fragment>
								) }
							</KadencePanelBody>
							{ enableTimer && (
								<KadencePanelBody
									title={ __( 'Count Item Settings', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-countdown-item-settings' }
								>
									<PopColorControl
										label={ __( 'Background Color', 'kadence-blocks' ) }
										value={ ( itemBackground ? itemBackground : '' ) }
										default={ '' }
										onChange={ value => setAttributes( { itemBackground: value } ) }
									/>
									<PopColorControl
										label={ __( 'Border Color', 'kadence-blocks' ) }
										value={ ( itemBorder ? itemBorder : '' ) }
										default={ '' }
										onChange={ value => setAttributes( { itemBorder: value } ) }
									/>
									<ResponsiveMeasurementControls
										label={ __( 'Border Width', 'kadence-blocks' ) }
										value={ itemBorderWidth }
										control={ itemBorderWidthControl }
										tabletValue={ itemTabletBorderWidth }
										mobileValue={ itemMobileBorderWidth }
										onChange={ ( value ) => setAttributes( { itemBorderWidth: value } ) }
										onChangeTablet={ ( value ) => setAttributes( { itemTabletBorderWidth: value } ) }
										onChangeMobile={ ( value ) => setAttributes( { itemMobileBorderWidth: value } ) }
										onChangeControl={ ( value ) => this.setState( { itemBorderWidthControl: value } ) }
										min={ 0 }
										max={ 40 }
										step={ 1 }
										unit={ 'px' }
										units={ [ 'px' ] }
										showUnit={ true }
										preset={ [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }
									/>
									<MeasurementControls
										label={ __( 'Border Radius', 'kadence-blocks' ) }
										measurement={ itemBorderRadius }
										control={ itemBorderRadiusControl }
										onChange={ ( value ) => setAttributes( { itemBorderRadius: value } ) }
										onControl={ ( value ) => this.setState( { itemBorderRadiusControl: value } ) }
										min={ 0 }
										max={ 200 }
										step={ 1 }
										controlTypes={ [
											{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: icons.radiuslinked },
											{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: icons.radiusindividual },
										] }
										firstIcon={ icons.topleft }
										secondIcon={ icons.topright }
										thirdIcon={ icons.bottomright }
										fourthIcon={ icons.bottomleft }
									/>
									<ResponsiveMeasurementControls
										label={ __( 'Padding', 'kadence-blocks' ) }
										value={ itemPadding }
										control={ itemPaddingControl }
										tabletValue={ itemTabletPadding }
										mobileValue={ itemMobilePadding }
										onChange={ ( value ) => setAttributes( { itemPadding: value } ) }
										onChangeTablet={ ( value ) => setAttributes( { itemTabletPadding: value } ) }
										onChangeMobile={ ( value ) => setAttributes( { itemMobilePadding: value } ) }
										onChangeControl={ ( value ) => this.setState( { itemPaddingControl: value } ) }
										min={ itemPaddingMin }
										max={ itemPaddingMax }
										step={ itemPaddingStep }
										unit={ itemPaddingType }
										units={ [ 'px', 'em', 'rem', '%' ] }
										onUnit={ ( value ) => setAttributes( { itemPaddingType: value } ) }
									/>
								</KadencePanelBody>
							) }
							{ enableTimer && (
								<KadencePanelBody
									title={ __( 'Number Settings', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-countdown-number-settings' }
								>
									<PopColorControl
										label={ __( 'Color', 'kadence-blocks' ) }
										value={ ( numberColor ? numberColor : '' ) }
										default={ '' }
										onChange={ value => setAttributes( { numberColor: value } ) }
									/>
									<TypographyControls
										fontGroup={ 'number-item' }
										fontSize={ numberFont[ 0 ].size }
										onFontSize={ ( value ) => saveNumberFont( { size: value } ) }
										fontSizeType={ numberFont[ 0 ].sizeType }
										onFontSizeType={ ( value ) => saveNumberFont( { sizeType: value } ) }
										lineHeight={ numberFont[ 0 ].lineHeight }
										onLineHeight={ ( value ) => saveNumberFont( { lineHeight: value } ) }
										lineHeightType={ numberFont[ 0 ].lineType }
										onLineHeightType={ ( value ) => saveNumberFont( { lineType: value } ) }
										reLetterSpacing={ numberFont[ 0 ].letterSpacing }
										onLetterSpacing={ ( value ) => saveNumberFont( { letterSpacing: value } ) }
										letterSpacingType={ numberFont[ 0 ].letterType }
										onLetterSpacingType={ ( value ) => saveNumberFont( { letterType: value } ) }
										textTransform={ numberFont[ 0 ].textTransform }
										onTextTransform={ ( value ) => saveNumberFont( { textTransform: value } ) }
										fontFamily={ numberFont[ 0 ].family }
										onFontFamily={ ( value ) => saveNumberFont( { family: value } ) }
										onFontChange={ ( select ) => {
											saveNumberFont( {
												family: select.value,
												google: select.google,
											} );
										} }
										onFontArrayChange={ ( values ) => saveNumberFont( values ) }
										googleFont={ numberFont[ 0 ].google }
										onGoogleFont={ ( value ) => saveNumberFont( { google: value } ) }
										loadGoogleFont={ numberFont[ 0 ].loadGoogle }
										onLoadGoogleFont={ ( value ) => saveNumberFont( { loadGoogle: value } ) }
										fontVariant={ numberFont[ 0 ].variant }
										onFontVariant={ ( value ) => saveNumberFont( { variant: value } ) }
										fontWeight={ numberFont[ 0 ].weight }
										onFontWeight={ ( value ) => saveNumberFont( { weight: value } ) }
										fontStyle={ numberFont[ 0 ].style }
										onFontStyle={ ( value ) => saveNumberFont( { style: value } ) }
										fontSubset={ numberFont[ 0 ].subset }
										onFontSubset={ ( value ) => saveNumberFont( { subset: value } ) }
									/>
								</KadencePanelBody>
							) }
							{ enableTimer && (
								<KadencePanelBody
									title={ __( 'Label Settings', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-countdown-label-settings' }
								>
									<PopColorControl
										label={ __( 'Color', 'kadence-blocks' ) }
										value={ ( labelColor ? labelColor : '' ) }
										default={ '' }
										onChange={ value => setAttributes( { labelColor: value } ) }
									/>
									<TypographyControls
										fontGroup={ 'label-item' }
										fontSize={ labelFont[ 0 ].size }
										onFontSize={ ( value ) => saveLabelFont( { size: value } ) }
										fontSizeType={ labelFont[ 0 ].sizeType }
										onFontSizeType={ ( value ) => saveLabelFont( { sizeType: value } ) }
										lineHeight={ labelFont[ 0 ].lineHeight }
										onLineHeight={ ( value ) => saveLabelFont( { lineHeight: value } ) }
										lineHeightType={ labelFont[ 0 ].lineType }
										onLineHeightType={ ( value ) => saveLabelFont( { lineType: value } ) }
										reLetterSpacing={ labelFont[ 0 ].letterSpacing }
										onLetterSpacing={ ( value ) => saveLabelFont( { letterSpacing: value } ) }
										letterSpacingType={ labelFont[ 0 ].letterType }
										onLetterSpacingType={ ( value ) => saveLabelFont( { letterType: value } ) }
										textTransform={ labelFont[ 0 ].textTransform }
										onTextTransform={ ( value ) => saveLabelFont( { textTransform: value } ) }
										fontFamily={ labelFont[ 0 ].family }
										onFontFamily={ ( value ) => saveLabelFont( { family: value } ) }
										onFontChange={ ( select ) => {
											saveLabelFont( {
												family: select.value,
												google: select.google,
											} );
										} }
										onFontArrayChange={ ( values ) => saveLabelFont( values ) }
										googleFont={ labelFont[ 0 ].google }
										onGoogleFont={ ( value ) => saveLabelFont( { google: value } ) }
										loadGoogleFont={ labelFont[ 0 ].loadGoogle }
										onLoadGoogleFont={ ( value ) => saveLabelFont( { loadGoogle: value } ) }
										fontVariant={ labelFont[ 0 ].variant }
										onFontVariant={ ( value ) => saveLabelFont( { variant: value } ) }
										fontWeight={ labelFont[ 0 ].weight }
										onFontWeight={ ( value ) => saveLabelFont( { weight: value } ) }
										fontStyle={ labelFont[ 0 ].style }
										onFontStyle={ ( value ) => saveLabelFont( { style: value } ) }
										fontSubset={ labelFont[ 0 ].subset }
										onFontSubset={ ( value ) => saveLabelFont( { subset: value } ) }
									/>
								</KadencePanelBody>
							) }
							{ enableTimer && '' !== preLabel && (
								<KadencePanelBody
									title={ __( 'Pre Text', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-countdown-pre-text' }
								>
									<PopColorControl
										label={ __( 'Color', 'kadence-blocks' ) }
										value={ ( preLabelColor ? preLabelColor : '' ) }
										default={ '' }
										onChange={ value => setAttributes( { preLabelColor: value } ) }
									/>
									<TypographyControls
										fontGroup={ 'prelabel-item' }
										fontSize={ preLabelFont[ 0 ].size }
										onFontSize={ ( value ) => savePreFont( { size: value } ) }
										fontSizeType={ preLabelFont[ 0 ].sizeType }
										onFontSizeType={ ( value ) => savePreFont( { sizeType: value } ) }
										lineHeight={ preLabelFont[ 0 ].lineHeight }
										onLineHeight={ ( value ) => savePreFont( { lineHeight: value } ) }
										lineHeightType={ preLabelFont[ 0 ].lineType }
										onLineHeightType={ ( value ) => savePreFont( { lineType: value } ) }
										reLetterSpacing={ preLabelFont[ 0 ].letterSpacing }
										onLetterSpacing={ ( value ) => savePreFont( { letterSpacing: value } ) }
										letterSpacingType={ preLabelFont[ 0 ].letterType }
										onLetterSpacingType={ ( value ) => savePreFont( { letterType: value } ) }
										textTransform={ preLabelFont[ 0 ].textTransform }
										onTextTransform={ ( value ) => savePreFont( { textTransform: value } ) }
										fontFamily={ preLabelFont[ 0 ].family }
										onFontFamily={ ( value ) => savePreFont( { family: value } ) }
										onFontChange={ ( select ) => {
											savePreFont( {
												family: select.value,
												google: select.google,
											} );
										} }
										onFontArrayChange={ ( values ) => savePreFont( values ) }
										googleFont={ preLabelFont[ 0 ].google }
										onGoogleFont={ ( value ) => savePreFont( { google: value } ) }
										loadGoogleFont={ preLabelFont[ 0 ].loadGoogle }
										onLoadGoogleFont={ ( value ) => savePreFont( { loadGoogle: value } ) }
										fontVariant={ preLabelFont[ 0 ].variant }
										onFontVariant={ ( value ) => savePreFont( { variant: value } ) }
										fontWeight={ preLabelFont[ 0 ].weight }
										onFontWeight={ ( value ) => savePreFont( { weight: value } ) }
										fontStyle={ preLabelFont[ 0 ].style }
										onFontStyle={ ( value ) => savePreFont( { style: value } ) }
										fontSubset={ preLabelFont[ 0 ].subset }
										onFontSubset={ ( value ) => savePreFont( { subset: value } ) }
									/>
								</KadencePanelBody>
							) }
							{ enableTimer && '' !== postLabel && (
								<KadencePanelBody
									title={ __( 'Post Text', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-countdown-post-text' }
								>
									<PopColorControl
										label={ __( 'Color', 'kadence-blocks' ) }
										value={ ( postLabelColor ? postLabelColor : '' ) }
										default={ '' }
										onChange={ value => setAttributes( { postLabelColor: value } ) }
									/>
									<TypographyControls
										fontGroup={ 'postlabel-item' }
										fontSize={ postLabelFont[ 0 ].size }
										onFontSize={ ( value ) => savePostFont( { size: value } ) }
										fontSizeType={ postLabelFont[ 0 ].sizeType }
										onFontSizeType={ ( value ) => savePostFont( { sizeType: value } ) }
										lineHeight={ postLabelFont[ 0 ].lineHeight }
										onLineHeight={ ( value ) => savePostFont( { lineHeight: value } ) }
										lineHeightType={ postLabelFont[ 0 ].lineType }
										onLineHeightType={ ( value ) => savePostFont( { lineType: value } ) }
										reLetterSpacing={ postLabelFont[ 0 ].letterSpacing }
										onLetterSpacing={ ( value ) => savePostFont( { letterSpacing: value } ) }
										letterSpacingType={ postLabelFont[ 0 ].letterType }
										onLetterSpacingType={ ( value ) => savePostFont( { letterType: value } ) }
										textTransform={ postLabelFont[ 0 ].textTransform }
										onTextTransform={ ( value ) => savePostFont( { textTransform: value } ) }
										fontFamily={ postLabelFont[ 0 ].family }
										onFontFamily={ ( value ) => savePostFont( { family: value } ) }
										onFontChange={ ( select ) => {
											savePostFont( {
												family: select.value,
												google: select.google,
											} );
										} }
										onFontArrayChange={ ( values ) => savePostFont( values ) }
										googleFont={ postLabelFont[ 0 ].google }
										onGoogleFont={ ( value ) => savePostFont( { google: value } ) }
										loadGoogleFont={ postLabelFont[ 0 ].loadGoogle }
										onLoadGoogleFont={ ( value ) => savePostFont( { loadGoogle: value } ) }
										fontVariant={ postLabelFont[ 0 ].variant }
										onFontVariant={ ( value ) => savePostFont( { variant: value } ) }
										fontWeight={ postLabelFont[ 0 ].weight }
										onFontWeight={ ( value ) => savePostFont( { weight: value } ) }
										fontStyle={ postLabelFont[ 0 ].style }
										onFontStyle={ ( value ) => savePostFont( { style: value } ) }
										fontSubset={ postLabelFont[ 0 ].subset }
										onFontSubset={ ( value ) => savePostFont( { subset: value } ) }
									/>
								</KadencePanelBody>
							) }
							<KadencePanelBody
								title={ __( 'Container Settings', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-coutdown-container-settings' }
							>
								{ this.showSettings( 'container' ) && (
									<Fragment>
										<PopColorControl
											label={ __( 'Background Color', 'kadence-blocks' ) }
											value={ ( background ? background : '' ) }
											default={ '' }
											onChange={ value => setAttributes( { background: value } ) }
										/>
										<PopColorControl
											label={ __( 'Border Color', 'kadence-blocks' ) }
											value={ ( border ? border : '' ) }
											default={ '' }
											onChange={ value => setAttributes( { border: value } ) }
										/>
										<ResponsiveMeasurementControls
											label={ __( 'Border Width', 'kadence-blocks' ) }
											value={ borderWidth }
											control={ borderWidthControl }
											tabletValue={ tabletBorderWidth }
											mobileValue={ mobileBorderWidth }
											onChange={ ( value ) => setAttributes( { borderWidth: value } ) }
											onChangeTablet={ ( value ) => setAttributes( { tabletBorderWidth: value } ) }
											onChangeMobile={ ( value ) => setAttributes( { mobileBorderWidth: value } ) }
											onChangeControl={ ( value ) => this.setState( { borderWidthControl: value } ) }
											min={ 0 }
											max={ 40 }
											step={ 1 }
											unit={ 'px' }
											units={ [ 'px' ] }
											showUnit={ true }
											preset={ [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }
										/>
										<MeasurementControls
											label={ __( 'Border Radius', 'kadence-blocks' ) }
											measurement={ borderRadius }
											control={ borderRadiusControl }
											onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
											onControl={ ( value ) => this.setState( { borderRadiusControl: value } ) }
											min={ 0 }
											max={ 200 }
											step={ 1 }
											controlTypes={ [
												{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: icons.radiuslinked },
												{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: icons.radiusindividual },
											] }
											firstIcon={ icons.topleft }
											secondIcon={ icons.topright }
											thirdIcon={ icons.bottomright }
											fourthIcon={ icons.bottomleft }
										/>
										<ResponsiveMeasurementControls
											label={ __( 'Container Padding', 'kadence-blocks' ) }
											value={ containerPadding }
											control={ paddingControl }
											tabletValue={ containerTabletPadding }
											mobileValue={ containerMobilePadding }
											onChange={ ( value ) => setAttributes( { containerPadding: value } ) }
											onChangeTablet={ ( value ) => setAttributes( { containerTabletPadding: value } ) }
											onChangeMobile={ ( value ) => setAttributes( { containerMobilePadding: value } ) }
											onChangeControl={ ( value ) => this.setState( { paddingControl: value } ) }
											min={ paddingMin }
											max={ paddingMax }
											step={ paddingStep }
											unit={ paddingType }
											units={ [ 'px', 'em', 'rem', '%' ] }
											onUnit={ ( value ) => setAttributes( { paddingType: value } ) }
										/>
										<ResponsiveMeasurementControls
											label={ __( 'Container Margin', 'kadence-blocks' ) }
											value={ containerMargin }
											control={ marginControl }
											tabletValue={ containerTabletMargin }
											mobileValue={ containerMobileMargin }
											onChange={ ( value ) => setAttributes( { containerMargin: value } ) }
											onChangeTablet={ ( value ) => setAttributes( { containerTabletMargin: value } ) }
											onChangeMobile={ ( value ) => setAttributes( { containerMobileMargin: value } ) }
											onChangeControl={ ( value ) => this.setState( { marginControl: value } ) }
											min={ marginMin }
											max={ marginMax }
											step={ marginStep }
											unit={ marginType }
											units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
											onUnit={ ( value ) => setAttributes( { marginType: value } ) }
										/>
									</Fragment>
								) }
							</KadencePanelBody>
							<KadencePanelBody
								title={ __( 'Visibility Settings', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-countdown-visibility-settings' }
							>
								<ToggleControl
									label={ __( 'Hide on Desktop', 'kadence-blocks' ) }
									checked={ ( undefined !== vsdesk ? vsdesk : false ) }
									onChange={ ( value ) => setAttributes( { vsdesk: value } ) }
								/>
								<ToggleControl
									label={ __( 'Hide on Tablet', 'kadence-blocks' ) }
									checked={ ( undefined !== vstablet ? vstablet : false ) }
									onChange={ ( value ) => setAttributes( { vstablet: value } ) }
								/>
								<ToggleControl
									label={ __( 'Hide on Mobile', 'kadence-blocks' ) }
									checked={ ( undefined !== vsmobile ? vsmobile : false ) }
									onChange={ ( value ) => setAttributes( { vsmobile: value } ) }
								/>
							</KadencePanelBody>
						</InspectorControls>
					</Fragment>
				) }
				{ undefined !== numberFont && undefined !== numberFont[0] && undefined !== numberFont[0].family && '' !== numberFont[0].family && numberFont[0].google && (
					<WebfontLoader config={ numberConfig }>
					</WebfontLoader>
				) }
				{ undefined !== labelFont && undefined !== labelFont[0] && undefined !== labelFont[0].family && '' !== labelFont[0].family && labelFont[0].google && (
					<WebfontLoader config={ labelConfig }>
					</WebfontLoader>
				) }
				{ '' !== preLabel && undefined !== preLabelFont && undefined !== preLabelFont[0] && undefined !== preLabelFont[0].family && '' !== preLabelFont[0].family && preLabelFont[0].google && (
					<WebfontLoader config={ preLabelConfig }>
					</WebfontLoader>
				) }
				{ '' !== postLabel && undefined !== postLabelFont && undefined !== postLabelFont[0] && undefined !== postLabelFont[0].family && '' !== postLabelFont[0].family && postLabelFont[0].google && (
					<WebfontLoader config={ postLabelConfig }>
					</WebfontLoader>
				) }
				<InnerBlocks
					templateLock='all'
					template={ ! enableTimer ? templateNoTimer : templateWithTimer }
				/>
			</div>
		);
	}
}
export default compose( [
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps;
		let isNested = false;
		const {
			getBlock,
			getBlockParentsByBlockName,
		} = select( 'core/block-editor' );
		const parentBlocks = getBlockParentsByBlockName( clientId, 'kadence/countdown' );
		if ( parentBlocks.length && undefined !== parentBlocks[0] && '' !== parentBlocks[0] ) {
			isNested = true;
		}
		return {
			isNested: isNested,
			parentBlock: ( isNested ? getBlock( parentBlocks[0] ) : '' ),
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
	withDispatch( ( dispatch, { clientId } ) => {
		const { selectBlock } = dispatch( blockEditorStore );
		return {
			selectBlock: ( id ) => selectBlock( id ),
		};
	} ),
] )( KadenceCountdown );
