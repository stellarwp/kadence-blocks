/**
 * Template: Conditional &#8211; women
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
					uniqueID: '8_141029-22',
					label: 'Shop',
					url: 'Shop',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '8_0eb4f0-f9', label: 'Sale &amp; Clearance', url: 'Sale%20&%20Clearance', kind: 'custom' },
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
