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
					uniqueID: '376_790057-64',
					label: 'Short Title',
					description: 'Use this space to add a short description.',
					url: '#',
					kind: 'custom',
					linkColorDropdown: 'palette4',
					linkColor: 'palette4',
					linkColorHover: 'palette1',
					linkColorActive: 'palette1',
					highlightLabel: 'New',
					iconSide: 'left',
					highlightIcon: [
						{
							icon: 'ic_star',
							size: 10,
							sizeTablet: '',
							sizeMobile: '',
							width: 2,
							widthTablet: 2,
							widthMobile: 2,
							hoverAnimation: 'none',
							title: '',
							flipIcon: '',
						},
					],
					highlightSpacing: [
						{
							border: '',
							tabletBorder: '',
							mobileBorder: '',
							borderRadius: [5, 5, 5, 5],
							tabletBorderRadius: [5, 5, 5, 5],
							mobileBorderRadius: [5, 5, 5, 5],
							borderWidth: [0, 0, 0, 0],
							gap: [3, '', ''],
							padding: [5, 5, 5, 5],
							tabletPadding: [5, 5, 5, 5],
							mobilePadding: [5, 5, 5, 5],
							margin: ['', '', '', ''],
							tabletMargin: ['', '', '', ''],
							mobileMargin: ['', '', '', ''],
						},
					],
					descriptionColor: 'palette6',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '376_03ad1d-5d',
					label: 'Short Title',
					description: 'Use this space to add a short description.',
					url: '#',
					kind: 'custom',
					linkColorDropdown: 'palette4',
					linkColor: 'palette4',
					linkColorHover: 'palette1',
					linkColorActive: 'palette1',
					descriptionColor: 'palette6',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '376_44a642-d7',
					label: 'Short Title',
					description: 'Use this space to add a short description.',
					url: '#',
					kind: 'custom',
					linkColorDropdown: 'palette4',
					linkColor: 'palette4',
					linkColorHover: 'palette1',
					linkColorActive: 'palette1',
					descriptionColor: 'palette6',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '376_619e99-fd',
					label: 'Short Title',
					description: 'Use this space to add a short description.',
					url: '#',
					kind: 'custom',
					linkColorDropdown: 'palette4',
					linkColor: 'palette4',
					linkColorHover: 'palette1',
					linkColorActive: 'palette1',
					descriptionColor: 'palette6',
				},
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
