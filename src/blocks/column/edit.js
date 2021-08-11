/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from '../../icons';

/**
 * Import Controls
 */
import MeasurementControls from '../../measurement-control';
import BoxShadowControl from '../../box-shadow-control';
import classnames from 'classnames';
import AdvancedPopColorControl from '../../advanced-pop-color-control';
import KadenceBackgroundControl from '../../components/background/background-control';
import KadenceColorOutput from '../../kadence-color-output';
import KadenceRange from '../../components/range/range-control';
import ResponsiveMeasuremenuControls from '../../components/measurement/responsive-measurement-control';
import ResponsiveAlignControls from '../../components/align/responsive-align-control';
import KadenceRadioButtons from '../../components/common/kadence-radio-buttons';
import SmallResponsiveControl from '../../components/responsive/small-responsive-control';
import VerticalAlignmentIcon from '../../components/common/vertical-align-icons';
import ResponsiveRangeControls from '../../components/range/responsive-range-control';
/**
 * Blocks Specific.
 */
import ColumnStyleCopyPaste from './copy-paste-style';

/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

const {
	Component,
	Fragment,
} = wp.element;
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { 
	InnerBlocks,
	BlockControls,
	InspectorAdvancedControls,
	InspectorControls,
} from '@wordpress/block-editor';
const {
	PanelBody,
	Panel,
	ToggleControl,
	SelectControl,
	ToolbarGroup,
} = wp.components;
const {
	applyFilters,
} = wp.hooks;
const ALLOWED_MEDIA_TYPES = [ 'image' ];
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktcolumnUniqueIDs = [];
/**
 * Build the spacer edit
 */
