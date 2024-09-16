/**
 * Template: Simple Menu 3
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {};

function innerBlocks() {
	return [
		createBlock(
			'kadence/rowlayout',
			{
				uniqueID: '252_56a4rc-f8',
				columns: 3,
				colLayout: 'equal',
				templateLock: false,
				kbVersion: 2,
				inheritMaxWidth: true,
				padding: ['sm', 'sm', 'sm', 'sm'],
			},
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
							'kadence/navigation',
							{ uniqueID: '376_b3fe86-9e', templateKey: 'mega-simple-nav-1', makePost: true },
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
							'kadence/navigation',
							{ uniqueID: '376_e82bf6-37', templateKey: 'mega-simple-nav-2', makePost: true },
							[]
						),
					]
				),
				createBlock(
					'kadence/column',
					{
						id: 2,
						borderWidth: ['', '', '', ''],
						uniqueID: '376_9ars26-1b',
						kbVersion: 2,
					},
					[
						createBlock(
							'kadence/navigation',
							{ uniqueID: '376_esebf6-37', templateKey: 'mega-simple-nav-3', makePost: true },
							[]
						),
					]
				),
			]
		),
	];
}

export { postMeta, innerBlocks };
