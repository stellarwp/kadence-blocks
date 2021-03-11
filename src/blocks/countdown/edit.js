/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from '../../icons';
import MeasurementControls from '../../measurement-control';
import BoxShadowControl from '../../box-shadow-control';
import classnames from 'classnames';
import KadenceFocalPicker from '../../kadence-focal-picker';
import KadenceMediaPlaceholder from '../../kadence-media-placeholder';
import AdvancedPopColorControl from '../../advanced-pop-color-control';
import KadenceRadioButtons from '../../kadence-radio-buttons';
import KadenceColorOutput from '../../kadence-color-output';
import ResponsiveMeasurementControls from '../../components/measurement/responsive-measurement-control';
import ResponsiveAlignControls from '../../components/align/responsive-align-control';

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
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
const {
	InnerBlocks,
	MediaUpload,
	BlockControls,
	InspectorAdvancedControls,
	InspectorControls,
} = wp.blockEditor;
import {
	Dashicon,
	PanelBody,
	Panel,
	ToggleControl,
	Button,
	DateTimePicker,
	Tooltip,
	SelectControl,
	ToolbarGroup,
} from '@wordpress/components';
const ALLOWED_MEDIA_TYPES = [ 'image' ];
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktcountdownUniqueIDs = [];
const COUNTDOWN_TEMPLATE = [
    [ 'core/paragraph', { placeholder: 'Above' } ],
    [ 'kadence/countdown-timer', {} ],
    [ 'core/paragraph', { placeholder: 'Below' } ],
];
const COUNTDOWN_NO_TIMER = [
    [ 'core/paragraph', { placeholder: 'Above' } ],
];
const ALLOWED_BLOCKS = [ 'kadence/countdown-timer', 'core/paragraph' ];
const typeOptions = [
	{ value: 'date', label: __( 'Date', 'kadence-blocks' ), disabled: false },
	{ value: 'evergreen', label: __( 'Evergreen (Pro addon)', 'kadence-blocks' ), disabled: true },
];

/**
 * Build the spacer edit
 */
