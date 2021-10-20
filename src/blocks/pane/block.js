/**
 * BLOCK: Kadence Pane
 *
 * Registering a basic block with Gutenberg.
 */

const {
	RichText,
	InnerBlocks,
} = wp.blockEditor;

/**
 * Import Icons
 */
import icons from '../../icons';
import IconRender from '../../components/icons/icon-render';
/**
 * Import edit
 */
import edit from './edit';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
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
	title: __( 'Pane', 'kadence-blocks' ),
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
		titleTag: {
			type: 'string',
			default: 'div',
		},
		hideLabel: {
			type: 'bool',
			default: false,
		},
		ariaLabel: {
			type: 'string',
			default: '',
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
		faqSchema: {
			type: 'bool',
			default: false,
		},
	},
	supports: {
		inserter: false,
		reusable: false,
		html: false,
		anchor: true,
	},
	getEditWrapperProps( attributes ) {
		return { 'data-pane': attributes.id };
	},
	edit,

	save( { attributes } ) {
		const { id, uniqueID, title, icon, iconSide, hideLabel, titleTag, ariaLabel } = attributes;
		const HtmlTagOut = ( ! titleTag ? 'div' : titleTag );
		return (
			<div className={ `kt-accordion-pane kt-accordion-pane-${ id } kt-pane${ uniqueID }` }>
				<HtmlTagOut className={ 'kt-accordion-header-wrap' } >
					<button className={ `kt-blocks-accordion-header kt-acccordion-button-label-${ ( hideLabel ? 'hide' : 'show' ) }` } aria-label={ ariaLabel ? ariaLabel : undefined }>
						<span className="kt-blocks-accordion-title-wrap">
							{ icon && 'left' === iconSide && (
								<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ icon } kt-btn-side-${ iconSide }` } name={ icon } />
							) }
							<RichText.Content
								className={ 'kt-blocks-accordion-title' }
								tagName={ 'span' }
								value={ title }
							/>
							{ icon && 'right' === iconSide && (
								<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ icon } kt-btn-side-${ iconSide }` } name={ icon } />
							) }
						</span>
						<span className="kt-blocks-accordion-icon-trigger"></span>
					</button>
				</HtmlTagOut>
				<div className={ 'kt-accordion-panel' } >
					<div className={ 'kt-accordion-panel-inner' } >
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
	deprecated: [
		{
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
				titleTag: {
					type: 'string',
					default: 'div',
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
			save: ( { attributes } ) => {
				const { id, uniqueID, title, icon, iconSide, hideLabel, titleTag } = attributes;
				const HtmlTagOut = ( ! titleTag ? 'div' : titleTag );
				return (
					<div className={ `kt-accordion-pane kt-accordion-pane-${ id } kt-pane${ uniqueID }` }>
						<HtmlTagOut className={ 'kt-accordion-header-wrap' } >
							<button className={ `kt-blocks-accordion-header kt-acccordion-button-label-${ ( hideLabel ? 'hide' : 'show' ) }` }>
								<div className="kt-blocks-accordion-title-wrap">
									{ icon && 'left' === iconSide && (
										<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ icon } kt-btn-side-${ iconSide }` } name={ icon } />
									) }
									<RichText.Content
										className={ 'kt-blocks-accordion-title' }
										tagName={ 'span' }
										value={ title }
									/>
									{ icon && 'right' === iconSide && (
										<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ icon } kt-btn-side-${ iconSide }` } name={ icon } />
									) }
								</div>
								<div className="kt-blocks-accordion-icon-trigger"></div>
							</button>
						</HtmlTagOut>
						<div className={ 'kt-accordion-panel' } >
							<div className={ 'kt-accordion-panel-inner' } >
								<InnerBlocks.Content />
							</div>
						</div>
					</div>
				);
			},
		},
	],
} );
