/**
 * Template: Mega Menu 1 Pro
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
				uniqueID: '320_c84714-9c',
				columnGutter: 'none',
				customGutter: [0, '', ''],
				colLayout: 'left-golden',
				padding: ['', '', '', ''],
				borderStyle: [
					{
						top: ['palette6', '', 5],
						right: ['', '', ''],
						bottom: ['', '', ''],
						left: ['', '', ''],
						unit: 'px',
					},
				],
				inheritMaxWidth: true,
				align: '',
				padding: ['0', '0', '0', '0'],
				templateLock: false,
				kbVersion: 2,
			},
			[
				createBlock(
					'kadence/column',
					{
						borderWidth: ['', '', '', ''],
						uniqueID: '320_e96bab-e5',
						padding: ['sm', 'sm', 'sm', 'sm'],
						borderStyle: [
							{
								top: ['palette7', '', ''],
								right: ['palette7', '', 3],
								bottom: ['palette7', '', ''],
								left: ['palette7', '', ''],
								unit: 'px',
							},
						],
						kbVersion: 2,
					},
					[
						createBlock(
							'kadence/advancedheading',
							{
								uniqueID: '320_10512c-58',
								color: 'palette6',
								letterSpacing: 0.5,
								tabletLetterSpacing: '',
								mobileLetterSpacing: '',
								fontWeight: '600',
								margin: ['', '', 'xs', ''],
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
								textTransform: 'uppercase',
								colorClass: 'theme-palette6',
								htmlTag: 'div',
								fontSize: ['sm', '', ''],
								content: __('Premium Features', 'kadence-blocks'),
							},
							[]
						),
						createBlock(
							'kadence/navigation',
							{
								uniqueID: '320_0b009a-4e',
								templateKey: 'mega-2-nav-1',
								makePost: true,
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
						uniqueID: '320_5f1481-29',
						padding: ['sm', 'sm', 'sm', 'sm'],
						kbVersion: 2,
					},
					[
						createBlock(
							'kadence/advancedheading',
							{
								uniqueID: '320_29bfa2-26',
								color: 'palette6',
								letterSpacing: 0.5,
								tabletLetterSpacing: '',
								mobileLetterSpacing: '',
								fontWeight: '600',
								margin: ['', '', 'xs', ''],
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
								textTransform: 'uppercase',
								colorClass: 'theme-palette6',
								htmlTag: 'div',
								fontSize: ['sm', '', ''],
								content: __('Others', 'kadence-blocks'),
							},
							[]
						),
						createBlock(
							'kadence/navigation',
							{ uniqueID: '320_54dc7c-74', templateKey: 'mega-2-nav-2', makePost: true },
							[]
						),
						createBlock(
							'kadence/advancedheading',
							{
								uniqueID: '320_4806f6-d6',
								color: 'palette1',
								margin: ['xs', '', 'xs', ''],
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
								colorClass: 'theme-palette1',
								htmlTag: 'div',
								icon: 'fe_arrowRight',
								iconSide: 'right',
								content: '<a href="#">' + __('Learn More', 'kadence-blocks') + '</a>',
							},
							[]
						),
						createBlock(
							'kadence/image',
							{
								sizeSlug: 'large',
								useRatio: true,
								linkDestination: 'none',
								uniqueID: '320_36d6df-af',
								borderRadius: [7, 7, 7, 7],
								globalAlt: true,
								url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/gray.png',
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
