/**
 * Template: Mega Menu 4 (Pro)
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

const postMeta = {
	_kad_navigation_parentActive: '1',
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
	_kad_navigation_spacing: ['', '3', '', '3'],
	_kad_navigation_linkColor: 'palette6',
	_kad_navigation_linkColorHover: 'palette1',
	_kad_navigation_linkColorActive: 'palette1',
	_kad_navigation_typography: [
		{
			size: ['', '', ''],
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
		createBlock(
			'kadence/rowlayout',
			{
				uniqueID: '376_6aa4e4-be',
				columns: 1,
				colLayout: 'equal',
				maxWidth: 1150,
				padding: ['', '', '', ''],
				templateLock: false,
				kbVersion: 2,
			},
			[
				createBlock(
					'kadence/column',
					{ borderWidth: ['', '', '', ''], uniqueID: '376_288d85-16', kbVersion: 2 },
					[
						createBlock(
							'kadence/rowlayout',
							{ uniqueID: '376_c6ffcd-d9', columns: 3, colLayout: 'equal', kbVersion: 2 },
							[
								createBlock(
									'kadence/column',
									{
										borderWidth: ['', '', '', ''],
										uniqueID: '376_4e3485-59',
										kbVersion: 2,
									},
									[
										createBlock(
											'kadence/advancedheading',
											{
												uniqueID: '376_791779-97',
												color: 'palette6',
												typography: 'var( --global-heading-font-family, inherit )',
												fontWeight: '600',
												markBorder: '',
												markBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												tabletMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												mobileMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												textTransform: 'capitalize',
												colorClass: 'theme-palette6',
												htmlTag: 'div',
												content: __('Design', 'kadence-blocks'),
											},
											[]
										),
										createBlock(
											'kadence/navigation',
											{ uniqueID: '376_b3fe86-9e', templateKey: 'mega-7-nav-1', makePost: true },
											[]
										),
									]
								),
								createBlock(
									'kadence/column',
									{
										id: 2,
										borderWidth: ['', '', '', ''],
										uniqueID: '376_9a7926-1b',
										kbVersion: 2,
									},
									[
										createBlock(
											'kadence/advancedheading',
											{
												uniqueID: '376_341e21-0d',
												color: 'palette6',
												typography: 'var( --global-heading-font-family, inherit )',
												fontWeight: '600',
												markBorder: '',
												markBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												tabletMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												mobileMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												textTransform: 'capitalize',
												colorClass: 'theme-palette6',
												htmlTag: 'div',
												content: __('Development', 'kadence-blocks'),
											},
											[]
										),
										createBlock(
											'kadence/navigation',
											{ uniqueID: '376_e82bf6-37', templateKey: 'mega-7-nav-2', makePost: true },
											[]
										),
									]
								),
								createBlock(
									'kadence/column',
									{
										id: 3,
										borderWidth: ['', '', '', ''],
										uniqueID: '376_d8fdc6-ad',
										kbVersion: 2,
									},
									[
										createBlock(
											'kadence/advancedheading',
											{
												uniqueID: '376_e89076-da',
												color: 'palette6',
												typography: 'var( --global-heading-font-family, inherit )',
												fontWeight: '600',
												markBorder: '',
												markBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												tabletMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												mobileMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												textTransform: 'capitalize',
												colorClass: 'theme-palette6',
												htmlTag: 'div',
												content: __('SEO', 'kadence-blocks'),
											},
											[]
										),
										createBlock(
											'kadence/navigation',
											{ uniqueID: '376_0984bc-2f', templateKey: 'mega-7-nav-3', makePost: true },
											[]
										),
									]
								),
							]
						),
						createBlock(
							'kadence/rowlayout',
							{
								uniqueID: '376_60f53b-5c',
								columns: 3,
								colLayout: 'equal',
								borderStyle: [
									{
										top: ['palette6', '', 1],
										right: ['', '', ''],
										bottom: ['', '', ''],
										left: ['', '', ''],
										unit: 'px',
									},
								],
								kbVersion: 2,
							},
							[
								createBlock(
									'kadence/column',
									{
										borderWidth: ['', '', '', ''],
										uniqueID: '376_77cba9-4f',
										kbVersion: 2,
									},
									[
										createBlock(
											'kadence/advancedheading',
											{
												uniqueID: '376_ee8fd3-29',
												color: 'palette4',
												typography: 'var( --global-heading-font-family, inherit )',
												fontWeight: '600',
												markBorder: '',
												markBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												tabletMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												mobileMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												textTransform: 'capitalize',
												colorClass: 'theme-palette4',
												htmlTag: 'div',
												content: __('Type A Short Headline', 'kadence-blocks'),
											},
											[]
										),
										createBlock(
											'kadence/advancedheading',
											{
												uniqueID: '376_d2737b-cd',
												color: 'palette6',
												typography: 'var( --global-body-font-family, inherit )',
												fontWeight: 'inherit',
												markBorder: '',
												markBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												tabletMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												mobileMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												colorClass: 'theme-palette6',
												htmlTag: 'p',
												fontSize: ['sm', '', ''],
												content: __(
													'Briefly and concisely explain what you do for your audience.',
													'kadence-blocks'
												),
											},
											[]
										),
									]
								),
								createBlock(
									'kadence/column',
									{
										id: 2,
										borderWidth: ['', '', '', ''],
										uniqueID: '376_e57e9b-7b',
										kbVersion: 2,
									},
									[
										createBlock(
											'kadence/advancedheading',
											{
												uniqueID: '376_98f682-bc',
												color: 'palette4',
												typography: 'var( --global-heading-font-family, inherit )',
												fontWeight: '600',
												markBorder: '',
												markBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												tabletMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												mobileMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												textTransform: 'capitalize',
												colorClass: 'theme-palette4',
												htmlTag: 'div',
												content: __('Type A Short Headline', 'kadence-blocks'),
											},
											[]
										),
										createBlock(
											'kadence/advancedheading',
											{
												uniqueID: '376_98f682-bc',
												color: 'palette6',
												typography: 'var( --global-body-font-family, inherit )',
												fontWeight: 'inherit',
												markBorder: '',
												markBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												tabletMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												mobileMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												colorClass: 'theme-palette6',
												htmlTag: 'p',
												fontSize: ['sm', '', ''],
												content: __(
													'Briefly and concisely explain what you do for your audience.',
													'kadence-blocks'
												),
											},
											[]
										),
									]
								),
								createBlock(
									'kadence/column',
									{
										id: 3,
										borderWidth: ['', '', '', ''],
										uniqueID: '376_c8658f-19',
										kbVersion: 2,
									},
									[
										createBlock(
											'kadence/advancedheading',
											{
												uniqueID: '376_4b7431-19',
												color: 'palette4',
												typography: 'var( --global-heading-font-family, inherit )',
												fontWeight: '600',
												markBorder: '',
												markBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												tabletMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												mobileMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												textTransform: 'capitalize',
												colorClass: 'theme-palette4',
												htmlTag: 'div',
												content: __('Type A Short Headline', 'kadence-blocks'),
											},
											[]
										),
										createBlock(
											'kadence/advancedheading',
											{
												uniqueID: '376_4b7431-19',
												color: 'palette6',
												typography: 'var( --global-body-font-family, inherit )',
												fontWeight: 'inherit',
												markBorder: '',
												markBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												tabletMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												mobileMarkBorderStyles: [
													{
														top: [null, '', ''],
														right: [null, '', ''],
														bottom: [null, '', ''],
														left: [null, '', ''],
														unit: 'px',
													},
												],
												colorClass: 'theme-palette6',
												htmlTag: 'p',
												fontSize: ['sm', '', ''],
												content: __(
													'Briefly and concisely explain what you do for your audience.',
													'kadence-blocks'
												),
											},
											[]
										),
									]
								),
							]
						),
					]
				),
			]
		),
	];
}

export { postMeta, innerBlocks };
