import { SectionTitle } from './components';
import { Icon, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { aiIcon } from '@kadence/icons';

/**
 * Images
 */
import blocksPro from './images/blocks-pro.png';
import bundles from './images/bundles.png';

export const AUTHENTICATED_CONTENT = {
	largeBanner: {
		heading: <>{__("Let's build,", 'kadence-blocks')}</>,
		subHeading: '',
		imageSrc: '',
	},
	actionCards: {
		title: <SectionTitle title={__('Start Building with Kadence AI', 'kadence-blocks')} icon={aiIcon} />,
		cards: [
			{
				icon: (
					<Icon
						icon={
							<SVG
								xmlns="http://www.w3.org/2000/svg"
								width="25"
								height="25"
								viewBox="0 0 25 25"
								fill="none"
							>
								<g clipPath="url(#clip0_3059_18235)">
									<path
										d="M1.56776 21.2781C1.8869 21.2781 2.13423 21.2103 2.30975 21.0747C2.48526 20.939 2.62887 20.7076 2.74057 20.3806L4.28438 16.144H11.3452L12.889 20.3806C13.0007 20.7076 13.1443 20.939 13.3198 21.0747C13.4953 21.2103 13.7387 21.2781 14.0499 21.2781C14.369 21.2781 14.6223 21.1904 14.8098 21.0148C14.9973 20.8393 15.091 20.6 15.091 20.2968C15.091 20.1133 15.0471 19.8979 14.9593 19.6506L9.34661 4.71518C9.203 4.34019 9.00753 4.06295 8.76019 3.88344C8.51287 3.70393 8.19773 3.61417 7.81477 3.61417C7.07279 3.61417 6.57016 3.97718 6.30687 4.7032L0.694142 19.6625C0.606381 19.8779 0.5625 20.0934 0.5625 20.3088C0.5625 20.612 0.652256 20.8493 0.831768 21.0208C1.01128 21.1924 1.25661 21.2781 1.56776 21.2781ZM4.89472 14.3131L7.8028 6.25897H7.86264L10.7707 14.3131H4.89472ZM16.6108 24.9162H23.5998C24.1583 24.9162 24.4375 24.6808 24.4375 24.2102C24.4375 23.7474 24.1583 23.5161 23.5998 23.5161H20.9191V1.38822H23.5998C24.1583 1.38822 24.4375 1.15286 24.4375 0.682145C24.4375 0.227382 24.1583 0 23.5998 0H16.6108C16.0604 0 15.7851 0.227382 15.7851 0.682145C15.7851 1.15286 16.0604 1.38822 16.6108 1.38822H19.3036V23.5161H16.6108C16.0604 23.5161 15.7851 23.7474 15.7851 24.2102C15.7851 24.6808 16.0604 24.9162 16.6108 24.9162Z"
										fill="#161A1E"
									/>
								</g>
								<defs>
									<clipPath id="clip0_3059_18235">
										<rect width="23.875" height="25" fill="white" transform="translate(0.5625)" />
									</clipPath>
								</defs>
							</SVG>
						}
					/>
				),
				heading: __('Build a page with AI-powered patterns', 'kadence-blocks'),
				content: __(
					'Take your site further with hundreds of beautiful patterns filled with custom content developed just for your site.',
					'kadence-blocks'
				),
				variant: 'blue',
				link: '/wp-admin/post-new.php?post_type=page',
			},
			{
				icon: (
					<Icon
						icon={
							<SVG
								xmlns="http://www.w3.org/2000/svg"
								width="25"
								height="25"
								viewBox="0 0 25 25"
								fill="none"
							>
								<g clipPath="url(#clip0_3059_18235)">
									<path
										d="M1.56776 21.2781C1.8869 21.2781 2.13423 21.2103 2.30975 21.0747C2.48526 20.939 2.62887 20.7076 2.74057 20.3806L4.28438 16.144H11.3452L12.889 20.3806C13.0007 20.7076 13.1443 20.939 13.3198 21.0747C13.4953 21.2103 13.7387 21.2781 14.0499 21.2781C14.369 21.2781 14.6223 21.1904 14.8098 21.0148C14.9973 20.8393 15.091 20.6 15.091 20.2968C15.091 20.1133 15.0471 19.8979 14.9593 19.6506L9.34661 4.71518C9.203 4.34019 9.00753 4.06295 8.76019 3.88344C8.51287 3.70393 8.19773 3.61417 7.81477 3.61417C7.07279 3.61417 6.57016 3.97718 6.30687 4.7032L0.694142 19.6625C0.606381 19.8779 0.5625 20.0934 0.5625 20.3088C0.5625 20.612 0.652256 20.8493 0.831768 21.0208C1.01128 21.1924 1.25661 21.2781 1.56776 21.2781ZM4.89472 14.3131L7.8028 6.25897H7.86264L10.7707 14.3131H4.89472ZM16.6108 24.9162H23.5998C24.1583 24.9162 24.4375 24.6808 24.4375 24.2102C24.4375 23.7474 24.1583 23.5161 23.5998 23.5161H20.9191V1.38822H23.5998C24.1583 1.38822 24.4375 1.15286 24.4375 0.682145C24.4375 0.227382 24.1583 0 23.5998 0H16.6108C16.0604 0 15.7851 0.227382 15.7851 0.682145C15.7851 1.15286 16.0604 1.38822 16.6108 1.38822H19.3036V23.5161H16.6108C16.0604 23.5161 15.7851 23.7474 15.7851 24.2102C15.7851 24.6808 16.0604 24.9162 16.6108 24.9162Z"
										fill="#161A1E"
									/>
								</g>
								<defs>
									<clipPath id="clip0_3059_18235">
										<rect width="23.875" height="25" fill="white" transform="translate(0.5625)" />
									</clipPath>
								</defs>
							</SVG>
						}
					/>
				),
				heading: __('Get started with full pages', 'kadence-blocks'),
				content: __(
					'Choose from a variety of pages featuring exclusively tailored content for your site.',
					'kadence-blocks'
				),
				variant: 'green',
				link: '/wp-admin/post-new.php?post_type=page',
			},
			{
				icon: (
					<Icon
						icon={
							<SVG
								xmlns="http://www.w3.org/2000/svg"
								width="25"
								height="25"
								viewBox="0 0 25 25"
								fill="none"
							>
								<g clipPath="url(#clip0_3059_18235)">
									<path
										d="M1.56776 21.2781C1.8869 21.2781 2.13423 21.2103 2.30975 21.0747C2.48526 20.939 2.62887 20.7076 2.74057 20.3806L4.28438 16.144H11.3452L12.889 20.3806C13.0007 20.7076 13.1443 20.939 13.3198 21.0747C13.4953 21.2103 13.7387 21.2781 14.0499 21.2781C14.369 21.2781 14.6223 21.1904 14.8098 21.0148C14.9973 20.8393 15.091 20.6 15.091 20.2968C15.091 20.1133 15.0471 19.8979 14.9593 19.6506L9.34661 4.71518C9.203 4.34019 9.00753 4.06295 8.76019 3.88344C8.51287 3.70393 8.19773 3.61417 7.81477 3.61417C7.07279 3.61417 6.57016 3.97718 6.30687 4.7032L0.694142 19.6625C0.606381 19.8779 0.5625 20.0934 0.5625 20.3088C0.5625 20.612 0.652256 20.8493 0.831768 21.0208C1.01128 21.1924 1.25661 21.2781 1.56776 21.2781ZM4.89472 14.3131L7.8028 6.25897H7.86264L10.7707 14.3131H4.89472ZM16.6108 24.9162H23.5998C24.1583 24.9162 24.4375 24.6808 24.4375 24.2102C24.4375 23.7474 24.1583 23.5161 23.5998 23.5161H20.9191V1.38822H23.5998C24.1583 1.38822 24.4375 1.15286 24.4375 0.682145C24.4375 0.227382 24.1583 0 23.5998 0H16.6108C16.0604 0 15.7851 0.227382 15.7851 0.682145C15.7851 1.15286 16.0604 1.38822 16.6108 1.38822H19.3036V23.5161H16.6108C16.0604 23.5161 15.7851 23.7474 15.7851 24.2102C15.7851 24.6808 16.0604 24.9162 16.6108 24.9162Z"
										fill="#161A1E"
									/>
								</g>
								<defs>
									<clipPath id="clip0_3059_18235">
										<rect width="23.875" height="25" fill="white" transform="translate(0.5625)" />
									</clipPath>
								</defs>
							</SVG>
						}
					/>
				),
				heading: __('Fine-tune your content', 'kadence-blocks'),
				content: __(
					'Write your own prompts to generate AI content from scratch or fine-tune existing copy.',
					'kadence-blocks'
				),
				variant: 'yellow',
			},
		],
	},
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
	knowledgeBase: {
		heading: __('Need Help Getting Started?', 'kadence-blocks'),
		articles: [
			{
				category: __('Kadence AI', 'kadence-blocks'),
				heading: __('Update AI Settings', 'kadence-blocks'),
				description: __(
					'Update Kadence AI settings. Regenerate contexts for patterns and pages to reflect your updated needs.',
					'kadence-blocks'
				),
				link: 'https://www.kadencewp.com/help-center/docs/kadence-blocks/design-libary-changing-ai-details/',
				linkTarget: '_blank',
			},
			{
				category: __('Kadence AI', 'kadence-blocks'),
				heading: __('Customize Image Collections', 'kadence-blocks'),
				description: __(
					'Update your Design Library imagery using premade collections or create and customize your own.',
					'kadence-blocks'
				),
				link: 'https://www.kadencewp.com/help-center/docs/kadence-blocks/design-library-changing-ai-image-collections/',
				linkTarget: '_blank',
			},
			{
				category: __('Kadence Blocks', 'kadence-blocks'),
				heading: __('Row Layout Block', 'kadence-blocks'),
				description: __(
					'Use the Row Layout block to improve the column functionality and create responsive post/page layouts.',
					'kadence-blocks'
				),
				link: 'https://www.kadencewp.com/help-center/docs/kadence-blocks/row-layout-block-2/',
				linkTarget: '_blank',
			},
			{
				category: __('Kadence Blocks', 'kadence-blocks'),
				heading: __('Advanced Text Block', 'kadence-blocks'),
				description: __(
					'Use the Advanced Text block to add text to your page/post with advanced customization - now with AI.',
					'kadence-blocks'
				),
				link: 'https://www.kadencewp.com/help-center/docs/kadence-blocks/advanced-heading-block/',
				linkTarget: '_blank',
			},
			{
				category: __('Support', 'kadence-blocks'),
				heading: __('Need more help?', 'kadence-blocks'),
				description: __(
					"Didn't find what you were looking for? Find more articles in our knowledge base.",
					'kadence-blocks'
				),
				link: 'https://www.kadencewp.com/help-center/',
				linkTarget: '_blank',
			},
		],
	},
};

export const UNAUTHENTICATED_CONTENT = {
	largeBanner: {
		heading: (
			<>
				{__('Kadence is better with AI.', 'kadence-blocks')} {aiIcon}
			</>
		),
		subHeading: __(
			"Elevate your web development game with Kadence AI. Supercharge your pattern and page library's potential with tailored content - get building pages in no time. Try Kadence AI today with 250 free credits!",
			'kadence-blocks'
		),
		subHeadingPro: __(
			"Elevate your web development game with Kadence AI. Supercharge your pattern and page library's potential with tailored content - get building pages in no time. Connect to your account to use Kadence AI with Kadence Blocks Pro",
			'kadence-blocks'
		),
		buttonText: __('Get Started with Kadence AI', 'kadence-blocks'),
	},
	actionCards: {
		title: <SectionTitle title={__('Streamlined site building', 'kadence-blocks')} />,
		cards: [
			{
				icon: (
					<Icon
						icon={
							<SVG
								xmlns="http://www.w3.org/2000/svg"
								width="25"
								height="25"
								viewBox="0 0 25 25"
								fill="none"
							>
								<g clipPath="url(#clip0_3059_18235)">
									<path
										d="M1.56776 21.2781C1.8869 21.2781 2.13423 21.2103 2.30975 21.0747C2.48526 20.939 2.62887 20.7076 2.74057 20.3806L4.28438 16.144H11.3452L12.889 20.3806C13.0007 20.7076 13.1443 20.939 13.3198 21.0747C13.4953 21.2103 13.7387 21.2781 14.0499 21.2781C14.369 21.2781 14.6223 21.1904 14.8098 21.0148C14.9973 20.8393 15.091 20.6 15.091 20.2968C15.091 20.1133 15.0471 19.8979 14.9593 19.6506L9.34661 4.71518C9.203 4.34019 9.00753 4.06295 8.76019 3.88344C8.51287 3.70393 8.19773 3.61417 7.81477 3.61417C7.07279 3.61417 6.57016 3.97718 6.30687 4.7032L0.694142 19.6625C0.606381 19.8779 0.5625 20.0934 0.5625 20.3088C0.5625 20.612 0.652256 20.8493 0.831768 21.0208C1.01128 21.1924 1.25661 21.2781 1.56776 21.2781ZM4.89472 14.3131L7.8028 6.25897H7.86264L10.7707 14.3131H4.89472ZM16.6108 24.9162H23.5998C24.1583 24.9162 24.4375 24.6808 24.4375 24.2102C24.4375 23.7474 24.1583 23.5161 23.5998 23.5161H20.9191V1.38822H23.5998C24.1583 1.38822 24.4375 1.15286 24.4375 0.682145C24.4375 0.227382 24.1583 0 23.5998 0H16.6108C16.0604 0 15.7851 0.227382 15.7851 0.682145C15.7851 1.15286 16.0604 1.38822 16.6108 1.38822H19.3036V23.5161H16.6108C16.0604 23.5161 15.7851 23.7474 15.7851 24.2102C15.7851 24.6808 16.0604 24.9162 16.6108 24.9162Z"
										fill="#161A1E"
									/>
								</g>
								<defs>
									<clipPath id="clip0_3059_18235">
										<rect width="23.875" height="25" fill="white" transform="translate(0.5625)" />
									</clipPath>
								</defs>
							</SVG>
						}
					/>
				),
				heading: __('A content-rich design library that is uniquely yours', 'kadence-blocks'),
				content: __(
					'Jump-start your site-building process with unique content and gorgeous designs. Learn more about the AI-Powered Design Library.',
					'kadence-blocks'
				),
				link: 'https://www.kadencewp.com/wordpress-solutions/kadence-ai/',
				variant: 'blue',
			},
			{
				icon: (
					<Icon
						icon={
							<SVG
								xmlns="http://www.w3.org/2000/svg"
								width="25"
								height="25"
								viewBox="0 0 25 25"
								fill="none"
							>
								<g clipPath="url(#clip0_3059_18235)">
									<path
										d="M1.56776 21.2781C1.8869 21.2781 2.13423 21.2103 2.30975 21.0747C2.48526 20.939 2.62887 20.7076 2.74057 20.3806L4.28438 16.144H11.3452L12.889 20.3806C13.0007 20.7076 13.1443 20.939 13.3198 21.0747C13.4953 21.2103 13.7387 21.2781 14.0499 21.2781C14.369 21.2781 14.6223 21.1904 14.8098 21.0148C14.9973 20.8393 15.091 20.6 15.091 20.2968C15.091 20.1133 15.0471 19.8979 14.9593 19.6506L9.34661 4.71518C9.203 4.34019 9.00753 4.06295 8.76019 3.88344C8.51287 3.70393 8.19773 3.61417 7.81477 3.61417C7.07279 3.61417 6.57016 3.97718 6.30687 4.7032L0.694142 19.6625C0.606381 19.8779 0.5625 20.0934 0.5625 20.3088C0.5625 20.612 0.652256 20.8493 0.831768 21.0208C1.01128 21.1924 1.25661 21.2781 1.56776 21.2781ZM4.89472 14.3131L7.8028 6.25897H7.86264L10.7707 14.3131H4.89472ZM16.6108 24.9162H23.5998C24.1583 24.9162 24.4375 24.6808 24.4375 24.2102C24.4375 23.7474 24.1583 23.5161 23.5998 23.5161H20.9191V1.38822H23.5998C24.1583 1.38822 24.4375 1.15286 24.4375 0.682145C24.4375 0.227382 24.1583 0 23.5998 0H16.6108C16.0604 0 15.7851 0.227382 15.7851 0.682145C15.7851 1.15286 16.0604 1.38822 16.6108 1.38822H19.3036V23.5161H16.6108C16.0604 23.5161 15.7851 23.7474 15.7851 24.2102C15.7851 24.6808 16.0604 24.9162 16.6108 24.9162Z"
										fill="#161A1E"
									/>
								</g>
								<defs>
									<clipPath id="clip0_3059_18235">
										<rect width="23.875" height="25" fill="white" transform="translate(0.5625)" />
									</clipPath>
								</defs>
							</SVG>
						}
					/>
				),
				heading: __('Fine-Tuned Editing', 'kadence-blocks'),
				content: __(
					'Get your messaging on point with in-line AI-assisted editing. Learn More about the inline AI.',
					'kadence-blocks'
				),
				link: 'https://www.kadencewp.com/wordpress-solutions/kadence-ai/',
				variant: 'green',
			},
		],
	},
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
	knowledgeBase: {
		heading: __('Need Help Getting Started?', 'kadence-blocks'),
		articles: [
			{
				category: __('Kadence Blocks', 'kadence-blocks'),
				heading: __('Using the Design Library', 'kadence-blocks'),
				description: __(
					'Use fully designed patterns and pages on your site with your own customizer settings - now with AI.',
					'kadence-blocks'
				),
				link: 'https://www.kadencewp.com/help-center/docs/kadence-blocks/how-to-control-the-kadence-design-library/',
				linkTarget: '_blank',
			},
			{
				category: __('Kadence Blocks', 'kadence-blocks'),
				heading: __('Row Layout Block', 'kadence-blocks'),
				description: __(
					'Use the Row Layout block to improve the column functionality and create responsive post/page layouts.',
					'kadence-blocks'
				),
				link: 'https://www.kadencewp.com/help-center/docs/kadence-blocks/row-layout-block-2/',
				linkTarget: '_blank',
			},
			{
				category: __('Kadence Blocks', 'kadence-blocks'),
				heading: __('Advanced Text Block', 'kadence-blocks'),
				description: __(
					'Use the Advanced Text block to add text to your page/post with advanced customization - now with AI.',
					'kadence-blocks'
				),
				link: 'https://www.kadencewp.com/help-center/docs/kadence-blocks/advanced-heading-block/',
				linkTarget: '_blank',
			},
			{
				category: __('Kadence Blocks Pro', 'kadence-blocks'),
				heading: __('Kadence Blocks Pro Plugin', 'kadence-blocks'),
				description: __(
					'Install and activate the Kadence Blocks Pro plugin, and get an overview of the Pro features available.',
					'kadence-blocks'
				),
				link: 'https://www.kadencewp.com/help-center/docs/kadence-blocks/kadence-blocks-pro-plugin/',
				linkTarget: '_blank',
			},
			{
				category: __('Kadence Blocks Pro', 'kadence-blocks'),
				heading: __('Advanced Slider', 'kadence-blocks'),
				description: __(
					'Showcase products or highlight important visual content using the Advanced Slider block.',
					'kadence-blocks'
				),
				link: 'https://www.kadencewp.com/help-center/docs/kadence-blocks/advanced-slider/',
				linkTarget: '_blank',
			},
			{
				category: __('Support', 'kadence-blocks'),
				heading: __('Need more help?', 'kadence-blocks'),
				description: __(
					"Didn't find what you were looking for? Find more articles in our knowledge base.",
					'kadence-blocks'
				),
				link: 'https://www.kadencewp.com/help-center/',
				linkTarget: '_blank',
			},
		],
	},
};
