/**
 * Template: Horizontal helful link menu
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_navigation_stretch: '1',
	_kad_navigation_collapseSubMenus: '1',
	_kad_navigation_collapseSubMenusTablet: '1',
	_kad_navigation_collapseSubMenusMobile: '1',
	_kad_navigation_margin: ['xs', '', 'sm', ''],
	_kad_navigation_spacing: ['', '2', '', '2'],
	_kad_navigation_linkColor: 'palette5',
	_kad_navigation_divider: [
		{ top: ['', '', ''], right: ['', '', ''], bottom: ['palette7', '', 2], left: ['', '', ''], unit: 'px' },
	],
	_kad_navigation_dividerTablet: [
		{ top: ['', '', ''], right: ['', '', ''], bottom: ['', '', ''], left: ['', '', ''], unit: '' },
	],
	_kad_navigation_dividerMobile: [
		{ top: ['', '', ''], right: ['', '', ''], bottom: ['', '', ''], left: ['', '', ''], unit: '' },
	],
	_kad_navigation_typography: [
		{
			size: [12, '', ''],
			sizeType: 'px',
			lineHeight: ['', '', ''],
			lineType: '',
			letterSpacing: ['', '', ''],
			letterType: 'px',
			textTransform: 'capitalize',
			family: '',
			google: false,
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
		},
	],
};

function innerBlocks() {
	return [
		createBlock('kadence/navigation', {}, [
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '372_6fa62d-de', label: 'View Demo', url: 'View%20Demo', kind: 'custom' },
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '372_6edcc1-8e', label: 'Contact Sales', url: 'Contact%20Sales', kind: 'custom' },
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '372_c4f166-e5', label: 'Documentation', url: 'Documentaion', kind: 'custom' },
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
