/**
 * BLOCK: Kadence Info Block
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * Import Icons
 */
import icons from '../../icons';
import map from 'lodash/map';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import TypographyControls from '../../components/typography/typography-control';
import MeasurementControls from '../../measurement-control';
import PopColorControl from '../../components/color/pop-color-control';
import ImageSizeControl from '../../components/common/image-size-control';
import WebfontLoader from '../../components/typography/fontloader';
import IconRender from '../../components/icons/icon-render';
import IconControl from '../../components/icons/icon-control';
import InfoBoxStyleCopyPaste from './copy-paste-style';
import ResponsiveRangeControl from '../../responsive-range-control';
import KadenceColorOutput from '../../components/color/kadence-color-output';
import KadenceRange from '../../components/range/range-control';
import ResponsiveMeasuremenuControls from '../../components/measurement/responsive-measurement-control';
import URLInputControl from '../../components/links/link-control';
import KadencePanelBody from '../../components/KadencePanelBody';
import KadenceMediaPlaceholder from '../../components/common/kadence-media-placeholder';
import KadenceImageControl from '../../components/common/kadence-image-control';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
const {
	MediaUpload,
	RichText,
	AlignmentToolbar,
	InspectorControls,
	BlockControls,
} = wp.blockEditor;
const {
	Button,
	Dropdown,
	ButtonGroup,
	TabPanel,
	Dashicon,
	Toolbar,
	TextControl,
	ToggleControl,
	SelectControl,
} = wp.components;
const {
	applyFilters,
} = wp.hooks;
import {
	image,
	closeSmall,
	starFilled,
	plusCircleFilled,
} from '@wordpress/icons';

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
		this.getPreviewSize = this.getPreviewSize.bind( this );
		this.getDynamic = this.getDynamic.bind( this );
		this.state = {
			containerPaddingControl: 'linked',
			containerBorderControl: 'linked',
			containerMarginControl: 'linked',
			mediaBorderControl: 'linked',
			mediaPaddingControl: 'linked',
			mediaMarginControl: 'linked',
			showPreset: false,
			btnLink: false,
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			settings: {},
		};
		this.debouncedUpdateDynamic = debounce( this.getDynamic.bind( this ), 200 );
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
			this.props.attributes.uniqueID = '_' + this.props.clientId.substr( 2, 9 );
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
		if ( this.props.context && this.props.context.queryId && this.props.context.postId ) {
			if ( ! this.props.attributes.inQueryBlock ) {
				this.props.setAttributes( {
					inQueryBlock: true,
				} );
			}
		} else if ( this.props.attributes.inQueryBlock ) {
			this.props.setAttributes( {
				inQueryBlock: false,
			} );
		}
		this.debouncedUpdateDynamic();
	}
	getDynamic() {
		let contextPost = null;
		if ( this.props.context && this.props.context.queryId && this.props.context.postId ) {
			contextPost = this.props.context.postId;
		}
		if ( this.props.attributes.kadenceDynamic && this.props.attributes.kadenceDynamic['mediaImage:0:url'] && this.props.attributes.kadenceDynamic['mediaImage:0:url'].enable ) {
			applyFilters( 'kadence.dynamicImage', '', this.props.attributes, this.props.setAttributes, 'mediaImage:0:url', contextPost );
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
		const { attributes: { uniqueID, link, linkProperty, target, hAlign, containerBackground, containerHoverBackground, containerBorder, containerHoverBorder, containerBorderWidth, containerBorderRadius, containerPadding, containerPaddingType, containerMobilePadding, containerTabletPadding, mediaType, mediaImage, mediaIcon, mediaStyle, mediaAlign, displayTitle, title, titleColor, titleHoverColor, titleFont, displayText, contentText, textColor, textHoverColor, textFont, textSpacing, displayLearnMore, learnMore, learnMoreStyles, displayShadow, shadow, shadowHover, containerHoverBackgroundOpacity, containerBackgroundOpacity, containerHoverBorderOpacity, containerBorderOpacity, textMinHeight, titleMinHeight, maxWidthUnit, maxWidth, mediaVAlign, mediaAlignMobile, mediaAlignTablet, hAlignMobile, hAlignTablet, containerMargin, containerMarginUnit, linkNoFollow, linkSponsored, number, mediaNumber, imageRatio, linkTitle, kadenceDynamic }, className, setAttributes, isSelected } = this.props;
		const { containerBorderControl, mediaBorderControl, mediaPaddingControl, mediaMarginControl, containerPaddingControl, containerMarginControl } = this.state;
		const widthMax = ( maxWidthUnit === 'px' ? 2000 : 100 );
		const previewPaddingType = ( undefined !== containerPaddingType ? containerPaddingType : 'px' );
		const paddingMin = ( previewPaddingType === 'em' || previewPaddingType === 'rem' ? 0 : 0 );
		const paddingMax = ( previewPaddingType === 'em' || previewPaddingType === 'rem' ? 12 : 200 );
		const paddingStep = ( previewPaddingType === 'em' || previewPaddingType === 'rem' ? 0.1 : 1 );
		const previewContainerPaddingTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerPadding &&  undefined !== containerPadding[0] ? containerPadding[0] : '' ), ( undefined !== containerTabletPadding &&  undefined !== containerTabletPadding[0] ? containerTabletPadding[0] : '' ), ( undefined !== containerMobilePadding &&  undefined !== containerMobilePadding[0] ? containerMobilePadding[0] : '' ) );
		const previewContainerPaddingRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerPadding &&  undefined !== containerPadding[1] ? containerPadding[1] : '' ), ( undefined !== containerTabletPadding &&  undefined !== containerTabletPadding[1] ? containerTabletPadding[1] : '' ), ( undefined !== containerMobilePadding &&  undefined !== containerMobilePadding[1] ? containerMobilePadding[1] : '' ) );
		const previewContainerPaddingBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerPadding &&  undefined !== containerPadding[2] ? containerPadding[2] : '' ), ( undefined !== containerTabletPadding &&  undefined !== containerTabletPadding[2] ? containerTabletPadding[2] : '' ), ( undefined !== containerMobilePadding &&  undefined !== containerMobilePadding[2] ? containerMobilePadding[2] : '' ) );
		const previewContainerPaddingLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerPadding &&  undefined !== containerPadding[3] ? containerPadding[3] : '' ), ( undefined !== containerTabletPadding &&  undefined !== containerTabletPadding[3] ? containerTabletPadding[3] : '' ), ( undefined !== containerMobilePadding &&  undefined !== containerMobilePadding[3] ? containerMobilePadding[3] : '' ) );

		const previewTitleFontSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleFont[0].size  &&  undefined !== titleFont[0].size[0] ? titleFont[0].size[0] : '' ), ( undefined !== titleFont[0].size &&  undefined !== titleFont[0].size[1] ? titleFont[0].size[1] : '' ), ( undefined !== titleFont[0].size &&  undefined !== titleFont[0].size[2] ? titleFont[0].size[2] : '' ) );
		const previewTitleLineHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleFont[0].lineHeight  &&  undefined !== titleFont[0].lineHeight[0] ? titleFont[0].lineHeight[0] : '' ), ( undefined !== titleFont[0].lineHeight &&  undefined !== titleFont[0].lineHeight[1] ? titleFont[0].lineHeight[1] : '' ), ( undefined !== titleFont[0].lineHeight &&  undefined !== titleFont[0].lineHeight[2] ? titleFont[0].lineHeight[2] : '' ) );
		const previewTitleMinHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : '' ), ( undefined !== titleMinHeight[1] &&  undefined !== titleMinHeight[1] ? titleMinHeight[1] : '' ), ( undefined !== titleMinHeight[2] &&  undefined !== titleMinHeight[2] ? titleMinHeight[2] : '' ) );

		const previewTextFontSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== textFont[0].size  &&  undefined !== textFont[0].size[0] ? textFont[0].size[0] : '' ), ( undefined !== textFont[0].size &&  undefined !== textFont[0].size[1] ? textFont[0].size[1] : '' ), ( undefined !== textFont[0].size &&  undefined !== textFont[0].size[2] ? textFont[0].size[2] : '' ) );
		const previewTextLineHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== textFont[0].lineHeight  &&  undefined !== textFont[0].lineHeight[0] ? textFont[0].lineHeight[0] : '' ), ( undefined !== textFont[0].lineHeight &&  undefined !== textFont[0].lineHeight[1] ? textFont[0].lineHeight[1] : '' ), ( undefined !== textFont[0].lineHeight &&  undefined !== textFont[0].lineHeight[2] ? textFont[0].lineHeight[2] : '' ) );
		const previewTextMinHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== textMinHeight && undefined !== textMinHeight[0] ? textMinHeight[0] : '' ), ( undefined !== textMinHeight[1] &&  undefined !== textMinHeight[1] ? textMinHeight[1] : '' ), ( undefined !== textMinHeight[2] &&  undefined !== textMinHeight[2] ? textMinHeight[2] : '' ) );

		const previewLearnMoreFontSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== learnMoreStyles[0].size  &&  undefined !== learnMoreStyles[0].size[0] ? learnMoreStyles[0].size[0] : '' ), ( undefined !== learnMoreStyles[0].size &&  undefined !== learnMoreStyles[0].size[1] ? learnMoreStyles[0].size[1] : '' ), ( undefined !== learnMoreStyles[0].size &&  undefined !== learnMoreStyles[0].size[2] ? learnMoreStyles[0].size[2] : '' ) );
		const previewLearnMoreLineHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== learnMoreStyles[0].lineHeight  &&  undefined !== learnMoreStyles[0].lineHeight[0] ? learnMoreStyles[0].lineHeight[0] : '' ), ( undefined !== learnMoreStyles[0].lineHeight &&  undefined !== learnMoreStyles[0].lineHeight[1] ? learnMoreStyles[0].lineHeight[1] : '' ), ( undefined !== learnMoreStyles[0].lineHeight &&  undefined !== learnMoreStyles[0].lineHeight[2] ? learnMoreStyles[0].lineHeight[2] : '' ) );

		const previewMediaIconSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== mediaIcon[0]  &&  undefined !== mediaIcon[0].size ? mediaIcon[0].size : '14' ), ( undefined !== mediaIcon[0].tabletSize &&  undefined !== mediaIcon[0].tabletSize ? mediaIcon[0].tabletSize : '' ), ( undefined !== mediaIcon[0].mobileSize &&  undefined !== mediaIcon[0].mobileSize ? mediaIcon[0].mobileSize : '' ) );

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
			{ key: 'skip', name: __( 'Skip', 'kadence-blocks' ), icon: __( 'Skip' ) },
			{ key: 'simple', name: __( 'Simple', 'kadence-blocks' ), icon: icons.infoSimple },
			{ key: 'left', name: __( 'Align Left', 'kadence-blocks' ), icon: icons.infoLeft },
			{ key: 'bold', name: __( 'Bold Background', 'kadence-blocks' ), icon: icons.infoBackground },
			{ key: 'image', name: __( 'Circle Image', 'kadence-blocks' ), icon: icons.infoImage },
		];
		const layoutPresetOptions = [
			{ key: 'simple', name: __( 'Basic', 'kadence-blocks' ), icon: icons.infoStart },
			{ key: 'basic', name: __( 'Basic', 'kadence-blocks' ), icon: icons.infoBasic },
			{ key: 'leftabove', name: __( 'Left Above', 'kadence-blocks' ), icon: icons.infoLeftAbove },
			{ key: 'left', name: __( 'Left', 'kadence-blocks' ), icon: icons.infoLeft },
			{ key: 'overlay', name: __( 'Overlay', 'kadence-blocks' ), icon: icons.infoTopOverlay },
			{ key: 'overlayleft', name: __( 'Overlay Left', 'kadence-blocks' ), icon: icons.infoLeftOverlay },
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
						padding: ( ( 'icon' === mediaType || 'number' === mediaType ) ? [ 20, 20, 20, 20 ] : [ 0, 0, 0, 0 ] ),
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
						padding: ( ( 'icon' === mediaType || 'number' === mediaType ) ? [ 20, 20, 20, 20 ] : [ 0, 0, 0, 0 ] ),
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
						borderWidth: ( ( 'icon' === mediaType || 'number' === mediaType ) ? [ 5, 5, 5, 5 ] : [ 0, 0, 0, 0 ] ),
						padding: ( ( 'icon' === mediaType || 'number' === mediaType ) ? [ 20, 20, 20, 20 ] : [ 0, 0, 0, 0 ] ),
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
						padding: ( ( 'icon' === mediaType || 'number' === mediaType ) ? [ 20, 20, 20, 20 ] : [ 0, 0, 0, 0 ] ),
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
						textTransform: '',
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
						textTransform: '',
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
						textTransform: '',
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
						textTransform: '',
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
						textTransform: '',
					} ],
					displayShadow: false,
				} );
			}
		};
		const onChangeTitle = value => {
			setAttributes( { title: value } );
		};
		const onChangeNumber = value => {
			setAttributes( { number: value } );
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
		const ngconfig = {
			google: {
				families: [ ( mediaNumber && mediaNumber[ 0 ] && mediaNumber[ 0 ].family ? mediaNumber[ 0 ].family : ' ' ) + ( mediaNumber && mediaNumber[ 0 ] && mediaNumber[ 0 ].variant ? ':' + mediaNumber[ 0 ].variant : '' ) ],
			},
		};
		const config = ( titleFont[ 0 ].google ? gconfig : '' );
		const tconfig = ( textFont[ 0 ].google ? tgconfig : '' );
		const lconfig = ( learnMoreStyles[ 0 ].google ? lgconfig : '' );
		const nconfig = ( mediaNumber && mediaNumber[ 0 ] && mediaNumber[ 0 ].google ? ngconfig : '' );
		const titleTagName = 'h' + titleFont[ 0 ].level;
		const ALLOWED_MEDIA_TYPES = [ 'image' ];
		const onSelectImage = media => {
			let url;
			let itemSize;
			if ( mediaImage[ 0 ] && mediaImage[ 0 ].width && mediaImage[ 0 ].height ) {
				const sizes = ( undefined !== media.sizes ? media.sizes : [] );
				const imgSizes = Object.keys( sizes ).map( ( item ) => {
					return { slug: item, name: item };
				} );
				map( imgSizes, ( { name, slug } ) => {
					const type = get( media, [ 'mime_type' ] );
					if ( 'image/svg+xml' === type ) {
						return null;
					}
					const sizeUrl = get( media, [ 'sizes', slug, 'url' ] );
					if ( ! sizeUrl ) {
						return null;
					}
					const sizeWidth = get( media, [ 'sizes', slug, 'width' ] );
					if ( ! sizeWidth ) {
						return null;
					}
					const sizeHeight = get( media, [ 'sizes', slug, 'height' ] );
					if ( ! sizeHeight ) {
						return null;
					}
					if ( sizeHeight === mediaImage[ 0 ].height && sizeWidth === mediaImage[ 0 ].width ) {
						itemSize = slug;
						return null;
					}
				} );
			}
			const size = ( itemSize && '' !== itemSize ? itemSize : 'full' );
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
			const maxwidth = ( mediaImage[ 0 ] && mediaImage[ 0 ].maxWidth ? mediaImage[ 0 ].maxWidth : media.width );
			saveMediaImage( {
				id: media.id,
				url: url || media.url,
				alt: media.alt,
				width: width,
				height: height,
				maxWidth: ( maxwidth ? maxwidth : 50 ),
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
		const saveMediaNumber = ( value ) => {
			const newMediaNumber = mediaNumber ? mediaNumber : [ {
				family: '',
				google: false,
				hoverAnimation: 'none',
				style: '',
				weight: '',
				variant: '',
				subset: '',
				loadGoogle: true,
			} ];
			const newNumberUpdate = newMediaNumber.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				mediaNumber: newNumberUpdate,
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
				{ ( mediaIcon[ 0 ].hoverColor ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-info-svg-icon, #kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-number { color: ${ KadenceColorOutput( mediaIcon[ 0 ].hoverColor ) } !important; }` : '' ) }
				{ ( mediaStyle[ 0 ].borderRadius ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media .kadence-info-box-image-intrisic:not(.kb-info-box-image-ratio) img, #kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media .kadence-info-box-image-intrisic:not(.kb-info-box-image-ratio) .editor-media-placeholder { border-radius: ${ mediaStyle[ 0 ].borderRadius }px; }` : '' ) }
				{ ( titleHoverColor ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-title { color: ${ KadenceColorOutput( titleHoverColor ) } !important; }` : '' ) }
				{ ( textHoverColor ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-text { color: ${ KadenceColorOutput( textHoverColor ) } !important; }` : '' ) }
				{ ( learnMoreStyles[ 0 ].colorHover ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore { color: ${ KadenceColorOutput( learnMoreStyles[ 0 ].colorHover ) } !important; }` : '' ) }
				{ ( learnMoreStyles[ 0 ].borderHover ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore { border-color: ${ KadenceColorOutput( learnMoreStyles[ 0 ].borderHover ) } !important; }` : '' ) }
				{ ( learnMoreStyles[ 0 ].backgroundHover ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore { background-color: ${ KadenceColorOutput( learnMoreStyles[ 0 ].backgroundHover ) } !important; }` : '' ) }
				{ ( containerHoverBackground ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover { background: ${ ( containerHoverBackground ? KadenceColorOutput( containerHoverBackground, ( undefined !== containerHoverBackgroundOpacity ? containerHoverBackgroundOpacity : 1 ) ) : KadenceColorOutput( '#f2f2f2', ( undefined !== containerHoverBackgroundOpacity ? containerHoverBackgroundOpacity : 1 ) ) ) } !important; }` : '' ) }
				{ ( containerHoverBorder ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover { border-color: ${ ( containerHoverBorder ? KadenceColorOutput( containerHoverBorder, ( undefined !== containerHoverBorderOpacity ? containerHoverBorderOpacity : 1 ) ) : KadenceColorOutput( '#f2f2f2', ( undefined !== containerHoverBorderOpacity ? containerHoverBorderOpacity : 1 ) ) ) } !important; }` : '' ) }
				{ ( displayShadow ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover { box-shadow: ${ shadowHover[ 0 ].hOffset + 'px ' + shadowHover[ 0 ].vOffset + 'px ' + shadowHover[ 0 ].blur + 'px ' + shadowHover[ 0 ].spread + 'px ' + KadenceColorOutput( shadowHover[ 0 ].color, shadowHover[ 0 ].opacity ) } !important; }` : '' ) }
				{ ( mediaStyle[ 0 ].hoverBackground ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { background: ${ mediaStyle[ 0 ].hoverBackground } !important; }` : '' ) }
				{ ( mediaStyle[ 0 ].hoverBorder && 'icon' === mediaType && 'drawborder' !== mediaIcon[ 0 ].hoverAnimation ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { border-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) } !important; }` : '' ) }
				{ ( mediaStyle[ 0 ].hoverBorder && 'number' === mediaType && mediaNumber[ 0 ].hoverAnimation && 'drawborder' !== mediaNumber[ 0 ].hoverAnimation ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { border-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) } !important; }` : '' ) }
				{ ( mediaStyle[ 0 ].hoverBorder && 'image' === mediaType && true !== mediaImagedraw ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { border-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) } !important; }` : '' ) }
				{ 'icon' === mediaType && 'drawborder' === mediaIcon[ 0 ].hoverAnimation && (
					`#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media { border-width:0 !important; box-shadow: inset 0 0 0 ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px ${ mediaStyle[ 0 ].border }; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before, #kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-radius: ${ mediaStyle[ 0 ].borderRadius }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before { border-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-width: 0; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before { border-top-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) } ; border-right-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) }; border-bottom-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) } }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:after{ border-right-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) }; border-right-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-bottom-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-top-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }`
				) }
				{ 'number' === mediaType && mediaNumber && mediaNumber[ 0 ] && mediaNumber[ 0 ].hoverAnimation && 'drawborder' === mediaNumber[ 0 ].hoverAnimation && (
					`#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media { border-width:0 !important; box-shadow: inset 0 0 0 ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px ${ mediaStyle[ 0 ].border }; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before, #kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-radius: ${ mediaStyle[ 0 ].borderRadius }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before { border-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-width: 0; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before { border-top-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) } ; border-right-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) }; border-bottom-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) } }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:after{ border-right-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) }; border-right-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-bottom-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-top-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }`
				) }
				{ 'image' === mediaType && true === mediaImagedraw && (
					`#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media { border-width:0 !important; box-shadow: inset 0 0 0 ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px ${ mediaStyle[ 0 ].border }; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before, #kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-radius: ${ mediaStyle[ 0 ].borderRadius }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before { border-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-width: 0; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before { border-top-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) } ; border-right-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) }; border-bottom-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) } }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:after{ border-right-color: ${ KadenceColorOutput( mediaStyle[ 0 ].hoverBorder ) }; border-right-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-bottom-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-top-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }`
				) }
			</style>
		);
		let imageRatioPadding = isNaN( mediaImage[ 0 ].height ) ? undefined : ( ( mediaImage[ 0 ].height / mediaImage[ 0 ].width ) * 100 ) + '%';
		let imageRatioHeight = isNaN( mediaImage[ 0 ].height ) ? undefined : 0;
		let hasRatio = false;
		if ( imageRatio && 'inherit' !== imageRatio ) {
			hasRatio = true;
			imageRatioHeight = 0;
			switch ( imageRatio ) {
				case 'land43':
					imageRatioPadding = '75%';
					break;
				case 'land32':
					imageRatioPadding = '66.67%';
					break;
				case 'land169':
					imageRatioPadding = '56.25%';
					break;
				case 'land21':
					imageRatioPadding = '50%';
					break;
				case 'land31':
					imageRatioPadding = '33%';
					break;
				case 'land41':
					imageRatioPadding = '25%';
					break;
				case 'port34':
					imageRatioPadding = '133.33%';
					break;
				case 'port23':
					imageRatioPadding = '150%';
					break;
				default:
					imageRatioPadding = '100%';
					break;
			}
		}
		let showImageToolbar = ( 'image' === mediaType && mediaImage[ 0 ].url ? true : false );
		if ( showImageToolbar && kadenceDynamic && kadenceDynamic['mediaImage:0:url'] && kadenceDynamic['mediaImage:0:url'].enable ) {
			showImageToolbar = false;
		}
		return (
			<div id={ `kt-info-box${ uniqueID }` } className={ className }>
				{ renderCSS }
				<BlockControls key="controls">
					{ showImageToolbar  && (
						<Toolbar>
							<MediaUpload
								onSelect={ onSelectImage }
								type="image"
								value={ mediaImage[ 0 ].id }
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								render={ ( { open } ) => (
									<Button
										className="components-toolbar__control"
										label={ __( 'Edit Media', 'kadence-blocks' ) }
										icon={ image }
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
								<Button className="components-dropdown-menu__toggle kb-inline-icon-toolbar-icon" label={ __( 'Icon Settings', 'kadence-blocks' ) } icon={ starFilled } onClick={ onToggle } aria-expanded={ isOpen }/>
							) }
							renderContent={ () => (
								<Fragment>
									<div className="kb-inline-icon-control">
										<IconControl
											value={ mediaIcon[ 0 ].icon }
											onChange={ value => saveMediaIcon( { icon: value } ) }
										/>
										<KadenceRange
											label={ __( 'Icon Size', 'kadence-blocks' ) }
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
						<KadencePanelBody panelName={'kb-info-all-settings'}>
							<Fragment>
								<h2>{ __( 'InfoBox Quick Layout Presets', 'kadence-blocks' ) }</h2>
								<ButtonGroup className="kt-style-btn-group kb-info-layouts" aria-label={ __( 'InfoBox Style', 'kadence-blocks' ) }>
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
							<URLInputControl
								label={ __( 'Link', 'kadence-blocks' ) }
								url={ link }
								onChangeUrl={ value => setAttributes( { link: value } ) }
								additionalControls={ true }
								opensInNewTab={ ( target && '_blank' == target ? true : false ) }
								onChangeTarget={ value => {
									if ( value ) {
										setAttributes( { target: '_blank' } );
									} else {
										setAttributes( { target: '_self' } );
									}
								} }
								linkNoFollow={ ( undefined !== linkNoFollow ? linkNoFollow : false ) }
								onChangeFollow={ value => setAttributes( { linkNoFollow: value } ) }
								linkSponsored={ ( undefined !== linkSponsored ? linkSponsored : false ) }
								onChangeSponsored={ value => setAttributes( { linkSponsored: value } ) }
								linkTitle={ linkTitle }
								onChangeTitle={ value => {
									setAttributes( { linkTitle: value } )
								} }
								dynamicAttribute={ 'link' }
								allowClear={ true }
								{ ...this.props }
							/>
							<SelectControl
								label={ __( 'Link Content', 'kadence-blocks' ) }
								value={ linkProperty }
								options={ [
									{ value: 'box', label: __( 'Entire Box', 'kadence-blocks' ) },
									{ value: 'learnmore', label: __( 'Only Learn More Text', 'kadence-blocks' ) },
								] }
								onChange={ value => setAttributes( { linkProperty: value } ) }
							/>
							<h2 className="kt-heading-size-title">{ __( 'Content Align', 'kadence-blocks' ) }</h2>
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
										return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
									}
								}
							</TabPanel>
						</KadencePanelBody>
						{ this.showSettings( 'containerSettings' ) && (
							<KadencePanelBody
								title={ __( 'Container Settings', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-info-container-settings' }
							>
								<MeasurementControls
									label={ __( 'Container Border Width (px)', 'kadence-blocks' ) }
									measurement={ containerBorderWidth }
									control={ containerBorderControl }
									onChange={ ( value ) => setAttributes( { containerBorderWidth: value } ) }
									onControl={ ( value ) => this.setState( { containerBorderControl: value } ) }
									min={ 0 }
									max={ 40 }
									step={ 1 }
								/>
								<KadenceRange
									label={ __( 'Container Border Radius (px)', 'kadence-blocks' ) }
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
															title: __( 'Normal', 'kadence-blocks' ),
															className: 'kt-normal-tab',
														},
														{
															name: 'hover',
															title: __( 'Hover', 'kadence-blocks' ),
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
															<PopColorControl
																label={ __( 'Hover Background', 'kadence-blocks' ) }
																value={ ( containerHoverBackground ? containerHoverBackground : '#f2f2f2' ) }
																default={ '#f2f2f2' }
																opacityValue={ containerHoverBackgroundOpacity }
																onChange={ value => setAttributes( { containerHoverBackground: value } ) }
																onOpacityChange={ value => setAttributes( { containerHoverBackgroundOpacity: value } ) }
															/>
															<PopColorControl
																label={ __( 'Hover Border', 'kadence-blocks' ) }
																value={ ( containerHoverBorder ? containerHoverBorder : '#eeeeee' ) }
																default={ '#eeeeee' }
																opacityValue={ containerHoverBorderOpacity }
																onChange={ value => setAttributes( { containerHoverBorder: value } ) }
																onOpacityChange={ value => setAttributes( { containerHoverBorderOpacity: value } ) }
															/>
														</Fragment>
													);
												} else {
													tabout = (
														<Fragment>
															<PopColorControl
																label={ __( 'Container Background', 'kadence-blocks' ) }
																value={ ( containerBackground ? containerBackground : '#f2f2f2' ) }
																default={ '#f2f2f2' }
																opacityValue={ containerBackgroundOpacity }
																onChange={ value => setAttributes( { containerBackground: value } ) }
																onOpacityChange={ value => setAttributes( { containerBackgroundOpacity: value } ) }
															/>
															<PopColorControl
																label={ __( 'Container Border', 'kadence-blocks' ) }
																value={ ( containerBorder ? containerBorder : '#eeeeee' ) }
																default={ '#eeeeee' }
																opacityValue={ containerBorderOpacity }
																onChange={ value => setAttributes( { containerBorder: value } ) }
																onOpacityChange={ value => setAttributes( { containerBorderOpacity: value } ) }
															/>
														</Fragment>
													);
												}
											}
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
								<ResponsiveMeasuremenuControls
									label={ __( 'Container Padding', 'kadence-blocks' ) }
									control={ containerPaddingControl }
									tabletControl={ containerPaddingControl }
									mobileControl={ containerPaddingControl }
									value={ containerPadding }
									tabletValue={ containerTabletPadding }
									mobileValue={ containerMobilePadding }
									onChange={ ( value ) => {
										setAttributes( { containerPadding: value } );
									} }
									onChangeTablet={ ( value ) => {
										setAttributes( { containerTabletPadding: value } );
									} }
									onChangeMobile={ ( value ) => {
										setAttributes( { containerMobilePadding: value } );
									} }
									onChangeControl={ ( value ) => this.setState( { containerPaddingControl: value } ) }
									onChangeTabletControl={ ( value ) => this.setState( { containerPaddingControl: value } ) }
									onChangeMobileControl={ ( value ) => this.setState( { containerPaddingControl: value } ) }
									allowEmpty={ true }
									min={ paddingMin }
									max={ paddingMax }
									step={ paddingStep }
									unit={ containerPaddingType }
									units={ [ 'px', 'em', 'rem', '%' ] }
									onUnit={ ( value ) => setAttributes( { containerPaddingType: value } ) }
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
								<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Max Width Type', 'kadence-blocks' ) }>
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
								<KadenceRange
									label={ __( 'Container Max Width', 'kadence-blocks' ) }
									value={ maxWidth }
									onChange={ ( value ) => {
										setAttributes( {
											maxWidth: value,
										} );
									} }
									min={ 0 }
									max={ widthMax }
								/>
							</KadencePanelBody>
						) }
						{ this.showSettings( 'mediaSettings' ) && (
							<KadencePanelBody
								title={ __( 'Media Settings', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-info-media-settings' }
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
															label={ __( 'Mobile Media Align', 'kadence-blocks' ) }
															value={ ( mediaAlignMobile ? mediaAlignMobile : mediaAlign ) }
															options={ [
																{ value: 'top', label: __( 'Top', 'kadence-blocks' ) },
																{ value: 'left', label: __( 'Left', 'kadence-blocks' ) },
																{ value: 'right', label: __( 'Right', 'kadence-blocks' ) },
															] }
															onChange={ value => setAttributes( { mediaAlignMobile: value } ) }
														/>
													);
												} else if ( 'tablet' === tab.name ) {
													tabout = (
														<SelectControl
															label={ __( 'Tablet Media Align', 'kadence-blocks' ) }
															value={ ( mediaAlignTablet ? mediaAlignTablet : mediaAlign ) }
															options={ [
																{ value: 'top', label: __( 'Top', 'kadence-blocks' ) },
																{ value: 'left', label: __( 'Left', 'kadence-blocks' ) },
																{ value: 'right', label: __( 'Right', 'kadence-blocks' ) },
															] }
															onChange={ value => setAttributes( { mediaAlignTablet: value } ) }
														/>
													);
												} else {
													tabout = (
														<SelectControl
															label={ __( 'Media Align', 'kadence-blocks' ) }
															value={ mediaAlign }
															options={ [
																{ value: 'top', label: __( 'Top', 'kadence-blocks' ) },
																{ value: 'left', label: __( 'Left', 'kadence-blocks' ) },
																{ value: 'right', label: __( 'Right', 'kadence-blocks' ) },
															] }
															onChange={ value => setAttributes( { mediaAlign: value } ) }
														/>
													);
												}
											}
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
								{ mediaAlign !== 'top' && (
									<Fragment>
										<SelectControl
											label={ __( 'Media Vertical Align', 'kadence-blocks' ) }
											value={ mediaVAlign }
											options={ [
												{ value: 'top', label: __( 'Top', 'kadence-blocks' ) },
												{ value: 'middle', label: __( 'Middle', 'kadence-blocks' ) },
												{ value: 'bottom', label: __( 'Bottom', 'kadence-blocks' ) },
											] }
											onChange={ value => setAttributes( { mediaVAlign: value } ) }
										/>
									</Fragment>
								) }
								<SelectControl
									label={ __( 'Media Type', 'kadence-blocks' ) }
									value={ mediaType }
									options={ [
										{ value: 'icon', label: __( 'Icon', 'kadence-blocks' ) },
										{ value: 'image', label: __( 'Image', 'kadence-blocks' ) },
										{ value: 'number', label: __( 'Number', 'kadence-blocks' ) },
										{ value: 'none', label: __( 'None', 'kadence-blocks' ) },
									] }
									onChange={ value => setAttributes( { mediaType: value } ) }
								/>
								{ 'image' === mediaType && (
									<Fragment>
										<KadenceImageControl
											label={ __( 'Image', 'kadence-blocks' ) }
											hasImage={ ( mediaImage && mediaImage[ 0 ] && mediaImage[ 0 ].url ? true : false ) }
											imageURL={ ( mediaImage && mediaImage[ 0 ] && mediaImage[ 0 ].url ? mediaImage[ 0 ].url : '' ) }
											imageID={ ( mediaImage && mediaImage[ 0 ] && mediaImage[ 0 ].id ? mediaImage[ 0 ].id : '' ) }
											onRemoveImage={ clearImage }
											onSaveImage={ onSelectImage }
											disableMediaButtons={ ( mediaImage[ 0 ].url ? true : false ) }
											dynamicAttribute="mediaImage:0:url"
											{ ...this.props }
										/>
										{ mediaImage[ 0 ].id && 'svg+xml' !== mediaImage[ 0 ].subtype && (
											<ImageSizeControl
												label={ __( 'Image File Size', 'kadence-blocks' ) }
												id={ mediaImage[ 0 ].id }
												url={ mediaImage[ 0 ].url }
												onChange={ changeImageSize }
											/>
										) }
										<KadenceRange
											label={ __( 'Max Image Width', 'kadence-blocks' ) }
											value={ mediaImage[ 0 ].maxWidth }
											onChange={ value => saveMediaImage( { maxWidth: value } ) }
											min={ 5 }
											max={ 800 }
											step={ 1 }
										/>
										<SelectControl
											label={ __( 'Image ratio', 'kadence-blocks' ) }
											options={ [
												{
													label: __( 'Inherit', 'kadence-blocks' ),
													value: 'inherit',
												},
												{
													label: __( 'Landscape 4:3', 'kadence-blocks' ),
													value: 'land43',
												},
												{
													label: __( 'Landscape 3:2', 'kadence-blocks' ),
													value: 'land32',
												},
												{
													label: __( 'Landscape 16:9', 'kadence-blocks' ),
													value: 'land169',
												},
												{
													label: __( 'Landscape 2:1', 'kadence-blocks' ),
													value: 'land21',
												},
												{
													label: __( 'Landscape 3:1', 'kadence-blocks' ),
													value: 'land31',
												},
												{
													label: __( 'Landscape 4:1', 'kadence-blocks' ),
													value: 'land41',
												},
												{
													label: __( 'Portrait 3:4', 'kadence-blocks' ),
													value: 'port34',
												},
												{
													label: __( 'Portrait 2:3', 'kadence-blocks' ),
													value: 'port23',
												},
												{
													label: __( 'Square 1:1', 'kadence-blocks' ),
													value: 'square',
												},
											] }
											value={ imageRatio }
											onChange={ ( value ) => setAttributes( { imageRatio: value } ) }
										/>
										<SelectControl
											label={ __( 'Image Hover Animation', 'kadence-blocks' ) }
											value={ mediaImage[ 0 ].hoverAnimation }
											options={ [
												{ value: 'none', label: __( 'None', 'kadence-blocks' ) },
												{ value: 'grayscale', label: __( 'Grayscale to Color', 'kadence-blocks' ) },
												{ value: 'drawborder', label: __( 'Border Spin In', 'kadence-blocks' ) },
												{ value: 'grayscale-border-draw', label: __( 'Grayscale to Color & Border Spin In', 'kadence-blocks' ) },
												{ value: 'flip', label: __( 'Flip to Another Image', 'kadence-blocks' ) },
											] }
											onChange={ value => saveMediaImage( { hoverAnimation: value } ) }
										/>
										{ 'flip' === mediaImage[ 0 ].hoverAnimation && (
											<Fragment>
												<h2>{ __( 'Flip Image (Use same size as start image', 'kadence-blocks' ) }</h2>
												<KadenceImageControl
													label={ __( 'Image', 'kadence-blocks' ) }
													hasImage={ ( mediaImage && mediaImage[ 0 ] && mediaImage[ 0 ].flipUrl ? true : false ) }
													imageURL={ ( mediaImage && mediaImage[ 0 ] && mediaImage[ 0 ].flipUrl ? mediaImage[ 0 ].flipUrl : '' ) }
													imageID={ ( mediaImage && mediaImage[ 0 ] && mediaImage[ 0 ].flipId ? mediaImage[ 0 ].flipId : '' ) }
													onRemoveImage={ clearFlipImage }
													onSaveImage={ onSelectFlipImage }
													disableMediaButtons={ ( mediaImage && mediaImage[ 0 ] && mediaImage[ 0 ].flipUrl ? true : false ) }
													{ ...this.props }
												/>
												{ mediaImage[ 0 ].flipId && 'svg+xml' !== mediaImage[ 0 ].flipSubtype && (
													<ImageSizeControl
														label={ __( 'Image File Size', 'kadence-blocks' ) }
														id={ mediaImage[ 0 ].flipId }
														url={ mediaImage[ 0 ].flipUrl }
														onChange={ changeFlipImageSize }
													/>
												) }
											</Fragment>
										) }
										<MeasurementControls
											label={ __( 'Image Border', 'kadence-blocks' ) }
											measurement={ mediaStyle[ 0 ].borderWidth }
											control={ mediaBorderControl }
											onChange={ ( value ) => saveMediaStyle( { borderWidth: value } ) }
											onControl={ ( value ) => this.setState( { mediaBorderControl: value } ) }
											min={ 0 }
											max={ 40 }
											step={ 1 }
										/>
										<KadenceRange
											label={ __( 'Image Border Radius (px)', 'kadence-blocks' ) }
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
																	title: __( 'Normal', 'kadence-blocks' ),
																	className: 'kt-normal-tab',
																},
																{
																	name: 'hover',
																	title: __( 'Hover', 'kadence-blocks' ),
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
																			<PopColorControl
																				label={ __( 'SVG Hover Color', 'kadence-blocks' ) }
																				value={ ( mediaIcon[ 0 ].hoverColor ? mediaIcon[ 0 ].hoverColor : '#444444' ) }
																				default={ '#444444' }
																				onChange={ value => saveMediaIcon( { hoverColor: value } ) }
																			/>
																			<small>{ __( '*you must force inline svg for this to have effect.', 'kadence-blocks' ) }</small>
																		</Fragment>
																	) }
																	<PopColorControl
																		label={ __( 'Image Hover Background', 'kadence-blocks' ) }
																		value={ ( mediaStyle[ 0 ].hoverBackground ? mediaStyle[ 0 ].hoverBackground : '' ) }
																		default={ 'transparent' }
																		onChange={ value => saveMediaStyle( { hoverBackground: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'Image Hover Border', 'kadence-blocks' ) }
																		value={ ( mediaStyle[ 0 ].hoverBorder ? mediaStyle[ 0 ].hoverBorder : '#444444' ) }
																		default={ '#444444' }
																		onChange={ value => saveMediaStyle( { hoverBorder: value } ) }
																	/>
																</Fragment>
															);
														} else {
															tabout = (
																<Fragment>
																	{ mediaImage[ 0 ].subtype && 'svg+xml' === mediaImage[ 0 ].subtype && (
																		<Fragment>
																			<PopColorControl
																				label={ __( 'SVG Color', 'kadence-blocks' ) }
																				value={ ( mediaIcon[ 0 ].color ? mediaIcon[ 0 ].color : '#444444' ) }
																				default={ '#444444' }
																				onChange={ value => saveMediaIcon( { color: value } ) }
																			/>
																			<small>{ __( '*you must force inline svg for this to have effect.', 'kadence-blocks' ) }</small>
																		</Fragment>
																	) }
																	<PopColorControl
																		label={ __( 'Image Background', 'kadence-blocks' ) }
																		value={ ( mediaStyle[ 0 ].background ? mediaStyle[ 0 ].background : '' ) }
																		default={ 'transparent' }
																		onChange={ value => saveMediaStyle( { background: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'Image Border', 'kadence-blocks' ) }
																		value={ ( mediaStyle[ 0 ].border ? mediaStyle[ 0 ].border : '#444444' ) }
																		default={ '#444444' }
																		onChange={ value => saveMediaStyle( { border: value } ) }
																	/>
																</Fragment>
															);
														}
													}
													return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
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
										<ResponsiveRangeControl
											label={ __( 'Icon Size', 'kadence-blocks' ) }
											value={ mediaIcon[ 0 ].size }
											mobileValue={ mediaIcon[ 0 ].mobileSize ? mediaIcon[ 0 ].mobileSize : '' }
											tabletValue={ mediaIcon[ 0 ].tabletSize ? mediaIcon[ 0 ].tabletSize : '' }
											onChange={ ( value ) => saveMediaIcon( { size: value } ) }
											onChangeTablet={ ( value ) => saveMediaIcon( { tabletSize: value } ) }
											onChangeMobile={ ( value ) => saveMediaIcon( { mobileSize: value } ) }
											min={ 5 }
											max={ 250 }
											step={ 1 }
										/>
										{ mediaIcon[ 0 ].icon && 'fe' === mediaIcon[ 0 ].icon.substring( 0, 2 ) && (
											<KadenceRange
												label={ __( 'Icon Line Width', 'kadence-blocks' ) }
												value={ mediaIcon[ 0 ].width }
												onChange={ value => saveMediaIcon( { width: value } ) }
												step={ 0.5 }
												min={ 0.5 }
												max={ 4 }
											/>
										) }
										<MeasurementControls
											label={ __( 'Icon Border', 'kadence-blocks' ) }
											measurement={ mediaStyle[ 0 ].borderWidth }
											control={ mediaBorderControl }
											onChange={ ( value ) => saveMediaStyle( { borderWidth: value } ) }
											onControl={ ( value ) => this.setState( { mediaBorderControl: value } ) }
											min={ 0 }
											max={ 40 }
											step={ 1 }
										/>
										<KadenceRange
											label={ __( 'Icon Border Radius (px)', 'kadence-blocks' ) }
											value={ mediaStyle[ 0 ].borderRadius }
											onChange={ value => saveMediaStyle( { borderRadius: value } ) }
											step={ 1 }
											min={ 0 }
											max={ 200 }
										/>
										<SelectControl
											label={ __( 'Icon Hover Animation', 'kadence-blocks' ) }
											value={ mediaIcon[ 0 ].hoverAnimation }
											options={ [
												{ value: 'none', label: __( 'None', 'kadence-blocks' ) },
												{ value: 'drawborder', label: __( 'Border Spin In', 'kadence-blocks' ) },
												{ value: 'flip', label: __( 'Flip to Another Icon', 'kadence-blocks' ) },
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
																	title: __( 'Normal', 'kadence-blocks' ),
																	className: 'kt-normal-tab',
																},
																{
																	name: 'hover',
																	title: __( 'Hover', 'kadence-blocks' ),
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
																	<PopColorControl
																		label={ __( 'Icon Hover Color', 'kadence-blocks' ) }
																		value={ ( mediaIcon[ 0 ].hoverColor ? mediaIcon[ 0 ].hoverColor : '#444444' ) }
																		default={ '#444444' }
																		onChange={ value => saveMediaIcon( { hoverColor: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'Icon Hover Background', 'kadence-blocks' ) }
																		value={ ( mediaStyle[ 0 ].hoverBackground ? mediaStyle[ 0 ].hoverBackground : '' ) }
																		default={ 'transparent' }
																		onChange={ value => saveMediaStyle( { hoverBackground: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'Icon Hover Border', 'kadence-blocks' ) }
																		value={ ( mediaStyle[ 0 ].hoverBorder ? mediaStyle[ 0 ].hoverBorder : '#444444' ) }
																		default={ '#444444' }
																		onChange={ value => saveMediaStyle( { hoverBorder: value } ) }
																	/>
																</Fragment>
															);
														} else {
															tabout = (
																<Fragment>
																	<PopColorControl
																		label={ __( 'Icon Color', 'kadence-blocks' ) }
																		value={ ( mediaIcon[ 0 ].color ? mediaIcon[ 0 ].color : '#444444' ) }
																		default={ '#444444' }
																		onChange={ value => saveMediaIcon( { color: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'Icon Background', 'kadence-blocks' ) }
																		value={ ( mediaStyle[ 0 ].background ? mediaStyle[ 0 ].background : '' ) }
																		default={ 'transparent' }
																		onChange={ value => saveMediaStyle( { background: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'Icon Border Color', 'kadence-blocks' ) }
																		value={ ( mediaStyle[ 0 ].border ? mediaStyle[ 0 ].border : '#444444' ) }
																		default={ '#444444' }
																		onChange={ value => saveMediaStyle( { border: value } ) }
																	/>
																</Fragment>
															);
														}
													}
													return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
												}
											}
										</TabPanel>
										<TextControl
											label={ __( 'Icon Title for Accessibility', 'kadence-blocks' ) }
											value={ mediaIcon[ 0 ].title }
											onChange={ value => saveMediaIcon( { title: value } ) }
										/>
									</Fragment>
								) }
								{ 'number' === mediaType && (
									<Fragment>
										<ResponsiveRangeControl
											label={ __( 'Size', 'kadence-blocks' ) }
											value={ mediaIcon[ 0 ].size }
											mobileValue={ mediaIcon[ 0 ].mobileSize ? mediaIcon[ 0 ].mobileSize : '' }
											tabletValue={ mediaIcon[ 0 ].tabletSize ? mediaIcon[ 0 ].tabletSize : '' }
											onChange={ ( value ) => saveMediaIcon( { size: value } ) }
											onChangeTablet={ ( value ) => saveMediaIcon( { tabletSize: value } ) }
											onChangeMobile={ ( value ) => saveMediaIcon( { mobileSize: value } ) }
											min={ 5 }
											max={ 250 }
											step={ 1 }
										/>
										<TypographyControls
											fontFamily={ mediaNumber[ 0 ] && mediaNumber[ 0 ].family ? mediaNumber[ 0 ].family : '' }
											onFontFamily={ ( value ) => saveMediaNumber( { family: value } ) }
											onFontChange={ ( select ) => {
												saveMediaNumber( {
													family: select.value,
													google: select.google,
												} );
											} }
											onFontArrayChange={ ( values ) => saveMediaNumber( values ) }
											googleFont={ undefined !== mediaNumber[ 0 ].google ? mediaNumber[ 0 ].google : false }
											onGoogleFont={ ( value ) => saveMediaNumber( { google: value } ) }
											loadGoogleFont={ undefined !== mediaNumber[ 0 ].loadGoogle ? mediaNumber[ 0 ].loadGoogle : true }
											onLoadGoogleFont={ ( value ) => saveMediaNumber( { loadGoogle: value } ) }
											fontVariant={ mediaNumber[ 0 ].variant ? mediaNumber[ 0 ].variant : '' }
											onFontVariant={ ( value ) => saveMediaNumber( { variant: value } ) }
											fontWeight={ mediaNumber[ 0 ].weight ? mediaNumber[ 0 ].weight : '' }
											onFontWeight={ ( value ) => saveMediaNumber( { weight: value } ) }
											fontStyle={ mediaNumber[ 0 ].style ? mediaNumber[ 0 ].style : '' }
											onFontStyle={ ( value ) => saveMediaNumber( { style: value } ) }
											fontSubset={ mediaNumber[ 0 ].subset ? mediaNumber[ 0 ].subset : '' }
											onFontSubset={ ( value ) => saveMediaNumber( { subset: value } ) }
										/>
										<MeasurementControls
											label={ __( 'Number Border', 'kadence-blocks' ) }
											measurement={ mediaStyle[ 0 ].borderWidth }
											control={ mediaBorderControl }
											onChange={ ( value ) => saveMediaStyle( { borderWidth: value } ) }
											onControl={ ( value ) => this.setState( { mediaBorderControl: value } ) }
											min={ 0 }
											max={ 40 }
											step={ 1 }
										/>
										<KadenceRange
											label={ __( 'Number Border Radius (px)', 'kadence-blocks' ) }
											value={ mediaStyle[ 0 ].borderRadius }
											onChange={ value => saveMediaStyle( { borderRadius: value } ) }
											step={ 1 }
											min={ 0 }
											max={ 200 }
										/>
										<SelectControl
											label={ __( 'Number Hover Animation', 'kadence-blocks' ) }
											value={ mediaNumber[ 0 ].hoverAnimation ? mediaNumber[ 0 ].hoverAnimation : 'none' }
											options={ [
												{ value: 'none', label: __( 'None', 'kadence-blocks' ) },
												{ value: 'drawborder', label: __( 'Border Spin In', 'kadence-blocks' ) },
											] }
											onChange={ value => saveMediaNumber( { hoverAnimation: value } ) }
										/>
										<TabPanel className="kt-inspect-tabs kt-hover-tabs"
															activeClass="active-tab"
															tabs={ [
																{
																	name: 'normal',
																	title: __( 'Normal', 'kadence-blocks' ),
																	className: 'kt-normal-tab',
																},
																{
																	name: 'hover',
																	title: __( 'Hover', 'kadence-blocks' ),
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
																	<PopColorControl
																		label={ __( 'Number Hover Color', 'kadence-blocks' ) }
																		value={ ( mediaIcon[ 0 ].hoverColor ? mediaIcon[ 0 ].hoverColor : '#444444' ) }
																		default={ '#444444' }
																		onChange={ value => saveMediaIcon( { hoverColor: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'Number Hover Background', 'kadence-blocks' ) }
																		value={ ( mediaStyle[ 0 ].hoverBackground ? mediaStyle[ 0 ].hoverBackground : '' ) }
																		default={ 'transparent' }
																		onChange={ value => saveMediaStyle( { hoverBackground: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'Number Hover Border', 'kadence-blocks' ) }
																		value={ ( mediaStyle[ 0 ].hoverBorder ? mediaStyle[ 0 ].hoverBorder : '#444444' ) }
																		default={ '#444444' }
																		onChange={ value => saveMediaStyle( { hoverBorder: value } ) }
																	/>
																</Fragment>
															);
														} else {
															tabout = (
																<Fragment>
																	<PopColorControl
																		label={ __( 'Number Color', 'kadence-blocks' ) }
																		value={ ( mediaIcon[ 0 ].color ? mediaIcon[ 0 ].color : '#444444' ) }
																		default={ '#444444' }
																		onChange={ value => saveMediaIcon( { color: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'Number Background', 'kadence-blocks' ) }
																		value={ ( mediaStyle[ 0 ].background ? mediaStyle[ 0 ].background : '' ) }
																		default={ 'transparent' }
																		onChange={ value => saveMediaStyle( { background: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'Number Border Color', 'kadence-blocks' ) }
																		value={ ( mediaStyle[ 0 ].border ? mediaStyle[ 0 ].border : '#444444' ) }
																		default={ '#444444' }
																		onChange={ value => saveMediaStyle( { border: value } ) }
																	/>
																</Fragment>
															);
														}
													}
													return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
												}
											}
										</TabPanel>
									</Fragment>
								) }
								<MeasurementControls
									label={ __( 'Media Padding', 'kadence-blocks' ) }
									measurement={ mediaStyle[ 0 ].padding }
									control={ mediaPaddingControl }
									onChange={ ( value ) => saveMediaStyle( { padding: value } ) }
									onControl={ ( value ) => this.setState( { mediaPaddingControl: value } ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<MeasurementControls
									label={ __( 'Media Margin', 'kadence-blocks' ) }
									measurement={ mediaStyle[ 0 ].margin }
									control={ mediaMarginControl }
									onChange={ ( value ) => saveMediaStyle( { margin: value } ) }
									onControl={ ( value ) => this.setState( { mediaMarginControl: value } ) }
									min={ -200 }
									max={ 200 }
									step={ 1 }
								/>
							</KadencePanelBody>
						) }
						{ this.showSettings( 'titleSettings' ) && (
							<KadencePanelBody
								title={ __( 'Title Settings', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-info-title-settings' }
							>
								<ToggleControl
									label={ __( 'Show Title', 'kadence-blocks' ) }
									checked={ displayTitle }
									onChange={ ( value ) => setAttributes( { displayTitle: value } ) }
								/>
								{ displayTitle && (
									<Fragment>
										<h2 className="kt-tab-wrap-title">{ __( 'Color Settings', 'kadence-blocks' ) }</h2>
										<TabPanel className="kt-inspect-tabs kt-hover-tabs"
															activeClass="active-tab"
															tabs={ [
																{
																	name: 'normal',
																	title: __( 'Normal', 'kadence-blocks' ),
																	className: 'kt-normal-tab',
																},
																{
																	name: 'hover',
																	title: __( 'Hover', 'kadence-blocks' ),
																	className: 'kt-hover-tab',
																},
															] }>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'hover' === tab.name ) {
															tabout = (
																<PopColorControl
																	label={ __( 'Hover Color', 'kadence-blocks' ) }
																	value={ ( titleHoverColor ? titleHoverColor : '' ) }
																	default={ '' }
																	onChange={ value => setAttributes( { titleHoverColor: value } ) }
																/>
															);
														} else {
															tabout = (
																<PopColorControl
																	label={ __( 'Title Color', 'kadence-blocks' ) }
																	value={ ( titleColor ? titleColor : '' ) }
																	default={ '' }
																	onChange={ value => setAttributes( { titleColor: value } ) }
																/>
															);
														}
													}
													return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
												}
											}
										</TabPanel>
										<TypographyControls
											fontGroup={ 'heading' }
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
											textTransform={ titleFont[ 0 ].textTransform }
											onTextTransform={ ( value ) => saveTitleFont( { textTransform: value } ) }
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
										<h2 className="kt-heading-size-title">{ __( 'Min Height', 'kadence-blocks' ) }</h2>
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
																<KadenceRange
																	value={ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 2 ] ) ? titleMinHeight[ 2 ] : '' ) }
																	onChange={ value => setAttributes( { titleMinHeight: [ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ) ? titleMinHeight[ 0 ] : '' ), ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 1 ] ) ? titleMinHeight[ 1 ] : '' ), value ] } ) }
																	step={ 1 }
																	min={ 0 }
																	max={ 600 }
																/>
															);
														} else if ( 'tablet' === tab.name ) {
															tabout = (
																<KadenceRange
																	value={ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 1 ] ) ? titleMinHeight[ 1 ] : '' ) }
																	onChange={ value => setAttributes( { titleMinHeight: [ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ) ? titleMinHeight[ 0 ] : '' ), value, ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 2 ] ) ? titleMinHeight[ 2 ] : '' ) ] } ) }
																	step={ 1 }
																	min={ 0 }
																	max={ 600 }
																/>
															);
														} else {
															tabout = (
																<KadenceRange
																	value={ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ) ? titleMinHeight[ 0 ] : '' ) }
																	onChange={ value => setAttributes( { titleMinHeight: [ value, ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 1 ] ) ? titleMinHeight[ 1 ] : '' ), ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 2 ] ) ? titleMinHeight[ 2 ] : '' ) ] } ) }
																	step={ 1 }
																	min={ 0 }
																	max={ 600 }
																/>
															);
														}
													}
													return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
												}
											}
										</TabPanel>
									</Fragment>
								) }
							</KadencePanelBody>
						) }
						{ this.showSettings( 'textSettings' ) && (
							<KadencePanelBody
								title={ __( 'Text Settings', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-info-text-settings' }
							>
								<ToggleControl
									label={ __( 'Show Text', 'kadence-blocks' ) }
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
																	title: __( 'Normal', 'kadence-blocks' ),
																	className: 'kt-normal-tab',
																},
																{
																	name: 'hover',
																	title: __( 'Hover', 'kadence-blocks' ),
																	className: 'kt-hover-tab',
																},
															] }>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'hover' === tab.name ) {
															tabout = (
																<PopColorControl
																	label={ __( 'Hover Color', 'kadence-blocks' ) }
																	value={ ( textHoverColor ? textHoverColor : '' ) }
																	default={ '' }
																	onChange={ value => setAttributes( { textHoverColor: value } ) }
																/>
															);
														} else {
															tabout = (
																<PopColorControl
																	label={ __( 'Text Color', 'kadence-blocks' ) }
																	value={ ( textColor ? textColor : '' ) }
																	default={ '' }
																	onChange={ value => setAttributes( { textColor: value } ) }
																/>
															);
														}
													}
													return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
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
											textTransform={ ( undefined !== textFont[ 0 ].textTransform ? textFont[ 0 ].textTransform : '' ) }
											onTextTransform={ ( value ) => saveTextFont( { textTransform: value } ) }
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
										<h2 className="kt-heading-size-title">{ __( 'Min Height', 'kadence-blocks' ) }</h2>
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
																<KadenceRange
																	value={ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 2 ] ) ? textMinHeight[ 2 ] : '' ) }
																	onChange={ value => setAttributes( { textMinHeight: [ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 0 ] ) ? textMinHeight[ 0 ] : '' ), ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 1 ] ) ? textMinHeight[ 1 ] : '' ), value ] } ) }
																	step={ 1 }
																	min={ 0 }
																	max={ 600 }
																/>
															);
														} else if ( 'tablet' === tab.name ) {
															tabout = (
																<KadenceRange
																	value={ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 1 ] ) ? textMinHeight[ 1 ] : '' ) }
																	onChange={ value => setAttributes( { textMinHeight: [ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 0 ] ) ? textMinHeight[ 0 ] : '' ), value, ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 2 ] ) ? textMinHeight[ 2 ] : '' ) ] } ) }
																	step={ 1 }
																	min={ 0 }
																	max={ 600 }
																/>
															);
														} else {
															tabout = (
																<KadenceRange
																	value={ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 0 ] ) ? textMinHeight[ 0 ] : '' ) }
																	onChange={ value => setAttributes( { textMinHeight: [ value, ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 1 ] ) ? textMinHeight[ 1 ] : '' ), ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 2 ] ) ? textMinHeight[ 2 ] : '' ) ] } ) }
																	step={ 1 }
																	min={ 0 }
																	max={ 600 }
																/>
															);
														}
													}
													return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
												}
											}
										</TabPanel>
									</Fragment>
								) }
							</KadencePanelBody>
						) }
						{ this.showSettings( 'learnMoreSettings' ) && (
							<KadencePanelBody
								title={ __( 'Learn More Settings', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-info-learn-more' }
							>
								<ToggleControl
									label={ __( 'Show Learn More', 'kadence-blocks' ) }
									checked={ displayLearnMore }
									onChange={ ( value ) => setAttributes( { displayLearnMore: value } ) }
								/>
								{ displayLearnMore && (
									<Fragment>
										<h2 className="kt-tab-wrap-title">{ __( 'Color Settings', 'kadence-blocks' ) }</h2>
										<TabPanel className="kt-inspect-tabs kt-hover-tabs"
															activeClass="active-tab"
															tabs={ [
																{
																	name: 'normal',
																	title: __( 'Normal', 'kadence-blocks' ),
																	className: 'kt-normal-tab',
																},
																{
																	name: 'hover',
																	title: __( 'Hover', 'kadence-blocks' ),
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
																	<PopColorControl
																		label={ __( 'HOVER: Text Color', 'kadence-blocks' ) }
																		value={ ( learnMoreStyles[ 0 ].colorHover ? learnMoreStyles[ 0 ].colorHover : '#ffffff' ) }
																		default={ '#ffffff' }
																		onChange={ value => saveLearnMoreStyles( { colorHover: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'HOVER: Background', 'kadence-blocks' ) }
																		value={ ( learnMoreStyles[ 0 ].backgroundHover ? learnMoreStyles[ 0 ].backgroundHover : '#444444' ) }
																		default={ '#444444' }
																		onChange={ value => saveLearnMoreStyles( { backgroundHover: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'HOVER: Border Color', 'kadence-blocks' ) }
																		value={ ( learnMoreStyles[ 0 ].borderHover ? learnMoreStyles[ 0 ].borderHover : '#444444' ) }
																		default={ '#444444' }
																		onChange={ value => saveLearnMoreStyles( { borderHover: value } ) }
																	/>
																</Fragment>
															);
														} else {
															tabout = (
																<Fragment>
																	<PopColorControl
																		label={ __( 'Text Color', 'kadence-blocks' ) }
																		value={ ( learnMoreStyles[ 0 ].color ? learnMoreStyles[ 0 ].color : '' ) }
																		default={ '' }
																		onChange={ value => saveLearnMoreStyles( { color: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'Background', 'kadence-blocks' ) }
																		value={ ( learnMoreStyles[ 0 ].background ? learnMoreStyles[ 0 ].background : '' ) }
																		default={ 'transparent' }
																		onChange={ value => saveLearnMoreStyles( { background: value } ) }
																	/>
																	<PopColorControl
																		label={ __( 'Border Color', 'kadence-blocks' ) }
																		value={ ( learnMoreStyles[ 0 ].border ? learnMoreStyles[ 0 ].border : '#555555' ) }
																		default={ '#555555' }
																		onChange={ value => saveLearnMoreStyles( { border: value } ) }
																	/>
																</Fragment>
															);
														}
													}
													return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
												}
											}
										</TabPanel>
										<MeasurementControls
											label={ __( 'Learn More Border Width (px)', 'kadence-blocks' ) }
											measurement={ learnMoreStyles[ 0 ].borderWidth }
											control={ learnMoreStyles[ 0 ].borderControl }
											onChange={ ( value ) => saveLearnMoreStyles( { borderWidth: value } ) }
											onControl={ ( value ) => saveLearnMoreStyles( { borderControl: value } ) }
											min={ 0 }
											max={ 40 }
											step={ 1 }
										/>
										<KadenceRange
											label={ __( 'Learn More Border Radius (px)', 'kadence-blocks' ) }
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
											textTransform={ ( undefined !== learnMoreStyles[ 0 ].textTransform ? learnMoreStyles[ 0 ].textTransform : '' ) }
											onTextTransform={ ( value ) => saveLearnMoreStyles( { textTransform: value } ) }
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
							</KadencePanelBody>
						) }
						{ this.showSettings( 'shadowSettings' ) && (
							<KadencePanelBody
								title={ __( 'Container Shadow', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-info-container-shadow' }
							>
								<ToggleControl
									label={ __( 'Enable Shadow', 'kadence-blocks' ) }
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
																<PopColorControl
																	label={ __( 'Shadow Color', 'kadence-blocks' ) }
																	value={ ( shadowHover[ 0 ].color ? shadowHover[ 0 ].color : '' ) }
																	default={ '' }
																	onChange={ value => saveHoverShadow( { color: value } ) }
																	opacityValue={ shadowHover[ 0 ].opacity }
																	onOpacityChange={ value => saveHoverShadow( { opacity: value } ) }
																/>
																<KadenceRange
																	label={ __( 'Shadow Blur', 'kadence-blocks' ) }
																	value={ shadowHover[ 0 ].blur }
																	onChange={ value => saveHoverShadow( { blur: value } ) }
																	min={ 0 }
																	max={ 100 }
																	step={ 1 }
																/>
																<KadenceRange
																	label={ __( 'Shadow Spread', 'kadence-blocks' ) }
																	value={ shadowHover[ 0 ].spread }
																	onChange={ value => saveHoverShadow( { spread: value } ) }
																	min={ -100 }
																	max={ 100 }
																	step={ 1 }
																/>
																<KadenceRange
																	label={ __( 'Shadow Vertical Offset', 'kadence-blocks' ) }
																	value={ shadowHover[ 0 ].vOffset }
																	onChange={ value => saveHoverShadow( { vOffset: value } ) }
																	min={ -100 }
																	max={ 100 }
																	step={ 1 }
																/>
																<KadenceRange
																	label={ __( 'Shadow Horizontal Offset', 'kadence-blocks' ) }
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
																<PopColorControl
																	label={ __( 'Shadow Color', 'kadence-blocks' ) }
																	value={ ( shadow[ 0 ].color ? shadow[ 0 ].color : '' ) }
																	default={ '' }
																	onChange={ value => saveShadow( { color: value } ) }
																	opacityValue={ shadow[ 0 ].opacity }
																	onOpacityChange={ value => saveShadow( { opacity: value } ) }
																/>
																<KadenceRange
																	label={ __( 'Shadow Blur', 'kadence-blocks' ) }
																	value={ shadow[ 0 ].blur }
																	onChange={ value => saveShadow( { blur: value } ) }
																	min={ 0 }
																	max={ 100 }
																	step={ 1 }
																/>
																<KadenceRange
																	label={ __( 'Shadow Spread', 'kadence-blocks' ) }
																	value={ shadow[ 0 ].spread }
																	onChange={ value => saveShadow( { spread: value } ) }
																	min={ -100 }
																	max={ 100 }
																	step={ 1 }
																/>
																<KadenceRange
																	label={ __( 'Shadow Vertical Offset', 'kadence-blocks' ) }
																	value={ shadow[ 0 ].vOffset }
																	onChange={ value => saveShadow( { vOffset: value } ) }
																	min={ -100 }
																	max={ 100 }
																	step={ 1 }
																/>
																<KadenceRange
																	label={ __( 'Shadow Horizontal Offset', 'kadence-blocks' ) }
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
												return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
											}
										}
									</TabPanel>
								) }
							</KadencePanelBody>
						) }
					</InspectorControls>
				) }
				<div className={ `kt-blocks-info-box-link-wrap kt-blocks-info-box-media-align-${ mediaAlign } ${ isSelectedClass } kt-info-halign-${ hAlign } kb-info-box-vertical-media-align-${ mediaVAlign }` } style={ {
					boxShadow: ( displayShadow ? shadow[ 0 ].hOffset + 'px ' + shadow[ 0 ].vOffset + 'px ' + shadow[ 0 ].blur + 'px ' + shadow[ 0 ].spread + 'px ' + KadenceColorOutput( shadow[ 0 ].color, shadow[ 0 ].opacity ) : undefined ),
					borderColor: ( containerBorder ? KadenceColorOutput( containerBorder, ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) : KadenceColorOutput( '#eeeeee', ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) ),
					background: ( containerBackground ? KadenceColorOutput( containerBackground, ( undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1 ) ) : KadenceColorOutput( '#f2f2f2', ( undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1 ) ) ),
					borderRadius: containerBorderRadius + 'px',
					borderWidth: ( containerBorderWidth ? containerBorderWidth[ 0 ] + 'px ' + containerBorderWidth[ 1 ] + 'px ' + containerBorderWidth[ 2 ] + 'px ' + containerBorderWidth[ 3 ] + 'px' : '' ),
					paddingTop: ( '' !== previewContainerPaddingTop ? previewContainerPaddingTop + previewPaddingType : undefined ),
					paddingRight: ( '' !== previewContainerPaddingRight ? previewContainerPaddingRight + previewPaddingType : undefined ),
					paddingBottom: ( '' !== previewContainerPaddingBottom ? previewContainerPaddingBottom + previewPaddingType : undefined ),
					paddingLeft: ( '' !== previewContainerPaddingLeft ? previewContainerPaddingLeft + previewPaddingType : undefined ),
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
							<div className={ `kt-blocks-info-box-media ${ 'number' === mediaType ? 'kt-info-media-animate-' + mediaNumber[ 0 ].hoverAnimation : '' }${ 'image' === mediaType ? 'kt-info-media-animate-' + mediaImage[ 0 ].hoverAnimation : '' }${ 'icon' === mediaType ? 'kt-info-media-animate-' + mediaIcon[ 0 ].hoverAnimation : '' }` } style={ {
								borderColor: KadenceColorOutput( mediaStyle[ 0 ].border ),
								backgroundColor: KadenceColorOutput( mediaStyle[ 0 ].background ),
								borderRadius: mediaStyle[ 0 ].borderRadius + 'px',
								borderWidth: ( mediaStyle[ 0 ].borderWidth ? mediaStyle[ 0 ].borderWidth[ 0 ] + 'px ' + mediaStyle[ 0 ].borderWidth[ 1 ] + 'px ' + mediaStyle[ 0 ].borderWidth[ 2 ] + 'px ' + mediaStyle[ 0 ].borderWidth[ 3 ] + 'px' : '' ),
								padding: ( mediaStyle[ 0 ].padding ? mediaStyle[ 0 ].padding[ 0 ] + 'px ' + mediaStyle[ 0 ].padding[ 1 ] + 'px ' + mediaStyle[ 0 ].padding[ 2 ] + 'px ' + mediaStyle[ 0 ].padding[ 3 ] + 'px' : '' ),
							} } >
								{ ! mediaImage[ 0 ].url && 'image' === mediaType && (
									<Fragment>
										<KadenceMediaPlaceholder
											labels={ '' }
											selectIcon={ plusCircleFilled }
											selectLabel={ __( 'Select Image', 'kadence-blocks' ) }
											onSelect={ onSelectImage }
											accept="image/*"
											className={ 'kadence-image-upload' }
											allowedTypes={ ALLOWED_MEDIA_TYPES }
											disableMediaButtons={ false }
										/>
									</Fragment>
								) }
								{ mediaImage[ 0 ].url && 'image' === mediaType && (
									<div className="kadence-info-box-image-inner-intrisic-container" style={ {
										maxWidth: mediaImage[ 0 ].maxWidth + 'px',
									} } >
										<div className={ `kadence-info-box-image-intrisic kt-info-animate-${ mediaImage[ 0 ].hoverAnimation }${ ( 'svg+xml' === mediaImage[ 0 ].subtype ? ' kb-info-box-image-type-svg' : '' ) }${ hasRatio ? ' kb-info-box-image-ratio kb-info-box-image-ratio-' + imageRatio : '' }` } style={ {
											paddingBottom: imageRatioPadding,
											height: imageRatioHeight,
											width: isNaN( mediaImage[ 0 ].width ) ? undefined : mediaImage[ 0 ].width + 'px',
											maxWidth: '100%',
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
											<IconRender className={ `kt-info-svg-icon kt-info-svg-icon-${ mediaIcon[ 0 ].icon }` } name={ mediaIcon[ 0 ].icon } size={ previewMediaIconSize } htmltag="span" strokeWidth={ ( 'fe' === mediaIcon[ 0 ].icon.substring( 0, 2 ) ? mediaIcon[ 0 ].width : undefined ) } style={ {
												display: 'block',
												color: ( mediaIcon[ 0 ].color ? KadenceColorOutput( mediaIcon[ 0 ].color ) : undefined ),
											} } />
											{ mediaIcon[ 0 ].flipIcon && 'flip' === mediaIcon[ 0 ].hoverAnimation && (
												<IconRender className={ `kt-info-svg-icon-flip kt-info-svg-icon-${ mediaIcon[ 0 ].flipIcon }` } name={ mediaIcon[ 0 ].flipIcon } size={ previewMediaIconSize } htmltag="span" strokeWidth={ ( 'fe' === mediaIcon[ 0 ].flipIcon.substring( 0, 2 ) ? mediaIcon[ 0 ].width : undefined ) } style={ {
													display: 'block',
													color: ( mediaIcon[ 0 ].hoverColor ? KadenceColorOutput( mediaIcon[ 0 ].hoverColor ) : undefined ),
												} } />
											) }
										</div>
									</div>
								) }
								{ 'number' === mediaType && (
									<div className={ `kadence-info-box-number-container kt-info-number-animate-${ mediaNumber && mediaNumber[ 0 ] && mediaNumber[ 0 ].hoverAnimation ? mediaNumber[ 0 ].hoverAnimation : 'none' }` } >
										<div className={ 'kadence-info-box-number-inner-container' } >
											<RichText
												className="kt-blocks-info-box-number"
												allowedFormats={ ( linkProperty === 'learnmore' ? applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/link', 'toolset/inline-field' ] ) : applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'toolset/inline-field' ] ) ) }
												tagName={ 'div' }
												placeholder={ '1' }
												onChange={ onChangeNumber }
												value={ number }
												style={ {
													fontWeight: mediaNumber[ 0 ].weight,
													fontStyle: mediaNumber[ 0 ].style,
													color: ( mediaIcon[ 0 ].color ? KadenceColorOutput( mediaIcon[ 0 ].color ) : undefined ),
													fontSize: mediaIcon[ 0 ].size + 'px',
													fontFamily: ( mediaNumber[ 0 ].family ? mediaNumber[ 0 ].family : undefined ),
												} }
											/>
										</div>
										{ mediaNumber[ 0 ].google && (
											<WebfontLoader config={ nconfig }>
											</WebfontLoader>
										) }
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
								allowedFormats={ ( linkProperty === 'learnmore' ? applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/link', 'toolset/inline-field' ] ) : applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'toolset/inline-field' ] ) ) }
								tagName={ titleTagName }
								placeholder={ __( 'Title', 'kadence-blocks' ) }
								onChange={ onChangeTitle }
								value={ title }
								style={ {
									fontWeight: titleFont[ 0 ].weight,
									fontStyle: titleFont[ 0 ].style,
									textTransform: titleFont[ 0 ].textTransform ? titleFont[ 0 ].textTransform : undefined,
									color: KadenceColorOutput( titleColor ),
									fontSize: previewTitleFontSize + titleFont[ 0 ].sizeType,
									lineHeight: previewTitleLineHeight + titleFont[ 0 ].lineType,
									letterSpacing: titleFont[ 0 ].letterSpacing + 'px',
									fontFamily: ( titleFont[ 0 ].family ? titleFont[ 0 ].family : '' ),
									padding: ( titleFont[ 0 ].padding ? titleFont[ 0 ].padding[ 0 ] + 'px ' + titleFont[ 0 ].padding[ 1 ] + 'px ' + titleFont[ 0 ].padding[ 2 ] + 'px ' + titleFont[ 0 ].padding[ 3 ] + 'px' : '' ),
									margin: ( titleFont[ 0 ].margin ? titleFont[ 0 ].margin[ 0 ] + 'px ' + titleFont[ 0 ].margin[ 1 ] + 'px ' + titleFont[ 0 ].margin[ 2 ] + 'px ' + titleFont[ 0 ].margin[ 3 ] + 'px' : '' ),
									minHeight: previewTitleMinHeight + 'px',
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
								allowedFormats={ ( linkProperty === 'learnmore' ? applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/link', 'toolset/inline-field' ] ) : applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'toolset/inline-field' ] ) ) }
								tagName={ 'p' }
								placeholder={ __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean diam dolor, accumsan sed rutrum vel, dapibus et leo.', 'kadence-blocks' ) }
								onChange={ ( value ) => setAttributes( { contentText: value } ) }
								value={ contentText }
								style={ {
									fontWeight: textFont[ 0 ].weight,
									fontStyle: textFont[ 0 ].style,
									color: KadenceColorOutput( textColor ),
									fontSize: previewTextFontSize + textFont[ 0 ].sizeType,
									lineHeight: previewTextLineHeight + textFont[ 0 ].lineType,
									letterSpacing: textFont[ 0 ].letterSpacing + 'px',
									textTransform: ( undefined !== textFont[ 0 ].textTransform  && textFont[ 0 ].textTransform ) ? textFont[ 0 ].textTransform : undefined,
									fontFamily: ( textFont[ 0 ].family ? textFont[ 0 ].family : '' ),
									padding: ( undefined !== textSpacing && undefined !== textSpacing[ 0 ] && textSpacing[ 0 ].padding ? textSpacing[ 0 ].padding[ 0 ] + 'px ' + textSpacing[ 0 ].padding[ 1 ] + 'px ' + textSpacing[ 0 ].padding[ 2 ] + 'px ' + textSpacing[ 0 ].padding[ 3 ] + 'px' : '' ),
									margin: ( undefined !== textSpacing && undefined !== textSpacing[ 0 ] && textSpacing[ 0 ].margin ? textSpacing[ 0 ].margin[ 0 ] + 'px ' + textSpacing[ 0 ].margin[ 1 ] + 'px ' + textSpacing[ 0 ].margin[ 2 ] + 'px ' + textSpacing[ 0 ].margin[ 3 ] + 'px' : '' ),
									minHeight: previewTextMinHeight + 'px',
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
									allowedFormats={ applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'toolset/inline-field' ] ) }
									className="kt-blocks-info-box-learnmore"
									tagName={ 'div' }
									placeholder={ __( 'Learn More', 'kadence-blocks' ) }
									onChange={ value => setAttributes( { learnMore: value } ) }
									value={ learnMore }
									style={ {
										fontWeight: learnMoreStyles[ 0 ].weight,
										fontStyle: learnMoreStyles[ 0 ].style,
										color: KadenceColorOutput( learnMoreStyles[ 0 ].color ),
										borderRadius: learnMoreStyles[ 0 ].borderRadius + 'px',
										background: KadenceColorOutput( learnMoreStyles[ 0 ].background ),
										borderColor: KadenceColorOutput( learnMoreStyles[ 0 ].border ),
										fontSize: previewLearnMoreFontSize + learnMoreStyles[ 0 ].sizeType,
										lineHeight:  previewLearnMoreLineHeight + learnMoreStyles[ 0 ].lineType,
										letterSpacing: learnMoreStyles[ 0 ].letterSpacing + 'px',
										textTransform: ( undefined !== learnMoreStyles[ 0 ].textTransform  && learnMoreStyles[ 0 ].textTransform ) ? learnMoreStyles[ 0 ].textTransform : undefined,
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
export default compose( [
	withSelect( ( select, ownProps ) => {
		return {
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
] )( KadenceInfoBox );
