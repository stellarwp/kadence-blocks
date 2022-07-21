/**
 * External dependencies
 */
import { selectInputIcon } from '@kadence/icons';

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

registerBlockType('kadence/advanced-form-select', {
	...metadata,
	title: __( 'Select', 'kadence-blocks' ),
	/* translators: block description */
	description: __( 'Kadence Form select input', 'kadence-blocks' ),
	keywords: [
		'kadence',
	],
	parent: [ 'kadence/advanced-form' ],
	icon: {
		src: selectInputIcon,
	},
	usesContext: [
		'kadence/advanced-form/field-style',
		'kadence/advanced-form/label-style',
		'kadence/advanced-form/help-style'
	],
	edit,
	save: () => null,

});
