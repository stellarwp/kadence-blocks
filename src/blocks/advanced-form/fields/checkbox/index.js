/**
 * External dependencies
 */
import { checkboxInputIcon } from '@kadence/icons';

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
registerBlockType('kadence/advanced-form-checkbox', {
	...metadata,
	title: __('Checkbox', 'kadence-blocks'),
	description: __('Kadence Form checkbox', 'kadence-blocks'),
	keywords: ['kadence'],
	icon: {
		src: checkboxInputIcon,
	},
	edit,
	save: () => null,
});
