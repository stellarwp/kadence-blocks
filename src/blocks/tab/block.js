/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */

const {
	InnerBlocks,
} = wp.editor;
const {
	Fragment,
} = wp.element;
/**
 * Import Icons
 */
import icons from './icon';
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
	category: 'common',
	parent: [ 'kadence/tabs' ],
	attributes: {
		id: {
			type: 'number',
			default: 1,
		},
	},
	getEditWrapperProps( attributes ) {
		return { 'data-tab': attributes.id };
	},
	edit: props => {
		const { attributes: { id } } = props;
		return (
			<Fragment>
				<div className={ `kt-tab-content kt-inner-tab-${ id }` } >
					<InnerBlocks templateLock={ false } />
				</div>
			</Fragment>
		);
	},

	save( { attributes } ) {
		const { id } = attributes;
		return (
			<div className={ `kt-tab-content kt-inner-tab-${ id }` }>
				<div className={ 'kt-tab-content-inner' } >
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );
