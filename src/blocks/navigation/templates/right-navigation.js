/**
 * Template: Right Navigation
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
					uniqueID: '6_21fadf-51',
					label: 'Contact',
					url: 'Contact',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '6_2bbe96-69',
					label: 'FAQ',
					url: 'FAQ',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '6_2eace3-93', label: 'Blog', url: 'Blog', kind: 'custom' },
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
