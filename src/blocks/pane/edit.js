/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */

import IconControl from '../../components/icons/icon-control';
import IconRender from '../../components/icons/icon-render';

const {
	RichText,
	InnerBlocks,
	InspectorControls,
} = wp.blockEditor;
import { __ } from '@wordpress/i18n';
const {
	Component,
} = wp.element;
const {
	PanelBody,
	ToggleControl,
	SelectControl,
	TextControl,
} = wp.components;
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktpaneUniqueIDs = [];
const ktpaneUniqueIDsCount = [];
/**
 * Build the spacer edit
 */
class KadencePane extends Component {
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktpaneUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( ktpaneUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.attributes.uniqueID = '_' + this.props.clientId.substr( 2, 9 );
			ktpaneUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			ktpaneUniqueIDs.push( this.props.attributes.uniqueID );
		}
		if ( ! this.props.attributes.id ) {
			const accordionBlock = this.props.accordionBlock;
			const newPaneCount = accordionBlock[ 0 ].attributes.paneCount + 1;
			this.props.setAttributes( {
				id: newPaneCount,
			} );
			if ( undefined === ktpaneUniqueIDsCount[ this.props.rootID ] ) {
				ktpaneUniqueIDsCount.push( this.props.rootID );
				ktpaneUniqueIDsCount[ this.props.rootID ].push( newPaneCount );
			} else if ( undefined !== ktpaneUniqueIDsCount[ this.props.rootID ] ) {
				ktpaneUniqueIDsCount[ this.props.rootID ].push( newPaneCount );
			}
			this.props.updatePaneCount( newPaneCount );
		} else if ( undefined === ktpaneUniqueIDsCount[ this.props.rootID ] ) {
			ktpaneUniqueIDsCount[ this.props.rootID ] = [ this.props.attributes.id ];
		} else if ( undefined !== ktpaneUniqueIDsCount[ this.props.rootID ] ) {
			if ( ktpaneUniqueIDsCount[ this.props.rootID ].includes( this.props.attributes.id ) ) {
				const accordionBlock = this.props.accordionBlock;
				const newPaneCount = accordionBlock[ 0 ].attributes.paneCount + 1;
				this.props.setAttributes( {
					id: newPaneCount,
				} );
				this.props.updatePaneCount( newPaneCount );
				ktpaneUniqueIDsCount[ this.props.rootID ].push( newPaneCount );
			} else {
				ktpaneUniqueIDsCount[ this.props.rootID ].push( this.props.attributes.id );
			}
		}
	}
	render() {
		const { attributes: { id, uniqueID, title, icon, iconSide, hideLabel, titleTag, ariaLabel }, setAttributes } = this.props;
		const HtmlTagOut = ( ! titleTag ? 'div' : titleTag );
		return (
			<div className={ `kt-accordion-pane kt-accordion-pane-${ id } kt-pane${ uniqueID }` }>
				<InspectorControls>
					<PanelBody
						title={ __( 'Title Icon Settings', 'kadence-blocks' ) }
						initialOpen={ false }
					>
						<IconControl
							value={ icon }
							onChange={ value => setAttributes( { icon: value } ) }
						/>
						<SelectControl
							label={ __( 'Icon Side', 'kadence-blocks' ) }
							value={ iconSide }
							options={ [
								{ value: 'right', label: __( 'Right', 'kadence-blocks' ) },
								{ value: 'left', label: __( 'Left', 'kadence-blocks' ) },
							] }
							onChange={ value => setAttributes( { iconSide: value } ) }
						/>
						<ToggleControl
							label={ __( 'Show only Icon', 'kadence-blocks' ) }
							checked={ hideLabel }
							onChange={ value => setAttributes( { hideLabel: value } ) }
						/>
						<TextControl
							label={ __( 'Button Label Attribute for Accessibility', 'kadence-blocks' ) }
							value={ ariaLabel }
							onChange={ value => setAttributes( { ariaLabel: value } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<HtmlTagOut className={ 'kt-accordion-header-wrap' } >
					<div className={ `kt-blocks-accordion-header kt-acccordion-button-label-${ ( hideLabel ? 'hide' : 'show' ) }` }>
						<div className="kt-blocks-accordion-title-wrap">
							{ icon && 'left' === iconSide && (
								<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ icon } kt-btn-side-${ iconSide }` } name={ icon } />
							) }
							<RichText
								className="kt-blocks-accordion-title"
								tagName={ 'div' }
								placeholder={ __( 'Add Title', 'kadence-blocks' ) }
								onChange={ value => setAttributes( { title: value } ) }
								value={ title }
								keepPlaceholderOnFocus
							/>
							{ icon && 'right' === iconSide && (
								<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ icon } kt-btn-side-${ iconSide }` } name={ icon } />
							) }
						</div>
						<div className="kt-blocks-accordion-icon-trigger"></div>
					</div>
				</HtmlTagOut>
				<div className={ 'kt-accordion-panel' } >
					<div className={ 'kt-accordion-panel-inner' } >
						<InnerBlocks templateLock={ false } />
					</div>
				</div>
			</div>
		);
	}
}
//export default ( KadencePane );
export default compose( [
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps;
		const {
			getBlockRootClientId,
			getBlocksByClientId,
		} = select( 'core/block-editor' );
		const rootID = getBlockRootClientId( clientId );
		const accordionBlock = getBlocksByClientId( rootID );
		return {
			accordionBlock: accordionBlock,
			rootID: rootID,
		};
	} ),
	withDispatch( ( dispatch, { clientId }, { select } ) => {
		const {
			getBlockRootClientId,
		} = select( 'core/block-editor' );
		const {
			updateBlockAttributes,
		} = dispatch( 'core/block-editor' );
		const rootID = getBlockRootClientId( clientId );
		return {
			updatePaneCount( value ) {
				updateBlockAttributes( rootID, {
					paneCount: value,
				} );
			},
		};
	} ),
] )( KadencePane );
