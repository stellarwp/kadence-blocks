/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */

import metadata from './block.json';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Import Icons
 */
import { tabsBlockIcon } from '@kadence/icons';

/**
 * Import edit
 */
import edit from './edit';

/**
 * Internal block libraries
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

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
	...metadata,
	title: __( 'Tab', 'kadence-blocks' ),
	keywords: [
		__( 'tabs', 'kadence-blocks' ),
		__( 'tab', 'kadence-blocks' ),
		'KB',
	],
	icon: {
		src: tabsBlockIcon
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
