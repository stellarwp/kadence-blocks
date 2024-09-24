/**
 * Template: Mega Menu 1
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

const postMeta = {};

function innerBlocks(uniqueID) {
	return [
		createBlock(
			'kadence/rowlayout',
			{
				uniqueID: '321_c84714-3c',
				colLayout: 'right-golden',
				templateLock: false,
				kbVersion: 2,
				padding: ['sm', 'sm', 'sm', 'sm'],
			},
			[
				createBlock(
					'kadence/column',
					{
						uniqueID: '320_e96bab-e5',
						padding: ['sm', 'sm', 'sm', 'sm'],
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
								content: __('Sub Menu', 'kadence-blocks'),
							},
							[]
						),
						createBlock(
							'kadence/navigation',
							{
								uniqueID: '321_0b129a-4e',
								templateKey: 'mega-existing-sub-menu|' + uniqueID,
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
						uniqueID: '320_5f1481-29',
						padding: ['sm', 'sm', 'sm', 'sm'],
						kbVersion: 2,
					},
					[]
				),
			]
		),
	];
}

export { postMeta, innerBlocks };
