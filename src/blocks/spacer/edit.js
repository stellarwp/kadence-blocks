/**
 * BLOCK: Kadence Spacer
 *
 * Registering a basic block with Gutenberg.
 */

import SvgPattern from './svg-pattern';
import ResponsiveAlignControls from '../../components/align/responsive-align-control';
import KadenceColorOutput from '../../components/color/kadence-color-output';
import ResponsiveRangeControls from '../../components/range/responsive-range-control';
import KadencePanelBody from '../../components/KadencePanelBody'
import PopColorControl from '../../components/color/pop-color-control';
/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	Component,
	Fragment,
	renderToString,
} = wp.element;
const {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.blockEditor;
const {
	ToggleControl,
	RangeControl,
	SelectControl,
	ResizableBox,
} = wp.components;
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const ktspacerUniqueIDs = [];
/**
 * Build the spacer edit
 */
class KadenceSpacerDivider extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const oldBlockConfig = kadence_blocks_params.config && kadence_blocks_params.config[ 'kadence/spacer' ] ? kadence_blocks_params.config[ 'kadence/spacer' ] : undefined;
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/spacer' ] !== undefined && typeof blockConfigObject[ 'kadence/spacer' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/spacer' ] ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/spacer' ][ attribute ];
				} );
			} else if ( oldBlockConfig !== undefined && typeof oldBlockConfig === 'object' ) {
				Object.keys( oldBlockConfig ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = oldBlockConfig[ attribute ];
				} );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktspacerUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( ktspacerUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.attributes.uniqueID = '_' + this.props.clientId.substr( 2, 9 );
			ktspacerUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			ktspacerUniqueIDs.push( this.props.attributes.uniqueID );
		}
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/spacer' ] !== undefined && typeof blockSettings[ 'kadence/spacer' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/spacer' ] } );
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
			if ( undefined !== mobileSize && '' !== mobileSize && null !== mobileSize ) {
				return mobileSize;
			} else if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		} else if ( device === 'Tablet' ) {
			if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		}
		return desktopSize;
	}
	render() {
		const { attributes: { blockAlignment, spacerHeight, tabletSpacerHeight, mobileSpacerHeight, dividerEnable, dividerStyle, dividerColor, dividerOpacity, dividerHeight, dividerWidth, hAlign, uniqueID, spacerHeightUnits, rotate, strokeWidth, strokeGap, mobileHAlign, tabletHAlign, dividerWidthUnits, tabletDividerWidth, mobileDividerWidth, tabletDividerHeight, mobileDividerHeight, vsdesk, vstablet, vsmobile }, className, setAttributes, toggleSelection } = this.props;
		let alp;
		if ( dividerOpacity < 10 ) {
			alp = '0.0' + dividerOpacity;
		} else if ( dividerOpacity >= 100 ) {
			alp = '1';
		} else {
			alp = '0.' + dividerOpacity;
		}
		const editorDocument = document.querySelector( 'iframe[name="editor-canvas"]' )?.contentWindow.document || document;
		const dividerBorderColor = ( ! dividerColor ? KadenceColorOutput( '#eeeeee', alp ) : KadenceColorOutput( dividerColor, alp ) );
		let svgStringPre = renderToString( <SvgPattern uniqueID={ uniqueID } color={ KadenceColorOutput( dividerColor ) } opacity={ dividerOpacity } rotate={ rotate } strokeWidth={ strokeWidth } strokeGap={ strokeGap } /> );
		svgStringPre = svgStringPre.replace( 'patterntransform', 'patternTransform' );
		svgStringPre = svgStringPre.replace( 'patternunits', 'patternUnits' );
		const previewHeight = this.getPreviewSize( this.props.getPreviewDevice, ( '' !== spacerHeight ? spacerHeight : 60 ), ( '' !== tabletSpacerHeight ? tabletSpacerHeight : '' ), ( '' !== mobileSpacerHeight ? mobileSpacerHeight : '' ) );
		const previewHAlign = this.getPreviewSize( this.props.getPreviewDevice, ( '' !== hAlign ? hAlign : '' ), ( '' !== tabletHAlign ? tabletHAlign : '' ), ( '' !== mobileHAlign ? mobileHAlign : '' ) );
		const minD = ( dividerStyle !== 'stripe' ? 1 : 10 );
		const maxD = ( dividerStyle !== 'stripe' ? 400 : 60 );
		const previewDividerHeight = this.getPreviewSize( this.props.getPreviewDevice, ( '' !== dividerHeight ? dividerHeight : 1 ), ( '' !== tabletDividerHeight ? tabletDividerHeight : '' ), ( '' !== mobileDividerHeight ? mobileDividerHeight : '' ) );
		const previewDividerWidth = this.getPreviewSize( this.props.getPreviewDevice, ( '' !== dividerWidth ? dividerWidth : 1 ), ( '' !== tabletDividerWidth ? tabletDividerWidth : '' ), ( '' !== mobileDividerWidth ? mobileDividerWidth : '' ) );
		return (
			<div className={ className }>
				{ this.showSettings( 'spacerDivider' ) && (
					<Fragment>
						<BlockControls key="controls">
							<BlockAlignmentToolbar
								value={ blockAlignment }
								controls={ [ 'center', 'wide', 'full' ] }
								onChange={ value => setAttributes( { blockAlignment: value } ) }
							/>
							<AlignmentToolbar
								value={ hAlign }
								onChange={ value => setAttributes( { hAlign: value } ) }
							/>
						</BlockControls>
						<InspectorControls>
							<KadencePanelBody
								title={ __( 'Spacer Settings', 'kadence-blocks' ) }
								initialOpen={ true }
								panelName={ 'kb-spacer-settings' }
							>
								{ this.showSettings( 'spacerHeight' ) && (
									<ResponsiveRangeControls
										label={ __( 'Height', 'kadence-blocks' ) }
										value={ spacerHeight }
										onChange={ value => setAttributes( { spacerHeight: value } ) }
										tabletValue={ ( tabletSpacerHeight ? tabletSpacerHeight : '' ) }
										onChangeTablet={ ( value ) => setAttributes( { tabletSpacerHeight: value } ) }
										mobileValue={ ( mobileSpacerHeight ? mobileSpacerHeight : '' ) }
										onChangeMobile={ ( value ) => setAttributes( { mobileSpacerHeight: value } ) }
										min={ 6 }
										max={ 600 }
										step={ 1 }
										unit={ spacerHeightUnits }
										onUnit={ this.showSettings( 'spacerHeightUnits' ) ? ( value ) => setAttributes( { spacerHeightUnits: value } ) : false }
										units={ [ 'px', 'vh' ] }
									/>
								) }
							</KadencePanelBody>
							<KadencePanelBody
								title={ __( 'Divider Settings', 'kadence-blocks' ) }
								initialOpen={ true }
								panelName={ 'kb-divider-settings' }
							>
								{ this.showSettings( 'dividerToggle' ) && (
									<ToggleControl
										label={ __( 'Enable Divider', 'kadence-blocks' ) }
										checked={ dividerEnable }
										onChange={ value => setAttributes( { dividerEnable: value } ) }
									/>
								) }
								{ dividerEnable && this.showSettings( 'dividerStyles' ) && (
									<Fragment>
										<ResponsiveAlignControls
											label={ __( 'Alignment', 'kadence-blocks' ) }
											value={ ( hAlign ? hAlign : '' ) }
											mobileValue={ ( mobileHAlign ? mobileHAlign : '' ) }
											tabletValue={ ( tabletHAlign ? tabletHAlign : '' ) }
											onChange={ ( nextAlign ) => setAttributes( { hAlign: nextAlign } ) }
											onChangeTablet={ ( nextAlign ) => setAttributes( { tabletHAlign: nextAlign } ) }
											onChangeMobile={ ( nextAlign ) => setAttributes( { mobileHAlign: nextAlign } ) }
										/>
										<SelectControl
											label={ __( 'Divider Style', 'kadence-blocks' ) }
											value={ dividerStyle }
											options={ [
												{ value: 'solid', label: __( 'Solid', 'kadence-blocks' ) },
												{ value: 'dashed', label: __( 'Dashed', 'kadence-blocks' ) },
												{ value: 'dotted', label: __( 'Dotted', 'kadence-blocks' ) },
												{ value: 'stripe', label: __( 'Stripe', 'kadence-blocks' ) },
											] }
											onChange={ value => setAttributes( { dividerStyle: value } ) }
										/>
										<PopColorControl
											label={ __( 'Divider Color', 'kadence-blocks' ) }
											value={ ( dividerColor ? dividerColor : '' ) }
											default={ '' }
											opacityValue={ dividerOpacity }
											onChange={ value => setAttributes( { dividerColor: value } ) }
											onOpacityChange={ value => setAttributes( { dividerOpacity: value } ) }
											opacityUnit={ 100 }
										/>
										{ 'stripe' === dividerStyle && (
											<Fragment>
												<RangeControl
													label={ __( 'Stripe Angle', 'kadence-blocks' ) }
													value={ rotate }
													onChange={ value => setAttributes( { rotate: value } ) }
													min={ 0 }
													max={ 135 }
												/>
												<RangeControl
													label={ __( 'Stripe Width', 'kadence-blocks' ) }
													value={ strokeWidth }
													onChange={ value => setAttributes( { strokeWidth: value } ) }
													min={ 1 }
													max={ 30 }
												/>
												<RangeControl
													label={ __( 'Stripe Gap', 'kadence-blocks' ) }
													value={ strokeGap }
													onChange={ value => setAttributes( { strokeGap: value } ) }
													min={ 1 }
													max={ 30 }
												/>
											</Fragment>
										) }
										<ResponsiveRangeControls
											label={ __( 'Divider Height', 'kadence-blocks' ) }
											value={ dividerHeight }
											onChange={ value => setAttributes( { dividerHeight: value } ) }
											tabletValue={ ( tabletDividerHeight ? tabletDividerHeight : '' ) }
											onChangeTablet={ ( value ) => setAttributes( { tabletDividerHeight: value } ) }
											mobileValue={ ( mobileDividerHeight ? mobileDividerHeight : '' ) }
											onChangeMobile={ ( value ) => setAttributes( { mobileDividerHeight: value } ) }
											min={ minD }
											max={ maxD }
											step={ 1 }
											unit={ 'px' }
										/>
										<ResponsiveRangeControls
											label={ __( 'Divider Width', 'kadence-blocks' ) }
											value={ dividerWidth }
											onChange={ value => setAttributes( { dividerWidth: value } ) }
											tabletValue={ ( tabletDividerWidth ? tabletDividerWidth : '' ) }
											onChangeTablet={ ( value ) => setAttributes( { tabletDividerWidth: value } ) }
											mobileValue={ ( mobileDividerWidth ? mobileDividerWidth : '' ) }
											onChangeMobile={ ( value ) => setAttributes( { mobileDividerWidth: value } ) }
											min={ 0 }
											max={ ( dividerWidthUnits == 'px' ? 3000 : 100 ) }
											step={ 1 }
											unit={ dividerWidthUnits }
											onUnit={ ( value ) => setAttributes( { dividerWidthUnits: value } ) }
											units={ [ 'px', '%' ] }
										/>
									</Fragment>
								) }
							</KadencePanelBody>
							<KadencePanelBody
								title={ __( 'Visibility Settings', 'kadence-blocks' ) }
								initialOpen={ false }
								panelName={ 'kb-visibility-settings' }
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
				<div className={ `kt-block-spacer kt-block-spacer-halign-${ previewHAlign }` }>
					{ dividerEnable && (
						<Fragment>
							{ dividerStyle === 'stripe' && (
								<span className="kt-divider-stripe" style={ {
									height: ( previewDividerHeight < 10 ? 10 : previewDividerHeight ) + 'px',
									width: previewDividerWidth + ( dividerWidthUnits ? dividerWidthUnits : '%' ),
								} }>
									<SvgPattern uniqueID={ uniqueID } color={ KadenceColorOutput( dividerColor ) } opacity={ dividerOpacity } rotate={ rotate } strokeWidth={ strokeWidth } strokeGap={ strokeGap } />
								</span>
							) }
							{ dividerStyle !== 'stripe' && (
								<hr className="kt-divider" style={ {
									borderTopColor: dividerBorderColor,
									borderTopWidth: previewDividerHeight + 'px',
									width: previewDividerWidth + ( dividerWidthUnits ? dividerWidthUnits : '%' ),
									borderTopStyle: dividerStyle,
								} } />
							) }
						</Fragment>
					) }
					{ spacerHeightUnits && 'vh' === spacerHeightUnits && (
						<div className="kt-spacer-height-preview" style={ {
							height: spacerHeight + ( spacerHeightUnits ? spacerHeightUnits : 'px' ),
						} } >
							<span id={ `spacing-height-${ uniqueID }` } >
								{ spacerHeight + ( spacerHeightUnits ? spacerHeightUnits : 'px' ) }
							</span>
						</div>
					) }
					{ 'vh' !== spacerHeightUnits && this.showSettings( 'spacerDivider' ) && this.showSettings( 'spacerHeight' ) && (
						<ResizableBox
							size={ {
								height: previewHeight,
							} }
							minHeight="20"
							handleClasses={ {
								top: 'kadence-spacer__resize-handler-top',
								bottom: 'kadence-spacer__resize-handler-bottom',
							} }
							enable={ {
								top: false,
								right: false,
								bottom: true,
								left: false,
								topRight: false,
								bottomRight: false,
								bottomLeft: false,
								topLeft: false,
							} }
							onResize={ ( event, direction, elt, delta ) => {
								editorDocument.getElementById( 'spacing-height-' + ( uniqueID ? uniqueID : 'no-unique' ) ).innerHTML = parseInt( previewHeight + delta.height, 10 ) + ( spacerHeightUnits ? spacerHeightUnits : 'px' );
							} }
							onResizeStop={ ( event, direction, elt, delta ) => {
								toggleSelection( true );
								if ( 'Mobile' === this.props.getPreviewDevice ) {
									setAttributes( {
										mobileSpacerHeight: parseInt( previewHeight + delta.height, 10 ),
									} );
								} else if ( 'Tablet' === this.props.getPreviewDevice ) {
									setAttributes( {
										tabletSpacerHeight: parseInt( previewHeight + delta.height, 10 ),
									} );
								} else {
									setAttributes( {
										spacerHeight: parseInt( previewHeight + delta.height, 10 ),
									} );
								}
							} }
							onResizeStart={ () => {
								toggleSelection( false );
							} }
						>
							{ uniqueID && (
								<div className="kt-spacer-height-preview">
									<span id={ `spacing-height-${ uniqueID }` } >
										{ previewHeight + ( spacerHeightUnits ? spacerHeightUnits : 'px' ) }
									</span>
								</div>
							) }
						</ResizableBox>
					) }
					{ 'vh' !== spacerHeightUnits && ( ! this.showSettings( 'spacerDivider' ) || ! this.showSettings( 'spacerHeight' ) ) && (
						<div className="kt-spacer-height-preview" style={ {
							height: previewHeight + ( spacerHeightUnits ? spacerHeightUnits : 'px' ),
						} } >
							<span id={ `spacing-height-${ uniqueID }` } >
								{ previewHeight + ( spacerHeightUnits ? spacerHeightUnits : 'px' ) }
							</span>
						</div>
					) }
				</div>
			</div>
		);
	}
}
export default compose( [
	withSelect( ( select ) => {
		return {
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			getUniqueIDs: select( 'kadenceblocks/data' ).getUniqueIDs(),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		addUniqueID: ( value, clientID ) => dispatch( 'kadenceblocks/data' ).addUniqueID( value, clientID ),
	} ) ),
] )( KadenceSpacerDivider );
