/**
 * External dependencies
 */
import { radioInputIcon } from '@kadence/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import transforms from './transforms';
import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';


/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';

registerBlockType('kadence/advanced-form-radio', {
	...metadata,
	title: __( 'Radio', 'kadence-blocks' ),
	description: __( 'Kadence Form radio input', 'kadence-blocks' ),
	keywords: [
		'kadence',
	],
	parent: [ 'kadence/advanced-form' ],
	icon: {
		src: radioInputIcon,
	},
	edit,
	transforms,
	save: () => null,
});
