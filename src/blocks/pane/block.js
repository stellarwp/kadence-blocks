/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */

const {
	RichText,
	InnerBlocks,
} = wp.editor;

/**
 * Import Icons
 */
import icons from '../../icons';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import FaIco from '../../faicons';
/**
 * Import edit
 */
import edit from './edit';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/pane', {
	title: __( 'Pane' ),
	icon: icons.accordionBlock,
	category: 'kadence-blocks',
	parent: [ 'kadence/accordion' ],
	attributes: {
		id: {
			type: 'number',
			default: 1,
		},
		title: {
			type: 'array',
			source: 'children',
			selector: '.kt-blocks-accordion-title',
			default: '',
		},
		hideLabel: {
			type: 'bool',
			default: false,
		},
		icon: {
			type: 'string',
			default: '',
		},
		iconSide: {
			type: 'string',
			default: 'right',
		},
		uniqueID: {
			type: 'string',
			default: '',
		},
	},
	supports: {
		inserter: false,
		reusable: false,
		html: false,
	},
	getEditWrapperProps( attributes ) {
		return { 'data-pane': attributes.id };
	},
	edit,

	save( { attributes } ) {
		const { id, uniqueID, title, icon, iconSide, hideLabel } = attributes;
		return (
			<div className={ `kt-accordion-pane kt-accordion-pane-${ id } kt-pane${ uniqueID }` }>
				<div className={ 'kt-accordion-header-wrap' } >
					<button className={ `kt-blocks-accordion-header kt-acccordion-button-label-${ ( hideLabel ? 'hide' : 'show' ) }` }>
						<div className="kt-blocks-accordion-title-wrap">
							{ icon && 'left' === iconSide && (
								<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ icon } kt-btn-side-${ iconSide }` } name={ icon } icon={ ( 'fa' === icon.substring( 0, 2 ) ? FaIco[ icon ] : Ico[ icon ] ) } />
							) }
							<RichText.Content
								className={ 'kt-blocks-accordion-title' }
								tagName={ 'span' }
								value={ title }
							/>
							{ icon && 'right' === iconSide && (
								<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ icon } kt-btn-side-${ iconSide }` } name={ icon } icon={ ( 'fa' === icon.substring( 0, 2 ) ? FaIco[ icon ] : Ico[ icon ] ) } />
							) }
						</div>
						<div className="kt-blocks-accordion-icon-trigger"></div>
					</button>
				</div>
				<div className={ 'kt-accordion-panel' } >
					<div className={ 'kt-accordion-panel-inner' } >
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
} );
