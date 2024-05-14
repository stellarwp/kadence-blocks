/**
 * Template: Basic-No Sub
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
					uniqueID: '8_ca8919-32',
					label: 'About',
					url: 'About',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '8_fb6836-a5',
					label: 'Services',
					url: 'Services',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '8_62c529-c7',
					label: 'Gallery',
					url: 'Gallery',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '8_1bd664-f3',
					label: 'Contact',
					url: 'Contact',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '8_b01b7a-19', label: 'Reviews', url: 'Reviews', kind: 'custom' },
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
