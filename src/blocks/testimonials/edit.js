/**
 * BLOCK: Kadence Split Content
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
/**
 * Import External
 */
import Slider from 'react-slick';
import map from 'lodash/map';
import times from 'lodash/times';
/**
 * Import Components
 */
import TypographyControls from '../../components/typography/typography-control';
import MeasurementControls from '../../measurement-control';
import WebfontLoader from '../../components/typography/fontloader';
import IconControl from '../../components/icons/icon-control';
import IconRender from '../../components/icons/icon-render';
import KadenceMediaPlaceholder from '../../kadence-media-placeholder';
import PopColorControl from '../../components/color/pop-color-control';
import KadenceColorOutput from '../../components/color/kadence-color-output';
import ResponsiveRangeControls from '../../components/range/responsive-range-control';
import ResponsiveMeasuremenuControls from '../../components/measurement/responsive-measurement-control';
import KadencePanelBody from '../../components/KadencePanelBody';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	MediaUpload,
	RichText,
	AlignmentToolbar,
	InspectorControls,
	BlockControls,
} = wp.blockEditor;
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
const {
	Button,
	ButtonGroup,
	Dashicon,
	RangeControl,
	ToggleControl,
	SelectControl,
	Tooltip,
} = wp.components;

import {
	closeSmall,
	image,
} from '@wordpress/icons';
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktTestimonialsUniqueIDs = [];
/**
 * Build the overlay edit
 */
