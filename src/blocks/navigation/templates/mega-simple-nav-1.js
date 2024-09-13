/**
 * Template: Mega Menu 4 sub mega menu
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_navigation_collapseSubMenus: '1',
	_kad_navigation_collapseSubMenusTablet: '1',
	_kad_navigation_collapseSubMenusMobile: '1',
	_kad_navigation_orientation: 'vertical',
	_kad_navigation_spacing: ['1', '', '1', ''],
	_kad_navigation_dropdownDividerTablet: [
		{ top: ['', '', ''], right: ['', '', ''], bottom: ['', '', ''], left: ['', '', ''], unit: '' },
	],
	_kad_navigation_dropdownDividerMobile: [
		{ top: ['', '', ''], right: ['', '', ''], bottom: ['', '', ''], left: ['', '', ''], unit: '' },
	],
	_kad_navigation_linkColor: 'palette4',
	_kad_navigation_linkColorHover: 'palette1',
	_kad_navigation_linkColorActive: 'palette1',
	_kad_navigation_descriptionColor: 'palette6',
	_kad_navigation_typography: [
		{
			size: ['sm', '', ''],
			sizeType: 'px',
			lineHeight: ['', '', ''],
			lineType: '',
			letterSpacing: ['', '', ''],
			letterType: 'px',
			textTransform: '',
			family: 'var( --global-body-font-family, inherit )',
			google: false,
			style: 'normal',
			weight: '400',
			variant: '',
			subset: '',
			loadGoogle: true,
		},
	],
	_kad_navigation_dropdownTypography: [
		{
			size: ['', '', ''],
			sizeType: 'px',
			lineHeight: ['', '', ''],
			lineType: '',
			letterSpacing: ['', '', ''],
			letterType: 'px',
			textTransform: '',
			family: '',
			google: false,
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
		},
	],
	_kad_navigation_dropdownBorderTablet: [
		{
			top: ['', 'solid', ''],
			right: ['', 'solid', ''],
			bottom: ['', 'solid', ''],
			left: ['', 'solid', ''],
			unit: '',
		},
	],
	_kad_navigation_dropdownBorderMobile: [
		{
			top: ['', 'solid', ''],
			right: ['', 'solid', ''],
			bottom: ['', 'solid', ''],
			left: ['', 'solid', ''],
			unit: '',
		},
	],
};

function innerBlocks() {
	return [
		createBlock('kadence/navigation', {}, [
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '376_03ert41d-5b',
					label: 'Short Title',
					url: '#',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '376_032341d-5b',
					label: 'Short Title',
					url: '#',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '376_4442342-d5',
					label: 'Short Title',
					url: '#',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '376_6323e99-fb',
					label: 'Short Title',
					url: '#',
					kind: 'custom',
				},
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
