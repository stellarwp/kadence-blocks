/**
 * External dependencies
 */
import { emailInputIcon } from '@kadence/icons';

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
import { Icon } from '@wordpress/components';


// export { name, category, metadata, settings };
registerBlockType('kadence/advanced-form-email', {
	...metadata,
	icon: {
		src: emailInputIcon,
	},
	title: __( 'Email Field', 'kadence-blocks' ),
	description: __( 'Kadence Form email input field', 'kadence-blocks' ),
	keywords: [
		'kadence',
	],
	supports: {
		reusable: false,
		html: false,
	},
	parent: [ 'kadence/advanced-form' ],
	usesContext: [
		'kadence/advanced-form/field-style',
		'kadence/advanced-form/label-style',
		'kadence/advanced-form/help-style'
	],
	edit,
	save: () => null,

});
