/**
 * External dependencies
 */
import { captchaIcon } from '@kadence/icons';

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

registerBlockType('kadence/advanced-form-captcha', {
	...metadata,
	title: __('Captcha', 'kadence-blocks'),
	description: __('Kadence Form Captcha Block', 'kadence-blocks'),
	keywords: ['captcha', 'verify', 'bot'],
	ancestor: ['kadence/advanced-form'],
	parent: ['kadence/advanced-form', 'kadence/column'],
	icon: {
		src: captchaIcon,
	},
	edit,
	save: () => null,
});
