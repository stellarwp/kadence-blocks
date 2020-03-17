/**
 * BLOCK: Kadence Split Content
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Import Icons
 */
import icons from '../../icons';
import map from 'lodash/map';
import get from 'lodash/get';
import TypographyControls from '../../typography-control';
import MeasurementControls from '../../measurement-control';
import AdvancedColorControl from '../../advanced-color-control';
import ImageSizeControl from '../../image-size-control';
import WebfontLoader from '../../fontloader';
import hexToRGBA from '../../hex-to-rgba';
import IconRender from '../../icon-render';
import IconControl from '../../icon-control';
import InfoBoxStyleCopyPaste from './copy-paste-style';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	MediaUpload,
	URLInput,
	RichText,
	AlignmentToolbar,
	InspectorControls,
	BlockControls,
	MediaPlaceholder,
} = wp.blockEditor;
const {
	Button,
	IconButton,
	Dropdown,
	ButtonGroup,
	TabPanel,
	Dashicon,
	PanelBody,
	RangeControl,
	Toolbar,
	TextControl,
	ToggleControl,
	SelectControl,
} = wp.components;

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktinfoboxUniqueIDs = [];
/**
 * Build the overlay edit
 */
class KadenceInfoBox extends Component {
	constructor() {
		super( ...arguments );
		this.showSettings = this.showSettings.bind( this );
		this.state = {
			containerPaddingControl: 'linked',
			containerBorderControl: 'linked',
			containerMarginControl: 'linked',
			mediaBorderControl: 'linked',
			mediaPaddingControl: 'linked',
			mediaMarginControl: 'linked',
			showPreset: false,
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/infobox' ] !== undefined && typeof blockConfigObject[ 'kadence/infobox' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/infobox' ] ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/infobox' ][ attribute ];
				} );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			if ( this.props.attributes.showPresets ) {
				this.setState( { showPreset: true } );
			}
			ktinfoboxUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( ktinfoboxUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktinfoboxUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			ktinfoboxUniqueIDs.push( this.props.attributes.uniqueID );
		}
		if ( this.props.attributes.mediaStyle[ 0 ].borderWidth[ 0 ] === this.props.attributes.mediaStyle[ 0 ].borderWidth[ 1 ] && this.props.attributes.mediaStyle[ 0 ].borderWidth[ 0 ] === this.props.attributes.mediaStyle[ 0 ].borderWidth[ 2 ] && this.props.attributes.mediaStyle[ 0 ].borderWidth[ 0 ] === this.props.attributes.mediaStyle[ 0 ].borderWidth[ 3 ] ) {
			this.setState( { mediaBorderControl: 'linked' } );
		} else {
			this.setState( { mediaBorderControl: 'individual' } );
		}
		if ( this.props.attributes.mediaStyle[ 0 ].padding[ 0 ] === this.props.attributes.mediaStyle[ 0 ].padding[ 1 ] && this.props.attributes.mediaStyle[ 0 ].padding[ 0 ] === this.props.attributes.mediaStyle[ 0 ].padding[ 2 ] && this.props.attributes.mediaStyle[ 0 ].padding[ 0 ] === this.props.attributes.mediaStyle[ 0 ].padding[ 3 ] ) {
			this.setState( { mediaPaddingControl: 'linked' } );
		} else {
			this.setState( { mediaPaddingControl: 'individual' } );
		}
		if ( this.props.attributes.mediaStyle[ 0 ].margin[ 0 ] === this.props.attributes.mediaStyle[ 0 ].margin[ 1 ] && this.props.attributes.mediaStyle[ 0 ].margin[ 0 ] === this.props.attributes.mediaStyle[ 0 ].margin[ 2 ] && this.props.attributes.mediaStyle[ 0 ].margin[ 0 ] === this.props.attributes.mediaStyle[ 0 ].margin[ 3 ] ) {
			this.setState( { mediaMarginControl: 'linked' } );
		} else {
			this.setState( { mediaMarginControl: 'individual' } );
		}
		if ( this.props.attributes.containerBorderWidth[ 0 ] === this.props.attributes.containerBorderWidth[ 1 ] && this.props.attributes.containerBorderWidth[ 0 ] === this.props.attributes.containerBorderWidth[ 2 ] && this.props.attributes.containerBorderWidth[ 0 ] === this.props.attributes.containerBorderWidth[ 3 ] ) {
			this.setState( { containerBorderControl: 'linked' } );
		} else {
			this.setState( { containerBorderControl: 'individual' } );
		}
		if ( this.props.attributes.containerPadding[ 0 ] === this.props.attributes.containerPadding[ 1 ] && this.props.attributes.containerPadding[ 0 ] === this.props.attributes.containerPadding[ 2 ] && this.props.attributes.containerPadding[ 0 ] === this.props.attributes.containerPadding[ 3 ] ) {
			this.setState( { containerPaddingControl: 'linked' } );
		} else {
			this.setState( { containerPaddingControl: 'individual' } );
		}
		if ( this.props.attributes.containerMargin && this.props.attributes.containerMargin[ 0 ] && this.props.attributes.containerMargin[ 0 ] === this.props.attributes.containerMargin[ 1 ] && this.props.attributes.containerMargin[ 0 ] === this.props.attributes.containerMargin[ 2 ] && this.props.attributes.containerMargin[ 0 ] === this.props.attributes.containerMargin[ 3 ] ) {
			this.setState( { containerMarginControl: 'linked' } );
		} else {
			this.setState( { containerMarginControl: 'individual' } );
		}
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/infobox' ] !== undefined && typeof blockSettings[ 'kadence/infobox' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/infobox' ] } );
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
	render() {
		const { attributes: { uniqueID, link, linkProperty, target, hAlign, containerBackground, containerHoverBackground, containerBorder, containerHoverBorder, containerBorderWidth, containerBorderRadius, containerPadding, mediaType, mediaImage, mediaIcon, mediaStyle, mediaAlign, displayTitle, title, titleColor, titleHoverColor, titleFont, displayText, contentText, textColor, textHoverColor, textFont, textSpacing, displayLearnMore, learnMore, learnMoreStyles, displayShadow, shadow, shadowHover, containerHoverBackgroundOpacity, containerBackgroundOpacity, containerHoverBorderOpacity, containerBorderOpacity, textMinHeight, titleMinHeight, maxWidthUnit, maxWidth, mediaVAlign, mediaAlignMobile, mediaAlignTablet, hAlignMobile, hAlignTablet, containerMargin, containerMarginUnit }, className, setAttributes, isSelected } = this.props;
		const { containerBorderControl, mediaBorderControl, mediaPaddingControl, mediaMarginControl, containerPaddingControl, containerMarginControl } = this.state;
		const widthMax = ( maxWidthUnit === 'px' ? 2000 : 100 );
		const widthTypes = [
			{ key: 'px', name: 'px' },
			{ key: '%', name: '%' },
			{ key: 'vw', name: 'vw' },
		];
		const marginTypes = [
			{ key: 'px', name: 'px' },
			{ key: 'em', name: 'em' },
			{ key: '%', name: '%' },
			{ key: 'vh', name: 'vh' },
			{ key: 'rem', name: 'rem' },
		];
		const marginMin = ( containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? -12 : -200 );
		const marginMax = ( containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? 24 : 200 );
		const marginStep = ( containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? 0.1 : 1 );
		const startlayoutOptions = [
			{ key: 'skip', name: __( 'Skip' ), icon: __( 'Skip' ) },
			{ key: 'simple', name: __( 'Simple' ), icon: icons.infoSimple },
			{ key: 'left', name: __( 'Align Left' ), icon: icons.infoLeft },
			{ key: 'bold', name: __( 'Bold Background' ), icon: icons.infoBackground },
			{ key: 'image', name: __( 'Circle Image' ), icon: icons.infoImage },
		];
		const layoutPresetOptions = [
			{ key: 'simple', name: __( 'Basic' ), icon: icons.infoStart },
			{ key: 'basic', name: __( 'Basic' ), icon: icons.infoBasic },
			{ key: 'leftabove', name: __( 'Left Above' ), icon: icons.infoLeftAbove },
			{ key: 'left', name: __( 'Left' ), icon: icons.infoLeft },
			{ key: 'overlay', name: __( 'Overlay' ), icon: icons.infoTopOverlay },
			{ key: 'overlayleft', name: __( 'Overlay Left' ), icon: icons.infoLeftOverlay },
		];
		const setPresetLayout = ( key ) => {
			if ( 'simple' === key ) {
				setAttributes( {
					hAlign: 'center',
					containerBackground: ( '#ffffff' === containerBackground ? '#f2f2f2' : containerBackground ),
					containerHoverBackground: ( '#ffffff' === containerBackground ? '#f2f2f2' : containerBackground ),
					containerBorderWidth: [ 0, 0, 0, 0 ],
					containerBorderRadius: 0,
					containerPadding: [ 20, 20, 20, 20 ],
					containerMargin: [ '', '', '', '' ],
					containerMarginUnit: 'px',
					mediaAlign: 'top',
					mediaIcon: [ {
						icon: mediaIcon[ 0 ].icon,
						size: 50,
						width: mediaIcon[ 0 ].width,
						title: mediaIcon[ 0 ].title,
						color: mediaIcon[ 0 ].color,
						hoverColor: mediaIcon[ 0 ].hoverColor,
						hoverAnimation: mediaIcon[ 0 ].hoverAnimation,
						flipIcon: mediaIcon[ 0 ].flipIcon,
					} ],
					mediaStyle: [ {
						background: mediaIcon[ 0 ].background,
						hoverBackground: mediaIcon[ 0 ].hoverBackground,
						border: mediaIcon[ 0 ].border,
						hoverBorder: mediaIcon[ 0 ].hoverBorder,
						borderRadius: 0,
						borderWidth: [ 0, 0, 0, 0 ],
						padding: [ 10, 10, 10, 10 ],
						margin: [ 0, 15, 0, 15 ],
					} ],
					titleFont: [ {
						level: titleFont[ 0 ].level,
						size: titleFont[ 0 ].size,
						sizeType: titleFont[ 0 ].sizeType,
						lineHeight: titleFont[ 0 ].lineHeight,
						lineType: titleFont[ 0 ].lineType,
						letterSpacing: titleFont[ 0 ].letterSpacing,
						textTransform: titleFont[ 0 ].textTransform,
						family: titleFont[ 0 ].family,
						google: titleFont[ 0 ].google,
						style: titleFont[ 0 ].style,
						weight: titleFont[ 0 ].weight,
						variant: titleFont[ 0 ].variant,
						subset: titleFont[ 0 ].subset,
						loadGoogle: titleFont[ 0 ].loadGoogle,
						padding: [ 0, 0, 0, 0 ],
						paddingControl: 'linked',
						margin: [ 5, 0, 10, 0 ],
						marginControl: 'individual',
					} ],
				} );
			} else if ( 'basic' === key ) {
				setAttributes( {
					hAlign: 'center',
					containerBackground: ( '#f2f2f2' === containerBackground ? '#ffffff' : containerBackground ),
					containerHoverBackground: ( '#f2f2f2' === containerHoverBackground ? '#ffffff' : containerHoverBackground ),
					containerBorder: ( '#f2f2f2' === containerBorder ? '#ffffff' : containerBorder ),
					containerHoverBorder: ( '#f2f2f2' === containerHoverBorder ? '#eeeeee' : containerHoverBorder ),
					containerBorderWidth: [ 5, 5, 5, 5 ],
					containerBorderRadius: 30,
					containerPadding: [ 20, 20, 20, 20 ],
					containerMargin: [ '', '', '', '' ],
					containerMarginUnit: 'px',
					mediaAlign: 'top',
					mediaIcon: [ {
						icon: mediaIcon[ 0 ].icon,
						size: 50,
						width: mediaIcon[ 0 ].width,
						title: mediaIcon[ 0 ].title,
						color: mediaIcon[ 0 ].color,
						hoverColor: mediaIcon[ 0 ].hoverColor,
						hoverAnimation: mediaIcon[ 0 ].hoverAnimation,
						flipIcon: mediaIcon[ 0 ].flipIcon,
					} ],
					mediaStyle: [ {
						background: ( undefined === mediaIcon[ 0 ].background || 'transparent' === mediaIcon[ 0 ].background ? '#eeeeee' : mediaIcon[ 0 ].background ),
						hoverBackground: ( undefined === mediaIcon[ 0 ].hoverBackground || 'transparent' === mediaIcon[ 0 ].hoverBackground ? '#eeeeee' : mediaIcon[ 0 ].hoverBackground ),
						border: mediaIcon[ 0 ].border,
						hoverBorder: mediaIcon[ 0 ].hoverBorder,
						borderRadius: 200,
						borderWidth: [ 0, 0, 0, 0 ],
						padding: ( 'icon' === mediaType ? [ 20, 20, 20, 20 ] : [ 0, 0, 0, 0 ] ),
						margin: [ 0, 15, 10, 15 ],
					} ],
					mediaImage: [ {
						url: mediaImage[ 0 ].url,
						id: mediaImage[ 0 ].id,
						alt: mediaImage[ 0 ].alt,
						width: mediaImage[ 0 ].width,
						height: mediaImage[ 0 ].height,
						maxWidth: 100,
						hoverAnimation: mediaImage[ 0 ].hoverAnimation,
						flipUrl: mediaImage[ 0 ].flipUrl,
						flipId: mediaImage[ 0 ].flipId,
						flipAlt: mediaImage[ 0 ].flipAlt,
						flipWidth: mediaImage[ 0 ].flipWidth,
						flipHeight: mediaImage[ 0 ].flipHeight,
						subtype: mediaImage[ 0 ].subtype,
						flipSubtype: mediaImage[ 0 ].flipSubtype,
					} ],
					titleFont: [ {
						level: titleFont[ 0 ].level,
						size: titleFont[ 0 ].size,
						sizeType: titleFont[ 0 ].sizeType,
						lineHeight: titleFont[ 0 ].lineHeight,
						lineType: titleFont[ 0 ].lineType,
						letterSpacing: titleFont[ 0 ].letterSpacing,
						textTransform: titleFont[ 0 ].textTransform,
						family: titleFont[ 0 ].family,
						google: titleFont[ 0 ].google,
						style: titleFont[ 0 ].style,
						weight: titleFont[ 0 ].weight,
						variant: titleFont[ 0 ].variant,
						subset: titleFont[ 0 ].subset,
						loadGoogle: titleFont[ 0 ].loadGoogle,
						padding: [ 0, 0, 0, 0 ],
						paddingControl: 'linked',
						margin: [ 5, 0, 10, 0 ],
						marginControl: 'individual',
					} ],
				} );
			} else if ( 'leftabove' === key ) {
				setAttributes( {
					hAlign: 'left',
					containerBackground: ( '#f2f2f2' === containerBackground ? '#ffffff' : containerBackground ),
					containerHoverBackground: ( '#f2f2f2' === containerHoverBackground ? '#ffffff' : containerHoverBackground ),
					containerBorder: ( '#f2f2f2' === containerBorder ? '#ffffff' : containerBorder ),
					containerHoverBorder: ( '#f2f2f2' === containerHoverBorder ? '#eeeeee' : containerHoverBorder ),
					containerBorderWidth: [ 5, 5, 5, 5 ],
					containerBorderRadius: 0,
					containerPadding: [ 24, 24, 24, 24 ],
					containerMargin: [ '', '', '', '' ],
					containerMarginUnit: 'px',
					mediaAlign: 'top',
					mediaIcon: [ {
						icon: mediaIcon[ 0 ].icon,
						size: 50,
						width: mediaIcon[ 0 ].width,
						title: mediaIcon[ 0 ].title,
						color: mediaIcon[ 0 ].color,
						hoverColor: mediaIcon[ 0 ].hoverColor,
						hoverAnimation: mediaIcon[ 0 ].hoverAnimation,
						flipIcon: mediaIcon[ 0 ].flipIcon,
					} ],
					mediaStyle: [ {
						background: ( undefined === mediaIcon[ 0 ].background || 'transparent' === mediaIcon[ 0 ].background ? '#eeeeee' : mediaIcon[ 0 ].background ),
						hoverBackground: ( undefined === mediaIcon[ 0 ].hoverBackground || 'transparent' === mediaIcon[ 0 ].hoverBackground ? '#eeeeee' : mediaIcon[ 0 ].hoverBackground ),
						border: mediaIcon[ 0 ].border,
						hoverBorder: mediaIcon[ 0 ].hoverBorder,
						borderRadius: 0,
						borderWidth: [ 0, 0, 0, 0 ],
						padding: ( 'icon' === mediaType ? [ 20, 20, 20, 20 ] : [ 0, 0, 0, 0 ] ),
						margin: [ 0, 0, 16, 0 ],
					} ],
					mediaImage: [ {
						url: mediaImage[ 0 ].url,
						id: mediaImage[ 0 ].id,
						alt: mediaImage[ 0 ].alt,
						width: mediaImage[ 0 ].width,
						height: mediaImage[ 0 ].height,
						maxWidth: 100,
						hoverAnimation: mediaImage[ 0 ].hoverAnimation,
						flipUrl: mediaImage[ 0 ].flipUrl,
						flipId: mediaImage[ 0 ].flipId,
						flipAlt: mediaImage[ 0 ].flipAlt,
						flipWidth: mediaImage[ 0 ].flipWidth,
						flipHeight: mediaImage[ 0 ].flipHeight,
						subtype: mediaImage[ 0 ].subtype,
						flipSubtype: mediaImage[ 0 ].flipSubtype,
					} ],
					titleFont: [ {
						level: titleFont[ 0 ].level,
						size: titleFont[ 0 ].size,
						sizeType: titleFont[ 0 ].sizeType,
						lineHeight: titleFont[ 0 ].lineHeight,
						lineType: titleFont[ 0 ].lineType,
						letterSpacing: titleFont[ 0 ].letterSpacing,
						textTransform: titleFont[ 0 ].textTransform,
						family: titleFont[ 0 ].family,
						google: titleFont[ 0 ].google,
						style: titleFont[ 0 ].style,
						weight: titleFont[ 0 ].weight,
						variant: titleFont[ 0 ].variant,
						subset: titleFont[ 0 ].subset,
						loadGoogle: titleFont[ 0 ].loadGoogle,
						padding: [ 0, 0, 0, 0 ],
						paddingControl: 'linked',
						margin: [ 5, 0, 10, 0 ],
						marginControl: 'individual',
					} ],
				} );
			} else if ( 'left' === key ) {
				setAttributes( {
					hAlign: 'left',
					containerBackground: ( '#f2f2f2' === containerBackground ? '#ffffff' : containerBackground ),
					containerHoverBackground: ( '#f2f2f2' === containerHoverBackground ? '#ffffff' : containerHoverBackground ),
					containerBorder: ( '#f2f2f2' === containerBorder ? '#ffffff' : containerBorder ),
					containerHoverBorder: ( '#f2f2f2' === containerHoverBorder ? '#eeeeee' : containerHoverBorder ),
					containerBorderWidth: [ 5, 5, 5, 5 ],
					containerBorderRadius: 20,
					containerPadding: [ 24, 24, 24, 24 ],
					containerMargin: [ '', '', '', '' ],
					containerMarginUnit: 'px',
					mediaAlign: 'left',
					mediaIcon: [ {
						icon: mediaIcon[ 0 ].icon,
						size: 50,
						width: mediaIcon[ 0 ].width,
						title: mediaIcon[ 0 ].title,
						color: mediaIcon[ 0 ].color,
						hoverColor: mediaIcon[ 0 ].hoverColor,
						hoverAnimation: mediaIcon[ 0 ].hoverAnimation,
						flipIcon: mediaIcon[ 0 ].flipIcon,
					} ],
					mediaStyle: [ {
						background: ( undefined === mediaIcon[ 0 ].background || 'transparent' === mediaIcon[ 0 ].background ? '#ffffff' : mediaIcon[ 0 ].background ),
						hoverBackground: ( undefined === mediaIcon[ 0 ].hoverBackground || 'transparent' === mediaIcon[ 0 ].hoverBackground ? '#ffffff' : mediaIcon[ 0 ].hoverBackground ),
						border: ( undefined === mediaIcon[ 0 ].border || '#444444' === mediaIcon[ 0 ].border ? '#eeeeee' : mediaIcon[ 0 ].border ),
						hoverBorder: ( undefined === mediaIcon[ 0 ].hoverBorder || '#444444' === mediaIcon[ 0 ].hoverBorder ? '#eeeeee' : mediaIcon[ 0 ].hoverBorder ),
						borderRadius: 200,
						borderWidth: ( 'icon' === mediaType ? [ 5, 5, 5, 5 ] : [ 0, 0, 0, 0 ] ),
						padding: ( 'icon' === mediaType ? [ 20, 20, 20, 20 ] : [ 0, 0, 0, 0 ] ),
						margin: [ 0, 20, 0, 0 ],
					} ],
					mediaImage: [ {
						url: mediaImage[ 0 ].url,
						id: mediaImage[ 0 ].id,
						alt: mediaImage[ 0 ].alt,
						width: mediaImage[ 0 ].width,
						height: mediaImage[ 0 ].height,
						maxWidth: 100,
						hoverAnimation: mediaImage[ 0 ].hoverAnimation,
						flipUrl: mediaImage[ 0 ].flipUrl,
						flipId: mediaImage[ 0 ].flipId,
						flipAlt: mediaImage[ 0 ].flipAlt,
						flipWidth: mediaImage[ 0 ].flipWidth,
						flipHeight: mediaImage[ 0 ].flipHeight,
						subtype: mediaImage[ 0 ].subtype,
						flipSubtype: mediaImage[ 0 ].flipSubtype,
					} ],
					titleFont: [ {
						level: titleFont[ 0 ].level,
						size: titleFont[ 0 ].size,
						sizeType: titleFont[ 0 ].sizeType,
						lineHeight: titleFont[ 0 ].lineHeight,
						lineType: titleFont[ 0 ].lineType,
						letterSpacing: titleFont[ 0 ].letterSpacing,
						textTransform: titleFont[ 0 ].textTransform,
						family: titleFont[ 0 ].family,
						google: titleFont[ 0 ].google,
						style: titleFont[ 0 ].style,
						weight: titleFont[ 0 ].weight,
						variant: titleFont[ 0 ].variant,
						subset: titleFont[ 0 ].subset,
						loadGoogle: titleFont[ 0 ].loadGoogle,
						padding: [ 0, 0, 0, 0 ],
						paddingControl: 'linked',
						margin: [ 5, 0, 10, 0 ],
						marginControl: 'individual',
					} ],
				} );
			} else if ( 'overlay' === key ) {
				setAttributes( {
					hAlign: 'center',
					containerBackground: ( '#f2f2f2' === containerBackground ? '#ffffff' : containerBackground ),
					containerHoverBackground: ( '#f2f2f2' === containerHoverBackground ? '#ffffff' : containerHoverBackground ),
					containerBorder: ( '#f2f2f2' === containerBorder ? '#ffffff' : containerBorder ),
					containerHoverBorder: ( '#f2f2f2' === containerHoverBorder ? '#eeeeee' : containerHoverBorder ),
					containerBorderWidth: [ 5, 5, 5, 5 ],
					containerBorderRadius: 20,
					containerPadding: [ 24, 24, 24, 24 ],
					containerMargin: [ 50, '', '', '' ],
					containerMarginUnit: 'px',
					mediaAlign: 'top',
					mediaIcon: [ {
						icon: mediaIcon[ 0 ].icon,
						size: 50,
						width: mediaIcon[ 0 ].width,
						title: mediaIcon[ 0 ].title,
						color: mediaIcon[ 0 ].color,
						hoverColor: mediaIcon[ 0 ].hoverColor,
						hoverAnimation: mediaIcon[ 0 ].hoverAnimation,
						flipIcon: mediaIcon[ 0 ].flipIcon,
					} ],
					mediaStyle: [ {
						background: ( undefined === mediaIcon[ 0 ].background || 'transparent' === mediaIcon[ 0 ].background ? '#ffffff' : mediaIcon[ 0 ].background ),
						hoverBackground: ( undefined === mediaIcon[ 0 ].hoverBackground || 'transparent' === mediaIcon[ 0 ].hoverBackground ? '#ffffff' : mediaIcon[ 0 ].hoverBackground ),
						border: ( undefined === mediaIcon[ 0 ].border || '#444444' === mediaIcon[ 0 ].border ? '#eeeeee' : mediaIcon[ 0 ].border ),
						hoverBorder: ( undefined === mediaIcon[ 0 ].hoverBorder || '#444444' === mediaIcon[ 0 ].hoverBorder ? '#eeeeee' : mediaIcon[ 0 ].hoverBorder ),
						borderRadius: 200,
						borderWidth: [ 5, 5, 5, 5 ],
						padding: ( 'icon' === mediaType ? [ 20, 20, 20, 20 ] : [ 0, 0, 0, 0 ] ),
						margin: [ -75, 0, 20, 0 ],
					} ],
					mediaImage: [ {
						url: mediaImage[ 0 ].url,
						id: mediaImage[ 0 ].id,
						alt: mediaImage[ 0 ].alt,
						width: mediaImage[ 0 ].width,
						height: mediaImage[ 0 ].height,
						maxWidth: 100,
						hoverAnimation: mediaImage[ 0 ].hoverAnimation,
						flipUrl: mediaImage[ 0 ].flipUrl,
						flipId: mediaImage[ 0 ].flipId,
						flipAlt: mediaImage[ 0 ].flipAlt,
						flipWidth: mediaImage[ 0 ].flipWidth,
						flipHeight: mediaImage[ 0 ].flipHeight,
						subtype: mediaImage[ 0 ].subtype,
						flipSubtype: mediaImage[ 0 ].flipSubtype,
					} ],
					titleFont: [ {
						level: titleFont[ 0 ].level,
						size: titleFont[ 0 ].size,
						sizeType: titleFont[ 0 ].sizeType,
						lineHeight: titleFont[ 0 ].lineHeight,
						lineType: titleFont[ 0 ].lineType,
						letterSpacing: titleFont[ 0 ].letterSpacing,
						textTransform: titleFont[ 0 ].textTransform,
						family: titleFont[ 0 ].family,
						google: titleFont[ 0 ].google,
						style: titleFont[ 0 ].style,
						weight: titleFont[ 0 ].weight,
						variant: titleFont[ 0 ].variant,
						subset: titleFont[ 0 ].subset,
						loadGoogle: titleFont[ 0 ].loadGoogle,
						padding: [ 0, 0, 0, 0 ],
						paddingControl: 'linked',
						margin: [ 5, 0, 10, 0 ],
						marginControl: 'individual',
					} ],
				} );
			} else if ( 'overlayleft' === key ) {
				setAttributes( {
					hAlign: 'left',
					containerBackground: ( '#f2f2f2' === containerBackground ? '#ffffff' : containerBackground ),
					containerHoverBackground: ( '#f2f2f2' === containerHoverBackground ? '#ffffff' : containerHoverBackground ),
					containerBorder: ( '#f2f2f2' === containerBorder ? '#ffffff' : containerBorder ),
					containerHoverBorder: ( '#f2f2f2' === containerHoverBorder ? '#eeeeee' : containerHoverBorder ),
					containerBorderWidth: [ 5, 5, 5, 5 ],
					containerBorderRadius: 0,
					containerPadding: [ 24, 24, 24, 24 ],
					containerMargin: [ 50, '', '', '' ],
					containerMarginUnit: 'px',
					mediaAlign: 'top',
					mediaIcon: [ {
						icon: mediaIcon[ 0 ].icon,
						size: 50,
						width: mediaIcon[ 0 ].width,
						title: mediaIcon[ 0 ].title,
						color: mediaIcon[ 0 ].color,
						hoverColor: mediaIcon[ 0 ].hoverColor,
						hoverAnimation: mediaIcon[ 0 ].hoverAnimation,
						flipIcon: mediaIcon[ 0 ].flipIcon,
					} ],
					mediaStyle: [ {
						background: ( undefined === mediaIcon[ 0 ].background || 'transparent' === mediaIcon[ 0 ].background ? '#ffffff' : mediaIcon[ 0 ].background ),
						hoverBackground: ( undefined === mediaIcon[ 0 ].hoverBackground || 'transparent' === mediaIcon[ 0 ].hoverBackground ? '#ffffff' : mediaIcon[ 0 ].hoverBackground ),
						border: ( undefined === mediaIcon[ 0 ].border || '#444444' === mediaIcon[ 0 ].border ? '#eeeeee' : mediaIcon[ 0 ].border ),
						hoverBorder: ( undefined === mediaIcon[ 0 ].hoverBorder || '#444444' === mediaIcon[ 0 ].hoverBorder ? '#eeeeee' : mediaIcon[ 0 ].hoverBorder ),
						borderRadius: 0,
						borderWidth: [ 5, 5, 5, 5 ],
						padding: ( 'icon' === mediaType ? [ 20, 20, 20, 20 ] : [ 0, 0, 0, 0 ] ),
						margin: [ -75, 0, 20, 0 ],
					} ],
					mediaImage: [ {
						url: mediaImage[ 0 ].url,
						id: mediaImage[ 0 ].id,
						alt: mediaImage[ 0 ].alt,
						width: mediaImage[ 0 ].width,
						height: mediaImage[ 0 ].height,
						maxWidth: 100,
						hoverAnimation: mediaImage[ 0 ].hoverAnimation,
						flipUrl: mediaImage[ 0 ].flipUrl,
						flipId: mediaImage[ 0 ].flipId,
						flipAlt: mediaImage[ 0 ].flipAlt,
						flipWidth: mediaImage[ 0 ].flipWidth,
						flipHeight: mediaImage[ 0 ].flipHeight,
						subtype: mediaImage[ 0 ].subtype,
						flipSubtype: mediaImage[ 0 ].flipSubtype,
					} ],
					titleFont: [ {
						level: titleFont[ 0 ].level,
						size: titleFont[ 0 ].size,
						sizeType: titleFont[ 0 ].sizeType,
						lineHeight: titleFont[ 0 ].lineHeight,
						lineType: titleFont[ 0 ].lineType,
						letterSpacing: titleFont[ 0 ].letterSpacing,
						textTransform: titleFont[ 0 ].textTransform,
						family: titleFont[ 0 ].family,
						google: titleFont[ 0 ].google,
						style: titleFont[ 0 ].style,
						weight: titleFont[ 0 ].weight,
						variant: titleFont[ 0 ].variant,
						subset: titleFont[ 0 ].subset,
						loadGoogle: titleFont[ 0 ].loadGoogle,
						padding: [ 0, 0, 0, 0 ],
						paddingControl: 'linked',
						margin: [ 5, 0, 10, 0 ],
						marginControl: 'individual',
					} ],
				} );
			}
		};
		const setInitalLayout = ( key ) => {
			if ( 'skip' === key ) {
			} else if ( 'simple' === key ) {
				setAttributes( {
					hAlign: 'center',
					containerBackground: '#f2f2f2',
					containerHoverBackground: '#f2f2f2',
					containerBorder: '#eeeeee',
					containerHoverBorder: '#eeeeee',
					containerBorderWidth: [ 0, 0, 0, 0 ],
					containerBorderRadius: 0,
					containerPadding: [ 20, 20, 20, 20 ],
					mediaType: 'icon',
					mediaAlign: 'top',
					mediaIcon: [ {
						icon: 'ic_star',
						size: 70,
						width: 2,
						title: '',
						color: '#444444',
						hoverColor: '#444444',
						hoverAnimation: 'none',
						flipIcon: '',
					} ],
					mediaStyle: [ {
						background: 'transparent',
						hoverBackground: 'transparent',
						border: '#444444',
						hoverBorder: '#444444',
						borderRadius: 200,
						borderWidth: [ 3, 3, 3, 3 ],
						padding: [ 16, 16, 16, 16 ],
						margin: [ 0, 15, 8, 15 ],
					} ],
					displayTitle: true,
					titleColor: '#444444',
					titleHoverColor: '#444444',
					titleFont: [ {
						level: 2,
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
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
						padding: [ 0, 0, 0, 0 ],
						paddingControl: 'linked',
						margin: [ 5, 0, 10, 0 ],
						marginControl: 'individual',
					} ],
					displayText: true,
					textColor: '#777777',
					textHoverColor: '#777777',
					textFont: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					} ],
					displayLearnMore: false,
					displayShadow: false,
				} );
			} else if ( 'left' === key ) {
				setAttributes( {
					hAlign: 'left',
					containerBackground: '#ffffff',
					containerHoverBackground: '#ffffff',
					containerBorder: '#888888',
					containerHoverBorder: '#888888',
					containerBorderWidth: [ 2, 2, 2, 2 ],
					containerBorderRadius: 20,
					containerPadding: [ 20, 20, 20, 20 ],
					mediaType: 'icon',
					mediaAlign: 'left',
					mediaIcon: [ {
						icon: 'ic_star',
						size: 50,
						width: 2,
						title: '',
						color: '#ffffff',
						hoverColor: '#ffffff',
						hoverAnimation: 'none',
						flipIcon: '',
					} ],
					mediaStyle: [ {
						background: '#555555',
						hoverBackground: '#444444',
						border: '#444444',
						hoverBorder: '#444444',
						borderRadius: 200,
						borderWidth: [ 0, 0, 0, 0 ],
						padding: [ 20, 20, 20, 20 ],
						margin: [ 0, 15, 0, 15 ],
					} ],
					displayTitle: true,
					titleColor: '',
					titleHoverColor: '',
					titleFont: [ {
						level: 2,
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
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
						padding: [ 0, 0, 0, 0 ],
						paddingControl: 'linked',
						margin: [ 5, 0, 10, 0 ],
						marginControl: 'individual',
					} ],
					displayText: true,
					textColor: '#555555',
					textHoverColor: '',
					textFont: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					} ],
					displayLearnMore: false,
					displayShadow: true,
				} );
			} else if ( 'bold' === key ) {
				setAttributes( {
					hAlign: 'center',
					containerBackground: '#0A6689',
					containerHoverBackground: '#0A6689',
					containerBorder: '#eeeeee',
					containerHoverBorder: '#eeeeee',
					containerBorderWidth: [ 0, 0, 0, 0 ],
					containerBorderRadius: 0,
					containerPadding: [ 20, 20, 20, 20 ],
					mediaType: 'icon',
					mediaAlign: 'top',
					mediaImage: [ {
						url: '',
						id: '',
						alt: '',
						width: '',
						height: '',
						maxWidth: '',
						hoverAnimation: 'none',
						flipUrl: '',
						flipId: '',
						flipAlt: '',
						flipWidth: '',
						flipHeight: '',
						subtype: '',
						flipSubtype: '',
					} ],
					mediaIcon: [ {
						icon: 'ic_star',
						size: 80,
						width: 2,
						title: '',
						color: '#ffffff',
						hoverColor: '#ffffff',
						hoverAnimation: 'none',
						flipIcon: '',
					} ],
					mediaStyle: [ {
						background: 'transparent',
						hoverBackground: 'transparent',
						border: '#444444',
						hoverBorder: '#444444',
						borderRadius: 0,
						borderWidth: [ 0, 0, 0, 0 ],
						padding: [ 10, 10, 10, 10 ],
						margin: [ 0, 15, 0, 15 ],
					} ],
					displayTitle: true,
					titleColor: '#ffffff',
					titleHoverColor: '#ffffff',
					titleFont: [ {
						level: 2,
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
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
						padding: [ 0, 0, 0, 0 ],
						paddingControl: 'linked',
						margin: [ 5, 0, 10, 0 ],
						marginControl: 'individual',
					} ],
					displayText: false,
					textColor: '#ffffff',
					textHoverColor: '#ffffff',
					displayLearnMore: true,
					learnMoreStyles: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ 4, 8, 4, 8 ],
						paddingControl: 'individual',
						margin: [ 10, 0, 10, 0 ],
						marginControl: 'individual',
						color: '#ffffff',
						background: '#0A6689',
						border: '#ffffff',
						borderRadius: 0,
						borderWidth: [ 0, 0, 0, 0 ],
						borderControl: 'linked',
						colorHover: '#0A6689',
						backgroundHover: '#ffffff',
						borderHover: '#ffffff',
						hoverEffect: 'revealBorder',
					} ],
					displayShadow: false,
				} );
			} else if ( 'image' === key ) {
				setAttributes( {
					hAlign: 'center',
					containerBackground: '#ffffff',
					containerHoverBackground: '#ffffff',
					containerBorder: '#ffffff',
					containerHoverBorder: '#eeeeee',
					containerBorderWidth: [ 5, 5, 5, 5 ],
					containerBorderRadius: 30,
					containerPadding: [ 20, 20, 20, 20 ],
					mediaType: 'image',
					mediaAlign: 'top',
					mediaImage: [ {
						url: '',
						id: '',
						alt: '',
						width: '',
						height: '',
						maxWidth: '200',
						hoverAnimation: 'none',
						flipUrl: '',
						flipId: '',
						flipAlt: '',
						flipWidth: '',
						flipHeight: '',
						subtype: '',
						flipSubtype: '',
					} ],
					mediaStyle: [ {
						background: 'transparent',
						hoverBackground: 'transparent',
						border: '#444444',
						hoverBorder: '#444444',
						borderRadius: 200,
						borderWidth: [ 0, 0, 0, 0 ],
						padding: [ 10, 10, 10, 10 ],
						margin: [ 0, 15, 0, 15 ],
					} ],
					displayTitle: true,
					titleColor: '',
					titleHoverColor: '',
					titleFont: [ {
						level: 2,
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
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
						padding: [ 0, 0, 0, 0 ],
						paddingControl: 'linked',
						margin: [ 5, 0, 10, 0 ],
						marginControl: 'individual',
					} ],
					displayText: true,
					textColor: '#555555',
					textHoverColor: '',
					textFont: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					} ],
					displayLearnMore: true,
					learnMoreStyles: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ 4, 8, 4, 8 ],
						paddingControl: 'individual',
						margin: [ 10, 0, 10, 0 ],
						marginControl: 'individual',
						color: '#444444',
						background: '#ffffff',
						border: '#444444',
						borderRadius: 0,
						borderWidth: [ 1, 0, 0, 0 ],
						borderControl: 'linked',
						colorHover: '#222222',
						backgroundHover: '#ffffff',
						borderHover: '#222222',
						hoverEffect: 'revealBorder',
					} ],
					displayShadow: false,
				} );
			}
		};
		const onChangeTitle = value => {
			setAttributes( { title: value } );
		};
		const gconfig = {
			google: {
				families: [ titleFont[ 0 ].family + ( titleFont[ 0 ].variant ? ':' + titleFont[ 0 ].variant : '' ) ],
			},
		};
		const tgconfig = {
			google: {
				families: [ textFont[ 0 ].family + ( textFont[ 0 ].variant ? ':' + textFont[ 0 ].variant : '' ) ],
			},
		};
		const lgconfig = {
			google: {
				families: [ learnMoreStyles[ 0 ].family + ( learnMoreStyles[ 0 ].variant ? ':' + learnMoreStyles[ 0 ].variant : '' ) ],
			},
		};
		const config = ( titleFont[ 0 ].google ? gconfig : '' );
		const tconfig = ( textFont[ 0 ].google ? tgconfig : '' );
		const lconfig = ( learnMoreStyles[ 0 ].google ? lgconfig : '' );
		const titleTagName = 'h' + titleFont[ 0 ].level;
		const ALLOWED_MEDIA_TYPES = [ 'image' ];
		const onSelectImage = media => {
			let url;
			const size = ( mediaImage[ 0 ] && mediaImage[ 0 ].size && '' !== mediaImage[ 0 ].size ? mediaImage[ 0 ].size : 'full' );
			if ( size !== 'full' ) {
				url =
				get( media, [ 'sizes', size, 'url' ] ) ||
				get( media, [
					'media_details',
					'sizes',
					size,
					'source_url',
				] );
			}
			const width = get( media, [ 'sizes', size, 'width' ] ) || get( media, [ 'media_details', 'sizes', size, 'width' ] ) || get( media, [ 'width' ] ) || get( media, [ 'media_details', 'width' ] );
			const height = get( media, [ 'sizes', size, 'height' ] ) || get( media, [ 'media_details', 'sizes', size, 'height' ] ) || get( media, [ 'height' ] ) || get( media, [ 'media_details', 'height' ] );
			saveMediaImage( {
				id: media.id,
				url: url || media.url,
				alt: media.alt,
				width: width,
				height: height,
				maxWidth: ( media.width && media.width < 800 ? media.width : 50 ),
				subtype: media.subtype,
			} );
		};
		const changeImageSize = img => {
			saveMediaImage( {
				url: img.value,
				width: img.width,
				height: img.height,
			} );
		};
		const clearImage = () => {
			saveMediaImage( {
				id: '',
				url: '',
				alt: '',
				width: '',
				height: '',
				maxWidth: '',
				subtype: '',
			} );
		};
		const onSelectFlipImage = media => {
			const width = get( media, [ 'width' ] ) ||
				get( media, [
					'media_details',
					'width',
				] );
			const height = get( media, [ 'height' ] ) ||
			get( media, [
				'media_details',
				'height',
			] );
			saveMediaImage( {
				flipId: media.id,
				flipUrl: media.url,
				flipAlt: media.alt,
				flipWidth: width,
				flipHeight: height,
				flipSubtype: media.subtype,
			} );
		};
		const clearFlipImage = () => {
			saveMediaImage( {
				flipId: '',
				flipUrl: '',
				flipAlt: '',
				flipWidth: '',
				flipHeight: '',
				flipSubtype: '',
			} );
		};
		const changeFlipImageSize = img => {
			saveMediaImage( {
				flipUrl: img.value,
				flipWidth: img.width,
				flipHeight: img.height,
			} );
		};
		const isSelectedClass = ( isSelected ? 'is-selected' : 'not-selected' );
		const saveMediaImage = ( value ) => {
			const newUpdate = mediaImage.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				mediaImage: newUpdate,
			} );
		};
		const saveMediaIcon = ( value ) => {
			const newUpdate = mediaIcon.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				mediaIcon: newUpdate,
			} );
		};
		const saveMediaStyle = ( value ) => {
			const newUpdate = mediaStyle.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				mediaStyle: newUpdate,
			} );
		};
		const saveTitleFont = ( value ) => {
			const newUpdate = titleFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				titleFont: newUpdate,
			} );
		};
		const saveTextFont = ( value ) => {
			const newUpdate = textFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				textFont: newUpdate,
			} );
		};
		const saveTextSpacing = ( value ) => {
			let tSpacing;
			if ( undefined === textSpacing || ( undefined !== textSpacing && undefined === textSpacing[ 0 ] ) ) {
				tSpacing = [ {
					padding: [ '', '', '', '' ],
					paddingControl: 'linked',
					margin: [ '', '', '', '' ],
					marginControl: 'linked',
				} ];
			} else {
				tSpacing = textSpacing;
			}
			const newUpdate = tSpacing.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				textSpacing: newUpdate,
			} );
		};
		const saveLearnMoreStyles = ( value ) => {
			const newUpdate = learnMoreStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				learnMoreStyles: newUpdate,
			} );
		};
		const saveShadow = ( value ) => {
			const newUpdate = shadow.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				shadow: newUpdate,
			} );
		};
		const saveHoverShadow = ( value ) => {
			const newUpdate = shadowHover.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				shadowHover: newUpdate,
			} );
		};
		const mediaImagedraw = ( 'drawborder' === mediaImage[ 0 ].hoverAnimation || 'grayscale-border-draw' === mediaImage[ 0 ].hoverAnimation ? true : false );
		const renderCSS = (
			<style>
				{ ( mediaIcon[ 0 ].hoverColor ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-info-svg-icon { color: ${ mediaIcon[ 0 ].hoverColor } !important; }` : '' ) }
				{ ( mediaStyle[ 0 ].borderRadius ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media img, #kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media .editor-media-placeholder { border-radius: ${ mediaStyle[ 0 ].borderRadius }px; }` : '' ) }
				{ ( titleHoverColor ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-title { color: ${ titleHoverColor } !important; }` : '' ) }
				{ ( textHoverColor ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-text { color: ${ textHoverColor } !important; }` : '' ) }
				{ ( learnMoreStyles[ 0 ].colorHover ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore { color: ${ learnMoreStyles[ 0 ].colorHover } !important; }` : '' ) }
				{ ( learnMoreStyles[ 0 ].borderHover ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore { border-color: ${ learnMoreStyles[ 0 ].borderHover } !important; }` : '' ) }
				{ ( learnMoreStyles[ 0 ].backgroundHover ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore { background-color: ${ learnMoreStyles[ 0 ].backgroundHover } !important; }` : '' ) }
				{ ( containerHoverBackground ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover { background: ${ ( containerHoverBackground ? hexToRGBA( containerHoverBackground, ( undefined !== containerHoverBackgroundOpacity ? containerHoverBackgroundOpacity : 1 ) ) : hexToRGBA( '#f2f2f2', ( undefined !== containerHoverBackgroundOpacity ? containerHoverBackgroundOpacity : 1 ) ) ) } !important; }` : '' ) }
				{ ( containerHoverBorder ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover { border-color: ${ ( containerHoverBorder ? hexToRGBA( containerHoverBorder, ( undefined !== containerHoverBorderOpacity ? containerHoverBorderOpacity : 1 ) ) : hexToRGBA( '#f2f2f2', ( undefined !== containerHoverBorderOpacity ? containerHoverBorderOpacity : 1 ) ) ) } !important; }` : '' ) }
				{ ( displayShadow ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover { box-shadow: ${ shadowHover[ 0 ].hOffset + 'px ' + shadowHover[ 0 ].vOffset + 'px ' + shadowHover[ 0 ].blur + 'px ' + shadowHover[ 0 ].spread + 'px ' + hexToRGBA( shadowHover[ 0 ].color, shadowHover[ 0 ].opacity ) } !important; }` : '' ) }
				{ ( mediaStyle[ 0 ].hoverBackground ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { background: ${ mediaStyle[ 0 ].hoverBackground } !important; }` : '' ) }
				{ ( mediaStyle[ 0 ].hoverBorder && 'icon' === mediaType && 'drawborder' !== mediaIcon[ 0 ].hoverAnimation ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { border-color: ${ mediaStyle[ 0 ].hoverBorder } !important; }` : '' ) }
				{ ( mediaStyle[ 0 ].hoverBorder && 'image' === mediaType && true !== mediaImagedraw ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { border-color: ${ mediaStyle[ 0 ].hoverBorder } !important; }` : '' ) }
				{ 'icon' === mediaType && 'drawborder' === mediaIcon[ 0 ].hoverAnimation && (
					`#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media { border-width:0 !important; box-shadow: inset 0 0 0 ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px ${ mediaStyle[ 0 ].border }; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before, #kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-radius: ${ mediaStyle[ 0 ].borderRadius }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before { border-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-width: 0; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before { border-top-color: ${ mediaStyle[ 0 ].hoverBorder } ; border-right-color: ${ mediaStyle[ 0 ].hoverBorder }; border-bottom-color: ${ mediaStyle[ 0 ].hoverBorder } }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:after{ border-right-color: ${ mediaStyle[ 0 ].hoverBorder }; border-right-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-bottom-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-top-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }`
				) }
				{ 'image' === mediaType && true === mediaImagedraw && (
					`#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media { border-width:0 !important; box-shadow: inset 0 0 0 ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px ${ mediaStyle[ 0 ].border }; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before, #kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-radius: ${ mediaStyle[ 0 ].borderRadius }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before { border-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-width: 0; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before { border-top-color: ${ mediaStyle[ 0 ].hoverBorder } ; border-right-color: ${ mediaStyle[ 0 ].hoverBorder }; border-bottom-color: ${ mediaStyle[ 0 ].hoverBorder } }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:after{ border-right-color: ${ mediaStyle[ 0 ].hoverBorder }; border-right-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-bottom-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-top-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }`
				) }
			</style>
		);
		return (
			<div id={ `kt-info-box${ uniqueID }` } className={ className }>
				{ renderCSS }
				<BlockControls key="controls">
					{ 'image' === mediaType && mediaImage[ 0 ].url && (
						<Toolbar>
							<MediaUpload
								onSelect={ onSelectImage }
								type="image"
								value={ mediaImage[ 0 ].id }
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								render={ ( { open } ) => (
									<IconButton
										className="components-toolbar__control"
										label={ __( 'Edit Media' ) }
										icon="format-image"
										onClick={ open }
									/>
								) }
							/>
						</Toolbar>
					) }
					{ 'icon' === mediaType && (
						<Dropdown
							className="kb-popover-inline-icon-container components-dropdown-menu components-toolbar"
							contentClassName="kb-popover-inline-icon"
							position="top center"
							renderToggle={ ( { isOpen, onToggle } ) => (
								<Fragment>
									<IconButton className="components-dropdown-menu__toggle kb-inline-icon-toolbar-icon" label={ __( 'Icon Settings' ) } tooltip={ __( 'Icon Settings' ) } icon={ 'star-filled' } onClick={ onToggle } aria-expanded={ isOpen }>
										<span className="components-dropdown-menu__indicator" />
									</IconButton>
								</Fragment>
							) }
							renderContent={ () => (
								<Fragment>
									<div className="kb-inline-icon-control">
										<IconControl
											value={ mediaIcon[ 0 ].icon }
											onChange={ value => saveMediaIcon( { icon: value } ) }
										/>
										<RangeControl
											label={ __( 'Icon Size' ) }
											value={ mediaIcon[ 0 ].size }
											onChange={ value => saveMediaIcon( { size: value } ) }
											min={ 5 }
											max={ 250 }
											step={ 1 }
										/>
									</div>
								</Fragment>
							) }
						/>
					) }
					<AlignmentToolbar
						value={ hAlign }
						onChange={ value => setAttributes( { hAlign: value } ) }
					/>
					<InfoBoxStyleCopyPaste
						onPaste={ value => setAttributes( value ) }
						onPasteMediaImage={ value => saveMediaImage( value ) }
						onPasteMediaIcon={ value => saveMediaIcon( value ) }
						blockAttributes={ this.props.attributes }
					/>
				</BlockControls>
				{ this.showSettings( 'allSettings' ) && (
					<InspectorControls>
						<PanelBody>
							<Fragment>
								<h2>{ __( 'InfoBox Quick Layout Presets' ) }</h2>
								<ButtonGroup className="kt-style-btn-group kb-info-layouts" aria-label={ __( 'InfoBox Style' ) }>
									{ map( layoutPresetOptions, ( { name, key, icon } ) => (
										<Button
											key={ key }
											className="kt-style-btn"
											isSmall
											isPrimary={ false }
											aria-pressed={ false }
											onClick={ () => {
												setPresetLayout( key );
											} }
										>
											{ icon }
										</Button>
									) ) }
								</ButtonGroup>
							</Fragment>
							<div className="kt-controls-link-wrap">
								<h2>{ __( 'Link' ) }</h2>
								<URLInput
									className="kt-btn-link-input"
									value={ link }
									onChange={ value => setAttributes( { link: value } ) }
								/>
							</div>
							<SelectControl
								label={ __( 'Link Target' ) }
								value={ target }
								options={ [
									{ value: '_self', label: __( 'Same Window' ) },
									{ value: '_blank', label: __( 'New Window' ) },
								] }
								onChange={ value => setAttributes( { target: value } ) }
							/>
							<SelectControl
								label={ __( 'Link Content' ) }
								value={ linkProperty }
								options={ [
									{ value: 'box', label: __( 'Entire Box' ) },
									{ value: 'learnmore', label: __( 'Only Learn More Text' ) },
								] }
								onChange={ value => setAttributes( { linkProperty: value } ) }
							/>
							<h2 className="kt-heading-size-title">{ __( 'Content Align' ) }</h2>
							<TabPanel className="kt-size-tabs kb-sidebar-alignment"
								activeClass="active-tab"
								tabs={ [
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
								] }>
								{
									( tab ) => {
										let tabout;
										if ( tab.name ) {
											if ( 'mobile' === tab.name ) {
												tabout = (
													<AlignmentToolbar
														isCollapsed={ false }
														value={ hAlignMobile }
														onChange={ ( value ) => setAttributes( { hAlignMobile: value } ) }
													/>
												);
											} else if ( 'tablet' === tab.name ) {
												tabout = (
													<AlignmentToolbar
														isCollapsed={ false }
														value={ hAlignTablet }
														onChange={ ( value ) => setAttributes( { hAlignTablet: value } ) }
													/>
												);
											} else {
												tabout = (
													<AlignmentToolbar
														isCollapsed={ false }
														value={ hAlign }
														onChange={ ( value ) => setAttributes( { hAlign: value } ) }
													/>
												);
											}
										}
										return <div>{ tabout }</div>;
									}
								}
							</TabPanel>
						</PanelBody>
						{ this.showSettings( 'containerSettings' ) && (
							<PanelBody
								title={ __( 'Container Settings' ) }
								initialOpen={ false }
							>
								<MeasurementControls
									label={ __( 'Container Border Width (px)' ) }
									measurement={ containerBorderWidth }
									control={ containerBorderControl }
									onChange={ ( value ) => setAttributes( { containerBorderWidth: value } ) }
									onControl={ ( value ) => this.setState( { containerBorderControl: value } ) }
									min={ 0 }
									max={ 40 }
									step={ 1 }
								/>
								<RangeControl
									label={ __( 'Container Border Radius (px)' ) }
									value={ containerBorderRadius }
									onChange={ value => setAttributes( { containerBorderRadius: value } ) }
									step={ 1 }
									min={ 0 }
									max={ 200 }
								/>
								<TabPanel className="kt-inspect-tabs kt-hover-tabs"
									activeClass="active-tab"
									tabs={ [
										{
											name: 'normal',
											title: __( 'Normal' ),
											className: 'kt-normal-tab',
										},
										{
											name: 'hover',
											title: __( 'Hover' ),
											className: 'kt-hover-tab',
										},
									] }>
									{
										( tab ) => {
											let tabout;
											if ( tab.name ) {
												if ( 'hover' === tab.name ) {
													tabout = (
														<Fragment>
															<AdvancedColorControl
																label={ __( 'Hover Background' ) }
																colorValue={ ( containerHoverBackground ? containerHoverBackground : '#f2f2f2' ) }
																colorDefault={ '#f2f2f2' }
																opacityValue={ containerHoverBackgroundOpacity }
																onColorChange={ value => setAttributes( { containerHoverBackground: value } ) }
																onOpacityChange={ value => setAttributes( { containerHoverBackgroundOpacity: value } ) }
															/>
															<AdvancedColorControl
																label={ __( 'Hover Border' ) }
																colorValue={ ( containerHoverBorder ? containerHoverBorder : '#eeeeee' ) }
																colorDefault={ '#eeeeee' }
																opacityValue={ containerHoverBorderOpacity }
																onColorChange={ value => setAttributes( { containerHoverBorder: value } ) }
																onOpacityChange={ value => setAttributes( { containerHoverBorderOpacity: value } ) }
															/>
														</Fragment>
													);
												} else {
													tabout = (
														<Fragment>
															<AdvancedColorControl
																label={ __( 'Container Background' ) }
																colorValue={ ( containerBackground ? containerBackground : '#f2f2f2' ) }
																colorDefault={ '#f2f2f2' }
																opacityValue={ containerBackgroundOpacity }
																onColorChange={ value => setAttributes( { containerBackground: value } ) }
																onOpacityChange={ value => setAttributes( { containerBackgroundOpacity: value } ) }
															/>
															<AdvancedColorControl
																label={ __( 'Container Border' ) }
																colorValue={ ( containerBorder ? containerBorder : '#eeeeee' ) }
																colorDefault={ '#eeeeee' }
																opacityValue={ containerBorderOpacity }
																onColorChange={ value => setAttributes( { containerBorder: value } ) }
																onOpacityChange={ value => setAttributes( { containerBorderOpacity: value } ) }
															/>
														</Fragment>
													);
												}
											}
											return <div>{ tabout }</div>;
										}
									}
								</TabPanel>
								<MeasurementControls
									label={ __( 'Container Padding' ) }
									measurement={ containerPadding }
									control={ containerPaddingControl }
									onChange={ ( value ) => setAttributes( { containerPadding: value } ) }
									onControl={ ( value ) => this.setState( { containerPaddingControl: value } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<ButtonGroup className="kt-size-type-options kt-row-size-type-options kb-typo-when-linked-individual-avail" aria-label={ __( 'Margin Type', 'kadence-blocks' ) }>
									{ map( marginTypes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ containerMarginUnit === key }
											aria-pressed={ containerMarginUnit === key }
											onClick={ () => setAttributes( { containerMarginUnit: key } ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
								<MeasurementControls
									label={ __( 'Margin', 'kadence-blocks' ) }
									measurement={ containerMargin }
									onChange={ ( value ) => setAttributes( { containerMargin: value } ) }
									control={ containerMarginControl }
									onControl={ ( value ) => this.setState( { containerMarginControl: value } ) }
									min={ marginMin }
									max={ marginMax }
									step={ marginStep }
									allowEmpty={ true }
								/>
								<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Max Width Type' ) }>
									{ map( widthTypes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ maxWidthUnit === key }
											aria-pressed={ maxWidthUnit === key }
											onClick={ () => setAttributes( { maxWidthUnit: key } ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
								<RangeControl
									label={ __( 'Container Max Width' ) }
									value={ maxWidth }
									onChange={ ( value ) => {
										setAttributes( {
											maxWidth: value,
										} );
									} }
									min={ 0 }
									max={ widthMax }
								/>
							</PanelBody>
						) }
						{ this.showSettings( 'mediaSettings' ) && (
							<PanelBody
								title={ __( 'Media Settings' ) }
								initialOpen={ false }
							>
								<TabPanel className="kt-inspect-tabs kt-spacer-tabs"
									activeClass="active-tab"
									tabs={ [
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
									] }>
									{
										( tab ) => {
											let tabout;
											if ( tab.name ) {
												if ( 'mobile' === tab.name ) {
													tabout = (
														<SelectControl
															label={ __( 'Mobile Media Align' ) }
															value={ ( mediaAlignMobile ? mediaAlignMobile : mediaAlign ) }
															options={ [
																{ value: 'top', label: __( 'Top' ) },
																{ value: 'left', label: __( 'Left' ) },
																{ value: 'right', label: __( 'Right' ) },
															] }
															onChange={ value => setAttributes( { mediaAlignMobile: value } ) }
														/>
													);
												} else if ( 'tablet' === tab.name ) {
													tabout = (
														<SelectControl
															label={ __( 'Tablet Media Align' ) }
															value={ ( mediaAlignTablet ? mediaAlignTablet : mediaAlign ) }
															options={ [
																{ value: 'top', label: __( 'Top' ) },
																{ value: 'left', label: __( 'Left' ) },
																{ value: 'right', label: __( 'Right' ) },
															] }
															onChange={ value => setAttributes( { mediaAlignTablet: value } ) }
														/>
													);
												} else {
													tabout = (
														<SelectControl
															label={ __( 'Media Align' ) }
															value={ mediaAlign }
															options={ [
																{ value: 'top', label: __( 'Top' ) },
																{ value: 'left', label: __( 'Left' ) },
																{ value: 'right', label: __( 'Right' ) },
															] }
															onChange={ value => setAttributes( { mediaAlign: value } ) }
														/>
													);
												}
											}
											return <div>{ tabout }</div>;
										}
									}
								</TabPanel>
								{ mediaAlign !== 'top' && (
									<Fragment>
										<SelectControl
											label={ __( 'Media Vertical Align' ) }
											value={ mediaVAlign }
											options={ [
												{ value: 'top', label: __( 'Top' ) },
												{ value: 'middle', label: __( 'Middle' ) },
												{ value: 'bottom', label: __( 'Bottom' ) },
											] }
											onChange={ value => setAttributes( { mediaVAlign: value } ) }
										/>
									</Fragment>
								) }
								<SelectControl
									label={ __( 'Media Type' ) }
									value={ mediaType }
									options={ [
										{ value: 'icon', label: __( 'Icon' ) },
										{ value: 'image', label: __( 'Image' ) },
										{ value: 'none', label: __( 'None' ) },
									] }
									onChange={ value => setAttributes( { mediaType: value } ) }
								/>
								{ 'image' === mediaType && (
									<Fragment>
										{ mediaImage[ 0 ].url && (
											<div className="kb-image-edit-settings-container">
												<MediaUpload
													onSelect={ onSelectImage }
													type="image"
													value={ mediaImage[ 0 ].id }
													allowedTypes={ ALLOWED_MEDIA_TYPES }
													render={ ( { open } ) => (
														<Button
															className={ 'components-button components-icon-button kt-cta-upload-btn kb-upload-inline-btn' }
															onClick={ open }
														>
															<Dashicon icon="format-image" />
															{ __( 'Edit Media' ) }
														</Button>
													) }
												/>
												<IconButton
													label={ __( 'clear' ) }
													className="kb-clear-image-btn"
													icon="no-alt"
													onClick={ clearImage }
												/>
											</div>
										) }
										{ mediaImage[ 0 ].id && 'svg+xml' !== mediaImage[ 0 ].subtype && (
											<ImageSizeControl
												label={ __( 'Image File Size' ) }
												id={ mediaImage[ 0 ].id }
												url={ mediaImage[ 0 ].url }
												onChange={ changeImageSize }
											/>
										) }
										<RangeControl
											label={ __( 'Max Image Width' ) }
											value={ mediaImage[ 0 ].maxWidth }
											onChange={ value => saveMediaImage( { maxWidth: value } ) }
											min={ 5 }
											max={ 800 }
											step={ 1 }
										/>
										<SelectControl
											label={ __( 'Image Hover Animation' ) }
											value={ mediaImage[ 0 ].hoverAnimation }
											options={ [
												{ value: 'none', label: __( 'None' ) },
												{ value: 'grayscale', label: __( 'Grayscale to Color' ) },
												{ value: 'drawborder', label: __( 'Border Spin In' ) },
												{ value: 'grayscale-border-draw', label: __( 'Grayscale to Color & Border Spin In' ) },
												{ value: 'flip', label: __( 'Flip to Another Image' ) },
											] }
											onChange={ value => saveMediaImage( { hoverAnimation: value } ) }
										/>
										{ 'flip' === mediaImage[ 0 ].hoverAnimation && (
											<Fragment>
												<h2>{ __( 'Flip Image (Use same size as start image' ) }</h2>
												{ ! mediaImage[ 0 ].flipUrl && (
													<MediaUpload
														onSelect={ onSelectFlipImage }
														type="image"
														value={ '' }
														render={ ( { open } ) => (
															<Button
																className={ 'components-button components-icon-button kt-cta-upload-btn' }
																onClick={ open }
															>
																<Dashicon icon="format-image" />
																{ __( 'Select Image' ) }
															</Button>
														) }
													/>
												) }
												{ mediaImage[ 0 ].flipUrl && (
													<div className="kb-image-edit-settings-container">
														<MediaUpload
															onSelect={ onSelectFlipImage }
															type="image"
															value={ mediaImage[ 0 ].flipId }
															allowedTypes={ ALLOWED_MEDIA_TYPES }
															render={ ( { open } ) => (
																<Button
																	className={ 'components-button components-icon-button kt-cta-upload-btn kb-upload-inline-btn' }
																	onClick={ open }
																>
																	<Dashicon icon="format-image" />
																	{ __( 'Edit Media' ) }
																</Button>
															) }
														/>
														<IconButton
															label={ __( 'clear' ) }
															className="kb-clear-image-btn"
															icon="no-alt"
															onClick={ clearFlipImage }
														/>
													</div>
												) }
												{ mediaImage[ 0 ].flipId && 'svg+xml' !== mediaImage[ 0 ].flipSubtype && (
													<ImageSizeControl
														label={ __( 'Image File Size' ) }
														id={ mediaImage[ 0 ].flipId }
														url={ mediaImage[ 0 ].flipUrl }
														onChange={ changeFlipImageSize }
													/>
												) }
											</Fragment>
										) }
										<MeasurementControls
											label={ __( 'Image Border' ) }
											measurement={ mediaStyle[ 0 ].borderWidth }
											control={ mediaBorderControl }
											onChange={ ( value ) => saveMediaStyle( { borderWidth: value } ) }
											onControl={ ( value ) => this.setState( { mediaBorderControl: value } ) }
											min={ 0 }
											max={ 40 }
											step={ 1 }
										/>
										<RangeControl
											label={ __( 'Image Border Radius (px)' ) }
											value={ mediaStyle[ 0 ].borderRadius }
											onChange={ value => saveMediaStyle( { borderRadius: value } ) }
											step={ 1 }
											min={ 0 }
											max={ 200 }
										/>
										<TabPanel className="kt-inspect-tabs kt-hover-tabs"
											activeClass="active-tab"
											tabs={ [
												{
													name: 'normal',
													title: __( 'Normal' ),
													className: 'kt-normal-tab',
												},
												{
													name: 'hover',
													title: __( 'Hover' ),
													className: 'kt-hover-tab',
												},
											] }>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'hover' === tab.name ) {
															tabout = (
																<Fragment>
																	{ mediaImage[ 0 ].subtype && 'svg+xml' === mediaImage[ 0 ].subtype && (
																		<Fragment>
																			<AdvancedColorControl
																				label={ __( 'SVG Hover Color' ) }
																				colorValue={ ( mediaIcon[ 0 ].hoverColor ? mediaIcon[ 0 ].hoverColor : '#444444' ) }
																				colorDefault={ '#444444' }
																				onColorChange={ value => saveMediaIcon( { hoverColor: value } ) }
																			/>
																			<small>{ __( '*you must force inline svg for this to have effect.' ) }</small>
																		</Fragment>
																	) }
																	<AdvancedColorControl
																		label={ __( 'Image Hover Background' ) }
																		colorValue={ ( mediaStyle[ 0 ].hoverBackground ? mediaStyle[ 0 ].hoverBackground : '' ) }
																		colorDefault={ 'transparent' }
																		onColorChange={ value => saveMediaStyle( { hoverBackground: value } ) }
																	/>
																	<AdvancedColorControl
																		label={ __( 'Image Hover Border' ) }
																		colorValue={ ( mediaStyle[ 0 ].hoverBorder ? mediaStyle[ 0 ].hoverBorder : '#444444' ) }
																		colorDefault={ '#444444' }
																		onColorChange={ value => saveMediaStyle( { hoverBorder: value } ) }
																	/>
																</Fragment>
															);
														} else {
															tabout = (
																<Fragment>
																	{ mediaImage[ 0 ].subtype && 'svg+xml' === mediaImage[ 0 ].subtype && (
																		<Fragment>
																			<AdvancedColorControl
																				label={ __( 'SVG Color' ) }
																				colorValue={ ( mediaIcon[ 0 ].color ? mediaIcon[ 0 ].color : '#444444' ) }
																				colorDefault={ '#444444' }
																				onColorChange={ value => saveMediaIcon( { color: value } ) }
																			/>
																			<small>{ __( '*you must force inline svg for this to have effect.' ) }</small>
																		</Fragment>
																	) }
																	<AdvancedColorControl
																		label={ __( 'Image Background' ) }
																		colorValue={ ( mediaStyle[ 0 ].background ? mediaStyle[ 0 ].background : '' ) }
																		colorDefault={ 'transparent' }
																		onColorChange={ value => saveMediaStyle( { background: value } ) }
																	/>
																	<AdvancedColorControl
																		label={ __( 'Image Border' ) }
																		colorValue={ ( mediaStyle[ 0 ].border ? mediaStyle[ 0 ].border : '#444444' ) }
																		colorDefault={ '#444444' }
																		onColorChange={ value => saveMediaStyle( { border: value } ) }
																	/>
																</Fragment>
															);
														}
													}
													return <div>{ tabout }</div>;
												}
											}
										</TabPanel>
									</Fragment>
								) }
								{ 'icon' === mediaType && (
									<Fragment>
										<IconControl
											value={ mediaIcon[ 0 ].icon }
											onChange={ value => saveMediaIcon( { icon: value } ) }
										/>
										<RangeControl
											label={ __( 'Icon Size' ) }
											value={ mediaIcon[ 0 ].size }
											onChange={ value => saveMediaIcon( { size: value } ) }
											min={ 5 }
											max={ 250 }
											step={ 1 }
										/>
										{ mediaIcon[ 0 ].icon && 'fe' === mediaIcon[ 0 ].icon.substring( 0, 2 ) && (
											<RangeControl
												label={ __( 'Icon Line Width' ) }
												value={ mediaIcon[ 0 ].width }
												onChange={ value => saveMediaIcon( { width: value } ) }
												step={ 0.5 }
												min={ 0.5 }
												max={ 4 }
											/>
										) }
										<MeasurementControls
											label={ __( 'Icon Border' ) }
											measurement={ mediaStyle[ 0 ].borderWidth }
											control={ mediaBorderControl }
											onChange={ ( value ) => saveMediaStyle( { borderWidth: value } ) }
											onControl={ ( value ) => this.setState( { mediaBorderControl: value } ) }
											min={ 0 }
											max={ 40 }
											step={ 1 }
										/>
										<RangeControl
											label={ __( 'Icon Border Radius (px)' ) }
											value={ mediaStyle[ 0 ].borderRadius }
											onChange={ value => saveMediaStyle( { borderRadius: value } ) }
											step={ 1 }
											min={ 0 }
											max={ 200 }
										/>
										<SelectControl
											label={ __( 'Icon Hover Animation' ) }
											value={ mediaIcon[ 0 ].hoverAnimation }
											options={ [
												{ value: 'none', label: __( 'None' ) },
												{ value: 'drawborder', label: __( 'Border Spin In' ) },
												{ value: 'flip', label: __( 'Flip to Another Icon' ) },
											] }
											onChange={ value => saveMediaIcon( { hoverAnimation: value } ) }
										/>
										{ mediaIcon[ 0 ].hoverAnimation === 'flip' && (
											<IconControl
												value={ mediaIcon[ 0 ].flipIcon }
												onChange={ value => saveMediaIcon( { flipIcon: value } ) }
											/>
										) }
										<TabPanel className="kt-inspect-tabs kt-hover-tabs"
											activeClass="active-tab"
											tabs={ [
												{
													name: 'normal',
													title: __( 'Normal' ),
													className: 'kt-normal-tab',
												},
												{
													name: 'hover',
													title: __( 'Hover' ),
													className: 'kt-hover-tab',
												},
											] }>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'hover' === tab.name ) {
															tabout = (
																<Fragment>
																	<AdvancedColorControl
																		label={ __( 'Icon Hover Color' ) }
																		colorValue={ ( mediaIcon[ 0 ].hoverColor ? mediaIcon[ 0 ].hoverColor : '#444444' ) }
																		colorDefault={ '#444444' }
																		onColorChange={ value => saveMediaIcon( { hoverColor: value } ) }
																	/>
																	<AdvancedColorControl
																		label={ __( 'Icon Hover Background' ) }
																		colorValue={ ( mediaStyle[ 0 ].hoverBackground ? mediaStyle[ 0 ].hoverBackground : '' ) }
																		colorDefault={ 'transparent' }
																		onColorChange={ value => saveMediaStyle( { hoverBackground: value } ) }
																	/>
																	<AdvancedColorControl
																		label={ __( 'Icon Hover Border' ) }
																		colorValue={ ( mediaStyle[ 0 ].hoverBorder ? mediaStyle[ 0 ].hoverBorder : '#444444' ) }
																		colorDefault={ '#444444' }
																		onColorChange={ value => saveMediaStyle( { hoverBorder: value } ) }
																	/>
																</Fragment>
															);
														} else {
															tabout = (
																<Fragment>
																	<AdvancedColorControl
																		label={ __( 'Icon Color' ) }
																		colorValue={ ( mediaIcon[ 0 ].color ? mediaIcon[ 0 ].color : '#444444' ) }
																		colorDefault={ '#444444' }
																		onColorChange={ value => saveMediaIcon( { color: value } ) }
																	/>
																	<AdvancedColorControl
																		label={ __( 'Icon Background' ) }
																		colorValue={ ( mediaStyle[ 0 ].background ? mediaStyle[ 0 ].background : '' ) }
																		colorDefault={ 'transparent' }
																		onColorChange={ value => saveMediaStyle( { background: value } ) }
																	/>
																	<AdvancedColorControl
																		label={ __( 'Icon Border Color' ) }
																		colorValue={ ( mediaStyle[ 0 ].border ? mediaStyle[ 0 ].border : '#444444' ) }
																		colorDefault={ '#444444' }
																		onColorChange={ value => saveMediaStyle( { border: value } ) }
																	/>
																</Fragment>
															);
														}
													}
													return <div>{ tabout }</div>;
												}
											}
										</TabPanel>
										<TextControl
											label={ __( 'Icon Title for Accessibility' ) }
											value={ mediaIcon[ 0 ].title }
											onChange={ value => saveMediaIcon( { title: value } ) }
										/>
									</Fragment>
								) }
								<MeasurementControls
									label={ __( 'Media Padding' ) }
									measurement={ mediaStyle[ 0 ].padding }
									control={ mediaPaddingControl }
									onChange={ ( value ) => saveMediaStyle( { padding: value } ) }
									onControl={ ( value ) => this.setState( { mediaPaddingControl: value } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<MeasurementControls
									label={ __( 'Media Margin' ) }
									measurement={ mediaStyle[ 0 ].margin }
									control={ mediaMarginControl }
									onChange={ ( value ) => saveMediaStyle( { margin: value } ) }
									onControl={ ( value ) => this.setState( { mediaMarginControl: value } ) }
									min={ -200 }
									max={ 200 }
									step={ 1 }
								/>
							</PanelBody>
						) }
						{ this.showSettings( 'titleSettings' ) && (
							<PanelBody
								title={ __( 'Title Settings' ) }
								initialOpen={ false }
							>
								<ToggleControl
									label={ __( 'Show Title' ) }
									checked={ displayTitle }
									onChange={ ( value ) => setAttributes( { displayTitle: value } ) }
								/>
								{ displayTitle && (
									<Fragment>
										<h2 className="kt-tab-wrap-title">{ __( 'Color Settings' ) }</h2>
										<TabPanel className="kt-inspect-tabs kt-hover-tabs"
											activeClass="active-tab"
											tabs={ [
												{
													name: 'normal',
													title: __( 'Normal' ),
													className: 'kt-normal-tab',
												},
												{
													name: 'hover',
													title: __( 'Hover' ),
													className: 'kt-hover-tab',
												},
											] }>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'hover' === tab.name ) {
															tabout = (
																<AdvancedColorControl
																	label={ __( 'Hover Color' ) }
																	colorValue={ ( titleHoverColor ? titleHoverColor : '' ) }
																	colorDefault={ '' }
																	onColorChange={ value => setAttributes( { titleHoverColor: value } ) }
																/>
															);
														} else {
															tabout = (
																<AdvancedColorControl
																	label={ __( 'Title Color' ) }
																	colorValue={ ( titleColor ? titleColor : '' ) }
																	colorDefault={ '' }
																	onColorChange={ value => setAttributes( { titleColor: value } ) }
																/>
															);
														}
													}
													return <div>{ tabout }</div>;
												}
											}
										</TabPanel>
										<TypographyControls
											tagLevel={ titleFont[ 0 ].level }
											onTagLevel={ ( value ) => saveTitleFont( { level: value } ) }
											fontSize={ titleFont[ 0 ].size }
											onFontSize={ ( value ) => saveTitleFont( { size: value } ) }
											fontSizeType={ titleFont[ 0 ].sizeType }
											onFontSizeType={ ( value ) => saveTitleFont( { sizeType: value } ) }
											lineHeight={ titleFont[ 0 ].lineHeight }
											onLineHeight={ ( value ) => saveTitleFont( { lineHeight: value } ) }
											lineHeightType={ titleFont[ 0 ].lineType }
											onLineHeightType={ ( value ) => saveTitleFont( { lineType: value } ) }
											letterSpacing={ titleFont[ 0 ].letterSpacing }
											onLetterSpacing={ ( value ) => saveTitleFont( { letterSpacing: value } ) }
											fontFamily={ titleFont[ 0 ].family }
											onFontFamily={ ( value ) => saveTitleFont( { family: value } ) }
											onFontChange={ ( select ) => {
												saveTitleFont( {
													family: select.value,
													google: select.google,
												} );
											} }
											onFontArrayChange={ ( values ) => saveTitleFont( values ) }
											googleFont={ titleFont[ 0 ].google }
											onGoogleFont={ ( value ) => saveTitleFont( { google: value } ) }
											loadGoogleFont={ titleFont[ 0 ].loadGoogle }
											onLoadGoogleFont={ ( value ) => saveTitleFont( { loadGoogle: value } ) }
											fontVariant={ titleFont[ 0 ].variant }
											onFontVariant={ ( value ) => saveTitleFont( { variant: value } ) }
											fontWeight={ titleFont[ 0 ].weight }
											onFontWeight={ ( value ) => saveTitleFont( { weight: value } ) }
											fontStyle={ titleFont[ 0 ].style }
											onFontStyle={ ( value ) => saveTitleFont( { style: value } ) }
											fontSubset={ titleFont[ 0 ].subset }
											onFontSubset={ ( value ) => saveTitleFont( { subset: value } ) }
											padding={ titleFont[ 0 ].padding }
											onPadding={ ( value ) => saveTitleFont( { padding: value } ) }
											paddingControl={ titleFont[ 0 ].paddingControl }
											onPaddingControl={ ( value ) => saveTitleFont( { paddingControl: value } ) }
											margin={ titleFont[ 0 ].margin }
											onMargin={ ( value ) => saveTitleFont( { margin: value } ) }
											marginControl={ titleFont[ 0 ].marginControl }
											onMarginControl={ ( value ) => saveTitleFont( { marginControl: value } ) }
										/>
										<h2 className="kt-heading-size-title">{ __( 'Min Height' ) }</h2>
										<TabPanel className="kt-size-tabs"
											activeClass="active-tab"
											tabs={ [
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
											] }>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'mobile' === tab.name ) {
															tabout = (
																<RangeControl
																	value={ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 2 ] ) ? titleMinHeight[ 2 ] : '' ) }
																	onChange={ value => setAttributes( { titleMinHeight: [ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ) ? titleMinHeight[ 0 ] : '' ), ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 1 ] ) ? titleMinHeight[ 1 ] : '' ), value ] } ) }
																	step={ 1 }
																	min={ 0 }
																	max={ 600 }
																/>
															);
														} else if ( 'tablet' === tab.name ) {
															tabout = (
																<RangeControl
																	value={ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 1 ] ) ? titleMinHeight[ 1 ] : '' ) }
																	onChange={ value => setAttributes( { titleMinHeight: [ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ) ? titleMinHeight[ 0 ] : '' ), value, ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 2 ] ) ? titleMinHeight[ 2 ] : '' ) ] } ) }
																	step={ 1 }
																	min={ 0 }
																	max={ 600 }
																/>
															);
														} else {
															tabout = (
																<RangeControl
																	value={ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ) ? titleMinHeight[ 0 ] : '' ) }
																	onChange={ value => setAttributes( { titleMinHeight: [ value, ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 1 ] ) ? titleMinHeight[ 1 ] : '' ), ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 2 ] ) ? titleMinHeight[ 2 ] : '' ) ] } ) }
																	step={ 1 }
																	min={ 0 }
																	max={ 600 }
																/>
															);
														}
													}
													return <div>{ tabout }</div>;
												}
											}
										</TabPanel>
									</Fragment>
								) }
							</PanelBody>
						) }
						{ this.showSettings( 'textSettings' ) && (
							<PanelBody
								title={ __( 'Text Settings' ) }
								initialOpen={ false }
							>
								<ToggleControl
									label={ __( 'Show Text' ) }
									checked={ displayText }
									onChange={ ( value ) => setAttributes( { displayText: value } ) }
								/>
								{ displayText && (
									<Fragment>
										<h2 className="kt-tab-wrap-title">{ __( 'Color Settings' ) }</h2>
										<TabPanel className="kt-inspect-tabs kt-hover-tabs"
											activeClass="active-tab"
											tabs={ [
												{
													name: 'normal',
													title: __( 'Normal' ),
													className: 'kt-normal-tab',
												},
												{
													name: 'hover',
													title: __( 'Hover' ),
													className: 'kt-hover-tab',
												},
											] }>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'hover' === tab.name ) {
															tabout = (
																<AdvancedColorControl
																	label={ __( 'Hover Color' ) }
																	colorValue={ ( textHoverColor ? textHoverColor : '' ) }
																	colorDefault={ '' }
																	onColorChange={ value => setAttributes( { textHoverColor: value } ) }
																/>
															);
														} else {
															tabout = (
																<AdvancedColorControl
																	label={ __( 'Text Color' ) }
																	colorValue={ ( textColor ? textColor : '' ) }
																	colorDefault={ '' }
																	onColorChange={ value => setAttributes( { textColor: value } ) }
																/>
															);
														}
													}
													return <div>{ tabout }</div>;
												}
											}
										</TabPanel>
										<TypographyControls
											fontSize={ textFont[ 0 ].size }
											onFontSize={ ( value ) => saveTextFont( { size: value } ) }
											fontSizeType={ textFont[ 0 ].sizeType }
											onFontSizeType={ ( value ) => saveTextFont( { sizeType: value } ) }
											lineHeight={ textFont[ 0 ].lineHeight }
											onLineHeight={ ( value ) => saveTextFont( { lineHeight: value } ) }
											lineHeightType={ textFont[ 0 ].lineType }
											onLineHeightType={ ( value ) => saveTextFont( { lineType: value } ) }
											letterSpacing={ textFont[ 0 ].letterSpacing }
											onLetterSpacing={ ( value ) => saveTextFont( { letterSpacing: value } ) }
											fontFamily={ textFont[ 0 ].family }
											onFontFamily={ ( value ) => saveTextFont( { family: value } ) }
											onFontChange={ ( select ) => {
												saveTextFont( {
													family: select.value,
													google: select.google,
												} );
											} }
											onFontArrayChange={ ( values ) => saveTextFont( values ) }
											googleFont={ textFont[ 0 ].google }
											onGoogleFont={ ( value ) => saveTextFont( { google: value } ) }
											loadGoogleFont={ textFont[ 0 ].loadGoogle }
											onLoadGoogleFont={ ( value ) => saveTextFont( { loadGoogle: value } ) }
											fontVariant={ textFont[ 0 ].variant }
											onFontVariant={ ( value ) => saveTextFont( { variant: value } ) }
											fontWeight={ textFont[ 0 ].weight }
											onFontWeight={ ( value ) => saveTextFont( { weight: value } ) }
											fontStyle={ textFont[ 0 ].style }
											onFontStyle={ ( value ) => saveTextFont( { style: value } ) }
											fontSubset={ textFont[ 0 ].subset }
											onFontSubset={ ( value ) => saveTextFont( { subset: value } ) }
										/>
										<TypographyControls
											padding={ ( undefined !== textSpacing && undefined !== textSpacing[ 0 ] && textSpacing[ 0 ].padding ? textSpacing[ 0 ].padding : [ '', '', '', '' ] ) }
											onPadding={ ( value ) => saveTextSpacing( { padding: value } ) }
											paddingControl={ ( undefined !== textSpacing && undefined !== textSpacing[ 0 ] && textSpacing[ 0 ].paddingControl ? textSpacing[ 0 ].paddingControl : 'linked' ) }
											onPaddingControl={ ( value ) => saveTextSpacing( { paddingControl: value } ) }
											margin={ ( undefined !== textSpacing && undefined !== textSpacing[ 0 ] && textSpacing[ 0 ].margin ? textSpacing[ 0 ].margin : [ '', '', '', '' ] ) }
											onMargin={ ( value ) => saveTextSpacing( { margin: value } ) }
											marginControl={ ( undefined !== textSpacing && undefined !== textSpacing[ 0 ] && textSpacing[ 0 ].marginControl ? textSpacing[ 0 ].marginControl : 'linked' ) }
											onMarginControl={ ( value ) => saveTextSpacing( { marginControl: value } ) }
										/>
										<h2 className="kt-heading-size-title">{ __( 'Min Height' ) }</h2>
										<TabPanel className="kt-size-tabs"
											activeClass="active-tab"
											tabs={ [
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
											] }>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'mobile' === tab.name ) {
															tabout = (
																<RangeControl
																	value={ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 2 ] ) ? textMinHeight[ 2 ] : '' ) }
																	onChange={ value => setAttributes( { textMinHeight: [ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 0 ] ) ? textMinHeight[ 0 ] : '' ), ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 1 ] ) ? textMinHeight[ 1 ] : '' ), value ] } ) }
																	step={ 1 }
																	min={ 0 }
																	max={ 600 }
																/>
															);
														} else if ( 'tablet' === tab.name ) {
															tabout = (
																<RangeControl
																	value={ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 1 ] ) ? textMinHeight[ 1 ] : '' ) }
																	onChange={ value => setAttributes( { textMinHeight: [ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 0 ] ) ? textMinHeight[ 0 ] : '' ), value, ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 2 ] ) ? textMinHeight[ 2 ] : '' ) ] } ) }
																	step={ 1 }
																	min={ 0 }
																	max={ 600 }
																/>
															);
														} else {
															tabout = (
																<RangeControl
																	value={ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 0 ] ) ? textMinHeight[ 0 ] : '' ) }
																	onChange={ value => setAttributes( { textMinHeight: [ value, ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 1 ] ) ? textMinHeight[ 1 ] : '' ), ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 2 ] ) ? textMinHeight[ 2 ] : '' ) ] } ) }
																	step={ 1 }
																	min={ 0 }
																	max={ 600 }
																/>
															);
														}
													}
													return <div>{ tabout }</div>;
												}
											}
										</TabPanel>
									</Fragment>
								) }
							</PanelBody>
						) }
						{ this.showSettings( 'learnMoreSettings' ) && (
							<PanelBody
								title={ __( 'Learn More Settings' ) }
								initialOpen={ false }
							>
								<ToggleControl
									label={ __( 'Show Learn More' ) }
									checked={ displayLearnMore }
									onChange={ ( value ) => setAttributes( { displayLearnMore: value } ) }
								/>
								{ displayLearnMore && (
									<Fragment>
										<h2 className="kt-tab-wrap-title">{ __( 'Color Settings' ) }</h2>
										<TabPanel className="kt-inspect-tabs kt-hover-tabs"
											activeClass="active-tab"
											tabs={ [
												{
													name: 'normal',
													title: __( 'Normal' ),
													className: 'kt-normal-tab',
												},
												{
													name: 'hover',
													title: __( 'Hover' ),
													className: 'kt-hover-tab',
												},
											] }>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'hover' === tab.name ) {
															tabout = (
																<Fragment>
																	<AdvancedColorControl
																		label={ __( 'HOVER: Text Color' ) }
																		colorValue={ ( learnMoreStyles[ 0 ].colorHover ? learnMoreStyles[ 0 ].colorHover : '#ffffff' ) }
																		colorDefault={ '#ffffff' }
																		onColorChange={ value => saveLearnMoreStyles( { colorHover: value } ) }
																	/>
																	<AdvancedColorControl
																		label={ __( 'HOVER: Background' ) }
																		colorValue={ ( learnMoreStyles[ 0 ].backgroundHover ? learnMoreStyles[ 0 ].backgroundHover : '#444444' ) }
																		colorDefault={ '#444444' }
																		onColorChange={ value => saveLearnMoreStyles( { backgroundHover: value } ) }
																	/>
																	<AdvancedColorControl
																		label={ __( 'HOVER: Border Color' ) }
																		colorValue={ ( learnMoreStyles[ 0 ].borderHover ? learnMoreStyles[ 0 ].borderHover : '#444444' ) }
																		colorDefault={ '#444444' }
																		onColorChange={ value => saveLearnMoreStyles( { borderHover: value } ) }
																	/>
																</Fragment>
															);
														} else {
															tabout = (
																<Fragment>
																	<AdvancedColorControl
																		label={ __( 'Text Color' ) }
																		colorValue={ ( learnMoreStyles[ 0 ].color ? learnMoreStyles[ 0 ].color : '' ) }
																		colorDefault={ '' }
																		onColorChange={ value => saveLearnMoreStyles( { color: value } ) }
																	/>
																	<AdvancedColorControl
																		label={ __( 'Background' ) }
																		colorValue={ ( learnMoreStyles[ 0 ].background ? learnMoreStyles[ 0 ].background : '' ) }
																		colorDefault={ 'transparent' }
																		onColorChange={ value => saveLearnMoreStyles( { background: value } ) }
																	/>
																	<AdvancedColorControl
																		label={ __( 'Border Color' ) }
																		colorValue={ ( learnMoreStyles[ 0 ].border ? learnMoreStyles[ 0 ].border : '#555555' ) }
																		colorDefault={ '#555555' }
																		onColorChange={ value => saveLearnMoreStyles( { border: value } ) }
																	/>
																</Fragment>
															);
														}
													}
													return <div>{ tabout }</div>;
												}
											}
										</TabPanel>
										<MeasurementControls
											label={ __( 'Learn More Border Width (px)' ) }
											measurement={ learnMoreStyles[ 0 ].borderWidth }
											control={ learnMoreStyles[ 0 ].borderControl }
											onChange={ ( value ) => saveLearnMoreStyles( { borderWidth: value } ) }
											onControl={ ( value ) => saveLearnMoreStyles( { borderControl: value } ) }
											min={ 0 }
											max={ 40 }
											step={ 1 }
										/>
										<RangeControl
											label={ __( 'Learn More Border Radius (px)' ) }
											value={ learnMoreStyles[ 0 ].borderRadius }
											onChange={ value => saveLearnMoreStyles( { borderRadius: value } ) }
											step={ 1 }
											min={ 0 }
											max={ 200 }
										/>
										<TypographyControls
											fontSize={ learnMoreStyles[ 0 ].size }
											onFontSize={ ( value ) => saveLearnMoreStyles( { size: value } ) }
											fontSizeType={ learnMoreStyles[ 0 ].sizeType }
											onFontSizeType={ ( value ) => saveLearnMoreStyles( { sizeType: value } ) }
											lineHeight={ learnMoreStyles[ 0 ].lineHeight }
											onLineHeight={ ( value ) => saveLearnMoreStyles( { lineHeight: value } ) }
											lineHeightType={ learnMoreStyles[ 0 ].lineType }
											onLineHeightType={ ( value ) => saveLearnMoreStyles( { lineType: value } ) }
											letterSpacing={ learnMoreStyles[ 0 ].letterSpacing }
											onLetterSpacing={ ( value ) => saveLearnMoreStyles( { letterSpacing: value } ) }
											fontFamily={ learnMoreStyles[ 0 ].family }
											onFontFamily={ ( value ) => saveLearnMoreStyles( { family: value } ) }
											onFontChange={ ( select ) => {
												saveLearnMoreStyles( {
													family: select.value,
													google: select.google,
												} );
											} }
											onFontArrayChange={ ( values ) => saveLearnMoreStyles( values ) }
											googleFont={ learnMoreStyles[ 0 ].google }
											onGoogleFont={ ( value ) => saveLearnMoreStyles( { google: value } ) }
											loadGoogleFont={ learnMoreStyles[ 0 ].loadGoogle }
											onLoadGoogleFont={ ( value ) => saveLearnMoreStyles( { loadGoogle: value } ) }
											fontVariant={ learnMoreStyles[ 0 ].variant }
											onFontVariant={ ( value ) => saveLearnMoreStyles( { variant: value } ) }
											fontWeight={ learnMoreStyles[ 0 ].weight }
											onFontWeight={ ( value ) => saveLearnMoreStyles( { weight: value } ) }
											fontStyle={ learnMoreStyles[ 0 ].style }
											onFontStyle={ ( value ) => saveLearnMoreStyles( { style: value } ) }
											fontSubset={ learnMoreStyles[ 0 ].subset }
											onFontSubset={ ( value ) => saveLearnMoreStyles( { subset: value } ) }
											padding={ learnMoreStyles[ 0 ].padding }
											onPadding={ ( value ) => saveLearnMoreStyles( { padding: value } ) }
											paddingControl={ learnMoreStyles[ 0 ].paddingControl }
											onPaddingControl={ ( value ) => saveLearnMoreStyles( { paddingControl: value } ) }
											margin={ learnMoreStyles[ 0 ].margin }
											onMargin={ ( value ) => saveLearnMoreStyles( { margin: value } ) }
											marginControl={ learnMoreStyles[ 0 ].marginControl }
											onMarginControl={ ( value ) => saveLearnMoreStyles( { marginControl: value } ) }
										/>
									</Fragment>
								) }
							</PanelBody>
						) }
						{ this.showSettings( 'shadowSettings' ) && (
							<PanelBody
								title={ __( 'Container Shadow' ) }
								initialOpen={ false }
							>
								<ToggleControl
									label={ __( 'Enable Shadow' ) }
									checked={ displayShadow }
									onChange={ value => setAttributes( { displayShadow: value } ) }
								/>
								{ displayShadow && (
									<TabPanel className="kt-inspect-tabs kt-hover-tabs"
										activeClass="active-tab"
										tabs={ [
											{
												name: 'normal',
												title: __( 'Normal' ),
												className: 'kt-normal-tab',
											},
											{
												name: 'hover',
												title: __( 'Hover' ),
												className: 'kt-hover-tab',
											},
										] }>
										{
											( tab ) => {
												let tabout;
												if ( tab.name ) {
													if ( 'hover' === tab.name ) {
														tabout = (
															<Fragment>
																<AdvancedColorControl
																	label={ __( 'Shadow Color' ) }
																	colorValue={ ( shadowHover[ 0 ].color ? shadowHover[ 0 ].color : '' ) }
																	colorDefault={ '' }
																	onColorChange={ value => saveHoverShadow( { color: value } ) }
																	opacityValue={ shadowHover[ 0 ].opacity }
																	onOpacityChange={ value => saveHoverShadow( { opacity: value } ) }
																/>
																<RangeControl
																	label={ __( 'Shadow Blur' ) }
																	value={ shadowHover[ 0 ].blur }
																	onChange={ value => saveHoverShadow( { blur: value } ) }
																	min={ 0 }
																	max={ 100 }
																	step={ 1 }
																/>
																<RangeControl
																	label={ __( 'Shadow Spread' ) }
																	value={ shadowHover[ 0 ].spread }
																	onChange={ value => saveHoverShadow( { spread: value } ) }
																	min={ -100 }
																	max={ 100 }
																	step={ 1 }
																/>
																<RangeControl
																	label={ __( 'Shadow Vertical Offset' ) }
																	value={ shadowHover[ 0 ].vOffset }
																	onChange={ value => saveHoverShadow( { vOffset: value } ) }
																	min={ -100 }
																	max={ 100 }
																	step={ 1 }
																/>
																<RangeControl
																	label={ __( 'Shadow Horizontal Offset' ) }
																	value={ shadowHover[ 0 ].hOffset }
																	onChange={ value => saveHoverShadow( { hOffset: value } ) }
																	min={ -100 }
																	max={ 100 }
																	step={ 1 }
																/>
															</Fragment>
														);
													} else {
														tabout = (
															<Fragment>
																<AdvancedColorControl
																	label={ __( 'Shadow Color' ) }
																	colorValue={ ( shadow[ 0 ].color ? shadow[ 0 ].color : '' ) }
																	colorDefault={ '' }
																	onColorChange={ value => saveShadow( { color: value } ) }
																	opacityValue={ shadow[ 0 ].opacity }
																	onOpacityChange={ value => saveShadow( { opacity: value } ) }
																/>
																<RangeControl
																	label={ __( 'Shadow Blur' ) }
																	value={ shadow[ 0 ].blur }
																	onChange={ value => saveShadow( { blur: value } ) }
																	min={ 0 }
																	max={ 100 }
																	step={ 1 }
																/>
																<RangeControl
																	label={ __( 'Shadow Spread' ) }
																	value={ shadow[ 0 ].spread }
																	onChange={ value => saveShadow( { spread: value } ) }
																	min={ -100 }
																	max={ 100 }
																	step={ 1 }
																/>
																<RangeControl
																	label={ __( 'Shadow Vertical Offset' ) }
																	value={ shadow[ 0 ].vOffset }
																	onChange={ value => saveShadow( { vOffset: value } ) }
																	min={ -100 }
																	max={ 100 }
																	step={ 1 }
																/>
																<RangeControl
																	label={ __( 'Shadow Horizontal Offset' ) }
																	value={ shadow[ 0 ].hOffset }
																	onChange={ value => saveShadow( { hOffset: value } ) }
																	min={ -100 }
																	max={ 100 }
																	step={ 1 }
																/>
															</Fragment>
														);
													}
												}
												return <div>{ tabout }</div>;
											}
										}
									</TabPanel>
								) }
							</PanelBody>
						) }
					</InspectorControls>
				) }
				<div className={ `kt-blocks-info-box-link-wrap kt-blocks-info-box-media-align-${ mediaAlign } ${ isSelectedClass } kt-info-halign-${ hAlign } kb-info-box-vertical-media-align-${ mediaVAlign }` } style={ {
					boxShadow: ( displayShadow ? shadow[ 0 ].hOffset + 'px ' + shadow[ 0 ].vOffset + 'px ' + shadow[ 0 ].blur + 'px ' + shadow[ 0 ].spread + 'px ' + hexToRGBA( shadow[ 0 ].color, shadow[ 0 ].opacity ) : undefined ),
					borderColor: ( containerBorder ? hexToRGBA( containerBorder, ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) : hexToRGBA( '#eeeeee', ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) ),
					background: ( containerBackground ? hexToRGBA( containerBackground, ( undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1 ) ) : hexToRGBA( '#f2f2f2', ( undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1 ) ) ),
					borderRadius: containerBorderRadius + 'px',
					borderWidth: ( containerBorderWidth ? containerBorderWidth[ 0 ] + 'px ' + containerBorderWidth[ 1 ] + 'px ' + containerBorderWidth[ 2 ] + 'px ' + containerBorderWidth[ 3 ] + 'px' : '' ),
					padding: ( containerPadding ? containerPadding[ 0 ] + 'px ' + containerPadding[ 1 ] + 'px ' + containerPadding[ 2 ] + 'px ' + containerPadding[ 3 ] + 'px' : '' ),
					maxWidth: ( maxWidth ? maxWidth + maxWidthUnit : undefined ),
					marginTop: ( containerMargin && '' !== containerMargin[ 0 ] ? containerMargin[ 0 ] + containerMarginUnit : undefined ),
					marginRight: ( containerMargin && '' !== containerMargin[ 1 ] ? containerMargin[ 1 ] + containerMarginUnit : undefined ),
					marginBottom: ( containerMargin && '' !== containerMargin[ 2 ] ? containerMargin[ 2 ] + containerMarginUnit : undefined ),
					marginLeft: ( containerMargin && '' !== containerMargin[ 3 ] ? containerMargin[ 3 ] + containerMarginUnit : undefined ),
				} } >
					{ 'none' !== mediaType && (
						<div className={ 'kt-blocks-info-box-media-container' } style={ {
							margin: ( mediaStyle[ 0 ].margin ? mediaStyle[ 0 ].margin[ 0 ] + 'px ' + mediaStyle[ 0 ].margin[ 1 ] + 'px ' + mediaStyle[ 0 ].margin[ 2 ] + 'px ' + mediaStyle[ 0 ].margin[ 3 ] + 'px' : '' ),
						} }>
							<div className={ `kt-blocks-info-box-media kt-info-media-animate-${ 'image' === mediaType ? mediaImage[ 0 ].hoverAnimation : mediaIcon[ 0 ].hoverAnimation }` } style={ {
								borderColor: mediaStyle[ 0 ].border,
								backgroundColor: mediaStyle[ 0 ].background,
								borderRadius: mediaStyle[ 0 ].borderRadius + 'px',
								borderWidth: ( mediaStyle[ 0 ].borderWidth ? mediaStyle[ 0 ].borderWidth[ 0 ] + 'px ' + mediaStyle[ 0 ].borderWidth[ 1 ] + 'px ' + mediaStyle[ 0 ].borderWidth[ 2 ] + 'px ' + mediaStyle[ 0 ].borderWidth[ 3 ] + 'px' : '' ),
								padding: ( mediaStyle[ 0 ].padding ? mediaStyle[ 0 ].padding[ 0 ] + 'px ' + mediaStyle[ 0 ].padding[ 1 ] + 'px ' + mediaStyle[ 0 ].padding[ 2 ] + 'px ' + mediaStyle[ 0 ].padding[ 3 ] + 'px' : '' ),
							} } >
								{ ! mediaImage[ 0 ].url && 'image' === mediaType && (
									<MediaPlaceholder
										icon="format-image"
										labels={ {
											title: __( 'Media area' ),
										} }
										onSelect={ onSelectImage }
										accept="image/*"
										allowedTypes={ ALLOWED_MEDIA_TYPES }
									/>
								) }
								{ mediaImage[ 0 ].url && 'image' === mediaType && (
									<div className="kadence-info-box-image-inner-intrisic-container" style={ {
										maxWidth: mediaImage[ 0 ].maxWidth + 'px',
									} } >
										<div className={ `kadence-info-box-image-intrisic kt-info-animate-${ mediaImage[ 0 ].hoverAnimation }${ ( 'svg+xml' === mediaImage[ 0 ].subtype ? ' kb-info-box-image-type-svg' : '' ) }` } style={ {
											paddingBottom: isNaN( mediaImage[ 0 ].height ) ? undefined : ( ( mediaImage[ 0 ].height / mediaImage[ 0 ].width ) * 100 ) + '%',
											height: isNaN( mediaImage[ 0 ].height ) ? undefined : 0,
										} } >
											<div className="kadence-info-box-image-inner-intrisic">
												<img
													src={ mediaImage[ 0 ].url }
													alt={ mediaImage[ 0 ].alt }
													width={ ( mediaImage[ 0 ].subtype && 'svg+xml' === mediaImage[ 0 ].subtype ? mediaImage[ 0 ].maxWidth : mediaImage[ 0 ].width ) }
													height={ mediaImage[ 0 ].height }
													className={ `${ ( mediaImage[ 0 ].id ? `kt-info-box-image wp-image-${ mediaImage[ 0 ].id }` : 'kt-info-box-image wp-image-offsite' ) } ${ ( mediaImage[ 0 ].subtype && 'svg+xml' === mediaImage[ 0 ].subtype ? ' kt-info-svg-image' : '' ) }` }
												/>
												{ mediaImage[ 0 ].flipUrl && 'flip' === mediaImage[ 0 ].hoverAnimation && (
													<img
														src={ mediaImage[ 0 ].flipUrl }
														alt={ mediaImage[ 0 ].flipAlt }
														width={ ( mediaImage[ 0 ].flipSubtype && 'svg+xml' === mediaImage[ 0 ].flipSubtype ? mediaImage[ 0 ].maxWidth : mediaImage[ 0 ].flipWidth ) }
														height={ mediaImage[ 0 ].flipHeight }
														className={ `${ ( mediaImage[ 0 ].flipId ? `kt-info-box-image-flip wp-image-${ mediaImage[ 0 ].flipId }` : 'kt-info-box-image-flip wp-image-offsite' ) } ${ ( mediaImage[ 0 ].flipSubtype && 'svg+xml' === mediaImage[ 0 ].flipSubtype ? ' kt-info-svg-image' : '' ) }` }
													/>
												) }
											</div>
										</div>
									</div>
								) }
								{ 'icon' === mediaType && (
									<div className={ `kadence-info-box-icon-container kt-info-icon-animate-${ mediaIcon[ 0 ].hoverAnimation }` } >
										<div className={ 'kadence-info-box-icon-inner-container' } >
											<IconRender className={ `kt-info-svg-icon kt-info-svg-icon-${ mediaIcon[ 0 ].icon }` } name={ mediaIcon[ 0 ].icon } size={ ( ! mediaIcon[ 0 ].size ? '14' : mediaIcon[ 0 ].size ) } htmltag="span" strokeWidth={ ( 'fe' === mediaIcon[ 0 ].icon.substring( 0, 2 ) ? mediaIcon[ 0 ].width : undefined ) } style={ {
												display: 'block',
												color: ( mediaIcon[ 0 ].color ? mediaIcon[ 0 ].color : undefined ),
											} } />
											{ mediaIcon[ 0 ].flipIcon && 'flip' === mediaIcon[ 0 ].hoverAnimation && (
												<IconRender className={ `kt-info-svg-icon-flip kt-info-svg-icon-${ mediaIcon[ 0 ].flipIcon }` } name={ mediaIcon[ 0 ].flipIcon } size={ ( ! mediaIcon[ 0 ].size ? '14' : mediaIcon[ 0 ].size ) } htmltag="span" strokeWidth={ ( 'fe' === mediaIcon[ 0 ].flipIcon.substring( 0, 2 ) ? mediaIcon[ 0 ].width : undefined ) } style={ {
													display: 'block',
													color: ( mediaIcon[ 0 ].hoverColor ? mediaIcon[ 0 ].hoverColor : undefined ),
												} } />
											) }
										</div>
									</div>
								) }
							</div>
						</div>
					) }
					<div className={ 'kt-infobox-textcontent' } >
						{ displayTitle && titleFont[ 0 ].google && (
							<WebfontLoader config={ config }>
							</WebfontLoader>
						) }
						{ displayTitle && (
							<RichText
								className="kt-blocks-info-box-title"
								formattingControls={ ( linkProperty === 'learnmore' ? [ 'bold', 'italic', 'link', 'strikethrough' ] : [ 'bold', 'italic', 'strikethrough' ] ) }
								tagName={ titleTagName }
								placeholder={ __( 'Title' ) }
								onChange={ onChangeTitle }
								value={ title }
								style={ {
									fontWeight: titleFont[ 0 ].weight,
									fontStyle: titleFont[ 0 ].style,
									color: titleColor,
									fontSize: titleFont[ 0 ].size[ 0 ] + titleFont[ 0 ].sizeType,
									lineHeight: ( titleFont[ 0 ].lineHeight && titleFont[ 0 ].lineHeight[ 0 ] ? titleFont[ 0 ].lineHeight[ 0 ] + titleFont[ 0 ].lineType : undefined ),
									letterSpacing: titleFont[ 0 ].letterSpacing + 'px',
									fontFamily: ( titleFont[ 0 ].family ? titleFont[ 0 ].family : '' ),
									padding: ( titleFont[ 0 ].padding ? titleFont[ 0 ].padding[ 0 ] + 'px ' + titleFont[ 0 ].padding[ 1 ] + 'px ' + titleFont[ 0 ].padding[ 2 ] + 'px ' + titleFont[ 0 ].padding[ 3 ] + 'px' : '' ),
									margin: ( titleFont[ 0 ].margin ? titleFont[ 0 ].margin[ 0 ] + 'px ' + titleFont[ 0 ].margin[ 1 ] + 'px ' + titleFont[ 0 ].margin[ 2 ] + 'px ' + titleFont[ 0 ].margin[ 3 ] + 'px' : '' ),
									minHeight: ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ? titleMinHeight[ 0 ] + 'px' : undefined ),
								} }
								keepPlaceholderOnFocus
							/>
						) }
						{ displayText && textFont[ 0 ].google && (
							<WebfontLoader config={ tconfig }>
							</WebfontLoader>
						) }
						{ displayText && (
							<RichText
								className="kt-blocks-info-box-text"
								formattingControls={ ( linkProperty === 'learnmore' ? [ 'bold', 'italic', 'link', 'strikethrough' ] : [ 'bold', 'italic', 'strikethrough' ] ) }
								tagName={ 'p' }
								placeholder={ __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean diam dolor, accumsan sed rutrum vel, dapibus et leo.' ) }
								onChange={ ( value ) => setAttributes( { contentText: value } ) }
								value={ contentText }
								style={ {
									fontWeight: textFont[ 0 ].weight,
									fontStyle: textFont[ 0 ].style,
									color: textColor,
									fontSize: textFont[ 0 ].size[ 0 ] + textFont[ 0 ].sizeType,
									lineHeight: ( textFont[ 0 ].lineHeight && textFont[ 0 ].lineHeight[ 0 ] ? textFont[ 0 ].lineHeight[ 0 ] + textFont[ 0 ].lineType : undefined ),
									letterSpacing: textFont[ 0 ].letterSpacing + 'px',
									fontFamily: ( textFont[ 0 ].family ? textFont[ 0 ].family : '' ),
									padding: ( undefined !== textSpacing && undefined !== textSpacing[ 0 ] && textSpacing[ 0 ].padding ? textSpacing[ 0 ].padding[ 0 ] + 'px ' + textSpacing[ 0 ].padding[ 1 ] + 'px ' + textSpacing[ 0 ].padding[ 2 ] + 'px ' + textSpacing[ 0 ].padding[ 3 ] + 'px' : '' ),
									margin: ( undefined !== textSpacing && undefined !== textSpacing[ 0 ] && textSpacing[ 0 ].margin ? textSpacing[ 0 ].margin[ 0 ] + 'px ' + textSpacing[ 0 ].margin[ 1 ] + 'px ' + textSpacing[ 0 ].margin[ 2 ] + 'px ' + textSpacing[ 0 ].margin[ 3 ] + 'px' : '' ),
									minHeight: ( undefined !== textMinHeight && undefined !== textMinHeight[ 0 ] ? textMinHeight[ 0 ] + 'px' : undefined ),
								} }
								keepPlaceholderOnFocus
							/>
						) }
						{ displayLearnMore && learnMoreStyles[ 0 ].google && (
							<WebfontLoader config={ lconfig }>
							</WebfontLoader>
						) }
						{ displayLearnMore && (
							<div className="kt-blocks-info-box-learnmore-wrap" style={ {
								margin: ( learnMoreStyles[ 0 ].margin ? learnMoreStyles[ 0 ].margin[ 0 ] + 'px ' + learnMoreStyles[ 0 ].margin[ 1 ] + 'px ' + learnMoreStyles[ 0 ].margin[ 2 ] + 'px ' + learnMoreStyles[ 0 ].margin[ 3 ] + 'px' : '' ),
							} } >
								<RichText
									formattingControls={ [ 'bold', 'italic' ] }
									className="kt-blocks-info-box-learnmore"
									tagName={ 'div' }
									placeholder={ __( 'Learn More' ) }
									onChange={ value => setAttributes( { learnMore: value } ) }
									value={ learnMore }
									style={ {
										fontWeight: learnMoreStyles[ 0 ].weight,
										fontStyle: learnMoreStyles[ 0 ].style,
										color: learnMoreStyles[ 0 ].color,
										borderRadius: learnMoreStyles[ 0 ].borderRadius + 'px',
										background: learnMoreStyles[ 0 ].background,
										borderColor: learnMoreStyles[ 0 ].border,
										fontSize: learnMoreStyles[ 0 ].size[ 0 ] + learnMoreStyles[ 0 ].sizeType,
										lineHeight: ( learnMoreStyles[ 0 ].lineHeight && learnMoreStyles[ 0 ].lineHeight[ 0 ] ? learnMoreStyles[ 0 ].lineHeight[ 0 ] + learnMoreStyles[ 0 ].lineType : undefined ),
										letterSpacing: learnMoreStyles[ 0 ].letterSpacing + 'px',
										fontFamily: ( learnMoreStyles[ 0 ].family ? learnMoreStyles[ 0 ].family : '' ),
										borderWidth: ( learnMoreStyles[ 0 ].borderWidth ? learnMoreStyles[ 0 ].borderWidth[ 0 ] + 'px ' + learnMoreStyles[ 0 ].borderWidth[ 1 ] + 'px ' + learnMoreStyles[ 0 ].borderWidth[ 2 ] + 'px ' + learnMoreStyles[ 0 ].borderWidth[ 3 ] + 'px' : '' ),
										padding: ( learnMoreStyles[ 0 ].padding ? learnMoreStyles[ 0 ].padding[ 0 ] + 'px ' + learnMoreStyles[ 0 ].padding[ 1 ] + 'px ' + learnMoreStyles[ 0 ].padding[ 2 ] + 'px ' + learnMoreStyles[ 0 ].padding[ 3 ] + 'px' : '' ),
									} }
									keepPlaceholderOnFocus
								/>
							</div>
						) }
					</div>
				</div>
			</div>
		);
	}
}
export default ( KadenceInfoBox );
