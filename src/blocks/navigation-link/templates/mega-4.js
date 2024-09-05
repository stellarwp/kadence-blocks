/**
 * Template: Mega Menu 2 (Pro)
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

const postMeta = {};

function innerBlocks() {
	return [
		createBlock(
			'kadence/rowlayout',
			{
				uniqueID: '372_bebd31-3e',
				columns: 1,
				collapseGutter: 'none',
				customRowGutter: [0, '', ''],
				colLayout: 'equal',
				inheritMaxWidth: true,
				padding: ['', '', '', ''],
				templateLock: false,
				kbVersion: 2,
			},
			[
				createBlock(
					'kadence/column',
					{
						borderWidth: ['', '', '', ''],
						uniqueID: '372_53b50a-51',
						textAlign: [null, '', ''],
						kbVersion: 2,
					},
					[
						createBlock(
							'kadence/rowlayout',
							{
								uniqueID: '372_574ce0-88',
								columns: 3,
								columnGutter: 'none',
								customGutter: [0, '', ''],
								colLayout: 'equal',
								kbVersion: 2,
							},
							[
								createBlock(
									'kadence/column',
									{
										borderWidth: ['', '', '', ''],
										uniqueID: '372_bd8024-99',
										padding: ['md', 'md', 'md', 'md'],
										kbVersion: 2,
									},
									[
										createBlock(
											'kadence/advancedheading',
											{
												uniqueID: '372_d0a5ca-4c',
												color: 'palette5',
												fontWeight: '500',
												margin: ['', '', 'md', ''],
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
												colorClass: 'theme-palette5',
												htmlTag: 'div',
												fontSize: [16, '', ''],
												fontHeight: [18, '', ''],
												fontHeightType: 'px',
												content: __('Ecosystem', 'kadence-blocks'),
											},
											[]
										),
										createBlock(
											'kadence/navigation',
											{ uniqueID: '372_a6b73f-9a', templateKey: 'mega-4-nav-1', makePost: true },
											[]
										),
									]
								),
								createBlock(
									'kadence/column',
									{
										id: 2,
										borderWidth: ['', '', '', ''],
										uniqueID: '372_03407d-4c',
										padding: ['md', 'md', 'md', 'md'],
										kbVersion: 2,
									},
									[
										createBlock(
											'kadence/advancedheading',
											{
												uniqueID: '372_f3afba-97',
												color: 'palette5',
												fontWeight: '500',
												margin: ['', '', 'md', ''],
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
												colorClass: 'theme-palette5',
												htmlTag: 'div',
												fontSize: [16, '', ''],
												fontHeight: [18, '', ''],
												fontHeightType: 'px',
												content: __('Main Features', 'kadence-blocks'),
											},
											[]
										),
										createBlock(
											'kadence/navigation',
											{ uniqueID: '372_df7b1f-d2', templateKey: 'mega-4-nav-2', makePost: true },
											[]
										),
									]
								),
								createBlock(
									'kadence/column',
									{
										id: 3,
										borderWidth: ['', '', '', ''],
										uniqueID: '372_8735ac-21',
										verticalAlignment: '',
										padding: ['md', 'md', 'md', 'md'],
										kbVersion: 2,
									},
									[
										createBlock(
											'kadence/advancedheading',
											{
												uniqueID: '372_f3afba-97',
												color: 'palette5',
												fontWeight: '500',
												margin: ['', '', 'md', ''],
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
												colorClass: 'theme-palette5',
												htmlTag: 'div',
												fontSize: [16, '', ''],
												fontHeight: [18, '', ''],
												fontHeightType: 'px',
												content: __('Company', 'kadence-blocks'),
											},
											[]
										),
										createBlock(
											'kadence/navigation',
											{ uniqueID: '372_22cb6a-fa', templateKey: 'mega-4-nav-3', makePost: true },
											[]
										),
									]
								),
							]
						),
						createBlock(
							'kadence/rowlayout',
							{ uniqueID: '372_328d2c-6c', columns: 1, colLayout: 'equal', kbVersion: 2 },
							[
								createBlock(
									'kadence/column',
									{
										borderWidth: ['', '', '', ''],
										uniqueID: '372_c34df0-2c',
										direction: ['horizontal', '', ''],
										justifyContent: [null, '', ''],
										gutter: [16, '', ''],
										gutterVariable: ['sm', '', ''],
										flexBasis: [0, '', ''],
										borderStyle: [
											{
												top: ['palette7', '', 2],
												right: ['palette7', '', 0],
												bottom: ['palette7', '', 0],
												left: ['palette7', '', 0],
												unit: 'px',
											},
										],
										kbVersion: 2,
									},
									[
										createBlock(
											'kadence/navigation',
											{ uniqueID: '372_632e41-d5', templateKey: 'mega-4-nav-4', makePost: true },
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
