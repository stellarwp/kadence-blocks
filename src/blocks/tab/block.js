/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */

const {
	InnerBlocks,
} = wp.blockEditor;

/**
 * Import Icons
 */
import icons from './icon';
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
registerBlockType( 'kadence/tab', {
	title: __( 'Tab' ),
	icon: icons.block,
	category: 'kadence-blocks',
	parent: [ 'kadence/tabs' ],
	attributes: {
		id: {
			type: 'number',
			default: 1,
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
		return { 'data-tab': attributes.id };
	},
	edit,

	save( { attributes } ) {
		const { id, uniqueID } = attributes;
		return (
			<div className={ `kt-tab-inner-content kt-inner-tab-${ id } kt-inner-tab${ uniqueID }` }>
				<div className={ 'kt-tab-inner-content-inner' } >
					<InnerBlocks.Content />
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
			},
			save: ( { attributes } ) => {
				const { id } = attributes;
				return (
					<div className={ `kt-tab-inner-content kt-inner-tab-${ id }` }>
						<div className={ 'kt-tab-inner-content-inner' } >
							<InnerBlocks.Content />
						</div>
					</div>
				);
			},
		},
	],
} );
