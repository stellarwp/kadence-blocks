/**
 * External dependencies
 */
import { timeInputIcon } from '@kadence/icons';

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

registerBlockType('kadence/advanced-form-time', {
	...metadata,
	title: __( 'Time', 'kadence-blocks' ),
	description: __( 'Kadence Form time input field', 'kadence-blocks' ),
	keywords: [
		'kadence',
	],
	parent: [ 'kadence/advanced-form' ],
	icon: {
		src: timeInputIcon,
	},
	edit,
	save: () => null,

});
