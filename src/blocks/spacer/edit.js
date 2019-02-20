/**
 * BLOCK: Kadence Spacer
 *
 * Registering a basic block with Gutenberg.
 */

import ResizableBox from 're-resizable';

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
} = wp.element;
const {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	ColorPalette,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	PanelBody,
	ToggleControl,
	RangeControl,
	TabPanel,
	Dashicon,
	SelectControl,
} = wp.components;

function kadenceHexToRGB( hex, alpha ) {
	hex = hex.replace( '#', '' );
	const r = parseInt( hex.length === 3 ? hex.slice( 0, 1 ).repeat( 2 ) : hex.slice( 0, 2 ), 16 );
	const g = parseInt( hex.length === 3 ? hex.slice( 1, 2 ).repeat( 2 ) : hex.slice( 2, 4 ), 16 );
	const b = parseInt( hex.length === 3 ? hex.slice( 2, 3 ).repeat( 2 ) : hex.slice( 4, 6 ), 16 );
	let alp;
	if ( alpha < 10 ) {
		alp = '0.0' + alpha;
	} else if ( alpha >= 100 ) {
		alp = '1';
	} else {
		alp = '0.' + alpha;
	}
	return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alp + ')';
}
const ktspacerUniqueIDs = [];
/**
 * Build the spacer edit
 */
class KadenceSpacerDivider extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			user: ( kadence_blocks_params.user ? kadence_blocks_params.user : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const oldBlockConfig = kadence_blocks_params.config[ 'kadence/spacer' ];
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
		} else if ( ktspacerUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
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
		const { attributes: { blockAlignment, spacerHeight, tabletSpacerHeight, mobileSpacerHeight, dividerEnable, dividerStyle, dividerColor, dividerOpacity, dividerHeight, dividerWidth, hAlign, uniqueID, spacerHeightUnits }, className, setAttributes, toggleSelection } = this.props;
		const dividerBorderColor = ( ! dividerColor ? kadenceHexToRGB( '#eee', dividerOpacity ) : kadenceHexToRGB( dividerColor, dividerOpacity ) );
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
											] }
											onChange={ value => setAttributes( { dividerStyle: value } ) }
										/>
										<p className="kt-setting-label">{ __( 'Divider Color' ) }</p>
										<ColorPalette
											value={ dividerColor }
											onChange={ value => setAttributes( { dividerColor: value } ) }
										/>
										<RangeControl
											label={ __( 'Divider Opacity' ) }
											value={ dividerOpacity }
											onChange={ value => setAttributes( { dividerOpacity: value } ) }
											min={ 0 }
											max={ 100 }
										/>
										<RangeControl
											label={ __( 'Divider Height in px' ) }
											value={ dividerHeight }
											onChange={ value => setAttributes( { dividerHeight: value } ) }
											min={ 0 }
											max={ 40 }
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
						<hr className="kt-divider" style={ {
							borderTopColor: dividerBorderColor,
							borderTopWidth: dividerHeight + 'px',
							width: dividerWidth + '%',
							borderTopStyle: dividerStyle,
						} } />
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
