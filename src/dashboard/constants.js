import { __ } from '@wordpress/i18n';

/**
 * Images
 */
import blocksPro from './images/blocks-pro.png';
import bundles from './images/bundles.png';

export const AUTHENTICATED_CONTENT = {
	upsellContents: [
		{
			image: blocksPro,
			tag: __('Upgrade', 'kadence-blocks'),
			heading: __('Elevate your pages with Blocks Pro', 'kadence-blocks'),
			description: __(
				'Unleash limitless creativity with our custom block library - enhance your content with animations, dynamic texts, custom fonts and icons, and more!',
				'kadence-blocks'
			),
			href: 'https://www.kadencewp.com/kadence-blocks/pro/',
			buttonText: __('Upgrade to Blocks Pro', 'kadence-blocks'),
		},
		{
			image: bundles,
			tag: __('Go Pro', 'kadence-blocks'),
			heading: __('Achieve more with Bundles', 'kadence-blocks'),
			description: __(
				'Elevate your site development process with our Pro Bundles. Jump start your site with a Pro Starter Template, and turbocharge your page building with Theme Pro and Blocks Pro – now powered by Kadence AI. Plus, unlock the potential of Custom Fonts, Cloud, Conversions, and so much more.',
				'kadence-blocks'
			),
			href: 'https://www.kadencewp.com/pricing/',
			buttonText: __('Go Pro with a Bundle', 'kadence-blocks'),
			flip: true,
		},
	],
};

export const UNAUTHENTICATED_CONTENT = {
	upsellContents: [
		{
			image: blocksPro,
			tag: __('Upgrade'),
			heading: __('Elevate your pages with Blocks Pro', 'kadence-blocks'),
			description: __(
				'Unleash limitless creativity with our custom block library - enhance your content with animations, dynamic texts, custom fonts and icons, and more!',
				'kadence-blocks'
			),
			href: 'https://www.kadencewp.com/blocks-pro/',
			buttonText: __('Upgrade to Blocks Pro', 'kadence-blocks'),
		},
		{
			image: bundles,
			tag: __('Go Pro', 'kadence-blocks'),
			heading: __('Kadence Blocks works better with Kadence Theme', 'kadence-blocks'),
			description: __(
				"Level up with Kadence Blocks and Theme. Kickstart your site using Starter Templates, customize with ease, and elevate your pattern library's style with the Kadence Theme.",
				'kadence-blocks'
			),
			href: 'https://wordpress.org/themes/kadence/',
			buttonText: __('Try Kadence Theme Free', 'kadence-blocks'),
			flip: true,
		},
	],
};
