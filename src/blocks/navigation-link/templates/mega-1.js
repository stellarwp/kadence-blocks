/**
 * Template: Mega Menu 1
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
				uniqueID: '252_56a3cc-f8',
				columns: 3,
				tabletLayout: 'equal',
				columnGutter: 'none',
				customGutter: [0, '', ''],
				colLayout: 'equal',
				maxWidth: 900,
				align: 'full',
				columnsInnerHeight: true,
				borderRadius: [8, 8, 8, 8],
				padding: ['', '', '', ''],
				templateLock: false,
				kbVersion: 2,
			},
			[
				createBlock(
					'kadence/column',
					{
						borderWidth: ['', '', '', ''],
						uniqueID: '252_bb0e2b-eb',
						padding: ['xs', 'xs', 'xs', 'xs'],
						borderStyle: [
							{
								top: ['', '', ''],
								right: ['palette6', '', 1],
								bottom: ['', '', ''],
								left: ['', '', ''],
								unit: 'px',
							},
						],
						mobileBorderStyle: [
							{
								top: ['', '', 0],
								right: ['', '', 0],
								bottom: ['palette7', '', 2],
								left: ['', '', 0],
								unit: '',
							},
						],
						kbVersion: 2,
					},
					[
						createBlock(
							'kadence/navigation',
							{
								uniqueID: '252_89e8a2-53',
								templateKey: 'short-vertical',
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
						uniqueID: '252_d54b45-4f',
						padding: ['xs', 'xs', 'xs', 'xs'],
						borderStyle: [
							{
								top: ['', '', ''],
								right: ['palette6', '', 1],
								bottom: ['', '', ''],
								left: ['', '', ''],
								unit: 'px',
							},
						],
						mobileBorderStyle: [
							{
								top: ['', '', 0],
								right: ['', '', 0],
								bottom: ['palette7', '', 2],
								left: ['', '', 0],
								unit: '',
							},
						],
						kbVersion: 2,
					},
					[
						createBlock(
							'kadence/navigation',
							{ uniqueID: '252_d000c0-58', templateKey: 'short-vertical' },
							[]
						),
					]
				),
				createBlock(
					'kadence/column',
					{
						id: 3,
						borderWidth: ['', '', '', ''],
						uniqueID: '252_282697-de',
						justifyContent: [null, '', ''],
						verticalAlignment: 'bottom',
						padding: ['md', 'md', 'md', 'md'],
						kbVersion: 2,
					},
					[
						createBlock(
							'kadence/advancedheading',
							{
								uniqueID: '252_d4466b-25',
								margin: ['', '', 'sm', ''],
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
								htmlTag: 'div',
								fontSize: ['md', '', ''],
								fontHeight: [1.3, '', ''],
								content: __(
									'Briefly and concisely explain what you do for your audience.',
									'kadence-blocks'
								),
							},
							[]
						),
						createBlock(
							'kadence/advancedbtn',
							{
								hAlign: 'left',
								uniqueID: '252_7cee7a-e4',
								gap: ['sm', '', ''],
								vAlign: 'bottom',
								orientation: ['column', '', ''],
							},
							[
								createBlock(
									'kadence/singlebtn',
									{
										uniqueID: '252_2c1ecd-8d',
										text: 'Get Started',
										widthType: 'full',
										borderRadius: [10, 10, 10, 10],
										typography: [
											{
												size: ['', '', ''],
												sizeType: 'px',
												lineHeight: ['', '', ''],
												lineType: '',
												letterSpacing: [1.3, '', ''],
												letterType: 'px',
												textTransform: 'uppercase',
												family: '',
												google: '',
												style: '',
												weight: '500',
												variant: '',
												subset: '',
												loadGoogle: true,
											},
										],
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/advancedheading',
							{
								uniqueID: '252_9938c0-67',
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
								htmlTag: 'span',
								icon: 'fe_arrowRight',
								iconColor: 'palette1',
								iconColorHover: 'palette2',
								iconSide: 'right',
								content: '<a href="#">' + __('Ask a question', 'kadence-blocks') + '</a>',
							},
							[]
						),
					]
				),
			]
		),
	];
}

export { postMeta, innerBlocks };
