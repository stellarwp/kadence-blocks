/**
 * Template: 2 links &#8211; white
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {};

function innerBlocks() {
	return [
		createBlock('kadence/navigation', {}, [
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '8_88559d-92',
					label: 'Products',
					url: 'Products',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '8_99fb3a-1f', label: 'Solutions', url: 'Solutions', kind: 'custom' },
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
