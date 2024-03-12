/**
 * External dependencies
 */
import { fileInputIcon } from '@kadence/icons';

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

registerBlockType('kadence/advanced-form-file', {
	...metadata,
	title: __('File', 'kadence-blocks'),
	description: __('Kadence Form file upload', 'kadence-blocks'),
	keywords: ['kadence'],
	icon: {
		src: fileInputIcon,
	},
	edit,
	save: () => null,
});
