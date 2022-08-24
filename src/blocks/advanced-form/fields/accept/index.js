/**
 * External dependencies
 */
import { acceptInputIcon } from '@kadence/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';


/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

// export { name, category, metadata, settings };
registerBlockType('kadence/advanced-form-accept', {
	...metadata,
	title: __( 'Accept', 'kadence-blocks' ),
	description: __( 'Kadence Form accept input', 'kadence-blocks' ),
	keywords: [
		'kadence',
	],
	parent: [ 'kadence/advanced-form' ],
	icon: {
		src: acceptInputIcon,
	},
	edit,
	save: () => null,

});
