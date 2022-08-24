/**
 * External dependencies
 */
import { textareaInputIcon } from '@kadence/icons';

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

registerBlockType('kadence/advanced-form-textarea', {
	...metadata,
	title: __( 'Text Area', 'kadence-blocks' ),
	description: __( 'Kadence Form text input field', 'kadence-blocks' ),
	keywords: [
		'kadence',
	],
	parent: [ 'kadence/advanced-form' ],
	icon: {
		src: textareaInputIcon,
	},
	edit,
	save: () => null,

});
