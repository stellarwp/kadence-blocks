/**
 * External dependencies
 */
import { dateInputIcon } from '@kadence/icons';

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
registerBlockType('kadence/advanced-form-date', {
	...metadata,
	title: __( 'Date', 'kadence-blocks' ),
	description: __( 'Kadence Form date', 'kadence-blocks' ),
	keywords: [
		'kadence',
	],
	parent: [ 'kadence/advanced-form' ],
	icon: {
		src: dateInputIcon,
	},
	edit,
	save: () => null,
});
