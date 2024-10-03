/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import { navigationBlockIcon } from '@kadence/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

/**
 * Import Css
 */
import './style.scss';

registerBlockType('kadence/navigation', {
	...metadata,
	title: _x('Navigation (Adv)', 'block title', 'kadence-blocks'),
	icon: navigationBlockIcon,
	example: {
		attributes: {
			overlayMenu: 'never',
		},
		innerBlocks: [
			{
				name: 'core/navigation-link',
				attributes: {
					// translators: 'Home' as in a website's home page.
					label: __('Home'),
					url: 'https://make.wordpress.org/',
				},
			},
			{
				name: 'core/navigation-link',
				attributes: {
					// translators: 'About' as in a website's about page.
					label: __('About'),
					url: 'https://make.wordpress.org/',
				},
			},
			{
				name: 'core/navigation-link',
				attributes: {
					// translators: 'Contact' as in a website's contact page.
					label: __('Contact'),
					url: 'https://make.wordpress.org/',
				},
			},
		],
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
});
