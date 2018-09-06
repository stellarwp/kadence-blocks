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
} = wp.element;
const {
	InspectorControls,
	ColorPalette,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	PanelColor,
	PanelBody,
	ToggleControl,
	RangeControl,
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
/**
 * Build the spacer edit
 */
class KadenceSpacerDivider extends Component {
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		} else if ( this.props.attributes.uniqueID && this.props.attributes.uniqueID !== '_' + this.props.clientId.substr( 2, 9 ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		}
	}
	render() {
		const { attributes: { blockAlignment, spacerHeight, dividerEnable, dividerStyle, dividerColor, dividerOpacity, dividerHeight, dividerWidth, hAlign, uniqueID }, className, setAttributes, toggleSelection } = this.props;
		const dividerBorderColor = ( ! dividerColor ? kadenceHexToRGB( '#eee', dividerOpacity ) : kadenceHexToRGB( dividerColor, dividerOpacity ) );
		return (
			<div className={ className }>
				<BlockControls key="controls">
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'wide', 'full' ] }
						onChange={ blockAlignment => setAttributes( { blockAlignment } ) }
					/>
					<AlignmentToolbar
						value={ hAlign }
						onChange={ hAlign => setAttributes( { hAlign } ) }
					/>
				</BlockControls>
				<InspectorControls>
					<PanelBody
						title={ __( 'Spacer Settings' ) }
						initialOpen={ true }
					>
						<RangeControl
							label={ __( 'Height' ) }
							value={ spacerHeight }
							onChange={ spacerHeight => setAttributes( { spacerHeight } ) }
							min={ 6 }
							max={ 600 }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Divider Settings' ) }
						initialOpen={ true }
					>
						<PanelBody>
							<ToggleControl
								label={ __( 'Enable Divider' ) }
								checked={ dividerEnable }
								onChange={ dividerEnable => setAttributes( { dividerEnable } ) }
							/>
						</PanelBody>
						<SelectControl
							label={ __( 'Divider Style' ) }
							value={ dividerStyle }
							options={ [
								{ value: 'solid', label: __( 'Solid' ) },
								{ value: 'dashed', label: __( 'Dashed' ) },
								{ value: 'dotted', label: __( 'Dotted' ) },
							] }
							onChange={ dividerStyle => setAttributes( { dividerStyle } ) }
						/>
						<PanelColor
							title={ __( 'Divider Color' ) }
							colorValue={ dividerColor }
						>
							<ColorPalette
								value={ dividerColor }
								onChange={ dividerColor => setAttributes( { dividerColor } ) }
							/>
						</PanelColor>
						<RangeControl
							label={ __( 'Divider Opacity' ) }
							value={ dividerOpacity }
							onChange={ dividerOpacity => setAttributes( { dividerOpacity } ) }
							min={ 0 }
							max={ 100 }
						/>
						<RangeControl
							label={ __( 'Divider Height in px' ) }
							value={ dividerHeight }
							onChange={ dividerHeight => setAttributes( { dividerHeight } ) }
							min={ 0 }
							max={ 40 }
						/>
						<RangeControl
							label={ __( 'Divider Width by %' ) }
							value={ dividerWidth }
							onChange={ dividerWidth => setAttributes( { dividerWidth } ) }
							min={ 0 }
							max={ 100 }
						/>
					</PanelBody>
				</InspectorControls>
				<div className={ `kt-block-spacer kt-block-spacer-halign-${ hAlign }` }>
					{ dividerEnable && (
						<hr className="kt-divider" style={ {
							borderTopColor: dividerBorderColor,
							borderTopWidth: dividerHeight + 'px',
							width: dividerWidth + '%',
							borderTopStyle: dividerStyle,
						} } />
					) }
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
							document.getElementById( 'spacing-height-' + ( uniqueID ? uniqueID : 'no-unique' ) ).innerHTML = parseInt( spacerHeight + delta.height, 10 ) + 'px';
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
									{ spacerHeight + 'px' }
								</span>
							</div>
						) }
					</ResizableBox>
				</div>
			</div>
		);
	}
}
export default ( KadenceSpacerDivider );
