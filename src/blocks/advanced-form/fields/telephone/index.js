/**
 * External dependencies
 */
import { phoneInputIcon } from '@kadence/icons';

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

registerBlockType('kadence/advanced-form-telephone', {
	...metadata,
	title: __( 'Telephone Field', 'kadence-blocks' ),
	/* translators: block description */
	description: __( 'Kadence Form telephone input field', 'kadence-blocks' ),
	keywords: [
		'kadence',
	],
	parent: [ 'kadence/advanced-form' ],
	icon: {
		src: phoneInputIcon,
	},
	edit,
	save: () => null,

});
