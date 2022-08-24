/**
 * External dependencies
 */
import { numberInputIcon } from '@kadence/icons';

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

registerBlockType('kadence/advanced-form-number', {
	...metadata,
	title: __( 'Number', 'kadence-blocks' ),
	description: __( 'Kadence Form number input', 'kadence-blocks' ),
	keywords: [
		'kadence',
	],
	parent: [ 'kadence/advanced-form' ],
	icon: {
		src: numberInputIcon,
	},
	edit,
	save: () => null
});
