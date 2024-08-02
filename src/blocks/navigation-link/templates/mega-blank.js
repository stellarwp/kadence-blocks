/**
 * Template: Mega Menu 1
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {};

function innerBlocks() {
	return [
		createBlock(
			'kadence/rowlayout',
			{
				uniqueID: '252_56a3cc-f8',
				columns: 3,
				colLayout: 'equal',
			},
			[]
		),
	];
}

export { postMeta, innerBlocks };