class KadenceTestimonials extends Component {
	constructor() {
		super( ...arguments );
		this.onMove = this.onMove.bind( this );
		this.onMoveForward = this.onMoveForward.bind( this );
		this.onMoveBackward = this.onMoveBackward.bind( this );
		this.showSettings = this.showSettings.bind( this );
		this.getPreviewSize = this.getPreviewSize.bind( this );
		this.state = {
			containerPaddingControl: 'linked',
			tabletContainerPaddingControl: 'linked',
			mobileContainerPaddingControl: 'linked',
			containerBorderControl: 'linked',
			mediaBorderControl: 'linked',
			mediaPaddingControl: 'linked',
			mediaMarginControl: 'linked',
			titlePaddingControl: 'linked',
			titleMarginControl: 'individual',
			ratingMarginControl: 'individual',
			iconBorderControl: 'linked',
			iconMarginControl: 'linked',
			iconPaddingControl: 'linked',
			showPreset: false,
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/testimonials' ] !== undefined && typeof blockConfigObject[ 'kadence/testimonials' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/testimonials' ] ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/testimonials' ][ attribute ];
				} );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			if ( this.props.attributes.showPresets ) {
				this.setState( { showPreset: true } );
			}
			ktTestimonialsUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( ktTestimonialsUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.attributes.uniqueID = '_' + this.props.clientId.substr( 2, 9 );
			ktTestimonialsUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			ktTestimonialsUniqueIDs.push( this.props.attributes.uniqueID );
		}
		if ( this.props.attributes.mediaStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.mediaStyles[ 0 ].borderWidth[ 1 ] && this.props.attributes.mediaStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.mediaStyles[ 0 ].borderWidth[ 2 ] && this.props.attributes.mediaStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.mediaStyles[ 0 ].borderWidth[ 3 ] ) {
			this.setState( { mediaBorderControl: 'linked' } );
		} else {
			this.setState( { mediaBorderControl: 'individual' } );
		}
		if ( this.props.attributes.mediaStyles[ 0 ].padding[ 0 ] === this.props.attributes.mediaStyles[ 0 ].padding[ 1 ] && this.props.attributes.mediaStyles[ 0 ].padding[ 0 ] === this.props.attributes.mediaStyles[ 0 ].padding[ 2 ] && this.props.attributes.mediaStyles[ 0 ].padding[ 0 ] === this.props.attributes.mediaStyles[ 0 ].padding[ 3 ] ) {
			this.setState( { mediaPaddingControl: 'linked' } );
		} else {
			this.setState( { mediaPaddingControl: 'individual' } );
		}
		if ( this.props.attributes.mediaStyles[ 0 ].margin[ 0 ] === this.props.attributes.mediaStyles[ 0 ].margin[ 1 ] && this.props.attributes.mediaStyles[ 0 ].margin[ 0 ] === this.props.attributes.mediaStyles[ 0 ].margin[ 2 ] && this.props.attributes.mediaStyles[ 0 ].margin[ 0 ] === this.props.attributes.mediaStyles[ 0 ].margin[ 3 ] ) {
			this.setState( { mediaMarginControl: 'linked' } );
		} else {
			this.setState( { mediaMarginControl: 'individual' } );
		}
		if ( this.props.attributes.titleFont[ 0 ].padding[ 0 ] === this.props.attributes.titleFont[ 0 ].padding[ 1 ] && this.props.attributes.titleFont[ 0 ].padding[ 0 ] === this.props.attributes.titleFont[ 0 ].padding[ 2 ] && this.props.attributes.titleFont[ 0 ].padding[ 0 ] === this.props.attributes.titleFont[ 0 ].padding[ 3 ] ) {
			this.setState( { titlePaddingControl: 'linked' } );
		} else {
			this.setState( { titlePaddingControl: 'individual' } );
		}
		if ( this.props.attributes.titleFont[ 0 ].margin[ 0 ] === this.props.attributes.titleFont[ 0 ].margin[ 1 ] && this.props.attributes.titleFont[ 0 ].margin[ 0 ] === this.props.attributes.titleFont[ 0 ].margin[ 2 ] && this.props.attributes.titleFont[ 0 ].margin[ 0 ] === this.props.attributes.titleFont[ 0 ].margin[ 3 ] ) {
			this.setState( { titleMarginControl: 'linked' } );
		} else {
			this.setState( { titleMarginControl: 'individual' } );
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
		if ( this.props.attributes.tabletContainerPadding[ 0 ] === this.props.attributes.tabletContainerPadding[ 1 ] && this.props.attributes.tabletContainerPadding[ 0 ] === this.props.attributes.tabletContainerPadding[ 2 ] && this.props.attributes.tabletContainerPadding[ 0 ] === this.props.attributes.tabletContainerPadding[ 3 ] ) {
			this.setState( { tabletContainerPaddingControl: 'linked' } );
		} else {
			this.setState( { tabletContainerPaddingControl: 'individual' } );
		}
		if ( this.props.attributes.mobileContainerPadding[ 0 ] === this.props.attributes.mobileContainerPadding[ 1 ] && this.props.attributes.mobileContainerPadding[ 0 ] === this.props.attributes.mobileContainerPadding[ 2 ] && this.props.attributes.mobileContainerPadding[ 0 ] === this.props.attributes.mobileContainerPadding[ 3 ] ) {
			this.setState( { mobileContainerPaddingControl: 'linked' } );
		} else {
			this.setState( { mobileContainerPaddingControl: 'individual' } );
		}
		if ( this.props.attributes.ratingStyles[ 0 ] && this.props.attributes.ratingStyles[ 0 ].margin && this.props.attributes.ratingStyles[ 0 ].margin[ 0 ] === this.props.attributes.ratingStyles[ 0 ].margin[ 1 ] && this.props.attributes.ratingStyles[ 0 ].margin[ 0 ] === this.props.attributes.ratingStyles[ 0 ].margin[ 2 ] && this.props.attributes.ratingStyles[ 0 ].margin[ 0 ] === this.props.attributes.ratingStyles[ 0 ].margin[ 3 ] ) {
			this.setState( { ratingMarginControl: 'linked' } );
		} else {
			this.setState( { ratingMarginControl: 'individual' } );
		}
		if ( undefined !== this.props.attributes.iconStyles[ 0 ].borderWidth && undefined !== this.props.attributes.iconStyles[ 0 ].borderWidth[ 0 ] && this.props.attributes.iconStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.iconStyles[ 0 ].borderWidth[ 1 ] && this.props.attributes.iconStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.iconStyles[ 0 ].borderWidth[ 2 ] && this.props.attributes.iconStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.iconStyles[ 0 ].borderWidth[ 3 ] ) {
			this.setState( { iconBorderControl: 'linked' } );
		} else {
			this.setState( { iconBorderControl: 'individual' } );
		}
		if ( undefined !== this.props.attributes.iconStyles[ 0 ].padding && undefined !== this.props.attributes.iconStyles[ 0 ].padding[ 0 ] && this.props.attributes.iconStyles[ 0 ].padding[ 0 ] === this.props.attributes.iconStyles[ 0 ].padding[ 1 ] && this.props.attributes.iconStyles[ 0 ].padding[ 0 ] === this.props.attributes.iconStyles[ 0 ].padding[ 2 ] && this.props.attributes.iconStyles[ 0 ].padding[ 0 ] === this.props.attributes.iconStyles[ 0 ].padding[ 3 ] ) {
			this.setState( { iconPaddingControl: 'linked' } );
		} else {
			this.setState( { iconPaddingControl: 'individual' } );
		}
		if ( this.props.attributes.iconStyles[ 0 ].margin[ 0 ] === this.props.attributes.iconStyles[ 0 ].margin[ 1 ] && this.props.attributes.iconStyles[ 0 ].margin[ 0 ] === this.props.attributes.iconStyles[ 0 ].margin[ 2 ] && this.props.attributes.iconStyles[ 0 ].margin[ 0 ] === this.props.attributes.iconStyles[ 0 ].margin[ 3 ] ) {
			this.setState( { iconMarginControl: 'linked' } );
		} else {
			this.setState( { iconMarginControl: 'individual' } );
		}
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/testimonials' ] !== undefined && typeof blockSettings[ 'kadence/testimonials' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/testimonials' ] } );
		}
		if ( this.props.context && this.props.context.queryId && this.props.context.postId ) {
			if ( this.props.context.queryId !== this.props.attributes.inQueryBlock ) {
				this.props.setAttributes( {
					inQueryBlock: this.props.context.queryId,
				} );
			}
		} else if ( this.props.attributes.inQueryBlock ) {
			this.props.setAttributes( {
				inQueryBlock: false,
			} );
		}
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
	onMove( oldIndex, newIndex ) {
		const testimonials = [ ...this.props.attributes.testimonials ];
		testimonials.splice( newIndex, 1, this.props.attributes.testimonials[ oldIndex ] );
		testimonials.splice( oldIndex, 1, this.props.attributes.testimonials[ newIndex ] );
		this.props.setAttributes( { testimonials } );
	}

	onMoveForward( oldIndex ) {
		return () => {
			if ( oldIndex === this.props.attributes.testimonials.length - 1 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex + 1 );
		};
	}

	onMoveBackward( oldIndex ) {
		return () => {
			if ( oldIndex === 0 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex - 1 );
		};
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
		const { attributes: { uniqueID, testimonials, style, hAlign, layout, itemsCount, containerBackground, containerBorder, containerBorderWidth, containerBorderRadius, containerPadding, tabletContainerPadding, mobileContainerPadding, containerPaddingType, mediaStyles, displayTitle, titleFont, titleMinHeight, containerMinHeight, containerVAlign, contentMinHeight, displayContent, contentFont, displayName, displayMedia, nameFont, displayShadow, shadow, displayRating, ratingStyles, displayOccupation, occupationFont, containerBackgroundOpacity, containerBorderOpacity, containerMaxWidth, columnGap, autoPlay, autoSpeed, transSpeed, slidesScroll, arrowStyle, dotStyle, columns, columnControl, displayIcon, iconStyles, wrapperPaddingType, wrapperPadding, wrapperTabletPadding, wrapperMobilePadding }, setAttributes, isSelected } = this.props;
		const { containerBorderControl, mediaBorderControl, mediaPaddingControl, mediaMarginControl, containerPaddingControl, tabletContainerPaddingControl, mobileContainerPaddingControl, titlePaddingControl, titleMarginControl, ratingMarginControl, iconBorderControl, iconPaddingControl, iconMarginControl } = this.state;
		const onColumnChange = ( value ) => {
			let columnarray = [];
			if ( 1 === value ) {
				columnarray = [ 1, 1, 1, 1, 1, 1 ];
			} else if ( 2 === value ) {
				columnarray = [ 2, 2, 2, 2, 1, 1 ];
			} else if ( 3 === value ) {
				columnarray = [ 3, 3, 3, 2, 1, 1 ];
			} else if ( 4 === value ) {
				columnarray = [ 4, 4, 4, 3, 2, 2 ];
			} else if ( 5 === value ) {
				columnarray = [ 5, 5, 5, 4, 4, 3 ];
			}
			setAttributes( { columns: columnarray } );
		};
		const setInitalLayout = ( key ) => {
			if ( 'skip' === key ) {
			} else if ( 'basic' === key ) {
				setAttributes( { style: 'basic' } );
			} else if ( 'card' === key ) {
				setAttributes( { style: 'card' } );
			} else if ( 'bubble' === key ) {
				setAttributes( { style: 'bubble' } );
			} else if ( 'inlineimage' === key ) {
				setAttributes( { style: 'inlineimage' } );
			}
		};
		const styleOptions = [
			{ key: 'basic', name: __( 'Basic', 'kadence-blocks' ), icon: icons.testimonialBasic },
			{ key: 'card', name: __( 'Card', 'kadence-blocks' ), icon: icons.testimonialCard },
			{ key: 'bubble', name: __( 'Bubble', 'kadence-blocks' ), icon: icons.testimonialBubble },
			{ key: 'inlineimage', name: __( 'Image In Content', 'kadence-blocks' ), icon: icons.testimonialInline },
		];
		const startlayoutOptions = [
			{ key: 'skip', name: __( 'Skip', 'kadence-blocks' ), icon: __( 'Skip' ) },
			{ key: 'basic', name: __( 'Basic', 'kadence-blocks' ), icon: icons.testimonialBasic },
			{ key: 'card', name: __( 'Card', 'kadence-blocks' ), icon: icons.testimonialCard },
			{ key: 'bubble', name: __( 'Bubble', 'kadence-blocks' ), icon: icons.testimonialBubble },
			{ key: 'inlineimage', name: __( 'Image In Content', 'kadence-blocks' ), icon: icons.testimonialInline },
		];
		const columnControlTypes = [
			{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: __( 'Linked', 'kadence-blocks' ) },
			{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: __( 'Individual', 'kadence-blocks' ) },
		];
		const VAlignOptions = [
			{ key: 'top', name: __( 'Top', 'kadence-blocks' ), icon: icons.aligntop },
			{ key: 'middle', name: __( 'Middle', 'kadence-blocks' ), icon: icons.alignmiddle },
			{ key: 'bottom', name: __( 'Bottom', 'kadence-blocks' ), icon: icons.alignbottom },
		];
		const paddingMin = ( wrapperPaddingType === 'em' || wrapperPaddingType === 'rem' ? 0 : 0 );
		const paddingMax = ( wrapperPaddingType === 'em' || wrapperPaddingType === 'rem' ? 12 : 200 );
		const paddingStep = ( wrapperPaddingType === 'em' || wrapperPaddingType === 'rem' ? 0.1 : 1 );
		const previewContainerMinHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerMinHeight && undefined !== containerMinHeight[ 0 ] ? containerMinHeight[ 0 ] : '' ), ( undefined !== containerMinHeight && undefined !== containerMinHeight[ 1 ] ? containerMinHeight[ 1 ] : '' ), ( undefined !== containerMinHeight && undefined !== containerMinHeight[ 2 ] ? containerMinHeight[ 2 ] : '' ) );
		const previewTitleMinHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ? titleMinHeight[ 0 ] : '' ), ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 1 ] ? titleMinHeight[ 1 ] : '' ), ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 2 ] ? titleMinHeight[ 2 ] : '' ) );
		const previewContentMinHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== contentMinHeight && undefined !== contentMinHeight[ 0 ] ? contentMinHeight[ 0 ] : '' ), ( undefined !== contentMinHeight && undefined !== contentMinHeight[ 1 ] ? contentMinHeight[ 1 ] : '' ), ( undefined !== contentMinHeight && undefined !== contentMinHeight[ 2 ] ? contentMinHeight[ 2 ] : '' ) );
		const previewWrapperPaddingTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== wrapperPadding && undefined !== wrapperPadding[ 0 ] ? wrapperPadding[ 0 ] : '' ), ( undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[ 0 ] ? wrapperTabletPadding[ 0 ] : '' ), ( undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[ 0 ] ? wrapperMobilePadding[ 0 ] : '' ) );
		const previewWrapperPaddingRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== wrapperPadding && undefined !== wrapperPadding[ 1 ] ? wrapperPadding[ 1 ] : '' ), ( undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[ 1 ] ? wrapperTabletPadding[ 1 ] : '' ), ( undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[ 1 ] ? wrapperMobilePadding[ 1 ] : '' ) );
		const previewWrapperPaddingBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== wrapperPadding && undefined !== wrapperPadding[ 2 ] ? wrapperPadding[ 2 ] : '' ), ( undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[ 2 ] ? wrapperTabletPadding[ 2 ] : '' ), ( undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[ 2 ] ? wrapperMobilePadding[ 2 ] : '' ) );
		const previewWrapperPaddingLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== wrapperPadding && undefined !== wrapperPadding[ 3 ] ? wrapperPadding[ 3 ] : '' ), ( undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding[ 3 ] ? wrapperTabletPadding[ 3 ] : '' ), ( undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding[ 3 ] ? wrapperMobilePadding[ 3 ] : '' ) );
		const previewContainerPaddingTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerPadding && undefined !== containerPadding[ 0 ] ? containerPadding[ 0 ] : '' ), ( undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[ 0 ] ? tabletContainerPadding[ 0 ] : '' ), ( undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[ 0 ] ? mobileContainerPadding[ 0 ] : '' ) );
		const previewContainerPaddingRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerPadding && undefined !== containerPadding[ 1 ] ? containerPadding[ 1 ] : '' ), ( undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[ 1 ] ? tabletContainerPadding[ 1 ] : '' ), ( undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[ 1 ] ? mobileContainerPadding[ 1 ] : '' ) );
		const previewContainerPaddingBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerPadding && undefined !== containerPadding[ 2 ] ? containerPadding[ 2 ] : '' ), ( undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[ 2 ] ? tabletContainerPadding[ 2 ] : '' ), ( undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[ 2 ] ? mobileContainerPadding[ 2 ] : '' ) );
		const previewContainerPaddingLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerPadding && undefined !== containerPadding[ 3 ] ? containerPadding[ 3 ] : '' ), ( undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[ 3 ] ? tabletContainerPadding[ 3 ] : '' ), ( undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[ 3 ] ? mobileContainerPadding[ 3 ] : '' ) );
		const previewTitleFont = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleFont[ 0 ].size && undefined !== titleFont[ 0 ].size[ 0 ] && '' !== titleFont[ 0 ].size[ 0 ] ? titleFont[ 0 ].size[ 0 ] : '' ), ( undefined !== titleFont[ 0 ].size && undefined !== titleFont[ 0 ].size[ 1 ] && '' !== titleFont[ 0 ].size[ 1 ] ? titleFont[ 0 ].size[ 1 ] : '' ), ( undefined !== titleFont[ 0 ].size && undefined !== titleFont[ 0 ].size[ 2 ] && '' !== titleFont[ 0 ].size[ 2 ] ? titleFont[ 0 ].size[ 2 ] : '' ) );
		const previewTitleLineHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleFont[ 0 ].lineHeight && undefined !== titleFont[ 0 ].lineHeight[ 0 ] && '' !== titleFont[ 0 ].lineHeight[ 0 ] ? titleFont[ 0 ].lineHeight[ 0 ] : '' ), ( undefined !== titleFont[ 0 ].lineHeight && undefined !== titleFont[ 0 ].lineHeight[ 1 ] && '' !== titleFont[ 0 ].lineHeight[ 1 ] ? titleFont[ 0 ].lineHeight[ 1 ] : '' ), ( undefined !== titleFont[ 0 ].lineHeight && undefined !== titleFont[ 0 ].lineHeight[ 2 ] && '' !== titleFont[ 0 ].lineHeight[ 2 ] ? titleFont[ 0 ].lineHeight[ 2 ] : '' ) );

		const previewContentFont = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== contentFont[ 0 ].size && undefined !== contentFont[ 0 ].size[ 0 ] && '' !== contentFont[ 0 ].size[ 0 ] ? contentFont[ 0 ].size[ 0 ] : '' ), ( undefined !== contentFont[ 0 ].size && undefined !== contentFont[ 0 ].size[ 1 ] && '' !== contentFont[ 0 ].size[ 1 ] ? contentFont[ 0 ].size[ 1 ] : '' ), ( undefined !== contentFont[ 0 ].size && undefined !== contentFont[ 0 ].size[ 2 ] && '' !== contentFont[ 0 ].size[ 2 ] ? contentFont[ 0 ].size[ 2 ] : '' ) );
		const previewContentLineHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== contentFont[ 0 ].lineHeight && undefined !== contentFont[ 0 ].lineHeight[ 0 ] && '' !== contentFont[ 0 ].lineHeight[ 0 ] ? contentFont[ 0 ].lineHeight[ 0 ] : '' ), ( undefined !== contentFont[ 0 ].lineHeight && undefined !== contentFont[ 0 ].lineHeight[ 1 ] && '' !== contentFont[ 0 ].lineHeight[ 1 ] ? contentFont[ 0 ].lineHeight[ 1 ] : '' ), ( undefined !== contentFont[ 0 ].lineHeight && undefined !== contentFont[ 0 ].lineHeight[ 2 ] && '' !== contentFont[ 0 ].lineHeight[ 2 ] ? contentFont[ 0 ].lineHeight[ 2 ] : '' ) );

		const previewNameFont = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== nameFont[ 0 ].size && undefined !== nameFont[ 0 ].size[ 0 ] && '' !== nameFont[ 0 ].size[ 0 ] ? nameFont[ 0 ].size[ 0 ] : '' ), ( undefined !== nameFont[ 0 ].size && undefined !== nameFont[ 0 ].size[ 1 ] && '' !== nameFont[ 0 ].size[ 1 ] ? nameFont[ 0 ].size[ 1 ] : '' ), ( undefined !== nameFont[ 0 ].size && undefined !== nameFont[ 0 ].size[ 2 ] && '' !== nameFont[ 0 ].size[ 2 ] ? nameFont[ 0 ].size[ 2 ] : '' ) );
		const previewNameLineHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== nameFont[ 0 ].lineHeight && undefined !== nameFont[ 0 ].lineHeight[ 0 ] && '' !== nameFont[ 0 ].lineHeight[ 0 ] ? nameFont[ 0 ].lineHeight[ 0 ] : '' ), ( undefined !== nameFont[ 0 ].lineHeight && undefined !== nameFont[ 0 ].lineHeight[ 1 ] && '' !== nameFont[ 0 ].lineHeight[ 1 ] ? nameFont[ 0 ].lineHeight[ 1 ] : '' ), ( undefined !== nameFont[ 0 ].lineHeight && undefined !== nameFont[ 0 ].lineHeight[ 2 ] && '' !== nameFont[ 0 ].lineHeight[ 2 ] ? nameFont[ 0 ].lineHeight[ 2 ] : '' ) );

		const previewOccupationFont = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== occupationFont[ 0 ].size && undefined !== occupationFont[ 0 ].size[ 0 ] && '' !== occupationFont[ 0 ].size[ 0 ] ? occupationFont[ 0 ].size[ 0 ] : '' ), ( undefined !== occupationFont[ 0 ].size && undefined !== occupationFont[ 0 ].size[ 1 ] && '' !== occupationFont[ 0 ].size[ 1 ] ? occupationFont[ 0 ].size[ 1 ] : '' ), ( undefined !== occupationFont[ 0 ].size && undefined !== occupationFont[ 0 ].size[ 2 ] && '' !== occupationFont[ 0 ].size[ 2 ] ? occupationFont[ 0 ].size[ 2 ] : '' ) );
		const previewOccupationLineHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== occupationFont[ 0 ].lineHeight && undefined !== occupationFont[ 0 ].lineHeight[ 0 ] && '' !== occupationFont[ 0 ].lineHeight[ 0 ] ? occupationFont[ 0 ].lineHeight[ 0 ] : '' ), ( undefined !== occupationFont[ 0 ].lineHeight && undefined !== occupationFont[ 0 ].lineHeight[ 1 ] && '' !== occupationFont[ 0 ].lineHeight[ 1 ] ? occupationFont[ 0 ].lineHeight[ 1 ] : '' ), ( undefined !== occupationFont[ 0 ].lineHeight && undefined !== occupationFont[ 0 ].lineHeight[ 2 ] && '' !== occupationFont[ 0 ].lineHeight[ 2 ] ? occupationFont[ 0 ].lineHeight[ 2 ] : '' ) );

		const columnControls = (
			<Fragment>
				<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Column Control Type', 'kadence-blocks' ) }>
					{ map( columnControlTypes, ( { name, key, icon } ) => (
						<Tooltip text={ name }>
							<Button
								key={ key }
								className="kt-size-btn"
								isSmall
								isPrimary={ columnControl === key }
								aria-pressed={ columnControl === key }
								onClick={ () => setAttributes( { columnControl: key } ) }
							>
								{ icon }
							</Button>
						</Tooltip>
					) ) }
				</ButtonGroup>
				{ columnControl && columnControl !== 'individual' && (
					<RangeControl
						label={ __( 'Columns', 'kadence-blocks' ) }
						value={ columns[ 2 ] }
						onChange={ onColumnChange }
						min={ 1 }
						max={ 5 }
					/>
				) }
				{ columnControl && columnControl === 'individual' && (
					<Fragment>
						<h4>{ __( 'Columns', 'kadence-blocks' ) }</h4>
						<RangeControl
							label={ __( 'Screen Above 1500px', 'kadence-blocks' ) }
							value={ columns[ 0 ] }
							onChange={ ( value ) => setAttributes( { columns: [ value, columns[ 1 ], columns[ 2 ], columns[ 3 ], columns[ 4 ], columns[ 5 ] ] } ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen 1200px - 1499px', 'kadence-blocks' ) }
							value={ columns[ 1 ] }
							onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], value, columns[ 2 ], columns[ 3 ], columns[ 4 ], columns[ 5 ] ] } ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen 992px - 1199px', 'kadence-blocks' ) }
							value={ columns[ 2 ] }
							onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], value, columns[ 3 ], columns[ 4 ], columns[ 5 ] ] } ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen 768px - 991px', 'kadence-blocks' ) }
							value={ columns[ 3 ] }
							onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], columns[ 2 ], value, columns[ 4 ], columns[ 5 ] ] } ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen 544px - 767px', 'kadence-blocks' ) }
							value={ columns[ 4 ] }
							onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], columns[ 2 ], columns[ 3 ], value, columns[ 5 ] ] } ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen Below 543px', 'kadence-blocks' ) }
							value={ columns[ 5 ] }
							onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], columns[ 2 ], columns[ 3 ], columns[ 4 ], value ] } ) }
							min={ 1 }
							max={ 5 }
						/>
					</Fragment>
				) }
			</Fragment>
		);
		const gconfig = {
			google: {
				families: [ titleFont[ 0 ].family + ( titleFont[ 0 ].variant ? ':' + titleFont[ 0 ].variant : '' ) ],
			},
		};
		const tgconfig = {
			google: {
				families: [ contentFont[ 0 ].family + ( contentFont[ 0 ].variant ? ':' + contentFont[ 0 ].variant : '' ) ],
			},
		};
		const lgconfig = {
			google: {
				families: [ nameFont[ 0 ].family + ( nameFont[ 0 ].variant ? ':' + nameFont[ 0 ].variant : '' ) ],
			},
		};
		const ogconfig = {
			google: {
				families: [ occupationFont[ 0 ].family + ( occupationFont[ 0 ].variant ? ':' + occupationFont[ 0 ].variant : '' ) ],
			},
		};
		const config = ( titleFont[ 0 ].google ? gconfig : '' );
		const tconfig = ( contentFont[ 0 ].google ? tgconfig : '' );
		const lconfig = ( nameFont[ 0 ].google ? lgconfig : '' );
		const oconfig = ( occupationFont[ 0 ].google ? ogconfig : '' );
		const saveTestimonials = ( value, thisIndex ) => {
			const newUpdate = testimonials.map( ( item, index ) => {
				if ( index === thisIndex ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				testimonials: newUpdate,
			} );
		};
		const ALLOWED_MEDIA_TYPES = [ 'image' ];
		function CustomNextArrow( props ) {
			const { className, style, onClick } = props;
			return (
				<button
					className={ className }
					style={ { ...style, display: 'block' } }
					onClick={ onClick }
				>
					<Dashicon icon="arrow-right-alt2" />
				</button>
			);
		}

		function CustomPrevArrow( props ) {
			const { className, style, onClick } = props;
			return (
				<button
					className={ className }
					style={ { ...style, display: 'block' } }
					onClick={ onClick }
				>
					<Dashicon icon="arrow-left-alt2" />
				</button>
			);
		}
		const sliderSettings = {
			dots: ( dotStyle === 'none' ? false : true ),
			arrows: ( arrowStyle === 'none' ? false : true ),
			infinite: true,
			speed: transSpeed,
			draggable: false,
			autoplaySpeed: autoSpeed,
			autoplay: autoPlay,
			slidesToShow: columns[ 0 ],
			slidesToScroll: ( slidesScroll === 'all' ? columns[ 0 ] : 1 ),
			nextArrow: <CustomNextArrow />,
			prevArrow: <CustomPrevArrow />,
		};
		const savemediaStyles = ( value ) => {
			const newUpdate = mediaStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				mediaStyles: newUpdate,
			} );
		};
		const saveIconStyles = ( value ) => {
			const newUpdate = iconStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				iconStyles: newUpdate,
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
		const saveContentFont = ( value ) => {
			const newUpdate = contentFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				contentFont: newUpdate,
			} );
		};
		const saveNameFont = ( value ) => {
			const newUpdate = nameFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				nameFont: newUpdate,
			} );
		};
		const saveOccupationFont = ( value ) => {
			const newUpdate = occupationFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				occupationFont: newUpdate,
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
		const saveRatingStyles = ( value ) => {
			const newUpdate = ratingStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				ratingStyles: newUpdate,
			} );
		};
		const renderTestimonialSettings = ( index ) => {
			return (
				<KadencePanelBody
					title={ __( 'Testimonial', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings', 'kadence-blocks' ) }
					initialOpen={ ( 1 === itemsCount ? true : false ) }
					panelName={ 'kb-testimonials-' + index }
				>
					<SelectControl
						label={ __( 'Media Type', 'kadence-blocks' ) }
						value={ testimonials[ index ].media }
						options={ [
							{ value: 'image', label: __( 'Image', 'kadence-blocks' ) },
							{ value: 'icon', label: __( 'Icon', 'kadence-blocks' ) },
						] }
						onChange={ value => saveTestimonials( { media: value }, index ) }
					/>
					{ 'icon' === testimonials[ index ].media && (
						<Fragment>
							<IconControl
								value={ testimonials[ index ].icon }
								onChange={ value => {
									saveTestimonials( { icon: value }, index );
								} }
							/>
							<RangeControl
								label={ __( 'Icon Size', 'kadence-blocks' ) }
								value={ testimonials[ index ].isize }
								onChange={ value => {
									saveTestimonials( { isize: value }, index );
								} }
								min={ 5 }
								max={ 250 }
							/>
							{ testimonials[ index ].icon && 'fe' === testimonials[ index ].icon.substring( 0, 2 ) && (
								<RangeControl
									label={ __( 'Line Width', 'kadence-blocks' ) }
									value={ testimonials[ index ].istroke }
									onChange={ value => {
										saveTestimonials( { istroke: value }, index );
									} }
									step={ 0.5 }
									min={ 0.5 }
									max={ 4 }
								/>
							) }
							<PopColorControl
								label={ __( 'Icon Color', 'kadence-blocks' ) }
								value={ ( testimonials[ index ].color ? testimonials[ index ].color : '#555555' ) }
								default={ '#555555' }
								onChange={ ( value ) => saveTestimonials( { color: value }, index ) }
							/>
						</Fragment>
					) }
					<RangeControl
						label={ __( 'Rating', 'kadence-blocks' ) }
						value={ testimonials[ index ].rating }
						onChange={ value => {
							saveTestimonials( { rating: value }, index );
						} }
						step={ 1 }
						min={ 1 }
						max={ 5 }
					/>
				</KadencePanelBody>
			);
		};
		const renderSettings = (
			<div>
				{ times( itemsCount, n => renderTestimonialSettings( n ) ) }
			</div>
		);
		const renderTestimonialIcon = ( index ) => {
			return (
				<div className="kt-svg-testimonial-global-icon-wrap" style={ {
					margin: ( iconStyles[ 0 ].margin ? iconStyles[ 0 ].margin[ 0 ] + 'px ' + iconStyles[ 0 ].margin[ 1 ] + 'px ' + iconStyles[ 0 ].margin[ 2 ] + 'px ' + iconStyles[ 0 ].margin[ 3 ] + 'px' : '' ),
				} } >
					<IconRender className={ `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${ iconStyles[ 0 ].icon }` } name={ iconStyles[ 0 ].icon } size={ iconStyles[ 0 ].size } title={ ( iconStyles[ 0 ].title ? iconStyles[ 0 ].title : '' ) } strokeWidth={ ( 'fe' === iconStyles[ 0 ].icon.substring( 0, 2 ) ? iconStyles[ 0 ].stroke : undefined ) } style={ {
						color: ( iconStyles[ 0 ].color ? KadenceColorOutput( iconStyles[ 0 ].color ) : undefined ),
						borderRadius: iconStyles[ 0 ].borderRadius + 'px',
						borderTopWidth: ( iconStyles[ 0 ].borderWidth && undefined !== iconStyles[ 0 ].borderWidth[ 0 ] ? iconStyles[ 0 ].borderWidth[ 0 ] + 'px' : undefined ),
						borderRightWidth: ( iconStyles[ 0 ].borderWidth && undefined !== iconStyles[ 0 ].borderWidth[ 1 ] ? iconStyles[ 0 ].borderWidth[ 1 ] + 'px' : undefined ),
						borderBottomWidth: ( iconStyles[ 0 ].borderWidth && undefined !== iconStyles[ 0 ].borderWidth[ 2 ] ? iconStyles[ 0 ].borderWidth[ 2 ] + 'px' : undefined ),
						borderLeftWidth: ( iconStyles[ 0 ].borderWidth && undefined !== iconStyles[ 0 ].borderWidth[ 3 ] ? iconStyles[ 0 ].borderWidth[ 3 ] + 'px' : undefined ),
						background: ( iconStyles[ 0 ].background ? KadenceColorOutput( iconStyles[ 0 ].background, ( undefined !== iconStyles[ 0 ].backgroundOpacity ? iconStyles[ 0 ].backgroundOpacity : 1 ) ) : undefined ),
						borderColor: ( iconStyles[ 0 ].border ? KadenceColorOutput( iconStyles[ 0 ].border, ( undefined !== iconStyles[ 0 ].borderOpacity ? iconStyles[ 0 ].borderOpacity : 1 ) ) : undefined ),
						padding: ( iconStyles[ 0 ].padding ? iconStyles[ 0 ].padding[ 0 ] + 'px ' + iconStyles[ 0 ].padding[ 1 ] + 'px ' + iconStyles[ 0 ].padding[ 2 ] + 'px ' + iconStyles[ 0 ].padding[ 3 ] + 'px' : '' ),
					} } />
				</div>
			);
		};
		const renderTestimonialMedia = ( index ) => {
			let urlOutput = testimonials[ index ].url;
			if ( testimonials[ index ].sizes && undefined !== testimonials[ index ].sizes.thumbnail ) {
				if ( ( 'card' === style && containerMaxWidth > 500 ) || mediaStyles[ 0 ].width > 600 ) {
					urlOutput = testimonials[ index ].url;
				} else if ( 'card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100 ) {
					if ( testimonials[ index ].sizes.large && testimonials[ index ].sizes.large.width > 1000 ) {
						urlOutput = testimonials[ index ].sizes.large.url;
					}
				} else if ( 'card' === style && containerMaxWidth <= 100 ) {
					if ( testimonials[ index ].sizes.medium && testimonials[ index ].sizes.medium.width > 200 ) {
						urlOutput = testimonials[ index ].sizes.medium.url;
					} else if ( testimonials[ index ].sizes.large && testimonials[ index ].sizes.large.width > 200 ) {
						urlOutput = testimonials[ index ].sizes.large.url;
					}
				} else if ( mediaStyles[ 0 ].width <= 600 && mediaStyles[ 0 ].width > 100 ) {
					if ( testimonials[ index ].sizes.large && testimonials[ index ].sizes.large.width > 1000 ) {
						urlOutput = testimonials[ index ].sizes.large.url;
					}
				} else if ( mediaStyles[ 0 ].width <= 100 && mediaStyles[ 0 ].width > 75 ) {
					if ( testimonials[ index ].sizes.medium && testimonials[ index ].sizes.medium.width > 200 ) {
						urlOutput = testimonials[ index ].sizes.medium.url;
					} else if ( testimonials[ index ].sizes.large && testimonials[ index ].sizes.large.width > 200 ) {
						urlOutput = testimonials[ index ].sizes.large.url;
					}
				} else if ( mediaStyles[ 0 ].width <= 75 ) {
					if ( testimonials[ index ].sizes.thumbnail && testimonials[ index ].sizes.thumbnail.width > 140 ) {
						urlOutput = testimonials[ index ].sizes.thumbnail.url;
					} else if ( testimonials[ index ].sizes.medium && testimonials[ index ].sizes.medium.width > 140 ) {
						urlOutput = testimonials[ index ].sizes.medium.url;
					} else if ( testimonials[ index ].sizes.large && testimonials[ index ].sizes.large.width > 200 ) {
						urlOutput = testimonials[ index ].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div className="kt-testimonial-media-inner-wrap" style={ {
						width: 'card' !== style ? mediaStyles[ 0 ].width + 'px' : undefined,
						borderColor: KadenceColorOutput( mediaStyles[ 0 ].border ),
						backgroundColor: ( mediaStyles[ 0 ].background ? KadenceColorOutput( mediaStyles[ 0 ].background, ( undefined !== mediaStyles[ 0 ].backgroundOpacity ? mediaStyles[ 0 ].backgroundOpacity : 1 ) ) : undefined ),
						borderRadius: mediaStyles[ 0 ].borderRadius + 'px',
						borderWidth: ( mediaStyles[ 0 ].borderWidth ? mediaStyles[ 0 ].borderWidth[ 0 ] + 'px ' + mediaStyles[ 0 ].borderWidth[ 1 ] + 'px ' + mediaStyles[ 0 ].borderWidth[ 2 ] + 'px ' + mediaStyles[ 0 ].borderWidth[ 3 ] + 'px' : '' ),
						padding: ( mediaStyles[ 0 ].padding ? mediaStyles[ 0 ].padding[ 0 ] + 'px ' + mediaStyles[ 0 ].padding[ 1 ] + 'px ' + mediaStyles[ 0 ].padding[ 2 ] + 'px ' + mediaStyles[ 0 ].padding[ 3 ] + 'px' : '' ),
						marginTop: ( mediaStyles[ 0 ].margin && undefined !== mediaStyles[ 0 ].margin[ 0 ] ? mediaStyles[ 0 ].margin[ 0 ] + 'px' : undefined ),
						marginRight: ( mediaStyles[ 0 ].margin && undefined !== mediaStyles[ 0 ].margin[ 1 ] ? mediaStyles[ 0 ].margin[ 1 ] + 'px' : undefined ),
						marginBottom: ( mediaStyles[ 0 ].margin && undefined !== mediaStyles[ 0 ].margin[ 2 ] ? mediaStyles[ 0 ].margin[ 2 ] + 'px' : undefined ),
						marginLeft: ( mediaStyles[ 0 ].margin && undefined !== mediaStyles[ 0 ].margin[ 3 ] ? mediaStyles[ 0 ].margin[ 3 ] + 'px' : undefined ),
					} } >
						<div className={ 'kadence-testimonial-image-intrisic' } style={ {
							paddingBottom: ( 'card' === style && ( undefined !== mediaStyles[ 0 ].ratio || '' !== mediaStyles[ 0 ].ratio ) ? mediaStyles[ 0 ].ratio + '%' : undefined ),
						} }>
							{ 'icon' === testimonials[ index ].media && testimonials[ index ].icon && (
								<IconRender className={ `kt-svg-testimonial-icon kt-svg-testimonial-icon-${ testimonials[ index ].icon }` } name={ testimonials[ index ].icon } size={ testimonials[ index ].isize } title={ ( testimonials[ index ].ititle ? testimonials[ index ].ititle : '' ) } strokeWidth={ ( 'fe' === testimonials[ index ].icon.substring( 0, 2 ) ? testimonials[ index ].istroke : undefined ) } style={ {
									display: 'flex',
									color: ( testimonials[ index ].color ? KadenceColorOutput( testimonials[ index ].color ) : undefined ),
								} } />
							) }
							{ 'icon' !== testimonials[ index ].media && testimonials[ index ].url && (
								<Fragment>
									<MediaUpload
										onSelect={ media => {
											saveTestimonials( {
												id: media.id,
												url: media.url,
												alt: media.alt,
												subtype: media.subtype,
												sizes: media.sizes,
											}, index );
										} }
										type="image"
										value={ ( testimonials[ index ].id ? testimonials[ index ].id : '' ) }
										allowedTypes={ ALLOWED_MEDIA_TYPES }
										render={ ( { open } ) => (
											<Tooltip text={ __( 'Edit Image', 'kadence-blocks' ) }>
												<Button
													style={ {
														backgroundImage: 'url("' + urlOutput + '")',
														backgroundSize: ( 'card' === style ? mediaStyles[ 0 ].backgroundSize : undefined ),
														borderRadius: mediaStyles[ 0 ].borderRadius + 'px',
													} }
													className={ 'kt-testimonial-image' }
													onClick={ open }
												/>
											</Tooltip>
										) }
									/>
									<Button
										label={ __( 'Remove Image', 'kadence-blocks' ) }
										className={ 'kt-remove-img kt-testimonial-remove-image' }
										onClick={ () => {
											saveTestimonials( {
												id: null,
												url: null,
												alt: null,
												subtype: null,
												sizes: null,
											}, index );
										} }
										icon={ closeSmall }
										showTooltip={ true }
									/>
								</Fragment>
							) }
							{ 'icon' !== testimonials[ index ].media && ! testimonials[ index ].url && (
								<Fragment>
									{ 'card' === style && (
										<KadenceMediaPlaceholder
											onSelect={ media => {
												saveTestimonials( {
													id: media.id,
													url: media.url,
													alt: media.alt,
													sizes: media.sizes,
													subtype: media.subtype,
												}, index );
											} }
											value={ '' }
											allowedTypes={ ALLOWED_MEDIA_TYPES }
											onSelectURL={ ( media ) => {
												if ( media !== testimonials[ index ].url ) {
													saveTestimonials( {
														id: null,
														url: media,
														alt: null,
														sizes: null,
														subtype: null,
													}, index );
												}
											} }
											accept="image/*"
											className={ 'kadence-image-upload' }
										/>
									) }
									{ 'card' !== style && (
										<MediaUpload
											onSelect={ media => {
												saveTestimonials( {
													id: media.id,
													url: media.url,
													alt: media.alt,
													sizes: media.sizes,
													subtype: media.subtype,
												}, index );
											} }
											type="image"
											value={ '' }
											allowedTypes={ ALLOWED_MEDIA_TYPES }
											render={ ( { open } ) => (
												<Button
													className="kt-testimonial-image-placeholder"
													aria-label={ __( 'Add Image', 'kadence-blocks' ) }
													icon={ image }
													style={ {
														borderRadius: mediaStyles[ 0 ].borderRadius + 'px',
													} }
													onClick={ open }
												/>
											) }
										/>
									) }
								</Fragment>
							) }
						</div>
					</div>
				</div>
			);
		};
		const containerStyles = {
			boxShadow: ( displayShadow ? shadow[ 0 ].hOffset + 'px ' + shadow[ 0 ].vOffset + 'px ' + shadow[ 0 ].blur + 'px ' + shadow[ 0 ].spread + 'px ' + KadenceColorOutput( ( undefined !== shadow[ 0 ].color && '' !== shadow[ 0 ].color ? shadow[ 0 ].color : '#000000' ), ( shadow[ 0 ].opacity ? shadow[ 0 ].opacity : 0.2 ) ) : undefined ),
			borderColor: ( containerBorder ? KadenceColorOutput( containerBorder, ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) : KadenceColorOutput( '#eeeeee', ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) ),
			background: ( containerBackground ? KadenceColorOutput( containerBackground, ( undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1 ) ) : undefined ),
			borderRadius: ! isNaN( containerBorderRadius ) ? containerBorderRadius + 'px' : undefined,
			borderTopWidth: ( containerBorderWidth && undefined !== containerBorderWidth[ 0 ] ? containerBorderWidth[ 0 ] + 'px' : undefined ),
			borderRightWidth: ( containerBorderWidth && undefined !== containerBorderWidth[ 1 ] ? containerBorderWidth[ 1 ] + 'px' : undefined ),
			borderBottomWidth: ( containerBorderWidth && undefined !== containerBorderWidth[ 2 ] ? containerBorderWidth[ 2 ] + 'px' : undefined ),
			borderLeftWidth: ( containerBorderWidth && undefined !== containerBorderWidth[ 3 ] ? containerBorderWidth[ 3 ] + 'px' : undefined ),
			paddingTop: ( previewContainerPaddingTop ? previewContainerPaddingTop + ( containerPaddingType ? containerPaddingType : 'px' ) : undefined ),
			paddingRight: ( previewContainerPaddingRight ? previewContainerPaddingRight + ( containerPaddingType ? containerPaddingType : 'px' ) : undefined ),
			paddingBottom: ( previewContainerPaddingBottom ? previewContainerPaddingBottom + ( containerPaddingType ? containerPaddingType : 'px' ) : undefined ),
			paddingLeft: ( previewContainerPaddingLeft ? previewContainerPaddingLeft + ( containerPaddingType ? containerPaddingType : 'px' ) : undefined ),
			maxWidth: ( 'bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px' ),
			minHeight: ( 'bubble' === style || 'inlineimage' === style || ! previewContainerMinHeight ? undefined : previewContainerMinHeight + 'px' ),
			marginTop: layout && layout === 'carousel' && previewWrapperPaddingTop ? previewWrapperPaddingTop + ( wrapperPaddingType ? wrapperPaddingType : 'px' ) : undefined,
			marginBottom: layout && layout === 'carousel' && previewWrapperPaddingBottom ? previewWrapperPaddingBottom + ( wrapperPaddingType ? wrapperPaddingType : 'px' ) : undefined,
		};
		const renderTestimonialPreview = ( index, isCarousel = false ) => {
			let iconPadding = ( displayIcon && iconStyles[ 0 ].icon && iconStyles[ 0 ].margin && iconStyles[ 0 ].margin[ 0 ] && ( iconStyles[ 0 ].margin[ 0 ] < 0 ) ? Math.abs( iconStyles[ 0 ].margin[ 0 ] ) + 'px' : undefined );
			if ( iconPadding === undefined && iconStyles[ 0 ].icon && iconStyles[ 0 ].margin && iconStyles[ 0 ].margin[ 0 ] && ( iconStyles[ 0 ].margin[ 0 ] >= 0 ) ) {
				iconPadding = '0px';
			}
			return (
				<div className={ `kt-testimonial-item-wrap kt-testimonial-item-${ index }${ ( containerVAlign ? ' testimonial-valign-' + containerVAlign : '' ) }` } style={ ( 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
					maxWidth: containerMaxWidth + 'px',
					minHeight: ( previewContainerMinHeight ? previewContainerMinHeight + 'px' : undefined ),
					paddingTop: ( iconPadding ? iconPadding : undefined ),
					marginTop: isCarousel && previewWrapperPaddingTop ? previewWrapperPaddingTop + ( wrapperPaddingType ? wrapperPaddingType : 'px' ) : undefined,
					marginBottom: isCarousel && previewWrapperPaddingBottom ? previewWrapperPaddingBottom + ( wrapperPaddingType ? wrapperPaddingType : 'px' ) : undefined,
				} ) }>
					{ itemsCount > 1 && (
						<div className="kt-testimonial-item__move-menu">
							<Button
								icon="arrow-left"
								onClick={ 0 === index ? undefined : this.onMoveBackward( index ) }
								className="kt-testimonial-item__move-backward"
								aria-label={ __( 'Move Testimonial Backward', 'kadence-blocks' ) }
								aria-disabled={ 0 === index }
							/>
							<Button
								icon="arrow-right"
								onClick={ itemsCount === ( index + 1 ) ? undefined : this.onMoveForward( index ) }
								className="kt-testimonial-item__move-forward"
								aria-label={ __( 'Move Testimonial Forward', 'kadence-blocks' ) }
								aria-disabled={ itemsCount === ( index + 1 ) }
							/>
						</div>
					) }
					<div className="kt-testimonial-text-wrap" style={ ( 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined ) }>
						{ displayIcon && iconStyles[ 0 ].icon && 'card' !== style && (
							renderTestimonialIcon( index )
						) }
						{ displayMedia && ( 'card' === style || 'inlineimage' === style ) && (
							renderTestimonialMedia( index )
						) }
						{ displayIcon && iconStyles[ 0 ].icon && 'card' === style && (
							renderTestimonialIcon( index )
						) }
						{ displayTitle && (
							<div className="kt-testimonial-title-wrap" style={ {
								minHeight: ( previewTitleMinHeight ? previewTitleMinHeight + 'px' : undefined ),
							} }>
								<RichText
									tagName={ 'h' + titleFont[ 0 ].level }
									value={ testimonials[ index ].title }
									onChange={ value => {
										saveTestimonials( { title: value }, index );
									} }
									placeholder={ __( 'Best product I have ever used!', 'kadence-blocks' ) }
									style={ {
										fontWeight: titleFont[ 0 ].weight,
										fontStyle: titleFont[ 0 ].style,
										color: KadenceColorOutput( titleFont[ 0 ].color ),
										fontSize: previewTitleFont ? previewTitleFont + titleFont[ 0 ].sizeType : undefined,
										lineHeight: ( previewTitleLineHeight ? previewTitleLineHeight + titleFont[ 0 ].lineType : undefined ),
										letterSpacing: titleFont[ 0 ].letterSpacing + 'px',
										textTransform: ( titleFont[ 0 ].textTransform ? titleFont[ 0 ].textTransform : undefined ),
										fontFamily: ( titleFont[ 0 ].family ? titleFont[ 0 ].family : '' ),
										padding: ( titleFont[ 0 ].padding ? titleFont[ 0 ].padding[ 0 ] + 'px ' + titleFont[ 0 ].padding[ 1 ] + 'px ' + titleFont[ 0 ].padding[ 2 ] + 'px ' + titleFont[ 0 ].padding[ 3 ] + 'px' : '' ),
										margin: ( titleFont[ 0 ].margin ? titleFont[ 0 ].margin[ 0 ] + 'px ' + titleFont[ 0 ].margin[ 1 ] + 'px ' + titleFont[ 0 ].margin[ 2 ] + 'px ' + titleFont[ 0 ].margin[ 3 ] + 'px' : '' ),
									} }
									className={ 'kt-testimonial-title' }
								/>
							</div>
						) }
						{ displayRating && (
							<div className={ `kt-testimonial-rating-wrap kt-testimonial-rating-${ testimonials[ index ].rating }` } style={ {
								margin: ( ratingStyles[ 0 ].margin ? ratingStyles[ 0 ].margin[ 0 ] + 'px ' + ratingStyles[ 0 ].margin[ 1 ] + 'px ' + ratingStyles[ 0 ].margin[ 2 ] + 'px ' + ratingStyles[ 0 ].margin[ 3 ] + 'px' : '' ),
							} }>
								<IconRender className={ 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1' } name={ 'fas_star' } size={ ratingStyles[ 0 ].size } style={ { color: KadenceColorOutput( ratingStyles[ 0 ].color ) } } />
								{ testimonials[ index ].rating > 1 && (
									<IconRender className={ 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2' } name={ 'fas_star' } size={ ratingStyles[ 0 ].size } style={ { color: KadenceColorOutput( ratingStyles[ 0 ].color ) } } />
								) }
								{ testimonials[ index ].rating > 2 && (
									<IconRender className={ 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3' } name={ 'fas_star' } size={ ratingStyles[ 0 ].size } style={ { color: KadenceColorOutput( ratingStyles[ 0 ].color ) } } />
								) }
								{ testimonials[ index ].rating > 3 && (
									<IconRender className={ 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4' } name={ 'fas_star' } size={ ratingStyles[ 0 ].size } style={ { color: KadenceColorOutput( ratingStyles[ 0 ].color ) } } />
								) }
								{ testimonials[ index ].rating > 4 && (
									<IconRender className={ 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5' } name={ 'fas_star' } size={ ratingStyles[ 0 ].size } style={ { color: KadenceColorOutput( ratingStyles[ 0 ].color ) } } />
								) }
							</div>
						) }
						{ displayContent && (
							<div className="kt-testimonial-content-wrap" style={ {
								minHeight: ( previewContentMinHeight ? previewContentMinHeight + 'px' : undefined ),
							} }>
								<RichText
									tagName={ 'div' }
									placeholder={ __( 'I have been looking for a product like this for years. I have tried everything and nothing did what I wanted until using this product. I am so glad I found it!', 'kadence-blocks' ) }
									value={ testimonials[ index ].content }
									onChange={ value => {
										saveTestimonials( { content: value }, index );
									} }
									style={ {
										fontWeight: contentFont[ 0 ].weight,
										fontStyle: contentFont[ 0 ].style,
										color: KadenceColorOutput( contentFont[ 0 ].color ),
										fontSize: previewContentFont ? previewContentFont + contentFont[ 0 ].sizeType : undefined,
										lineHeight: ( previewContentLineHeight ? previewContentLineHeight + contentFont[ 0 ].lineType : undefined ),
										textTransform: ( contentFont[ 0 ].textTransform ? contentFont[ 0 ].textTransform : undefined ),
										letterSpacing: contentFont[ 0 ].letterSpacing + 'px',
										fontFamily: ( contentFont[ 0 ].family ? contentFont[ 0 ].family : '' ),
									} }
									className={ 'kt-testimonial-content' }
								/>
							</div>
						) }
					</div>
					{ ( ( displayMedia && ( 'card' !== style && 'inlineimage' !== style ) ) || displayOccupation || displayName ) && (
						<div className="kt-testimonial-meta-wrap">
							{ displayMedia && ( 'card' !== style && 'inlineimage' !== style ) && (
								renderTestimonialMedia( index )
							) }
							<div className="kt-testimonial-meta-name-wrap">
								{ displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText
											tagName={ 'div' }
											placeholder={ __( 'Sophia Reily', 'kadence-blocks' ) }
											value={ testimonials[ index ].name }
											onChange={ value => {
												saveTestimonials( { name: value }, index );
											} }
											style={ {
												fontWeight: nameFont[ 0 ].weight,
												fontStyle: nameFont[ 0 ].style,
												color: KadenceColorOutput( nameFont[ 0 ].color ),
												fontSize: previewNameFont ? previewNameFont + nameFont[ 0 ].sizeType : undefined,
												lineHeight: ( previewNameLineHeight ? previewNameLineHeight + nameFont[ 0 ].lineType : undefined ),
												textTransform: ( nameFont[ 0 ].textTransform ? nameFont[ 0 ].textTransform : undefined ),
												letterSpacing: nameFont[ 0 ].letterSpacing + 'px',
												fontFamily: ( nameFont[ 0 ].family ? nameFont[ 0 ].family : '' ),
											} }
											className={ 'kt-testimonial-name' }
										/>
									</div>
								) }
								{ displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText
											tagName={ 'div' }
											placeholder={ __( 'CEO of Company', 'kadence-blocks' ) }
											value={ testimonials[ index ].occupation }
											onChange={ value => {
												saveTestimonials( { occupation: value }, index );
											} }
											style={ {
												fontWeight: occupationFont[ 0 ].weight,
												fontStyle: occupationFont[ 0 ].style,
												color: KadenceColorOutput( occupationFont[ 0 ].color ),
												fontSize: previewOccupationFont ? previewOccupationFont + occupationFont[ 0 ].sizeType : undefined,
												lineHeight: ( previewOccupationLineHeight ? previewOccupationLineHeight + occupationFont[ 0 ].lineType : undefined ),
												textTransform: ( occupationFont[ 0 ].textTransform ? occupationFont[ 0 ].textTransform : undefined ),
												letterSpacing: occupationFont[ 0 ].letterSpacing + 'px',
												fontFamily: ( occupationFont[ 0 ].family ? occupationFont[ 0 ].family : '' ),
											} }
											className={ 'kt-testimonial-occupation' }
										/>
									</div>
								) }
							</div>
						</div>
					) }
				</div>
			);
		};
		return (
			<div id={ `kt-blocks-testimonials-wrap${ uniqueID }` } className={ `wp-block-kadence-testimonials kt-testimonial-halign-${ hAlign } kt-testimonial-style-${ style } kt-testimonials-media-${ ( displayMedia ? 'on' : 'off' ) } kt-testimonials-icon-${ ( displayIcon ? 'on' : 'off' ) } kt-testimonial-columns-${ columns[ 0 ] }` }>
				<style>
					{ ( layout === 'carousel' ? `#kt-blocks-testimonials-wrap${ uniqueID } .slick-slide { padding: 0 ${ columnGap / 2 }px; }` : '' ) }
					{ ( layout === 'carousel' ? `#kt-blocks-testimonials-wrap${ uniqueID } .kt-blocks-carousel .slick-slider { margin: 0 -${ columnGap / 2 }px; }` : '' ) }
					{ ( layout === 'carousel' ? `#kt-blocks-testimonials-wrap${ uniqueID } .kt-blocks-carousel .slick-prev { left: ${ columnGap / 2 }px; }` : '' ) }
					{ ( layout === 'carousel' ? `#kt-blocks-testimonials-wrap${ uniqueID } .kt-blocks-carousel .slick-next { right: ${ columnGap / 2 }px; }` : '' ) }
					{ ( style === 'bubble' || style === 'inlineimage' ? `#kt-blocks-testimonials-wrap${ uniqueID } .kt-testimonial-text-wrap:after { margin-top: ${ containerBorderWidth && undefined !== containerBorderWidth[ 2 ] ? containerBorderWidth[ 2 ] : '1' }px; }` : '' ) }
					{ ( style === 'bubble' || style === 'inlineimage' ? `#kt-blocks-testimonials-wrap${ uniqueID } .kt-testimonial-text-wrap:after { border-top-color: ${ ( containerBorder ? KadenceColorOutput( containerBorder, ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) : KadenceColorOutput( '#eeeeee', ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) ) } }` : '' ) }
				</style>
				{ this.showSettings( 'allSettings' ) && (
					<Fragment>
						<BlockControls key="controls">
							<AlignmentToolbar
								value={ hAlign }
								onChange={ value => setAttributes( { hAlign: value } ) }
							/>
						</BlockControls>
						<InspectorControls>
							<KadencePanelBody
								panelName={ 'kb-testimonials-settings' }
							>
								{ this.showSettings( 'layoutSettings' ) && (
									<SelectControl
										label={ __( 'Layout', 'kadence-blocks' ) }
										value={ layout }
										options={ [
											{ value: 'grid', label: __( 'Grid', 'kadence-blocks' ) },
											{ value: 'carousel', label: __( 'Carousel', 'kadence-blocks' ) },
										] }
										onChange={ value => setAttributes( { layout: value } ) }
									/>
								) }
								{ this.showSettings( 'styleSettings' ) && (
									<Fragment>
										<p className="components-base-control__label">{ __( 'Testimonial Style', 'kadence-blocks' ) }</p>
										<ButtonGroup className="kt-style-btn-group" aria-label={ __( 'Testimonial Style', 'kadence-blocks' ) }>
											{ map( styleOptions, ( { name, key, icon } ) => (
												<Tooltip text={ name }>
													<Button
														key={ key }
														className="kt-style-btn"
														isSmall
														isPrimary={ style === key }
														aria-pressed={ style === key }
														onClick={ () => setAttributes( { style: key } ) }
													>
														{ icon }
													</Button>
												</Tooltip>
											) ) }
										</ButtonGroup>
									</Fragment>
								) }
								<RangeControl
									label={ __( 'Testimonial Items', 'kadence-blocks' ) }
									value={ itemsCount }
									onChange={ newcount => {
										const newitems = this.props.attributes.testimonials;
										if ( newitems.length < newcount ) {
											const amount = Math.abs( newcount - newitems.length );
											{ times( amount, n => {
												newitems.push( {
													url: newitems[ 0 ].url,
													id: newitems[ 0 ].id,
													alt: newitems[ 0 ].alt,
													width: newitems[ 0 ].width,
													height: newitems[ 0 ].height,
													maxWidth: newitems[ 0 ].maxWidth,
													subtype: newitems[ 0 ].subtype,
													media: newitems[ 0 ].media,
													icon: newitems[ 0 ].icon,
													isize: newitems[ 0 ].isize,
													istroke: newitems[ 0 ].istroke,
													ititle: newitems[ 0 ].ititle,
													color: newitems[ 0 ].color,
													title: '',
													content: '',
													name: '',
													occupation: '',
													rating: newitems[ 0 ].rating,
												} );
											} ); }
											setAttributes( { testimonials: newitems } );
											saveTestimonials( { ititle: testimonials[ 0 ].ititle }, 0 );
										}
										setAttributes( { itemsCount: newcount } );
									} }
									min={ 1 }
									max={ 40 }
								/>
								{ this.showSettings( 'columnSettings' ) && (
									<Fragment>
										{ columnControls }
										<RangeControl
											label={ __( 'Column Gap', 'kadence-blocks' ) }
											value={ columnGap }
											onChange={ ( value ) => setAttributes( { columnGap: value } ) }
											min={ 0 }
											max={ 80 }
										/>
									</Fragment>
								) }
							</KadencePanelBody>
							{ layout && layout === 'carousel' && (
								<Fragment>
									{ this.showSettings( 'carouselSettings' ) && (
										<KadencePanelBody
											title={ __( 'Carousel Settings', 'kadence-blocks' ) }
											initialOpen={ false }
											panelName={ 'kb-testimonials-carousel'}
										>
											<ToggleControl
												label={ __( 'Carousel Auto Play', 'kadence-blocks' ) }
												checked={ autoPlay }
												onChange={ ( value ) => setAttributes( { autoPlay: value } ) }
											/>
											{ autoPlay && (
												<RangeControl
													label={ __( 'Autoplay Speed', 'kadence-blocks' ) }
													value={ autoSpeed }
													onChange={ ( value ) => setAttributes( { autoSpeed: value } ) }
													min={ 500 }
													max={ 15000 }
													step={ 10 }
												/>
											) }
											<RangeControl
												label={ __( 'Carousel Slide Transition Speed', 'kadence-blocks' ) }
												value={ transSpeed }
												onChange={ ( value ) => setAttributes( { transSpeed: value } ) }
												min={ 100 }
												max={ 2000 }
												step={ 10 }
											/>
											<SelectControl
												label={ __( 'Slides to Scroll', 'kadence-blocks' ) }
												options={ [
													{
														label: __( 'One' ),
														value: '1',
													},
													{
														label: __( 'All' ),
														value: 'all',
													},
												] }
												value={ slidesScroll }
												onChange={ ( value ) => setAttributes( { slidesScroll: value } ) }
											/>
											<SelectControl
												label={ __( 'Arrow Style', 'kadence-blocks' ) }
												options={ [
													{
														label: __( 'White on Dark', 'kadence-blocks' ),
														value: 'whiteondark',
													},
													{
														label: __( 'Black on Light', 'kadence-blocks' ),
														value: 'blackonlight',
													},
													{
														label: __( 'Outline Black', 'kadence-blocks' ),
														value: 'outlineblack',
													},
													{
														label: __( 'Outline White', 'kadence-blocks' ),
														value: 'outlinewhite',
													},
													{
														label: __( 'None', 'kadence-blocks' ),
														value: 'none',
													},
												] }
												value={ arrowStyle }
												onChange={ ( value ) => setAttributes( { arrowStyle: value } ) }
											/>
											<SelectControl
												label={ __( 'Dot Style', 'kadence-blocks' ) }
												options={ [
													{
														label: __( 'Dark', 'kadence-blocks' ),
														value: 'dark',
													},
													{
														label: __( 'Light', 'kadence-blocks' ),
														value: 'light',
													},
													{
														label: __( 'Outline Dark', 'kadence-blocks' ),
														value: 'outlinedark',
													},
													{
														label: __( 'Outline Light', 'kadence-blocks' ),
														value: 'outlinelight',
													},
													{
														label: __( 'None', 'kadence-blocks' ),
														value: 'none',
													},
												] }
												value={ dotStyle }
												onChange={ ( value ) => setAttributes( { dotStyle: value } ) }
											/>
										</KadencePanelBody>
									) }
								</Fragment>
							) }
							{ this.showSettings( 'containerSettings' ) && (
								<KadencePanelBody
									title={ __( 'Container Settings', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-testimonials-container-settings' }
								>
									<div className="kt-spacer-sidebar-15"></div>
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
									<RangeControl
										label={ __( 'Container Border Radius (px)', 'kadence-blocks' ) }
										value={ containerBorderRadius }
										onChange={ value => setAttributes( { containerBorderRadius: value } ) }
										step={ 1 }
										min={ 0 }
										max={ 200 }
									/>
									<PopColorControl
										label={ __( 'Container Background', 'kadence-blocks' ) }
										value={ ( containerBackground ? containerBackground : '' ) }
										default={ '' }
										onChange={ value => setAttributes( { containerBackground: value } ) }
										opacityValue={ containerBackgroundOpacity }
										onOpacityChange={ value => setAttributes( { containerBackgroundOpacity: value } ) }
									/>
									<PopColorControl
										label={ __( 'Container Border', 'kadence-blocks' ) }
										value={ ( containerBorder ? containerBorder : '' ) }
										default={ '' }
										onChange={ value => setAttributes( { containerBorder: value } ) }
										opacityValue={ containerBorderOpacity }
										onOpacityChange={ value => setAttributes( { containerBorderOpacity: value } ) }
									/>
									<div className="kt-spacer-sidebar-15"></div>
									<ResponsiveMeasuremenuControls
										label={ __( 'Container Padding', 'kadence-blocks' ) }
										control={ containerPaddingControl }
										tabletControl={ tabletContainerPaddingControl }
										mobileControl={ mobileContainerPaddingControl }
										value={ containerPadding }
										tabletValue={ tabletContainerPadding }
										mobileValue={ mobileContainerPadding }
										onChange={ ( value ) => setAttributes( { containerPadding: value } ) }
										onChangeTablet={ ( value ) => setAttributes( { tabletContainerPadding: value } ) }
										onChangeMobile={ ( value ) => setAttributes( { mobileContainerPadding: value } ) }
										onChangeControl={ ( value ) => this.setState( { containerPaddingControl: value } ) }
										onChangeTabletControl={ ( value ) => this.setState( { tabletContainerPaddingControl: value } ) }
										onChangeMobileControl={ ( value ) => this.setState( { mobileContainerPaddingControl: value } ) }
										allowEmpty={ true }
										min={ 0 }
										max={ ( containerPaddingType === 'em' || containerPaddingType === 'rem' ? 12 : 200 ) }
										step={ ( containerPaddingType === 'em' || containerPaddingType === 'rem' ? 0.1 : 1 ) }
										unit={ ( containerPaddingType ? containerPaddingType : 'px' ) }
										units={ [ 'px', 'em', 'rem' ] }
										onUnit={ ( value ) => setAttributes( { containerPaddingType: value } ) }
									/>
									<RangeControl
										label={ __( 'Container Max Width (px)', 'kadence-blocks' ) }
										value={ containerMaxWidth }
										onChange={ value => setAttributes( { containerMaxWidth: value } ) }
										step={ 5 }
										min={ 50 }
										max={ 2000 }
									/>
									<ResponsiveRangeControls
										label={ __( 'Container Min Height', 'kadence-blocks' ) }
										value={ ( containerMinHeight && undefined !== containerMinHeight[ 0 ] ? containerMinHeight[ 0 ] : '' ) }
										onChange={ value => setAttributes( { containerMinHeight: [ value, ( containerMinHeight && undefined !== containerMinHeight[ 1 ] ? containerMinHeight[ 1 ] : '' ), ( containerMinHeight && undefined !== containerMinHeight[ 2 ] ? containerMinHeight[ 2 ] : '' ) ] } ) }
										tabletValue={ ( containerMinHeight && undefined !== containerMinHeight[ 1 ] ? containerMinHeight[ 1 ] : '' ) }
										onChangeTablet={ ( value ) => setAttributes( { containerMinHeight: [ ( containerMinHeight && undefined !== containerMinHeight[ 0 ] ? containerMinHeight[ 0 ] : '' ), value, ( containerMinHeight && undefined !== containerMinHeight[ 2 ] ? containerMinHeight[ 2 ] : '' ) ] } ) }
										mobileValue={ ( containerMinHeight && undefined !== containerMinHeight[ 2 ] ? containerMinHeight[ 2 ] : '' ) }
										onChangeMobile={ ( value ) => setAttributes( { containerMinHeight: [ ( containerMinHeight && undefined !== containerMinHeight[ 0 ] ? containerMinHeight[ 0 ] : '' ), ( containerMinHeight && undefined !== containerMinHeight[ 1 ] ? containerMinHeight[ 1 ] : '' ), value ] } ) }
										min={ 0 }
										max={ 600 }
										step={ 1 }
										unit={ 'px' }
										showUnit={ true }
										units={ [ 'px' ] }
									/>
									{ containerMinHeight && ( containerMinHeight[ 0 ] || containerMinHeight[ 1 ] || containerMinHeight[ 2 ] ) && (
										<div className="kt-btn-size-settings-container">
											<h2 className="kt-beside-btn-group">{ __( 'Inner Content Align', 'kadence-blocks' ) }</h2>
											<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Inner Content Align', 'kadence-blocks' ) }>
												{ map( VAlignOptions, ( { name, icon, key } ) => (
													<Tooltip text={ name }>
														<Button
															key={ key }
															className="kt-btn-size-btn"
															isSmall
															isPrimary={ containerVAlign === key }
															aria-pressed={ containerVAlign === key }
															onClick={ () => setAttributes( { containerVAlign: key } ) }
														>
															{ icon }
														</Button>
													</Tooltip>
												) ) }
											</ButtonGroup>
										</div>
									) }
								</KadencePanelBody>
							) }
							{ this.showSettings( 'iconSettings' ) && (
								<KadencePanelBody
									title={ __( 'Icon Settings', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-testimonials-icon-settings' }
								>
									<ToggleControl
										label={ __( 'Show Top Icon', 'kadence-blocks' ) }
										checked={ displayIcon }
										onChange={ ( value ) => setAttributes( { displayIcon: value } ) }
									/>
									{ displayIcon && (
										<Fragment>
											<IconControl
												value={ iconStyles[ 0 ].icon }
												onChange={ value => {
													saveIconStyles( { icon: value } );
												} }
											/>
											<RangeControl
												label={ __( 'Icon Size', 'kadence-blocks' ) }
												value={ iconStyles[ 0 ].size }
												onChange={ value => saveIconStyles( { size: value } ) }
												step={ 1 }
												min={ 1 }
												max={ 120 }
											/>
											{ iconStyles[ 0 ].icon && 'fe' === iconStyles[ 0 ].icon.substring( 0, 2 ) && (
												<RangeControl
													label={ __( 'Line Width', 'kadence-blocks' ) }
													value={ iconStyles[ 0 ].stroke }
													onChange={ value => {
														saveIconStyles( { stroke: value } );
													} }
													step={ 0.5 }
													min={ 0.5 }
													max={ 4 }
												/>
											) }
											<PopColorControl
												label={ __( 'Color', 'kadence-blocks' ) }
												value={ ( iconStyles[ 0 ].color ? iconStyles[ 0 ].color : '' ) }
												default={ '' }
												onChange={ ( value ) => saveIconStyles( { color: value } ) }
											/>
											<div className="kt-spacer-sidebar-15"></div>
											<MeasurementControls
												label={ __( 'Icon Border Width (px)', 'kadence-blocks' ) }
												measurement={ iconStyles[ 0 ].borderWidth }
												control={ iconBorderControl }
												onChange={ ( value ) => saveIconStyles( { borderWidth: value } ) }
												onControl={ ( value ) => this.setState( { iconBorderControl: value } ) }
												min={ 0 }
												max={ 40 }
												step={ 1 }
											/>
											<RangeControl
												label={ __( 'Icon Border Radius (px)', 'kadence-blocks' ) }
												value={ iconStyles[ 0 ].borderRadius }
												onChange={ value => saveIconStyles( { borderRadius: value } ) }
												step={ 1 }
												min={ 0 }
												max={ 200 }
											/>
											<PopColorControl
												label={ __( 'Icon Background', 'kadence-blocks' ) }
												value={ ( iconStyles[ 0 ].background ? iconStyles[ 0 ].background : '' ) }
												default={ '' }
												onChange={ value => saveIconStyles( { background: value } ) }
												opacityValue={ iconStyles[ 0 ].backgroundOpacity }
												onOpacityChange={ value => saveIconStyles( { backgroundOpacity: value } ) }
												onArrayChange={ ( color, opacity ) => saveIconStyles( { background: color, backgroundOpacity: opacity } ) }
											/>
											<PopColorControl
												label={ __( 'Icon Border Color', 'kadence-blocks' ) }
												value={ ( iconStyles[ 0 ].border ? iconStyles[ 0 ].border : '' ) }
												default={ '' }
												onChange={ value => saveIconStyles( { border: value } ) }
												opacityValue={ iconStyles[ 0 ].borderOpacity }
												onOpacityChange={ value => saveIconStyles( { borderOpacity: value } ) }
												onArrayChange={ ( color, opacity ) => saveIconStyles( { border: color, borderOpacity: opacity } ) }
											/>
											<div className="kt-spacer-sidebar-15"></div>
											<MeasurementControls
												label={ __( 'Icon Padding', 'kadence-blocks' ) }
												measurement={ iconStyles[ 0 ].padding }
												control={ iconPaddingControl }
												onChange={ ( value ) => saveIconStyles( { padding: value } ) }
												onControl={ ( value ) => this.setState( { iconPaddingControl: value } ) }
												min={ 0 }
												max={ 100 }
												step={ 1 }
											/>
											<MeasurementControls
												label={ __( 'Icon Margin', 'kadence-blocks' ) }
												measurement={ iconStyles[ 0 ].margin }
												control={ iconMarginControl }
												onChange={ ( value ) => saveIconStyles( { margin: value } ) }
												onControl={ ( value ) => this.setState( { iconMarginControl: value } ) }
												min={ -100 }
												max={ 100 }
												step={ 1 }
											/>
										</Fragment>
									) }
								</KadencePanelBody>
							) }
							{ this.showSettings( 'titleSettings' ) && (
								<KadencePanelBody
									title={ __( 'Title Settings', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-testimonials-title-settings' }
								>
									<ToggleControl
										label={ __( 'Show Title', 'kadence-blocks' ) }
										checked={ displayTitle }
										onChange={ ( value ) => setAttributes( { displayTitle: value } ) }
									/>
									{ displayTitle && (
										<Fragment>
											<PopColorControl
												label={ __( 'Color Settings', 'kadence-blocks' ) }
												value={ ( titleFont[ 0 ].color ? titleFont[ 0 ].color : '' ) }
												default={ '' }
												onChange={ value => saveTitleFont( { color: value } ) }
											/>
											<TypographyControls
												fontGroup={ 'heading' }
												tagLevel={ titleFont[ 0 ].level }
												tagLowLevel={ 2 }
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
												textTransform={ titleFont[ 0 ].textTransform }
												onTextTransform={ ( value ) => saveTitleFont( { textTransform: value } ) }
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
												paddingControl={ titlePaddingControl }
												onPaddingControl={ ( value ) => this.setState( { titlePaddingControl: value } ) }
												margin={ titleFont[ 0 ].margin }
												onMargin={ ( value ) => saveTitleFont( { margin: value } ) }
												marginControl={ titleMarginControl }
												onMarginControl={ ( value ) => this.setState( { titleMarginControl: value } ) }
											/>
											<ResponsiveRangeControls
												label={ __( 'Title Min Height', 'kadence-blocks' ) }
												value={ ( titleMinHeight && undefined !== titleMinHeight[ 0 ] ? titleMinHeight[ 0 ] : '' ) }
												onChange={ value => setAttributes( { titleMinHeight: [ value, ( titleMinHeight && undefined !== titleMinHeight[ 1 ] ? titleMinHeight[ 1 ] : '' ), ( titleMinHeight && undefined !== titleMinHeight[ 2 ] ? titleMinHeight[ 2 ] : '' ) ] } ) }
												tabletValue={ ( titleMinHeight && undefined !== titleMinHeight[ 1 ] ? titleMinHeight[ 1 ] : '' ) }
												onChangeTablet={ ( value ) => setAttributes( { titleMinHeight: [ ( titleMinHeight && undefined !== titleMinHeight[ 0 ] ? titleMinHeight[ 0 ] : '' ), value, ( titleMinHeight && undefined !== titleMinHeight[ 2 ] ? titleMinHeight[ 2 ] : '' ) ] } ) }
												mobileValue={ ( titleMinHeight && undefined !== titleMinHeight[ 2 ] ? titleMinHeight[ 2 ] : '' ) }
												onChangeMobile={ ( value ) => setAttributes( { titleMinHeight: [ ( titleMinHeight && undefined !== titleMinHeight[ 0 ] ? titleMinHeight[ 0 ] : '' ), ( titleMinHeight && undefined !== titleMinHeight[ 1 ] ? titleMinHeight[ 1 ] : '' ), value ] } ) }
												min={ 0 }
												max={ 200 }
												step={ 1 }
												unit={ 'px' }
												showUnit={ true }
												units={ [ 'px' ] }
											/>
										</Fragment>
									) }
								</KadencePanelBody>
							) }
							{ this.showSettings( 'ratingSettings' ) && (
								<KadencePanelBody
									title={ __( 'Rating Settings', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-testimonials-rating-settings' }
								>
									<ToggleControl
										label={ __( 'Show Rating', 'kadence-blocks' ) }
										checked={ displayRating }
										onChange={ ( value ) => setAttributes( { displayRating: value } ) }
									/>
									{ displayRating && (
										<Fragment>
											<PopColorControl
												label={ __( 'Color', 'kadence-blocks' ) }
												value={ ( ratingStyles[ 0 ].color ? ratingStyles[ 0 ].color : '' ) }
												default={ '' }
												onChange={ ( value ) => saveRatingStyles( { color: value } ) }
											/>
											<RangeControl
												label={ __( 'Icon Size', 'kadence-blocks' ) }
												value={ ratingStyles[ 0 ].size }
												onChange={ value => saveRatingStyles( { size: value } ) }
												step={ 1 }
												min={ 1 }
												max={ 120 }
											/>
											<MeasurementControls
												label={ __( 'Rating Margin', 'kadence-blocks' ) }
												measurement={ ratingStyles[ 0 ].margin }
												control={ ratingMarginControl }
												onChange={ ( value ) => saveRatingStyles( { margin: value } ) }
												onControl={ ( value ) => this.setState( { ratingMarginControl: value } ) }
												min={ 0 }
												max={ 100 }
												step={ 1 }
											/>
										</Fragment>
									) }
								</KadencePanelBody>
							) }
							{ this.showSettings( 'contentSettings' ) && (
								<KadencePanelBody
									title={ __( 'Content Settings', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-testimonials-content-settings' }
								>
									<ToggleControl
										label={ __( 'Show Content', 'kadence-blocks' ) }
										checked={ displayContent }
										onChange={ ( value ) => setAttributes( { displayContent: value } ) }
									/>
									{ displayContent && (
										<Fragment>
											<PopColorControl
												label={ __( 'Color', 'kadence-blocks' ) }
												value={ ( contentFont[ 0 ].color ? contentFont[ 0 ].color : '' ) }
												default={ '' }
												onChange={ value => saveContentFont( { color: value } ) }
											/>
											<TypographyControls
												fontSize={ contentFont[ 0 ].size }
												onFontSize={ ( value ) => saveContentFont( { size: value } ) }
												fontSizeType={ contentFont[ 0 ].sizeType }
												onFontSizeType={ ( value ) => saveContentFont( { sizeType: value } ) }
												lineHeight={ contentFont[ 0 ].lineHeight }
												onLineHeight={ ( value ) => saveContentFont( { lineHeight: value } ) }
												lineHeightType={ contentFont[ 0 ].lineType }
												onLineHeightType={ ( value ) => saveContentFont( { lineType: value } ) }
												letterSpacing={ contentFont[ 0 ].letterSpacing }
												onLetterSpacing={ ( value ) => saveContentFont( { letterSpacing: value } ) }
												textTransform={ contentFont[ 0 ].textTransform }
												onTextTransform={ ( value ) => saveContentFont( { textTransform: value } ) }
												fontFamily={ contentFont[ 0 ].family }
												onFontFamily={ ( value ) => saveContentFont( { family: value } ) }
												onFontChange={ ( select ) => {
													saveContentFont( {
														family: select.value,
														google: select.google,
													} );
												} }
												onFontArrayChange={ ( values ) => saveContentFont( values ) }
												googleFont={ contentFont[ 0 ].google }
												onGoogleFont={ ( value ) => saveContentFont( { google: value } ) }
												loadGoogleFont={ contentFont[ 0 ].loadGoogle }
												onLoadGoogleFont={ ( value ) => saveContentFont( { loadGoogle: value } ) }
												fontVariant={ contentFont[ 0 ].variant }
												onFontVariant={ ( value ) => saveContentFont( { variant: value } ) }
												fontWeight={ contentFont[ 0 ].weight }
												onFontWeight={ ( value ) => saveContentFont( { weight: value } ) }
												fontStyle={ contentFont[ 0 ].style }
												onFontStyle={ ( value ) => saveContentFont( { style: value } ) }
												fontSubset={ contentFont[ 0 ].subset }
												onFontSubset={ ( value ) => saveContentFont( { subset: value } ) }
											/>
											<ResponsiveRangeControls
												label={ __( 'Content Min Height', 'kadence-blocks' ) }
												value={ ( contentMinHeight && undefined !== contentMinHeight[ 0 ] ? contentMinHeight[ 0 ] : '' ) }
												onChange={ value => setAttributes( { contentMinHeight: [ value, ( contentMinHeight && undefined !== contentMinHeight[ 1 ] ? contentMinHeight[ 1 ] : '' ), ( contentMinHeight && undefined !== contentMinHeight[ 2 ] ? contentMinHeight[ 2 ] : '' ) ] } ) }
												tabletValue={ ( contentMinHeight && undefined !== contentMinHeight[ 1 ] ? contentMinHeight[ 1 ] : '' ) }
												onChangeTablet={ ( value ) => setAttributes( { contentMinHeight: [ ( contentMinHeight && undefined !== contentMinHeight[ 0 ] ? contentMinHeight[ 0 ] : '' ), value, ( contentMinHeight && undefined !== contentMinHeight[ 2 ] ? contentMinHeight[ 2 ] : '' ) ] } ) }
												mobileValue={ ( contentMinHeight && undefined !== contentMinHeight[ 2 ] ? contentMinHeight[ 2 ] : '' ) }
												onChangeMobile={ ( value ) => setAttributes( { contentMinHeight: [ ( contentMinHeight && undefined !== contentMinHeight[ 0 ] ? contentMinHeight[ 0 ] : '' ), ( contentMinHeight && undefined !== contentMinHeight[ 1 ] ? contentMinHeight[ 1 ] : '' ), value ] } ) }
												min={ 0 }
												max={ 400 }
												step={ 1 }
												unit={ 'px' }
												showUnit={ true }
												units={ [ 'px' ] }
											/>
										</Fragment>
									) }
								</KadencePanelBody>
							) }
							{ this.showSettings( 'mediaSettings' ) && (
								<KadencePanelBody
									title={ __( 'Media Settings', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-testimonials-media-settings' }
								>
									<ToggleControl
										label={ __( 'Show Media', 'kadence-blocks' ) }
										checked={ displayMedia }
										onChange={ ( value ) => setAttributes( { displayMedia: value } ) }
									/>
									{ displayMedia && (
										<Fragment>
											{ 'card' !== style && (
												<RangeControl
													label={ __( 'Media Max Size', 'kadence-blocks' ) }
													value={ mediaStyles[ 0 ].width }
													onChange={ value => savemediaStyles( { width: value } ) }
													step={ 1 }
													min={ 2 }
													max={ 800 }
												/>
											) }
											<MeasurementControls
												label={ __( 'Media Border Width (px)', 'kadence-blocks' ) }
												measurement={ mediaStyles[ 0 ].borderWidth }
												control={ mediaBorderControl }
												onChange={ ( value ) => savemediaStyles( { borderWidth: value } ) }
												onControl={ ( value ) => this.setState( { mediaBorderControl: value } ) }
												min={ 0 }
												max={ 40 }
												step={ 1 }
											/>
											<RangeControl
												label={ __( 'Media Border Radius (px)', 'kadence-blocks' ) }
												value={ mediaStyles[ 0 ].borderRadius }
												onChange={ value => savemediaStyles( { borderRadius: value } ) }
												step={ 1 }
												min={ 0 }
												max={ 200 }
											/>
											<PopColorControl
												label={ __( 'Media Background', 'kadence-blocks' ) }
												value={ ( mediaStyles[ 0 ].background ? mediaStyles[ 0 ].background : '' ) }
												default={ '' }
												onChange={ value => savemediaStyles( { background: value } ) }
												opacityValue={ mediaStyles[ 0 ].backgroundOpacity }
												onOpacityChange={ value => savemediaStyles( { backgroundOpacity: value } ) }
												onArrayChange={ ( color, opacity ) => savemediaStyles( { background: color, backgroundOpacity: opacity } ) }
											/>
											<PopColorControl
												label={ __( 'Media Border Color', 'kadence-blocks' ) }
												value={ ( mediaStyles[ 0 ].border ? mediaStyles[ 0 ].border : '' ) }
												default={ '' }
												onChange={ value => savemediaStyles( { border: value } ) }
												opacityValue={ mediaStyles[ 0 ].borderOpacity }
												onOpacityChange={ value => savemediaStyles( { borderOpacity: value } ) }
												onArrayChange={ ( color, opacity ) => savemediaStyles( { border: color, borderOpacity: opacity } ) }
											/>
											<div className="kt-spacer-sidebar-15"></div>
											<MeasurementControls
												label={ __( 'Media Padding', 'kadence-blocks' ) }
												measurement={ mediaStyles[ 0 ].padding }
												control={ mediaPaddingControl }
												onChange={ ( value ) => savemediaStyles( { padding: value } ) }
												onControl={ ( value ) => this.setState( { mediaPaddingControl: value } ) }
												min={ 0 }
												max={ 100 }
												step={ 1 }
											/>
											<MeasurementControls
												label={ __( 'Media Margin', 'kadence-blocks' ) }
												measurement={ mediaStyles[ 0 ].margin }
												control={ mediaMarginControl }
												onChange={ ( value ) => savemediaStyles( { margin: value } ) }
												onControl={ ( value ) => this.setState( { mediaMarginControl: value } ) }
												min={ -100 }
												max={ 100 }
												step={ 1 }
											/>
											{ 'card' === style && (
												<Fragment>
													<SelectControl
														label={ __( 'Image Size', 'kadence-blocks' ) }
														options={ [
															{
																label: __( 'Cover', 'kadence-blocks' ),
																value: 'cover',
															},
															{
																label: __( 'Contain', 'kadence-blocks' ),
																value: 'Contain',
															},
															{
																label: __( 'Auto', 'kadence-blocks' ),
																value: 'auto',
															},
														] }
														value={ mediaStyles[ 0 ].backgroundSize }
														onChange={ ( value ) => savemediaStyles( { backgroundSize: value } ) }
													/>
													<SelectControl
														label={ __( 'Image Ratio', 'kadence-blocks' ) }
														options={ [
															{
																label: __( 'Landscape 4:2', 'kadence-blocks' ),
																value: '50',
															},
															{
																label: __( 'Landscape 3:2', 'kadence-blocks' ),
																value: '66.67',
															},
															{
																label: __( 'Landscape 4:3', 'kadence-blocks' ),
																value: '75',
															},
															{
																label: __( 'Portrait 3:4', 'kadence-blocks' ),
																value: '133.33',
															},
															{
																label: __( 'Portrait 2:3', 'kadence-blocks' ),
																value: '150',
															},
															{
																label: __( 'Square 1:1', 'kadence-blocks' ),
																value: '100',
															},
														] }
														value={ ( undefined === mediaStyles[ 0 ].ratio || '' === mediaStyles[ 0 ].ratio ? '50' : mediaStyles[ 0 ].ratio ) }
														onChange={ ( value ) => savemediaStyles( { ratio: value } ) }
													/>
												</Fragment>
											) }
										</Fragment>
									) }
								</KadencePanelBody>
							) }
							{ this.showSettings( 'nameSettings' ) && (
								<KadencePanelBody
									title={ __( 'Name Settings', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-testimonials-name-settings' }
								>
									<ToggleControl
										label={ __( 'Show Name', 'kadence-blocks' ) }
										checked={ displayName }
										onChange={ ( value ) => setAttributes( { displayName: value } ) }
									/>
									{ displayName && (
										<Fragment>
											<PopColorControl
												label={ __( 'Color', 'kadence-blocks' ) }
												value={ ( nameFont[ 0 ].color ? nameFont[ 0 ].color : '' ) }
												default={ '' }
												onChange={ ( value ) => saveNameFont( { color: value } ) }
											/>
											<TypographyControls
												fontSize={ nameFont[ 0 ].size }
												onFontSize={ ( value ) => saveNameFont( { size: value } ) }
												fontSizeType={ nameFont[ 0 ].sizeType }
												onFontSizeType={ ( value ) => saveNameFont( { sizeType: value } ) }
												lineHeight={ nameFont[ 0 ].lineHeight }
												onLineHeight={ ( value ) => saveNameFont( { lineHeight: value } ) }
												lineHeightType={ nameFont[ 0 ].lineType }
												onLineHeightType={ ( value ) => saveNameFont( { lineType: value } ) }
												letterSpacing={ nameFont[ 0 ].letterSpacing }
												onLetterSpacing={ ( value ) => saveNameFont( { letterSpacing: value } ) }
												textTransform={ nameFont[ 0 ].textTransform }
												onTextTransform={ ( value ) => saveNameFont( { textTransform: value } ) }
												fontFamily={ nameFont[ 0 ].family }
												onFontFamily={ ( value ) => saveNameFont( { family: value } ) }
												onFontChange={ ( select ) => {
													saveNameFont( {
														family: select.value,
														google: select.google,
													} );
												} }
												onFontArrayChange={ ( values ) => saveNameFont( values ) }
												googleFont={ nameFont[ 0 ].google }
												onGoogleFont={ ( value ) => saveNameFont( { google: value } ) }
												loadGoogleFont={ nameFont[ 0 ].loadGoogle }
												onLoadGoogleFont={ ( value ) => saveNameFont( { loadGoogle: value } ) }
												fontVariant={ nameFont[ 0 ].variant }
												onFontVariant={ ( value ) => saveNameFont( { variant: value } ) }
												fontWeight={ nameFont[ 0 ].weight }
												onFontWeight={ ( value ) => saveNameFont( { weight: value } ) }
												fontStyle={ nameFont[ 0 ].style }
												onFontStyle={ ( value ) => saveNameFont( { style: value } ) }
												fontSubset={ nameFont[ 0 ].subset }
												onFontSubset={ ( value ) => saveNameFont( { subset: value } ) }
											/>
										</Fragment>
									) }
								</KadencePanelBody>
							) }
							{ this.showSettings( 'occupationSettings' ) && (
								<KadencePanelBody
									title={ __( 'Occupation Settings', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-testimonails-occupation-settings' }
								>
									<ToggleControl
										label={ __( 'Show Occupation', 'kadence-blocks' ) }
										checked={ displayOccupation }
										onChange={ ( value ) => setAttributes( { displayOccupation: value } ) }
									/>
									{ displayOccupation && (
										<Fragment>
											<PopColorControl
												label={ __( 'Color', 'kadence-blocks' ) }
												value={ ( occupationFont[ 0 ].color ? occupationFont[ 0 ].color : '' ) }
												default={ '' }
												onChange={ ( value ) => saveOccupationFont( { color: value } ) }
											/>
											<TypographyControls
												fontSize={ occupationFont[ 0 ].size }
												onFontSize={ ( value ) => saveOccupationFont( { size: value } ) }
												fontSizeType={ occupationFont[ 0 ].sizeType }
												onFontSizeType={ ( value ) => saveOccupationFont( { sizeType: value } ) }
												lineHeight={ occupationFont[ 0 ].lineHeight }
												onLineHeight={ ( value ) => saveOccupationFont( { lineHeight: value } ) }
												lineHeightType={ occupationFont[ 0 ].lineType }
												onLineHeightType={ ( value ) => saveOccupationFont( { lineType: value } ) }
												textTransform={ occupationFont[ 0 ].textTransform }
												onTextTransform={ ( value ) => saveOccupationFont( { textTransform: value } ) }
												letterSpacing={ occupationFont[ 0 ].letterSpacing }
												onLetterSpacing={ ( value ) => saveOccupationFont( { letterSpacing: value } ) }
												fontFamily={ occupationFont[ 0 ].family }
												onFontFamily={ ( value ) => saveOccupationFont( { family: value } ) }
												onFontChange={ ( select ) => {
													saveOccupationFont( {
														family: select.value,
														google: select.google,
													} );
												} }
												onFontArrayChange={ ( values ) => saveOccupationFont( values ) }
												googleFont={ occupationFont[ 0 ].google }
												onGoogleFont={ ( value ) => saveOccupationFont( { google: value } ) }
												loadGoogleFont={ occupationFont[ 0 ].loadGoogle }
												onLoadGoogleFont={ ( value ) => saveOccupationFont( { loadGoogle: value } ) }
												fontVariant={ occupationFont[ 0 ].variant }
												onFontVariant={ ( value ) => saveOccupationFont( { variant: value } ) }
												fontWeight={ occupationFont[ 0 ].weight }
												onFontWeight={ ( value ) => saveOccupationFont( { weight: value } ) }
												fontStyle={ occupationFont[ 0 ].style }
												onFontStyle={ ( value ) => saveOccupationFont( { style: value } ) }
												fontSubset={ occupationFont[ 0 ].subset }
												onFontSubset={ ( value ) => saveOccupationFont( { subset: value } ) }
											/>
										</Fragment>
									) }
								</KadencePanelBody>
							) }
							{ this.showSettings( 'shadowSettings' ) && (
								<KadencePanelBody
									title={ __( 'Container Shadow', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-testimonials-container-shadow' }
								>
									<ToggleControl
										label={ __( 'Enable Shadow', 'kadence-blocks' ) }
										checked={ displayShadow }
										onChange={ value => setAttributes( { displayShadow: value } ) }
									/>
									{ displayShadow && (
										<Fragment>
											<PopColorControl
												label={ __( 'Shadow Color', 'kadence-blocks' ) }
												value={ ( shadow[ 0 ].color ? shadow[ 0 ].color : '' ) }
												default={ '' }
												onChange={ value => saveShadow( { color: value } ) }
												opacityValue={ shadow[ 0 ].opacity }
												onOpacityChange={ value => saveShadow( { opacity: value } ) }
												onArrayChange={ ( color, opacity ) => saveShadow( { color: color, opacity: opacity } ) }
											/>
											<RangeControl
												label={ __( 'Shadow Blur', 'kadence-blocks' ) }
												value={ shadow[ 0 ].blur }
												onChange={ value => saveShadow( { blur: value } ) }
												min={ 0 }
												max={ 100 }
												step={ 1 }
											/>
											<RangeControl
												label={ __( 'Shadow Spread', 'kadence-blocks' ) }
												value={ shadow[ 0 ].spread }
												onChange={ value => saveShadow( { spread: value } ) }
												min={ -100 }
												max={ 100 }
												step={ 1 }
											/>
											<RangeControl
												label={ __( 'Shadow Vertical Offset', 'kadence-blocks' ) }
												value={ shadow[ 0 ].vOffset }
												onChange={ value => saveShadow( { vOffset: value } ) }
												min={ -100 }
												max={ 100 }
												step={ 1 }
											/>
											<RangeControl
												label={ __( 'Shadow Horizontal Offset', 'kadence-blocks' ) }
												value={ shadow[ 0 ].hOffset }
												onChange={ value => saveShadow( { hOffset: value } ) }
												min={ -100 }
												max={ 100 }
												step={ 1 }
											/>
										</Fragment>
									) }
								</KadencePanelBody>
							) }
							{ this.showSettings( 'wrapperSettings' ) && (
								<KadencePanelBody
									title={ __( 'Wrapper Padding', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-testimonials-wrapper-padding' }
								>
									<ResponsiveMeasuremenuControls
										label={ __( 'Wrapper Padding', 'kadence-blocks' ) }
										value={ wrapperPadding }
										control={ this.state.wrapperPaddingControls }
										tabletValue={ wrapperTabletPadding }
										mobileValue={ wrapperMobilePadding }
										onChange={ ( value ) => setAttributes( { wrapperPadding: value } ) }
										onChangeTablet={ ( value ) => setAttributes( { wrapperTabletPadding: value } ) }
										onChangeMobile={ ( value ) => setAttributes( { wrapperMobilePadding: value } ) }
										onChangeControl={ ( value ) => this.setState( { wrapperPaddingControls: value } ) }
										min={ paddingMin }
										max={ paddingMax }
										step={ paddingStep }
										unit={ wrapperPaddingType }
										units={ [ 'px', 'em', 'rem', '%' ] }
										onUnit={ ( value ) => setAttributes( { wrapperPaddingType: value } ) }
									/>
								</KadencePanelBody>
							) }
							<div className="kt-sidebar-settings-spacer"></div>
							{ this.showSettings( 'individualSettings' ) && (
								<KadencePanelBody
									title={ __( 'Individual Settings', 'kadence-blocks' ) }
									initialOpen={ false }
									panelName={ 'kb-testimonials-individual-settings' }
								>
									{ renderSettings }
								</KadencePanelBody>
							) }
						</InspectorControls>
					</Fragment>
				) }
				{ this.state.showPreset && (
					<div className="kt-select-starter-style-tabs kt-select-starter-style-infobox">
						<div className="kt-select-starter-style-tabs-title">
							{ __( 'Select Initial Style', 'kadence-blocks' ) }
						</div>
						<ButtonGroup className="kt-init-tabs-btn-group" aria-label={ __( 'Initial Style', 'kadence-blocks' ) }>
							{ map( startlayoutOptions, ( { name, key, icon } ) => (
								<Button
									key={ key }
									className="kt-inital-tabs-style-btn"
									isSmall
									onClick={ () => {
										setInitalLayout( key );
										this.setState( { showPreset: false } );
									} }
								>
									{ icon }
								</Button>
							) ) }
						</ButtonGroup>
					</div>
				) }
				{ ! this.state.showPreset && (
					<Fragment>
						{ layout && layout === 'carousel' && (
							<div className={ `kt-blocks-carousel kt-carousel-container-dotstyle-${ dotStyle }` } style={ {
								paddingRight: previewWrapperPaddingRight ? previewWrapperPaddingRight + ( wrapperPaddingType ? wrapperPaddingType : 'px' ) : undefined,
								paddingLeft: previewWrapperPaddingLeft ? previewWrapperPaddingLeft + ( wrapperPaddingType ? wrapperPaddingType : 'px' ) : undefined,
							} }>
								{ itemsCount !== 1 && (
									<Slider className={ `kt-carousel-arrowstyle-${ arrowStyle } kt-carousel-dotstyle-${ dotStyle }` } { ...sliderSettings }>
										{ times( itemsCount, n =>
											<div className="kt-blocks-testimonial-carousel-item" key={ n }>
												{ renderTestimonialPreview( n, true ) }
											</div>
										) }
									</Slider>
								) }
								{ itemsCount === 1 && (
									times( itemsCount, n => renderTestimonialPreview( n, true ) )
								) }
							</div>
						) }
						{ layout && layout === 'grid' && (
							<div className={ 'kt-testimonial-grid-wrap' } style={ {
								'grid-row-gap': columnGap + 'px',
								'grid-column-gap': columnGap + 'px',
								paddingTop: previewWrapperPaddingTop ? previewWrapperPaddingTop + ( wrapperPaddingType ? wrapperPaddingType : 'px' ) : undefined,
								paddingRight: previewWrapperPaddingRight ? previewWrapperPaddingRight + ( wrapperPaddingType ? wrapperPaddingType : 'px' ) : undefined,
								paddingBottom: previewWrapperPaddingBottom ? previewWrapperPaddingBottom + ( wrapperPaddingType ? wrapperPaddingType : 'px' ) : undefined,
								paddingLeft: previewWrapperPaddingLeft ? previewWrapperPaddingLeft + ( wrapperPaddingType ? wrapperPaddingType : 'px' ) : undefined,
							} }>
								{ times( itemsCount, n => renderTestimonialPreview( n ) ) }
							</div>
						) }
						{ displayTitle && titleFont[ 0 ].google && (
							<WebfontLoader config={ config }>
							</WebfontLoader>
						) }
						{ displayContent && contentFont[ 0 ].google && (
							<WebfontLoader config={ tconfig }>
							</WebfontLoader>
						) }
						{ displayName && nameFont[ 0 ].google && (
							<WebfontLoader config={ lconfig }>
							</WebfontLoader>
						) }
						{ displayOccupation && occupationFont[ 0 ].google && (
							<WebfontLoader config={ oconfig }>
							</WebfontLoader>
						) }
					</Fragment>
				) }
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
] )( KadenceTestimonials );