class KadenceColumn extends Component {
	constructor() {
		super( ...arguments );
		this.saveShadow = this.saveShadow.bind( this );
		this.showSettings = this.showSettings.bind( this );
		this.getPreviewSize = this.getPreviewSize.bind( this );
		this.state = {
			borderWidthControl: 'individual',
			borderRadiusControl: 'individual',
			mobilePaddingControl: 'individual',
			mobileMarginControl: 'individual',
			tabletPaddingControl: 'individual',
			tabletMarginControl: 'individual',
			deskPaddingControl: 'individual',
			deskMarginControl: 'individual',
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			// Before applying defaults lets check to see if the user wants it.
			if ( undefined === this.props.attributes.noCustomDefaults || ! this.props.attributes.noCustomDefaults ) {
				if ( blockConfigObject[ 'kadence/column' ] !== undefined && typeof blockConfigObject[ 'kadence/column' ] === 'object' ) {
					Object.keys( blockConfigObject[ 'kadence/column' ] ).map( ( attribute ) => {
						this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/column' ][ attribute ];
					} );
				}
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktcolumnUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( ktcolumnUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.attributes.uniqueID = '_' + this.props.clientId.substr( 2, 9 );
			ktcolumnUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			ktcolumnUniqueIDs.push( this.props.attributes.uniqueID );
		}
		if ( this.props.attributes.borderRadius && this.props.attributes.borderRadius[ 0 ] === this.props.attributes.borderRadius[ 1 ] && this.props.attributes.borderRadius[ 0 ] === this.props.attributes.borderRadius[ 2 ] && this.props.attributes.borderRadius[ 0 ] === this.props.attributes.borderRadius[ 3 ] ) {
			this.setState( { borderRadiusControl: 'linked' } );
		} else {
			this.setState( { borderRadiusControl: 'individual' } );
		}
		if ( this.props.attributes.kadenceDynamic && this.props.attributes.kadenceDynamic['backgroundImg:0:bgImg'] && this.props.attributes.kadenceDynamic['backgroundImg:0:bgImg'].enable ) {
			applyFilters( 'kadence.dynamicBackground', '', this.props.attributes, this.props.setAttributes, 'backgroundImg:0:bgImg' );
		}
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/column' ] !== undefined && typeof blockSettings[ 'kadence/column' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/column' ] } );
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
	saveShadow( value ) {
		const { attributes, setAttributes } = this.props;
		const { shadow } = attributes;

		const newItems = shadow.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			shadow: newItems,
		} );
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
		const { attributes: { id, topPadding, bottomPadding, leftPadding, rightPadding, topPaddingM, bottomPaddingM, leftPaddingM, rightPaddingM, topMargin, bottomMargin, topMarginM, bottomMarginM, leftMargin, rightMargin, leftMarginM, rightMarginM, topMarginT, bottomMarginT, leftMarginT, rightMarginT, topPaddingT, bottomPaddingT, leftPaddingT, rightPaddingT, backgroundOpacity, background, zIndex, border, borderWidth, borderOpacity, borderRadius, uniqueID, kadenceAnimation, kadenceAOSOptions, collapseOrder, backgroundImg, textAlign, textColor, linkColor, linkHoverColor, shadow, displayShadow, vsdesk, vstablet, vsmobile, paddingType, marginType, mobileBorderWidth, tabletBorderWidth, templateLock, kadenceBlockCSS, kadenceDynamic, direction, gutter, gutterUnit, verticalAlignment, justifyContent }, setAttributes, className, clientId } = this.props;
		const { borderWidthControl, borderRadiusControl, mobilePaddingControl, mobileMarginControl, tabletPaddingControl, tabletMarginControl, deskPaddingControl, deskMarginControl } = this.state;
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
		const gutterMax = ( gutterUnit !== 'px' ? 12 : 200 );
		const gutterStep = ( gutterUnit !== 'px' ? 0.1 : 1 );
		const marginMin = ( marginType === 'em' || marginType === 'rem' ? -2 : -200 );
		const marginMax = ( marginType === 'em' || marginType === 'rem' ? 12 : 200 );
		const marginStep = ( marginType === 'em' || marginType === 'rem' ? 0.1 : 1 );
		const paddingMin = ( paddingType === 'em' || paddingType === 'rem' ? 0 : 0 );
		const paddingMax = ( paddingType === 'em' || paddingType === 'rem' ? 12 : 200 );
		const paddingStep = ( paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1 );
		const previewPaddingType = ( undefined !== paddingType ? paddingType : 'px' );
		const previewMarginType = ( undefined !== marginType ? marginType : 'px' );
		const previewMarginTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== topMargin ? topMargin : '' ), ( undefined !== topMarginT ? topMarginT : '' ), ( undefined !== topMarginM ? topMarginM : '' ) );
		const previewMarginRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== rightMargin ? rightMargin : '' ), ( undefined !== rightMarginT ? rightMarginT : '' ), ( undefined !== rightMarginM ? rightMarginM : '' ) );
		const previewMarginBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== bottomMargin ? bottomMargin : '' ), ( undefined !== bottomMarginT ? bottomMarginT : '' ), ( undefined !== bottomMarginM ? bottomMarginM : '' ) );
		const previewMarginLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== leftMargin ? leftMargin : '' ), ( undefined !== leftMarginT ? leftMarginT : '' ), ( undefined !== leftMarginM ? leftMarginM : '' ) );
		const previewPaddingTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== topPadding ? topPadding : '' ), ( undefined !== topPaddingT ? topPaddingT : '' ), ( undefined !== topPaddingM ? topPaddingM : '' ) );
		const previewPaddingRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== rightPadding ? rightPadding : '' ), ( undefined !== rightPaddingT ? rightPaddingT : '' ), ( undefined !== rightPaddingM ? rightPaddingM : '' ) );
		const previewPaddingBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== bottomPadding ? bottomPadding : '' ), ( undefined !== bottomPaddingT ? bottomPaddingT : '' ), ( undefined !== bottomPaddingM ? bottomPaddingM : '' ) );
		const previewPaddingLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== leftPadding ? leftPadding : '' ), ( undefined !== leftPaddingT ? leftPaddingT : '' ), ( undefined !== leftPaddingM ? leftPaddingM : '' ) );
		const previewBorderTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== borderWidth ? borderWidth[ 0 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 0 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 0 ] : '' ) );
		const previewBorderRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== borderWidth ? borderWidth[ 1 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 1 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 1 ] : '' ) );
		const previewBorderBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== borderWidth ? borderWidth[ 2 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 2 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 2 ] : '' ) );
		const previewBorderLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== borderWidth ? borderWidth[ 3 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 3 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 3 ] : '' ) );
		const previewAlign = this.getPreviewSize( this.props.getPreviewDevice, ( textAlign && textAlign[ 0 ] ? textAlign[ 0 ] : '' ) , ( textAlign && textAlign[ 1 ] ? textAlign[ 1 ] : '' ), ( textAlign && textAlign[ 2 ] ? textAlign[ 2 ] : '' ) );
		const previewGutter = this.getPreviewSize( this.props.getPreviewDevice, ( gutter && '' !== gutter[ 0 ] ? gutter[ 0 ] : '' ) , ( gutter && '' !== gutter[ 1 ] ? gutter[ 1 ] : '' ), ( gutter && '' !== gutter[ 2 ] ? gutter[ 2 ] : '' ) );
		const previewDirection = this.getPreviewSize( this.props.getPreviewDevice, ( direction && '' !== direction[ 0 ] ? direction[ 0 ] : '' ) , ( direction && '' !== direction[ 1 ] ? direction[ 1 ] : '' ), ( direction && '' !== direction[ 2 ] ? direction[ 2 ] : '' ) );
		const previewJustify = this.getPreviewSize( this.props.getPreviewDevice, ( justifyContent && '' !== justifyContent[ 0 ] ? justifyContent[ 0 ] : '' ) , ( justifyContent && '' !== justifyContent[ 1 ] ? justifyContent[ 1 ] : '' ), ( justifyContent && '' !== justifyContent[ 2 ] ? justifyContent[ 2 ] : '' ) );
		const backgroundString = ( background ? KadenceColorOutput( background, backgroundOpacity ) : 'transparent' );
		const borderString = ( border ? KadenceColorOutput( border, borderOpacity ) : 'transparent' );
		const hasChildBlocks = wp.data.select( 'core/block-editor' ).getBlockOrder( clientId ).length > 0;
		const classes = classnames( {
			[ className ]: className,
			'kadence-column': true,
			[ `inner-column-${ id }` ]: id,
			[ `kadence-column-${ uniqueID }` ]: uniqueID,
			'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
			'kvs-md-false': vstablet !== 'undefined' && vstablet,
			'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
		} );
		const hasBackgroundImage = ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? true : false );
		const verticalAlignOptions = [
			[
				{
					icon: <VerticalAlignmentIcon value={ 'top' } isPressed={ ( verticalAlignment === 'top' ? true : false ) } />,
					title: __( 'Align Top', 'kadence-blocks' ),
					isActive: ( verticalAlignment === 'top' ? true : false ),
					onClick: () => setAttributes( { verticalAlignment: 'top' } ),
				},
			],
			[
				{
					icon: <VerticalAlignmentIcon value={ 'middle' } isPressed={ ( verticalAlignment === 'middle' ? true : false ) } />,
					title: __( 'Align Middle', 'kadence-blocks' ),
					isActive: ( verticalAlignment === 'middle' ? true : false ),
					onClick: () => setAttributes( { verticalAlignment: 'middle' } ),
				},
			],
			[
				{
					icon: <VerticalAlignmentIcon value={ 'bottom' } isPressed={ ( verticalAlignment === 'bottom' ? true : false ) } />,
					title: __( 'Align Bottom', 'kadence-blocks' ),
					isActive: ( verticalAlignment === 'bottom' ? true : false ),
					onClick: () => setAttributes( { verticalAlignment: 'bottom' } ),
				},
			],
		];
		return (
			<div className={ classes } >
				{ ( textColor || linkColor || linkHoverColor || ( undefined !== zIndex && '' !== zIndex ) || kadenceBlockCSS || ( '' !== previewGutter ) || '' !== previewJustify ) && (
					<style>
						{ ( ( undefined !== zIndex && '' !== zIndex ) ? `.kadence-column-${ uniqueID } { z-index: ${ zIndex }; }` : '' ) }
						{ ( textColor ? `.kadence-column-${ uniqueID }, .kadence-column-${ uniqueID } p, .kadence-column-${ uniqueID } h1, .kadence-column-${ uniqueID } h2, .kadence-column-${ uniqueID } h3, .kadence-column-${ uniqueID } h4, .kadence-column-${ uniqueID } h5, .kadence-column-${ uniqueID } h6 { color: ${ KadenceColorOutput( textColor ) }; }` : '' ) }
						{ ( linkColor ? `.kadence-column-${ uniqueID } a { color: ${ KadenceColorOutput( linkColor ) }; }` : '' ) }
						{ ( linkHoverColor ? `.kadence-column-${ uniqueID } a:hover { color: ${ KadenceColorOutput( linkHoverColor ) }; }` : '' ) }
						{ ( '' !== previewGutter ? `.kadence-column-${ uniqueID } .kadence-inner-column-direction-horizontal > .block-editor-inner-blocks > .block-editor-block-list__layout { margin-left: -${ previewGutter + ( gutterUnit ? gutterUnit : 'px' )}; }.kadence-column-${ uniqueID } .kadence-inner-column-direction-horizontal > .block-editor-inner-blocks > .block-editor-block-list__layout > .wp-block:not([data-type="kadence/advancedheading"]),.kadence-column-${ uniqueID } .kadence-inner-column-direction-horizontal > .block-editor-inner-blocks > .block-editor-block-list__layout > .block-editor-block-list__block:not([data-type="kadence/advancedheading"]), .kadence-column-${ uniqueID } .kadence-inner-column-direction-horizontal > .block-editor-inner-blocks > .block-editor-block-list__layout > .block-editor-block-list__block[data-type="kadence/advancedheading"] > * { margin-left: ${ previewGutter + ( gutterUnit ? gutterUnit : 'px' ) }; }` : '' ) }
						{ ( previewJustify ? `.kadence-column-${ uniqueID } > .kadence-inner-column-direction-horizontal > .block-editor-inner-blocks > .block-editor-block-list__layout { justify-content: ${ previewJustify }; }` : '' ) }
						{ ( previewJustify && ( 'space-around' == previewJustify || 'space-between' == previewJustify || 'space-evenly' == previewJustify ) ? `.kadence-column-${ uniqueID } > .kadence-inner-column-direction-horizontal > .block-editor-inner-blocks > .block-editor-block-list__layout > .block-list-appender { display:none; }` : '' ) }
						{ kadenceBlockCSS && (
							<Fragment>
								{ kadenceBlockCSS.replace( /selector/g, `kadence-column-${ uniqueID }` ) }
							</Fragment>
						) }
					</style>
				) }
				{ this.showSettings( 'allSettings' ) && (
					<Fragment>
						<BlockControls>
							<ToolbarGroup
								isCollapsed={ true }
								icon={ <VerticalAlignmentIcon value={ ( verticalAlignment ? verticalAlignment : ( direction && direction[ 0 ] && direction[ 0 ] === 'horizontal' ? 'middle' : 'top' ) ) } /> }
								label={ __( 'Vertical Align', 'kadence-blocks' )  }
								controls={ verticalAlignOptions }
							/>
							<ColumnStyleCopyPaste
								onPaste={ value => setAttributes( value ) }
								blockAttributes={ this.props.attributes }
							/>
						</BlockControls>
						<InspectorControls>
							<Panel
								className={ 'components-panel__body is-opened' }
							>
								{ this.showSettings( 'container' ) && (
									<Fragment>
										<AdvancedPopColorControl
											label={ __( 'Background Color', 'kadence-blocks' ) }
											colorValue={ ( background ? background : '' ) }
											colorDefault={ '' }
											opacityValue={ backgroundOpacity }
											onColorChange={ value => setAttributes( { background: value } ) }
											onOpacityChange={ value => setAttributes( { backgroundOpacity: value } ) }
										/>
										<KadenceBackgroundControl
											label={ __( 'Background Image', 'kadence-blocks' ) }
											hasImage={ hasBackgroundImage }
											imageURL={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' ) }
											imageID={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgID ? backgroundImg[ 0 ].bgImgID : '' ) }
											imagePosition={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgPosition ? backgroundImg[ 0 ].bgImgPosition : 'center center' ) }
											imageSize={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgSize ? backgroundImg[ 0 ].bgImgSize : 'cover' ) }
											imageRepeat={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgRepeat ? backgroundImg[ 0 ].bgImgRepeat : 'no-repeat' ) }
											imageAttachment={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgAttachment ? backgroundImg[ 0 ].bgImgAttachment : 'scroll' ) }
											onRemoveImage={ onRemoveBGImage }
											onSaveImage={ ( img ) => {
												saveBackgroundImage( {
													bgImgID: img.id,
													bgImg: img.url,
												} );
											} }
											onSaveURL={ ( newURL ) => {
												if ( newURL !== ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' ) ) {
													saveBackgroundImage( {
														bgImgID: undefined,
														bgImg: newURL,
													} );
												}
											} }
											onSavePosition={ value => saveBackgroundImage( { bgImgPosition: value } ) }
											onSaveSize={ value => saveBackgroundImage( { bgImgSize: value } ) }
											onSaveRepeat={ value => saveBackgroundImage( { bgImgRepeat: value } ) }
											onSaveAttachment={ value => saveBackgroundImage( { bgImgAttachment: value } ) }
											disableMediaButtons={ ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' ) }
											dynamicAttribute="backgroundImg:0:bgImg"
											{ ...this.props }
										/>
										<AdvancedPopColorControl
											label={ __( 'Border Color', 'kadence-blocks' ) }
											colorValue={ ( border ? border : '' ) }
											colorDefault={ '' }
											opacityValue={ borderOpacity }
											onColorChange={ value => setAttributes( { border: value } ) }
											onOpacityChange={ value => setAttributes( { borderOpacity: value } ) }
										/>
										<ResponsiveMeasuremenuControls
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
										<BoxShadowControl
											label={ __( 'Box Shadow', 'kadence-blocks' ) }
											enable={ ( undefined !== displayShadow ? displayShadow : false ) }
											color={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].color ? shadow[ 0 ].color : '#000000' ) }
											colorDefault={ '#000000' }
											opacity={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].opacity ? shadow[ 0 ].opacity : 0.2 ) }
											hOffset={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].hOffset ? shadow[ 0 ].hOffset : 0 ) }
											vOffset={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].vOffset ? shadow[ 0 ].vOffset : 0 ) }
											blur={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].blur ? shadow[ 0 ].blur : 14 ) }
											spread={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].spread ? shadow[ 0 ].spread : 0 ) }
											inset={ ( undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].inset ? shadow[ 0 ].inset : false ) }
											onEnableChange={ value => {
												setAttributes( {
													displayShadow: value,
												} );
											} }
											onColorChange={ value => {
												this.saveShadow( { color: value } );
											} }
											onOpacityChange={ value => {
												this.saveShadow( { opacity: value } );
											} }
											onHOffsetChange={ value => {
												this.saveShadow( { hOffset: value } );
											} }
											onVOffsetChange={ value => {
												this.saveShadow( { vOffset: value } );
											} }
											onBlurChange={ value => {
												this.saveShadow( { blur: value } );
											} }
											onSpreadChange={ value => {
												this.saveShadow( { spread: value } );
											} }
											onInsetChange={ value => {
												this.saveShadow( { inset: value } );
											} }
										/>
									</Fragment>
								) }
								{ this.showSettings( 'textAlign' ) && (
									<Fragment>
										<SmallResponsiveControl
											label={ __( 'Inner Block Direction', 'kadence-blocks' ) }
											desktopChildren={ <KadenceRadioButtons
												//label={ __( 'Inner Block Direction', 'kadence-blocks' ) }
												value={ ( direction && direction[ 0 ] ? direction[ 0 ] : 'vertical' ) }
												options={ [
													{ value: 'vertical', label: __( 'Vertical', 'kadence-blocks' ) },
													{ value: 'horizontal', label: __( 'Horizontal', 'kadence-blocks' ) },
												] }
												onChange={ value => setAttributes( { direction: [ value, ( direction && direction[ 1 ] ? direction[ 1 ] : '' ), ( direction && direction[ 2 ] ? direction[ 2 ] : '' ) ] } ) }
											/> }
											tabletChildren={ <KadenceRadioButtons
												//label={ __( 'Inner Block Direction', 'kadence-blocks' ) }
												value={  ( direction && direction[ 1 ] ? direction[ 1 ] : '' ) }
												options={ [
													{ value: 'vertical', label: __( 'Vertical', 'kadence-blocks' ) },
													{ value: 'horizontal', label: __( 'Horizontal', 'kadence-blocks' ) },
												] }
												onChange={ value => setAttributes( { direction: [ ( direction && direction[ 0 ] ? direction[ 0 ] : 'vertical' ), value, ( direction && direction[ 2 ] ? direction[ 2 ] : '' ) ] } ) }
											/> }
											mobileChildren={ <KadenceRadioButtons
												//label={ __( 'Inner Block Direction', 'kadence-blocks' ) }
												value={  ( direction && direction[ 2 ] ? direction[ 2 ] : '' ) }
												options={ [
													{ value: 'vertical', label: __( 'Vertical', 'kadence-blocks' ) },
													{ value: 'horizontal', label: __( 'Horizontal', 'kadence-blocks' ) },
												] }
												onChange={ value => setAttributes( { direction: [ ( direction && direction[ 0 ] ? direction[ 0 ] : 'vertical' ), ( direction && direction[ 1 ] ? direction[ 1 ] : '' ), value ] } ) }
											/> }
										/>
										{ ( previewDirection ? previewDirection : 'vertical' ) === 'horizontal' && (
											<Fragment>
												<ResponsiveRangeControls
													label={ __( 'Default Horizontal Block Gap', 'kadence-blocks' ) }
													value={ ( gutter && '' !== gutter[ 0 ] ? gutter[ 0 ] : 10 ) }
													onChange={ value => setAttributes( { gutter: [ value, ( gutter && gutter[ 1 ] ? gutter[ 1 ] : '' ), ( gutter && gutter[ 2 ] ? gutter[ 2 ] : '' ) ] } ) }
													tabletValue={ ( gutter && '' !== gutter[ 1 ] ? gutter[ 1 ] : '' ) }
													onChangeTablet={ value => setAttributes( { gutter: [ ( gutter && gutter[ 0 ] ? gutter[ 0 ] : 10 ), value, ( gutter && gutter[ 2 ] ? gutter[ 2 ] : '' ) ] } ) }
													mobileValue={ ( gutter && '' !== gutter[ 2 ] ? gutter[ 2 ] : '' ) }
													onChangeMobile={ value => setAttributes( { gutter: [ ( gutter && gutter[ 0 ] ? gutter[ 0 ] : 10 ), ( gutter && gutter[ 2 ] ? gutter[ 2 ] : '' ), value ] } ) }
													min={ 0 }
													max={ gutterMax }
													step={ gutterStep }
													unit={ gutterUnit }
													onUnit={ ( value ) => setAttributes( { gutterUnit: value } ) }
													units={ [ 'px', 'em', 'rem' ] }
												/>
												<SmallResponsiveControl
													label={ __( 'Justify Content', 'kadence-blocks' ) }
													desktopChildren={ <SelectControl
														//label={ __( 'Justify Content', 'kadence-blocks' ) }
														value={ ( justifyContent && justifyContent[ 0 ] ? justifyContent[ 0 ] : '' ) }
														options={ [
															{ value: '', label: __( 'Inherit', 'kadence-blocks' ) },
															{ value: 'flex-start', label: __( 'Start', 'kadence-blocks' ) },
															{ value: 'center', label: __( 'Center', 'kadence-blocks' ) },
															{ value: 'flex-end', label: __( 'End', 'kadence-blocks' ) },
															{ value: 'space-between', label: __( 'Space Between', 'kadence-blocks' ) },
															{ value: 'space-around', label: __( 'Space Around', 'kadence-blocks' ) },
															{ value: 'space-evenly', label: __( 'Space Evenly', 'kadence-blocks' ) },
														] }
														onChange={ value => setAttributes( { justifyContent: [ value, ( justifyContent && justifyContent[ 1 ] ? justifyContent[ 1 ] : '' ), ( justifyContent && justifyContent[ 2 ] ? justifyContent[ 2 ] : '' ) ] } ) }
													/> }
													tabletChildren={ <SelectControl
														//label={ __( 'Justify Content', 'kadence-blocks' ) }
														value={ ( justifyContent && justifyContent[ 1 ] ? justifyContent[ 1 ] : '' ) }
														options={ [
															{ value: '', label: __( 'Inherit', 'kadence-blocks' ) },
															{ value: 'flex-start', label: __( 'Start', 'kadence-blocks' ) },
															{ value: 'center', label: __( 'Center', 'kadence-blocks' ) },
															{ value: 'flex-end', label: __( 'End', 'kadence-blocks' ) },
															{ value: 'space-between', label: __( 'Space Between', 'kadence-blocks' ) },
															{ value: 'space-around', label: __( 'Space Around', 'kadence-blocks' ) },
															{ value: 'space-evenly', label: __( 'Space Evenly', 'kadence-blocks' ) },
														] }
														onChange={ value => setAttributes( { justifyContent: [ ( justifyContent && justifyContent[ 0 ] ? justifyContent[ 0 ] : '' ), value, ( justifyContent && justifyContent[ 2 ] ? justifyContent[ 2 ] : '' ) ] } ) }
													/> }
													mobileChildren={ <SelectControl
														//label={ __( 'Justify Content', 'kadence-blocks' ) }
														value={ ( justifyContent && justifyContent[ 2 ] ? justifyContent[ 2 ] : '' ) }
														options={ [
															{ value: '', label: __( 'Inherit', 'kadence-blocks' ) },
															{ value: 'flex-start', label: __( 'Start', 'kadence-blocks' ) },
															{ value: 'center', label: __( 'Center', 'kadence-blocks' ) },
															{ value: 'flex-end', label: __( 'End', 'kadence-blocks' ) },
															{ value: 'space-between', label: __( 'Space Between', 'kadence-blocks' ) },
															{ value: 'space-around', label: __( 'Space Around', 'kadence-blocks' ) },
															{ value: 'space-evenly', label: __( 'Space Evenly', 'kadence-blocks' ) },
														] }
														onChange={ value => setAttributes( { justifyContent: [ ( justifyContent && justifyContent[ 0 ] ? justifyContent[ 0 ] : '' ), ( justifyContent && justifyContent[ 1 ] ? justifyContent[ 1 ] : '' ), value ] } ) }
													/> }
												/>
											</Fragment>
										) }
										<ResponsiveAlignControls
											label={ __( 'Text Alignment', 'kadence-blocks' ) }
											value={ ( textAlign && textAlign[ 0 ] ? textAlign[ 0 ] : '' ) }
											mobileValue={ ( textAlign && textAlign[ 2 ] ? textAlign[ 2 ] : '' ) }
											tabletValue={ ( textAlign && textAlign[ 1 ] ? textAlign[ 1 ] : '' ) }
											onChange={ ( nextAlign ) => setAttributes( { textAlign: [ nextAlign, ( textAlign && textAlign[ 1 ] ? textAlign[ 1 ] : '' ), ( textAlign && textAlign[ 2 ] ? textAlign[ 2 ] : '' ) ] } ) }
											onChangeTablet={ ( nextAlign ) => setAttributes( { textAlign: [ ( textAlign && textAlign[ 0 ] ? textAlign[ 0 ] : '' ), nextAlign, ( textAlign && textAlign[ 2 ] ? textAlign[ 2 ] : '' ) ] } ) }
											onChangeMobile={ ( nextAlign ) => setAttributes( { textAlign: [ ( textAlign && textAlign[ 0 ] ? textAlign[ 0 ] : '' ), ( textAlign && textAlign[ 1 ] ? textAlign[ 1 ] : '' ), nextAlign ] } ) }
										/>
									</Fragment>
								) }
								{ this.showSettings( 'textColor' ) && (
									<Fragment>
										<div className="kt-spacer-sidebar-15"></div>
										<PanelBody
											title={ __( 'Text Color Settings' ) }
											initialOpen={ false }
										>
											<AdvancedPopColorControl
												label={ __( 'Text Color' ) }
												colorValue={ ( textColor ? textColor : '' ) }
												colorDefault={ '' }
												onColorChange={ value => setAttributes( { textColor: value } ) }
											/>
											<AdvancedPopColorControl
												label={ __( 'Link Color' ) }
												colorValue={ ( linkColor ? linkColor : '' ) }
												colorDefault={ '' }
												onColorChange={ value => setAttributes( { linkColor: value } ) }
											/>
											<AdvancedPopColorControl
												label={ __( 'Link Hover Color' ) }
												colorValue={ ( linkHoverColor ? linkHoverColor : '' ) }
												colorDefault={ '' }
												onColorChange={ value => setAttributes( { linkHoverColor: value } ) }
											/>
										</PanelBody>
									</Fragment>
								) }
								{ this.showSettings( 'paddingMargin' ) && (
									<Fragment>
										<div className="kt-spacer-sidebar-15"></div>
										<ResponsiveMeasuremenuControls
											label={ __( 'Padding', 'kadence-blocks' ) }
											control={ deskPaddingControl }
											tabletControl={ tabletPaddingControl }
											mobileControl={ mobilePaddingControl }
											value={ [ ( undefined !== topPadding ? topPadding : '' ), ( undefined !== rightPadding ? rightPadding : '' ), ( undefined !== bottomPadding ? bottomPadding : '' ), ( undefined !== leftPadding ? leftPadding : '' ) ] }
											tabletValue={ [ ( undefined !== topPaddingT ? topPaddingT : '' ), ( undefined !== rightPaddingT ? rightPaddingT : '' ), ( undefined !== bottomPaddingT ? bottomPaddingT : '' ), ( undefined !== leftPaddingT ? leftPaddingT : '' ) ] }
											mobileValue={ [ ( undefined !== topPaddingM ? topPaddingM : '' ), ( undefined !== rightPaddingM ? rightPaddingM : '' ), ( undefined !== bottomPaddingM ? bottomPaddingM : '' ), ( undefined !== leftPaddingM ? leftPaddingM : '' ) ] }
											onChange={ ( value ) => {
												setAttributes( { topPadding: value[ 0 ], rightPadding: value[ 1 ], bottomPadding: value[ 2 ], leftPadding: value[ 3 ] } );
											} }
											onChangeTablet={ ( value ) => {
												setAttributes( { topPaddingT: value[ 0 ], rightPaddingT: value[ 1 ], bottomPaddingT: value[ 2 ], leftPaddingT: value[ 3 ] } );
											} }
											onChangeMobile={ ( value ) => {
												setAttributes( { topPaddingM: value[ 0 ], rightPaddingM: value[ 1 ], bottomPaddingM: value[ 2 ], leftPaddingM: value[ 3 ] } );
											} }
											onChangeControl={ ( value ) => this.setState( { deskPaddingControl: value } ) }
											onChangeTabletControl={ ( value ) => this.setState( { tabletPaddingControl: value } ) }
											onChangeMobileControl={ ( value ) => this.setState( { mobilePaddingControl: value } ) }
											allowEmpty={ true }
											min={ paddingMin }
											max={ paddingMax }
											step={ paddingStep }
											unit={ paddingType }
											units={ [ 'px', 'em', 'rem', '%' ] }
											onUnit={ ( value ) => setAttributes( { paddingType: value } ) }
										/>
										<ResponsiveMeasuremenuControls
											label={ __( 'Margin', 'kadence-blocks' ) }
											control={ deskMarginControl }
											tabletControl={ tabletMarginControl }
											mobileControl={ mobileMarginControl }
											value={ [ ( undefined !== topMargin ? topMargin : '' ), ( undefined !== rightMargin ? rightMargin : '' ), ( undefined !== bottomMargin ? bottomMargin : '' ), ( undefined !== leftMargin ? leftMargin : '' ) ] }
											tabletValue={ [ ( undefined !== topMarginT ? topMarginT : '' ), ( undefined !== rightMarginT ? rightMarginT : '' ), ( undefined !== bottomMarginT ? bottomMarginT : '' ), ( undefined !== leftMarginT ? leftMarginT : '' ) ] }
											mobileValue={ [ ( undefined !== topMarginM ? topMarginM : '' ), ( undefined !== rightMarginM ? rightMarginM : '' ), ( undefined !== bottomMarginM ? bottomMarginM : '' ), ( undefined !== leftMarginM ? leftMarginM : '' ) ] }
											onChange={ ( value ) => {
												setAttributes( { topMargin: value[ 0 ], rightMargin: value[ 1 ], bottomMargin: value[ 2 ], leftMargin: value[ 3 ] } );
											} }
											onChangeTablet={ ( value ) => {
												setAttributes( { topMarginT: value[ 0 ], rightMarginT: value[ 1 ], bottomMarginT: value[ 2 ], leftMarginT: value[ 3 ] } );
											} }
											onChangeMobile={ ( value ) => {
												setAttributes( { topMarginM: value[ 0 ], rightMarginM: value[ 1 ], bottomMarginM: value[ 2 ], leftMarginM: value[ 3 ] } );
											} }
											onChangeControl={ ( value ) => this.setState( { deskMarginControl: value } ) }
											onChangeTabletControl={ ( value ) => this.setState( { tabletMarginControl: value } ) }
											onChangeMobileControl={ ( value ) => this.setState( { mobileMarginControl: value } ) }
											allowEmpty={ true }
											min={ marginMin }
											max={ marginMax }
											step={ marginStep }
											unit={ marginType }
											units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
											onUnit={ ( value ) => setAttributes( { marginType: value } ) }
										/>
									</Fragment>
								) }
							</Panel>
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
				<InspectorAdvancedControls>
					<KadenceRange
						label={ __( 'Z Index Control' ) }
						value={ zIndex }
						onChange={ ( value ) => {
							setAttributes( {
								zIndex: value,
							} );
						} }
						min={ -200 }
						max={ 200 }
					/>
					<KadenceRange
						label={ __( 'Mobile Collapse Order' ) }
						value={ collapseOrder }
						onChange={ ( value ) => {
							setAttributes( {
								collapseOrder: value,
							} );
						} }
						min={ -10 }
						max={ 10 }
					/>
				</InspectorAdvancedControls>
				<div id={ `animate-id${ uniqueID }` } className={ `kadence-inner-column-inner aos-animate kt-animation-wrap kadence-inner-column-direction-${ ( previewDirection ? previewDirection : 'vertical' ) } kadence-inner-column-text-align-${ previewAlign ? previewAlign : 'normal' } kadence-inner-column-vertical-align-${ verticalAlignment ? verticalAlignment : 'inherit' }` } data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) } data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) } data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) } style={ {
					paddingLeft: ( undefined !== previewPaddingLeft ? previewPaddingLeft + previewPaddingType : undefined ),
					paddingRight: ( undefined !== previewPaddingRight ? previewPaddingRight + previewPaddingType : undefined ),
					paddingTop: ( undefined !== previewPaddingTop ? previewPaddingTop + previewPaddingType : undefined ),
					paddingBottom: ( undefined !== previewPaddingBottom ? previewPaddingBottom + previewPaddingType : undefined ),
					marginLeft: ( undefined !== previewMarginLeft ? previewMarginLeft + previewMarginType : undefined ),
					marginRight: ( undefined !== previewMarginRight ? previewMarginRight + previewMarginType : undefined ),
					marginTop: ( undefined !== previewMarginTop ? previewMarginTop + previewMarginType : undefined ),
					marginBottom: ( undefined !== previewMarginBottom ? previewMarginBottom + previewMarginType : undefined ),
					textAlign: ( previewAlign ? previewAlign : undefined ),
					backgroundColor: backgroundString,
					backgroundImage: ( hasBackgroundImage ? `url( ${ backgroundImg[ 0 ].bgImg} )` : undefined ),
					backgroundSize: ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgSize ? backgroundImg[ 0 ].bgImgSize : undefined ),
					backgroundPosition: ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgPosition ? backgroundImg[ 0 ].bgImgPosition : undefined ),
					backgroundRepeat: ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgRepeat ? backgroundImg[ 0 ].bgImgRepeat : undefined ),
					backgroundAttachment: ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImgAttachment ? backgroundImg[ 0 ].bgImgAttachment : undefined ),
					borderColor: borderString,
					borderRadius: ( borderRadius ? borderRadius[ 0 ] + 'px ' + borderRadius[ 1 ] + 'px ' + borderRadius[ 2 ] + 'px ' + borderRadius[ 3 ] + 'px' : '' ),
					borderTopWidth: ( previewBorderTop ? previewBorderTop + 'px' : undefined ),
					borderRightWidth: ( previewBorderRight ? previewBorderRight + 'px' : undefined ),
					borderBottomWidth: ( previewBorderBottom ? previewBorderBottom + 'px' : undefined ),
					borderLeftWidth: ( previewBorderLeft ? previewBorderLeft + 'px' : undefined ),
					boxShadow: ( undefined !== displayShadow && displayShadow && undefined !== shadow && undefined !== shadow[ 0 ] && undefined !== shadow[ 0 ].color ? ( undefined !== shadow[ 0 ].inset && shadow[ 0 ].inset ? 'inset ' : '' ) + ( undefined !== shadow[ 0 ].hOffset ? shadow[ 0 ].hOffset : 0 ) + 'px ' + ( undefined !== shadow[ 0 ].vOffset ? shadow[ 0 ].vOffset : 0 ) + 'px ' + ( undefined !== shadow[ 0 ].blur ? shadow[ 0 ].blur : 14 ) + 'px ' + ( undefined !== shadow[ 0 ].spread ? shadow[ 0 ].spread : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== shadow[ 0 ].color ? shadow[ 0 ].color : '#000000' ), ( undefined !== shadow[ 0 ].opacity ? shadow[ 0 ].opacity : 1 ) ) : undefined ),
				} } >
					<InnerBlocks
						orientation={ ( direction && direction[ 0 ] ? direction[ 0 ] : 'vertical' ) }
						templateLock={ templateLock ? templateLock : false }
						renderAppender={ (
							hasChildBlocks ?
								undefined :
								InnerBlocks.ButtonBlockAppender
						) }
					/>
				</div>
			</div>
		);
	}
}
//export default ( KadenceColumn );
export default compose( [
	withSelect( ( select, ownProps ) => {
		const {
			__experimentalGetPreviewDeviceType = null,
		} = select( 'core/edit-post' );
		return {
			getPreviewDevice: __experimentalGetPreviewDeviceType ? __experimentalGetPreviewDeviceType() : 'Desktop',
		};
	} ),
] )( KadenceColumn );
