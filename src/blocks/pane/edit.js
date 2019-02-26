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
/**
 * Build the spacer edit
 */
class KadencePane extends Component {
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		} else if ( ktpaneUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		} else {
			ktpaneUniqueIDs.push( this.props.attributes.uniqueID );
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
					<PanelBody
						title={ __( 'Title Tag Settings' ) }
						initialOpen={ false }
					>
						<SelectControl
							label={ __( 'Title Tag' ) }
							value={ titleTag }
							options={ [
								{ value: 'div', label: __( 'div' ) },
								{ value: 'h2', label: __( 'h2' ) },
								{ value: 'h3', label: __( 'h3' ) },
								{ value: 'h4', label: __( 'h4' ) },
								{ value: 'h5', label: __( 'h5' ) },
								{ value: 'h6', label: __( 'h6' ) },
							] }
							onChange={ value => setAttributes( { titleTag: value } ) }
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