class KadenceCountdown extends Component {
	constructor() {
		super( ...arguments );
		this.showSettings = this.showSettings.bind( this );
		this.getPreviewSize = this.getPreviewSize.bind( this );
		this.state = {
			borderWidthControl: 'individual',
			borderRadiusControl: 'individual',
			paddingControl: 'individual',
			marginControl: 'individual',
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
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
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
            newDate.setDate( today.getDate() + 1 );
            this.props.setAttributes( { date: newDate, timezone: ( timezone && timezone.abbr ? timezone.abbr : '' ), timeOffset: settings.timezone.offset  } );
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
	render() {
		const { attributes: { uniqueID, expireAction, units, enableTimer, layout, timerLayout, date, timestamp, timezone, timeOffset, daysLabel, hoursLabel, minutesLabel, secondsLabel, counterAlign, numberColor, numberSize, numberSizeType, numberLineHeight, numberLineType, numberLetterSpacing, numberLetterType, numberTypography, numberGoogleFont, numberLoadGoogleFont, numberFontSubset, numberFontVariant, numberFontWeight, numberFontStyle, numberTextTransform, labelColor, labelSize, labelSizeType, labelLineHeight, labelLineType, labelLetterSpacing, labelLetterType, labelTypography, labelGoogleFont, labelLoadGoogleFont, labelFontSubset, labelFontVariant, labelFontWeight, labelFontStyle, labelTextTransform, border, borderRadius, borderWidth, mobileBorderWidth, tabletBorderWidth, backgroundImg, background, vsdesk, vstablet, vsmobile, countdownType, paddingType, marginType, mobilePadding, tabletPadding, padding, mobileMargin, tabletMargin, margin }, setAttributes, className, clientId } = this.props;
		const { previewExpired, borderWidthControl, borderRadiusControl, paddingControl, marginControl } = this.state;
		const countdownTypes = applyFilters( 'kadence.countdownTypes', typeOptions );
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
		console.log( settings.timezone );
		const saveBackgroundImage = ( value ) => {
			const newUpdate = backgroundImg.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				backgroundImg: newUpdate,
			} );
		};
		const onRemoveBGImage = () => {
			saveBackgroundImage( {
				bgImgID: '',
				bgImg: '',
			} );
		};
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
		const getTimestamp = ( value, theTimeOffset ) => {
			const userTimezoneOffset = -1 * ( new Date().getTimezoneOffset() / 60 );
			if ( Number( theTimeOffset ) === userTimezoneOffset ) {
				return new Date( value ).getTime();
			}
			return timezoneShifter( value, theTimeOffset );
		};
		function timezoneShifter( value, theTimeOffset ) {
			// Get the timezone offset of current site user.
			const userTimezoneOffset = -1 * ( new Date().getTimezoneOffset() / 60 );
			// Get the difference in offset from the sites set timezone.
			const shiftDiff = ( userTimezoneOffset - theTimeOffset );
			// Get the date in the timezone of the user.
			const currentDate = new Date( value );
			// Shift that date the difference in timezones from the user to the site.
			return new Date( currentDate.getTime() + ( shiftDiff * 60 * 60 * 1000 ) ).getTime();
		};
		const saveDate = ( value ) => {
			const theTimezone = ( settings.timezone && settings.timezone.string ? settings.timezone.string : '' );
			const theTimeOffset = ( settings.timezone && settings.timezone.offset ? settings.timezone.offset : 0 );
			const theSiteTimezoneTimestamp = getTimestamp( value, theTimeOffset );
			setAttributes( {
				date: value,
				timestamp: theSiteTimezoneTimestamp,
				timezone: theTimezone,
				timeOffset: theTimeOffset,
			} );
		};
		// const marginMin = ( marginType === 'em' || marginType === 'rem' ? -2 : -200 );
		// const marginMax = ( marginType === 'em' || marginType === 'rem' ? 12 : 200 );
		// const marginStep = ( marginType === 'em' || marginType === 'rem' ? 0.1 : 1 );
		// const paddingMin = ( paddingType === 'em' || paddingType === 'rem' ? 0 : 0 );
		// const paddingMax = ( paddingType === 'em' || paddingType === 'rem' ? 12 : 200 );
		// const paddingStep = ( paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1 );
		// const previewPaddingType = ( undefined !== paddingType ? paddingType : 'px' );
		// const previewMarginType = ( undefined !== marginType ? marginType : 'px' );
		// const previewMarginTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== topMargin ? topMargin : '' ), ( undefined !== topMarginT ? topMarginT : '' ), ( undefined !== topMarginM ? topMarginM : '' ) );
		// const previewMarginRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== rightMargin ? rightMargin : '' ), ( undefined !== rightMarginT ? rightMarginT : '' ), ( undefined !== rightMarginM ? rightMarginM : '' ) );
		// const previewMarginBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== bottomMargin ? bottomMargin : '' ), ( undefined !== bottomMarginT ? bottomMarginT : '' ), ( undefined !== bottomMarginM ? bottomMarginM : '' ) );
		// const previewMarginLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== leftMargin ? leftMargin : '' ), ( undefined !== leftMarginT ? leftMarginT : '' ), ( undefined !== leftMarginM ? leftMarginM : '' ) );
		// const previewPaddingTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== topPadding ? topPadding : '' ), ( undefined !== topPaddingT ? topPaddingT : '' ), ( undefined !== topPaddingM ? topPaddingM : '' ) );
		// const previewPaddingRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== rightPadding ? rightPadding : '' ), ( undefined !== rightPaddingT ? rightPaddingT : '' ), ( undefined !== rightPaddingM ? rightPaddingM : '' ) );
		// const previewPaddingBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== bottomPadding ? bottomPadding : '' ), ( undefined !== bottomPaddingT ? bottomPaddingT : '' ), ( undefined !== bottomPaddingM ? bottomPaddingM : '' ) );
		// const previewPaddingLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== leftPadding ? leftPadding : '' ), ( undefined !== leftPaddingT ? leftPaddingT : '' ), ( undefined !== leftPaddingM ? leftPaddingM : '' ) );
		// const previewBorderTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== borderWidth ? borderWidth[ 0 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 0 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 0 ] : '' ) );
		// const previewBorderRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== borderWidth ? borderWidth[ 1 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 1 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 1 ] : '' ) );
		// const previewBorderBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== borderWidth ? borderWidth[ 2 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 2 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 2 ] : '' ) );
		// const previewBorderLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== borderWidth ? borderWidth[ 3 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 3 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 3 ] : '' ) );
		// const previewAlign = this.getPreviewSize( this.props.getPreviewDevice, ( counterAlign && counterAlign[ 0 ] ? counterAlign[ 0 ] : '' ) , ( counterAlign && counterAlign[ 1 ] ? counterAlign[ 1 ] : '' ), ( counterAlign && counterAlign[ 2 ] ? counterAlign[ 2 ] : '' ) );
		// const backgroundString = ( background ? KadenceColorOutput( background ) : 'transparent' );
		// const borderString = ( border ? KadenceColorOutput( border ) : 'transparent' );
		const hasChildBlocks = wp.data.select( 'core/block-editor' ).getBlockOrder( clientId ).length > 0;
		const classes = classnames( {
			'kb-countdown-container': true,
			[ `kb-countdown-container-${ uniqueID }` ]: uniqueID,
			'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
			'kvs-md-false': vstablet !== 'undefined' && vstablet,
			'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
			[ className ]: className,
		} );
		// const layoutOptions = [
		// 	[
		// 		{
		// 			icon: blockIcons.oneColumns,
		// 			title: __( 'Rows', 'kadence-blocks' ),
		// 			isActive: ( 'rows' === layout ? true : false ),
		// 			onClick: () => setAttributes( { layout: 'rows' } ),
		// 		},
		// 	],
		// 	[
		// 		{
		// 			icon: blockIcons.twoColumns,
		// 			title: __( 'Two columns', 'kadence-blocks' ),
		// 			isActive: ( 'left-column' === layout ? true : false ),
		// 			onClick: () => setAttributes( { layout: 'left-column' } ),
		// 		},
		// 	],
		// 	[
		// 		{
		// 			icon: blockIcons.threeColumns,
		// 			title: __( 'Right Column', 'kadence-blocks' ),
		// 			isActive: ( 'right-column' === layout ? true : false ),
		// 			onClick: () => setAttributes( { layout: 'right-column' } ),
		// 		},
		// 	],
		// ];
		const hasBackgroundImage = ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? true : false );
		return (
			<div className={ classes }>
				{/* { ( textColor || linkColor || linkHoverColor || zIndex ) && (
					<style>
						{ ( zIndex ? `.kadence-column-${ uniqueID } { z-index: ${ zIndex }; }` : '' ) }
						{ ( textColor ? `.kadence-column-${ uniqueID }, .kadence-column-${ uniqueID } p, .kadence-column-${ uniqueID } h1, .kadence-column-${ uniqueID } h2, .kadence-column-${ uniqueID } h3, .kadence-column-${ uniqueID } h4, .kadence-column-${ uniqueID } h5, .kadence-column-${ uniqueID } h6 { color: ${ KadenceColorOutput( textColor ) }; }` : '' ) }
						{ ( linkColor ? `.kadence-column-${ uniqueID } a { color: ${ KadenceColorOutput( linkColor ) }; }` : '' ) }
						{ ( linkHoverColor ? `.kadence-column-${ uniqueID } a:hover { color: ${ KadenceColorOutput( linkHoverColor ) }; }` : '' ) }
					</style>
				) } */}
				{ this.showSettings( 'allSettings' ) && (
					<Fragment>
						<BlockControls>
							<ToolbarGroup>
								<Button
									className="components-tab-button"
									isPressed={ ! previewExpired }
									onClick={ () => this.setState( { previewExpired: true } ) }
								>
									<span>{ __( 'Live', 'kadence-pro' ) }</span>
								</Button>
								<Button
									className="components-tab-button"
									isPressed={ previewExpired }
									onClick={ () => this.setState( { previewExpired: false } ) }
								>
									<span>{ __( 'Expired', 'kadence-pro' ) }</span>
								</Button>
							</ToolbarGroup>
						</BlockControls>
						<InspectorControls>
							<Panel
								className={ 'components-panel__body is-opened' }
							>
								<SelectControl
									label={ __( 'Countdown Type', 'kadence-blocks' ) }
									options={ countdownTypes }
									value={ countdownType }
									onChange={ ( value ) => setAttributes( { countdownType: value } ) }
								/>
								{ 'date' === countdownType && (
									<Fragment>
										<DateTimePicker
											currentDate={ ( ! date ? undefined : date ) }
											onChange={ value => {
												saveDate( value );
											} }
											is12Hour={ is12HourTime }
											help={ __( 'Date set according to your sites timezone', 'kadence-blocks' ) }
										/>
									</Fragment>
								) }
							</Panel>
							<PanelBody
								title={ __( 'Countdown Display', 'kadence-blocks' ) }
								initialOpen={ false }
							>
								<ToggleControl
									label={ __( 'Display Countdown', 'kadence-blocks' ) }
									checked={ enableTimer }
									onChange={ value => setAttributes( { enableTimer: value } ) }
								/>
								{ enableTimer && (
									<Fragment>
										<ResponsiveAlignControls
											label={ __( 'Countdown Alignment', 'kadence-blocks' ) }
											value={ ( undefined !== counterAlign && undefined !== counterAlign[0] ? counterAlign[0] : '' ) }
											mobileValue={ ( undefined !== counterAlign && undefined !== counterAlign[1] ? counterAlign[1] : '' ) }
											tabletValue={ ( undefined !== counterAlign && undefined !== counterAlign[2] ? counterAlign[2] : '' ) }
											onChange={ ( nextAlign ) => setAttributes( { counterAlign: nextAlign } ) }
											onChangeTablet={ ( nextAlign ) => setAttributes( { counterAlign: nextAlign } ) }
											onChangeMobile={ ( nextAlign ) => setAttributes( { counterAlign: nextAlign } ) }
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
									</Fragment>
								) }
							</PanelBody>
							<PanelBody
								title={ __( 'Container Settings', 'kadence-blocks' ) }
								initialOpen={ false }
							>
								{ this.showSettings( 'container' ) && (
									<Fragment>
										<AdvancedPopColorControl
											label={ __( 'Background Color', 'kadence-blocks' ) }
											colorValue={ ( background ? background : '' ) }
											colorDefault={ '' }
											onColorChange={ value => setAttributes( { background: value } ) }
										/>
										{ ! hasBackgroundImage && (
											<KadenceMediaPlaceholder
												labels={ { title: __( 'Background Image', 'kadence-blocks' ) } }
												onSelect={ ( img ) => {
													saveBackgroundImage( {
														bgImgID: img.id,
														bgImg: img.url,
													} );
												} }
												onSelectURL={ ( newURL ) => {
													if ( newURL !== ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' ) ) {
														saveBackgroundImage( {
															bgImgID: undefined,
															bgImg: newURL,
														} );
													}
												} }
												accept="image/*"
												className={ 'kadence-image-upload' }
												allowedTypes={ ALLOWED_MEDIA_TYPES }
												disableMediaButtons={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' ) }
											/>
										) }
										{ hasBackgroundImage && (
											<Fragment>
												<MediaUpload
													onSelect={ img => {
														saveBackgroundImage( { bgImgID: img.id, bgImg: img.url } );
													} }
													type="image"
													value={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgID ? backgroundImg[ 0 ].bgImgID : '' ) }
													render={ ( { open } ) => (
														<Button
															className={ 'components-button components-icon-button kt-cta-upload-btn' }
															onClick={ open }
														>
															<Dashicon icon="format-image" />
															{ __( 'Edit Image', 'kadence-blocks' ) }
														</Button>
													) }
												/>
												<Tooltip text={ __( 'Remove Image' ) }>
													<Button
														className={ 'components-button components-icon-button kt-remove-img kt-cta-upload-btn' }
														onClick={ onRemoveBGImage }
													>
														<Dashicon icon="no-alt" />
													</Button>
												</Tooltip>
												<KadenceFocalPicker
													url={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' ) }
													value={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgPosition ? backgroundImg[ 0 ].bgImgPosition : 'center center' ) }
													onChange={ value => saveBackgroundImage( { bgImgPosition: value } ) }
												/>
												<KadenceRadioButtons
													label={ __( 'Background Image Size', 'kadence-blocks' ) }
													value={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgSize ? backgroundImg[ 0 ].bgImgSize : 'cover' ) }
													options={ [
														{ value: 'cover', label: __( 'Cover', 'kadence-blocks' ) },
														{ value: 'contain', label: __( 'Contain', 'kadence-blocks' ) },
														{ value: 'auto', label: __( 'Auto', 'kadence-blocks' ) },
													] }
													onChange={ value => saveBackgroundImage( { bgImgSize: value } ) }
												/>
												{ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgSize ? backgroundImg[ 0 ].bgImgSize : 'cover' ) !== 'cover' && (
													<KadenceRadioButtons
														label={ __( 'Background Image Repeat', 'kadence-blocks' ) }
														value={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgRepeat ? backgroundImg[ 0 ].bgImgRepeat : 'no-repeat' ) }
														options={ [
															{ value: 'no-repeat', label: __( 'No Repeat', 'kadence-blocks' ) },
															{ value: 'repeat', label: __( 'Repeat', 'kadence-blocks' ) },
															{ value: 'repeat-x', label: __( 'Repeat-x', 'kadence-blocks' ) },
															{ value: 'repeat-y', label: __( 'Repeat-y', 'kadence-blocks' ) },
														] }
														onChange={ value => saveBackgroundImage( { bgImgRepeat: value } ) }
													/>
												) }
												<KadenceRadioButtons
													label={ __( 'Background Image Attachment', 'kadence-blocks' ) }
													value={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgAttachment ? backgroundImg[ 0 ].bgImgAttachment : 'scroll' ) }
													options={ [
														{ value: 'scroll', label: __( 'Scroll', 'kadence-blocks' ) },
														{ value: 'fixed', label: __( 'Fixed', 'kadence-blocks' ) },
													] }
													onChange={ value => saveBackgroundImage( { bgImgAttachment: value } ) }
												/>
											</Fragment>
										) }
										<AdvancedPopColorControl
											label={ __( 'Border Color', 'kadence-blocks' ) }
											colorValue={ ( border ? border : '' ) }
											colorDefault={ '' }
											onColorChange={ value => setAttributes( { border: value } ) }
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
									</Fragment>
								) }
							</PanelBody>
							<PanelBody
								title={ __( 'Visibility Settings', 'kadence-blocks' ) }
								initialOpen={ false }
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
							</PanelBody>
						</InspectorControls>
					</Fragment>
				) }
				<InnerBlocks
					templateLock='all'
					template={ ! enableTimer ? COUNTDOWN_NO_TIMER : COUNTDOWN_TEMPLATE }
				/>
			</div>
		);
	}
}
export default compose( [
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps;
		const {
			__experimentalGetPreviewDeviceType,
		} = select( 'core/edit-post' );
		const {
			getBlock,
		} = select( 'core/block-editor' );
		const block = getBlock( clientId );
		return {
			countdownBlock: block,
			getPreviewDevice: __experimentalGetPreviewDeviceType ? __experimentalGetPreviewDeviceType() : 'Desktop',
		};
	} ),
] )( KadenceCountdown );
