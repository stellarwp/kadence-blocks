/**
 * Template: Off Canvas &#8211; Desktop light text on dark bg
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
					uniqueID: '10_d9dd79-4f',
					label: 'About',
					url: 'About',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '10_c30f17-d9',
					label: 'Services',
					url: 'Services',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '10_6f6e6b-a3',
					label: 'Reviews',
					url: 'Reviews',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '10_4e9458-b9',
					label: 'Contact',
					url: 'Contact',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '10_eb9470-1f', label: 'FAQ', url: 'FAQ', kind: 'custom' },
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
