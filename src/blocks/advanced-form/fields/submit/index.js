/**
 * External dependencies
 */
import { advancedBtnIcon } from '@kadence/icons';

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

registerBlockType('kadence/advanced-form-submit', {
	...metadata,
	title: __( 'Submit Button', 'kadence-blocks' ),
	description: __( 'Kadence Form Submit Button', 'kadence-blocks' ),
	keywords: [
		'submit',
		'button',
		'send'
	],
	ancestor: [ 'kadence/advanced-form' ],
	parent: [ 'kadence/advanced-form', 'kadence/column' ],
	icon: {
		src: advancedBtnIcon,
	},
	edit,
	save: () => null,

});
