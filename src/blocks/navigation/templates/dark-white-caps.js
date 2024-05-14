/**
 * Template: MR &#8211; dark &#8211; caps
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
					uniqueID: '8_70c563-f4',
					label: 'About',
					url: 'About',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '8_c84404-ab',
					label: 'Services',
					url: 'Services',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '8_136530-84',
					label: 'Reviews',
					url: 'Reviews',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '8_8825f0-86', label: 'Contact', url: 'Contact', kind: 'custom' },
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
