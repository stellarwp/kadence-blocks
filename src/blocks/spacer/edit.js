/**
 * BLOCK: Kadence Spacer
 *
 * Registering a basic block with Gutenberg.
 */

import ResizableBox from 're-resizable';
import SvgPattern from './svg-pattern';
import AdvancedPopColorControl from '../../advanced-pop-color-control';
import KadenceColorOutput from '../../kadence-color-output';
/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
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
	PanelBody,
	ToggleControl,
	RangeControl,
	TabPanel,
	Dashicon,
	SelectControl,
} = wp.components;

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
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
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
	render() {
		const { attributes: { blockAlignment, spacerHeight, tabletSpacerHeight, mobileSpacerHeight, dividerEnable, dividerStyle, dividerColor, dividerOpacity, dividerHeight, dividerWidth, hAlign, uniqueID, spacerHeightUnits, rotate, strokeWidth, strokeGap }, className, setAttributes, toggleSelection } = this.props;
		let alp;
		if ( dividerOpacity < 10 ) {
			alp = '0.0' + dividerOpacity;
		} else if ( dividerOpacity >= 100 ) {
			alp = '1';
		} else {
			alp = '0.' + dividerOpacity;
		}
		const dividerBorderColor = ( ! dividerColor ? KadenceColorOutput( '#eeeeee', alp ) : KadenceColorOutput( dividerColor, alp ) );
		const deskControls = (
			<RangeControl
				label={ __( 'Height' ) }
				value={ spacerHeight }
				onChange={ value => setAttributes( { spacerHeight: value } ) }
				min={ 6 }
				max={ 600 }
			/>
		);
		const tabletControls = (
			<RangeControl
				label={ __( 'Tablet Height' ) }
				value={ tabletSpacerHeight }
				onChange={ value => setAttributes( { tabletSpacerHeight: value } ) }
				min={ 6 }
				max={ 600 }
			/>
		);
		const mobileControls = (
			<RangeControl
				label={ __( 'Mobile Height' ) }
				value={ mobileSpacerHeight }
				onChange={ value => setAttributes( { mobileSpacerHeight: value } ) }
				min={ 6 }
				max={ 600 }
			/>
		);
		let svgStringPre = renderToString( <SvgPattern uniqueID={ uniqueID } color={ KadenceColorOutput( dividerColor ) } opacity={ dividerOpacity } rotate={ rotate } strokeWidth={ strokeWidth } strokeGap={ strokeGap } /> );
		svgStringPre = svgStringPre.replace( 'patterntransform', 'patternTransform' );
		svgStringPre = svgStringPre.replace( 'patternunits', 'patternUnits' );
		//const svgString = encodeURIComponent( svgStringPre );
		//const dataUri = `url("data:image/svg+xml,${ svgString }")`;
		const dataUri = `url("data:image/svg+xml;base64,${btoa(svgStringPre)}")`;
		const minD = ( dividerStyle !== 'stripe' ? 1 : 10 );
		const maxD = ( dividerStyle !== 'stripe' ? 40 : 60 );
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
							<PanelBody
								title={ __( 'Spacer Settings' ) }
								initialOpen={ true }
							>
								{ this.showSettings( 'spacerHeightUnits' ) && (
									<SelectControl
										label={ __( 'Height Units' ) }
										value={ spacerHeightUnits }
										options={ [
											{ value: 'px', label: __( 'px' ) },
											{ value: 'vh', label: __( 'vh' ) },
										] }
										onChange={ value => setAttributes( { spacerHeightUnits: value } ) }
									/>
								) }
								{ this.showSettings( 'spacerHeight' ) && (
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
														tabout = mobileControls;
													} else if ( 'tablet' === tab.name ) {
														tabout = tabletControls;
													} else {
														tabout = deskControls;
													}
												}
												return <div>{ tabout }</div>;
											}
										}
									</TabPanel>
								) }
							</PanelBody>
							<PanelBody
								title={ __( 'Divider Settings' ) }
								initialOpen={ true }
							>
								{ this.showSettings( 'dividerToggle' ) && (
									<ToggleControl
										label={ __( 'Enable Divider' ) }
										checked={ dividerEnable }
										onChange={ value => setAttributes( { dividerEnable: value } ) }
									/>
								) }
								{ dividerEnable && this.showSettings( 'dividerStyles' ) && (
									<Fragment>
										<SelectControl
											label={ __( 'Divider Style' ) }
											value={ dividerStyle }
											options={ [
												{ value: 'solid', label: __( 'Solid' ) },
												{ value: 'dashed', label: __( 'Dashed' ) },
												{ value: 'dotted', label: __( 'Dotted' ) },
												{ value: 'stripe', label: __( 'Stripe' ) },
											] }
											onChange={ value => setAttributes( { dividerStyle: value } ) }
										/>
										<AdvancedPopColorControl
											label={ __( 'Divider Color' ) }
											colorValue={ ( dividerColor ? dividerColor : '' ) }
											colorDefault={ '' }
											opacityValue={ dividerOpacity }
											onColorChange={ value => setAttributes( { dividerColor: value } ) }
											onOpacityChange={ value => setAttributes( { dividerOpacity: value } ) }
											opacityUnit={ 100 }
										/>
										{ 'stripe' === dividerStyle && (
											<Fragment>
												<RangeControl
													label={ __( 'Stripe Angle' ) }
													value={ rotate }
													onChange={ value => setAttributes( { rotate: value } ) }
													min={ 0 }
													max={ 135 }
												/>
												<RangeControl
													label={ __( 'Stripe Width' ) }
													value={ strokeWidth }
													onChange={ value => setAttributes( { strokeWidth: value } ) }
													min={ 1 }
													max={ 30 }
												/>
												<RangeControl
													label={ __( 'Stripe Gap' ) }
													value={ strokeGap }
													onChange={ value => setAttributes( { strokeGap: value } ) }
													min={ 1 }
													max={ 30 }
												/>
											</Fragment>
										) }
										<RangeControl
											label={ __( 'Divider Height in px' ) }
											value={ dividerHeight }
											onChange={ value => setAttributes( { dividerHeight: value } ) }
											min={ minD }
											max={ maxD }
										/>
										<RangeControl
											label={ __( 'Divider Width by %' ) }
											value={ dividerWidth }
											onChange={ value => setAttributes( { dividerWidth: value } ) }
											min={ 0 }
											max={ 100 }
										/>
									</Fragment>
								) }
							</PanelBody>
						</InspectorControls>
					</Fragment>
				) }
				<div className={ `kt-block-spacer kt-block-spacer-halign-${ hAlign }` }>
					{ dividerEnable && (
						<Fragment>
							{ dividerStyle === 'stripe' && (
								<span className="kt-divider-stripe" style={ {
									height: ( dividerHeight < 10 ? 10 : dividerHeight ) + 'px',
									width: dividerWidth + '%',
								} }>
									<SvgPattern uniqueID={ uniqueID } color={ KadenceColorOutput( dividerColor ) } opacity={ dividerOpacity } rotate={ rotate } strokeWidth={ strokeWidth } strokeGap={ strokeGap } />
								</span>
							) }
							{ dividerStyle !== 'stripe' && (
								<hr className="kt-divider" style={ {
									borderTopColor: dividerBorderColor,
									borderTopWidth: dividerHeight + 'px',
									width: dividerWidth + '%',
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
								height: spacerHeight,
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
								document.getElementById( 'spacing-height-' + ( uniqueID ? uniqueID : 'no-unique' ) ).innerHTML = parseInt( spacerHeight + delta.height, 10 ) + ( spacerHeightUnits ? spacerHeightUnits : 'px' );
							} }
							onResizeStop={ ( event, direction, elt, delta ) => {
								setAttributes( {
									spacerHeight: parseInt( spacerHeight + delta.height, 10 ),
								} );
								toggleSelection( true );
							} }
							onResizeStart={ () => {
								toggleSelection( false );
							} }
						>
							{ uniqueID && (
								<div className="kt-spacer-height-preview">
									<span id={ `spacing-height-${ uniqueID }` } >
										{ spacerHeight + ( spacerHeightUnits ? spacerHeightUnits : 'px' ) }
									</span>
								</div>
							) }
						</ResizableBox>
					) }
					{ 'vh' !== spacerHeightUnits && ( ! this.showSettings( 'spacerDivider' ) || ! this.showSettings( 'spacerHeight' ) ) && (
						<div className="kt-spacer-height-preview" style={ {
							height: spacerHeight + ( spacerHeightUnits ? spacerHeightUnits : 'px' ),
						} } >
							<span id={ `spacing-height-${ uniqueID }` } >
								{ spacerHeight + ( spacerHeightUnits ? spacerHeightUnits : 'px' ) }
							</span>
						</div>
					) }
				</div>
			</div>
		);
	}
}
export default ( KadenceSpacerDivider );
