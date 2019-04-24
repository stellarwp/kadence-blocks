/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */

import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import IcoNames from '../../svgiconsnames';
import FaIco from '../../faicons';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';

const {
	RichText,
	InnerBlocks,
	InspectorControls,
} = wp.editor;
const { __ } = wp.i18n;
const {
	Component,
} = wp.element;
const {
	PanelBody,
	ToggleControl,
	SelectControl,
} = wp.components;

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
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktpaneUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			ktpaneUniqueIDs.push( this.props.attributes.uniqueID );
		}
		const rootID = wp.data.select( 'core/editor' ).getBlockRootClientId( this.props.clientId );
		if ( ! this.props.attributes.id ) {
			const accordionBlock = wp.data.select( 'core/editor' ).getBlocksByClientId( rootID );
			const newPaneCount = accordionBlock[ 0 ].attributes.paneCount + 1;
			this.props.setAttributes( {
				id: newPaneCount,
			} );
			if ( undefined === ktpaneUniqueIDsCount[ rootID ] ) {
				ktpaneUniqueIDsCount.push( rootID );
				ktpaneUniqueIDsCount[ rootID ].push( newPaneCount );
			} else if ( undefined !== ktpaneUniqueIDsCount[ rootID ] ) {
				ktpaneUniqueIDsCount[ rootID ].push( newPaneCount );
			}
			wp.data.dispatch( 'core/editor' ).updateBlockAttributes( rootID, {
				paneCount: newPaneCount,
			} );
		} else if ( undefined === ktpaneUniqueIDsCount[ rootID ] ) {
			ktpaneUniqueIDsCount[ rootID ] = [ this.props.attributes.id ];
		} else if ( undefined !== ktpaneUniqueIDsCount[ rootID ] ) {
			if ( ktpaneUniqueIDsCount[ rootID ].includes( this.props.attributes.id ) ) {
				const accordionBlock = wp.data.select( 'core/editor' ).getBlocksByClientId( rootID );
				const newPaneCount = accordionBlock[ 0 ].attributes.paneCount + 1;
				this.props.setAttributes( {
					id: newPaneCount,
				} );
				wp.data.dispatch( 'core/editor' ).updateBlockAttributes( rootID, {
					paneCount: newPaneCount,
				} );
				ktpaneUniqueIDsCount[ rootID ].push( newPaneCount );
			} else {
				ktpaneUniqueIDsCount[ rootID ].push( this.props.attributes.id );
			}
		}
	}
	render() {
		const { attributes: { id, uniqueID, title, icon, iconSide, hideLabel, titleTag }, setAttributes } = this.props;
		const renderSVG = svg => (
			<GenIcon name={ svg } icon={ ( 'fa' === svg.substring( 0, 2 ) ? FaIco[ svg ] : Ico[ svg ] ) } />
		);
		const HtmlTagOut = ( ! titleTag ? 'div' : titleTag );
		return (
			<div className={ `kt-accordion-pane kt-accordion-pane-${ id } kt-pane${ uniqueID }` }>
				<InspectorControls>
					<PanelBody
						title={ __( 'Title Icon Settings' ) }
						initialOpen={ false }
					>
						<FontIconPicker
							icons={ IcoNames }
							value={ icon }
							onChange={ value => setAttributes( { icon: value } ) }
							appendTo="body"
							renderFunc={ renderSVG }
							theme="default"
							isMulti={ false }
						/>
						<SelectControl
							label={ __( 'Icon Side' ) }
							value={ iconSide }
							options={ [
								{ value: 'right', label: __( 'Right' ) },
								{ value: 'left', label: __( 'Left' ) },
							] }
							onChange={ value => setAttributes( { iconSide: value } ) }
						/>
						<ToggleControl
							label={ __( 'Show only Icon' ) }
							checked={ hideLabel }
							onChange={ value => setAttributes( { hideLabel: value } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<HtmlTagOut className={ 'kt-accordion-header-wrap' } >
					<div className={ `kt-blocks-accordion-header kt-acccordion-button-label-${ ( hideLabel ? 'hide' : 'show' ) }` }>
						<div className="kt-blocks-accordion-title-wrap">
							{ icon && 'left' === iconSide && (
								<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ icon } kt-btn-side-${ iconSide }` } name={ icon } icon={ ( 'fa' === icon.substring( 0, 2 ) ? FaIco[ icon ] : Ico[ icon ] ) } />
							) }
							<RichText
								className="kt-blocks-accordion-title"
								tagName={ 'div' }
								placeholder={ __( 'Add Title' ) }
								onChange={ value => setAttributes( { title: value } ) }
								value={ title }
								keepPlaceholderOnFocus
							/>
							{ icon && 'right' === iconSide && (
								<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ icon } kt-btn-side-${ iconSide }` } name={ icon } icon={ ( 'fa' === icon.substring( 0, 2 ) ? FaIco[ icon ] : Ico[ icon ] ) } />
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
export default ( KadencePane );
