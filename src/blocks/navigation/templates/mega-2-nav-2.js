/**
 * Template: other Features
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_navigation_collapseSubMenus: '1',
	_kad_navigation_collapseSubMenusTablet: '1',
	_kad_navigation_collapseSubMenusMobile: '1',
	_kad_navigation_dropdownShadow: [
		{
			enable: false,
			color: '#000000',
			opacity: 0.20000000000000001,
			spread: 0,
			blur: 2,
			hOffset: 1,
			vOffset: 1,
			inset: false,
		},
	],
	_kad_navigation_orientation: 'vertical',
	_kad_navigation_linkColor: 'palette3',
	_kad_navigation_linkColorHover: 'palette3',
	_kad_navigation_linkColorActive: 'palette3',
	_kad_navigation_background: 'palette9',
	_kad_navigation_backgroundHover: 'palette7',
	_kad_navigation_backgroundActive: 'palette7',
	_kad_navigation_typography: [
		{
			size: ['sm', '', ''],
			sizetype: 'px',
			lineHeight: ['', '', ''],
			lineType: '',
			letterSpacing: [0.5, '', ''],
			letterType: 'px',
			textTransform: '',
			family: '',
			google: false,
			style: '',
			weight: 'bold',
			variant: '',
			subset: '',
			loadgoogle: true,
		},
	],
};

function innerBlocks() {
	return [
		createBlock('kadence/navigation', {}, [
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '320_31fdc9-c3',
					label: 'Add a short title',
					url: 'Add%20a%20short%20title',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '320_fe64a2-93',
					label: 'Add a short title',
					url: 'Add%20a%20short%20title',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '320_4c592b-41',
					label: 'Add a short title',
					url: 'Add%20a%20short%20title',
					kind: 'custom',
				},
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
